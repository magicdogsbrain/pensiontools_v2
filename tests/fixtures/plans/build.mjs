/**
 * Plan corpus generator — SYNTHETIC saved plans, built by driving the app's own code.
 *
 *   node tests/fixtures/plans/build.mjs                 rebuild every fixture + snapshot.json
 *   node tests/fixtures/plans/build.mjs --repin-market  …and first re-copy market/ from src/data/*Snapshot.js
 *   node tests/fixtures/plans/build.mjs --snapshot-only  re-answer the COMMITTED fixtures into snapshot.json and leave
 *                                                        them as they are (an explained engine change: 6.37.0)
 *   node tests/fixtures/plans/build.mjs --only=13-stopped-drawing-since
 *                                                        write only the fixtures named (a new one) and re-answer every
 *                                                        committed one into snapshot.json, leaving the others as they are
 *
 * Why generated, not hand-written: a fixture is only a safety net if it is a shape the app really writes.
 * Each plan is created, saved, locked and recorded through the real repositories in GUEST mode (the guest
 * store is the same code path as Firestore minus the network), at a pinned clock, so the JSON is what
 * users/{uid}/scenarios/{id} would hold. Where the app's step lives in index.html (DOM-bound, not importable)
 * the few lines are mirrored here and say which function they mirror. The older shapes (pre-6.4, pre-6.13,
 * the dotted-key bug) are today's documents with exactly the later additions taken away / the bug re-applied —
 * each says what and why.
 *
 * Every person and figure is invented. Nothing here is, or is derived from, a real plan.
 *
 * Deterministic: the zone, Date and Math.random are pinned (clock.mjs) BEFORE the app modules load, and the market data comes from
 * market/ (a frozen copy), so a re-run on unchanged code rewrites byte-identical files. A diff after a code
 * change IS the change to saved-plan shapes — read it before committing.
 */
