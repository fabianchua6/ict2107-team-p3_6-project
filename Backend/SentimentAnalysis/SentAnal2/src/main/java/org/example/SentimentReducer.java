package org.example;

import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.IOException;

public class SentimentReducer extends Reducer<Text, Text, Text, Text> {

    @Override
    protected void reduce(Text key, Iterable<Text> values, Context context) throws IOException, InterruptedException {
        int positiveCount = 0;
        int negativeCount = 0;

        for (Text value : values) {
            String[] parts = value.toString().split("\t");
            if (parts[0].equals("positive")) {
                positiveCount += Integer.parseInt(parts[1]);
            } else if (parts[0].equals("negative")) {
                negativeCount += Integer.parseInt(parts[1]);
            }
        }

        int sentimentScore = positiveCount - negativeCount;
        String outputValue = String.format("Positive: %d, Negative: %d, Sentiment Score: %d", positiveCount, negativeCount, sentimentScore);
        context.write(key, new Text(outputValue));
    }
}



