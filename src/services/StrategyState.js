/**
 * Strategy state — per-strategy inputs, kept apart (6.13.0).
 *
 * Owner's ruling (16 Sep 2026): switching strategy must leave NO stray data from the deselected strategy in
 * the settings, but per-strategy backups are fine so that switching back restores what was there. So the
 * Stress settings carry `strategyState = { [strategyId]: { strategyParams, allocMode, taggedFunds, savedAt } }`
 * and the flat fields (`strategyParams`, `allocMode`, `taggedFunds`) are materialised for the ACTIVE strategy
 * only. `taggedFunds` here is the Stress tester's own "funds to test" list — a strategy input, never holdings
 * (those live in `scenario.holdings`, see HoldingsRecord.js).
 *
 * Which keys each strategy owns comes from what the engines and readStrategyParams (index.html) actually read.
 * `sippTotal` / `isaTotal` — the "mini pot" totals a bought strategy is priced on — are shared by every
 * strategy except Pots & Valves, which runs on the allocation (equityMin/bondMin/cashTarget) and never sees them.
 *
 * Pure: no DOM, no storage, no clock — `savedAt` is passed in by the caller.
 */
export const POTS_AND_VALVES = 'pots-and-valves';

export const OWNED_KEYS = {
  'pots-and-valves': [],
  'buckets-in-order': ['bucketBand'],
  'bridge-and-engine': ['bridgeAge', 'cashYears'],
  'ladder-and-ratchet': ['ladderYears', 'drawAnnual', 'triggerMode', 'bandThreshold'],
  'floor-and-flex': ['essentialsAnnual', 'horizonAge', 'sleeveRate', 'treatsRule', 'ratchet'],
  'floor-the-schedule': [],
  'floor-to-age': ['floorToAge', 'borrowedFloor'],
  'full-il-gilt': ['cashYears', 'bridgeCash'],
  'gilt-rotation': ['cashYears', 'bridgeCash', 'rotateCutAge', 'rotateTrigger', 'rotateDisarmYears']
};
/** Shared by every strategy except Pots & Valves: the SIPP / ISA totals the strategy is priced on. */
export const SHARED_KEYS = ['sippTotal', 'isaTotal'];

const known = (id) => Object.prototype.hasOwnProperty.call(OWNED_KEYS, id);
const isObj = (o) => !!o && typeof o === 'object' && !Array.isArray(o);
/** Firestore refuses `undefined`: copy an object without those keys. */
const defined = (o) => { const out = {}; for (const [k, v] of Object.entries(o || {})) if (v !== undefined) out[k] = v; return out; };
const copyFunds = (arr) => (Array.isArray(arr) ? arr.filter(Boolean).map((f) => defined(f)) : []);

/** The keys a strategy owns outright (a copy). Unknown id → []. */
export function ownedKeys(id) { return known(id) ? OWNED_KEYS[id].slice() : []; }

/** Owned + shared keys — everything the strategy may keep in its params. */
export function allowedKeys(id) { return id === POTS_AND_VALVES ? ownedKeys(id) : [...ownedKeys(id), ...SHARED_KEYS]; }

/**
 * Only the keys `id` may keep. A strategy this module does not know keeps everything (we cannot judge what
 * is stray, and losing a future strategy's dials would be the worse failure). `undefined` values are dropped.
 */
export function cleanParams(id, params) {
  const p = params && typeof params === 'object' ? params : {};
  if (!known(id)) return defined(p);
  const out = {};
  for (const k of allowedKeys(id)) if (p[k] !== undefined) out[k] = p[k];
  return out;
}

/** The active strategy's params as a loader should read them — nothing another strategy left behind. */
export function activeParams(settings) {
  const s = settings || {};
  return cleanParams(s.strategyId || POTS_AND_VALVES, s.strategyParams);
}

/** allocMode as the UI infers it when a plan never saved one: funds if any are tagged, else risk. */
function allocModeOf(s) { return s.allocMode || ((Array.isArray(s.taggedFunds) && s.taggedFunds.length) ? 'funds' : 'risk'); }

