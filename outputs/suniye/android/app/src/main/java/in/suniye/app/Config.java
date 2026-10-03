package in.suniye.app;
import android.content.Context;
import android.content.SharedPreferences;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Base64;
import java.net.URI;
import java.security.KeyStore;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;

public final class Config {
    private final SharedPreferences prefs;
    private static final String ALIAS="suniye-family-access";
    public Config(Context c){prefs=c.getSharedPreferences("family",Context.MODE_PRIVATE);}
    public String endpoint(){return prefs.getString("endpoint","");}
    public String placement(){return prefs.getString("placement","left");}
    public boolean onlineVoice(){return prefs.getBoolean("onlineVoice",false);}
    public void setOnlineVoice(boolean enabled){prefs.edit().putBoolean("onlineVoice",enabled).apply();}
    public float speed(){return prefs.getFloat("speed",0.85f);}
    public String profile(){return prefs.getString("profile","parent");}
    public boolean acknowledged(){return prefs.getBoolean("screenConsent",false);}
    public void acknowledge(){prefs.edit().putBoolean("screenConsent",true).apply();}
    public void setSpeed(float speed){prefs.edit().putFloat("speed",Math.max(.5f,Math.min(1.2f,speed))).apply();}
    public void setPlacement(String side){prefs.edit().putString("placement",side.equals("right")?"right":"left").apply();}
    public void save(String endpoint,String token,String profile)throws Exception{
        String clean=endpoint.trim().replaceAll("/+$","");
        if(!clean.isEmpty()) {
            URI uri;try{uri=new URI(clean);}catch(java.net.URISyntaxException error){throw new UserMessage("सर्वर का सही HTTPS पता लिखें।");}String host=uri.getHost();
            boolean local=BuildConfig.DEBUG && ("10.0.2.2".equals(host)||"127.0.0.1".equals(host)||"localhost".equals(host));
            if(host==null || uri.getUserInfo()!=null || uri.getQuery()!=null || uri.getFragment()!=null || !("https".equals(uri.getScheme()) || local && "http".equals(uri.getScheme()))) throw new UserMessage("सर्वर का सही HTTPS पता लिखें।");
            if(token.length()<32)throw new UserMessage("परिवार का एक्सेस टोकन पूरा लिखें (कम से कम 32 अक्षर)।");
        }
        if(!profile.matches("[a-zA-Z0-9_-]{1,40}"))throw new UserMessage("प्रोफ़ाइल का नाम mother या father जैसे छोटे अंग्रेज़ी नाम में लिखें।");
        Cipher cipher=Cipher.getInstance("AES/GCM/NoPadding");cipher.init(Cipher.ENCRYPT_MODE,key());
        String encrypted=Base64.encodeToString(cipher.doFinal(token.getBytes(java.nio.charset.StandardCharsets.UTF_8)),Base64.NO_WRAP);
        prefs.edit().putString("endpoint",clean).putString("token",encrypted).putString("iv",Base64.encodeToString(cipher.getIV(),Base64.NO_WRAP)).putString("profile",profile).apply();
    }
    public String token(){
        try {
            String token=prefs.getString("token","");if(token.isEmpty())return "";
            Cipher cipher=Cipher.getInstance("AES/GCM/NoPadding");cipher.init(Cipher.DECRYPT_MODE,key(),new GCMParameterSpec(128,Base64.decode(prefs.getString("iv",""),Base64.NO_WRAP)));
            return new String(cipher.doFinal(Base64.decode(token,Base64.NO_WRAP)),java.nio.charset.StandardCharsets.UTF_8);
        }catch(Exception e){return "";}
    }
    private SecretKey key()throws Exception{
        KeyStore store=KeyStore.getInstance("AndroidKeyStore");store.load(null);
        if(store.containsAlias(ALIAS))return (SecretKey)store.getKey(ALIAS,null);
        KeyGenerator generator=KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES,"AndroidKeyStore");
        generator.init(new KeyGenParameterSpec.Builder(ALIAS,KeyProperties.PURPOSE_ENCRYPT|KeyProperties.PURPOSE_DECRYPT).setBlockModes(KeyProperties.BLOCK_MODE_GCM).setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE).build());
        return generator.generateKey();
    }
}
