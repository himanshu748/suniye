import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {PGlite} from '@electric-sql/pglite';
import {vector} from '@electric-sql/pglite-pgvector';
import {corpusHash,embeddingModel,makeCachedGuideWorkflow} from '../caregiver/support-search.js';
import {PublicError} from './contracts.js';
import {searchSetup} from '../evaluation/setup-guide.mjs';
const frozen=JSON.parse(await readFile(new URL('../caregiver/hosted-vectors.json',import.meta.url),'utf8'));
export const helpTopics=Object.freeze(Object.keys(frozen.queries));
export function hostedSupport(env,store,fetcher=fetch){
 let database,ready,inflight;
 async function initialise(){
  if(frozen.corpusHash!==corpusHash||frozen.embeddingModel!==embeddingModel)throw new Error('Rebuild caregiver vectors.');
  const seed=await readFile(new URL('../caregiver/hosted-index.tar.gz',import.meta.url));
  const manifest=JSON.parse(await readFile(new URL('../caregiver/hosted-index-manifest.json',import.meta.url),'utf8'));
  if(manifest.corpusHash!==corpusHash||manifest.sha256!==createHash('sha256').update(seed).digest('hex'))throw new Error('Rebuild caregiver seed.');
  database=new PGlite({extensions:{vector},loadDataDir:new Blob([seed]),initialMemory:128*1024*1024,postgresqlconf:["shared_buffers = '8MB'","work_mem = '1MB'","maintenance_work_mem = '8MB'"]});await database.waitReady;
  const version=(await database.query("SELECT extversion FROM pg_extension WHERE extname='vector'")).rows[0].extversion;
  return {version,workflow:makeCachedGuideWorkflow(database,async texts=>texts.map(text=>{
   const query=Object.values(frozen.queries).find(q=>q.text===text);if(!query)throw new Error('Unapproved help topic.');return query.vector;
  }))};
 }
 async function freshSearch(){
  if(!env.SERPAPI_API_KEY||!store)throw new PublicError('GUIDE_NOT_CONFIGURED','ताज़ा संदर्भ अभी नहीं जुड़े हैं। नीचे की मदद खोलें।',503);
  const cached=await store.findOne({_id:'service_support_cache'});
  if(cached?.result&&Date.now()-new Date(cached.updatedAt).getTime()<6*60*60*1000)return {...cached.result,cached:true,freshReferencesFound:cached.result.sources.length>0};
  const id='service_support_'+new Date().toISOString().slice(0,10);
  try{await store.updateOne({_id:id},{$setOnInsert:{calls:0,purpose:'public-support-search-limit'}},{upsert:true});}catch(e){if(e.code!==11000)throw e;}
  const slot=await store.findOneAndUpdate({_id:id,calls:{$lt:2}},{$inc:{calls:1},$set:{updatedAt:new Date()}},{returnDocument:'after'});
  if(!slot)throw new PublicError('GUIDE_DAILY_LIMIT','आज की खोज सीमा पूरी है। नीचे की मदद खोलें।',429);
  let result;try{result=await searchSetup(env,fetcher,{allowEmpty:true});}catch{throw new PublicError('GUIDE_SEARCH_UNAVAILABLE','ताज़ा आधिकारिक संदर्भ नहीं मिला। नीचे की मदद खोलें।',503);}
  await store.updateOne({_id:'service_support_cache'},{$set:{result,updatedAt:new Date(),purpose:'public-support-cache'}},{upsert:true});
  return {...result,cached:false,freshReferencesFound:result.sources.length>0};
 }
 return {
  async help(topic){
   if(!helpTopics.includes(topic))throw new PublicError('INVALID_TOPIC','नीचे दिए मदद के बटन में से चुनें।',400);
   ready??=initialise().catch(async error=>{if(database)try{await database.close();}catch{}database=undefined;ready=undefined;throw error;});const {version,workflow}=await ready;
   return {...await workflow.run(frozen.queries[topic].text),topic,pgvector:version,dimensions:384,corpusHash,embeddingMode:'Frozen public-source and fixed-topic vectors; live pgvector retrieval'};
  },
  async search(){inflight??=freshSearch().finally(()=>{inflight=undefined;});return inflight;},
  async close(){if(ready)try{await ready;}catch{}if(database)await database.close();},
 };
}
