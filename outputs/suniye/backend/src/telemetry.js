import * as Sentry from '@sentry/node';
const allowed=['gen_ai.request.model','gen_ai.response.model','gen_ai.operation.name','gen_ai.agent.name','gen_ai.usage.input_tokens','gen_ai.usage.output_tokens','gen_ai.usage.total_tokens','suniye.outcome','suniye.model.load_ms','suniye.model.prompt_ms','suniye.model.generation_ms'];
function safeData(data={}) {return Object.fromEntries(allowed.filter(k=>typeof data[k]==='number'||typeof data[k]==='string').map(k=>[k,data[k]]));}
function safeSpan(span){return {span_id:span.span_id,parent_span_id:span.parent_span_id,trace_id:span.trace_id,start_timestamp:span.start_timestamp,timestamp:span.timestamp,op:span.op,description:span.op,status:span.status,data:safeData(span.data)};}
export function sanitizeTransaction(event){
 const trace=event.contexts?.trace;
 return {event_id:event.event_id,type:'transaction',transaction:event.transaction,start_timestamp:event.start_timestamp,timestamp:event.timestamp,tags:{app:'suniye'},contexts:trace?{trace:{trace_id:trace.trace_id,span_id:trace.span_id,parent_span_id:trace.parent_span_id,op:trace.op,status:trace.status,data:safeData(trace.data)}}:{},spans:(event.spans||[]).map(safeSpan)};
}
export function setupTelemetry(env=process.env) {
 if(!env.SENTRY_DSN) return (_name,fn)=>fn();
 Sentry.init({dsn:env.SENTRY_DSN,sendDefaultPii:false,defaultIntegrations:false,tracesSampleRate:Math.min(1,Math.max(0,Number(env.SENTRY_SAMPLE_RATE||0.2))),
  beforeSend:event=>({event_id:event.event_id,timestamp:event.timestamp,level:event.level,message:'Suniye reading stage failed',tags:{app:'suniye'}}),
  beforeSendTransaction:sanitizeTransaction,
 });
 return (name,fn)=>Sentry.startSpan({name,op:name==='suniye.read'?'gen_ai.invoke_agent':'suniye.stage',attributes:name==='suniye.read'?{'gen_ai.agent.name':'Suniye','gen_ai.operation.name':'invoke_agent'}:{}},fn);
}
export function traceModel(model,fn){
 return Sentry.startSpan({name:'Gemma reading request',op:'gen_ai.chat',attributes:{'gen_ai.request.model':model,'gen_ai.operation.name':'chat'}},fn);
}
export function recordModelUsage(data){
 const span=Sentry.getActiveSpan();if(!span)return;
 for(const [input,output] of [['prompt_tokens','input_tokens'],['completion_tokens','output_tokens'],['total_tokens','total_tokens']]){
  const value=data.usage?.[input];if(Number.isInteger(value)&&value>=0)span.setAttribute(`gen_ai.usage.${output}`,value);
 }
  if(typeof data.model==='string')span.setAttribute('gen_ai.response.model',data.model);
  for(const [input,output] of [['load_duration','load_ms'],['prompt_eval_duration','prompt_ms'],['eval_duration','generation_ms']])if(Number.isFinite(data[input])&&data[input]>=0)span.setAttribute('suniye.model.'+output,Math.round(data[input]/1e6));
}

export function activeTraceId(){return Sentry.getActiveSpan()?.spanContext().traceId;}
