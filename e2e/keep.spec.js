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

/*
 * The spending shape, kept as a plan (research/v7/spending-shape.md 8, 9.7; the owner, 2 Oct 2026: "We MUST offer as many
 * steps and tapers as V6! … We must have Gogo, goslow and nogo years."), end to end on the PUBLISHED build with today's
 * real planner at /, without an account (the plans live in this tab only; every request outside the local server is
 * stopped, so nothing signs in): a person sets go-go £3,000 a month from 62, go-slow from 75 falling 2% a year, no-go
 * £2,000 a month from 85, in "When can I afford to stop work?"; saves it; and today's planner holds income steps whose
 * after-tax amount is the answer's in every year, to 50p a month. The household is made up (round, generic figures).
 */
test.describe('the spending shape, kept as a plan, in today\'s planner', () => {
  test.use({ outside: 'block' });
  test('A with go-go, go-slow and no-go → "Save as a plan" → today\'s planner: the same spending in every year', async ({ page, watch }) => {
    waitsFor(...NEEDS.a);
    const { SEED_VERSIONS, SEED_WORDS } = await import('../src/services/PlanSeed.js');
    test.skip(!SEED_VERSIONS.includes(3), 'waits for today\'s planner to read a seed whose spending changes with age (seed version 3: spending-shape.md 8.2)');
    test.setTimeout(300_000);
    // as on the live site today: the planner's engine worker asks for the market files beside itself (e2e/old-app-unchanged.spec.js)
    watch.allow(/^asked for a file that is not there: \/assets\/data\/(gilts|equity)\.json$/);
    const { amountAtAge } = await import('../src/services/IncomeSchedule.js');
    const { grossToNet } = await import('../src/services/TaxCalculator.js');
    const app = v7(page, 'prod', 'a');
    let answer = null;

    await app.step('the numbers, the figure, and the shape: £3,000 from 62; from 75 falling 2% a year; £2,000 from 85', async () => {
      await app.open('#/a/numbers');
      await app.ready();
      await app.fill({ 'you.age': '55', 'you.pot': '450000', 'stop.age': '62' });
      await app.toSpend('a');
      await app.set('spend.amount', '3000');
      await app.click('a.shape.open');
      for (const [age, amount] of [['75', '3000'], ['85', '2000']]) {
        await app.click('a.shape.add');
        const i = age === '75' ? 0 : 1;
        await app.id(`a.spend.steps.${i}.fromAge`).fill(age);
        await app.id(`a.spend.steps.${i}.perMonth`).fill(amount);
      }
      await app.id('a.spend.steps.0.then').selectOption('falls');
      await app.id('a.spend.steps.0.fallsPct').fill('2');
      await expect(app.id('a.shape.summary')).toHaveCount(0);                       // open: the steps themselves are on screen
      app.typed['spend.steps'] = [{ fromAge: '75', perMonth: '3000', then: 'falls', fallsPct: '2' }, { fromAge: '85', perMonth: '2000', then: 'level', fallsPct: '' }];
    });

    await app.step('the answer: the engine\'s, for the spending as set; each year drawn', async () => {
      await app.click('a.action.show');
      await app.at('a.answer');
      await app.ready(120_000);
      answer = app.engine({ ...FINAL_ENV, detail: 'chart' });
      expect(answer.spendShape.map((x) => [x.fromAge, x.then])).toEqual([[62, 'level'], [75, 'falls'], [85, 'level']]);
      await expect(app.id('a.shape.answer.list')).toContainText('£3,000 a month from 62; £3,000 from 75, falling 2% a year to');
    }, { answer: () => answer });

    await test.step('"Save as a plan": today\'s planner, without an account, makes the plan', async () => {
      await app.id('a.action.save').scrollIntoViewIfNeeded();
      await app.click('a.action.save');
      await page.waitForURL((u) => u.origin === PROD && !u.pathname.startsWith('/v7/'));
      await page.getByRole('button', { name: SEED_WORDS.carryOn }).click();
      await page.getByRole('button', { name: SEED_WORDS.save }).click();
      await expect(page.locator('#seedNote')).toBeVisible({ timeout: 60_000 });
    });

    await test.step('its income steps give the answer\'s spending, after tax, in every year — to 50p a month', async () => {
      const plans = await page.evaluate(() => JSON.parse(sessionStorage.getItem('pt_guest_scenarios') || '[]'));
      const made = plans.filter((p) => p.fromAnswer);
      expect(made).toHaveLength(1);
      expect(made[0].fromAnswer.seedVersion).toBe(3);
      const S = made[0].stressTool.settings;
      expect(S.incomeShape).toBe('phases');
      expect(S.incomeSteps.length).toBeGreaterThan(2);
      for (const row of answer.byYear) {
        const gross = Math.round(amountAtAge(S.incomeSteps, row.age));
        const net = grossToNet(gross, S.pa, S.brl, S.hrl) / 12;
        expect(Math.abs(net - row.spend), `at ${row.age}: the plan ${net.toFixed(2)}, the answer ${row.spend}`).toBeLessThanOrEqual(0.5);
      }
    });
  });

  // Review, 2 Oct 2026: a fall faster than today's slider goes (7.5% a year, each year under the personal allowance) was
  // kept as one step whose slider showed 5% beside a label saying 7.5%. Now it is one step a year; every fall written fits
  // the slider (min 0, max 5, quarter points), and every year is still the answer's figure.
  test('A falling 7.5% a year from the stop, under the personal allowance → "Save as a plan" → every fall fits today\'s slider, every year exact', async ({ page, watch }) => {
    waitsFor(...NEEDS.a);
    const { SEED_WORDS, PLANNER_DECLINE } = await import('../src/services/PlanSeed.js');
    test.setTimeout(300_000);
    watch.allow(/^asked for a file that is not there: \/assets\/data\/(gilts|equity)\.json$/);
    const { amountAtAge } = await import('../src/services/IncomeSchedule.js');
    const { grossToNet } = await import('../src/services/TaxCalculator.js');
    const app = v7(page, 'prod', 'a');
    let answer = null;

    await app.step('55, £200,000, stopping at 58; £900 a month falling 7.5% a year; £1,100 from 67', async () => {
      await app.open('#/a/numbers');
      await app.ready();
      await app.fill({ 'you.age': '55', 'you.pot': '200000', 'stop.age': '58' });
      await app.toSpend('a');
      await app.set('spend.amount', '900');
      await app.click('a.shape.open');
      await app.id('a.spend.then').selectOption('falls');
      await app.id('a.spend.fallsPct').fill('7.5');
      await app.click('a.shape.add');
      await app.id('a.spend.steps.0.fromAge').fill('67');
      await app.id('a.spend.steps.0.perMonth').fill('1100');
      app.typed['spend.then'] = 'falls';
      app.typed['spend.fallsPct'] = '7.5';
      app.typed['spend.steps'] = [{ fromAge: '67', perMonth: '1100', then: 'level', fallsPct: '' }];
    });

    await app.step('the answer', async () => {
      await app.click('a.action.show');
      await app.at('a.answer');
      await app.ready(120_000);
      answer = app.engine({ ...FINAL_ENV, detail: 'chart' });
      expect(answer.spendShape[0]).toMatchObject({ fromAge: 58, perMonth: 900, then: 'falls', fallsPct: 7.5 });
    }, { answer: () => answer });

    await test.step('"Save as a plan": today\'s planner makes it', async () => {
      await app.id('a.action.save').scrollIntoViewIfNeeded();
      await app.click('a.action.save');
      await page.waitForURL((u) => u.origin === PROD && !u.pathname.startsWith('/v7/'));
      await page.getByRole('button', { name: SEED_WORDS.carryOn }).click();
      await page.getByRole('button', { name: SEED_WORDS.save }).click();
      await expect(page.locator('#seedNote')).toBeVisible({ timeout: 60_000 });
    });

    await test.step('every fall fits today\'s slider, and every year is the answer\'s figure to 50p a month', async () => {
      const plans = await page.evaluate(() => JSON.parse(sessionStorage.getItem('pt_guest_scenarios') || '[]'));
      const made = plans.filter((p) => p.fromAnswer);
      expect(made).toHaveLength(1);
      const S = made[0].stressTool.settings;
      for (const st of S.incomeSteps) {
        if (!st.decline) continue;
        expect(st.decline, JSON.stringify(st)).toBeLessThanOrEqual(PLANNER_DECLINE.max);
        expect(Number.isInteger(st.decline / PLANNER_DECLINE.step), JSON.stringify(st)).toBe(true);
      }
      for (const row of answer.byYear) {
        const gross = Math.round(amountAtAge(S.incomeSteps, row.age));
        const net = grossToNet(gross, S.pa, S.brl, S.hrl) / 12;
        expect(Math.abs(net - row.spend), `at ${row.age}: the plan ${net.toFixed(2)}, the answer ${row.spend}`).toBeLessThanOrEqual(0.5);
      }
    });
  });
});
