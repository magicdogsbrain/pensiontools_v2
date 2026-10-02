/**
 * 6.20.2 — a locked plan's settings cannot be changed by ANY path (research/v7/square-one-audit.md §3, §5 item 1).
 *
 * Until 6.20.2 only the two settings forms' own Save buttons checked the lock. The Budget's "Use as the start of my
 * income shape", the walk-through's "Set as my plan's target" and the optimiser's "Apply this split" wrote a locked
 * plan's Stress settings (and so did "Copy from Decision", the add-a-tool wizard and the Decision tool's Reset). The
 * check now sits in the save functions themselves.
 *
 * Every button that writes settings is pressed here AS ITS HANDLER WRITES — through the real repositories, in guest
 * mode (FirestoreService keeps a guest's plans in sessionStorage) — on two locked fixtures from the corpus: a saver
 * locked before retiring (05) and a retired ladder plan in its run-up with recorded months (03). Afterwards the stored
 * Stress and Decision settings, the Decision checksum, the strategy, the plan document and its archive, and the plan of
 * record are byte-identical. The named bookkeeping writes still go through.
 *
 * The review of 6.20.2 added three cases: the same buttons in a tab that loaded the plan BEFORE it was locked
 * elsewhere (the first month recorded on a phone, a desktop tab left open), the Monthly Entry's "how often" picker
 * (it is part of the settings checksum), and the Budget's age, which is folded into the Stress copy in memory and must
 * never reach the stored plan by riding along with an unrelated save or the sign-in hand-off.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { enterGuestMode, leaveGuestMode } from '../src/firebase/AuthService.js';
import { clearGuestData, guestSnapshot } from '../src/firebase/FirestoreService.js';
import {
  getActiveScenarioAsync, invalidateScenarioCache, saveActiveStressSettings, saveActiveDecisionSettings, setActiveStrategy,
  seedStressFromDecision, seedDecisionFromStress, getDefaultDecisionSettings, saveActivePlanDocument, archivePlanDocument,
  saveActiveHoldings, saveActiveAccumulationHistory, saveActiveJourney, activePlanLocked
} from '../src/storage/ScenarioRepository.js';
import {
  getStressSettingsAsync, saveStressSettings, updateStressSetting, saveStressDB, loadStressDBAsync, resetStressSettings,
  invalidateStressCache, timingPinSettled
} from '../src/storage/StressRepository.js';
import {
  getDecisionSettingsAsync, saveDecisionSettings, saveDecisionDB, loadDecisionDBAsync, wipeAllDecisionData, saveTaxYearConfig,
  addHistoryRecord, recalculateIsaSavingsUsed, decisionSettingsChecksum, invalidateCache as invalidateDecisionCache
} from '../src/storage/DecisionRepository.js';
import { unlockPlan, planDependents } from '../src/services/PlanLock.js';
import { budgetIncomeShapePatch } from '../src/services/BudgetToPlan.js';
import { PLAN_LOCKED_CODE, PLAN_LOCKED_MESSAGE } from '../src/services/LockedPlanGuard.js';
import { defaultBudget } from '../src/services/BudgetModel.js';
import { TIMING_PIN_KEYS } from '../src/services/PlanTiming.js';

const GUEST_KEY = 'pt_guest_scenarios';
const fixture = (name) => JSON.parse(readFileSync('tests/fixtures/plans/' + name + '.json', 'utf8'));
const fresh = () => { invalidateScenarioCache(); invalidateStressCache(); invalidateDecisionCache(); };
const stored = () => JSON.parse(sessionStorage.getItem(GUEST_KEY) || '[]').find((p) => p.isActive);

/** The parts of a locked plan no button may move, as text. */
function frozenParts() {
  const p = stored();
  return {
    stress: JSON.stringify(p.stressTool && p.stressTool.settings),
    decision: JSON.stringify(p.decisionTool.settings),
    checksum: decisionSettingsChecksum(p.decisionTool.settings),
    strategy: JSON.stringify(p.strategy),
    planDocument: JSON.stringify(p.planDocument),
    planDocumentArchive: JSON.stringify(p.planDocumentArchive),
    planOfRecord: JSON.stringify(p.decisionTool.planOfRecord)
  };
}

