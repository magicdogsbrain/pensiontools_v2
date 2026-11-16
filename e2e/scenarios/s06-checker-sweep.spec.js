/**
 * s06 · the checker · T1, T2, M6, R4 · three saved plans, every page, both views (seeded: true).
 *
 * Three plans saved before today's screens (the corpus: a locked saver, a pots plan six months in, a locked gilt ladder),
 * one account each, written into the store. On 16 November 2026 the checker opens every page the register names, in
 * the simple view and then the full view, and holds each fact to one value. Then the sums a person can do:
 *   - the pots plan set its year up at £31,200: April to September the plan said 31,200 ÷ 12 × 6 = £15,600, and £15,600
 *     was taken (the lock's £30,000 is not this year's figure);
 *   - the ladder: July to September the plan said 34,000 ÷ 12 × 3 = £8,500; £8,500 taken; no difference;
 *   - the saver stops in February 2038: from November 2026 that is 12 × 12 − 9 = 135 months, 11 years 3 months, by one
 *     rule on every page; the move window opens 36 months before, February 2035.
 */
import { readFileSync } from 'node:fs';
import { test } from '@playwright/test';
import { ask } from './ask.js';
import { FACTS } from './facts.js';
import { accountFor, made, putPlan } from './account.js';
import { at, signIn, planPage, settled } from './routes.js';
import { sweep, sameYears } from './sweep.js';
import { visibleText, moneyAll } from './read.js';
import { knownUnanswered } from './known.js';
import { CHECKER } from './people.js';
import { months, monthly } from './hand/money.js';
import { monthsBetween, addMonths, monthName, yearsAndMonths } from './hand/dates.js';

const VERSION = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
const corpus = (file) => JSON.parse(readFileSync(new URL(`../../tests/fixtures/plans/${file}`, import.meta.url), 'utf8'));
const ROUTE = { path: 'sign in > every page of the plan in the register, simple view, then the full view', who: 'signed in', view: 'simple and full' };
const SEEDED = { seeded: true };
const ONE_VALUE = ['stage', 'stop.month', 'yearsToGo', 'plan.endAge', 'pot.today', 'pot.atStop', 'statePension.amount', 'statePension.age', 'lasts.chance', 'left.typically', 'income.thisYear.beforeTax'];

/** One account holding one corpus plan (the household link dropped: the checker reads one plan at a time). */
async function seeded(page, key) {
  const { file } = CHECKER.plans.find((p) => p.key === key);
  const plan = corpus(file);
  delete plan.household;
  const id = `Checker${key}`;
  const me = await made(accountFor({ name: `checker ${key}` }), { lastSeenVersion: VERSION, view: 'simple' });
  await putPlan(me.uid, { ...plan, id, isActive: true });
  await at(page);
  await signIn(page, me);
  return id;
}

/** Every fact the plan states, one value each across the pages and views that state it. */
function oneValueEach(q, readings, skip = []) {
  for (const id of ONE_VALUE) {
    if (!readings[id].length || skip.includes(id)) continue;
    q.same(FACTS[id].label, readings[id], { eq: id === 'yearsToGo' ? sameYears : undefined, owner: FACTS[id].owner });
  }
  // what is due next: the same thing, the same month, in both views
  const due = readings['due.next'].map((r) => ({ ...r, value: String(r.value).toLowerCase().replace(/^next review is /, 'review ') }));
  if (due.length) q.same('what is due next', due);
}

