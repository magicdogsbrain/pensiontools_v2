/**
 * The field registry of the parity gate (lead4.md section 2, G5): every editable thing that changes the saved plan, as
 * map-edits.md lists them (85 rows, #1–#86 without #9), with where it is in each view and how to reach it.
 *
 *   REGISTRY      [{ map, id, kind, fixture, group, value, simple, full, canon, why }]
 *     map         the row of map-edits.md
 *     id          a box: its id in the field table (src/reading/fields.js), the mark it carries in both views (data-field);
 *                 anything else: a name of its own
 *     kind        'box'     a box (or a choice) the round trips type into, in both directions where both views have it
 *                 'list'    rows of boxes (cards, lines, steps): not typed into yet — each direction counts as "not tried"
 *                 'action'  a press that does something to the plan (lock, record a month, rename …): R3 keeps these as
 *                           buttons, so they are not round-tripped as boxes (their figures are the sweep's)
 *     fixture     the parity plan (e2e/parity/fixtures/plans.js) whose subject allows the edit
 *     group       boxes typed together, then one save (default: the fixture and the simple step)
 *     value       what is typed: one text for both views, or { simple, full } where a view writes it its own way (a radio's
 *                 value, a tick 'yes'/'no', a multiplier); a function of the subject plan is allowed
 *     simple      { page }: the simple view's step page (`#/plan/<id>/<page>`); its Save button is `plan.<page>.save`
 *     full        { tab, sub, press, fold, save, set }: the full view's tab and sub-tab, a press that draws the box, a
 *                 fold opened as a person opens it, the Save button, and `set`: a press per value instead of typing (a box
 *                 the full view keeps hidden behind buttons)
 *     prep, then  { simple: [[id, value]], full: [...] }: boxes set in view A before / after the group's own (a stop month
 *                 before its start year; a stop age after "I will stop at an age"), not themselves checked
 *     canon       { simple(v), full(v) }: the box's value as one quantity, so both views' boxes compare (a tick that says
 *                 the opposite, a multiplier for a percentage); numbers compare as numbers (grouping commas and £ aside)
 *     why         for a box in one view only: where the other view stands
 *
 * Boxes in one view only are listed in e2e/parity/one-view-only.json under "fields" (a ratchet: may only shrink).
 */
import { FIELDS } from '../../src/reading/fields.js';

const TABLE = new Map(FIELDS.map((f) => [f.id, f]));
// the full view's Settings keep the tax-free part, a taxable account, the tax thresholds, the cuts and the reserve under
// "More detail", closed: a person opens it (`fold`) to reach those boxes
const STRESS = { tab: 'stress', sub: 'stresssettings', save: '#ssSaveBtn', fold: '#ssMoreDetail' };
const ACC = { tab: 'accumulation', save: 'button[data-on-click="saveAccumulationUI()"]' };
const WANT = { tab: 'accumulation', press: 'button[data-on-click="runOnTrackCheck()"]', save: '#acWantSave' };
const notYes = (v) => (v === 'yes' ? 'no' : v === 'no' ? 'yes' : v);
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const pad = (n) => String(n).padStart(2, '0');
/** A month as a person may write it ("June 2026", "2026-06") read as YYYY-MM; anything else as it is. */
const monthOf = (v) => {
  const t = String(v).trim().toLowerCase();
  let m = /^(\d{4})-(\d{1,2})$/.exec(t);
  if (m) return `${m[1]}-${pad(m[2])}`;
  m = /^([a-z]+) (\d{4})$/.exec(t);
  if (m && MONTHS.includes(m[1])) return `${m[2]}-${pad(MONTHS.indexOf(m[1]) + 1)}`;
  return String(v).trim();
};
/** A date as a person may write it ("1 May 2054", "2054-05-01") read as YYYY-MM-DD; anything else as it is. */
const dateOf = (v) => {
  const t = String(v).trim().toLowerCase();
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(t);
  if (m) return `${m[1]}-${pad(m[2])}-${pad(m[3])}`;
  m = /^(\d{1,2})(?:st|nd|rd|th)? ([a-z]+) (\d{4})$/.exec(t);
  if (m && MONTHS.includes(m[2])) return `${m[3]}-${pad(MONTHS.indexOf(m[2]) + 1)}-${pad(m[1])}`;
  return String(v).trim();
};
/** The simple view's start choice as the tax year it names (the full view's list holds the years): 'y2025' is 2025, 'now'
 * this tax year (the gate's clock: 2026/27); 'stop' and 'saved' name no year of their own and stay as they are. */
