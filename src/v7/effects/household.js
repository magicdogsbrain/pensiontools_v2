/**
 * The runner of "Your household" (research/v7/road-to-7.md step 9). On the step `#/plan/<id>/household`, whenever the
 * pooled run is asked for (household/run: both plans each way, as they are and drawing together, with the split's limit)
 * or the survivor or care question (household/survivor, household/care), run it in the worker's own lane on the pair the
 * page's reading names (client.household, client.householdSurvivor, client.householdCare: the lazy engine loads there)
 * and file the figures under the pair's key (household/done, …/survivorDone, …/careDone), or say it failed. A result for
 * a key or boxes no longer wanted is dropped here and by the reducer; either plan changing under a run (the key moving)
 * ends it. Progress messages of the pooled run become household/progress.
 *
 * No page fallback, on purpose: the engine's chunk is the worker's alone. A browser that cannot start a worker gets the
 * reason 'noWorker', and the screen says so. Nothing is written.
 *
 *   startHouseholdRunner({ store, client, now }) → stop()
 *     client.household(plan, partner, env, onProgress)           env = { today, limit }
 *     client.householdSurvivor(plan, partner, env, onProgress)   env = { today, boxes }
 *     client.householdCare(plan, partner, env, onProgress)       env = { today, boxes }
 *     now()                                                      the clock, for the cost said on screen only
 */
import { A } from '../state/actions.js';
import { NO_WORKER } from './workerClient.js';

/** The page's reading of the household step, when the route is on it and a partner is linked. */
function wanted(state) {
  const r = state.route;
  if (!r || r.screen !== 'plan' || r.step !== 'household' || !r.planId) return null;
  const plans = state.plans;
  const page = plans && plans.status === 'read' && plans.view && plans.view.page && plans.view.page.forId === r.planId ? plans.view.page : null;
  const Hv = page && page.household;
  if (!Hv || !Hv.found || !Hv.runKey || !Hv.partner) return null;
  const entry = plans.list.find((e) => e && e.plan && String(e.plan.id) === String(r.planId));
  const partner = plans.list.find((e) => e && e.plan && String(e.plan.id) === String(Hv.partner.id));
  return entry && partner ? { key: Hv.runKey, plan: entry.plan, partner: partner.plan } : null;
}

const same = (a, b) => JSON.stringify(a == null ? null : a) === JSON.stringify(b == null ? null : b);

export function startHouseholdRunner({ store, client, now = () => 0 }) {
  let stopped = false;
  let pooled = null;                 // { key, limit } under way
  const tries = new Map();           // 'survivor' | 'care' → { key, boxes }

  async function run(key, limit, plan, partner) {
    pooled = { key, limit };
    const t0 = now();
    const mine = () => !stopped && pooled && pooled.key === key && same(pooled.limit, limit);
    try {
      if (!client || typeof client.household !== 'function') throw Object.assign(new Error('no household lane'), { code: NO_WORKER });
      const result = await client.household(plan, partner, { today: store.getState().env.today, limit }, (done, total) => { if (mine()) store.dispatch({ type: A.HH_PROGRESS, key, done, total }); });
      if (!mine()) return;
      if (!result || typeof result !== 'object') throw new Error('no result');
      store.dispatch({ type: A.HH_DONE, key, limit, result, ms: now() - t0 });
    } catch (e) {
      if (mine()) store.dispatch({ type: A.HH_FAILED, key, limit, reason: e && e.code === NO_WORKER ? 'noWorker' : null });
    } finally {
      if (pooled && pooled.key === key && same(pooled.limit, limit)) pooled = null;
    }
  }

  async function ask(what, key, boxes, plan, partner) {
    tries.set(what, { key, boxes });
    const t0 = now();
    const mine = () => { const t = tries.get(what); return !stopped && t && t.key === key && same(t.boxes, boxes); };
    const lane = what === 'survivor' ? 'householdSurvivor' : 'householdCare';
    const done = what === 'survivor' ? A.HH_SURVIVOR_DONE : A.HH_CARE_DONE;
    const failed = what === 'survivor' ? A.HH_SURVIVOR_FAILED : A.HH_CARE_FAILED;
    try {
      if (!client || typeof client[lane] !== 'function') throw Object.assign(new Error('no ' + lane + ' lane'), { code: NO_WORKER });
      const result = await client[lane](plan, partner, { today: store.getState().env.today, boxes });
      if (!mine()) return;
      if (!result || typeof result !== 'object') throw new Error('no result');
      store.dispatch({ type: done, key, boxes, result, ms: now() - t0 });
    } catch (e) {
      if (mine()) store.dispatch({ type: failed, key, boxes, reason: e && e.code === NO_WORKER ? 'noWorker' : null });
    } finally {
      if (mine()) tries.delete(what);
    }
  }

  function check(state, action) {
    if (stopped || !action) return;
    const w = wanted(state);
    const H = state.household;
    if (!w || !H || H.key !== w.key) {
      // the pair changed under a run (or the page left): the old runs are ended, their answers dropped
      if (pooled && (!w || pooled.key !== w.key)) { client.stop('household'); pooled = null; }
      for (const [what, t] of [...tries]) if (!w || t.key !== w.key) { client.stop(what === 'survivor' ? 'householdSurvivor' : 'householdCare'); tries.delete(what); }
      return;
    }
    if (action.type === A.HH_RUN) {
      if (H.status === 'working' && !(pooled && pooled.key === w.key && same(pooled.limit, H.limit))) { if (pooled) client.stop('household'); run(w.key, H.limit, w.plan, w.partner); }
    } else if (action.type === A.HH_SURVIVOR || action.type === A.HH_CARE) {
      const what = action.type === A.HH_SURVIVOR ? 'survivor' : 'care';
      const t = H[what];
      if (t && t.status === 'working') {
        const cur = tries.get(what);
        if (cur && cur.key === w.key && same(cur.boxes, t.boxes)) return;   // already under way for these boxes
        if (cur) client.stop(what === 'survivor' ? 'householdSurvivor' : 'householdCare');
        ask(what, w.key, t.boxes, w.plan, w.partner);
      }
    }
  }
  const off = store.subscribe(check);
  return () => { stopped = true; off(); if (pooled) client.stop('household'); for (const what of tries.keys()) client.stop(what === 'survivor' ? 'householdSurvivor' : 'householdCare'); pooled = null; tries.clear(); };
}
