package in.suniye.app;
import android.app.Activity;
import android.graphics.*;
import android.os.Bundle;
import android.widget.*;
public final class FixtureActivity extends Activity {
 @Override public void onCreate(Bundle b){super.onCreate(b);if(getIntent().getBooleanExtra("secure",false))getWindow().addFlags(android.view.WindowManager.LayoutParams.FLAG_SECURE);LinearLayout root=Ui.screen(this);Ui.heading(root,"परीक्षण चित्र","यह असली संदेश नहीं है।");if(getIntent().getBooleanExtra("text",false)){Ui.add(root,Ui.text(this,"कल शाम चार बजे आइए। ₹1,250 — 02/10/2026",30,Ui.INK,false),-2,30);return;}Bitmap image=Bitmap.createBitmap(1000,700,Bitmap.Config.ARGB_8888);Canvas c=new Canvas(image);c.drawColor(Color.WHITE);Paint p=new Paint(Paint.ANTI_ALIAS_FLAG);p.setColor(Color.BLACK);p.setTextSize(62);if(getIntent().getBooleanExtra("clear",false)){p.setTextSize(140);c.drawText("नमस्ते",100,300,p);}else{c.drawText("कल शाम चार बजे आइए।",40,180,p);c.drawText("बिजली बिल: ₹1,250",40,350,p);c.drawText("तारीख: 02/10/2026",40,520,p);}try(java.io.FileOutputStream out=new java.io.FileOutputStream(new java.io.File(getFilesDir(),"fixture-image.jpg"))){image.compress(Bitmap.CompressFormat.JPEG,95,out);}catch(Exception ignored){}ImageView v=new ImageView(this);v.setImageBitmap(image);v.setAdjustViewBounds(true);v.setContentDescription("केवल परीक्षण के लिए हिंदी बिल का चित्र");Ui.add(root,v,-2,30);}
}
