/**
 * The dimensions of question B for the all-pairs list (step 4 brief 3, P3; the test plan's 8.2 with the brief's paths),
 * the 48 core cases and the 12 stop-age cases. The generator itself is tests/v7/gen/pairs.mjs, unchanged: it takes the
 * dimensions as an argument.
 *
 * The stop age is always after today's age (B's rule), so its values are set from the age already chosen: "stop at 60"
 * means 60, or the year after today's age for anyone already 60 or more — the same device as C's "start later".
 *
 * Writes tests/v7/b/cases.pairs.json:  node tests/v7/gen/dimensionsB.mjs   (npm run v7:cases runs it with C's and A's).
 * The file is committed; tests/v7/b/pairs.test.js regenerates it and fails when it differs.
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pairCases, setPath } from './pairs.mjs';

const NA = 'n/a';
const v = (id, set) => ({ id, set });
const partnerDim = (name, values) => ({ name, partner: true, values: [v(NA, () => {}), ...values] });
/** A stop age of `at`, or the year after today's age when that is later (B asks only about stopping after today). */
const stopAt = (at) => (c) => setPath(c, 'stop.age', Math.min(75, Math.max(at, c.you.age + 1)));

export const DIMENSIONS_B = [
  { name: 'household', values: [v('single', (c) => setPath(c, 'household', 'single')), v('couple', (c) => setPath(c, 'household', 'couple'))] },
  { name: 'age', values: [25, 40, 45, 47, 53, 54, 55, 56, 57, 60, 65, 70].map((a) => v(`age${a}`, (c) => setPath(c, 'you.age', a))) },
  { name: 'stop', values: [
    v('stopNextYear', (c) => setPath(c, 'stop.age', c.you.age + 1)),
    v('stop55', stopAt(55)), v('stop56', stopAt(56)), v('stop57', stopAt(57)), v('stop60', stopAt(60)),
    v('stop65', stopAt(65)), v('stop67', stopAt(67)), v('stop70', stopAt(70))
  ] },
  { name: 'pot', values: [0, 1, 10_000, 120_000, 250_000, 1_073_100, 3_000_000].map((p) => v(`pot${p}`, (c) => setPath(c, 'you.pot', p))) },
  { name: 'payIn', values: [
    ...[0, 100, 400, 1_000, 5_000].map((p) => v(`payIn${p}`, (c) => setPath(c, 'you.payIn', { kind: 'total', total: p }))),
    v('payInSplit', (c) => setPath(c, 'you.payIn', { kind: 'split', own: 450, employer: 250 }))
  ] },
  { name: 'alreadyDrawing', values: [v('notDrawing', () => {}), v('alreadyDrawing', (c) => setPath(c, 'you.alreadyDrawing', true))] },
  { name: 'savings', values: [v('savings0', () => {}), v('savings60k', (c) => setPath(c, 'savings', 60_000)), v('savings150k', (c) => setPath(c, 'savings', 150_000))] },
  { name: 'savingsIn', values: [v('savingsIn0', () => {}), v('savingsIn500', (c) => setPath(c, 'savingsIn', 500))] },
  { name: 'spend', values: [
    ...[500, 1_200, 2_608, 3_592, 8_000].map((s) => v(`spend${s}`, (c) => setPath(c, 'spend', { kind: 'amount', amount: s }))),
    v('spendModerate', (c) => setPath(c, 'spend', { kind: 'level', level: 'moderate' }))
  ] },
  { name: 'savingRisk', values: ['cautious', 'balanced', 'adventurous'].map((r) => v(`saving${r}`, (c) => setPath(c, 'savingRisk', r))) },
  { name: 'risk', values: ['cautious', 'balanced', 'adventurous'].map((r) => v(`drawing${r}`, (c) => setPath(c, 'risk', r))) },
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
  { name: 'charge', values: [v('chargeDefault', () => {}), v('charge0', (c) => setPath(c, 'charge', 0)), v('charge1.5', (c) => setPath(c, 'charge', 1.5))] },
  // how the savings grow (6.22.0): "Mostly cash" (the default, once there are savings) or "Invested like my pension"
  { name: 'isaGrowth', values: [v('isaGrowthDefault', () => {}), v('invested', (c) => setPath(c, 'isaGrowth', 'invested'))] },
  { name: 'confidence', values: [v('nineInTen', () => {}), v('threeInFour', (c) => setPath(c, 'confidence', 'threeInFour'))] },
  partnerDim('partnerAge', [53, 58, 62].map((a) => v(`partnerAge${a}`, (c) => setPath(c, 'partner.age', a)))),
  partnerDim('partnerPot', [0, 150_000].map((p) => v(`partnerPot${p}`, (c) => setPath(c, 'partner.pot', p)))),
  partnerDim('partnerPayIn', [0, 400].map((p) => v(`partnerPayIn${p}`, (c) => setPath(c, 'partner.payIn', { kind: 'total', total: p }))))
];

