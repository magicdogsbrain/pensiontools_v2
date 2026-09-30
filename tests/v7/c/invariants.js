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
import { RULES } from '../../../src/answers/shared/rules.js';

const UNITS = { money: 'todays-prices', tax: 'after-tax', period: 'month', who: 'household' };
const THREE = ['careful', 'middling', 'good'];

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
  'partner.pot': 'partner-no-pot', savings: 'all-pension', risk: 'risk', endAge: 'plan-to', 'start.kind': 'start', 'start.age': 'start'
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
  for (const k of THREE) { if (answer.monthly[k] < 0) fail('I2', `monthly.${k} negative`); }

  // I3 the band is in order
  if (!(answer.monthly.careful <= answer.monthly.middling && answer.monthly.middling <= answer.monthly.good)) fail('I3', `band out of order ${JSON.stringify(answer.monthly)}`);
  if (!(answer.lasted.careful >= answer.lasted.middling && answer.lasted.middling >= answer.lasted.good)) fail('I3', `lasted out of order ${JSON.stringify(answer.lasted)}`);
  if (!(answer.runOutAge.careful >= answer.runOutAge.middling && answer.runOutAge.middling >= answer.runOutAge.good)) fail('I3', `runOutAge out of order ${JSON.stringify(answer.runOutAge)}`);
  if (answer.status === 'ok' && answer.lasted.careful < 0.9 - 1e-12) fail('I3', `careful lasted in only ${answer.lasted.careful}`);
  for (const k of THREE) {
    if (Math.abs(answer.yearly[k] - answer.monthly[k] * 12) > 0.01) fail('I3', `yearly.${k} is not 12 × monthly`);
    if (answer.status === 'ok' && answer.monthly[k] % 10 !== 0) fail('I3', `monthly.${k} = ${answer.monthly[k]} is not a whole £10`);
  }
  // no pot to draw on: the three amounts are the take-home once every pension has started, the one figure everything reads
  if (answer.status !== 'ok') for (const k of THREE) if (answer.monthly[k] !== answer.guaranteed.monthlyAfterTax) fail('I3', `monthly.${k} = ${answer.monthly[k]} is not the take-home from the pensions, ${answer.guaranteed.monthlyAfterTax}`);

  // I4 the phases add up, in order, no gaps, from the start age to the end age
  const ph = answer.phases;
  if (!Array.isArray(ph) || !ph.length) fail('I4', 'no phases');
  else {
    ph.forEach((p, i) => {
      const sum = p.fromPots + p.statePension + p.finalSalary - p.tax;
      if (Math.abs(sum - p.takeHome) > 0.03) fail('I4', `phase ${i}: ${p.fromPots} + ${p.statePension} + ${p.finalSalary} − ${p.tax} ≠ ${p.takeHome}`);
      if (Math.abs(p.fromPension + p.fromSavings - p.fromPots) > 0.02) fail('I4', `phase ${i}: fromPots ≠ fromPension + fromSavings`);
      const by = p.byPerson.reduce((s, b) => s + b.takeHome, 0);
      if (Math.abs(by - p.takeHome) > 0.011 * (1 + p.byPerson.length)) fail('I4', `phase ${i}: byPerson take-home ${by} ≠ ${p.takeHome}`);
      for (const b of p.byPerson) if (Math.abs(b.statePension + b.finalSalary + b.fromPension + b.fromSavings - b.tax - b.takeHome) > 0.03) fail('I4', `phase ${i} ${b.who}: parts do not add up`);
      if (p.shown.fromPots + p.shown.statePension + p.shown.finalSalary !== p.shown.takeHome) fail('I4', `phase ${i}: shown figures do not add up`);
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
  if (answer.status === 'ok' && ph && ph.length) {
    const gap = ph[0].takeHome - answer.monthly.careful;
    if (Math.abs(gap) > 0.005 && !(gap > 0 && gap < 10 && ph[0].fromPots <= 0.005)) fail('I5', `monthly.careful ${answer.monthly.careful} ≠ phases[0].takeHome ${ph[0].takeHome}`);
    for (let i = 1; i < ph.length; i++) if (ph[i].takeHome < ph[0].takeHome - 0.005) fail('I5', `phase ${i} is lower than the first`);
  }

  // I6 no pot, nothing from the pot
  const pots = (answer.inputs.you.pot || 0) + ((answer.inputs.partner && answer.inputs.partner.pot) || 0) + (answer.inputs.savings || 0);
  if (pots === 0) {
    if (answer.status === 'ok') fail('I6', 'no pots but status ok');
    for (const p of ph || []) if (p.fromPots !== 0) fail('I6', 'no pots but something from the pots');
    if (!(answer.monthly.careful === answer.monthly.middling && answer.monthly.middling === answer.monthly.good)) fail('I6', 'no pots: nothing is left to chance, the three should agree');
  } else if (answer.status !== 'ok') fail('I6', `pots of ${pots} but status ${answer.status}`);
  if (answer.trace) {
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
      if (ph[0].ages[who].from < b.accessAge) {
        if (!first || first.locked !== true) fail('I7', `${who} is ${ph[0].ages[who].from} at the start, before ${b.accessAge}, but their pension is not marked closed`);
        if (!answer.warnings.some((w) => w.id === 'pension-locked' + (who === 'you' ? '' : '-partner'))) fail('I7', `${who}'s pension is closed at the start but no warning names them`);
        // the start would have moved to the first opening if no pension were open
        if (!ph[0].byPerson.some((x) => x.who !== who && !x.locked && (answer.inputs[x.who].pot || 0) > 0)) fail('I7', `${who}'s pension is closed at the start and no other pension is open`);
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
  for (const k of THREE) if (!(b.startAge <= answer.runOutAge[k] && answer.runOutAge[k] <= b.endAge) || !Number.isInteger(answer.runOutAge[k])) fail('I7', `runOutAge.${k} = ${answer.runOutAge[k]}`);
  if (answer.status === 'ok' && answer.runOutAge.careful !== b.endAge) fail('I7', 'the careful amount runs out before the end age in a bad case');
  for (const key of ['startAge', 'endAge', 'accessAge', 'years']) if (!Number.isInteger(b[key])) fail('I7', `basis.${key} is not whole`);
  if (b.endAge - b.startAge !== b.years) fail('I7', 'years ≠ endAge − startAge');
  if (b.years > RULES.maxYears) fail('I7', `${b.years} years is over the cap`);
  if (b.endAge > answer.inputs.endAge) fail('I7', 'runs past the end age asked for');
  if (b.endAge < answer.inputs.endAge && !answer.warnings.some((w) => w.id === 'long-plan')) fail('I7', 'capped without saying so');
  if (!['you', 'partner'].includes(answer.whose)) fail('I7', `whose = ${answer.whose}`);
  if (answer.inputs.household !== 'couple' && answer.whose !== 'you') fail('I7', 'single but whose is not you');

  // I8 the bad case is the worst 1 in 10
  if (b.failuresAllowed !== Math.floor(b.futures / 10)) fail('I8', 'failuresAllowed ≠ floor(futures / 10)');
  if (answer.status === 'ok' && Math.round((1 - answer.lasted.careful) * b.futures) > b.failuresAllowed) fail('I8', 'the careful amount fails in more futures than allowed');

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
      if (field === 'savings' && !answer.assumed.some((a) => a.id === 'savings-as-isa') && !(answer.inputs.you.pot > 0 || (answer.inputs.partner && answer.inputs.partner.pot > 0))) continue;
      if (field === 'risk' && !(answer.inputs.you.pot > 0 || (answer.inputs.partner && answer.inputs.partner.pot > 0))) continue;
      if (field === 'start.age' && answer.inputs.start.kind !== 'age') continue;
      const line = answer.assumed.find((a) => a.id === id);
      if (!line) fail('I10', `${field} was defaulted but ${id} is not under what was assumed`);
      else if (line.source !== 'default') fail('I10', `${field} was defaulted but ${id} says ${line.source}`);
    }
  }
  const always = ['start', 'plan-to', 'todays-prices', 'tax-rules'];
  if (answer.status === 'ok' && (answer.inputs.you.pot > 0 || (answer.inputs.partner && answer.inputs.partner.pot > 0))) always.push('risk', 'quarter-tax-free', 'steady');
  if (answer.inputs.household === 'couple') always.push('both-alive');
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
  if (answer.status === 'ok' && !answer.sentences.head.text.includes(money(answer.monthly.careful))) fail('I11', 'the headline is not the careful amount');
  if (answer.status === 'ok' && answer.monthly.careful <= 0 && !answer.sentences.none) fail('I11', 'nothing lasts but no c.none sentence');
  if (answer.status !== 'ok' && !answer.sentences.nothing) fail('I11', 'no pots but no c.nothing sentence');
  if (answer.take && !answer.sentences.take) fail('I11', 'take given but no take sentence');
  if (!answer.take && answer.sentences.take) fail('I11', 'take sentence without a take');

  // I12 the tax-free limit, per person, over the whole trace
  if (answer.trace) {
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
  if (answer.trace) {
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
