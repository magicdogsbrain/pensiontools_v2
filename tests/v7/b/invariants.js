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
import { RULES, SAVING, LEVEL_FAILS20, levelOf } from '../../../src/answers/shared/rules.js';
import { gridToShow, spendLevelAMonth, askedAbout, stopYearsOf, payInParts } from '../../../src/answers/shared/schemaParts.js';
import { bannedHits } from '../render/checkScreen.js';

/*
 * Couples who stop work in different years (research/v7/couples-different-years.md 5.3): the answer is about the person
 * still working — you, or your partner after "I've already stopped" (askedAbout) — and each person is at their own stop.
 * `stopsOfB(inputs)` gives the asked person, their stop age, each one's years to their own stop, who is still saving, and
 * the household's start (the first stop). With one stop for both every rule below is as it was.
 */
export function stopsOfB(inputs) {
  const asked = askedAbout(inputs);
  const stopAge = asked === 'partner' ? inputs.partner.stop.age : inputs.stop.age;
  const own = stopYearsOf(inputs, stopAge);
  const couple = inputs.household === 'couple' && inputs.partner;
  const list = couple ? [own.you, own.partner] : [own.you];
  const first = Math.min(...list);
  const apart = couple && own.you !== own.partner;
  const saves = (who) => !apart || own[who] > 0;
  return { asked, stopAge, own, first, last: Math.max(...list), apart, saves, S: own[asked] };
}

const UNITS = { money: 'todays-prices', tax: 'after-tax', period: 'month', who: 'household' };
const THREE = ['careful', 'middling', 'good'];
const STATUSES = ['ok', 'guaranteed-only', 'out-of-reach', 'none'];
const LEVERS = ['stopLater', 'payMore', 'spendLess', 'oneOff', 'moreRisk', 'accept'];
const RISKS = ['cautious', 'balanced', 'adventurous'];
const KEYS = ['inputs', 'whose', 'spend', 'stop', 'ages', 'years', 'pensionOpens', 'gapYears', 'saving', 'level', 'levels', 'already', 'chance', 'onCourse', 'verdict', 'income', 'gap', 'enough',
  'payIn', 'potAtStop', 'short', 'monthlyIfShort', 'wholeLife', 'outside', 'levers', 'grid', 'phases', 'guaranteed', 'assumed', 'warnings',
  'sentences', 'basis', 'units'];
/** No length of time to wait, anywhere in A or B (brief conflict 47's `countdown-any`). */
export const COUNTDOWN = /\b\d+ (more )?(years?|months?) (to go|until|till|before|from now)\b/i;
const SCOPES = ['all', 'first', 'planner', 'result'];

/** The positions in a sorted spread of n figures (band.js bandIndexes, written again here). */
export const positions = (n) => ({ careful: Math.floor(n / 10), middling: Math.floor(n / 2), good: n - Math.ceil(n / 10) });
/**
 * How many lives may miss (7.8.0, while not weighing): `nineInTen` the level's own count, floor(t·n/20) (Balanced: floor(n/10));
 * `threeInFour` the close band's, floor(n/4) (never below the level's).
 */
export const allowedAt = (n, level = 'balanced') => {
  const yes = Math.floor((LEVEL_FAILS20[level] * n) / 20);
  return { nineInTen: yes, threeInFour: Math.max(yes, Math.floor(n / 4)) };
};

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

/** The people of a checked input: [{ who, age, pot, payIn: { total, own, employer }, alreadyDrawing }] — the pay-in by the one reader (a share of pay as the pounds it lands). */
export function peopleOf(inputs) {
  const whos = inputs.household === 'couple' && inputs.partner ? ['you', 'partner'] : ['you'];
  return whos.map((who) => {
    const p = inputs[who];
    const { total, own, employer } = payInParts(p.payIn);
    return { who, age: p.age, pot: p.pot || 0, payIn: { total, own, employer }, alreadyDrawing: Boolean(p.alreadyDrawing), statePension: p.statePension, finalSalary: p.finalSalary };
  });
}

/** What lands in the pensions each month in all is at most the £10,000 the household takes (a split can add to more). */
export const withinCeiling = (inputs) => peopleOf(inputs).every((p) => p.payIn.total <= SAVING.payInCeiling);

/**
 * Whether B has a question for these inputs: not a couple who have both stopped ("I've already stopped" and "They already
 * have": the screen shows the retired view, and B answers 'invalid' with partner-stop-after-now — couples-different-years.md 2.2).
 */
