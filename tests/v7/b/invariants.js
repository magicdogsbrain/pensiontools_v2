/**
 * checkAnswerB(answer, given?) — the rules that must hold on ANY answer to question B (step 4 brief 6, P3: the
 * test plan's I-B1–I-B10 and B1–B8, renamed to the brief's AnswerB, 4.8). Returns a list of plain-English failures;
 * the caller asserts it is empty. Called from the pairs, the random cases, the five fixtures and the closed forms.
 *
 * `given` is the inputs as they were passed in (before defaults), for the "every default is listed" rule.
 *
 * With `env.trace` the answer carries `trace.lives` — each life's household pension at the stop with nothing paid in
 * (`zero`), what £1 a month more adds to it (`perPound`), the pension and savings at today's pay-in, and the month the
 * whole life ran out at the target. From those alone this file works out again, by its own arithmetic: the count of
 * lives that lasted (the one test, step 4 brief section 10, J9) and the three pots at the stop. The pay-in that gets there
 * is worked out again by asking B again (tests/v7/b/solve.test.js) and by A (tests/v7/cross/oneTest.test.js).
 *
 * Every B test imports { answerB } from here; it comes from the adapter, _b.js.
 */
export { answerB, SCHEMA_B, TEST_ENV } from './_b.js';
import { get, money, pot as potText, partsText, outOfTen } from '../../../src/answers/shared/format.js';
import { flatten } from '../../../src/answers/shared/validate.js';
import { RULES, SAVING } from '../../../src/answers/shared/rules.js';
import { gridToShow, spendLevelAMonth } from '../../../src/answers/shared/schemaParts.js';
import { bannedHits } from '../render/checkScreen.js';

const UNITS = { money: 'todays-prices', tax: 'after-tax', period: 'month', who: 'household' };
const THREE = ['careful', 'middling', 'good'];
const STATUSES = ['ok', 'guaranteed-only', 'out-of-reach', 'none'];
const LEVERS = ['stopLater', 'payMore', 'spendLess', 'moreRisk', 'accept'];
const RISKS = ['cautious', 'balanced', 'adventurous'];
const KEYS = ['inputs', 'whose', 'spend', 'stop', 'ages', 'years', 'pensionOpens', 'gapYears', 'saving', 'number', 'already', 'chance', 'onCourse',
  'payIn', 'potAtStop', 'short', 'monthlyIfShort', 'wholeLife', 'outside', 'levers', 'grid', 'phases', 'guaranteed', 'assumed', 'warnings',
  'sentences', 'basis', 'units'];
/** No length of time to wait, anywhere in A or B (brief conflict 47's `countdown-any`). */
export const COUNTDOWN = /\b\d+ (more )?(years?|months?) (to go|until|till|before|from now)\b/i;
const SCOPES = ['all', 'first', 'planner', 'result'];

/** The positions in a sorted spread of n figures (band.js bandIndexes, written again here). */
export const positions = (n) => ({ careful: Math.floor(n / 10), middling: Math.floor(n / 2), good: n - Math.ceil(n / 10) });
/** How many lives may miss at each confidence. */
export const allowedAt = (n) => ({ nineInTen: Math.floor(n / 10), threeInFour: Math.floor(n / 4) });

/** True when anything in the value is undefined, a function, a Date, NaN or infinite. */
export function unsaveable(v, path = '', out = []) {
  if (v === undefined || typeof v === 'function' || v instanceof Date) { out.push(path || '(root)'); return out; }
  if (typeof v === 'number' && !Number.isFinite(v)) { out.push(path || '(root)'); return out; }
  if (v && typeof v === 'object') for (const k of Object.keys(v)) unsaveable(v[k], path ? `${path}.${k}` : k, out);
  return out;
}

/** Every sentence of an answer, flat: the sentences (lists and the levers' object opened), what was assumed, the warnings. */
export function sentencesOf(answer) {
  const flat = (s) => (Array.isArray(s) ? s.flatMap(flat) : s && s.parts ? [s] : s && typeof s === 'object' ? Object.values(s).flatMap(flat) : []);
  return [...flat(answer.sentences || {}), ...(answer.assumed || []), ...(answer.warnings || [])];
}

/** The people of a checked input: [{ who, age, pot, payIn: { total, own, employer }, alreadyDrawing }]. */
export function peopleOf(inputs) {
  const whos = inputs.household === 'couple' && inputs.partner ? ['you', 'partner'] : ['you'];
  return whos.map((who) => {
    const p = inputs[who];
    const pi = p.payIn || { kind: 'total', total: 0 };
    const total = pi.kind === 'split' ? (pi.own || 0) + (pi.employer || 0) : (pi.total || 0);
    return { who, age: p.age, pot: p.pot || 0, payIn: { total, own: pi.kind === 'split' ? pi.own : null, employer: pi.kind === 'split' ? pi.employer : null }, alreadyDrawing: Boolean(p.alreadyDrawing), statePension: p.statePension, finalSalary: p.finalSalary };
  });
}

