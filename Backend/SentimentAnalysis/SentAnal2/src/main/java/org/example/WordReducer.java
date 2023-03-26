package org.example;

import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.IOException;

public class WordReducer extends Reducer<Text, Text, Text, Text> {

    @Override
    protected void reduce(Text key, Iterable<Text> values, Context context) throws IOException, InterruptedException {
        //Init values
        int totalSentiment = 0;
        int numReviews = 0;
        int numVeryPositive = 0;
        int numPositive = 0;
        int numNeutral = 0;
        int numNegative = 0;
        int numVeryNegative = 0;

        //Calculate all values accordingly
        for (Text value : values) {
            String[] parts = value.toString().split(" ");
            int sentiment = Integer.parseInt(parts[1]);
            totalSentiment += sentiment;
            numReviews++;
            if (sentiment > 10) {
                numVeryPositive++;
            } else if (sentiment > 0) {
                numPositive++;
            } else if (sentiment == 0) {
                numNeutral++;
            } else if (sentiment > -10) {
                numNegative++;
            } else {
                numVeryNegative++;
            }
        }
        float avgSentiment = ((float) totalSentiment) / numReviews;

        // Output the summary
        String divider = "----------------------------------------------------";
        String summary = "\n" + String.format("%-30s %10s\n", "Number of Reviews Analysed:", numReviews) +
                String.format("%-30s %10.2f\n", "Average sentiment per review:", avgSentiment) +
                "\n" + "Breakdown of Sentiments:" + "\n" +
                String.format("%-30s %10s\n", "Very Positive:", numVeryPositive) +
                String.format("%-30s %10s\n", "Positive:", numPositive) +
                String.format("%-30s %10s\n", "Neutral:", numNeutral) +
                String.format("%-30s %10s\n", "Negative:", numNegative) +
                String.format("%-30s %10s\n", "Very Negative:", numVeryNegative) +
                divider;


        context.write(key, new Text(summary));
    }
}

