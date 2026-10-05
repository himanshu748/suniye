from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import subprocess,json,hashlib,textwrap,time,re
import argparse
parser=argparse.ArgumentParser(description='Render the documented walkthrough from native capture receipts, public source previews and generated Raju narration.')
parser.add_argument('--captures',type=Path,required=True)
parser.add_argument('--narration',type=Path,required=True)
parser.add_argument('--sources',type=Path,required=True)
parser.add_argument('--output',type=Path,required=True)
args=parser.parse_args();w=args.output;w.mkdir(parents=True,exist_ok=True);a=args.narration;c=args.captures;docs=args.sources
font='/System/Library/Fonts/Supplemental/Arial.ttf';bold='/System/Library/Fonts/Supplemental/Arial Bold.ttf';ink='#173e38';green='#075c52';paper='#fff9ef';parts=[];timeline=[];cues=[];elapsed=0;mapping=[]
def ff(args):subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y',*map(str,args)],check=True)
def dur(p):return float(json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','json',str(p)]))['format']['duration'])
def tx(d,xy,s,size=28,strong=False,fill=ink):d.multiline_text(xy,s,font=ImageFont.truetype(bold if strong else font,size),fill=fill,spacing=8)
def panel(name,title,body='',source=None,phone=None,caption='',sources=None):
 im=Image.new('RGB',(1280,720),paper);d=ImageDraw.Draw(im);tx(d,(42,28),'SUNIYE / REAL DOCUMENT WALKTHROUGH',22,True,green);tx(d,(42,91),title,46,True);tx(d,(44,220),body,27)
 if source:
  img=Image.open(source).convert('RGB');img.thumbnail((715,300));im.paste(img,(44,305));
 if sources:
  for i,p in enumerate(sources):
   img=Image.open(p).convert('RGB');img.thumbnail((320,340));im.paste(img,(50+i*353,270))
 if phone:
  img=Image.open(phone).convert('RGB').resize((360,640));im.paste(img,(868,30))
 d.rounded_rectangle((31,605,803,716),radius=14,fill='#e5eee9');tx(d,(46,615),'\n'.join(textwrap.wrap(caption,62)),24)
 tx(d,(858,683),'Actual Android 11 capture',19)
 p=w/(name+'.png');im.save(p);return p
narr=json.loads((a/'receipt.json').read_text());texts={x['name']:x['text']for x in narr['calls']}
def append(out,name,caption):
 global elapsed
 duration=dur(out);timeline.append(dict(name=name,start=round(elapsed,3),seconds=round(duration,3)));cues.append((elapsed,elapsed+duration,caption));elapsed+=duration;parts.append(out)
def still(name,title,body='',source=None,phone=None,sources=None):
 audio=a/(name+'.mp3');caption=texts[name];p=panel(name,title,body,source,phone,caption,sources);out=w/(name+'.mp4');length=dur(audio)+.4
 ff(['-loop','1','-i',p,'-i',audio,'-t',length,'-vf','fps=30,setsar=1,format=yuv420p','-af','apad','-c:v','libx264','-preset','veryfast','-crf','22','-c:a','aac','-ar','48000','-ac','2',out]);append(out,name,caption)
def native(stage,title,seconds,audio_start=0,source=None,caption=''):
 receipt=json.loads((c/('real-'+stage+'-receipt.json')).read_text());events={x['name']:x['elapsedMs']/1000 for x in receipt['events']};audio=c/('real-'+stage+'.mp3');raw=c/(stage+'-raw.mp4')
 # Approximate image/event alignment. The recorder starts after the host launches it.
 offset=(receipt['startedAtEpochMs']-receipt['recordingStartHostEpochMs'])/1000 if receipt.get('recordingStartHostEpochMs') else 2.0;start=max(0,events['playback-start']+offset+audio_start/.85);seconds=min(seconds,dur(audio)/.85-audio_start/.85)
 p=panel('native-'+stage,title,'Recognized on the phone. Spoken in Hindi.',source,caption=caption);out=w/('native-'+stage+'.mp4')
 ff(['-ss',start,'-i',raw,'-loop','1','-i',p,'-ss',audio_start,'-i',audio,'-filter_complex','[0:v]scale=360:640,setpts=PTS-STARTPTS[phone];[1:v][phone]overlay=868:30,setsar=1[v];[2:a]atempo=.85,apad[a]','-map','[v]','-map','[a]','-t',seconds,'-r','30','-c:v','libx264','-preset','veryfast','-crf','22','-pix_fmt','yuv420p','-c:a','aac','-ar','48000','-ac','2',out]);append(out,'native-'+stage,caption);mapping.append(dict(stage=stage,rawStart=start,audioStart=audio_start,seconds=seconds,audioSHA256=hashlib.sha256(audio.read_bytes()).hexdigest(),approximateAlignment=True))
def narrated_native(name,title,body,stage,start,length):
 audio=a/(name+'.mp3');p=panel('guide-'+name,title,body,caption=texts[name]);out=w/(name+'.mp4');duration=dur(audio)+.4
 ff(['-ss',start,'-t',length,'-i',c/(stage+'-raw.mp4'),'-loop','1','-i',p,'-i',audio,'-filter_complex',f'[0:v]scale=360:640,setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration={duration}[phone];[1:v][phone]overlay=868:30,setsar=1[v];[2:a]apad[a]','-map','[v]','-map','[a]','-t',duration,'-r','30','-c:v','libx264','-preset','veryfast','-crf','22','-pix_fmt','yuv420p','-c:a','aac','-ar','48000','-ac','2',out]);append(out,name,texts[name]);mapping.append(dict(stage=stage,rawStart=start,seconds=length,narration=name,editing='Native action followed by a held last frame under English narration'))
# Current home frame from the same image capture.
ff(['-ss',3,'-i',c/'image-raw.mp4','-frames:v','1',w/'home.png'])
still('intro','Small print.\nHear it in Hindi.','Made for Hindi-speaking parents\nwho find small print difficult.',phone=w/'home.png')
still('image','1. Share a notice image','Public consumer notice · DERC, 2021',source=docs/'consumer-hi.png',phone=c/'real-image-warning.png')
still('caution','A clear choice before\nan uncertain reading','Review the picture, retake it,\nor choose the caution-labelled reading.',phone=c/'real-image-warning.png')
native('image','Hear the notice in Hindi',31,source=docs/'consumer-hi.png',caption='Hindi audio: an OCR caution, then the notice about contacting the consumer grievance forum. The recognized source stays visible.')
still('pdf','2. A complete two-page PDF','Dated UP electricity notice · 27 February 2026',sources=[docs/'up-hi-1.png',docs/'up-hi-2.png'],phone=c/'real-pdf1-warning.png')
native('pdf1','PDF page 1 · excerpt',23,source=docs/'up-hi-1.png',caption='Page 1 begins with the OCR caution and the notice heading. The full page completed playback in the recorded test.')
narrated_native('controls','Next page. Repeat.\nSlow. Stop.','Next page opens a separate OCR review.','pdf2',2,8)
native('pdf2','PDF page 2 · excerpt',20,audio_start=11,source=docs/'up-hi-2.png',caption='A later excerpt from page 2. Flagged number groups are spoken as “unclear number”; OCR can still make mistakes.')
still('whatsapp','3. WhatsApp → Share\n→ Suniye','Open the image or PDF first.\nChoose the app, not a chat contact.',phone=c/'real-image-playing.png')
narrated_native('end','The message,\nat their own pace.','Repeat plays the saved recording.\nStop remains reachable.','image',49,3.5)
concat=w/'concat.txt';concat.write_text('\n'.join("file '"+str(p)+"'"for p in parts)+'\n');out=w/'suniye-real-documents-walkthrough.mp4';ff(['-f','concat','-safe','0','-i',concat,'-c:v','copy','-af','loudnorm=I=-16:TP=-1.5:LRA=11','-c:a','aac','-ar','48000','-ac','2','-movflags','+faststart',out]);ff(['-i',out,'-f','null','-'])
def stamp(sec):
 ms=round(sec*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02}.{ms%1000:03}'
vtt='WEBVTT\n\n'+'\n\n'.join(f'{i+1}\n{stamp(s)} --> {stamp(e)}\n{t}'for i,(s,e,t)in enumerate(cues))+'\n';(w/'walkthrough-en.vtt').write_text(vtt)
ff(['-ss','1','-i',out,'-frames:v','1',w/'poster.png'])
levels=subprocess.run(['ffmpeg','-hide_banner','-i',out,'-af','volumedetect','-vn','-f','null','-'],capture_output=True,text=True,check=True);m=re.search(r'mean_volume: ([-.0-9]+) dB',levels.stderr);assert m and float(m.group(1))>-40
receipt=dict(createdAt=time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),file=out.name,seconds=dur(out),sha256=hashlib.sha256(out.read_bytes()).hexdigest(),bytes=out.stat().st_size,apkSHA256=json.loads((c/'real-image-receipt.json').read_text())['apkSHA256'],voicePolicy='ElevenLabs Raju only; English explanation clips and Hindi app readings',scope='Current 0.4.1 APK on Android 11 emulator, full actual image and two PDF page playback tests. Film uses image audio and labelled PDF excerpts. Public dated source notices, not private WhatsApp messages. WhatsApp segment explains the Share route; external sender not exercised.',editing='English narration and source stills intercut with real native screen recordings. Generation waits are omitted; PDF readings are excerpts. Exact response MP3s mixed at .85 playback speed with approximate event alignment. Android screenrecord did not capture device sound. Dialogue loudness normalized to -16 LUFS target, true peak -1.5 dB.',checks=dict(fullDecode=True,meanAudioDb=float(m.group(1))),timeline=timeline,audioMappings=mapping,narration=narr)
(w/'video-receipt.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:receipt[k]for k in ['seconds','bytes','sha256']}))
for second in [1,20,40,60,85,110,140]:
 if second<dur(out):ff(['-ss',second,'-i',out,'-frames:v','1',w/('preview-'+str(second)+'.png')])
