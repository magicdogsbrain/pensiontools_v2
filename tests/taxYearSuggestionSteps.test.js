/**
 * The tax-year set-up's suggested income for the year reads the plan's income steps, as every engine does
 * (IncomeSchedule.scheduleFromSteps): a plan kept with steps and no stored per-year schedule is not grown by a year of
 * prices in its first year. Before, the set-up read only a stored schedule, so such a plan fell back to "last year's
 * figure uplifted by CPI" and its first year was asked for 4% more than the plan said.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { wizardDataFrom } from '../src/services/TaxYearSetUp.js';
import { seedDecisionFromStress } from '../src/services/PlanCommit.js';
import { defaultTaxYearConfig } from '../src/models/TaxYear.js';

const NOW = new Date(2026, 10, 6, 12);   // 6 November 2026: tax year 2026/27
const base = JSON.parse(readFileSync('tests/fixtures/plans/02-pnv-draft.json', 'utf8')).stressTool.settings;

function ctxFor(stress, ym = '2026-11') {
  const settings = seedDecisionFromStress(stress);
  return wizardDataFrom(ym, { settings, stressSettings: stress, existingConfig: defaultTaxYearConfig(), allTaxYears: {}, statePensionInfo: { amount: 0 }, now: NOW });
}

describe('the set-up suggests the year the plan\'s steps say', () => {
  it('a plan with steps and no stored schedule: the first year is the first step, not grown by prices', () => {
    const stress = { ...base, targetSchedule: undefined };
    delete stress.targetSchedule;
    const ctx = ctxFor(stress);
    expect(ctx.planYear).toBe(0);
    expect(ctx.suggestionSource).toBe('budget-schedule');
    expect(ctx.suggestedSalary).toBe(38000);
  });
  it('gives the same figure as the stored schedule the steps compile to', () => {
    expect(ctxFor(base).suggestedSalary).toBe(ctxFor({ ...base, targetSchedule: null }).suggestedSalary);
  });
});

describe('a level plan, before any year is confirmed', () => {
  it('its first year is the plan\'s one figure, not grown by a year of prices', () => {
    const stress = { ...base, incomeShape: 'level', incomeSteps: [{ fromAge: base.shapeAgeNow, amount: 32858 }], baseSalary: 32858 };
    delete stress.targetSchedule;
    const ctx = ctxFor(stress);
    expect(ctx.planYear).toBe(0);
    expect(ctx.suggestedSalary).toBe(32858);
  });
  it('a year already confirmed is followed: last year\'s figure grown by its prices', () => {
    const stress = { ...base, incomeShape: 'level', incomeSteps: [{ fromAge: base.shapeAgeNow, amount: 32858 }], baseSalary: 32858 };
    delete stress.targetSchedule;
    const settings = seedDecisionFromStress(stress);
    const ctx = wizardDataFrom('2027-05', { settings, stressSettings: stress, existingConfig: defaultTaxYearConfig(), allTaxYears: { '26/27': { ...defaultTaxYearConfig(), confirmedSalary: 33000, cpi: 0.03 } }, statePensionInfo: { amount: 0 }, now: new Date(2027, 4, 6, 12) });
    expect(ctx.suggestionSource).toBe('chain');
    expect(ctx.suggestedSalary).toBe(33990);
  });
});
