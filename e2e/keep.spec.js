/**
 * "Keep this as a plan" (research/v7/save-as-plan.md, Contract C.1–C.4; road-to-7.md step 7: the preview makes the plan
 * itself), on the PUBLISHED build, hooks off, without an account:
 *   - at the foot of the answer: the name box holds the suggestion (never "My plan"); nothing is stored before "Keep";
 *   - "Keep as a plan" makes ONE plan in this window (sessionStorage pt_guest_scenarios), the planner's own shape — exactly
 *     the plan Node makes from the same answer — named as typed, with "Lock this plan?" and "Your plans"; a reload still
 *     says "Kept as …"; the next try gets its own name; nothing is left in localStorage for the planner;
 *   - C, then B: each its own plan, side by side; a couple's answer two linked plans;
 *   - a browser that will not keep it gets the plain sentence and stays where it is; three plans fill the window;
 *   - no figure in any address, at any point.
 * Nothing here signs in or reaches outside the site.
 */
import { test, expect, v7, waitsFor, NEEDS, PROD, TODAY, FIXED_NOW, FINAL_ENV, fixtureTyping, mustFill } from './helpers/app.js';
import { buildPlanSeed, seedProblems } from '../src/answers/keep/planSeed.js';
import { plansFromSeed, withPartnerId } from '../src/answers/keep/planCreate.js';
import { suggestedPlanName } from '../src/answers/shared/planName.js';
import { VERSION } from '../src/constants.js';
import { KEEP } from '../src/v7/copy/keep.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const ENV_OF = { a: { ...FINAL_ENV, detail: 'chart' }, b: { ...FINAL_ENV, detail: 'answer' }, c: FINAL_ENV };

