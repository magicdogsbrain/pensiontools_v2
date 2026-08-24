/**
 * Phase B integration gate (strategy-engine brief §3): the golden matrix run through the SAME
 * code paths the app uses — settings → createSimulationConfigFromSettings → runMonteCarlo —
 * with the FULL per-run output vector hashed. Byte-identical pre/post the strategy-interface
 * refactor. Golden regeneration of these hashes is an explicit commit with justification.
 */
import { describe, it, expect, vi } from 'vitest';
import { createHash } from 'node:crypto';
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

const RUNS = 25;
const PIN_FILE = path.join(__dirname, 'fixtures', 'appPaths.sha.json');

function stable(obj) {
  return JSON.stringify(obj, (k, v) => (typeof v === 'number' && !Number.isInteger(v) ? +v.toFixed(6) : v));
}

describe('Phase B gate: app-path golden hashes', () => {
  const hashes = {};
  for (const [name, settings] of Object.entries(SETTINGS)) {
    it(`hashes full MC output vector: ${name}`, () => {
      const cfg = createSimulationConfigFromSettings({}, settings);
      const runs = runMonteCarlo(cfg, RUNS);
      const h = createHash('sha256');
      for (const r of runs) {
        h.update(stable({
          failed: r.failed, years: r.years, failMonth: r.failMonth,
          final: r.final, finalReal: r.finalReal,
          finalEquity: r.finalEquity, finalBond: r.finalBond, finalCash: r.finalCash,
          finalIsa: r.finalIsa, finalDiversifier: r.finalDiversifier, finalHodl: r.finalHodl,
          protMonths: r.protMonths, hodlUsed: r.hodlUsed, divUsed: r.divUsed,
          totalTaxReal: r.totalTaxReal, pclsTaken: r.pclsTaken,
          potByYear: r.potByYear, isaByYear: r.isaByYear
        }));
      }
      hashes[name] = h.digest('hex');
      expect(hashes[name]).toMatch(/^[0-9a-f]{64}$/);
    });
  }

  it('matches the pinned hashes (regenerate ONLY with an explicit justified commit)', () => {
    if (!fs.existsSync(PIN_FILE)) {
      fs.mkdirSync(path.dirname(PIN_FILE), { recursive: true });
      fs.writeFileSync(PIN_FILE, JSON.stringify(hashes, null, 2));
      console.log('PINNED first run:', PIN_FILE);
      return;
    }
    const pinned = JSON.parse(fs.readFileSync(PIN_FILE, 'utf8'));
    expect(hashes).toEqual(pinned);
  });
});
