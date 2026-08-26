import { describe, it, expect } from 'vitest';
import { amountAtAge, suggestSteps, incomeStaircaseSvg } from '../src/ui/incomeShapeGraphic.js';
describe('income shape', () => {
  it('amountAtAge reads the latest applicable step', () => {
    const steps = [{ fromAge: 57, amount: 60000 }, { fromAge: 73, amount: 50000 }, { fromAge: 80, amount: 40000 }];
    expect(amountAtAge(steps, 60)).toBe(60000); expect(amountAtAge(steps, 73)).toBe(50000); expect(amountAtAge(steps, 91)).toBe(40000); expect(amountAtAge([], 60, 12345)).toBe(12345);
  });
  it('suggested steps: −15% at 75, −30% at 85, never below essentials, rounded to £500', () => {
    expect(suggestSteps(60000, 57)).toEqual([{ fromAge: 57, amount: 60000 }, { fromAge: 75, amount: 51000 }, { fromAge: 85, amount: 42000 }]);
    expect(suggestSteps(40000, 57, 35000)[2].amount).toBe(35000);
    expect(suggestSteps(60000, 80).length).toBe(2);
  });
  it('staircase draws one bar per age, the essentials line and the budget marker; below-essentials bars are orange', () => {
    const svg = incomeStaircaseSvg({ steps: [{ fromAge: 57, amount: 60000 }, { fromAge: 80, amount: 30000 }], ageNow: 57, horizonAge: 91, essentials: 35000, budgetGross: 60000 });
    expect((svg.match(/<rect x=/g) || []).length).toBeGreaterThanOrEqual(35);
    expect(svg).toContain('your essentials £35k'); expect(svg).toContain("today's budget £60k"); expect(svg).toContain('below your essentials');
  });
});
