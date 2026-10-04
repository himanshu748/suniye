import { Worker, NativeConnection, Runtime, DefaultLogger } from '@temporalio/worker';
import { fileURLToPath } from 'node:url';
import { modelProvider } from '../src/providers.js';
import { createStore } from './store.js';
import { createActivities } from './activities.js';

Runtime.install({ logger: new DefaultLogger('ERROR') });
const address = process.env.PREP_TEMPORAL_ADDRESS || '127.0.0.1:7233';
if (!/^(127\.0\.0\.1|localhost):\d+$/.test(address)) throw new Error('This pilot uses a local Temporal service only.');
const base = process.env.PREP_MODEL_BASE_URL || 'http://127.0.0.1:11434/v1';
const url = new URL(base);
if (!['127.0.0.1','localhost'].includes(url.hostname) || url.username || url.password) throw new Error('Preparation uses a local Gemma model only; no cloud charges.');
const store = await createStore();
await store.prune();
const model = modelProvider({ MODEL_BASE_URL: base, MODEL_ID: process.env.PREP_MODEL_ID || 'gemma3:4b', MODEL_PROTOCOL: 'ollama', MODEL_TIMEOUT_MS: '45000' });
const connection = await NativeConnection.connect({ address });
const worker = await Worker.create({ connection, namespace: 'default', taskQueue: 'suniye-document-preparation',
  workflowsPath: fileURLToPath(new URL('./workflows.cjs', import.meta.url)),
  activities: createActivities({ store, model }), maxConcurrentActivityTaskExecutions: 1,
});
console.log('Suniye caregiver preparation ready: local Gemma, no paid voice calls, no automatic playback.');
try { await worker.run(); } finally { await connection.close(); }
