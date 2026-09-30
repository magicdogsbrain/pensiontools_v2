/**
 * The diversifiers sleeve has ONE target, everywhere (owner, 30 Sep 2026: "same as shares and bonds"):
 * its starting value, raised by inflation and run down in a straight line to nothing at the end of
 * the plan — ProtectionStrategy.diversifierGlidepath. Since 6.15.0 the protection test has used it.
 * This file pins the two places that still used the starting value, flat in pounds:
 *   1. the Glidepath table's Diversifiers column (GlidepathService.generateGlidepathSchedule);
 *   2. the "which pot pays" ranking (WithdrawalSourcing.planSourcing), as fed by BOTH engines.
 */
import { describe, it, expect } from 'vitest';
import { generateGlidepathSchedule, calculateGlidepath } from '../src/services/GlidepathService.js';
import { diversifierGlidepath } from '../src/services/ProtectionStrategy.js';
import { planSourcing } from '../src/services/WithdrawalSourcing.js';
import { simulateTraced, monteCarloReturns } from '../src/services/SimulationEngine.js';
import { calcDecisionPWA } from '../src/services/legacyDecision.js';
import { stressConfigs } from './golden/matrix.js';
import { buildDecisionContext, aprilDate } from './crossval/harness.js';

// A £300,000 plan with a £45,000 sleeve (the same plan tests/crossval replays).
const PLAN = { equityMin: 150000, bondMin: 90000, cashTarget: 15000, diversifierStart: 45000, duration: 30 };

describe('Glidepath table: the Diversifiers column is the sleeve\'s glidepath', () => {
  const sch = generateGlidepathSchedule(PLAN, 0.025);

  it('starts at the sleeve\'s starting value and ends at nothing, like shares and bonds', () => {
    expect(sch[0].diversifier).toBe(45000);
    expect(sch[30].diversifier).toBe(0);
    expect(sch[30].equityMin).toBe(0);
  });

  it('every year equals diversifierGlidepath (the protection test\'s figure) exactly', () => {
    for (const row of sch) {
      expect(row.diversifier).toBe(diversifierGlidepath(45000, row.year, 30, row.cumulativeInflation));
      expect(row.diversifier).toBe(calculateGlidepath(45000, row.year, 30, row.cumulativeInflation, true));
    }
  });

  it('keeps the same proportion to the shares floor in every year (no bond tent)', () => {
    for (const row of sch.slice(0, 30)) expect(row.diversifier / row.equityMin).toBeCloseTo(45000 / 150000, 12);
  });

  it('the total and the shares % use the glided figure', () => {
    for (const row of sch) {
      expect(row.totalMin).toBeCloseTo(row.equityMin + row.bondMin + row.cashTarget + row.diversifier + row.hodl, 9);
      const pot = row.equityMin + row.bondMin + row.cashTarget + row.diversifier;
      expect(row.equityShareOfPot).toBeCloseTo(pot > 0 ? row.equityMin / pot : 0, 12);
    }
    // year 10 of the £300k plan: 45,000 × 1.025^10 × (1 − 10/30) = £38,402.54 (was £45,000 flat)
    expect(sch[10].diversifier).toBeCloseTo(45000 * Math.pow(1.025, 10) * (2 / 3), 6);
    expect(Math.round(sch[10].diversifier)).toBe(38403);
  });

  it('the bond tent re-divides shares and bonds only: the sleeve\'s column does not move', () => {
    const tent = generateGlidepathSchedule({ ...PLAN, equityGlideEnabled: true }, 0.025);
    for (const row of tent) expect(row.diversifier).toBe(sch[row.year].diversifier);
  });

  it('a plan with no sleeve is unchanged; the break-glass reserve stays flat', () => {
    const plain = generateGlidepathSchedule({ equityMin: 100000, bondMin: 50000, cashTarget: 20000, hodlEnabled: true, hodlValue: 30000, duration: 10 }, 0.025);
    for (const row of plain) { expect(row.diversifier).toBe(0); expect(row.hodl).toBe(30000); }
  });
});

