package in.suniye.app;
import android.content.ContentProvider;
import android.content.ContentValues;
import android.database.Cursor;
import android.net.Uri;
import android.os.ParcelFileDescriptor;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
/** Synthetic input fixtures only. This provider does not exist in release builds. */
public final class DebugPdfProvider extends ContentProvider {
 public static CountDownLatch started=new CountDownLatch(0),resume=new CountDownLatch(0);
 @Override public boolean onCreate(){return true;}
 @Override public String getType(Uri uri){return uri.getLastPathSegment().equals("image")?"image/png":"application/pdf";}
 @Override public ParcelFileDescriptor openFile(Uri uri,String mode)throws FileNotFoundException{
  started.countDown();try{if(!resume.await(10,TimeUnit.SECONDS))throw new FileNotFoundException("Synthetic gate timeout");}catch(InterruptedException e){Thread.currentThread().interrupt();throw new FileNotFoundException("Interrupted");}
  return ParcelFileDescriptor.open(new File(getContext().getFilesDir(),uri.getLastPathSegment().equals("image")?"fixture.png":"fixture.pdf"),ParcelFileDescriptor.MODE_READ_ONLY);
 }
 @Override public Cursor query(Uri u,String[] p,String s,String[] a,String o){return null;}
 @Override public Uri insert(Uri u,ContentValues v){throw new UnsupportedOperationException();}
 @Override public int delete(Uri u,String s,String[] a){throw new UnsupportedOperationException();}
 @Override public int update(Uri u,ContentValues v,String s,String[] a){throw new UnsupportedOperationException();}
}
