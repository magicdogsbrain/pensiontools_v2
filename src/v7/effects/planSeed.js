/**
 * "Save this as a plan" — the only V7 file that touches localStorage (research/v7/save-as-plan.md, Contract C.2).
 *
 * When a question's panel asks to save (state.keep[q].saving turns true, after the reducer checked the answer and
 * the name), this effect:
 *   1. builds the seed (src/answers/keep/planSeed.js) from the answer on screen, the name, the budget sheet and the
 *      spend choice, with the time from the clock;
 *   2. writes it to localStorage under 'pt_v7_plan_seed' (one seed at a time). If the browser refuses, the panel
 *      says "This browser would not keep your figures, so the plan could not be made." Nothing else is tried: above
 *      all, no figure ever goes into an address;
 *   3. dispatches keep/sent (the draft store keeps it in this tab), then opens ../#new-plan in the same tab, where
 *      today's planner reads the seed, asks for the name again and makes a NEW plan. Back returns to V7 with the
 *      tab's draft still there.
 *
 * On start-up — and when the browser shows the page again from its back-forward cache, where start-up does not run
 * again — it:
 *   - deletes a seed in this browser that is more than a day old (or cannot be read), WHICHEVER tab wrote it: the
 *     privacy policy says the figures are never used after a day, and a visit here is a chance to remove them;
 *   - looks at each save this tab sent. Still waiting in the planner: the same seed is there. Otherwise the planner's
 *     receipt, left in this tab's session storage, says what became of it: 'made' (then, and only then, "Saved as …"),
 *     'declined' ("Not now"), 'refused' or 'cleared' (a seed it could not use, a sign-out). No receipt: nothing is
 *     claimed either way (found 1 Oct 2026: a missing seed was taken to mean the plan was made — after "Not now" too).
 *
 *   PLANNER_ADDRESS                      '../#new-plan'
 *   localStore(win)                      the browser's localStorage, or null if it will not hand it over
 *   seedOutcome(storage, createdAt, nowMs, session)
 *                                        'waiting' | 'taken' | 'declined' | 'notMade' | 'gone' (+ the name it was made under)
 *   purgeStale(storage, nowMs)           deletes a stored seed over a day old or unreadable; true when it did
 *   startPlanSeed(store, { storage, session, now, go, onShow }) → stop()
 */
import { A } from '../state/actions.js';
import { keepView } from '../state/select.js';
import { buildPlanSeed, SEED_KEY, SEED_MAX_AGE_MS, RECEIPT_KEY } from '../../answers/keep/planSeed.js';

export const PLANNER_ADDRESS = '../#new-plan';

export function localStore(win = window) {
  try {
    const s = win.localStorage;
    return s && typeof s.getItem === 'function' ? s : null;
  } catch {
    return null;
  }
}

/** The stored seed, parsed: { seed } — or { unreadable: true } — or null when nothing is there (or storage refused). */
function stored(storage) {
  if (!storage) return null;
  let text = null;
  try { text = storage.getItem(SEED_KEY); } catch { return null; }
  if (text === null) return null;
  try {
    const seed = JSON.parse(text);
    return seed && typeof seed === 'object' && typeof seed.createdAt === 'string' ? { seed } : { unreadable: true };
  } catch {
    return { unreadable: true };
  }
}

const tooOld = (createdAt, nowMs) => { const t = Date.parse(createdAt); return !Number.isFinite(t) || nowMs - t > SEED_MAX_AGE_MS; };
const remove = (storage) => { try { storage.removeItem(SEED_KEY); return true; } catch { return false; } };

/** Delete a stored seed that is over a day old or cannot be read, whichever tab wrote it. True when one was deleted. */
export function purgeStale(storage, nowMs) {
  const s = stored(storage);
  if (!s) return false;
  if (s.unreadable || tooOld(s.seed.createdAt, nowMs)) return remove(storage);
  return false;
}

/** The planner's receipt for a seed this tab sent, or null. */
function receiptFor(session, createdAt) {
  if (!session) return null;
  try {
    const all = JSON.parse(session.getItem(RECEIPT_KEY) || 'null');
    const r = all && typeof all === 'object' ? all[createdAt] : null;
    return r && typeof r === 'object' && typeof r.outcome === 'string' ? r : null;
  } catch {
    return null;
  }
}

