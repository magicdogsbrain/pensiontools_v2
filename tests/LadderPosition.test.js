import { describe, it, expect } from 'vitest';
import { ladderPosition, taxYearOf, monthsLeftInTaxYear } from '../src/services/LadderPosition.js';

const plan = {
  firstTaxYear: 2027,
  cash: 275000,
  years: [
    { Y: 2027, age: 57, gross: 80000, need: 80000, from: 'cash' },
    { Y: 2028, age: 58, gross: 80000, need: 80000, from: 'cash' },
    { Y: 2030, age: 60, gross: 65000, need: 65000, from: 'T29', held: true, matures: '2029-03-22' },
    { Y: 2038, age: 68, gross: 45000, need: 32520, from: 'TR37', matures: '2037-11-22' }
  ],
  orders: [
    { tidm: 'T29', name: '0.125% IL 2029', matures: '2029-03-22', nominal: 74200, pays: 130000, taxYears: [2030, 2031] },
    { tidm: 'TR37', name: '1.125% IL 2037', matures: '2037-11-22', nominal: 15800, pays: 32520, taxYears: [2038] }
  ]
};

describe('taxYearOf', () => {
  it('splits on 6 April', () => {
    expect(taxYearOf(new Date('2027-04-05'))).toBe(2026);
    expect(taxYearOf(new Date('2027-04-06'))).toBe(2027);
    expect(taxYearOf(new Date('2027-12-31'))).toBe(2027);
  });
});

describe('monthsLeftInTaxYear', () => {
  it('is 12 at the start and 1 in the final month', () => {
    expect(monthsLeftInTaxYear(2027, new Date('2027-04-06'))).toBe(12);
    expect(monthsLeftInTaxYear(2027, new Date('2028-03-20'))).toBe(1);
  });
});

describe('ladderPosition', () => {
  it('reports the income step, the monthly instruction and the source', () => {
    const p = ladderPosition(plan, { today: new Date('2030-04-10') });
    expect(p.taxYearLabel).toBe('2030/31');
    expect(p.age).toBe(60);
    expect(p.fromLadder).toBe(65000);
    expect(p.source).toBe('T29');
    expect(p.monthly).toBeCloseTo(65000 / 12, 0);
    expect(p.instruction).toContain('a month');
  });

  it('nets the State Pension off the ladder draw', () => {
    const p = ladderPosition(plan, { today: new Date('2038-06-01') });
    expect(p.gross).toBe(45000);
    expect(p.statePension).toBe(12480);
    expect(p.fromLadder).toBe(32520);
  });

  it('counts money already drawn and re-spreads over the months left', () => {
    const p = ladderPosition(plan, { today: new Date('2030-10-06'), drawnThisYear: 32500 });
    expect(p.remaining).toBe(32500);
    expect(p.monthsLeft).toBe(6);
    expect(p.monthly).toBeCloseTo(32500 / 6, 0);
  });

  it('treats a matured rung belonging to a later year as parked', () => {
    const p = ladderPosition(plan, { today: new Date('2030-05-01') });
    expect(p.parkedTotal).toBe(0);          // 2031 is funded by T29 but that year is not in `years` here
    const p2 = ladderPosition({ ...plan, years: [...plan.years, { Y: 2031, age: 61, gross: 65000, need: 65000, from: 'T29', held: true, matures: '2029-03-22' }] }, { today: new Date('2030-05-01') });
    expect(p2.parkedTotal).toBe(65000);
    expect(p2.parked[0].Y).toBe(2031);
  });

  it('flags a cash balance that does not match the plan', () => {
    const p = ladderPosition(plan, { today: new Date('2030-04-10'), cashBalance: 65000 });
    expect(p.cashCheck.verdict).toBe('as expected');
    const q = ladderPosition(plan, { today: new Date('2030-04-10'), cashBalance: 20000 });
    expect(q.cashCheck.verdict).toContain('less cash');
  });

  it('describes the next maturity and how long it sits', () => {
    const p = ladderPosition(plan, { today: new Date('2030-04-10') });
    expect(p.next.tidm).toBe('TR37');
    expect(p.next.sitsMonths).toBeGreaterThan(3);
  });

  it('returns null for an empty plan', () => {
    expect(ladderPosition({ years: [] })).toBeNull();
  });
});
