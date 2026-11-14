/**
 * "Try the bad years" (7.9.0; research/v7/replan-nov-2026.md §5; the build spec's §1–§3): the rows a plan is tried on, the
 * key a row's result is filed under, and "I accept this risk" for them. Pure: no clock (today arrives as text), no engine
 * (the rows run in stressPanelRun.js, lazily), no storage; both apps read it.
 *
 *   ROW_IDS, MARKET_IDS, HELD_IDS          the rows: As planned; a fall at the start, lower returns, spending a tenth more,
 *                                          prices rising faster; and, when the plan keeps a line by choice, as you hold it,
 *                                          what you keep falls by half, what may be one company's shares go to nothing
 *   ROW_CHANGE                             what each row changes (the run's shock, its lower returns, its spending, its held shock)
 *   rowsFor(plan, { settings, today })     the rows this plan shows, each with the row it is compared with (`ref`) and what
 *                                          is known before a run (`na`: 'lockedLadder', 'todaysPrices'); the held rows only
 *                                          when the plan keeps a line by choice, "nothing" only when a kept line may be one
 *                                          company's shares; at most 8
 *   stressSpendOf(settings, f)             the settings with the income f times as large: every income amount the planner
 *                                          reads (spend.js scaledIncome) and a pinned draw or essentials floor
 *   sameAs(result, reference)              whether a row's every reported figure is its reference's
 *   stressPanelView(plan, rows, o)         what the panel draws from the results held (ids and figures; no words): each row
 *                                          at the level asked for (lasts.js atLevel, no run), beside its reference, `same`,
 *                                          its agreement and whether it can be accepted; the agreements before any run; the
 *                                          keep agreement's state for the held rows (they never write); `floor`, what
 *                                          still comes in if the money runs out, said once above the rows from As planned;
 *                                          `notTried`, why a locked ladder's four market rows are not tried, said once
 *                                          above the rows (the rows then say only their title and what they change)
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
import { holdingsKeyOf, amendmentsOf, amendmentsWithout, documentAtOf, keepsLines } from '../../services/PlanAmendments.js';
import { isClosedPlan } from '../../services/PlanClosed.js';
import { budgetAgesKnown } from '../../services/BudgetModel.js';
import { firstRecordedMonthOf, isSuccessorOrClosed } from '../../services/PlanMove.js';
import { TO_AGE_RULE } from '../../services/AgeConvention.js';
import { keptSexOf, householdReasonOf, planLevelOf } from './life.js';
import { scaledIncome } from './spend.js';
import { keptAssetsOf, keepTestOf, ladderGapsOf } from './keepTest.js';
import { documentLadder } from '../../services/LadderPosition.js';
import { atLevel, FAMILY } from './lasts.js';
import { AMEND_WRITES } from './schema.js';
import { dateOf, dayWords } from './dates.js';
import { VERSION } from '../../constants.js';
import { taxYearStartOf, taxYearLabel } from '../../services/PlanTiming.js';
import { chanceWords, twentiethsOfFutures, fixedAgeWords } from '../shared/format.js';
import { chanceShort, runsOutShort, planFloorShort, sameFloor } from '../shared/stressRowWords.js';

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

/** The row a row is compared with: As planned for the market rows and As held; As held for the held shocks. */
export const referenceOf = (id) => (id === 'asPlanned' ? null : id === 'heldHalf' || id === 'heldNothing' ? 'asHeld' : 'asPlanned');

/** A locked plan whose document holds a bought ladder: its gilts were bought at the day's prices, and are never priced again. */
export const lockedLadderOf = (plan, strategyId) => {
  const doc = isLocked(plan) && isObj(plan && plan.planDocument) ? plan.planDocument : null;
  return !!(doc && documentLadder(doc, strategyId) && doc.strategy && doc.strategy.p);
};

