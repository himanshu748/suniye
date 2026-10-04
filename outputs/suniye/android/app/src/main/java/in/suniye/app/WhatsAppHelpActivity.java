package in.suniye.app;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.widget.*;
/** Large steps with an always-reachable exit; no private content is accessed here. */
public final class WhatsAppHelpActivity extends Activity {
 @Override public void onCreate(Bundle state){super.onCreate(state);Button back=Ui.button(this,"वापस",true);back.setOnClickListener(v->finish());LinearLayout root=Ui.screenWithControls(this,back);
  Ui.add(root,Ui.text(this,"WhatsApp से सुनिए",28,Ui.INK,true),-2,0);
  Ui.add(root,Ui.text(this,"१. WhatsApp में संदेश खोलें।",24,Ui.INK,false),-2,20);
  Ui.add(root,Ui.text(this,"२. स्क्रीन के ऊपर "+(new Config(this).placement().equals("right")?"दाईं":"बाईं")+" ओर हरा सुनिए बटन दबाएँ।",24,Ui.INK,false),-2,20);
  Ui.add(root,Ui.text(this,"३. आवाज़ सुनें। रोकने के लिए फिर हरा बटन दबाएँ।",24,Ui.INK,false),-2,20);
  Button open=Ui.button(this,"WhatsApp खोलिए",true);open.setOnClickListener(v->open());Ui.add(root,open,-2,24);
  Ui.add(root,Ui.text(this,"फ़ोटो या PDF",26,Ui.INK,true),-2,32);
  Ui.add(root,Ui.text(this,"फ़ोटो या PDF खोलें। भेजने वाला बटन (Share) दबाएँ, फिर ऐप की सूची में सुनिए चुनें।",24,Ui.INK,false),-2,16);
  Ui.add(root,Ui.text(this,"हरा बटन नहीं दिखता? परिवार की सेटिंग में उसे चालू करवाएँ।",24,Ui.INK,false),-2,24);
  Button setup=Ui.button(this,"परिवार की सेटिंग",false);setup.setOnClickListener(v->startActivity(new Intent(this,SetupActivity.class)));Ui.add(root,setup,-2,20);
 }
 private void open(){Intent launch=getPackageManager().getLaunchIntentForPackage("com.whatsapp");if(launch==null)launch=getPackageManager().getLaunchIntentForPackage("com.whatsapp.w4b");if(launch==null){SuniyeApp.reader(this).announce("WhatsApp नहीं मिला। परिवार के सदस्य से ऐप की सेटिंग जँचवाएँ।");finish();return;}try{startActivity(launch);}catch(android.content.ActivityNotFoundException e){SuniyeApp.reader(this).announce("WhatsApp अभी नहीं खुला। फिर कोशिश करें।");finish();}}
}