/**
 * What became of a seed this tab sent.
 *   { outcome: 'waiting' }                 it is still there, as sent
 *   { outcome: 'gone' }                    it was there but over a day old: deleted here, never used
 *   { outcome: 'taken', name }             the planner made a plan from it (its receipt says so), under `name`
 *   { outcome: 'declined' }                the person chose "Not now" (or closed the box)
 *   { outcome: 'notMade' }                 the planner could not use it, or a sign-out deleted it
 *   { outcome: 'unknown' }                 gone or replaced, with no receipt in this tab: nothing is claimed
 */
export function seedOutcome(storage, createdAt, nowMs, session = null) {
  const s = stored(storage);
  if (s && s.seed && s.seed.createdAt === createdAt) {
    if (tooOld(createdAt, nowMs)) { remove(storage); return { outcome: 'gone' }; }
    return { outcome: 'waiting' };
  }
  const r = receiptFor(session, createdAt);
  if (r && r.outcome === 'made') return { outcome: 'taken', name: typeof r.name === 'string' ? r.name : null };
  if (r && r.outcome === 'declined') return { outcome: 'declined' };
  if (r && (r.outcome === 'refused' || r.outcome === 'cleared')) return { outcome: 'notMade' };
  return { outcome: 'unknown' };
}

/**
 * @param {{ getState, dispatch, subscribe }} store
 * @param {object} o
 * @param {Storage|null} o.storage          the browser's localStorage (localStore(window))
 * @param {Storage|null} [o.session]        this tab's sessionStorage (draftStore.sessionStore(window)): the planner's receipts
 * @param {() => Date} [o.now]              the clock
 * @param {(address: string) => void} o.go  opens an address in this tab (location.assign)
 * @param {(fn: () => void) => (() => void)} [o.onShow]   calls fn when the page is shown again from the back-forward
 *                                          cache; returns the way to stop listening
 * @returns {() => void} stop
 */
export function startPlanSeed(store, { storage, session = null, now = () => new Date(), go, onShow = null }) {
  // Coming back: a day-old seed goes, whoever wrote it; then what became of each save this tab sent.
  const look = () => {
    const nowMs = now().getTime();
    purgeStale(storage, nowMs);
    for (const [q, k] of Object.entries(store.getState().keep || {})) {
      if (!k || !k.sent) continue;
      const o = seedOutcome(storage, k.sent.createdAt, nowMs, session);
      store.dispatch({ type: A.KEEP_BACK, q, outcome: o.outcome, ...(o.name ? { name: o.name } : {}) });
    }
  };
  look();
  const stopShow = onShow ? onShow(look) : () => {};

  const save = (q) => {
    const state = store.getState();
    const view = keepView(state, q);
    const createdAt = now().toISOString();
    const seed = view.can && view.check.ok
      ? buildPlanSeed({
        source: q, result: state.answers[q].result, env: state.env, name: { suggested: view.suggested, chosen: view.check.name },
        budget: state.budget || null, spendHow: (state.draft[q] && state.draft[q].spendHow) || null, createdAt
      })
      : null;
    if (!seed) { store.dispatch({ type: A.KEEP_FAILED, q, problem: 'notReady' }); return; }
    let written = false;
    try {
      if (storage) {
        storage.setItem(SEED_KEY, JSON.stringify(seed));
        written = storage.getItem(SEED_KEY) !== null;
      }
    } catch {
      written = false;
    }
    if (!written) { store.dispatch({ type: A.KEEP_FAILED, q, problem: 'storage' }); return; }
    store.dispatch({ type: A.KEEP_SENT, q, name: seed.name.chosen, createdAt });
    // After every listener has seen keep/sent (the draft store has written it to the tab), open the planner.
    Promise.resolve().then(() => go(PLANNER_ADDRESS));
  };

  const stopListening = store.subscribe((state, action, previous) => {
    if (action.type !== A.KEEP_SAVE) return;
    const q = action.q;
    const k = state.keep && state.keep[q];
    const was = previous.keep && previous.keep[q];
    if (k && k.saving && !(was && was.saving)) save(q);
  });
  return () => { stopListening(); stopShow(); };
}