const startYearOf = (v) => (/^y\d{4}$/.test(v) ? v.slice(1) : v === 'now' ? '2026' : v);

const box = (map, id, fixture, value, simple, full, more = {}) => ({ map, id, kind: 'box', fixture, value, simple: simple ? { page: simple } : null, full, ...more });
const list = (map, id, fixture, simple, full, more = {}) => ({ map, id, kind: 'list', fixture, simple: simple ? { page: simple } : null, full, ...more });
const action = (map, id, simple, full, more = {}) => ({ map, id, kind: 'action', simple: simple ? { page: simple } : null, full, ...more });

export const REGISTRY = Object.freeze([
  // 1a About you and when (a saver's draft: stops at an age)
  box(1, 'about.age', 'saver-draft', '42', 'about', STRESS),
  box(2, 'about.stopped', 'retired-draft', { simple: 'age', full: 'future' }, 'about', STRESS, { group: 'about-stopped', then: { simple: [['about.stopAge', '68']], full: [['about.stopAge', '68']] }, canon: { full: (v) => (v === 'retired' ? 'yes' : v === 'future' ? 'age' : v) } }),
  box(3, 'about.stopAge', 'saver-draft', '61', 'about', STRESS, { group: 'about-stop' }),
  box(4, 'about.stopMonth', 'retired-everything', '2026-06', 'about', STRESS, { canon: { simple: monthOf, full: monthOf } }),
  // the start year between a stop two years ago and this one (the stop moved first, in the same view)
  box(5, 'about.startWhen', 'retired-everything', { simple: 'y2025', full: '2025' }, 'about', STRESS, { group: 'about-start', prep: { simple: [['about.stopMonth', '2024-06']], full: [['about.stopMonth', '2024-06']] }, canon: { simple: startYearOf } }),
  // the simple view asks an age, the full view the years from the plan's start (two quantities for one stored figure)
  box(6, 'about.endAge', 'saver-draft', { simple: '97', full: '36' }, 'about', STRESS, { group: 'about-end' }),
  action(7, 'about.suggestEnd', 'about', STRESS, { why: 'fills the end age box; nothing of its own is saved in either view' }),
  action(8, 'about.staleDraft', 'about', STRESS, { why: '"Leave it" / "Update the plan": a press on an out-of-date draft' }),
  // 1b Pots and tax
  box(10, 'pots.pension', 'saver-draft', '61000', 'pots', STRESS),
  box(11, 'pots.boughtSipp', 'saver-ladder-draft', '400000', null, STRESS, { why: 'the simple view has no box for the pots a bought way is priced on (map-edits #11)' }),
  box(11, 'pots.boughtIsa', 'saver-ladder-draft', '20000', null, STRESS, { why: 'the simple view has no box for the pots a bought way is priced on (map-edits #11)' }),
  box(12, 'pots.isa', 'saver-draft', '12000', 'pots', STRESS),
  box(13, 'pots.isaGrowth', 'saver-draft', 'invested', 'pots', STRESS),
  box(14, 'pots.isaUse', 'saver-draft', 'maximiseLongevity', 'pots', STRESS),
  box(15, 'pots.taxable', 'saver-draft', '5000', 'pots', STRESS),
  box(16, 'pots.taxableMix', 'retired-everything', 'equity', 'pots', STRESS),
  box(17, 'pots.giaBand', 'retired-everything', 'basic', 'pots', STRESS),
  box(18, 'pots.earnings', 'saver-draft', '30000', 'pots', STRESS),
  box(19, 'pots.bedAndIsa', 'retired-everything', 'no', 'pots', STRESS),
  box(20, 'pots.charges', 'saver-draft', '0.75', 'pots', STRESS),
  box(21, 'pots.pa', 'saver-draft', '12600', 'pots', STRESS, { group: 'pots-tax' }),
  box(21, 'pots.brl', 'saver-draft', '50300', 'pots', STRESS, { group: 'pots-tax' }),
  box(21, 'pots.hrl', 'saver-draft', '125200', 'pots', STRESS, { group: 'pots-tax' }),
  box(22, 'pots.taxMode', 'saver-draft', 'frozen', 'pots', STRESS, { group: 'pots-tax' }),
  box(23, 'pots.taxFree', 'saver-draft', 'drawdown', 'pots', { ...STRESS, set: { drawdown: '#stress-stresssettings [data-access="drawdown"]', ufpls: '#stress-stresssettings [data-access="ufpls"]' } }, { group: 'pots-taxfree' }),
  box(24, 'pots.ufplsYears', 'saver-draft', '8', 'pots', STRESS, { group: 'pots-ufpls' }),
  box(25, 'pots.ufplsThenIsa', 'saver-draft', 'yes', 'pots', STRESS, { group: 'pots-ufpls' }),
  box(26, 'pots.bandFill', 'saver-draft', 'yes', 'pots', STRESS, { group: 'pots-taxfree' }),
  box(27, 'pots.stopSipp', 'saver-draft', '300000', 'pots', STRESS, { group: 'pots-stop' }),
  box(27, 'pots.stopIsa', 'saver-draft', '40000', 'pots', STRESS, { group: 'pots-stop' }),
  // 1c Money that comes in anyway
  box(28, 'income.spWeekly', 'saver-draft', '230', 'income', STRESS, { prep: { simple: [['income.spKind', 'forecast']] } }),
  box(28, 'income.spKind', 'saver-draft', 'none', 'income', null, { why: 'the full view has no "full", "forecast" or "none" choice for the State Pension, only the weekly box (map-edits #28)' }),
  box(29, 'income.spDate', 'saver-draft', '1 May 2054', 'income', STRESS, { canon: { simple: dateOf, full: dateOf } }),
  box(30, 'income.other', 'saver-draft', '1500', 'income', STRESS),
  box(31, 'income.fs.0.amount', 'retired-everything', '9800', 'income', STRESS, { group: 'income-fs' }),
  box(31, 'income.fs.0.fromAge', 'retired-everything', '66', 'income', STRESS, { group: 'income-fs' }),
  box(31, 'income.fs.0.rises', 'retired-everything', 'cpi', 'income', STRESS, { group: 'income-fs' }),
  list(32, 'income.streams', 'retired-everything', 'income', STRESS, { why: 'more final-salary pensions and incomes for some years: cards in the simple view, an editor of rows in the full view' }),
  list(33, 'income.lumps', 'retired-everything', 'income', STRESS, { why: 'lump sums: cards in the simple view, rows in the full view' }),
  // 1d What you spend: the simple view's first figure a month after tax, the full view's first step a year before tax
  box(34, 'spend.first', 'saver-draft', { simple: '1900', full: '30000' }, 'spend', STRESS),
  list(35, 'spend.steps', 'retired-everything', 'spend', STRESS, { why: 'later steps: cards in the simple view, rows in the full view' }),
  list(36, 'spend.costs', 'retired-everything', 'spend', STRESS, { why: 'one-off costs: cards in the simple view, rows in the full view' }),
  action(37, 'spend.shape', null, STRESS, { why: 'level income or steps: a hidden pair of buttons in the full view, none in the simple view (it follows the steps)' }),
  // 1e Does it last? (cuts off in the saver's draft: turned on here)
  box(38, 'lasts.cutsOn', 'saver-draft', { simple: 'yes', full: 'no' }, 'lasts', STRESS, { group: 'lasts-cuts', canon: { full: notYes } }),
  box(39, 'lasts.cutAfterMonths', 'saver-draft', '4', 'lasts', STRESS, { group: 'lasts-cuts' }),
  box(40, 'lasts.cutPct', 'saver-draft', { simple: '25', full: '0.75' }, 'lasts', STRESS, { group: 'lasts-cuts', canon: { full: (v) => (v === '' || !Number.isFinite(+v) ? v : String(Math.round((1 - +v) * 100))) } }),
  box(41, 'lasts.deeperAfterMonths', 'saver-draft', '18', 'lasts', STRESS, { group: 'lasts-cuts' }),
  box(42, 'lasts.buffer', 'saver-draft', '20000', 'lasts', STRESS, { group: 'lasts-cuts' }),
  box(43, 'lasts.reserveOn', 'saver-draft', 'yes', 'lasts', STRESS, { group: 'lasts-reserve' }),
  box(44, 'lasts.reserveAmount', 'saver-draft', '30000', 'lasts', STRESS, { group: 'lasts-reserve' }),
  // 1f Way of drawing
  action(45, 'way.pick', 'way', { tab: 'strategies' }, { why: 'a way is chosen by a press in both views ("Use this way of drawing" / a pick button)' }),
  list(46, 'way.dials', 'saver-ladder-draft', 'way', STRESS, { why: 'the way\'s dials: cards drawn per way in the simple view, boxes per way on Settings and the Strategies pages' }),
  // 1g The mix
  action(47, 'mix.held', 'mix', STRESS, { why: 'how the pension is held: a choice in the simple view, two buttons in the full view (no "your own split")' }),
  action(48, 'mix.level', 'mix', STRESS, { why: 'the risk level: a choice in the simple view, cards pressed in the full view' }),
  box(49, 'mix.shares', 'saver-draft', '60', 'mix', null, { group: 'mix-split', why: 'your own split: the simple view only (map-edits #49)' }),
  box(49, 'mix.bonds', 'saver-draft', '30', 'mix', null, { group: 'mix-split', why: 'your own split: the simple view only' }),
  box(49, 'mix.diversifiers', 'saver-draft', '0', 'mix', null, { group: 'mix-split', why: 'your own split: the simple view only' }),
  box(49, 'mix.cash', 'saver-draft', '10', 'mix', null, { group: 'mix-split', why: 'your own split: the simple view only' }),
  box(50, 'mix.sleeve', 'saver-draft', 'yes', 'mix', STRESS),
  box(51, 'mix.tent', 'saver-draft', 'yes', 'mix', STRESS),
  action(52, 'mix.endgame', 'mix', STRESS, { why: 'the tent\'s endgame: a choice in the simple view, a picker of buttons in the full view' }),
  list(53, 'mix.funds', 'saver-draft', 'mix', STRESS, { why: 'funds to test: cards in the simple view, rows in the full view' }),
  action(54, 'mix.useThisMix', 'mix', null, { why: '"Use this mix" in the comparison: the simple view only' }),
  // 1h What you hold, moving, risks accepted
  list(55, 'hold.lines', 'mover-holdings', 'hold', { tab: 'transition' }, { why: 'holdings lines: rows in both views' }),
  action(56, 'move.tick', 'move', { tab: 'transition' }),
  action(57, 'plan.acceptRisk', 'lasts', { tab: 'stress', sub: 'montecarlo' }),
  // 1i What you pay in (both views through the same builder)
  box(58, 'saving.netMonthly', 'saver-draft', '450', 'saving', ACC, { group: 'saving-pay' }),
  box(58, 'saving.employerMonthly', 'saver-draft', '100', 'saving', ACC, { group: 'saving-pay' }),
  box(58, 'saving.isaMonthly', 'saver-draft', '50', 'saving', ACC, { group: 'saving-pay' }),
  box(58, 'saving.escalationPct', 'saver-draft', '3', 'saving', ACC, { group: 'saving-pay' }),
  box(58, 'saving.schemeType', 'couple', 'netpay', 'saving', ACC, { group: 'saving-scheme' }),
  box(58, 'saving.salary', 'couple', '43000', 'saving', ACC, { group: 'saving-salary' }),
  box(58, 'saving.potNow', 'saver-draft', '62000', 'saving', ACC, { group: 'saving-pot' }),
  box(59, 'saving.want.monthly', 'saver-draft', '2100', 'saving', WANT, { group: 'saving-want' }),
  box(59, 'saving.want.stopAge', 'saver-draft', '62', 'saving', WANT, { group: 'saving-want' }),
  action(60, 'saving.record', 'saving', { tab: 'accumulation' }, { why: 'a pot record: a press in both views (the full view can also delete one)' }),
  // 1j Check-in, review, phases, cadence
  list(61, 'checkin.boxes', 'saver-checkin', 'checkin', null, { why: 'the check-in: the simple view only (map-edits #61)' }),
  box(62, 'checkin.every', 'saver-checkin', '6', 'checkin', null, { why: 'how often to check in: the simple view only (map-edits #62)' }),
  list(63, 'review.boxes', 'retired-locked-pots', 'review', null, { why: 'the review: the simple view only (map-edits #63)' }),
  list(64, 'review.phases', 'retired-locked-pots', 'review', null, { why: 'phase choices: the simple view only (map-edits #64)' }),
  action(65, 'plan.agree', 'review', { tab: 'transition' }),
  box(66, 'decision.cadence', 'retired-locked-pots', 'quarterly', null, { tab: 'decision', sub: 'entry' }, { why: 'how often you draw: the full view only (map-edits #66)' }),
  action(67, 'month.recordMonths', 'month', null, { why: '"Keep a record of each month here": the simple view only' }),
  action(68, 'plan.task', '', { tab: 'decision' }),
  // 1k Household
  action(69, 'household.partner', 'household', { tab: 'household' }, { why: 'the partner link: a press in the simple view, a choice in the full view' }),
  action(70, 'household.split', 'household', { tab: 'household' }),
  action(71, 'household.keep', 'household', { tab: 'household' }),
  action(72, 'household.shareBudget', 'household', { tab: 'household' }),
  list(73, 'household.whoPays', 'couple', 'household', { tab: 'budget' }, { why: 'who pays: per budget line in both views' }),
  action(74, 'household.checks', 'household', { tab: 'household' }, { why: 'the need, the limit, the survivor and care: not saved in the simple view' }),
  // 1l Budget
  list(75, 'budget.lines', 'budget', 'budget', { tab: 'budget' }, { why: 'budget lines: rows in both views' }),
  box(76, 'budget.currentAge', 'budget', '67', null, { tab: 'budget' }, { group: 'budget-ages', why: 'the budget\'s ages: the full view only, the simple view takes them from About you (map-edits #76)' }),
  box(76, 'budget.retireAge', 'budget', '60', null, { tab: 'budget' }, { group: 'budget-ages', why: 'the budget\'s ages: the full view only' }),
  box(76, 'budget.endAge', 'budget', '96', null, { tab: 'budget' }, { group: 'budget-ages', why: 'the budget\'s ages: the full view only' }),
  // 1m Plans, lock, months, tax years
  action(77, 'plan.name', 'plans', { tab: null }, { why: 'the plan\'s name: a box after "Rename" in the simple view, a prompt in the full view' }),
  action(78, 'plan.main', 'plans', { tab: null }),
  action(79, 'plan.lock', 'lock', STRESS),
  action(80, 'plan.unlock', 'plan', STRESS),
  action(81, 'plan.newDocument', 'plan', { tab: 'decision', sub: 'plandoc' }),
  action(82, 'month.entry', 'month', { tab: 'decision', sub: 'entry' }),
  action(83, 'month.fill', 'month', { tab: 'decision', sub: 'entry' }),
  action(84, 'month.taxYear', 'month', { tab: 'decision', sub: 'taxyears' }),
  action(85, 'plan.close', 'plans', { tab: null }),
  action(86, 'lasts.tryUse', 'lasts', null, { why: 'Try a change → "Use this": the simple view only (the full view\'s what-ifs save nothing)' })
].map((e) => Object.freeze({ ...e, group: e.group || (e.kind === 'box' ? `${e.fixture}:${e.simple ? e.simple.page : e.full && e.full.tab}` : null) })));

