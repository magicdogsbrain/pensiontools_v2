/**
 * One pension today (7.12.0, src/services/PensionToday.js): the lock's saving path starts from the same pension every
 * screen reads, in both views. Every person and figure here is made up.
 */
import { describe, it, expect, vi } from 'vitest';

vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { pensionTodayOf, pathPensionOf } from '../src/services/PensionToday.js';
import { runForDocument, savingPathFor } from '../src/answers/plan/lastsRun.js';
import { saverInputsOf } from '../src/answers/plan/saverInputs.js';

const NOW = new Date(2026, 10, 16, 12);
const TODAY = '2026-11-16';

/** Alex, 57, stops at 60: typed £410,000 on Stress tester → Settings (205,000 + 164,000 + 41,000), nothing on Accumulation. */
const alex = () => ({
  id: 'alex', planDetails: { name: 'Alex' }, isActive: true,
  stressTool: { settings: { configured: true, equityMin: 205000, bondMin: 164000, cashTarget: 41000, baseSalary: 26000, isaBalance: 0,
    currentAge: 57, currentAgeAsOf: TODAY, retired: false, retireAge: 60, duration: 35 } },
  decisionTool: { settings: { locked: false }, history: [], taxYears: {} },
  accumulationTool: { settings: { netMonthly: 400, schemeType: 'ras' }, history: [] }
});

describe('the pension today a lock draws from', () => {
  it('Alex: the plan\'s pension total, read once', () => {
    expect(pensionTodayOf(alex(), { now: NOW })).toMatchObject({ value: 205000 + 164000 + 41000, from: 'plan' });
    expect(pathPensionOf(alex(), { now: NOW })).toEqual({ potNow: 410000, potSource: 'plan' });
    const read = saverInputsOf(alex(), { today: TODAY });
    expect(read.ok).toBe(true);
  });

  it('the lock starts Alex\'s saving path at £410,000 (before: no pot on record); both views lock through the one run (step F5)', () => {
    const plan = alex();
    const p = savingPathFor({ settings: plan.stressTool.settings, accumulation: plan.accumulationTool.settings, now: NOW, plan });
    expect(p.potNow).toBe(410000);
    expect(p.potSource).toBe('plan');
    expect(p.path.length).toBeGreaterThan(0);
  });

  it('the simple view\'s lock draws the same path', async () => {
    const plan = alex();
    const run = runForDocument(plan, { today: TODAY });
    expect(run.savingPath.potNow).toBe(410000);
    expect(run.savingPath.potSource).toBe('plan');
  });

  it('Pat: the pension lines under What you hold win over a pot saved earlier', () => {
    const plan = alex();
    plan.stressTool.settings.configured = false;
    plan.accumulationTool.settings.potNow = 40000;
    plan.holdings = { lines: [{ ticker: 'VWRL', value: 30000, wrapper: 'SIPP' }, { ticker: 'VAGP', value: 15000, wrapper: 'SIPP' }], updatedAt: '2026-11-01' };
    expect(pensionTodayOf(plan, { now: NOW })).toMatchObject({ value: 30000 + 15000, from: 'holdings' });
    const p = savingPathFor({ settings: plan.stressTool.settings, accumulation: plan.accumulationTool.settings, holdings: plan.holdings, now: NOW, plan });
    expect(p.potNow).toBe(45000);
    expect(p.potSource).toBe('holdings');
  });

  it('nothing known: the path records the gap, as before', () => {
    const plan = alex();
    plan.stressTool.settings.configured = false;
    expect(pathPensionOf(plan, { now: NOW })).toBeNull();
    const p = savingPathFor({ settings: plan.stressTool.settings, accumulation: plan.accumulationTool.settings, now: NOW, plan });
    expect(p.potNow).toBeNull();
  });
});
