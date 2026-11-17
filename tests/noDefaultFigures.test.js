/**
 * 7.12.0, lead decision 2 (the second walk): no default figure is shown or used as if it were the person's. A plan straight
 * from the full view's wizard showed an income step of £30,000 and a ticked bed-and-ISA nobody chose; "Am I on course?" said
 * "You want £2,210 a month" (the £30,000 default, after tax); "Try a strategy" kept another plan's pot after a switch; and
 * Will it last? ran on figures nobody gave. Fictional: Kim, 66, retired; Sam, 61, saving.
 */
import { describe, it, expect, vi } from 'vitest';

vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { effectiveStressSettings } from '../src/services/PlanReading.js';
import { withoutPotsAsOf } from '../src/services/PlanFromToday.js';
import { getDefaultScenario } from '../src/storage/ScenarioRepository.js';
import { missingFiguresOf, missingWords, bedAndIsaTicked, DRAFT_WORDS } from '../src/ui/draftPlanLine.js';
import { tryFillKeyOf, tryNeedsFill } from '../src/ui/tryBoxes.js';
import { saverInputsOf } from '../src/answers/plan/saverInputs.js';

const NOW = new Date(2026, 10, 17, 12);
const fresh = (name, acc = null) => { const p = getDefaultScenario(name); p.id = name; if (acc) p.accumulationTool = { settings: acc, history: [] }; return p; };

describe('a plan from the full view\'s wizard reads no income nobody gave', () => {
  it('Kim: stored with the default £30,000, read as none, said so; the plan is not changed', () => {
    const plan = fresh('Kim');
    expect(plan.stressTool.settings.baseSalary).toBe(30000);   // the stored default
    const before = JSON.stringify(plan);
    const s = effectiveStressSettings(plan, { now: NOW });
    expect([s.baseSalary, s.incomeSteps, s.targetSchedule, s.incomeNotSet]).toEqual([0, [], null, true]);
    expect(JSON.stringify(plan)).toBe(before);
    expect('incomeNotSet' in withoutPotsAsOf(s)).toBe(false);   // never saved
  });

  it('a plan with figures keeps its own income', () => {
    const plan = fresh('Kim');
    plan.stressTool.settings = { ...plan.stressTool.settings, configured: true, baseSalary: 28000 };
    const s = effectiveStressSettings(plan, { now: NOW });
    expect(s.baseSalary).toBe(28000);
    expect(s.incomeNotSet).toBeUndefined();
  });

  it('Sam (saving, £120,000 typed on the Accumulation tab, no income given): "Am I on course?" has no aim, never "You want £2,210"', () => {
    const plan = fresh('Sam', { currentAge: 61, retirementAge: 63, salary: 38000, potNow: 120000, netMonthly: 300, schemeType: 'ras', employerMonthly: 200, escalationPct: 0, isaMonthly: 0 });
    plan.stressTool.settings = { ...plan.stressTool.settings, currentAge: 61, currentAgeAsOf: '2026-11-17', retired: false, retireAge: 63 };
    expect(saverInputsOf(plan, { today: '2026-11-17' })).toEqual({ ok: false, why: 'noAim' });
  });
});

describe('a test with nothing to run on says what to add', () => {
  it('neither pot nor income, the pot only, the income only, both', () => {
    expect(missingWords({ potsNotSet: true, incomeNotSet: true })).toBe(DRAFT_WORDS.none);
    expect(missingFiguresOf({ equityMin: 120000, incomeNotSet: true, baseSalary: 0 })).toEqual({ pot: false, income: true });
    expect(missingWords({ equityMin: 120000, baseSalary: 0, incomeSteps: [] })).toBe(DRAFT_WORDS.noIncome);
    expect(missingWords({ equityMin: 0, bondMin: 0, cashTarget: 0, baseSalary: 28000 })).toBe(DRAFT_WORDS.noPot);
    expect(missingWords({ equityMin: 150000, bondMin: 120000, cashTarget: 30000, baseSalary: 28000 })).toBe(null);
    // a gilt ladder's pot is its own box (Total in your SIPP); a saver's is the pot when work stops
    expect(missingWords({ strategyParams: { sippTotal: 485000 }, baseSalary: 25000 })).toBe(null);
    expect(missingWords({ potAtRetirement: { sipp: 142720, isa: 0 }, incomeSteps: [{ fromAge: 63, amount: 16000 }] })).toBe(null);
  });
});

describe('bed-and-ISA is ticked only where it moves something', () => {
  it('no taxable account and no lump sum to come: not ticked, whatever was saved', () => {
    expect(bedAndIsaTicked({})).toBe(false);
    expect(bedAndIsaTicked({ bedAndIsa: true, taxableStart: 0 })).toBe(false);
  });
  it('a taxable account: as saved (on unless switched off)', () => {
    expect(bedAndIsaTicked({ taxableStart: 25000 })).toBe(true);
    expect(bedAndIsaTicked({ taxableStart: 25000, bedAndIsa: false })).toBe(false);
    expect(bedAndIsaTicked({ windfalls: [{ year: 3, amount: 50000 }] })).toBe(true);
  });
});

describe('Try a strategy\'s boxes follow the plan open', () => {
  const sam = { equityMin: 60000, bondMin: 48000, cashTarget: 12000, baseSalary: 16000, duration: 32 };
  const kim = { equityMin: 150000, bondMin: 120000, cashTarget: 30000, isaBalance: 40000, baseSalary: 28000, duration: 29 };
  it('another plan: filled again, even over a what-if typed on the first', () => {
    expect(tryNeedsFill(tryFillKeyOf('Sam', sam), tryFillKeyOf('Kim', kim), true)).toBe(true);
  });
  it('the same plan, its figures changed by a save: filled again, unless a what-if was typed', () => {
    const after = { ...sam, equityMin: 70000 };
    expect(tryNeedsFill(tryFillKeyOf('Sam', sam), tryFillKeyOf('Sam', after), false)).toBe(true);
    expect(tryNeedsFill(tryFillKeyOf('Sam', sam), tryFillKeyOf('Sam', after), true)).toBe(false);
  });
  it('nothing changed: left as it is; never filled before: filled', () => {
    expect(tryNeedsFill(tryFillKeyOf('Sam', sam), tryFillKeyOf('Sam', { ...sam }), false)).toBe(false);
    expect(tryNeedsFill(undefined, tryFillKeyOf('Sam', sam), false)).toBe(true);
  });
});
