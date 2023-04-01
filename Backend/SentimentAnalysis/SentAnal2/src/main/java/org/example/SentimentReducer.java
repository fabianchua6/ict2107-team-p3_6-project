package org.example;

import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.IOException;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.IOException;

public class SentimentReducer extends Reducer<Text, LongWritable, Text, Text> {

    @Override
    protected void reduce(Text key, Iterable<LongWritable> values, Context context) throws IOException, InterruptedException {
        int[] sentimentCounts = new int[5]; // For sentiment ratings 0 to 4
        int totalCount = 0;
        int totalSentiment = 0;
        for (LongWritable value : values) {
            int sentimentClass = (int) value.get();
            totalSentiment += sentimentClass;
            totalCount++;
            sentimentCounts[sentimentClass]++;
        }
        float avgSentiment = ((float) totalSentiment) / totalCount;

        // Output the summary
        String divider = "----------------------------------------------------";
        String outputValue = "\n" + String.format("%-30s %10s\n", "Number of Reviews Analysed:", totalCount) +
                String.format("%-30s %10.2f\n", "Average sentiment per review:", avgSentiment) +
                "\n" + "Breakdown of Sentiments:" + "\n" +
                String.format("%-30s %10s\n", "Very Positive:", sentimentCounts[4]) +
                String.format("%-30s %10s\n", "Positive:", sentimentCounts[3]) +
                String.format("%-30s %10s\n", "Neutral:", sentimentCounts[2]) +
                String.format("%-30s %10s\n", "Negative:", sentimentCounts[1]) +
                String.format("%-30s %10s\n", "Very Negative:", sentimentCounts[0]) +
                divider;

        context.write(key, new Text(outputValue));
    }
}

