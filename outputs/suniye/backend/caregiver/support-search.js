import { PGlite } from '@electric-sql/pglite';
import { vector } from '@electric-sql/pglite-pgvector';
import { readFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { createStep, createWorkflow } from '@mastra/core/workflows';
import { noopLogger } from '@mastra/core/logger';
import { z } from 'zod';

export const embeddingModel = 'all-minilm:22m';
const corpus = JSON.parse(await readFile(new URL('./support-corpus.json', import.meta.url), 'utf8'));
export const corpusHash = createHash('sha256').update(JSON.stringify(corpus)).digest('hex');
export const approvedDocuments = corpus.documents;
const defaultIndex = fileURLToPath(new URL('.private-support-index/', import.meta.url));
const vectorValue = values => {
  if (!Array.isArray(values) || values.length !== 384 || !values.every(Number.isFinite) || !values.some(value => value !== 0)) throw new Error('Invalid local embedding.');
  return '[' + values.join(',') + ']';
};
export async function embed(texts, fetcher = fetch) {
  if (!Array.isArray(texts) || !texts.length || texts.some(text => typeof text !== 'string' || !text.trim() || text.length > 1800)) throw new Error('Invalid embedding input.');
  const response = await fetcher('http://127.0.0.1:11434/api/embed', {
    method: 'POST', redirect: 'error', signal: AbortSignal.timeout(45000), headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ model: embeddingModel, input: texts, truncate: false, keep_alive: 0 }),
  });
  if (!response.ok) { await response.body?.cancel(); throw new Error('Local embedding model unavailable.'); }
  const data = await response.json();
  if (!Array.isArray(data.embeddings) || data.embeddings.length !== texts.length) throw new Error('Incomplete local embeddings.');
  data.embeddings.forEach(vectorValue);
  return data.embeddings;
}
export async function openIndex(directory = process.env.SUPPORT_INDEX_ROOT || defaultIndex) {
  directory = resolve(directory);
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const database = new PGlite(directory, { extensions: { vector } });
  await database.waitReady;
  return database;
}
export async function indexSources(database, embedder = embed) {
  const vectors = await embedder(approvedDocuments.map(doc => doc.title + '. ' + doc.text));
  await database.transaction(async tx => {
    await tx.exec('CREATE EXTENSION IF NOT EXISTS vector; CREATE TABLE IF NOT EXISTS suniye_support (id text PRIMARY KEY, title text NOT NULL, hindi_title text NOT NULL, url text NOT NULL, body text NOT NULL, hint text NOT NULL, embedding vector(384) NOT NULL); CREATE TABLE IF NOT EXISTS suniye_support_meta (singleton boolean PRIMARY KEY CHECK(singleton), model text NOT NULL, corpus_hash text NOT NULL); DELETE FROM suniye_support;');
    for (let index = 0; index < approvedDocuments.length; index++) {
      const doc = approvedDocuments[index];
      const url = new URL(doc.url);
      if (url.protocol !== 'https:' || url.hostname !== 'support.google.com' || !/^\/(?:android|accessibility\/android)\/answer\/\d+$/.test(url.pathname)) throw new Error('Unapproved source.');
      await tx.query('INSERT INTO suniye_support VALUES ($1,$2,$3,$4,$5,$6,$7::vector)', [doc.id,doc.title,doc.hindiTitle,doc.url,doc.text,doc.hint,vectorValue(vectors[index])]);
    }
    await tx.query('INSERT INTO suniye_support_meta VALUES (true,$1,$2) ON CONFLICT(singleton) DO UPDATE SET model=EXCLUDED.model,corpus_hash=EXCLUDED.corpus_hash', [embeddingModel,corpusHash]);
  });
  return { indexed: approvedDocuments.length, model: embeddingModel, dimensions: 384, corpusHash, sourceType: 'Public official Android references only' };
}
export async function retrieve(database, query, embedder = embed) {
  if (typeof query !== 'string' || !query.trim() || query.length > 400 || !/[a-z]/i.test(query) || /[\u0900-\u097f]/.test(query)) throw new Error('Use an English caregiver setup question; Hindi query quality has not been validated.');
  const metadata = (await database.query('SELECT model,corpus_hash FROM suniye_support_meta WHERE singleton=true')).rows[0];
  if (!metadata || metadata.model !== embeddingModel || metadata.corpus_hash !== corpusHash) throw new Error('Rebuild the approved source index.');
  const [values] = await embedder([query]);
  // Exact pgvector similarity plus PostgreSQL keyword matching, fused with RRF.
  // A semantic threshold prevents unrelated queries from forcing a result.
  const result = await database.query(`WITH candidates AS (
    SELECT *, 1-(embedding <=> $1::vector) AS similarity,
      ts_rank_cd(to_tsvector('english',title || ' ' || body), plainto_tsquery('english',$2)) AS keyword_score
    FROM suniye_support
  ), ranked AS (
    SELECT *, row_number() OVER (ORDER BY similarity DESC,id) AS semantic_rank,
      row_number() OVER (ORDER BY keyword_score DESC,id) AS keyword_rank FROM candidates
  ) SELECT id,title,hindi_title,url,hint,similarity,
    1.0/(60+semantic_rank) + CASE WHEN keyword_score>0 THEN 1.0/(60+keyword_rank) ELSE 0 END AS score
    FROM ranked WHERE similarity >= 0.35 ORDER BY score DESC,similarity DESC,id LIMIT 2`, [vectorValue(values),query]);
  return result.rows.map(row => {
    const original = approvedDocuments.find(doc => doc.id === row.id);
    if (!original || original.url !== row.url || original.title !== row.title || original.hint !== row.hint || original.hindiTitle !== row.hindi_title) throw new Error('Source index changed; rebuild it.');
    return { id: row.id, title: row.title, hindiTitle: row.hindi_title, url: row.url, hint: row.hint, similarity: row.similarity, score: Number(row.score) };
  });
}
export function makeCachedGuideWorkflow(database, embedder = embed) {
  const request = z.object({ query: z.string().min(1).max(400) });
  const sources = z.object({ sources: z.array(z.object({ id:z.string(),title:z.string(),hindiTitle:z.string(),url:z.string(),hint:z.string(),similarity:z.number(),score:z.number() })) });
  const guide = z.object({ found:z.boolean(), sources:sources.shape.sources, note:z.string() });
  const find = createStep({ id:'retrieve-approved-setup-references',inputSchema:request,outputSchema:sources,
    execute:async({inputData})=>({sources:await retrieve(database,inputData.query,embedder)}) });
  const prepare = createStep({ id:'prepare-source-linked-caregiver-help',inputSchema:sources,outputSchema:guide,
    execute:async({inputData})=>({found:inputData.sources.length>0,sources:inputData.sources,note:inputData.sources.length?'ये आधिकारिक संदर्भ हैं। Redmi की सेटिंग परिवार के सदस्य से जँचवाएँ।':'इस विषय का आधिकारिक संदर्भ यहाँ नहीं मिला। परिवार के सदस्य से मदद लें।'}) });
  const workflow = createWorkflow({id:'cached-caregiver-help',inputSchema:request,outputSchema:guide,options:{shouldPersistSnapshot:()=>false}}).then(find).then(prepare).commit();
  workflow.__setLogger(noopLogger);
  return {run:async query=>{
    const run=await workflow.createRun({shouldPersistSnapshot:()=>false});
    const result=await run.start({inputData:{query}});
    if(result.status!=='success')throw new Error('Cached caregiver help unavailable.');
    return guide.parse(result.result);
  }};
}
async function main() {
  const [command,...words]=process.argv.slice(2);
  if (!['index','search'].includes(command)) { console.log('index\nsearch "English caregiver setup question"'); return; }
  const database=await openIndex();
  try { console.log(JSON.stringify(command==='index'?await indexSources(database):await makeCachedGuideWorkflow(database).run(words.join(' ')),null,2)); }
  finally { await database.close(); }
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href)main().catch(()=>{console.error('Setup search unavailable. Check the local embedding model and approved source index.');process.exitCode=1;});
