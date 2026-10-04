#!/usr/bin/env python3
"""Compile the pure Android formatter and check the shared pronunciation corpus."""
from pathlib import Path
import base64, json, os, subprocess, tempfile
root=Path(__file__).resolve().parents[1]
cases=json.loads((root/'backend/test/hindi-speech-cases.json').read_text(encoding='utf-8'))
java_home=os.environ.get('JAVA_HOME')
java=str(Path(java_home)/'bin/java') if java_home else 'java'
javac=str(Path(java_home)/'bin/javac') if java_home else 'javac'
with tempfile.TemporaryDirectory(prefix='suniye-speech-') as folder:
 p=Path(folder)
 statements=[]
 for item in cases:
  source=json.dumps(item['text'],ensure_ascii=True)
  statements.append('emit(HindiSpeech.format('+source+'));emit(HindiSpeech.currencyHint('+source+'));')
 harness='import in.suniye.app.HindiSpeech; public class Check { static void emit(String s){System.out.println(java.util.Base64.getEncoder().encodeToString(s.getBytes(java.nio.charset.StandardCharsets.UTF_8)));} public static void main(String[] args){'+''.join(statements)+'}}'
 (p/'Check.java').write_text(harness,encoding='utf-8')
 subprocess.run([javac,'-encoding','UTF-8','-d',str(p),str(root/'android/app/src/main/java/in/suniye/app/HindiSpeech.java'),str(p/'Check.java')],check=True)
 lines=subprocess.check_output([java,'-cp',str(p),'Check'],text=True).splitlines()
 assert len(lines)==len(cases)*2
 for i,item in enumerate(cases):
  for j,key in enumerate(['spoken','hint']):
   actual=base64.b64decode(lines[i*2+j]).decode('utf-8')
   assert actual==item[key], (item['text'],key,actual,item[key])
 print(f"Android Hindi formatter: {len(cases)} shared cases passed")
