/**
 * The same answer in every browser (test plan 9). Chromium, WebKit and Firefox, against the test build.
 *
 * The page's own answer function (window.__pt.answer) and the worker (window.__pt.answerInWorker) are given
 * a list of cases; Node runs the same list. Every decision, every displayed figure, every sentence and the
 * assumed list must be EXACTLY equal; raw money within 1p or one part in a thousand million. Direct call and
 * worker call in the same browser must be byte-identical.
 *
 * Cases on every push: the three fixtures and ten age-boundary cases (from the input list), plus the first
 * cases of the pairs list when it exists. At night (NIGHTLY=1): the whole pairs list. 40 futures, as the tests.
 *
 * Step 4 (brief 6 P6; test plan 12): questions A and B and the saving years, about 30 cases — A's four fixtures
 * with `env.ages` of three, the 13 stop-age cases, B's five fixtures, BF1–BF4, and CF-S1–S3 (the saving years in a
 * made-up market, read from A's `saving` block). A made-up market cannot be posted to a worker (it is a function),
 * so those cases compare the page with Node only; every other case compares the worker too. The same rules: every
 * decision, displayed figure and sentence exactly; raw money within 1p. These run against whatever the page and
 * Node both carry — P0's stubs today, the real answers once they land.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, v7, waitsFor, fixtureTyping, NIGHTLY, REPO, TODAY } from './helpers/app.js';
import { answersInNode, differences } from './helpers/answerInNode.js';
import { SCHEMA_C } from '../src/answers/c/schema.js';

const ENV = { today: TODAY, futures: 40, seed: 0, trace: false };

function cases() {
  const list = [];
  for (const name of ['F1', 'F2', 'F3']) list.push({ name, draft: fixtureTyping(name) });
  const ages = SCHEMA_C.fields.find((f) => f.path === 'you.age').boundaries.slice(0, 10);
  for (const age of ages) list.push({ name: `age-${age}`, draft: { 'you.pot': '250000', 'you.age': String(age) } });
  const pairs = join(REPO, 'tests', 'v7', 'c', 'cases.pairs.json');
  if (existsSync(pairs)) {
    const data = JSON.parse(readFileSync(pairs, 'utf8'));
    const items = (Array.isArray(data) ? data : data.cases || []).filter((c) => c && c.inputs);
    for (const [i, c] of (NIGHTLY ? items : items.slice(0, 7)).entries()) list.push({ name: c.id || c.name || `pairs-${i}`, inputs: c.inputs });
  }
  return list;
}

test.describe('the same answer in this browser as in Node', () => {
  test('the V7 page starts in this browser with no error', async ({ page }, testInfo) => {
    const app = v7(page, 'test');
    await app.open('#/');
    await app.ready();
    expect(await app.screen()).toBe('front');
    expect(testInfo.project.name).toMatch(/^sameness-/);
    // £1,380 must read the same everywhere: the formatter is the app's own, never the browser's locale.
    expect(await page.evaluate(() => (1380).toLocaleString('en-GB'))).toBe('1,380');
  });

  test('every case: decisions, figures and sentences exactly; raw money within 1p; worker equals direct call', async ({ page }) => {
    waitsFor('hooks');
    test.setTimeout(NIGHTLY ? 20 * 60_000 : 5 * 60_000);
    const list = cases();
    const inNode = answersInNode(list.map((c) => ({ draft: c.draft, inputs: c.inputs, env: ENV })));

    const app = v7(page, 'test');
    await app.open('#/');
    await app.ready();

    const parsed = await page.evaluate(({ list, env }) => {
      // Typed drafts go through the page's own parseDraft (as a person's typing would); checked inputs go straight in.
      const s = window.__pt.getState();
      return list.map((c) => (c.inputs ? c.inputs : window.__pt.parseDraft ? window.__pt.parseDraft('c', c.draft, { ...s.env, ...env }).inputs : null));
    }, { list, env: ENV });

    const report = [];
    for (const [i, c] of list.entries()) {
      const expected = inNode[i];
      // Where the page cannot parse a draft, use the inputs Node parsed (the same function, same result).
      const inputs = parsed[i] || expected.inputs;
      const direct = await page.evaluate(({ inputs, env }) => window.__pt.answer('c', inputs, env), { inputs, env: ENV });
      const viaWorker = await page.evaluate(({ inputs, env }) => window.__pt.answerInWorker('c', inputs, env), { inputs, env: ENV });
      const diffs = differences(direct, expected);
      if (diffs.length) report.push(`${c.name} (page against Node):\n  ${diffs.slice(0, 12).join('\n  ')}`);
      if (JSON.stringify(direct) !== JSON.stringify(viaWorker)) report.push(`${c.name}: the worker's answer is not byte-identical to the page's`);
      expect(direct.status, c.name).toBe(expected.status);
    }
    expect(report, `${list.length} cases`).toEqual([]);
  });
});

// ---- Step 4: questions A and B ------------------------------------------------------------------------------

const NO_SP = { kind: 'none' };
const CASH = { equity: 0, bond: 0, cash: 1 };
const SHARES = { equity: 1, bond: 0, cash: 0 };
/** One made-up future (or several), described as data: each side builds env.futureReturns from it. */
const FLAT = { ...ENV, futures: 1, market: { equity: 0, inflation: 0 }, mix: CASH, savingMix: CASH, savingsGrowth: 0 };