import { at, say } from './clock.mjs';   // FIRST: pins the zone, the clock and Math.random before any app module loads
import { writeFileSync, readFileSync, mkdirSync, existsSync, readdirSync, unlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..', '..');
const S = (p) => join(ROOT, 'src', p);

const { enterGuestMode } = await import(S('firebase/AuthService.js'));
const { clearGuestData, guestSnapshot } = await import(S('firebase/FirestoreService.js'));
const Scn = await import(S('storage/ScenarioRepository.js'));
const Str = await import(S('storage/StressRepository.js'));
const Dec = await import(S('storage/DecisionRepository.js'));
const { saveBudget, getBudgetAsync } = await import(S('storage/BudgetRepository.js'));
const { deriveTiming, projectedPotAtRetirement, planYearOf, taxYearLabel } = await import(S('services/PlanTiming.js'));
const { compileSteps, cleanSteps } = await import(S('services/IncomeSchedule.js'));
const { cleanParams } = await import(S('services/StrategyState.js'));
const { lockPlanIfNeeded } = await import(S('services/PlanLock.js'));
const { buildPlanDocument, CONTRACT_STRATEGIES } = await import(S('services/PlanDocument.js'));
const { deriveStage, journeyAppend } = await import(S('services/LifeStage.js'));
const { planFromSettings, stressTestStrategy, STRATEGY_NAMES } = await import(S('strategies/stressTest.js'));
const { realYieldForYear, activeLinkers } = await import(S('services/LinkerUniverse.js'));
const { tentGlideForSettings } = await import(S('services/GlidepathService.js'));
const { calcDecisionPWA, getTaxYearFromDate } = await import(S('services/legacyDecision.js'));
const { saveDecision } = await import(S('services/DecisionService.js'));
const { decisionToHistory } = await import(S('models/Decision.js'));
const Wiz = await import(S('services/TaxYearWizardService.js'));
const { successorOf, closeWrite } = await import(S('services/PlanClose.js'));
const { createScenario, saveScenario } = await import(S('firebase/FirestoreService.js'));
const { evaluatePlan, pinMarket, sortKeys, authSettled, MARKET_DIR, CORPUS_NOW } = await import('./checks.mjs');
await authSettled();   // guest mode entered before Firebase's first "signed out" report would be ended by it

// ---- Market data: a frozen copy, so the nightly refresh of src/data/*Snapshot.js cannot move a fixture ------
mkdirSync(MARKET_DIR, { recursive: true });
if (process.argv.includes('--repin-market') || !existsSync(join(MARKET_DIR, 'gilts.json'))) {
  const gilts = (await import(S('data/giltsSnapshot.js'))).default;
  const equity = (await import(S('data/equitySnapshot.js'))).default;
  writeFileSync(join(MARKET_DIR, 'gilts.json'), JSON.stringify(gilts, null, 1) + '\n');
  writeFileSync(join(MARKET_DIR, 'equity.json'), JSON.stringify(equity, null, 1) + '\n');
  say('market/ re-pinned from src/data (gilts as of ' + gilts.as_of + ')');
}
const market = pinMarket();

// ---- Small mirrors of index.html steps (the originals read the DOM) -----------------------------------------
const drop = () => { Scn.invalidateScenarioCache(); Dec.invalidateCache(); Str.invalidateStressCache(); };
const startGuestStore = () => { enterGuestMode(); clearGuestData(); drop(); };

async function newPlan(name, description = '', tools = ['budget', 'stress', 'decision', 'accumulation'], overrides = {}, setActive = true) {
  const id = await Scn.createNewScenario(name, description, tools, overrides, setActive);
  drop();
  return id;
}

/** refreshLifeStage(): derive the stage from the effective Stress settings and append it to the journey when it changed. */
async function stageTick() {
  drop();
  const sc = await Scn.getActiveScenarioAsync();
  const ss = await Str.getStressSettingsAsync();
  const stage = deriveStage({ ...sc, stressTool: { ...(sc.stressTool || {}), settings: ss } });
  const j = Array.isArray(sc.journey) ? sc.journey : [];
  const next = journeyAppend(j, stage);
  if (next !== j) await Scn.saveActiveJourney(next);
  return stage;
}

/**
 * saveStressSettingsUI(): the Settings page's Save. `f` is the form as the user left it; every field the page
 * writes is written, with the page's own defaults for the ones a fixture does not care about.
 */
async function saveStressForm(f) {
  const cur = await Str.getStressSettingsAsync();
  const id = f.strategyId || 'pots-and-valves';
  const params = cleanParams(id, f.strategyParams || {});
  const future = f.retired === false;
  const tm = {   // timingFromForm()
    currentAge: f.currentAge ?? null,
    currentAgeAsOf: f.currentAge ? new Date().toISOString().slice(0, 10) : null,
    retired: f.currentAge ? !future : null,
    retireAge: future ? f.retireAge : null,
    firstTaxYear: future ? null : (f.firstTaxYear ?? null),
    spStartDate: f.spStartDate ?? null,
    duration: f.duration ?? cur.duration
  };
  const draft = { ...cur, ...f, ...tm };
  tm.potAtRetirement = future ? (() => { const pr = projectedPotAtRetirement(draft, f.accumulation || null); return { sipp: pr.sipp, isa: pr.isa, source: 'accumulation' }; })() : null;
  const t = deriveTiming({ ...draft, potAtRetirement: tm.potAtRetirement });
  const timingFields = {   // timingFieldsForSave()
    shapeAgeNow: t.mode === 'legacy' ? (f.shapeAgeNow || 57) : t.shapeAgeNow,
    currentAge: tm.currentAge, currentAgeAsOf: tm.currentAgeAsOf, retired: tm.retired, retireAge: tm.retireAge,
    firstTaxYear: t.mode === 'legacy' ? (tm.firstTaxYear ?? null) : t.firstTaxYear, potAtRetirement: tm.potAtRetirement
  };
  const steps = f.incomeShape === 'phases' ? (f.incomeSteps || []).filter((st) => +st.amount > 0) : [];
  const schedule = compileSteps({ incomeShape: f.incomeShape, incomeSteps: steps, shapeAgeNow: timingFields.shapeAgeNow, duration: tm.duration, baseSalary: f.baseSalary });
  await Scn.setActiveStrategy(id, params);
  const firstStep = steps.length ? +cleanSteps(steps)[0].amount : f.baseSalary;
  await Dec.saveDecisionSettings({ baseSalary: firstStep || f.baseSalary, targetSchedule: schedule || null, ...(timingFields.firstTaxYear > 0 ? { firstTaxYear: timingFields.firstTaxYear } : {}) });
  if (tm.currentAge > 0) {   // syncBudgetAgeFromTiming()
    const b = await getBudgetAsync();
    b.currentAge = tm.currentAge; b.currentAgeAsOf = tm.currentAgeAsOf; b.retired = tm.retired; b.retirementAge = future ? f.retireAge : timingFields.shapeAgeNow;
    await saveBudget(b);
  }
  await Str.saveStressSettings({
    configured: true, strategyId: id, strategyParams: params, strategyState: f.strategyState || {},
    incomeShape: f.incomeShape ?? 'flat', incomeSteps: steps,
    ...timingFields,
    accessMethod: f.accessMethod || 'drawdown', ufplsYears: f.ufplsYears || null, ufplsThenPcls: !!f.ufplsThenPcls, bandFillRecycle: !!f.bandFillRecycle,
    targetSchedule: schedule || null,
    baseSalary: f.baseSalary, equityMin: f.equityMin, bondMin: f.bondMin, cashTarget: f.cashTarget, duration: tm.duration,
    pa: f.pa ?? cur.pa, brl: f.brl ?? cur.brl, hrl: f.hrl ?? cur.hrl, taxMode: f.taxMode || cur.taxMode, other: f.other || 0,
    dbAmount: f.dbAmount || 0, dbStartYear: f.dbStartYear || 0, dbIndexation: f.dbIndexation || 'lpi5',
    extraIncomes: (f.extraIncomes || []).filter((r) => r.annual > 0),
    windfalls: (f.windfalls || []).filter((r) => r.amount > 0 && r.year != null),
    extraWithdrawals: (f.extraWithdrawals || []).filter((r) => r.amount > 0 && r.year != null),
    spStartDate: f.spStartDate || null, spWeeklyAmount: f.spWeeklyAmount || 0,
    consecutiveLimit: f.consecutiveLimit ?? cur.consecutiveLimit, protectionMult: f.protectionMult ?? cur.protectionMult,
    protectionEscalateMonths: f.protectionEscalateMonths ?? 12, disableProtection: !!f.disableProtection,
    recoveryBuffer: f.recoveryBuffer ?? cur.recoveryBuffer ?? 15000, hodlEnabled: !!f.hodlEnabled, hodlValue: f.hodlValue ?? cur.hodlValue,
    isaBalance: f.isaBalance || 0, isaDrawdownStrategy: f.isaDrawdownStrategy || 'minimiseEarlyTax',
    taxableStart: f.taxableStart || 0, taxableMix: f.taxableMix || 'equity', giaTaxBand: f.giaTaxBand || 'basic', relevantEarnings: f.relevantEarnings || 0, bedAndIsa: f.bedAndIsa !== false,
    spendingProfile: 'flat', equityGlideEnabled: !!f.equityGlideEnabled,
    diversifierStart: f.diversifierStart || 0, subAsset: f.subAsset || null, glideEndgame: f.glideEndgame || null,
    allocMode: f.allocMode || 'risk', taggedFunds: (f.taggedFunds || []).filter((x) => x.ticker && x.value > 0)
  });
  drop();
}

/** strategyPlanFor() + strategyResultForDocument(): the plan and its one strategy run. */
function runStrategy(settings) {
  const cfg = Str.createSimulationConfigFromSettings({}, settings);
  const p = planFromSettings(settings, cfg, { yieldForYear: realYieldForYear, startAge: +settings.shapeAgeNow || 57 });
  return { p, r: stressTestStrategy(settings.strategyId || 'pots-and-valves', p) };
}

/** lockPlanFromStress() + buildPlanDocumentNow(): seed the Decision copy, lock, write the plan document. */
async function lockFromStress() {
  const stressNow = await Str.getStressSettingsAsync();
  const decisionNow = await Dec.getDecisionSettingsAsync();
  await Dec.saveDecisionSettings(Scn.seedDecisionFromStress(stressNow, decisionNow));
  Dec.invalidateCache();
  await lockPlanIfNeeded('locked from Stress settings');
  const settings = await Str.getStressSettingsAsync();
  const { p, r } = runStrategy(settings);
  if (!r.affordable) throw new Error('fixture plan is not affordable on its own strategy: ' + (r.reason || ''));
  const ds = await Dec.getDecisionSettingsAsync();
  const sc = await Scn.getActiveScenarioAsync();
  const doc = buildPlanDocument({ planName: sc.planDetails.name, holdings: await Scn.getActiveHoldings(), settings, p, r, lockedAt: ds.lockedAt || null, lockedBy: ds.lockedBy || 'locked from Stress settings', budgetGross: 0, essentials: 0, journey: await Scn.getActiveJourney(), accumulation: await Scn.getActiveAccumulation() });
  await Scn.saveActivePlanDocument(doc);
  await stageTick();
}

/** The tax-year wizard's Confirm: its own suggestions accepted, with the user's answers in `a`. */
async function setUpTaxYear(month, a = {}) {
  const wd = await Wiz.getWizardData(month);
  const confirmedSalary = a.confirmedSalary ?? wd.suggestedSalary;
  const base = { pa: wd.defaults.pa, brl: wd.defaults.brl, hrl: wd.defaults.hrl, cpi: a.cpi ?? wd.defaults.cpi, other: a.other ?? wd.defaults.other ?? 0 };
  const startMonth = +month.split('-')[1];
  const answers = { isaSavingsAllocation: a.isaSavingsAllocation || 0, isTaxEfficient: a.isTaxEfficient !== false, grossIncomeToDate: a.grossIncomeToDate || 0, taxPaidToDate: a.taxPaidToDate ?? null };
  const monthlyBreakdown = Wiz.calculateMonthlyBreakdown({ targetSalary: confirmedSalary, brl: base.brl, pa: base.pa, other: base.other, statePension: wd.statePension?.amount || 0, remainingMonths: wd.remainingMonths, startYm: month, ...answers });
  const config = Wiz.buildTaxYearConfig({ ...base, ...answers, cgtExemptionUsed: 0, taxEfficiencyChoice: answers.isTaxEfficient ? 'efficient' : 'inefficient', startMonth, confirmedSalary, remainingMonths: wd.remainingMonths, statePension: wd.statePension?.amount || 0, monthlyBreakdown });
  await Dec.saveTaxYearConfig(wd.taxYear, config);
  drop();
}

/** calcDecisionWithDeps(): one month's decision with exactly the deps the entry form assembles. */
async function decideMonth(ym, pots, { pre64 = false } = {}) {
  const settings = await Dec.getDecisionSettingsAsync();
  // pre64: as the app ran before the Timing block — the Stress settings are read raw (no load migration) and
  // the Decision copy is NOT handed the Stress plan's first tax year, so year 0 is the first tax year set up.
  const ss = pre64 ? await Scn.getActiveStressSettings() : await Str.getStressSettingsAsync();
  if (!pre64 && !(+settings.firstTaxYear > 0)) { const t = deriveTiming(ss); if (t.mode !== 'legacy' || +ss.firstTaxYear > 0) settings.firstTaxYear = t.firstTaxYear; }
  const decisionSettings = settings.equityGlideEnabled ? { ...settings, equityGlide: tentGlideForSettings(settings) } : settings;
  const st = await Scn.getActiveStrategy();
  const sp = { ...(ss.strategyParams || {}), ...(settings.strategyParams || {}), ...(st.params || {}) };
  const stratDeps = st.id === 'buckets-in-order' ? { sourcingMode: 'ordered', bucketBand: sp.bucketBand > 0 ? sp.bucketBand / 100 : 0.10 } : {};
  // 6.13.5: protection mode is a Pots & Valves rule; a contract strategy has no pot floors to obey (as calcDecisionWithDeps).
  const engineSettings = CONTRACT_STRATEGIES.includes(st.id) ? { ...decisionSettings, disableProtection: true } : decisionSettings;
  const decision = await calcDecisionPWA(ym, pots.equity, pots.bond, pots.cash, {
    ...stratDeps, settings: engineSettings, history: await Dec.getHistoryAsync(), allTaxYears: await Dec.getAllTaxYearsAsync(),
    spInfo: await Dec.getStatePensionForTaxYear(getTaxYearFromDate(ym)),
    isaBalance: pots.isa || 0, diversifier: 0, giaBalance: pots.gia || 0, giaBasis: pots.giaBasis ?? null
  });
  // decisionStrategyOverlay(), bridge-month branch only (the one the ladder fixture is in): a contract strategy
  // before its first tax year pays the month from SIPP cash; nothing is sold and no rung is due.
  const t = CONTRACT_STRATEGIES.includes(st.id) ? deriveTiming(ss) : null;
  if (t && planYearOf(ym, t.firstTaxYear) < 0) {
    const total = decision.sippDraw || 0, y0 = taxYearLabel(t.firstTaxYear);
    decision.strategyOverlay = { id: st.id, name: STRATEGY_NAMES[st.id], floorMonthly: Math.round(total), sleeveMonthly: 0, floorLabel: 'SIPP cash (the plan\'s year 0 is ' + y0 + ')',
      note: 'Run-up to your plan (year 0 is ' + y0 + '): this month comes from your SIPP cash — the money-market fund the cash years will also use. Nothing is sold; the ladder\'s first rung is not due yet.', hidePots: true };
  } else decision.strategyOverlay = null;
  decision.cadenceMonths = 1;
  return decision;
}
async function recordMonth(ym, pots, opts) { await saveDecision(await decideMonth(ym, pots, opts)); }

/** The scenario(s) in the store as Firestore would hand them back: `id` from the snapshot, maps in sorted key order. */
function exportDocs(idMap) {
  const swap = (v) => (typeof v === 'string' && idMap[v] ? idMap[v] : v);
  return guestSnapshot().map((sc) => {
    const { id, ...data } = JSON.parse(JSON.stringify(sc));
    if (data.household && data.household.partnerScenarioId) data.household.partnerScenarioId = swap(data.household.partnerScenarioId);
    // the links between a closed plan and the plan that carries it on (6.56.0)
    for (const k of ['nextPlanId', 'previousPlanId']) if (data[k]) data[k] = swap(data[k]);
    if (data.before && data.before.planId) data.before.planId = swap(data.before.planId);
    // the person's fact of money taken flexibly, carried by a close (back to work: research/plan-start.md §2 J)
    if (data.flexibleAccess && data.flexibleAccess.fromPlanId) data.flexibleAccess.fromPlanId = swap(data.flexibleAccess.fromPlanId);
    return { id: swap(id), ...sortKeys(data) };
  });
}

// ---- The fixtures ------------------------------------------------------------------------------------------
const out = {};   // file name → document

// 01 — a brand-new account's first plan, untouched.
{
  startGuestStore(); at('2026-09-28T18:42:10.000Z');
  const id = await newPlan('My Plan', '', ['stress', 'decision']);
  [out['01-fresh-default']] = exportDocs({ [id]: 'Fz7Qm2xLr8TnVb4KdWc1' });
}

// 02 — a configured Pots & Valves DRAFT: retired at 61, stepped income, State Pension by date, never locked.
//      7.4.0: year 0 is the tax year work stopped (June 2026) — never a later one. It was saved with next April, 2027/28,
//      before 7.4.0; it is now as its next Save writes it (PlanMove.laterDraftOf): one more year, the first step from 62,
//      the same end age.
{
  startGuestStore(); at('2026-08-14T10:05:00.000Z');
  const id = await newPlan('Draft — Pots & Valves', 'First go at a drawdown plan');
  await saveStressForm({
    currentAge: 61, firstTaxYear: 2026, spStartDate: '14 March 2032', spWeeklyAmount: 221.2, duration: 34,
    equityMin: 420000, bondMin: 210000, cashTarget: 70000, isaBalance: 45000, isaDrawdownStrategy: 'minimiseEarlyTax',
    baseSalary: 38000, incomeShape: 'phases', incomeSteps: [{ fromAge: 62, amount: 38000 }, { fromAge: 75, amount: 32000, decline: 1 }],
    strategyId: 'pots-and-valves'
  });
  await Str.saveStressSettings({ stoppedWork: '2026-06' });   // the Timing block's month box (6.51.0)
  await stageTick();
  [out['02-pnv-draft']] = exportDocs({ [id]: 'h3NpX9sYq1ZtGu6RaEo5' });
}

// 03 — LOCKED index-linked gilt ladder in its run-up: retired at 64, plan year 0 is 2027/28, so the 2026/27
//      months are bridge months paid from SIPP cash. Holdings recorded, tax year set up mid-year, three months in.
{
  startGuestStore(); at('2026-06-10T09:30:00.000Z');
  const id = await newPlan('Linkers to 85', 'Index-linked gilts for every year; bridge cash to April 2027');
  at('2026-06-12T20:11:00.000Z');
  await saveStressForm({
    currentAge: 64, firstTaxYear: 2027, spStartDate: '14 March 2029', spWeeklyAmount: 230.25, duration: 20,
    equityMin: 180000, bondMin: 400000, cashTarget: 60000, isaBalance: 35000, isaDrawdownStrategy: 'minimiseEarlyTax',
    baseSalary: 34000, incomeShape: 'phases', incomeSteps: [{ fromAge: 66, amount: 34000 }, { fromAge: 72, amount: 29000 }, { fromAge: 79, amount: 24000, decline: 1 }],
    strategyId: 'full-il-gilt', strategyParams: { sippTotal: 640000, isaTotal: 35000, cashYears: 2, bridgeCash: 20000 }
  });
  await stageTick();
  at('2026-06-20T11:00:00.000Z');
  // What is held: a few real index-linked gilts from the pinned universe (names/TIDMs are public data), a
  // money-market fund and a world tracker — typed in, with units and values.
  const linkers = activeLinkers().gilts.filter((g) => g.type !== 'conventional' && g.tidm).slice(0, 4);
  await Scn.saveActiveHoldings({ source: 'typed', updatedAt: '2026-06-20', lines: [
    ...linkers.map((g, i) => ({ wrapper: 'SIPP', ticker: g.tidm, name: g.name, sedol: null, units: [25000, 23500, 22000, 31500][i], value: [35494.15, 37525.0, 30496.65, 42471.7][i], kind: 'gilt', asOf: '2026-06-19' })),
    { wrapper: 'SIPP', ticker: 'XSTR', name: 'Xtrackers II Sterling Overnight Rate', units: 620, value: 96625.2, ocf: 0.1, kind: 'fund', subClass: 'moneyMarket', asOf: '2026-06-19' },
    { wrapper: 'SIPP', ticker: 'VWRP', name: 'Vanguard FTSE All-World (Acc)', units: 3260, value: 396768.9, ocf: 0.19, kind: 'fund', subClass: 'worldGrowth', asOf: '2026-06-19' },
    { wrapper: 'ISA', ticker: 'VWRP', name: 'Vanguard FTSE All-World (Acc)', units: 288, value: 35052.0, ocf: 0.19, kind: 'fund', subClass: 'worldGrowth', asOf: '2026-06-19' },
    { wrapper: 'CASH', ticker: null, name: 'Easy-access savings', value: 8000, kind: 'cash', asOf: '2026-06-19' }
  ] });
  at('2026-07-01T08:15:00.000Z');
  await lockFromStress();
  at('2026-07-03T19:40:00.000Z');
  await setUpTaxYear('2026-07', { grossIncomeToDate: 15600, taxPaidToDate: 2490 });   // left work at the end of June
  await recordMonth('2026-07', { equity: 0, bond: 529000, cash: 92300, isa: 35100 });
  at('2026-08-04T19:02:00.000Z');
  await recordMonth('2026-08', { equity: 0, bond: 531000, cash: 89500, isa: 35500 });
  at('2026-09-02T18:30:00.000Z');
  await recordMonth('2026-09', { equity: 0, bond: 527100, cash: 86700, isa: 35300 });
  await stageTick();
  [out['03-gilt-ladder-runup']] = exportDocs({ [id]: 'Kq8LwT2mJv5PzYc9BnRd' });
}

// 04 — LOCKED Buckets in order, RUNNING: plan year 0 is 2026/27, six months recorded from April.
{
  startGuestStore(); at('2026-02-20T14:00:00.000Z');
  const id = await newPlan('Buckets — three pots', 'Cash first, then bonds, equities last');
  await saveStressForm({
    currentAge: 62, firstTaxYear: 2026, spStartDate: '3 February 2031', spWeeklyAmount: 215.6, duration: 30,
    equityMin: 380000, bondMin: 150000, cashTarget: 60000, isaBalance: 25000, isaDrawdownStrategy: 'minimiseEarlyTax',
    baseSalary: 30000, incomeShape: 'flat', strategyId: 'buckets-in-order', strategyParams: { bucketBand: 10 }
  });
  await stageTick();
  at('2026-03-20T16:25:00.000Z');
  await Scn.saveActiveHoldings({ source: 'typed', updatedAt: '2026-03-20', lines: [
    { wrapper: 'SIPP', ticker: 'HMWO', name: 'HSBC MSCI World', units: 11800, value: 381200, ocf: 0.15, kind: 'fund', subClass: 'worldGrowth', asOf: '2026-03-19' },
    { wrapper: 'SIPP', ticker: 'VAGS', name: 'Vanguard Global Aggregate (GBP-Hedged, Acc)', units: 6100, value: 149700, ocf: 0.1, kind: 'fund', subClass: 'globalAggHedged', asOf: '2026-03-19' },
    { wrapper: 'SIPP', ticker: 'CSH2', name: 'Amundi Smart Overnight Return', units: 505, value: 60150, ocf: 0.1, kind: 'fund', subClass: 'moneyMarket', asOf: '2026-03-19' },
    { wrapper: 'ISA', ticker: 'HMWO', name: 'HSBC MSCI World', units: 775, value: 25040, ocf: 0.15, kind: 'fund', subClass: 'worldGrowth', asOf: '2026-03-19' }
  ] });
  await lockFromStress();
  at('2026-04-08T09:10:00.000Z');
  await stageTick();   // first visit after 6 April: the run-up is over
  await setUpTaxYear('2026-04', { isaSavingsAllocation: 0 });
  const months = [['2026-04', 372400, 150900, 60100], ['2026-05', 379800, 151200, 57600], ['2026-06', 368100, 150400, 55100], ['2026-07', 385300, 151800, 52600], ['2026-08', 391700, 152300, 50100], ['2026-09', 388200, 151900, 47600]];
  for (const [ym, equity, bond, cash] of months) { at(ym + '-08T09:20:00.000Z'); await recordMonth(ym, { equity, bond, cash, isa: 25000 }); }
  await stageTick();
  [out['04-buckets-running']] = exportDocs({ [id]: 'Td4VyS7nHg2McXe8WuFa' });
}

// 05 — a FUTURE retiree, committed and still saving: 48, retiring at 60, locked, recording the pot each month.
{
  startGuestStore(); at('2026-05-18T21:00:00.000Z');
  const id = await newPlan('Retire at 60', 'Twelve years of contributions to go');
  const accumulation = { currentAge: 48, retirementAge: 60, salary: 68000, potNow: 310000, netMonthly: 600, schemeType: 'ras', employerMonthly: 450, escalationPct: 1 };
  await Scn.saveActiveAccumulation(accumulation);
  await Scn.saveActiveHoldings({ source: 'typed', updatedAt: '2026-05-18', lines: [
    { wrapper: 'SIPP', ticker: 'VWRP', name: 'Vanguard FTSE All-World (Acc)', units: 2080, value: 252300, ocf: 0.19, contribution: 900, kind: 'fund', subClass: 'worldGrowth', asOf: '2026-05-15' },
    { wrapper: 'SIPP', ticker: 'VAGS', name: 'Vanguard Global Aggregate (GBP-Hedged, Acc)', units: 2350, value: 57700, ocf: 0.1, contribution: 300, kind: 'fund', subClass: 'globalAggHedged', asOf: '2026-05-15' },
    { wrapper: 'ISA', ticker: 'VWRP', name: 'Vanguard FTSE All-World (Acc)', units: 330, value: 40030, ocf: 0.19, contribution: 250, kind: 'fund', subClass: 'worldGrowth', asOf: '2026-05-15' }
  ] });
  await saveStressForm({
    currentAge: 48, retired: false, retireAge: 60, spStartDate: '22 February 2046', spWeeklyAmount: 230.25, duration: 35, accumulation,
    equityMin: 250000, bondMin: 50000, cashTarget: 10000, isaBalance: 40000, isaDrawdownStrategy: 'minimiseEarlyTax',
    baseSalary: 36000, incomeShape: 'phases', incomeSteps: [{ fromAge: 60, amount: 36000 }, { fromAge: 68, amount: 31000 }],
    equityGlideEnabled: true, strategyId: 'pots-and-valves'
  });
  await stageTick();
  at('2026-07-15T12:30:00.000Z');
  await lockFromStress();
  // recordAccumulationMonth(): one light line a month while saving.
  for (const [date, sipp, isa] of [['2026-07', 318400, 41100], ['2026-08', 322950, 41700], ['2026-09', 319800, 41450]]) {
    at(date + '-28T20:00:00.000Z');
    const hist = (await Scn.getActiveAccumulationHistory()).filter((r) => r.date !== date);
    hist.push({ date, sipp, isa, gia: 0, total: sipp + isa, recordedAt: new Date().toISOString() });
    await Scn.saveActiveAccumulationHistory(hist);
  }
  await stageTick();
  [out['05-saver-committed']] = exportDocs({ [id]: 'Wb6RjN1kPf3QsLh7ZtGy' });
}

// 06 — PRE-6.4.0: last saved on 6.2.x. No Timing fields at all (currentAge, currentAgeAsOf, retired, retireAge,
//      firstTaxYear, potAtRetirement did not exist — `git show v6.3.0:src/storage/ScenarioRepository.js`), the
//      Stress copy still carries the "Declining with age" spending profile, no journey/holdings/plan document
//      (6.5–6.13). Locked the old way — by its first monthly record — so its history is stamped against Decision
//      settings that must not move when migrateTiming back-fills the Stress side on load.
{
  startGuestStore(); at('2026-03-02T10:00:00.000Z');
  const id = await newPlan('Plan A', '', ['stress', 'decision']);
  const TIMING_6_4 = ['currentAge', 'currentAgeAsOf', 'retired', 'retireAge', 'firstTaxYear', 'potAtRetirement'];
  // Written straight to the scenario and never read through StressRepository: its load path would fold in the
  // Budget's age and back-fill the 6.4 fields, which is exactly what this fixture must arrive WITHOUT.
  const old = { ...(await Scn.getActiveStressSettings()), configured: true, equityMin: 520000, bondMin: 260000, cashTarget: 90000, duration: 35, baseSalary: 42000, other: 0,
    statePension: 11973, statePensionYear: 9, shapeAgeNow: 58, incomeShape: 'phases', incomeSteps: [{ fromAge: 58, amount: 42000 }, { fromAge: 72, amount: 36000 }],
    isaBalance: 30000, spendingProfile: 'declining', equityGlideEnabled: false, diversifierStart: 0, strategyId: 'pots-and-valves', strategyParams: {}, taggedFunds: [] };
  for (const k of TIMING_6_4) delete old[k];
  old.targetSchedule = compileSteps(old, 58);
  await Scn.saveActiveStressSettings(old);
  await Scn.saveActiveDecisionSettings({ ...(await Scn.getActiveDecisionSettings()), equityMin: 520000, bondMin: 260000, cashTarget: 90000, duration: 35, baseSalary: 42000, isaBalance: 30000, statePension: 11973, statePensionYear: 9, configured: true });
  drop();
  at('2026-04-10T08:00:00.000Z');
  await setUpTaxYear('2026-04');
  for (const [ym, equity, bond, cash] of [['2026-04', 531000, 262000, 90000], ['2026-05', 540500, 263100, 88200], ['2026-06', 527900, 261700, 89400]]) { at(ym + '-10T08:05:00.000Z'); await recordMonth(ym, { equity, bond, cash, isa: 30000 }, { pre64: true }); }
  const [doc] = exportDocs({ [id]: 'Ae2HsK9dMx4UoPj6CvBq' });
  for (const k of TIMING_6_4) if (k in doc.stressTool.settings) throw new Error('06: a 6.4.0 timing field (' + k + ') crept into the Stress settings while building');
  if ('firstTaxYear' in doc.decisionTool.settings) throw new Error('06: the Decision copy was handed a first tax year while building');
  if (doc.stressTool.settings.spendingProfile !== 'declining') throw new Error('06: the declining profile was migrated away while building');
  if (!doc.decisionTool.settings.locked) throw new Error('06: the first record did not lock the plan');
  out['06-pre-6.4-no-timing'] = doc;
}

// 07 — PRE-6.13.0: ONE flat strategyParams bag holding every strategy's dials side by side, the Stress fund
//      list doubling as "my funds", no strategyState and no scenario.holdings. A gilt-rotation draft whose bag
//      still carries Floor-to-age, Ladder & Ratchet, Floor & Flex, Buckets and Bridge keys, copied to Decision.
{
  startGuestStore(); at('2026-09-05T17:45:00.000Z');
  const id = await newPlan('Rotation what-if', 'Tried most strategies on the way here');
  await saveStressForm({
    currentAge: 58, firstTaxYear: 2027, spStartDate: '30 June 2035', spWeeklyAmount: 226.4, duration: 34,
    equityMin: 210000, bondMin: 405000, cashTarget: 65000, isaBalance: 40000, isaDrawdownStrategy: 'minimiseEarlyTax',
    baseSalary: 31000, incomeShape: 'phases', incomeSteps: [{ fromAge: 59, amount: 31000 }, { fromAge: 70, amount: 27000 }, { fromAge: 80, amount: 23000 }],
    allocMode: 'funds', taggedFunds: [
      { ticker: 'VWRP', value: 210000, wrapper: 'SIPP', subClass: 'worldGrowth' },
      { ticker: 'INXG', value: 290000, wrapper: 'SIPP', subClass: 'indexLinked' },
      { ticker: 'IGLS', value: 115000, wrapper: 'SIPP', subClass: 'shortGilts' },
      { ticker: 'XSTR', value: 65000, wrapper: 'SIPP', subClass: 'moneyMarket' },
      { ticker: 'VWRP', value: 40000, wrapper: 'ISA', subClass: 'worldGrowth' }
    ],
    strategyId: 'gilt-rotation', strategyParams: { sippTotal: 680000, isaTotal: 40000, cashYears: 2, bridgeCash: 17500, rotateCutAge: 80, rotateTrigger: 30, rotateDisarmYears: 5 }
  });
  // 6.12.x wrote readStrategyParams() unfiltered: `{ ...saved, <this strategy's inputs> }`, so every earlier
  // strategy's keys rode along. Re-create that bag and remove the 6.13.0 per-strategy stash.
  const bag = { sippTotal: 680000, isaTotal: 40000, cashYears: 2, bridgeCash: 17500, rotateCutAge: 80, rotateTrigger: 30, rotateDisarmYears: 5,
    floorToAge: 80, ladderYears: 15, drawAnnual: 0, triggerMode: 'band', bandThreshold: 1.2, essentialsAnnual: 18000, horizonAge: 92, sleeveRate: 0.04, ratchet: 'none', bucketBand: 10, bridgeAge: 67 };
  const ss = { ...(await Str.getStressSettingsAsync()), strategyParams: bag };
  delete ss.strategyState;
  await Scn.saveActiveStressSettings(ss);
  await Scn.setActiveStrategy('gilt-rotation', bag);
  drop();
  await Dec.saveDecisionSettings(Scn.seedDecisionFromStress(await Str.getStressSettingsAsync(), await Dec.getDecisionSettingsAsync()));   // "Copy all from Stress"
  await stageTick();
  const [doc] = exportDocs({ [id]: 'Mn5GzE8rTa1YwDk3XoLp' });
  if (doc.holdings || doc.stressTool.settings.strategyState) throw new Error('07: a 6.13.0 field crept back in');
  out['07-pre-6.13-flat-params'] = doc;
}

// 08 — THE DOTTED-KEY BUG: saveScenario once used setDoc(..., { merge: true }) with keys like
//      'decisionTool.settings', which Firestore stored as LITERAL top-level fields. The nested maps kept their
//      creation-time defaults; every later edit went into the phantom fields and was never read back.
{
  startGuestStore(); at('2025-11-03T09:00:00.000Z');
  const id = await newPlan('My Plan', '', ['stress', 'decision']);
  const [asCreated] = exportDocs({ [id]: 'Pc9TfU3yLb7JqRm2HsVe' });
  at('2025-11-03T09:20:00.000Z');
  await Scn.renameScenario(id, 'Joint pot — cautious'); drop();
  // The bug is older than the Timing block: settings are written as that build wrote them (no 6.4 fields), and
  // the repository saves below land nested here — the phantom shape is put back on export.
  const old = { ...(await Scn.getActiveStressSettings()), configured: true, shapeAgeNow: 64, statePension: 11500, statePensionYear: 3, duration: 28, equityMin: 240000, bondMin: 200000, cashTarget: 60000, isaBalance: 18000, baseSalary: 27500,
    spendingProfile: 'flat', equityGlideEnabled: false, diversifierStart: 0, taggedFunds: [] };
  for (const k of ['currentAge', 'currentAgeAsOf', 'retired', 'retireAge', 'firstTaxYear', 'potAtRetirement']) delete old[k];
  await Scn.saveActiveStressSettings(old);
  await Scn.saveActiveDecisionSettings({ ...(await Scn.getActiveDecisionSettings()), equityMin: 240000, bondMin: 200000, cashTarget: 60000, duration: 28, baseSalary: 27500, isaBalance: 18000, spStartDate: '12 May 2028', spWeeklyAmount: 203.85 });
  drop();
  at('2026-04-09T09:00:00.000Z');
  await setUpTaxYear('2026-04');
  // Records written straight to history (no auto-lock, no settings stamp: both are later than the bug).
  for (const [ym, equity, bond, cash] of [['2026-04', 243000, 201000, 60000], ['2026-05', 246200, 200400, 58100]]) {
    at(ym + '-09T09:10:00.000Z');
    const rec = decisionToHistory(await decideMonth(ym, { equity, bond, cash, isa: 18000 }, { pre64: true }));
    await Dec.addHistoryRecord(rec); drop();
  }
  const [final] = exportDocs({ [id]: 'Pc9TfU3yLb7JqRm2HsVe' });
  out['08-dotted-keys'] = { id: final.id, ...sortKeys({ ...asCreated, id: undefined, lastModified: final.lastModified,
    'planDetails.name': final.planDetails.name,
    'stressTool.settings': final.stressTool.settings,
    'decisionTool.settings': final.decisionTool.settings,
    'decisionTool.taxYears': final.decisionTool.taxYears,
    'decisionTool.history': final.decisionTool.history }) };
}

// 09 + 10 — A COUPLE: two per-person plans in one account, each naming the other as its household partner.
{
  startGuestStore(); at('2026-08-22T15:00:00.000Z');
  const tools = ['budget', 'stress', 'decision', 'accumulation', 'household'];
  const idA = await newPlan('Ours — Asha', 'Retired; drawing first', tools);
  // 7.4.0: year 0 is the tax year Asha stopped work (May 2026), never a later one (next April, 2027/28, before 7.4.0): one
  // more year to the same end age
  await saveStressForm({ currentAge: 64, firstTaxYear: 2026, spStartDate: '2 October 2028', spWeeklyAmount: 198.4, duration: 31,
    equityMin: 210000, bondMin: 110000, cashTarget: 30000, isaBalance: 22000, baseSalary: 24000, incomeShape: 'flat', strategyId: 'pots-and-valves' });
  await Str.saveStressSettings({ stoppedWork: '2026-05' });   // the Timing block's month box (6.51.0)
  { const b = await getBudgetAsync(); b.sharedWithPartner = true; b.mySharePct = 50; await saveBudget(b); }
  await stageTick();
  const idB = await newPlan('Ours — Ben', 'Working to 62', tools, {}, true);
  await Scn.switchScenario(idB); drop();
  const accumulation = { currentAge: 58, retirementAge: 62, salary: 41000, potNow: 221000, netMonthly: 400, schemeType: 'ras', employerMonthly: 210, escalationPct: 0 };
  await Scn.saveActiveAccumulation(accumulation);
  await saveStressForm({ currentAge: 58, retired: false, retireAge: 62, spStartDate: '17 January 2035', spWeeklyAmount: 230.25, duration: 32, accumulation,
    equityMin: 150000, bondMin: 60000, cashTarget: 11000, isaBalance: 9000, baseSalary: 18000, incomeShape: 'flat', strategyId: 'pots-and-valves' });
  { const b = await getBudgetAsync(); b.sharedWithPartner = true; b.mySharePct = 50; await saveBudget(b); }
  await Scn.setHouseholdPartnerId(idA);
  await stageTick();
  await Scn.switchScenario(idA); drop();
  await Scn.setHouseholdPartnerId(idB);
  const docs = exportDocs({ [idA]: 'Ra1CoupleAshaQ7wXz4N', [idB]: 'Rb2CoupleBenK5mVy8Ju' });
  out['09-couple-a'] = docs.find((d) => d.id === 'Ra1CoupleAshaQ7wXz4N');
  out['10-couple-b'] = docs.find((d) => d.id === 'Rb2CoupleBenK5mVy8Ju');
}

// 11 — THE GUEST DEMO: exactly what startGuest() creates from DEMO_PLANS['1m'] — imported from GuestPlans.js (where
//      it has lived since 6.23.0; until 6.37.0 this read a literal out of index.html and failed once it moved), so the
//      fixture follows the demo if it is edited.
{
  startGuestStore(); at('2026-09-29T20:15:00.000Z');
  const { DEMO_PLANS } = await import(S('services/GuestPlans.js'));
  const demo = DEMO_PLANS['1m'];
  if (!demo || !demo.stress) throw new Error('11: DEMO_PLANS[\'1m\'] not found in GuestPlans.js — the demo moved; update this step');
  const stress = JSON.parse(JSON.stringify(demo.stress));
  const id = await newPlan(demo.name, 'A guest plan — nothing is saved. Change anything.', ['budget', 'stress', 'decision', 'accumulation', 'household'], { stressSettings: stress }, true);
  [out['11-guest-demo']] = exportDocs({ [id]: 'guest-k3v9x1qa' });
}

// 12 — LUMPY: a DB pension, two income streams, two lump sums (one inherited pension), one-off spends and an
//      existing taxable account (GIA) holding a balanced mix, for a higher-rate holder. 7.4.0: year 0 is the tax year work
//      stopped (July 2026), never a later one (next April, 2027/28, before 7.4.0), as its next Save writes it: one more year
//      to the same end age, the first step from 59, and every figure counted from year 0 one year on (the same tax years).
{
  startGuestStore(); at('2026-09-11T13:30:00.000Z');
  const id = await newPlan('Everything at once', 'DB pension, rent, lumps in and out, and a GIA');
  await saveStressForm({
    currentAge: 59, firstTaxYear: 2026, spStartDate: '25 July 2034', spWeeklyAmount: 224.9, duration: 33,
    equityMin: 280000, bondMin: 120000, cashTarget: 40000, isaBalance: 60000, isaDrawdownStrategy: 'minimiseEarlyTax',
    baseSalary: 48000, incomeShape: 'phases', incomeSteps: [{ fromAge: 59, amount: 48000 }, { fromAge: 66, amount: 42000, glideToNext: true }, { fromAge: 76, amount: 34000 }],
    other: 1200, dbAmount: 9400, dbStartYear: 6, dbIndexation: 'lpi5',
    extraIncomes: [{ label: 'Rental flat', annual: 7200, startYear: 1, endYear: 15, indexation: 'cpi' }, { label: 'Part-time consulting', annual: 12000, startYear: 1, endYear: 4, indexation: 'level' }],
    windfalls: [{ label: 'Inherited pension', amount: 120000, year: 5, wrapper: 'pension' }, { label: 'Downsizing', amount: 90000, year: 10, wrapper: 'cash' }],
    extraWithdrawals: [{ label: 'New roof', amount: 25000, year: 3 }, { label: 'Camper van', amount: 36000, year: 7, years: 3 }],
    taxableStart: 85000, taxableMix: 'balanced', giaTaxBand: 'higher', bedAndIsa: true, relevantEarnings: 12000,
    strategyId: 'pots-and-valves'
  });
  await Str.saveStressSettings({ stoppedWork: '2026-07' });   // the Timing block's month box (6.51.0)
  await Scn.saveActiveHoldings({ source: 'paste', updatedAt: '2026-09-11', lines: [
    { wrapper: 'SIPP', ticker: 'SWDA', name: 'iShares Core MSCI World', units: 3150, value: 281900, ocf: 0.2, kind: 'fund', subClass: 'worldGrowth', asOf: '2026-09-10' },
    { wrapper: 'SIPP', ticker: 'VGOV', name: 'Vanguard UK Gilt', units: 7400, value: 119800, ocf: 0.05, kind: 'fund', subClass: 'longGilts', asOf: '2026-09-10' },
    { wrapper: 'SIPP', ticker: 'CSH2', name: 'Amundi Smart Overnight Return', units: 335, value: 40200, ocf: 0.1, kind: 'fund', subClass: 'moneyMarket', asOf: '2026-09-10' },
    { wrapper: 'ISA', ticker: 'SWDA', name: 'iShares Core MSCI World', units: 670, value: 59950, ocf: 0.2, kind: 'fund', subClass: 'worldGrowth', asOf: '2026-09-10' },
    { wrapper: 'GIA', ticker: 'VWRP', name: 'Vanguard FTSE All-World (Acc)', units: 410, value: 50100, ocf: 0.19, kind: 'fund', subClass: 'worldGrowth', asOf: '2026-09-10' },
    { wrapper: 'GIA', ticker: 'IGLS', name: 'iShares UK Gilts 0-5yr', units: 270, value: 34900, ocf: 0.07, kind: 'fund', subClass: 'shortGilts', asOf: '2026-09-10' }
  ] });
  await stageTick();
  [out['12-lumpy-db-gia']] = exportDocs({ [id]: 'Yk7DvB4nQe9SxTg1LmCw' });
}

// 13 — STOPPED AND DRAWING SINCE (research/plan-start.md §2 C/E, §7): Alex stopped work at the end of October 2024 and has
//      drawn the plan since, recording most months. The plan's year 0 is the tax year Alex stopped in, 2024/25, saved and
//      locked while it was the current one, so on the corpus day (30 September 2026) the plan is in its year 2, five months
//      in, with two years lived — the engines run it as seen from today. A LOCKED index-linked gilt ladder with four cash
//      years from year 0, so its first rung pays 2028/29: on the frozen gilt prices no linker still to mature pays 2027/28
//      (the 2026 linker matured in March 2026), so three cash years would leave 2027/28 uncovered. The cash years are held as
//      plain cash in the SIPP, and what the ladder leaves over stays in a world tracker. Months are recorded in each of the
//      three tax years so far, though not every month: none for February or March 2025, nor July to September 2025.
{
  startGuestStore(); at('2024-11-04T10:00:00.000Z');
  const id = await newPlan('Linkers since 2024', 'Stopped work in October 2024; drawing the plan since November');
  at('2024-11-06T19:30:00.000Z');
  await saveStressForm({
    currentAge: 61, firstTaxYear: 2024, spStartDate: '11 May 2030', spWeeklyAmount: 216.85, duration: 29,
    equityMin: 55000, bondMin: 285000, cashTarget: 110000, isaBalance: 15000, isaDrawdownStrategy: 'minimiseEarlyTax',
    baseSalary: 26500, incomeShape: 'phases', incomeSteps: [{ fromAge: 61, amount: 26500 }, { fromAge: 75, amount: 22000 }],
    strategyId: 'full-il-gilt', strategyParams: { sippTotal: 450000, isaTotal: 15000, cashYears: 4, bridgeCash: 0 }
  });
  await stageTick();
  at('2024-11-08T17:45:00.000Z');
  // What is held: two index-linked gilts from the frozen universe (public data), cash in the SIPP as plain cash, a world
  // tracker in the SIPP and a small ISA.
  const linkers = activeLinkers().gilts.filter((g) => g.type !== 'conventional' && g.tidm).slice(0, 2);
  await Scn.saveActiveHoldings({ source: 'typed', updatedAt: '2024-11-08', lines: [
    ...linkers.map((g, i) => ({ wrapper: 'SIPP', ticker: g.tidm, name: g.name, sedol: null, units: [20000, 18500][i], value: [26240.6, 23105.35][i], kind: 'gilt', asOf: '2024-11-07' })),
    { wrapper: 'SIPP', ticker: null, name: 'Cash in the SIPP', value: 110000, kind: 'cash', asOf: '2024-11-07' },
    { wrapper: 'SIPP', ticker: 'SWDA', name: 'iShares Core MSCI World', units: 3240, value: 290654.05, ocf: 0.2, kind: 'fund', subClass: 'worldGrowth', asOf: '2024-11-07' },
    { wrapper: 'ISA', ticker: 'SWDA', name: 'iShares Core MSCI World', units: 168, value: 15030.0, ocf: 0.2, kind: 'fund', subClass: 'worldGrowth', asOf: '2024-11-07' }
  ] });
  at('2024-11-12T09:00:00.000Z');
  await lockFromStress();
  at('2024-11-12T20:10:00.000Z');
  await setUpTaxYear('2024-11', { grossIncomeToDate: 23800, taxPaidToDate: 3290 });   // paid from April to the end of October
  const record = async (months, day) => {
    for (const [ym, equity, bond, cash, isa] of months) { at(ym + '-' + day + 'T19:00:00.000Z'); await recordMonth(ym, { equity, bond, cash, isa }); }
  };
  await record([['2024-11', 55600, 286900, 107800, 15100], ['2024-12', 56900, 287400, 105600, 15250], ['2025-01', 58100, 285100, 103400, 15400]], '20');
  at('2025-04-10T09:30:00.000Z');
  await stageTick();
  await setUpTaxYear('2025-04', { isaSavingsAllocation: 0 });
  // July to September 2025 are not recorded: the months between stay as gaps.
  await record([['2025-04', 52300, 289800, 96800, 15350], ['2025-05', 55800, 291200, 94600, 15700], ['2025-06', 57200, 288600, 92400, 15900],
    ['2025-10', 61900, 292500, 83600, 16400], ['2025-11', 61400, 294100, 81400, 16450], ['2025-12', 62700, 293000, 79200, 16600],
    ['2026-01', 63900, 295400, 77000, 16800], ['2026-02', 62800, 296800, 74800, 16750], ['2026-03', 60100, 297300, 72600, 16500]], '12');
  at('2026-04-08T09:30:00.000Z');
  await stageTick();
  await setUpTaxYear('2026-04', { isaSavingsAllocation: 0 });
  await record([['2026-04', 61700, 299900, 70400, 16900], ['2026-05', 63400, 301200, 68200, 17150], ['2026-06', 64100, 298700, 66000, 17300],
    ['2026-07', 65800, 302400, 63800, 17550], ['2026-08', 66300, 304000, 61600, 17600], ['2026-09', 67200, 303100, 59400, 17800]], '09');
  await stageTick();
  [out['13-stopped-drawing-since']] = exportDocs({ [id]: 'Lx4AlexP9cT2wM6hZr3K' });
}

// 18 — MOVED TO A NEW PLAN (research/plan-start.md §2 I, §7): Alex stopped work in July 2023 and lived on a LOCKED Pots &
//      Valves plan whose year 0 is that tax year, recording months in its two tax years. In March 2025 Alex moved to a new plan
//      from April 2025 ("Move to a new plan"): the old plan is closed at the end of March 2025 and kept, the new one is a
//      draft made from its figures with year 0 = 2025/26, its pots read from what Alex holds (updated that month). Two files,
//      linked both ways: the closed plan (18-moved-to-new-plan) and the plan that carries it on (18-moved-to-new-plan-next).
{
  startGuestStore(); at('2023-08-14T10:00:00.000Z');
  const id = await newPlan('Pots and valves 2023', 'Stopped work in July 2023');
  at('2023-08-16T19:30:00.000Z');
  await saveStressForm({
    currentAge: 62, firstTaxYear: 2023, spStartDate: '9 June 2028', spWeeklyAmount: 221.2, duration: 30,
    equityMin: 215000, bondMin: 150000, cashTarget: 48000, isaBalance: 32000, isaDrawdownStrategy: 'minimiseEarlyTax',
    baseSalary: 25500, incomeShape: 'phases', incomeSteps: [{ fromAge: 62, amount: 25500 }, { fromAge: 76, amount: 21000 }],
    strategyId: 'pots-and-valves'
  });
  await Str.saveStressSettings({ stoppedWork: '2023-07' });   // the Timing block's month box (6.51.0)
  drop();
  await stageTick();
  at('2023-08-18T17:45:00.000Z');
  await Scn.saveActiveHoldings({ source: 'typed', updatedAt: '2023-08-18', lines: [
    { wrapper: 'SIPP', ticker: 'VWRP', name: 'Vanguard FTSE All-World (Acc)', units: 2150, value: 214800, ocf: 0.19, kind: 'fund', subClass: 'worldGrowth', asOf: '2023-08-17' },
    { wrapper: 'SIPP', ticker: 'VGOV', name: 'Vanguard UK Gilt', units: 9100, value: 150300, ocf: 0.05, kind: 'fund', subClass: 'longGilts', asOf: '2023-08-17' },
    { wrapper: 'SIPP', ticker: 'CSH2', name: 'Amundi Smart Overnight Return', units: 400, value: 47900, ocf: 0.1, kind: 'fund', subClass: 'moneyMarket', asOf: '2023-08-17' },
    { wrapper: 'ISA', ticker: 'VWRP', name: 'Vanguard FTSE All-World (Acc)', units: 320, value: 31950, ocf: 0.19, kind: 'fund', subClass: 'worldGrowth', asOf: '2023-08-17' }
  ] });
  at('2023-08-20T09:00:00.000Z');
  await lockFromStress();
  at('2023-08-20T20:10:00.000Z');
  await setUpTaxYear('2023-08', { grossIncomeToDate: 2100, taxPaidToDate: 0 });
  const record = async (months, day) => {
    for (const [ym, equity, bond, cash, isa] of months) { at(ym + '-' + day + 'T19:00:00.000Z'); await recordMonth(ym, { equity, bond, cash, isa }); }
  };
  await record([['2023-08', 214900, 150100, 46100, 32000], ['2023-09', 211300, 149200, 44200, 32100], ['2023-10', 206800, 148600, 42300, 31800],
    ['2023-11', 213700, 150900, 40400, 32300], ['2023-12', 219200, 152400, 38500, 32600]], '21');
  at('2024-04-09T09:30:00.000Z');
  await stageTick();
  await setUpTaxYear('2024-04', { isaSavingsAllocation: 0 });
  await record([['2024-04', 224100, 151800, 46600, 33100], ['2024-05', 226300, 152300, 44700, 33300], ['2024-06', 227900, 153100, 42800, 33500],
    ['2024-07', 229400, 153600, 40900, 33600], ['2024-09', 231800, 154200, 37100, 33900], ['2024-10', 230200, 154700, 35200, 33800],
    ['2024-11', 234600, 155100, 33300, 34100], ['2024-12', 236100, 155600, 31400, 34300], ['2025-01', 238300, 156000, 29500, 34500],
    ['2025-02', 237200, 156500, 27600, 34400]], '11');
  // March 2025: what Alex holds, updated; then "Move to a new plan" from April 2025, as the planner makes it (src/ui/planCloseUi.js)
  at('2025-03-05T18:20:00.000Z');
  await Scn.saveActiveHoldings({ source: 'typed', updatedAt: '2025-03-05', lines: [
    { wrapper: 'SIPP', ticker: 'VWRP', name: 'Vanguard FTSE All-World (Acc)', units: 2010, value: 236500, ocf: 0.19, kind: 'fund', subClass: 'worldGrowth', asOf: '2025-03-04' },
    { wrapper: 'SIPP', ticker: 'VGOV', name: 'Vanguard UK Gilt', units: 9150, value: 156700, ocf: 0.05, kind: 'fund', subClass: 'longGilts', asOf: '2025-03-04' },
    { wrapper: 'SIPP', ticker: 'CSH2', name: 'Amundi Smart Overnight Return', units: 215, value: 25800, ocf: 0.1, kind: 'fund', subClass: 'moneyMarket', asOf: '2025-03-04' },
    { wrapper: 'ISA', ticker: 'VWRP', name: 'Vanguard FTSE All-World (Acc)', units: 330, value: 34400, ocf: 0.19, kind: 'fund', subClass: 'worldGrowth', asOf: '2025-03-04' }
  ] });
  at('2025-03-10T20:00:00.000Z');
  drop();
  const old = await Scn.getActiveScenarioAsStored();
  const now = new Date();
  const nextId = await createScenario(successorOf(old, { month: '2025-04', name: 'Pots and valves from April 2025', now }));
  await saveScenario(old.id, closeWrite(old, { month: '2025-04', nextPlanId: nextId, now }));
  drop();
  await stageTick();   // the closed plan's journey: its stage, closed
  await Scn.switchScenario(nextId);
  at('2025-03-10T20:05:00.000Z');
  await stageTick();
  const docs = exportDocs({ [id]: 'Mv8AlexQ2rT6nW3kPz7C', [nextId]: 'Mv8AlexN5sB1yH9dLx4J' });
  out['18-moved-to-new-plan'] = docs.find((d) => d.id === 'Mv8AlexQ2rT6nW3kPz7C');
  out['18-moved-to-new-plan-next'] = docs.find((d) => d.id === 'Mv8AlexN5sB1yH9dLx4J');
}

// 19 — BACK TO WORK (research/plan-start.md §2 J, §7): Alex stopped work in September 2023 at 57 and drew on a LOCKED Pots &
//      Valves plan whose year 0 is that tax year, recording months with income taken from the pension in three tax years. In
//      June 2025 Alex went back to work from July 2025 ("I'm going back to work"), expecting to stop again in March 2029: the
//      drawing plan is closed at the end of June 2025 and kept; a saving plan made from its figures carries it on — not
//      retired, its year 0 2028/29 (the tax year of the second stop), its pots what Alex held that month, and the person's
//      fact of money taken flexibly carried from the first month drawn (`flexibleAccess`). Then what Alex pays in, saved on
//      its Accumulation page. Two files, linked both ways: the closed plan (19-back-to-work) and the saving plan
//      (19-back-to-work-saving).
{
  startGuestStore(); at('2023-09-25T10:00:00.000Z');
  const id = await newPlan('Drawing from 57', 'Stopped work in September 2023');
  at('2023-09-27T19:30:00.000Z');
  await saveStressForm({
    currentAge: 57, firstTaxYear: 2023, spStartDate: '17 November 2032', spWeeklyAmount: 227.4, duration: 33,
    equityMin: 168000, bondMin: 96000, cashTarget: 36000, isaBalance: 21000, isaDrawdownStrategy: 'minimiseEarlyTax',
    baseSalary: 22200, incomeShape: 'phases', incomeSteps: [{ fromAge: 57, amount: 22200 }, { fromAge: 67, amount: 17400 }],
    strategyId: 'pots-and-valves'
  });
  await Str.saveStressSettings({ stoppedWork: '2023-09' });   // the Timing block's month box (6.51.0)
  drop();
  await stageTick();
  at('2023-09-29T17:45:00.000Z');
  await Scn.saveActiveHoldings({ source: 'typed', updatedAt: '2023-09-29', lines: [
    { wrapper: 'SIPP', ticker: 'VWRP', name: 'Vanguard FTSE All-World (Acc)', units: 1680, value: 167900, ocf: 0.19, kind: 'fund', subClass: 'worldGrowth', asOf: '2023-09-28' },
    { wrapper: 'SIPP', ticker: 'VGOV', name: 'Vanguard UK Gilt', units: 5820, value: 96100, ocf: 0.05, kind: 'fund', subClass: 'longGilts', asOf: '2023-09-28' },
    { wrapper: 'SIPP', ticker: 'CSH2', name: 'Amundi Smart Overnight Return', units: 300, value: 35950, ocf: 0.1, kind: 'fund', subClass: 'moneyMarket', asOf: '2023-09-28' },
    { wrapper: 'ISA', ticker: 'VWRP', name: 'Vanguard FTSE All-World (Acc)', units: 210, value: 20900, ocf: 0.19, kind: 'fund', subClass: 'worldGrowth', asOf: '2023-09-28' }
  ] });
  at('2023-10-01T09:00:00.000Z');
  await lockFromStress();
  at('2023-10-01T20:10:00.000Z');
  await setUpTaxYear('2023-10', { grossIncomeToDate: 0, taxPaidToDate: 0 });
  const record = async (months, day) => {
    for (const [ym, equity, bond, cash, isa] of months) { at(ym + '-' + day + 'T19:00:00.000Z'); await recordMonth(ym, { equity, bond, cash, isa }); }
  };
  await record([['2023-10', 166200, 95700, 34400, 20700], ['2023-11', 171900, 96800, 32900, 21300], ['2023-12', 176300, 97900, 31400, 21850],
    ['2024-01', 177800, 97400, 29900, 21950], ['2024-02', 180100, 97100, 28400, 22150]], '22');
  at('2024-04-10T09:30:00.000Z');
  await stageTick();
  await setUpTaxYear('2024-04', { isaSavingsAllocation: 0 });
  await record([['2024-04', 181700, 96600, 34900, 22300], ['2024-05', 183900, 96900, 33400, 22550], ['2024-06', 185200, 97300, 31900, 22700],
    ['2024-08', 182800, 98400, 28900, 22500], ['2024-10', 187300, 98900, 25900, 22900], ['2024-12', 190400, 98200, 22900, 23200],
    ['2025-02', 192100, 97800, 19900, 23350]], '14');
  at('2025-04-09T09:30:00.000Z');
  await stageTick();
  await setUpTaxYear('2025-04', { isaSavingsAllocation: 0 });
  await record([['2025-04', 190600, 97500, 33600, 23400], ['2025-05', 193800, 98100, 32100, 23700]], '16');
  // June 2025: what Alex holds, updated; then "I'm going back to work" from July 2025, as the planner makes it (src/ui/planCloseUi.js)
  at('2025-06-12T18:20:00.000Z');
  await Scn.saveActiveHoldings({ source: 'typed', updatedAt: '2025-06-12', lines: [
    { wrapper: 'SIPP', ticker: 'VWRP', name: 'Vanguard FTSE All-World (Acc)', units: 1690, value: 195200, ocf: 0.19, kind: 'fund', subClass: 'worldGrowth', asOf: '2025-06-11' },
    { wrapper: 'SIPP', ticker: 'VGOV', name: 'Vanguard UK Gilt', units: 5950, value: 98300, ocf: 0.05, kind: 'fund', subClass: 'longGilts', asOf: '2025-06-11' },
    { wrapper: 'SIPP', ticker: 'CSH2', name: 'Amundi Smart Overnight Return', units: 255, value: 30600, ocf: 0.1, kind: 'fund', subClass: 'moneyMarket', asOf: '2025-06-11' },
    { wrapper: 'ISA', ticker: 'VWRP', name: 'Vanguard FTSE All-World (Acc)', units: 215, value: 23800, ocf: 0.19, kind: 'fund', subClass: 'worldGrowth', asOf: '2025-06-11' }
  ] });
  at('2025-06-14T20:00:00.000Z');
  drop();
  const old = await Scn.getActiveScenarioAsStored();
  const now = new Date();
  const nextId = await createScenario(successorOf(old, { month: '2025-07', name: 'Saving again from July 2025', now, reason: 'working', stop: { month: '2029-03' } }));
  await saveScenario(old.id, closeWrite(old, { month: '2025-07', nextPlanId: nextId, now, reason: 'working' }));
  drop();
  await stageTick();   // the closed plan's journey: its stage, closed once June 2025 has passed
  await Scn.switchScenario(nextId);
  at('2025-06-14T20:05:00.000Z');
  await stageTick();
  // August 2025: what Alex pays in from the new job, on the saving plan's Accumulation page (saveAccumulationUI: the nine keys)
  at('2025-08-03T19:00:00.000Z');
  const acc = await Scn.getActiveAccumulation();
  await Scn.saveActiveAccumulation({ currentAge: acc.currentAge, retirementAge: acc.retirementAge, salary: 36000, potNow: acc.potNow, netMonthly: 400, schemeType: 'ras', employerMonthly: 250, escalationPct: 0, isaMonthly: 0 });
  drop();
  const docs = exportDocs({ [id]: 'Bw9AlexK3dR7tQ2mZx5L', [nextId]: 'Bw9AlexS6fH1pN8vYc4T' });
  out['19-back-to-work'] = docs.find((d) => d.id === 'Bw9AlexK3dR7tQ2mZx5L');
  out['19-back-to-work-saving'] = docs.find((d) => d.id === 'Bw9AlexS6fH1pN8vYc4T');
}

// ---- Write the fixtures, then the snapshot of what each one answers at the corpus clock ---------------------
// --snapshot-only keeps the committed fixtures: they are saved plans as earlier versions wrote them, and rebuilding them
// with today's code would quietly turn every one into today's shape. --only=<name>[,<name>…] writes just the fixtures
// named (one added to the corpus) and keeps every other committed one as it is, for the same reason.
const SNAPSHOT_ONLY = process.argv.includes('--snapshot-only');
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice('--only='.length).split(',').filter(Boolean);
if (ONLY.length) {
  for (const name of ONLY) {
    if (!out[name]) throw new Error('--only: no fixture named ' + name + ' (built: ' + Object.keys(out).join(', ') + ')');
    writeFileSync(join(HERE, name + '.json'), JSON.stringify(out[name], null, 1) + '\n');
  }
} else if (!SNAPSHOT_ONLY) {
  for (const f of readdirSync(HERE)) if (/^\d\d-.*\.json$/.test(f)) unlinkSync(join(HERE, f));   // a renamed fixture leaves no orphan
  for (const [name, doc] of Object.entries(out)) writeFileSync(join(HERE, name + '.json'), JSON.stringify(doc, null, 1) + '\n');
}
const names = SNAPSHOT_ONLY || ONLY.length ? readdirSync(HERE).filter((f) => /^\d\d-.*\.json$/.test(f)).map((f) => f.slice(0, -5)) : Object.keys(out);

at(CORPUS_NOW);
const snapshot = { corpusNow: CORPUS_NOW, market, plans: {} };
let bad = 0;
for (const name of names.sort()) {
  const raw = JSON.parse(readFileSync(join(HERE, name + '.json'), 'utf8'));
  const { record, problems } = await evaluatePlan(raw, { name });
  snapshot.plans[name] = record;
  say((problems.length ? 'FAIL ' : 'ok   ') + name.padEnd(26) + ' ' + String(record.stage).padEnd(17) + ' ' + String(record.strategyId).padEnd(17) + ' checksum ' + record.decisionChecksum + (record.headline && record.headline.affordable ? '  ruin ' + record.headline.ruinHist + '/' + record.headline.ruinMc : '  NOT AFFORDABLE'));
  for (const p of problems) { bad++; say('       - (' + p.check + ') ' + p.msg); }
}
writeFileSync(join(HERE, 'snapshot.json'), JSON.stringify(snapshot, null, 1) + '\n');
say('\nWrote ' + (SNAPSHOT_ONLY ? 'snapshot.json for ' + names.length + ' committed fixtures' : ONLY.length ? ONLY.join(', ') + ' + snapshot.json for ' + names.length + ' fixtures' : Object.keys(out).length + ' fixtures + snapshot.json') + (bad ? ' — ' + bad + ' PROBLEM(S) above (the corpus test will fail on them)' : ''));
process.exit(0);   // firebase keeps handles open
