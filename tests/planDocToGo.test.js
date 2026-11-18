/**
 * One count of the time to go (the second walk: walker 9's, walker 4's and walker 10's medium findings). A locked saver's
 * header chip said "Saving · 5 years to go" (LifeStage counts to the month work stops), while the plan document under it
 * said "4 years to go — the plan starts in 2031/32" (it counted to 6 April of the first tax year) and, three lines lower,
 * "You retire in November 2031 at 63, 5 years away". The document now counts to the month work stops, as the chip does,
 * and says both facts: the stop and the plan's first tax year. Fictional Jo, 58 on 17 November 2026, stops at 63.
 */
import { describe, it, expect } from 'vitest';
import { buildPlanDocument, whereAmI } from '../src/services/PlanDocument.js';
import { whereAmIHtml } from '../src/ui/components/PlanDocumentView.js';
import { deriveStage } from '../src/services/LifeStage.js';

const NOW = new Date(2026, 10, 17, 12);
const settings = { currentAge: 58, currentAgeAsOf: '2026-11-17', retired: false, retireAge: 63, equityMin: 96000, bondMin: 18000, cashTarget: 6000,
  baseSalary: 29858, duration: 37, incomeShape: 'phases', incomeSteps: [{ fromAge: 63, amount: 29858 }] };
const accumulation = { currentAge: 58, retirementAge: 63, salary: 40000, potNow: 120000, netMonthly: 480, schemeType: 'ras', employerMonthly: 0 };

describe('the plan document counts the time to go as the header chip does', () => {
  const doc = buildPlanDocument({ planName: 'Jo', settings, p: null, r: null, accumulation, lockedAt: NOW.toISOString(), now: NOW });
  it('to the month work stops: November 2031 is 60 months, 5 years (it was 53 months to 6 April 2031, "4 years")', () => {
    const w = whereAmI(doc, { today: NOW });
    expect(w.saving.monthsToGo).toBe(60);   // by hand: (2031 − 2026) × 12 + (November − November) = 60
    expect(w.saving.stopMonth).toBe('2031-11');
  });
  it('the strip says the stop and the first tax year, with the chip\'s count', () => {
    const html = whereAmIHtml(whereAmI(doc, { today: NOW }));
    expect(html).toContain('<strong>5 years to go</strong>: you stop work in November 2031; the plan’s first tax year is 2031/32.');
    const scenario = { stressTool: { settings: { ...settings, firstTaxYear: 2031 } }, decisionTool: { settings: { locked: true, lockedAt: NOW.toISOString() }, history: [] }, planDocument: doc };
    expect(deriveStage(scenario, NOW).chip).toBe('5 years to go');
  });
  it('a document saved before it kept the stop month: counted to the first tax year, as before', () => {
    const old = { ...doc, timing: { ...doc.timing, startMonth: undefined } };
    const w = whereAmI(old, { today: NOW });
    expect(w.saving.monthsToGo).toBe(53);   // by hand: 17 Nov 2026 to 6 Apr 2031 is 4 years and about 4.6 months, 53 to the nearest
    expect(whereAmIHtml(w)).toContain('<strong>4 years to go</strong> — the plan starts in 2031/32.');
  });
});
