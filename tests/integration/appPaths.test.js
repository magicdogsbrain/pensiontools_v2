/**
 * Phase B integration gate (strategy-engine brief §3): the golden matrix run through the SAME
 * code paths the app uses — settings → createSimulationConfigFromSettings → runMonteCarlo —
 * with the FULL per-run output vector pinned. Regenerating the pin is an explicit commit with
 * justification:  UPDATE_APP_PATHS=1 npx vitest run tests/integration/appPaths.test.js
 *
 * The pin is the VALUES, compared with a tolerance — not a hash of rounded values (what it was until
 * 6.14.0). Math.pow's last bit is not fixed by the language: V8 11 (Node 20) and V8 13 (Node 24) disagree
 * on about 1 in 120 of the engine's monthly factors (1.2318^(1/12) = 1.017524831903414 vs …4143), so every
 * simulated amount carries a difference of about one part in 10^12 between JS engines. A hash of
 * toFixed(6) pins the JS engine, not the plan: one value in 6,400 sat on a rounding boundary
 * (57020.5674575 → …457 on one, …458 on the other) and the 6.14.0 hash passed on Node 24 and failed on
 * Node 20. Rounding harder or differently only MOVES the boundary (12 significant figures repairs that
 * config and breaks another). A tolerance has no boundary — see recordDiffs in tests/fixtures/plans/checks.mjs.
 *   - EXACT: whether and when the run failed, the months in protection — and every whole number. A branch
 *     that flips (a month in protection, a different pot paying) moves these or moves money by pounds.
 *   - money: equal within one part in 10^9 of the figure, or a millionth of a pound, whichever is larger —
 *     a thousand times the engine-to-engine drift, a millionth of the smallest real change.
 */
import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

vi.mock('../../src/firebase/index.js', () => ({
  isFirebaseConfigured: () => false,
  isLoggedIn: () => false
}));

import { createSimulationConfigFromSettings } from '../../src/storage/StressRepository.js';
import { runMonteCarlo } from '../../src/services/SimulationEngine.js';

// Representative app-shaped SETTINGS (as saved by the UI), not raw engine configs.
const SETTINGS = {
  'risk-balanced-isa': {
    equityMin: 250000, bondMin: 200000, cashTarget: 50000, duration: 35,
    baseSalary: 48000, other: 0, statePension: 12000, statePensionYear: 8,
    pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates',
    protectionMult: 0.8, consecutiveLimit: 3, disableProtection: false,
    recoveryBuffer: 15000, hodlEnabled: false, hodlValue: 0,
    isaBalance: 60000, isaReturn: 0.03, isaDrawdownStrategy: 'minimiseEarlyTax'
  },
  'ufpls-phased-recycle': {
    equityMin: 300000, bondMin: 150000, cashTarget: 50000, duration: 30,
    baseSalary: 30000, other: 3000, statePension: 11500, statePensionYear: 5,
    pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates',
    protectionMult: 0.8, consecutiveLimit: 3, disableProtection: false,
    recoveryBuffer: 15000, hodlEnabled: true, hodlValue: 25000,
    isaBalance: 40000, accessMethod: 'ufpls', ufplsYears: 8, ufplsThenPcls: true,
    bandFillRecycle: true
  },
  'db-floor-schedule-divers': {
    equityMin: 400000, bondMin: 200000, cashTarget: 60000, duration: 32,
    baseSalary: 42000, other: 0, statePension: 12500, statePensionYear: 10,
    pa: 12570, brl: 50270, hrl: 125140, taxMode: 'frozen',
    protectionMult: 0.75, consecutiveLimit: 3, disableProtection: false,
    recoveryBuffer: 15000, hodlEnabled: false, hodlValue: 0,
    isaBalance: 20000, dbAmount: 8000, dbStartYear: 3, dbIndexation: 'lpi5',
    diversifierStart: 80000, spendingProfile: 'declining',
    targetSchedule: Array.from({ length: 33 }, (_, y) => 42000 - (y > 15 ? 6000 : 0)),
    extraIncomes: [{ startYear: 0, endYear: 4, annual: 6000 }],
    windfalls: [{ year: 6, amount: 50000 }]
  }
};

// Fund and platform charges (6.19.0): the same three settings as a new plan, or an unlocked plan after the schema-2
// migration, saves them — with the default charge, 0.5% a year. The three above carry none, as a plan locked before
// charges does (it runs at 0%). Both are live paths, so both are pinned, the uncharged ones unchanged.
const CHARGED_PCT = 0.5;
const CHARGED = Object.fromEntries(Object.entries(SETTINGS).map(([name, s]) => [name + ' · charges 0.5%', { ...s, chargesPct: CHARGED_PCT }]));
// How ISAs and savings grow (6.22.0, services/IsaGrowth.js): a new plan, or an unlocked plan after the schema-3 migration,
// carries the choice — "Mostly cash" by default, or "Invested like my pension". Both are live paths, so both are pinned,
// each beside its charged sibling (the same settings with the choice and nothing else). Every entry above carries no
// choice, as a plan locked before it does (its ISA grows at the fixed 3%), and does not move.
const ISA_CASH = Object.fromEntries(Object.entries(SETTINGS).map(([name, s]) => [name + ' · charges 0.5% · ISA mostly cash', { ...s, chargesPct: CHARGED_PCT, isaGrowth: 'cash' }]));
const ISA_INVESTED = Object.fromEntries(Object.entries(SETTINGS).map(([name, s]) => [name + ' · charges 0.5% · ISA invested', { ...s, chargesPct: CHARGED_PCT, isaGrowth: 'invested' }]));
const ALL = { ...SETTINGS, ...CHARGED, ...ISA_CASH, ...ISA_INVESTED };

