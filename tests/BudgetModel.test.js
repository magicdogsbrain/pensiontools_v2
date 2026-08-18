/**
 * BudgetModel — pure math for the net-first budgeting tool (Stage 0).
 */

import { describe, it, expect } from 'vitest';
import { targetScheduleFromBudget,
  PLSA_2024,
  BUDGET_CATEGORIES,
  starterLines,
  starterOneOffs,
  missingSuggestions,
  typicalMonthlyFor,
  DEFAULT_TAX_BANDS,
  lineActiveAtAge,
  annualNetAtAge,
  essentialAnnualNet,
  comfortableAnnualNet,
  oneOffSchedule,
  grossUpAnnual,
  summariseBudget,
  defaultBudget,
  evalAmountExpr,
  typicalSanityFlag,
  breakdownAnnual,
  plsaTierOf
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
  it('seeds essential + discretionary lines with blank amounts, hints and a period', () => {
    const lines = starterLines();
    expect(lines.some((l) => l.tier === 'essential' && l.label === 'Rent / mortgage')).toBe(true);
    expect(lines.some((l) => l.tier === 'discretionary' && l.label === 'Main holiday')).toBe(true);
    expect(lines.every((l) => l.annual === null)).toBe(true); // amounts left for the user
    expect(lines.every((l) => l.period === 'mo' || l.period === 'yr')).toBe(true);
    expect(lines.length).toBe(BUDGET_CATEGORIES.essential.length + BUDGET_CATEGORIES.discretionary.length);
  });

  it('covers the user-requested specifics (mobiles, streaming, subscriptions, car tax, pets…)', () => {
    const labels = starterLines().map((l) => l.label.toLowerCase()).join(' | ');
    for (const needle of ['mobile', 'streaming', 'subscriptions', 'car tax', 'pets', 'council tax', 'petrol', 'gym']) {
      expect(labels).toContain(needle);
    }
  });

  it('the boundary with one-offs is spelled out in the hints', () => {
    const upkeep = starterLines().find((l) => l.label === 'Home upkeep');
    expect(upkeep.hint.toLowerCase()).toContain('one-off');
  });

  it('seeds starter one-off items (new car, major home work, white goods)', () => {
    const labels = starterOneOffs().map((o) => o.label);
    expect(labels).toContain('New car');
    expect(labels).toContain('Major home work');
    expect(starterOneOffs().every((o) => o.amount === null)).toBe(true);
  });
});

describe('BudgetModel — typical amounts (PLSA-tier anchored)', () => {
  it('defaults to the Moderate tier and picks couple vs single by the sharing flag', () => {
    expect(typicalMonthlyFor('Council tax', { sharedWithPartner: false })).toBe(115);
    expect(typicalMonthlyFor('Council tax', { sharedWithPartner: true })).toBe(170);
    expect(typicalMonthlyFor('Groceries & household', { sharedWithPartner: true })).toBe(470);
  });

  it('the chosen tier changes the figure (Minimum < Moderate < Comfortable)', () => {
    const min = typicalMonthlyFor('Main holiday', { plsaTier: 'minimum' });
    const mod = typicalMonthlyFor('Main holiday', { plsaTier: 'moderate' });
    const comf = typicalMonthlyFor('Main holiday', { plsaTier: 'comfortable' });
    expect(min).toBeLessThan(mod);
    expect(mod).toBeLessThan(comf);
  });

  it('Minimum tier assumes no car — car categories return 0 (a meaningful zero)', () => {
    expect(typicalMonthlyFor('Car insurance', { plsaTier: 'minimum' })).toBe(0);
    expect(typicalMonthlyFor('Petrol / fuel', { plsaTier: 'minimum' })).toBe(0);
    // …and its public transport figure is HIGHER than the car tiers'
    expect(typicalMonthlyFor('Public transport', { plsaTier: 'minimum' }))
      .toBeGreaterThan(typicalMonthlyFor('Public transport', { plsaTier: 'comfortable' }));
  });

  it('an unknown tier string falls back to Moderate', () => {
    expect(typicalMonthlyFor('Council tax', { plsaTier: 'banana' })).toBe(115);
    expect(plsaTierOf({ plsaTier: 'comfortable' })).toBe('comfortable');
    expect(plsaTierOf({})).toBe('moderate');
  });

  it('returns null for a category with no typical (custom / too variable)', () => {
    expect(typicalMonthlyFor('Rent / mortgage', {})).toBe(null);
    expect(typicalMonthlyFor('Some custom thing', {})).toBe(null);
  });
});

