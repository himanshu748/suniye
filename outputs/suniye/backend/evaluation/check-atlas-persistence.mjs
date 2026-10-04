import {buildServer} from '../src/server.js';
import {createRequire} from 'node:module';
import {randomUUID} from 'node:crypto';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';

process.loadEnvFile('.env');
const uri=process.env.MONGODB_URI;
if(!uri || uri.includes('<') || uri.includes('YOUR_PASSWORD')) {
 console.log(JSON.stringify({status:'blocked',reason:'MONGODB_URI is not configured; no network request or database write made.'}));
 process.exit(2);
}
assert(process.env.FAMILY_TOKEN,'Family authentication is missing.');
const require=createRequire(new URL('../package.json',import.meta.url));
const {MongoClient}=require('mongodb');
const profile='atlas_probe_'+randomUUID().replaceAll('-','').slice(0,24);
const receipt={testedAt:new Date().toISOString(),integration:'MongoDB Atlas',transport:'Actual HTTP requests to local Fastify backend using the real Atlas MongoDB driver connection',collection:'suniye.preferences',material:'Synthetic settings only; no family messages, images or documents',checks:{},limitations:'Local backend to Atlas only. Does not verify Render-to-Atlas connectivity, Android sync or parent usability.'};
const initial={language:'hi',speed:.85,textScale:1.3,placement:'right'};
const updated={language:'hi',speed:.7,textScale:1.6,placement:'left'};
const headers={authorization:'Bearer '+process.env.FAMILY_TOKEN};
let app; let origin; let cleanupNeeded=false;
async function start() {
 app=await buildServer({env:{...process.env,SENTRY_DSN:''}});
 origin=await app.listen({host:'127.0.0.1',port:0});
 const health=await request('/health',{},false);
 assert.equal(health.status,200); assert.equal(health.body.capabilities.preferenceSync,true,'Atlas driver connection is unavailable.');
}
async function request(path,options={},authenticated=true) {
 const response=await fetch(origin+path,{...options,headers:{...(authenticated?headers:{}),...(options.body?{'content-type':'application/json'}:{})},signal:AbortSignal.timeout(15000)});
 return {status:response.status,body:await response.json()};
}
let failure;
try {
 await start();
 const empty=await request('/v1/preferences/'+profile); assert.equal(empty.status,200); assert.equal(empty.body.preferences,null);
 // Set cleanup before the write: a request timeout might occur after a successful database update.
 cleanupNeeded=true;
 const saved=await request('/v1/preferences/'+profile,{method:'PUT',body:JSON.stringify(initial)}); assert.equal(saved.status,200); assert.equal(saved.body.saved,true);
 const read=await request('/v1/preferences/'+profile); assert.equal(read.status,200); assert.deepEqual(read.body.preferences,initial); receipt.checks.initialWriteRead='HTTP 200; exact settings matched';
 await app.close(); app=undefined;
 await start();
 const persisted=await request('/v1/preferences/'+profile); assert.equal(persisted.status,200); assert.deepEqual(persisted.body.preferences,initial); receipt.checks.backendRestartPersistence='HTTP 200 from a new backend/driver instance; exact settings retained';
 const update=await request('/v1/preferences/'+profile,{method:'PUT',body:JSON.stringify(updated)}); assert.equal(update.status,200);
 const changed=await request('/v1/preferences/'+profile); assert.equal(changed.status,200); assert.deepEqual(changed.body.preferences,updated); receipt.checks.preferenceUpdate='HTTP 200; slower speech, larger text and left placement retained';
 const invalid=await request('/v1/preferences/'+profile,{method:'PUT',body:JSON.stringify({...updated,message:'Synthetic message must not be stored'})}); assert.equal(invalid.status,400); receipt.checks.messageFieldRejected='HTTP 400';
 const unchanged=await request('/v1/preferences/'+profile); assert.deepEqual(unchanged.body.preferences,updated); receipt.checks.invalidWriteDidNotChangePreferences='pass';
 const denied=await request('/v1/preferences/'+profile,{},false); assert.equal(denied.status,401); receipt.checks.unauthenticatedRead='HTTP 401';
} catch(error) {
 failure={type:error.name,code:error.code??null};
 receipt.failure=failure;
} finally {
 if(app) await app.close();
 if(cleanupNeeded) {
  const mongo=new MongoClient(uri,{serverSelectionTimeoutMS:4000});
  try {
   await mongo.connect(); const collection=mongo.db('suniye').collection('preferences');
   const removed=await collection.deleteOne({_id:profile}); const absent=await collection.findOne({_id:profile});
   assert.equal(absent,null); receipt.checks.ownedSyntheticRecordCleanup={deletedCount:removed.deletedCount,recordAbsent:true};
  } catch(error) { receipt.cleanupFailure={type:error.name,code:error.code??null}; failure??=receipt.cleanupFailure; }
  finally { await mongo.close(); }
 }
 receipt.status=failure?'failed':'pass';
 await writeFile('../docs/evidence/atlas-persistence-2026-10-04.json',JSON.stringify(receipt,null,2)+'\n');
 console.log(JSON.stringify({status:receipt.status,checks:receipt.checks,...(failure?{failure}:{}),receipt:'../docs/evidence/atlas-persistence-2026-10-04.json'}));
 if(failure)process.exitCode=1;
}