/**
 * Back up the flat fields under strategyState[id] (cleaned to the keys `id` owns). Returns a NEW settings
 * object; the flat fields are untouched. A plan with no strategyState yet gets one here — its flat bag is
 * filtered to the outgoing strategy's keys, so a first switch also sheds keys other strategies left behind.
 */
export function stashStrategy(settings, id, { savedAt = null } = {}) {
  const s = settings || {};
  const state = isObj(s.strategyState) ? s.strategyState : {};   // anything else (null, an array) is no state at all
  const prev = isObj(state[id]) ? state[id] : null;
  const entry = {
    strategyParams: cleanParams(id, s.strategyParams),
    allocMode: allocModeOf(s),
    taggedFunds: copyFunds(s.taggedFunds),
    savedAt: savedAt || (prev && prev.savedAt) || null
  };
  return { ...s, strategyState: { ...state, [id]: entry } };
}

/**
 * Switch the active strategy: stash the current one, then materialise `newId`'s saved state — or a clean
 * start `{ strategyParams: {}, allocMode: 'risk', taggedFunds: [] }` when it has none — into the flat fields.
 * Nothing the old strategy owned survives in the flat bag. The shared pot totals travel to a bought strategy
 * that has no state of its own (`carryShared`, default on: "the copy starts on X with your pot totals carried
 * over" is what the UI has always promised); Pots & Valves never receives them.
 */
export function switchStrategy(settings, newId, { savedAt = null, carryShared = true } = {}) {
  const s = settings || {};
  const curId = s.strategyId || POTS_AND_VALVES;
  const next = stashStrategy(s, curId, { savedAt });
  // A stash written by hand or by an older build may lack fields: each is read with its own default.
  const saved = isObj(next.strategyState[newId]) ? next.strategyState[newId] : null;
  let strategyParams, allocMode, taggedFunds;
  if (saved) {
    strategyParams = cleanParams(newId, saved.strategyParams);
    allocMode = typeof saved.allocMode === 'string' && saved.allocMode ? saved.allocMode : 'risk';
    taggedFunds = copyFunds(saved.taggedFunds);
  } else {
    strategyParams = {};
    if (carryShared && newId !== POTS_AND_VALVES && curId !== POTS_AND_VALVES) {
      for (const k of SHARED_KEYS) if (s.strategyParams && s.strategyParams[k] !== undefined) strategyParams[k] = s.strategyParams[k];
    }
    allocMode = 'risk';
    taggedFunds = [];
  }
  return { ...next, strategyId: newId, strategyParams, allocMode, taggedFunds };
}

/**
 * Sort a pre-6.13.0 plan's one flat bag — every strategy's dials side by side (a floorToAge next to cashYears next to
 * rotateCutAge) — into per-strategy stashes, once: only when there is no strategyState yet AND the bag holds keys the
 * ACTIVE strategy may not keep. Every other known strategy whose owned keys appear in the bag gets
 * `{ strategyParams: cleanParams(id, bag), allocMode, taggedFunds, savedAt: null }` — the active allocMode and
 * funds-to-test list copied because they were the only ones there were; savedAt null because there is no clock here.
 * The flat fields are left exactly as they are: activeParams() already reads them clean, and the first switchStrategy()
 * sheds the strays. Returns a NEW settings object when something was sorted, the input itself when nothing needs it.
 */
export function sortLegacyParams(settings) {
  const s = settings || {};
  const active = s.strategyId || POTS_AND_VALVES;
  if (!known(active)) return s;   // cannot say what is stray for a strategy this module does not know
  if (isObj(s.strategyState) && Object.keys(s.strategyState).length) return s;
  const bag = isObj(s.strategyParams) ? s.strategyParams : {};
  const allowed = new Set(allowedKeys(active));
  if (!Object.keys(bag).some((k) => bag[k] !== undefined && !allowed.has(k))) return s;
  const state = {};
  for (const id of Object.keys(OWNED_KEYS)) {
    if (id === active || !OWNED_KEYS[id].some((k) => bag[k] !== undefined)) continue;
    state[id] = { strategyParams: cleanParams(id, bag), allocMode: allocModeOf(s), taggedFunds: copyFunds(s.taggedFunds), savedAt: null };
  }
  return Object.keys(state).length ? { ...s, strategyState: state } : s;
}
