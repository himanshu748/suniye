package in.suniye.app;
public final class VoicePolicy {
    public static final String RAJU="zT03pEAEi0VHKciJODfn";
    private VoicePolicy(){}
    public static boolean allowed(String provider,String voiceId){return "elevenlabs".equals(provider)&&RAJU.equals(voiceId);}
}
