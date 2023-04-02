# ICT2107-team-p3_6-project

This is the implementation of our ICT2107 Hadoop Project done by:
| Student | Student ID |
| ------------- |:-------------:|
|Fabian Chua |2101506|
| Shaun Sartra Varghese | 2102172 |
|Pang Ka Ho |2102047|
|Norman Chia |2100686|
|Wang Qixian |2101751|

You can view the dashboard demo here on https://ict2107-team-p3-6-project.vercel.app/

## 1) Running the GlassDoor Crawler

1. run 'pip install -r requirements.txt'
2. change GlassDoor link on line 142 of GlassDoorCrawler.py to the company you want to crawl
3. Run GlassDoorCrawler.py
4. Crawled reviews will be automatically saved to a CSV file named after the company

## 2) Running the Sentimental Analysis JAR

### There are 2 different JARs, one for each SA method (Lexicon/ CoreNLP)

#### 2.1) Running Lexicon Sentimental Analysis JAR

1. Ensure that the input, output directory the list of negative and positive words is present in the HDFS. (Reader may use the word list that we have used by going to the following directory: Backend > SentimentAnalysis > words.csv)
2. The input directory should contain 1 or more csv files as input data in the following format: Summary,Date,JobTitle,AuthorLocation,OverallRating,Pros,Cons
3. Navigate to the folder that contains the lexiconSa jar file.
4. Usage: hadoop jar group_p3_6_lexiconSa.jar org.example.WordComparisonAnalysis <input_dir> <output_dir> <words.csv>
5. Example usage :
<pre><code>hadoop jar group_p3_6_lexiconSa.jar org.example.WordComparisonAnalysis hdfs://localhost:9000/user/shaunv/project/wordMapInput/ hdfs://localhost:9000/user/shaunv/project/wordMapOutput/ hdfs://localhost:9000/user/shaunv/project/words.csv
</code></pre>
6. Output will be present in the output_dir specified in HDFS.

#### 2.2) Running CoreNLP Sentimental Analysis JAR

> :warning: **Running the CoreNLP analysis on large datastes is VERY resource intensive and takes a VERY LONG time**: We reccomend using a smaller test dataset!

1. Ensure that the input, output directory is present in the HDFS.
2. The input directory should contain 1 or more csv files as input data in the following format: Summary,Date,JobTitle,AuthorLocation,OverallRating,Pros,Cons
3. Navigate to the folder that contains the nlpSa jar file.
4. Usage: hadoop jar group_p3_6_nlpSa.jar org.example.GlassdoorSentimentAnalysis <input_dir> <output_dir>
5. Example usage :
<pre><code>hadoop jar group_p3_6_nlpSa.jar org.example.GlassdoorSentimentAnalysis hdfs://localhost:9000/user/shaunv/project/nlpSaInput/ hdfs://localhost:9000/user/shaunv/project/nlpSaOutput/
</code></pre>
6. Output will be present in the output_dir specified in HDFS.

## 3) Running the Topic Modelling JAR

1. Ensure that the input directory and a list of stopwords is present in the HDFS. (Reader may use the stopwords that we have used by going to the following directory: Backend > TopicModelling > mallet > stopwords.txt
2. The input directory should contain 1 or more csv files as input data in the following format: Summary,Date,JobTitle,AuthorLocation,OverallRating,Pros,Cons
3. Navigate to the folder that contains the topic modelling jar file.
4. Usage: hadoop jar group_p3_6_tm.jar input_dir output_dir stopwords.txt
5. Output will be present in the output_dir specified in HDFS.
