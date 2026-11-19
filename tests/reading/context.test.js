/**
 * The one context of a run (lead4.md R1, R5; src/reading/context.js contextFor): the same day from either view's way of
 * holding it, the plan's own level, its own budget, its linked partner, and what the runs are priced on.
 */
import { describe, it, expect } from 'vitest';
import { contextFor, dayOfContext } from '../../src/reading/context.js';
import { marketStamp } from '../../src/reading/market.js';

const plan = (more = {}) => ({ id: 'a', createdAt: '2026-01-01T00:00:00Z', stressTool: { settings: { currentAge: 66 } }, ...more });

describe('contextFor', () => {
  it('one day from either view: "YYYY-MM-DD" (simple) and a Date (full) give the same noon', () => {
    const a = contextFor(plan(), { today: '2026-11-16' });
    const b = contextFor(plan(), { now: new Date(2026, 10, 16, 23, 30) });
    expect(a.now.getTime()).toBe(b.now.getTime());
    expect(a.now.getHours()).toBe(12);
    expect(a.today).toBe('2026-11-16');
    expect(dayOfContext({ today: '2026-11-16' }).getTime()).toBe(a.now.getTime());
  });
  it('the plan\'s level: its own choice, else the kept answer\'s chosen one, else Balanced', () => {
    expect(contextFor(plan(), { today: '2026-11-16' }).level).toBe('balanced');
    expect(contextFor(plan({ fromAnswer: { answer: { level: 'careful', levelChosen: true } } }), { today: '2026-11-16' }).level).toBe('careful');
    expect(contextFor(plan({ phases: { level: { level: 'bold', at: 'x' } }, fromAnswer: { answer: { level: 'careful', levelChosen: true } } }), { today: '2026-11-16' }).level).toBe('bold');
  });
  it('the plan\'s own budget, its linked partner, and the market as this context has it', () => {
    const p = plan({ household: { partnerScenarioId: 'b' }, budgetTool: { settings: { currentAge: 66 } } });
    const other = { id: 'b', createdAt: '2026-01-01T00:00:00Z' };
    const ctx = contextFor(p, { today: '2026-11-16', plans: [p, other, { id: 'c' }] });
    expect(ctx.budget).toEqual({ currentAge: 66 });
    expect(ctx.partnerPlan).toBe(other);
    expect(ctx.market).toEqual(marketStamp());
    expect(contextFor(plan(), { today: '2026-11-16' }).partnerPlan).toBeNull();
    expect(contextFor(plan(), { today: '2026-11-16' }).budget).toBeNull();
  });
});
