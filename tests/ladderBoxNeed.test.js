/**
 * The Decision tool's "Your gilt ladder" box reads the same need as "Your plan's mix" (7.12.0, the living-ladder brief step 6):
 * what is still to come this tax year is the month's payment times the months left; the check sets the cash held against
 * that and the later cash years, and says nothing of "parked" money or a money-market fund.
 *
 * Fictional Alex (tests/v7/plan/_alexLiving.js), living on a locked ladder whose first year began in July 2026 (so it is paid
 * over twelve months from then); today 16 November 2026; £12 of cash. By hand: 34,000 ÷ 12 = 2,833.33 a month; 5 months to
 * 5 April 2027 → 14,166.67, £14,167; the later cash years 2027/28 (£0: a lump sum the plan counts pays it) and 2028/29
 * (£33,000) → £33,000; in all 47,166.67, £47,167; less the £12 held: £47,155.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { ladderPosition, ladderCheckWords } from '../src/services/LadderPosition.js';
import { heldLadder } from '../src/answers/plan/held.js';
import { TODAY, alexLivingRaw, living } from './v7/plan/_alexLiving.js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const plan = living(alexLivingRaw());
const ladder = plan.planDocument.strategy.r.plan;
const today = new Date(2026, 10, 16, 12);
const lp = ladderPosition(ladder, { today, potsDay: new Date(2026, 6, 1, 12), cashBalance: 12 });

describe('the ladder box: one need', () => {
  it('this year\'s still to come is the month times the months left', () => {
    expect(lp.spread).toBe(true);
    expect(lp.monthsLeft).toBe(5);
    expect(Math.round(lp.cashCheck.dueThisYear)).toBe(14167);
    expect(Math.round(lp.cashCheck.laterCashYears)).toBe(33000);
    expect(Math.round(lp.cashCheck.need)).toBe(47167);
  });

  it('is the need "Your plan\'s mix" gives for the same plan', () => {
    const h = heldLadder(plan, { today: TODAY });
    expect(h.cashYears.need).toBe(47167);
    expect(Math.round(lp.cashCheck.need)).toBe(h.cashYears.need);
  });

  it('the check in words: no parked money, no money-market fund, no "check the last maturity"', () => {
    const t = ladderCheckWords(lp).join(' ');
    expect(t).toContain('£2,833 a month for the 5 months to 5 April 2027: £14,167.');
    expect(t).toContain('Cash: you hold £12. The plan’s cash years still ahead need £47,167 (£14,167 to 5 April 2027 and £33,000 for later cash years): £47,155 more than your cash.');
    expect(t).toContain('What else your pension holds is on Your plan’s mix.');
    for (const w of ['parked', 'money-market', 'check the last maturity', 'park the surplus']) expect(t.includes(w), w).toBe(false);
    expect(lp.cashCheck.verdict).toBeUndefined();
    expect(lp.parked).toBeUndefined();
  });

  it('more cash than the years need, and no cash figure', () => {
    const rich = ladderPosition(ladder, { today, potsDay: new Date(2026, 6, 1, 12), cashBalance: 50000 });
    expect(ladderCheckWords(rich).join(' ')).toContain(': £2,833 less than your cash.');   // 50,000 − 47,166.67 = 2,833.33
    const none = ladderPosition(ladder, { today, potsDay: new Date(2026, 6, 1, 12) });
    expect(none.cashCheck).toBe(null);
    expect(ladderCheckWords(none).join(' ')).not.toContain('Cash:');
  });
});

describe('the full view\'s box draws those words and no instruction about where to keep money', () => {
  it('ladderDecisionCardHtml and its check say nothing of parking or a money-market fund; the check is ladderCheckWords', () => {
    const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
    const i = html.indexOf('    function ladderDecisionCardHtml(lp, sid) {');
    const j = html.indexOf('\n    // A contract-ladder plan has no risk mix', i);
    expect(i).toBeGreaterThan(0);
    const box = html.slice(i, j);
    for (const w of ['parked', 'money-market', 'park the surplus', 'check the last maturity', 'already matured into cash']) expect(box.includes(w), w).toBe(false);
    expect(box).toContain('box.innerHTML = ladderCheckWords(lp)');
  });
});
