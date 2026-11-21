/**
 * "Assumptions and data" (research/v7/road-to-7.md step 11b, the ledger's strat.assumptions): the page #/assumptions is drawn
 * from figures the planner's own tables give (services/AssumptionsFacts.js), loaded with import() the first time the page is
 * opened in this page life — the file reaches the gilt data and the engine's constants, so the shell never carries them — and
 * kept in ui.assumptions as plain data. The gilt prices, the curve and the share index it reads are the one market's, loaded on
 * this page first (pageMarket.js: the day's file, else the copy built in), as the full view's page and both workers read them.
 * Nothing is written anywhere.
 *
 *   startAssumptions(store, { load, now }) → stop()
 */
import { A } from '../state/actions.js';
import { loadPageMarket } from './pageMarket.js';

/** The facts' module, loaded lazily once the one market is in; the tests hand in their own. */
export async function loadFacts({ market = loadPageMarket } = {}) {
  await market();
  const m = await import('../../services/AssumptionsFacts.js');
  return m.assumptionsFacts;
}

export function startAssumptions(store, { load = loadFacts, now = () => Date.now() } = {}) {
  let stopped = false;
  let loading = null;
  const need = (state) => !!(state.route && state.route.screen === 'assumptions' && !(state.ui && state.ui.assumptions));
  const go = () => {
    if (loading) return;
    loading = (async () => {
      let facts = null;
      try { const fn = await load(); facts = JSON.parse(JSON.stringify(fn(now()))); } catch { facts = null; }
      if (!stopped) store.dispatch({ type: A.ASSUMPTIONS_SET, facts });
      loading = null;
    })();
  };
  if (need(store.getState())) go();
  const unsubscribe = store.subscribe((state, action) => { if (action.type === A.ROUTE_SET && need(state)) go(); });
  return () => { stopped = true; unsubscribe(); };
}
