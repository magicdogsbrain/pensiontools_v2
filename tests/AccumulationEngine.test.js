import { describe, it, expect } from 'vitest';
import {
  contributionBreakdown, contributionWarnings, projectAccumulation,
  marginalRate, marginalNiRate, FCA_RATES
} from '../src/services/AccumulationEngine.js';

describe('AccumulationEngine', () => {
  it('relief at source: £400 net becomes £500 gross; higher-rate payers have a claim to make', () => {
    const basic = contributionBreakdown({ netMonthly: 400, salary: 35000, schemeType: 'ras' });
    expect(basic.grossMonthly).toBeCloseTo(500, 6);
    expect(basic.hrClaimMonthly).toBe(0);
    const higher = contributionBreakdown({ netMonthly: 400, salary: 70000, schemeType: 'ras' });
    expect(higher.grossMonthly).toBeCloseTo(500, 6);
    expect(higher.hrClaimMonthly).toBeCloseTo(500 * 0.20, 6);
    expect(higher.notes.join(' ')).toMatch(/CLAIM/);
  });

  it('salary sacrifice beats net pay for the same net cost (NI saving)', () => {
    const salsac = contributionBreakdown({ netMonthly: 400, salary: 35000, schemeType: 'salsac' });
    const netpay = contributionBreakdown({ netMonthly: 400, salary: 35000, schemeType: 'netpay' });
    expect(salsac.grossMonthly).toBeGreaterThan(netpay.grossMonthly);
    expect(salsac.grossMonthly).toBeCloseTo(400 / (1 - 0.20 - 0.08), 6);
    expect(netpay.grossMonthly).toBeCloseTo(400 / 0.8, 6);
  });

  it('marginal bands: 0/20/40/45 and NI 8/2', () => {
    expect(marginalRate(10000)).toBe(0);
    expect(marginalRate(35000)).toBe(0.20);
    expect(marginalRate(70000)).toBe(0.40);
    expect(marginalRate(150000)).toBe(0.45);
    expect(marginalNiRate(35000)).toBe(0.08);
    expect(marginalNiRate(70000)).toBe(0.02);
  });

  it('warnings: MPAA cross-check fires only when UFPLS income was actually taken', () => {
    const w1 = contributionWarnings({ annualGrossTotal: 15000, salary: 50000, mpaaTriggered: true });
    expect(w1.some((w) => w.message.includes('MPAA'))).toBe(true);
    const w2 = contributionWarnings({ annualGrossTotal: 15000, salary: 50000, mpaaTriggered: false });
    expect(w2.some((w) => w.message.includes('MPAA'))).toBe(false);
    const w3 = contributionWarnings({ annualGrossTotal: 70000, salary: 50000 });
    expect(w3.some((w) => w.message.includes('Annual Allowance'))).toBe(true);
  });

  it('projection: mid rate compounds, results in today\'s money, escalation raises later contributions', () => {
    const rows = projectAccumulation({ currentAge: 55, retirementAge: 65, potNow: 100000, totalMonthly: 1000, assumedCpi: 0.025 });
    expect(rows).toHaveLength(11);
    const last = rows[10];
    expect(last.potHigh).toBeGreaterThan(last.potMid);
    expect(last.potMid).toBeGreaterThan(last.potLow);
    // low rate (2%) < CPI (2.5%): real value of the pot alone shrinks, but contributions still grow it
    expect(last.contributedToDate).toBeCloseTo(120000, 0);
    const esc = projectAccumulation({ currentAge: 55, retirementAge: 65, potNow: 100000, totalMonthly: 1000, escalationPct: 3, assumedCpi: 0.025 });
    expect(esc[10].contributedToDate).toBeGreaterThan(last.contributedToDate);
    expect(esc[10].potMid).toBeGreaterThan(last.potMid);
  });
});
