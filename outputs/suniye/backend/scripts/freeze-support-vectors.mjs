import {writeFile} from 'node:fs/promises';
import {embed,approvedDocuments,corpusHash,embeddingModel} from '../caregiver/support-search.js';
const queries={permissions:'Camera and microphone permissions for the app',display:'Increase font size and display size',restricted:'Downloaded app restricted settings accessibility screen access'};
const vectors=await embed([...approvedDocuments.map(d=>d.title+'. '+d.text),...Object.values(queries)]);
await writeFile(new URL('../caregiver/hosted-vectors.json',import.meta.url),JSON.stringify({generatedAt:new Date().toISOString(),embeddingModel,corpusHash,dimensions:384,documents:vectors.slice(0,3),queries:Object.fromEntries(Object.entries(queries).map(([topic,text],i)=>[topic,{text,vector:vectors[i+3]}]))})+'\n');
console.log('Froze six real public-source embeddings for three hosted caregiver topics.');
