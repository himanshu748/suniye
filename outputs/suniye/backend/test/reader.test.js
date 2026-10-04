import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {buildServer} from '../src/server.js';
import {makeReadingWorkflow} from '../src/workflow.js';
import {modelProvider,speechProvider} from '../src/providers.js';
import {readInput,parseExtraction,validateImage,PublicError} from '../src/contracts.js';
const token='fixture-family-token-0123456789abcdef';
const input=(extra={})=>({requestId:randomUUID(),language:'hi',mode:'read',text:'कल शाम चार बजे आइए।',...extra});
const model={id:'gemma-test-double',extract:async i=>({kind:'reading',originalText:i.text||'₹1,250',description:'',retakeReason:''}),explain:async s=>'यह आसान भाषा में समझाया गया है। '+s};
const speech={configured:false,narrate:async()=>undefined};
const image=()=>{const bytes=Buffer.alloc(32);Buffer.from([137,80,78,71,13,10,26,10]).copy(bytes);bytes.write('IHDR',12);bytes.writeUInt32BE(100,16);bytes.writeUInt32BE(80,20);return 'data:image/png;base64,'+bytes.toString('base64');};
async function server(t,extra={}){const app=await buildServer({env:{FAMILY_TOKEN:token},model,speech,...extra});t.after(()=>app.close());return app;}
const send=(app,payload,auth=token)=>app.inject({method:'POST',url:'/v1/read',headers:{authorization:'Bearer '+auth},payload});
test('unauthorized requests never reach the model',async t=>{let calls=0;const app=await server(t,{model:{...model,extract:async i=>{calls++;return model.extract(i);}}});assert.equal((await send(app,input(),'wrong')).statusCode,401);assert.equal(calls,0);});
test('text reading preserves amounts, dates and script',async t=>{const app=await server(t);const text='Paracetamol 650 mg, EXP 08/27 — ₹1,250 — 02/10/2026';const r=await send(app,input({text}));assert.equal(r.statusCode,200);assert.equal(r.json().originalText,text);assert.equal(r.json().spokenText,text);assert.equal(r.json().isExplanation,false);});
test('both input types and unknown fields are rejected before extraction',async t=>{const app=await server(t);for(const body of [input({image:image()}),input({apiKey:'unwanted'}),input({language:'mai'})])assert.equal((await send(app,body)).statusCode,400);});
test('image dimensions and canonical encoding are bounded',()=>{assert.deepEqual(validateImage(image()),{width:100,height:80,bytes:32});assert.throws(()=>validateImage('data:image/png;base64,AAAA'),PublicError);const bytes=Buffer.from(image().split(',')[1],'base64');bytes.writeUInt32BE(5000,16);assert.throws(()=>validateImage('data:image/png;base64,'+bytes.toString('base64')),PublicError);});
test('invalid, empty or unrecognized model JSON fails closed',()=>{for(const value of ['hello','{}',JSON.stringify({kind:'reading',originalText:'',description:'',retakeReason:''}),JSON.stringify({kind:'reading',originalText:'yes',description:'',retakeReason:'',tool:'send'})])assert.throws(()=>parseExtraction(value),PublicError);});
test('retake never calls a narration provider',async()=>{let narrated=false;const flow=makeReadingWorkflow({...model,extract:async()=>({kind:'retake',originalText:'',description:'',retakeReason:'पास से चित्र लें।'})},{narrate:async()=>{narrated=true;}});const r=await flow.run(input({wantAudio:true}));assert.equal(r.kind,'retake');assert.equal(narrated,false);});
test('description and explanation are explicitly distinguished from original',async()=>{const describe=makeReadingWorkflow({...model,extract:async()=>({kind:'reading',originalText:'',description:'एक लाल कप है।',retakeReason:''})},speech);const r=await describe.run(input());assert.equal(r.isDescription,true);assert.match(r.spokenText,/यह चित्र का वर्णन है/);const explain=makeReadingWorkflow(model,speech);const e=await explain.run(input({mode:'explain'}));assert.equal(e.isExplanation,true);assert.equal(e.originalText,'कल शाम चार बजे आइए।');assert.match(e.spokenText,/यह आसान भाषा/);});
test('late extraction after cancellation cannot invoke narration',async()=>{const abort=new AbortController();let spoken=0;const flow=makeReadingWorkflow({...model,extract:async i=>{abort.abort();return model.extract(i);}},{narrate:async()=>{spoken++;}});await assert.rejects(flow.run(input({wantAudio:true}),abort.signal));assert.equal(spoken,0);});
test('truncated model output is not announced as a complete reading',async()=>{const provider=modelProvider({},async()=>new Response(JSON.stringify({choices:[{finish_reason:'length',message:{content:'partial'}}]})));await assert.rejects(provider.extract({image:image()}),e=>e.code==='INCOMPLETE');});
test('ElevenLabs failure leaves text available without substitute audio',async()=>{const p=speechProvider({ELEVENLABS_API_KEY:'test',ELEVENLABS_VOICE_ID:'zT03pEAEi0VHKciJODfn'},async()=>new Response('failure',{status:503}));assert.equal(await p.narrate('नमस्ते'),undefined);});
test('only preferences reach the optional Mongo store',async t=>{let stored;const app=await server(t,{preferenceStore:{findOne:async()=>null,updateOne:async(...args)=>{stored=args;}}});const put=payload=>app.inject({method:'PUT',url:'/v1/preferences/mother',headers:{authorization:'Bearer '+token},payload});assert.equal((await put({language:'hi',speed:.85,textScale:1.3,placement:'left',originalText:'private'})).statusCode,400);assert.equal(stored,undefined);assert.equal((await put({language:'hi',speed:.85,textScale:1.3,placement:'left'})).statusCode,200);assert.equal(stored[1].$set.preferences.originalText,undefined);});
test('third concurrent request is bounded while two readers wait',async t=>{let resolve;const gate=new Promise(r=>{resolve=r;});const app=await server(t,{model:{...model,extract:async i=>{await gate;return model.extract(i);}}});const a=send(app,input()),b=send(app,input());const first=a.then(r=>r),second=b.then(r=>r);await new Promise(r=>setTimeout(r,30));const third=await send(app,input());assert.equal(third.statusCode,429);resolve();assert.equal((await first).statusCode,200);assert.equal((await second).statusCode,200);});
test('generative OCR is rejected when the phone found no readable text',async()=>{const data={kind:'reading',originalText:'कल शाम चार बजे आज रहा।',description:'invented context',retakeReason:''};const p=modelProvider({},async()=>new Response(JSON.stringify({choices:[{finish_reason:'stop',message:{content:JSON.stringify(data)}}]})));const r=await p.extract({image:image()});assert.equal(r.kind,'retake');assert.equal(r.originalText,'');});
test('online narration is opt-in even when ElevenLabs is configured',async()=>{
 let calls=0;const voice={configured:true,narrate:async()=>{calls++;return 'synthetic-audio';}};
 const flow=makeReadingWorkflow(model,voice);
 const silent=await flow.run(readInput.parse(input()));assert.equal(calls,0);assert.equal(silent.audioBase64,undefined);
 const voiced=await flow.run(readInput.parse(input({wantAudio:true})));assert.equal(calls,1);assert.equal(voiced.audioBase64,'synthetic-audio');
});

