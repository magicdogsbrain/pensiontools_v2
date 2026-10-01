/**
 * The generated cases of question A (step 4 brief 3 and 6, P2; test-plan-A-B.md 8.1 with the brief's fields):
 *
 *   pairs  — all-pairs over DIMENSIONS_A (greedy, no randomness: the same list every time)
 *   core   — household (2) × final-salary (2) × State Pension (2) × saving risk (3) × part-time (2) on one middle-of-the-road
 *            person (45, £120,000, £400 a month going in, stop at 60, £2,608 a month): 48
 *   stops  — the rise to 57 crossed both ways, one stop age at a time: a 53- and a 54-year-old stopping at 54–58, and the
 *            54-year-old at 60, 66 and 67 — single, £250,000, £400 a month going in, £1,200 a month: 13
 *
 * Writes tests/v7/a/cases.pairs.json: node tests/v7/gen/dimensionsA.mjs (P6 wires it into npm run v7:cases). The file is
 * committed; tests/v7/a/pairs.test.js regenerates it and fails when it differs.
 *
 * pairs.mjs's generator is C's and knows C's one link (single ↔ no partner); A has a second, the stop age at or after
 * today's age, so the greedy walk is repeated here with A's `compatible`.
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { setPath } from './pairs.mjs';

const NA = 'n/a';
const v = (id, set, extra = {}) => ({ id, set, ...extra });
const partnerDim = (name, values) => ({ name, partner: true, values: [v(NA, () => {}), ...values] });

/** The dimensions of question A, in the order the generator fills them. `age` and `stop` carry their figure for `compatible`. */
export const DIMENSIONS_A = [
  { name: 'household', values: [v('single', (c) => setPath(c, 'household', 'single')), v('couple', (c) => setPath(c, 'household', 'couple'))] },
  { name: 'age', values: [25, 40, 45, 47, 53, 54, 55, 56, 57, 60, 65, 70].map((a) => v(`age${a}`, (c) => setPath(c, 'you.age', a), { age: a })) },
  { name: 'stop', values: [
    v('stopNow', (c) => setPath(c, 'stop', { kind: 'age', age: c.you.age }), { stop: 'now' }),
    ...[55, 56, 57, 60, 65, 67, 70].map((s) => v(`stop${s}`, (c) => setPath(c, 'stop', { kind: 'age', age: s }), { stop: s }))
  ] },
  { name: 'pot', values: [0, 1, 10_000, 120_000, 250_000, 1_073_100, 3_000_000].map((p) => v(`pot${p}`, (c) => setPath(c, 'you.pot', p))) },
  { name: 'payIn', values: [
    ...[0, 240, 400, 1_000, 5_000].map((p) => v(`payIn${p}`, (c) => setPath(c, 'you.payIn', { kind: 'total', total: p }))),
    v('payInSplit', (c) => setPath(c, 'you.payIn', { kind: 'split', own: 300, employer: 100 }))
  ] },
  { name: 'alreadyDrawing', values: [v('notDrawing', () => {}), v('drawing', (c) => setPath(c, 'you.alreadyDrawing', true))] },
  { name: 'savings', values: [0, 60_000, 150_000].map((s) => v(`savings${s}`, (c) => setPath(c, 'savings', s))) },
  { name: 'savingsIn', values: [v('savingsIn0', () => {}), v('savingsIn800', (c) => setPath(c, 'savingsIn', 800))] },
  { name: 'spend', values: [
    ...[500, 1_200, 2_608, 3_592, 8_000].map((s) => v(`spend${s}`, (c) => setPath(c, 'spend', { kind: 'amount', amount: s }))),
    v('spendModerate', (c) => setPath(c, 'spend', { kind: 'level', level: 'moderate' }))
  ] },
  { name: 'savingRisk', values: ['cautious', 'balanced', 'adventurous'].map((r) => v(`save${r}`, (c) => setPath(c, 'savingRisk', r))) },
  { name: 'risk', values: ['cautious', 'balanced', 'adventurous'].map((r) => v(`draw${r}`, (c) => setPath(c, 'risk', r))) },
  { name: 'charge', values: [v('chargeDefault', () => {}), v('charge0', (c) => setPath(c, 'charge', 0)), v('charge1', (c) => setPath(c, 'charge', 1))] },
  { name: 'statePension', values: [
    v('spNone', (c) => setPath(c, 'you.statePension.kind', 'none')),
    v('spFull', () => {}),
    v('spPart', (c) => { setPath(c, 'you.statePension.kind', 'forecast'); setPath(c, 'you.statePension.yearly', 6000); })
  ] },
  { name: 'finalSalary', values: [
    v('fsNone', () => {}),
    v('fs9kFrom60', (c) => setPath(c, 'you.finalSalary', { has: true, yearly: 9000, fromAge: 60 })),
    v('fs9kFrom65', (c) => setPath(c, 'you.finalSalary', { has: true, yearly: 9000, fromAge: 65 })),
    v('fs60kFrom60', (c) => setPath(c, 'you.finalSalary', { has: true, yearly: 60000, fromAge: 60 }))
  ] },
  { name: 'endAge', values: [v('to95', () => {}), v('to100', (c) => setPath(c, 'endAge', 100))] },
  { name: 'partTime', values: [
    v('noWork', () => {}),
    v('work12570x3', (c) => setPath(c, 'partTime', { has: true, yearly: 12570, years: 3 })),
    v('work30000x1', (c) => setPath(c, 'partTime', { has: true, yearly: 30000, years: 1 })),
    v('work30000x10', (c) => setPath(c, 'partTime', { has: true, yearly: 30000, years: 10 }))
  ] },
  partnerDim('partnerAge', [53, 58, 62].map((a) => v(`partnerAge${a}`, (c) => setPath(c, 'partner.age', a)))),
  partnerDim('partnerPot', [0, 150_000].map((p) => v(`partnerPot${p}`, (c) => setPath(c, 'partner.pot', p)))),
  partnerDim('partnerPayIn', [0, 400].map((p) => v(`partnerPayIn${p}`, (c) => setPath(c, 'partner.payIn', { kind: 'total', total: p }))))
];

