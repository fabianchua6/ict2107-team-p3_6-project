package org.example;

import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

import java.io.IOException;

public class ValidationMapper extends Mapper<LongWritable, Text, LongWritable, Text> {
    @Override
    protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        if (isValid(value.toString())) {
            context.write(key, value);
        }
    }

    private boolean isValid(String line) {
        String[] parts = line.split(",", -1);
        //Ensure each row has the 7 columns needed
        return parts.length == 7;
    }
}

