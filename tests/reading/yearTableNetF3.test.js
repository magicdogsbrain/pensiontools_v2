/**
 * Step F3, fix round 1: the year table's "After tax, before the ISA" column holds what its label says. A row adds up:
 * after tax, before the ISA + from the ISA + from other savings = to spend, on every row of every parity fixture, the
 * tax-free part of a pension draw included (a plan that takes a quarter of each draw tax-free).
 */
import { describe, it, expect } from 'vitest';
import { FIXTURES, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';
import { upgradeScenario } from '../../src/firebase/scenarioMigration.js';
import { contextFor } from '../../src/reading/context.js';
import { lastsInputOf } from '../../src/reading/gather.js';
import { yearTablesOf } from '../../src/reading/yearTable.js';
import { generateDrawdownSchedule } from '../../src/services/DrawdownService.js';

const NOW = new Date(2026, 10, 16, 12);
const up = (p) => upgradeScenario(JSON.parse(JSON.stringify(p)), { now: NOW }).scenario;

describe('the year table row adds up', () => {
  it('a draw with a tax-free quarter: after tax, before the ISA counts the tax-free part', () => {
    const s = { baseSalary: 24000, other: 0, statePension: 0, statePensionYear: 99, pa: 12570, brl: 50270, hrl: 125140,
      isaStart: 0, accessMethod: 'ufpls', isaDrawdownStrategy: 'hold', taxMode: 'frozen' };
    const [row] = generateDrawdownSchedule(s, 1, 0, new Date(2026, 10, 16), { closedYears: 0 });
    expect(row.sippDraw).toBeGreaterThan(0);
    expect(row.netIncome + row.isaDraw).toBeCloseTo(row.spendable, 6);
    expect(row.netIncome).toBeCloseTo(row.sippDraw + row.statePension + row.other - row.tax, 6);
  });

  let taxFreeSeen = 0;
  for (const f of FIXTURES) {
    it(f.key, () => {
      const plan = f.plans().map(up).find((p) => p.id === f.subject);
      const ctx = contextFor(plan, { today: PARITY_DAY });
      const input = lastsInputOf(plan, ctx);
      const t = yearTablesOf({ settings: input.settings, strategyId: 'pots-and-valves', now: ctx.now });
      for (const r of t.schedule || []) {
        expect(Math.abs(r.net + r.isa + (r.gia || 0) - r.spendable), `${f.key} year ${r.year}`).toBeLessThanOrEqual(2);
        if (r.pension + r.state - r.tax > r.net + 2) taxFreeSeen++;
      }
    });
  }
  it('no row leaves out a tax-free part', () => { expect(taxFreeSeen).toBe(0); });
});
