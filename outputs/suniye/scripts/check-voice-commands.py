#!/usr/bin/env python3
"""Check exact Hindi/English command routing, including negation and mixed sentences."""
from pathlib import Path
import os, subprocess, tempfile, json
root=Path(__file__).resolve().parents[1]
cases={
 'पढ़िए':'READ','कृपया पढ़िए':'READ','पढ़कर सुनाओ':'READ','फिर सुनिए':'REPEAT','दोबारा सुनाओ':'REPEAT',
 'धीरे सुनिए':'SLOW','धीरे पढ़ो':'SLOW','रोकिए':'STOP','रुको':'STOP','बंद कर दो':'STOP',
 'कागज़ पढ़िए':'CAMERA','फोटो पढ़िए':'PHOTO','फ़ाइल पढ़िए':'DOCUMENT','समझाइए':'EXPLAIN',
 'फोटो लो':'CAPTURE','please repeat!':'REPEAT',' STOP ':'STOP','please take photo':'CAPTURE',
 'मत पढ़िए':'UNKNOWN','रोकिए मत':'UNKNOWN','धीरे मत पढ़ो':'UNKNOWN','यह संदेश कहता है फिर सुनिए':'UNKNOWN',
 'पढ़िए और मिटा दो':'UNKNOWN','stop sending money':'UNKNOWN','रोकिए फिर सुनिए':'UNKNOWN','':'UNKNOWN',
 'प\u095dिए':'READ','पढ\u093cिए':'READ','\u095eोटो पढ़िए':'PHOTO','फ\u093cोटो पढ़िए':'PHOTO','काग\u095b पढ़िए':'CAMERA',
 'कृपया':'UNKNOWN','मेरा नाम रोकिए है':'UNKNOWN','x'*101:'UNKNOWN',
}
home=Path(os.environ['JAVA_HOME'])
with tempfile.TemporaryDirectory(prefix='suniye-voice-') as folder:
 p=Path(folder);statements=[]
 for text,expected in cases.items():statements.append('if(VoiceCommand.parse('+json.dumps(text,ensure_ascii=True)+')!=VoiceCommand.'+expected+')throw new AssertionError('+json.dumps(text,ensure_ascii=True)+');')
 (p/'Check.java').write_text('import in.suniye.app.VoiceCommand; public class Check{public static void main(String[]a){'+''.join(statements)+'}}')
 subprocess.run([str(home/'bin/javac'),'-d',str(p),str(root/'android/app/src/main/java/in/suniye/app/VoiceCommand.java'),str(p/'Check.java')],check=True)
 subprocess.run([str(home/'bin/java'),'-cp',str(p),'Check'],check=True)
print(f'Exact voice commands: {len(cases)} cases passed')
