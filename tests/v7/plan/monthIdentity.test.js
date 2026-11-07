/**
 * The identity gate of Month by month in the new app (research/v7/months-in-v7.md §2, 7.2.0): on the committed fixture plans
 * that draw, recording a month, filling in the months missed and setting up a tax year through the new app's pure writers
 * (answers/plan/month.js) leave the plan EXACTLY as the classic planner's own services leave it for the same month and
 * figures — the classic repositories, signed in, against an in-memory store (as tests/lockedPlanStore.test.js runs them).
 *
 * The classic side is index.html's own steps, called as the page calls them: the engine's inputs read through the
 * repositories (getDecisionSettingsAsync, getStressSettingsAsync, getActiveStrategy, getHistoryAsync, getAllTaxYearsAsync,
 * getStatePensionForTaxYear, lockedStartUi.decisionPotsYear) into calcDecisionWithDeps' builder, the overlay with the plan
 * document's ladder (ladderPositionForPlan's locked branch), saveDecision for each record in the order the classic Save makes
 * them (src/ui/monthFillEntry.js: the fill, then the month worked out again), and for a set-up getWizardData → the set-up's
 * own steps → saveTaxYearConfig → lockPlanIfNeeded. The new app's side reads the SAME stored plan (upgraded, as the plan
 * source hands it in) and its one patch is folded onto it. The stored plans must be equal key for key (lastModified aside:
 * the store stamps it), and the month's recommendation field for field.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';

const fs = vi.hoisted(() => {
  const clone = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
  const state = { docs: new Map(), calls: [] };
  const setPath = (obj, path, value) => { const parts = path.split('.'); let cur = obj; for (let i = 0; i < parts.length - 1; i++) { if (!cur[parts[i]] || typeof cur[parts[i]] !== 'object') cur[parts[i]] = {}; cur = cur[parts[i]]; } cur[parts[parts.length - 1]] = value; };
  const snap = (path) => ({ id: path.split('/').pop(), exists: () => state.docs.has(path), data: () => clone(state.docs.get(path)) });
  const api = {
    doc: (db, ...segs) => ({ path: segs.join('/') }),
    collection: (db, ...segs) => ({ path: segs.join('/') }),
    getDoc: async (ref) => snap(ref.path),
    getDocs: async (coll) => { const found = [...state.docs.keys()].filter((k) => k.startsWith(coll.path + '/') && !k.slice(coll.path.length + 1).includes('/')); return { forEach: (fn) => found.forEach((k) => fn(snap(k))), docs: found.map(snap) }; },
    setDoc: async (ref, data) => { state.docs.set(ref.path, clone(data)); },
    updateDoc: async (ref, data) => { if (!state.docs.has(ref.path)) throw new Error('not-found'); const cur = clone(state.docs.get(ref.path)); for (const [k, v] of Object.entries(data)) setPath(cur, k, clone(v)); state.docs.set(ref.path, cur); },
    addDoc: async () => { throw new Error('not used'); },
    deleteDoc: async (ref) => { state.docs.delete(ref.path); },
    writeBatch: () => { const ops = []; return { update: (ref, data) => ops.push(() => api.updateDoc(ref, data)), delete: (ref) => ops.push(() => api.deleteDoc(ref)), commit: async () => { for (const o of ops) await o(); } }; },
    query: (c) => c, where: () => null
  };
  return { state, api, clone };
});
vi.mock('firebase/firestore', () => fs.api);
vi.mock('../../../src/firebase/config.js', () => ({ db: {}, auth: null, app: null, default: {}, isFirebaseConfigured: () => true }));
vi.mock('../../../src/firebase/AuthService.js', () => {
  const user = { uid: 'u1', email: 'someone@example.invalid', emailVerified: true };
  return {
    getCurrentUser: () => user, isLoggedIn: () => true, isGuest: () => false, onAuthStateChange: () => () => {},
    enterGuestMode: () => user, leaveGuestMode: () => {}, initAuthStateListener: () => {}
  };
});

import { invalidateScenarioCache, getActiveScenarioAsync, getActiveStrategy, getActivePlanDocument } from '../../../src/storage/ScenarioRepository.js';
import { getStressSettingsAsync, invalidateStressCache, timingPinSettled } from '../../../src/storage/StressRepository.js';
import { getDecisionSettingsAsync, getHistoryAsync, getAllTaxYearsAsync, getStatePensionForTaxYear, saveTaxYearConfig, invalidateCache as invalidateDecisionCache } from '../../../src/storage/DecisionRepository.js';
import { saveDecision } from '../../../src/services/DecisionService.js';
import { lockPlanIfNeeded } from '../../../src/services/PlanLock.js';
import { calcDecisionPWA, getTaxYearFromDate } from '../../../src/services/legacyDecision.js';
import { engineSetup, engineDeps } from '../../../src/services/MonthDecision.js';
import { strategyOverlayOf, CONTRACT_IDS } from '../../../src/services/DecisionOverlay.js';
import { documentLadder, ladderPosition, firstRungOf } from '../../../src/services/LadderPosition.js';
import { potsDayOf } from '../../../src/services/PlanFromToday.js';
import { getStrategy } from '../../../src/strategies/registry.js';
import { fillOffer, setUpShareDecision, fillMarks } from '../../../src/services/MonthFill.js';
import { enteredBlock } from '../../../src/services/MonthlyEntry.js';
import { getWizardData, shouldShowWizard, isaCalcFor, topUpStart, settleTopUp, setUpConfigOf, suggestedIncomeFor } from '../../../src/services/TaxYearWizardService.js';
import { decisionPotsYear, fillPlanStart, fillPlanBounds } from '../../../src/ui/lockedStartUi.js';
import { upgradeScenario } from '../../../src/firebase/scenarioMigration.js';
import { applyPatch } from '../../../src/answers/plan/about.js';
import { readMonth, monthRecordPatch, taxYearPatch } from '../../../src/answers/plan/month.js';
import { monthWriteRefusal } from '../../../src/services/LockedPlanGuard.js';

const PATH = 'users/u1/scenarios/p1';
const fixture = (name) => { const { id, ...p } = JSON.parse(readFileSync('tests/fixtures/plans/' + name + '.json', 'utf8')); return p; };
const fresh = () => { invalidateScenarioCache(); invalidateStressCache(); invalidateDecisionCache(); };
const stored = () => fs.clone(fs.state.docs.get(PATH));
const sortKeys = (v) => (Array.isArray(v) ? v.map(sortKeys) : v && typeof v === 'object' ? Object.keys(v).sort().reduce((o, k) => { if (v[k] !== undefined) o[k] = sortKeys(v[k]); return o; }, {}) : v);
const bytes = (v) => { const { lastModified, ...rest } = v || {}; return JSON.stringify(sortKeys(rest)); };
const NOW_ISO = '2026-10-02T11:00:00.000Z';
const noon = (today) => { const [y, m, d] = today.split('-').map(Number); return new Date(y, m - 1, d, 12); };

/** Open a plan as the classic page does on load (the upgrade, the timing pin), signed in; the plan as stored then. */
async function open(plan, today) {
  vi.setSystemTime(noon(today));
  fs.state.docs = new Map([[PATH, { ...plan, isActive: true }]]);
  fresh();
  await getActiveScenarioAsync(); await getStressSettingsAsync(); await getDecisionSettingsAsync(); await timingPinSettled();
  fresh();
  return stored();
}