export const asksB = (inputs) => !(inputs.stop && inputs.stop.kind === 'already' && inputs.partner && inputs.partner.stop && inputs.partner.stop.kind === 'already');

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
  const st = stopsOfB(inputs);
  // (someone who has stopped pays nothing in: their pay-in is not the household's)
  const people = peopleOf(inputs).map((p) => (st.saves(p.who) ? p : { ...p, payIn: { total: 0, own: null, employer: null } }));
  const savers = people.filter((p) => st.saves(p.who));
  const S = st.S;
  const allowed = allowedAt(n, answer.level);
  // 7.8.0, weighing: every verdict, "on course" and "would be enough" is the level's one test on the weighted chance —
  // yes when it is at least 1 − t/20 (rules.js passes, on whole numbers; read back from the share, a chance on the line
  // itself may go either way), close within one more twentieth. Not weighing: the counts as before.
  const W = Boolean(b.weighted);
  const T20 = LEVEL_FAILS20[answer.level];
  const onLine = (w, t = T20) => Math.abs(w - (1 - t / 20)) < 1e-9;
  const passesW = (w, t = T20) => w >= 1 - t / 20 - 1e-9;
  const bandW = (w) => (passesW(w) ? 'yes' : passesW(w, T20 + 1) ? 'close' : 'no');
  const LV = answer.levels;
  const lvShown = LV && LV[answer.level];
  if ((answer.askedAbout || 'you') !== st.asked) fail('B2', `askedAbout ${answer.askedAbout}, the inputs ask about ${st.asked}`);
  if (Boolean(answer.apart) !== st.apart) fail('B2', `apart ${JSON.stringify(answer.apart)}, the stops ${JSON.stringify(st.own)}`);
  if (answer.apart) {
    for (const who of ['you', 'partner']) if (answer.apart.stops[who].age !== inputs[who].age + st.own[who]) fail('B2', `apart.stops.${who}.age ${answer.apart.stops[who].age}`);
    if (answer.apart.years !== st.last - st.first) fail('B2', `apart.years ${answer.apart.years}`);
    if (Boolean(answer.apart.coverUsed) !== answer.warnings.some((w) => w.id === 'apart-cover-used')) fail('B13', 'apart.coverUsed ⟺ the apart-cover-used warning');
  }

  // B2 the basis and the plain facts of the question
  if (b.level !== answer.level || b.levelFails20 !== LEVEL_FAILS20[answer.level]) fail('B2', `basis.level ${b.level} / ${b.levelFails20}`);
  if (!lvShown || !['careful', 'balanced', 'bold'].every((k) => LV[k] && 'pot' in LV[k])) fail('B2', 'no levels');
  for (const [k, v] of Object.entries({ bondDraws: 'life', cashRule: 'previous-year', grid: 'yearly', strategyId: 'pots-and-valves', cutsSwitchedOff: true,
    potStep: SAVING.potStep, potMax: SAVING.potMax, payInCeiling: SAVING.payInCeiling * savers.length, laterYears: SAVING.laterYears })) {
    if (b[k] !== v) fail('B2', `basis.${k} = ${b[k]}, not ${v}`);
  }
  if (!['answer', 'grid'].includes(b.detail)) fail('B2', `basis.detail ${b.detail}`);
  if (!(S >= 1)) fail('B2', `a stop ${S} years on`);
  if (answer.stop.age !== st.stopAge) fail('B2', 'stop.age is not the age asked about');
  if (answer.stop.year !== String(Number(b.today.slice(0, 4)) + S)) fail('B2', `stop.year ${answer.stop.year}`);
  if (answer.years.saving !== S) fail('B2', `years.saving ${answer.years.saving} ≠ ${S}`);
  // the household's start: the first stop (one stop for both: the stop)
  const youngerAtStop = Math.min(...people.map((p) => p.age)) + st.first;
  const D = Math.min(b.weighted ? RULES.maxDrawYears : RULES.maxYears, inputs.endAge - youngerAtStop);
  if (answer.years.drawing !== D) fail('B2', `years.drawing ${answer.years.drawing} ≠ ${D}`);
  if (b.endAge !== youngerAtStop + D) fail('B2', `basis.endAge ${b.endAge} ≠ ${youngerAtStop + D}`);
  // (weighing: the lives run on to the later of the plan-to age and the weighting age, within the cap — the run's years)
  const runYears = W ? Math.min(RULES.maxDrawYears, Math.max(inputs.endAge, b.weightToAge) - youngerAtStop) : D;
  if (b.lifeYears !== st.first + runYears) fail('B2', `basis.lifeYears ${b.lifeYears} ≠ ${st.first + runYears}`);
  for (const p of people) if (answer.ages[p.who] !== p.age + st.own[p.who]) fail('B2', `ages.${p.who} ${answer.ages[p.who]} ≠ ${p.age + st.own[p.who]}`);
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

  // B3 the number (7.8.0: the pot at each level): whole £1,000, Careful ≥ Balanced ≥ Bold; nought when the pensions cover
  // the spend; none when out of reach. `num.careful` below is the level chosen's (the figure the answer stands behind)
  const num = !lvShown || lvShown.pot === null ? null : { careful: lvShown.pot, byPerson: lvShown.byPerson };
  if (num === null) {
    if (answer.status !== 'out-of-reach') fail('B3', 'no number, but the status is not out-of-reach');
  } else {
    for (const k of ['careful', 'balanced', 'bold']) { const v = LV[k].pot; if (v !== null && (!Number.isInteger(v / 1000) || v < 0 || v > SAVING.potMax)) fail('B3', `levels.${k}.pot = ${v}`); }
    if (LV.careful.pot !== null && !(LV.careful.pot >= LV.balanced.pot)) fail('B3', 'Careful asks for a smaller pot than Balanced');
    if (LV.balanced.pot !== null && !(LV.balanced.pot >= LV.bold.pot)) fail('B3', 'Balanced asks for a smaller pot than Bold');
    if (answer.status === 'guaranteed-only' && (LV.careful.pot !== 0 || LV.bold.pot !== 0)) fail('B3', 'guaranteed-only but a number above nought');
    // (a nought with status ok has a payer outside the number: savings, the closed years' floor — or, a couple apart, the
    // pension pot of the one who has stopped, kept as given outside the number (couples-different-years.md 5.3 and 4.3 m)
    // and paying the spend in every life; the State Pensions, starting after the end, do not make it guaranteed-only. The
    // rule predates couples apart. A NIGHTLY=1 run, 27 Oct 2026, seeds 1756355417, -674284166, -747469614 and 1794282138:
    // you with nothing, still working, your partner stopped with £23 to £1,073,100 in a pension)
    const stoppedPot = Boolean(answer.apart) && people.some((p) => !st.saves(p.who) && p.pot > 0);
    if (answer.status === 'ok' && num.careful === 0 && !(inputs.savings > 0 || inputs.savingsIn > 0) && !answer.outside && !stoppedPot) fail('B3', 'status ok with a number of nought, and no savings to pay instead');
    if (!Array.isArray(num.byPerson) || num.byPerson.length !== people.length) fail('B3', 'levels[level].byPerson is not one per person');
    else if (num.byPerson.reduce((s, x) => s + x.pot, 0) !== num.careful) fail('B3', 'levels[level].byPerson does not add up to the pot');
    // (couples apart: the pensions of those still saving — the number's)
    const today = savers.reduce((s, p) => s + p.pot, 0);
    if (answer.already !== (today >= num.careful)) fail('B3', `already ${answer.already} but today's pension is ${today} against ${num.careful}`);
  }

  // B4 the chance is the one test (J9): the lives in which the money lasted to the end age, paying in as now and then
  // spending the target — the whole-life count, A's verdict at the stop age
  const ch = { ...answer.chance, lasted: answer.chance.fixedAge };
  if (!Number.isInteger(ch.fails) || ch.fails < 0 || ch.fails > n) fail('B4', `chance.fails ${ch.fails}`);
  if (Math.abs(ch.lasted - (n - ch.fails) / n) > 1e-12) fail('B4', 'chance.fixedAge ≠ (n − fails) / n');
  // (a typed end age below the plan-to age lets a future that runs out after it count as lasting to it while it still weighs)
  // (the plan-to age from the tables: a future that runs out after it still weighs, at most 1 in 10 — never below 9/10)
  if (ch.horizonRule === 'survival' && ch.weighted < 0.9 * ch.lasted - 1e-12) fail('B4', 'chance.weighted below 9/10 of chance.fixedAge');
  if (W ? !onLine(ch.weighted) && answer.onCourse !== passesW(ch.weighted) : answer.onCourse !== (ch.fails <= allowed.nineInTen)) fail('B4', `onCourse ${answer.onCourse} with ${ch.fails} of ${n} short (weighted ${ch.weighted})`);
  if (ch.lasted !== answer.wholeLife.lasted) fail('B4', `chance.fixedAge ${ch.lasted} is not the whole life's ${answer.wholeLife.lasted}: one test`);

  // B5 the pay-ins: whole £10, what is needed at the chosen confidence, 9 in 10 never less than 3 in 4, on course ⟺ enough now
  const pi = answer.payIn;
  const nowTotal = people.reduce((s, p) => s + p.payIn.total, 0);
  if (pi.now !== nowTotal) fail('B5', `payIn.now ${pi.now} ≠ ${nowTotal}`);
  // to the penny: each person's total is their two parts added to the penny (payInParts), and the parts are summed apart
  if (pi.own !== null && Math.abs(pi.own + pi.employer - pi.now) > 0.005) fail('B5', 'own + employer ≠ now');
  if (answer.level !== levelOf(inputs.confidence)) fail('B5', 'the level is not the one asked for');
  const at = { nineInTen: lvShown ? lvShown.payIn : null };
  if (at.nineInTen !== null && at.nineInTen !== undefined && (!Number.isInteger(at.nineInTen / 10) || at.nineInTen < 0 || at.nineInTen > b.payInCeiling)) fail('B5', `levels[level].payIn = ${at.nineInTen}`);
  if (pi.needed !== at.nineInTen) fail('B5', 'payIn.needed ≠ levels[level].payIn');
  if (pi.extra !== (pi.needed === null ? 0 : Math.max(0, pi.needed - pi.now))) fail('B5', `payIn.extra ${pi.extra}`);
  const savingsShort = pi.outside !== null && pi.outside > (pi.savingsNow || 0);
  if (num !== null && answer.status !== 'guaranteed-only') {
    if (answer.onCourse && !(at.nineInTen !== null && at.nineInTen < pi.now + 10)) fail('B5', `on course at ${pi.now} but the level needs ${at.nineInTen}`);
    // not on course: more must go into the pension — or, before a pension opens, into savings
    if (!answer.onCourse && at.nineInTen !== null && !(at.nineInTen > pi.now) && !savingsShort) fail('B5', `not on course at ${pi.now} but the level needs only ${at.nineInTen}`);
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
  if ((wl.runOutAge === b.endAge) !== (wlFails <= Math.floor(n / 10))) fail('B7', `bad case lasted = ${wl.runOutAge === b.endAge} with ${wlFails} of ${n} run out`);

  // B8 the levers: the fixed five in order, each null or its shape; honest about what it claims
  const lv = answer.levers;
  if (JSON.stringify(Object.keys(lv)) !== JSON.stringify(LEVERS)) fail('B8', `levers ${Object.keys(lv)}`);
  if (JSON.stringify(lv.accept) !== JSON.stringify({ lasted: ch.lasted, ...(W ? { weighted: ch.weighted } : {}), short: answer.short, monthlyIfShort: answer.monthlyIfShort })) fail('B8', 'levers.accept is not the answer as it stands');
  if (answer.onCourse) for (const k of ['stopLater', 'payMore', 'spendLess', 'moreRisk']) if (lv[k] !== null) fail('B8', `on course but levers.${k} is set`);
  if (inputs.savingRisk === 'adventurous' && lv.moreRisk !== null) fail('B8', 'moreRisk with the saving risk already adventurous');
  if (lv.moreRisk) {
    if (lv.moreRisk.level !== RISKS[RISKS.indexOf(inputs.savingRisk) + 1]) fail('B8', `moreRisk.level ${lv.moreRisk.level}`);
    const helps = lv.moreRisk.payIn !== null && (pi.needed === null || (pi.needed > pi.now && lv.moreRisk.payIn < pi.needed));
    if (lv.moreRisk.helps !== helps) fail('B8', 'moreRisk.helps is not the comparison it claims');
  }
  // (what would be enough, saving-enough-and-check-in.md 3.5: the lever is the enough figure at the confidence asked for,
  // in the person's own kind, with the count B asked again at it; before that, and when only the savings fall short, B's
  // own whole £10)
  const en = answer.enough;
  const lead = en && !en.savingsOnly ? en.atLevel : null;
  if (lv.payMore) {
    const m = lv.payMore;
    if (en && !en.savingsOnly) {
      if (!lead) fail('B8', 'payMore with nothing that would be enough');
      else {
        if (m.payIn !== lead.payIn || m.lasted !== lead.lasted) fail('B8', `payMore ${m.payIn} (${m.lasted}) is not what would be enough, ${lead.payIn} (${lead.lasted})`);
        if (Number.isFinite(lead.totalPct) !== Number.isFinite(m.totalPct) || (Number.isFinite(m.totalPct) && (m.totalPct !== lead.totalPct || m.ownPct !== lead.ownPct))) fail('B8', 'payMore is not in the shares that would be enough');
        if (!(m.payIn > pi.now || m.savingsIn !== null)) fail('B8', 'payMore changes nothing');
      }
    } else {
      if (m.payIn !== Math.max(pi.needed, pi.now)) fail('B8', `payMore.payIn ${m.payIn} is not the pay-in that gets there (never less than now's)`);
      if (!(pi.needed > pi.now || (m.savingsIn !== null && m.savingsIn > (pi.savingsNow || 0)))) fail('B8', 'payMore changes nothing');
    }
    if (m.savingsIn !== null && m.savingsIn !== pi.outside) fail('B8', `payMore.savingsIn ${m.savingsIn} is not payIn.outside ${pi.outside}`);
    if (!(answer.basis && answer.basis.weighted) && m.lasted < 1 - allowed.nineInTen / n - 1e-12) fail('B8', `payMore lasted in only ${m.lasted}`);
  } else if (lead && !answer.onCourse && (lead.payIn > pi.now || lead.savingsIn !== null)) fail('B8', 'something would be enough, and no payMore');
  if (lv.oneOff) {
    const o = lv.oneOff;
    if (!Number.isInteger(o.amount / 1000) || !(o.amount >= 1000) || o.amount > SAVING.potMax) fail('B8', `oneOff.amount ${o.amount}`);
    if (!(answer.basis && answer.basis.weighted) && o.lasted < 1 - allowed.nineInTen / n - 1e-12) fail('B8', `oneOff lasted in only ${o.lasted}`);
    // a person at a time, the sum with a year of what goes in now (both count in the same tax year)
    const lumpOf = (w) => (Array.isArray(o.byPerson) ? (o.byPerson.find((x) => x.who === w) || { amount: 0 }).amount : o.amount);
    const over = people.filter((q) => lumpOf(q.who) > 0 && lumpOf(q.who) + q.payIn.total * 12 > RULES.annualAllowance).map((q) => q.who);
    if (o.overAllowance !== (over.length > 0) || JSON.stringify(o.over) !== JSON.stringify(over)) fail('B8', `oneOff.over ${JSON.stringify(o.over)} is not the comparison it claims (${JSON.stringify(over)})`);
    if ((people.length > 1) !== Array.isArray(o.byPerson)) fail('B8', 'oneOff.byPerson for a couple, and only then');
    if (Array.isArray(o.byPerson) && o.byPerson.reduce((t, x) => t + x.amount, 0) !== o.amount) fail('B8', 'oneOff.byPerson does not add up');
  }
  if (lv.stopLater) {
    const s = lv.stopLater;
    if (!(s.age > st.stopAge && s.age <= RULES.stopAgeMax)) fail('B8', `stopLater.age ${s.age}`);
    if (!(answer.basis && answer.basis.weighted) && s.lasted < 1 - allowed.nineInTen / n - 1e-12) fail('B8', `stopLater lasted in only ${s.lasted}`);
  }
  if (lv.spendLess) {
    const s = lv.spendLess;
    if (!Number.isInteger(s.spend / 10) || !(s.spend < spend)) fail('B8', `spendLess.spend ${s.spend}`);
    if (s.spend !== answer.monthlyIfShort) fail('B8', 'spendLess.spend is not monthlyIfShort (the careful amount paying in as now)');
    if (!(answer.basis && answer.basis.weighted) && s.lasted < 1 - allowed.nineInTen / n - 1e-12) fail('B8', `spendLess lasted in only ${s.lasted}`);
  }

  // B9 the grid, only with detail 'grid': the rows and columns of gridToShow; more pay-in never reaches it in fewer lives
  if (b.detail !== 'grid' && answer.grid !== null) fail('B9', 'a grid without detail "grid"');
  if (b.detail === 'grid') {
    const g = answer.grid;
    // (a share of pay: the columns are shares up to what would be enough, saving-enough-and-check-in.md 3.4)
    const enoughPct = en && en.how === 'share' && en.atLevel && Number.isFinite(en.atLevel.totalPct) ? en.atLevel.totalPct : null;
    const want = gridToShow(inputs, { today: b.today }, { stopLater: lv.stopLater ? lv.stopLater.age : null, needed: pi.needed, enoughPct });
    if (!g) fail('B9', 'detail "grid" but no grid');
    else {
      if (JSON.stringify(g.payIns) !== JSON.stringify(want.payIns)) fail('B9', `grid.payIns ${g.payIns} ≠ ${want.payIns}`);
      if (JSON.stringify(g.shares) !== JSON.stringify(want.shares || null)) fail('B9', `grid.shares ${g.shares} ≠ ${want.shares}`);
      if (JSON.stringify(g.ages.map((r) => r.age)) !== JSON.stringify(want.ages)) fail('B9', `grid ages ${g.ages.map((r) => r.age)} ≠ ${want.ages}`);
      for (const row of g.ages) {
        if (JSON.stringify(row.cells.map((c) => c.payIn)) !== JSON.stringify(g.payIns)) fail('B9', `row ${row.age}: cells are not the columns`);
        row.cells.forEach((c, j) => {
          if (JSON.stringify(c.outOfTen) !== JSON.stringify(outOfTen(c.lasted))) fail('B9', `row ${row.age} cell ${j}: outOfTen`);
          if (j > 0 && c.lasted < row.cells[j - 1].lasted) fail('B9', `row ${row.age}: more pay-in lasted in fewer lives`);
          const cellFails = Math.round((1 - c.lasted) * n);
          // (weighing: the level's one test on the cell's weighted chance; not weighing, the count)
          const cellWant = W ? bandW(c.weighted) : cellFails <= allowed.nineInTen ? 'yes' : cellFails <= Math.floor(n / 4) ? 'close' : 'no';
          if (!(W && (onLine(c.weighted) || onLine(c.weighted, T20 + 1))) && c.verdict !== cellWant) fail('B9', `row ${row.age} cell ${j}: verdict ${c.verdict}`);
        });
        if (row.number !== null && !Number.isInteger(row.number / 1000)) fail('B9', `row ${row.age}: number ${row.number}`);
      }
      if (g.reaches !== g.ages.some((r) => r.cells.some((c) => c.verdict === 'yes'))) fail('B9', 'grid.reaches is not "some cell lasted in 9 in 10"');
      if (lv.stopLater && !g.ages.some((r) => r.age === lv.stopLater.age)) fail('B9', 'the grid has no row for the stop-later age');
      if (g.shares) {
        if (enoughPct !== null && en.atLevel.payIn > pi.now && !g.shares.includes(enoughPct)) fail('B9', 'the grid in shares has no column for the share that would be enough');
      } else if (pi.needed !== null && pi.needed > pi.now && !g.payIns.includes(pi.needed)) fail('B9', 'the grid has no column for the pay-in that gets there');
      const own = g.ages.find((r) => r.age === st.stopAge);
      if (own && num !== null) {
        // (weighing, 7.8.0: every row's number is the count at the level to the plan-to age — one definition for the column,
        // said beside the grid — so the stop's row is not the answer's weighted pot; not weighing, it is the number)
        if (!W && own.number !== num.careful) fail('B9', 'the grid\'s row for the stop age has another number');
        if (g.payIns[0] === pi.now && own.cells[0].lasted !== ch.lasted) fail('B9', 'the grid\'s cell for today is not the chance');
      }
    }
  }

  // B10 the phases add up, from the stop to the end age; a closed pension pays nothing
  const ph = answer.phases;
  if (!Array.isArray(ph) || !ph.length) fail('B10', 'no phases');
  else {
    ph.forEach((p, i) => {
      // (couples apart, before the second stop: plus what the pay of the one still working covers)
      const sum = p.fromPots + p.statePension + p.finalSalary + p.fromWork + (p.fromPay || 0) - p.tax;
      if (Math.abs(sum - p.takeHome) > 0.03) fail('B10', `phase ${i}: the parts do not add up to ${p.takeHome}`);
      if (Math.abs(p.fromPension + p.fromSavings - p.fromPots) > 0.02) fail('B10', `phase ${i}: fromPots ≠ fromPension + fromSavings`);
      if (p.shown.fromPots + p.shown.statePension + p.shown.finalSalary + p.shown.fromWork + (p.shown.fromPay || 0) !== p.shown.takeHome) fail('B10', `phase ${i}: shown figures do not add up`);
      if ((p.fromPay !== undefined) !== Boolean(answer.apart && p.fromAge < youngerAtStop + st.last - st.first)) fail('B10', `phase ${i}: fromPay in the wrong years`);
      if (typeof p.pensionOpen !== 'boolean') fail('B10', `phase ${i}: pensionOpen`);
      for (const who of Object.keys(p.ages)) {
        const me = p.byPerson.find((x) => x.who === who);
        if (me && me.locked && me.fromPension > 0.005) fail('B10', `phase ${i}: ${who}'s pension is closed but pays ${me.fromPension}`);
      }
      if (i > 0 && p.fromAge !== ph[i - 1].toAge) fail('B10', `phase ${i} does not touch phase ${i - 1}`);
    });
    if (ph[0].fromAge !== inputs.stop.age && inputs.household !== 'couple') fail('B10', `the first phase starts at ${ph[0].fromAge}, not the stop age`);
    if (ph[ph.length - 1].toAge !== b.endAge) fail('B10', 'the last phase does not end at the end age');
    // (couples apart: a stretch before the second stop that nobody's money pays and the pay does not make up is a run-out)
    if (answer.status === 'ok' && ph[0].takeHome < spend - 0.01 && !(answer.apart && ph[0].fromPay !== undefined && !answer.apart.coversGap)) fail('B10', `the first phase pays ${ph[0].takeHome}, less than the spend`);
  }
  if (answer.outside) {
    if (!(answer.gapYears > 0)) fail('B10', 'outside without a closed pension at the stop');
    if (answer.outside.untilAge !== inputs.stop.age + answer.gapYears && inputs.household !== 'couple') fail('B10', `outside.untilAge ${answer.outside.untilAge}`);
    // (with no pension in the phases at all — none today, nothing paid in, a number of nought — no year is "closed":
    // the savings pay every year, and there is no closed draw to compare)
    // (couples apart: from where the pay of the one still working stops covering)
    const checkFrom = !answer.apart ? -Infinity : youngerAtStop + (answer.apart.payCovers >= 1 || answer.apart.coversGap ? answer.apart.years : 0);
    // (couples apart: each closed phase counted for the years it shares with the closed years — the phases are cut where the
    // pensions they hold open, and a pension the number leaves at nought cuts none)
    // (couples apart under "None of it": checkFrom is the first stop, and the years before the second stop — the first
    // stopper's own savings paying while the other still works (fromPay) — are closed years to the answer too (outsideOf
    // measures from checkYearOf, couples-different-years.md 5.3), although the breakdown marks them pensionOpen when the one
    // still working has nothing closed. Under Half and All checkFrom is the second stop and they fall out as before. A
    // NIGHTLY=1 run, 27 Oct 2026, seed 2014517166: you 18, already stopped, with £1 of savings; your partner stopping at 19)
    const closedPhases = answer.apart
      ? ph.filter((p) => (!p.pensionOpen || p.fromPay !== undefined) && p.fromAge < answer.outside.untilAge && p.toAge > checkFrom)
        .map((p) => ({ draw: p.fromSavings, years: Math.min(p.toAge, answer.outside.untilAge) - Math.max(p.fromAge, checkFrom) }))
      : ph.filter((p) => !p.pensionOpen && p.toAge <= answer.outside.untilAge).map((p) => ({ draw: p.fromSavings, years: p.toAge - p.fromAge }));
    const closedDraw = closedPhases.reduce((s, p) => s + p.draw * 12 * p.years, 0);
    const closedYears = closedPhases.reduce((s, p) => s + p.years, 0);
    // (couples apart under "None of it" with nothing to draw: the stretch before the second stop that nobody's money pays
    // shows as what it is — short, a run-out — while outside.amount says what savings it would take; nothing to compare)
    const unpaid = answer.apart && ph.some((p) => p.fromPay !== undefined && p.takeHome < spend - 0.01);
    // to the rounding: the answer sums the plan's periods at full precision and rounds once (outsideOf, Math.round — half a
    // pound), while a phase's monthly fromSavings is rounded to pence (stopAt.js round2) — up to £0.005 × 12 = £0.06 a year
    // over the closed years (a NIGHTLY=1 run, 27 Oct 2026, seed 656056525: £46.3667 a month shown as £46.37 for 33 of 37
    // closed years, £70,777 against £70,778.52)
    if (ph.some((p) => !p.pensionOpen) && !unpaid && Math.abs(answer.outside.amount - closedDraw) > 0.5 + 0.06 * closedYears) fail('B10', `outside.amount ${answer.outside.amount} ≠ the closed years' savings draw ${closedDraw}`);
  }

  // B11 the saving years, one per person
  if (!Array.isArray(answer.saving) || answer.saving.length !== people.length) fail('B11', 'saving is not one per person');
  else {
    answer.saving.forEach((s, i) => {
      const p = people[i];
      const mine = st.own[p.who];
      if (s.who !== p.who || s.stopAge !== p.age + mine || s.yearsSaving !== mine) fail('B11', `saving[${i}] who / stop / years`);
      if (s.payIn.total !== p.payIn.total) fail('B11', `saving[${i}].payIn.total`);
      if (Math.abs(s.paidIn.total - p.payIn.total * 12 * mine) > 0.005) fail('B11', `saving[${i}].paidIn.total ≠ pay-in × 12 × ${mine}`);
      if (s.potToday.pension !== p.pot) fail('B11', `saving[${i}].potToday.pension`);
      for (const part of ['pension', 'savings', 'total']) {
        const t = s.potAtStop[part];
        if (!(t.careful <= t.middling && t.middling <= t.good)) fail('B11', `saving[${i}].potAtStop.${part} out of order`);
      }
      if (Math.abs(s.chargeAYear - inputs.charge / 100) > 1e-12) fail('B11', `saving[${i}].chargeAYear ${s.chargeAYear}`);
      if (s.mix.saving !== inputs.savingRisk || s.mix.drawing !== inputs.risk || s.mix.slideYears !== (inputs.savingRisk === inputs.risk ? 0 : SAVING.slideYears)) fail('B11', `saving[${i}].mix`);
    });
  }

  // B12 every default that was used is listed; the lines that are always there
  const ids = answer.assumed.map((a) => a.id);
  if (new Set(ids).size !== ids.length) fail('B12', 'assumed ids repeat');
  // (a run the 60-year cap stops at or before the plan-to age says only that: "We could test only to …", life-capped)
  const cutShort = W && ids.includes('life-capped') && !ids.includes('life-plan-to');
  for (const a of answer.assumed) {
    if (a.source === 'default' && typeof a.field !== 'string') fail('B12', `${a.id} is a default with no field`);
    if (!['default', 'entered', 'rule'].includes(a.source)) fail('B12', `${a.id}: source ${a.source}`);
  }
  const always = ['pay-in-as-given', 'risk-saving', 'risk-drawing', 'charges', 'same-futures', 'saving-rebalanced', 'stop-age', 'spend-steady',
    'number-is-careful', 'confidence', W ? (cutShort ? 'life-capped' : 'life-plan-to') : 'plan-to', 'todays-prices', 'tax-rules'];
  always.push(nowTotal > 0 ? 'pay-in' : 'nothing-paid-in');
  // a couple: one stop for both says so; each on their own date, the pay line (couples-different-years.md 2.4)
  if (inputs.household === 'couple') always.push(answer.apart ? 'stop-apart' : 'stop-together', (answer.basis && answer.basis.weighted) ? 'life-couple' : 'both-alive');
  if (inputs.household === 'couple' && nowTotal > 0 && savers.length === 2) always.push('pay-in-split');
  if (answer.apart) {
    if (ids.includes('stop-together')) fail('B12', 'stop-together with the two stops apart');
    if (ids.includes('savings-split')) fail('B12', 'savings-split with the two stops apart (savings-first)');
    if (inputs.savings > 0 && !ids.includes('savings-first')) fail('B12', 'savings, the stops apart, and no savings-first line');
  } else if (ids.includes('stop-apart')) fail('B12', 'stop-apart with one stop for both');
  if (inputs.spend.kind === 'level') always.push('spend-level');
  if (inputs.savingRisk !== inputs.risk) always.push('slide');
  always.push('savings-in');
  // how the savings grow (6.22.0): said whenever there is money in savings, with its field and the choice in the inputs
  if (inputs.savingsIn > 0 || inputs.savings > 0) always.push('savings-growth');
  const sg = answer.assumed.find((a) => a.id === 'savings-growth');
  if (sg && (sg.field !== 'isaGrowth' || sg.value !== inputs.isaGrowth)) fail('B12', `savings-growth: field ${sg.field}, value ${sg.value} (input ${inputs.isaGrowth})`);
  if ((inputs.savings > 0 || inputs.savingsIn > 0) !== ('isaGrowth' in inputs) && given && given.isaGrowth === undefined) fail('B12', `isaGrowth in the inputs ${'isaGrowth' in inputs}, money in savings ${inputs.savings > 0 || inputs.savingsIn > 0}`);
  if (ids.includes('isa-fixed-growth')) fail('B12', 'the line isa-fixed-growth went in 6.22.0');
  if (answer.outside) always.push('outside-first');
  for (const id of always) if (!ids.includes(id)) fail('B12', `assumed lacks ${id}`);
  if (answer.gapYears > 0 && !ids.some((id) => id.startsWith('pension-closed-until'))) fail('B12', 'a pension closed at the stop, and no pension-closed-until line');
  for (const never of ['pot-as-is', 'start-later', 'start', 'no-charges', 'charge-saving', 'steady', 'risk']) if (ids.includes(never)) fail('B12', `assumed has the line ${never}`);
  const chargesLine = answer.assumed.find((a) => a.id === 'charges');
  if (chargesLine && (chargesLine.field !== 'charge' || chargesLine.value !== inputs.charge)) fail('B12', `charges: field ${chargesLine.field}, value ${chargesLine.value} (input ${inputs.charge})`);
  if (inputs.savingRisk === inputs.risk && ids.includes('slide')) fail('B12', 'a slide line with one risk level');
  if (given) {
    const flat = flatten(given);
    const FIELD = { savingsIn: 'savings-in', savingRisk: 'risk-saving', risk: 'risk-drawing', charge: 'charges', isaGrowth: 'savings-growth', endAge: W ? (cutShort ? null : 'life-plan-to') : 'plan-to', confidence: 'confidence',
      'you.statePension.kind': 'state-pension-full', 'partner.statePension.kind': 'state-pension-full-partner',
      'you.finalSalary.has': 'no-final-salary', 'partner.finalSalary.has': 'no-final-salary-partner', 'partner.pot': 'partner-no-pot' };
    const applies = flatten(inputs);
    for (const [field, id] of Object.entries(FIELD)) {
      if (!(field in applies) || flat[field] !== undefined || id === null) continue;
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
  // (couples apart: the pay-in that gets there is shared among those still saving)
  const share = savers.length;
  // (the figure the words state: what would be enough at the chance asked for, each person's part — a share lands up to
  // a grid step above B's £10, and the warnings are about what the person is told to pay in; no enough block, B's own)
  const enLead = answer.enough ? answer.enough.atLevel : null;
  const neededOf = (p) => (answer.enough ? (enLead ? (enLead.parts.find((x) => x.who === p.who) || { payIn: 0 }).payIn : 0)
    : pi.needed === null || !st.saves(p.who) ? 0 : nowTotal > 0 ? pi.needed * p.payIn.total / nowTotal : pi.needed / share);
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
  if (has('long-plan') !== (inputs.endAge - youngerAtStop > (W ? RULES.maxDrawYears : RULES.maxYears))) fail('B13', 'long-plan');

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
  if (answer.grid && num !== null && answer.grid.payIns.length && answer.grid.ages.some((r) => r.age === st.stopAge) && !S_.gridCell) fail('B14', 'a grid with the stop age\'s row and no gridCell sentence');
  // "You already have more than £X" — not of a number of nought (then the savings pay: b.line.zero says so)
  if (Boolean(S_.have) !== Boolean(answer.already && answer.status === 'ok' && num && num.careful > 0)) fail('B14', 'have sentence ⟺ already');
  if (Boolean(S_.nothing) !== (answer.status === 'guaranteed-only')) fail('B14', 'nothing sentence ⟺ guaranteed-only');
  if (Boolean(S_.none) !== (answer.status === 'out-of-reach')) fail('B14', 'none sentence ⟺ out-of-reach');
  if (answer.status === 'ok' && !answer.onCourse && num.careful > 0 && !S_.head.text.includes(potText(num.careful))) fail('B14', 'the headline is not the number');
  if (two && pi.needed !== null && !S_.payInHead.text.includes(money(pi.needed <= pi.now && savingsShort ? pi.outside : pi.needed))) fail('B14', 'the second headline is not the pay-in that gets there');
  if (answer.grid && Boolean(S_.gridNone) !== !answer.grid.reaches) fail('B14', 'gridNone ⟺ no cell of the grid lasted in 9 in 10');
  // the verdict's headline is its band (saving-enough-and-check-in.md 2.2): every answer but "the State Pension covers it"
  if (answer.status !== 'guaranteed-only' && (!S_.verdictHead || S_.verdictHead.id !== `b.verdict.head.${answer.verdict.band}`)) fail('B14', `the verdict's headline is not its band (${answer.verdict.band})`);
  if (answer.status !== 'guaranteed-only' && (!S_.verdictLine || !S_.income || !S_.atAim)) fail('B14', 'no verdict line, income or bad case at the aim');
  if (/\bbad case\b/i.test(S_.bad.text) && !/the worst 1 in 10/.test(S_.bad.text)) fail('B14', 'a bad case without "the worst 1 in 10"');

  // B15 the trace, worked again by hand: the count, the pots, the pay-ins
  if (answer.trace && answer.trace.lives) {
    const lives = answer.trace.lives;
    if (lives.length !== n) fail('B15', `${lives.length} lives in the trace, ${n} in the basis`);
    for (const l of lives) if (Math.abs(l.pension - (l.zero + pi.now * l.perPound)) > 0.01 * (1 + l.pension * 1e-9)) fail('B15', `life ${l.id}: pension ≠ zero + now × perPound`);
    // (weighing: the lives run on past the plan-to age; the count is to its month, the drawing years to it)
    const toMonth = W ? 12 * (b.endAge - youngerAtStop) : Infinity;
    const ranOut = lives.filter((l) => l.runOutMonth !== null && l.runOutMonth < toMonth).length;
    if (ch.fails !== ranOut) fail('B15', `chance.fails ${ch.fails}, but ${ranOut} lives ran out in the trace`);
    const at = positions(n);
    const sorted = lives.map((l) => l.pension).sort((x, y) => x - y);
    for (const k of THREE) if (Math.abs(pa.now[k] - sorted[at[k]]) > 0.5 + 1e-9) fail('B15', `potAtStop.now.${k} ${pa.now[k]} ≠ the trace's ${sorted[at[k]]}`);
    const ran = ranOut;
    if (Math.abs(wl.lasted - (n - ran) / n) > 1e-12) fail('B15', `wholeLife.lasted ${wl.lasted}, ${n - ran} of ${n} lasted in the trace`);
  }

  // B17 said straight (saving-enough-and-check-in.md 2.1–2.3, 3.3): the band is verdictOf on the one test's count; the
  // two incomes are the careful and middling amounts paying in as now, the gap what the bad case is short of the aim; what
  // would be enough is a figure whose own count holds, within the caps, in the person's own kind
  const vd = answer.verdict;
  const band = W ? bandW(ch.weighted) : ch.fails <= allowed.nineInTen ? 'yes' : ch.fails <= allowed.threeInFour ? 'close' : 'no';
  const lineW = W && (onLine(ch.weighted) || onLine(ch.weighted, T20 + 1));
  if (!vd || (!lineW && vd.band !== band) || vd.lasted !== ch.lasted) fail('B17', `verdict ${JSON.stringify(vd)}, the ${W ? 'weighted chance' : 'count'} says ${band}`);
  if (answer.income.bad !== answer.monthlyIfShort) fail('B17', `income.bad ${answer.income.bad} is not the careful amount paying in as now (${answer.monthlyIfShort})`);
  const gapWant = Math.round(Math.max(0, spend - answer.income.bad) * 100) / 100;
  if (answer.gap.month !== gapWant || Math.abs(answer.gap.year - gapWant * 12) > 0.005) fail('B17', `gap ${JSON.stringify(answer.gap)}, the aim less the bad case is ${gapWant}`);
  if (answer.status === 'guaranteed-only') { if (en !== null) fail('B17', 'enough when the State Pension covers it'); }
  else if (!en) fail('B17', 'no enough');
  else {
    if (!lineW && en.closeNow !== (band === 'close')) fail('B17', 'closeNow ⟺ the Close band');
    if (en.level !== answer.level) fail('B17', 'enough.level is not the answer\'s');
    const saversHere = savers.length;
    const one = saversHere === 1 ? savers[0] : null;
    const how = !one ? 'couple' : (inputs[one.who].payIn.kind === 'share' && inputs[one.who].payIn.pay > 0) ? 'share' : 'pounds';
    if (en.how !== how) fail('B17', `enough.how ${en.how}, the pay-in says ${how}`);
    for (const [k, cap] of [['atLevel', allowed.nineInTen]]) {
      const fig = en[k];
      if (!fig) continue;
      if (W ? !passesW(fig.weighted) : !(fig.fails <= cap)) fail('B17', W ? `enough.${k} lasts ${fig.weighted} weighted, below ${answer.level}` : `enough.${k} counts ${fig.fails} failing, more than ${cap}`);
      if (Math.abs(fig.lasted - (n - fig.fails) / n) > 1e-12) fail('B17', `enough.${k}.lasted`);
      if (Math.abs(fig.payIn - fig.parts.reduce((s, x) => s + x.payIn, 0)) > 0.011) fail('B17', `enough.${k}: the parts do not add up`);
      if (fig.savingsIn !== null && fig.savingsIn !== pi.outside) fail('B17', `enough.${k}.savingsIn is not payIn.outside`);
      if (how === 'share' && !en.savingsOnly) {
        const p = inputs[one.who].payIn;
        if (fig.employerPct !== p.employerPct) fail('B17', `enough.${k}: the employer's share ${fig.employerPct}, entered ${p.employerPct}`);
        if (!(fig.ownPct >= 0 && fig.ownPct <= 100) || Math.abs(fig.ownPct * 2 - Math.round(fig.ownPct * 2)) > 1e-9) fail('B17', `enough.${k}.ownPct ${fig.ownPct} is not on the 0.5% grid within all of the pay`);
        if (Math.abs(fig.totalPct - fig.ownPct - fig.employerPct) > 1e-9) fail('B17', `enough.${k}.totalPct`);
        if (fig.payIn !== payInParts({ kind: 'share', pay: p.pay, ownPct: fig.ownPct, employerPct: p.employerPct }).total) fail('B17', `enough.${k}.payIn is not what the share lands`);
      }
      if (fig.payIn > b.payInCeiling + 1e-9) fail('B17', `enough.${k} above the ceiling`);
    }
    if (en.outOfReach !== null && en.atLevel !== null) fail('B17', 'out of reach, yet a figure');
    // (a couple: each saver at their most, and one of those all of a share of a pay — `caps` says whose; a part past its
    // person's most goes to the other, so a couple's figure is never out of reach because of today's split)
    if (en.outOfReach === 'pay' && how !== 'share' && !(how === 'couple' && Array.isArray(en.caps) && en.caps.some((x) => x.by === 'pay'
      && inputs[x.who].payIn.kind === 'share' && inputs[x.who].payIn.pay > 0))) fail('B17', '"all of your pay" without a share of a pay');
    if (how === 'couple') {
      for (const k of ['atLevel']) {
        const fig = en[k];
        if (!fig) continue;
        fig.parts.forEach((part) => {
          if (part.payIn > SAVING.payInCeiling + 1e-6) fail('B17', `enough.${k}: ${part.who}'s part ${part.payIn} is above £10,000 a month`);
          if (typeof part.ownPct === 'number' && !(part.ownPct >= 0 && part.ownPct <= 100)) fail('B17', `enough.${k}: ${part.who}'s own share ${part.ownPct} is past all of their pay`);
        });
      }
    }
    if (band !== 'yes' && en.atLevel === null && en.outOfReach === null) fail('B17', 'not on course, no figure and no reason');
  }

  // B16 can be saved
  const json = JSON.stringify(answer);
  if (JSON.stringify(JSON.parse(json)) !== json) fail('B16', 'does not survive JSON');
  if (!answer.trace && json.length > 100000) fail('B16', `answer is ${json.length} characters`);
  return f;
}
