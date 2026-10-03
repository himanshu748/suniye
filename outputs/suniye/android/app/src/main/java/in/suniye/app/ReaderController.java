package in.suniye.app;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.media.MediaPlayer;
import android.os.Handler;
import android.os.Looper;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.util.Base64;
import org.json.JSONObject;
import java.io.File;
import java.io.FileOutputStream;
import java.net.HttpURLConnection;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.AtomicReference;

public final class ReaderController {
    public interface Listener {void onReaderChanged();}
    public interface ImageLoader {Bitmap load()throws Exception;}
    private final Context context;private final Config config;private final SharedPreferences cache;
    private final Handler main=new Handler(Looper.getMainLooper());private final ExecutorService worker=Executors.newSingleThreadExecutor();
    private final ExecutorService disconnectWorker=Executors.newSingleThreadExecutor();
    private final AtomicLong generation=new AtomicLong();private final AtomicReference<HttpURLConnection> connection=new AtomicReference<>();
    private final List<Listener> listeners=new ArrayList<>();
    private TextToSpeech tts;private boolean ttsReady=false,ttsFinished=false;private Runnable pendingSpeech;
    private MediaPlayer player;private File audioFile;private Future<?> job;
    private final android.media.AudioManager audio;private android.media.AudioFocusRequest focus;private boolean waiting=false;
    private boolean busy=false;private String status="एक बटन दबाएँ, फिर आराम से सुनें।";
    private String original="",lastSpoken="",lastSource="";private byte[] lastAudio;private int speechChunks=0;

