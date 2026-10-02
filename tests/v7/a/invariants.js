/**
 * checkAnswerA(answer, given?, env?) — the rules that must hold on ANY answer to question A (step 4 brief 6, P2;
 * test-plan-A-B.md 4.1, A1–A15 renamed to the brief's fields). Returns a list of plain-English failures; the caller
 * asserts it is empty. Called from the pairs, the random cases, the four fixtures and the trace check.
 *
 * `given` is the inputs as they were passed in (before defaults), for the what-was-assumed rule. `env` (optional) is
 * the env the answer was made with: when it names no `ages`, the rows must be exactly agesToShow's.
 *
 * ENGINE_READY says whether the real answer is in place (P1's saving engine and P2's answer.js). Until the join,
 * answer.js is P0's stub, whose figures do not follow its inputs: every test that needs the real figures is
 * `describe.skipIf(!ENGINE_READY)` and runs, unchanged, the day the two land. V7_A_REAL=1 forces it on.
 *
 * Every test under tests/v7/a/ imports { answerA } from here; it comes from the adapter, _a.js.
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { get, money, partsText, outOfTen, pot as potText } from '../../../src/answers/shared/format.js';
import { flatten } from '../../../src/answers/shared/validate.js';
import { RULES, verdictOf } from '../../../src/answers/shared/rules.js';
import { agesToShow, askedAbout, stopYearsOf } from '../../../src/answers/shared/schemaParts.js';
import { bannedHits } from '../render/checkScreen.js';
import { largeHousehold } from '../oracles/oneStep.mjs';
export { answerA, SCHEMA_A, TEST_ENV } from './_a.js';

/*
 * Couples who stop work in different years (research/v7/couples-different-years.md 5.2): every rule below reads each
 * person at their own stop. The rows are the stops of the person the answer is about (askedAbout: you, or your partner
 * after "I've already stopped"); `ownAt(inputs, a)` gives each person's whole years until their own stop when that person
 * stops at `a`, and the household's clock starts at the first of them. With one stop for both every rule is as it was.
 */
/** The person the answer is about, and their stop as typed: { asked, kind: 'age' | 'ages', named }. */
export function askedStop(inputs) {
  const asked = askedAbout(inputs);
  const own = (asked === 'partner' ? inputs.partner.stop : inputs.stop) || {};
  return { asked, kind: own.kind === 'ages' ? 'ages' : 'age', named: own.kind === 'age' ? own.age : inputs[asked].age };
}
/** Each person's years until their own stop when the asked person stops at `a`: { you, partner?, first, last }. */
export function ownAt(inputs, a) {
  const own = stopYearsOf(inputs, a);
  const list = inputs.household === 'couple' && inputs.partner ? [own.you, own.partner] : [own.you];
  return { ...own, first: Math.min(...list), last: Math.max(...list) };
}
/** Whether a row at `a` can be answered: the end after the later stop, under 45 years after the first. */
const fitsAt = (inputs, a, younger) => { const o = ownAt(inputs, a); return inputs.endAge > younger + o.last && o.last - o.first < RULES.maxYears; };

const ROOT = process.cwd();
const P1_FILES = ['lives', 'saving', 'stopAt'].map((f) => resolve(ROOT, `src/answers/shared/${f}.js`));
const ANSWER_FILE = resolve(ROOT, 'src/answers/a/answer.js');
/** The saving engine (P1) and the real answer (P2) are both in the tree since joining up; kept as a name for the tests that read it. */
export const ENGINE_READY = true;

/** The four fixtures of question A (tests/v7/fixtures/a/). */
export const FIXTURE_FILES = ['A1-stop-soon.json', 'A2-couple-before-57.json', 'A3-forced-out.json', 'A4-from-savings.json'];

const UNITS = { money: 'todays-prices', tax: 'after-tax', period: 'month', who: 'household' };
const THREE = ['careful', 'middling', 'good'];
const STATUSES = ['ok', 'invalid', 'guaranteed-only', 'none'];
/** The one pattern of a wait: never on A (brief 2.4 #47, `countdown-any`). */
export const COUNTDOWN = /\b\d+ (more )?(years?|months?) (to go|until|till|before|from now)\b/i;
/**
 * The scopes of the banned list every A string is checked in; 'retired' too when the stop is today (brief 4.9), or when
 * you have already stopped ("I've already stopped": the answer is about your partner).
 */
export const scopesForA = (inputs) => ['all', 'first', 'planner', 'result', 'saver',
  ...(inputs && inputs.stop && (inputs.stop.age === inputs.you.age || inputs.stop.kind === 'already') ? ['retired'] : [])];

/** True when anything in the value is undefined, a function, a Date, NaN or infinite. */
export function unsaveable(v, path = '', out = []) {
  if (v === undefined || typeof v === 'function' || v instanceof Date) { out.push(path || '(root)'); return out; }
  if (typeof v === 'number' && !Number.isFinite(v)) { out.push(path || '(root)'); return out; }
  if (v && typeof v === 'object') for (const k of Object.keys(v)) unsaveable(v[k], path ? `${path}.${k}` : k, out);
  return out;
}

/** Every sentence of an answer, flat: the sentences (lists included), what was assumed and the warnings. */
export function allSentences(answer) {
  return [...Object.values(answer.sentences || {}).flatMap((s) => (Array.isArray(s) ? s : [s])), ...(answer.assumed || []), ...(answer.warnings || [])];
}

