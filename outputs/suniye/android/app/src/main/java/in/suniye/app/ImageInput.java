package in.suniye.app;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.ImageDecoder;
import android.graphics.pdf.PdfRenderer;
import android.net.Uri;
import android.os.ParcelFileDescriptor;
import android.util.Base64;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;

public final class ImageInput {
    public static String encode(Bitmap bitmap)throws Exception{
        int max=Math.max(bitmap.getWidth(),bitmap.getHeight());
        Bitmap resized=max>1600?Bitmap.createScaledBitmap(bitmap,Math.max(1,bitmap.getWidth()*1600/max),Math.max(1,bitmap.getHeight()*1600/max),true):bitmap;
        try(ByteArrayOutputStream out=new ByteArrayOutputStream()){
            resized.compress(Bitmap.CompressFormat.JPEG,88,out);
            if(out.size()>3_000_000)throw new UserMessage("चित्र बहुत बड़ा है। पास से छोटा हिस्सा लें।");
            return "data:image/jpeg;base64,"+Base64.encodeToString(out.toByteArray(),Base64.NO_WRAP);
        }finally{if(resized!=bitmap)resized.recycle();}
    }
    public static Bitmap fromUri(Context c,Uri uri)throws Exception{
        // The byte and dimension checks happen before bitmap allocation.
        byte[] bytes;
        try(InputStream in=c.getContentResolver().openInputStream(uri);ByteArrayOutputStream out=new ByteArrayOutputStream()){
            if(in==null)throw new UserMessage("चित्र खुल नहीं रहा।");byte[] buffer=new byte[8192];int n;
            while((n=in.read(buffer))!=-1){if(Thread.currentThread().isInterrupted())throw new InterruptedException();if(out.size()+n>15_000_000)throw new UserMessage("चित्र बहुत बड़ा है।");out.write(buffer,0,n);}bytes=out.toByteArray();
        }
        BitmapFactory.Options info=new BitmapFactory.Options();info.inJustDecodeBounds=true;BitmapFactory.decodeByteArray(bytes,0,bytes.length,info);
        if(info.outWidth<1||info.outHeight<1||((long)info.outWidth*info.outHeight)>80_000_000)throw new UserMessage("चित्र खुल नहीं रहा।");
        return ImageDecoder.decodeBitmap(ImageDecoder.createSource(java.nio.ByteBuffer.wrap(bytes)),(decoder,details,source)->{
            int w=details.getSize().getWidth(),h=details.getSize().getHeight(),max=Math.max(w,h);
            decoder.setAllocator(ImageDecoder.ALLOCATOR_SOFTWARE);if(max>1600)decoder.setTargetSize(Math.max(1,w*1600/max),Math.max(1,h*1600/max));
        });
    }
    public static Bitmap fromJpeg(byte[] data)throws Exception{
        BitmapFactory.Options options=new BitmapFactory.Options();options.inJustDecodeBounds=true;BitmapFactory.decodeByteArray(data,0,data.length,options);
        if(options.outWidth<1||options.outHeight<1||((long)options.outWidth*options.outHeight)>80_000_000)throw new UserMessage("चित्र खुल नहीं रहा।");
        options.inSampleSize=Math.max(1,Math.max(options.outWidth,options.outHeight)/1600);options.inJustDecodeBounds=false;
        Bitmap result=BitmapFactory.decodeByteArray(data,0,data.length,options);if(result==null)throw new UserMessage("चित्र खुल नहीं रहा।");return result;
    }
    public static File copyPdf(Context c,Uri uri)throws Exception{
        File tmp=File.createTempFile("document-",".pdf",c.getCacheDir());boolean success=false;
        try(InputStream in=c.getContentResolver().openInputStream(uri);FileOutputStream out=new FileOutputStream(tmp)){
            if(in==null)throw new UserMessage("कागज़ खुल नहीं रहा।");byte[] b=new byte[8192];int n,total=0;
            while((n=in.read(b))!=-1){if(Thread.currentThread().isInterrupted())throw new InterruptedException();total+=n;if(total>15_000_000)throw new UserMessage("कागज़ बहुत बड़ा है।");out.write(b,0,n);}success=true;return tmp;
        }finally{if(!success)tmp.delete();}
    }
    public static Bitmap pdfPage(File file,int index)throws Exception{
        try(ParcelFileDescriptor fd=ParcelFileDescriptor.open(file,ParcelFileDescriptor.MODE_READ_ONLY);PdfRenderer pdf=new PdfRenderer(fd);PdfRenderer.Page page=pdf.openPage(index)){
            float scale=1600f/Math.max(page.getWidth(),page.getHeight());
            Bitmap bmp=Bitmap.createBitmap(Math.max(1,Math.round(page.getWidth()*scale)),Math.max(1,Math.round(page.getHeight()*scale)),Bitmap.Config.ARGB_8888);
            new Canvas(bmp).drawColor(Color.WHITE);page.render(bmp,null,null,PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY);return bmp;
        }
    }
    public static int pdfCount(File file)throws Exception{try(ParcelFileDescriptor fd=ParcelFileDescriptor.open(file,ParcelFileDescriptor.MODE_READ_ONLY);PdfRenderer pdf=new PdfRenderer(fd)){return pdf.getPageCount();}}
}
