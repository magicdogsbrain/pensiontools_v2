/**
 * Saved-plan migrations (6.15.0, V7 plan step 2): the ONE ordered chain a plan moves through, from the
 * `schemaVersion` it was saved with up to SCHEMA_VERSION (./schema.js).
 *
 * Rules for every step — migrateScenario enforces the ones marked (enforced):
 *  - pure and synchronous: no storage, no DOM; the clock is passed in (`now`), never read;
 *  - it is handed a deep COPY and may change it in place (or return a new object); the caller's object is
 *    never touched;
 *  - it PATCHES paths and keeps every key it does not know. It never rebuilds an object from a fixed key
 *    list — that is how a plan once lost its strategy, plan document and holdings for good
 *    (src/firebase/scenarioMigration.js header). No root key may disappear (enforced);
 *  - idempotent: running it on its own output changes nothing (a repeat, or two tabs at once, is harmless);
 *  - it never touches `planDocument`, `planDocumentArchive`, `decisionTool.planOfRecord`,
 *    `decisionTool.planOfRecordArchive` or `decisionTool.history` (enforced, byte for byte);
 *  - it never touches ANY key inside `decisionTool.settings` of a plan that is locked or has records
 *    (enforced, byte for byte): that map is hashed by decisionSettingsChecksum, and a moved checksum orphans
 *    the recorded months and the plan of record;
 *  - a step that throws, or breaks a rule above, abandons the WHOLE chain: the caller gets the object it
 *    passed in, `error` set, `changed` false — the stored plan is left as it is and opens as it is.
 *
 * Deliberately NOT in step 1 (each stays the lazy reader it is today):
 *  - the plan's start / timing pin (PlanTiming.pinTiming): it is derived from today's date and from the
 *    Budget's age, so it cannot be a pure step whose result is the same either side of 6 April. The 6.14.0
 *    write-back in StressRepository.loadStressDBAsync remains the one place it is written;
 *  - the "Declining with age" spending bake (Stress and Decision copies): it is computed on the settings
 *    merged over defaults with Math.pow, and the Decision copy is checksummed;
 *  - the merge of default Stress settings: a default is not something the person saved.
 */
import { SCHEMA_VERSION, schemaVersionOf } from './schema.js';
import { ENGINE_VERSION } from '../strategies/version.js';
import { sortLegacyParams } from '../services/StrategyState.js';
import { normaliseHoldings, HOLDINGS_VERSION } from '../services/HoldingsRecord.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const isPlain = (v) => { if (!isObj(v)) return false; const p = Object.getPrototypeOf(v); return p === Object.prototype || p === null; };

/**
 * Deep copy of plain objects and arrays, key order kept (so an untouched sub-object stays byte-identical).
 * Anything else — a string, a number, null, a Firestore Timestamp, a Date — is carried as it is.
 */
export function deepCopy(v) {
  if (Array.isArray(v)) return v.map(deepCopy);
  if (isPlain(v)) { const o = {}; for (const k of Object.keys(v)) o[k] = deepCopy(v[k]); return o; }
  return v;
}

const iso = (now) => {
  const d = now instanceof Date ? now : new Date(now == null ? Date.now() : now);
  return Number.isFinite(d.getTime()) ? d.toISOString() : new Date().toISOString();
};
const bytes = (v) => { const s = JSON.stringify(v); return s === undefined ? 'undefined' : s; };

/** Locked, or something has been recorded against it (a month, or a tax year set up) — PlanLock's own test. */
export function decisionSettingsFrozen(scenario) {
  const dt = scenario && isObj(scenario.decisionTool) ? scenario.decisionTool : null;
  if (!dt) return false;
  if (isObj(dt.settings) && dt.settings.locked) return true;
  if (Array.isArray(dt.history) && dt.history.length) return true;
  return isObj(dt.taxYears) && Object.values(dt.taxYears).some((t) => t && t.yearSetupComplete);
}

/** The parts of a plan no migration may change, as text. */
function protectedParts(scenario) {
  const s = scenario || {};
  const dt = isObj(s.decisionTool) ? s.decisionTool : {};
  const out = {
    planDocument: bytes(s.planDocument),
    planDocumentArchive: bytes(s.planDocumentArchive),
    'decisionTool.planOfRecord': bytes(dt.planOfRecord),
    'decisionTool.planOfRecordArchive': bytes(dt.planOfRecordArchive),
    'decisionTool.history': bytes(dt.history)
  };
  if (decisionSettingsFrozen(s)) out['decisionTool.settings'] = bytes(dt.settings);
  return out;
}