describe('planSourcing: the sleeve is ranked against the target it is given', () => {
  // Cash gone, shares and bonds both under their floors: the cascade ranks the three by value ÷ target.
  const stressed = { equity: 120000, bond: 70000, cash: 0, eqMin: 128008, bdMin: 76805, csTarget: 19201, inProtection: false, draw: 1920 };

  it('above its glided target the sleeve pays; below it, the least-depressed of shares and bonds pays', () => {
    const target = diversifierGlidepath(45000, 10, 30, Math.pow(1.025, 10));   // £38,402.54
    const above = planSourcing({ ...stressed, diversifier: 40000, diversifierTarget: target });   // 1.04 of target
    expect(above.fromDiversifier).toBeCloseTo(1920, 6);
    const below = planSourcing({ ...stressed, diversifier: 30000, diversifierTarget: target });   // 0.78 of target
    expect(below.fromDiversifier).toBe(0);
    expect(below.fromEquity).toBeCloseTo(1920, 6);   // shares at 0.94 of floor beat bonds at 0.91
  });

  it('a target that has run down to nothing is treated like a shares or bonds floor of nothing', () => {
    // After the end of the plan every floor is 0: all three read as far above target; the sleeve is not singled out as "on target".
    const r = planSourcing({ equity: 1000, bond: 1000, cash: 0, eqMin: 0, bdMin: 0, csTarget: 0, inProtection: true, draw: 500, diversifier: 5000, diversifierTarget: 0 });
    expect(r.fromDiversifier).toBeCloseTo(500, 6);   // 5000/1 is the most overweight
  });

  it('no target given: the sleeve reads as exactly on target (unchanged)', () => {
    const r = planSourcing({ ...stressed, diversifier: 30000 });
    expect(r.fromDiversifier).toBeCloseTo(1920, 6);
  });
});

describe('both engines rank the sleeve against the same glided target', () => {
  const base = stressConfigs[0].config;
  const sleeve = {
    ...base, equityStart: 150000, bondStart: 90000, cashStart: 15000, equityMin: 150000, bondMin: 90000, cashTarget: 15000,
    diversifierStart: 45000, baseSalary: 18000, duration: 30, years: 30, disableProtection: false, consecutiveLimit: 3, recoveryBuffer: 15000
  };

  it('Stress engine: the ranking target each month is the sleeve\'s glidepath that month, not £45,000', () => {
    const sim = simulateTraced(sleeve, 3);
    expect(sim.trace.length).toBeGreaterThan(300);
    for (const t of sim.trace) {
      expect(t.diversifierTarget).toBe(t.diversifierGlide);
      expect(t.diversifierTarget).toBe(diversifierGlidepath(45000, t.year, 30, t.cumInf));
    }
    expect(sim.trace[0].diversifierTarget).toBe(45000);
    expect(sim.trace[sim.trace.length - 1].diversifierTarget).toBeLessThan(45000 * sim.trace[sim.trace.length - 1].cumInf / 25);
  });

  it('Decision engine: reports the same target, to the penny, in every month of a replayed future', async () => {
    let months = 0;
    for (const seed of [0, 3, 7]) {
      const returns = monteCarloReturns(sleeve, seed);
      const sim = simulateTraced(sleeve, seed);
      const { settings, allTaxYears } = buildDecisionContext(sleeve, sim.trace, returns);
      for (const t of sim.trace) {
        if (!(t.diversifierStart > 0)) continue;   // sleeve spent: the Decision engine reports no sleeve fields
        const date = aprilDate(t.month);
        const dec = await calcDecisionPWA(date, t.equityStart, t.bondStart, t.cashStart, {
          settings, history: [], allTaxYears, spInfo: { amount: t.planInputs.statePension }, isaBalance: t.isaStart, diversifier: t.diversifierStart
        });
        expect(Math.abs(dec.diversifierTarget - t.diversifierTarget)).toBeLessThanOrEqual(0.01);
        months++;
      }
    }
    expect(months).toBeGreaterThan(600);
  });

  it('Decision engine: the same stressed month is advised the way the Stress engine would pay it', async () => {
    // Year 11 of the plan (2036/37), 2.5% inflation entered for every year: floors £128,008 / £76,805,
    // sleeve target £38,403. Cash is gone and shares and bonds are both under their floors.
    const settings = { baseSalary: 18000, equityMin: 150000, bondMin: 90000, cashTarget: 15000, duration: 30, diversifierStart: 45000, protectionFactor: 20, recoveryBuffer: 15000, consecutiveLimit: 3, firstTaxYear: 2026 };
    const allTaxYears = {};
    for (let y = 26; y < 60; y++) allTaxYears[`${y}/${y + 1}`] = { pa: 12570, brl: 50270, hrl: 125140, cpi: 0.025, other: 0, isTaxEfficient: true };
    const run = (diversifier) => calcDecisionPWA('2036-06', 120000, 70000, 0, { settings, history: [], allTaxYears, spInfo: { amount: 0 }, isaBalance: 0, diversifier });

    const above = await run(40000);                       // 1.04 of its target: the sleeve pays
    expect(above.diversifierTarget).toBeCloseTo(38402.54, 1);
    expect(above.drawFromDiversifier).toBeGreaterThan(0);
    expect(above.drawFromEquity + above.drawFromBond).toBe(0);

    const below = await run(30000);                       // 0.78 of its target: shares (0.94 of floor) pay
    expect(below.drawFromDiversifier).toBe(0);            // before: the sleeve read as "on target" and paid
    expect(below.drawFromEquity).toBeGreaterThan(0);
  });
});
