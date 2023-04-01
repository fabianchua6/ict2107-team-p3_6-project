import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.lib.input.FileSplit;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.net.URI;
import java.util.Hashtable;

public class TopicModelingMapper extends Mapper<LongWritable, Text, Text, Text> {

    Hashtable<String, Integer> stopWordsHashTable = new Hashtable<>();

    public static String removeAllOccurrences(String sentence, String word) {
        // Create regex pattern for the word to be removed
        String pattern = "\\b" + word + "\\b\\s*";

        // Remove all occurrences of the word using replaceAll() method
        return sentence.replaceAll(pattern, "").trim();
    }

    @Override
    protected void setup(Context context) throws IOException {
        URI[] cacheFiles = context.getCacheFiles();
        Path stopWordsPath = new Path(cacheFiles[0].getPath());

        BufferedReader br = new BufferedReader(new FileReader(stopWordsPath.getName()));
        String line = "";
        while (true) {
            line = br.readLine();
            if (line == null) {
                break;
            }
            stopWordsHashTable.put(line, 1);
        }
    }

    @Override
    protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        // Read a CSV file line from the input value
        String line = value.toString();
        String[] fields = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", -1);
        if (fields.length < 7) {
            System.err.println("Skipping line with incorrect number of columns: " + line);
            return;
        }
        String pros = fields[5].trim();
        String cons = fields[6].trim();

        // Remove all occurrences of the stop words
        for (String stopWord : stopWordsHashTable.keySet()) {
            pros = removeAllOccurrences(pros, stopWord);
            cons = removeAllOccurrences(cons, stopWord);
        }

        // Get the file name
        String fileName = ((FileSplit) context.getInputSplit()).getPath().getName();

        // Write the file name and the pros and cons texts to the context
        context.write(new Text(fileName), new Text(pros + "\t" + cons));
    }
}
