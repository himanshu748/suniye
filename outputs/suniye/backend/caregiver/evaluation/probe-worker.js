// Synthetic fault injection for the reproducible local recovery check only.
import { Worker, NativeConnection, Runtime, DefaultLogger } from '@temporalio/worker';
import { Context } from '@temporalio/activity';
import { appendFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { modelProvider } from '../../src/providers.js';
import { createStore } from '../store.js';
import { createActivities } from '../activities.js';

Runtime.install({ logger: new DefaultLogger('ERROR') });
const record = data => appendFile(process.env.PROBE_LOG, JSON.stringify({ at: Date.now(), ...data }) + '\n', { mode: 0o600 });
const real = modelProvider({ MODEL_BASE_URL: 'http://127.0.0.1:11434/v1', MODEL_PROTOCOL: 'ollama', MODEL_ID: 'gemma3:4b' });
const model = { ...real, explain: async (source, signal) => {
  await record({ kind: 'model-start' }); const started = Date.now();
  try { const result = await real.explain(source, signal); await record({ kind: 'model-end', ms: Date.now()-started, status: 'success' }); return result; }
  catch (error) { await record({ kind: 'model-end', ms: Date.now()-started, status: error.code || 'failure' }); throw error; }
}};
const store = await createStore();
const beforePage = async ({ jobId, index }) => {
  const attempt = Context.current().info.attempt;
  await record({ kind: 'activity', jobId, index, attempt });
  if (process.env.PROBE_FAIL_PAGE === String(index) && attempt === 1) throw new Error('Synthetic pre-provider failure.');
};
const connection = await NativeConnection.connect({ address: '127.0.0.1:7233' });
const worker = await Worker.create({ connection, namespace: 'default', taskQueue: process.env.PROBE_QUEUE,
  workflowsPath: fileURLToPath(new URL('../workflows.cjs', import.meta.url)), activities: createActivities({ store, model, beforePage }), maxConcurrentActivityTaskExecutions: 1 });
console.log('PROBE_READY');
try { await worker.run(); } finally { await connection.close(); }
