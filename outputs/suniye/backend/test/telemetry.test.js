import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeTransaction } from '../src/telemetry.js';

test('AI traces keep correlation and token metrics while discarding reading content and account identifiers',()=>{
  const raw={event_id:'event',transaction:'suniye.read',start_timestamp:1,timestamp:2,
    request:{headers:{authorization:'PRIVATE_TOKEN'},data:'PRIVATE_READING'},user:{ip_address:'PRIVATE_IP'},extra:{reading:'PRIVATE_READING'},
    contexts:{device:{name:'PRIVATE_NAME'},trace:{trace_id:'trace',span_id:'root',op:'gen_ai.invoke_agent',data:{'gen_ai.agent.name':'Suniye',reading:'PRIVATE_READING'}}},
    spans:[{span_id:'child',parent_span_id:'root',trace_id:'trace',op:'gen_ai.chat',description:'PRIVATE_READING',data:{'gen_ai.usage.input_tokens':22,'gen_ai.request.model':'gemma3:4b','suniye.model.load_ms':12000,'gen_ai.input.messages':'PRIVATE_READING','authorization':'PRIVATE_TOKEN'}}]};
  const clean=sanitizeTransaction(raw),encoded=JSON.stringify(clean);
  assert.equal(clean.contexts.trace.trace_id,'trace');assert.equal(clean.spans[0].parent_span_id,'root');
  assert.equal(clean.spans[0].data['gen_ai.usage.input_tokens'],22);assert.equal(clean.spans[0].data['gen_ai.request.model'],'gemma3:4b');
  assert.equal(clean.spans[0].data['suniye.model.load_ms'],12000);
  assert(!encoded.includes('PRIVATE_'));assert(!('request' in clean));assert(!('user' in clean));
});
