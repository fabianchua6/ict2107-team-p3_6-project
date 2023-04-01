package org.example;

import org.apache.hadoop.mapreduce.lib.input.FileSplit;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.Properties;

import edu.stanford.nlp.ling.CoreAnnotations;
import edu.stanford.nlp.neural.rnn.RNNCoreAnnotations;
import edu.stanford.nlp.pipeline.Annotation;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import edu.stanford.nlp.sentiment.SentimentCoreAnnotations;
import edu.stanford.nlp.trees.Tree;
import edu.stanford.nlp.util.CoreMap;
import org.apache.poi.ss.formula.functions.T;

public class NLPMapper extends Mapper<LongWritable, Text, Text, LongWritable> {
    private static StanfordCoreNLP pipeline;

    @Override
    protected void setup(Context context) throws IOException, InterruptedException {
        Properties props = new Properties();
        props.setProperty("annotators", "tokenize, ssplit, pos, lemma, parse, sentiment");
        pipeline = new StanfordCoreNLP(props);
    }

    @Override
    protected void map(LongWritable key, Text value, Mapper<LongWritable, Text, Text, LongWritable>.Context context)
            throws IOException, InterruptedException {

        // Get the input file name
        String inputFileName = ((FileSplit) context.getInputSplit()).getPath().getName();

        String[] parts = value.toString().split(",", -1);
        String concatenatedReview = parts[5];

        int sentimentScore = analyzeSentiment(concatenatedReview);;

        context.write(new Text(inputFileName),new LongWritable(sentimentScore));
    }

    private static int analyzeSentiment(String text) {
        Annotation annotation = pipeline.process(text);
        int totalSentiment = 0;
        int totalSentences = 0;

        for (CoreMap sentence : annotation.get(CoreAnnotations.SentencesAnnotation.class)) {
            Tree sentimentTree = sentence.get(SentimentCoreAnnotations.SentimentAnnotatedTree.class);
            int sentiment = RNNCoreAnnotations.getPredictedClass(sentimentTree);
            totalSentiment += sentiment;
            totalSentences++;
        }

        return totalSentences > 0 ? totalSentiment / totalSentences : -1;
    }

}