const RUNS = 25;
const PIN_FILE = path.join(__dirname, 'fixtures', 'appPaths.pin.json');
const REL_TOL = 1e-9, ABS_TOL = 1e-6;
const EXACT = new Set(['failed', 'years', 'failMonth', 'protMonths']);

const vectorOf = (r) => ({
  failed: r.failed, years: r.years, failMonth: r.failMonth,
  final: r.final, finalReal: r.finalReal,
  finalEquity: r.finalEquity, finalBond: r.finalBond, finalCash: r.finalCash,
  finalIsa: r.finalIsa, finalDiversifier: r.finalDiversifier, finalHodl: r.finalHodl,
  protMonths: r.protMonths, hodlUsed: r.hodlUsed, divUsed: r.divUsed,
  totalTaxReal: r.totalTaxReal, pclsTaken: r.pclsTaken,
  potByYear: r.potByYear, isaByYear: r.isaByYear
});

/** Differences between a computed vector set and the pinned one, as readable lines; [] = the same output. */
function vectorDiffs(actual, pinned, where = '', out = [], key = '') {
  const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
  if (isNum(actual) && isNum(pinned)) {
    const tol = EXACT.has(key) ? 0 : Math.max(ABS_TOL, REL_TOL * Math.max(Math.abs(actual), Math.abs(pinned)));
    if (Math.abs(actual - pinned) > tol) out.push(`${where}: ${actual} (pinned ${pinned})`);
  } else if (Array.isArray(actual) && Array.isArray(pinned)) {
    if (actual.length !== pinned.length) out.push(`${where}: ${actual.length} items (pinned ${pinned.length})`);
    else actual.forEach((x, i) => vectorDiffs(x, pinned[i], `${where}[${i}]`, out, key));
  } else if (actual && pinned && typeof actual === 'object' && typeof pinned === 'object') {
    for (const k of new Set([...Object.keys(actual), ...Object.keys(pinned)])) vectorDiffs(actual[k], pinned[k], where ? `${where}.${k}` : k, out, k);
  } else if (actual !== pinned) out.push(`${where}: ${JSON.stringify(actual)} (pinned ${JSON.stringify(pinned)})`);
  return out;
}

