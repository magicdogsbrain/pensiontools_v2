/**
 * 7.12.0 round 3 (walker 5, decision 8) — "Stands in for some years" never fills a year by itself. In the full view, choosing it
 * on an ordinary 2028 gilt filled in 2027/28 and applied it at once, and the page then said 2027/28 was covered by a gilt that
 * pays on 7 June 2028, two months after 2027/28 ends. Now the choice saves nothing; the years box beside it starts empty; a
 * year that ends before the gilt pays is refused, with the reason; a year it can pay is saved as typed. The simple view did
 * this already. Fictional plan (the corpus's 20-locked-start-after-stop, read as Moving).
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { installKeepHandlers, tooEarlyWords } from '../src/ui/keepHoldingsUi.js';
import { transitionHtml } from '../src/ui/components/TransitionView.js';
import { moveInputs } from '../src/services/PlanReading.js';
import { noon } from './v7/plan/_plans.js';

const FIX = join(import.meta.dirname, 'fixtures', 'plans');
const BEFORE = '2026-11-09';
// the ordinary 4½% gilt that matures on 7 June 2028 (in tax year 2028/29), held beside the plan's gilts
const TS28 = { wrapper: 'SIPP', ticker: 'TS28', name: 'Treasury 4.5% 07/06/2028', kind: 'gilt', units: 30000, value: 29820 };
const plan = () => { const p = JSON.parse(readFileSync(join(FIX, '20-locked-start-after-stop.json'), 'utf8')); p.holdings = { version: 1, updatedAt: '2026-11-01', source: 'typed', lines: [{ ...TS28 }] }; return p; };

function handlers(p) {
  const w = {}, saved = [], toasts = [];
  installKeepHandlers(w, { draft: () => p.holdings, persist: async (r) => { saved.push(r); }, toast: (t, k) => toasts.push([t, k]) });
  return { w, saved, toasts };
}

describe('"Stands in for some years" in the full view', () => {
  it('the choice passes no year, and its years box is there and empty', () => {
    const p = plan();
    const mi = moveInputs(p, { now: noon(BEFORE) });
    const html = transitionHtml({ doc: p.planDocument, target: mi.target, diff: mi.diff, seq: null, prog: mi.prog, holdings: p.holdings });
    expect(html).toContain('keepHolding(0,this.value,0)');
    const box = /<label class="hint keep-years"[^>]*>[\s\S]*?<input type="text" value="([^"]*)"[^>]*keepHoldingYears\(0,this\.value\)/.exec(html);
    expect(box).not.toBe(null);
    expect(box[1]).toBe('');
  });
  it('choosing it saves nothing and says nothing', async () => {
    const p = plan();
    const { w, saved, toasts } = handlers(p);
    w.keepHolding(0, 'rung', 0);
    await Promise.resolve();
    expect(saved).toEqual([]);
    expect(toasts).toEqual([]);
  });
  it('a year that ends before the gilt pays is refused with the reason: 2027/28 ends 5 April 2028, the gilt pays 7 June 2028', async () => {
    const p = plan();
    expect(tooEarlyWords(TS28, [2027])).toBe('This gilt pays on 7 June 2028, after 2027/28 ends, so it cannot pay for 2027/28.');
    const { w, saved, toasts } = handlers(p);
    w.keepHoldingYears(0, '2027/28');
    await Promise.resolve();
    expect(saved).toEqual([]);
    expect(toasts[0]).toEqual(['This gilt pays on 7 June 2028, after 2027/28 ends, so it cannot pay for 2027/28.', 'error']);
  });
  it('a year it can pay is saved as typed: 2028/29', async () => {
    const p = plan();
    expect(tooEarlyWords(TS28, [2028])).toBe(null);
    const { w, saved } = handlers(p);
    w.keepHoldingYears(0, '2028/29');
    await new Promise((r) => setTimeout(r, 0));
    expect(saved.length).toBe(1);
    expect(saved[0].lines[0].keep).toEqual({ as: 'rung', taxYears: [2028] });
  });
});