test('explanations reject omitted or invented numeric quantities',async()=>{
 const response=text=>async()=>new Response(JSON.stringify({choices:[{finish_reason:'stop',message:{content:text}}]}));
 const source='बिल ₹1,250, तारीख 02/10/2026';
 for(const text of ['बिल ₹1,200, तारीख 02/10/2026','बिल ₹1,250','बिल ₹1,250, तारीख 02/10/2026, फीस ₹50']){await assert.rejects(modelProvider({},response(text)).explain(source),e=>e.code==='UNFAITHFUL');}
 const faithful=await modelProvider({},response('बिल ₹1,250 है। तारीख 02/10/2026 है।')).explain(source);assert.match(faithful,/₹1,250/);
});

test('an explanation cannot drop a repeated amount',async()=>{
 const provider=modelProvider({},async()=>new Response(JSON.stringify({choices:[{finish_reason:'stop',message:{content:'किराया ₹500 है।'}}]})));
 await assert.rejects(provider.explain('किराया ₹500, जमा ₹500'),e=>e.code==='UNFAITHFUL');
});
test('public model failures survive the Mastra workflow without leaking arbitrary provider errors',async t=>{
 const app=await server(t,{model:{...model,explain:async()=>{throw new PublicError('UNFAITHFUL','अंक बदल गए हैं। मूल पाठ फिर सुनिए।',422);}}});
 const r=await send(app,input({mode:'explain'}));assert.equal(r.statusCode,422);assert.equal(r.json().code,'UNFAITHFUL');
 const timeout=makeReadingWorkflow({...model,extract:async()=>{throw new PublicError('READ_TIMEOUT','पढ़ने में समय लग रहा है।',504);}},speech);
 await assert.rejects(timeout.run(input()),e=>e.code==='READ_TIMEOUT'&&e.status===504);
 const privateError=makeReadingWorkflow({...model,extract:async()=>{throw new Error('PRIVATE_PROVIDER_DETAIL');}},speech);
 await assert.rejects(privateError.run(input()),e=>e.code==='READ_FAILED'&&!e.message.includes('PRIVATE'));
});
test('duplicate active request IDs cannot replace another run cancellation signal',async()=>{
 let finish;const gate=new Promise(r=>{finish=r;});const flow=makeReadingWorkflow({...model,extract:async i=>{await gate;return model.extract(i);}},speech);const request=input();const first=flow.run(request);
 await assert.rejects(flow.run(request),e=>e.code==='DUPLICATE_REQUEST'&&e.status===409);finish();assert.equal((await first).originalText,request.text);
 assert.equal((await flow.run(request)).originalText,request.text);
});
test('native Ollama pictures carry an explicit schema and preserve image bytes',async()=>{
 let payload,url;const provider=modelProvider({MODEL_PROTOCOL:'ollama',MODEL_BASE_URL:'http://127.0.0.1:11435/v1'},async(u,o)=>{url=u;payload=JSON.parse(o.body);return new Response(JSON.stringify({done:true,done_reason:'stop',message:{content:JSON.stringify({kind:'reading',originalText:'',description:'एक लाल वृत्त है।',retakeReason:''})},prompt_eval_count:100,eval_count:30}));});
 const r=await provider.extract({image:image()});assert.equal(r.kind,'reading');assert.equal(url,'http://127.0.0.1:11435/api/chat');assert.equal(payload.format.properties.originalText.const,'');assert.equal(payload.messages[1].images[0],image().split(',')[1]);assert.equal(payload.keep_alive,'10m');assert.equal(payload.options.num_predict,320);
});
test('oversized model response is rejected before becoming a reading',async()=>{
 const provider=modelProvider({},async()=>new Response('X'.repeat(250001)));
 await assert.rejects(provider.explain('नमस्ते'),e=>e.code==='INCOMPLETE');
});