/** A field's entry by id. */
export const entryOf = (id) => REGISTRY.find((e) => e.id === id) || null;

/** The boxes of the field table (src/reading/fields.js) whose registry entry is a box: each must have one. */
export const BOXES = REGISTRY.filter((e) => e.kind === 'box');

/** Boxes in one view only (one-view-only.json "fields"). */
export const ONE_VIEW_BOXES = BOXES.filter((e) => !e.simple || !e.full).map((e) => e.id).sort();

/** The directions a box is round-tripped in: 's2f' typed in the simple view, read in the full; 'f2s' the other way. */
export const DIRECTIONS = Object.freeze(['s2f', 'f2s']);

/** What is typed in a view (a text, or a function of the subject plan). */
export function valueIn(e, view, plan = null) {
  const v = typeof e.value === 'function' ? e.value(plan) : e.value;
  return v && typeof v === 'object' ? String(v[view]) : String(v);
}

/** A number written as a person may group it ("61,000", "£61,000", "0.50") read as the number; anything else as it is. */
const asNumber = (t) => {
  const s = String(t ?? '').replace(/[£,\s]/g, '');
  return s !== '' && /^-?\d+(?:\.\d+)?$/.test(s) ? String(Number(s)) : String(t ?? '').trim();
};

/** A box's value in a view as one quantity both views compare: the view's own reading of it, then numbers as numbers. */
export function canonOf(id, view, value) {
  const e = entryOf(id);
  const f = e && e.canon && e.canon[view];
  return asNumber(f ? f(String(value ?? '').trim()) : String(value ?? '').trim());
}

/** Whether the field table and the registry agree: every box of the table has a box entry, and the views match. */
export function registryProblems() {
  const out = [];
  for (const f of FIELDS) {
    const e = entryOf(f.id);
    if (!e) { out.push(`${f.id}: in src/reading/fields.js, not in the registry`); continue; }
    if (e.kind !== 'box') out.push(`${f.id}: a box in the field table, a ${e.kind} in the registry`);
    if (!!f.simple !== !!e.simple) out.push(`${f.id}: the simple view ${f.simple ? 'has' : 'has no'} box in the table`);
    if (!!f.full !== !!e.full) out.push(`${f.id}: the full view ${f.full ? 'has' : 'has no'} box in the table`);
    if (f.simple && e.simple && f.simple.step !== e.simple.page) out.push(`${f.id}: the simple page differs (${f.simple.step} / ${e.simple.page})`);
  }
  for (const e of BOXES) if (!TABLE.has(e.id)) out.push(`${e.id}: a box in the registry, not in src/reading/fields.js`);
  return out;
}
