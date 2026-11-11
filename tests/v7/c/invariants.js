/**
 * checkAnswer(answer, given?) — the rules that must hold on ANY answer to question C (test plan 2.1, I1–I15,
 * renamed to the build brief's fields). Returns a list of plain-English failures; the caller asserts it is empty.
 * Called from the pairs, the random cases, the three fixtures and the trace check.
 *
 * `given` is the inputs as they were passed in (before defaults), for I10.
 *
 * Every package-2 test imports { answerC } from here; it comes from the adapter, _c.js.
 */
export { answerC } from './_c.js';
import { get, money, partsText } from '../../../src/answers/shared/format.js';
import { flatten } from '../../../src/answers/shared/validate.js';
import { RULES, LEVEL_FAILS20 } from '../../../src/answers/shared/rules.js';
import { shownOf } from '../../../src/answers/shared/levels.js';

const UNITS = { money: 'todays-prices', tax: 'after-tax', period: 'month', who: 'household' };
/** The three levels (7.8.0): Careful asks for the least a month, Bold the most. */
const THREE = ['careful', 'balanced', 'bold'];

/** True when anything in the value is undefined, a function, a Date, NaN or infinite. */
export function unsaveable(v, path = '', out = []) {
  if (v === undefined || typeof v === 'function' || v instanceof Date) { out.push(path || '(root)'); return out; }
  if (typeof v === 'number' && !Number.isFinite(v)) { out.push(path || '(root)'); return out; }
  if (v && typeof v === 'object') for (const k of Object.keys(v)) unsaveable(v[k], path ? `${path}.${k}` : k, out);
  return out;
}

/** The defaulted fields that must be named under what was assumed (household and take are exempt: a button and a try). */
const ASSUMED_FIELD = {
  'you.statePension.kind': 'state-pension-full', 'partner.statePension.kind': 'state-pension-full-partner',
  'you.finalSalary.has': 'no-final-salary', 'partner.finalSalary.has': 'no-final-salary-partner',
  'partner.pot': 'partner-no-pot', savings: 'all-pension', isaGrowth: 'savings-growth', risk: 'risk', charge: 'charges', endAge: 'plan-to', 'start.kind': 'start', 'start.age': 'start'
};

