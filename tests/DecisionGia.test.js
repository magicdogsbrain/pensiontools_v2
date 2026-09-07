/**
 * The Decision tool and the taxable sleeve (GIA): the wrapper a lump sum actually has to live in.
 * The sleeve pays the month's top-up BEFORE the ISA, net of CGT (nil on gilts), and a GIA draw is
 * not taxable income — so the SIPP band-filling is exactly what it would be with an ISA. The
 * cost basis and the CGT exemption persist through the history records; windfalls and
 * bed-and-ISA are advised, never silently applied.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { decisionCases } from './golden/matrix.js';
import { calcDecisionPWA } from '../src/services/legacyDecision.js';
import { decisionToHistory } from '../src/models/Decision.js';
import { seedDecisionFromStress, seedStressFromDecision } from '../src/storage/ScenarioRepository.js';

const base = decisionCases.find((c) => /ISA pot \(Option A\)/.test(c.name));
const run = (deps) => calcDecisionPWA(base.input.dateStr, base.input.equity, base.input.bond, base.input.cash, deps);
const priorMonth = (extra = {}) => ({ date: '2026-05', source: 'Growth', sipp: 3000, stdSipp: 3000, inProtection: false, boostAmount: 0, isa: 0, taxYear: '26/27', ...extra });

describe('Decision tool + taxable sleeve (GIA)', () => {
  it('a GIA pays the top-up instead of the ISA; the SIPP band-filling is untouched (a GIA draw is not taxable income)', async () => {
    const isaOnly = await run(base.deps);
    const giaOnly = await run({ ...base.deps, isaBalance: 0, giaBalance: 200000, giaBasis: 200000 });
    expect(isaOnly.isaDraw).toBeGreaterThan(0);
    expect(giaOnly.sippDraw).toBeCloseTo(isaOnly.sippDraw, 6);
    expect(giaOnly.isaDraw).toBe(0);
    expect(giaOnly.giaNet).toBeCloseTo(isaOnly.isaDraw, 2);     // no gain, no CGT: the same money in the pocket
    expect(giaOnly.giaCgt).toBe(0);
    expect(giaOnly.totalMonthlyNet).toBeCloseTo(isaOnly.totalMonthlyNet, 2);
    expect(giaOnly.calculationDetails.taxInfo.annualTaxable).toBeCloseTo(isaOnly.calculationDetails.taxInfo.annualTaxable, 6);
  });

  it('with both, the sleeve goes first and the ISA covers only the remainder', async () => {
    const isaOnly = await run(base.deps);
    expect(isaOnly.isaDraw).toBeGreaterThan(200);
    const both = await run({ ...base.deps, giaBalance: 200, giaBasis: 200 });   // a sleeve smaller than one month's top-up
    expect(both.giaNet).toBeCloseTo(200, 2);
    expect(both.isaDraw).toBeCloseTo(isaOnly.isaDraw - 200, 2);
    expect(both.giaBalanceAfter).toBeCloseTo(0, 6);
    expect(both.totalMonthlyNet).toBeCloseTo(isaOnly.totalMonthlyNet, 2);
  });

  it('CGT: 18% on the realised gain above the £3,000 exemption, grossed up so the pocket is whole; gilts are exempt', async () => {
    const ty = { ...base.deps.allTaxYears['26/27'], cgtExemptionUsed: 3000 };   // exemption already used elsewhere this year
    const eq = await run({ ...base.deps, isaBalance: 0, giaBalance: 200000, giaBasis: 100000, allTaxYears: { '26/27': ty } });
    expect(eq.giaCgt).toBeGreaterThan(0);
    expect(eq.giaCgt).toBeCloseTo(eq.giaDraw * 0.5 * 0.18, 0);   // half of every £ sold is gain
    expect(eq.giaNet).toBeCloseTo(eq.giaDraw - eq.giaCgt, 6);
    const isaOnly = await run(base.deps);
    expect(eq.giaNet).toBeCloseTo(isaOnly.isaDraw, 2);
    const gilt = await run({ ...base.deps, isaBalance: 0, giaBalance: 200000, giaBasis: 100000, allTaxYears: { '26/27': ty }, settings: { ...base.deps.settings, taxableMix: 'gilt' } });
    expect(gilt.giaCgt).toBe(0);
    expect(gilt.giaNet).toBeCloseTo(isaOnly.isaDraw, 2);
    expect(gilt.giaIncomeTaxAnnual).toBe(0);
    expect(eq.giaIncomeTaxAnnual).toBeGreaterThan(0);
  });

  it('the CGT exemption is a tax-year allowance: gains realised in earlier months of the year count', async () => {
    const fresh = await run({ ...base.deps, isaBalance: 0, giaBalance: 200000, giaBasis: 100000 });
    expect(fresh.giaCgt).toBe(0);                     // one month's gain is well inside £3,000
    expect(fresh.giaGainUsed).toBeGreaterThan(0);
    const later = await run({ ...base.deps, isaBalance: 0, giaBalance: 200000, giaBasis: 100000, history: [priorMonth({ giaGainUsed: 2900 })] });
    expect(later.cgtExemptionUsed).toBeCloseTo(3000, 6);
    expect(later.giaCgt).toBeGreaterThan(0);
  });

  it('persists what next month needs on the history record (post-draw balance, basis, exemption used); nothing when there is no GIA', async () => {
    const r = await run({ ...base.deps, isaBalance: 0, giaBalance: 200000, giaBasis: 100000 });
    const h = decisionToHistory(r);
    expect(h.giaBalanceAfter).toBeCloseTo(200000 - r.giaDraw, 6);
    expect(h.giaBasisAfter).toBeCloseTo(100000 - r.giaDraw * 0.5, 6);
    expect(h.giaGainUsed).toBe(r.giaGainUsed);
    expect(h.monthlyNet).toBeCloseTo(r.totalMonthlyNet, 6);
    const plain = await run(base.deps);
    expect(plain).not.toHaveProperty('giaBalance');
    expect(decisionToHistory(plain)).not.toHaveProperty('gia');
  });

  it('an ISA on hold is still never drawn; the sleeve beside it pays the top-up', async () => {
    const r = await run({ ...base.deps, giaBalance: 200000, giaBasis: 200000, settings: { ...base.deps.settings, isaDrawdownStrategy: 'hold' } });
    expect(r.isaDraw).toBe(0);
    expect(r.giaNet).toBeGreaterThan(0);
  });

  it('advises where this plan year\'s expected lump sum can legally go (ISA allowance, SIPP room, the rest taxable)', async () => {
    const r = await run({ ...base.deps, settings: { ...base.deps.settings, windfalls: [{ year: 0, amount: 100000, label: 'House sale' }] } });
    const a = r.alerts.find((x) => x.type === 'windfall');
    expect(a).toBeTruthy();
    expect(r.windfallAdvice[0]).toMatchObject({ toIsa: 20000, toSipp: 3600, toGia: 76400 });
    expect(a.message).toMatch(/76,400/);
    const none = await run({ ...base.deps, settings: { ...base.deps.settings, windfalls: [{ year: 3, amount: 100000 }] } });
    expect(none.alerts.some((x) => x.type === 'windfall')).toBe(false);
    expect(none).not.toHaveProperty('windfallAdvice');
  });

  it('reminds once a tax year (the first entry) to bed-and-ISA the taxable account, with the CGT the move would cost', async () => {
    const first = await run({ ...base.deps, isaBalance: 0, giaBalance: 50000, giaBasis: 50000 });
    expect(first.alerts.find((x) => x.type === 'bed-and-isa')).toBeTruthy();
    expect(first.bedAndIsaSuggestion).toMatchObject({ amount: 20000, cgt: 0 });
    const later = await run({ ...base.deps, isaBalance: 0, giaBalance: 50000, giaBasis: 50000, history: [priorMonth()] });
    expect(later.alerts.some((x) => x.type === 'bed-and-isa')).toBe(false);
    const off = await run({ ...base.deps, isaBalance: 0, giaBalance: 50000, giaBasis: 50000, settings: { ...base.deps.settings, bedAndIsa: false } });
    expect(off.alerts.some((x) => x.type === 'bed-and-isa')).toBe(false);
  });

  it('the taxable sleeve and the plan\'s windfalls travel with a copy in both directions (no silent drop)', () => {
    const stress = { taxableStart: 50000, taxableMix: 'gilt', giaTaxBand: 'higher', bedAndIsa: false, relevantEarnings: 12000, windfalls: [{ year: 2, amount: 80000 }] };
    const d = seedDecisionFromStress(stress, {});
    expect(d).toMatchObject(stress);
    const s = seedStressFromDecision(d, {}, '2026-07-09T00:00:00Z');
    expect(s).toMatchObject(stress);
  });
});
