package in.suniye.app;
import android.accessibilityservice.AccessibilityService;
import android.graphics.Bitmap;
import android.graphics.Rect;
import android.hardware.HardwareBuffer;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.view.*;
import android.view.accessibility.*;
import android.widget.*;
import java.util.List;
public final class ScreenReaderService extends AccessibilityService implements ReaderController.Listener {
    private ReaderController reader;private Config config;private WindowManager wm;private LinearLayout panel,more;private Button main;private String foreground="";private int window=-1;private long owner=-1;private final Handler handler=new Handler(Looper.getMainLooper());
    private boolean target(String name){return name.equals("com.whatsapp")||name.equals("com.whatsapp.w4b")||(BuildConfig.DEBUG&&name.equals(getPackageName()));}
    @Override protected void onServiceConnected(){reader=SuniyeApp.reader(this);config=new Config(this);wm=getSystemService(WindowManager.class);reader.addListener(this);updateTarget();}
    @Override public void onAccessibilityEvent(AccessibilityEvent event){if(reader==null)return;String name=event.getPackageName()==null?"":event.getPackageName().toString();updateTarget();}
    private void updateTarget(){AccessibilityWindowInfo selected=findWindow();AccessibilityNodeInfo node=selected==null?null:selected.getRoot();String name=node!=null&&node.getPackageName()!=null?node.getPackageName().toString():"";int id=selected==null?-1:selected.getId();if(node!=null)node.recycle();
        if(!name.equals(foreground)||id!=window){if(owner>=0&&reader.current(owner)&&reader.busy())reader.stop();foreground=name;window=id;}
        android.media.AudioManager audio=getSystemService(android.media.AudioManager.class);boolean call=audio.getMode()==android.media.AudioManager.MODE_IN_CALL||audio.getMode()==android.media.AudioManager.MODE_IN_COMMUNICATION;if(call){if(reader.busy())reader.stop();hide();}else if(target(foreground)&&config.acknowledged()){show();}else hide();}
    private void show(){if(panel!=null)return;panel=Ui.column(this);panel.setPadding(Ui.dp(this,4),Ui.dp(this,4),Ui.dp(this,4),Ui.dp(this,4));panel.setBackground(Ui.background(Ui.PAPER,Ui.TEAL,Ui.dp(this,18)));
        main=Ui.button(this,reader.busy()?"रोकिए":"सुनिए",true);main.setTextSize(25);main.setMinHeight(Ui.dp(this,80));main.setMinimumHeight(Ui.dp(this,80));panel.addView(main,new LinearLayout.LayoutParams(Ui.dp(this,132),-2));main.setOnClickListener(v->{if(reader.busy())reader.stop();else capture();});
        Button options=Ui.button(this,"और",false);options.setTextSize(22);options.setMinHeight(Ui.dp(this,56));options.setMinimumHeight(Ui.dp(this,56));panel.addView(options,new LinearLayout.LayoutParams(-1,-2));
        more=Ui.column(this);more.setVisibility(View.GONE);panel.addView(more);options.setOnClickListener(v->{more.setVisibility(more.getVisibility()==View.GONE?View.VISIBLE:View.GONE);options.setText(more.getVisibility()==View.VISIBLE?"कम":"और");});
        action("फिर सुनिए",()->reader.repeat());action("धीरे",()->reader.slower());action("समझाइए",()->reader.explain());
        WindowManager.LayoutParams p=new WindowManager.LayoutParams(-2,-2,WindowManager.LayoutParams.TYPE_ACCESSIBILITY_OVERLAY,WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,android.graphics.PixelFormat.TRANSLUCENT);p.gravity=Gravity.TOP|(config.placement().equals("right")?Gravity.RIGHT:Gravity.LEFT);p.x=Ui.dp(this,8);p.y=Ui.dp(this,110);wm.addView(panel,p);}
    private void action(String label,Runnable run){Button b=Ui.button(this,label,false);b.setTextSize(21);b.setMinHeight(Ui.dp(this,56));b.setMinimumHeight(Ui.dp(this,56));more.addView(b,new LinearLayout.LayoutParams(-1,-2));b.setOnClickListener(v->{more.setVisibility(View.GONE);run.run();owner=reader.generation();});}
    private void hide(){if(panel!=null){try{wm.removeView(panel);}catch(Exception ignored){}panel=null;main=null;more=null;}}
    private AccessibilityWindowInfo findWindow(){AccessibilityWindowInfo top=null;for(AccessibilityWindowInfo w:getWindows())if(w.getType()==AccessibilityWindowInfo.TYPE_APPLICATION&&(top==null||w.getLayer()>top.getLayer()))top=w;return top;}
    private boolean stillTarget(String name,int id){AccessibilityWindowInfo w=findWindow();AccessibilityNodeInfo n=w==null?null:w.getRoot();boolean okay=w!=null&&w.getId()==id&&n!=null&&n.getPackageName()!=null&&name.contentEquals(n.getPackageName());if(n!=null)n.recycle();return okay;}
    private Rect captureBounds(AccessibilityWindowInfo w){Rect r=new Rect();w.getBoundsInScreen(r);AccessibilityNodeInfo root=w.getRoot();Rect picture=new Rect();if(root!=null){imageBounds(root,picture,0);root.recycle();}if(!picture.isEmpty())r.intersect(picture);int top=getResources().getIdentifier("status_bar_height","dimen","android"),bottom=getResources().getIdentifier("navigation_bar_height","dimen","android");r.top=Math.max(r.top,top==0?Ui.dp(this,24):getResources().getDimensionPixelSize(top));r.bottom=Math.min(r.bottom,getResources().getDisplayMetrics().heightPixels-(bottom==0?Ui.dp(this,24):getResources().getDimensionPixelSize(bottom)));return r;}
    private void imageBounds(AccessibilityNodeInfo node,Rect best,int depth){if(depth>35)return;Rect r=new Rect();node.getBoundsInScreen(r);if(node.isVisibleToUser()&&node.getClassName()!=null&&node.getClassName().toString().contains("ImageView")&&r.width()>Ui.dp(this,180)&&r.height()>Ui.dp(this,120)&&r.width()*r.height()>best.width()*best.height())best.set(r);for(int i=0;i<node.getChildCount();i++){AccessibilityNodeInfo child=node.getChild(i);if(child!=null){imageBounds(child,best,depth+1);child.recycle();}}}
    private boolean obstructed(Rect bounds,int id){for(AccessibilityWindowInfo w:getWindows()){if(w.getId()==id||w.getType()==AccessibilityWindowInfo.TYPE_ACCESSIBILITY_OVERLAY)continue;Rect r=new Rect();w.getBoundsInScreen(r);if(Rect.intersects(bounds,r))return true;}return false;}
    private Rect panelBounds(){Rect r=new Rect();if(panel!=null){int[] location=new int[2];panel.getLocationOnScreen(location);r.set(location[0],location[1],location[0]+panel.getWidth(),location[1]+panel.getHeight());}return r;}
    private void capture(){final String name=foreground;final int id=window;owner=reader.beginCapture();final long operation=owner;
        AccessibilityWindowInfo selected=findWindow();if(selected==null||!stillTarget(name,id)){reader.captureFailed("संदेश खोलकर फिर सुनिए दबाएँ।",operation);return;}
        AccessibilityNodeInfo root=selected.getRoot();StringBuilder text=new StringBuilder();boolean image=root!=null&&collect(root,text,0);if(root!=null)root.recycle();
        if(!image&&text.length()>0&&text.length()<=12000){reader.readTextForOperation(text.toString(),operation);return;}
        final Rect fullBounds=new Rect();selected.getBoundsInScreen(fullBounds);final Rect bounds=captureBounds(selected);if(Build.VERSION.SDK_INT<34&&Rect.intersects(bounds,panelBounds())){reader.captureFailed("बटन चित्र को ढक रहा है। परिवार के सदस्य से बटन दूसरी जगह करवाएँ, या चित्र ऐप में खोलकर पढ़िए।",operation);return;}if(bounds.isEmpty()||obstructed(bounds,id)){reader.captureFailed("कीबोर्ड या सूचना बंद करके फिर सुनिए दबाएँ।",operation);return;}
        TakeScreenshotCallback callback=new TakeScreenshotCallback(){
            @Override public void onSuccess(ScreenshotResult result){HardwareBuffer buffer=result.getHardwareBuffer();Bitmap wrapped=null,copy=null;try{wrapped=Bitmap.wrapHardwareBuffer(buffer,result.getColorSpace());if(wrapped!=null)copy=wrapped.copy(Bitmap.Config.ARGB_8888,false);}finally{if(wrapped!=null)wrapped.recycle();buffer.close();}final Bitmap bitmap=copy;
                if(!reader.current(operation)||!stillTarget(name,id)||obstructed(bounds,id)){if(bitmap!=null)bitmap.recycle();if(reader.current(operation))reader.captureFailed("स्क्रीन बदल गई। फिर सुनिए दबाएँ।",operation);return;}if(bitmap==null){reader.captureFailed("स्क्रीन पढ़ नहीं पाए। फिर कोशिश करें।",operation);return;}
                Rect mask=panelBounds();
                reader.readImageForOperation(()->{try{int x=Build.VERSION.SDK_INT>=34?fullBounds.left:0,y=Build.VERSION.SDK_INT>=34?fullBounds.top:0;Rect crop=new Rect(bounds);crop.offset(-x,-y);if(!crop.intersect(0,0,bitmap.getWidth(),bitmap.getHeight())||crop.isEmpty())throw new UserMessage("स्क्रीन बदल गई। फिर सुनिए दबाएँ।");Bitmap out=Bitmap.createBitmap(bitmap,crop.left,crop.top,crop.width(),crop.height());if(out==bitmap)out=bitmap.copy(Bitmap.Config.ARGB_8888,true);else if(!out.isMutable()){Bitmap mutable=out.copy(Bitmap.Config.ARGB_8888,true);out.recycle();out=mutable;}
                    long sum=0;int samples=0;for(int py=0;py<out.getHeight();py+=32)for(int px=0;px<out.getWidth();px+=32){int c=out.getPixel(px,py);sum+=android.graphics.Color.red(c)+android.graphics.Color.green(c)+android.graphics.Color.blue(c);samples++;}if(samples==0||sum/samples<12){out.recycle();throw new UserMessage("इस अँधेरी या सुरक्षित स्क्रीन को नहीं पढ़ सकते।");}                    if(Build.VERSION.SDK_INT<34&&!mask.isEmpty()){mask.offset(-crop.left,-crop.top);android.graphics.Paint paint=new android.graphics.Paint();paint.setColor(android.graphics.Color.WHITE);new android.graphics.Canvas(out).drawRect(mask,paint);}
return out;
                }finally{bitmap.recycle();}},operation);}
            @Override public void onFailure(int error){reader.captureFailed(error==ERROR_TAKE_SCREENSHOT_SECURE_WINDOW?"इस सुरक्षित स्क्रीन को नहीं पढ़ सकते।":"स्क्रीन पढ़ नहीं पाए। थोड़ा रुककर फिर सुनिए दबाएँ।",operation);}
        };
        try{if(Build.VERSION.SDK_INT>=34)takeScreenshotOfWindow(id,getMainExecutor(),callback);else takeScreenshot(Display.DEFAULT_DISPLAY,getMainExecutor(),callback);}catch(Exception e){reader.captureFailed("स्क्रीन की अनुमति फिर जाँचें।",operation);}
    }
    private boolean collect(AccessibilityNodeInfo n,StringBuilder text,int depth){if(depth>35||text.length()>12000)return true;Rect bounds=new Rect();n.getBoundsInScreen(bounds);boolean image=n.isVisibleToUser()&&n.getClassName()!=null&&n.getClassName().toString().contains("ImageView")&&bounds.width()>Ui.dp(this,180)&&bounds.height()>Ui.dp(this,120);
        if(n.isVisibleToUser()&&!n.isEditable()&&n.getText()!=null&&n.getClassName()!=null&&n.getClassName().toString().contains("TextView")){if(text.length()>0)text.append('\n');text.append(n.getText());}
        for(int i=0;i<n.getChildCount();i++){AccessibilityNodeInfo child=n.getChild(i);if(child!=null){image|=collect(child,text,depth+1);child.recycle();}}return image;}
    private void restore(){if(panel!=null)panel.setVisibility(View.VISIBLE);}
    @Override public void onReaderChanged(){if(panel!=null)panel.setKeepScreenOn(reader.busy());if(main!=null){main.setText(reader.busy()?"रोकिए":"सुनिए");main.setContentDescription(main.getText());restore();}}
    @Override public void onInterrupt(){if(reader!=null&&owner>=0&&reader.current(owner))reader.stop();hide();}
    @Override public void onDestroy(){if(reader!=null){if(owner>=0&&reader.current(owner))reader.stop();reader.removeListener(this);}hide();super.onDestroy();}
}
