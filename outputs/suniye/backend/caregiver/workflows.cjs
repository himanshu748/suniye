const { proxyActivities, defineQuery, defineSignal, setHandler, condition, isCancellation } = require('@temporalio/workflow');

const progress = defineQuery('preparationProgress');
const release = defineSignal('releasePreparation');
const { preparePage } = proxyActivities({
  startToCloseTimeout: '90 seconds',
  scheduleToCloseTimeout: '5 minutes',
  heartbeatTimeout: '8 seconds',
  cancellationType: 'WAIT_CANCELLATION_COMPLETED',
  retry: { maximumAttempts: 3, initialInterval: '1 second', maximumInterval: '5 seconds', nonRetryableErrorTypes: ['PreparationStopped','PreparationInvalid'] },
});

async function prepareDocument({ jobId, pageCount, pauseAfter = 0 }) {
  let released = false;
  let state = { completed: 0, total: pageCount, status: 'preparing', needsReview: 0 };
  setHandler(progress, () => ({ ...state }));
  setHandler(release, () => { released = true; });
  try {
    for (let index = 0; index < pageCount; index++) {
      const result = await preparePage({ jobId, index });
      state.completed++;
      if (result.needsReview) state.needsReview++;
      // Caregiver may pause at a page boundary. It does not pause or resume speech.
      if (pauseAfter > 0 && state.completed === pauseAfter && index + 1 < pageCount) {
        state.status = 'paused';
        await condition(() => released);
        state.status = 'preparing';
      }
    }
    state.status = 'ready';
    return { ...state };
  } catch (error) {
    state.status = isCancellation(error) ? 'cancelled' : 'failed';
    throw error;
  }
}
exports.prepareDocument = prepareDocument;
