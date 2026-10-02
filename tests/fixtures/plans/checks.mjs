/**
 * The four plan-corpus checks, in ONE place — used by the generator (build.mjs, which records the snapshot),
 * by tests/planCorpus.test.js (which compares against it) and by tests/ownerPlan.local.test.js (the owner's
 * real plan, never committed). One implementation so "what the snapshot means" cannot drift between them.
 *
 * A saved plan is read the way the app reads it: normalizeScenario → the repositories. The repositories are
 * driven through GUEST mode (FirestoreService keeps a guest's plans in sessionStorage), which is the only way
 * to reach the un-exported load migrations (migrateStressDB, the Decision spending migration) without a
 * network or a mock that would hide them.
 *
 * No clock and no market data of its own: the CALLER pins both (build.mjs patches Date, the tests use
 * vi.setSystemTime; both call pinMarket()). Every engine here reads `new Date()`, so an unpinned caller gets
 * answers that move every 6 April and every night the gilt file refreshes.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { normalizeScenario } from '../../../src/firebase/scenarioMigration.js';
import { auth } from '../../../src/firebase/config.js';
import { enterGuestMode, isGuest } from '../../../src/firebase/AuthService.js';
import { clearGuestData } from '../../../src/firebase/FirestoreService.js';
import { getActiveScenarioAsync, invalidateScenarioCache } from '../../../src/storage/ScenarioRepository.js';
import { getStressSettingsAsync, invalidateStressCache, createSimulationConfigFromSettings } from '../../../src/storage/StressRepository.js';
import { loadDecisionDBAsync, invalidateCache as invalidateDecisionCache, decisionSettingsChecksum } from '../../../src/storage/DecisionRepository.js';
import { migrateTiming, deriveTiming } from '../../../src/services/PlanTiming.js';
import { sortLegacyParams } from '../../../src/services/StrategyState.js';
import { normaliseHoldings, emptyHoldings, holdingsSummary, linesFromTaggedFunds, numOrNull } from '../../../src/services/HoldingsRecord.js';
import { deriveStage } from '../../../src/services/LifeStage.js';
import { whereAmI } from '../../../src/services/PlanDocument.js';
import { planFromSettings, stressTestStrategy } from '../../../src/strategies/stressTest.js';
import { realYieldForYear, setLinkersOverride } from '../../../src/services/LinkerUniverse.js';
import { setEquityOverride } from '../../../src/services/EquityIndex.js';
import { simpleHash } from '../../../src/utils/MathUtils.js';

const HERE = dirname(fileURLToPath(import.meta.url));
export const PLANS_DIR = HERE;
export const MARKET_DIR = join(HERE, 'market');
export const GUEST_KEY = 'pt_guest_scenarios';   // FirestoreService's guest store (not exported there)
/** The instant every corpus answer is computed at. Mid tax year, clear of 6 April and of midnight in any UK/UTC zone. */
export const CORPUS_NOW = '2026-09-30T08:00:00.000Z';

/** The pre-restructure top-level fields normalizeScenario folds in and drops (its LEGACY_KEYS, not exported). */
const LEGACY_ROOT = ['decisionSettings', 'stressSettings', 'name', 'description', 'taxYears'];
const clone = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
/** Keys sorted at every depth — Firestore hands maps back in its own order, so nothing here may depend on it. */
export function sortKeys(v) {
  if (Array.isArray(v)) return v.map(sortKeys);
  if (isObj(v)) return Object.keys(v).sort().reduce((o, k) => { if (v[k] !== undefined) o[k] = sortKeys(v[k]); return o; }, {});
  return v;
}
/**
 * Numbers to 12 significant figures before hashing. The load migrations compute some settings (a declining
 * schedule's 0.95^n) with Math.pow, whose last bit differs between V8 versions: Node 20/22 give
 * 30652.710704197754 where Node 24 gives …758. A checksum of the raw doubles pins the JS engine, not the plan —
 * it passed on the owner's Mac (Node 24) and failed on the CI runner (Node 20).
 */
export function sig12(v) {
  if (typeof v === 'number') return Number.isFinite(v) ? Number(v.toPrecision(12)) : v;
  if (Array.isArray(v)) return v.map(sig12);
  if (isObj(v)) return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, sig12(x)]));
  return v;
}
const stable = (v) => JSON.stringify(sortKeys(v));
const same = (a, b) => stable(a) === stable(b);
const r0 = (x) => (typeof x === 'number' && Number.isFinite(x) ? Math.round(x) : x);
const r2 = (x) => (typeof x === 'number' && Number.isFinite(x) ? Math.round(x * 100) / 100 : x);