/** Every address the page went to, and every request it made. */
function addresses(page) {
  const seen = [];
  page.on('framenavigated', (f) => { if (f === page.mainFrame()) seen.push(f.url()); });
  page.on('request', (r) => seen.push(r.url()));
  return seen;
}
/** No figure in any address: no query string anywhere, no digit after a "#" (but a plan's id), none of the figures typed in a path. */
function noFigureIn(page, seen, figures) {
  for (const u of [...seen, page.url()]) {
    const url = new URL(u);
    expect(url.search, `a query string: ${u}`).toBe('');
    if (!/^#\/plan\//.test(url.hash)) expect(/\d/.test(url.hash), `a figure in the address ${u}`).toBe(false);
    if (!/\/assets\//.test(url.pathname)) for (const f of figures) expect(decodeURIComponent(url.pathname), u).not.toContain(f);
  }
}
const storedPlans = (page) => page.evaluate((k) => JSON.parse(sessionStorage.getItem(k) || '[]'), GUEST_KEY);
/** The plan(s) Node makes from the same answer, as the preview makes them (ids and the partner link aside). */
function expectedPlans(q, result, name, { takenNames = [], first = true } = {}) {
  const seed = buildPlanSeed({ source: q, result, env: { today: TODAY, appVersion: VERSION }, name: { suggested: suggestedPlanName(q, result.inputs, result), chosen: name }, budget: null, spendHow: null, createdAt: FIXED_NOW });
  expect(seedProblems(seed)).toEqual([]);
  return { seed, ...plansFromSeed(seed, { now: new Date(FIXED_NOW), takenNames, first }) };
}
const stripId = (plan) => { const { id, household, ...rest } = plan; void id; void household; return rest; };

/** Types question q's must-fill figures from a fixture (or every figure of it, `all`), asks, and waits for the final answer. */
async function answer(app, q, fixture, { all = false } = {}) {
  const typing = fixtureTyping(fixture);
  app.as(q);
  await app.open(`#/${q}/numbers`);
  await app.ready();
  const paths = all ? Object.keys(typing) : [...mustFill(q, typing), ...(typing['spend.kind'] ? ['spend.kind'] : [])];
  await app.fill(Object.fromEntries(paths.map((p) => [p, typing[p]]).filter(([, v]) => v !== undefined)));
  await app.click(`${q}.action.show`);
  await app.at(`${q}.answer`);
  await app.ready(120_000);
  return { typing, result: app.engine(ENV_OF[q]) };
}

test.describe('keep this as a plan (the published build)', () => {
  test('A: the suggested name, a name of their own, ONE plan made in this window — the planner\'s own shape — "Lock this plan?", a reload, the next try', async ({ page }) => {
    waitsFor(...NEEDS.a);
    test.setTimeout(240_000);
    const seen = addresses(page);
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
      await expect(app.id('a.action.save')).toHaveText(KEEP.save);
      expect(await storedPlans(page)).toEqual([]);
    });

    let made = null;
    await app.step('a name of their own; "Keep as a plan": the plan is made here, in this window, exactly as Node makes it', async () => {
      await app.id('a.keep.name').fill('Early, with care');
      await app.click('a.action.save');
      const note = app.id('a.keep.made');
      await expect(note).toBeVisible({ timeout: 60_000 });
      await expect(note).toContainText('Kept as ‘Early, with care’ in this browser window. Try something else and keep that too.');
      expect(new URL(page.url()).hash).toBe('#/a/answer');
      const plans = await storedPlans(page);
      expect(plans.length).toBe(1);
      made = plans[0];
      expect(made.id).toMatch(/^guest-[0-9a-z]{8}$/);
      const expected = expectedPlans('a', got.result, 'Early, with care');
      expect(stripId(made)).toEqual(stripId(expected.yours));
      expect(made.fromAnswer).toEqual(expected.yours.fromAnswer);                      // the seed as the planner keeps it with the plan
      expect(made.fromAnswer.seedVersion).toBe(expected.seed.seedVersion);
      expect(made.createdAt).toBe(FIXED_NOW);
      expect(made.isActive).toBe(true);
      await expect(app.id('a.keep.lock')).toHaveAttribute('href', `#/plan/${made.id}/lock`);
      await expect(app.id('a.keep.plans')).toHaveAttribute('href', '#/plans');
      await expect(app.id('a.keep.name')).toHaveValue(suggested);                     // the next try gets its own name
      expect(await page.evaluate(() => Object.keys(localStorage))).not.toContain('pt_v7_plan_seed');
    }, { answer: () => got.result });

    await app.step('a reload still says "Kept as …"; "Your plans" shows it', async () => {
      await page.reload();
      await app.at('a.answer');
      await app.ready(120_000);
      await expect(app.id('a.keep.made')).toContainText('Kept as ‘Early, with care’');
      await page.goto(PROD + '/v7/#/plans');
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plans');
      await expect(page.locator('#app')).toContainText('Early, with care');
    });

    await test.step('no figure in any address, at any point', async () => {
      noFigureIn(page, seen, Object.values(got.typing).filter((v) => typeof v === 'string' && v.replace(/\D/g, '').length >= 4));
    });
  });

  test('C, then B: each its own plan, side by side; a couple\'s answer is two linked plans', async ({ page }) => {
    waitsFor(...NEEDS.b);
    test.setTimeout(300_000);
    const seen = addresses(page);
    const app = v7(page, 'prod', 'c');
    const c = await answer(app, 'c', 'F1');
    await app.click('c.action.save');
    await expect(app.id('c.keep.made')).toBeVisible({ timeout: 60_000 });
    const first = await storedPlans(page);
    expect(first.length).toBe(1);
    expect(first[0].planDetails.name).toBe('From 58 · £1,350 a month');               // F1's careful amount at 0.5% a year in charges (6.19.0)
    expect(first[0].fromAnswer.inputs.charge).toBe(0.5);
    expect(stripId(first[0])).toEqual(stripId(expectedPlans('c', c.result, 'From 58 · £1,350 a month').yours));

    const b = await answer(app, 'b', 'B5', { all: true });
    await app.id('b.action.save').scrollIntoViewIfNeeded();
    await app.click('b.action.save');
    await expect(app.id('b.keep.made')).toBeVisible({ timeout: 60_000 });
    await expect(app.id('b.keep.made')).toContainText('Your partner’s part is in ‘');
    const plans = await storedPlans(page);
    expect(plans.length).toBe(3);
    expect(JSON.stringify(plans[0])).toBe(JSON.stringify(first[0]));                  // the first plan byte-identical
    const expected = expectedPlans('b', b.result, suggestedPlanName('b', b.result.inputs, b.result), { takenNames: ['From 58 · £1,350 a month'], first: false });
    expect(stripId(plans[1])).toEqual(stripId(expected.partner));
    expect(plans[1].isActive).toBe(false);
    expect(plans[2].household).toEqual({ partnerScenarioId: plans[1].id });
    expect(stripId(plans[2])).toEqual(stripId(withPartnerId(expected.yours, plans[1].id)));
    expect(plans[2].isActive).toBe(false);
    noFigureIn(page, seen, ['250000', '250,000', '200000', '200,000']);
  });

  test('a browser that will not keep it: the plain sentence; the page stays; nothing goes anywhere', async ({ page }) => {
    waitsFor(...NEEDS.a);
    test.setTimeout(180_000);
    await page.addInitScript((key) => {
      const real = Storage.prototype.setItem;
      Storage.prototype.setItem = function refuse(k, v) { if (k === key) throw new DOMException('full', 'QuotaExceededError'); return real.call(this, k, v); };
    }, GUEST_KEY);
    const app = v7(page, 'prod', 'a');
    await answer(app, 'a', 'A1');
    await app.step('"Keep as a plan": refused, said plainly', async () => {
      await app.click('a.action.save');
      await expect(app.id('a.keep.problem')).toHaveText(KEEP.problems.storage, { timeout: 60_000 });
      expect(new URL(page.url()).hash).toBe('#/a/answer');
      expect(await storedPlans(page)).toEqual([]);
    });
  });

  test('three plans fill the window without an account: the fourth is refused with the planner\'s own words', async ({ page }) => {
    waitsFor(...NEEDS.a);
    test.setTimeout(180_000);
    const app = v7(page, 'prod', 'a');
    await app.open('#/');
    await app.ready();
    const three = [1, 2, 3].map((i) => ({ id: 'guest-full000' + i, planDetails: { name: 'Plan ' + i, description: '' }, isActive: i === 1, enabledTools: ['stress', 'decision'], stressTool: { settings: {} }, decisionTool: { settings: {}, history: [], taxYears: {} }, createdAt: FIXED_NOW, lastModified: FIXED_NOW }));
    await page.evaluate(([k, v]) => sessionStorage.setItem(k, v), [GUEST_KEY, JSON.stringify(three)]);
    await answer(app, 'a', 'A1');
    await app.id('a.action.save').scrollIntoViewIfNeeded();
    await app.click('a.action.save');
    await expect(app.id('a.keep.problem')).toHaveText(KEEP.problems.full, { timeout: 60_000 });
    expect((await storedPlans(page)).length).toBe(3);
  });
});

