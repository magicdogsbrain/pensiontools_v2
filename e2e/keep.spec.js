/**
 * "Save this as a plan" (research/v7/save-as-plan.md, Contract C.1–C.4), on the PUBLISHED build, hooks off:
 *   - at the foot of the answer: the name box holds the suggestion (never "My plan"); nothing is stored before "Save";
 *   - "Save as a plan" writes the plan seed to this browser — exactly the seed Node builds from the same answer — and
 *     opens /#new-plan in the same tab;
 *   - Back returns to V7 with the figures kept in the tab, and says the figures are waiting in the planner; once the
 *     planner has made the plan — and only on its word, the receipt it leaves in the tab — "Saved as '…'. Try something
 *     else and save that too."; on its word that no plan was made ("Not now"), "Not saved …" (review, 1 Oct 2026);
 *   - a seed over a day old is deleted when V7 starts, whichever tab wrote it (the privacy policy's "never used after a
 *     day");
 *   - a second save replaces the first (one seed at a time); a browser that will not keep it gets the plain sentence
 *     and stays where it is;
 *   - no figure in any address, at any point.
 *
 * Today's planner at / is stood in for by a page of one line: what V7 hands over is this test's business; how the
 * planner reads it is today's side's own (tests/integration). Nothing here signs in or reaches outside the site.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, v7, waitsFor, NEEDS, PROD, REPO, FIXED_NOW, TODAY, FINAL_ENV, fixtureTyping, mustFill } from './helpers/app.js';
import { buildPlanSeed, SEED_KEY, RECEIPT_KEY } from '../src/answers/keep/planSeed.js';
import { suggestedPlanName } from '../src/answers/shared/planName.js';
import { KEEP } from '../src/v7/copy/keep.js';

const VERSION = JSON.parse(readFileSync(join(REPO, 'package.json'), 'utf8')).version;
const ENV_OF = { a: { ...FINAL_ENV, detail: 'chart' }, b: { ...FINAL_ENV, detail: 'answer' }, c: FINAL_ENV };

/** Every address the page went to, and every request it made. */
function addresses(page) {
  const seen = [];
  page.on('framenavigated', (f) => { if (f === page.mainFrame()) seen.push(f.url()); });
  page.on('request', (r) => seen.push(r.url()));
  return seen;
}
/** No figure in any address: no query string anywhere, no digit after a "#", none of the figures typed in a path. */
function noFigureIn(page, seen, figures) {
  for (const u of [...seen, page.url()]) {
    const url = new URL(u);
    expect(url.search, `a query string: ${u}`).toBe('');
    expect(/\d/.test(url.hash), `a figure in the address ${u}`).toBe(false);
    if (!/\/assets\//.test(url.pathname)) for (const f of figures) expect(decodeURIComponent(url.pathname), u).not.toContain(f);
  }
}
/** The planner at /, stood in for. */
async function plannerStandIn(page) {
  await page.route((url) => url.origin === PROD && (url.pathname === '/' || url.pathname === '/index.html'),
    (route) => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: '<!doctype html><meta charset="utf-8"><title>Planner</title><p id="planner">The planner</p>' }));
}
const seedNow = (page) => page.evaluate((k) => localStorage.getItem(k), SEED_KEY).then((t) => (t === null ? null : JSON.parse(t)));
/** What today's planner does when it is done with a seed (src/services/PlanSeed.js): deletes it and leaves its word in the tab. */
const plannerSays = (page, outcome, name = null) => page.evaluate(([k, rk, at, o, n]) => {
  localStorage.removeItem(k);
  sessionStorage.setItem(rk, JSON.stringify({ [at]: n ? { outcome: o, name: n } : { outcome: o } }));
}, [SEED_KEY, RECEIPT_KEY, FIXED_NOW, outcome, name]);

