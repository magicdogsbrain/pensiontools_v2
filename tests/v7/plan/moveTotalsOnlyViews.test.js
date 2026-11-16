/**
 * A plan with totals only, Moving (7.12.0, the moving brief D3 and S1 case C, joined at integration): with nothing listed
 * under What you hold, both views say the plan's own pension pays for the buys, with the figure and where it came from, in
 * the same words.
 *
 * Fictional Sam (tests/v7/plan/_samMove.js), Moving, nothing listed. The buys by hand (tests/helpers/samMove.js): TA30
 * 40,000 units £60,000; TB31 £30,000; cash £26,000 + £26,400 = £52,400 (nothing held): £142,400 in all.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText } from '../render/checkScreen.js';
import { transitionHtml } from '../../../src/ui/components/TransitionView.js';
import { transitionHeld } from '../../../src/ui/keepHoldingsUi.js';
import { moveInputs, planMoneyOf, effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { sippTodayOf } from '../../../src/services/PotsAtRetirement.js';
import { sequence } from '../../../src/services/TransitionPlanner.js';
import { stateWith, noon } from './_plans.js';
import { samMovePlan } from './_samMove.js';

const TODAY = '2026-11-16';
const gbp = (v) => '£' + Math.round(v).toLocaleString('en-GB');
const textOfHtml = (html) => { const el = document.createElement('div'); el.innerHTML = html; return el.textContent.replace(/\s+/g, ' '); };
function simpleText(plan) {
  const root = document.createElement('div');
  root.id = 'app';
  render(h(App, { state: stateWith([{ plan }], '#/plan/' + plan.id + '/move', { today: TODAY }), dispatch: () => {} }), root);
  return visibleText(root).replace(/\s+/g, ' ');
}
function fullText(plan) {
  const now = noon(TODAY);
  const mi = moveInputs(plan, { now });
  const held = transitionHeld(plan, plan.holdings, now);
  const seq = sequence(mi.diff, { today: now, startYear: 2027, startMonth: '2027-10' });
  return textOfHtml(transitionHtml({ doc: plan.planDocument, target: mi.target, diff: mi.diff, seq, prog: mi.prog, holdings: plan.holdings, held }));
}

describe('Paying for it with nothing listed: the plan\'s own pension, in both views', () => {
  const plan = samMovePlan({ lines: [] });
  plan.accumulationTool = { ...(plan.accumulationTool || {}), history: [], settings: { ...((plan.accumulationTool && plan.accumulationTool.settings) || {}), potNow: null } };
  const ss = effectiveStressSettings(plan, { now: noon(TODAY) });
  const pension = sippTodayOf(ss);

  it('the money is the plan\'s pension total, read as the plan\'s', () => {
    expect(pension).toBeGreaterThan(0);
    expect(planMoneyOf(plan, { now: noon(TODAY) })).toMatchObject({ pension, from: 'plan' });
  });
  for (const [view, text] of [['simple', () => simpleText(plan)], ['full', () => fullText(plan)]]) {
    it(`the ${view} view says the plan has its pension, from the plan, and what the buys come to`, () => {
      const t = text();
      expect(t).toContain('You have not listed what your pension holds, and you do not need to.');
      expect(t).toMatch(new RegExp('Your plan has ' + gbp(pension).replace(/[£,]/g, (c) => '\\' + c) + ' in your pension( and £[\\d,]+ in your ISA)? \\(from your plan\\)\\.'));
      expect(t).toContain('The buys come to £142,400.');
    });
  }
});