/*
 * The spending shape, kept as a plan (research/v7/spending-shape.md 8, 9.7; the owner, 2 Oct 2026: "We MUST offer as many
 * steps and tapers as V6! … We must have Gogo, goslow and nogo years."), end to end on the PUBLISHED build without an
 * account: a person sets go-go £3,000 a month from 62, go-slow from 75 falling 2% a year, no-go £2,000 a month from 85,
 * in "When can I afford to stop work?"; keeps it; and the plan the preview makes holds income steps whose after-tax amount
 * is the answer's in every year, to 50p a month. The household is made up (round, generic figures).
 */
test.describe('the spending shape, kept as a plan', () => {
  test('A with go-go, go-slow and no-go → "Keep as a plan" → the plan: the same spending in every year', async ({ page }) => {
    waitsFor(...NEEDS.a);
    test.setTimeout(300_000);
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

    await test.step('"Keep as a plan": the preview makes the plan in this window', async () => {
      await app.id('a.action.save').scrollIntoViewIfNeeded();
      await app.click('a.action.save');
      await expect(app.id('a.keep.made')).toBeVisible({ timeout: 60_000 });
    });

    await test.step('its income steps give the answer\'s spending, after tax, in every year — to 50p a month', async () => {
      const plans = await storedPlans(page);
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
  test('A falling 7.5% a year from the stop, under the personal allowance → "Keep as a plan" → every fall fits today\'s slider, every year exact', async ({ page }) => {
    waitsFor(...NEEDS.a);
    const { PLANNER_DECLINE } = await import('../src/services/PlanSeed.js');
    test.setTimeout(300_000);
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

    await test.step('"Keep as a plan": the preview makes it', async () => {
      await app.id('a.action.save').scrollIntoViewIfNeeded();
      await app.click('a.action.save');
      await expect(app.id('a.keep.made')).toBeVisible({ timeout: 60_000 });
    });

    await test.step('every fall fits today\'s slider, and every year is the answer\'s figure to 50p a month', async () => {
      const plans = await storedPlans(page);
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