describe('BudgetModel — completeness nudge (missingSuggestions)', () => {
  const seeded = { retirementAge: 60, endAge: 100, lines: starterLines() };

  it('offers commonly-forgotten extras not in the seeded set', () => {
    const labels = missingSuggestions(seeded).map((m) => m.label);
    expect(labels).toContain('Christmas & birthdays');
    expect(labels).toContain('Long-term care set-aside');
    expect(labels).toContain("Partner's personal spending");
    expect(labels).not.toContain('Rent / mortgage'); // already seeded
  });

  it("re-offers a category the user removed (their 'we don't eat out' case)", () => {
    const lines = starterLines().filter((l) => l.label !== 'Eating out & takeaways');
    const labels = missingSuggestions({ retirementAge: 60, endAge: 100, lines }).map((m) => m.label);
    expect(labels).toContain('Eating out & takeaways');
  });

  it('does not offer duplicates', () => {
    const labels = missingSuggestions(seeded).map((m) => m.label.toLowerCase());
    expect(labels.length).toBe(new Set(labels).size);
  });
});

describe('BudgetModel — partner cost sharing', () => {
  const base = {
    version: 1, currentAge: 45, retirementAge: 60, endAge: 95,
    sharedWithPartner: true, mySharePct: 50,
    lines: [
      { id: 'a', label: 'Rent', tier: 'essential', annual: 12000, paidBy: 'me' },
      { id: 'b', label: 'Shopping', tier: 'essential', annual: 6000, paidBy: 'partner' },
      { id: 'c', label: 'Holidays', tier: 'discretionary', annual: 8000, paidBy: 'shared' }
    ],
    oneOffs: []
  };

  it("owner's need excludes partner-paid lines and halves shared ones", () => {
    const s = summariseBudget(base);
    // mine: rent 12000 (me) + holidays 8000×50% = 16000 ; household: 12000+6000+8000 = 26000
    expect(s.comfortableAnnualNet).toBe(16000);
    expect(s.householdComfortableAnnual).toBe(26000);
    expect(s.essentialAnnualNet).toBe(12000); // shopping (partner) excluded from owner essentials
  });

  it('respects a non-50 share', () => {
    const s = summariseBudget({ ...base, mySharePct: 25 });
    expect(s.comfortableAnnualNet).toBe(12000 + 8000 * 0.25); // 14000
  });

  it('with sharing OFF, mine == household (back-compat)', () => {
    const s = summariseBudget({ ...base, sharedWithPartner: false });
    expect(s.comfortableAnnualNet).toBe(26000);
    expect(s.householdComfortableAnnual).toBe(26000);
  });

  it('shares periodic one-offs too', () => {
    const b = { ...base, oneOffs: [{ id: 'car', label: 'Her car', tier: 'essential', amount: 16000, atAge: 62, everyYears: 8, paidBy: 'partner' }] };
    const s = summariseBudget(b);
    expect(s.periodicAnnualAverage).toBe(0); // partner's car → excluded from owner's need
  });

  it('a per-line mySharePct overrides the budget-wide split', () => {
    const b = {
      ...base,
      lines: [
        { id: 'a', label: 'Rent', tier: 'essential', annual: 12000, paidBy: 'shared', mySharePct: 70 },
        { id: 'c', label: 'Holidays', tier: 'discretionary', annual: 8000, paidBy: 'shared' } // falls back to global 50
      ]
    };
    const s = summariseBudget(b);
    expect(s.comfortableAnnualNet).toBe(12000 * 0.7 + 8000 * 0.5); // 12400
  });

  it('blank / non-numeric per-line pct falls back to the global split', () => {
    const b = { ...base, lines: [{ id: 'c', label: 'Holidays', tier: 'discretionary', annual: 8000, paidBy: 'shared', mySharePct: '' }] };
    expect(summariseBudget(b).comfortableAnnualNet).toBe(4000);
  });

  it("reports the partner's side: household minus mine", () => {
    const s = summariseBudget(base);
    // household 26000, mine 16000 → partner 10000 (shopping 6000 + half of holidays 4000)
    expect(s.partnerAllInAnnual).toBe(10000);
    expect(s.partnerAllInMonthly).toBeCloseTo(10000 / 12, 6);
  });

  it("partner share is zero when sharing is off", () => {
    expect(summariseBudget({ ...base, sharedWithPartner: false }).partnerAllInAnnual).toBe(0);
  });
});

describe('BudgetModel — amount expression calculator (evalAmountExpr)', () => {
  it('evaluates sums, products and mixed expressions', () => {
    expect(evalAmountExpr('11.99+8.99+5.99')).toBeCloseTo(26.97, 2);
    expect(evalAmountExpr('4×52/12')).toBeCloseTo(17.33, 2);
    expect(evalAmountExpr('3*40')).toBe(120);
    expect(evalAmountExpr(' (25+15) * 2 ')).toBe(80);
    expect(evalAmountExpr('1,200+300')).toBe(1500); // thousands separators tolerated
  });

  it('passes plain numbers through', () => {
    expect(evalAmountExpr('85')).toBe(85);
    expect(evalAmountExpr('85.5')).toBe(85.5);
  });

  it("strips a leading '=' (spreadsheet muscle memory)", () => {
    expect(evalAmountExpr('=12+8')).toBe(20);
    expect(evalAmountExpr(' =4×52/12 ')).toBeCloseTo(17.33, 2);
    expect(evalAmountExpr('=85')).toBe(85);
    expect(evalAmountExpr('1=2')).toBeNull(); // '=' only valid at the front
  });

  it('rejects anything that is not plain arithmetic', () => {
    expect(evalAmountExpr('alert(1)')).toBeNull();
    expect(evalAmountExpr('1+process.exit()')).toBeNull();
    expect(evalAmountExpr('')).toBeNull();
    expect(evalAmountExpr('abc')).toBeNull();
    expect(evalAmountExpr(null)).toBeNull();
    expect(evalAmountExpr('()')).toBeNull(); // no digits
    expect(evalAmountExpr('1/0')).toBeNull(); // not finite
    expect(evalAmountExpr('2+')).toBeNull(); // malformed
  });
});

