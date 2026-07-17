/**
 * BudgetModel — pure math for the net-first budgeting tool (Stage 0).
 */

import { describe, it, expect } from 'vitest';
import {
  PLSA_2024,
  BUDGET_CATEGORIES,
  starterLines,
  DEFAULT_TAX_BANDS,
  lineActiveAtAge,
  annualNetAtAge,
  essentialAnnualNet,
  comfortableAnnualNet,
  oneOffSchedule,
  grossUpAnnual,
  summariseBudget,
  defaultBudget
} from '../src/services/BudgetModel.js';

const budget = {
  version: 1,
  currentAge: 45,
  retirementAge: 60,
  endAge: 100,
  lines: [
    { id: 'a', label: 'Housing', tier: 'essential', annual: 12000, fromAge: null, toAge: null },
    { id: 'b', label: 'Food & bills', tier: 'essential', annual: 9000, fromAge: null, toAge: null },
    { id: 'c', label: 'Holidays', tier: 'discretionary', annual: 6000, fromAge: 60, toAge: 75 },
    { id: 'd', label: 'Hobbies', tier: 'discretionary', annual: 3000, fromAge: null, toAge: null }
  ],
  oneOffs: [
    { id: 'car', label: 'Car', tier: 'essential', amount: 24000, atAge: 62, everyYears: 8 },
    { id: 'roof', label: 'New roof', tier: 'essential', amount: 15000, atAge: 70, everyYears: null }
  ]
};

describe('BudgetModel — expenditure lines & totals', () => {
  it('resolves open (null) age bands to retirement→end', () => {
    expect(lineActiveAtAge(budget.lines[0], budget, 60)).toBe(true);
    expect(lineActiveAtAge(budget.lines[0], budget, 100)).toBe(true);
    expect(lineActiveAtAge(budget.lines[0], budget, 59)).toBe(false); // before retirement
  });

  it('honours explicit age bands (holidays only 60–75)', () => {
    expect(lineActiveAtAge(budget.lines[2], budget, 60)).toBe(true);
    expect(lineActiveAtAge(budget.lines[2], budget, 75)).toBe(true);
    expect(lineActiveAtAge(budget.lines[2], budget, 76)).toBe(false);
  });

  it('essential floor = essential lines active at retirement', () => {
    expect(essentialAnnualNet(budget)).toBe(21000); // 12000 + 9000
  });

  it('comfortable = all lines active at retirement (essential + discretionary)', () => {
    expect(comfortableAnnualNet(budget)).toBe(30000); // 21000 + 6000 holidays + 3000 hobbies
  });

  it('comfortable falls once a time-limited band ends (holidays stop at 75)', () => {
    expect(annualNetAtAge(budget, 60, 'all')).toBe(30000);
    expect(annualNetAtAge(budget, 76, 'all')).toBe(24000); // holidays gone → 21000 + 3000
  });
});

describe('BudgetModel — one-off / lumpy schedule', () => {
  it('expands a recurring item across the horizon (car every 8y from 62)', () => {
    const cars = oneOffSchedule(budget).filter((e) => e.label === 'Car').map((e) => e.age);
    expect(cars).toEqual([62, 70, 78, 86, 94]); // stops before endAge 100
  });

  it('includes a single item once, in its year', () => {
    const roof = oneOffSchedule(budget).filter((e) => e.label === 'New roof');
    expect(roof).toHaveLength(1);
    expect(roof[0].age).toBe(70);
  });

  it('respects an explicit age window', () => {
    const inWindow = oneOffSchedule(budget, 60, 72).filter((e) => e.label === 'Car').map((e) => e.age);
    expect(inWindow).toEqual([62, 70]);
  });

  it('is sorted by age', () => {
    const ages = oneOffSchedule(budget).map((e) => e.age);
    expect(ages).toEqual([...ages].sort((a, b) => a - b));
  });
});

describe('BudgetModel — interim net→gross uplift', () => {
  const taxOf = (gross) => {
    const { pa, brl, hrl } = DEFAULT_TAX_BANDS;
    if (gross <= pa) return 0;
    if (gross <= brl) return (gross - pa) * 0.2;
    if (gross <= hrl) return (brl - pa) * 0.2 + (gross - brl) * 0.4;
    return (brl - pa) * 0.2 + (hrl - brl) * 0.4 + (gross - hrl) * 0.45;
  };

  it('round-trips: gross − tax(gross) == requested net', () => {
    for (const net of [10000, 20000, 30000, 45000, 60000, 130000]) {
      const gross = grossUpAnnual(net);
      expect(gross - taxOf(gross)).toBeCloseTo(net, 4);
    }
  });

  it('is a no-op within the personal allowance', () => {
    expect(grossUpAnnual(12000)).toBe(12000);
  });

  it('grosses up above the allowance', () => {
    expect(grossUpAnnual(20000)).toBeGreaterThan(20000);
  });
});

describe('BudgetModel — summary & defaults', () => {
  it('summarises monthly/annual essential & comfortable + a suggested gross', () => {
    const s = summariseBudget(budget);
    expect(s.essentialAnnualNet).toBe(21000);
    expect(s.comfortableAnnualNet).toBe(30000);
    expect(s.comfortableMonthlyNet).toBeCloseTo(2500, 6);
    expect(s.suggestedGrossAnnual).toBeGreaterThan(30000); // grossed up
  });

  it('defaultBudget is empty and safe to summarise', () => {
    const d = defaultBudget();
    expect(d.lines).toEqual([]);
    expect(summariseBudget(d).comfortableAnnualNet).toBe(0);
  });

  it('exposes PLSA 2024 benchmarks', () => {
    expect(PLSA_2024.single.comfortable).toBe(43100);
    expect(PLSA_2024.couple.minimum).toBe(22400);
  });
});

describe('BudgetModel — starter categories', () => {
  it('seeds essential + discretionary lines with blank amounts and hints', () => {
    const lines = starterLines();
    expect(lines.some((l) => l.tier === 'essential' && l.label === 'Rent / mortgage')).toBe(true);
    expect(lines.some((l) => l.tier === 'discretionary' && l.label === 'Holidays')).toBe(true);
    expect(lines.every((l) => l.annual === null)).toBe(true); // amounts left for the user
    expect(lines.length).toBe(BUDGET_CATEGORIES.essential.length + BUDGET_CATEGORIES.discretionary.length);
  });

  it('the boundary with one-offs is spelled out in the hints', () => {
    const upkeep = starterLines().find((l) => l.label === 'Home upkeep');
    expect(upkeep.hint.toLowerCase()).toContain('one-off');
  });
});
