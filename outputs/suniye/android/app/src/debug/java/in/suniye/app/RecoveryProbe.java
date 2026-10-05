package in.suniye.app;
import android.app.*;import android.content.*;import android.os.*;import android.view.*;import android.widget.*;import org.json.*;import java.io.*;import java.lang.reflect.Field;
/** New release recovery paths. Hosted word help, then cached audio with an offline endpoint. */
public final class RecoveryProbe extends Instrumentation {
 private Bundle args;private ReaderController reader;private MainActivity activity;
 @Override public void onCreate(Bundle b){args=b;start();}
 @Override public void onStart(){Bundle result=new Bundle();try{
  getUiAutomation(UiAutomation.FLAG_DONT_SUPPRESS_ACCESSIBILITY_SERVICES);
  String[] codes={"MODEL_DAILY_LIMIT","MODEL_UNAVAILABLE","MODEL_NOT_CONFIGURED","PICTURE_NOT_AVAILABLE","READ_TIMEOUT","UNFAITHFUL","INCOMPLETE"};
  for(String code:codes){String message=BackendClient.errorMessage(code.equals("MODEL_DAILY_LIMIT")?429:503,code);String asset=VoicePrompts.asset(message);if(asset==null||asset.equals("setup"))throw new AssertionError("Wrong recovery prompt: "+code);try(android.content.res.AssetFileDescriptor clip=getTargetContext().getAssets().openFd("voice/"+asset+".mp3")){if(clip.getLength()<500)throw new AssertionError("Empty Raju status clip");}}
  if(!BackendClient.errorMessage(429,"MODEL_DAILY_LIMIT").contains("साढ़े पाँच"))throw new AssertionError("Daily limit was treated as busy");
  runOnMainSync(()->{reader=SuniyeApp.reader(getTargetContext());reader.forget();try{Config c=new Config(getTargetContext());c.save(args.getString("endpoint"),args.getString("token"),"audit");c.acknowledge();c.setOnlineVoice(true);c.setSpeed(.85f);}catch(Exception e){throw new RuntimeException(e);}});
  activity=(MainActivity)startActivitySync(new Intent(getTargetContext(),MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_CLEAR_TASK));waitForIdleSync();
  runOnMainSync(()->reader.readText("देय ₹1250।"));awaitDone();
  runOnMainSync(()->{if(button(activity.getWindow().getDecorView(),"मूल पाठ सुनिए")!=null)throw new AssertionError("Cached original has a redundant fresh-reading action");});
  runOnMainSync(reader::explain);awaitDone();String spoken=reader.spoken();
  if(!reader.isWordHelp()||!spoken.contains("देय का मतलब")||!spoken.endsWith("मूल पाठ ज्यों का त्यों। देय ₹1250।")||!reader.original().equals("देय ₹1250।"))throw new AssertionError("Word help changed original or was not retained");
  runOnMainSync(()->{if(button(activity.getWindow().getDecorView(),"मूल पाठ सुनिए")==null||!hasText(activity.getWindow().getDecorView(),"शब्दों की मदद — सामान्य अर्थ"))throw new AssertionError("Word help or original control invisible in view tree");try{new Config(getTargetContext()).save("http://127.0.0.1:1","synthetic-token-0123456789abcdef012345","audit");}catch(Exception e){throw new RuntimeException(e);}reader.repeat();});awaitPlaying();runOnMainSync(reader::stop);
  if(!reader.spoken().equals(spoken))throw new AssertionError("Replay reverted to original");
  ReaderController restored=new ReaderController(getTargetContext());if(!restored.isWordHelp()||!restored.spoken().equals(spoken)||!restored.original().equals("देय ₹1250।"))throw new AssertionError("Cached help lost on controller restoration");
  runOnMainSync(()->{try{Field audio=ReaderController.class.getDeclaredField("lastAudio");audio.setAccessible(true);audio.set(reader,null);}catch(Exception e){throw new RuntimeException(e);}reader.repeat();});
  if(reader.busy()||!reader.status().startsWith("सहेजी हुई आवाज़"))throw new AssertionError("Missing cached audio triggered an implicit fresh reading");
  runOnMainSync(reader::stop);
  JSONObject receipt=new JSONObject().put("checkedAt",java.time.Instant.now().toString()).put("android",android.os.Build.VERSION.RELEASE).put("fontScale",getTargetContext().getResources().getConfiguration().fontScale).put("original",reader.original()).put("wordHelp",spoken).put("passed",true).put("checks","Seven authored error mappings and bundled Raju clips; hosted source + dictionary audio; distinct help label and original control; offline current-audio replay; cache restore; missing-cache explicit recovery; Stop");
  try(FileOutputStream out=new FileOutputStream(new File(getTargetContext().getFilesDir(),"recovery-probe.json"))){out.write(receipt.toString(2).getBytes(java.nio.charset.StandardCharsets.UTF_8));}
  result.putString("recovery","PASS: hosted word help, original preservation, cached replay and recovery messages");finish(Activity.RESULT_OK,result);
 }catch(Throwable e){result.putString("failure",e.toString());finish(Activity.RESULT_CANCELED,result);}}
 private void awaitDone()throws Exception{long end=System.currentTimeMillis()+80000;while(System.currentTimeMillis()<end){Thread.sleep(150);waitForIdleSync();if(!reader.busy()){if(!reader.status().startsWith("फिर सुनने"))throw new AssertionError("Hosted reading did not finish: "+reader.status());return;}}throw new AssertionError("Hosted playback timed out");}
 private void awaitPlaying()throws Exception{Field f=ReaderController.class.getDeclaredField("player");f.setAccessible(true);for(int i=0;i<100;i++){Thread.sleep(100);android.media.MediaPlayer p=(android.media.MediaPlayer)f.get(reader);try{if(p!=null&&p.isPlaying())return;}catch(IllegalStateException ignored){}}throw new AssertionError("Cached audio did not play offline");}
 private static Button button(View v,String label){if(v instanceof Button&&label.contentEquals(((Button)v).getText()))return(Button)v;if(v instanceof ViewGroup){ViewGroup g=(ViewGroup)v;for(int i=0;i<g.getChildCount();i++){Button b=button(g.getChildAt(i),label);if(b!=null)return b;}}return null;}
 private static boolean hasText(View v,String text){if(v instanceof TextView&&text.contentEquals(((TextView)v).getText()))return true;if(v instanceof ViewGroup){ViewGroup g=(ViewGroup)v;for(int i=0;i<g.getChildCount();i++)if(hasText(g.getChildAt(i),text))return true;}return false;}
}