function threeAges(age, stop) {
  return [stop - 1, stop, stop + 1].filter((a) => a >= age && a <= 75);
}

function casesAB() {
  const list = [];
  // A's four fixtures, as typed, with three stop ages each.
  for (const name of ['A1', 'A2', 'A3', 'A4']) {
    const draft = fixtureTyping(name);
    const age = Number(draft['you.age']);
    const stop = Number(draft['stop.age'] || age);
    list.push({ q: 'a', name, draft, env: { ...ENV, detail: 'chart', ages: threeAges(age, stop) } });
  }
  // The 13 stop-age cases (test plan 8.1): the rise to 57 crossed both ways, and "stop now" for the 54-year-old.
  const stops = [[53, [54, 55, 56, 57, 58]], [54, [54, 55, 56, 57, 58, 60, 66, 67]]];
  for (const [age, list2] of stops) for (const stop of list2) {
    list.push({ q: 'a', name: `stop·${age}→${stop}`, inputs: { you: { age, pot: 250000, payIn: { kind: 'total', total: 400 } }, stop: { kind: 'age', age: stop }, spend: { kind: 'amount', amount: 1200 } }, env: { ...ENV, detail: 'chart', ages: [stop] } });
  }
  // B's five fixtures, as typed.
  for (const name of ['B1', 'B2', 'B3', 'B4', 'B5']) list.push({ q: 'b', name, draft: fixtureTyping(name), env: { ...ENV, detail: 'answer' } });
  // BF1–BF4 (test plan 5.4 with the brief's paths: the pay-in is what lands).
  const bf1 = { you: { age: 45, pot: 120000, payIn: { kind: 'total', total: 400 }, statePension: NO_SP }, stop: { age: 60 }, spend: { kind: 'amount', amount: 990 }, charge: 0 };
  list.push({ q: 'b', name: 'BF1 the number', inputs: bf1, env: { ...FLAT, detail: 'answer' }, madeUp: true });
  list.push({ q: 'b', name: 'BF2 already there', inputs: { ...bf1, you: { ...bf1.you, pot: 416000, payIn: { kind: 'total', total: 0 } } }, env: { ...FLAT, detail: 'answer' }, madeUp: true });
  list.push({ q: 'b', name: 'BF3 the confidence (five futures at 0%, five at −10%)', inputs: { ...bf1, confidence: 'threeInFour' }, env: { ...FLAT, futures: 10, market: { equity: [0, 0, 0, 0, 0, -0.1, -0.1, -0.1, -0.1, -0.1], inflation: 0 }, mix: SHARES, savingMix: SHARES, detail: 'answer' }, madeUp: true });
  list.push({ q: 'b', name: 'BF4 pension income alone', inputs: { you: { age: 60, pot: 50000, payIn: { kind: 'total', total: 100 } }, stop: { age: 67 }, spend: { kind: 'amount', amount: 1000 } }, env: { ...ENV, detail: 'answer' } });
  // CF-S1–S3: the saving years in a made-up market, read from A's `saving` block.
  const cf = (payIn, charge) => ({ you: { age: 45, pot: 120000, payIn: { kind: 'total', total: payIn }, statePension: NO_SP }, stop: { kind: 'age', age: 60 }, spend: { kind: 'amount', amount: 1000 }, charge });
  list.push({ q: 'a', name: 'CF-S1 nothing grows, no charge', inputs: cf(500, 0), env: { ...FLAT, detail: 'chart', ages: [60] }, madeUp: true });
  list.push({ q: 'a', name: 'CF-S2 nothing grows, 0.5% a year', inputs: cf(500, 0.5), env: { ...FLAT, detail: 'chart', ages: [60] }, madeUp: true });
  list.push({ q: 'a', name: 'CF-S3 shares at 5% a year, flat prices', inputs: cf(687.5, 0), env: { ...FLAT, market: { equity: 0.05, inflation: 0 }, mix: SHARES, savingMix: SHARES, detail: 'chart', ages: [60] }, madeUp: true });
  return list;
}