/** What lands in the pensions each month in all is at most the £10,000 the household takes (a split can add to more). */
export const withinCeiling = (inputs) => peopleOf(inputs).every((p) => p.payIn.total <= SAVING.payInCeiling);

/** The spend a month the inputs ask for: the amount, or the level's figure (RULES.plsa ÷ 12 to the pound). */
export function spendOf(inputs) {
  return inputs.spend.kind === 'level' ? spendLevelAMonth(inputs.household, inputs.spend.level) : inputs.spend.amount;
}

/** The least whole £10 that reaches `target` in at least `need` lives, from the trace's per-life lines alone; null above the ceiling. */
export function payInFromTrace(lives, target, need, ceiling = SAVING.payInCeiling) {
  const cs = lives.map((l) => (l.zero >= target ? 0 : l.perPound > 0 ? (target - l.zero) / l.perPound : Infinity)).sort((a, b) => a - b);
  const c = cs[need - 1];
  if (!(need > 0)) return 0;
  if (!Number.isFinite(c)) return null;
  let p = Math.max(0, Math.ceil(c / 10 - 1e-9) * 10);
  // the float can land a hair either side: settle on the least £10 that really reaches
  const reach = (x) => lives.filter((l) => l.zero + x * l.perPound >= target).length;
  while (p > 0 && reach(p - 10) >= need) p -= 10;
  while (reach(p) < need && p <= ceiling) p += 10;
  return p > ceiling ? null : p;
}

