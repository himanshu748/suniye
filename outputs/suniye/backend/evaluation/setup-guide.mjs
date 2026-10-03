import {createStep,createWorkflow} from '@mastra/core/workflows';
import {noopLogger} from '@mastra/core/logger';
import {z} from 'zod';
import {writeFile,mkdir} from 'node:fs/promises';
import {modelProvider} from '../src/providers.js';
import {PublicError} from '../src/contracts.js';
// Fixed public setup questions. Never accept a reading, photo or family message as a query.
const queries=[
 'site:support.google.com/android "Learn about restricted settings"',
 'site:mi.com/global/support/faq/ "Redmi A4" autostart',
];
export async function searchSetup(env=process.env,fetcher=fetch){
 if(!env.SERPAPI_API_KEY)throw new PublicError('GUIDE_NOT_CONFIGURED','परिवार की सेटिंग की मदद के लिए SERPAPI_API_KEY अभी नहीं जोड़ा गया है।');
 const sources=[],searchOutcomes=[];
 for(const q of queries){
  const params=new URLSearchParams({engine:'google',q,api_key:env.SERPAPI_API_KEY,num:'5',hl:'en',gl:'in'});
  const response=await fetcher('https://serpapi.com/search.json?'+params,{signal:AbortSignal.timeout(20000)});
  if(!response.ok)throw new Error('Setup search unavailable.');
  const bytes=await response.text();if(bytes.length>500000)throw new Error('Setup response too large.');
  const data=JSON.parse(bytes);
  if(data.search_information?.organic_results_state==='Fully empty'){searchOutcomes.push({queryIndex:searchOutcomes.length+1,status:'empty',retainedSources:0});continue;}
  if(data.error)throw new Error('Setup search unavailable.');
  const before=sources.length;
  for(const row of (data.organic_results||[]).slice(0,5)){
   try{const url=new URL(row.link);if(url.protocol!=='https:'||!['support.google.com','mi.com','www.mi.com'].includes(url.hostname))continue;
    // Community threads share Google's support host but are user-authored.
    if(url.hostname==='support.google.com'&&!/^\/android\/answer\//.test(url.pathname))continue;
    if(['mi.com','www.mi.com'].includes(url.hostname)&&!/^\/(?:global\/)?support\//.test(url.pathname))continue;
    if(!/restricted settings|accessibility|autostart|background|app permissions|Redmi A4/i.test(String(row.title||'')+' '+String(row.snippet||'')))continue;
    if(!sources.some(s=>s.url===url.href))sources.push({title:String(row.title||'Official support').slice(0,200),url:url.href,snippet:String(row.snippet||'').slice(0,1000)});
   }catch{}
  }
  searchOutcomes.push({queryIndex:searchOutcomes.length+1,status:'results',retainedSources:sources.length-before});
 }
 if(!sources.length)throw new Error('No official support results. Use manual caregiver setup.');
 return {retrievedAt:new Date().toISOString(),queries,sources,searchOutcomes};
}
export async function createSetupGuide(env=process.env,fetcher=fetch,onSources=async()=>{}){
 let failure,phase='search';
 const preserveFailure=async(fn)=>{try{return await fn();}catch(error){failure=error;throw error;}};
 const schema=z.object({retrievedAt:z.string(),queries:z.array(z.string()),sources:z.array(z.object({title:z.string(),url:z.string(),snippet:z.string()})),searchOutcomes:z.array(z.object({queryIndex:z.number().int(),status:z.enum(['results','empty']),retainedSources:z.number().int()}))});
 const search=createStep({id:'find-official-setup',inputSchema:z.object({}),outputSchema:schema,execute:async()=>preserveFailure(async()=>{const result=await searchSetup(env,fetcher);await onSources(result);return result;})});
 const guideSchema=schema.extend({summary:z.string(),sourceIndices:z.array(z.number().int())});
 const summary=createStep({id:'explain-official-snippets',inputSchema:schema,outputSchema:guideSchema,execute:async({inputData})=>{phase='summary';return preserveFailure(async()=>({ ...inputData,...await modelProvider(env,fetcher).summarizeSupport(inputData.sources)}));}});
 const workflow=createWorkflow({id:'caregiver-current-setup',inputSchema:z.object({}),outputSchema:guideSchema,options:{shouldPersistSnapshot:()=>false}}).then(search).then(summary).commit();workflow.__setLogger(noopLogger);
 const run=await workflow.createRun({shouldPersistSnapshot:()=>false});const result=await run.start({inputData:{}});
 if(result.status!=='success'){if(failure instanceof PublicError)throw failure;throw new PublicError(phase==='search'?'GUIDE_SEARCH_UNAVAILABLE':'GUIDE_UNAVAILABLE','आधिकारिक लिंक खोलकर परिवार की सेटिंग की मदद लें।');}return result.result;
}
if(process.argv[1]?.endsWith('/setup-guide.mjs')){
 const output=new URL('../../docs/evidence/',import.meta.url);await mkdir(output,{recursive:true});
 const guide=await createSetupGuide(process.env,fetch,async sources=>writeFile(new URL('caregiver-search-receipt.json',output),JSON.stringify({...sources,scope:'Two fixed public queries; official support sources only. Not verified phone instructions.'},null,2)+'\n'));await writeFile(new URL('caregiver-live-guide.json',output),JSON.stringify(guide,null,2)+'\n');
 await writeFile(new URL('caregiver-live-guide.md',output),'# Current official setup references\n\nRetrieved '+guide.retrievedAt+'. Gemma summarizes search snippets only. Open the official links and verify exact menu names on each phone before applying changes.\n\n'+guide.summary+'\n\n'+guide.sources.map(s=>'- ['+s.title.replace(/[\\`*_{}\[\]()<>!#|]/g,'\\$&')+'](<'+s.url+'>)').join('\n')+'\n');
 console.log('Saved caregiver guide from two fixed public searches and one Gemma call.');
}
