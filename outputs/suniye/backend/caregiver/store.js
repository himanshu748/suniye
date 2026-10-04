import { mkdir, readFile, writeFile, rename, unlink, readdir, stat, open } from 'node:fs/promises';
import { createCipheriv, createDecipheriv, randomBytes, randomUUID } from 'node:crypto';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
export const defaultRoot = fileURLToPath(new URL('.private-preparation/', import.meta.url));
export const lifetimeMs = 24 * 60 * 60 * 1000;
export class PreparationError extends Error {
  constructor(code) { super(code); this.code = code; }
}

export async function createStore(root = process.env.PREP_ROOT || defaultRoot) {
  root = resolve(root);
  await mkdir(root, { recursive: true, mode: 0o700 });
  const keyFile = join(root, '.key');
  try { await writeFile(keyFile, randomBytes(32), { flag: 'wx', mode: 0o600 }); }
  catch (error) { if (error.code !== 'EEXIST') throw error; }
  const key = await readFile(keyFile);
  if (key.length !== 32) throw new PreparationError('INVALID_STORE_KEY');
  const path = (id, suffix = 'json') => {
    if (!uuid.test(id)) throw new PreparationError('INVALID_JOB');
    return join(root, `${id}.${suffix}`);
  };
  const exists = async file => { try { await stat(file); return true; } catch (e) { if (e.code === 'ENOENT') return false; throw e; } };
  const cancelled = id => exists(path(id, 'cancelled'));
  const remove = async file => { try { await unlink(file); } catch (e) { if (e.code !== 'ENOENT') throw e; } };
  async function save(id, job) {
    if (await cancelled(id)) throw new PreparationError('CANCELLED');
    const nonce = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', key, nonce);
    cipher.setAAD(Buffer.from(id));
    const encrypted = Buffer.concat([cipher.update(JSON.stringify(job), 'utf8'), cipher.final()]);
    const bytes = Buffer.concat([nonce, cipher.getAuthTag(), encrypted]);
    const temporary = path(id, `${randomUUID()}.tmp`);
    const handle = await open(temporary, 'wx', 0o600);
    try { await handle.writeFile(bytes); await handle.sync(); }
    finally { await handle.close(); }
    try {
      if (await cancelled(id)) throw new PreparationError('CANCELLED');
      await rename(temporary, path(id));
      if (await cancelled(id)) { await remove(path(id)); throw new PreparationError('CANCELLED'); }
    } finally { await remove(temporary); }
  }
  async function withAudioClaim(id, operation) {
    const lock = path(id, 'voice-lock');
    let handle;
    try { handle = await open(lock, 'wx', 0o600); }
    catch(error) { if(error.code==='EEXIST')throw new PreparationError('VOICE_IN_PROGRESS');throw error; }
    try { return await operation(); }
    finally { await handle.close(); await remove(lock); }
    // A process crash leaves a lock: fail closed rather than automatically charge again.
  }

  async function load(id) {
    if (await cancelled(id)) throw new PreparationError('CANCELLED');
    let bytes;
    try { bytes = await readFile(path(id)); } catch (error) { if (error.code === 'ENOENT') throw new PreparationError('JOB_MISSING'); throw error; }
    if (bytes.length < 29) throw new PreparationError('INVALID_STORE');
    const cipher = createDecipheriv('aes-256-gcm', key, bytes.subarray(0, 12));
    cipher.setAAD(Buffer.from(id)); cipher.setAuthTag(bytes.subarray(12, 28));
    const job = JSON.parse(Buffer.concat([cipher.update(bytes.subarray(28)), cipher.final()]).toString('utf8'));
    if (job.expiresAt <= Date.now()) { await remove(path(id)); throw new PreparationError('EXPIRED'); }
    if (await cancelled(id)) throw new PreparationError('CANCELLED');
    return job;
  }
  async function cancel(id) {
    await writeFile(path(id, 'cancelled'), '', { mode: 0o600 });
    await remove(path(id));
  }
  async function prune() {
    let removed = 0;
    for (const name of await readdir(root)) {
      const file = join(root, name);
      const match = /^([0-9a-f-]+)\.(json|cancelled|[0-9a-f-]+\.tmp)$/.exec(name);
      if (!match || !uuid.test(match[1])) continue;
      if (name.endsWith('.json')) {
        try { await load(match[1]); } catch (error) {
          if (['EXPIRED','CANCELLED'].includes(error.code)) { await remove(file); removed++; }
          else if (error.code !== 'JOB_MISSING') throw error;
        }
      } else if (Date.now() - (await stat(file)).mtimeMs > lifetimeMs) { await remove(file); removed++; }
    }
    return removed;
  }
  return { withAudioClaim, root, load, save, cancel, cancelled, prune, create: async (pages, mode) => {
    const id = randomUUID();
    await save(id, { id, mode, createdAt: Date.now(), expiresAt: Date.now() + lifetimeMs,
      pages: pages.map((text, index) => ({ index, text, status: 'pending' })) });
    return id;
  }};
}