/**
 * Compare an evaluated record with its pinned copy (snapshot.json, or the owner's <name>.pinned.json).
 * Returns the differences as readable lines; [] means "the same plan, the same answers".
 *
 * EXACT for everything that is not a simulated amount: names, flags, stage, strategy, ages, tax years, the two
 * checksums (already on 12 significant figures — see sig12), counts, holdings totals (sums of what was typed)
 * and the ruin rates (a count of failed futures out of N: if one future flips, that is a real change).
 *
 * A TOLERANCE for the simulated money in the headline — the cones, the end pots, the worst 12 months, the
 * median spent — and for `coverage` (a continuous percentage):
 *     money:     equal when within £1, or within one part in a million of the figure, whichever is larger
 *     coverage:  equal when within 0.01 of a percentage point
 * Why a tolerance at all: those figures come out of thousands of Math.pow / Math.log / Math.cos calls, and the
 * language does not fix the last bit of any of them — Node 20 and Node 24 already disagree on 0.95^n (see
 * sig12), and browsers differ again. The drift is about one part in 10^13 of a figure, but the record stores
 * whole pounds, and a figure sitting on £…·50 rounds up on one machine and down on the other: a £1 difference
 * that is not a change to anything.
 * Why a tolerance and not "round both to the nearest £10": rounding only MOVES the cliff (…4.99 and …5.01 land
 * on different tens), so it can still fail on a last-bit difference, while hiding every real change under £10.
 * A tolerance has no cliff and hides only a change under £1 (under £4 on a £4m figure). Real changes are not
 * that small: the clock-change hour in the State Pension's first-year share — one hour of pension, once —
 * moved these figures by £1 to £15 and fails this comparison on every plan it touched.
 * The random stream itself is integer arithmetic (MathUtils.seededRng) and identical everywhere, so nothing
 * here is absorbing Monte Carlo noise.
 */
const MONEY_PATH = /^headline\.(worst12Min|worst12Median|terminalP\d+|spentMedian|cone\.(wealthP\d+|incomeP\d+)\[\d+\])$|^where\.stepAmount$/;
const COVERAGE_PATH = /^headline\.coverage$/;
export const MONEY_ABS_TOL = 1, MONEY_REL_TOL = 1e-6, COVERAGE_TOL = 0.01;
export function recordDiffs(actual, pinned, path = '', out = []) {
  const show = (v) => (v === undefined ? 'undefined' : JSON.stringify(v));
  const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
  if (isNum(actual) && isNum(pinned)) {
    const d = Math.abs(actual - pinned);
    // 1e-9: the slack for the subtraction itself (0.01 is not exactly representable)
    const tol = MONEY_PATH.test(path) ? Math.max(MONEY_ABS_TOL, MONEY_REL_TOL * Math.max(Math.abs(actual), Math.abs(pinned)))
      : COVERAGE_PATH.test(path) ? COVERAGE_TOL : null;
    if (tol == null ? actual !== pinned : d > tol + 1e-9) out.push(path + ': ' + show(actual) + ' (pinned ' + show(pinned) + ')');
  } else if (Array.isArray(actual) && Array.isArray(pinned)) {
    if (actual.length !== pinned.length) out.push(path + ': ' + actual.length + ' items (pinned ' + pinned.length + ')');
    else actual.forEach((x, i) => recordDiffs(x, pinned[i], path + '[' + i + ']', out));
  } else if (isObj(actual) && isObj(pinned)) {
    for (const k of [...new Set([...Object.keys(actual), ...Object.keys(pinned)])].sort()) recordDiffs(actual[k], pinned[k], path ? path + '.' + k : k, out);
  } else if (actual !== pinned) out.push((path || '(record)') + ': ' + show(actual) + ' (pinned ' + show(pinned) + ')');
  return out;
}

/**
 * Freeze the market: the gilt universe and the equity level come from the committed copies in market/, not
 * from src/data/*Snapshot.js, which the nightly data job rewrites. Returns the `as_of` dates for the record.
 */
export function pinMarket() {
  const gilts = JSON.parse(readFileSync(join(MARKET_DIR, 'gilts.json'), 'utf8'));
  const equity = JSON.parse(readFileSync(join(MARKET_DIR, 'equity.json'), 'utf8'));
  setLinkersOverride(gilts);
  setEquityOverride(equity);
  return { giltsAsOf: gilts.as_of || null, equityAsOf: equity.date || null };
}