/** Types question q's must-fill figures from a fixture, asks, and waits for the final answer. */
async function answer(app, q, fixture) {
  const typing = fixtureTyping(fixture);
  app.as(q);
  await app.open(`#/${q}/numbers`);
  await app.ready();
  await app.fill(Object.fromEntries(mustFill(q, typing).map((p) => [p, typing[p]]).filter(([, v]) => v !== undefined)));
  await app.click(`${q}.action.show`);
  await app.at(`${q}.answer`);
  await app.ready(120_000);
  return { typing, result: app.engine(ENV_OF[q]) };
}

test.describe('save this as a plan (the published build)', () => {
  test('A: the suggested name, a name of their own, the seed, the planner — and back: waiting, then "Saved as"', async ({ page }) => {
    waitsFor(...NEEDS.a);
    test.setTimeout(240_000);
    const seen = addresses(page);
    await plannerStandIn(page);
    const app = v7(page, 'prod', 'a');
    let got = null;
    await app.step('answers "When can I afford to stop work?"', async () => { got = await answer(app, 'a', 'A1'); });
    const suggested = suggestedPlanName('a', got.result.inputs, got.result);

    await app.step('the panel at the foot of the answer: the name filled in; nothing stored yet', async () => {
      const box = app.id('a.keep.name');
      await box.scrollIntoViewIfNeeded();
      await expect(box).toHaveValue(suggested);
      expect(suggested).not.toMatch(/my plan/i);
      await expect(page.locator('#app [data-region="keep"] h2')).toHaveText(KEEP.title);
      await expect(page.locator('#app [data-region="keep"]')).toContainText(KEEP.note);
      expect(await seedNow(page)).toBe(null);
    });

    await test.step('a name of their own; "Save as a plan": the seed, then the planner\'s address', async () => {
      await app.id('a.keep.name').fill('Early, with care');
      await app.click('a.action.save');
      await page.waitForURL(`${PROD}/#new-plan`);
      await expect(page.locator('#planner')).toBeVisible();
      const seed = await seedNow(page);
      expect(seed.createdAt).toBe(FIXED_NOW);
      expect(seed.v7.appVersion).toBe(VERSION);
      expect(seed).toEqual(buildPlanSeed({ source: 'a', result: got.result, env: { today: TODAY, appVersion: VERSION },
        name: { suggested, chosen: 'Early, with care' }, budget: null, spendHow: null, createdAt: FIXED_NOW }));
    });

    await app.step('Back: V7 as it was, its figures kept in the tab; the save waiting in the planner', async () => {
      await page.goBack();
      await app.at('a.answer');
      await app.ready(120_000);
      await expect(app.id('a.you.age')).toHaveCount(0);
      await expect(app.id('a.keep.waiting')).toContainText('Early, with care');
      await expect(app.id('a.keep.open')).toHaveAttribute('href', '../#new-plan');
    }, { answer: () => got.result });

    await app.step('the planner\'s word that no plan was made ("Not now"): "Not saved …" — never "Saved as"', async () => {
      await plannerSays(page, 'declined');
      await page.reload();
      await app.at('a.answer');
      await app.ready(120_000);
      await expect(app.id('a.keep.notSaved')).toHaveText('Not saved: you chose not to make ‘Early, with care’ in the planner. Your figures are still here; save again whenever you like.');
      await expect(app.id('a.keep.saved')).toHaveCount(0);
    }, { answer: () => got.result });

    await app.step('once the planner has made it: "Saved as …"; the box is there for the next try', async () => {
      await plannerSays(page, 'made', 'Early, with care');
      await page.reload();
      await app.at('a.answer');
      await app.ready(120_000);
      await expect(app.id('a.keep.saved')).toHaveText('Saved as ‘Early, with care’. Try something else and save that too.');
      await expect(app.id('a.keep.name')).toHaveValue(suggested);                     // the next try gets its own name
    }, { answer: () => got.result });

    await test.step('no figure in any address, at any point', async () => {
      noFigureIn(page, seen, Object.values(got.typing).filter((v) => typeof v === 'string' && v.replace(/\D/g, '').length >= 4));
    });
  });

  test('C, then B: each its own seed — one at a time, the later replacing the earlier', async ({ page }) => {
    waitsFor(...NEEDS.b);
    test.setTimeout(240_000);
    const seen = addresses(page);
    await plannerStandIn(page);
    const app = v7(page, 'prod', 'c');
    const c = await answer(app, 'c', 'F1');
    await app.click('c.action.save');
    await page.waitForURL(`${PROD}/#new-plan`);
    const first = await seedNow(page);
    expect(first).toEqual(buildPlanSeed({ source: 'c', result: c.result, env: { today: TODAY, appVersion: VERSION },
      name: { suggested: suggestedPlanName('c', c.result.inputs, c.result), chosen: suggestedPlanName('c', c.result.inputs, c.result) }, createdAt: FIXED_NOW }));
    expect(first.name.chosen).toBe('From 58 · £1,350 a month');               // F1's careful amount at 0.5% a year in charges (6.19.0)
    expect(first.inputs.charge).toBe(0.5);                                        // the answer's one charge travels in the seed

    const b = await answer(app, 'b', 'B3');
    await app.id('b.action.save').scrollIntoViewIfNeeded();
    await app.click('b.action.save');
    await page.waitForURL(`${PROD}/#new-plan`);
    const second = await seedNow(page);
    expect(second.source).toBe('b');
    expect(second).toEqual(buildPlanSeed({ source: 'b', result: b.result, env: { today: TODAY, appVersion: VERSION },
      name: { suggested: suggestedPlanName('b', b.result.inputs, b.result), chosen: suggestedPlanName('b', b.result.inputs, b.result) }, createdAt: FIXED_NOW }));
    noFigureIn(page, seen, ['250000', '250,000', '350000', '350,000']);
  });

  test('a seed over a day old is deleted when V7 starts, whichever tab wrote it; a fresh one is left for the planner', async ({ page }) => {
    waitsFor(...NEEDS.a);   // the plan seed came with A and B; C's screens are always built
    const app = v7(page, 'prod', 'c');
    await app.open('#/c/numbers');
    await app.ready();
    const old = { seedVersion: 1, createdAt: new Date(Date.parse(FIXED_NOW) - 30 * 24 * 3600 * 1000).toISOString(), budget: { lines: [{ label: 'Personal health', annual: 480 }] } };
    await page.evaluate(([k, v]) => localStorage.setItem(k, v), [SEED_KEY, JSON.stringify(old)]);
    await page.reload();
    await app.ready();
    expect(await seedNow(page)).toBe(null);
    await page.evaluate(([k, v]) => localStorage.setItem(k, v), [SEED_KEY, JSON.stringify({ ...old, createdAt: FIXED_NOW })]);
    await page.reload();
    await app.ready();
    expect((await seedNow(page)).createdAt).toBe(FIXED_NOW);
  });

  test('a browser that will not keep it: the plain sentence; the page stays; nothing goes anywhere', async ({ page }) => {
    waitsFor(...NEEDS.a);
    test.setTimeout(180_000);
    await page.addInitScript((key) => {
      const real = Storage.prototype.setItem;
      Storage.prototype.setItem = function refuse(k, v) { if (k === key) throw new DOMException('full', 'QuotaExceededError'); return real.call(this, k, v); };
    }, SEED_KEY);
    const app = v7(page, 'prod', 'a');
    await answer(app, 'a', 'A1');
    await app.step('"Save as a plan": refused, said plainly', async () => {
      await app.click('a.action.save');
      await expect(app.id('a.keep.problem')).toHaveText(KEEP.problems.storage);
      expect(new URL(page.url()).hash).toBe('#/a/answer');
      expect(await seedNow(page)).toBe(null);
    });
  });
});
