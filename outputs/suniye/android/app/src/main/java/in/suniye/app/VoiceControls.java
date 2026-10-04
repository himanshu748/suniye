package in.suniye.app;
import android.Manifest;
import android.app.Activity;
import android.app.Dialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.media.AudioManager;
import android.media.ToneGenerator;
import android.os.*;
import android.speech.*;
import android.view.View;
import android.view.Window;
import android.widget.*;
import java.util.ArrayList;

/** Foreground, one-shot recognition. No audio or recognized utterances are stored. */
public final class VoiceControls implements ReaderController.Listener {
    public static final int MICROPHONE_REQUEST=73;
    public interface Actions{void run(VoiceCommand command);}
    interface Engine{void start(Intent intent);void destroy();}
    interface Factory{Engine create(RecognitionListener listener,boolean preferOnDevice);}
    private final Activity host;private final ReaderController reader;private final Actions actions;private final Factory factory;
    private final Handler main=new Handler(Looper.getMainLooper());
    private Dialog dialog;private TextView status;private Button retry;private Engine engine;private long session=0;private boolean listening=false,permissionPending=false,usingOnDevice=false;private ToneGenerator tone;
    public VoiceControls(Activity host,ReaderController reader,Actions actions){this(host,reader,actions,null);}
    VoiceControls(Activity host,ReaderController reader,Actions actions,Factory factory){this.host=host;this.reader=reader;this.actions=actions;this.factory=factory;}
    public void open(){
        close();reader.stop();dialog=new Dialog(host);dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        LinearLayout shell=Ui.column(host);shell.setBackgroundColor(Ui.PAPER);
        shell.setOnApplyWindowInsetsListener((view,insets)->{android.graphics.Insets bars=insets.getInsets(android.view.WindowInsets.Type.systemBars());view.setPadding(bars.left,bars.top,bars.right,bars.bottom);return insets;});
        ScrollView scroll=new ScrollView(host);LinearLayout body=Ui.column(host);int gap=Ui.dp(host,24);body.setPadding(gap,gap,gap,gap);scroll.addView(body);shell.addView(scroll,new LinearLayout.LayoutParams(-1,0,1));
        Ui.add(body,Ui.text(host,"बोलकर चलाइए",28,Ui.INK,true),-2,0);
        Ui.add(body,Ui.text(host,"पढ़िए · फिर सुनिए\nधीरे सुनिए · रोकिए",26,Ui.INK,false),-2,16);
        status=Ui.text(host,"",24,Ui.INK,true);status.setAccessibilityLiveRegion(View.ACCESSIBILITY_LIVE_REGION_POLITE);Ui.add(body,status,-2,20);
        retry=Ui.button(host,"फिर बोलिए",true);retry.setOnClickListener(v->start());Ui.add(body,retry,-2,20);
        if(!new Config(host).voiceCommandsEnabled()){
            status.setText("परिवार का सदस्य आवाज़ से चलाना चालू करे।");retry.setVisibility(View.GONE);
            Button setup=Ui.button(host,"परिवार की सेटिंग",true);setup.setOnClickListener(v->{close();host.startActivity(new Intent(host,SetupActivity.class));});Ui.add(body,setup,-2,16);
        }
        Button stop=Ui.button(host,"रोकिए",false);stop.setOnClickListener(v->{close();reader.stop();});LinearLayout footer=Ui.column(host);footer.setPadding(gap,Ui.dp(host,12),gap,Ui.dp(host,16));footer.addView(stop,new LinearLayout.LayoutParams(-1,-2));shell.addView(footer);
        dialog.setContentView(shell);final Dialog shown=dialog;dialog.setOnDismissListener(d->{if(dialog==shown){dispose();reader.removeListener(this);dialog=null;}});dialog.show();reader.addListener(this);dialog.getWindow().setLayout(-1,-1);
        if(new Config(host).voiceCommandsEnabled())start();
    }
    public void permissionResult(int code,int[] results){if(code!=MICROPHONE_REQUEST)return;permissionPending=false;if(dialog==null)return;if(results.length>0&&results[0]==PackageManager.PERMISSION_GRANTED)start();else showError("माइक की अनुमति नहीं मिली। बड़े बटन से पढ़िए।");}
    public boolean permissionPending(){return permissionPending;}
    private void start(){start(true);}
    private void start(boolean preferOnDevice){
        if(dialog==null||!new Config(host).voiceCommandsEnabled())return;
        dispose();reader.stop();
        if(host.checkSelfPermission(Manifest.permission.RECORD_AUDIO)!=PackageManager.PERMISSION_GRANTED){status.setText("बोलने के लिए माइक की अनुमति दें।");permissionPending=true;host.requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO},MICROPHONE_REQUEST);return;}
        final long id=++session;listening=true;retry.setEnabled(false);status.setText("बीप के बाद बोलिए।");
        RecognitionListener listener=new RecognitionListener(){
            private boolean active(){return dialog!=null&&listening&&id==session;}
            public void onReadyForSpeech(Bundle b){if(active())status.setText("अब बोलिए…");}
            public void onBeginningOfSpeech(){}public void onRmsChanged(float rms){}public void onBufferReceived(byte[] buffer){}
            public void onEndOfSpeech(){if(active())status.setText("समझ रहे हैं…");}
            public void onError(int error){if(!active())return;if(usingOnDevice&&(error==SpeechRecognizer.ERROR_LANGUAGE_NOT_SUPPORTED||error==SpeechRecognizer.ERROR_LANGUAGE_UNAVAILABLE)&&(factory!=null||SpeechRecognizer.isRecognitionAvailable(host))){start(false);return;}showError(error==SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS?"माइक की अनुमति जाँचें। बड़े बटन भी चलेंगे।":error==SpeechRecognizer.ERROR_LANGUAGE_NOT_SUPPORTED||error==SpeechRecognizer.ERROR_LANGUAGE_UNAVAILABLE?"हिंदी बोलने की सेवा नहीं मिली। परिवार की मदद लें, या बड़े बटन दबाएँ।":"नहीं सुन पाए। फिर बोलिए दबाएँ।");}
            public void onResults(Bundle b){if(!active())return;ArrayList<String> words=b==null?null:b.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);VoiceCommand command=words==null||words.isEmpty()?VoiceCommand.UNKNOWN:VoiceCommand.parse(words.get(0));if(command==VoiceCommand.UNKNOWN){showError("नहीं समझे। पढ़िए, फिर सुनिए, धीरे सुनिए या रोकिए बोलें।");return;}close();actions.run(command);}
            public void onPartialResults(Bundle b){}public void onEvent(int type,Bundle b){}
        };
        try{
            usingOnDevice=preferOnDevice&&Build.VERSION.SDK_INT>=31;
            if(factory!=null)engine=factory.create(listener,usingOnDevice);
            else{
                boolean onDevice=preferOnDevice&&Build.VERSION.SDK_INT>=31&&SpeechRecognizer.isOnDeviceRecognitionAvailable(host);usingOnDevice=onDevice;
                if(!onDevice&&!SpeechRecognizer.isRecognitionAvailable(host)){showError("आवाज़ पहचानने की सेवा नहीं मिली। बड़े बटन से पढ़िए।");return;}
                SpeechRecognizer recognizer=onDevice?SpeechRecognizer.createOnDeviceSpeechRecognizer(host):SpeechRecognizer.createSpeechRecognizer(host);recognizer.setRecognitionListener(listener);
                engine=new Engine(){public void start(Intent intent){recognizer.startListening(intent);}public void destroy(){recognizer.cancel();recognizer.destroy();}};
            }
            Intent intent=new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,RecognizerIntent.LANGUAGE_MODEL_FREE_FORM).putExtra(RecognizerIntent.EXTRA_LANGUAGE,"hi-IN").putExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE,true).putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS,false).putExtra(RecognizerIntent.EXTRA_MAX_RESULTS,1).putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE,host.getPackageName());
            tone=new ToneGenerator(AudioManager.STREAM_MUSIC,55);tone.startTone(ToneGenerator.TONE_PROP_BEEP,100);
            main.postDelayed(()->{if(dialog==null||id!=session||!listening)return;if(tone!=null){tone.release();tone=null;}try{engine.start(intent);}catch(RuntimeException e){showError("आवाज़ शुरू नहीं हुई। फिर बोलिए या बड़े बटन दबाएँ।");}},180);
            main.postDelayed(()->{if(dialog!=null&&id==session&&listening)showError("समय पूरा हुआ। फिर बोलिए दबाएँ।");},15000);
        }catch(RuntimeException error){showError("आवाज़ शुरू नहीं हुई। बड़े बटन से पढ़िए।");}
    }
    private void showError(String text){dispose();if(dialog!=null){status.setText(text);retry.setEnabled(true);reader.announce(text);}}
    private void dispose(){session++;listening=false;main.removeCallbacksAndMessages(null);if(tone!=null){tone.release();tone=null;}if(engine!=null){Engine old=engine;engine=null;try{old.destroy();}catch(RuntimeException ignored){}}}
    public void onReaderChanged(){if(dialog!=null&&listening&&reader.busy())showError("पहले आवाज़ रुकने दें। फिर बोलिए दबाएँ।");}
    public void close(){permissionPending=false;reader.removeListener(this);dispose();if(dialog!=null){Dialog old=dialog;dialog=null;old.dismiss();}}
}
