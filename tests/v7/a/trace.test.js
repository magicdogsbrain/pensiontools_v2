/**
 * Question A worked out again from its trace (step 4 brief 6, P2; test-plan-A-B.md 4.3), on the four fixtures, the 48
 * core cases and the 13 stop-age cases, with env.trace on. The oracle (tests/v7/oracles/fromTrace.mjs) imports nothing
 * from src/:
 *
 *   - each saving month of the bad-case life (the life at the careful position of the pot at the stop): what was there,
 *     plus what went in (at the start of the month, rising with prices), plus growth, less the charge, is what is left;
 *     nothing goes in at or after the stop; the last month is the month before it;
 *   - the pot at the stop in today's prices, from the rows, is that life's pot in the list of lives, to £1;
 *   - the list of lives gives back the three pots at the stop, the count that lasted and the bad-case run-out age;
 *   - the drawing months of the shown row, where the trace has them: each month adds up, and the tax is the hand sum.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { answerA, TEST_ENV, checkAnswerA, ENGINE_READY, householdPayIn, FIXTURE_FILES } from './invariants.js';
import { recomputeSaving, byPerson } from '../oracles/fromTrace.mjs';
import { ukTax } from '../oracles/ukTax.mjs';

const ROOT = process.cwd();
const cases = JSON.parse(readFileSync(resolve(ROOT, 'tests/v7/a/cases.pairs.json'), 'utf8'));
const fixtures = FIXTURE_FILES.map((f) => JSON.parse(readFileSync(resolve(ROOT, 'tests/v7/fixtures/a', f), 'utf8')));
const ENV = { ...TEST_ENV, trace: true };
const positions = (n) => ({ careful: Math.floor(n / 10), middling: Math.floor(n / 2), good: n - Math.ceil(n / 10) });

/** Every disagreement between an answer and its own trace. */
export function checkTraceA(a) {
  const out = [];
  const t = a.trace;
  if (!t) return ['no trace'];
  const n = a.basis.futures;
  const at = positions(n);
  const inputs = a.inputs;
  const couple = inputs.household === 'couple';
  const S = a.shown.yearsSaving;
  const younger = couple ? Math.min(inputs.you.age, inputs.partner.age) : inputs.you.age;
  const endAge = a.basis.endAge;

  // the list of lives
  if (!Array.isArray(t.lives) || t.lives.length !== n) return [`${t.lives && t.lives.length} lives listed, not ${n}`];
  if (t.lives.some((l, i) => l.id !== i)) out.push('the lives are not listed in order');
  const pots = t.lives.map((l) => l.potAtStop).sort((x, y) => x - y);
  for (const k of ['careful', 'middling', 'good']) if (Math.abs(Math.round(pots[at[k]]) - a.shown.potAtStop[k]) > 1) out.push(`potAtStop.${k}: the lives give ${pots[at[k]]}, the answer ${a.shown.potAtStop[k]}`);
  const fails = t.lives.filter((l) => l.runOutMonth !== null).length;
  if (Math.abs((n - fails) / n - a.shown.lasted) > 1e-9) out.push(`lasted: the lives give ${(n - fails) / n}, the answer ${a.shown.lasted}`);
  const runOut = t.lives.map((l) => (l.runOutMonth === null ? endAge : younger + S + Math.floor(l.runOutMonth / 12))).sort((x, y) => x - y);
  if (runOut[at.careful] !== a.shown.runOutAge) out.push(`runOutAge: the lives give ${runOut[at.careful]}, the answer ${a.shown.runOutAge}`);
  if (t.lives.every((l) => typeof l.most === 'number')) {
    const most = t.lives.map((l) => l.most).sort((x, y) => x - y);
    const down = (v) => Math.floor(v / 10 + 1e-9) * 10;
    for (const k of ['careful', 'middling', 'good']) if (a.shown.potAtStop.good > 0 && down(most[at[k]]) !== a.shown.monthly[k]) out.push(`monthly.${k}: the lives give ${down(most[at[k]])}, the answer ${a.shown.monthly[k]}`);
  }

  // the saving months of the bad-case life
  const sv = t.saving && t.saving.atCareful;
  if (!sv) out.push('no saving trace');
  else {
    const byPot = [...t.lives].sort((x, y) => x.potAtStop - y.potAtStop || x.id - y.id);
    if (byPot[at.careful].id !== sv.futureId) out.push(`the bad case for the pot at the stop is life ${byPot[at.careful].id}, the trace shows ${sv.futureId}`);
    const one = (p) => (!p || !p.payIn ? 0 : p.payIn.kind === 'split' ? p.payIn.own + p.payIn.employer : p.payIn.total);
    const payIn = { you: one(inputs.you), ...(couple ? { partner: one(inputs.partner) } : {}) };
    const into = couple ? { you: inputs.savingsIn / 2, partner: inputs.savingsIn / 2 } : { you: inputs.savingsIn };
    const stopAge = { you: inputs.you.age + S, ...(couple ? { partner: inputs.partner.age + S } : {}) };
    const r = recomputeSaving(sv.rows, { S, payIn, savingsIn: into, stopAge, priceAtStop: sv.priceAtStop, potAtStop: t.lives[sv.futureId].potAtStop });
    out.push(...r.problems);
    if (S > 0) {
      const people = byPerson(sv.rows);
      if (Object.keys(people).length !== (couple ? 2 : 1)) out.push(`saving rows for ${Object.keys(people).join(', ')}`);
      for (const [who, list] of Object.entries(people)) if (list[list.length - 1].age !== stopAge[who] - 1) out.push(`${who}: the last saving month is at ${list[list.length - 1].age}, not ${stopAge[who] - 1}`);
      const paid = Object.values(r.byPerson).reduce((s, x) => s + x.paidIn, 0);
      if (Math.abs(paid - householdPayIn(inputs) * 12 * S) > 1) out.push(`paid in ${paid.toFixed(2)} at today's prices, want ${householdPayIn(inputs) * 12 * S}`);
    } else if (sv.rows.length) out.push('saving rows when stopping today');
  }

  // the drawing months of the shown row, where the trace carries them
  const dr = t.drawing;
  if (dr) {
    if (t.lives[dr.futureId].runOutMonth !== dr.runOutMonth) out.push(`the drawing trace runs out at ${dr.runOutMonth}, the life at ${t.lives[dr.futureId].runOutMonth}`);
    for (const [who, rows] of Object.entries(byPerson(dr.rows))) {
      rows.forEach((row, i) => {
        if (Math.abs(row.potStart + row.growth - row.draw - row.potEnd) > 0.01) out.push(`${who} m${row.m}: potStart + growth − draw ≠ potEnd`);
        if (i + 1 < rows.length && Math.abs(row.potEnd - rows[i + 1].potStart) > 0.01) out.push(`${who} m${row.m}: potEnd ≠ next potStart`);
        if (Math.abs(row.afterTax - (row.statePension + row.finalSalary + (row.work || 0) + row.draw - row.tax)) > 0.01) out.push(`${who} m${row.m}: afterTax ≠ incomes + draw − tax`);
        const bands = { pa: 12570 * row.priceIndex, brl: 50270 * row.priceIndex, hrl: 125140 * row.priceIndex };
        const want = ukTax(12 * (row.taxable + row.statePension + row.finalSalary + (row.work || 0)), bands) / 12;
        if (Math.abs(want - row.tax) > 0.01) out.push(`${who} m${row.m}: tax ${row.tax.toFixed(2)} ≠ hand sum ${want.toFixed(2)}`);
      });
    }
  }
  return out;
}

