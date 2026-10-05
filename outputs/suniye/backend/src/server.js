import Fastify from 'fastify';
import rateLimit from '@fastify/rate-limit';
import { createHash, timingSafeEqual } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { MongoClient } from 'mongodb';
import { readInput, preferences, validateImage, PublicError } from './contracts.js';
import { modelProvider, speechProvider } from './providers.js';
import { makeReadingWorkflow } from './workflow.js';
import { setupTelemetry, activeTraceId } from './telemetry.js';
import { registerLanding } from './landing-site.js';
import {hostedSupport} from './hosted-support.js';

export async function buildServer({env=process.env, model=modelProvider(env),speech=speechProvider(env),preferenceStore}={}) {
  if(!env.FAMILY_TOKEN || env.FAMILY_TOKEN.length<32)throw new Error('Set a random FAMILY_TOKEN of at least 32 characters.');
  const app=Fastify({logger:false,bodyLimit:4_300_000,requestTimeout:90000,connectionTimeout:95000});
  const expected=createHash('sha256').update(env.FAMILY_TOKEN).digest();
  const auth=async(request,reply)=>{
    const candidate=String(request.headers.authorization||'').replace(/^Bearer /,'');
    if(!timingSafeEqual(expected,createHash('sha256').update(candidate).digest())) return reply.code(401).send({code:'UNAUTHORIZED',message:'परिवार की सेटिंग में कनेक्शन जाँचें।'});
  };
  app.addHook('onRequest',async(request,reply)=>{
    if(request.routeOptions.url?.startsWith('/v1/')) {
      // Readings and caregiver settings remain private, including auth/error replies.
      reply.header('Cache-Control','no-store');
      return auth(request,reply);
    }
  });
  await app.register(rateLimit,{max:60,timeWindow:'1 minute'});
  const trace=setupTelemetry(env); const pipeline=makeReadingWorkflow(model,speech,trace);

  let concurrent=0;
  let mongo;
  let store=preferenceStore;
  if(!store && env.MONGODB_URI) {
    mongo=new MongoClient(env.MONGODB_URI,{serverSelectionTimeoutMS:4000});
    try {await mongo.connect();store=mongo.db('suniye').collection('preferences');}
    catch {await mongo.close();mongo=undefined;}
  }
  app.addHook('onClose',async()=>{if(mongo)await mongo.close();});
  model.setQuotaStore?.(store);
  const support=hostedSupport(env,store);
  app.addHook('onClose',()=>support.close());
  app.setErrorHandler((error,_request,reply)=>{
    const status=error instanceof PublicError?error.status:(error.statusCode===413?413:error.statusCode>=400&&error.statusCode<500?error.statusCode:500);
    return reply.code(status).send({code:error instanceof PublicError?error.code:status===413?'TOO_LARGE':status===429?'BUSY':status>=400&&status<500?'INVALID_INPUT':'READ_FAILED',message:error instanceof PublicError?error.message:status===429?'थोड़ी देर रुककर फिर कोशिश करें।':'यह पढ़ नहीं पाया। फिर कोशिश करें।'});
  });
  registerLanding(app);
  app.get('/health',async()=>({status:'ok',revision:env.RENDER_GIT_COMMIT?.slice(0,12),capabilities:{model:model.id,modelProvider:model.runtimeProvider||'test',modelConfigured:model.runtimeConfigured?.()||false,hindiSpeech:speech.configured,preferenceSync:Boolean(store),tracing:Boolean(env.SENTRY_DSN),caregiverHelp:true,currentSupportSearch:Boolean(store&&env.SERPAPI_API_KEY)}}));
  app.get('/v1/caregiver/help/:topic',async request=>support.help(request.params.topic));
  app.post('/v1/caregiver/search',{config:{rateLimit:{max:3,timeWindow:'1 minute'}}},async(request,reply)=>{
    if(request.body&&Object.keys(request.body).length)return reply.code(400).send({code:'INVALID_INPUT'});
    return support.search();
  });
  app.post('/v1/read',{config:{rateLimit:{max:12,timeWindow:'1 minute'}}},async(request,reply)=>{
    const parsed=readInput.safeParse(request.body);
    if(!parsed.success)return reply.code(400).send({code:'INVALID_INPUT',message:'पाठ या एक साफ़ चित्र भेजें।'});
    if(parsed.data.image)validateImage(parsed.data.image);
    if(concurrent>=2)return reply.code(429).send({code:'BUSY',message:'एक और पढ़ना चल रहा है। थोड़ी देर में कोशिश करें।'});
    const controller=new AbortController();
    const cancel=()=>{if(!reply.raw.writableEnded)controller.abort();};
    reply.raw.once('close',cancel); concurrent++;
    try {return await trace('suniye.read',()=>{const id=activeTraceId();if(id)reply.header('X-Suniye-Trace',id);return pipeline.run(parsed.data,controller.signal);});}
    finally {concurrent--;reply.raw.off('close',cancel);}
  });
  app.get('/v1/preferences/:profile',{},async(request,reply)=>{
    if(!store)return reply.code(503).send({code:'SYNC_UNAVAILABLE',message:'सेटिंग इस फ़ोन पर सुरक्षित है।'});
    if(!/^[a-zA-Z0-9_-]{1,40}$/.test(request.params.profile))return reply.code(400).send({code:'INVALID_PROFILE'});
    const doc=await store.findOne({_id:request.params.profile});
    return {preferences:doc?.preferences||null};
  });
  app.put('/v1/preferences/:profile',{},async(request,reply)=>{
    const parsed=preferences.safeParse(request.body);
    if(!/^[a-zA-Z0-9_-]{1,40}$/.test(request.params.profile)||!parsed.success)return reply.code(400).send({code:'INVALID_PREFERENCES'});
    if(!store)return reply.code(503).send({code:'SYNC_UNAVAILABLE',message:'सेटिंग इस फ़ोन पर सुरक्षित है।'});
    await store.updateOne({_id:request.params.profile},{$set:{preferences:parsed.data,updatedAt:new Date()}},{upsert:true});
    return {saved:true};
  });
  return app;
}

if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  const app=await buildServer();
  await app.listen({host:'0.0.0.0',port:Number(process.env.PORT||8787)});
  console.log('Suniye backend ready; request content logging disabled.');
}
