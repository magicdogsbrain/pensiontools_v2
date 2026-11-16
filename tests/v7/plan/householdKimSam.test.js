/**
 * "Your household" for Kim and Sam (fictional; tests/fixtures/kimAndSam.js), drawn by the simple view (7.12.0). The pooled
 * run is held in page memory with a made-up verdict and the real year table (householdIncomeTimeline on the two plans'
 * effective settings, as householdRun.js hands it in), so what the page says about the years, the verdict, the split
 * and the survivor can be read against figures worked out by hand here.
 */
import { describe, it, expect } from 'vitest';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText } from '../render/checkScreen.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse } from '../../../src/v7/router/routes.js';
import { viewFor, upgradedList } from '../../../src/v7/effects/planSource.js';
import { pairKeyOf } from '../../../src/answers/plan/household.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { householdIncomeTimeline } from '../../../src/services/HouseholdService.js';
import { kimAndSam, KIM_AND_SAM_TODAY, KIM_ID, SAM_ID } from '../../fixtures/kimAndSam.js';
import { noon } from './_plans.js';

const T = 'plan.household';
const NOW = noon(KIM_AND_SAM_TODAY);

/** A made-up pooled run in the run's shape, with the real year table. Kim is A on Kim's page. */
export function kimSamRun(list, { pooled = null, successA = 0.97, successB = 0.949, joint = 0.93, split = null } = {}) {
  const a = list.find((e) => e.plan.id === KIM_ID).plan, b = list.find((e) => e.plan.id === SAM_ID).plan;
  const timeline = householdIncomeTimeline(effectiveStressSettings(a, { now: NOW }), effectiveStressSettings(b, { now: NOW }), null, NOW);
  const combined = { runs: 1000, jointSuccess: joint, successA, successB, pooled: pooled || { success: 0.96, coveredByA: 0, coveredByB: 0, shortA: { n: 0, median: null, earliest: null }, shortB: { n: 0, median: null, earliest: null } },
    potFan: Array.from({ length: 31 }, (_, y) => ({ year: y, p10: 100000, p50: 200000, p90: 300000 })) };
  const sched = (n, v) => Array.from({ length: n }, () => v);
  const sp = split || { names: { a: 'Kim', b: 'Sam' }, smaller: 'b', larger: 'a', untilAge: 67, untilC: 4, applies: false, unchanged: true, limit: null, limitDefaulted: true, fingerprint: 'fp',
    saving: { year: 0, until: 0, whole: 0 }, tax: { firstYear: null, until: { own: 1, together: 1 }, whole: { own: 1, together: 1 } },
    pots: { a: 280000, b: 160000 }, unused: {}, note2028: '', ladderNote: '', steps: { a: [], b: [] },
    schedules: { own: { a: sched(30, 28000), b: sched(33, 16000) }, together: { a: sched(30, 28000), b: sched(33, 16000) } },
    needs: { own: { a: sched(30, 1), b: sched(33, 1) }, together: { a: sched(30, 1), b: sched(33, 1) } } };
  return { ok: true, names: { a: 'Kim', b: 'Sam' }, offsets: { a: 0, b: 2 }, ends: { a: 95, b: 95 }, split: sp,
    own: { combined, rA: { affordable: true }, rB: { affordable: true } }, together: null, fig: null, timeline, basis: { today: KIM_AND_SAM_TODAY, engine: 'one-test', runs: 2 } };
}

/** Kim's (or Sam's) household page with the run held, the years open. */
export function kimSamPage({ on = KIM_ID, run = {}, open = ['hhDetail'], extra = [], edit = null } = {}) {
  const { kim, sam } = kimAndSam();
  if (edit) edit(kim, sam);
  let state = initialState({ today: KIM_AND_SAM_TODAY, build: 'test' });
  const step = (a) => { state = reduce(state, a); state = reduce(state, { type: A.PLANS_VIEW, view: viewFor(state) }); };
  state = reduce(state, { type: A.ROUTE_SET, route: parse('#/plan/' + on + '/household') });
  state = reduce(state, { type: A.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } });
  const list = upgradedList([kim, sam], NOW);
  step({ type: A.PLANS_SET, list, source: 'account', readAt: '14:03' });
  const plan = list.find((e) => e.plan.id === on).plan, partner = list.find((e) => e.plan.id !== on).plan;
  const key = pairKeyOf(plan, partner);
  step({ type: A.HH_RUN, key, limit: null });
  step({ type: A.HH_DONE, key, limit: null, result: kimSamRun(list, run), ms: 1200 });
  for (const id of open) step({ type: A.UI_TOGGLE, id });
  for (const a of extra) step(typeof a === 'function' ? a(key) : a);
  const root = document.createElement('div');
  render(h(App, { state, dispatch: () => {} }), root);
  return { root, text: visibleText(root), state };
}
export const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);

