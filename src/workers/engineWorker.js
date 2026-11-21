/**
 * Engine Web Worker — runs the heavy, synchronous strategy maths off the main thread so a phone
 * never freezes: the six-strategy overview, a single strategy stress test, the household checks (the simple view's own
 * answers/plan/householdRun.js, on the two plans and the day), a row of "Try the bad
 * years" (the plan as stored: answers/plan/stressPanelRun.js), "Test what you keep" (answers/plan/keepRun.js), the saver's verdict (question B, src/reading/runs.js SAVER_RUN).
 * Inputs are plain settings/config objects; the plan is rebuilt here (planFromSettings) because a
 * plan carries pricing closures that cannot cross the worker boundary. The market is the one loader's (src/reading/market.js),
 * from the data folder the page hands in with every job (`market`), so ladder prices match the page and the simple view's
 * worker; every result says what it was priced on (`market`: marketStamp).
 */
import { stressTestStrategy, STRATEGY_NAMES } from '../strategies/stressTest.js';
import { enginePlanOf } from '../reading/gather.js';
import { compareAll } from '../strategies/compareRunner.js';
import { runHousehold, runSurvivor, runCare } from '../answers/plan/householdRun.js';
import { runMixCompare } from '../answers/plan/mixRun.js';
import { loadMarket } from '../reading/market.js';
import { cloneSafe } from '../utils/cloneSafe.js';
import { answerA } from '../answers/a/answer.js';
// (static: this worker is built as one classic-format file, which cannot split off a lazy chunk; it carries the engine already)
import { runStressRow } from '../answers/plan/stressPanelRun.js';
import { runKeepRetest } from '../answers/plan/keepRun.js';
import { answerB } from '../answers/b/answer.js';
import { runForDocument } from '../answers/plan/lastsRun.js';

// The page's one clock (src/reading/clock.js), handed in with every job (engineClient.runInWorker): the plan is seen from the
// same day as every other figure on the page, never from the worker's own clock.
let jobNow;
// The plan is built by the one builder both views' workers use (src/reading/gather.js enginePlanOf): from the settings and the
// page's day, the engine config made here from them — never a config sent beside them.
function plan(settings, cfg, essentialsAnnual) {
  return enginePlanOf({ settings, essentialsAnnual, now: jobNow ? jobNow.toISOString() : undefined });
}

self.onmessage = async (e) => {
  const { id, type, payload } = e.data || {};
  // a Date or its ISO string (engineClient.jobPayload): one Date from here on, handed to every run of this job
  jobNow = payload && payload.now ? new Date(payload.now instanceof Date ? payload.now.getTime() : payload.now) : undefined;
  if (jobNow && !Number.isFinite(jobNow.getTime())) { self.postMessage({ id, error: 'the job carried no day' }); return; }
  try {
    const market = await loadMarket({ folder: payload && payload.market });
    const post = (m) => self.postMessage(m.result && typeof m.result === 'object' && !Array.isArray(m.result) ? { ...m, result: { ...m.result, market } } : m);
    if (type === 'overview') {
      const p = plan(payload.settings, payload.cfg, payload.essentialsAnnual);
      // the one loop over the nine (compareRunner.compareAll, 6.40.0): the configs derived once, progress before each way
      const all = compareAll(p, Object.keys(STRATEGY_NAMES), { onProgress: (i, n, sid) => self.postMessage({ id, progress: { i, n, name: STRATEGY_NAMES[sid] } }) });
      post({ id, result: cloneSafe({ p, all }) });
    } else if (type === 'strategy') {
      const p = plan(payload.settings, payload.cfg, payload.essentialsAnnual);
      post({ id, result: cloneSafe({ p, r: stressTestStrategy(payload.strategyId, p) }) });
    } else if (type === 'household' || type === 'householdSurvivor' || type === 'householdCare') {
      // "Your household" (lead4.md D20): the couple's two plans, the survivor and the care checks through the simple view's own
      // functions (answers/plan/householdRun.js), handed the two plans and the day — one gatherer for both views
      const onProgress = (i, n) => self.postMessage({ id, progress: { i, n, name: '' } });
      const fn = type === 'household' ? runHousehold : type === 'householdSurvivor' ? runSurvivor : runCare;
      post({ id, result: cloneSafe(fn(payload.plan, payload.partner, { ...(payload.boxes || {}), today: payload.today, ...(type === 'household' ? { limit: payload.limit || null } : {}), onProgress })) });
    } else if (type === 'mixCompare') {   // "Compare allocations": the simple view's "Which mix lasts best?" (mixRun.js), the eight cells on the plan and the day
      post({ id, result: cloneSafe(runMixCompare(payload.plan, { today: payload.today, onProgress: (i, n) => self.postMessage({ id, progress: { i, n, name: '' } }) })) });
    } else if (type === 'stressRow') {   // "Try the bad years" (7.9.0): one row on the plan as stored
      post({ id, result: cloneSafe(runStressRow(payload.plan, { today: payload.today, row: payload.row })) });
    } else if (type === 'keepRetest') {   // "Test what you keep against your plan" (7.7.0): the simple view's own run (keepRun.js) on the plan as stored and the day
      post({ id, result: cloneSafe(runKeepRetest(payload.plan, { today: payload.today, onProgress: (i, n) => self.postMessage({ id, progress: { i, n, name: '' } }) })) });
    } else if (type === 'saver') {   // "Am I on course?" (lead4.md R6): question B on the plan's figures, as the simple view's worker runs it
      post({ id, result: cloneSafe(answerB(payload.inputs, payload.env)) });
    } else if (type === 'document') {   // the plan document's run (lead4.md D18; step F5): the simple view's lock run, on the plan and the day
      post({ id, result: cloneSafe(runForDocument(payload.plan, { today: payload.today, essentials: payload.essentials })) });
    } else if (type === 'whenStop') {   // "When could I retire?" (lead4.md D11): answer A on the plan's figures (src/reading/whenStop.js), as the simple view runs it
      post({ id, result: cloneSafe(answerA(payload.inputs, { ...payload.env, onProgress: (i, n) => self.postMessage({ id, progress: { i, n, name: '' } }) })) });
    } else {
      throw new Error('unknown job ' + type);
    }
  } catch (err) {
    self.postMessage({ id, error: String((err && err.message) || err) });
  }
};
