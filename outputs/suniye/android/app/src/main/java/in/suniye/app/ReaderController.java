package in.suniye.app;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.media.MediaPlayer;
import android.os.Handler;
import android.os.Looper;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.util.Base64;
import org.json.JSONObject;
import java.io.File;
import java.io.FileOutputStream;
import java.net.HttpURLConnection;
import java.util.ArrayList;
import java.util.List;
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
    private MediaPlayer player;private File audioFile;private Future<?> job;
    private final android.media.AudioManager audio;private android.media.AudioFocusRequest focus;private boolean waiting=false;
    private boolean wordHelp=false;private boolean busy=false;private String status="एक बटन दबाएँ, फिर आराम से सुनें।";
    private String original="",lastSpoken="",lastSource="";private byte[] lastAudio;private float lastAudioRate=.85f;

    public ReaderController(Context context){
        this.context=context;audio=context.getSystemService(android.media.AudioManager.class);config=new Config(context);cache=context.getSharedPreferences("last-reading",Context.MODE_PRIVATE);
        wordHelp=cache.getBoolean("wordHelp",false);original=cache.getString("original","");lastSpoken=cache.getString("spoken","");lastSource=cache.getString("source","");
        lastAudioRate=cache.getFloat("audioBaseRate",.85f);if(lastAudioRate!=.85f&&lastAudioRate!=1f)lastAudioRate=.85f;
        File saved=new File(context.getFilesDir(),"last-reading.mp3");try{if(VoicePolicy.allowed(cache.getString("audioProvider",""),cache.getString("audioVoiceId",""))&&saved.exists()&&saved.length()<=5_000_000)lastAudio=java.nio.file.Files.readAllBytes(saved.toPath());}catch(Exception ignored){}

    }
    public void addListener(Listener l){if(!listeners.contains(l))listeners.add(l);l.onReaderChanged();}
    public void removeListener(Listener l){listeners.remove(l);}
    public void documentChanged(){notifyListeners();}
    public boolean busy(){return busy;}
    public boolean hasAudio(){return player!=null;}
    public String status(){return status;}
    public String original(){return original;}
    public String spoken(){return lastSpoken;}
    public boolean isWordHelp(){return wordHelp;}
    public boolean needsOriginalAction(){return wordHelp||lastAudio==null;}
    public void readOriginal(){if(!lastSource.isEmpty())readText(lastSource);else announce("पहले कोई संदेश या कागज़ पढ़िए।");}
    public boolean hasLast(){return !lastSpoken.isEmpty();}
    private void notifyListeners(){for(Listener l:new ArrayList<>(listeners))l.onReaderChanged();}
    public void stop(){
        generation.incrementAndGet();if(job!=null)job.cancel(true);HttpURLConnection active=connection.getAndSet(null);if(active!=null)disconnectWorker.execute(()->{try{active.disconnect();}catch(Exception ignored){}});
        releasePlayer();abandonFocus();waiting=false;busy=false;status="रोक दिया। जब चाहें फिर सुनिए।";notifyListeners();
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
        wordHelp=false;original=text;lastSpoken=text;lastSource=text;lastAudio=null;saveLast();
        if(config.onlineVoice()&&!config.endpoint().isEmpty()){job=worker.submit(()->{try{request(null,text,"read",id);}catch(Exception e){fail(e,id);}});}else announceFor("आवाज़ के लिए परिवार की सेटिंग में ElevenLabs चालू करें।",id);
    }
    public void readImage(ImageLoader loader){readImageForOperation(loader,begin("चित्र पढ़ रहे हैं। रोकने के लिए रोकिए दबाएँ।"));}
    public void readImageForOperation(ImageLoader loader,long id){
        if(!current(id))return;busy=true;status="चित्र पढ़ रहे हैं। थोड़ा इंतज़ार करें।";notifyListeners();
        job=worker.submit(()->{
            Bitmap bitmap=null;
            try{if(!current(id))return;bitmap=loader.load();if(!current(id))return;String text=LocalText.read(bitmap);if(!current(id))return;
                if(!text.isBlank()){main.post(()->{if(current(id))readTextForOperation(text,id);});return;}
                main.post(()->announceFor("चित्र का वर्णन अभी उपलब्ध नहीं है। लिखावट हो तो पास से छोटा और साफ़ हिस्सा दोबारा लें।",id));}
            catch(Exception e){fail(e,id);}finally{if(bitmap!=null&&!bitmap.isRecycled())bitmap.recycle();}
        });
    }
    public void explain(){
        if(lastSource.isEmpty()){announce("पहले कोई संदेश या चित्र पढ़िए।");return;}
        String source=lastSource;long id=begin("शब्दों की मदद पढ़ रहे हैं।");job=worker.submit(()->{try{request(null,source,"explain",id);}catch(Exception e){fail(e,id);}});
    }
    private void request(String image,String text,String mode,long id)throws Exception{
        JSONObject input=new JSONObject().put("requestId",UUID.randomUUID().toString()).put("language","hi").put("mode",mode).put("wantAudio",config.onlineVoice());
        if(image!=null)input.put("image",image);else input.put("text",text);
        JSONObject response=BackendClient.send(config,input,connection,()->!current(id)||Thread.currentThread().isInterrupted());
        main.post(()->{
            if(!current(id))return;
            if("retake".equals(response.optString("kind"))){announceFor(response.optString("retakeReason","पास से साफ़ चित्र दोबारा लें।"),id);return;}
            String spoken=response.optString("spokenText","");if(!"reading".equals(response.optString("kind"))||spoken.isBlank()||spoken.length()>16000){announceFor("यह साफ़ पढ़ नहीं पाया। दोबारा चित्र लें।",id);return;}
            byte[] audio=null;try{String encoded=response.optString("audioBase64","");if(VoicePolicy.allowed(response.optString("audioProvider"),response.optString("audioVoiceId"))&&!encoded.isEmpty()&&encoded.length()<6_800_000)audio=Base64.decode(encoded,Base64.DEFAULT);}catch(Exception ignored){}
            double providerRate=response.optDouble("audioBaseRate",.85);final float audioRate=(providerRate==1)?1f:.85f;
            wordHelp="explain".equals(mode);
            lastAudioRate=audioRate;original=response.optString("originalText","");
            lastSpoken=spoken;lastSource=original.isBlank()?spoken:original;lastAudio=audio;saveLast();
            status=wordHelp?"शब्दों की मदद सुनिए।":"सुनिए।";notifyListeners();speak(spoken,audio,id,audioRate);
        });
    }
    private void fail(Exception error,long id){main.post(()->{if(!current(id))return;String message=error instanceof UserMessage?error.getMessage():"अभी पढ़ नहीं पा रहे हैं। इंटरनेट जाँचकर फिर कोशिश करें।";announceFor(message,id);});}
    public void repeat(){if(!hasLast()){announce("पहले कोई संदेश या कागज़ पढ़िए।");return;}if(lastAudio==null){announce("सहेजी हुई आवाज़ नहीं मिली। मूल पाठ सुनिए दबाकर नई आवाज़ मँगाएँ।");return;}stop();long id=generation.get();status="फिर सुनिए।";speak(lastSpoken,lastAudio,id);}
    public void slower(){config.setSpeed(Math.max(.5f,config.speed()-.15f));if(hasLast())repeat();else announce(config.speed()<.701f?"अब आवाज़ धीरे पढ़ेगी।":"अब आवाज़ सामान्य गति से पढ़ेगी।");}
    public void announce(String message){stop();announceFor(message,generation.get());}
    public void announceFor(String message,long id){if(!current(id))return;waiting=false;abandonFocus();busy=false;status=message;notifyListeners();prompt(message,id);}
    public void captureFailed(String message,long id){announceFor(message,id);}
    private void haptic(){Vibrator v=context.getSystemService(Vibrator.class);if(v!=null)v.vibrate(VibrationEffect.createOneShot(35,VibrationEffect.DEFAULT_AMPLITUDE));}
    private void prompt(String message,long id){
        if(!current(id))return;
        String asset=VoicePrompts.asset(message);if(asset==null)return;
        try {releasePlayer();abandonFocus();
            if(audio.getStreamVolume(android.media.AudioManager.STREAM_MUSIC)==0){status="आवाज़ बंद है। फ़ोन का आवाज़ बढ़ाने वाला बटन दबाएँ।";notifyListeners();return;}
            focus=new android.media.AudioFocusRequest.Builder(android.media.AudioManager.AUDIOFOCUS_GAIN_TRANSIENT).setAudioAttributes(attributes()).setOnAudioFocusChangeListener(change->{if(change==android.media.AudioManager.AUDIOFOCUS_LOSS||change==android.media.AudioManager.AUDIOFOCUS_LOSS_TRANSIENT)main.post(()->{if(current(id))stop();});}).build();
            if(audio.requestAudioFocus(focus)!=android.media.AudioManager.AUDIOFOCUS_REQUEST_GRANTED){abandonFocus();return;}
            android.content.res.AssetFileDescriptor clip=context.getAssets().openFd("voice/"+asset+".mp3");
            MediaPlayer p=new MediaPlayer();player=p;p.setAudioAttributes(attributes());p.setDataSource(clip.getFileDescriptor(),clip.getStartOffset(),clip.getLength());clip.close();
            p.setOnPreparedListener(ready->{if(!current(id)||player!=ready)return;ready.setPlaybackParams(ready.getPlaybackParams().setSpeed(config.speed()));ready.start();});
            p.setOnCompletionListener(done->{if(player==done){releasePlayer();abandonFocus();}});
            p.setOnErrorListener((failed,w,e)->{if(player==failed){releasePlayer();abandonFocus();}return true;});p.prepareAsync();
        }catch(Exception ignored){releasePlayer();abandonFocus();} // Missing bundled audio stays silent; never use another voice.
    }
    private android.media.AudioAttributes attributes(){return new android.media.AudioAttributes.Builder().setUsage(android.media.AudioAttributes.USAGE_MEDIA).setContentType(android.media.AudioAttributes.CONTENT_TYPE_SPEECH).build();}
    private void speak(String text,byte[] clip,long id){speak(text,clip,id,lastAudioRate);}
    private void voiceUnavailable(long id){if(!current(id))return;releasePlayer();abandonFocus();waiting=false;busy=false;status="आवाज़ नहीं मिली। इंटरनेट और परिवार की सेटिंग जाँचें।";notifyListeners();prompt(status,id);}
    private void speak(String text,byte[] clip,long id,float baseRate){
        if(!current(id))return;releasePlayer();abandonFocus();waiting=false;
        if(clip==null||clip.length==0){voiceUnavailable(id);return;}
        if(audio.getStreamVolume(android.media.AudioManager.STREAM_MUSIC)==0){busy=false;status="आवाज़ बंद है। फ़ोन का आवाज़ बढ़ाने वाला बटन दबाएँ।";haptic();notifyListeners();return;}
        android.media.AudioAttributes attributes=attributes();
        focus=new android.media.AudioFocusRequest.Builder(android.media.AudioManager.AUDIOFOCUS_GAIN_TRANSIENT).setAudioAttributes(attributes).setOnAudioFocusChangeListener(change->{if(change==android.media.AudioManager.AUDIOFOCUS_LOSS||change==android.media.AudioManager.AUDIOFOCUS_LOSS_TRANSIENT)main.post(()->{if(current(id))stop();});}).build();
        if(audio.requestAudioFocus(focus)!=android.media.AudioManager.AUDIOFOCUS_REQUEST_GRANTED){busy=false;status="अभी दूसरी आवाज़ चल रही है। बाद में फिर सुनिए।";notifyListeners();return;}
        busy=true;notifyListeners();
        try{audioFile=File.createTempFile("voice-",".mp3",context.getCacheDir());try(FileOutputStream out=new FileOutputStream(audioFile)){out.write(clip);}MediaPlayer p=new MediaPlayer();player=p;p.setAudioAttributes(attributes);p.setDataSource(audioFile.getAbsolutePath());
            p.setOnPreparedListener(ready->{if(!current(id)||player!=ready)return;ready.setPlaybackParams(ready.getPlaybackParams().setSpeed(config.speed()/baseRate));ready.start();});
            p.setOnCompletionListener(done->{if(current(id)&&player==done){releasePlayer();abandonFocus();busy=false;status="फिर सुनने के लिए फिर सुनिए दबाएँ।";notifyListeners();}});
            p.setOnErrorListener((failed,w,e)->{if(current(id)&&player==failed)voiceUnavailable(id);return true;});p.prepareAsync();
        }catch(Exception ignored){voiceUnavailable(id);}
    }
    private void saveLast(){cache.edit().putBoolean("wordHelp",wordHelp).putString("original",original).putString("spoken",lastSpoken).putString("source",lastSource).putFloat("audioBaseRate",lastAudioRate).putString("audioProvider",lastAudio==null?"":"elevenlabs").putString("audioVoiceId",lastAudio==null?"":VoicePolicy.RAJU).apply();File file=new File(context.getFilesDir(),"last-reading.mp3");try{if(lastAudio==null)file.delete();else try(FileOutputStream out=new FileOutputStream(file)){out.write(lastAudio);}}catch(Exception ignored){file.delete();}}
    public void forget(){stop();SuniyeApp.document(context).clear();wordHelp=false;original="";lastSpoken="";lastSource="";lastAudio=null;cache.edit().clear().apply();new File(context.getFilesDir(),"last-reading.mp3").delete();status="पिछला पढ़ना मिटा दिया।";notifyListeners();}
    private void abandonFocus(){if(focus!=null){audio.abandonAudioFocusRequest(focus);focus=null;}}
    private void releasePlayer(){if(player!=null){player.setOnPreparedListener(null);player.setOnCompletionListener(null);player.setOnErrorListener(null);try{player.stop();}catch(Exception ignored){}player.release();player=null;}if(audioFile!=null){audioFile.delete();audioFile=null;}}
}