/** index.html calcDecisionWithDeps + decisionStrategyOverlay (the locked plan's ladder: its document's), through the repositories. */
async function classicCalc(dateStr, pots) {
  const settings = await getDecisionSettingsAsync(), ss = await getStressSettingsAsync().catch(() => ({})), allTaxYears = await getAllTaxYearsAsync();
  let st = null; try { st = await getActiveStrategy(); } catch { st = null; }
  const setup = engineSetup({ decisionSettings: settings, stressSettings: ss, strategy: st });
  const decision = await calcDecisionPWA(dateStr, pots.equity, pots.bond, pots.cash, engineDeps(setup, {
    history: await getHistoryAsync(), taxYears: allTaxYears, spInfo: await getStatePensionForTaxYear(getTaxYearFromDate(dateStr)), potsYear: await decisionPotsYear(), pots
  }));
  try {
    const sst = await getActiveStrategy();
    let ladder = null;
    if (CONTRACT_IDS.includes(sst.id)) {
      const doc = await getActivePlanDocument();
      const plan = documentLadder(doc, ss.strategyId);
      const lp = plan ? ladderPosition(plan, { today: new Date(dateStr + '-15'), potsDay: potsDayOf(ss, { lockedAt: doc.lockedAt, now: new Date() }), cashBalance: null, drawnThisYear: 0 }) : null;
      ladder = { lp, firstRung: lp ? firstRungOf(plan) : null };
    }
    decision.strategyOverlay = sst.id && sst.id !== 'pots-and-valves' ? strategyOverlayOf(decision, dateStr, { strategy: sst, stressSettings: ss, name: getStrategy(sst.id).describe().name, ladder }) : null;
  } catch { /* as the page: the overlay is words */ }
  decision.cadenceMonths = 1;
  return decision;
}

