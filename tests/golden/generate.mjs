/**
 * Generate committed golden-master fixtures from the CURRENT engines.
 * Run:  node tests/golden/generate.mjs
 * Commit the JSON under tests/golden/fixtures/. The tests assert the engines still
 * reproduce these exactly; during the unification refactor, any drift is flagged.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { decisionCases, stressConfigs } from './matrix.js';
import { canonical, pickStress } from './canonical.js';
import { calcDecisionPWA } from '../../src/services/legacyDecision.js';
import { runMonteCarlo, runHistorical, analyzeResults } from '../../src/services/SimulationEngine.js';

const here = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(here, 'fixtures');
mkdirSync(fixturesDir, { recursive: true });

const MC_RUNS = 200; // deterministic (seededRng); enough to pin behaviour

// --- decision fixtures ---
const decision = {};
for (const c of decisionCases) {
  const out = await calcDecisionPWA(c.input.dateStr, c.input.equity, c.input.bond, c.input.cash, c.deps);
  decision[c.name] = canonical(out);
}
writeFileSync(join(fixturesDir, 'decision.json'), JSON.stringify(decision, null, 2) + '\n');

// --- stress fixtures ---
const stress = {};
for (const c of stressConfigs) {
  const mc = pickStress(analyzeResults(runMonteCarlo(c.config, MC_RUNS)));
  const hist = pickStress(analyzeResults(runHistorical(c.config)));
  stress[c.name] = { mc, hist };
}
writeFileSync(join(fixturesDir, 'stress.json'), JSON.stringify({ mcRuns: MC_RUNS, cases: stress }, null, 2) + '\n');

console.log(`Wrote ${Object.keys(decision).length} decision + ${Object.keys(stress).length} stress fixtures.`);
