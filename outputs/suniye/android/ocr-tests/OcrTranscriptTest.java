import in.suniye.app.OcrTranscript;
class OcrTranscriptTest {
 static void check(boolean x){if(!x)throw new AssertionError();}
 public static void main(String[] args){
 OcrTranscript t=new OcrTranscript();t.word("बिल",1);t.word("₹1,250",.2f);for(int i=0;i<18;i++)t.word("पाठ",.99f);t.line();check(t.readable());check(t.unclear()==1);check(!t.spoken().contains("1,250"));check(t.spoken().startsWith(OcrTranscript.WARNING));check(t.spoken().contains("[अस्पष्ट संख्या]"));
 OcrTranscript bad=new OcrTranscript();bad.word("संख्या",Float.NaN);bad.word("123",.1f);check(!bad.readable());check(!bad.spoken().contains("123"));
 OcrTranscript edge=new OcrTranscript();for(int i=0;i<9;i++)edge.word("स्पष्ट",.85f);edge.word("अनिश्चित",.8499f);check(edge.readable());edge.word("अनिश्चित",Float.POSITIVE_INFINITY);check(!edge.readable());
 OcrTranscript clean=new OcrTranscript();clean.word("मंगलवार",.99f);clean.line();clean.word("कल",.99f);check(clean.spoken().equals("मंगलवार\nकल"));check(clean.readable());check(!new OcrTranscript().readable());
 check(!t.reviewed().contains("1,250"));check(t.reviewed().contains("अस्पष्ट संख्या"));check(t.reviewable());check(t.reviewed().startsWith(OcrTranscript.REVIEW_WARNING));
 OcrTranscript dev=new OcrTranscript();dev.word("१२५०",.3f);for(int i=0;i<5;i++)dev.word("पाठ",.99f);check(!dev.reviewed().contains("१२५०"));check(dev.reviewable());check(!bad.reviewable());
 OcrTranscript split=new OcrTranscript();split.word("₹",1);split.word("1",1);split.word("250",.2f);split.word("रुपये",1);split.word("बाकी",1);check(split.reviewBody().equals("[अस्पष्ट संख्या] बाकी"));
 OcrTranscript words=new OcrTranscript();words.word("पाँच",.7f);words.word("सौ",1);words.word("रुपये",1);check(words.reviewBody().equals("[अस्पष्ट संख्या]"));
 OcrTranscript look=new OcrTranscript();look.word("O",.1f);look.word("125",1);check(look.reviewBody().equals("[अस्पष्ट संख्या]"));
 OcrTranscript lines=new OcrTranscript();lines.word("1",1);lines.line();lines.word("250",.2f);check(lines.reviewBody().equals("[अस्पष्ट संख्या]"));
 System.out.println("PASS: numeric masking, voiced warning, 90% bound, finite confidence, line order, empty input");}}
