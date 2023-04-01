import cc.mallet.pipe.*;
import cc.mallet.topics.ParallelTopicModel;
import cc.mallet.types.FeatureSequence;
import cc.mallet.types.IDSorter;
import cc.mallet.types.Instance;
import cc.mallet.types.InstanceList;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.TreeSet;
import java.util.regex.Pattern;

public class TopicModelingReducer extends Reducer<Text, Text, Text, Text> {

    private static final HashMap<String, Integer> wordCounts = new HashMap<>();
    File stopWordsFile = null;

    private static ParallelTopicModel createAndTrainTopicModel(InstanceList instances, int numTopics) {
        ParallelTopicModel model = new ParallelTopicModel(numTopics, 50.0, 0.01);

        model.addInstances(instances);
        model.setNumThreads(4);
        // 1000 for more accurate results. 1 for faster results
        model.setNumIterations(1000);

        try {
            model.estimate();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return model;
    }

    private static String extractTopTopic(ParallelTopicModel model) {
        int numTopics = model.getNumTopics();
        StringBuilder sb = new StringBuilder();
        for (int topic = 0; topic < numTopics; topic++) {
            TreeSet<IDSorter> sortedWords = new TreeSet<>(model.getSortedWords().get(topic));
            Iterator<IDSorter> iterator = sortedWords.iterator();
            int rank = 0;
            while (iterator.hasNext() && rank < 10) {
                IDSorter idSorter = iterator.next();
                sb.append(model.getAlphabet().lookupObject(idSorter.getID())).append(" ");
                sb.append("(");
                sb.append(wordCounts.get(model.getAlphabet().lookupObject(idSorter.getID())));
                sb.append(")").append(" ");
                rank++;
            }
        }
        return sb.toString();
    }

    @Override
    protected void setup(Context context) throws IOException {
        URI[] cacheFiles = context.getCacheFiles();
        Path stopWordsPath = new Path(cacheFiles[0].getPath());
        stopWordsFile = new File(stopWordsPath.getName());
    }

    @Override
    protected void reduce(Text key, Iterable<Text> values, Context context) throws IOException, InterruptedException {
        StringBuilder aggregatedPros = new StringBuilder();
        StringBuilder aggregatedCons = new StringBuilder();

        for (Text value : values) {
            String[] prosCons = value.toString().split("\t");
            if (prosCons.length < 2) {
                System.err.println("Skipping value with incorrect format: " + value);
                continue;
            }
            aggregatedPros.append(prosCons[0]).append(" ");
            aggregatedCons.append(prosCons[1]).append(" ");
        }

        InstanceList prosInstances = createInstanceListFromText(aggregatedPros.toString());
        InstanceList consInstances = createInstanceListFromText(aggregatedCons.toString());

        ParallelTopicModel prosModel = createAndTrainTopicModel(prosInstances, 1);
        ParallelTopicModel consModel = createAndTrainTopicModel(consInstances, 1);

        String prosTopic = extractTopTopic(prosModel);
        String consTopic = extractTopTopic(consModel);

        String val = String.format("\nPros Topic: %s\nCons Topic: %s\n", prosTopic, consTopic);

        context.write(key, new Text(val));
    }

    private InstanceList createInstanceListFromText(String text) {
        ArrayList<Pipe> pipeList = new ArrayList<>();
        pipeList.add(new Input2CharSequence("UTF-8")); // added
        pipeList.add(new CharSequenceLowercase());
        pipeList.add(new CharSequence2TokenSequence(Pattern.compile("\\p{L}[\\p{L}\\p{P}]+\\p{L}")));
        pipeList.add(new TokenSequenceLowercase()); // added
        pipeList.add(new TokenSequenceRemoveStopwords(stopWordsFile, "UTF-8",
                false, false, false));
        pipeList.add(new TokenSequence2FeatureSequence());
        Pipe pipeline = new SerialPipes(pipeList);

        InstanceList instances = new InstanceList(pipeline);
        instances.addThruPipe(new Instance(text, null, null, null));

        // Tokenize the text and count the occurrences of each token
        for (Instance instance : instances) {
            FeatureSequence featureSequence = (FeatureSequence) instance.getData();
            for (int i = 0; i < featureSequence.size(); i++) {
                String word = (String) featureSequence.getAlphabet().lookupObject(
                        featureSequence.getIndexAtPosition(i));
                if (wordCounts.containsKey(word)) {
                    wordCounts.put(word, wordCounts.get(word) + 1);
                } else {
                    wordCounts.put(word, 1);
                }
            }
        }

        return instances;
    }
}