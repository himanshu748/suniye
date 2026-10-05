import test from 'node:test';
import assert from 'node:assert/strict';
import {modelProvider} from '../src/providers.js';
import {makeReadingWorkflow} from '../src/workflow.js';
import {backboardAdapter} from '../src/backboard.js';

const model='google/gemma-3-4b-it';
const messages=[{role:'system',content:'Explain faithfully.'},{role:'user',content:'नमस्ते।'}];
test('Stop before dispatch spends nothing; Stop after dispatch cleans the returned thread',async()=>{
 const counter=quota(),controller=new AbortController(),requests=[];
 const thread='12345678-1234-1234-1234-123456789012';
 const adapter=backboardAdapter({BACKBOARD_API_KEY:'fixture'},async(url,options)=>{
  requests.push(url);if(options.method==='DELETE')return new Response(null,{status:204});
  controller.abort();assert.equal(options.signal.aborted,false);
  return Response.json({status:'COMPLETED',model_name:model,model_provider:'openrouter',content:'नमस्ते।',thread_id:thread});
 });adapter.setStore(counter);
 const stopped=new AbortController();stopped.abort();
 await assert.rejects(adapter.complete({messages,model,signal:stopped.signal}),e=>e.code==='CANCELLED');assert.equal(counter.count(),0);
 await assert.rejects(adapter.complete({messages,model,signal:controller.signal}),e=>e.code==='CANCELLED');assert.equal(counter.count(),1);assert.equal(requests.length,2);assert.equal(requests[1],'https://app.backboard.io/api/threads/'+thread);
});
function quota(){let calls=0;return {async updateOne(){},async findOneAndUpdate(query){if(calls>=query.calls.$lt)return null;return {calls:++calls};},count:()=>calls};}
test('Backboard requires a persistent quota and counts uncertain calls without retry',async()=>{
 let calls=0;const adapter=backboardAdapter({BACKBOARD_API_KEY:'fixture'},async()=>{calls++;throw new Error('connection lost');});
 await assert.rejects(adapter.complete({messages,model}),e=>e.code==='MODEL_NOT_CONFIGURED');assert.equal(calls,0);
 const counter=quota();adapter.setStore(counter);
 for(let i=0;i<8;i++)await assert.rejects(adapter.complete({messages,model}));
 await assert.rejects(adapter.complete({messages,model}),e=>e.code==='MODEL_DAILY_LIMIT');assert.equal(calls,8);assert.equal(counter.count(),8);
});
test('Backboard validates the actual model, disables memory/tools, and cleans only returned thread',async()=>{
 const requests=[];const thread='12345678-1234-1234-1234-123456789012';
 const adapter=backboardAdapter({BACKBOARD_API_KEY:'fixture'},async(url,options)=>{
  requests.push({url,options});return options.method==='DELETE'?new Response(null,{status:204}):Response.json({status:'COMPLETED',model_name:model,model_provider:'openrouter',content:'नमस्ते।',thread_id:thread,tool_calls:[],input_tokens:10,output_tokens:4,total_tokens:14});
 });adapter.setStore(quota());
 const result=await adapter.complete({messages,model});assert.equal(result.choices[0].message.content,'नमस्ते।');
 const body=JSON.parse(requests[0].options.body);assert.equal(body.memory,'off');assert.equal(body.web_search,'off');assert.deepEqual(body.tools,[]);assert.equal(requests.length,2);assert.equal(requests[1].url,'https://app.backboard.io/api/threads/'+thread);
});
test('Backboard rejects a foreign or incomplete model answer before it reaches narration',async()=>{
 const adapter=backboardAdapter({BACKBOARD_API_KEY:'fixture'},async()=>Response.json({status:'COMPLETED',model_name:'wrong-model',model_provider:'openrouter',content:'invented'}));adapter.setStore(quota());
 await assert.rejects(adapter.complete({messages,model}),e=>e.code==='INCOMPLETE');
 await assert.rejects(adapter.complete({messages:[{role:'user',content:'x'.repeat(3001)}],model}),e=>e.code==='INCOMPLETE');
});

test('hosted picture fallback uploads nothing and consumes no model or speech quota',async()=>{
 let requests=0,narrations=0;const counter=quota();const env={MODEL_PROTOCOL:'backboard',MODEL_ID:model,BACKBOARD_API_KEY:'fixture'};
 const fetcher=async()=>{requests++;throw Error('must not upload an image');};const provider=modelProvider(env,fetcher);provider.setQuotaStore(counter);
 const image='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB';
 const flow=makeReadingWorkflow(provider,{narrate:async()=>{narrations++;}});
 const result=await flow.run({requestId:'12345678-1234-4234-8234-123456789012',language:'hi',mode:'read',image,wantAudio:true});
 assert.equal(result.kind,'retake');assert.match(result.retakeReason,/उपलब्ध नहीं/);assert.equal(requests,0);assert.equal(narrations,0);assert.equal(counter.count(),0);assert.equal(provider.pictureDescriptionAvailable,false);
 const adapter=backboardAdapter(env,fetcher);adapter.setStore(counter);
 await assert.rejects(adapter.complete({model,messages:[{role:'user',content:[{type:'image_url',image_url:{url:image}}]}]}),e=>e.code==='PICTURE_NOT_AVAILABLE');assert.equal(counter.count(),0);assert.equal(requests,0);
});
