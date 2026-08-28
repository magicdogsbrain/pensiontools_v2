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
import { ENGINE_VERSION as _EV } from './version.js';
import { LadderAndRatchet } from './LadderAndRatchet.js';
import { FloorAndFlex, FloorTheSchedule, FloorToAge, FullGiltLadder, runFlexWindows, floorCost } from './FloorAndFlex.js';

export { ENGINE_VERSION } from './version.js';

export const STRATEGY_IDS = { POTS_AND_VALVES: 'pots-and-valves', BUCKETS_IN_ORDER: 'buckets-in-order', LADDER_AND_RATCHET: 'ladder-and-ratchet', BRIDGE_AND_ENGINE: 'bridge-and-engine', FLOOR_AND_FLEX: 'floor-and-flex', FLOOR_THE_SCHEDULE: 'floor-the-schedule', FLOOR_TO_AGE: 'floor-to-age', FULL_IL_GILT: 'full-il-gilt' };

const PotsAndValves = {
  id: STRATEGY_IDS.POTS_AND_VALVES,
  name: 'Pots & Valves',
  promise: 'One flexible portfolio. Rules decide which pot pays you this month.',
  failure: 'A long bad run can drain the pots faster than they refill.',
  granularity: 'run',
  describe() {
    return {
      id: this.id, name: this.name, promise: this.promise, failure: this.failure,
      engineVersion: _EV,
      components: ['glidepath floors', 'shared withdrawal cascade (WithdrawalSourcing)',
        'staged guardrail protection (ProtectionStrategy)', 'tax-band drawdown (DrawdownStrategy)',
        'tax-boost restoration (TaxBoostStrategy)', 'income profile (IncomeProfile)'],
      usesTrigger: false
    };
  },
  profile: { resolve: resolveIncomeProfile, targetForYear: profileTargetForYear },
  engine: { simulate, runMonteCarlo, runHistorical, runScenario, monteCarloReturns, simulateTraced }
};

/** Buckets in order — the Pots & Valves engine with ordered sourcing and no rebalancing. */
export const BucketsInOrder = {
  ...PotsAndValves,
  id: 'buckets-in-order',
  name: 'Buckets in order',
  promise: 'Three buckets, one order: cash pays first, then bonds, then equities. Surplus waterfalls down — equities above their £ path refill bonds, bonds above target refill cash. Never a sale in a slump.',
  failure: 'A slump longer than cash and bonds together forces equity sales at the bottom — late, and after two buffers; and the buffers are a permanent drag.',
  describe() { return { id: this.id, name: this.name, promise: this.promise, failure: this.failure, engineVersion: PotsAndValves.describe().engineVersion,
      components: ['draw order: cash → bonds → equities', 'absolute £ equity path and bond target (never a % share)', 'waterfall refills from surplus only: equities → bonds → cash', 'no other trade between pots'],
      usesTrigger: false }; }
 }
};

/** Bridge & engine — years to the bridge age bought (cash, then linkers); the rest rides untouched, then pays by total return. */
export const BridgeAndEngine = {
  id: 'bridge-and-engine',
  name: 'Bridge & engine',
  promise: 'Every year to your State Pension bought today — cash first, then one linker per year. The rest rides in equities untouched, then pays the rest of your life by ordinary withdrawals.',
  failure: 'If the engine arrives small at the bridge age, the later years are drawn from a small pot — it can run out, late.',
  granularity: 'windows',
  describe() { return { id: this.id, name: this.name, promise: this.promise, failure: this.failure, engineVersion: _EV,
      components: ['cash years at face', 'one index-linked rung per bridge year (curve-priced)', 'untouched equity engine to the bridge age', 'total-return draws after the bridge (no re-buying, no trigger)'],
      usesTrigger: false, sensitivity: 'sequence risk is not removed — it is moved to the bridge age' }; },
  engine: { runWindows: runFlexWindows, floorCost }
};

const REGISTRY = {
  [PotsAndValves.id]: PotsAndValves,
  [BucketsInOrder.id]: BucketsInOrder,
  [BridgeAndEngine.id]: BridgeAndEngine,
  [LadderAndRatchet.id]: LadderAndRatchet,
  [FloorAndFlex.id]: FloorAndFlex,
  [FloorTheSchedule.id]: FloorTheSchedule,
  [FloorToAge.id]: FloorToAge,
  [FullGiltLadder.id]: FullGiltLadder
};

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
