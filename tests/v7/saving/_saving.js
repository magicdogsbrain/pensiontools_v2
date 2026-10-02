/**
 * The adapter for the saving years (step 4 brief 4.14) — the ONLY test file under tests/v7/saving/ that knows real
 * paths. It exports the saving engine's functions (lives.js, saving.js), the join's (stopAt.js) and the engine seams
 * the identity tests need. Every other test under tests/v7/saving/ imports from here.
 */
export { livesList, lifeReturns, sliceReturns, bondStream } from '../../../src/answers/shared/lives.js';
export { savingPlan, savingKernel, potsAtStop, payInFor, reachCount, savingRows, potsByPerson } from '../../../src/answers/shared/saving.js';
export { stopAtPlan, createStopRunner, verdictAt, verdictAtPot, bandAt, potNeeded, phasesAt, monthlyAt, potNeededAt, potNeededWithin, savingsNeeded,
  runnerAtPayIns, lastsWithin, verdictAtPayIns, countsAtPayIns } from '../../../src/answers/shared/stopAt.js';

// The engine seams the identities are asserted against (C's, as step3-build-brief.md has them).
export { marketSeed, engineSeed, futuresList, futureReturns, priceIndexByYear } from '../../../src/answers/shared/futures.js';
export { enginePlan, configsAt, breakdownAt, mixOf } from '../../../src/answers/shared/toEngine.js';
export { fastEligible, createFastRunner, simulateFast, prepareFutureFrom, prepareFutureFull, simulateFastFrom } from '../../../src/answers/shared/fastEngine.js';
export { createBandSolver, bandIndexes, bandFrom, STEP, runFuture } from '../../../src/answers/shared/band.js';
export { createReferenceBandSolver } from '../../../src/answers/shared/bandReference.js';
export { expandHousehold, validateHousehold, startAsGiven, startWhenPensionsOpen, HOUSEHOLD_LIMITS } from '../../../src/answers/shared/household.js';
export { simulate } from '../../../src/services/SimulationEngine.js';
export { projectAccumulation } from '../../../src/services/AccumulationEngine.js';
export { RISK_PRESETS } from '../../../src/services/GlidepathService.js';
export { bootstrapPaths, annualNominal } from '../../../src/strategies/ladderEngine.js';
export { RULES, SAVING, VERDICT, verdictOf } from '../../../src/answers/shared/rules.js';
export { checkInputs } from '../../../src/answers/shared/validate.js';
export { toHousehold as toHouseholdC } from '../../../src/answers/c/toHousehold.js';
export { SCHEMA_C } from '../../../src/answers/c/schema.js';

export const TEST_ENV = { today: '2026-09-30', futures: 40, seed: 0, trace: false };
export { get } from '../c/_c.js';
