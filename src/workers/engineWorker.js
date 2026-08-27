/**
 * Engine Web Worker — runs the heavy, synchronous strategy maths off the main thread so a phone
 * never freezes: the six-strategy overview, a single strategy stress test, the household check.
 * Inputs are plain settings/config objects; the plan is rebuilt here (planFromSettings) because a
 * plan carries pricing closures that cannot cross the worker boundary. Live gilt data is loaded
 * once per worker so ladder prices match the main thread.
 */
import { stressTestStrategy, planFromSettings, STRATEGY_NAMES } from '../strategies/stressTest.js';
import { deriveCompareConfigs } from '../strategies/compareRunner.js';
import { runHouseholdMonteCarlo } from '../services/HouseholdService.js';
import { loadLiveGilts, realYieldForYear } from '../services/LinkerUniverse.js';
import { cloneSafe } from '../utils/cloneSafe.js';

let giltsReady = null;
function plan(settings, cfg, essentialsAnnual) {
  return planFromSettings(settings, cfg, { yieldForYear: realYieldForYear, essentialsAnnual, startAge: +settings.shapeAgeNow || 57 });
}

self.onmessage = async (e) => {
  const { id, type, payload } = e.data || {};
  try {
    if (!giltsReady) giltsReady = Promise.resolve().then(() => loadLiveGilts()).catch(() => null);
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
    } else if (type === 'household') {
      self.postMessage({ id, result: cloneSafe(runHouseholdMonteCarlo(payload.cfgA, payload.cfgB, payload.runs, payload.offsets)) });
    } else {
      throw new Error('unknown job ' + type);
    }
  } catch (err) {
    self.postMessage({ id, error: String((err && err.message) || err) });
  }
};