/** The classic Calculate, then Save (src/ui/monthFillEntry.js save, one month at a time): the fill first, then the month. */
async function classicRecord(month, pots, { entered, paidAhead = false, fill = false, from = null }) {
  const first = await classicCalc(month, pots); first.entered = entered; first.paidAhead = paidAhead;
  let offer = null;
  if (fill) {
    const bounds = await fillPlanBounds();
    offer = fillOffer(await getHistoryAsync({ limit: 1000 }), month, { taxYears: await getAllTaxYearsAsync(), taxYearOf: getTaxYearFromDate, from, planStart: await fillPlanStart(), floor: bounds.floor, ceiling: bounds.ceiling });
  }
  const filled = [];
  let stopped = null;
  if (offer) {
    for (const date of offer.months) {
      if ((await shouldShowWizard(date)).showWizard) { stopped = date; break; }
      let d = await classicCalc(date, pots); d.entered = entered;
      if (offer.shares && offer.shares[date]) d = setUpShareDecision(d, offer.shares[date]);
      await saveDecision({ ...d, ...fillMarks(NOW_ISO), paidAhead: false });
      filled.push(date);
    }
    if (!stopped && offer.notSetUp && offer.months.length) stopped = offer.notSetUp.month;
  }
  if (stopped) return { first, filled, stopped };
  let current = first;
  if (filled.length) { current = await classicCalc(month, pots); current.entered = entered; current.paidAhead = paidAhead; }
  await saveDecision(current);
  return { first, filled, stopped: null, current };
}

/** The new app's side: the plan as stored, upgraded as the plan source hands it in; its one patch folded onto the stored plan. */
function v7Record(snapshot, typed, today) {
  const plan = upgradeScenario({ id: 'p1', ...snapshot }, { now: noon(today) }).scenario;
  const p = monthRecordPatch(plan, typed, { today, nowIso: NOW_ISO });
  const R = readMonth(plan, typed, { today, nowIso: NOW_ISO });
  return { p, R, after: p.ok ? applyPatch(snapshot, p.patch) : null };
}

const decisionBytes = (d) => JSON.stringify(sortKeys(JSON.parse(JSON.stringify(d))));
const typePots = (pots) => ({ 'mo.mode': 'type', 'mo.equity': String(pots.equity), 'mo.bond': String(pots.bond), 'mo.cashT': String(pots.cash), 'mo.isa': String(pots.isa || 0) });

