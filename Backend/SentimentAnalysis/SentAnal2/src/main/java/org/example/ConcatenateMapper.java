package org.example;


import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

import java.io.IOException;

public class ConcatenateMapper extends Mapper<LongWritable, Text, LongWritable, Text> {

    @Override
    protected void map(LongWritable key, Text value, Mapper<LongWritable, Text,
            LongWritable, Text>.Context context)
            throws IOException, InterruptedException {

        String[] parts = value.toString().split(",", -1);

        // Concatenate Pros and Cons columns (5th and 6th columns)
        String concatenatedReview = parts[5] + " " + parts[6];
        String updatedLine = String.join(",", parts[0], parts[1], parts[2], parts[3], parts[4], concatenatedReview);

        context.write(key, new Text(updatedLine));
    }
}
