import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, stat, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createStore, lifetimeMs } from '../store.js';
import { validatePages, readPages } from '../input.js';
import { readerHtml, exportReader } from '../export.js';

test('document input rejects empty, oversized and excess pages before scheduling', () => {
  for (const pages of [[], [''], ['x'.repeat(12001)], Array(11).fill('पाठ'), Array(6).fill('x'.repeat(11000))]) assert.throws(() => validatePages(pages));
  assert.deepEqual(validatePages([' नमस्ते। ']), ['नमस्ते।']);
});
test('private preparation survives a new store, is encrypted, and cancellation removes late results', async () => {
  const root = await mkdtemp(join(tmpdir(), 'suniye-private-test-'));
  const first = await createStore(root), id = await first.create(['निजी पाठ ₹1250'], 'read');
  const encrypted = await readFile(join(root, `${id}.json`));
  assert.equal(encrypted.includes(Buffer.from('निजी पाठ')), false);
  assert.equal((await stat(join(root, '.key'))).mode & 0o777, 0o600);
  assert.equal((await stat(join(root, `${id}.json`))).mode & 0o777, 0o600);
  const restarted = await createStore(root), job = await restarted.load(id);
  assert.equal(job.pages[0].text, 'निजी पाठ ₹1250');
  await restarted.cancel(id);
  await assert.rejects(first.save(id, job), error => error.code === 'CANCELLED');
  await assert.rejects(first.load(id), error => error.code === 'CANCELLED');
  await assert.rejects(access(join(root, `${id}.json`)));
});
test('expired input cannot be read and is removed on access', async () => {
  const root = await mkdtemp(join(tmpdir(), 'suniye-expiry-test-'));
  const store = await createStore(root), id = await store.create(['पाठ'], 'read');
  const job = await store.load(id); assert.equal(job.expiresAt-job.createdAt, lifetimeMs);
  job.expiresAt = Date.now()-1; await store.save(id, job);
  await assert.rejects(store.load(id), error => error.code === 'EXPIRED');
  await assert.rejects(access(join(root, `${id}.json`)));
});
test('job IDs cannot select another file', async () => {
  const root = await mkdtemp(join(tmpdir(), 'suniye-path-test-'));
  const store = await createStore(root);
  await assert.rejects(store.load('../.env'), error => error.code === 'INVALID_JOB');
});
test('image-only PDF requests on-device OCR instead of guessing a transcript', async () => {
  await assert.rejects(readPages(new URL('../../../docs/evidence/media-sample-two-pages.pdf', import.meta.url).pathname), error => error.code === 'PDF_NEEDS_ON_DEVICE_OCR');
});
test('export escapes hostile source text, preserves originals and normalizes Hindi speech separately', async () => {
  const result = { originalText: '</script><img src=x onerror=alert(1)> बिल ₹1250', spokenText: 'बिल की रकम ₹1250 है।', isExplanation: true };
  const job = { pages: [{ status: 'ready', result }] };
  const html = readerHtml(job);
  assert.equal(html.includes('</script><img src=x'), false);
  assert.ok(html.includes('बारह सौ पचास') || html.includes('एक हज़ार दो सौ पचास'));
  assert.ok(html.includes("connect-src 'none'"));
  const root = await mkdtemp(join(tmpdir(), 'suniye-export-test-'));
  await exportReader(job, join(root, 'new'));
  await assert.rejects(exportReader(job, join(root, 'new')), error => error.code === 'EEXIST');
  assert.deepEqual(JSON.parse(await readFile(join(root, 'new/pages.json'), 'utf8')).pages[0], result);
});
