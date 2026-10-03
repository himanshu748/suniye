package in.suniye.app;
import android.graphics.Bitmap;
import com.google.android.gms.tasks.Tasks;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.Text;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.TextRecognizer;
import com.google.mlkit.vision.text.devanagari.DevanagariTextRecognizerOptions;
import com.google.mlkit.vision.text.latin.TextRecognizerOptions;
import java.util.concurrent.TimeUnit;
public final class LocalText {
 private static final TextRecognizer hindi=TextRecognition.getClient(new DevanagariTextRecognizerOptions.Builder().build());
 private static final TextRecognizer latin=TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS);
 public record Result(String text,float lowestConfidence){}
 public static Result inspect(Bitmap bitmap)throws Exception {
  Result result=recognize(hindi,bitmap);
  if(!result.text().matches("(?s).*[\\u0900-\\u097f].*")){Result english=recognize(latin,bitmap);if(!english.text().isBlank())result=english;}
  return result;
 }
 public static String read(Bitmap bitmap)throws Exception {
  Result result=inspect(bitmap);String text=result.text();
  if(text.length()>12000)throw new UserMessage("कागज़ का छोटा हिस्सा पास से लें।");
  if(!text.isBlank()&&(!Float.isFinite(result.lowestConfidence())||result.lowestConfidence()<.85f))throw new UserMessage("कुछ शब्द साफ़ नहीं हैं। पास से छोटा हिस्सा दोबारा लें।");
  return text;
 }
 private static Result recognize(TextRecognizer recognizer,Bitmap source)throws Exception{
  // ML Kit owns a copy until its async task completes. Stop can interrupt the worker safely.
  Bitmap owned=source.copy(Bitmap.Config.ARGB_8888,false);
  com.google.android.gms.tasks.Task<Text> task=recognizer.process(InputImage.fromBitmap(owned,0));
  task.addOnCompleteListener(Runnable::run,done->owned.recycle());
  try{Text detected=Tasks.await(task,25,TimeUnit.SECONDS);float minimum=1f;int words=0;
   for(Text.TextBlock block:detected.getTextBlocks())for(Text.Line line:block.getLines())for(Text.Element word:line.getElements())if(!word.getText().isBlank()){words++;float confidence=word.getConfidence();minimum=Float.isFinite(confidence)?Math.min(minimum,confidence):0f;}
   return new Result(detected.getText().trim(),words>0?minimum:0f);
  }
  catch(InterruptedException e){throw e;}
  catch(Exception e){throw new UserMessage("चित्र साफ़ पढ़ नहीं पाया। पास से दोबारा लें।");}
 }
}
