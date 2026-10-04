import { Connection, Client } from '@temporalio/client';
import { createStore, PreparationError } from './store.js';
import { readPages } from './input.js';
import { exportReader } from './export.js';
import {prepareAudio} from './audio.js';
import {speechProvider} from '../src/providers.js';

async function main() {
  const [command, target, extra, ...flags] = process.argv.slice(2);
  if (!['start','status','release','cancel','export','voice','prune'].includes(command)) {
    console.log('start file.pdf|pages.json [--pause-after=N]\nstatus JOB\nrelease JOB\ncancel JOB\nexport JOB NEW_DIRECTORY\nvoice JOB --consent (uses existing ElevenLabs credits, max 1000 characters)\nprune');
    return;
  }
  const store = await createStore();
  if (command === 'prune') { console.log(JSON.stringify({ removed: await store.prune() })); return; }
  if(command==='voice'){
    if(extra!=='--consent'||flags.length)throw new PreparationError('VOICE_CONSENT_REQUIRED');
    process.loadEnvFile(new URL('../.env',import.meta.url));
    console.log(JSON.stringify(await prepareAudio(store,target,speechProvider(),{consent:true})));return;
  }
  if (command === 'export') {
    if (!extra) throw new PreparationError('OUTPUT_REQUIRED');
    const job = await store.load(target);
    console.log(JSON.stringify({ exported: await exportReader(job, extra), pages: job.pages.length, playback: 'manual-only', voice: 'cached ElevenLabs Raju only; missing audio stays silent' }));
    return;
  }
  // Tombstone first, even if the Temporal service is offline. Late results cannot be read.
  if (command === 'cancel') await store.cancel(target);
  const address = process.env.PREP_TEMPORAL_ADDRESS || '127.0.0.1:7233';
  if (!/^(127\.0\.0\.1|localhost):\d+$/.test(address)) throw new PreparationError('LOCAL_TEMPORAL_ONLY');
  const connection = await Connection.connect({ address });
  try {
    const client = new Client({ connection, namespace: 'default' });
    if (command === 'start') {
      if (!target) throw new PreparationError('INPUT_REQUIRED');
      const options = [extra, ...flags].filter(Boolean);
      if (options.some(value => !/^--pause-after=[1-9]$/.test(value))) throw new PreparationError('INVALID_OPTIONS');
      const mode = 'read';
      const pages = await readPages(target);
      const pauseAfter = Number(options.find(value => value.startsWith('--pause-after='))?.split('=')[1] || 0);
      const jobId = await store.create(pages, mode);
      console.log(JSON.stringify({ jobId, pages: pages.length, mode, expiresInHours: 24 }));
      await client.workflow.start('prepareDocument', { workflowId: `suniye-prep-${jobId}`, taskQueue: 'suniye-document-preparation', args: [{ jobId, pageCount: pages.length, pauseAfter }] });
    } else {
      const handle = client.workflow.getHandle(`suniye-prep-${target}`);
      if (command === 'cancel') { await handle.cancel(); console.log(JSON.stringify({ cancelled: true, privateInputRemoved: true })); }
      else {
        await store.load(target);
        if (command === 'release') { await handle.signal('releasePreparation'); console.log(JSON.stringify({ released: true })); }
        else console.log(JSON.stringify(await handle.query('preparationProgress')));
      }
    }
  } finally { await connection.close(); }
}
main().catch(error => {
  // Provider errors can carry message content. Print only known local codes.
  console.error(error instanceof PreparationError ? error.code : 'PREPARATION_FAILED: check the local Temporal service, worker and input.');
  process.exitCode = 1;
});