test.describe('s06 · the checker', () => {
  test.beforeEach(() => { knownUnanswered('s06'); test.setTimeout(240_000); });

  test('the pots plan: one value per fact; April to September the plan said £15,600 and £15,600 was taken', async ({ page }) => {
    await ask(CHECKER, 'T1', { ...ROUTE, asked: 'whether every page of a pots plan six months in gives the same value for the same fact' }, async (q) => {
      const id = await q.step('sign in to the pots plan', () => seeded(page, 'pots'));
      const { readings, never } = await q.step('every page, both views', () => sweep(page, id));
      oneValueEach(q, readings);
      for (const n of never) q.never(n.where, n.found);
      await q.step('the home, taken against the plan', async () => { await planPage(page, id, 'home'); await settled(page).catch(() => {}); });
      const home = await visibleText(page);
      const line = /£([\d,]+) taken; the plan said £([\d,]+)/.exec(home);
      const [taken, said] = line ? moneyAll(line[0]) : [null, null];
      // 31,200 ÷ 12 × 6 = 15,600 (the year was set up at £31,200, April's prices)
      const want = months(6, monthly(31200));
      q.exact('what was taken April to September', taken, want, { byHand: '6 months × 31,200 ÷ 12 = 15,600 (the tax-year set-up)', owner: 'MONTH', did: line ? line[0] : 'no "taken; the plan said" line on the home' });
      q.exact('what the plan said for April to September', said, want, { byHand: '31,200 ÷ 12 × 6 = 15,600: the year was set up at £31,200; the lock\'s £30,000 is not this year\'s figure', owner: 'MONTH', did: line ? line[0] : 'no "the plan said" line on the home' });
    }, SEEDED);
  });

  test('the ladder: one value per fact; July to September the plan said £8,500 and £8,500 was taken, no difference', async ({ page }) => {
    await ask(CHECKER, 'T1', { ...ROUTE, asked: 'whether every page of a locked gilt ladder gives the same value for the same fact' }, async (q) => {
      const id = await q.step('sign in to the ladder plan', () => seeded(page, 'ladder'));
      const { readings, never } = await q.step('every page, both views', () => sweep(page, id));
      oneValueEach(q, readings);
      for (const n of never) q.never(n.where, n.found);
      await q.step('the home, taken against the plan', async () => { await planPage(page, id, 'home'); await settled(page).catch(() => {}); });
      const home = await visibleText(page);
      const line = /£([\d,]+) taken; the plan said £([\d,]+)[^\n]*/.exec(home);
      const [taken, said] = line ? moneyAll(line[0]) : [null, null];
      const want = months(3, monthly(34000));       // 34,000 ÷ 12 × 3 = 8,500
      q.exact('what was taken July to September', taken, want, { byHand: '3 × 34,000 ÷ 12 = 8,500', owner: 'MONTH', did: line ? line[0] : 'no "taken; the plan said" line on the home' });
      q.exact('what the plan said for July to September', said, want, { byHand: '34,000 ÷ 12 × 3 = 8,500', owner: 'MONTH', did: line ? line[0] : 'no "the plan said" line on the home' });
      q.never('the home', line && /more than|less than/.test(line[0]) ? [line[0]] : [], { must: 'no difference between taken and the plan when they are the same' });
      // a retiree's Saving page says in one sentence that it is for another stage; never "1 year of saving"
      await q.step('the Saving page', async () => { await planPage(page, id, 'saving'); await settled(page).catch(() => {}); });
      const saving = await visibleText(page);
      q.never('simple saving (a retiree)', /\b1 year of saving\b/.test(saving) ? ['1 year of saving'] : [], { owner: 'FACTS' });
    }, SEEDED);
  });

  test('the saver: stops February 2038, 11 years 3 months to go by one rule; the move window opens February 2035; due next the same in both views', async ({ page }) => {
    await ask(CHECKER, 'M6', { ...ROUTE, asked: 'which stage a locked saver is in, when work stops, and what is due next, the same on every page' }, async (q) => {
      const id = await q.step('sign in to the saver plan', () => seeded(page, 'saver'));
      const { readings, never } = await q.step('every page, both views', () => sweep(page, id));
      oneValueEach(q, readings, ['stop.month', 'yearsToGo', 'stage']);
      for (const n of never) q.never(n.where, n.found);
      const stop = '2038-02';
      const toGo = monthsBetween('2026-11', stop);    // 12 × 12 − 9 = 135
      const { years, months: m } = yearsAndMonths(toGo);
      q.same('the month work stops', readings['stop.month'], { want: stop, everywhere: true, byHand: 'the plan\'s stop month, February 2038', owner: 'FACTS' });
      q.same(`the time to go (${years} years ${m} months)`, readings.yearsToGo, { want: toGo, eq: (a, b) => a === b || (a % 12 === 0 && Math.floor(a / 12) === Math.floor(b / 12)), byHand: 'November 2026 to February 2038: 12 × 12 − 9 = 135 months = 11 years 3 months', owner: 'FACTS' });
      q.same('the stage', readings.stage, { want: 'saving', owner: 'FACTS' });
      await q.step('the home', async () => { await planPage(page, id, 'home'); await settled(page).catch(() => {}); });
      const home = await visibleText(page);
      const window = /move window opens in ((?:January|February|March|April|May|June|July|August|September|October|November|December) \d{4})/.exec(home);
      q.exact('the month the move window opens', window ? window[1] : null, monthName(addMonths(stop, -36)), { byHand: '36 months before February 2038', owner: 'HOLD' });
      // the full view names the month of the next review as the simple view does
      const due = readings['due.next'];
      q.reach('the month of the next review in the full view', due.some((r) => r.where.startsWith('full view') && /\d{4}/.test(String(r.value))), { did: due.map((r) => `${r.where}: ${r.value}`).join('; ') || 'no next step read in either view', owner: 'FACTS' });
      // the saver's Month by month says in one sentence that it is for another stage: never a drawing year worked out
      await q.step('Month by month', async () => { await planPage(page, id, 'month'); await settled(page).catch(() => {}); });
      const month = await visibleText(page);
      const drawing = /Tax year \d{4}\/\d{2}: set up|£[\d,]+ a year before tax/.exec(month);
      q.never('simple month by month (a saver)', drawing ? [drawing[0]] : [], { must: 'no drawing sum worked out for someone still saving', owner: 'MONTH' });
    }, SEEDED);
  });
});
