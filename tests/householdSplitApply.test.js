/**
 * Choosing the split (household-draw-split.md §5 and §7) and one budget for the household (usability audit §5
 * decision 5): "Use this split" writes both plans and can be undone; a LOCKED plan is byte-identical afterwards
 * (copies only — unlocked drafts, linked); "Keep things as they are" holds for that pair until either plan changes;
 * the partner's plan reads the household's budget through budgetTool.sharedFrom with its own side of who pays.
 * Against a fake store and against the real guest store (sessionStorage, which refuses a locked plan's write itself).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { householdDrawSplit, splitFingerprint } from '../src/services/HouseholdDraw.js';
import { splitWriteMode, splitChanges, applySplit, dismissalFor, isSplitDismissed, shapeWords, isLockedPlan } from '../src/services/HouseholdSplitApply.js';
import { enterGuestMode } from '../src/firebase/AuthService.js';
import { createScenario, saveScenario, loadScenario, loadAllScenarios, setActiveScenarioDoc, clearGuestData } from '../src/firebase/FirestoreService.js';
import { invalidateScenarioCache, duplicateScenario, getActiveBudget, saveActiveBudget, shareBudgetWith, stopSharingBudget, budgetSharedFromOf, sharedBudgetView, getHouseholdSplitDismissed, setHouseholdSplitDismissed, getDefaultScenario } from '../src/storage/ScenarioRepository.js';

const NOW = new Date('2026-10-17T10:00:00Z');
const BANDS = { pa: 12570, brl: 50270, hrl: 125140 };
const stressA = { configured: true, retired: true, currentAge: 62, shapeAgeNow: 62, duration: 30, baseSalary: 83650, equityMin: 800000, bondMin: 300000, cashTarget: 80000, isaBalance: 0, other: 0, isaDrawdownStrategy: 'hold', dbAmount: 3650, dbStartYear: 0, statePension: 11973, statePensionYear: 5, accessMethod: 'drawdown', ...BANDS, strategyId: 'pots-and-valves', incomeShape: 'flat', incomeSteps: [] };
const stressB = { configured: true, retired: true, currentAge: 57, shapeAgeNow: 57, duration: 35, baseSalary: 0, equityMin: 150000, bondMin: 50000, cashTarget: 20000, isaBalance: 0, other: 0, isaDrawdownStrategy: 'hold', statePension: 11973, statePensionYear: 10, accessMethod: 'ufpls', ...BANDS, strategyId: 'pots-and-valves', incomeShape: 'flat', incomeSteps: [] };
const planOf = (id, name, stress, locked = false) => ({ id, planDetails: { name }, stressTool: { settings: stress }, decisionTool: { settings: { locked, ...(locked ? { lockedAt: '2026-09-01T00:00:00Z' } : {}) } } });
const split = () => householdDrawSplit({ settings: stressA, name: 'A' }, { settings: stressB, name: 'B' }, { now: NOW });

/** A fake store that behaves like the real one on the point that matters: a locked plan's settings cannot be written. */
function fakeRepo(plans) {
  const store = new Map(plans.map((p) => [p.id, JSON.parse(JSON.stringify(p))]));
  const apply = (obj, key, value) => { const path = key.split('.'); let o = obj; for (let i = 0; i < path.length - 1; i++) { if (!o[path[i]]) o[path[i]] = {}; o = o[path[i]]; } o[path[path.length - 1]] = value; };
  return {
    store, writes: [],
    async saveScenario(id, data) {
      const cur = store.get(id);
      if (cur.decisionTool?.settings?.locked && Object.keys(data).some((k) => k.startsWith('stressTool'))) throw Object.assign(new Error('locked'), { code: 'plan-locked' });
      this.writes.push([id, data]);
      for (const [k, v] of Object.entries(data)) apply(cur, k, v);
    },
    async duplicateScenario(id, name) {
      const src = JSON.parse(JSON.stringify(store.get(id)));
      const nid = id + '-copy-' + (store.size + 1);
      src.id = nid; src.planDetails.name = name; src.decisionTool.settings.locked = false; delete src.decisionTool.settings.lockedAt;
      store.set(nid, src);
      return nid;
    },
    async loadScenario(id) { return JSON.parse(JSON.stringify(store.get(id) || null)); }
  };
}

