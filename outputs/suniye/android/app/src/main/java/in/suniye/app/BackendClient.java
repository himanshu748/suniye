package in.suniye.app;
import org.json.JSONObject;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.BooleanSupplier;

public final class BackendClient {
    public static JSONObject send(Config config,JSONObject payload,AtomicReference<HttpURLConnection> active,BooleanSupplier cancelled)throws Exception{
        if(config.endpoint().isEmpty()||config.token().isEmpty())throw new UserMessage("चित्र पढ़ने के लिए परिवार की सेटिंग पूरी करें।");
        HttpURLConnection conn=(HttpURLConnection)new URL(config.endpoint()+"/v1/read").openConnection();
        active.set(conn);
        try {
            if(cancelled.getAsBoolean()){conn.disconnect();throw new InterruptedException();}
            conn.setConnectTimeout(12000);conn.setReadTimeout(75000);conn.setRequestMethod("POST");conn.setDoOutput(true);
            conn.setInstanceFollowRedirects(false);conn.setRequestProperty("Content-Type","application/json");conn.setRequestProperty("Authorization","Bearer "+config.token());
            byte[] bytes=payload.toString().getBytes(StandardCharsets.UTF_8);conn.setFixedLengthStreamingMode(bytes.length);
            try(java.io.OutputStream out=conn.getOutputStream()){out.write(bytes);}
            int status=conn.getResponseCode();
            if(cancelled.getAsBoolean())throw new InterruptedException();
            if(status!=200){if(status==401)throw new UserMessage("परिवार की सेटिंग में कनेक्शन जाँचें।");if(status==429||status==409)throw new UserMessage("थोड़ी देर रुककर फिर सुनिए दबाएँ।");
                // Select our own Hindi message from a bounded public error code, never server text.
                String code="";try(InputStream in=conn.getErrorStream();ByteArrayOutputStream out=new ByteArrayOutputStream()){if(in!=null){byte[] b=new byte[1024];int n;while((n=in.read(b))!=-1){if(cancelled.getAsBoolean())throw new InterruptedException();if(out.size()+n>4096)break;out.write(b,0,n);}code=new JSONObject(out.toString(StandardCharsets.UTF_8.name())).optString("code","");}}catch(InterruptedException e){throw e;}catch(Exception ignored){}
                String message=switch(code){case "UNFAITHFUL"->"अर्थ या अंक बदल सकते हैं। मूल पाठ फिर सुनिए।";case "READ_TIMEOUT"->"पढ़ने में समय लग रहा है। फिर कोशिश करें।";case "INCOMPLETE","TOO_LARGE"->"कागज़ का छोटा हिस्सा खोलकर फिर सुनिए दबाएँ।";case "UNREADABLE","INVALID_IMAGE"->"पास से साफ़ चित्र दोबारा लें।";default->"अभी पढ़ नहीं पा रहे हैं। इंटरनेट जाँचकर फिर सुनिए दबाएँ।";};throw new UserMessage(message);}
            try(InputStream in=conn.getInputStream();ByteArrayOutputStream out=new ByteArrayOutputStream()){
                byte[] b=new byte[8192];int n;while((n=in.read(b))!=-1){if(cancelled.getAsBoolean())throw new InterruptedException();if(out.size()+n>8_000_000)throw new UserMessage("पढ़ना बहुत लंबा है। छोटा हिस्सा चुनें।");out.write(b,0,n);}
                return new JSONObject(out.toString(StandardCharsets.UTF_8.name()));
            }
        }finally{active.compareAndSet(conn,null);conn.disconnect();}
    }
}