test.describe('the same answer in this browser as in Node: questions A and B and the saving years', () => {
  test('every A and B case: decisions, figures and sentences exactly; raw money within 1p; worker equals direct call', async ({ page }) => {
    waitsFor('hooks');
    test.setTimeout(NIGHTLY ? 20 * 60_000 : 5 * 60_000);
    const list = casesAB();
    expect(list.length).toBeGreaterThanOrEqual(28);
    const inNode = answersInNode(list.map((c) => ({ q: c.q, draft: c.draft, inputs: c.inputs, env: c.env })));

    const app = v7(page, 'test');
    await app.open('#/');
    await app.ready();

    const report = [];
    for (const [i, c] of list.entries()) {
      const expected = inNode[i];
      expect(expected.status, `${c.q}/${c.name} in Node`).not.toBe('invalid');
      const inputs = c.inputs || expected.inputs;
      // The page builds the made-up market from the same data, by the same few lines as helpers/answerInNode.js.
      const direct = await page.evaluate(({ q, inputs, env }) => {
        let e = env;
        if (env.market) {
          const { market, ...rest } = env;
          const at = (v, i) => (Array.isArray(v) ? v[i % v.length] : v);
          e = { ...rest, futureReturns: (i, years) => {
            const equity = {}; const inflation = {};
            for (let y = 0; y < years; y++) { equity[y] = Number(at(market.equity, i)) || 0; inflation[y] = Number(at(market.inflation, i)) || 0; }
            return { equity, inflation };
          } };
        }
        return window.__pt.answer(q, inputs, e);
      }, { q: c.q, inputs, env: c.env });
      const diffs = differences(direct, expected);
      if (diffs.length) report.push(`${c.q}/${c.name} (page against Node):\n  ${diffs.slice(0, 12).join('\n  ')}`);
      if (!c.madeUp) {
        const viaWorker = await page.evaluate(({ q, inputs, env }) => window.__pt.answerInWorker(q, inputs, env), { q: c.q, inputs, env: c.env });
        if (JSON.stringify(direct) !== JSON.stringify(viaWorker)) report.push(`${c.q}/${c.name}: the worker's answer is not byte-identical to the page's`);
      }
      expect(direct.status, `${c.q}/${c.name}`).toBe(expected.status);
    }
    expect(report, `${list.length} cases`).toEqual([]);
  });
});