/** The rows this plan shows (see the header). */
export function rowsFor(plan, { settings = null, today = null } = {}) {
  let s = isObj(settings) ? settings : null;
  if (!s) { try { s = today ? effectiveStressSettings(plan, { now: dateOf(today) }) : storedStressOf(plan); } catch { s = storedStressOf(plan); } }
  const strategyId = s.strategyId || 'pots-and-valves';
  const ladder = lockedLadderOf(plan, strategyId);
  const rows = [{ id: 'asPlanned', ref: null, na: null }];
  for (const id of MARKET_IDS) rows.push({ id, ref: 'asPlanned', na: ladder ? 'lockedLadder' : id === 'prices' && !FAMILY.includes(strategyId) ? 'todaysPrices' : null });
  if (keepsLines(plan && plan.holdings)) {
    const mine = keptAssetsOf(plan.holdings).filter((k) => k.as === 'mine');
    rows.push({ id: 'asHeld', ref: 'asPlanned', na: null }, { id: 'heldHalf', ref: 'asHeld', na: null });
    if (mine.some((k) => k.single)) rows.push({ id: 'heldNothing', ref: 'asHeld', na: null });
  }
  return rows;
}

/**
 * Spending a tenth more (f = 1.1), before tax: the planner's income scaled (spend.js scaledIncome: the base income, each
 * step, the saved per-year schedule) and, when one is pinned, a bought strategy's own draw (Ladder & Ratchet's drawAnnual)
 * and essentials floor — else a pinned draw would be drawn as before (compareRunner.deriveCompareConfigs, stressTest.js).
 */
export function stressSpendOf(settings, f) {
  const s = isObj(settings) ? settings : {};
  const out = scaledIncome(s, f);
  const sp = isObj(s.strategyParams) ? s.strategyParams : null;
  if (sp && ((isNum(+sp.drawAnnual) && +sp.drawAnnual > 0) || (isNum(+sp.essentialsAnnual) && +sp.essentialsAnnual > 0))) {
    out.strategyParams = { ...sp };
    if (+sp.drawAnnual > 0) out.strategyParams.drawAnnual = Math.round(+sp.drawAnnual * f);
    if (+sp.essentialsAnnual > 0) out.strategyParams.essentialsAnnual = Math.round(+sp.essentialsAnnual * f);
  }
  return out;
}

/** Whether a row's every reported figure is its reference's (then it says only "this changes nothing"). */
export function sameAs(result, reference) {
  const a = result && result.a, b = reference && reference.a;
  if (!isObj(a) || !isObj(b)) return false;
  const eq = (x, y) => (x == null && y == null) || x === y;
  const r = (v) => (isNum(v) ? Math.round(v) : null);
  if (!eq(a.fixedAge, b.fixedAge) || !eq(a.sumW, b.sumW)) return false;
  for (const k of ['typicalLeft', 'badCaseLeft', 'goodCaseLeft']) if (r(a[k]) !== r(b[k])) return false;
  const fa = isObj(a.floor) ? a.floor : {}, fb = isObj(b.floor) ? b.floor : {};
  if (!eq(fa.age, fb.age) || !eq(fa.yearly, fb.yearly)) return false;
  const ca = isObj(a.cuts) ? a.cuts : {}, cb = isObj(b.cuts) ? b.cuts : {};
  for (const k of ['cutN', 'typicalCutPerYear', 'typicalCutYears']) if (!eq(ca[k], cb[k])) return false;
  return canonical(shortfallFigures(result.shortfall)) === canonical(shortfallFigures(reference.shortfall));
}
const shortfallFigures = (s) => (isObj(s) ? { when: s.when || null, howLong: s.howLong || null, howMuch: isNum(s.howMuch) ? s.howMuch : null, closedYear: s.closedYear || null } : null);

/**
 * What the panel draws (see the header). `rows`: the results held for this plan, by row id (runStressRow's); a result for
 * another key is not read. Nothing here runs or writes.
 * @param {{ level?: string|null, today: string, settings?: object }} o   `level` the page's "How careful?" (else the plan's)
 */