/** Open the plan as the app does on load (the schema chain, the timing pin), then hand back what is stored. */
async function openLocked(name, patch = {}) {
  enterGuestMode(); clearGuestData();
  sessionStorage.setItem(GUEST_KEY, JSON.stringify([{ ...fixture(name), isActive: true, ...patch }]));
  fresh();
  await getActiveScenarioAsync(); await getStressSettingsAsync(); await getDecisionSettingsAsync(); await timingPinSettled();
  expect(stored().decisionTool.settings.locked).toBe(true);
  return frozenParts();
}

afterEach(() => { leaveGuestMode(); clearGuestData(); fresh(); });

const BUDGET = { ...defaultBudget(48, 60), lines: [
  { id: 'a', label: 'Groceries & household', annual: 7200, tier: 'essential' },
  { id: 'b', label: 'Holidays', annual: 9000, tier: 'discretionary' }
] };

/**
 * Every button that writes Stress or Decision settings, with the writes its handler makes (index.html), in order.
 * Each write must be refused; the ones marked `dropped` are tax-year saves, which go ahead but never carry a change to
 * the settings.
 */
const BUTTONS = {
  'Budget → "Use as the start of my income shape"': async () => {
    const st = await getStressSettingsAsync();
    const { patch } = budgetIncomeShapePatch(BUDGET, st, 39000, '2026-10-02');
    return [() => saveStressSettings(patch), () => saveDecisionSettings({ baseSalary: 39000 })];
  },
  'Budget walk-through → "Set as my plan\'s target (Stress + Decision) & finish"': async () => {
    const st = await getStressSettingsAsync();
    const { patch } = budgetIncomeShapePatch(BUDGET, st, 41000, '2026-10-02');
    return [() => saveStressSettings(patch), () => saveDecisionSettings({ baseSalary: 41000 })];
  },
  'Optimiser → "Apply this split to your Settings"': async () => [() => saveStressSettings({ equityMin: 111000, bondMin: 99000, cashTarget: 12000 })],
  'Stress tester → Settings → "Save Settings"': async () => [
    () => setActiveStrategy('floor-and-flex', {}),
    () => saveDecisionSettings({ baseSalary: 45000, targetSchedule: null }),
    () => saveStressSettings({ configured: true, baseSalary: 45000, equityMin: 1, strategyId: 'floor-and-flex' })
  ],
  'Stress tester → Settings → "Reset to Defaults"': async () => [() => resetStressSettings()],
  'Stress tester → Settings → "Copy from Decision"': async () => {
    const d = await getDecisionSettingsAsync(), s = await getStressSettingsAsync();
    return [() => saveStressSettings(seedStressFromDecision({ ...d, baseSalary: 1 }, s))];
  },
  'Decision tool → Settings → "Save Settings"': async () => [() => saveDecisionSettings({ configured: true, baseSalary: 46000, locked: true })],
  'Decision tool → Monthly Entry → how often months are recorded (window.setCadence)': async () => [() => saveDecisionSettings({ cadence: 'quarterly' })],
  'Decision tool → Settings → "Reset to Defaults"': async () => [() => saveDecisionSettings({ equityMin: 250000, bondMin: 200000, cashTarget: 50000, duration: 35, baseSalary: 30000, protectionFactor: 20, recoveryBuffer: 15000, consecutiveLimit: 3 })],
  'Decision tool → Settings → "Copy from Stress tester" (target, then everything)': async () => {
    const s = await getStressSettingsAsync(), d = await getDecisionSettingsAsync();
    return [() => saveDecisionSettings({ baseSalary: s.baseSalary + 1 }), () => saveDecisionSettings(seedDecisionFromStress({ ...s, equityMin: 2 }, d))];
  },
  'Plan menu → add a tool (its wizard)': async () => [
    () => saveStressSettings({ equityMin: 3, bondMin: 4, cashTarget: 5, isaBalance: 0, duration: 30, baseSalary: 20000, other: 0, taxMode: 'inflates', equityGlideEnabled: false }),
    () => saveDecisionSettings({ equityMin: 3, bondMin: 4, cashTarget: 5, duration: 30, baseSalary: 20000 })
  ],
  'Strategies → "Use this as my plan\'s strategy"': async () => [
    () => setActiveStrategy('full-il-gilt', {}),
    () => saveStressSettings({ strategyId: 'full-il-gilt', strategyParams: { cashYears: 2 } })
  ],
  'Account → "Reset" (after every plan is deleted, the open plan\'s settings are reset)': async () => [() => wipeAllDecisionData(), () => resetStressSettings()],
  'Any other caller: one setting, the whole store, the scenario level': async () => {
    const db = await loadStressDBAsync();
    return [
      () => updateStressSetting('baseSalary', 1),
      () => saveStressDB({ ...db, settings: { ...db.settings, baseSalary: 2 } }),
      () => saveActiveStressSettings({ baseSalary: 3 }),
      () => saveActiveDecisionSettings({ ...getDefaultDecisionSettings(), locked: false })
    ];
  }
};

