package in.suniye.app;
import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.widget.*;
import java.io.File;
public final class MainActivity extends Activity implements ReaderController.Listener {
    public static final String SHOW_READING="in.suniye.app.SHOW_READING";
    private static final int PICK_PHOTO=51,PICK_DOCUMENT=52;
    private ReaderController reader;private TextView status,transcript;private Button stop;private SuniyeApp.Document document;private long renderedVersion=-1;private boolean cleanedPdfs=false;
    private boolean renderedReading=false,renderedConsent=false;
    private ReaderController controller(){return SuniyeApp.reader(this);}
    @Override public void onCreate(Bundle b){super.onCreate(b);reader=controller();document=SuniyeApp.document(this);if(b!=null&&document.file==null){String path=b.getString("pdf");if(path!=null){File saved=new File(path);try{if(saved.getCanonicalPath().startsWith(getCacheDir().getCanonicalPath()+File.separator)&&saved.exists()){document.file=saved;document.count=b.getInt("count");document.page=Math.max(0,Math.min(b.getInt("page"),document.count-1));document.version++;}}catch(Exception ignored){}}}cleanOrphanedPdfs();build();if(b==null)handle(getIntent());}
    private void build(){renderedVersion=document.version;renderedReading=reader.hasLast();renderedConsent=new Config(this).acknowledged();stop=Ui.button(this,"रोकिए",true);stop.setOnClickListener(v->reader.stop());LinearLayout root=Ui.screenWithControls(this,stop);Ui.add(root,Ui.text(this,"सुनिए",28,Ui.INK,true),-2,0);Ui.add(root,Ui.text(this,"कागज़, फ़ोटो या संदेश सुनिए।",18,Ui.INK,false),-2,8);
        status=Ui.text(this,"",22,Ui.INK,false);status.setAccessibilityLiveRegion(android.view.View.ACCESSIBILITY_LIVE_REGION_POLITE);Ui.add(root,status,-2,18);
        if(!renderedConsent){Button first=Ui.button(this,"पहले सेटिंग कीजिए",true);first.setOnClickListener(v->startActivity(new Intent(this,SetupActivity.class)));Ui.add(root,first,-2,16);}
        if(renderedReading){
        Button again=Ui.button(this,"फिर सुनिए",true);again.setOnClickListener(v->reader.repeat());Ui.add(root,again,-2,16);
        Button slow=Ui.button(this,"धीरे सुनिए",false);slow.setOnClickListener(v->reader.slower());Ui.add(root,slow,-2,16);
        Button explain=Ui.button(this,"आसान भाषा में समझाइए",false);explain.setOnClickListener(v->reader.explain());Ui.add(root,explain,-2,16);
        }
        if(document.file!=null){TextView label=Ui.text(this,"पन्ना "+(document.page+1)+" / "+document.count,24,Ui.INK,true);Ui.add(root,label,-2,16);Button next=Ui.button(this,"अगला पन्ना",false);next.setEnabled(document.page+1<document.count);next.setOnClickListener(v->{document.page++;document.version++;build();readPage();});Ui.add(root,next,-2,12);Button previous=Ui.button(this,"पिछला पन्ना",false);previous.setEnabled(document.page>0);previous.setOnClickListener(v->{document.page--;document.version++;build();readPage();});Ui.add(root,previous,-2,12);}
        transcript=Ui.text(this,reader.original(),26,Ui.INK,false);transcript.setVisibility(reader.original().isEmpty()?android.view.View.GONE:android.view.View.VISIBLE);Ui.add(root,transcript,-2,24);
        Button camera=Ui.button(this,"कागज़ पढ़िए",!renderedReading);camera.setOnClickListener(v->startActivity(new Intent(this,CameraActivity.class)));Ui.add(root,camera,-2,16);
        Button photo=Ui.button(this,"फ़ोटो पढ़िए",false);photo.setOnClickListener(v->pick("image/*",PICK_PHOTO));Ui.add(root,photo,-2,16);
        Button pdf=Ui.button(this,"फ़ाइल पढ़िए",false);pdf.setOnClickListener(v->pick("application/pdf",PICK_DOCUMENT));Ui.add(root,pdf,-2,16);
        Button whatsapp=Ui.button(this,"WhatsApp खोलिए",false);whatsapp.setOnClickListener(v->openWhatsApp());Ui.add(root,whatsapp,-2,16);
        Button setup=Ui.button(this,"परिवार की सेटिंग",false);setup.setTextSize(22);setup.setOnClickListener(v->startActivity(new Intent(this,SetupActivity.class)));Ui.add(root,setup,-2,28);
        onReaderChanged();}
    @Override public void onNewIntent(Intent i){super.onNewIntent(i);setIntent(i);handle(i);}
    private void pick(String type,int request){reader.stop();try{startActivityForResult(new Intent(Intent.ACTION_OPEN_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType(type).addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION),request);}catch(android.content.ActivityNotFoundException e){reader.announce("फ़ाइल खोलने वाला ऐप नहीं मिला। परिवार के सदस्य से मदद लें।");}}
    @Override protected void onActivityResult(int request,int result,Intent data){super.onActivityResult(request,result,data);if(request!=PICK_PHOTO&&request!=PICK_DOCUMENT)return;if(result!=RESULT_OK||data==null||data.getData()==null)return;String type=request==PICK_DOCUMENT?"application/pdf":"image/*";handle(new Intent(Intent.ACTION_VIEW).setDataAndType(data.getData(),type));}
    private void openWhatsApp(){reader.stop();Intent launch=getPackageManager().getLaunchIntentForPackage("com.whatsapp");if(launch==null)launch=getPackageManager().getLaunchIntentForPackage("com.whatsapp.w4b");if(launch==null){reader.announce("WhatsApp नहीं मिला। परिवार के सदस्य से ऐप की सेटिंग जँचवाएँ।");return;}try{startActivity(launch);}catch(android.content.ActivityNotFoundException e){reader.announce("WhatsApp अभी नहीं खुला। फिर कोशिश करें।");}}
    private void handle(Intent i){
        if((i.getFlags()&Intent.FLAG_ACTIVITY_LAUNCHED_FROM_HISTORY)!=0)return;
        if(SHOW_READING.equals(i.getAction())){clearPdf();build();return;}
        if(!Intent.ACTION_SEND.equals(i.getAction())&&!Intent.ACTION_VIEW.equals(i.getAction()))return;
        final String type=i.resolveType(this);
        if("text/plain".equals(type)){final CharSequence text;try{text=i.getCharSequenceExtra(Intent.EXTRA_TEXT);}catch(RuntimeException error){reader.announce("यह संदेश नहीं खुला। WhatsApp में खोलकर फिर कोशिश करें।");return;}if(text==null||text.toString().trim().isEmpty()){reader.announce("यह संदेश नहीं खुला। WhatsApp में खोलकर फिर कोशिश करें।");return;}clearPdf();build();reader.readText(text.toString());return;}
        final Uri uri;
        try{android.os.Parcelable stream=Intent.ACTION_SEND.equals(i.getAction())?i.getParcelableExtra(Intent.EXTRA_STREAM):null;uri=Intent.ACTION_VIEW.equals(i.getAction())?i.getData():stream instanceof Uri?(Uri)stream:null;}catch(RuntimeException e){reader.announce("यह फ़ाइल नहीं खुली। फ़ोटो या फ़ाइल के बटन से चुनें।");return;}
        if(uri==null||!"content".equals(uri.getScheme())||!("application/pdf".equals(type)||type!=null&&type.startsWith("image/"))){reader.announce("यह फ़ाइल नहीं खोल सकते। फ़ोटो या फ़ाइल के बटन से चुनें।");return;}
        if("application/pdf".equals(type)){clearPdf();long operation=reader.beginDocument();final long version=document.version;final android.content.Context context=getApplicationContext();final SuniyeApp.Document owned=document;reader.readImageForOperation(()->{File file=ImageInput.copyPdf(context,uri);try{int pages=ImageInput.pdfCount(file);android.graphics.Bitmap rendered=ImageInput.pdfPage(file,0);new android.os.Handler(android.os.Looper.getMainLooper()).post(()->{if(!reader.current(operation)||owned.version!=version){file.delete();return;}owned.replace(file,pages);reader.documentChanged();});return rendered;}catch(Exception error){file.delete();throw error;}},operation);}else{clearPdf();build();reader.readImage(()->ImageInput.fromUri(this,uri));}
    }
    private void readPage(){final File file=document.file;final int index=document.page;reader.readImage(()->ImageInput.pdfPage(file,index));}
    @Override protected void onStart(){super.onStart();reader.addListener(this);}
    @Override protected void onStop(){reader.removeListener(this);if(reader.busy()&&!isChangingConfigurations())reader.stop();super.onStop();}
    @Override public void onReaderChanged(){if(status==null)return;cleanOrphanedPdfs();if(renderedVersion!=document.version||renderedReading!=reader.hasLast()||renderedConsent!=new Config(this).acknowledged()){build();return;}getWindow().getDecorView().setKeepScreenOn(reader.busy());status.setText(reader.status());stop.setEnabled(true);stop.setAlpha(1f);if(transcript!=null){transcript.setText(reader.original());transcript.setVisibility(reader.original().isEmpty()?android.view.View.GONE:android.view.View.VISIBLE);}}
    private void cleanOrphanedPdfs(){if(cleanedPdfs||reader.busy())return;cleanedPdfs=true;File[] files=getCacheDir().listFiles((dir,name)->name.startsWith("document-")&&name.endsWith(".pdf"));if(files!=null)for(File file:files)if(!file.equals(document.file))file.delete();}
    private void clearPdf(){document.clear();}
    @Override protected void onSaveInstanceState(Bundle state){super.onSaveInstanceState(state);if(document.file!=null){state.putString("pdf",document.file.getAbsolutePath());state.putInt("page",document.page);state.putInt("count",document.count);}}
    @Override protected void onDestroy(){if(isFinishing())document.clear();super.onDestroy();}
}