describe('"Use this split": the two plans, written, with undo', () => {
  it('writes both plans\' income shape and puts them back on undo', async () => {
    const own = planOf('a', 'A', stressA), partner = planOf('b', 'B', stressB);
    const repo = fakeRepo([own, partner]);
    const s = split();
    expect(splitWriteMode(own, partner, s.names)).toEqual({ mode: 'write', locked: [] });
    const done = await applySplit({ own, partner, split: s, names: s.names, repo, now: NOW });
    expect(done.mode).toBe('write');
    const a = repo.store.get('a').stressTool.settings, b = repo.store.get('b').stressTool.settings;
    expect(a.incomeShape).toBe('phases');
    expect(a.incomeSteps[0]).toEqual({ fromAge: 62, amount: 50270 });
    expect(a.targetSchedule[0]).toBe(50270);
    expect(b.incomeSteps[0].fromAge).toBe(57);
    expect(b.accessMethod).toBe('ufpls');   // the way of drawing is kept
    await done.undo();
    expect(repo.store.get('a').stressTool.settings).toEqual(stressA);
    expect(repo.store.get('b').stressTool.settings).toEqual(stressB);
  });

  it('the confirm lists what changes, plan by plan, in plain words', () => {
    const own = planOf('a', 'A', stressA), partner = planOf('b', 'B', stressB);
    const ch = splitChanges(split(), own, partner);
    expect(ch[0]).toMatchObject({ name: 'A', from: '£83,650 a year', changed: true });
    expect(ch[0].to).toMatch(/^£50,270 a year from 62/);
    expect(ch[1].name).toBe('B');
    expect(ch[1].changed).toBe(true);
    expect(shapeWords({ incomeShape: 'phases', incomeSteps: [{ fromAge: 60, amount: 40000 }, { fromAge: 70, amount: 30000 }] })).toBe('£40,000 a year from 60, £30,000 from 70');
  });
});

describe('a locked plan is never written: copies only', () => {
  it('fake store: with one plan locked the mode is copies; the originals are byte-identical; the copies are unlocked, linked drafts with the split', async () => {
    const own = planOf('a', 'A', stressA, true), partner = planOf('b', 'B', stressB);
    const repo = fakeRepo([own, partner]);
    const beforeA = JSON.stringify(repo.store.get('a')), beforeB = JSON.stringify(repo.store.get('b'));
    const s = split();
    expect(splitWriteMode(own, partner, s.names)).toEqual({ mode: 'copies', locked: ['A'] });
    const done = await applySplit({ own, partner, split: s, names: s.names, copyNames: { a: 'A together', b: 'B together' }, repo, now: NOW });
    expect(done.mode).toBe('copies');
    expect(JSON.stringify(repo.store.get('a'))).toBe(beforeA);
    expect(JSON.stringify(repo.store.get('b'))).toBe(beforeB);
    const ca = repo.store.get(done.ids.a), cb = repo.store.get(done.ids.b);
    expect(isLockedPlan(ca)).toBe(false);
    expect(ca.planDetails.name).toBe('A together');
    expect(ca.stressTool.settings.incomeSteps[0]).toEqual({ fromAge: 62, amount: 50270 });
    expect(ca.household.partnerScenarioId).toBe(done.ids.b);
    expect(cb.household.partnerScenarioId).toBe(done.ids.a);
    expect(cb.stressTool.settings.incomeShape).toBe('phases');
  });

  it('the real guest store: the locked plan is byte-identical after the choice; the copies carry the split', async () => {
    enterGuestMode(); clearGuestData(); invalidateScenarioCache();
    const base = getDefaultScenario('A');
    const idA = await createScenario({ ...base, planDetails: { name: 'A' }, isActive: true, stressTool: { settings: stressA }, decisionTool: { ...base.decisionTool, settings: { ...base.decisionTool.settings, locked: true, lockedAt: '2026-09-01T00:00:00Z' } } });
    const idB = await createScenario({ ...getDefaultScenario('B'), planDetails: { name: 'B' }, isActive: false, stressTool: { settings: stressB } });
    invalidateScenarioCache();
    const all = await loadAllScenarios();
    const own = all.find((p) => p.id === idA), partner = all.find((p) => p.id === idB);
    expect(isLockedPlan(own)).toBe(true);
    const before = JSON.stringify(await loadScenario(idA));
    // the store itself refuses the write a careless caller would send
    await expect(saveScenario(idA, { 'stressTool.settings': { ...stressA, baseSalary: 50270 } })).rejects.toMatchObject({ code: 'plan-locked' });
    expect(JSON.stringify(await loadScenario(idA))).toBe(before);
    const s = split();
    const done = await applySplit({ own, partner, split: s, names: s.names, repo: { saveScenario, duplicateScenario, loadScenario }, now: NOW });
    expect(done.mode).toBe('copies');
    expect(JSON.stringify(await loadScenario(idA))).toBe(before);
    const ca = await loadScenario(done.ids.a), cb = await loadScenario(done.ids.b);
    expect(isLockedPlan(ca)).toBe(false);
    expect(ca.stressTool.settings.incomeSteps[0]).toEqual({ fromAge: 62, amount: 50270 });
    expect(ca.household.partnerScenarioId).toBe(done.ids.b);
    expect(cb.household.partnerScenarioId).toBe(done.ids.a);
    expect(ca.planDetails.name).toBe('A — drawing together');
  });
});

