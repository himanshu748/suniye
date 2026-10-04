package in.suniye.app;
import java.text.Normalizer;
import java.util.Locale;
/** Exact commands only: a sentence containing a command never becomes an action. */
public enum VoiceCommand {
    READ, REPEAT, SLOW, STOP, CAMERA, PHOTO, DOCUMENT, EXPLAIN, CAPTURE, UNKNOWN;
    public static VoiceCommand parse(String spoken){
        if(spoken==null||spoken.length()>100)return UNKNOWN;
        String value=Normalizer.normalize(spoken,Normalizer.Form.NFC).toLowerCase(Locale.ROOT).replaceAll("[।.!?,]"," ").trim().replaceAll("\\s+"," ");
        if(value.startsWith("कृपया "))value=value.substring(6).trim();
        if(value.startsWith("please "))value=value.substring(7).trim();
        switch(value){
            case "पढ़िए":case "पढ़िये":case "पढ़ो":case "पढ़कर सुनाओ":case "सुनिए":case "read":case "padho":return READ;
            case "फिर सुनिए":case "फिर सुनिये":case "दोबारा सुनाओ":case "फिर से सुनाओ":case "repeat":case "again":return REPEAT;
            case "धीरे सुनिए":case "धीरे सुनिये":case "धीरे पढ़ो":case "धीरे":case "slow":return SLOW;
            case "रोकिए":case "रोकिये":case "रुको":case "बंद करो":case "बंद कर दो":case "stop":case "ruko":return STOP;
            case "कागज़ पढ़िए":case "कागज पढ़िए":case "कागज पढ़ो":case "कैमरा":case "camera":return CAMERA;
            case "फ़ोटो पढ़िए":case "फोटो पढ़िए":case "फोटो खोलो":case "photo":return PHOTO;
            case "फ़ाइल पढ़िए":case "फाइल पढ़िए":case "फाइल खोलो":case "पीडीएफ":case "pdf":return DOCUMENT;
            case "समझाइए":case "समझाओ":case "explain":return EXPLAIN;
            case "चित्र लेकर सुनिए":case "फोटो लो":case "फ़ोटो लो":case "तस्वीर लो":case "take photo":return CAPTURE;
            default:return UNKNOWN;
        }
    }
}
