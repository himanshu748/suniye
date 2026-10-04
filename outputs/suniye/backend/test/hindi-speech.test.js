import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {hindiSpeech,currencyHint} from '../src/hindi-speech.js';
import {speechProvider} from '../src/providers.js';
const cases=JSON.parse(readFileSync(new URL('./hindi-speech-cases.json',import.meta.url),'utf8'));
for(const item of cases)test(`Hindi pronunciation: ${item.text}`,()=>{assert.equal(hindiSpeech(item.text),item.spoken);assert.equal(currencyHint(item.text),item.hint);});
test('ElevenLabs receives Hindi pronunciation while the caller retains the original',async()=>{
 const original=cases[0].text;let payload;
 const speech=speechProvider({ELEVENLABS_API_KEY:'test-only',ELEVENLABS_VOICE_ID:'zT03pEAEi0VHKciJODfn'},async(url,options)=>{payload=JSON.parse(options.body);return new Response(new Uint8Array([1,2,3]),{headers:{'content-type':'audio/mpeg'}});});
 assert.equal(await speech.narrate(original),'AQID');assert.equal(payload.text,cases[0].spoken);assert.equal(payload.language_code,'hi');assert.equal(original,cases[0].text);
});
test('Expanded pronunciation above the provider limit falls back without sending',async()=>{
 let called=false;const speech=speechProvider({ELEVENLABS_API_KEY:'test-only',ELEVENLABS_VOICE_ID:'zT03pEAEi0VHKciJODfn'},async()=>{called=true;throw new Error();});
 assert.equal(await speech.narrate('₹999999999 '.repeat(300)),undefined);assert.equal(called,false);
});

test('v4 omits unsupported speed and exposes its actual audio base rate',async()=>{
 let payload;const speech=speechProvider({ELEVENLABS_API_KEY:'test-only',ELEVENLABS_VOICE_ID:'zT03pEAEi0VHKciJODfn',ELEVENLABS_MODEL_ID:'eleven_v4'},async(url,options)=>{payload=JSON.parse(options.body);return new Response(new Uint8Array([1]),{headers:{'content-type':'audio/mpeg'}});});
 assert.equal(await speech.narrate('₹1,250'),'AQ==');assert.equal(speech.baseRate,1);assert.equal(payload.model_id,'eleven_v4');assert.equal(payload.text,'एक हज़ार दो सौ पचास रुपये');assert.equal(Object.hasOwn(payload.voice_settings,'speed'),false);assert.equal(payload.voice_settings.stability,.5);
});
test('workflow preserves audio base rate and source for Android repeat playback',async()=>{
 const {makeReadingWorkflow}=await import('../src/workflow.js');
 const model={extract:async(input)=>({kind:'reading',originalText:input.text,description:'',retakeReason:''})};
 const run=makeReadingWorkflow(model,{baseRate:1,narrate:async()=>'AQ=='});
 const result=await run.run({requestId:crypto.randomUUID(),text:'बिल ₹1,250 है।',language:'hi',mode:'read',wantAudio:true});
 assert.equal(result.audioBaseRate,1);assert.equal(result.originalText,'बिल ₹1,250 है।');assert.equal(result.spokenText,result.originalText);
});

test('Unverified voice models do not send requests or assume a playback rate',async()=>{
 for(const model of ['eleven_v3','eleven_v4_unknown']){let called=false;const speech=speechProvider({ELEVENLABS_API_KEY:'test-only',ELEVENLABS_VOICE_ID:'zT03pEAEi0VHKciJODfn',ELEVENLABS_MODEL_ID:model},async()=>{called=true;throw new Error();});assert.equal(speech.configured,false);assert.equal(await speech.narrate('₹1,250'),undefined);assert.equal(called,false);}
});
