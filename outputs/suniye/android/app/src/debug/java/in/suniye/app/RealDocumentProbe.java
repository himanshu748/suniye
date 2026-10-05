package in.suniye.app;
import android.app.*;import android.os.*;import android.graphics.*;import java.io.*;import org.json.*;
/** Offline inspection of supplied public documents. Never substitutes expected text for OCR. */
public final class RealDocumentProbe extends Instrumentation {
 private Bundle args;
 @Override public void onCreate(Bundle args){this.args=args;start();}
 @Override public void onStart(){Bundle out=new Bundle();try{
  JSONArray results=new JSONArray();File dir=new File(getTargetContext().getFilesDir(),"real-docs");
  for(File file:dir.listFiles()){if(file.getName().endsWith(".pdf")){int count=ImageInput.pdfCount(file);for(int page=0;page<count;page++){Bitmap b=ImageInput.pdfPage(file,page);inspect(results,file.getName()+":"+(page+1),b);b.recycle();}}else if(file.getName().endsWith(".png")){Bitmap b=BitmapFactory.decodeFile(file.getPath());inspect(results,file.getName(),b);b.recycle();}}
  try(FileOutputStream f=new FileOutputStream(new File(getTargetContext().getFilesDir(),"real-docs-ocr.json"))){f.write(results.toString(2).getBytes(java.nio.charset.StandardCharsets.UTF_8));}
  out.putString("result",results.toString());finish(Activity.RESULT_OK,out);
 }catch(Throwable e){out.putString("failure",e.toString());finish(Activity.RESULT_CANCELED,out);}}
 private void inspect(JSONArray results,String name,Bitmap bitmap)throws Exception{LocalText.Result r=LocalText.inspect(bitmap);JSONArray tokens=new JSONArray();var client=com.google.mlkit.vision.text.TextRecognition.getClient(new com.google.mlkit.vision.text.devanagari.DevanagariTextRecognizerOptions.Builder().build());var detected=com.google.android.gms.tasks.Tasks.await(client.process(com.google.mlkit.vision.common.InputImage.fromBitmap(bitmap,0)),25,java.util.concurrent.TimeUnit.SECONDS);for(var block:detected.getTextBlocks())for(var line:block.getLines())for(var word:line.getElements())tokens.put(new JSONObject().put("text",word.getText()).put("confidence",word.getConfidence()));client.close();results.put(new JSONObject().put("tokens",tokens).put("file",name).put("width",bitmap.getWidth()).put("height",bitmap.getHeight()).put("text",r.text()).put("lowestConfidence",r.lowestConfidence()).put("accepted",r.readable()).put("safeText",r.safeText()).put("words",r.words()).put("unclear",r.unclear()));}
}