export function stressPanelView(plan, rows, { level = null, today, settings = null } = {}) {
  const key = stressKeyOf(plan, today);
  const held = isObj(rows) ? rows : {};
  const fresh = (id) => (isObj(held[id]) && held[id].key === key ? held[id] : null);
  const lvl = level || planLevelOf(plan);
  const closed = isClosedPlan(plan);
  const keep = keepStateOf(keepsLines(plan && plan.holdings) ? keepTestOf(plan, {}) : null);
  let s = isObj(settings) ? settings : null;
  if (!s) { try { s = effectiveStressSettings(plan, { now: dateOf(today) }); } catch { s = storedStressOf(plan); } }
  const ctx0 = contextOf(plan, s, today);
  const rows0 = rowsFor(plan, { settings: s, today }).map((row) => {
    const res = fresh(row.id);
    const na = row.na || (res && res.na) || null;
    const ref = row.ref ? fresh(row.ref) : null;
    const same = !na && !!res && !!ref && !ref.na && sameAs(res, ref);
    const kind = kindOfRow(row.id);
    const agreement = kind ? stressAgreementOf(plan, row.id) : null;
    const failing = !!(res && isObj(res.shortfall) && res.shortfall.when);
    return {
      id: row.id, ref: row.ref, kind, status: na ? 'na' : res ? 'done' : 'idle', na,
      a: res && !na && res.a ? atLevel(res.a, lvl) : null,
      shortfall: res && !na ? res.shortfall || null : null,
      ran: res && !na ? res.ran || null : null,
      refA: ref && !ref.na && ref.a ? atLevel(ref.a, lvl) : null,
      refShortfall: ref && !ref.na && ref.a ? ref.shortfall || null : null,
      same,
      agreement,
      // (accepted already and still standing: nothing to accept again — Withdraw is the row's one button)
      canAccept: !!kind && !closed && !!res && !na && !same && failing && !(agreement && agreement.status === 'agreed'),
      // the held rows: the keep agreement's state once, on "As you hold it" (information; the rows never write)
      ...(kind ? {} : { keep: keep && row.id === 'asHeld' ? keep : null })
    };
  });
  // what still comes in if the money runs out: said once, above the rows, from As planned (a row whose own differs says it
  // under "More about this line")
  const planned = rows0.find((r) => r.id === 'asPlanned');
  const floor = planned && planned.status === 'done' && planned.a ? floorOfRow(planned.a) : null;
  // a locked ladder's four market rows are not tried, for one reason: said once, above the rows
  const market = rows0.filter((r) => MARKET_IDS.includes(r.id));
  const ladderOnce = market.length > 0 && market.every((r) => r.na === 'lockedLadder');
  const notTried = ladderOnce ? { id: 'na.lockedLadder', slots: { keep: rows0.some((r) => HELD_IDS.includes(r.id)) ? { id: 'na.lockedLadderKeep' } : '' } } : null;
  const ctx = { ...ctx0, floor, ladderOnce, heldGap: heldGapOf(plan, rows0, { strategyId: s.strategyId || 'pots-and-valves', today }) };
  const list = rows0.map((r) => ({ ...r, parts: rowParts(r, ctx) }));
  const agreements = stressAgreementsOf(plan).map((g) => ({ ...g, parts: { title: { id: 'rows.' + g.id + '.title' }, accepted: acceptedParts(g.entry), stale: g.status === 'stale' } }));
  // what the panel tries, in the order it tries it: As planned first, then As held, then the rest; a row known not to be
  // tried before any run ('lockedLadder', 'todaysPrices': rowsFor's) is not sent
  const order = list.filter((r) => !(r.status === 'na' && (r.na === 'lockedLadder' || r.na === 'todaysPrices'))).map((r) => r.id);
  const first = ['asPlanned', 'asHeld'].filter((id) => order.includes(id));
  return {
    key, level: lvl, rows: list, agreements, keep, closed, floor, notTried,
    order: [...first, ...order.filter((id) => !first.includes(id))], drawing: ctx.drawing
  };
}

/**
 * Why As you hold it lasts less often than As planned on a locked ladder: the first tax year what is held for the plan's own
 * money does not cover (keepTest.ladderGapsOf — the gaps What you hold reads, before what is kept by choice and the money
 * expected), with the age that year and its gap. Only once both rows are in and the held count is below the plan's; null
 * otherwise (a pot plan has no years to read). Words only: no row's figure is read differently.
 */
