/**
 * "Check the trigger" (Ladder & Ratchet, full view): the next rung's cost is the plan's own run's (carry-over, lead ruling:
 * D9), never a second price sum on the page. The run's signature carries what each rung costs on the run's own prices.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { stressTestStrategy } from '../../src/strategies/stressTest.js';
import { deriveCompareConfigs } from '../../src/strategies/compareRunner.js';
import { contextFor } from '../../src/reading/context.js';
import { waysInputOf, enginePlanOf } from '../../src/reading/gather.js';
import { upgradeScenario } from '../../src/firebase/scenarioMigration.js';
import { FIXTURES, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';

const read = (p) => readFileSync(resolve(process.cwd(), p), 'utf8');
const now = new Date(PARITY_DAY + 'T12:00:00Z');

describe('the next rung\'s cost comes from the plan\'s own run', () => {
  it('the ladder run says what each rung costs, one figure a year of the plan', () => {
    const f = FIXTURES.find((x) => x.key === 'retired-draft');
    const raw = f.plans().find((p) => p.id === f.subject);
    const plan = upgradeScenario(JSON.parse(JSON.stringify(raw)), { now }).scenario;
    const p = enginePlanOf(waysInputOf(plan, contextFor(plan, { today: PARITY_DAY })));
    const r = stressTestStrategy('ladder-and-ratchet', { ...p, mcRuns: 20 }, deriveCompareConfigs(p));
    expect(r.affordable).toBe(true);
    const sg = r.signature;
    expect(sg.rungCost.length).toBe(sg.drawNet.length);
    for (const c of sg.rungCost) { expect(Number.isFinite(c)).toBe(true); expect(c).toBeGreaterThanOrEqual(0); }
  });
  it('the full view reads it there and keeps no price sum of its own', () => {
    const html = read('index.html');
    const i = html.indexOf('window.checkLadderTrigger = async function');
    const body = html.slice(i, html.indexOf('window.checkFlexDraw', i));
    expect(body).toMatch(/sg\.rungCost/);
    expect(body).not.toMatch(/realYieldForYear\(/);
  });
});