describe('"Keep things as they are": for that pair, until either plan changes', () => {
  it('the dismissal matches the partner and the fingerprint of both plans; a change to either plan ends it', () => {
    const fp = splitFingerprint(stressA, stressB);
    const d = dismissalFor('b', fp);
    expect(isSplitDismissed(d, 'b', fp)).toBe(true);
    expect(isSplitDismissed(d, 'c', fp)).toBe(false);
    expect(isSplitDismissed(d, 'b', splitFingerprint({ ...stressA, baseSalary: 80000 }, stressB))).toBe(false);
    expect(isSplitDismissed(d, 'b', splitFingerprint(stressA, { ...stressB, accessMethod: 'drawdown' }))).toBe(false);
    expect(isSplitDismissed(null, 'b', fp)).toBe(false);
  });
  it('is kept on the plan (household.splitDismissed) in the guest store', async () => {
    enterGuestMode(); clearGuestData(); invalidateScenarioCache();
    await createScenario({ ...getDefaultScenario('A'), planDetails: { name: 'A' }, isActive: true });
    invalidateScenarioCache();
    expect(await getHouseholdSplitDismissed()).toBeNull();
    const d = dismissalFor('b', 'x1');
    await setHouseholdSplitDismissed(d);
    invalidateScenarioCache();
    expect(await getHouseholdSplitDismissed()).toMatchObject({ partnerScenarioId: 'b', fingerprint: 'x1' });
    await setHouseholdSplitDismissed(null);
    invalidateScenarioCache();
    expect(await getHouseholdSplitDismissed()).toBeNull();
  });
});

describe('one budget for the household (decision 5)', () => {
  let idA, idB;
  beforeEach(async () => {
    enterGuestMode(); clearGuestData(); invalidateScenarioCache();
    idA = await createScenario({ ...getDefaultScenario('A'), planDetails: { name: 'A' }, isActive: true, budgetTool: { settings: { lines: [{ id: 'l1', label: 'Food', annual: 6000 }], oneOffs: [], mySharePct: 60, currentAge: 62, sharedWithPartner: true } } });
    idB = await createScenario({ ...getDefaultScenario('B'), planDetails: { name: 'B' }, isActive: false, budgetTool: { settings: { lines: [{ id: 'l2', label: 'Other', annual: 1000 }], oneOffs: [], currentAge: 57 } } });
    invalidateScenarioCache();
  });

  it('the partner\'s plan reads the household\'s lines with its own side of who pays and its own age', async () => {
    await shareBudgetWith(idB);
    const b = await loadScenario(idB);
    expect(budgetSharedFromOf(b)).toBe(idA);
    expect(b.budgetTool.settings.mySharePct).toBe(40);   // the complement of A's 60
    await setActiveScenarioDoc(idB); invalidateScenarioCache();
    const view = await getActiveBudget();
    expect(view.lines).toEqual([{ id: 'l1', label: 'Food', annual: 6000 }]);
    expect(view.mySharePct).toBe(40);
    expect(view.currentAge).toBe(57);
    expect(view.sharedWithPartner).toBe(true);
    expect(view.sharedFrom).toBe(idA);
  });

  it('a save on the partner\'s plan sends the lines to the household\'s plan and keeps who pays on its own', async () => {
    await shareBudgetWith(idB);
    await setActiveScenarioDoc(idB); invalidateScenarioCache();
    const view = await getActiveBudget();
    await saveActiveBudget({ ...view, lines: [...view.lines, { id: 'l3', label: 'Travel', annual: 2400 }], mySharePct: 35 });
    const a = await loadScenario(idA), b = await loadScenario(idB);
    expect(a.budgetTool.settings.lines.map((l) => l.label)).toEqual(['Food', 'Travel']);
    expect(a.budgetTool.settings.mySharePct).toBe(60);   // A's side untouched
    expect(b.budgetTool.settings.mySharePct).toBe(35);
    expect(b.budgetTool.settings.lines).toBeUndefined();   // the partner holds no second copy of the lines
    expect(budgetSharedFromOf(b)).toBe(idA);
  });

  it('stopping the share leaves the partner with its own copy of the lines as last read', async () => {
    await shareBudgetWith(idB);
    await stopSharingBudget(idB);
    const b = await loadScenario(idB);
    expect(budgetSharedFromOf(b)).toBeNull();
    expect(b.budgetTool.settings.lines.map((l) => l.label)).toEqual(['Food']);
    expect(b.budgetTool.settings.mySharePct).toBe(40);
  });

  it('the view helper: theirs for the lines, ours for who pays; a plan pointing at itself is not shared', () => {
    const v = sharedBudgetView({ lines: [1], mySharePct: 70, currentAge: 60 }, { currentAge: 58 }, 'x');
    expect(v).toMatchObject({ lines: [1], mySharePct: 30, currentAge: 58, sharedWithPartner: true, sharedFrom: 'x' });
    expect(budgetSharedFromOf({ id: 'x', budgetTool: { sharedFrom: 'x' } })).toBeNull();
    expect(budgetSharedFromOf({ id: 'x', budgetTool: { sharedFrom: 'y' } })).toBe('y');
    expect(budgetSharedFromOf({ id: 'x' })).toBeNull();
  });
});
