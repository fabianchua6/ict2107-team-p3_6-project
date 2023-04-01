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

## 3) Running the Topic Modelling JAR

1. Ensure that the input directory and a list of stopwords is present in the HDFS. (Reader may use the stopwords that we have used by going to the following directory: Backend > TopicModelling > mallet > stopwords.txt
2. The input directory should contain 1 or more csv files as input data in the following format: Summary,Date,JobTitle,AuthorLocation,OverallRating,Pros,Cons
3. Navigate to the folder that contains the topic modelling jar file.
4. Usage: hadoop jar group_p3_6_tm.jar input_dir output_dir stopwords.txt
5. Output will be present in the output_dir specified in HDFS.
