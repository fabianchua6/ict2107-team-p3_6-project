package org.example;

import org.apache.hadoop.filecache.DistributedCache;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.lib.input.FileSplit;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.util.HashSet;
import java.util.Set;

public class WordMapper extends Mapper<LongWritable, Text, Text, Text> {
    private final Set<String> positiveWords = new HashSet<>();
    private final Set<String> negativeWords = new HashSet<>();

    @Override
    protected void setup(Context context) throws IOException, InterruptedException {
        // Load positive and negative words from the distributed cache
        URI[] cacheFiles = DistributedCache.getCacheFiles(context.getConfiguration());
        FileSystem fs = FileSystem.get(context.getConfiguration());
        for (URI cacheFile : cacheFiles) {
            if (cacheFile.toString().contains("words.csv")) {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(fs.open(new Path(cacheFile))))) {
                    String line;
                    // Skip the header line
                    reader.readLine();
                    while ((line = reader.readLine()) != null) {
                        String[] words = line.split(",");
                        // Check length of each row is correct, index, negative word, positive word
                        if (words.length >= 3) {
                            //append accordingly
                            negativeWords.add(words[1].toLowerCase());
                            positiveWords.add(words[2].toLowerCase());
                        }
                    }
                }
            }
        }
    }

    @Override
    protected void map(LongWritable key, Text value, Mapper<LongWritable, Text, Text, Text>.Context context)
            throws IOException, InterruptedException {

        // Get the input file name
        String inputFileName = ((FileSplit) context.getInputSplit()).getPath().getName();

        //Split rows into parts
        String[] parts = value.toString().split(",", -1);

        //Extract pros and cons
        String pros = parts[5];
        String[] proWords = pros.split("\\s+");
        String cons = parts[6];
        String[] conWords = cons.split("\\s+");

        //Calculate sentiment using word mapping, pros to positive, cons to negative
        int sentimentScore = 0;
        for (String proWord : proWords) {
            if (positiveWords.contains(proWord)) {
                sentimentScore++;
            }
        }
        for (String conWord : conWords) {
            if (negativeWords.contains(conWord)) {
                sentimentScore--;
            }
        }
        context.write(new Text(inputFileName), new Text(" " + sentimentScore));
    }
}