package in.suniye.app;
import android.app.Application;
import android.content.Context;
import java.io.File;
public final class SuniyeApp extends Application {
    private ReaderController reader;
    private final Document document=new Document();
    public static final class Document {
        public File file;public int page,count;public long version;
        public void clear(){version++;if(file!=null)file.delete();file=null;page=0;count=0;}
        public void replace(File next,int pages){clear();file=next;count=pages;}
    }
    @Override public void onCreate(){super.onCreate();reader=new ReaderController(this);}
    public static ReaderController reader(Context context){return ((SuniyeApp)context.getApplicationContext()).reader;}
    public static Document document(Context context){return ((SuniyeApp)context.getApplicationContext()).document;}
}