test('unfinished native model output is not accepted as a reading',async()=>{
 const provider=modelProvider({MODEL_PROTOCOL:'ollama'},async()=>new Response(JSON.stringify({done:false,message:{content:'नमस्ते'}})));
 await assert.rejects(provider.explain('नमस्ते'),e=>e.code==='INCOMPLETE');
});

const completion=text=>async()=>new Response(JSON.stringify({choices:[{finish_reason:'stop',message:{content:text}}]}));
test('explanation cannot swap quantities assigned to different items',async()=>{
 await assert.rejects(modelProvider({},completion('दूध ₹30 है और चावल ₹20 है।')).explain('दूध ₹20, चावल ₹30'),e=>e.code==='UNFAITHFUL');
});
test('Hindi number words, dates, units, negations and times remain conservative anchors',async()=>{
 for(const [source,result] of [
  ['कल शाम चार बजे आइए।','कल शाम पाँच बजे आइए।'],
  ['कल शाम चार बजे आइए।','आज शाम चार बजे आइए।'],
  ['बीस रुपये रखिए।','तीस रुपये रखिए।'],
  ['आधा ग्राम लिखा है।','आधा किलोग्राम लिखा है।'],
  ['सुबह 8 बजे आइए।','शाम 8 बजे आइए।'],
  ['दस रुपये मत दीजिए।','दस रुपये दीजिए।'],
 ])await assert.rejects(modelProvider({},completion(result)).explain(source),e=>e.code==='UNFAITHFUL');
 assert.match(await modelProvider({},completion('कृपया पुनः आइए।')).explain('कृपया दोबारा आइए।'),/पुनः/);
});
test('picture descriptions cannot smuggle generative OCR through empty originalText',async()=>{
 for(const description of ['एक कागज़ जिस पर ₹500 और 3 बजे लिखा है।','एक नीला लेबल है। text is नमस्ते','कागज़ पर ₹ का निशान है।','पाँच मिलीग्राम दवा है।']){
  const p=modelProvider({},completion(JSON.stringify({kind:'reading',originalText:'',description,retakeReason:''})));
  const r=await p.extract({image:image()});assert.equal(r.kind,'retake');assert.equal(r.description,'');assert.equal(r.originalText,'');assert.ok(!r.retakeReason.includes('500'));
 }
});
test('model retake instructions are replaced with an application-authored prompt',async()=>{
 const p=modelProvider({},completion(JSON.stringify({kind:'retake',originalText:'',description:'',retakeReason:'खुराक 3 मिलीग्राम लें।'})));
 const r=await p.extract({image:image()});assert.ok(!r.retakeReason.includes('3'));assert.match(r.retakeReason,/दोबारा लें/);
});
test('only an explicit completed stop reason permits a model response',async()=>{
 for(const reason of [undefined,'tool_calls','content_filter','error']){
  const p=modelProvider({},async()=>new Response(JSON.stringify({choices:[{finish_reason:reason,message:{content:'नमस्ते'}}]})));
  await assert.rejects(p.explain('नमस्ते'),e=>e.code==='INCOMPLETE');
 }
 const p=modelProvider({MODEL_PROTOCOL:'ollama'},async()=>new Response(JSON.stringify({done:true,message:{content:'नमस्ते'}})));
 await assert.rejects(p.explain('नमस्ते'),e=>e.code==='INCOMPLETE');
});
test('malformed short JPEG frame headers return a public image error',()=>{
 const b=Buffer.alloc(24);b.set([255,216,255,192,0,2],0);b.set([255,217],22);
 assert.throws(()=>validateImage('data:image/jpeg;base64,'+b.toString('base64')),e=>e instanceof PublicError&&e.code==='INVALID_IMAGE');
});
test('bad JSON and unsupported content types preserve 400 and 415 status',async t=>{
 const app=await server(t);
 const bad=await app.inject({method:'POST',url:'/v1/read',headers:{authorization:'Bearer '+token,'content-type':'application/json'},payload:'{'});
 assert.equal(bad.statusCode,400);assert.equal(bad.json().code,'INVALID_INPUT');
 const unsupported=await app.inject({method:'POST',url:'/v1/read',headers:{authorization:'Bearer '+token,'content-type':'application/xml'},payload:'<data/>'});
 assert.equal(unsupported.statusCode,415);assert.equal(unsupported.json().code,'INVALID_INPUT');
});
test('unauthorized bodies are rejected before parsing and do not consume family quota',async t=>{
 const app=await server(t);
 for(let i=0;i<65;i++)assert.equal((await app.inject({method:'POST',url:'/v1/read',headers:{authorization:'Bearer wrong','content-type':'application/json'},payload:'{'})).statusCode,401);
 assert.equal((await send(app,input())).statusCode,200);
});
test('unused provider error bodies are cancelled',async()=>{
 let cancelled=0;const response=()=>new Response(new ReadableStream({cancel(){cancelled++;}}),{status:503});
 await assert.rejects(modelProvider({},async()=>response()).explain('नमस्ते'),e=>e.code==='MODEL_UNAVAILABLE');
 assert.equal(await speechProvider({ELEVENLABS_API_KEY:'fixture',ELEVENLABS_VOICE_ID:'zT03pEAEi0VHKciJODfn'},async()=>response()).narrate('नमस्ते'),undefined);
 assert.equal(cancelled,2);
});

