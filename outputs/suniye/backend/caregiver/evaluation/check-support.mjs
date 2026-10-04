import assert from 'node:assert/strict';import {writeFile} from 'node:fs/promises';
import {openIndex,indexSources,retrieve,makeCachedGuideWorkflow,embeddingModel,corpusHash} from '../support-search.js';
let db=await openIndex();const indexed=await indexSources(db);const extension=(await db.query("SELECT extversion FROM pg_extension WHERE extname='vector'")).rows[0].extversion;await db.close();db=await openIndex();
try{
const cases=[['Camera and microphone permissions for the app','permissions'],['Increase font size and display size','display'],['Downloaded app restricted settings accessibility screen access','restricted'],['How do I bake a chocolate cake?',null]];const results=[];
const workflow=makeCachedGuideWorkflow(db);
for(const[query,expected]of cases){const start=Date.now(),guide=await workflow.run(query);assert.equal(guide.sources[0]?.id??null,expected);assert.equal(guide.found,expected!==null);results.push({query,expected,found:guide.found,sources:guide.sources,elapsedMs:Date.now()-start});}
await assert.rejects(retrieve(db,'कैमरा कैसे खोलें'));
await retrieve(db,"camera'; DROP TABLE suniye_support;--");assert.equal((await db.query('SELECT count(*)::int AS count FROM suniye_support')).rows[0].count,3);
await db.query("UPDATE suniye_support SET url='https://example.com/unapproved' WHERE id='permissions'");await assert.rejects(retrieve(db,cases[0][0]));await indexSources(db);
const receipt={checkedAt:new Date().toISOString(),scope:'Actual local PostgreSQL (PGlite) with pgvector; local embeddings, Mastra caregiver retrieval, public official sources only. Not Tiger Cloud, Android runtime, real Redmi or general retrieval-quality proof.',providerFees:0,cloudResourcesCreated:false,indexed,extensionVersion:extension,embeddingModel,corpusHash,results,restartPersistence:true,sqlParameterization:true,tamperedReferenceRejected:true,hindiQueriesRejected:true};
await writeFile(new URL('../../../docs/evidence/pgvector-source-search-2026-10-04.json',import.meta.url),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({passed:results.length,pgvector:extension,documents:indexed.indexed,fees:0}));
}finally{await db.close();}
