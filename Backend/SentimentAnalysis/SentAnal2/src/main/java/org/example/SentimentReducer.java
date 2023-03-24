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

        for (LongWritable value : values) {
            int sentimentClass = (int) value.get();

            totalCount++;
            sentimentCounts[sentimentClass]++;
        }

        String outputValue = String.format("\nTotal Sentiments: %d\n" +
                        "Very negative: %d\n" +
                        "Negative: %d\n" +
                        "Neutral: %d\n" +
                        "Positive: %d\n" +
                        "Very positive: %d",
                totalCount,
                sentimentCounts[0],
                sentimentCounts[1],
                sentimentCounts[2],
                sentimentCounts[3],
                sentimentCounts[4]
        );

        context.write(key, new Text(outputValue));
    }
}

