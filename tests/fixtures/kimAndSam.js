/**
 * Kim and Sam: a fictional couple, made up for the household tests (7.12.0). Not a test file.
 *
 *   KIM_AND_SAM_TODAY            '2026-11-16'
 *   kimAndSam({ link })          { kim, sam }: two saved plans, raw (as stored), fresh copies each call
 *   kimSettings(), samSettings() the two plans' Stress settings alone (fresh copies), for the services that take settings
 *
 * - Kim, 66, retired. Pension £280,000, ISA £40,000, a final-salary pension of £6,000 a year, a State Pension of £221.20 a
 *   week (£11,502.40 a year) already paid. Spends £28,000 a year before tax. The plan runs to 95 (29 years).
 * - Sam, 61, working. Salary £38,000, pension £150,000; pays £300 a month (£375 with tax relief) and the employer £200.
 *   Stops at 63. State Pension £11,502.40 a year from 67. Spends £16,000 a year before tax. The plan runs to 95 (32 years).
 *   Its stored pot at the stop is the projection the full view saved for 63 (£169,898, source 'accumulation').
 * - The link is on Sam's plan only (link 'sam', the default): household.partnerScenarioId = Kim's id. 'kim' puts it on
 *   Kim's only, 'both' on both, 'none' on neither.
 *
 * The plans are made from the corpus's couple fixtures (09 and 10, themselves fictional) for every key the planner saves,
 * with every figure above written over them.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const KIM_AND_SAM_TODAY = '2026-11-16';
export const KIM_ID = 'KimPlan0001';
export const SAM_ID = 'SamPlan0002';

const DIR = join(process.cwd(), 'tests', 'fixtures', 'plans');
const raw = (name) => JSON.parse(readFileSync(join(DIR, name + '.json'), 'utf8'));

export function kimSettings() {
  const s = raw('09-couple-a').stressTool.settings;
  return {
    ...s,
    currentAge: 66, currentAgeAsOf: KIM_AND_SAM_TODAY, shapeAgeNow: 66, duration: 29,
    retired: true, retireAge: null, stoppedWork: '2026-04', firstTaxYear: 2026, legacyFirstTaxYear: 2026,
    // the pension £280,000 in the Pots & Valves engine's three parts; the ISA beside it
    equityMin: 180000, bondMin: 70000, cashTarget: 30000, isaBalance: 40000,
    baseSalary: 28000, incomeShape: 'flat', incomeSteps: [], targetSchedule: null, spendingProfile: 'flat',
    dbAmount: 6000, dbStartYear: 0, dbIndexation: 'lpi5',
    spStartDate: '6 April 2026', spWeeklyAmount: 221.2, statePension: 11502.4,
    other: 0, potAtRetirement: null, strategyId: 'pots-and-valves'
  };
}

export function samSettings() {
  const s = raw('10-couple-b').stressTool.settings;
  return {
    ...s,
    currentAge: 61, currentAgeAsOf: KIM_AND_SAM_TODAY, shapeAgeNow: 63, duration: 32,
    retired: false, retireAge: 63, firstTaxYear: 2028, legacyFirstTaxYear: 2028,
    equityMin: 100000, bondMin: 40000, cashTarget: 10000, isaBalance: 0,
    baseSalary: 16000, incomeShape: 'flat', incomeSteps: [], targetSchedule: null, spendingProfile: 'flat',
    dbAmount: 0, dbStartYear: 0,
    spStartDate: '16 November 2032', spWeeklyAmount: 221.2, statePension: 11502.4,
    other: 0, potAtRetirement: { sipp: 169898, isa: 0, source: 'accumulation' }, strategyId: 'pots-and-valves'
  };
}

export function kimAndSam({ link = 'sam' } = {}) {
  const kim = raw('09-couple-a'), sam = raw('10-couple-b');
  kim.id = KIM_ID; kim.planDetails = { name: 'Kim', description: 'Retired' }; kim.isActive = true;
  sam.id = SAM_ID; sam.planDetails = { name: 'Sam', description: 'Working to 63' }; sam.isActive = false;
  kim.stressTool.settings = kimSettings();
  sam.stressTool.settings = samSettings();
  sam.accumulationTool = { settings: { currentAge: 61, employerMonthly: 200, escalationPct: 0, netMonthly: 300, potNow: 150000, retirementAge: 63, salary: 38000, schemeType: 'ras' } };
  for (const [p, age] of [[kim, 66], [sam, 61]]) {
    p.budgetTool.settings = { ...p.budgetTool.settings, currentAge: age, currentAgeAsOf: KIM_AND_SAM_TODAY };
    p.decisionTool = { history: [], settings: { ...p.decisionTool.settings, locked: false, firstTaxYear: p.stressTool.settings.firstTaxYear } };
    delete p.household;
  }
  if (link === 'sam' || link === 'both') sam.household = { partnerScenarioId: KIM_ID };
  if (link === 'kim' || link === 'both') kim.household = { partnerScenarioId: SAM_ID };
  return { kim, sam };
}
