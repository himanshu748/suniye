import {hindiSpeech} from '../src/hindi-speech.js';
import {PreparationError} from './store.js';
import {rajuVoiceId} from '../src/providers.js';
export {rajuVoiceId};
// Explicit caregiver action after preparation, outside Temporal retries and history.
export async function prepareAudio(store,id,speech,{consent=false,maxCharacters=1000}={}){
  if(!consent)throw new PreparationError('VOICE_CONSENT_REQUIRED');
  if(!speech.configured||speech.provider!=='elevenlabs'||speech.voiceId!==rajuVoiceId)throw new PreparationError('ELEVENLABS_RAJU_REQUIRED');
  if(!Number.isInteger(maxCharacters)||maxCharacters<1||maxCharacters>1000)throw new PreparationError('VOICE_CHARACTER_CAP');
  return store.withAudioClaim(id,async()=>{
  const job=await store.load(id);
  if(job.mode!=='read'||!job.pages.every(p=>p.status==='ready'&&!p.result.isExplanation))throw new PreparationError('ORIGINAL_ONLY');
  const pending=job.pages.filter(p=>!p.result.audioBase64);
  if(pending.some(p=>p.audioAttempted))throw new PreparationError('VOICE_ATTEMPT_ALREADY_RECORDED');
  const characters=pending.reduce((sum,p)=>sum+hindiSpeech(p.result.originalText).length,0);
  if(characters>maxCharacters)throw new PreparationError('VOICE_CHARACTER_CAP');
  for(const page of pending){
    // Persist intent before a billable call. An uncertain result never causes an automatic second call.
    page.audioAttempted=true;await store.save(id,job);
    const audio=await speech.narrate(page.result.originalText);
    if(!audio)throw new PreparationError('ELEVENLABS_AUDIO_UNAVAILABLE');
    Object.assign(page.result,{audioBase64:audio,audioBaseRate:speech.baseRate,audioProvider:'elevenlabs',audioVoiceId:rajuVoiceId});
    await store.save(id,job); // Tombstones reject results after cancellation.
  }
  return {pages:pending.length,characters,voice:'ElevenLabs Raju',automaticRetries:false};
  });
}