// Fictional figures, whole pounds, a month each plan can take.
const CASES = [
  { name: '04-buckets-running', today: '2026-10-02', month: '2026-10', pots: { equity: 380000, bond: 150000, cash: 45000, isa: 0 } },
  { name: '04-buckets-running', today: '2026-10-02', month: '2026-11', pots: { equity: 381000, bond: 149500, cash: 43000, isa: 20000 }, label: 'November, with an ISA' },
  { name: '20-locked-start-after-stop', today: '2026-10-02', month: '2026-10', pots: { equity: 0, bond: 610000, cash: 52000, isa: 0 } },
  { name: '06-pre-6.4-no-timing', today: '2026-10-02', month: '2026-10', pots: { equity: 300000, bond: 120000, cash: 30000, isa: 0 }, fill: true },
  { name: '13-stopped-drawing-since', today: '2026-10-02', month: '2026-10', pots: { equity: 0, bond: 540000, cash: 31000, isa: 0 }, fill: true, from: '2025-02' },
  { name: '18-moved-to-new-plan', today: '2026-10-02', month: '2025-03', pots: { equity: 260000, bond: 110000, cash: 25000, isa: 0 }, fill: true, from: '2024-01' },
  { name: '19-back-to-work', today: '2026-10-02', month: '2025-06', pots: { equity: 240000, bond: 90000, cash: 22000, isa: 0 }, fill: true, from: '2024-07' }
];

beforeEach(() => { vi.useFakeTimers({ toFake: ['Date'] }); fs.state.docs = new Map(); fresh(); });

