import { createStep, createWorkflow } from '@mastra/core/workflows';
import { readInput, reading, extracted, validateImage, PublicError } from './contracts.js';
import { z } from 'zod';
import { noopLogger } from '@mastra/core/logger';

export function makeReadingWorkflow(model, speech, trace = (_name, fn) => fn()) {
  const sourceSchema = z.object({ request:readInput, source:extracted });
  // Cancellation is per run, never embedded in logged/persisted input data.
  const signals = new Map();
  const failures = new Map();
  const ensureActive = signal => {if(signal?.aborted)throw new PublicError('CANCELLED','पढ़ना रोक दिया गया।',499);};
  const activeStage = (name,signal,fn) => trace(name,()=>{ensureActive(signal);return fn();});
  const guarded = (requestId,fn) => Promise.resolve().then(fn).catch(error=>{if(error instanceof PublicError)failures.set(requestId,error);throw error;});
  const extract = createStep({id:'read-visible-material',inputSchema:readInput,outputSchema:sourceSchema,
    execute:async ({inputData}) => guarded(inputData.requestId,async()=>{
      const signal=signals.get(inputData.requestId);
      ensureActive(signal);
      if(inputData.image) validateImage(inputData.image);
      const source=await activeStage('suniye.extract',signal,()=>model.extract(inputData,signal));
      ensureActive(signal);
      return {request:inputData,source:extracted.parse(source)};
    })});
  const speak = createStep({id:'prepare-hindi-reading',inputSchema:sourceSchema,outputSchema:reading,
    execute:async ({inputData:{request,source}}) => guarded(request.requestId,async()=>{
      const signal=signals.get(request.requestId);
      ensureActive(signal);
      if(source.kind==='retake') return {kind:'retake',originalText:'',spokenText:'',isExplanation:false,isDescription:false,retakeReason:source.retakeReason};
      const isExplanation=request.mode==='explain'; const isDescription=!source.originalText.trim();
      const spokenText=isExplanation
        ? await activeStage('suniye.explain',signal,()=>model.explain(source.originalText || source.description,signal))
        : isDescription ? `यह चित्र का वर्णन है। ${source.description}` : source.originalText;
      ensureActive(signal);
      const audioBase64=request.wantAudio?await activeStage('suniye.narrate',signal,()=>speech.narrate(spokenText,signal)):undefined;
      ensureActive(signal);
      return {kind:'reading',originalText:source.originalText,spokenText,isExplanation,isDescription,retakeReason:'',...(audioBase64?{audioBase64,audioBaseRate:speech.baseRate??.85,...(speech.provider==='elevenlabs'?{audioProvider:'elevenlabs',audioVoiceId:speech.voiceId}:{})}:{})};
    })});
  const workflow=createWorkflow({id:'hindi-reading',inputSchema:readInput,outputSchema:reading,options:{shouldPersistSnapshot:()=>false}}).then(extract).then(speak).commit();
  workflow.__setLogger(noopLogger);
  return {workflow,run:async (input,signal) => {
    if(signals.has(input.requestId))throw new PublicError('DUPLICATE_REQUEST','यह पढ़ना पहले से चल रहा है।',409);
    ensureActive(signal);
    signals.set(input.requestId,signal);
    try {
      const run=await workflow.createRun({shouldPersistSnapshot:()=>false});
      ensureActive(signal);
      const result=await run.start({inputData:input});
      ensureActive(signal);
      if(result.status!=='success') {
        // Preserve only our static public errors; Mastra's serialized error loses the class.
        if(failures.has(input.requestId))throw failures.get(input.requestId);
        const error=result.error;
        if(error instanceof PublicError)throw error;
        // Mastra serializes step errors; disclose only recognized public fields.
        if(error?.name==='Error' || error) throw new PublicError('READ_FAILED','यह पढ़ नहीं पाया। फिर कोशिश करें।');
        throw new PublicError('READ_FAILED','यह पढ़ नहीं पाया। फिर कोशिश करें।');
      }
      return reading.parse(result.result);
    } finally {signals.delete(input.requestId);failures.delete(input.requestId);}
  }};
}
