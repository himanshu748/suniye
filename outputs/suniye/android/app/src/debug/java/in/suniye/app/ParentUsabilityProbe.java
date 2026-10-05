package in.suniye.app;
import android.app.*;
import android.content.*;
import android.graphics.Rect;
import android.os.Bundle;
import android.view.*;
import android.widget.*;
import java.lang.reflect.Field;
/** Synthetic long Hindi source; examines controls, not parent comprehension. */
public final class ParentUsabilityProbe extends Instrumentation {
 private MainActivity activity;private ReaderController reader;
 @Override public void onCreate(Bundle b){start();}
 @Override public void onStart(){Bundle result=new Bundle();try{
  UiAutomation ui=getUiAutomation(UiAutomation.FLAG_DONT_SUPPRESS_ACCESSIBILITY_SERVICES);
  runOnMainSync(()->{reader=SuniyeApp.reader(getTargetContext());Config config=new Config(getTargetContext());config.acknowledge();config.setVoiceCommandsEnabled(false);config.setSpeed(.85f);try{config.save("http://10.0.2.2:9461/offline","synthetic-token-0123456789abcdef012345","fixture");set("original","बिल की रकम 1250 रुपये है।\n"+"यह लंबा कागज़ है।\n".repeat(90));set("lastSpoken","बिल की रकम 1250 रुपये है।");set("lastSource","बिल की रकम 1250 रुपये है।");}catch(Exception e){throw new RuntimeException(e);}reader.stop();});
  activity=(MainActivity)startActivitySync(new Intent(getTargetContext(),MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));waitForIdleSync();
  runOnMainSync(()->{View root=activity.getWindow().getDecorView();Button repeat=button(root,"फिर सुनिए"),slow=button(root,"धीरे सुनिए"),stop=button(root,"रोकिए");if(repeat==null||slow==null||stop==null)throw new AssertionError("Missing everyday controls");if(!visible(repeat)||!visible(slow)||!visible(stop))throw new AssertionError("Everyday controls hidden by long text");if(button(root,"पूरा पाठ देखिए")==null)throw new AssertionError("Full original unavailable");if(button(root,"बोलिए")!=null)throw new AssertionError("Inactive microphone button visible");if(button(root,"शब्दों का मतलब सुनिए").getVisibility()!=View.GONE)throw new AssertionError("Experimental explanation not collapsed");if(repeat.getHeight()<Ui.dp(activity,48)||slow.getHeight()<Ui.dp(activity,48))throw new AssertionError("Small replay touch target");});
  android.graphics.Bitmap[] rendered=new android.graphics.Bitmap[1];runOnMainSync(()->{View view=activity.getWindow().getDecorView();rendered[0]=android.graphics.Bitmap.createBitmap(view.getWidth(),view.getHeight(),android.graphics.Bitmap.Config.ARGB_8888);view.draw(new android.graphics.Canvas(rendered[0]));});android.graphics.Bitmap screen=rendered[0];try(java.io.FileOutputStream out=new java.io.FileOutputStream(new java.io.File(getTargetContext().getFilesDir(),"parent-long-text.png"))){screen.compress(android.graphics.Bitmap.CompressFormat.PNG,100,out);}screen.recycle();
  runOnMainSync(()->button(activity.getWindow().getDecorView(),"पूरा पाठ देखिए").performClick());waitForIdleSync();
  runOnMainSync(()->findScroll(activity.getWindow().getDecorView()).fullScroll(View.FOCUS_DOWN));waitForIdleSync();
  runOnMainSync(()->{if(!visible(button(activity.getWindow().getDecorView(),"रोकिए")))throw new AssertionError("Stop lost after expanding and scrolling long source");});
  byte[] bill;try(java.io.InputStream in=getTargetContext().getAssets().open("voice-fixture-bill.mp3")){java.io.ByteArrayOutputStream out=new java.io.ByteArrayOutputStream();byte[] buffer=new byte[8192];int count;while((count=in.read(buffer))!=-1)out.write(buffer,0,count);bill=out.toByteArray();}
  runOnMainSync(()->{try{set("original","बिल की रकम 1250 रुपये है।");set("lastSource","बिल की रकम 1250 रुपये है।");set("lastSpoken","बिल की रकम 1250 रुपये है।");Field audio=ReaderController.class.getDeclaredField("lastAudio");audio.setAccessible(true);audio.set(reader,bill);Field rate=ReaderController.class.getDeclaredField("lastAudioRate");rate.setAccessible(true);rate.setFloat(reader,1f);reader.stop();button(activity.getWindow().getDecorView(),"फिर सुनिए").performClick();}catch(Exception e){throw new RuntimeException(e);}});
  awaitPlaying();
  runOnMainSync(()->{View root=activity.getWindow().getDecorView();button(root,"धीरे सुनिए").performClick();if(new Config(getTargetContext()).speed()>.701f||button(activity.getWindow().getDecorView(),"सामान्य गति सुनिए")==null)throw new AssertionError("Slow toggle missing");button(activity.getWindow().getDecorView(),"सामान्य गति सुनिए").performClick();if(Math.abs(new Config(getTargetContext()).speed()-.85f)>.01f)throw new AssertionError("Usual speed not restored");reader.stop();});
  runOnMainSync(()->{ScrollView scroll=findScroll(activity.getWindow().getDecorView());scroll.fullScroll(View.FOCUS_DOWN);});waitForIdleSync();
  runOnMainSync(()->{View root=activity.getWindow().getDecorView();if(!visible(button(root,"रोकिए")))throw new AssertionError("Stop lost after scroll");button(root,"कैसे चलाएँ? सुनिए").performClick();});
  awaitPlaying();Field media=ReaderController.class.getDeclaredField("player");media.setAccessible(true);android.media.MediaPlayer player=(android.media.MediaPlayer)media.get(reader);if(player==null||!player.isPlaying())throw new AssertionError("Bundled Raju help did not play");
  runOnMainSync(reader::stop);if(media.get(reader)!=null)throw new AssertionError("Help not stopped");
  result.putString("parentUi","PASS: Repeat/Slow visible before long source, Stop after scroll, inactive microphone absent, explanation collapsed, Slow toggle restores usual speed, cached real Raju bill plays offline, bundled Raju instructions stop correctly");result.putFloat("fontScale",getTargetContext().getResources().getConfiguration().fontScale);result.putString("scope","Android "+android.os.Build.VERSION.RELEASE+" Activity view render and media-state test; System UI unreliable; no physical touch, parent comprehension or Redmi claim");finish(Activity.RESULT_OK,result);
 }catch(Throwable e){result.putString("failure",e.toString());finish(Activity.RESULT_CANCELED,result);}}
 private void awaitPlaying()throws Exception{Field f=ReaderController.class.getDeclaredField("player");f.setAccessible(true);for(int i=0;i<100;i++){Thread.sleep(100);android.media.MediaPlayer p=(android.media.MediaPlayer)f.get(reader);try{if(p!=null&&p.isPlaying())return;}catch(IllegalStateException ignored){}}throw new AssertionError("Recorded Raju media did not start: "+reader.status());}
 private void set(String name,String value)throws Exception{Field f=ReaderController.class.getDeclaredField(name);f.setAccessible(true);f.set(reader,value);}
 private static Button button(View v,String label){if(v instanceof Button&&((Button)v).getText().toString().equals(label))return (Button)v;if(v instanceof ViewGroup){ViewGroup g=(ViewGroup)v;for(int i=0;i<g.getChildCount();i++){Button b=button(g.getChildAt(i),label);if(b!=null)return b;}}return null;}
 private static ScrollView findScroll(View v){if(v instanceof ScrollView)return (ScrollView)v;if(v instanceof ViewGroup){ViewGroup g=(ViewGroup)v;for(int i=0;i<g.getChildCount();i++){ScrollView found=findScroll(g.getChildAt(i));if(found!=null)return found;}}return null;}
 private static boolean visible(View v){Rect rect=new Rect();return v!=null&&v.getGlobalVisibleRect(rect)&&v.isShown()&&rect.height()>=v.getHeight()-2;}
}