/** The household's pay-in a month into pensions, as given. */
export function householdPayIn(inputs) {
  const one = (p) => (!p || !p.payIn ? 0 : p.payIn.kind === 'split' ? (p.payIn.own || 0) + (p.payIn.employer || 0) : (p.payIn.total || 0));
  return one(inputs.you) + (inputs.household === 'couple' ? one(inputs.partner) : 0);
}

/**
 * The household model's limit on what goes in each month (HOUSEHOLD_LIMITS.payInAMonth, £10,000) is on the total; the
 * form's own and employer boxes are each up to £10,000, so a split can add to more. Such inputs are 'invalid' by the
 * household's check (answer.js names the own box); generated cases leave them out.
 */
export const payInsFit = (inputs) => ['you', 'partner'].every((who) => !inputs[who] || !inputs[who].payIn || householdPayIn({ household: 'single', you: inputs[who] }) <= 10000);

/** The pots typed today: every pension plus the savings. */
export function potsToday(inputs) {
  return (inputs.you.pot || 0) + (inputs.household === 'couple' && inputs.partner ? inputs.partner.pot || 0 : 0) + (inputs.savings || 0);
}

/** Defaulted fields that must be named under what was assumed, and the line that names them. `when` says when the line applies. */
const ASSUMED_FIELD = {
  'you.statePension.kind': ['state-pension-full', () => true],
  'partner.statePension.kind': ['state-pension-full-partner', () => true],
  'you.finalSalary.has': ['no-final-salary', () => true],
  'partner.finalSalary.has': ['no-final-salary-partner', () => true],
  'partner.pot': ['partner-no-pot', () => true],
  // (couples apart: your own saving years; anyone's for the household's lines)
  'you.payIn.total': ['nothing-paid-in', (a) => ownAt(a.inputs, a.shown.age).you > 0],
  savingsIn: ['savings-in', (a) => ownAt(a.inputs, a.shown.age).last > 0],
  savingRisk: ['risk-saving', (a) => ownAt(a.inputs, a.shown.age).last > 0 && (potsToday(a.inputs) > 0 || householdPayIn(a.inputs) > 0 || a.inputs.savingsIn > 0)],
  risk: ['risk-drawing', (a) => a.shown.potAtStop.good > 0],
  // 6.19.0: the one charge, said whenever money is held in funds or cash at some time — saving or drawing
  charge: ['charges', (a) => potsToday(a.inputs) > 0 || householdPayIn(a.inputs) > 0 || a.inputs.savingsIn > 0],
  endAge: ['plan-to', () => true],
  'partTime.has': ['no-part-time', () => true]
};

const NEGATIVE_OK = /(^|\.)(extraMonthly|potExtra|growth)$|^trace\./;

