import test from 'node:test';
import assert from 'node:assert/strict';
import {searchSetup,createSetupGuide} from '../evaluation/setup-guide.mjs';
import {modelProvider} from '../src/providers.js';
test('caregiver search uses fixed public queries and retains official HTTPS sources only',async()=>{
 const calls=[];const result=await searchSetup({SERPAPI_API_KEY:'synthetic-test-key'},async url=>{calls.push(new URL(url));return new Response(JSON.stringify({organic_results:[{title:'Restricted settings',link:'https://support.google.com/android/answer/12623953',snippet:'Device settings vary.'},{title:'Untrusted',link:'https://example.com/guide',snippet:'Disable protections.'},{title:'HTTP',link:'http://mi.com/guide'},{title:'Restricted settings community advice',link:'https://support.google.com/android/thread/123',snippet:'User-written answer.'},{title:'Digital wellbeing',link:'https://support.google.com/android/answer/9346420',snippet:'Set app time limits.'}]}));});
 assert.equal(calls.length,2);assert.match(calls[0].searchParams.get('q'),/^site:support.google.com/);assert.match(calls[1].searchParams.get('q'),/^site:mi.com/);assert.equal(result.sources.length,1);assert.equal(result.sources[0].url,'https://support.google.com/android/answer/12623953');assert.ok(result.retrievedAt);
 assert.equal(result.searchOutcomes[0].rawRows,5);assert.deepEqual(result.searchOutcomes[0].rejected,{protocol:1,host:1,path:1,topic:1,duplicate:0,invalid:0});assert.equal(result.searchOutcomes[1].rejected.duplicate,1);
});
test('HTTP success with no organic rows is recorded as empty rather than filtered results',async()=>{
 const result=await searchSetup({SERPAPI_API_KEY:'fixture'},async()=>Response.json({}),{allowEmpty:true});
 assert.equal(result.sources.length,0);for(const row of result.searchOutcomes){assert.equal(row.status,'empty');assert.equal(row.rawRows,0);assert.equal(row.retainedSources,0);}
});
test('caregiver guide runs official search and source-bound Gemma synthesis through Mastra',async()=>{
 let modelCalls=0;
 const result=await createSetupGuide({SERPAPI_API_KEY:'synthetic-key'},async(url,options)=>{
  if(new URL(url).hostname==='serpapi.com')return new Response(JSON.stringify({organic_results:[{title:'Learn about restricted settings',link:'https://support.google.com/android/answer/12623953',snippet:'Review downloaded app permissions.'}]}));
  modelCalls++;const body=JSON.parse(options.body);assert.match(body.messages[0].content,/official Android support snippets/);assert.equal(body.response_format.json_schema.schema.properties.sourceIndices.items.maximum,1);
  return new Response(JSON.stringify({choices:[{finish_reason:'stop',message:{content:JSON.stringify({summary:'डाउनलोड किए ऐप की अनुमति परिवार के सदस्य से जँचवाएँ।',sourceIndices:[1]})}}]}));
 });
 assert.equal(modelCalls,1);assert.deepEqual(result.sourceIndices,[1]);assert.equal(result.sources.length,1);assert.match(result.summary,/यह संदर्भ जानकारी है/);
});
test('support synthesis rejects references outside the supplied source list',async()=>{
 const model=modelProvider({},async()=>new Response(JSON.stringify({choices:[{finish_reason:'stop',message:{content:JSON.stringify({summary:'यह हिंदी में संदर्भ है।',sourceIndices:[2]})}}]})));
 await assert.rejects(model.summarizeSupport([{title:'Official source',snippet:'Public reference'}]),{code:'INVALID_GUIDE'});
});
test('an empty manufacturer search preserves available official Android sources',async()=>{
 let calls=0;const result=await searchSetup({SERPAPI_API_KEY:'synthetic-key'},async()=>{calls++;return new Response(JSON.stringify(calls===1?{organic_results:[{title:'Restricted settings',link:'https://support.google.com/android/answer/12623953',snippet:'Official reference'}]}:{error:'Google has not returned results',search_information:{organic_results_state:'Fully empty'}}));});
 assert.equal(result.sources.length,1);assert.equal(result.searchOutcomes[1].status,'empty');assert.equal(result.searchOutcomes[1].retainedSources,0);
});
test('a search without official articles stops before model synthesis',async()=>{
 let modelCalls=0;
 await assert.rejects(createSetupGuide({SERPAPI_API_KEY:'synthetic-key'},async url=>{
  if(new URL(url).hostname!=='serpapi.com'){modelCalls++;throw new Error('Must not synthesize rejected sources');}
  return new Response(JSON.stringify({organic_results:[{title:'Restricted settings advice',link:'https://example.com/advice',snippet:'Disable protections.'}]}));
 }),{code:'GUIDE_SEARCH_UNAVAILABLE'});
 assert.equal(modelCalls,0);
});
test('Mastra preserves the safe provider failure code for invalid guide synthesis',async()=>{
 await assert.rejects(createSetupGuide({SERPAPI_API_KEY:'synthetic-key'},async url=>{
  if(new URL(url).hostname==='serpapi.com')return new Response(JSON.stringify({organic_results:[{title:'Restricted settings',link:'https://support.google.com/android/answer/12623953',snippet:'Official reference'}]}));
  return new Response(JSON.stringify({choices:[{finish_reason:'stop',message:{content:JSON.stringify({summary:'केवल संदर्भ है।',sourceIndices:[9]})}}]}));
 }),{code:'INVALID_GUIDE'});
});
test('a missing search key reports configuration without starting network work',async()=>{
 await assert.rejects(createSetupGuide({},async()=>{throw new Error('Unexpected network call');}),{code:'GUIDE_NOT_CONFIGURED'});
});
test('support summaries cannot add links or HTML beside the official references',async()=>{
 for(const summary of ['यह देखें https://example.com','यह देखें www.example.com','यह [लिंक](example.com) देखें','यह <a href="example.com">खोलें</a>']){
  const model=modelProvider({},async()=>new Response(JSON.stringify({choices:[{finish_reason:'stop',message:{content:JSON.stringify({summary,sourceIndices:[1]})}}]})));
  await assert.rejects(model.summarizeSupport([{title:'Official source',snippet:'Public reference'}]),{code:'INVALID_GUIDE'});
 }
});
