/**
 * Strategy registry — Phase B of the strategy-engine brief (§3).
 *
 * Every tool obtains its simulation engine HERE, keyed by the plan's locked strategy id.
 * No tool reaches around the registry to the engine modules directly. Three strategies will
 * ship (§1); today the registry carries the one that exists, wrapping the production engine
 * byte-identically (proven by tests/integration/appPaths.test.js hashes).
 *
 * Interface shape (per §3): a strategy exposes `describe()` plus its engine surface. The
 * fine-grained init/step contract arrives with the Phase C ladder engines, which run their own
 * real-terms loops (Appendix A); Pots & Valves' monthly loop stays inside SimulationEngine and
 * is exposed at run granularity — the registry supports both shapes via `granularity`.
 */

import {
  simulate, runMonteCarlo, runHistorical, runScenario, monteCarloReturns, simulateTraced
} from '../services/SimulationEngine.js';
import { resolveIncomeProfile, profileTargetForYear } from '../services/IncomeProfile.js';

export const ENGINE_VERSION = '6.1.0'; // bump when any strategy's semantics change

export const STRATEGY_IDS = { POTS_AND_VALVES: 'pots-and-valves', LADDER_AND_RATCHET: 'ladder-and-ratchet', FLOOR_AND_FLEX: 'floor-and-flex' };

const PotsAndValves = {
  id: STRATEGY_IDS.POTS_AND_VALVES,
  name: 'Pots & Valves',
  promise: 'One flexible portfolio. Rules decide which pot pays you this month.',
  failure: 'A long bad run can drain the pots faster than they refill.',
  granularity: 'run',
  describe() {
    return {
      id: this.id, name: this.name, promise: this.promise, failure: this.failure,
      engineVersion: ENGINE_VERSION,
      components: ['glidepath floors', 'shared withdrawal cascade (WithdrawalSourcing)',
        'staged guardrail protection (ProtectionStrategy)', 'tax-band drawdown (DrawdownStrategy)',
        'tax-boost restoration (TaxBoostStrategy)', 'income profile (IncomeProfile)'],
      usesTrigger: false
    };
  },
  profile: { resolve: resolveIncomeProfile, targetForYear: profileTargetForYear },
  engine: { simulate, runMonteCarlo, runHistorical, runScenario, monteCarloReturns, simulateTraced }
};

const REGISTRY = { [PotsAndValves.id]: PotsAndValves };

/** The strategy for a plan (default + migration target: pots-and-valves). */
export function getStrategy(id) {
  return REGISTRY[id] || PotsAndValves;
}

export function listStrategies() {
  return Object.values(REGISTRY);
}

/** Register a strategy (Phase C entry point for the ladder engines). */
export function registerStrategy(strategy) {
  if (!strategy?.id || typeof strategy.describe !== 'function') throw new Error('invalid strategy');
  REGISTRY[strategy.id] = strategy;
}
