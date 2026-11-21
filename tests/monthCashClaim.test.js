/**
 * 7.12.0 — the month never says the money is already in cash unless the cash entered is at least the month's payment.
 * Before, a bought ladder's month said "the money is already in cash" (and "(already cash)" beside the source) whatever cash
 * the same form had just taken. Alex (fictional, tests/v7/plan/_alexLiving.js) is living on a ladder whose November 2026 is
 * paid from the plan's cash years: 34,000 a year, so 34,000 ÷ 12 = £2,833 this month.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { h, render } from 'preact';
import { App } from '../src/v7/App.jsx';
import { reduce } from '../src/v7/state/reduce.js';
import { A } from '../src/v7/state/actions.js';
import { viewFor } from '../src/v7/effects/planSource.js';
import { visibleText } from './v7/render/checkScreen.js';
import { monthInputsOf, decideMonth } from '../src/services/MonthDecision.js';
import { strategyOverlayOf } from '../src/services/DecisionOverlay.js';
import { buildDecisionHTML } from '../src/ui/components/DecisionPanel.js';
import { monthAdviceOf } from '../src/answers/plan/month.js';
import { MONTH } from '../src/v7/copy/month.js';
import { stateWith, noon } from './v7/plan/_plans.js';
import { TODAY, alexLivingRaw, living } from './v7/plan/_alexLiving.js';

const MONTHLY = Math.round(34000 / 12);   // £2,833
const flat = (t) => t.replace(/\s+/g, ' ').trim();
const plan = living(alexLivingRaw());
const month = (cash) => decideMonth(monthInputsOf(plan, { now: noon(TODAY) }), '2026-11', { equity: 0, bond: 380000, cash });
const fullText = (d) => { const div = document.createElement('div'); div.innerHTML = buildDecisionHTML(d); return flat(div.textContent); };
function simpleText(cash) {
  let s = stateWith([{ plan }], '#/plan/' + plan.id + '/month', { today: TODAY });
  for (const [path, value] of Object.entries({ 'mo.month': '2026-11', 'mo.mode': 'type', 'mo.equity': '0', 'mo.bond': '380000', 'mo.cashT': String(cash) })) s = reduce(s, { type: A.PLAN_EDIT, planId: plan.id, path, value });
  s = reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) });
  const root = document.createElement('div');
  render(h(App, { state: s, dispatch: () => {} }), root);
  const from = root.querySelector('[data-testid="plan.month.from"]');
  expect(from).not.toBe(null);
  return flat(visibleText(from.parentNode));
}

describe('the cash entered is less than the month', () => {
  // round 3 (walker 7, decision 6): the next money in is the 3¾% 2027 gilt: 34,000 units + one half-coupon of 637.50, on
  // 7 March 2027 = £34,638; "Nothing is sold" and "the cash years bucket" are never said beside £12 of cash
  const NEXT = { label: '3¾% Treasury Gilt 2027', date: '2027-03-07', amount: Math.round(34000 + 34000 * 0.0375 / 2) };
  const SAID = 'Your pension’s cash is £12, so this month’s £2,833 is not in cash. The next money into your pension is 3¾% Treasury Gilt 2027: £34,638 on 7 March 2027. Until then you can sell part of something you hold, at that day’s price, or wait for it.';
  it('the overlay says so, with both figures and the next money in', () => {
    const d = month(12);
    expect(MONTHLY).toBe(2833);
    expect(NEXT.amount).toBe(34638);
    expect(d.strategyOverlay.floorMonthly).toBe(MONTHLY);
    expect(d.strategyOverlay.cashShort).toEqual({ cash: 12, month: MONTHLY, next: NEXT });
  });
  it('the full view\'s source card and the simple view\'s "Where it comes from" say the same facts, and never "Nothing is sold"', () => {
    const full = fullText(month(12));
    expect(full).toContain(SAID);
    const simple = simpleText(12);
    expect(simple).toContain(SAID);
    for (const t of [full, simple]) {
      for (const w of ['already in cash', 'already cash', 'Nothing is sold', 'cash years bucket', 'The plan’s cash years']) expect(t, w).not.toContain(w);
    }
  });
  // retaken in step F5 (lead4.md D17): the full view works the month out through the one gatherer, overlay included
  it('the full view\'s month (the one gatherer, src/reading/month.js) finds the same next money in', async () => {
    const { monthReadingOf } = await import('../src/reading/month.js');
    const { contextFor } = await import('../src/reading/context.js');
    const d = monthReadingOf(plan, contextFor(plan, { now: noon(TODAY) }), { month: '2026-11', pots: { equity: 0, bond: 380000, cash: 12 } });
    expect(d.strategyOverlay.cashShort.next).toEqual(NEXT);
  });
});

describe('the cash entered covers the month', () => {
  it('both say nothing is sold; the simple view says the money is already in cash', () => {
    const d = month(5000);
    expect(d.strategyOverlay.cashShort).toBe(null);
    const full = fullText(d);
    expect(full).toContain('Nothing is sold');
    expect(full).not.toContain('already cash');
    const simple = simpleText(5000);
    expect(simple).toContain('Nothing is sold');
    expect(simple).toContain('the money is already in cash');
  });
});

describe('no cash figure', () => {
  it('neither says the money is already in cash', () => {
    const d = month(12);
    delete d.cash;
    d.strategyOverlay = strategyOverlayOf(d, '2026-11', { strategy: { id: d.strategyOverlay.id }, stressSettings: monthInputsOf(plan, { now: noon(TODAY) }).stressSettings, name: d.strategyOverlay.name, ladder: null });
    expect(d.strategyOverlay.cashShort).toBe(null);
    expect(fullText(d)).not.toContain('already in cash');
    const a = monthAdviceOf(d);
    expect(a.cashKnown).toBe(false);
    expect(MONTH.advice.boughtPlain).not.toContain('already in cash');
  });
});

describe('a record stamped with the old label', () => {
  it('"rung T29 (already cash)" still reads as the gilt for that year, and the screen does not add the words again', () => {
    const d = month(5000);
    d.strategyOverlay = { ...d.strategyOverlay, floorLabel: 'rung T29 (already cash)' };
    expect(monthAdviceOf(d).from[0]).toMatchObject({ id: 'rung', slots: { year: 'T29' } });
    expect(fullText(d)).not.toContain('(already cash)');
  });
});

describe('the simple view names the gilt a month comes from without saying its money is in cash', () => {
  it('"Where it comes from" never says "as cash" in a label: the cash sentence under it says that, from the cash entered', () => {
    // a gilt's own label claimed its money was in cash even when the cash entered was £12; the full view says only "rung T29"
    for (const [id, words] of Object.entries(MONTH.advice.from)) { expect(words, id).not.toMatch(/already|as cash/); }
    expect(MONTH.advice.from.rung.replace('{year}', 'T29')).toBe('Your gilt T29');
    expect(MONTH.advice.from.thisYear).toBe('This year’s gilt');
  });
});