/** Paths of every number that is NaN/±Infinity and every value that is undefined, under `v`. */
export function badValues(v, path = '', out = []) {
  if (v === undefined) out.push(path + ' is undefined');
  else if (typeof v === 'number' && !Number.isFinite(v)) out.push(path + ' is ' + v);
  else if (Array.isArray(v)) v.forEach((x, i) => badValues(x, path + '[' + i + ']', out));
  else if (isObj(v)) for (const [k, x] of Object.entries(v)) badValues(x, path ? path + '.' + k : k, out);
  return out;
}

function ensureSessionStorage() {
  if (typeof globalThis.sessionStorage !== 'undefined') return;
  const m = new Map();   // plain Node (build.mjs): the guest store needs somewhere to be read from
  globalThis.sessionStorage = { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => { m.set(k, String(v)); }, removeItem: (k) => { m.delete(k); } };
}

/**
 * Firebase reports "nobody is signed in" once, a moment after start-up, and AuthService's listener then sets
 * its current user to null — which silently ends a guest session entered before it (the repositories fall back
 * to DEFAULT settings, no error). Wait for that first report before entering guest mode.
 */
let settled = null;
export function authSettled() {
  if (!settled) settled = (async () => {
    try { if (auth && typeof auth.authStateReady === 'function') await auth.authStateReady(); } catch (e) { /* no auth: nothing to wait for */ }
    await new Promise((r) => setTimeout(r, 0));   // let AuthService's own listener run first
  })();
  return settled;
}

/** Put ONE scenario in the guest store as the active plan and drop every cache, so the next read is a cold load. */
export function seedGuestStore(scenario) {
  ensureSessionStorage();
  enterGuestMode();
  clearGuestData();
  globalThis.sessionStorage.setItem(GUEST_KEY, JSON.stringify([{ ...clone(scenario), isActive: true }]));
  invalidateScenarioCache(); invalidateDecisionCache(); invalidateStressCache();
}

/** The strategy headline in whole pounds / 2 dp — readable in a diff. Compared with recordDiffs(), which is what makes the pin survive a last-bit float difference but not a real change (rounding alone does not: see there). */
export function headlineOf(r, p) {
  if (!r.affordable) return { affordable: false, reason: r.reason ?? null };
  const N = p.durationYears;
  const marks = [...new Set([0, 5, 10, 20, N])].filter((y) => y <= N);
  const at = (arr) => marks.map((y) => r0(Array.isArray(arr) ? arr[Math.min(y, arr.length - 1)] : undefined));
  return {
    affordable: true,
    ruinHist: r2(r.ruin?.hist), ruinMc: r2(r.ruin?.mc), coverage: r2(r.coverage),
    worst12Min: r0(r.worst12?.min), worst12Median: r0(r.worst12?.median),
    terminalP10: r0(r.terminal?.p10), terminalP50: r0(r.terminal?.p50), terminalP90: r0(r.terminal?.p90),
    spentMedian: r0(r.spentMedian),
    guaranteedToAge: r.guaranteedToAge ?? null,
    cone: { years: marks, wealthP10: at(r.cones?.wealth?.p10), wealthP50: at(r.cones?.wealth?.p50), wealthP90: at(r.cones?.wealth?.p90), incomeP50: at(r.cones?.income?.p50) }
  };
}

/**
 * Run the four checks on one raw scenario document.
 * @returns {{ record: object, problems: Array<{check: 1|2|3|4, msg: string}>, normalized: object, stress: object, decision: object }}
 *   `problems` is empty when every check passes; `record` is what the snapshot / pinned file stores.
 */
