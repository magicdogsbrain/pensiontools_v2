/**
 * (wrap-up) A plan with no pot — straight from the full view's wizard, its pots the planner's defaults — never shows those
 * defaults as the person's: "Your plan" says the pension and its split as £0, as the Pots page and the full view's Settings
 * do, under "Pots" and under "The mix".
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { planPage } from '../../../src/answers/plan/read.js';

const fresh = () => {
  const p = JSON.parse(readFileSync(join(process.cwd(), 'tests/fixtures/plans/01-fresh-default.json'), 'utf8'));
  p.planDetails.name = 'Alex';
  Object.assign(p.stressTool.settings, { currentAge: 50, currentAgeAsOf: '2026-11-25', retireAge: 65, retired: false });
  return p;
};

describe('a plan with no pot', () => {
  it('Your plan: the split and the mix are £0, never the defaults', () => {
    const plan = fresh();
    const pg = planPage([{ plan, newer: false, failed: false }], plan.id, 'plan', { today: '2026-11-25' });
    const flat = JSON.stringify(pg);
    expect(flat).toMatch(/pots\.split/);
    expect(flat).not.toMatch(/250,000|200,000|"shares":250000|"mixShares":250000|"bonds":200000|"mixBonds":200000/);
    const figs = [];
    JSON.parse(flat, (k, v) => { if (v && typeof v === 'object' && !Array.isArray(v) && 'shares' in v && 'bonds' in v) figs.push(v); return v; });
    expect(figs.length).toBeGreaterThan(0);
    for (const f of figs) {
      expect([f.shares, f.bonds, f.cash]).toEqual([0, 0, 0]);
      if ('mixShares' in f) expect([f.mixShares, f.mixBonds, f.mixCash]).toEqual([0, 0, 0]);
    }
  });
});