    public ReaderController(Context context){
        this.context=context;audio=context.getSystemService(android.media.AudioManager.class);config=new Config(context);cache=context.getSharedPreferences("last-reading",Context.MODE_PRIVATE);
        original=cache.getString("original","");lastSpoken=cache.getString("spoken","");lastSource=cache.getString("source","");
        File saved=new File(context.getFilesDir(),"last-reading.mp3");try{if(saved.exists()&&saved.length()<=5_000_000)lastAudio=java.nio.file.Files.readAllBytes(saved.toPath());}catch(Exception ignored){}
        tts=new TextToSpeech(context,result->main.post(()->{
            ttsFinished=true;
            if(result==TextToSpeech.SUCCESS){tts.setLanguage(Locale.forLanguageTag("hi-IN"));ttsReady=false;
                if(tts.getVoices()!=null){for(android.speech.tts.Voice voice:tts.getVoices())if(voice.getLocale().getLanguage().equals("hi")&&!voice.isNetworkConnectionRequired()&&(voice.getFeatures()==null||!voice.getFeatures().contains("notInstalled"))){ttsReady=tts.setVoice(voice)!=TextToSpeech.ERROR;break;}}
                tts.setAudioAttributes(new android.media.AudioAttributes.Builder().setUsage(android.media.AudioAttributes.USAGE_MEDIA).setContentType(android.media.AudioAttributes.CONTENT_TYPE_SPEECH).build());}
            if(pendingSpeech!=null){Runnable p=pendingSpeech;pendingSpeech=null;p.run();}
        }));
        tts.setOnUtteranceProgressListener(new UtteranceProgressListener(){
            @Override public void onStart(String id){}
            @Override public void onDone(String id){main.post(()->{if(matches(id)&&--speechChunks<=0){abandonFocus();busy=false;status="फिर सुनने के लिए फिर सुनिए दबाएँ।";notifyListeners();}});}
            @Override public void onError(String id){main.post(()->{if(matches(id)){tts.stop();abandonFocus();busy=false;status="हिंदी आवाज़ के लिए परिवार की सेटिंग खोलें।";notifyListeners();}});}
            private boolean matches(String id){return id!=null&&id.startsWith(generation.get()+"-");}
        });
    }
    public void addListener(Listener l){if(!listeners.contains(l))listeners.add(l);l.onReaderChanged();}
    public void removeListener(Listener l){listeners.remove(l);}
    public void documentChanged(){notifyListeners();}
    public boolean busy(){return busy;}
    public String status(){return status;}
    public String original(){return original;}
    public String spoken(){return lastSpoken;}
    public boolean hasLast(){return !lastSpoken.isEmpty();}
    private void notifyListeners(){for(Listener l:new ArrayList<>(listeners))l.onReaderChanged();}
    public void stop(){
        generation.incrementAndGet();pendingSpeech=null;if(job!=null)job.cancel(true);HttpURLConnection active=connection.getAndSet(null);if(active!=null)disconnectWorker.execute(()->{try{active.disconnect();}catch(Exception ignored){}});
        tts.stop();releasePlayer();abandonFocus();waiting=false;busy=false;speechChunks=0;status="रोक दिया। जब चाहें फिर सुनिए।";notifyListeners();
    }
    private long begin(String message){stop();long id=generation.get();busy=true;waiting=true;status=message;haptic();notifyListeners();prompt(message,id);pulse(id);return id;}
    private void pulse(long id){main.postDelayed(()->{if(current(id)&&waiting&&busy){prompt("अभी पढ़ रहे हैं। रोकने के लिए रोकिए दबाएँ।",id);pulse(id);}},10000);}
    public long beginCapture(){return begin("स्क्रीन पढ़ रहे हैं। रोकने के लिए वही बटन दबाएँ।");}
    public long generation(){return generation.get();}
    public long beginDocument(){return begin("कागज़ पढ़ रहे हैं। रोकने के लिए रोकिए दबाएँ।");}
    public boolean current(long id){return id==generation.get();}
    public void readText(String text){
        if(text==null||text.trim().isEmpty()){announce("पढ़ने के लिए संदेश या चित्र खोलें।");return;}
        if(text.length()>12000){announce("छोटा हिस्सा खोलकर फिर सुनिए दबाएँ।");return;}
        long id=begin("पढ़ रहे हैं।");readTextForOperation(text,id);
    }
    public void readTextForOperation(String text,long id){
        if(!current(id))return;if(text==null||text.isBlank()||text.length()>12000){announceFor("छोटा और साफ़ हिस्सा खोलें।",id);return;}
        original=text;lastSpoken=text;lastSource=text;lastAudio=null;saveLast();
        if(config.onlineVoice()&&!config.endpoint().isEmpty()){job=worker.submit(()->{try{request(null,text,"read",id);}catch(Exception e){main.post(()->{if(current(id)){status="फ़ोन की हिंदी आवाज़ में सुनिए।";speak(text,null,id);}});}});}else speak(text,null,id);
    }
    public void readImage(ImageLoader loader){readImageForOperation(loader,begin("चित्र पढ़ रहे हैं। रोकने के लिए रोकिए दबाएँ।"));}
    public void readImageForOperation(ImageLoader loader,long id){
        if(!current(id))return;busy=true;status="चित्र पढ़ रहे हैं। थोड़ा इंतज़ार करें।";notifyListeners();
        job=worker.submit(()->{
            Bitmap bitmap=null;
            try{if(!current(id))return;bitmap=loader.load();if(!current(id))return;String text=LocalText.read(bitmap);if(!current(id))return;
                if(!text.isBlank()){main.post(()->{if(current(id))readTextForOperation(text,id);});return;}
                String image=ImageInput.encode(bitmap);if(!current(id))return;request(image,null,"read",id);}
            catch(Exception e){fail(e,id);}finally{if(bitmap!=null&&!bitmap.isRecycled())bitmap.recycle();}
        });
    }
    public void explain(){
        if(lastSource.isEmpty()){announce("पहले कोई संदेश या चित्र पढ़िए।");return;}
        String source=lastSource;long id=begin("आसान भाषा में समझा रहे हैं।");job=worker.submit(()->{try{request(null,source,"explain",id);}catch(Exception e){fail(e,id);}});
    }
    private void request(String image,String text,String mode,long id)throws Exception{
        JSONObject input=new JSONObject().put("requestId",UUID.randomUUID().toString()).put("language","hi").put("mode",mode).put("wantAudio",config.onlineVoice());
        if(image!=null)input.put("image",image);else input.put("text",text);
        JSONObject response=BackendClient.send(config,input,connection,()->!current(id)||Thread.currentThread().isInterrupted());
        main.post(()->{
            if(!current(id))return;
            if("retake".equals(response.optString("kind"))){announceFor(response.optString("retakeReason","पास से साफ़ चित्र दोबारा लें।"),id);return;}
            String spoken=response.optString("spokenText","");if(!"reading".equals(response.optString("kind"))||spoken.isBlank()||spoken.length()>16000){announceFor("यह साफ़ पढ़ नहीं पाया। दोबारा चित्र लें।",id);return;}
            byte[] audio=null;try{String encoded=response.optString("audioBase64","");if(!encoded.isEmpty()&&encoded.length()<6_800_000)audio=Base64.decode(encoded,Base64.DEFAULT);}catch(Exception ignored){}
            if(!"explain".equals(mode)){
                original=response.optString("originalText","");lastSpoken=spoken;lastSource=original.isBlank()?spoken:original;lastAudio=audio;saveLast();
            }
            status="explain".equals(mode)?"आसान भाषा में समझा रहे हैं।":"सुनिए।";notifyListeners();speak(spoken,audio,id);
        });
    }
    private void fail(Exception error,long id){main.post(()->{if(!current(id))return;String message=error instanceof UserMessage?error.getMessage():"अभी पढ़ नहीं पा रहे हैं। इंटरनेट जाँचकर फिर कोशिश करें।";announceFor(message,id);});}
    public void repeat(){if(!hasLast()){announce("पहले कोई संदेश या कागज़ पढ़िए।");return;}long id=begin("फिर सुनिए।");speak(lastSpoken,lastAudio,id);}
    public void slower(){config.setSpeed(Math.max(.5f,config.speed()-.15f));if(hasLast())repeat();else announce(config.speed()<.701f?"अब आवाज़ धीरे पढ़ेगी।":"अब आवाज़ सामान्य गति से पढ़ेगी।");}
    public void announce(String message){stop();announceFor(message,generation.get());}
    public void announceFor(String message,long id){if(!current(id))return;waiting=false;abandonFocus();busy=false;status=message;notifyListeners();prompt(message,id);}
    public void captureFailed(String message,long id){announceFor(message,id);}
    private void haptic(){Vibrator v=context.getSystemService(Vibrator.class);if(v!=null)v.vibrate(VibrationEffect.createOneShot(35,VibrationEffect.DEFAULT_AMPLITUDE));}
    private void prompt(String message,long id){
        if(!ttsFinished){pendingSpeech=()->prompt(message,id);return;}
        if(ttsReady&&current(id)){tts.setSpeechRate(config.speed());tts.speak(message,TextToSpeech.QUEUE_FLUSH,null,"prompt");}
    }
    private void speak(String text,byte[] audio,long id){
        if(!current(id))return;
        abandonFocus();waiting=false;tts.stop();
        if(this.audio.getStreamVolume(android.media.AudioManager.STREAM_MUSIC)==0){busy=false;status="आवाज़ बंद है। फ़ोन का आवाज़ बढ़ाने वाला बटन दबाएँ।";haptic();notifyListeners();return;}
        android.media.AudioAttributes attributes=new android.media.AudioAttributes.Builder().setUsage(android.media.AudioAttributes.USAGE_MEDIA).setContentType(android.media.AudioAttributes.CONTENT_TYPE_SPEECH).build();
        focus=new android.media.AudioFocusRequest.Builder(android.media.AudioManager.AUDIOFOCUS_GAIN_TRANSIENT).setAudioAttributes(attributes).setOnAudioFocusChangeListener(change->{if(change==android.media.AudioManager.AUDIOFOCUS_LOSS||change==android.media.AudioManager.AUDIOFOCUS_LOSS_TRANSIENT)main.post(()->{if(current(id))stop();});}).build();
        if(this.audio.requestAudioFocus(focus)!=android.media.AudioManager.AUDIOFOCUS_REQUEST_GRANTED){busy=false;status="अभी दूसरी आवाज़ चल रही है। बाद में फिर सुनिए।";notifyListeners();return;}
        busy=true;notifyListeners();
        if(audio!=null&&audio.length>0){
            try{releasePlayer();audioFile=File.createTempFile("voice-",".mp3",context.getCacheDir());try(FileOutputStream out=new FileOutputStream(audioFile)){out.write(audio);}player=new MediaPlayer();player.setAudioAttributes(attributes);player.setDataSource(audioFile.getAbsolutePath());
                player.setOnPreparedListener(p->{if(!current(id)){releasePlayer();return;}p.setPlaybackParams(p.getPlaybackParams().setSpeed(config.speed()/.85f));p.start();});
                player.setOnCompletionListener(p->{if(current(id)){releasePlayer();abandonFocus();busy=false;status="फिर सुनने के लिए फिर सुनिए दबाएँ।";notifyListeners();}});
                player.setOnErrorListener((p,w,e)->{if(current(id)){releasePlayer();speak(text,null,id);}return true;});player.prepareAsync();return;
            }catch(Exception ignored){releasePlayer();}
        }
        if(!ttsFinished){pendingSpeech=()->speak(text,null,id);return;}
        if(!ttsReady){abandonFocus();busy=false;status="हिंदी आवाज़ अभी तैयार नहीं है। परिवार की सेटिंग में हिंदी आवाज़ चुनें।";notifyListeners();return;}
        tts.setSpeechRate(config.speed());int max=Math.min(3500,TextToSpeech.getMaxSpeechInputLength()-1);List<String> chunks=new ArrayList<>();
        for(int p=0;p<text.length();){int end=Math.min(text.length(),p+max);if(end<text.length()){int space=text.lastIndexOf(' ',end);if(space>p)end=space;}chunks.add(text.substring(p,end));p=end;}
        speechChunks=chunks.size();for(int i=0;i<chunks.size();i++)if(current(id)){int result=tts.speak(chunks.get(i),i==0?TextToSpeech.QUEUE_FLUSH:TextToSpeech.QUEUE_ADD,null,id+"-"+i);if(result==TextToSpeech.ERROR){abandonFocus();tts.stop();busy=false;status="हिंदी आवाज़ की सेटिंग फिर जाँचें।";notifyListeners();break;}}
    }
    private void saveLast(){cache.edit().putString("original",original).putString("spoken",lastSpoken).putString("source",lastSource).apply();File file=new File(context.getFilesDir(),"last-reading.mp3");try{if(lastAudio==null)file.delete();else try(FileOutputStream out=new FileOutputStream(file)){out.write(lastAudio);}}catch(Exception ignored){file.delete();}}
    public void forget(){stop();SuniyeApp.document(context).clear();original="";lastSpoken="";lastSource="";lastAudio=null;cache.edit().clear().apply();new File(context.getFilesDir(),"last-reading.mp3").delete();status="पिछला पढ़ना मिटा दिया।";notifyListeners();}
    private void abandonFocus(){if(focus!=null){audio.abandonAudioFocusRequest(focus);focus=null;}}
    private void releasePlayer(){if(player!=null){player.setOnPreparedListener(null);player.setOnCompletionListener(null);player.setOnErrorListener(null);try{player.stop();}catch(Exception ignored){}player.release();player=null;}if(audioFile!=null){audioFile.delete();audioFile=null;}}
}
