package in.suniye.app;
/** Fixed status clips were recorded by ElevenLabs Raju; never synthesize with a phone engine. */
public final class VoicePrompts {
    private VoicePrompts(){}
    public static String asset(String message){
        if(message.startsWith("बिल या कागज़ के लिए"))return "parent-help";
        if(message.contains("आवाज़ नहीं मिली")||message.contains("इंटरनेट"))return "unavailable";
        if(message.contains("सेटिंग सहेज"))return "saved";
        if(message.contains("सुरक्षित स्क्रीन"))return "protected";
        if(message.contains("स्क्रीन बदल"))return "changed";
        if(message.contains("पढ़ रहे")||message.contains("समझा रहे"))return "busy";
        if(message.contains("छोटा")||message.contains("साफ़")||message.contains("दोबारा चित्र"))return "retake";
        if(message.contains("पहले")||message.contains("संदेश खोल")||message.contains("चित्र खोल"))return "open";
        return "setup"; // Generic help clip; the specific error remains visible on screen.
    }
}