describe('Phase B gate: app-path golden vectors', () => {
  const vectors = {};
  for (const [name, settings] of Object.entries(ALL)) {
    it(`runs the full MC output vector: ${name}`, () => {
      const cfg = createSimulationConfigFromSettings({}, settings);
      // through JSON, as the pin is stored: what is compared is what a file can hold
      vectors[name] = JSON.parse(JSON.stringify(runMonteCarlo(cfg, RUNS).map(vectorOf)));
      expect(vectors[name]).toHaveLength(RUNS);
    });
  }

  it('matches the pinned vectors (regenerate ONLY with an explicit justified commit)', () => {
    if (process.env.UPDATE_APP_PATHS === '1') {
      fs.mkdirSync(path.dirname(PIN_FILE), { recursive: true });
      const body = Object.entries(vectors).map(([name, runs]) => ` ${JSON.stringify(name)}: [\n${runs.map((r) => '  ' + JSON.stringify(r)).join(',\n')}\n ]`).join(',\n');
      fs.writeFileSync(PIN_FILE, `{\n${body}\n}\n`);
      console.log('PINNED:', PIN_FILE);
      return;
    }
    // A missing pin is a failure, not a first run: a gate that pins whatever it finds protects nothing.
    const pinned = JSON.parse(fs.readFileSync(PIN_FILE, 'utf8'));
    expect(Object.keys(vectors)).toEqual(Object.keys(pinned));
    expect(vectorDiffs(vectors, pinned)).toEqual([]);
  });

  // Fund and platform charges (6.19.0): a plan at 0% — or one locked before charges, which carries no setting — is the
  // pinned run, to the bit (not merely within the tolerance): the engine skips its charge block at 0%.
  it('at 0% charges every app-path vector is the pinned one, exactly as without the setting', () => {
    const pinned = JSON.parse(fs.readFileSync(PIN_FILE, 'utf8'));
    for (const [name, settings] of Object.entries(SETTINGS)) {
      const cfg = createSimulationConfigFromSettings({}, settings);
      const without = JSON.parse(JSON.stringify(runMonteCarlo(cfg, RUNS).map(vectorOf)));
      const atZero = JSON.parse(JSON.stringify(runMonteCarlo({ ...cfg, chargesPct: 0 }, RUNS).map(vectorOf)));
      expect(atZero, name).toEqual(without);
      expect(vectorDiffs({ [name]: atZero }, { [name]: pinned[name] }), name).toEqual([]);
    }
  });

  it('a charged plan\'s settings reach the engine: the config carries the charge, no fewer runs fail, and the typical end is lower', () => {
    const pinned = JSON.parse(fs.readFileSync(PIN_FILE, 'utf8'));
    const median = (v) => { const s = [...v].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
    const endOf = (r) => r.final + r.finalIsa;   // the pension and the ISA at the end
    for (const [name, settings] of Object.entries(SETTINGS)) {
      const twin = name + ' · charges 0.5%';
      expect(createSimulationConfigFromSettings({}, CHARGED[twin]).chargesPct, twin).toBe(CHARGED_PCT);
      expect('chargesPct' in createSimulationConfigFromSettings({}, settings), name).toBe(false);
      expect(pinned[twin], twin).toHaveLength(RUNS);
      expect(JSON.stringify(pinned[twin]), twin).not.toBe(JSON.stringify(pinned[name]));
      expect(pinned[twin].filter((r) => r.failed).length, twin).toBeGreaterThanOrEqual(pinned[name].filter((r) => r.failed).length);
      expect(median(pinned[twin].map(endOf)), twin).toBeLessThanOrEqual(median(pinned[name].map(endOf)));
      // Not run by run: a charged run can fall below its glidepaths sooner, pay less in protection and so keep a little
      // more in the pension (ufpls-phased-recycle runs 1, 15 and 24 — each with less in the ISA and in total).
    }
  });

  // How ISAs and savings grow (6.22.0): the choice reaches the engine through the one config builder — only when the plan
  // has one (a plan without it keeps the fixed rate, its `isaReturn` untouched) and never with a mix of its own (the engine
  // reads the run's pots, so the optimiser and the pots-at-retirement scaling carry the ISA with them).
  it('a plan\'s ISA choice reaches the engine: the config carries it (and only then), isaReturn is untouched, and the ISA moves', () => {
    const pinned = JSON.parse(fs.readFileSync(PIN_FILE, 'utf8'));
    const median = (v) => { const s = [...v].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
    for (const [name, settings] of Object.entries(SETTINGS)) {
      const sibling = name + ' · charges 0.5%';
      const plainCfg = createSimulationConfigFromSettings({}, CHARGED[sibling]);
      expect('isaGrowth' in plainCfg, name).toBe(false);
      for (const [twins, kind] of [[ISA_CASH, 'cash'], [ISA_INVESTED, 'invested']]) {
        const twin = name + (kind === 'cash' ? ' · charges 0.5% · ISA mostly cash' : ' · charges 0.5% · ISA invested');
        const cfg = createSimulationConfigFromSettings({}, twins[twin]);
        expect(cfg.isaGrowth, twin).toBe(kind);
        expect('isaGrowthMix' in cfg, twin).toBe(false);
        expect(cfg.isaReturn, twin).toBe(plainCfg.isaReturn);
        const { isaGrowth, ...rest } = cfg;
        void isaGrowth;
        expect(rest, twin).toEqual(plainCfg);
        expect(pinned[twin], twin).toHaveLength(RUNS);
        expect(JSON.stringify(pinned[twin].map((r) => r.isaByYear)), twin).not.toBe(JSON.stringify(pinned[sibling].map((r) => r.isaByYear)));
      }
      // shares and bonds beat cash on these futures: the ISA typically ends higher "invested" than "Mostly cash"
      const endIsa = (rs) => median(rs.map((r) => r.finalIsa));
      expect(endIsa(pinned[name + ' · charges 0.5% · ISA invested']), name).toBeGreaterThanOrEqual(endIsa(pinned[name + ' · charges 0.5% · ISA mostly cash']));
    }
    for (const v of [null, 'Cash', 0.03]) expect('isaGrowth' in createSimulationConfigFromSettings({}, { ...SETTINGS['risk-balanced-isa'], isaGrowth: v }), String(v)).toBe(false);
  });

  it('the comparison is exact where a branch shows and tolerant only of last-bit drift', () => {
    const run = { failed: false, failMonth: null, protMonths: 7, final: 57020.56745749808, potByYear: [500000, 57020.56745749808] };
    expect(vectorDiffs({ a: [run] }, { a: [{ ...run, final: 57020.567457501, potByYear: [500000, 57020.567457501] }] })).toEqual([]);   // Node 20 vs Node 24
    expect(vectorDiffs({ a: [run] }, { a: [{ ...run, final: 57020.57 }] })).toHaveLength(1);           // a quarter of a penny is a change
    expect(vectorDiffs({ a: [run] }, { a: [{ ...run, protMonths: 8 }] })).toHaveLength(1);            // one month in protection
    expect(vectorDiffs({ a: [run] }, { a: [{ ...run, failed: true, failMonth: 200 }] })).toHaveLength(2);
    expect(vectorDiffs({ a: [run] }, { a: [{ ...run, potByYear: [500000] }] })).toHaveLength(1);
  });
});