describe.skipIf(!ENGINE_READY)('A — the trace agrees with the answer', () => {
  const all = [
    ...fixtures.map((f) => [f.id, f.inputs, f.env || {}]),
    ...cases.core.map((c) => [c.name, c.inputs, {}]),
    ...cases.stops.map((c) => [c.name, c.inputs, { ages: [c.inputs.stop.age] }])
  ];
  it.each(all)('%s', (_name, inputs, extra) => {
    const env = { ...ENV, ...extra };
    const a = answerA(inputs, env);
    expect(a.status, JSON.stringify(a.problems)).not.toBe('invalid');
    const rules = checkAnswerA(a, inputs, env);
    expect(rules, rules.join('\n')).toEqual([]);
    if (a.status !== 'ok') return;
    const problems = checkTraceA(a);
    expect(problems, problems.join('\n')).toEqual([]);
  });

  it('the trace is plain data, and the saving rows carry every field of the contract', () => {
    const a = answerA(fixtures[0].inputs, ENV);
    expect(JSON.parse(JSON.stringify(a.trace))).toEqual(a.trace);
    const row = a.trace.saving.atCareful.rows[0];
    for (const k of ['who', 'm', 'age', 'potStart', 'paidIn', 'growth', 'charge', 'potEnd', 'savingsStart', 'savingsIn', 'savingsEnd', 'priceIndex']) expect(row, k).toHaveProperty(k);
    expect(row.paidIn).toHaveProperty('total');
    expect(a.trace.lives.map((l) => l.id)).toEqual([...Array(ENV.futures).keys()]);
  });

  it('with the trace off the answer is the same, byte for byte, without the trace', () => {
    const on = answerA(fixtures[1].inputs, ENV);
    const off = answerA(fixtures[1].inputs, { ...ENV, trace: false });
    const { trace, ...rest } = on;
    expect(off).toEqual(rest);
    expect(off.trace).toBeUndefined();
  });
});
