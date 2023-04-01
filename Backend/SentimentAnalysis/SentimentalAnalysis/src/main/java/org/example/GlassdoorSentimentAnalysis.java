package org.example;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.chain.ChainMapper;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

public class GlassdoorSentimentAnalysis {

    public static void main(String[] args) throws Exception {
        Configuration conf = new Configuration();
        Job job = Job.getInstance(conf, "GlassdoorSentimentAnalysis");
        job.setJarByClass(GlassdoorSentimentAnalysis.class);

        // Set input and output paths
//        Path inPath = new Path("hdfs://localhost:9000/user/project/input/");
//        Path outPath = new Path("hdfs://localhost:9000/user/project/output/");

        Path inPath = new Path("hdfs://localhost:9000/user/shaunv/project/test/input/");
        Path outPath = new Path("hdfs://localhost:9000/user/shaunv/project/test/output/");
        // Delete any previous outputs
        outPath.getFileSystem(conf).delete(outPath, true);

        Configuration validationConf = new Configuration(false);
        ChainMapper.addMapper(job, ValidationMapper.class, LongWritable.class, Text.class, LongWritable.class, Text.class, validationConf);

        Configuration concatenateConf = new Configuration(false);
        ChainMapper.addMapper(job, ConcatenateMapper.class, LongWritable.class, Text.class, LongWritable.class, Text.class, concatenateConf);

        Configuration sentimentConf = new Configuration(false);
        ChainMapper.addMapper(job, NLPMapper.class, LongWritable.class, Text.class, Text.class, LongWritable.class, sentimentConf);

        job.setMapperClass(ChainMapper.class);
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(LongWritable.class);

//        job.setCombinerClass(SentimentReducer.class);
        job.setReducerClass(SentimentReducer.class);

        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(Text.class); // Changed to Text
        FileInputFormat.addInputPath(job, inPath);
        FileOutputFormat.setOutputPath(job, outPath);
        System.exit(job.waitForCompletion(true) ? 0 : 1);
    }
}
