import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash, randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { Connection, Client } from '@temporalio/client';
import { createStore } from '../store.js';
import { readPages } from '../input.js';
import { exportReader } from '../export.js';

const fixture = fileURLToPath(new URL('../../../docs/evidence/temporal-synthetic-two-pages.pdf', import.meta.url));
const destination = resolve(process.argv[2] || fileURLToPath(new URL('../../../docs/evidence/temporal-recovery-2026-10-04.json', import.meta.url)));
const root = await mkdtemp(join(tmpdir(), 'suniye-temporal-live-'));
const log = join(root, 'calls.jsonl'), privateRoot = join(root, 'private');
const queue = `suniye-proof-${randomUUID()}`;
const store = await createStore(privateRoot);
const connection = await Connection.connect({ address: '127.0.0.1:7233' });
const client = new Client({ connection, namespace: 'default' });
const children = [];
const events = [];
async function startWorker(failPage = '') {
  const child = spawn(process.execPath, [fileURLToPath(new URL('./probe-worker.js', import.meta.url))], {
    env: { ...process.env, PREP_ROOT: privateRoot, PROBE_LOG: log, PROBE_QUEUE: queue, PROBE_FAIL_PAGE: failPage }, stdio: ['ignore','pipe','pipe'] });
  children.push(child);
  await new Promise((resolveReady, reject) => {
    const timer = setTimeout(() => reject(new Error('Worker did not become ready.')), 60000);
    child.stdout.on('data', data => { if (data.toString().includes('PROBE_READY')) { clearTimeout(timer); resolveReady(); } });
    child.once('exit', code => { clearTimeout(timer); if (code) reject(new Error('Worker exited.')); });
    child.stderr.on('data', data => { writeFile(join(root,'worker-startup.log'),data,{flag:'a'}).catch(()=>{}); });
  });
  return child;
}
async function killWorker(child, signal) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  const exited = once(child, 'exit'); child.kill(signal); await exited;
}
async function waitProgress(handle, predicate, timeout = 150000) {
  const started = Date.now();
  while (Date.now()-started < timeout) {
    try { const result = await handle.query('preparationProgress'); if (predicate(result)) return result; } catch {}
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  throw new Error('Progress timeout.');
}

try {
  const pages = await readPages(fixture);
  assert.deepEqual(pages, ['जूते बाहर निकालकर आएँ।','बिल की रकम 1250 रुपये है।']);
  const jobId = await store.create(pages, 'read');
  const handle = await client.workflow.start('prepareDocument', { workflowId: `suniye-proof-${jobId}`, taskQueue: queue, args: [{ jobId, pageCount: pages.length, pauseAfter: 1 }] });
  const first = await startWorker();
  const paused = await waitProgress(handle, status => status.status === 'paused');
  events.push({ event: 'page_one_completed', progress: paused });
  const beforeRestart = await store.load(jobId);
  const firstResult = JSON.stringify(beforeRestart.pages[0].result);
  await killWorker(first, 'SIGKILL');
  events.push({ event: 'worker_process_killed', signal: 'SIGKILL' });
  assert.equal((await handle.describe()).status.name, 'RUNNING');
  assert.equal((await store.load(jobId)).pages[0].status, 'ready');
  const restarted = await startWorker('1');
  assert.equal((await waitProgress(handle, status => status.status === 'paused')).completed, 1);
  await handle.signal('releasePreparation');
  const completed = await handle.result();
  assert.equal(completed.status, 'ready'); assert.equal(completed.completed, 2);
  const finalJob = await store.load(jobId);
  assert.equal(JSON.stringify(finalJob.pages[0].result), firstResult);
  const calls = (await readFile(log,'utf8')).trim().split('\n').map(line => JSON.parse(line));
  const activities = calls.filter(row => row.kind === 'activity' && row.jobId === jobId);
  assert.deepEqual(activities.map(row => [row.index,row.attempt]), [[0,1],[1,1],[1,2]]);
  assert.equal(calls.filter(row => row.kind === 'model-start').length, 0);
  for (const page of finalJob.pages) assert.equal(page.result.originalText, page.result.spokenText);
  events.push({ event: 'worker_restarted_and_document_completed', progress: completed, attempts: activities.map(({index,attempt}) => ({page:index+1,attempt})), originalPreserved: true, gemmaCalls: 0 });
  const history = await handle.fetchHistory();
  const historyText = JSON.stringify(history);
  const payloads = history.events.flatMap(event => {
    const attributes = Object.values(event).filter(value => value && typeof value === 'object');
    return attributes.flatMap(value => [value.input?.payloads,value.result?.payloads,value.details?.payloads].filter(Boolean).flat());
  });
  const decoded = payloads.map(payload => Buffer.from(payload.data || []).toString('utf8')).join('\n');
  for (const text of pages) { assert.equal(historyText.includes(text), false); assert.equal(decoded.includes(text), false); }
  await exportReader(finalJob, join(root, 'reader'));
  const cancellationId = await store.create(pages, 'read');
  const cancelledHandle = await client.workflow.start('prepareDocument', { workflowId: `suniye-proof-${cancellationId}`, taskQueue: queue, args: [{ jobId: cancellationId, pageCount: 2, pauseAfter: 1 }] });
  await waitProgress(cancelledHandle, status => status.status === 'paused');
  await store.cancel(cancellationId); await cancelledHandle.cancel();
  await assert.rejects(cancelledHandle.result());
  assert.equal((await cancelledHandle.describe()).status.name, 'CANCELLED');
  await assert.rejects(store.load(cancellationId), error => error.code === 'CANCELLED');
  await assert.rejects(access(join(privateRoot, `${cancellationId}.json`)));
  await assert.rejects(store.save(cancellationId, { ...finalJob, id: cancellationId }), error => error.code === 'CANCELLED');
  events.push({ event: 'cancelled_document', workflowStatus: 'CANCELLED', inputRemoved: true, lateWriteRejected: true });
  const receipt = { checkedAt: new Date().toISOString(), scope: 'Real local Temporal service and OS worker restart; synthetic text PDF through existing two-step Mastra original-reading workflow. Original preparation makes no LLM or voice API calls. Not hosted Temporal, Android preparation, scanned-PDF OCR or Redmi evidence.',
    fixture: { name: 'temporal-synthetic-two-pages.pdf', sha256: createHash('sha256').update(await readFile(fixture)).digest('hex'), synthetic: true },
    fees: { cloudResourcesCreated: 0, paidVoiceCalls: 0, cloudModelCalls: 0 }, events,
    history: { events: history.events.length, decodedPayloadsChecked: payloads.length, sourceTextAbsent: true, onlyOpaqueJobAndPageMetadata: true },
    configuredModelNotInvoked: { id: 'gemma3:4b', calls: calls.filter(row => row.kind === 'model-end').map(({ms,status}) => ({ms,status})), results: finalJob.pages.map(({index,result,needsReview,reviewCode}) => ({page:index+1,result,needsReview,...(reviewCode?{reviewCode}:{})})) },
    privacy: { inputAtRest: 'AES-256-GCM', expiry: '24 hours, rejected on access; cleanup on access or prune; exports retained until caregiver deletes them' },
    browserReader: { playback: 'User gesture only; tagged cached ElevenLabs Raju audio only; this preparation proof exports no audio; original shown first; switching pages or hiding tab cancels playback' },
  };
  await mkdir(resolve(destination, '..'), { recursive: true });
  await writeFile(destination, JSON.stringify(receipt,null,2)+'\n');
  console.log(JSON.stringify({ passed: true, receipt: destination, reader: join(root,'reader'), checks: events.map(event => event.event), gemmaCalls: 0, paidCalls: 0 }));
  await killWorker(restarted, 'SIGTERM');
} finally {
  for (const child of children) await killWorker(child, 'SIGTERM');
  await connection.close();
}