test('encoded protected routes require authentication before parsing or model use',async t=>{
 let calls=0,writes=0;const app=await server(t,{model:{...model,extract:async i=>{calls++;return model.extract(i);}},preferenceStore:{findOne:async()=>null,updateOne:async()=>{writes++;}}});
 for(const url of ['/%761/read','/v%31/read','/%76%31/read','/%761/preferences/mother']){
  const r=await app.inject({method:url.includes('preferences')?'PUT':'POST',url,payload:input()});assert.equal(r.statusCode,401);
 }
 const prefs=await app.inject({method:'GET',url:'/%761/preferences/mother'});assert.equal(prefs.statusCode,401);assert.equal(calls,0);assert.equal(writes,0);
 assert.equal((await app.inject({method:'POST',url:'/%761/read',headers:{authorization:'Bearer '+token},payload:input()})).statusCode,200);assert.equal(calls,1);
});
test('contractions and Hindi prohibitions cannot be omitted in an explanation',async()=>{
 for(const [source,result] of [["Don't pay the bill",'बिल भर दीजिए।'],['दस रुपये बिना पूछे मत दीजिए।','दस रुपये दीजिए।'],['यह मना है।','यह ठीक है।'],['avoid milk','दूध पीजिए।']]){
  await assert.rejects(modelProvider({},completion(result)).explain(source),e=>e.code==='UNFAITHFUL');
 }
});
test('equivalent digit scripts and translated units may preserve the same quantities',async()=>{
 assert.match(await modelProvider({},completion('Paracetamol ६५० मिलीग्राम लिखा है।')).explain('Paracetamol 650 mg'),/६५०/);
});
test('quoted words in pictures require local OCR rather than model transcription',async()=>{
 const r=await modelProvider({},completion(JSON.stringify({kind:'reading',originalText:'',description:"एक नीले बोर्ड पर 'बंद' शब्द है",retakeReason:''}))).extract({image:image()});assert.equal(r.kind,'retake');assert.equal(r.description,'');
});

