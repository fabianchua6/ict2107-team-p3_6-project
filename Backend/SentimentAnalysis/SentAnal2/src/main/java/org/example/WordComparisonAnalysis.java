package org.example;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.chain.ChainMapper;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

import java.net.URI;

public class WordComparisonAnalysis {

    public static void main(String[] args) throws Exception {
        Configuration conf = new Configuration();
        Job job = Job.getInstance(conf, "WordComparisonAnalysis");
        job.setJarByClass(WordComparisonAnalysis.class);

        // Set input and output paths
        Path inPath = new Path("hdfs://localhost:9000/user/shaunv/project/test2/input/");
        Path outPath = new Path("hdfs://localhost:9000/user/shaunv/project/test2/output/");
        // Delete any previous outputs
        outPath.getFileSystem(conf).delete(outPath, true);

        // Add words.csv to the distributed cache
        job.addCacheFile(new URI("hdfs://localhost:9000/user/shaunv/project/test/words.csv"));

        //Add ChainMapper configs
        Configuration validationConf = new Configuration(false);
        ChainMapper.addMapper(job, ValidationMapper.class, LongWritable.class, Text.class, LongWritable.class, Text.class, validationConf);

        Configuration sentimentConf = new Configuration(false);
        ChainMapper.addMapper(job, WordMapper.class, LongWritable.class, Text.class, Text.class, LongWritable.class, sentimentConf);

        job.setMapperClass(ChainMapper.class);
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(Text.class);

        job.setReducerClass(WordReducer.class);

        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(Text.class);
        FileInputFormat.addInputPath(job, inPath);
        FileOutputFormat.setOutputPath(job, outPath);

        System.exit(job.waitForCompletion(true) ? 0 : 1);

    }
}