/** True when value `b` of dimension `db` may sit beside value `a` of dimension `da` in one case. */
export function compatibleA(da, a, db, b) {
  const link = (d, x, other, y) => {
    if (d.name === 'household' && other.partner) return (x.id === 'single') === (y.id === NA);
    if (d.name === 'age' && other.name === 'stop') return y.stop === 'now' || y.stop >= x.age;      // no stop before today
    return true;
  };
  if (!link(da, a, db, b) || !link(db, b, da, a)) return false;
  if (da.partner && db.partner) return (a.id === NA) === (b.id === NA);
  return true;
}

/** Every pair that has to be covered, as pairs.mjs does it, with A's compatibility. */
function pairsToCover(dims) {
  const out = [];
  for (let i = 0; i < dims.length; i++) {
    for (let j = i + 1; j < dims.length; j++) {
      if ((dims[i].name === 'household' && dims[j].partner) || (dims[i].partner && dims[j].partner)) continue;
      for (let a = 0; a < dims[i].values.length; a++) {
        for (let b = 0; b < dims[j].values.length; b++) {
          if (compatibleA(dims[i], dims[i].values[a], dims[j], dims[j].values[b])) out.push([i, a, j, b]);
        }
      }
    }
  }
  return out;
}

const key = (i, a, j, b) => `${i}:${a}|${j}:${b}`;

/** The greedy all-pairs walk of pairs.mjs, with A's compatibility. Each case: one value index per dimension. */
export function allPairsA(dims = DIMENSIONS_A) {
  const uncovered = new Set(pairsToCover(dims).map(([i, a, j, b]) => key(i, a, j, b)));
  const cases = [];
  const uncoveredWith = (f, y) => { let n = 0; for (const k of uncovered) { const [l, r] = k.split('|'); if (l === `${f}:${y}` || r === `${f}:${y}`) n++; } return n; };
  while (uncovered.size) {
    const chosen = new Array(dims.length).fill(-1);
    for (let d = 0; d < dims.length; d++) {
      let best = -1;
      let bestCount = -Infinity;
      for (let x = 0; x < dims[d].values.length; x++) {
        let ok = true;
        let count = 0;
        for (let e = 0; e < d; e++) {
          if (!compatibleA(dims[e], dims[e].values[chosen[e]], dims[d], dims[d].values[x])) { ok = false; break; }
          if (uncovered.has(key(e, chosen[e], d, x))) count++;
        }
        if (!ok) continue;
        for (let f = d + 1; f < dims.length; f++) {
          for (let y = 0; y < dims[f].values.length; y++) {
            if (uncovered.has(key(d, x, f, y))) count += 0.001;
            if (!compatibleA(dims[d], dims[d].values[x], dims[f], dims[f].values[y])) count -= 0.001 * uncoveredWith(f, y);
          }
        }
        if (count > bestCount) { bestCount = count; best = x; }
      }
      chosen[d] = best;
    }
    let newly = 0;
    for (let i = 0; i < dims.length; i++) for (let j = i + 1; j < dims.length; j++) if (uncovered.delete(key(i, chosen[i], j, chosen[j]))) newly++;
    if (!newly) throw new Error('the generator made a case that covers nothing: a value is unreachable');
    cases.push(chosen);
  }
  return cases;
}