function heldGapOf(plan, rows, { strategyId, today }) {
  const held = rows.find((r) => r.id === 'asHeld');
  if (!held || !held.a || !held.refA || !(fixedOf(held.a) < fixedOf(held.refA)) || !lockedLadderOf(plan, strategyId)) return null;
  let G = null;
  try { G = ladderGapsOf(plan, { today, withExpected: true }); } catch { G = null; }
  const p = plan.planDocument.strategy.p;
  const firstTY = Math.round(+(p.runFirstTaxYear || p.firstTaxYear));
  if (!G || !G.firstShort || !isNum(+p.startAge) || !isNum(firstTY)) return null;
  const Y = +G.firstShort.Y;
  return { id: 'held.gap', slots: { taxYear: taxYearLabel(Y), age: String(Math.round(+p.startAge) + (Y - firstTY)), amount: poundsOf(G.firstShort.gap) } };
}

/**
 * The keep agreement (7.7.0, accepted on What you hold) as the panel says it: its status, KEEPTEST's own line (before the
 * rows are tried), the state in the panel's words (STRESS.held, on the held rows) and the one thing What you hold can do
 * about it now — accept it, accept it again, or withdraw it. Null when the plan has none.
 */
function keepStateOf(k) {
  if (!k || !k.status || k.status === 'none') return null;
  const on = k.agreed && k.agreed.on ? k.agreed.on : '';
  const [state, link] = k.status === 'agreed' ? ['agreed', 'withdraw'] : k.status === 'stale' ? (k.keeps ? ['stale', 'acceptAgain'] : ['lapsed', 'withdraw']) : ['untested', 'accept'];
  return { status: k.status, line: k.line, state: { id: 'held.' + state, slots: { date: on } }, link: { id: 'held.' + link, slots: {} } };
}

// ---- the rows in words (ids of src/v7/copy/stressPanel.js STRESS, their slots filled; both apps draw them) ----------------

