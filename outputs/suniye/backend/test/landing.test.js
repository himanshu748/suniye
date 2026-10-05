import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import {buildServer} from '../src/server.js';
import {landingFiles} from '../src/landing-site.js';
const token='offline-static-fixture-token-0123456789';
async function server(t) {
  let providerCalls=0;
  const unexpected=async()=>{providerCalls++;throw new Error('Static requests must not call a provider');};
  const app=await buildServer({env:{FAMILY_TOKEN:token},model:{id:'offline-static-test',extract:async input=>{providerCalls++;return {kind:'reading',originalText:input.text,description:'',retakeReason:''};},explain:unexpected},speech:{configured:false,narrate:unexpected}});
  t.after(()=>app.close());return {app,calls:()=>providerCalls};
}
test('root serves exact current landing with restrictive headers and HEAD',async t=>{
  const {app,calls}=await server(t);const source=await readFile(new URL('../../../../landing/index.html',import.meta.url));
  const response=await app.inject({url:'/'});assert.equal(response.statusCode,200);assert.deepEqual(response.rawPayload,source);
  assert.match(response.body,/parent-ux-2026-10-05\/suniye-parent-ux-0.4\.apk/);assert.match(response.body,/instrumentation suites/);
  assert.match(response.headers['content-type'],/^text\/html/);assert.match(response.headers['content-security-policy'],/connect-src 'none'/);assert.match(response.headers['content-security-policy'],/frame-ancestors 'none'/);
  assert.equal(response.headers['x-content-type-options'],'nosniff');assert.equal(response.headers['referrer-policy'],'no-referrer');assert.equal(response.headers['cache-control'],'public, max-age=0, must-revalidate');
  const head=await app.inject({method:'HEAD',url:'/'});assert.equal(head.statusCode,200);assert.equal(head.body,'');assert.equal(Number(head.headers['content-length']),source.length);assert.equal(calls(),0);
});
test('every allowlisted public asset is byte-identical with intended MIME',async t=>{
  const {app,calls}=await server(t);
  for(const [url,[file,mime]] of Object.entries(landingFiles)) {
    const response=await app.inject({url});assert.equal(response.statusCode,200,url);
    assert.deepEqual(response.rawPayload,await readFile(new URL('../../../../landing/'+file,import.meta.url)),file);
    assert.equal(response.headers['content-type'],mime,url);assert.equal(response.headers['x-content-type-options'],'nosniff');
  }
  assert.equal(Object.keys(landingFiles).length,15);assert.equal(calls(),0);
});
test('no wildcard or traversal can serve server source, docs or environment files',async t=>{
  const {app,calls}=await server(t);
  for(const url of ['/src/server.js','/assets/unknown.png','/.env','/package.json','/landing/PRODUCT.md','/assets/%2e%2e/%2e%2e/src/server.js','/assets/%2e%2e/package.json']) {
    const response=await app.inject({url});assert.equal(response.statusCode,404,url);assert.doesNotMatch(response.body,/FAMILY_TOKEN|import Fastify|Suniye landing product context/);
  }
  assert.equal((await app.inject({method:'POST',url:'/'})).statusCode,404);assert.equal(calls(),0);
});
test('welcome redirects to canonical root and health/API behavior stays intact',async t=>{
  const {app,calls}=await server(t);const welcome=await app.inject({url:'/welcome'});assert.equal(welcome.statusCode,302);assert.equal(welcome.headers.location,'/');
  const health=await app.inject({url:'/health'});assert.equal(health.statusCode,200);assert.equal(health.json().status,'ok');assert.equal(health.json().capabilities.model,'offline-static-test');
  for(const request of [{method:'POST',url:'/v1/read',payload:{}},{method:'GET',url:'/v1/preferences/test'},{method:'PUT',url:'/v1/preferences/test',payload:{}}]) {
    const response=await app.inject(request);assert.equal(response.statusCode,401);assert.equal(response.headers['cache-control'],'no-store');
  }
  const source='Safe synthetic amount 1250.';const reading=await app.inject({method:'POST',url:'/v1/read',headers:{authorization:'Bearer '+token},payload:{requestId:randomUUID(),language:'hi',mode:'read',text:source,wantAudio:false}});
  assert.equal(reading.statusCode,200);assert.equal(reading.json().originalText,source);assert.equal(reading.headers['cache-control'],'no-store');assert.equal(calls(),1);
});

test('walkthrough player supports bounded byte ranges and rejects malformed ranges',async t=>{
 const {app,calls}=await server(t);const source=await readFile(new URL('../../../../landing/assets/suniye-walkthrough.mp4',import.meta.url));
 for(const [range,start,end] of [['bytes=0-31',0,31],['bytes=-16',source.length-16,source.length-1],['bytes=32-',32,source.length-1]]){
  const r=await app.inject({url:'/assets/suniye-walkthrough.mp4',headers:{range}});assert.equal(r.statusCode,206);assert.equal(r.headers['content-range'],`bytes ${start}-${end}/${source.length}`);assert.deepEqual(r.rawPayload,source.subarray(start,end+1));
 }
 for(const range of ['bytes=999999999-','bytes=-0','bytes=2-1','bytes=','bytes=0-1,4-5'])assert.equal((await app.inject({url:'/assets/suniye-walkthrough.mp4',headers:{range}})).statusCode,416);
 assert.equal(calls(),0);
});
