package in.suniye.app;
import org.json.JSONObject;
import java.net.*;
import java.io.*;
import java.nio.charset.StandardCharsets;
/** Optional caregiver-only preference sync; never accepts reading text or images. */
public final class PreferencesClient {
 public static JSONObject sync(Config config,boolean upload)throws Exception{
  if(config.endpoint().isEmpty()||config.token().isEmpty())throw new UserMessage("पहले सर्वर की सेटिंग सहेजें।");
  HttpURLConnection conn=(HttpURLConnection)new URL(config.endpoint()+"/v1/preferences/"+config.profile()).openConnection();
  try{conn.setConnectTimeout(8000);conn.setReadTimeout(12000);conn.setInstanceFollowRedirects(false);conn.setRequestProperty("Authorization","Bearer "+config.token());conn.setRequestProperty("Content-Type","application/json");conn.setRequestMethod(upload?"PUT":"GET");
   if(upload){JSONObject values=new JSONObject().put("language","hi").put("speed",config.speed()).put("textScale",1).put("placement",config.placement());byte[] bytes=values.toString().getBytes(StandardCharsets.UTF_8);conn.setDoOutput(true);conn.setFixedLengthStreamingMode(bytes.length);try(OutputStream out=conn.getOutputStream()){out.write(bytes);}}
   if(conn.getResponseCode()!=200)throw new UserMessage("सेटिंग इस फ़ोन पर सुरक्षित है। सर्वर से अभी नहीं मिला सके।");
   try(InputStream in=conn.getInputStream();ByteArrayOutputStream out=new ByteArrayOutputStream()){byte[] buffer=new byte[1024];int n;while((n=in.read(buffer))!=-1){if(out.size()+n>8192)throw new UserMessage("सर्वर की सेटिंग जाँचें।");out.write(buffer,0,n);}return new JSONObject(out.toString("UTF-8"));}
  }finally{conn.disconnect();}
 }
 public static void apply(Config config,JSONObject response)throws Exception{JSONObject values=response.optJSONObject("preferences");if(values==null)throw new UserMessage("इस प्रोफ़ाइल की सेटिंग अभी सहेजी नहीं गई।");double speed=values.getDouble("speed");String placement=values.getString("placement");if(!values.optString("language").equals("hi")||!Double.isFinite(speed)||speed<.5||speed>1.2||!placement.matches("left|right"))throw new UserMessage("सर्वर की सेटिंग जाँचें।");config.setSpeed((float)speed);config.setPlacement(placement);}
}