/** A case (value indexes) → { name, inputs }. */
export function caseInputsA(chosen, dims = DIMENSIONS_A) {
  const inputs = {};
  const names = [];
  dims.forEach((dim, d) => {
    const val = dim.values[chosen[d]];
    if (val.id !== NA) { val.set(inputs); names.push(val.id); }
  });
  return { name: names.join('·'), inputs };
}

export const pairCasesA = (dims = DIMENSIONS_A) => allPairsA(dims).map((c) => caseInputsA(c, dims));

/** household (2) × final-salary (2) × State Pension (2) × saving risk (3) × part-time (2): 48. */
export function coreCasesA() {
  const out = [];
  for (const household of ['single', 'couple']) {
    for (const fs of [false, true]) {
      for (const sp of [true, false]) {
        for (const savingRisk of ['cautious', 'balanced', 'adventurous']) {
          for (const work of [false, true]) {
            const inputs = { household, you: { age: 45, pot: 120000, payIn: { kind: 'total', total: 400 } }, stop: { kind: 'age', age: 60 }, spend: { kind: 'amount', amount: 2608 }, savingRisk };
            if (fs) inputs.you.finalSalary = { has: true, yearly: 9000, fromAge: 65 };
            if (!sp) inputs.you.statePension = { kind: 'none' };
            if (work) inputs.partTime = { has: true, yearly: 12570, years: 3 };
            if (household === 'couple') inputs.partner = { age: 43, pot: 60000, payIn: { kind: 'total', total: 200 } };
            out.push({ name: ['core', household, fs ? 'fs' : 'noFs', sp ? 'sp' : 'noSp', savingRisk, work ? 'work' : 'noWork'].join('·'), inputs });
          }
        }
      }
    }
  }
  return out;
}

/** The rise to 57, one stop age at a time: 13. */
export function stopCasesA() {
  const list = [[53, 54], [53, 55], [53, 56], [53, 57], [53, 58], [54, 54], [54, 55], [54, 56], [54, 57], [54, 58], [54, 60], [54, 66], [54, 67]];
  return list.map(([age, stop]) => ({
    name: `stop·${age}→${stop}`,
    inputs: { you: { age, pot: 250000, payIn: { kind: 'total', total: 400 } }, stop: { kind: 'age', age: stop }, spend: { kind: 'amount', amount: 1200 } }
  }));
}

export function buildCasesA() {
  return {
    what: 'Generated by tests/v7/gen/dimensionsA.mjs. Do not edit by hand: run node tests/v7/gen/dimensionsA.mjs.',
    dimensions: DIMENSIONS_A.map((d) => ({ name: d.name, values: d.values.map((x) => x.id) })),
    pairs: pairCasesA(),
    core: coreCasesA(),
    stops: stopCasesA()
  };
}

export const CASES_PATH_A = resolve(process.cwd(), 'tests/v7/a/cases.pairs.json');

/** One case per line, so a difference reads in review. */
export function casesTextA(cases) {
  const line = (c) => '    ' + JSON.stringify(c);
  return '{\n' +
    `  "what": ${JSON.stringify(cases.what)},\n` +
    `  "dimensions": ${JSON.stringify(cases.dimensions)},\n` +
    `  "pairs": [\n${cases.pairs.map(line).join(',\n')}\n  ],\n` +
    `  "core": [\n${cases.core.map(line).join(',\n')}\n  ],\n` +
    `  "stops": [\n${cases.stops.map(line).join(',\n')}\n  ]\n}\n`;
}

if (process.argv[1] && process.argv[1].endsWith('dimensionsA.mjs')) {
  const cases = buildCasesA();
  writeFileSync(CASES_PATH_A, casesTextA(cases));
  console.log(`${cases.pairs.length} pair cases, ${cases.core.length} core, ${cases.stops.length} stop ages → ${CASES_PATH_A}`);
}