// ============================================================================
// THE CHAIN — append only. Never edit a step that has shipped: add the next one.
// ============================================================================

/**
 * 0 → 1 (6.15.0). No figure on any plan moves. It writes down, once, what was being worked out again on
 * every load and saved only if the person happened to press Save:
 *  - the strategy block of a plan older than the strategy schema (ScenarioRepository.ensureStrategyBlock gave
 *    it a new `lockedAt` on every load): dated from the plan's own createdAt / lastModified;
 *  - the three renamed Stress keys (pacwMin / cgtMin / csh2Target → equityMin / bondMin / cashTarget), the
 *    old keys kept beside them;
 *  - a pre-6.13.0 flat `strategyParams` bag sorted into per-strategy `strategyState` on the Stress settings
 *    (StrategyState.sortLegacyParams: the flat fields themselves are left exactly as they are);
 *  - a holdings record that is not in today's shape (a bare array of lines, or no version mark).
 * The Decision settings are not touched on any plan, locked or not.
 */
function toV1(s, { now }) {
  if (!isObj(s.strategy)) {
    const at = typeof s.createdAt === 'string' && s.createdAt ? s.createdAt : typeof s.lastModified === 'string' && s.lastModified ? s.lastModified : iso(now);
    s.strategy = { id: 'pots-and-valves', params: {}, lockedAt: at, engineVersion: ENGINE_VERSION };
  }
  const st = isObj(s.stressTool) && isObj(s.stressTool.settings) ? s.stressTool.settings : null;
  if (st) {
    for (const [oldKey, key] of [['pacwMin', 'equityMin'], ['cgtMin', 'bondMin'], ['csh2Target', 'cashTarget']]) {
      if (st[oldKey] !== undefined && st[key] === undefined) st[key] = st[oldKey];
    }
    const sorted = sortLegacyParams(st);
    if (sorted !== st && isObj(sorted.strategyState)) st.strategyState = deepCopy(sorted.strategyState);
  }
  const h = s.holdings;
  if (Array.isArray(h) || (isObj(h) && h.version !== HOLDINGS_VERSION)) {
    s.holdings = { ...(isObj(h) ? h : {}), ...normaliseHoldings(h) };   // unknown keys on the record are kept
  }
  return s;
}

export const MIGRATIONS = [
  { to: 1, name: 'Version stamp; strategy block, renamed Stress keys, per-strategy settings and holdings shape written once', up: toV1 }
];

/**
 * Move a plan up the chain.
 * @param {object} raw - a NORMALISED scenario document (normalizeScenario runs first; `id` may be present)
 * @param {{ now?: Date|string, migrations?: Array, target?: number }} [opts] - `now` for the steps;
 *   `migrations` / `target` exist for the tests (a deliberately bad step, a longer chain)
 * @returns {{ scenario: object, from: number, to: number, changed: boolean, error: Error|null, newer: boolean }}
 *   `scenario` is `raw` itself when nothing changed, when the plan is newer than this code (`newer`), or
 *   when a step failed (`error`); otherwise a new object. `changed` means "write this back".
 */
export function migrateScenario(raw, { now = new Date(), migrations = MIGRATIONS, target = SCHEMA_VERSION } = {}) {
  const from = schemaVersionOf(raw);
  const same = { scenario: raw, from, to: from, changed: false, error: null, newer: false };
  if (!isObj(raw)) return same;
  if (from > target) return { ...same, newer: true };
  if (from === target) return same;
  try {
    const before = protectedParts(raw);
    let cur = deepCopy(raw);
    let at = from;
    for (const step of migrations) {
      if (!(step.to > at)) continue;
      if (step.to !== at + 1) throw new Error('Migration chain has a gap: no step from version ' + at + ' to ' + (at + 1));
      const out = step.up(cur, { now });
      if (out !== undefined) cur = out;
      if (!isObj(cur)) throw new Error('Migration to version ' + step.to + ' did not return a plan');
      cur.schemaVersion = step.to;
      at = step.to;
      if (at === target) break;
    }
    if (at !== target) throw new Error('Migration chain stops at version ' + at + ', short of ' + target);
    const lost = Object.keys(raw).filter((k) => !(k in cur));
    if (lost.length) throw new Error('Migration dropped root key(s): ' + lost.join(', '));
    const after = protectedParts(cur);
    for (const k of Object.keys(before)) if (after[k] !== before[k]) throw new Error('Migration changed ' + k + ', which no migration may touch');
    return { scenario: cur, from, to: at, changed: true, error: null, newer: false };
  } catch (e) {
    return { ...same, error: e instanceof Error ? e : new Error(String(e)) };
  }
}
