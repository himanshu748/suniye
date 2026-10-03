package in.suniye.app;
import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

public final class Ui {
    public static final int PAPER=Color.rgb(255,249,239),INK=Color.rgb(22,40,39),TEAL=Color.rgb(7,94,84),MUTED=Color.rgb(71,87,82),LINE=Color.rgb(215,223,209);
    public static int dp(Context c,float v){return Math.round(v*c.getResources().getDisplayMetrics().density);}
    public static GradientDrawable background(int color,int stroke,int radius){GradientDrawable b=new GradientDrawable();b.setColor(color);b.setCornerRadius(radius);if(stroke!=0)b.setStroke(2,stroke);return b;}
    public static LinearLayout column(Context c){LinearLayout l=new LinearLayout(c);l.setOrientation(LinearLayout.VERTICAL);return l;}
    public static LinearLayout screen(Activity a){
        ScrollView scroll=new ScrollView(a);scroll.setFillViewport(true);scroll.setBackgroundColor(PAPER);
        LinearLayout root=column(a);int gap=dp(a,24);root.setPadding(gap,gap,gap,gap);
        root.setOnApplyWindowInsetsListener((v,insets)->{android.graphics.Insets sys=insets.getInsets(android.view.WindowInsets.Type.systemBars());v.setPadding(gap,gap+sys.top,gap,gap+sys.bottom);return insets;});
        scroll.addView(root,new ScrollView.LayoutParams(-1,-2));a.setContentView(scroll);return root;
    }
    /** Daily reading controls remain reachable while the paper or transcript scrolls. */
    public static LinearLayout screenWithControls(Activity a,View controls){
        LinearLayout container=column(a);container.setBackgroundColor(PAPER);int gap=dp(a,24);
        container.setOnApplyWindowInsetsListener((v,insets)->{android.graphics.Insets sys=insets.getInsets(android.view.WindowInsets.Type.systemBars());v.setPadding(sys.left,sys.top,sys.right,sys.bottom);return insets;});
        ScrollView scroll=new ScrollView(a);scroll.setFillViewport(true);LinearLayout root=column(a);root.setPadding(gap,gap,gap,gap);scroll.addView(root,new ScrollView.LayoutParams(-1,-2));container.addView(scroll,new LinearLayout.LayoutParams(-1,0,1));
        LinearLayout footer=column(a);footer.setPadding(gap,dp(a,12),gap,dp(a,16));footer.setBackgroundColor(PAPER);footer.addView(controls,new LinearLayout.LayoutParams(-1,-2));container.addView(footer,new LinearLayout.LayoutParams(-1,-2));a.setContentView(container);return root;
    }
    public static TextView text(Context c,String value,float size,int color,boolean bold){TextView v=new TextView(c);v.setText(value);v.setTextSize(size);v.setTextColor(color);v.setLineSpacing(dp(c,4),1.1f);if(bold)v.setTypeface(Typeface.DEFAULT,Typeface.BOLD);return v;}
    public static void add(LinearLayout root,View v,int height,int top){LinearLayout.LayoutParams p=new LinearLayout.LayoutParams(-1,height<0?height:dp(root.getContext(),height));p.topMargin=dp(root.getContext(),top);root.addView(v,p);}
    public static Button button(Context c,String text,boolean primary){
        Button b=new Button(c);b.setText(text);b.setAllCaps(false);b.setTextSize(28);b.setTypeface(Typeface.DEFAULT,Typeface.BOLD);b.setTextColor(new android.content.res.ColorStateList(new int[][]{new int[]{-android.R.attr.state_enabled},new int[]{}},new int[]{MUTED,primary?PAPER:INK}));
        b.setGravity(Gravity.CENTER);b.setPadding(dp(c,12),dp(c,12),dp(c,12),dp(c,12));b.setMinHeight(dp(c,88));b.setMinimumHeight(dp(c,88));
        android.graphics.drawable.StateListDrawable surface=new android.graphics.drawable.StateListDrawable();surface.addState(new int[]{-android.R.attr.state_enabled},background(LINE,LINE,dp(c,24)));surface.addState(new int[]{},background(primary?TEAL:Color.WHITE,primary?0:LINE,dp(c,24)));
        b.setBackground(new android.graphics.drawable.RippleDrawable(android.content.res.ColorStateList.valueOf(primary?Color.argb(65,255,249,239):Color.argb(40,7,94,84)),surface,background(Color.WHITE,0,dp(c,24))));b.setContentDescription(text);return b;
    }
    public static void heading(LinearLayout root,String title,String subtitle){Context c=root.getContext();add(root,text(c,title,40,INK,true),-2,0);if(!subtitle.isEmpty())add(root,text(c,subtitle,23,MUTED,false),-2,8);}
}