export function checkAnswerA(answer, given, env) {
  const f = [];
  const fail = (rule, msg) => { f.push(`${rule}: ${msg}`); };
  if (!answer || typeof answer !== 'object') return ['A-I1: not an object'];
  if (!STATUSES.includes(answer.status)) fail('A-I1', `unknown status ${answer.status}`);
  if (answer.status === 'invalid') {
    if (!Array.isArray(answer.problems) || !answer.problems.length) fail('A-I1', 'invalid without problems');
    if (Object.keys(answer).length !== 2) fail('A-I1', 'an invalid answer carries nothing but status and problems');
    return f;
  }

  // A-I1 the shape: nothing missing, not-a-number, infinite, a function or a Date; nothing negative but a difference
  const bad = unsaveable(answer);
  if (bad.length) fail('A-I1', `unsaveable at ${bad.slice(0, 5).join(', ')}`);
  const walk = (v, path, out) => { if (typeof v === 'number') out.push([path, v]); else if (v && typeof v === 'object') for (const k of Object.keys(v)) walk(v[k], path ? `${path}.${k}` : k, out); return out; };
  for (const [path, v] of walk(answer, '', [])) {
    if (Object.is(v, -0)) fail('A-I1', `${path} is -0`);
    if (v < 0 && !NEGATIVE_OK.test(path)) fail('A-I1', `${path} is negative (${v})`);
  }
  for (const key of ['inputs', 'whose', 'spend', 'stop', 'headline', 'shown', 'ages', 'earliest', 'pensionOpens', 'gapYears', 'savingsNeeded', 'partTime', 'saving', 'guaranteed', 'assumed', 'warnings', 'sentences', 'basis', 'units']) {
    if (!(key in answer)) fail('A-I1', `no ${key}`);
  }
  if (f.length) return f;

  const inputs = answer.inputs;
  const b = answer.basis;
  const n = b.futures;
  const couple = inputs.household === 'couple';
  const younger = couple ? Math.min(inputs.you.age, inputs.partner.age) : inputs.you.age;

  // A-I13 the basis and the units
  if (b.failuresAllowed !== Math.floor(n / 10)) fail('A-I13', 'failuresAllowed ≠ floor(futures / 10)');
  if (b.closeAllowed !== Math.floor(n / 4)) fail('A-I13', 'closeAllowed ≠ floor(futures / 4)');
  for (const [k, v] of Object.entries({ bondDraws: 'life', cashRule: 'previous-year', grid: 'yearly', strategyId: 'pots-and-valves', cutsSwitchedOff: true })) if (b[k] !== v) fail('A-I13', `basis.${k} = ${b[k]}`);
  if (!['chart', 'all'].includes(b.detail)) fail('A-I13', `basis.detail = ${b.detail}`);
  if (!Number.isInteger(b.lifeYears) || b.lifeYears < 1) fail('A-I13', `basis.lifeYears = ${b.lifeYears}`);
  if (!Number.isInteger(b.endAge) || b.endAge > inputs.endAge) fail('A-I13', `basis.endAge ${b.endAge} past the end age asked for`);
  if (b.endAge < inputs.endAge && !answer.warnings.some((w) => w.id === 'long-plan')) fail('A-I13', 'capped without saying so');
  if (JSON.stringify(answer.units) !== JSON.stringify(UNITS)) fail('A-I13', `units ${JSON.stringify(answer.units)}`);
  if (!['you', 'partner'].includes(answer.whose) || (!couple && answer.whose !== 'you')) fail('A-I13', `whose = ${answer.whose}`);
  if (couple && answer.whose !== (inputs.partner.age < inputs.you.age ? 'partner' : 'you')) fail('A-I13', `whose = ${answer.whose}, not the younger`);

  // The spending tested
  const s = answer.spend;
  if (Math.abs(s.perYear - s.perMonth * 12) > 0.01) fail('A-I1', 'spend.perYear ≠ 12 × perMonth');
  if (inputs.spend.kind === 'amount' && s.perMonth !== inputs.spend.amount) fail('A-I1', `spend.perMonth ${s.perMonth} ≠ the amount typed ${inputs.spend.amount}`);
  if (inputs.spend.kind === 'level') {
    const want = Math.round(RULES.plsa[couple ? 'couple' : 'single'][inputs.spend.level] / 12);
    if (s.perMonth !== want || s.level !== inputs.spend.level || s.kind !== 'level') fail('A-I1', `spend by level: ${JSON.stringify(s)}, want ${want}`);
  } else if (s.level !== null || s.kind !== 'amount') fail('A-I1', `spend by amount: ${JSON.stringify(s)}`);

  // the person the answer is about (you, or your partner after "I've already stopped") and their stop as typed
  const ask = askedStop(inputs);
  if ((answer.askedAbout || 'you') !== ask.asked) fail('A-I3', `askedAbout ${answer.askedAbout}, the inputs ask about ${ask.asked}`);

  // A-I2 the rows: whole ages, in order, no repeats, within today's age and 75; agesToShow's when the env named none
  const rows = answer.ages;
  const ages = rows.map((r) => r.age);
  if (!rows.length) fail('A-I2', 'no rows');
  ages.forEach((a, i) => {
    if (!Number.isInteger(a) || a < inputs[ask.asked].age || a > RULES.stopAgeMax) fail('A-I2', `row ${i}: age ${a}`);
    if (i > 0 && a <= ages[i - 1]) fail('A-I2', `rows out of order at ${i}: ${ages.join(', ')}`);
  });
  if (env && !Array.isArray(env.ages)) {
    // agesToShow's, less any age from which the plan would not reach the end age (the end-after-stop rule, row by row —
    // couples apart: after the later stop, under 45 years after the first)
    // (and the earliest age that worked: "show me ages"'s; or, an age named that does not last, the first later age that does)
    const later = ask.kind === 'age' && answer.shown.verdict !== 'yes' && answer.earliest.yes !== null && answer.earliest.yes > ask.named;
    const want = agesToShow(inputs, env, b.detail, ask.kind === 'ages' || later ? answer.earliest.yes : null).filter((a) => fitsAt(inputs, a, younger));
    if (JSON.stringify(want) !== JSON.stringify(ages)) fail('A-I2', `rows ${ages.join(', ')} ≠ agesToShow ${want.join(', ')}`);
  }

  // A-I3 the shown row IS its row; the headline is the shown row; the stop is the shown age
  const same = rows.find((r) => r.age === answer.shown.age);
  if (!same) fail('A-I3', `shown age ${answer.shown.age} is not among the rows`);
  else if (JSON.stringify(same) !== JSON.stringify(answer.shown)) fail('A-I3', 'shown does not deep-equal its row of ages[]');
  if (answer.stop.age !== answer.shown.age || answer.stop.kind !== ask.kind) fail('A-I3', `stop ${JSON.stringify(answer.stop)}`);
  const firstYes = rows.find((r) => r.verdict === 'yes');
  if (ask.kind === 'age' && answer.shown.age !== ask.named) fail('A-I3', `shown age ${answer.shown.age} ≠ the age typed ${ask.named}`);
  if (ask.kind === 'ages') {
    const want = answer.earliest.yes !== null ? answer.earliest.yes : ages[ages.length - 1];
    if (answer.shown.age !== want) fail('A-I3', `"show me ages": shown ${answer.shown.age}, want ${want}`);
  }
  // couples apart at the shown row: the block is there exactly when the two stops differ, and says them
  const shownOwn = ownAt(inputs, answer.shown.age);
  const apartShown = couple && shownOwn.you !== shownOwn.partner;
  if (Boolean(answer.apart) !== apartShown) fail('A-I3', `apart ${JSON.stringify(answer.apart)} but the stops at the shown row are ${JSON.stringify(shownOwn)}`);
  if (answer.apart) {
    const ap = answer.apart;
    for (const who of ['you', 'partner']) {
      if (ap.stops[who].age !== inputs[who].age + shownOwn[who] || ap.stops[who].already !== (shownOwn[who] === 0)) fail('A-I3', `apart.stops.${who} ${JSON.stringify(ap.stops[who])}`);
    }
    if (ap.years !== shownOwn.last - shownOwn.first) fail('A-I3', `apart.years ${ap.years}`);
    if (ap.first !== (shownOwn.you < shownOwn.partner ? 'you' : 'partner')) fail('A-I3', `apart.first ${ap.first}`);
    if (![0, 0.5, 1].includes(ap.payCovers)) fail('A-I3', `apart.payCovers ${ap.payCovers}`);
    if (ap.coverUsed !== null && (ap.coverUsed.who !== ap.first || !Number.isInteger(ap.coverUsed.fromAge))) fail('A-I3', `apart.coverUsed ${JSON.stringify(ap.coverUsed)}`);
    if (Boolean(ap.coverUsed) !== answer.warnings.some((w) => w.id === 'apart-cover-used')) fail('A-I3', 'apart.coverUsed ⟺ the apart-cover-used warning');
  }
  const h = answer.headline;
  const wantKind = answer.status === 'none' || answer.status === 'guaranteed-only' ? 'nothing' : ask.kind === 'age' ? 'named' : answer.earliest.yes !== null ? 'earliest' : 'noneWorked';
  if (h.kind !== wantKind) fail('A-I3', `headline.kind ${h.kind}, want ${wantKind}`);
  for (const k of ['verdict', 'lasted', 'runOutAge']) if (h[k] !== answer.shown[k]) fail('A-I3', `headline.${k} ${h[k]} ≠ shown.${k} ${answer.shown[k]}`);
  if (h.age !== answer.shown.age) fail('A-I3', 'headline.age ≠ shown.age');
  if (JSON.stringify(h.outOfTen) !== JSON.stringify(outOfTen(h.lasted))) fail('A-I3', 'headline.outOfTen ≠ outOfTen(lasted)');

  // Every row (each person at their own stop: S the asked person's years, S0 the household's start)
  const one = (p) => (!p || !p.payIn ? 0 : p.payIn.kind === 'split' ? (p.payIn.own || 0) + (p.payIn.employer || 0) : (p.payIn.total || 0));
  rows.forEach((r, i) => {
    const at = `row ${r.age}`;
    const own = ownAt(inputs, r.age);
    const S = own[ask.asked];
    const S0 = own.first;
    const endAge = Math.min(inputs.endAge, younger + S0 + RULES.maxYears);
    const payInYears = one(inputs.you) * own.you + (couple ? one(inputs.partner) * own.partner : 0);
    // A-I4 the verdict is the count
    const fails = Math.round((1 - r.lasted) * n);
    if (Math.abs((n - fails) / n - r.lasted) > 1e-9) fail('A-I4', `${at}: lasted ${r.lasted} is not a count out of ${n}`);
    if (r.verdict !== verdictOf(fails, n)) fail('A-I4', `${at}: verdict ${r.verdict} but ${fails} of ${n} ran out`);
    if (JSON.stringify(r.outOfTen) !== JSON.stringify(outOfTen(r.lasted))) fail('A-I4', `${at}: outOfTen ≠ outOfTen(lasted)`);
    if (!Number.isInteger(r.runOutAge) || r.runOutAge > endAge || r.runOutAge < younger + S0) fail('A-I4', `${at}: runOutAge ${r.runOutAge}`);
    if ((r.verdict === 'yes') !== (r.runOutAge === endAge)) fail('A-I4', `${at}: verdict ${r.verdict} but a bad case runs out at ${r.runOutAge} (end ${endAge})`);
    if (r.status !== 'final') fail('A-I4', `${at}: status ${r.status}`);
    if (r.yearsSaving !== S) fail('A-I4', `${at}: yearsSaving ${r.yearsSaving} ≠ ${S}`);
    if (r.stopYear !== String(Number(b.today.slice(0, 4)) + S)) fail('A-I4', `${at}: stopYear ${r.stopYear}`);
    if (r.ages[ask.asked] !== r.age || r.ages.you !== inputs.you.age + own.you || (couple && r.ages.partner !== inputs.partner.age + own.partner) || (!couple && 'partner' in r.ages)) fail('A-I4', `${at}: ages ${JSON.stringify(r.ages)}`);

    // A-I5 the band: in order, whole £10, and it agrees with the verdict
    const m = r.monthly;
    if (!(m.careful <= m.middling && m.middling <= m.good)) fail('A-I5', `${at}: band out of order ${JSON.stringify(m)}`);
    for (const k of THREE) {
      if (Math.abs(r.yearly[k] - m[k] * 12) > 0.01) fail('A-I5', `${at}: yearly.${k} ≠ 12 × monthly`);
      if (r.potAtStop.good > 0 && m[k] % 10 !== 0) fail('A-I5', `${at}: monthly.${k} = ${m[k]} is not a whole £10`);
      if (!Number.isInteger(r.runOutAgeAt[k]) || r.runOutAgeAt[k] > endAge) fail('A-I5', `${at}: runOutAgeAt.${k} = ${r.runOutAgeAt[k]}`);
    }
    if (!(r.lastedAt.careful >= r.lastedAt.middling && r.lastedAt.middling >= r.lastedAt.good)) fail('A-I5', `${at}: lastedAt out of order`);
    if (r.potAtStop.good > 0) {
      if (r.lastedAt.careful < 0.9 - 1e-12) fail('A-I5', `${at}: the careful amount lasted in only ${r.lastedAt.careful}`);
      if (r.runOutAgeAt.careful !== endAge) fail('A-I5', `${at}: the careful amount runs out in a bad case`);
      const floor10 = Math.floor(s.perMonth / 10 + 1e-9) * 10;
      if (r.verdict === 'yes' && m.careful < floor10) fail('A-I5', `${at}: yes, but the careful amount ${m.careful} is under the spending ${s.perMonth}`);
      if (m.careful >= Math.ceil(s.perMonth / 10 - 1e-9) * 10 && r.verdict !== 'yes') fail('A-I5', `${at}: careful ${m.careful} ≥ spending ${s.perMonth} but ${r.verdict}`);
    }
    if (Math.abs(r.spare - Math.max(0, m.careful - s.perMonth)) > 0.005) fail('A-I5', `${at}: spare ${r.spare}`);

    // A-I9 the pots at the stop, and what went in
    const p = r.potAtStop;
    if (!(p.careful <= p.middling && p.middling <= p.good)) fail('A-I9', `${at}: pots out of order ${JSON.stringify(p)}`);
    for (const k of THREE) if (!Number.isInteger(p[k])) fail('A-I9', `${at}: potAtStop.${k} is not whole pounds`);
    if (own.last === 0) for (const k of THREE) if (Math.abs(p[k] - potsToday(inputs)) > 1) fail('A-I9', `${at}: stopping today, potAtStop.${k} ${p[k]} ≠ the pots typed ${potsToday(inputs)}`);
    const by = p.byPerson.reduce((t, x) => t + x.pension + x.savings, 0);
    if (Math.abs(by - p.middling) > 2) fail('A-I9', `${at}: byPerson adds to ${by}, not the middling pot ${p.middling}`);
    if (Math.abs(r.paidIn.total - payInYears * 12) > 1) fail('A-I9', `${at}: paidIn.total ${r.paidIn.total} ≠ what goes in × 12 × each one's own years (${payInYears * 12})`);
    if (Math.abs(r.paidIn.byPerson.reduce((t, x) => t + x.amount, 0) - r.paidIn.total) > 1) fail('A-I9', `${at}: paidIn.byPerson does not add up`);
    if (!Number.isInteger(r.gapYears) || r.gapYears < 0) fail('A-I9', `${at}: gapYears ${r.gapYears}`);

    // A-I7 one more year is a difference of rows
    const next = rows[i + 1] && rows[i + 1].age === r.age + 1 ? rows[i + 1] : null;
    if (!next) { if (r.oneMoreYear !== null) fail('A-I7', `${at}: oneMoreYear without the next row`); }
    else {
      const o = r.oneMoreYear;
      const want = { toAge: next.age, extraMonthly: next.monthly.careful - m.careful, lastedFrom: r.lasted, lastedTo: next.lasted, runOutFrom: r.runOutAge, runOutTo: next.runOutAge, potExtra: next.potAtStop.middling - p.middling, sameish: Math.abs(next.monthly.careful - m.careful) <= 20 };
      if (!o || JSON.stringify(o) !== JSON.stringify(want)) fail('A-I7', `${at}: oneMoreYear ${JSON.stringify(o)} ≠ ${JSON.stringify(want)}`);
    }
    if (r.age !== answer.shown.age && r.phases !== null) fail('A-I8', `${at}: phases on a row that is not shown`);
  });

  // A-I6 the earliest ages
  const e = answer.earliest;
  if (inputs.stop.kind === 'age') {
    if (e.yes !== (firstYes ? firstYes.age : null)) fail('A-I6', `earliest.yes ${e.yes}, the first yes row is ${firstYes && firstYes.age}`);
    const firstClose = rows.find((r) => r.verdict !== 'no');
    if (e.close !== (firstClose ? firstClose.age : null)) fail('A-I6', `earliest.close ${e.close}, the first row not "no" is ${firstClose && firstClose.age}`);
  } else {
    if (e.yes !== null && (rows.find((r) => r.age === e.yes) || {}).verdict !== 'yes') fail('A-I6', `earliest.yes ${e.yes} is not a yes row`);
    if (rows.some((r) => r.verdict === 'yes' && (e.yes === null || r.age < e.yes))) fail('A-I6', `a yes row before earliest.yes ${e.yes}`);
  }
  if (e.yes !== null && e.close !== null && e.close > e.yes) fail('A-I6', `earliest.close ${e.close} after earliest.yes ${e.yes}`);

  // A-I8 the phases of the shown row: from the stop, in order, adding up; a closed pension pays nothing
  const ph = answer.shown.phases;
  if (!Array.isArray(ph) || !ph.length) fail('A-I8', 'the shown row has no phases');
  else {
    ph.forEach((q, i) => {
      // part-time earnings: `work` before tax (taxed with the rest), `fromWork` what they add after tax (the shown split)
      const work = q.work || 0;
      // (couples apart, before the second stop: plus what the pay of the one still working covers)
      const pay = q.fromPay || 0;
      if ((q.fromPay !== undefined) !== Boolean(answer.apart && q.fromAge < younger + shownOwn.last)) fail('A-I8', `phase ${i}: fromPay ${q.fromPay} in the wrong years`);
      if (Math.abs(q.fromPots + q.statePension + q.finalSalary + work + pay - q.tax - q.takeHome) > 0.03) fail('A-I8', `phase ${i}: ${q.fromPots} + ${q.statePension} + ${q.finalSalary} + ${work} + ${pay} − ${q.tax} ≠ ${q.takeHome}`);
      if ((q.fromWork || 0) > work + 0.005) fail('A-I8', `phase ${i}: more from work after tax (${q.fromWork}) than before (${work})`);
      if (Math.abs(q.fromPension + q.fromSavings - q.fromPots) > 0.02) fail('A-I8', `phase ${i}: fromPots ≠ fromPension + fromSavings`);
      const sh = q.shown;
      if (sh.fromPots + sh.statePension + sh.finalSalary + (sh.fromWork || 0) + (sh.fromPay || 0) !== sh.takeHome) fail('A-I8', `phase ${i}: shown figures do not add up`);
      for (const x of q.byPerson) if (x.working && (x.fromPension || x.fromSavings || x.statePension || x.finalSalary || x.takeHome)) fail('A-I8', `phase ${i}: ${x.who} is still working but draws or is paid`);
      if (!Number.isInteger(q.fromAge) || !Number.isInteger(q.toAge) || q.toAge <= q.fromAge) fail('A-I8', `phase ${i}: ages ${q.fromAge}–${q.toAge}`);
      if (i > 0 && q.fromAge !== ph[i - 1].toAge) fail('A-I8', `phase ${i} does not touch phase ${i - 1}`);
      if (typeof q.pensionOpen !== 'boolean') fail('A-I8', `phase ${i}: pensionOpen is ${q.pensionOpen}`);
      if (q.pensionOpen === false && !q.byPerson.some((x) => x.locked)) fail('A-I8', `phase ${i}: pensionOpen false but nobody's pension is closed`);
      if (q.pensionOpen === true && q.byPerson.some((x) => x.locked)) fail('A-I8', `phase ${i}: pensionOpen true but a pension is closed`);
      for (const x of q.byPerson) if (x.locked && x.fromPension > 0.005) fail('A-I8', `phase ${i}: ${x.who}'s pension is closed but pays ${x.fromPension}`);
      // (couples apart: before the second stop, a need the pay does not make up and nobody's money can pay is a run-out —
      // "None of it" with nothing to draw on: the take-home there is what there is)
      const unpaid = q.fromPay !== undefined && !answer.apart.coversGap;
      if (answer.shown.potAtStop.good > 0 && q.takeHome < s.perMonth - 0.005 && !unpaid) fail('A-I8', `phase ${i}: take-home ${q.takeHome} under the spending ${s.perMonth}`);
    });
    // the start is the stop (couples apart: the first of the two): never moved
    if (ph[0].ages.you.from !== inputs.you.age + shownOwn.first) fail('A-I8', `the first phase starts when you are ${ph[0].ages.you.from}, not at the first stop`);
    if (ph[0].fromAge !== younger + shownOwn.first) fail('A-I8', `the first phase starts at ${ph[0].fromAge}, not the younger's age at the first stop`);
    if (ph[ph.length - 1].toAge !== b.endAge) fail('A-I8', `the last phase ends at ${ph[ph.length - 1].toAge}, not ${b.endAge}`);
  }
  // savingsNeeded: the closed periods' savings (no pension open, nothing from one), summed — couples apart, from where the
  // pay of the one still working stops covering (before it, the pay makes up what the savings cannot)
  const checkFrom = !answer.apart ? -Infinity : younger + shownOwn.first + (answer.apart.payCovers >= 1 || answer.apart.coversGap ? answer.apart.years : 0);
  const closed = (ph || []).filter((q) => q.pensionOpen === false && q.fromPension <= 0.005 && q.fromAge >= checkFrom);
  if (!closed.length) { if (answer.savingsNeeded !== null) fail('A-I8', 'savingsNeeded without a closed period'); }
  else {
    const amount = closed.reduce((t, q) => t + q.fromSavings * 12 * (q.toAge - q.fromAge), 0);
    const sn = answer.savingsNeeded;
    if (!sn || Math.abs(sn.amount - amount) > 1 || !Number.isInteger(sn.amount) || sn.untilAge !== closed[closed.length - 1].ages.you.to) fail('A-I8', `savingsNeeded ${JSON.stringify(sn)}, want about ${amount}`);
  }
  if (answer.gapYears !== answer.shown.gapYears) fail('A-I8', 'gapYears ≠ shown.gapYears');

  // A-I10 part-time never hurts (yours: not asked once you have stopped)
  if (inputs.partTime && inputs.partTime.has) {
    const pt = answer.partTime;
    if (!pt) fail('A-I10', 'part-time asked for but no partTime block');
    else {
      if (pt.yearly !== inputs.partTime.yearly || pt.years !== inputs.partTime.years) fail('A-I10', 'partTime figures ≠ the inputs');
      if (pt.fromAge !== answer.shown.age || pt.toAge !== answer.shown.age + pt.years) fail('A-I10', `partTime ages ${pt.fromAge}–${pt.toAge}`);
      if (pt.lastedWith !== answer.shown.lasted || pt.runOutWith !== answer.shown.runOutAge) fail('A-I10', 'partTime "with" is not the shown row');
      if (pt.lastedWithout !== pt.without.lasted || pt.runOutWithout !== pt.without.runOutAge) fail('A-I10', 'partTime "without" disagrees with itself');
      // "more never pays less": the counts to one life, the bad-case age while the count holds (tests/v7/oracles/oneStep.mjs);
      // a household taking home £10,000 a month or more is not held to it (a NIGHTLY=1 run, 1 Oct 2026, seed -1221394728: a
      // couple spending £15,190 a month, one more year of £30,000 part-time pay — 11 lives of 20 → 10)
      const life = 1 / answer.basis.futures + 1e-9;
      if (!largeHousehold(pt.without.monthly.careful)) {
        if (pt.lastedWith < pt.lastedWithout - life) fail('A-I10', `part-time made it worse: ${pt.lastedWithout} → ${pt.lastedWith}`);
        if (pt.lastedWith >= pt.lastedWithout - 1e-12 && pt.runOutWith < pt.runOutWithout) fail('A-I10', `part-time made a bad case worse: ${pt.runOutWithout} → ${pt.runOutWith}`);
        if (pt.oneMore.lasted < pt.lastedWith - life) fail('A-I10', `one more year of part-time made it worse: ${pt.lastedWith} → ${pt.oneMore.lasted}`);
      }
      if (pt.oneMore.years !== pt.years + 1) fail('A-I10', 'partTime.oneMore.years');
      // To one step — except a household above £10,000 a month (for a couple the fixed-ratio drain, C's exceptions.md 4, in
      // proportion to the amount: 0.2% to 1.3% in NIGHTLY=1 runs, 1 Oct 2026): a finding (tests/v7/oracles/oneStep.mjs, largeHousehold)
      const proportional = largeHousehold(pt.without.monthly.careful);
      if (answer.shown.monthly.careful < pt.without.monthly.careful - 10 && !proportional) fail('A-I10', 'the careful amount fell with part-time work');
    }
  } else if (answer.partTime !== null) fail('A-I10', 'a partTime block with no part-time work');

  // The saving outcome, per person
  const people = couple ? ['you', 'partner'] : ['you'];
  if (answer.saving.length !== people.length || answer.saving.some((x, i) => x.who !== people[i])) fail('A-I9', `saving is for ${answer.saving.map((x) => x.who)}`);
  for (const x of answer.saving) {
    for (const part of ['pension', 'savings', 'total']) {
      const t = x.potAtStop[part];
      if (!(t.careful <= t.middling && t.middling <= t.good)) fail('A-I9', `saving ${x.who} potAtStop.${part} out of order`);
    }
    if (x.yearsSaving !== shownOwn[x.who] || x.stopAge !== inputs[x.who].age + shownOwn[x.who]) fail('A-I9', `saving ${x.who}: yearsSaving / stopAge (each their own)`);
    if (x.mix.saving !== inputs.savingRisk || x.mix.drawing !== inputs.risk) fail('A-I9', `saving ${x.who}: mix ${JSON.stringify(x.mix)}`);
    if (x.mix.slideYears !== (inputs.savingRisk !== inputs.risk ? 10 : 0)) fail('A-I9', `saving ${x.who}: slideYears ${x.mix.slideYears}`);
    if (Math.abs(x.chargeAYear - inputs.charge / 100) > 1e-12) fail('A-I9', `saving ${x.who}: chargeAYear ${x.chargeAYear}`);
  }

  // A-I11 what was assumed: every default named, entered values match, the lines that are always there
  const ids = answer.assumed.map((a) => a.id);
  if (new Set(ids).size !== ids.length) fail('A-I11', 'assumed ids repeat');
  for (const a of answer.assumed) {
    if (!['default', 'entered', 'rule'].includes(a.source)) fail('A-I11', `${a.id}: source ${a.source}`);
    if (a.source === 'default' && typeof a.field !== 'string') fail('A-I11', `${a.id} is a default with no field`);
  }
  for (const id of ['pot-as-is', 'start-later', 'start', 'no-charges', 'charge-saving']) if (ids.includes(id)) fail('A-I11', `the line ${id} has no place in A`);
  const ch = answer.assumed.find((a) => a.id === 'charges');
  if (ch && (ch.field !== 'charge' || ch.value !== inputs.charge)) fail('A-I11', `charges: field ${ch.field}, value ${ch.value} (input ${inputs.charge})`);
  if (!ch && (potsToday(inputs) > 0 || householdPayIn(inputs) > 0 || inputs.savingsIn > 0)) fail('A-I11', 'money in funds or cash, and no charges line');
  if (ids.includes('pay-in') && ids.includes('nothing-paid-in')) fail('A-I11', 'pay-in and nothing-paid-in together');
  const always = ['stop-age', 'spend-steady', 'plan-to', 'todays-prices', 'tax-rules'];
  if (shownOwn.last > 0) always.push('same-futures');
  // a couple: one stop for both says so; each on their own date, the pay line (couples-different-years.md 2.4)
  if (couple) always.push(answer.apart ? 'stop-apart' : 'stop-together', 'both-alive');
  if (answer.apart) {
    if (ids.includes('stop-together')) fail('A-I11', 'stop-together with the two stops apart');
    const line = answer.assumed.find((a) => a.id === 'stop-apart');
    if (line && (line.field !== 'untilBothStop' || line.source !== (inputs.untilBothStop ? 'entered' : 'default'))) fail('A-I11', `stop-apart ${line.field} ${line.source}`);
    if (ids.includes('savings-split')) fail('A-I11', 'savings-split with the two stops apart (savings-first)');
    if (inputs.savings > 0 && !ids.includes('savings-first')) fail('A-I11', 'savings, the stops apart, and no savings-first line');
    if (inputs.partner.stop && inputs.partner.stop.kind === 'already' && !ids.includes('partner-already')) fail('A-I11', 'the partner has stopped, and no partner-already line');
  } else if (ids.includes('stop-apart')) fail('A-I11', 'stop-apart with one stop for both');
  if (inputs.partTime) always.push(inputs.partTime.has ? 'work-tax' : 'no-part-time');
  else for (const id of ['work-tax', 'no-part-time']) if (ids.includes(id)) fail('A-I11', `${id} with no part-time question (you have stopped)`);
  if (inputs.spend.kind === 'level') always.push('spend-level');
  if (answer.shown.gapYears > 0 && !ids.some((id) => id.startsWith('pension-closed-until'))) fail('A-I11', 'a pension closed at the stop but no pension-closed-until line');
  if ((inputs.savings > 0 || inputs.savingsIn > 0)) always.push('isa-fixed-growth');
  if (inputs.savingRisk !== inputs.risk && shownOwn.last > 0 && (potsToday(inputs) > 0 || householdPayIn(inputs) > 0 || inputs.savingsIn > 0)) always.push('slide');
  for (const id of always) if (!ids.includes(id)) fail('A-I11', `assumed lacks ${id}`);
  if (inputs.savingRisk === inputs.risk && ids.includes('slide')) fail('A-I11', 'a slide line with the two levels the same');
  if (given) {
    const flatGiven = flatten(given);
    const flatInputs = flatten(inputs);
    for (const [field, [id, applies]] of Object.entries(ASSUMED_FIELD)) {
      if (!(field in flatInputs) || flatGiven[field] !== undefined || !applies(answer)) continue;
      const line = answer.assumed.find((a) => a.id === id);
      if (!line) fail('A-I11', `${field} was defaulted but ${id} is not under what was assumed`);
      else if (line.source !== 'default') fail('A-I11', `${field} was defaulted but ${id} says ${line.source}`);
    }
  }

  // A-I12 every sentence carries its own numbers; no banned word, no countdown; the headline names the verdict
  const scopes = scopesForA(inputs);
  const all = allSentences(answer);
  for (const x of all) {
    if (!x || typeof x.text !== 'string' || !Array.isArray(x.parts)) { fail('A-I12', `${x && x.id}: not a sentence`); continue; }
    if (partsText(x.parts, answer) !== x.text) fail('A-I12', `${x.id}: text ≠ parts joined`);
    for (const p of x.parts) {
      if (p && p.key !== undefined) {
        const v = get(answer, p.key);
        if (typeof v !== 'number') fail('A-I12', `${x.id}: key ${p.key} leads to ${v}`);
        else if (p.kind === 'money' && !x.text.includes(money(v))) fail('A-I12', `${x.id}: ${money(v)} not in text`);
        else if (p.kind === 'pot' && !x.text.includes(potText(v))) fail('A-I12', `${x.id}: ${potText(v)} not in text`);
      }
    }
    if (/undefined|NaN|\bnull\b|Infinity|\[object|-£0|£-|£NaN|\{|\}/.test(x.text)) fail('A-I12', `${x.id}: rubbish in "${x.text}"`);
    if (/£\d+\.\d/.test(x.text)) fail('A-I12', `${x.id}: pence in "${x.text}"`);
    if (COUNTDOWN.test(x.text)) fail('A-I12', `${x.id}: a countdown in "${x.text}"`);
    for (const hit of bannedHits(x.text, scopes, { context: all.map((y) => y.text).join(' ') })) fail('A-I12', `${x.id}: ${hit}`);
  }
  for (const id of ['head', 'sub', 'line', 'bad', 'range', 'pot']) if (!answer.sentences[id]) fail('A-I12', `no ${id} sentence`);
  if (!Array.isArray(answer.sentences.pays)) fail('A-I12', 'pays is not a list');
  if (!Array.isArray(answer.sentences.chart) || answer.sentences.chart.length !== rows.length) fail('A-I12', 'chart is not one sentence per row');
  if (answer.status === 'ok' && answer.sentences.head && !/^(a\.head\.)/.test(answer.sentences.head.id)) fail('A-I12', `head id ${answer.sentences.head.id}`);
  if (h.kind === 'named') {
    // a couple's "Yes — you could both stop when you are 60 (your partner 58)", unless the partner is past their State
    // Pension age: then "Yes — you could stop at 60", and a note says their money is left alone until then
    // Couples apart: "Yes — you could stop at 60" (the screen draws the partner's stop on its own line); about your partner
    // ("I've already stopped"): "Yes — your partner could stop at 56"
    const retired = couple && answer.warnings.some((w) => w.id === 'partner-stops-with-you');
    const want = ask.asked === 'partner' ? `a.head.partner.${answer.shown.verdict}`
      : couple && !retired && !answer.apart && answer.shown.verdict === 'yes' ? 'a.head.couple' : `a.head.${answer.shown.verdict}`;
    if (answer.sentences.head.id !== want) fail('A-I12', `head ${answer.sentences.head.id}, want ${want}`);
  }
  // the words of couples apart: the line names both stops; the years before the second stop are said with the pay
  if (answer.apart && answer.status === 'ok') {
    const ap = answer.apart;
    if (ask.asked === 'you' && h.kind === 'named' && !(answer.sentences.line.text.includes('your partner') && answer.sentences.line.text.includes('the younger of you was'))) fail('A-I12', `line does not name both stops: ${answer.sentences.line.text}`);
    const apartPays = answer.sentences.pays.filter((x) => x.id === 'a.pays.apart');
    const apartPhases = (answer.shown.phases || []).filter((q) => q.fromPay !== undefined);
    if (apartPays.length !== apartPhases.length) fail('A-I12', `${apartPays.length} a.pays.apart lines for ${apartPhases.length} phases before the second stop`);
    for (const x of apartPays) if (!/still working/.test(x.text)) fail('A-I12', `a.pays.apart does not say who is still working: ${x.text}`);
    if (ap.payCovers > 0 && apartPhases.some((q) => q.shown.fromPay > 0) && !apartPays.some((x) => /pay\b/.test(x.text))) fail('A-I12', 'the pay of the one still working is not named');
  }
  if (answer.sentences.head && h.kind !== 'noneWorked' && !answer.sentences.head.parts.some((p) => p && p.kind === 'age')) fail('A-I12', 'the headline names no age');
  if (answer.shown.oneMoreYear && answer.status === 'ok' && !answer.sentences.oneMore) fail('A-I12', 'one more year but no sentence');
  if (answer.partTime && !answer.sentences.partTime) fail('A-I12', 'part-time but no sentence');
  if (answer.savingsNeeded && !answer.sentences.savingsNeeded) fail('A-I12', 'savingsNeeded but no sentence');

  // A-I14 can be saved
  const text = JSON.stringify(answer);
  if (JSON.stringify(JSON.parse(text)) !== text) fail('A-I14', 'does not survive JSON');
  if (!answer.trace && text.length > 250000) fail('A-I14', `answer is ${text.length} characters`);
  return f;
}
