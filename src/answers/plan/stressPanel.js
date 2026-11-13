/**
 * "Try the bad years" (7.9.0; research/v7/replan-nov-2026.md §5; the build spec's §1–§3): the rows a plan is tried on, the
 * key a row's result is filed under, and "I accept this risk" for them. Pure: no clock (today arrives as text), no engine
 * (the rows run in stressPanelRun.js, lazily), no storage; both apps read it.
 *
 *   ROW_IDS, MARKET_IDS, HELD_IDS          the rows: As planned; a fall at the start, lower returns, spending a tenth more,
 *                                          prices rising faster; and, when the plan keeps a line by choice, as you hold it,
 *                                          what you keep falls by half, what may be one company's shares go to nothing
 *   ROW_CHANGE                             what each row changes (the run's shock, its lower returns, its spending, its held shock)
 *   stressKeyOf(plan, today)               the key a row's result is filed under: id | today | the effective settings | what
 *                                          they read from elsewhere | locked | what is held | the kept sex | the household's
 *                                          reason | the document. Not the level (a new level re-reads, no run), not
 *                                          lastModified or planAmendments (accepting keeps the rows)
 *   stressInputsOf(settings)               what an agreement records it was tried on: the strategy, the start age, the years,
 *                                          the first tax year — no pots, no income, no sex, no level
 *   FINGERPRINT_SKIP                       the stored settings that record a screen's state, never a figure
 *   fingerprintOf(plan, kind, id)          what an agreement is for: a hash of the row, its change, those inputs, the STORED
 *                                          settings (less FINGERPRINT_SKIP) and what the reading takes from elsewhere in the
 *                                          plan, the kept sex and the household's reason — stored, so a month passing never
 *                                          makes an agreement out of date; no copy of the settings or the sex is kept
 *   stressAgreementOf(plan, testId)        { status: 'none'|'agreed'|'stale', entry }: out of date on a new fingerprint or a
 *                                          new document; no value band (the settings are the person's own entries)
 *   stressAgreementsOf(plan)               every agreement on the plan, for the panel before anything is run (no run)
 *   stressAmendPatch(plan, row, o)         → { ok, problem, patch: { planAmendments }, previous, line, entry }: one live entry
 *                                          per (kind, row), accepting over an out-of-date one allowed; refused on a closed plan
 *                                          ('closed'), a held row ('held'), a row not tried ('na'), no result ('noResult'), a
 *                                          result for another key ('oldResult'), a row that changes nothing ('same'), and one
 *                                          in which no future runs out ('nothingFails')
 *   stressWithdrawPatch(plan, testId)      → the same, that row's agreement taken off ('none' when there is none)
 *
 * The entry (planAmendments, kinds 'stress' and 'confidence'; PlanAmendments.js carries every kind through every write):
 *   { at, kind, test: { id, inputs: { strategyId, startAge, years, firstTaxYear, shock? } },
 *     result: { chance, fixedAge, planToAge, runOutAge, typicalRunOutAge, coverage, floor, leftMedian, cuts? },
 *     fingerprint, engineVersion, documentAt, ageRule }
 * `chance` is null for a row with no weighted figure (it is accepted on `fixedAge`); `planToAge` is to that birthday
 * (`ageRule`, services/AgeConvention.js); `engineVersion` the app's version. The kept lines' risk has one record, the
 * keep agreement on What you hold: the held rows show its state and never write.
 */
import { effectiveStressSettings } from '../../services/PlanReading.js';
import { holdingsKeyOf, amendmentsOf, amendmentsWithout, documentAtOf } from '../../services/PlanAmendments.js';
import { isClosedPlan } from '../../services/PlanClosed.js';
import { budgetAgesKnown } from '../../services/BudgetModel.js';
import { firstRecordedMonthOf, isSuccessorOrClosed } from '../../services/PlanMove.js';
import { TO_AGE_RULE } from '../../services/AgeConvention.js';
import { keptSexOf, householdReasonOf } from './life.js';
import { AMEND_WRITES } from './schema.js';
import { dateOf, dayWords } from './dates.js';
import { VERSION } from '../../constants.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const copy = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const ISO = /^\d{4}-\d{2}-\d{2}T/;
const isLocked = (plan) => !!(plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked);

// ---- the rows -------------------------------------------------------------------------------------------------------------