export async function evaluatePlan(raw, { name = null } = {}) {
  const problems = [];
  let check = 1;   // which of the four checks a problem belongs to, so a test can fail the right one
  const note = (msg) => problems.push({ check, msg });
  const rawBefore = JSON.stringify(raw);

  // ---- (1) normalizeScenario: survives, leaves no phantom/legacy field, and a second pass changes nothing.
  await authSettled();
  const n1 = normalizeScenario(raw);
  const n2 = normalizeScenario(n1.scenario);
  if (JSON.stringify(raw) !== rawBefore) note('normalizeScenario mutated the raw document');
  if (n2.migrated) note('normalizeScenario is not idempotent: the second pass still reports a migration');
  if (!same(n2.scenario, n1.scenario)) note('normalizeScenario is not idempotent: the second pass changed the document');
  const stray = Object.keys(n1.scenario).filter((k) => k.includes('.') || LEGACY_ROOT.includes(k));
  if (stray.length) note('normalised document still has phantom/legacy root keys: ' + stray.join(', '));
  // Root keys travel untouched — all of them when nothing needed migrating; otherwise all but the ones the
  // migration rebuilds (the canonical maps, and any map a phantom 'x.y' field was folded into).
  const rebuilt = n1.migrated ? new Set(['planDetails', 'decisionTool', 'stressTool', 'isActive', 'enabledTools', ...Object.keys(raw).filter((k) => k.includes('.')).map((k) => k.split('.')[0])]) : new Set();
  for (const k of Object.keys(raw)) {
    if (k.includes('.') || LEGACY_ROOT.includes(k) || rebuilt.has(k)) continue;
    if (!same(n1.scenario[k], raw[k])) note('normalizeScenario lost or changed root key "' + k + '"');
  }
  const normalized = clone(n1.scenario);
  const ds0 = clone(normalized.decisionTool?.settings || {});
  const locked = !!ds0.locked;
  const checksumSaved = decisionSettingsChecksum(ds0);

  // ---- The app's own cold load (guest store → repositories → in-memory migrations).
  seedGuestStore(normalized);
  const stressLoaded = await getStressSettingsAsync();          // migrateStressDB: field renames, spending bake-in, migrateTiming
  const stress = sortLegacyParams(stressLoaded);                // + the 6.13.0 flat-bag sort the Settings page applies
  const db = await loadDecisionDBAsync();                       // + the Decision copy's spending migration
  const active = await getActiveScenarioAsync();
  const budget = active?.budgetTool?.settings || null;
  const decision = sortLegacyParams(migrateTiming(db.settings, budget));
  const checksumLoaded = decisionSettingsChecksum(decision);

  check = 2;
  // ---- (2) the Stress settings build a sim config and ONE strategy evaluation runs clean.
  const strategyId = stress.strategyId || 'pots-and-valves';
  let headline = null, timing = null;
  try {
    timing = deriveTiming(stress);
    const cfg = createSimulationConfigFromSettings({}, stress);
    const { targetSchedule, equityGlide, isaMix, subAsset, extraIncomes, windfalls, extraWithdrawals, taxableMix, ...scalars } = cfg;
    for (const [k, v] of Object.entries(scalars)) if (typeof v === 'number' && !Number.isFinite(v)) note('sim config: ' + k + ' is ' + v);
    for (const k of ['equityStart', 'bondStart', 'cashStart', 'years', 'pa', 'brl', 'hrl']) if (!(typeof cfg[k] === 'number' && Number.isFinite(cfg[k]))) note('sim config: ' + k + ' is not a number (' + cfg[k] + ')');
    // Mirrors strategyPlanFor() in index.html — the plan the Stress tab, the compare and the lock all run.
    const p = planFromSettings(stress, cfg, { yieldForYear: realYieldForYear, startAge: +stress.shapeAgeNow || 57 });
    const r = stressTestStrategy(strategyId, p);
    headline = headlineOf(r, p);
    for (const b of badValues(headline, 'headline')) note(b);
  } catch (e) {
    note('strategy evaluation threw: ' + (e && e.message ? e.message : e));
  }

  check = 3;
  // ---- (3) a locked plan's checksum does not move on load, its records still belong to it, its document is untouched.
  const history = Array.isArray(db.history) ? db.history : [];
  if (locked) {
    if (checksumLoaded !== checksumSaved) note('locked plan: decisionSettingsChecksum moved on load (' + checksumSaved + ' → ' + checksumLoaded + ')');
    // A stamp older than the key-order-independent hash can differ without the plan ever having been unlocked
    // (PlanLock.planDependents ignores stamps until unlockCount > 0); only a never-unlocked plan is held to it.
    const orphan = history.filter((h) => h && h.settingsChecksum !== undefined && h.settingsChecksum !== checksumLoaded);
    if (!(ds0.unlockCount > 0) && orphan.length) note('locked plan: ' + orphan.length + ' of ' + history.length + ' records carry a settings checksum that is not the plan\'s (' + orphan.slice(0, 3).map((h) => h.date).join(', ') + ')');
  }
  if (JSON.stringify(active?.planDocument ?? null) !== JSON.stringify(raw.planDocument ?? null)) note('planDocument is not byte-identical after normalise + load');
  if (JSON.stringify(active?.planDocumentArchive ?? null) !== JSON.stringify(raw.planDocumentArchive ?? null)) note('planDocumentArchive is not byte-identical after normalise + load');
  let where = null;
  if (raw.planDocument) {
    try {
      const w = whereAmI(raw.planDocument, { today: new Date(), history, accHistory: active?.accumulationTool?.history || [], holdings: active?.holdings || null, taxYears: db.taxYears || null });
      where = w ? { planYear: w.planYear, bridge: w.bridge, taxYear: w.taxYear, age: w.age, stepAmount: w.step ? r0(w.step.amount) : null, recorded: w.incomeThisYear.recorded, drawn: w.incomeThisYear.drawn, potBand: w.pot ? w.pot.band : null, savingBand: w.saving ? w.saving.band : null } : null;
      for (const b of badValues(where, 'whereAmI')) note(b);
    } catch (e) { note('whereAmI threw: ' + e.message); }
  }

  check = 4;
  // ---- (4) holdings normalise without loss (and the Stress "funds to test" list would import without loss).
  const rawH = raw.holdings;
  const rawLines = Array.isArray(rawH) ? rawH : (isObj(rawH) && Array.isArray(rawH.lines) ? rawH.lines : []);
  const H = normaliseHoldings(rawH);
  const identified = rawLines.filter((l) => isObj(l) && [l.ticker, l.name, l.sedol].some((x) => String(x == null ? '' : x).trim()));
  if (rawH == null && !same(H, emptyHoldings())) note('holdings: a plan without a record did not read as the empty record');
  if (H.lines.length !== identified.length) note('holdings: ' + identified.length + ' identified lines in, ' + H.lines.length + ' out');
  const sumRaw = identified.reduce((t, l) => t + (numOrNull(l.value) ?? 0), 0);
  const sumH = holdingsSummary(H);
  if (Math.abs(sumRaw - sumH.total) > 0.005) note('holdings: total value ' + sumRaw + ' in, ' + sumH.total + ' out');
  identified.forEach((l, i) => {
    const o = H.lines[i]; if (!o) return;
    for (const k of ['units', 'value', 'ocf', 'contribution']) if ((numOrNull(l[k]) ?? null) !== o[k]) note('holdings line ' + i + ': ' + k + ' ' + l[k] + ' → ' + o[k]);
    for (const k of ['ticker', 'sedol']) if ((String(l[k] == null ? '' : l[k]).trim().toUpperCase() || null) !== o[k]) note('holdings line ' + i + ': ' + k + ' ' + l[k] + ' → ' + o[k]);
    if ((String(l.name == null ? '' : l.name).trim() || null) !== o.name) note('holdings line ' + i + ': name changed');
  });
  if (!same(normaliseHoldings(H), H)) note('holdings: normaliseHoldings is not idempotent');
  if (isObj(rawH) && rawH.version === H.version && !same(H, rawH)) note('holdings: a current-version record was changed by normaliseHoldings');
  const funds = Array.isArray(stress.taggedFunds) ? stress.taggedFunds : [];
  const imported = linesFromTaggedFunds(funds);
  const fundsIdentified = funds.filter((f) => isObj(f) && [f.ticker, f.name, f.sedol].some((x) => String(x == null ? '' : x).trim()));
  if (imported.length !== fundsIdentified.length) note('funds to test: ' + fundsIdentified.length + ' identified funds, ' + imported.length + ' would import');
  const fundsTotal = fundsIdentified.reduce((t, f) => t + (numOrNull(f.value) ?? 0), 0);
  if (Math.abs(fundsTotal - holdingsSummary(imported).total) > 0.005) note('funds to test: value lost on import');

  check = 2;
  let stage = null;
  try { stage = deriveStage({ ...normalized, stressTool: { ...normalized.stressTool, settings: stress } }).key; } catch (e) { note('deriveStage threw: ' + e.message); }

  // Every read above went through the guest session; if it was dropped the settings read were defaults.
  if (!isGuest() || !active) { check = 0; note('the guest session was lost during the evaluation — the settings read back were not this plan\'s'); }

  const record = {
    name: name ?? (normalized.planDetails?.name || null),
    planName: normalized.planDetails?.name ?? null,
    migratedByNormalize: n1.migrated,
    locked, stage, strategyId,
    timingMode: timing ? timing.mode : null, firstTaxYear: timing ? timing.firstTaxYear : null, startAge: timing ? timing.shapeAgeNow : null,
    decisionChecksum: checksumLoaded,
    stressChecksum: simpleHash(sig12(sortKeys(stress))),   // 12 significant figures: see sig12
    historyMonths: history.length,
    taxYearsSetUp: Object.entries(db.taxYears || {}).filter(([, t]) => t && t.yearSetupComplete).map(([k]) => k).sort(),
    hasPlanDocument: !!raw.planDocument,
    holdings: { lines: H.lines.length, total: r2(sumH.total), bySipp: r2(sumH.byWrapper.SIPP), byIsa: r2(sumH.byWrapper.ISA), byGia: r2(sumH.byWrapper.GIA), byCash: r2(sumH.byWrapper.CASH) },
    fundsToTest: funds.length,
    where,
    headline
  };
  return { record, problems, normalized, stress, decision };
}
