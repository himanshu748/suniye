package in.suniye.app;

import android.app.*;
import android.content.*;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ScrollView;
import org.json.*;
import java.io.*;

/** Recorded demonstration using real app controls, backend and synthetic material only. */
public final class SimpleDemo extends Instrumentation {
    private Bundle args; private ReaderController reader; private Activity activity;
    private long started; private final JSONArray events=new JSONArray();
    private static final String BILL="बिजली का बिल ₹1,250 है।";
    @Override public void onCreate(Bundle arguments){args=arguments;start();}
    @Override public void onStart(){Bundle result=new Bundle();started=System.currentTimeMillis();try{
        getUiAutomation(UiAutomation.FLAG_DONT_SUPPRESS_ACCESSIBILITY_SERVICES);
        runOnMainSync(()->{reader=SuniyeApp.reader(getTargetContext());reader.forget();try{
            Config config=new Config(getTargetContext());config.save(args.getString("endpoint"),args.getString("token"),"demo");config.acknowledge();config.setOnlineVoice(true);config.setSpeed(.85f);
        }catch(Exception e){throw new RuntimeException(e);}});
        activity=startActivitySync(new Intent(getTargetContext(),MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));waitForIdleSync();event("home");Thread.sleep(2500);
        runOnMainSync(()->getTargetContext().startActivity(new Intent(getTargetContext(),MainActivity.class).setAction(Intent.ACTION_SEND).setType("text/plain").putExtra(Intent.EXTRA_TEXT,BILL).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_SINGLE_TOP)));
        event("share-text");Thread.sleep(500);waitUntilDone(35000);
        if(!BILL.equals(reader.original())||!new File(getTargetContext().getFilesDir(),"last-reading.mp3").exists()||!reader.status().startsWith("फिर सुनने"))throw new AssertionError("Real online reading did not complete: "+reader.status());
        if(getTargetContext().getSharedPreferences("last-reading",Context.MODE_PRIVATE).getFloat("audioBaseRate",0)!=1f)throw new AssertionError("v4 cached rate must be one");event("reading-complete");Thread.sleep(1500);
        runOnMainSync(()->{android.widget.TextView hint=findText(activity.getWindow().getDecorView(),"रकम हिंदी में: एक हज़ार दो सौ पचास रुपये");if(hint==null)throw new AssertionError("Hindi amount not displayed");hint.requestRectangleOnScreen(new android.graphics.Rect(0,0,hint.getWidth(),hint.getHeight()),true);});waitForIdleSync();event("amount-words");Thread.sleep(3000);
        click("फिर सुनिए");event("original-replay");Thread.sleep(3500);assertPlaybackRate(.85f);click("रोकिए");event("final-stop");Thread.sleep(2000);
        JSONObject receipt=new JSONObject().put("recordedAt",java.time.Instant.now().toString()).put("environment","Android 15 emulator, synthetic input, real backend providers").put("input",BILL).put("events",events).put("originalPreserved",true).put("repeatAndStop",true).put("voiceModel","eleven_v4").put("voiceName","Raju - Clear, Natural and Warm").put("audioBaseRate",1).put("repeatPlaybackRate",.85).put("audioCapture","Provider MP3 captured separately; screenrecord does not record device audio");
        write("simple-demo-receipt.json",receipt.toString(2));result.putString("demo","PASS: real backend voice, Hindi amount, original Repeat and Stop");finish(Activity.RESULT_OK,result);
    }catch(Throwable e){try{write("simple-demo-failure.json",new JSONObject().put("events",events).put("failure",e.toString()).toString(2));}catch(Exception ignored){}result.putString("failure",e.toString());finish(Activity.RESULT_CANCELED,result);}}
    private void assertPlaybackRate(float expected)throws Exception{runOnMainSync(()->{try{java.lang.reflect.Field field=ReaderController.class.getDeclaredField("player");field.setAccessible(true);android.media.MediaPlayer player=(android.media.MediaPlayer)field.get(reader);if(player==null||Math.abs(player.getPlaybackParams().getSpeed()-expected)>.005f)throw new AssertionError("v4 playback speed mismatch");}catch(ReflectiveOperationException e){throw new RuntimeException(e);}});}
    private void event(String name)throws Exception{events.put(new JSONObject().put("name",name).put("elapsedMs",System.currentTimeMillis()-started));}
    private void write(String name,String text)throws Exception{try(FileOutputStream out=new FileOutputStream(new File(getTargetContext().getFilesDir(),name))){out.write(text.getBytes(java.nio.charset.StandardCharsets.UTF_8));}}
    private void waitUntilDone(long timeout)throws Exception{long deadline=System.currentTimeMillis()+timeout;boolean[] busy={true};do{runOnMainSync(()->busy[0]=reader.busy());if(!busy[0])return;Thread.sleep(100);}while(System.currentTimeMillis()<deadline);throw new AssertionError("Reading exceeded demo timeout");}
    private void click(String label)throws Exception{runOnMainSync(()->{Button button=find(activity.getWindow().getDecorView(),label);if(button==null)throw new AssertionError("Missing button "+label);button.requestRectangleOnScreen(new android.graphics.Rect(0,0,button.getWidth(),button.getHeight()),true);});waitForIdleSync();Thread.sleep(350);runOnMainSync(()->{Button button=find(activity.getWindow().getDecorView(),label);android.graphics.Rect visible=new android.graphics.Rect();if(!button.getGlobalVisibleRect(visible)||visible.height()!=button.getHeight())throw new AssertionError("Button clipped "+label);button.performClick();});}
    private android.widget.TextView findText(View view,String label){if(view instanceof android.widget.TextView&&label.contentEquals(((android.widget.TextView)view).getText()))return (android.widget.TextView)view;if(view instanceof android.view.ViewGroup){android.view.ViewGroup group=(android.view.ViewGroup)view;for(int i=0;i<group.getChildCount();i++){android.widget.TextView found=findText(group.getChildAt(i),label);if(found!=null)return found;}}return null;}
    private Button find(View view,String label){if(view instanceof Button&&label.contentEquals(((Button)view).getText()))return (Button)view;if(view instanceof android.view.ViewGroup){android.view.ViewGroup group=(android.view.ViewGroup)view;for(int i=0;i<group.getChildCount();i++){Button found=find(group.getChildAt(i),label);if(found!=null)return found;}}return null;}
}