export const MARKET_IDS = Object.freeze(['fall', 'lower', 'spend', 'prices']);
export const HELD_IDS = Object.freeze(['asHeld', 'heldHalf', 'heldNothing']);
export const ROW_IDS = Object.freeze(['asPlanned', ...MARKET_IDS, ...HELD_IDS]);

/** The fall's size, the drag, the spending and the prices: research/v7/replan-nov-2026.md §5. */
export const FALL_AT_START = 0.3;
export const LOWER_RETURNS_PCT = 1;
export const SPEND_MORE = 1.1;
export const PRICES_FASTER = 0.02;

/**
 * What each row changes, as the run takes it: `shock` (ladderEngine.shockPath; `from` 0 on a plan, the run's first month),
 * `returnDragPct` (Charges.monthlyCostFactor), `spend` (stressSpendOf's factor) or `held` (keepTest.heldSettingsOf's shock).
 */
export const ROW_CHANGE = Object.freeze({
  asPlanned: Object.freeze({}),
  fall: Object.freeze({ shock: Object.freeze({ kind: 'fall', share: FALL_AT_START, from: 0 }) }),
  lower: Object.freeze({ returnDragPct: LOWER_RETURNS_PCT }),
  spend: Object.freeze({ spend: SPEND_MORE }),
  prices: Object.freeze({ shock: Object.freeze({ kind: 'prices', add: PRICES_FASTER, from: 0 }) }),
  asHeld: Object.freeze({ held: null }),
  heldHalf: Object.freeze({ held: 'half' }),
  heldNothing: Object.freeze({ held: 'nothing' })
});

/** The kind of agreement a row's "I accept this risk" writes: As planned's own figure ('confidence'), a market row ('stress'); the held rows none. */
export const kindOfRow = (id) => (id === 'asPlanned' ? 'confidence' : MARKET_IDS.includes(id) ? 'stress' : null);

/** What an agreement records as the row's change (its test.inputs.shock): the size, never the run's start month. */
function changeOf(id) {
  if (id === 'fall') return { kind: 'fall', share: FALL_AT_START };
  if (id === 'lower') return { kind: 'lower', pct: LOWER_RETURNS_PCT };
  if (id === 'spend') return { kind: 'spend', factor: SPEND_MORE };
  if (id === 'prices') return { kind: 'prices', add: PRICES_FASTER };
  return null;
}

// ---- the key and the fingerprint ------------------------------------------------------------------------------------------

