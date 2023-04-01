import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.lib.input.FileSplit;

import java.io.File;
import java.io.IOException;
import java.net.URI;

public class TopicModelingMapper extends Mapper<LongWritable, Text, Text, Text> {

    File stopWordsFile = null;

    @Override
    protected void setup(Context context) throws IOException {
        URI[] cacheFiles = context.getCacheFiles();
        Path stopWordsPath = new Path(cacheFiles[0].getPath());
        stopWordsFile = new File(stopWordsPath.getName());
    }

    @Override
    protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        // Read a CSV file line from the input value
        String line = value.toString();
        String[] fields = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", -1);
        if (fields.length < 7) {
            System.err.println("Skipping line with incorrect number of columns: " + line);
            return;
        }
        String pros = fields[5].trim();
        String cons = fields[6].trim();

        // Get the file name
        String fileName = ((FileSplit) context.getInputSplit()).getPath().getName();

        // Write the file name and the pros and cons texts to the context
        context.write(new Text(fileName), new Text(pros + "\t" + cons));
    }
}
