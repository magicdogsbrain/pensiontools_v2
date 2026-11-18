/**
 * 7.12.0 round 3 (walker 9's medium finding) — a locked plan living on its pots, with nothing listed under What you hold
 * and no month recorded yet: Month by month's steps read "What you hold (optional): Not recorded yet" and, right under
 * it, "Your plan's mix (optional): 0% of the plan's mix held". Nothing is known of what is held, so nothing is compared:
 * the tile says so, and that nothing needs to be recorded. The corpus's pots retiree (04, fictional) with its holdings
 * list and its months taken away.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { homeOf } from '../../../src/answers/plan/home.js';
import { corpus, entryOf } from './_plans.js';

describe('a pot plan with nothing listed and nothing recorded', () => {
  it('the mix tile says nothing is compared, never "0% of the plan’s mix held"', () => {
    const raw = JSON.parse(JSON.stringify(Object.values(corpus()).find((p) => p.id === 'Td4VyS7nHg2McXe8WuFa')));
    delete raw.holdings;
    raw.decisionTool.history = [];
    const plan = entryOf(raw, '2026-10-02').plan;
    const tile = homeOf([{ plan }], plan.id, { today: '2026-10-02' }).tools.find((t) => t.id === 'move');
    expect(tile.result.text).toBe('Not compared: nothing is recorded of what you hold, and nothing needs to be');
    expect(JSON.stringify(tile)).not.toContain('of the plan’s mix held');
  });
});
