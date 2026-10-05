import {MongoNetworkError,MongoServerSelectionError,MongoNotConnectedError} from 'mongodb';
import {PublicError} from './contracts.js';
// Never retry a write: its outcome may be unknown. Only reconnect for a future request.
export async function resilientStore(client,{retryMs=30000}={}) {
 let ready=false,closed=false,pending,lastAttempt=0;
 const collection=client.db('suniye').collection('preferences');
 async function connect(){
  if(closed)return false;
  if(pending)return pending;
  if(!ready&&Date.now()-lastAttempt<retryMs)return false;
  lastAttempt=Date.now();
  pending=(async()=>{try{await client.connect();await client.db('suniye').command({ping:1});ready=!closed;return ready;}catch{ready=false;return false;}finally{pending=undefined;}})();
  return pending;
 }
 const store={};
 for(const method of ['findOne','updateOne','findOneAndUpdate'])store[method]=async(...args)=>{
  if(!ready&&!await connect())throw new PublicError('SYNC_UNAVAILABLE','सेटिंग सेवा अभी नहीं मिल रही। मूल पाठ और शब्दों की मदद चलती रहेगी।',503);
  try{return await collection[method](...args);}catch(error){
   if(error instanceof MongoNetworkError||error instanceof MongoServerSelectionError||error instanceof MongoNotConnectedError||error.name==='MongoPoolClearedError'||error.name==='MongoPoolClosedError'){ready=false;lastAttempt=Date.now();throw new PublicError('SYNC_UNAVAILABLE','सेटिंग सेवा अभी नहीं मिल रही। मूल पाठ और शब्दों की मदद चलती रहेगी।',503);}
   throw error;
  }
 };
 await connect();
 const timer=setInterval(()=>{void connect();},retryMs);timer.unref?.();
 return {store,available:()=>ready,close:async()=>{closed=true;clearInterval(timer);if(pending)await pending;await client.close();}};
}
