import test from 'node:test';
import assert from 'node:assert/strict';
import {resilientStore} from '../src/resilient-store.js';
test('Atlas startup outage recovers; failed writes are never retried',async()=>{
 let outage=true,connects=0,writes=0,closed=false;
 const collection={findOne:async()=>({preferences:{speed:.85}}),updateOne:async()=>{writes++;throw new Error('unknown write outcome');}};
 const client={connect:async()=>{connects++;if(outage)throw new Error('offline');},db:()=>({collection:()=>collection,command:async()=>({ok:1})}),close:async()=>{closed=true;}};
 const connection=await resilientStore(client,{retryMs:0});
 try{assert.equal(connection.available(),false);await assert.rejects(connection.store.findOne({}));outage=false;
 assert.equal((await connection.store.findOne({})).preferences.speed,.85);assert.equal(connection.available(),true);
 await assert.rejects(connection.store.updateOne({},{}));assert.equal(writes,1);assert.equal(connection.available(),false);assert.ok(connects>=3);
 }finally{await connection.close();}assert.equal(closed,true);
});
