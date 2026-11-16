/**
 * The move's words (7.12.0, the moving brief S1/S2/D7): both views say what pays for the buys from one reading, the totals
 * the same way, and one status sentence that the home tile, the move page and the full view all give. Never "proceeds",
 * "ticked off" or "Next:".
 *
 * Fictional Sam (tests/helpers/samMove.js), Moving: work stops in October 2027; today 16 November 2026.
 *   By hand: the buys come to £102,400 (TA30 £45,000, TB31 £30,000, cash £27,400); outside the plan £410,000;
 *   £102,400 of it pays for the buys; £307,600 is left over.
 *   Pace: November 2026 to October 2027 is 11 months; £102,400 ÷ 11 = £9,309, to the nearest £100: £9,300.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText } from '../render/checkScreen.js';
import { moveOf } from '../../../src/answers/plan/move.js';
import { homeOf } from '../../../src/answers/plan/home.js';
import { transitionHtml } from '../../../src/ui/components/TransitionView.js';
import { transitionHeld } from '../../../src/ui/keepHoldingsUi.js';
import { moveInputs } from '../../../src/services/PlanReading.js';
import { sequence } from '../../../src/services/TransitionPlanner.js';
import { stateWith, entryOf, noon } from './_plans.js';
import { asMoving } from './_alex.js';
import { samDoc, samLines } from '../../helpers/samMove.js';

const TODAY = '2026-11-16';

/** Sam's stored plan: the corpus's locked ladder, read as Moving to October 2027, with Sam's document and record. */
export function samMovePlan({ lines = samLines(), docOver = {} } = {}) {
  const raw = asMoving(JSON.parse(readFileSync(join(process.cwd(), 'tests', 'fixtures', 'plans', '20-locked-start-after-stop.json'), 'utf8')), { stop: '2027-10' });
  raw.id = 'SamMove01';
  raw.planDetails = { ...raw.planDetails, name: 'Sam plan' };
  delete raw.household;
  const d = samDoc(docOver), was = raw.planDocument;
  raw.planDocument = { ...was, timing: { ...was.timing, firstTaxYear: 2027, startMonth: '2027-10' }, pots: { ...was.pots, ...d.pots },
    strategy: { ...was.strategy, contract: true, params: { ...was.strategy.params, ...d.strategy.params }, r: { ...was.strategy.r, ...d.strategy.r } } };
  raw.holdings = { version: 1, updatedAt: '2026-11-01', source: 'typed', offerDismissed: false, lines };
  return entryOf(raw, TODAY).plan;
}

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

describe('Paying for it: one reading, the same words in both views', () => {
  const plan = samMovePlan();
  const V = moveOf([{ plan }], plan.id, { today: TODAY });

  it('reads Moving, with the move to make', () => {
    expect(V.mode).toBe('move');
    expect(V.ladder).toBe(true);
  });

  for (const [view, text] of [['simple', () => simpleText(plan)], ['full', () => fullText(plan)]]) {
    it(`the ${view} view says what pays for the buys and the totals, and never "proceeds", "ticked off" or "Next:"`, () => {
      const t = text();
      expect(t).toContain('The buys come to £102,400.');
      expect(t).toContain('£102,400 of it pays for the buys; you choose which to sell.');
      expect(t).toContain('The other £307,600 is not needed for the ladder.');
      expect(t).toContain('Totals: buy £102,400; paid from what your plan does not use, £102,400; left as it is, £307,600.');
      expect(t).toContain('Work stops in October 2027, in 11 months. To finish the buying by then is £9,300 a month, to the nearest £100.');
      expect(t).not.toMatch(/proceeds/i);
      expect(t).not.toMatch(/ticked off/i);
      expect(t).not.toContain('Next:');
    });
  }

  it('the home tile, the move page and the full view give the same status sentence', () => {
    // by hand: no gilt held in full, TA30 part bought (10,000 of 40,000 units)
    const home = homeOf([{ plan }], plan.id, { today: TODAY }).tools.find((x) => x.id === 'move').result.text;
    expect(home).toMatch(/^0 of 2 gilts bought, and 1 part bought\. \d+% of your plan’s mix is held\.$/);
    expect(simpleText(plan)).toContain(home);
    expect(fullText(plan)).toContain(home);
  });
});
