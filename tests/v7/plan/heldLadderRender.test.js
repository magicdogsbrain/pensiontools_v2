/**
 * 7.12.0 — "Your plan's mix" while living on a locked ladder, drawn by both views from one reading and one copy file
 * (answers/plan/held.js heldLadderView, src/v7/copy/held.js): the simple view's HeldLadder.jsx and the full view's
 * HeldLadderView.js say the same page, word for word. Every figure below is worked by hand from the fictional plans in
 * _alexLiving.js (see heldLadder.test.js for the sums).
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { h, render } from 'preact';
import { heldLadder, heldLadderView } from '../../../src/answers/plan/held.js';
import { HeldLadder } from '../../../src/v7/screens/plan/HeldLadder.jsx';
import { heldLadderHtml } from '../../../src/ui/components/HeldLadderView.js';
import { HELD } from '../../../src/v7/copy/held.js';
import { BANNED } from '../../../src/v7/copy/banned.js';
import { visibleText } from '../render/checkScreen.js';
import { TODAY, alexLivingRaw, joLivingRaw, samExactRaw, living } from './_alexLiving.js';

const flat = (t) => t.replace(/\s+/g, ' ').trim();
function both(raw) {
  const v = heldLadderView(heldLadder(living(raw), { today: TODAY }));
  const a = document.createElement('div');
  render(h(HeldLadder, { v, prefix: 'plan.move', holdHref: '/hold' }), a);
  const b = document.createElement('div');
  b.innerHTML = heldLadderHtml(v);
  return { simple: flat(visibleText(a)), full: flat(visibleText(b)), a, b };
}
const NEVER = ['not covered', 'not yet covered', 'runs short', 'Held for', 'Buy', 'Sell', 'still to buy', 'Not kept', 'Keep this', 'should', 'order sheet'];

describe('Alex: both views say the page alike', () => {
  const { simple, full, a, b } = both(alexLivingRaw());
  it('says the figures once, in these words', () => {
    for (const s of [
      'All 14 of your plan’s gilts are held.',
      '2 are held above the plan’s units.',
      'Your plan pays 2026/27 to 2028/29 from cash: £47,167 still to come.',
      'Beside the plan’s gilts, your pension holds £12 in cash, £103,930 in other gilts and £23,300 in shares and funds, at today’s value: £127,242 in all.',
      'The cash and gilts are £56,775 more than these years need.',
      'The plan pays £14,167 from cash by 5 April 2027; your pension’s cash is £12.',
      'The next of your gilts to mature is 3¾% Treasury Gilt 2027, on 7 March 2027.',
      '0 1/8% Treasury Gilt 2026 is not on our list of gilts still to pay, so it may have matured already.',
      'Old workplace pension: £60,000, expected by July 2027. It is not counted, because it may not arrive.',
      'Your plan already counts a lump sum of £40,000 in 2027/28. If the money you expect is that money, it is not extra.',
      'An illustration from your figures, not advice. Nothing here places an order.'
    ]) expect(simple, s).toContain(s);
  });
  it('the TR31 row reads the plan\'s units, what is held and the difference', () => {
    const row = [...a.querySelectorAll('tr')].find((r) => /\(TR31\)/.test(r.textContent));
    const cells = [...row.querySelectorAll('td')].map((td) => td.textContent);
    expect(cells.slice(0, 4)).toEqual(['0 1/8% Index-linked Treasury Gilt 2031 (TR31)', '2032/33', '15,500', '16,200']);
    // 700 units × the order's index ratio (1.42537) = £998, to the nearest £10
    expect(cells[4]).toBe('+700 (about £1,000 more that year)');
    const t29 = [...a.querySelectorAll('tr')].find((r) => /\(T29\)/.test(r.textContent));
    expect([...t29.querySelectorAll('td')].map((td) => td.textContent)).toEqual(['0 1/8% Index-linked Treasury Gilt 2029 (T29)', '2029/30 to 2031/32', '37,500', '37,500', '—']);
  });
  it('the also table says when each gilt matures and what it pays then', () => {
    const row = [...a.querySelectorAll('tr')].find((r) => /^3¾% Treasury Gilt 2027/.test(r.textContent));
    expect([...row.querySelectorAll('td')].map((td) => td.textContent)).toEqual(['3¾% Treasury Gilt 2027', '£33,930', '7 March 2027', '£34,638, fixed']);
    const tn26 = [...a.querySelectorAll('tr')].find((r) => /^0 1\/8% Treasury Gilt 2026/.test(r.textContent));
    expect([...tn26.querySelectorAll('td')].map((td) => td.textContent)).toEqual(['0 1/8% Treasury Gilt 2026', '£2,000', 'not on our list', '']);
  });
  it('the two views\' text is the same', () => {
    expect(full).toBe(simple);
  });
  it('every table cell carries its column\'s label, so a phone stacks it as a card', () => {
    for (const root of [a, b]) for (const td of root.querySelectorAll('table.held-table td')) expect(td.getAttribute('data-label')).toBeTruthy();
  });
  it('says nothing of gaps, buying, selling or keeping', () => {
    for (const w of NEVER) { expect(simple.includes(w), w).toBe(false); expect(full.includes(w), w).toBe(false); }
  });
});

describe('Jo and Sam', () => {
  it('Jo: two gilts below the plan\'s units, and the cash short of the cash years', () => {
    const { simple, full } = both(joLivingRaw());
    for (const s of ['12 of your plan’s 14 gilts are held.', '2 are held below the plan’s units.',
      '−13,500 (about £19,240 less that year)', '−7,300 (about £10,910 less that year)',
      'Where you hold fewer units than the plan has, those years pay less than the plan says.',
      'Your pension holds £5,000 in cash.', 'That is £42,167 less than these years need.',
      'The plan pays £14,167 from cash by 5 April 2027; your pension’s cash is £5,000.']) expect(simple, s).toContain(s);
    expect(simple).not.toContain('Also in your pension');
    expect(full).toBe(simple);
  });
  it('Sam: exactly the plan', () => {
    const { simple, full } = both(samExactRaw());
    for (const s of ['All 14 of your plan’s gilts are held, in the plan’s units.', 'Your plan pays 2026/27 to 2028/29 from cash: £47,167 still to come.',
      'Your pension holds £70,000 in cash: £22,833 more than these years need.']) expect(simple, s).toContain(s);
    for (const s of ['Also in your pension', 'Beside the plan’s gilts', 'by 5 April', 'Money you expect']) expect(simple, s).not.toContain(s);
    expect(full).toBe(simple);
  });
});

describe('the words', () => {
  it('src/v7/copy/held.js passes the banned list in every scope a plan page is shown in', () => {
    const strings = [];
    const walk = (o) => { for (const v of Object.values(o)) typeof v === 'string' ? strings.push(v.replace(/\{\w+\}/g, 'two')) : walk(v); };
    walk(HELD);
    for (const t of strings) for (const b of BANNED.filter((x) => ['all', 'planner', 'record', 'result', 'retired'].includes(x.scope))) {
      if (b.kind === 'explain') continue;
      expect(b.re.test(t) && !(b.allow || []).some((x) => x.test(t)), `"${t}" uses ${b.id}`).toBe(false);
    }
  });
});
