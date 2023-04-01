import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URI;

public class TopicModelingJob {
    public static void main(String[] args) throws Exception {

        if (args.length != 3) {
            System.err.println("Usage: hadoop jar group_p3_6_tm.jar <input path> <output path> <stop words path>");
            System.exit(-1);
        }

        Configuration conf = new Configuration();

        FileSystem fs = FileSystem.get(conf);
        FileStatus[] inputFiles = fs.listStatus(new Path(args[0]));

        Path finalOutputPath = new Path(args[1]);
        fs.delete(finalOutputPath, true);

        try (OutputStream finalOutput = fs.create(finalOutputPath);
             BufferedOutputStream bufferedFinalOutput = new BufferedOutputStream(finalOutput)) {

            for (FileStatus inputFile : inputFiles) {
                Job job = Job.getInstance(conf, "TopicModelingJob");
                job.setJarByClass(TopicModelingJob.class);

                job.setMapperClass(TopicModelingMapper.class);
                job.setReducerClass(TopicModelingReducer.class);

                job.setOutputKeyClass(Text.class);
                job.setOutputValueClass(Text.class);

                Path inputPath = inputFile.getPath();
                Path outputPath = new Path(args[1] + "_temp_" + inputFile.getPath().getName());

                outputPath.getFileSystem(conf).delete(outputPath, true);
                FileInputFormat.addInputPath(job, inputPath);
                FileOutputFormat.setOutputPath(job, outputPath);

                job.addCacheFile(new URI(args[2]));

                job.setNumReduceTasks(1);

                if (job.waitForCompletion(true)) {
                    FileStatus[] outputFiles = fs.listStatus(outputPath);
                    for (FileStatus outputFile : outputFiles) {
                        if (!outputFile.getPath().getName().startsWith("_")) {
                            try (InputStream output = fs.open(outputFile.getPath());
                                 BufferedInputStream bufferedOutput = new BufferedInputStream(output)) {
                                byte[] buffer = new byte[1024];
                                int bytesRead;
                                while ((bytesRead = bufferedOutput.read(buffer)) > 0) {
                                    bufferedFinalOutput.write(buffer, 0, bytesRead);
                                }
                                bufferedFinalOutput.write('\n');
                            }
                        }
                    }
                }

                fs.delete(outputPath, true);
            }
        }
    }
}