/** What the words read from the plan: whether the money is drawn on already, the names that may be one company's shares. */
function contextOf(plan, s, today) {
  let thisTY = null;
  try { thisTY = taxYearStartOf(dateOf(today)); } catch { thisTY = null; }
  const first = isNum(+s.firstTaxYear) && +s.firstTaxYear > 0 ? +s.firstTaxYear : null;
  const drawing = first == null || thisTY == null ? true : first <= thisTY;
  let singles = [];
  try { singles = keepsLines(plan && plan.holdings) ? keptAssetsOf(plan.holdings).filter((k) => k.as === 'mine' && k.single).map((k) => k.label).filter(Boolean) : []; } catch { singles = []; }
  return { drawing, saver: !drawing, singles };
}
const listOf = (xs) => (xs.length <= 1 ? xs.join('') : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1]);
const noStop = (t) => String(t || '').replace(/\.\s*$/, '');
const lowerFirst = (t) => (t ? t.charAt(0).toLowerCase() + t.slice(1) : t);
const commas = (n) => String(Math.abs(Math.round(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const poundsOf = (v) => '£' + commas(isNum(v) ? v : 0);
const poundsK = (v) => '£' + commas(Math.round((isNum(v) ? Math.max(0, v) : 0) / 1000) * 1000);
const fixedOf = (a) => (isNum(a.fixedAge) ? a.fixedAge : isNum(a.share) ? a.share : 0);
const kindOf = (a) => (a.failKind === 'cut' || a.failKind === 'lean' ? a.failKind : 'ran-out');
/** The fixed-age sentence of a result: OneAnswer's own words when the run wrote them, else built the same way. */
const fixedWordsOf = (a) => (a.words && a.words.fixed ? a.words.fixed : fixedAgeWords(fixedOf(a), a.planToAge, { kind: kindOf(a) }));
/** Whether a result has a weighted figure the screens say (OneAnswer wrote its sentence). */
const weightedOf = (a) => a.weighted !== null && isNum(a.weighted) && !!(a.words && a.words.headline);
/** A result's floor, as the line above the rows says it (shared/stressRowWords.js). */
const floorOfRow = (a) => planFloorShort(a.floor, { kind: kindOf(a), words: a.words && a.words.floor ? a.words.floor : null });

/**
 * One row in words: { title, what[], na, chance, runsOut, closedYear, heldGap, more[], confirm, accepted, keepLine } — `chance` the
 * weighted chance { weighted } with its fixed-age count { fixed } beside it (the screens draw them as [data-weighted] and
 * [data-fixed="age"] in one line), `runsOut` where it runs out, both in short (shared/stressRowWords.js, as the strip says
 * them); `more` the rest, each { id, slots }, drawn under "More about this line". A row never says a figure of the real
 * histories.
 */
function rowParts(r, ctx) {
  const id = r.id;
  const what = [];
  if (id === 'fall') what.push({ id: ctx.drawing ? 'rows.fall.whatDrawing' : 'rows.fall.what' });
  else if (id === 'heldNothing') what.push({ id: ctx.singles.length > 1 ? 'rows.heldNothing.whatMany' : 'rows.heldNothing.what', slots: { list: listOf(ctx.singles) } });
  else what.push({ id: 'rows.' + id + '.what' });
  if (id === 'lower' && ctx.saver) what.push({ id: 'rows.lower.saver' });
  const title = { id: id === 'heldNothing' && ctx.singles.length > 1 ? 'rows.heldNothing.titleMany' : 'rows.' + id + '.title' };
  const out = { title, what, na: null, chance: null, runsOut: null, closedYear: null, heldGap: null, more: [], confirm: null, accepted: null, keepLine: null, holdLink: null };
  // (a locked ladder's market rows: why is said once, above the rows — the panel's `notTried`)
  if (r.na && !(r.na === 'lockedLadder' && ctx.ladderOnce)) out.na = { id: 'na.' + r.na };
  else if (!r.na && r.same) out.na = { id: 'na.same' };
  if (r.agreement && r.agreement.entry) out.accepted = { ...acceptedParts(r.agreement.entry), stale: r.agreement.status === 'stale' };
  if (r.keep && r.keep.state) { out.keepLine = r.keep.state; out.holdLink = r.keep.link; }
  const a = r.a;
  if (!a || r.na || r.same) return out;
  // a tried row's agreement that still stands: its figures are the row's own, just above — only the date is said
  if (out.accepted && !out.accepted.stale) out.accepted = { id: 'agreement.acceptedShort', slots: { date: out.accepted.slots.date }, fixed: null, stale: false };
  if (id === 'asHeld' && ctx.heldGap) out.heldGap = ctx.heldGap;
  const refA = r.refA;
  const refId = r.ref === 'asHeld' ? 'asHeld' : 'asPlanned';
  const weighted = weightedOf(a);
  const fixed = fixedWordsOf(a);
  const sf = isObj(r.shortfall) ? r.shortfall : null;
  const toAge = isNum(a.planToAge) ? String(Math.round(a.planToAge)) : '';
  // the two lines a row shows: its chance beside its fixed-age count, and where it runs out — each beside the reference's
  // figure once its row is in (shared/stressRowWords.js, the strip's own builder)
  const me = { weighted: weighted ? a.weighted : null, sumW: a.sumW, n: a.n, fixedAge: fixedOf(a) };
  const refMe = refA ? { weighted: weightedOf(refA) ? refA.weighted : null, sumW: refA.sumW, n: refA.n, fixedAge: fixedOf(refA) } : null;
  out.chance = chanceShort(me, refMe, { planToAge: toAge, kind: kindOf(a), couple: a.reason === 'couple' ? 'you' : null, as: refId, fixedWords: weighted ? null : fixed });
  const refSf = refA && isObj(r.refShortfall) ? r.refShortfall : null;
  if (sf && toAge) out.runsOut = runsOutShort(isObj(sf.when) ? sf.when : null, refSf ? (isObj(refSf.when) ? refSf.when : null) : undefined, { planToAge: toAge, as: refId });
  if (sf && isObj(sf.closedYear) && isNum(sf.closedYear.taxYear)) out.closedYear = { id: 'lines.closedYear', slots: { taxYear: taxYearLabel(sf.closedYear.taxYear) } };
  // the rest, under "More about this line": when, how long and how much, each naming the futures it counts; beside a
  // reference (once its row is in), with how many futures each set holds and the reference's own figure (the …Ref
  // sentences): a set that grew with later run-outs can read a later "typically", and the count beside it says why
  // (a result without the sets' sizes — one made before they were counted — is said without the comparison, never as NaN)
  const lines = out.more;
  const counted = !!sf && (!isObj(sf.when) || (isNum(sf.when.count) && isNum(sf.when.n)));
  const rs = refA && counted ? (isObj(r.refShortfall) ? r.refShortfall : {}) : null;
  const rw = rs && isObj(rs.when) ? rs.when : null;
  const refP = (n) => ({ id: 'ref.' + refId, slots: { n } });
  const say = (id, slots = {}) => ({ id: 'ref.' + id, slots });
  const tenthsOf = (x) => Math.floor(x * 10 + 1e-9);
  const weightAge = (w) => String(isNum(w.to) ? w.to : toAge);
  if (sf && isObj(sf.when)) {
    const w = sf.when;
    const base = { typical: String(w.typical), weightAge: weightAge(w), ...(w.worstLasts ? { age: toAge } : { worst: String(w.worst) }) };
    if (!rs) lines.push({ id: w.worstLasts ? 'lines.whenStillLasts' : 'lines.when', slots: base });
    else {
      lines.push({ id: w.worstLasts ? 'lines.whenStillLastsRef' : 'lines.whenRef', slots: { ...base, count: commas(w.count), n: commas(w.n),
        refCount: refP(rw ? commas(rw.count) : say('none')), refTypical: refP(rw ? String(rw.typical) : say('noneRunOut')),
        refWorst: refP(rw && !rw.worstLasts ? say('by', { age: String(rw.worst) }) : say('stillLasts', { age: toAge })) } });
    }
  }
  if (sf && isObj(sf.when) && isObj(sf.howLong)) {
    const h = sf.howLong;
    const base = { paid: String(h.paid), of: String(h.of), age: toAge };
    if (!rs) lines.push({ id: h.anyway ? 'lines.howLongAnyway' : 'lines.howLong', slots: base });
    else {
      const rh = isObj(rs.howLong) ? rs.howLong : null;
      lines.push({ id: h.anyway ? 'lines.howLongAnywayRef' : 'lines.howLongRef', slots: { ...base, count: commas(isNum(h.count) ? h.count : 0), n: commas(sf.when.n),
        refCount: refP(rh && isNum(rh.count) ? commas(rh.count) : say('none')), refPaid: refP(rh ? String(rh.paid) : say('noneRunOut')) } });
    }
  }
  if (sf && isObj(sf.when) && isObj(sf.howLong) && isNum(sf.howMuch) && sf.howMuch < 1) {
    const tenths = tenthsOf(sf.howMuch);
    if (!rs) lines.push(tenths >= 1 ? { id: 'lines.howMuch', slots: { tenths: String(tenths) } } : { id: 'lines.howMuchLess', slots: {} });
    else {
      const rt = isObj(rs.howLong) && isNum(rs.howMuch) ? tenthsOf(rs.howMuch) : null;
      const refTenths = refP(rt == null ? say('noneRunOut') : rt >= 1 ? say('tenths', { tenths: String(rt) }) : say('lessThanOne'));
      lines.push(tenths >= 1 ? { id: 'lines.howMuchRef', slots: { tenths: String(tenths), refTenths } } : { id: 'lines.howMuchLessRef', slots: { refTenths } });
    }
  }
  const c = isObj(a.cuts) ? a.cuts : null;
  if (r.ran && r.ran.cutsOn && c && c.futures > 0) {
    const rc = refA && isObj(refA.cuts) ? refA.cuts : null;
    const refN = rc ? (rc.cutN > 0 ? { id: 'ref.cutsSome', slots: { n: commas(rc.cutN) } } : { id: 'ref.cutsNone' }) : null;
    const ref = refN ? { id: refId === 'asHeld' ? 'ref.cutsAsHeld' : 'ref.cutsAsPlanned', slots: { n: refN } } : { id: 'ref.cutsAsPlanned', slots: { n: { id: 'ref.cutsNone' } } };
    const some = { n: commas(c.cutN), of: commas(c.futures), perYear: poundsOf(c.typicalCutPerYear), years: commas(c.typicalCutYears), s: Math.round(c.typicalCutYears) === 1 ? '' : 's' };
    if (!r.ref) lines.push(c.cutN > 0 ? { id: 'lines.cutsOwn', slots: some } : { id: 'lines.cutsNoneOwn', slots: { of: commas(c.futures) } });
    else lines.push(c.cutN > 0 ? { id: 'lines.cuts', slots: { ...some, ref } } : { id: 'lines.cutsNone', slots: { of: commas(c.futures), ref } });
  }
  // what still comes in: said above the rows from As planned; a row whose own says something else says it here
  if (a.words && a.words.floor && !sameFloor(floorOfRow(a), ctx.floor)) lines.push({ id: 'lines.plain', slots: { words: a.words.floor } });
  if (a.words && a.words.left) lines.push({ id: 'lines.plain', slots: { words: a.words.left } });
  if (id === 'asPlanned' && isNum(a.badCaseLeft) && toAge) lines.push({ id: 'lines.badLeft', slots: { age: toAge, left: poundsK(a.badCaseLeft) } });
  if (r.canAccept) {
    const fixedClause = lowerFirst(noStop(fixed));
    out.confirm = { id: 'agreement.confirm', figures: weighted ? { weighted: lowerFirst(noStop(a.words.headline)), fixed: fixedClause.replace('the money lasts that long', 'it lasts that long') } : { weighted: null, fixed: fixedClause } };
  }
  return out;
}

/** An accepted entry in words: the date and the figures it was accepted on (the weighted one with the fixed-age count beside it). */
function acceptedParts(entry) {
  const res = isObj(entry && entry.result) ? entry.result : {};
  const date = dayWords(entry && entry.at);
  const age = isNum(res.planToAge) ? String(res.planToAge) : '';
  const fixed = twentiethsOfFutures(isNum(res.fixedAge) ? res.fixedAge : 0);
  if (isNum(res.chance)) {
    return { id: 'agreement.accepted', mark: 'weighted', slots: { date, chance: chanceWords(res.chance) }, fixed: { id: 'agreement.acceptedFixed', mark: 'fixed', slots: { age, fixed } } };
  }
  return { id: 'agreement.acceptedOnly', slots: { date, age, fixed }, fixed: null };
}

/** One sentence of STRESS filled: `id` a dotted key, `slots` its figures; a slot may itself be a part { id, slots }. Both apps. */
export function sayStress(part, W) {
  if (!part) return '';
  const t = String(part.id || '').split('.').reduce((o, k) => (o && typeof o === 'object' ? o[k] : undefined), W);
  return String(typeof t === 'string' ? t : '').replace(/\{(\w+)\}/g, (m, k) => { const v = part.slots ? part.slots[k] : undefined; return v == null ? m : typeof v === 'object' ? sayStress(v, W) : String(v); });
}

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

/**
 * What an agreement's fingerprint takes from elsewhere in the plan: only what can change the settings the rows run on
 * (effectiveStressSettings). A locked plan's start is pinned by its lock and its document (withLockedStart, lockedPotsAsOf),
 * so its recorded months and whether it carries a plan on never move a row: a first month recorded after the lock, or the
 * earliest one deleted, leaves its agreements agreed (the build spec's §3: agreed until a new document). An unlocked draft
 * is read from an earlier start only while it has no month at all (PlanMove.laterDraftOf), so what counts is whether it
 * has months, not which is first.
 */
function fingerprintElsewhereOf(plan) {
  const e = elsewhereOf(plan);
  if (isLocked(plan)) return { budget: e.budget, decision: e.decision };
  const hist = plan && plan.decisionTool && Array.isArray(plan.decisionTool.history) ? plan.decisionTool.history : [];
  return { budget: e.budget, decision: e.decision, months: hist.length > 0, carried: e.carried };
}

/** The stored settings, less FINGERPRINT_SKIP, with what the reading takes from elsewhere (fingerprintElsewhereOf): a hash. */
export function settingsHashOf(plan) {
  const s = storedStressOf(plan);
  const kept = {};
  for (const k of Object.keys(s)) if (!FINGERPRINT_SKIP.includes(k)) kept[k] = s[k];
  return hashOf(canonical({ s: kept, elsewhere: fingerprintElsewhereOf(plan) }));
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