/** household (2) × final-salary (yes, no) × State Pension (yes, no) × saving risk (3) × confidence (2) on one middle-of-the-road saver: 48. */
export function coreCasesB() {
  const out = [];
  for (const household of ['single', 'couple']) {
    for (const fs of [false, true]) {
      for (const sp of [true, false]) {
        for (const savingRisk of ['cautious', 'balanced', 'adventurous']) {
          for (const confidence of ['nineInTen', 'threeInFour']) {
            const inputs = { household, you: { pot: 120000, age: 45, payIn: { total: 400 } }, stop: { age: 60 }, spend: { amount: 2608 }, savingRisk, confidence };
            if (fs) inputs.you.finalSalary = { has: true, yearly: 9000, fromAge: 65 };
            if (!sp) inputs.you.statePension = { kind: 'none' };
            if (household === 'couple') inputs.partner = { age: 43, pot: 60000, payIn: { total: 200 } };
            out.push({ name: ['core', household, fs ? 'fs' : 'noFs', sp ? 'sp' : 'noSp', savingRisk, confidence].join('·'), inputs });
          }
        }
      }
    }
  }
  return out;
}

/**
 * The stop ages that cross the rise to 57 on 6 April 2028, one at a time (test plan 8.1, B's twelve): a 53-year-old
 * stopping at 54 to 58, a 54-year-old stopping at 55 to 58 and at 60, 66 and 67 — single, £250,000, £400 a month,
 * £1,200 a month, everything else left alone. A failure names the age.
 */
export function stopAgeCasesB() {
  const pairs = [...[54, 55, 56, 57, 58].map((s) => [53, s]), ...[55, 56, 57, 58, 60, 66, 67].map((s) => [54, s])];
  return pairs.map(([age, stop]) => ({ name: `stop·${age}→${stop}`, inputs: { you: { pot: 250000, age, payIn: { total: 400 } }, stop: { age: stop }, spend: { amount: 1200 } } }));
}

export function buildCasesB() {
  return {
    what: 'Generated by tests/v7/gen/dimensionsB.mjs with tests/v7/gen/pairs.mjs. Do not edit by hand: run node tests/v7/gen/dimensionsB.mjs.',
    dimensions: DIMENSIONS_B.map((d) => ({ name: d.name, values: d.values.map((x) => x.id) })),
    pairs: pairCases(DIMENSIONS_B),
    core: coreCasesB(),
    ages: stopAgeCasesB()
  };
}

export const CASES_B_PATH = resolve(process.cwd(), 'tests/v7/b/cases.pairs.json');

/** One case per line, so a difference reads in review. */
export function casesTextB(cases) {
  const line = (c) => '    ' + JSON.stringify(c);
  return '{\n' +
    `  "what": ${JSON.stringify(cases.what)},\n` +
    `  "dimensions": ${JSON.stringify(cases.dimensions)},\n` +
    `  "pairs": [\n${cases.pairs.map(line).join(',\n')}\n  ],\n` +
    `  "core": [\n${cases.core.map(line).join(',\n')}\n  ],\n` +
    `  "ages": [\n${cases.ages.map(line).join(',\n')}\n  ]\n}\n`;
}

if (process.argv[1] && process.argv[1].endsWith('dimensionsB.mjs')) {
  const cases = buildCasesB();
  writeFileSync(CASES_B_PATH, casesTextB(cases));
  console.log(`${cases.pairs.length} pair cases, ${cases.core.length} core, ${cases.ages.length} stop ages → ${CASES_B_PATH}`);
}