for (const name of ['05-saver-committed', '03-gilt-ladder-runup']) {
  describe('a locked plan (' + name + '): every button that writes settings is refused, in plain words', () => {
    for (const [button, writes] of Object.entries(BUTTONS)) {
      it(button + ' — refused; nothing stored moves, and nothing in memory either', async () => {
        const before = await openLocked(name);
        const memStress = JSON.stringify(await getStressSettingsAsync()), memDecision = JSON.stringify(await getDecisionSettingsAsync());
        const history = JSON.stringify(stored().decisionTool.history), taxYears = JSON.stringify(stored().decisionTool.taxYears);
        for (const write of await writes()) {
          await expect(write()).rejects.toMatchObject({ code: PLAN_LOCKED_CODE, message: PLAN_LOCKED_MESSAGE });
        }
        expect(frozenParts()).toEqual(before);
        expect(JSON.stringify(stored().decisionTool.history)).toBe(history);
        expect(JSON.stringify(stored().decisionTool.taxYears)).toBe(taxYears);
        // The copies the app computes from are not left holding the refused figures.
        expect(JSON.stringify(await getStressSettingsAsync())).toBe(memStress);
        expect(JSON.stringify(await getDecisionSettingsAsync())).toBe(memDecision);
      });
    }

    it('all of them, one after another: byte-identical settings, checksum and plan document', async () => {
      const before = await openLocked(name);
      for (const writes of Object.values(BUTTONS)) for (const write of await writes()) await write().catch(() => {});
      expect(frozenParts()).toEqual(before);
      fresh();   // and after a reload, as stored
      expect(decisionSettingsChecksum(await getDecisionSettingsAsync())).toBe(before.checksum);
    });

    it('a tax-year save never carries a change made to the settings in memory', async () => {
      const before = await openLocked(name);
      const db = await loadDecisionDBAsync();
      await saveDecisionDB({ ...db, settings: { ...db.settings, baseSalary: 1, equityMin: 2 }, taxYears: { ...db.taxYears, '30/31': { cpi: 0.03 } } });
      expect(frozenParts()).toEqual(before);
      expect(stored().decisionTool.taxYears['30/31']).toEqual({ cpi: 0.03 });   // the tax year itself is saved
    });
  });
}

