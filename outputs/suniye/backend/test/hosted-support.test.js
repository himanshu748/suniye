import test from 'node:test';import assert from 'node:assert/strict';
import {buildServer} from '../src/server.js';
const token='hosted-support-synthetic-token-0123456789';
test('hosted caregiver retrieval is authenticated and queries real pgvector without model/network calls',async t=>{
 const forbidden=()=>{throw Error('Must not call a model or voice for fixed help');};
 const app=await buildServer({env:{FAMILY_TOKEN:token},model:{id:'test',extract:forbidden,explain:forbidden},speech:{configured:false,narrate:forbidden}});t.after(()=>app.close());
 assert.equal((await app.inject('/v1/caregiver/help/permissions')).statusCode,401);
 const headers={authorization:'Bearer '+token};
 for(const topic of ['permissions','display','restricted']){const r=await app.inject({url:'/v1/caregiver/help/'+topic,headers});assert.equal(r.statusCode,200);assert.equal(r.json().sources[0].id,topic);assert.equal(r.json().pgvector,'0.8.1');assert.equal(r.json().dimensions,384);assert.equal(r.headers['cache-control'],'no-store');}
 assert.equal((await app.inject({url:'/v1/caregiver/help/arbitrary',headers})).statusCode,400);
 const missing=await app.inject({method:'POST',url:'/v1/caregiver/search',headers,payload:{}});assert.equal(missing.statusCode,503);assert.equal(missing.json().code,'GUIDE_NOT_CONFIGURED');
 assert.equal((await app.inject({method:'POST',url:'/v1/caregiver/search',headers,payload:{text:'private message'}})).statusCode,400);
 const page=await app.inject('/caregiver');assert.equal(page.statusCode,200);assert.match(page.headers['content-security-policy'],/connect-src 'self'/);assert.match(page.headers['content-security-policy'],/media-src 'self' blob:/);
});
