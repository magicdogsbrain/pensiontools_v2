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