test('common cannot and WhatsApp Hindi negations cannot disappear',async()=>{
 for(const [source,result] of [['You cannot pay online','आप ऑनलाइन भर सकते हैं।'],['आज नही आना','आज आना'],['कल ना आना','कल आना'],['बगैर पूछे भेजना मना है।','पूछे भेजना मना है।']]){
  await assert.rejects(modelProvider({},completion(result)).explain(source),e=>e.code==='UNFAITHFUL');
 }
});
test('audio responses identify ElevenLabs and the configured voice; failure returns text only',async()=>{
 const provider=speechProvider({ELEVENLABS_API_KEY:'test',ELEVENLABS_VOICE_ID:'zT03pEAEi0VHKciJODfn',ELEVENLABS_MODEL_ID:'eleven_v4'},async()=>new Response(new Uint8Array([1,2,3]),{headers:{'content-type':'audio/mpeg'}}));
 const voiced=await makeReadingWorkflow(model,provider).run(input({wantAudio:true}));
 assert.equal(voiced.audioProvider,'elevenlabs');assert.equal(voiced.audioVoiceId,'zT03pEAEi0VHKciJODfn');assert.equal(voiced.audioBaseRate,1);
 const failed=speechProvider({ELEVENLABS_API_KEY:'test',ELEVENLABS_VOICE_ID:'zT03pEAEi0VHKciJODfn'},async()=>new Response('unavailable',{status:503}));
 const silent=await makeReadingWorkflow(model,failed).run(input({wantAudio:true}));assert.equal(silent.originalText,input().text);assert.equal(silent.audioBase64,undefined);assert.equal(silent.audioProvider,undefined);
});
test('a foreign ElevenLabs voice is rejected before any credit-consuming request',async()=>{
 let calls=0;const p=speechProvider({ELEVENLABS_API_KEY:'test',ELEVENLABS_VOICE_ID:'foreign-voice',ELEVENLABS_MODEL_ID:'eleven_v4'},async()=>{calls++;return new Response(new Uint8Array([1]),{headers:{'content-type':'audio/mpeg'}});});
 assert.equal(p.configured,false);assert.equal(await p.narrate('नमस्ते'),undefined);assert.equal(calls,0);
});
