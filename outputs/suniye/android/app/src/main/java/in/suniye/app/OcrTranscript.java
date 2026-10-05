package in.suniye.app;
import java.util.ArrayList;
import java.util.List;
/** OCR confidence is a heuristic. No invented corrections; uncertain numeric runs are withheld. */
public final class OcrTranscript {
 public static final String UNCLEAR="[अस्पष्ट शब्द]";
 public static final String WARNING="कुछ शब्द साफ़ नहीं हैं। उनकी जगह अस्पष्ट शब्द या अस्पष्ट संख्या सुनाई देगा। ज़रूरी जानकारी मूल कागज़ से जाँचें।\n\n";
 public static final String REVIEW_WARNING="यह चित्र से पहचाना गया पाठ है। इसमें गलतियाँ हो सकती हैं। कुछ अस्पष्ट अंकों की जगह संकेत सुनाई देगा। ज़रूरी जानकारी मूल कागज़ से जाँचें।\n\n";
 private record Token(String value,boolean certain,boolean numeric){}
 private int words,unclear;private final List<Token> tokens=new ArrayList<>();
 public void word(String value,float confidence){if(value==null||value.isBlank())return;words++;boolean certain=Float.isFinite(confidence)&&confidence>=.85f;if(!certain)unclear++;tokens.add(new Token(value,certain,numeric(value)));}
 public void line(){tokens.add(new Token("\n",true,false));}
 public int words(){return words;}public int unclear(){return unclear;}
 public boolean readable(){return words>0&&unclear<=30&&unclear*10<=words;}
 public boolean reviewable(){return words>=5&&unclear*2<=words;}
 public String marked(){return render(false);}
 public String spoken(){return (unclear>0?WARNING:"")+marked();}
 public String reviewBody(){return render(true);}
 public String reviewed(){return REVIEW_WARNING+reviewBody();}
 private static boolean numeric(String value){String plain=value.replaceAll("^[\\p{P}]+|[\\p{P}]+$","");return value.matches("(?s).*[0-9०-९].*")||HindiSpeech.isNumberWord(plain)||plain.matches("(?i)(?:₹|Rs|INR|रु|रुपये|रुपया|पैसे|प्रतिशत|%|[OIl]+)")||value.matches("[,./:−+%-]+");}
 private String render(boolean review){StringBuilder out=new StringBuilder();boolean lineStart=true;for(int i=0;i<tokens.size();i++){
  Token t=tokens.get(i);if(t.value.equals("\n")){if(!lineStart)out.append('\n');lineStart=true;continue;}
  String value=review||t.certain?t.value:UNCLEAR;
  if(t.numeric){int end=i;boolean uncertain=!t.certain;while(end+1<tokens.size()){Token next=tokens.get(end+1);if(next.value.equals("\n")){if(end+2<tokens.size()&&tokens.get(end+2).numeric){end++;continue;}break;}if(!next.numeric)break;end++;uncertain|=!next.certain;}
   if(uncertain){value="[अस्पष्ट संख्या]";i=end;}
  }
  if(!lineStart)out.append(' ');out.append(value);lineStart=false;
 }return out.toString().trim();}
}
