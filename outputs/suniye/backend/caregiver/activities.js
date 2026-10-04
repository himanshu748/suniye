import { Context, heartbeat, ApplicationFailure, CancelledFailure } from '@temporalio/activity';
import { randomUUID } from 'node:crypto';
import { makeReadingWorkflow } from '../src/workflow.js';
import { PreparationError } from './store.js';

export function createActivities({ store, model, beforePage = async () => {} }) {
  // Preparation never calls a paid voice provider. The exported reader uses a Hindi browser voice.
  const pipeline = makeReadingWorkflow(model, { configured: false, narrate: async () => undefined });
  return { preparePage: async ({ jobId, index }) => {
    const signal = Context.current().cancellationSignal;
    const beat = () => heartbeat({ page: index + 1 });
    beat(); const timer = setInterval(beat, 1000);
    try {
      let job = await store.load(jobId);
      if (job.mode !== 'read') throw new PreparationError('ORIGINAL_ONLY');
      if (!Number.isInteger(index) || !job.pages[index]) throw new PreparationError('INVALID_PAGE');
      if (job.pages[index].status === 'ready') return { index, needsReview: Boolean(job.pages[index].needsReview) };
      await beforePage({ jobId, index });
      if (signal.aborted || await store.cancelled(jobId)) throw new PreparationError('CANCELLED');
      let result, needsReview = false, reviewCode;
      try {
        result = await pipeline.run({ requestId: randomUUID(), language: 'hi', mode: job.mode, text: job.pages[index].text, wantAudio: false }, signal);
      } catch (error) {
        // Preserve the original if the optional explanation cannot be trusted.
        if (!['UNFAITHFUL','INCOMPLETE','UNREADABLE'].includes(error.code)) throw error;
        needsReview = true; reviewCode = error.code;
        result = { kind: 'reading', originalText: job.pages[index].text, spokenText: job.pages[index].text, isExplanation: false, isDescription: false, retakeReason: '' };
      }
      if (signal.aborted || await store.cancelled(jobId)) throw new PreparationError('CANCELLED');
      job = await store.load(jobId);
      job.pages[index] = { ...job.pages[index], status: 'ready', result, needsReview, ...(reviewCode ? { reviewCode } : {}) };
      await store.save(jobId, job);
      // The history contains only page indexes and review flags, never text or audio.
      return { index, needsReview };
    } catch (error) {
      if (signal.aborted) throw new CancelledFailure('Preparation cancelled.');
      if (error instanceof PreparationError) throw ApplicationFailure.nonRetryable('Preparation unavailable.', 'PreparationStopped');
      throw ApplicationFailure.create({ message: 'Page preparation failed.', type: 'PreparationRetryable' });
    } finally { clearInterval(timer); }
  }};
}
