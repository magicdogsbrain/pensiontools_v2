/**
 * Step F6 (lead4.md D2, D20): the full view's setup wizard makes a plan's timing through the one timing seed a plan made from
 * an answer gets (PlanFromSeed.timingSettingsOf): the age given, dated today; stopping at the age (or month) given, else
 * already stopped; "pick up from here" starts this tax year. Nothing is stored that nobody gave: no age typed, no age stored,
 * and no `configured` (ages are not figures). Fictional people: Alex, Sam, Jo, Pat.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { wizardSettingsOf } from '../../src/ui/planStartUi.js';
import { timingSettingsOf } from '../../src/services/PlanFromSeed.js';

const NOW = new Date(2026, 9, 2, 12);   // 2 October 2026: tax year 2026/27

describe('the setup wizard makes its timing through the one timing seed (step F6, D2)', () => {
  it('Alex, 58, stopping at 62: the same timing a plan from an answer gets, and no `configured`', () => {
    const { stressSettings: S, decisionSettings: D } = wizardSettingsOf({ currentAge: '58', retirementAge: '62' }, NOW);
    const { configured, ...seed } = timingSettingsOf({}, { ageToday: 58, later: true, ageAtStop: 62 }, '2026-10-02');
    expect(configured).toBe(true);
    expect(S).not.toHaveProperty('configured');
    expect(S).toMatchObject(seed);
    expect(S).toMatchObject({ currentAge: 58, currentAgeAsOf: '2026-10-02', retired: false, retireAge: 62, duration: 33 });   // to 95
    expect(D).toEqual({ duration: 33, firstTaxYear: seed.firstTaxYear });
  });

  it('Sam, 63, stopped in October 2024: year 0 is 2024/25, the plan runs three years longer and still ends at 95', () => {
    const { stressSettings: S, decisionSettings: D } = wizardSettingsOf({ currentAge: '63', retirementAge: '61', retired: true, stopMonth: '2024-10' }, NOW);
    expect(S).toMatchObject({ currentAge: 63, retired: true, retireAge: null, stoppedWork: '2024-10', firstTaxYear: 2024, duration: 32 + 3 });
    expect(D.firstTaxYear).toBe(2024);
  });

  it('Pat, 66, "pick up from here" after stopping in 2024: the plan starts this tax year and keeps the month', () => {
    const { stressSettings: S } = wizardSettingsOf({ currentAge: '66', retirementAge: '64', retired: true, pickUp: true, stopMonth: '2024-10' }, NOW);
    expect(S).toMatchObject({ currentAge: 66, retired: true, stoppedWork: '2024-10', firstTaxYear: 2026, duration: 29 });
  });

  it('Jo, stopping in June 2029: the stop month is kept and the stop age is the age reached by then', () => {
    const { stressSettings: S } = wizardSettingsOf({ currentAge: '58', retirementAge: '60', stopMonth: '2029-06' }, NOW);
    expect(S).toMatchObject({ currentAge: 58, retired: false, retireAge: 60, stoppedWork: '2029-06' });
  });

  it('no age typed: no age, no "already retired" and no start are stored (never the stop age taken as the age today)', () => {
    const { stressSettings: S, decisionSettings: D } = wizardSettingsOf({ retirementAge: '62' }, NOW);
    for (const k of ['currentAge', 'currentAgeAsOf', 'retired', 'retireAge', 'firstTaxYear', 'shapeAgeNow', 'configured']) expect(S, k).not.toHaveProperty(k);
    expect(D).not.toHaveProperty('firstTaxYear');
  });

  it('index.html hands the wizard\'s answers to wizardSettingsOf on the one clock, and derives no timing of its own', () => {
    const html = readFileSync('index.html', 'utf8');
    const start = html.indexOf('async function handleWizardComplete(');
    const body = html.slice(start, html.indexOf('await createNewScenario(', start));
    expect(body).toContain('wizardSettingsOf(wizardData, todayOf())');
    expect(body).not.toContain('deriveTiming(');
    expect(body).not.toContain('wizardStop(');
  });
});