describe('a locked plan: the named bookkeeping writes still go through', () => {
  it('a month recorded and its tax year saved: history and tax years move, the settings and checksum do not', async () => {
    const before = await openLocked('03-gilt-ladder-runup');
    await addHistoryRecord({ date: '2027-02', taxYear: '26/27', isa: 0, sipp: 2000, settingsChecksum: before.checksum });
    await recalculateIsaSavingsUsed('26/27');
    await saveTaxYearConfig('27/28', { cpi: 0.031 });
    expect(stored().decisionTool.history.map((h) => h.date)).toContain('2027-02');
    expect(stored().decisionTool.taxYears['27/28'].cpi).toBe(0.031);
    expect(frozenParts()).toEqual(before);
  });

  it('the plan document refreshed and archived; holdings, the pot record and the journey saved', async () => {
    const before = await openLocked('05-saver-committed');
    await archivePlanDocument();
    await saveActivePlanDocument({ ...JSON.parse(before.planDocument), note: 'document refreshed' });
    await saveActiveHoldings({ lines: [{ wrapper: 'SIPP', ticker: 'VWRP', name: 'World', value: 1000 }] });
    await saveActiveAccumulationHistory([{ date: '2026-10', sipp: 300000, isa: 0, gia: 0, total: 300000 }]);
    await saveActiveJourney([{ stage: 'committed-saving', label: 'x', at: '2026-10-02T00:00:00.000Z' }]);
    const after = frozenParts();
    expect(after.planDocument).not.toBe(before.planDocument);
    expect(JSON.parse(after.planDocumentArchive).length).toBe(1);
    expect({ ...after, planDocument: null, planDocumentArchive: null }).toEqual({ ...before, planDocument: null, planDocumentArchive: null });
    expect(stored().holdings.lines.length).toBe(1);
  });

  it('the plan\'s start is pinned on load (6.13.5) — those keys only', async () => {
    const strip = (s) => { const o = { ...s }; for (const k of TIMING_PIN_KEYS) delete o[k]; return o; };
    await openLocked('03-gilt-ladder-runup');
    const asOpened = stored().stressTool.settings;   // the same plan with its start already saved: nothing to pin
    const plan = fixture('03-gilt-ladder-runup');
    const { firstTaxYear, retired, ...noPin } = plan.stressTool.settings;
    enterGuestMode(); clearGuestData();
    sessionStorage.setItem(GUEST_KEY, JSON.stringify([{ ...plan, isActive: true, stressTool: { settings: noPin } }]));
    fresh();
    await getStressSettingsAsync(); await timingPinSettled();
    const saved = stored().stressTool.settings;
    expect(typeof saved.retired).toBe('boolean');   // written by the first load, no Save button involved
    expect(strip(saved)).toEqual(strip(asOpened));
    expect(stored().decisionTool.settings.locked).toBe(true);
  });

  it('the old "Declining with age" rewrite of the Decision copy is saved with the next tax-year save, as before 6.20.2', async () => {
    const plan = fixture('03-gilt-ladder-runup');
    const ds = { ...plan.decisionTool.settings, spendingProfile: 'declining', targetSchedule: [40000, 40000, 40000, 40000, 40000] };
    enterGuestMode(); clearGuestData();
    sessionStorage.setItem(GUEST_KEY, JSON.stringify([{ ...plan, isActive: true, decisionTool: { ...plan.decisionTool, settings: ds } }]));
    fresh();
    await saveTaxYearConfig('27/28', { cpi: 0.03 });
    const saved = stored().decisionTool.settings;
    expect(saved.spendingProfile).toBe('flat');
    expect(saved.spendingMigratedFrom).toBe('declining');
    expect(saved.locked).toBe(true);
    expect(saved.baseSalary).toBe(ds.baseSalary);
  });

  it('unlock goes through; then the same buttons write again (the plan is a draft)', async () => {
    await openLocked('05-saver-committed');
    expect(await activePlanLocked()).toBe(true);
    await unlockPlan();
    expect(await activePlanLocked()).toBe(false);
    expect(stored().decisionTool.settings.locked).toBe(false);
    await saveStressSettings({ equityMin: 111000 });
    await saveDecisionSettings({ baseSalary: 39000 });
    expect(stored().stressTool.settings.equityMin).toBe(111000);
    expect(stored().decisionTool.settings.baseSalary).toBe(39000);
  });

  it('an unlocked plan is untouched by the guard: a draft still saves every key', async () => {
    const plan = fixture('02-pnv-draft');
    enterGuestMode(); clearGuestData();
    sessionStorage.setItem(GUEST_KEY, JSON.stringify([{ ...plan, isActive: true }]));
    fresh();
    expect(await activePlanLocked()).toBe(false);
    await saveStressSettings({ baseSalary: 12345 });
    await setActiveStrategy('floor-and-flex', {});
    await saveDecisionSettings({ baseSalary: 12345 });
    expect(stored().stressTool.settings.baseSalary).toBe(12345);
    expect(stored().decisionTool.settings.baseSalary).toBe(12345);
    expect(stored().strategy.id).toBe('floor-and-flex');
  });
});

