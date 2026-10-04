import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { hindiSpeech } from '../src/hindi-speech.js';
import { PreparationError } from './store.js';

export function readerHtml(job) {
  const pages = job.pages.map(page => ({ original: page.result.originalText, originalSpeech: hindiSpeech(page.result.originalText),
    explanation: page.result.isExplanation ? page.result.spokenText : '',
    explanationSpeech: page.result.isExplanation ? hindiSpeech(page.result.spokenText) : '', needsReview: Boolean(page.needsReview), audio: page.result.audioProvider==='elevenlabs' && page.result.audioVoiceId==='zT03pEAEi0VHKciJODfn' && !page.result.isExplanation && /^[A-Za-z0-9+/]+={0,2}$/.test(page.result.audioBase64||'') && page.result.audioBase64.length<=6_800_000 ? page.result.audioBase64 : '', baseRate: page.result.audioBaseRate===1?1:.85 }));
  const data = JSON.stringify(pages).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  return `<!doctype html>
<html lang="hi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="referrer" content="no-referrer"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'none'; media-src data:; connect-src 'none'; base-uri 'none'; form-action 'none'">
<title>सुनिए — तैयार पन्ने</title><style>
:root{color-scheme:light;--paper:#fff9ef;--ink:#162827;--teal:#075e54;--muted:#475752;--line:#d7dfd1}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:system-ui,sans-serif;font-size:24px;line-height:1.6}main{max-width:760px;margin:auto;padding:32px 24px 200px}h1{font-size:32px;line-height:1.3;margin:0 0 12px}h2{font-size:26px;margin:28px 0 12px}p{margin:12px 0}.intro{color:var(--muted);font-size:24px}#text{white-space:pre-wrap;overflow-wrap:anywhere;font-size:28px;line-height:1.75}button{font:inherit;font-weight:700;min-height:80px;padding:14px 20px;border:2px solid var(--line);border-radius:16px;background:white;color:var(--ink);cursor:pointer}button:hover{border-color:var(--teal)}button:active{background:var(--line)}button:disabled{color:var(--muted);background:var(--line);cursor:default}button:focus-visible{outline:3px solid var(--teal);outline-offset:4px}::selection{background:var(--teal);color:var(--paper)}#listen{background:var(--teal);color:var(--paper);border-color:var(--teal)}#listen:disabled{background:var(--line);color:var(--muted);border-color:var(--line)}#status{font-size:24px;min-height:2em}nav{display:flex;gap:12px;margin:28px 0}nav button{flex:1}footer{position:fixed;bottom:0;left:0;right:0;padding:16px 24px max(16px,env(safe-area-inset-bottom));background:var(--paper);border-top:1px solid var(--line)}.controls{max-width:712px;margin:auto;display:grid;grid-template-columns:1fr 1fr;gap:12px}#toggle{width:100%;margin:16px 0}.note{font-size:24px;color:var(--muted)}[hidden]{display:none!important}@media(max-width:420px){main{padding:24px 20px 220px}footer{padding-left:20px;padding-right:20px}button{font-size:24px;padding:12px}#text{font-size:26px}}@media(prefers-reduced-motion:no-preference){button{transition:background-color .12s ease-out,border-color .12s ease-out}}
</style></head><body><main><h1>सुनिए — तैयार पन्ने</h1><p class="intro">एक बटन दबाएँ, फिर आराम से सुनें।</p><p id="page"></p><p id="status" role="status" aria-live="polite"></p><h2 id="label">आपका मूल पाठ</h2><p id="text"></p><p id="pronunciation" class="note" hidden></p><button id="toggle" hidden></button><p id="review" class="note" hidden>आसान भाषा में समझाना पूरा नहीं हुआ। मूल पाठ सुनिए।</p><nav aria-label="पन्ना बदलें"><button id="previous">पिछला पन्ना</button><button id="next">अगला पन्ना</button></nav><button id="slow">धीरे सुनिए</button><p class="note">यह परिवार के सदस्य की तैयार की हुई फ़ाइल है। चित्र वाले PDF को सुनिए Android ऐप में खोलें। आवाज़ ElevenLabs Raju की तैयार की हुई रिकॉर्डिंग है। यह फ़ाइल पढ़ते समय पाठ इंटरनेट पर नहीं भेजती। रिकॉर्डिंग न हो तो आवाज़ नहीं बजेगी।</p></main><footer><div class="controls"><button id="listen">सुनिए</button><button id="stop">रोकिए</button></div></footer>
<script type="application/json" id="pages">${data}</script><script>
'use strict';
const pages=JSON.parse(document.getElementById('pages').textContent);
const byId=id=>document.getElementById(id);let index=0,explain=false,rate=.85,generation=0,player=null;
const numeral=new Intl.NumberFormat('hi-IN',{numberingSystem:'deva'});
function stop(message='पढ़ना रोक दिया गया।'){generation++;if(player){player.onended=null;player.onerror=null;player.pause();player.removeAttribute('src');player.load();player=null;}byId('status').textContent=message;}
function checkVoice(){const ready=Boolean(pages[index].audio)&&!explain;byId('listen').disabled=!ready;byId('slow').disabled=!ready;byId('status').textContent=ready?'सुनिए दबाएँ।':'इस पन्ने की ElevenLabs आवाज़ तैयार नहीं है। परिवार के सदस्य से तैयार करवाएँ।';}
function render(){const p=pages[index];byId('page').textContent='पन्ना '+numeral.format(index+1)+' / '+numeral.format(pages.length);byId('text').textContent=explain?p.explanation:p.original;byId('pronunciation').hidden=explain||p.originalSpeech===p.original;byId('pronunciation').textContent='सुनने में: '+p.originalSpeech;byId('label').textContent=explain?'आसान भाषा में — परिवार से जँचवाएँ':'आपका मूल पाठ';byId('previous').disabled=index===0;byId('next').disabled=index===pages.length-1;byId('toggle').hidden=!p.explanation;byId('toggle').textContent=explain?'मूल पाठ दिखाएँ':'आसान भाषा में दिखाएँ';byId('review').hidden=!p.needsReview;checkVoice();}
function listen(){if(!pages[index].audio||explain){checkVoice();return;}stop('पढ़ रहे हैं।');const current=generation,clip=new Audio('data:audio/mpeg;base64,'+pages[index].audio);player=clip;clip.playbackRate=rate/pages[index].baseRate;clip.onended=()=>{if(current===generation){stop('पूरा पढ़ लिया। फिर सुनने के लिए सुनिए दबाएँ।');}};clip.onerror=()=>{if(current===generation)stop('आवाज़ नहीं चली। परिवार के सदस्य से रिकॉर्डिंग जँचवाएँ।');};clip.play().catch(()=>{if(current===generation)stop('आवाज़ नहीं चली। फ़ोन की आवाज़ और रिकॉर्डिंग जँचवाएँ।');});}
byId('listen').onclick=()=>{rate=.85;listen();};byId('slow').onclick=()=>{rate=.65;listen();};byId('stop').onclick=()=>stop();
byId('previous').onclick=()=>{stop();index--;explain=false;render();};byId('next').onclick=()=>{stop();index++;explain=false;render();};byId('toggle').onclick=()=>{stop();explain=!explain;render();};
window.addEventListener('pagehide',()=>stop());document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});render();

</script></body></html>`;
}

export async function exportReader(job, output) {
  if (!job.pages.every(page => page.status === 'ready')) throw new PreparationError('NOT_READY');
  output = resolve(output);
  // New directory only: never replace a caregiver's existing files.
  await mkdir(output, { mode: 0o700 });
  await writeFile(join(output, 'index.html'), readerHtml(job), { mode: 0o600 });
  await writeFile(join(output, 'pages.json'), JSON.stringify({ language: 'hi', originalReadingOnly: true, pages: job.pages.map(page => page.result) }, null, 2) + '\n', { mode: 0o600 });
  return output;
}
