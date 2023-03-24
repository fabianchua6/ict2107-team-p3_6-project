package org.example;

import org.apache.hadoop.filecache.DistributedCache;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.util.HashSet;
import java.util.Set;

public class SentimentMapper extends Mapper<LongWritable, Text, Text, Text> {
    private final Set<String> positiveWords = new HashSet<>();
    private final Set<String> negativeWords = new HashSet<>();

    @Override
    protected void setup(Context context) throws IOException {
        // Load positive and negative words from the distributed cache
        URI[] cacheFiles = DistributedCache.getCacheFiles(context.getConfiguration());
        FileSystem fs = FileSystem.get(context.getConfiguration());
        for (URI cacheFile : cacheFiles) {
            if (cacheFile.toString().contains("Positive_and_Negative_Word_List.csv")) {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(fs.open(new Path(cacheFile))))) {
                    String line;
                    // Skip the header line
                    reader.readLine();
                    while ((line = reader.readLine()) != null) {
                        String[] words = line.split(",");
                        if (words.length >= 3) {
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

        String[] parts = value.toString().split(",", -1);
        String concatenatedReview = parts[5];
        String[] words = concatenatedReview.split("\\s+");

        int sentimentScore = 0;
        for (String word : words) {
            if (positiveWords.contains(word)) {
                sentimentScore++;
            } else if (negativeWords.contains(word)) {
                sentimentScore--;
            }
        }
        context.write(new Text(parts[1]), new Text(parts[0] + "\t" + sentimentScore));
    }


}