describe('a locked plan: how often months are recorded is part of the plan (review of 6.20.2)', () => {
  // The cadence is inside the Decision settings, so it is in the settings checksum. On a plan that has been unlocked
  // before, a changed checksum relabels every month already recorded as "recorded under previous settings".
  it('the picker is refused on a plan unlocked once before: no record is relabelled, the checksum does not move', async () => {
    const plan = fixture('03-gilt-ladder-runup');
    plan.decisionTool.settings.unlockCount = 1;
    plan.decisionTool.settings.unlockedAt = '2026-07-01T00:00:00.000Z';
    const sum = decisionSettingsChecksum(plan.decisionTool.settings);
    plan.decisionTool.history = plan.decisionTool.history.map((h) => ({ ...h, settingsChecksum: sum }));
    const before = await openLocked('03-gilt-ladder-runup', { decisionTool: plan.decisionTool });
    const dep = await planDependents();
    expect(dep.entriesUnderCurrent).toBe(3);
    expect(dep.entriesUnderPrevious).toBe(0);
    await expect(saveDecisionSettings({ cadence: 'quarterly' })).rejects.toMatchObject({ code: PLAN_LOCKED_CODE, message: PLAN_LOCKED_MESSAGE });
    expect(frozenParts()).toEqual(before);
    expect(before.checksum).toBe(sum);
    const after = await planDependents();
    expect(after.entriesUnderCurrent).toBe(3);
    expect(after.entriesUnderPrevious).toBe(0);
    expect((await getDecisionSettingsAsync()).cadence).toBe(plan.decisionTool.settings.cadence);   // the copy in memory either
  });
  it('a draft still changes it freely', async () => {
    enterGuestMode(); clearGuestData();
    sessionStorage.setItem(GUEST_KEY, JSON.stringify([{ ...fixture('02-pnv-draft'), isActive: true }]));
    fresh();
    await saveDecisionSettings({ cadence: 'annual' });
    expect(stored().decisionTool.settings.cadence).toBe('annual');
  });
});

/**
 * "Another device" locks the plan: the stored copy changes, this tab's loaded copy does not. Exactly what the first
 * recorded month does (PlanLock.lockPlanIfNeeded + DecisionService): the flag, when and why, and the month itself.
 */
function lockElsewhere() {
  const list = JSON.parse(sessionStorage.getItem(GUEST_KEY));
  const p = list.find((x) => x.isActive);
  p.decisionTool.settings = { ...p.decisionTool.settings, locked: true, lockedAt: '2026-10-02T07:30:00.000Z', lockedBy: 'first monthly entry' };
  p.decisionTool.history = [...(p.decisionTool.history || []), { date: '2026-10', taxYear: '26/27', sipp: 900000, isa: 0, settingsChecksum: decisionSettingsChecksum(p.decisionTool.settings) }];
  p.decisionTool.taxYears = { ...(p.decisionTool.taxYears || {}), '26/27': { yearSetupComplete: true, cpi: 0.03 } };
  clearGuestData();   // the stored copy as the other device left it (the tab's own copies are untouched)
  sessionStorage.setItem(GUEST_KEY, JSON.stringify(list));
}

/** Load a DRAFT as the app does, then lock it elsewhere. Returns the frozen parts as the other device left them. */
async function openThenLockedElsewhere(name = '02-pnv-draft') {
  enterGuestMode(); clearGuestData();
  sessionStorage.setItem(GUEST_KEY, JSON.stringify([{ ...fixture(name), isActive: true }]));
  fresh();
  await getActiveScenarioAsync(); await getStressSettingsAsync(); await getDecisionSettingsAsync(); await timingPinSettled();
  expect(await activePlanLocked()).toBe(false);
  lockElsewhere();
  expect(await activePlanLocked()).toBe(false);   // this tab has not seen it
  return frozenParts();
}

