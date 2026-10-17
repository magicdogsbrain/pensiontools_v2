/**
 * Engine Web Worker — runs the heavy, synchronous strategy maths off the main thread so a phone
 * never freezes: the six-strategy overview, a single strategy stress test, the household check.
 * Inputs are plain settings/config objects; the plan is rebuilt here (planFromSettings) because a
 * plan carries pricing closures that cannot cross the worker boundary. Live gilt data is loaded
 * once per worker so ladder prices match the main thread.
 */
import { stressTestStrategy, planFromSettings, STRATEGY_NAMES } from '../strategies/stressTest.js';
import { deriveCompareConfigs } from '../strategies/compareRunner.js';
import { runHouseholdMonteCarlo, runSurvivorCheck, runCareCheck, runHouseholdWays } from '../services/HouseholdService.js';
import { loadLiveGilts, realYieldForYear } from '../services/LinkerUniverse.js';
import { loadLiveEquity } from '../services/EquityIndex.js';
import { cloneSafe } from '../utils/cloneSafe.js';
import { sweepRetirementAges } from '../services/RetireSweep.js';

let giltsReady = null;
function plan(settings, cfg, essentialsAnnual) {
  return planFromSettings(settings, cfg, { yieldForYear: realYieldForYear, essentialsAnnual, startAge: +settings.shapeAgeNow || 57 });
}

self.onmessage = async (e) => {
  const { id, type, payload } = e.data || {};
  try {
    if (!giltsReady) giltsReady = Promise.resolve().then(() => Promise.all([loadLiveGilts(), loadLiveEquity()])).catch(() => null);
    await giltsReady;
    if (type === 'overview') {
      const p = plan(payload.settings, payload.cfg, payload.essentialsAnnual);
      const configs = deriveCompareConfigs(p);
      const ids = Object.keys(STRATEGY_NAMES);
      const strategies = {};
      for (let i = 0; i < ids.length; i++) {
        self.postMessage({ id, progress: { i, n: ids.length, name: STRATEGY_NAMES[ids[i]] } });
        strategies[ids[i]] = stressTestStrategy(ids[i], p, configs);
      }
      self.postMessage({ id, result: cloneSafe({ p, all: { configs, strategies } }) });
    } else if (type === 'strategy') {
      const p = plan(payload.settings, payload.cfg, payload.essentialsAnnual);
      self.postMessage({ id, result: cloneSafe({ p, r: stressTestStrategy(payload.strategyId, p) }) });
    } else if (type === 'household-ways') {   // who draws what (6.25.0): both plans, both ways, through the one test
      const test = (settings, cfg, id) => { const p = plan(settings, cfg); return { r: stressTestStrategy(id, p), p }; };
      self.postMessage({ id, result: cloneSafe(runHouseholdWays(payload.ways, payload.needs, payload.idA, payload.idB, test)) });
    } else if (type === 'household') {
      self.postMessage({ id, result: cloneSafe(runHouseholdMonteCarlo(payload.cfgA, payload.cfgB, payload.runs, payload.offsets)) });
    } else if (type === 'survivor') {
      self.postMessage({ id, result: cloneSafe(runSurvivorCheck(payload)) });
    } else if (type === 'care') {
      self.postMessage({ id, result: cloneSafe(runCareCheck(payload)) });
    } else if (type === 'sweep') {   // "when can I retire?" (6.10.0): one strategy run per candidate age, with progress
      const out = sweepRetirementAges({ ...payload, onProgress: (i, n, age) => self.postMessage({ id, progress: { i, n, name: 'age ' + age } }) });
      self.postMessage({ id, result: cloneSafe(out) });
    } else {
      throw new Error('unknown job ' + type);
    }
  } catch (err) {
    self.postMessage({ id, error: String((err && err.message) || err) });
  }
};
