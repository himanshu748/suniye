package in.suniye.app;
import android.app.*;
import android.content.*;
import android.os.Bundle;
import java.lang.reflect.Field;
/** Synthetic local server + recorded Raju clips. No provider calls or real-family input. */
public final class ElevenOnlyProbe extends Instrumentation {
 private ReaderController reader;private Config config;
 @Override public void onCreate(Bundle arguments){start();}
 @Override public void onStart(){Bundle result=new Bundle();try{
  getUiAutomation(UiAutomation.FLAG_DONT_SUPPRESS_ACCESSIBILITY_SERVICES);
  runOnMainSync(()->{reader=SuniyeApp.reader(getTargetContext());config=new Config(getTargetContext());getTargetContext().getSharedPreferences("family",Context.MODE_PRIVATE).edit().putBoolean("screenConsent",true).remove("elevenLabsConsent").apply();if(config.onlineVoice())throw new AssertionError("Legacy screen consent enabled cloud voice");config.acknowledge();config.setSpeed(.85f);});
  startActivitySync(new Intent(getTargetContext(),MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));waitForIdleSync();
  setup("valid");runOnMainSync(()->reader.readText("बिल की रकम 1250 रुपये है।"));awaitReady();
  if(value("lastAudio")==null)throw new AssertionError("Recorded Raju not cached");
  android.media.MediaPlayer p=(android.media.MediaPlayer)value("player");if(p==null||!p.isPlaying())throw new AssertionError("Raju media not playing");
  runOnMainSync(reader::stop);if(value("player")!=null||reader.busy())throw new AssertionError("Stop did not release player");
  setup("offline");runOnMainSync(reader::repeat);Thread.sleep(500);p=(android.media.MediaPlayer)value("player");if(p==null||!p.isPlaying())throw new AssertionError("Offline cached repeat failed");
  runOnMainSync(reader::slower);Thread.sleep(500);p=(android.media.MediaPlayer)value("player");if(p==null||p.getPlaybackParams().getSpeed()>.701f)throw new AssertionError("Slow media failed");runOnMainSync(reader::stop);
  for(String mode:new String[]{"missing","foreign","corrupt"}){
   setup(mode);runOnMainSync(()->reader.readText("परीक्षण संदेश"));awaitUnavailable();
   if(!"corrupt".equals(mode)&&value("lastAudio")!=null)throw new AssertionError("Foreign or missing audio cached");
   runOnMainSync(reader::stop);
  }
  setup("delayed");runOnMainSync(()->reader.readText("परीक्षण संदेश"));Thread.sleep(200);runOnMainSync(reader::stop);String stopped=reader.status();Thread.sleep(3000);
  if(reader.busy()||value("player")!=null||!reader.status().equals(stopped))throw new AssertionError("Late audio resumed after Stop");
  result.putString("playback","PASS: Raju-only media, cached offline Repeat/Slow, Stop release, missing/foreign/corrupt audio recovery, late-result rejection");
  result.putString("scope","Android 15 emulator and synthetic local server with genuine recorded ElevenLabs audio; not Redmi or family testing");finish(Activity.RESULT_OK,result);
 }catch(Throwable error){result.putString("failure",error.toString());finish(Activity.RESULT_CANCELED,result);}}
 private Object value(String name)throws Exception{Field f=ReaderController.class.getDeclaredField(name);f.setAccessible(true);return f.get(reader);}
 private void setup(String mode){runOnMainSync(()->{try{config.save("http://10.0.2.2:9461/"+mode,"synthetic-token-0123456789abcdef012345","fixture");}catch(Exception e){throw new RuntimeException(e);}});}
 private void awaitReady()throws Exception{for(int i=0;i<60;i++){Thread.sleep(100);if(value("lastAudio")!=null&&value("player")!=null){android.media.MediaPlayer p=(android.media.MediaPlayer)value("player");try{if(p.isPlaying())return;}catch(IllegalStateException ignored){}}}throw new AssertionError("Media wait failed: "+reader.status());}
 private void awaitUnavailable()throws Exception{for(int i=0;i<60;i++){Thread.sleep(100);if(reader.status().startsWith("आवाज़ नहीं मिली"))return;}throw new AssertionError("No clear voice error: "+reader.status());}
}