describe('a tab that loaded the plan before it was locked elsewhere (review of 6.20.2)', () => {
  for (const [button, writes] of Object.entries(BUTTONS)) {
    it(button + ' — refused by the stored plan; nothing stored moves; the tab then knows the plan is locked', async () => {
      const before = await openThenLockedElsewhere();
      const history = JSON.stringify(stored().decisionTool.history), taxYears = JSON.stringify(stored().decisionTool.taxYears);
      for (const write of await writes()) {
        await expect(write()).rejects.toMatchObject({ code: PLAN_LOCKED_CODE, message: PLAN_LOCKED_MESSAGE });
      }
      expect(frozenParts()).toEqual(before);
      expect(JSON.stringify(stored().decisionTool.history)).toBe(history);
      expect(JSON.stringify(stored().decisionTool.taxYears)).toBe(taxYears);
      // the refusal made the tab drop its out-of-date copies: it now reads the plan as stored
      expect(await activePlanLocked()).toBe(true);
      expect((await getDecisionSettingsAsync()).locked).toBe(true);
    });
  }

  it('a tax-year save from that tab neither lifts the lock nor writes its old tax years over the new ones', async () => {
    const before = await openThenLockedElsewhere();
    const taxYears = JSON.stringify(stored().decisionTool.taxYears);
    await expect(saveTaxYearConfig('27/28', { cpi: 0.031 })).rejects.toMatchObject({ code: PLAN_LOCKED_CODE });
    expect(frozenParts()).toEqual(before);
    expect(stored().decisionTool.settings.locked).toBe(true);
    expect(JSON.stringify(stored().decisionTool.taxYears)).toBe(taxYears);
    // tried again, now that the tab has the plan as stored: a tax year is bookkeeping, and it is saved
    await saveTaxYearConfig('27/28', { cpi: 0.031 });
    expect(stored().decisionTool.taxYears['27/28'].cpi).toBe(0.031);
    expect(stored().decisionTool.taxYears['26/27']).toEqual({ yearSetupComplete: true, cpi: 0.03 });
    expect(frozenParts()).toEqual(before);
  });

  it('every button, one after another: byte-identical settings, checksum, strategy and plan document', async () => {
    const before = await openThenLockedElsewhere();
    for (const writes of Object.values(BUTTONS)) for (const write of await writes()) await write().catch(() => {});
    expect(frozenParts()).toEqual(before);
  });

  it('the bookkeeping the stored plan allows still goes: the unlock, then the draft saves again', async () => {
    await openThenLockedElsewhere();
    await saveStressSettings({ equityMin: 1 }).catch(() => {});   // refused: the tab learns
    await unlockPlan();
    expect(stored().decisionTool.settings.locked).toBe(false);
    expect(stored().decisionTool.settings.unlockCount).toBe(1);
    await saveStressSettings({ equityMin: 111000 });
    expect(stored().stressTool.settings.equityMin).toBe(111000);
  });
});

describe('the Budget\'s age, newer than a locked plan\'s Stress copy, stays the Budget\'s (review of 6.20.2)', () => {
  // On load the Budget's age is folded into the Stress copy in memory (StressRepository.loadStressDBAsync). Until the
  // review a guest's plans were handed out by reference, so that fold reached the stored plan: written by the next
  // unrelated save, and carried into the account by the sign-in hand-off with no save at all.
  const withNewerBudgetAge = () => {
    const plan = fixture('05-saver-committed');
    plan.budgetTool.settings = { ...plan.budgetTool.settings, currentAge: 50, currentAgeAsOf: '2026-09-30', agesSetByUser: true };
    return { budgetTool: plan.budgetTool };
  };
  it('the Stress copy in memory uses it; the stored plan and the hand-off do not get it — after a reload and unrelated saves', async () => {
    const before = await openLocked('05-saver-committed', withNewerBudgetAge());
    expect(JSON.parse(before.stress).currentAge).toBe(48);
    expect((await getStressSettingsAsync()).currentAge).toBe(50);   // the fold itself is unchanged
    await saveActiveJourney([]);
    fresh();
    expect((await getStressSettingsAsync()).currentAge).toBe(50);
    await timingPinSettled();
    await saveActiveHoldings({ lines: [{ wrapper: 'SIPP', ticker: 'VWRP', name: 'World', value: 1000 }] });
    await saveActiveAccumulationHistory([{ date: '2026-10', sipp: 300000, isa: 0, gia: 0, total: 300000 }]);
    expect(frozenParts()).toEqual(before);
    const handOff = guestSnapshot().find((p) => p.isActive);
    expect(JSON.stringify(handOff.stressTool.settings)).toBe(before.stress);
    expect(JSON.stringify(handOff.decisionTool.settings)).toBe(before.decision);
  });
});
