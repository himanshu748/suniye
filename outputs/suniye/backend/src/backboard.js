import {PublicError} from './contracts.js';

// A runtime adapter, distinct from the completed six-call development comparison.
// Quota reservations persist in Atlas as counters only, never reading content.
export function backboardAdapter(env,fetcher=fetch) {
 let store;
 const limit=Math.min(8,Math.max(1,Number(env.BACKBOARD_DAILY_LIMIT)||8));
 const endpoint='https://app.backboard.io/api';
 async function reserve(){
  if(!store)throw new PublicError('MODEL_NOT_CONFIGURED','AI की सेटिंग अभी नहीं जुड़ी है। मूल पाठ सुनिए।',503);
  const id='service_backboard_'+new Date().toISOString().slice(0,10);
  try{await store.updateOne({_id:id},{$setOnInsert:{calls:0,purpose:'model-call-limit'}},{upsert:true});}catch(e){if(e.code!==11000)throw e;}
  const reserved=await store.findOneAndUpdate({_id:id,calls:{$lt:limit}},{$inc:{calls:1},$set:{updatedAt:new Date()}},{returnDocument:'after'});
  if(!reserved)throw new PublicError('MODEL_DAILY_LIMIT','आज की AI सीमा पूरी है। अगली सुबह साढ़े पाँच बजे फिर मिलेगी। मूल पाठ और शब्दों की मदद अभी सुन सकते हैं।',429);
 }
 return {
  setStore(value){store=value;},
  configured(){return Boolean(store&&env.BACKBOARD_API_KEY);},
  async complete({messages,model,schema,signal}){
   if(!env.BACKBOARD_API_KEY)throw new PublicError('MODEL_NOT_CONFIGURED','AI की सेटिंग अभी नहीं जुड़ी है। मूल पाठ सुनिए।',503);
   if(!['google/gemma-3-4b-it','google/gemma-3-27b-it'].includes(model))throw new PublicError('MODEL_NOT_CONFIGURED','परिवार की AI सेटिंग जाँचें।',503);
   const user=messages.filter(m=>m.role==='user');
   const content=user.map(m=>Array.isArray(m.content)?m.content.filter(p=>p.type==='text').map(p=>p.text).join('\n'):m.content).join('\n');
   if(content.length>3000)throw new PublicError('INCOMPLETE','AI के लिए छोटा हिस्सा खोलकर फिर कोशिश करें।',422);
   const images=user.flatMap(m=>Array.isArray(m.content)?m.content.filter(p=>p.type==='image_url').map(p=>p.image_url.url):[]);
   if(images.length)throw new PublicError('PICTURE_NOT_AVAILABLE','चित्र का वर्णन अभी उपलब्ध नहीं है। लिखावट का साफ़ फ़ोटो लें।',503);
   const routing=model==='google/gemma-3-27b-it'?{providers:['nebius/fp8'],allow_fallbacks:false,max_price:{prompt:0.12,completion:0.3}}:{providers:['deepinfra/bf16'],allow_fallbacks:false,max_price:{prompt:0.05,completion:0.1}};
   const body={content,system_prompt:messages.filter(m=>m.role==='system').map(m=>m.content).join('\n'),llm_provider:'openrouter',model_name:model,openrouter:routing,memory:'off',web_search:'off',image_generation:'off',video_generation:'off',tools:[],stream:false,thinking:null,json_output:Boolean(schema)};
   const payload=JSON.stringify(body),headers={'X-API-Key':env.BACKBOARD_API_KEY,'content-type':'application/json'};
   if(signal?.aborted)throw new PublicError('CANCELLED','पढ़ना रोक दिया गया।',499);
   await reserve();if(signal?.aborted)throw new PublicError('CANCELLED','पढ़ना रोक दिया गया।',499);
   let thread;
   try{
    // Once dispatched, finish the bounded response so Stop still permits cleanup
    // of its returned thread. Nothing is delivered to a cancelled reader.
    const response=await fetcher(endpoint+'/threads/messages',{method:'POST',redirect:'error',signal:AbortSignal.timeout(45000),headers,body:payload});
    if(!response.ok){await response.body?.cancel();throw new PublicError('MODEL_UNAVAILABLE','AI अभी नहीं मिला। मूल पाठ सुनिए।',503);}
    const reader=response.body.getReader(),chunks=[];let size=0;
    for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>250000){await reader.cancel();throw new PublicError('INCOMPLETE','AI का उत्तर पूरा नहीं मिला।',422);}chunks.push(value);}
    const raw=Buffer.concat(chunks).toString('utf8');
    const data=JSON.parse(raw);thread=data.thread_id;
    if(data.status!=='COMPLETED'||data.model_name!==model||data.model_provider!=='openrouter'||data.tool_calls?.length||typeof data.content!=='string'||!data.content.trim()||data.content.length>25000)throw new PublicError('INCOMPLETE','AI का उत्तर पूरा नहीं मिला। मूल पाठ सुनिए।',422);
    if(signal?.aborted)throw new PublicError('CANCELLED','पढ़ना रोक दिया गया।',499);
    return {model,choices:[{message:{content:data.content},finish_reason:'stop'}],usage:{prompt_tokens:data.input_tokens,completion_tokens:data.output_tokens,total_tokens:data.total_tokens}};
   }finally{
    // Delete only the request's returned thread. An uncertain call is not retried.
    if(typeof thread==='string'&&/^[0-9a-f-]{36}$/i.test(thread))try{const r=await fetcher(endpoint+'/threads/'+thread,{method:'DELETE',redirect:'error',signal:AbortSignal.timeout(10000),headers:{'X-API-Key':env.BACKBOARD_API_KEY}});await r.body?.cancel();}catch{}
   }
  },
 };
}
