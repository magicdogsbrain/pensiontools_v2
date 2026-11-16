/**
 * The plan a page opens (7.12.0, ScenarioRepository.openingPlanOf): the window's pin, else the plan last open in either
 * view, else the main plan; a closed plan gives way to the plan that carries it on. Made-up plans.
 */
import { describe, it, expect, vi } from 'vitest';

vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { openingPlanOf } from '../src/storage/ScenarioRepository.js';

const plan = (id, more = {}) => ({ id, planDetails: { name: 'Kim ' + id }, isActive: false, ...more });

describe('which plan opens', () => {
  const three = () => [plan('A', { isActive: true }), plan('B'), plan('C')];

  it('the plan last open wins over the main plan (before: the main plan, always)', () => {
    expect(openingPlanOf(three(), { lastPlanId: 'B' }).id).toBe('B');
  });

  it('the plan last open, closed and carried on: the plan that carries it on', () => {
    const list = three();
    Object.assign(list[1], { closedAt: '2026-10', nextPlanId: 'C' });
    list[2].previousPlanId = 'B';
    expect(openingPlanOf(list, { lastPlanId: 'B' }).id).toBe('C');
  });

  it('the plan last open, deleted since: the main plan', () => {
    expect(openingPlanOf(three(), { lastPlanId: 'GONE' }).id).toBe('A');
  });

  it('a window pin still wins', () => {
    expect(openingPlanOf(three(), { pin: 'C', lastPlanId: 'B' }).id).toBe('C');
  });

  it('a main plan saved closed opens the plan that carries it on', () => {
    const list = three();
    Object.assign(list[0], { closedAt: '2026-10', nextPlanId: 'B' });
    expect(openingPlanOf(list, {}).id).toBe('B');
  });

  it('nothing remembered: the main plan, as before; no plans: none', () => {
    expect(openingPlanOf(three(), {}).id).toBe('A');
    expect(openingPlanOf([], { lastPlanId: 'B' })).toBe(null);
  });
});