describe('BudgetModel — breakdown sub-sheet (breakdownAnnual)', () => {
  it('sums mixed per-month and per-year rows into an annual figure', () => {
    const rows = [
      { label: 'Insurance', amount: 450, period: 'yr' },
      { label: 'Fuel', amount: 80, period: 'mo' },     // 960/yr
      { label: 'MOT', amount: 55 }                     // default yr
    ];
    expect(breakdownAnnual(rows)).toBe(450 + 960 + 55);
  });
  it('ignores rows without an amount and handles empty/missing input', () => {
    expect(breakdownAnnual([{ label: 'todo item' }, { label: 'x', amount: null, period: 'mo' }])).toBe(0);
    expect(breakdownAnnual([])).toBe(0);
    expect(breakdownAnnual(undefined)).toBe(0);
  });
});

describe('BudgetModel — typical sanity flag', () => {
  const b = { sharedWithPartner: false };
  it('flags implausibly low and high amounts against the tier typicals', () => {
    // Groceries typical single (Moderate) = £300/mo = £3,600/yr
    expect(typicalSanityFlag('Groceries & household', 900, b)).toBe('low');     // ≤35%
    expect(typicalSanityFlag('Groceries & household', 12000, b)).toBe('high');  // ≥300%
    expect(typicalSanityFlag('Groceries & household', 3600, b)).toBeNull();     // plausible
  });
  it('stays silent with no typical figure or no amount', () => {
    expect(typicalSanityFlag('My weird custom line', 99999, b)).toBeNull();
    expect(typicalSanityFlag('Groceries & household', 0, b)).toBeNull();
    expect(typicalSanityFlag('Groceries & household', null, b)).toBeNull();
  });
});

describe('BudgetModel — periodic averaging (recurring lumpy → monthly need)', () => {
  it('averages recurring one-offs but not single ones', () => {
    const b = {
      version: 1, currentAge: 45, retirementAge: 60, endAge: 95,
      lines: [{ id: 'a', label: 'x', tier: 'essential', annual: 24000 }],
      oneOffs: [
        { id: 'car', label: 'Car', tier: 'essential', amount: 24000, atAge: 62, everyYears: 8 }, // → 3000/yr
        { id: 'roof', label: 'Roof', tier: 'essential', amount: 15000, atAge: 70, everyYears: null } // single → excluded
      ]
    };
    const s = summariseBudget(b);
    expect(s.periodicAnnualAverage).toBe(3000);
    expect(s.allInComfortableAnnual).toBe(27000); // 24000 recurring + 3000 averaged
    expect(s.allInComfortableMonthly).toBeCloseTo(2250, 6);
    expect(s.suggestedGrossAnnual).toBeGreaterThan(27000); // grossed up from all-in
  });
});

describe('targetScheduleFromBudget', () => {
  const budget = {
    retirementAge: 60, currentAge: 58, endAge: 95,
    lines: [
      { label: 'Groceries', tier: 'essential', annual: 6000 },
      { label: 'Car lease', tier: 'essential', annual: 3600, fromAge: 60, toAge: 62 }
    ],
    oneOffs: [
      { label: 'New roof', amount: 15000, atAge: 70 },
      { label: 'Car', amount: 20000, atAge: 65, everyYears: 8 }
    ]
  };

  it('temporary lines end when they end; lumps land in their exact year', () => {
    const sch = targetScheduleFromBudget(budget, 15);
    expect(sch[0]).toBe(9600);           // groceries + lease at 60
    expect(sch[2]).toBe(9600);           // lease's last year (toAge 62)
    expect(sch[3]).toBe(6000);           // lease ended
    expect(sch[10]).toBe(6000 + 15000);  // roof at age 70 (single-shot, was invisible to the flat hand-off)
    expect(sch[5]).toBe(6000 + 20000);   // car at 65
    expect(sch[13]).toBe(6000 + 20000);  // car again at 73 (every 8 years)
  });

  it('partner sharing applies the owner share to lines and one-offs', () => {
    const shared = { ...budget, sharedWithPartner: true, mySharePct: 50,
      lines: [{ label: 'Groceries', tier: 'essential', annual: 6000, paidBy: 'shared' }],
      oneOffs: [{ label: 'New roof', amount: 15000, atAge: 70, paidBy: 'shared' }] };
    const sch = targetScheduleFromBudget(shared, 15);
    expect(sch[0]).toBe(3000);
    expect(sch[10]).toBe(3000 + 7500);
  });
});