export function checkAnswerB(answer, given) {
  const f = [];
  const fail = (rule, msg) => { f.push(`${rule}: ${msg}`); };
  if (!answer || typeof answer !== 'object') return ['B1: not an object'];
  if (answer.status === 'invalid') {
    if (!Array.isArray(answer.problems) || !answer.problems.length) fail('B1', 'invalid without problems');
    if (Object.keys(answer).length !== 2) fail('B1', 'an invalid answer carries nothing but status and problems');
    return f;
  }
  if (!STATUSES.includes(answer.status)) fail('B1', `unknown status ${answer.status}`);
  for (const k of KEYS) if (!(k in answer)) fail('B1', `no ${k}`);
  if (f.length) return f;

  // B1 shape: nothing missing, not-a-number, infinite, a function or a Date; nothing negative, no negative zero
  const bad = unsaveable(answer);
  if (bad.length) fail('B1', `unsaveable at ${bad.slice(0, 5).join(', ')}`);
  const walk = (v, path) => {
    if (typeof v === 'number') {
      if (Object.is(v, -0)) fail('B1', `${path} is -0`);
      if (v < 0 && !/growth/.test(path)) fail('B1', `${path} is negative (${v})`);
    } else if (v && typeof v === 'object') for (const k of Object.keys(v)) walk(v[k], `${path}.${k}`);
  };
  walk(answer, '');
  if (JSON.stringify(answer.units) !== JSON.stringify(UNITS)) fail('B1', `units ${JSON.stringify(answer.units)}`);

  const inputs = answer.inputs;
  const b = answer.basis;
  const n = b.futures;
  const people = peopleOf(inputs);
  const S = inputs.stop.age - inputs.you.age;
  const allowed = allowedAt(n);

  // B2 the basis and the plain facts of the question
  if (b.failuresAllowed !== Math.floor(n / 10)) fail('B2', 'failuresAllowed ≠ floor(n / 10)');
  if (b.closeAllowed !== Math.floor(n / 4)) fail('B2', 'closeAllowed ≠ floor(n / 4)');
  for (const [k, v] of Object.entries({ bondDraws: 'life', cashRule: 'previous-year', grid: 'yearly', strategyId: 'pots-and-valves', cutsSwitchedOff: true,
    potStep: SAVING.potStep, potMax: SAVING.potMax, payInCeiling: SAVING.payInCeiling * people.length, laterYears: SAVING.laterYears })) {
    if (b[k] !== v) fail('B2', `basis.${k} = ${b[k]}, not ${v}`);
  }
  if (!['answer', 'grid'].includes(b.detail)) fail('B2', `basis.detail ${b.detail}`);
  if (!(S >= 1)) fail('B2', `a stop ${S} years on`);
  if (answer.stop.age !== inputs.stop.age) fail('B2', 'stop.age is not the age asked about');
  if (answer.stop.year !== String(Number(b.today.slice(0, 4)) + S)) fail('B2', `stop.year ${answer.stop.year}`);
  if (answer.years.saving !== S) fail('B2', `years.saving ${answer.years.saving} ≠ ${S}`);
  const youngerAtStop = Math.min(...people.map((p) => p.age)) + S;
  const D = Math.min(RULES.maxYears, inputs.endAge - youngerAtStop);
  if (answer.years.drawing !== D) fail('B2', `years.drawing ${answer.years.drawing} ≠ ${D}`);
  if (b.endAge !== youngerAtStop + D) fail('B2', `basis.endAge ${b.endAge} ≠ ${youngerAtStop + D}`);
  if (b.lifeYears !== S + D) fail('B2', `basis.lifeYears ${b.lifeYears} ≠ ${S + D}`);
  for (const p of people) if (answer.ages[p.who] !== p.age + S) fail('B2', `ages.${p.who} ${answer.ages[p.who]} ≠ ${p.age + S}`);
  if (inputs.household !== 'couple' && answer.whose !== 'you') fail('B2', 'single but whose is not you');
  const spend = spendOf(inputs);
  if (answer.spend.perMonth !== spend) fail('B2', `spend.perMonth ${answer.spend.perMonth} ≠ ${spend}`);
  if (answer.spend.perYear !== spend * 12) fail('B2', 'spend.perYear ≠ 12 × perMonth');
  if (answer.spend.kind !== inputs.spend.kind) fail('B2', 'spend.kind');
  if (answer.spend.level !== (inputs.spend.kind === 'level' ? inputs.spend.level : null)) fail('B2', 'spend.level');
  if (!Number.isInteger(answer.gapYears) || answer.gapYears < 0) fail('B2', `gapYears ${answer.gapYears}`);
  for (const p of people) {
    const open = answer.pensionOpens[p.who];
    if (!(open === 55 || open === 57 || (Number.isInteger(open) && open === p.age && p.age >= 55))) fail('B2', `pensionOpens.${p.who} = ${open}`);
  }

  // B3 the number: whole £1,000, careful ≥ middling ≥ good; nought when the pensions cover the spend; none when out of reach
  const num = answer.number;
  if (num === null) {
    if (answer.status !== 'out-of-reach') fail('B3', 'no number, but the status is not out-of-reach');
  } else {
    for (const k of THREE) if (!Number.isInteger(num[k] / 1000) || num[k] < 0 || num[k] > SAVING.potMax) fail('B3', `number.${k} = ${num[k]}`);
    if (!(num.careful >= num.middling && num.middling >= num.good)) fail('B3', `number out of order ${JSON.stringify(num)}`);
    if (answer.status === 'guaranteed-only' && (num.careful !== 0 || num.good !== 0)) fail('B3', 'guaranteed-only but a number above nought');
    if (answer.status === 'ok' && num.careful === 0 && !(inputs.savings > 0 || inputs.savingsIn > 0) && !answer.outside) fail('B3', 'status ok with a number of nought, and no savings to pay instead');
    if (!Array.isArray(num.byPerson) || num.byPerson.length !== people.length) fail('B3', 'number.byPerson is not one per person');
    else if (num.byPerson.reduce((s, x) => s + x.pot, 0) !== num.careful) fail('B3', 'number.byPerson does not add up to number.careful');
    const today = people.reduce((s, p) => s + p.pot, 0);
    if (answer.already !== (today >= num.careful)) fail('B3', `already ${answer.already} but today's pension is ${today} against ${num.careful}`);
  }

  // B4 the chance is the one test (J9): the lives in which the money lasted to the end age, paying in as now and then
  // spending the target — the whole-life count, A's verdict at the stop age
  const ch = answer.chance;
  if (!Number.isInteger(ch.fails) || ch.fails < 0 || ch.fails > n) fail('B4', `chance.fails ${ch.fails}`);
  if (Math.abs(ch.lasted - (n - ch.fails) / n) > 1e-12) fail('B4', 'chance.lasted ≠ (n − fails) / n');
  if (JSON.stringify(ch.outOfTen) !== JSON.stringify(outOfTen(ch.lasted))) fail('B4', 'chance.outOfTen is not outOfTen(lasted)');
  if (answer.onCourse !== (ch.fails <= allowed.nineInTen)) fail('B4', `onCourse ${answer.onCourse} with ${ch.fails} of ${n} short`);
  if (ch.lasted !== answer.wholeLife.lasted) fail('B4', `chance.lasted ${ch.lasted} is not the whole life's ${answer.wholeLife.lasted}: one test`);

  // B5 the pay-ins: whole £10, what is needed at the chosen confidence, 9 in 10 never less than 3 in 4, on course ⟺ enough now
  const pi = answer.payIn;
  const nowTotal = people.reduce((s, p) => s + p.payIn.total, 0);
  if (pi.now !== nowTotal) fail('B5', `payIn.now ${pi.now} ≠ ${nowTotal}`);
  if (pi.own !== null && pi.own + pi.employer !== pi.now) fail('B5', 'own + employer ≠ now');
  if (pi.confidence !== inputs.confidence) fail('B5', 'payIn.confidence is not the one asked for');
  for (const k of ['nineInTen', 'threeInFour']) {
    const v = pi.at[k];
    if (v !== null && (!Number.isInteger(v / 10) || v < 0 || v > b.payInCeiling)) fail('B5', `payIn.at.${k} = ${v}`);
  }
  if (pi.at.nineInTen !== null && pi.at.threeInFour === null) fail('B5', '9 in 10 reached but 3 in 4 not');
  if (pi.at.nineInTen !== null && pi.at.nineInTen < pi.at.threeInFour) fail('B5', `9 in 10 (${pi.at.nineInTen}) below 3 in 4 (${pi.at.threeInFour})`);
  if (pi.needed !== pi.at[pi.confidence]) fail('B5', 'payIn.needed ≠ payIn.at[confidence]');
  if (pi.extra !== (pi.needed === null ? 0 : Math.max(0, pi.needed - pi.now))) fail('B5', `payIn.extra ${pi.extra}`);
  const savingsShort = pi.outside !== null && pi.outside > (pi.savingsNow || 0);
  if (num !== null && answer.status !== 'guaranteed-only') {
    if (answer.onCourse && !(pi.at.nineInTen !== null && pi.at.nineInTen < pi.now + 10)) fail('B5', `on course at ${pi.now} but 9 in 10 needs ${pi.at.nineInTen}`);
    // not on course: more must go into the pension — or, before a pension opens, into savings
    if (!answer.onCourse && pi.at.nineInTen !== null && !(pi.at.nineInTen > pi.now) && !savingsShort) fail('B5', `not on course at ${pi.now} but 9 in 10 needs only ${pi.at.nineInTen}`);
  }
  if (answer.status === 'guaranteed-only' && (pi.needed !== 0 || !answer.onCourse)) fail('B5', 'guaranteed-only: nothing is needed and it is on course');
  if ((answer.status === 'out-of-reach') !== (num === null || pi.needed === null)) fail('B5', 'out-of-reach ⟺ no number or no pay-in that gets there');
  if (answer.outside === null && pi.outside !== null) fail('B5', 'payIn.outside without outside');
  if (pi.outside !== null && (!Number.isInteger(pi.outside / 10) || pi.outside > b.payInCeiling)) fail('B5', `payIn.outside ${pi.outside}`);

  // B6 the pots at the stop, today's prices, whole £, in order; short = number − the bad-case pot, never below 0
  const pa = answer.potAtStop;
  for (const [name, three] of [['now', pa.now], ['needed', pa.needed]]) {
    if (three === null) continue;
    for (const k of THREE) if (!Number.isInteger(three[k])) fail('B6', `potAtStop.${name}.${k} is not whole pounds`);
    if (!(three.careful <= three.middling && three.middling <= three.good)) fail('B6', `potAtStop.${name} out of order`);
  }
  if ((pa.needed === null) !== (pi.needed === null)) fail('B6', 'potAtStop.needed without a pay-in that gets there, or the other way');
  if (num !== null && answer.short !== Math.max(0, num.careful - pa.now.careful)) fail('B6', `short ${answer.short}`);
  if (num === null && answer.short !== null) fail('B6', 'short without a number');
  if (!Number.isInteger(answer.monthlyIfShort / 10)) fail('B6', `monthlyIfShort ${answer.monthlyIfShort} is not whole £10`);

  // B7 the whole life at today's pay-in: a count; the bad case lasted ⟺ the count is 9 in 10
  const wl = answer.wholeLife;
  if (!(wl.lasted >= 0 && wl.lasted <= 1)) fail('B7', `wholeLife.lasted ${wl.lasted}`);
  if (JSON.stringify(wl.outOfTen) !== JSON.stringify(outOfTen(wl.lasted))) fail('B7', 'wholeLife.outOfTen');
  if (!Number.isInteger(wl.runOutAge) || wl.runOutAge < youngerAtStop || wl.runOutAge > b.endAge) fail('B7', `wholeLife.runOutAge ${wl.runOutAge}`);   // the younger person's age, as the end age
  const wlFails = Math.round((1 - wl.lasted) * n);
  if ((wl.runOutAge === b.endAge) !== (wlFails <= allowed.nineInTen)) fail('B7', `bad case lasted = ${wl.runOutAge === b.endAge} with ${wlFails} of ${n} run out`);

  // B8 the levers: the fixed five in order, each null or its shape; honest about what it claims
  const lv = answer.levers;
  if (JSON.stringify(Object.keys(lv)) !== JSON.stringify(LEVERS)) fail('B8', `levers ${Object.keys(lv)}`);
  if (JSON.stringify(lv.accept) !== JSON.stringify({ lasted: ch.lasted, short: answer.short, monthlyIfShort: answer.monthlyIfShort })) fail('B8', 'levers.accept is not the answer as it stands');
  if (answer.onCourse) for (const k of ['stopLater', 'payMore', 'spendLess', 'moreRisk']) if (lv[k] !== null) fail('B8', `on course but levers.${k} is set`);
  if (inputs.savingRisk === 'adventurous' && lv.moreRisk !== null) fail('B8', 'moreRisk with the saving risk already adventurous');
  if (lv.moreRisk) {
    if (lv.moreRisk.level !== RISKS[RISKS.indexOf(inputs.savingRisk) + 1]) fail('B8', `moreRisk.level ${lv.moreRisk.level}`);
    const helps = lv.moreRisk.payIn !== null && (pi.needed === null || (pi.needed > pi.now && lv.moreRisk.payIn < pi.needed));
    if (lv.moreRisk.helps !== helps) fail('B8', 'moreRisk.helps is not the comparison it claims');
  }
  if (lv.payMore) {
    const m = lv.payMore;
    if (m.payIn !== Math.max(pi.needed, pi.now)) fail('B8', `payMore.payIn ${m.payIn} is not the pay-in that gets there (never less than now's)`);
    if (!(pi.needed > pi.now || (m.savingsIn !== null && m.savingsIn > (pi.savingsNow || 0)))) fail('B8', 'payMore changes nothing');
    if (m.savingsIn !== null && m.savingsIn !== pi.outside) fail('B8', `payMore.savingsIn ${m.savingsIn} is not payIn.outside ${pi.outside}`);
    if (m.lasted < 1 - allowed.nineInTen / n - 1e-12 && pi.confidence === 'nineInTen') fail('B8', `payMore lasted in only ${m.lasted}`);
  }
  if (lv.stopLater) {
    const s = lv.stopLater;
    if (!(s.age > inputs.stop.age && s.age <= RULES.stopAgeMax)) fail('B8', `stopLater.age ${s.age}`);
    if (s.lasted < 1 - allowed.nineInTen / n - 1e-12) fail('B8', `stopLater lasted in only ${s.lasted}`);
  }
  if (lv.spendLess) {
    const s = lv.spendLess;
    if (!Number.isInteger(s.spend / 10) || !(s.spend < spend)) fail('B8', `spendLess.spend ${s.spend}`);
    if (s.spend !== answer.monthlyIfShort) fail('B8', 'spendLess.spend is not monthlyIfShort (the careful amount paying in as now)');
    if (s.lasted < 1 - allowed.nineInTen / n - 1e-12) fail('B8', `spendLess lasted in only ${s.lasted}`);
  }

  // B9 the grid, only with detail 'grid': the rows and columns of gridToShow; more pay-in never reaches it in fewer lives
  if (b.detail !== 'grid' && answer.grid !== null) fail('B9', 'a grid without detail "grid"');
  if (b.detail === 'grid') {
    const g = answer.grid;
    const want = gridToShow(inputs, { today: b.today }, { stopLater: lv.stopLater ? lv.stopLater.age : null, needed: pi.needed });
    if (!g) fail('B9', 'detail "grid" but no grid');
    else {
      if (JSON.stringify(g.payIns) !== JSON.stringify(want.payIns)) fail('B9', `grid.payIns ${g.payIns} ≠ ${want.payIns}`);
      if (JSON.stringify(g.ages.map((r) => r.age)) !== JSON.stringify(want.ages)) fail('B9', `grid ages ${g.ages.map((r) => r.age)} ≠ ${want.ages}`);
      for (const row of g.ages) {
        if (JSON.stringify(row.cells.map((c) => c.payIn)) !== JSON.stringify(g.payIns)) fail('B9', `row ${row.age}: cells are not the columns`);
        row.cells.forEach((c, j) => {
          if (JSON.stringify(c.outOfTen) !== JSON.stringify(outOfTen(c.lasted))) fail('B9', `row ${row.age} cell ${j}: outOfTen`);
          if (j > 0 && c.lasted < row.cells[j - 1].lasted) fail('B9', `row ${row.age}: more pay-in lasted in fewer lives`);
          const cellFails = Math.round((1 - c.lasted) * n);
          if (c.verdict !== (cellFails <= allowed.nineInTen ? 'yes' : cellFails <= Math.floor(n / 4) ? 'close' : 'no')) fail('B9', `row ${row.age} cell ${j}: verdict ${c.verdict}`);
        });
        if (row.number !== null && !Number.isInteger(row.number / 1000)) fail('B9', `row ${row.age}: number ${row.number}`);
      }
      if (g.reaches !== g.ages.some((r) => r.cells.some((c) => c.verdict === 'yes'))) fail('B9', 'grid.reaches is not "some cell lasted in 9 in 10"');
      if (lv.stopLater && !g.ages.some((r) => r.age === lv.stopLater.age)) fail('B9', 'the grid has no row for the stop-later age');
      if (pi.needed !== null && pi.needed > pi.now && !g.payIns.includes(pi.needed)) fail('B9', 'the grid has no column for the pay-in that gets there');
      const own = g.ages.find((r) => r.age === inputs.stop.age);
      if (own && num !== null) {
        if (own.number !== num.careful) fail('B9', 'the grid\'s row for the stop age has another number');
        if (g.payIns[0] === pi.now && own.cells[0].lasted !== ch.lasted) fail('B9', 'the grid\'s cell for today is not the chance');
      }
    }
  }

  // B10 the phases add up, from the stop to the end age; a closed pension pays nothing
  const ph = answer.phases;
  if (!Array.isArray(ph) || !ph.length) fail('B10', 'no phases');
  else {
    ph.forEach((p, i) => {
      const sum = p.fromPots + p.statePension + p.finalSalary + p.fromWork - p.tax;
      if (Math.abs(sum - p.takeHome) > 0.03) fail('B10', `phase ${i}: the parts do not add up to ${p.takeHome}`);
      if (Math.abs(p.fromPension + p.fromSavings - p.fromPots) > 0.02) fail('B10', `phase ${i}: fromPots ≠ fromPension + fromSavings`);
      if (p.shown.fromPots + p.shown.statePension + p.shown.finalSalary + p.shown.fromWork !== p.shown.takeHome) fail('B10', `phase ${i}: shown figures do not add up`);
      if (typeof p.pensionOpen !== 'boolean') fail('B10', `phase ${i}: pensionOpen`);
      for (const who of Object.keys(p.ages)) {
        const me = p.byPerson.find((x) => x.who === who);
        if (me && me.locked && me.fromPension > 0.005) fail('B10', `phase ${i}: ${who}'s pension is closed but pays ${me.fromPension}`);
      }
      if (i > 0 && p.fromAge !== ph[i - 1].toAge) fail('B10', `phase ${i} does not touch phase ${i - 1}`);
    });
    if (ph[0].fromAge !== inputs.stop.age && inputs.household !== 'couple') fail('B10', `the first phase starts at ${ph[0].fromAge}, not the stop age`);
    if (ph[ph.length - 1].toAge !== b.endAge) fail('B10', 'the last phase does not end at the end age');
    if (answer.status === 'ok' && ph[0].takeHome < spend - 0.01) fail('B10', `the first phase pays ${ph[0].takeHome}, less than the spend`);
  }
  if (answer.outside) {
    if (!(answer.gapYears > 0)) fail('B10', 'outside without a closed pension at the stop');
    if (answer.outside.untilAge !== inputs.stop.age + answer.gapYears && inputs.household !== 'couple') fail('B10', `outside.untilAge ${answer.outside.untilAge}`);
    // (with no pension in the phases at all — none today, nothing paid in, a number of nought — no year is "closed":
    // the savings pay every year, and there is no closed draw to compare)
    const closedDraw = ph.filter((p) => !p.pensionOpen && p.toAge <= answer.outside.untilAge).reduce((s, p) => s + p.fromSavings * 12 * (p.toAge - p.fromAge), 0);
    if (ph.some((p) => !p.pensionOpen) && Math.abs(answer.outside.amount - Math.round(closedDraw)) > 1) fail('B10', `outside.amount ${answer.outside.amount} ≠ the closed years' savings draw ${closedDraw}`);
  }

  // B11 the saving years, one per person
  if (!Array.isArray(answer.saving) || answer.saving.length !== people.length) fail('B11', 'saving is not one per person');
  else {
    answer.saving.forEach((s, i) => {
      const p = people[i];
      if (s.who !== p.who || s.stopAge !== p.age + S || s.yearsSaving !== S) fail('B11', `saving[${i}] who / stop / years`);
      if (s.payIn.total !== p.payIn.total) fail('B11', `saving[${i}].payIn.total`);
      if (Math.abs(s.paidIn.total - p.payIn.total * 12 * S) > 0.005) fail('B11', `saving[${i}].paidIn.total ≠ pay-in × 12 × ${S}`);
      if (s.potToday.pension !== p.pot) fail('B11', `saving[${i}].potToday.pension`);
      for (const part of ['pension', 'savings', 'total']) {
        const t = s.potAtStop[part];
        if (!(t.careful <= t.middling && t.middling <= t.good)) fail('B11', `saving[${i}].potAtStop.${part} out of order`);
      }
      if (s.chargeAYear !== Math.round(inputs.charge * 10) / 1000) fail('B11', `saving[${i}].chargeAYear ${s.chargeAYear}`);
      if (s.mix.saving !== inputs.savingRisk || s.mix.drawing !== inputs.risk || s.mix.slideYears !== (inputs.savingRisk === inputs.risk ? 0 : SAVING.slideYears)) fail('B11', `saving[${i}].mix`);
    });
  }

  // B12 every default that was used is listed; the lines that are always there
  const ids = answer.assumed.map((a) => a.id);
  if (new Set(ids).size !== ids.length) fail('B12', 'assumed ids repeat');
  for (const a of answer.assumed) {
    if (a.source === 'default' && typeof a.field !== 'string') fail('B12', `${a.id} is a default with no field`);
    if (!['default', 'entered', 'rule'].includes(a.source)) fail('B12', `${a.id}: source ${a.source}`);
  }
  const always = ['pay-in-as-given', 'risk-saving', 'risk-drawing', 'charge-saving', 'same-futures', 'saving-rebalanced', 'stop-age', 'spend-steady',
    'number-is-careful', 'confidence', 'plan-to', 'todays-prices', 'tax-rules'];
  always.push(nowTotal > 0 ? 'pay-in' : 'nothing-paid-in');
  if (inputs.household === 'couple') always.push('stop-together', 'both-alive');
  if (inputs.household === 'couple' && nowTotal > 0) always.push('pay-in-split');
  if (inputs.spend.kind === 'level') always.push('spend-level');
  if (inputs.savingRisk !== inputs.risk) always.push('slide');
  always.push('savings-in');
  if (inputs.savingsIn > 0 || inputs.savings > 0) always.push('isa-fixed-growth');
  if (answer.outside) always.push('outside-first');
  for (const id of always) if (!ids.includes(id)) fail('B12', `assumed lacks ${id}`);
  if (answer.gapYears > 0 && !ids.some((id) => id.startsWith('pension-closed-until'))) fail('B12', 'a pension closed at the stop, and no pension-closed-until line');
  for (const never of ['pot-as-is', 'start-later', 'start', 'no-charges', 'steady', 'risk']) if (ids.includes(never)) fail('B12', `assumed has C's ${never}`);
  if (inputs.savingRisk === inputs.risk && ids.includes('slide')) fail('B12', 'a slide line with one risk level');
  if (given) {
    const flat = flatten(given);
    const FIELD = { savingsIn: 'savings-in', savingRisk: 'risk-saving', risk: 'risk-drawing', charge: 'charge-saving', endAge: 'plan-to', confidence: 'confidence',
      'you.statePension.kind': 'state-pension-full', 'partner.statePension.kind': 'state-pension-full-partner',
      'you.finalSalary.has': 'no-final-salary', 'partner.finalSalary.has': 'no-final-salary-partner', 'partner.pot': 'partner-no-pot' };
    const applies = flatten(inputs);
    for (const [field, id] of Object.entries(FIELD)) {
      if (!(field in applies) || flat[field] !== undefined) continue;
      const line = answer.assumed.find((a) => a.id === id);
      if (!line) fail('B12', `${field} was defaulted but ${id} is not under what was assumed`);
      else if (line.source !== 'default') fail('B12', `${field} was defaulted but ${id} says ${line.source}`);
    }
  }

  // B13 the warnings: each exactly when its rule says
  const wids = answer.warnings.map((w) => w.id);
  if (new Set(wids).size !== wids.length) fail('B13', 'warning ids repeat');
  for (const w of answer.warnings) if (!['important', 'note'].includes(w.severity)) fail('B13', `${w.id}: severity ${w.severity}`);
  const has = (id) => wids.includes(id);
  const share = people.length;
  const neededOf = (p) => (pi.needed === null ? 0 : nowTotal > 0 ? pi.needed * p.payIn.total / nowTotal : pi.needed / share);
  const overAA = people.some((p) => p.payIn.total * 12 > RULES.annualAllowance || neededOf(p) * 12 > RULES.annualAllowance + 1e-6);
  if (has('annual-allowance') !== overAA) fail('B13', `annual-allowance ${has('annual-allowance')} but over it: ${overAA}`);
  const overMpaa = people.some((p) => p.alreadyDrawing && (p.payIn.total * 12 > RULES.moneyPurchaseAllowance || neededOf(p) * 12 > RULES.moneyPurchaseAllowance + 1e-6));
  if (has('mpaa') !== overMpaa) fail('B13', `mpaa ${has('mpaa')} but over it: ${overMpaa}`);
  if (has('isa-allowance') !== (inputs.savingsIn / share * 12 > RULES.isaAllowance)) fail('B13', 'isa-allowance');
  if (has('out-of-reach') !== (answer.status === 'out-of-reach')) fail('B13', 'out-of-reach warning ⟺ the status');
  if (has('target-below-pensions') !== (answer.status === 'guaranteed-only')) fail('B13', 'target-below-pensions ⟺ guaranteed-only');
  if (answer.gapYears > 0 && !wids.some((id) => id.startsWith('pension-closed'))) fail('B13', 'every pension closed at the stop, and no pension-closed warning');
  if (answer.outside && has('no-savings-for-gap') !== (!(inputs.savings > 0) && !(inputs.savingsIn > 0))) fail('B13', 'no-savings-for-gap');
  if (has('state-pension-assumed') !== people.some((p) => (p.statePension || {}).kind === 'full')) fail('B13', 'state-pension-assumed');
  if (has('long-plan') !== (inputs.endAge - youngerAtStop > RULES.maxYears)) fail('B13', 'long-plan');

  // B14 every sentence carries its own numbers; the headline is the number; no banned word, no wait
  const all = sentencesOf(answer);
  for (const s of all) {
    if (!s || typeof s.text !== 'string' || !Array.isArray(s.parts) || typeof s.id !== 'string') { fail('B14', `${s && s.id}: not a sentence`); continue; }
    if (partsText(s.parts, answer) !== s.text) fail('B14', `${s.id}: text ≠ parts joined`);
    for (const p of s.parts) {
      if (p && p.key !== undefined) {
        const v = get(answer, p.key);
        if (typeof v !== 'number') fail('B14', `${s.id}: key ${p.key} leads to ${v}`);
        else if (p.kind === 'money' && !s.text.includes(money(v))) fail('B14', `${s.id}: ${money(v)} not in text`);
        else if (p.kind === 'pot' && !s.text.includes(potText(v))) fail('B14', `${s.id}: ${potText(v)} not in text`);
      }
    }
    if (/undefined|NaN|\bnull\b|Infinity|\[object|-£0|£-|£NaN|\{|\}/.test(s.text)) fail('B14', `${s.id}: rubbish in "${s.text}"`);
    if (/£\d+\.\d/.test(s.text)) fail('B14', `${s.id}: pence in "${s.text}"`);
    if (COUNTDOWN.test(s.text)) fail('B14', `${s.id}: a length of time to wait in "${s.text}"`);
  }
  const text = all.map((s) => s.text).join('\n');
  for (const hit of bannedHits(text, SCOPES)) fail('B14', hit);
  const S_ = answer.sentences;
  for (const id of ['head', 'sub', 'line', 'bad', 'potsNow', 'wholeLife', 'change']) if (!S_[id]) fail('B14', `no ${id} sentence`);
  if (!S_.lever || typeof S_.lever !== 'object') fail('B14', 'no lever sentences');
  else {
    for (const k of LEVERS) if (Boolean(S_.lever[k]) !== Boolean(lv[k])) fail('B14', `lever sentence ${k} ${S_.lever[k] ? 'without' : 'missing for'} its lever`);
  }
  const two = answer.status === 'ok' && !answer.onCourse;
  for (const id of ['payInHead', 'payInSub', 'payInLine', 'payInBad']) if (Boolean(S_[id]) !== (two && pi.needed !== null)) fail('B14', `${id} ${S_[id] ? 'present' : 'missing'}`);
  if (Boolean(S_.outside) !== Boolean(answer.outside)) fail('B14', 'outside sentence ⟺ outside');
  if (S_.gridCell && !answer.grid) fail('B14', 'a gridCell sentence without a grid');
  if (answer.grid && num !== null && answer.grid.payIns.length && answer.grid.ages.some((r) => r.age === inputs.stop.age) && !S_.gridCell) fail('B14', 'a grid with the stop age\'s row and no gridCell sentence');
  // "You already have more than £X" — not of a number of nought (then the savings pay: b.line.zero says so)
  if (Boolean(S_.have) !== Boolean(answer.already && answer.status === 'ok' && num && num.careful > 0)) fail('B14', 'have sentence ⟺ already');
  if (Boolean(S_.nothing) !== (answer.status === 'guaranteed-only')) fail('B14', 'nothing sentence ⟺ guaranteed-only');
  if (Boolean(S_.none) !== (answer.status === 'out-of-reach')) fail('B14', 'none sentence ⟺ out-of-reach');
  if (answer.status === 'ok' && !answer.onCourse && num.careful > 0 && !S_.head.text.includes(potText(num.careful))) fail('B14', 'the headline is not the number');
  if (two && pi.needed !== null && !S_.payInHead.text.includes(money(pi.needed <= pi.now && savingsShort ? pi.outside : pi.needed))) fail('B14', 'the second headline is not the pay-in that gets there');
  if (answer.grid && Boolean(S_.gridNone) !== !answer.grid.reaches) fail('B14', 'gridNone ⟺ no cell of the grid lasted in 9 in 10');
  if (answer.onCourse && answer.status === 'ok' && S_.head.id !== 'b.head.onCourse') fail('B14', 'on course but the headline is not b.head.onCourse');
  if (/\bbad case\b/i.test(S_.bad.text) && !/the worst 1 in 10/.test(S_.bad.text)) fail('B14', 'a bad case without "the worst 1 in 10"');

  // B15 the trace, worked again by hand: the count, the pots, the pay-ins
  if (answer.trace && answer.trace.lives) {
    const lives = answer.trace.lives;
    if (lives.length !== n) fail('B15', `${lives.length} lives in the trace, ${n} in the basis`);
    for (const l of lives) if (Math.abs(l.pension - (l.zero + pi.now * l.perPound)) > 0.01 * (1 + l.pension * 1e-9)) fail('B15', `life ${l.id}: pension ≠ zero + now × perPound`);
    const ranOut = lives.filter((l) => l.runOutMonth !== null).length;
    if (ch.fails !== ranOut) fail('B15', `chance.fails ${ch.fails}, but ${ranOut} lives ran out in the trace`);
    const at = positions(n);
    const sorted = lives.map((l) => l.pension).sort((x, y) => x - y);
    for (const k of THREE) if (Math.abs(pa.now[k] - sorted[at[k]]) > 0.5 + 1e-9) fail('B15', `potAtStop.now.${k} ${pa.now[k]} ≠ the trace's ${sorted[at[k]]}`);
    const ran = lives.filter((l) => l.runOutMonth !== null).length;
    if (Math.abs(wl.lasted - (n - ran) / n) > 1e-12) fail('B15', `wholeLife.lasted ${wl.lasted}, ${n - ran} of ${n} lasted in the trace`);
  }

  // B16 can be saved
  const json = JSON.stringify(answer);
  if (JSON.stringify(JSON.parse(json)) !== json) fail('B16', 'does not survive JSON');
  if (!answer.trace && json.length > 100000) fail('B16', `answer is ${json.length} characters`);
  return f;
}
