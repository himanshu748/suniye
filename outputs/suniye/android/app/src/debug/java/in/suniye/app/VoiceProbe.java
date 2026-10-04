package in.suniye.app;
import android.app.*;
import android.content.*;
import android.os.Bundle;
import android.speech.*;
import android.view.View;
import android.widget.*;
import java.lang.reflect.Field;
import java.util.ArrayList;
/** Real UI/action routing, synthetic recognition callbacks. Never claims microphone accuracy. */
public final class VoiceProbe extends Instrumentation {
 private static final String BILL="बिजली का बिल ₹1,250 है।";
 private Activity activity;private ReaderController reader;private VoiceControls controls;
 private final ArrayList<Fake> engines=new ArrayList<>();
 private final class Fake implements VoiceControls.Engine{final RecognitionListener listener;boolean destroyed=false;Intent request;final boolean onDevice;Fake(RecognitionListener listener,boolean onDevice){this.listener=listener;this.onDevice=onDevice;engines.add(this);}public void start(Intent intent){request=intent;listener.onReadyForSpeech(new Bundle());}public void destroy(){destroyed=true;}}
 @Override public void onCreate(Bundle args){start();}
 @Override public void onStart(){Bundle result=new Bundle();try{
  getUiAutomation(UiAutomation.FLAG_DONT_SUPPRESS_ACCESSIBILITY_SERVICES);
  runOnMainSync(()->{reader=SuniyeApp.reader(getTargetContext());reader.forget();new Config(getTargetContext()).acknowledge();new Config(getTargetContext()).setOnlineVoice(false);new Config(getTargetContext()).setVoiceCommandsEnabled(false);new Config(getTargetContext()).setSpeed(.85f);});
  activity=startActivitySync(new Intent(getTargetContext(),MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));waitForIdleSync();
  runOnMainSync(()->{try{Field field=MainActivity.class.getDeclaredField("voice");field.setAccessible(true);VoiceControls production=(VoiceControls)field.get(activity);Field action=VoiceControls.class.getDeclaredField("actions");action.setAccessible(true);controls=new VoiceControls(activity,reader,(VoiceControls.Actions)action.get(production),Fake::new);field.set(activity,controls);assertVisible("रोकिए");assertVisible("बोलिए");controls.open();if(!engines.isEmpty())throw new AssertionError("Recognizer started before caregiver opt-in");controls.close();new Config(getTargetContext()).setVoiceCommandsEnabled(true);reader.readText(BILL);reader.stop();}catch(ReflectiveOperationException e){throw new RuntimeException(e);}});
  open();Fake first=latest();if(!"hi-IN".equals(first.request.getStringExtra(RecognizerIntent.EXTRA_LANGUAGE))||first.request.getIntExtra(RecognizerIntent.EXTRA_MAX_RESULTS,0)!=1||first.request.getBooleanExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS,true))throw new AssertionError("Recognition request is not bounded Hindi");
  if(android.os.Build.VERSION.SDK_INT>=31){Fake deviceEngine=first;runOnMainSync(()->deviceEngine.listener.onError(SpeechRecognizer.ERROR_LANGUAGE_NOT_SUPPORTED));waitForIdleSync();Thread.sleep(700);if(latest()==first||!first.destroyed||latest().onDevice||latest().request==null)throw new AssertionError("Hindi fallback: engines="+engines.size()+", oldDestroyed="+first.destroyed+", onDevice="+latest().onDevice+", request="+(latest().request!=null)+", status="+reader.status());open();first=latest();}
  save("voice-controls.png");long before=reader.generation();emit(first,"मत पढ़िए");if(!reader.status().startsWith("नहीं समझे")||!BILL.equals(reader.original())||!first.destroyed)throw new AssertionError("Unknown/negative phrase dispatched or no recovery prompt");
  open();Fake repeat=latest();before=reader.generation();emit(repeat,"फिर सुनिए");if(reader.generation()<=before||!repeat.destroyed||!BILL.equals(reader.original()))throw new AssertionError("Repeat route failed");
  open();emit(latest(),"धीरे सुनिए");if(new Config(getTargetContext()).speed()>.701f||!BILL.equals(reader.original()))throw new AssertionError("Slow route failed");
  open();Fake stopped=latest();emit(stopped,"रोकिए");before=reader.generation();emit(stopped,"फिर सुनिए");if(reader.busy()||reader.generation()!=before||!stopped.destroyed)throw new AssertionError("Late recognition resumed after Stop");
  open();Fake lifecycle=latest();runOnMainSync(controls::close);before=reader.generation();emit(lifecycle,"पढ़िए");if(reader.generation()!=before||!lifecycle.destroyed)throw new AssertionError("Dismissed recognition remained active");
  open();runOnMainSync(()->latest().listener.onError(SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS));if(!latest().destroyed)throw new AssertionError("Permission error did not destroy recognition");runOnMainSync(controls::close);
  runOnMainSync(()->{reader.forget();new Config(getTargetContext()).setVoiceCommandsEnabled(false);});waitForIdleSync();save("voice-home.png");
  result.putString("voice","PASS: caregiver opt-in, visible Stop/Speak, bounded Hindi request, unknown rejection, Repeat/Slow/Stop routing, late callback and dismissal cleanup, permission-error spoken recovery, Android 12+ Hindi engine fallback");result.putString("scope","Synthetic recognition callbacks; no microphone/ASR accuracy or Redmi claim");finish(Activity.RESULT_OK,result);
 }catch(Throwable e){result.putString("failure",e.toString());finish(Activity.RESULT_CANCELED,result);}}
 private Fake latest(){return engines.get(engines.size()-1);}
 private void open()throws Exception{runOnMainSync(controls::open);waitForIdleSync();Thread.sleep(350);if(latest().request==null)throw new AssertionError("Recognizer did not start");}
 private void emit(Fake engine,String text){runOnMainSync(()->{Bundle data=new Bundle();ArrayList<String> words=new ArrayList<>();words.add(text);data.putStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION,words);engine.listener.onResults(data);});}
 private void assertVisible(String text){Button button=find(activity.getWindow().getDecorView(),text);android.graphics.Rect visible=new android.graphics.Rect();if(button==null||!button.getGlobalVisibleRect(visible)||visible.height()!=button.getHeight())throw new AssertionError("Fixed control clipped: "+text);}
 private Button find(View view,String label){if(view instanceof Button&&label.contentEquals(((Button)view).getText()))return(Button)view;if(view instanceof android.view.ViewGroup){android.view.ViewGroup group=(android.view.ViewGroup)view;for(int i=0;i<group.getChildCount();i++){Button result=find(group.getChildAt(i),label);if(result!=null)return result;}}return null;}
 private void save(String name)throws Exception{android.graphics.Bitmap bitmap=getUiAutomation(UiAutomation.FLAG_DONT_SUPPRESS_ACCESSIBILITY_SERVICES).takeScreenshot();try(java.io.FileOutputStream out=new java.io.FileOutputStream(new java.io.File(getTargetContext().getFilesDir(),name))){bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG,100,out);}finally{bitmap.recycle();}}
}