describe('Month by month: recording a month (and the months filled in) writes what the classic planner writes', { timeout: 120_000 }, () => {
  for (const c of CASES) {
    it(`${c.name}: ${c.label || c.month}${c.fill ? ', filling in the months missed' + (c.from ? ' from ' + c.from : '') : ''}`, async () => {
      const snapshot = await open(fixture(c.name), c.today);
      const typed = { 'mo.month': c.month, ...typePots(c.pots), ...(c.fill ? { 'mo.fill': 'yes' } : {}), ...(c.from ? { 'mo.from': c.from } : {}) };
      const v7 = v7Record(snapshot, typed, c.today);
      expect(v7.p.ok, v7.p.problem).toBe(true);
      // the guard's allow-list: nothing but the records and the tax years (and the journey)
      expect(monthWriteRefusal(v7.p.patch)).toBe(null);
      const entered = enteredBlock('type', { ...c.pots, diversifier: 0 }, { ...c.pots, diversifier: 0 });
      const cl = await classicRecord(c.month, { ...c.pots, diversifier: 0, gia: 0, giaBasis: null }, { entered, fill: !!c.fill, from: c.from || null });
      // the month's recommendation, field for field
      expect(decisionBytes(v7.R.firstDecision)).toBe(decisionBytes(cl.first));
      expect(v7.p.filled).toEqual(cl.filled);
      expect(v7.p.stopped).toBe(cl.stopped);
      // the stored plan, key for key
      expect(bytes(v7.after)).toBe(bytes(stored()));
      if (c.fill) expect(cl.filled.length).toBeGreaterThan(0);
    });
  }

  it('the month worked out is the classic Calculate, field for field (04, 03, 06)', async () => {
    for (const c of CASES.filter((x) => ['04-buckets-running', '20-locked-start-after-stop', '06-pre-6.4-no-timing'].includes(x.name))) {
      const snapshot = await open(fixture(c.name), c.today);
      const typed = { 'mo.month': c.month, ...typePots(c.pots) };
      const plan = upgradeScenario({ id: 'p1', ...snapshot }, { now: noon(c.today) }).scenario;
      const { I } = readMonth(plan, typed, { today: c.today, nowIso: NOW_ISO });
      const { decideMonth } = await import('../../../src/services/MonthDecision.js');
      const entered = enteredBlock('type', { ...c.pots, diversifier: 0 }, { ...c.pots, diversifier: 0 });
      const mine = decideMonth(I, c.month, { ...c.pots, diversifier: 0, gia: 0, giaBasis: null }, { entered });
      const theirs = await classicCalc(c.month, { ...c.pots, diversifier: 0, gia: 0, giaBasis: null }); theirs.entered = entered; theirs.paidAhead = false;
      expect(decisionBytes(mine)).toBe(decisionBytes(theirs));
    }
  });

  it('the pots as the platform shows them, pre-filled from the last record (04): the same record as the classic entry makes', async () => {
    const snapshot = await open(fixture('04-buckets-running'), '2026-10-02');
    const v7 = v7Record(snapshot, { 'mo.month': '2026-10' }, '2026-10-02');
    expect(v7.p.ok).toBe(true);
    const P = v7.R.pots;
    const typedP = { total: +P.fields.find((f) => f.path === 'mo.total').shown, cash: +P.fields.find((f) => f.path === 'mo.cash').shown, bonds: +P.fields.find((f) => f.path === 'mo.bonds').shown, diversifiers: null };
    const pots = { ...P.pots };
    await classicRecord('2026-10', pots, { entered: enteredBlock('platform', typedP, { equity: pots.equity, bond: pots.bond, cash: pots.cash, diversifier: 0 }) });
    expect(bytes(v7.after)).toBe(bytes(stored()));
  });

  it('"This month\'s payment has already been made" (04): November recorded and marked, as the classic tick does', async () => {
    const snapshot = await open(fixture('04-buckets-running'), '2026-10-02');
    const pots = { equity: 379000, bond: 150000, cash: 43000, isa: 0 };
    const v7 = v7Record(snapshot, { 'mo.month': '2026-10', 'mo.paid': 'yes', ...typePots(pots) }, '2026-10-02');
    expect(v7.p.ok).toBe(true);
    await classicRecord('2026-11', { ...pots, diversifier: 0, gia: 0, giaBasis: null }, { entered: enteredBlock('type', { ...pots, diversifier: 0 }, { ...pots, diversifier: 0 }), paidAhead: true });
    expect(bytes(v7.after)).toBe(bytes(stored()));
    expect(stored().decisionTool.history.find((h) => h.date === '2026-11').paidAhead).toBe(true);
  });

  it('a locked plan\'s settings are byte-identical after a month and its fill', async () => {
    const snapshot = await open(fixture('06-pre-6.4-no-timing'), '2026-10-02');
    const v7 = v7Record(snapshot, { 'mo.month': '2026-10', ...typePots(CASES[3].pots), 'mo.fill': 'yes' }, '2026-10-02');
    expect(JSON.stringify(v7.after.decisionTool.settings)).toBe(JSON.stringify(snapshot.decisionTool.settings));
    expect(JSON.stringify(v7.after.stressTool)).toBe(JSON.stringify(snapshot.stressTool));
    expect(JSON.stringify(v7.after.strategy)).toBe(JSON.stringify(snapshot.strategy));
  });
});

/** The classic set-up with its opening answers (getWizardData, then Next, Next, Confirm & save), and the answers typed. */
async function classicSetUp(month, typedIn = {}) {
  const ctx = await getWizardData(month);
  const cpi = typedIn.cpi != null ? typedIn.cpi : ctx.defaults.cpi;
  const inputs = { pa: ctx.defaults.pa, brl: ctx.defaults.brl, hrl: ctx.defaults.hrl, cpi, other: ctx.defaults.other, cgtExemptionUsed: 0, grossIncomeToDate: typedIn.toDate || 0, taxPaidToDate: typedIn.taxToDate ?? null,
    confirmedSalary: typedIn.income != null ? typedIn.income : suggestedIncomeFor(ctx, typedIn.cpi != null ? typedIn.cpi : null), isaSavingsAllocation: null, isTaxEfficient: true, taxEfficiencyChoice: null };
  const isaCalc = isaCalcFor(ctx, inputs);
  inputs.isaSavingsAllocation = typedIn.isa != null ? typedIn.isa : topUpStart(isaCalc);
  const settled = settleTopUp(inputs, isaCalc, typedIn.choice || null);
  const final = { ...inputs, ...settled };
  await saveTaxYearConfig(ctx.taxYear, setUpConfigOf(ctx, final));
  await lockPlanIfNeeded('tax year set up');
}