/** A stable 53-bit hash of some text (cyrb53), base 36: what a key or a fingerprint holds instead of the text. */
export function hashOf(text) {
  const s = String(text);
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

/** JSON with every object's keys in order, so a value read back from storage in another order hashes the same. */
export function canonical(v) {
  if (Array.isArray(v)) return '[' + v.map((x) => (x === undefined ? 'null' : canonical(x))).join(',') + ']';
  if (isObj(v)) return '{' + Object.keys(v).sort().filter((k) => v[k] !== undefined && typeof v[k] !== 'function').map((k) => JSON.stringify(k) + ':' + canonical(v[k])).join(',') + '}';
  if (typeof v === 'number' && !Number.isFinite(v)) return 'null';
  return JSON.stringify(v === undefined ? null : v);
}

/**
 * The stored Stress settings that record a screen's state, never a figure (checked field by field against
 * answers/plan/schema.js and the planner's settings): a prompt put away, a month left as it was, "settings saved at least
 * once", how the mix is chosen on the form, and the other ways' kept dials (the plan's own are strategyParams).
 */
export const FINGERPRINT_SKIP = Object.freeze(['staleDraftDismissedFor', 'stopMonthLeft', 'configured', 'riskMode', 'strategyState']);

const storedStressOf = (plan) => (plan && plan.stressTool && isObj(plan.stressTool.settings) ? plan.stressTool.settings : {});

/**
 * What the plan's reading takes from elsewhere in the plan (PlanReading.effectiveStressSettings and the readings it calls),
 * as stored: the budget's newer age, the Decision copy's lock and start, the first month recorded, whether it carries a
 * closed plan on. Never the date.
 */
function elsewhereOf(plan) {
  const b = plan && plan.budgetTool && isObj(plan.budgetTool.settings) ? plan.budgetTool.settings : null;
  const ds = plan && plan.decisionTool && isObj(plan.decisionTool.settings) ? plan.decisionTool.settings : null;
  let carried = false; try { carried = !!isSuccessorOrClosed(plan); } catch { carried = false; }
  let recorded = null; try { recorded = firstRecordedMonthOf(plan) || null; } catch { recorded = null; }
  return {
    budget: b && budgetAgesKnown(b) ? [b.currentAge == null ? null : +b.currentAge, b.currentAgeAsOf || null] : null,
    decision: ds ? [!!ds.locked, ds.firstTaxYear == null ? null : ds.firstTaxYear, ds.lockedPosition == null ? null : ds.lockedPosition] : null,
    recorded, carried
  };
}

/** The stored settings, less FINGERPRINT_SKIP, with what the reading takes from elsewhere: a hash. */
export function settingsHashOf(plan) {
  const s = storedStressOf(plan);
  const kept = {};
  for (const k of Object.keys(s)) if (!FINGERPRINT_SKIP.includes(k)) kept[k] = s[k];
  return hashOf(canonical({ s: kept, elsewhere: elsewhereOf(plan) }));
}

/** What an agreement records it was tried on (no pots, no income, no sex, no level). `settings`: the plan's settings. */
export function stressInputsOf(settings) {
  const s = isObj(settings) ? settings : {};
  const n = (v) => (isNum(+v) && v !== null && v !== '' ? +v : null);
  return { strategyId: typeof s.strategyId === 'string' && s.strategyId ? s.strategyId : 'pots-and-valves', startAge: n(s.shapeAgeNow), years: n(s.duration), firstTaxYear: n(s.firstTaxYear) };
}

/** What an agreement is for (see the header): a hash, so the entry holds no copy of the settings or of the sex. */
export function fingerprintOf(plan, kind, id) {
  const i = stressInputsOf(storedStressOf(plan));
  return hashOf(canonical([kind, id, changeOf(id), i.strategyId, i.startAge, i.years, i.firstTaxYear, settingsHashOf(plan), keptSexOf(plan), householdReasonOf(plan)]));
}

/** The key a row's result is filed under (see the header); null for a plan with no id. */
export function stressKeyOf(plan, today) {
  if (!plan || plan.id == null) return null;
  let eff = null;
  try { eff = effectiveStressSettings(plan, { now: dateOf(today) }); } catch { eff = null; }
  return [String(plan.id), String(today), hashOf(canonical(eff)), hashOf(canonical(elsewhereOf(plan))), isLocked(plan) ? 'L' : 'U',
    hashOf(holdingsKeyOf(plan && plan.holdings)), keptSexOf(plan) || '-', householdReasonOf(plan) || '-', String(documentAtOf(plan) || '-')].join('|');
}

// ---- the agreements -------------------------------------------------------------------------------------------------------

const entriesFor = (plan, kind, id) => amendmentsOf(plan, [kind]).filter((e) => isObj(e.test) && e.test.id === id);

/** Where a row's agreement stands (see the header). */
export function stressAgreementOf(plan, testId) {
  const kind = kindOfRow(testId);
  if (!kind) return { status: 'none', entry: null };
  const list = entriesFor(plan, kind, testId);
  const entry = list.length ? list[list.length - 1] : null;
  if (!entry) return { status: 'none', entry: null };
  const same = entry.fingerprint === fingerprintOf(plan, kind, testId) && (entry.documentAt == null ? null : entry.documentAt) === (documentAtOf(plan) == null ? null : documentAtOf(plan));
  return { status: same ? 'agreed' : 'stale', entry };
}

/** Every row agreement on the plan, in the panel's order, before anything is run: { id, kind, status, on, entry }. */
export function stressAgreementsOf(plan) {
  const out = [];
  for (const id of ['asPlanned', ...MARKET_IDS]) {
    const st = stressAgreementOf(plan, id);
    if (st.entry) out.push({ id, kind: kindOfRow(id), status: st.status, on: dayWords(st.entry.at), entry: st.entry });
  }
  return out;
}

const declared = (patch) => { for (const k of Object.keys(patch)) if (!AMEND_WRITES.includes(k)) throw new Error('stressPanel: "' + k + '" is not a declared field path'); return patch; };
const previousOf = (plan) => ({ planAmendments: plan && Object.prototype.hasOwnProperty.call(plan, 'planAmendments') ? copy(plan.planAmendments) : undefined });
const r0 = (v) => (isNum(v) ? Math.round(v) : null);

/**
 * The entry "I accept this risk" writes for a row's result (stressPanelRun.runStressRow: { key, na, a, shortfall, ran }):
 * the figures the person saw, plain data, nothing undefined.
 */
export function stressEntryOf(plan, row, { at, settings }) {
  const id = row.id;
  const kind = kindOfRow(id);
  const a = row.result.a;
  const sf = isObj(row.result.shortfall) ? row.result.shortfall : {};
  const when = isObj(sf.when) ? sf.when : null;
  const cuts = isObj(a.cuts) && row.result.ran && row.result.ran.cutsOn ? { cutN: r0(a.cuts.cutN), typicalCutPerYear: r0(a.cuts.typicalCutPerYear), typicalCutYears: r0(a.cuts.typicalCutYears) } : null;
  const change = changeOf(id);
  return copy({
    at, kind,
    test: { id, inputs: { ...stressInputsOf(settings), ...(change ? { shock: change } : {}) } },
    result: {
      chance: isNum(a.weighted) ? a.weighted : null,
      fixedAge: isNum(a.fixedAge) ? a.fixedAge : isNum(a.share) ? a.share : null,
      planToAge: r0(a.planToAge),
      runOutAge: when && !when.worstLasts ? r0(when.worst) : null,
      typicalRunOutAge: when ? r0(when.typical) : null,
      coverage: isNum(a.coverage) ? a.coverage : null,
      floor: isObj(a.floor) ? { age: r0(a.floor.age), yearly: r0(a.floor.yearly) } : null,
      leftMedian: r0(a.typicalLeft),
      ...(cuts ? { cuts } : {})
    },
    fingerprint: fingerprintOf(plan, kind, id),
    engineVersion: VERSION,
    documentAt: documentAtOf(plan),
    ageRule: TO_AGE_RULE
  });
}

/**
 * "I accept this risk" on a row (see the header): ONE write of the whole planAmendments list — any earlier entry for this
 * row taken off, the new one on the end; every other entry, of any kind, as it was.
 * @param {object} plan
 * @param {{ id: string, result: object, same?: boolean }} row   the row as the panel holds it (`same`: stressPanelView's)
 * @param {{ at: string, today: string, settings?: object }} o   `at` the moment (ISO); `settings` the plan's effective settings
 */
export function stressAmendPatch(plan, row, { at, today, settings = null } = {}) {
  const fail = (problem) => ({ ok: false, problem, patch: {}, previous: {}, line: null, entry: null });
  if (isClosedPlan(plan)) return fail('closed');
  const id = row && row.id;
  if (HELD_IDS.includes(id)) return fail('held');
  const kind = kindOfRow(id);
  if (!kind) return fail('noResult');
  const res = row.result;
  if (isObj(res) && res.na) return fail('na');
  if (!isObj(res) || !isObj(res.a) || typeof at !== 'string' || !ISO.test(at)) return fail('noResult');
  if (res.key !== stressKeyOf(plan, today)) return fail('oldResult');
  if (row.same === true) return fail('same');
  if (isObj(res.shortfall) && res.shortfall.when === null) return fail('nothingFails');
  let s = settings;
  if (!isObj(s)) { try { s = effectiveStressSettings(plan, { now: dateOf(today) }); } catch { s = {}; } }
  const entry = stressEntryOf(plan, row, { at, settings: s });
  const list = [...amendmentsWithout(plan, (e) => e.kind === kind && isObj(e.test) && e.test.id === id), entry];
  return { ok: true, problem: null, patch: declared({ planAmendments: list }), previous: previousOf(plan), line: { id: 'agreed', slots: { date: dayWords(at) } }, entry };
}

/** "Withdraw this" on a row's agreement: ONE write of the list without it. Needs no run. */
export function stressWithdrawPatch(plan, testId) {
  const fail = (problem) => ({ ok: false, problem, patch: {}, previous: {}, line: null });
  if (isClosedPlan(plan)) return fail('closed');
  if (HELD_IDS.includes(testId)) return fail('held');
  const kind = kindOfRow(testId);
  const st = kind ? stressAgreementOf(plan, testId) : { entry: null };
  if (!st.entry) return fail('none');
  const list = amendmentsWithout(plan, (e) => e.kind === kind && isObj(e.test) && e.test.id === testId);
  return { ok: true, problem: null, patch: declared({ planAmendments: list }), previous: previousOf(plan), line: { id: 'withdrawn', slots: { date: dayWords(st.entry.at) } } };
}