describe('the year table (7.12.0): real years, the pots second, a plan that has ended', () => {
  it('the waiting note names 2032, never a row count; every year is a calendar year', () => {
    const { root } = kimSamPage();
    expect(one(root, `${T}.waitingNote`).textContent).toBe('Until 2032 at least one of you is still waiting for a State Pension: those are the years when the pots do the most work.');
    const years = [...one(root, `${T}.timeline`).querySelectorAll('tbody tr')].map((tr) => tr.firstChild.textContent);
    for (const y of years) expect(y).toMatch(/^20\d\d$/);
    expect(years[0]).toBe('2026');
    for (const tr of one(root, `${T}.left`).querySelectorAll('tbody tr')) expect(tr.firstChild.textContent).toMatch(/^20\d\d$/);
  });
  it('2056: £4,498 from the pots (Sam\'s £16,000 less Sam\'s £11,502.40 State Pension), Kim\'s plan ended, nothing else', () => {
    const { root } = kimSamPage();
    const row = one(root, `${T}.timeline`).querySelector('tr[data-year="2056"]');
    expect([...row.children].map((td) => td.textContent)).toEqual(['2056', '£4,498', 'plan ended', '£16,000', '£11,502', '£0']);
    expect([...one(root, `${T}.timeline`).querySelectorAll('thead th')].map((th) => th.textContent)).toEqual(['Year', 'From the pots', 'Kim needs', 'Sam needs', 'State Pensions', 'Other income that comes anyway']);
  });
});

describe('the verdict (7.12.0): until when, whose age, and a figure that agrees with its words', () => {
  const pooled = { success: 0.96, coveredByA: 37, coveredByB: 0, shortA: { n: 0, median: null, earliest: null }, shortB: { n: 37, median: 93, earliest: 87 } };
  it('says each plan is tested until its owner is 95 (Kim 66 + 29 years, Sam 63 + 32), and whose plan fell short in that person\'s ages', () => {
    const { root, text } = kimSamPage({ run: { pooled } });
    expect(one(root, `${T}.headline`).textContent).toBe('On course together. The household’s money lasts in more than 9 futures out of 10.');
    expect(one(root, `${T}.tested`).textContent).toBe('Each plan is tested until its owner is 95.');
    expect(one(root, `${T}.pooled`).textContent).toBe('When one plan falls short, the other pays that share; the household falls short only when both have.');
    expect(one(root, `${T}.covered`).textContent).toBe('In 37 of 1,000 futures Sam’s plan fell short and Kim’s paid, typically from when Sam is 93 (87 at the earliest).');
    expect(text).not.toMatch(/from age \d/);
  });
  it('94.9% reads "in 9 futures out of 10 (94.9%)", never 95% beside words that say under it', () => {
    const { root } = kimSamPage({ run: { pooled } });
    expect(one(root, `${T}.rows`).querySelector('tr[data-row="b"] td').textContent).toBe('in 9 futures out of 10 (94.9%)');
    expect(one(root, `${T}.rows`).querySelector('tr[data-row="a"] td').textContent).toBe('in more than 9 futures out of 10 (97%)');
  });
  it('two different end ages are said per plan: Sam\'s plan cut to 27 years runs to 63 + 27 = 90', () => {
    const { root } = kimSamPage({ run: { pooled }, edit: (kim, sam) => { sam.stressTool.settings.duration = 27; } });
    expect(one(root, `${T}.tested`).textContent).toBe('Kim’s plan is tested until Kim is 95; Sam’s until Sam is 90.');
  });
});

describe('a household answer is never run on a plan\'s starting defaults (7.12.0)', () => {
  it('this plan with no figures saved: refused, naming this plan', async () => {
    const { runHousehold } = await import('../../../src/answers/plan/householdRun.js');
    const { kim, sam } = kimAndSam();
    kim.stressTool.settings.configured = false;
    const list = upgradedList([kim, sam], NOW);
    const r = runHousehold(list[0].plan, list[1].plan, { today: KIM_AND_SAM_TODAY });
    expect(r).toMatchObject({ ok: false, reason: 'partnerNotSet', which: 'a' });
  });
});