const SETUPS = [
  { name: '04-buckets-running', today: '2027-04-10', month: '2027-04', typed: {}, label: 'April, as suggested' },
  { name: '06-pre-6.4-no-timing', today: '2027-06-10', month: '2027-06', typed: { income: 30000, toDate: 12000, taxToDate: 1500 }, label: 'part-way through the year, with income and tax so far' },
  { name: '20-locked-start-after-stop', today: '2027-04-10', month: '2027-04', typed: { cpi: 0.031 }, label: 'a price rise typed' },
  { name: '04-buckets-running', today: '2027-04-10', month: '2027-04', typed: { income: 70000, isa: 2000, choice: 'inefficient' }, label: 'a top-up that falls short, the higher rate chosen' }
];

describe('Month by month: setting up a tax year writes what the classic set-up writes', { timeout: 60_000 }, () => {
  for (const c of SETUPS) {
    it(`${c.name}: ${c.label}`, async () => {
      const snapshot = await open(fixture(c.name), c.today);
      const t = c.typed;
      const typed = { 'mo.month': c.month, ...(t.income != null ? { 'ty.income': String(t.income) } : {}), ...(t.toDate != null ? { 'ty.toDate': String(t.toDate) } : {}), ...(t.taxToDate != null ? { 'ty.taxToDate': String(t.taxToDate) } : {}),
        ...(t.cpi != null ? { 'ty.cpi': String(Math.round(t.cpi * 1000) / 10) } : {}), ...(t.isa != null ? { 'ty.isa': String(t.isa) } : {}), ...(t.choice ? { 'ty.choice': t.choice } : {}) };
      const plan = upgradeScenario({ id: 'p1', ...snapshot }, { now: noon(c.today) }).scenario;
      const p = taxYearPatch(plan, typed, { today: c.today });
      expect(p.ok, p.problem).toBe(true);
      expect(monthWriteRefusal(p.patch)).toBe(null);
      await classicSetUp(c.month, t);
      expect(bytes(applyPatch(snapshot, p.patch))).toBe(bytes(stored()));
    });
  }

  it('then the month: set up and recorded through the new app equals set up and recorded through the classic planner (06, mid-year)', async () => {
    const c = SETUPS[1];
    const snapshot = await open(fixture(c.name), c.today);
    const typed = { 'mo.month': c.month, 'ty.income': '30000', 'ty.toDate': '12000', 'ty.taxToDate': '1500' };
    const plan = upgradeScenario({ id: 'p1', ...snapshot }, { now: noon(c.today) }).scenario;
    const p1 = taxYearPatch(plan, typed, { today: c.today });
    const afterSetUp = applyPatch(snapshot, p1.patch);
    const pots = { equity: 290000, bond: 118000, cash: 29000, isa: 0 };
    const v7 = v7Record(afterSetUp, { 'mo.month': c.month, ...typePots(pots) }, c.today);
    expect(v7.p.ok, v7.p.problem).toBe(true);
    await classicSetUp(c.month, c.typed);
    await classicRecord(c.month, { ...pots, diversifier: 0, gia: 0, giaBasis: null }, { entered: enteredBlock('type', { ...pots, diversifier: 0 }, { ...pots, diversifier: 0 }) });
    expect(bytes(v7.after)).toBe(bytes(stored()));
  });
});