export function checkAnswer(answer, given) {
  const f = [];
  const fail = (rule, msg) => { f.push(`${rule}: ${msg}`); };
  if (!answer || typeof answer !== 'object') return ['I1: not an object'];
  if (answer.status === 'invalid') {
    if (!Array.isArray(answer.problems) || !answer.problems.length) fail('I1', 'invalid without problems');
    if (Object.keys(answer).length !== 2) fail('I1', 'an invalid answer carries nothing but status and problems');
    return f;
  }
  if (!['ok', 'guaranteed-only', 'none'].includes(answer.status)) fail('I1', `unknown status ${answer.status}`);

  // I1 nothing missing, not-a-number, infinite, a function or a Date
  const bad = unsaveable(answer);
  if (bad.length) fail('I1', `unsaveable at ${bad.slice(0, 5).join(', ')}`);
  const numbers = [];
  const walk = (v, path) => { if (typeof v === 'number') numbers.push([path, v]); else if (v && typeof v === 'object') for (const k of Object.keys(v)) walk(v[k], `${path}.${k}`); };
  walk(answer, '');
  for (const [path, v] of numbers) if (!Number.isFinite(v)) fail('I1', `${path} is ${v}`);

  // I2 nothing negative, no negative zero
  for (const [path, v] of numbers) {
    if (Object.is(v, -0)) fail('I2', `${path} is -0`);
    if (v < 0 && !/growth/.test(path)) fail('I2', `${path} is negative (${v})`);
  }
  const L = answer.levels || {};
  const shown = shownOf(answer);
  if (!shown || !THREE.every((k) => L[k])) { fail('I3', 'no levels'); return f; }
  for (const k of THREE) { if (L[k].monthly < 0) fail('I2', `levels.${k}.monthly negative`); }

  // I3 the levels are in order: Careful takes no more than Balanced, Balanced no more than Bold; each lasts as its level
  // asks (the count at floor(t·n/20) while not weighing), and its weighted chance is never below its fixed-age count
  if (!(L.careful.monthly <= L.balanced.monthly && L.balanced.monthly <= L.bold.monthly)) fail('I3', `levels out of order ${JSON.stringify(L)}`);
  if (!(L.careful.fixedAge >= L.balanced.fixedAge && L.balanced.fixedAge >= L.bold.fixedAge)) fail('I3', `fixedAge out of order ${JSON.stringify(L)}`);
  const n = answer.basis.futures;
  for (const k of THREE) {
    if (answer.status === 'ok' && Math.round((1 - L[k].fixedAge) * n) > Math.floor((LEVEL_FAILS20[k] * n) / 20) && L[k].weighted === L[k].fixedAge) fail('I3', `${k} lasted in only ${L[k].fixedAge}`);
    if (L[k].weighted < L[k].fixedAge - 1e-12) fail('I3', `${k}: weighted ${L[k].weighted} below fixed-age ${L[k].fixedAge}`);
    if (Math.abs(L[k].yearly - L[k].monthly * 12) > 0.01) fail('I3', `levels.${k}.yearly is not 12 × monthly`);
    if (answer.status === 'ok' && L[k].monthly % 10 !== 0) fail('I3', `levels.${k}.monthly = ${L[k].monthly} is not a whole £10`);
  }
  // no pot to draw on: the three amounts are the take-home once every pension has started, the one figure everything reads
  if (answer.status !== 'ok') for (const k of THREE) if (L[k].monthly !== answer.guaranteed.monthlyAfterTax) fail('I3', `levels.${k}.monthly = ${L[k].monthly} is not the take-home from the pensions, ${answer.guaranteed.monthlyAfterTax}`);

  // I4 the phases add up, in order, no gaps, from the start age to the end age
  const ph = answer.phases;
  if (!Array.isArray(ph) || !ph.length) fail('I4', 'no phases');
  else {
    ph.forEach((p, i) => {
      // (couples apart, before the second stop: plus what the pay of the one still working covers — couples-different-years.md 4.3 j)
      const pay = p.fromPay || 0;
      if ((p.fromPay !== undefined) !== Boolean(answer.apart && p.fromAge < answer.basis.startAge + answer.apart.years)) fail('I4', `phase ${i}: fromPay in the wrong years`);
      const sum = p.fromPots + p.statePension + p.finalSalary + pay - p.tax;
      if (Math.abs(sum - p.takeHome) > 0.03) fail('I4', `phase ${i}: ${p.fromPots} + ${p.statePension} + ${p.finalSalary} + ${pay} − ${p.tax} ≠ ${p.takeHome}`);
      if (Math.abs(p.fromPension + p.fromSavings - p.fromPots) > 0.02) fail('I4', `phase ${i}: fromPots ≠ fromPension + fromSavings`);
      const by = p.byPerson.reduce((s, b) => s + b.takeHome, 0) + pay;
      if (Math.abs(by - p.takeHome) > 0.011 * (2 + p.byPerson.length)) fail('I4', `phase ${i}: byPerson take-home ${by} ≠ ${p.takeHome}`);
      for (const b of p.byPerson) if (Math.abs(b.statePension + b.finalSalary + b.fromPension + b.fromSavings - b.tax - b.takeHome) > 0.03) fail('I4', `phase ${i} ${b.who}: parts do not add up`);
      for (const b of p.byPerson) if (b.working && (b.fromPension || b.fromSavings || b.statePension || b.finalSalary || b.takeHome)) fail('I4', `phase ${i} ${b.who}: still working but draws or is paid`);
      if (p.shown.fromPots + p.shown.statePension + p.shown.finalSalary + (p.shown.fromPay || 0) !== p.shown.takeHome) fail('I4', `phase ${i}: shown figures do not add up`);
      if (!Number.isInteger(p.fromAge) || !Number.isInteger(p.toAge) || p.toAge <= p.fromAge) fail('I4', `phase ${i}: ages ${p.fromAge}–${p.toAge}`);
      if (i > 0 && p.fromAge !== ph[i - 1].toAge) fail('I4', `phase ${i} does not touch phase ${i - 1}`);
      for (const who of Object.keys(p.ages)) if (p.ages[who].to - p.ages[who].from !== p.toAge - p.fromAge) fail('I4', `phase ${i}: ${who}'s ages span a different length`);
    });
    if (ph[0].fromAge !== answer.basis.startAge) fail('I4', `first phase starts at ${ph[0].fromAge}, not the start age ${answer.basis.startAge}`);
    if (ph[ph.length - 1].toAge !== answer.basis.endAge) fail('I4', `last phase ends at ${ph[ph.length - 1].toAge}, not the end age ${answer.basis.endAge}`);
  }

  // I5 the headline is the first phase, and no later phase is lower. The one exception: when the pots add nothing to the
  // take-home the household has anyway at the start, the headline is that take-home rounded down to £10 and the first
  // phase shows the take-home itself (less than £10 above it).
  // (couples apart: the careful amount is what is spent once you have both stopped — the first phase from the second stop)
  // (what is spent changing with age, spending-shape.md 6.2: no later phase is lower than the SHAPE's figure in its first
  // year — answer.byYear's `spend` — rather than the first phase)
  const shapeAt = (q) => { const y = Array.isArray(answer.byYear) ? answer.byYear.find((r) => r.age === q.ages.you.from) : null; return y ? y.spend : null; };
  if (answer.status === 'ok' && ph && ph.length && !answer.apart) {
    const gap = ph[0].takeHome - shown.monthly;
    if (Math.abs(gap) > 0.005 && !(gap > 0 && gap < 10 && ph[0].fromPots <= 0.005)) fail('I5', `the level's monthly ${shown.monthly} ≠ phases[0].takeHome ${ph[0].takeHome}`);
    for (let i = 1; i < ph.length; i++) {
      const floor = answer.byYear ? shapeAt(ph[i]) : ph[0].takeHome;
      if (floor === null) fail('I5', `phase ${i} has no year of its own in byYear`);
      else if (ph[i].takeHome < floor - 0.01) fail('I5', `phase ${i} is lower than the ${answer.byYear ? 'shape' : 'first'}`);
    }
  }
  // couples apart: from the second stop every phase pays at least the careful amount, and more only where the pensions
  // alone pay more (the years apart can hold the amount down below them — "None of it", nothing to draw on)
  if (answer.status === 'ok' && ph && ph.length && answer.apart) {
    const k0 = ph.findIndex((p) => p.fromPay === undefined);
    for (let i = k0; i < ph.length; i++) {
      const target = answer.byYear ? (shapeAt(ph[i]) ?? shown.monthly) : shown.monthly;
      const over = ph[i].takeHome - target;
      if (over < -0.005 || (over > 0.005 && ph[i].fromPots > 0.005 && !(over < 10))) fail('I5', `phase ${i}: take-home ${ph[i].takeHome} against the level's amount ${shown.monthly}`);
    }
  }

  // I6 no pot, nothing from the pot (on the lives — a start at an age — what goes in before then makes a pot too)
  const onLives = Array.isArray(answer.saving);
  const goingIn = onLives && answer.payIn ? answer.payIn.total : 0;
  const pots = (answer.inputs.you.pot || 0) + ((answer.inputs.partner && answer.inputs.partner.pot) || 0) + (answer.inputs.savings || 0) + goingIn;
  if (pots === 0) {
    if (answer.status === 'ok') fail('I6', 'no pots but status ok');
    for (const p of ph || []) if (p.fromPots !== 0) fail('I6', 'no pots but something from the pots');
    if (!(L.careful.monthly === L.balanced.monthly && L.balanced.monthly === L.bold.monthly)) fail('I6', 'no pots: nothing is left to chance, the three should agree');
  } else if (answer.status !== 'ok') fail('I6', `pots of ${pots} but status ${answer.status}`);
  if (answer.trace && answer.trace.atCareful) {
    for (const who of ['you', 'partner']) {
      const potOf = answer.inputs[who] ? (answer.inputs[who].pot || 0) : 0;
      const savings = answer.inputs.household === 'couple' ? (answer.inputs.savings || 0) / 2 : who === 'you' ? (answer.inputs.savings || 0) : 0;
      if (potOf + savings > 0) continue;
      for (const row of answer.trace.atCareful.rows) if (row.who === who && row.draw !== 0) fail('I6', `${who} has no pot but drew ${row.draw} in month ${row.m}`);
    }
  }

  // I7 ages make sense
  const b = answer.basis;
  const younger = answer.inputs.household === 'couple' ? Math.min(answer.inputs.you.age, answer.inputs.partner.age) : answer.inputs.you.age;
  if (b.startAge < younger) fail('I7', `startAge ${b.startAge} before today's age ${younger}`);
  if (ph && ph.length) {
    // A pension holder under the earliest pension age at the start: their pension is closed (nothing drawn from it) in every
    // phase before they reach it, the warning names them, and someone else's money is open — the start moves otherwise
    for (const who of Object.keys(ph[0].ages)) {
      const potOf = answer.inputs[who] ? (answer.inputs[who].pot || 0) : 0;
      if (!(potOf > 0)) continue;
      const first = ph[0].byPerson.find((x) => x.who === who);
      // (couples apart: someone still working at the start draws nothing yet; their pension is closed or not from their own stop)
      if (first && first.working) continue;
      if (ph[0].ages[who].from < b.accessAge) {
        if (!first || first.locked !== true) fail('I7', `${who} is ${ph[0].ages[who].from} at the start, before ${b.accessAge}, but their pension is not marked closed`);
        // (or, when the years until it opens set the amount, the answer's own words name them: c.none.closed)
        const named = answer.closedYears && answer.closedYears.who.includes(who) && answer.sentences.none && answer.sentences.none.id === 'c.none.closed';
        if (!named && !answer.warnings.some((w) => w.id === 'pension-locked' + (who === 'you' ? '' : '-partner'))) fail('I7', `${who}'s pension is closed at the start but no warning names them`);
        // the start would have moved to the first opening if no pension were open — from now (C's rule). On the lives (a
        // start at an age) the start is never moved: the savings pay until the pension opens, as A and B work it
        if (!onLives && !ph[0].byPerson.some((x) => x.who !== who && !x.locked && (answer.inputs[x.who].pot || 0) > 0)) fail('I7', `${who}'s pension is closed at the start and no other pension is open`);
      }
      ph.forEach((p, i) => {
        const me = p.byPerson.find((x) => x.who === who);
        if (!me) return;
        if (me.locked && me.fromPension > 0.005) fail('I7', `phase ${i}: ${who}'s pension is closed but pays ${me.fromPension}`);
        if (me.locked && p.ages[who].from >= b.accessAge && p.ages[who].from >= RULES.pensionAccess.from) fail('I7', `phase ${i}: ${who} is ${p.ages[who].from} but their pension is still closed`);
        if (!me.locked && i > 0 && ph[i - 1].byPerson.find((x) => x.who === who).locked && p.ages[who].from < RULES.pensionAccess.before) fail('I7', `phase ${i}: ${who}'s pension opens at ${p.ages[who].from}`);
      });
    }
  }
  for (const key of ['startAge', 'endAge', 'accessAge', 'years']) if (!Number.isInteger(b[key])) fail('I7', `basis.${key} is not whole`);
  if (b.endAge - b.startAge !== b.years) fail('I7', 'years ≠ endAge − startAge');
  if (b.years > RULES.maxYears) fail('I7', `${b.years} years is over the cap`);
  if (b.endAge > answer.inputs.endAge) fail('I7', 'runs past the end age asked for');
  if (b.endAge < answer.inputs.endAge && !answer.warnings.some((w) => w.id === 'long-plan')) fail('I7', 'capped without saying so');
  if (!['you', 'partner'].includes(answer.whose)) fail('I7', `whose = ${answer.whose}`);
  if (answer.inputs.household !== 'couple' && answer.whose !== 'you') fail('I7', 'single but whose is not you');

  // I8 the level is the one asked for, and its amount fails in no more futures than it lets through (while not weighing)
  if (b.level !== answer.level || b.levelFails20 !== LEVEL_FAILS20[answer.level]) fail('I8', `basis.level ${b.level} / ${b.levelFails20} is not the answer's ${answer.level}`);
  if (answer.status === 'ok' && shown.weighted === shown.fixedAge && Math.round((1 - shown.fixedAge) * b.futures) > Math.floor((b.levelFails20 * b.futures) / 20)) fail('I8', 'the level\'s amount fails in more futures than it lets through');
  if (answer.chance.fixedAge !== shown.fixedAge || answer.chance.weighted !== shown.weighted) fail('I8', 'chance is not the shown level\'s');

  // I9 units are stated
  if (JSON.stringify(answer.units) !== JSON.stringify(UNITS)) fail('I9', `units ${JSON.stringify(answer.units)}`);

  // I10 every default that was used is listed; entered values match; the always-there lines
  const ids = answer.assumed.map((a) => a.id);
  if (new Set(ids).size !== ids.length) fail('I10', 'assumed ids repeat');
  for (const a of answer.assumed) {
    if (a.source === 'default' && typeof a.field !== 'string') fail('I10', `${a.id} is a default with no field`);
    if (!['default', 'entered', 'rule'].includes(a.source)) fail('I10', `${a.id}: source ${a.source}`);
    if (a.source === 'entered') {
      const v = get(answer.inputs, a.field);
      if (a.id === 'start') { if (!(v === 'now' || v === 'age')) fail('I10', `${a.id}: entered but field ${a.field} is ${v}`); }
      else if (a.field === 'you.statePension.kind' || a.field === 'partner.statePension.kind') { if (v !== 'full') fail('I10', `${a.id}: entered ${v}`); }
      else if (v !== a.value) fail('I10', `${a.id}: entered value ${a.value} ≠ input ${v}`);
    }
  }
  if (given) {
    const flat = flatten(given);
    for (const [field, id] of Object.entries(ASSUMED_FIELD)) {
      const applies = Object.prototype.hasOwnProperty.call(flatten(answer.inputs), field);
      if (!applies || flat[field] !== undefined) continue;
      if (field === 'savings' && !answer.assumed.some((a) => a.id === 'savings-growth') && !(answer.inputs.you.pot > 0 || (answer.inputs.partner && answer.inputs.partner.pot > 0))) continue;
      if (field === 'risk' && !(answer.inputs.you.pot > 0 || (answer.inputs.partner && answer.inputs.partner.pot > 0))) continue;
      if (field === 'start.age' && answer.inputs.start.kind !== 'age') continue;
      if (field === 'charge' && answer.status !== 'ok') continue;   // nothing held in funds or cash: nothing to charge
      const line = answer.assumed.find((a) => a.id === id);
      if (!line) fail('I10', `${field} was defaulted but ${id} is not under what was assumed`);
      else if (line.source !== 'default') fail('I10', `${field} was defaulted but ${id} says ${line.source}`);
    }
  }
  const always = ['start', 'plan-to', 'todays-prices', 'tax-rules'];
  if (answer.status === 'ok' && (answer.inputs.you.pot > 0 || (answer.inputs.partner && answer.inputs.partner.pot > 0))) {
    always.push('risk', 'steady');
    // the tax-free part (couples-different-years.md 2.3): a quarter of each withdrawal, unless every pot's holder has had it
    const holders = ['you', 'partner'].filter((w) => answer.inputs[w] && answer.inputs[w].pot > 0);
    if (holders.some((w) => answer.inputs[w].taxFreeTaken !== true)) always.push('quarter-tax-free');
    for (const w of holders) if (answer.inputs[w].taxFreeTaken === true) always.push('tax-free-taken' + (w === 'you' ? '' : '-partner'));
  }
  if (answer.inputs.household === 'couple') always.push('both-alive');
  // couples apart: the pay line, never "you both start at the same time" (couples-different-years.md 2.4)
  if (answer.apart) {
    always.push('stop-apart');
    if (ids.includes('both-stop-together') || ids.includes('savings-split')) fail('I10', 'a same-year line with the two stops apart');
    if (Boolean(answer.apart.coverUsed) !== answer.warnings.some((w) => w.id === 'apart-cover-used')) fail('I10', 'apart.coverUsed ⟺ the apart-cover-used warning');
  } else if (ids.includes('stop-apart')) fail('I10', 'stop-apart with one stop for both');
  // the one charge (6.19.0): said whenever there is money to draw on, with its field; the saving-only line and "not taken
  // off" are gone
  if (answer.status === 'ok') always.push('charges');
  else if (ids.includes('charges')) fail('I10', 'a charges line with nothing to draw on');
  for (const id of ['charge-saving', 'no-charges']) if (ids.includes(id)) fail('I10', `the old line ${id}`);
  const ch = answer.assumed.find((a) => a.id === 'charges');
  if (ch && (ch.field !== 'charge' || ch.value !== answer.inputs.charge)) fail('I10', `charges: field ${ch.field}, value ${ch.value} (input ${answer.inputs.charge})`);
  // how the savings grow (6.22.0): said whenever the savings box is above £0, with its field and the choice in the inputs;
  // the fixed-3% line is gone
  if (answer.inputs.savings > 0) always.push('savings-growth');
  else if (ids.includes('savings-growth')) fail('I10', 'a savings-growth line with no savings');
  if (ids.includes('savings-as-isa')) fail('I10', 'the old line savings-as-isa');
  const sg = answer.assumed.find((a) => a.id === 'savings-growth');
  if (sg && (sg.field !== 'isaGrowth' || sg.value !== answer.inputs.isaGrowth)) fail('I10', `savings-growth: field ${sg.field}, value ${sg.value} (input ${answer.inputs.isaGrowth})`);
  for (const id of always) if (!ids.includes(id)) fail('I10', `assumed lacks ${id}`);

  // I11 every sentence carries its own numbers: text is the parts joined, and every key leads to a number
  const all = [...Object.values(answer.sentences).flatMap((s) => (Array.isArray(s) ? s : [s])), ...answer.assumed, ...answer.warnings];
  for (const s of all) {
    if (!s || typeof s.text !== 'string' || !Array.isArray(s.parts)) { fail('I11', `${s && s.id}: not a sentence`); continue; }
    if (partsText(s.parts, answer) !== s.text) fail('I11', `${s.id}: text ≠ parts joined`);
    for (const p of s.parts) {
      if (p && p.key !== undefined) {
        const v = get(answer, p.key);
        if (typeof v !== 'number') fail('I11', `${s.id}: key ${p.key} leads to ${v}`);
        if (p.kind === 'money' && typeof v === 'number' && !s.text.includes(money(v))) fail('I11', `${s.id}: ${money(v)} not in text`);
      }
    }
    if (/undefined|NaN|\bnull\b|Infinity|\[object|-£0|£-|£NaN|\{|\}/.test(s.text)) fail('I11', `${s.id}: rubbish in "${s.text}"`);
    if (/£\d+\.\d/.test(s.text)) fail('I11', `${s.id}: pence in "${s.text}"`);
  }
  for (const id of ['head', 'sub', 'line', 'bad', 'range']) if (!answer.sentences[id]) fail('I11', `no ${id} sentence`);
  if (!Array.isArray(answer.sentences.madeOf)) fail('I11', 'madeOf is not a list');
  if (answer.status === 'ok' && !answer.sentences.madeOf.length) fail('I11', 'no made-of lines');
  if (answer.status === 'ok' && !answer.sentences.head.text.includes(money(shown.monthly))) fail('I11', 'the headline is not the level\'s amount');
  if (answer.status === 'ok' && shown.monthly <= 0 && !answer.sentences.none) fail('I11', 'nothing lasts but no c.none sentence');
  if (answer.status !== 'ok' && !answer.sentences.nothing) fail('I11', 'no pots but no c.nothing sentence');
  if (answer.take && !answer.sentences.take) fail('I11', 'take given but no take sentence');
  if (!answer.take && answer.sentences.take) fail('I11', 'take sentence without a take');

  // I12 the tax-free limit, per person, over the whole trace (the drawing months: traced from now only)
  if (answer.trace && answer.trace.atCareful) {
    for (const key of ['atCareful', 'atMiddling']) {
      const rows = answer.trace[key].rows;
      const byWho = {};
      for (const r of rows) {
        byWho[r.who] = (byWho[r.who] || 0) + r.taxFree;
        if (r.taxFree > 0.25 * r.fromPension + 0.005) fail('I12', `${key} ${r.who} m${r.m}: tax-free ${r.taxFree} > a quarter of ${r.fromPension}`);
      }
      for (const [who, sum] of Object.entries(byWho)) if (sum > RULES.taxFreeLimit + 0.005) fail('I12', `${key} ${who}: tax-free cash ${sum.toFixed(2)} over the limit`);
    }
  }

  // I13 tax is sane; I14 nothing before it is allowed
  if (answer.trace && answer.trace.atCareful) {
    const phaseAt = (m) => ph.find((p) => m >= (p.fromAge - b.startAge) * 12 && m < (p.toAge - b.startAge) * 12);
    for (const key of ['atCareful', 'atMiddling']) {
      for (const r of answer.trace[key].rows) {
        const taxableAll = r.taxable + r.statePension + r.finalSalary;
        if (r.tax < -1e-9 || r.tax > taxableAll + 1e-9) fail('I13', `${key} ${r.who} m${r.m}: tax ${r.tax} on ${taxableAll}`);
        if (r.afterTax > r.statePension + r.finalSalary + r.draw + 1e-6) fail('I13', `${key} ${r.who} m${r.m}: after tax more than came in`);
        if (r.fromPension > 1e-6 && r.age < b.accessAge) fail('I14', `${key} ${r.who} m${r.m}: pension drawn at ${r.age}`);
        const inPhase = phaseAt(r.m);
        const mine = inPhase && inPhase.byPerson.find((x) => x.who === r.who);
        if (mine && mine.locked && r.fromPension > 1e-6) fail('I14', `${key} ${r.who} m${r.m}: pension drawn while closed (age ${r.age})`);
        for (const who of ['you', 'partner']) {
          const person = answer.inputs[who];
          if (!person || r.who !== who) continue;
          const fs = person.finalSalary;
          if (r.finalSalary > 1e-6 && (!fs.has || r.age < fs.fromAge)) fail('I14', `${key} ${who} m${r.m}: final-salary pension at ${r.age}`);
          if (r.statePension > 1e-6 && person.statePension.kind === 'none') fail('I14', `${key} ${who} m${r.m}: a State Pension that was switched off`);
        }
      }
    }
  }

  // I15 can be saved
  const text = JSON.stringify(answer);
  if (JSON.stringify(JSON.parse(text)) !== text) fail('I15', 'does not survive JSON');
  const inputsText = JSON.stringify(answer.inputs);
  if (JSON.stringify(JSON.parse(inputsText)) !== inputsText) fail('I15', 'inputs do not survive JSON');
  if (!answer.trace && text.length > 100000) fail('I15', `answer is ${text.length} characters`);

  return f;
}
