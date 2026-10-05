#!/usr/bin/env python3
"""Run the standalone pure-Java OCR policy regression harness."""
from pathlib import Path
import os, subprocess, tempfile
root=Path(__file__).resolve().parents[1]
home=os.environ.get('JAVA_HOME')
def java_tool(name): return str(Path(home)/'bin'/name) if home else name
with tempfile.TemporaryDirectory(prefix='suniye-ocr-') as out:
    base=root/'android/app/src/main/java/in/suniye/app'
    subprocess.run([java_tool('javac'),'-encoding','UTF-8','-d',out,str(base/'OcrTranscript.java'),str(base/'HindiSpeech.java'),str(root/'android/ocr-tests/OcrTranscriptTest.java')],check=True)
    subprocess.run([java_tool('java'),'-cp',out,'OcrTranscriptTest'],check=True)
