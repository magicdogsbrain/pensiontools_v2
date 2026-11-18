/**
 * 7.12.0 round 3 (walker 7) — a locked plan's own strategy is never ranked below another and pointed away from. Alex locked a
 * full index-linked gilt ladder and lives on it; the Strategies tab ranked it 4th of six that all last in every future, under
 * "Pots & Valves comes first on your plan … Read its page, then the runner-up's". With the plan locked on a strategy, the card
 * now heads with "Your plan: …", the others shown for comparison only, unranked, with no "comes first". Fictional figures.
 */
import { describe, it, expect } from 'vitest';
import { rankingCardHtml } from '../src/ui/oneAnswerView.js';

const plain = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
const R = { terminal: { p50: 200000, p10: 90000 }, worst12: { min: 30000 }, ruin: { hist: 0, mc: 0 }, coverage: 100 };
const S = {
  'pots-and-valves': { ...R, strategyId: 'pots-and-valves', terminal: { p50: 400000, p10: 150000 } },
  'buckets-in-order': { ...R, strategyId: 'buckets-in-order' },
  'full-il-gilt': { ...R, strategyId: 'full-il-gilt', terminal: { p50: 100000, p10: 100000 } }
};
const scored = Object.keys(S).map((id) => ({ id, r: S[id], sc: null }));
const names = { 'pots-and-valves': 'Pots & Valves', 'buckets-in-order': 'Buckets in order', 'full-il-gilt': 'Full index-linked gilt ladder' };
const colors = { 'pots-and-valves': '#000', 'buckets-in-order': '#000', 'full-il-gilt': '#000' };

describe('the Strategies card on a plan locked on a ladder', () => {
  const h = rankingCardHtml({ scored, names, colors, rankBy: 'lasts', own: 'full-il-gilt' });
  const t = plain(h);
  it('heads with the plan\'s own strategy, and says the others are for comparison only', () => {
    expect(t).toContain('Your plan: Full index-linked gilt ladder');
    expect(t).toContain('for comparison only; they are not ranked against your plan');
    expect(t.indexOf('Full index-linked gilt ladder (your plan)')).toBeLessThan(t.indexOf('Pots & Valves read'));
  });
  it('never says another strategy "comes first", never a "runner-up", never "ranked on your plan"', () => {
    for (const w of ['comes first', 'runner-up', 'ranked on your plan']) expect(t, w).not.toContain(w);
  });
  it('a plan not locked is ranked as before', () => {
    expect(plain(rankingCardHtml({ scored, names, colors, rankBy: 'lasts' }))).toContain('comes first on your plan');
  });
});
