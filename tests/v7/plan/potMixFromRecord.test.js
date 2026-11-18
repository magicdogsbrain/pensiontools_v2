/**
 * 7.12.0 round 3 (walker 6) — living on a pot plan with nothing listed under What you hold, the home's "Your plan's mix" tile
 * read "0% of the plan's mix held" beside months recorded with every pot. It now reads the last month's record beside the
 * plan's mix, as facts. The corpus's pots retiree (04, fictional) with its holdings list taken away: September 2026 recorded
 * shares 388,200, bonds 151,900, cash 47,600 (587,700 in all); the plan's mix is 64 / 25 / 10.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { homeOf } from '../../../src/answers/plan/home.js';
import { corpus, entryOf } from './_plans.js';

describe('a pot plan with nothing listed, months recorded', () => {
  it('the mix tile says the last record\'s shares beside the plan\'s, never "0% held"', () => {
    const raw = JSON.parse(JSON.stringify(Object.values(corpus()).find((p) => p.id === 'Td4VyS7nHg2McXe8WuFa')));
    delete raw.holdings;
    const plan = entryOf(raw, '2026-10-02').plan;
    const tile = homeOf([{ plan }], plan.id, { today: '2026-10-02' }).tools.find((t) => t.id === 'move');
    // 388,200 ÷ 587,700 = 66.1% → 66; 151,900 ÷ 587,700 = 25.8% → 26; 47,600 ÷ 587,700 = 8.1% → 8
    expect(tile.result.text).toBe('From September 2026’s record: shares 66%, bonds 26%, cash 8% (your plan: 64 / 25 / 10)');
    expect(JSON.stringify(tile)).not.toContain('of the plan’s mix held');
  });
});
