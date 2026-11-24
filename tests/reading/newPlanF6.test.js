/**
 * Step F6 (lead4.md D2): a plan made in the full view ("+ New plan", the setup wizard, "Create your partner's plan") stores only
 * what was given — the ages and the timing they make, and the charge and ISA growth every new plan is given in both views —
 * never the factory figures (a State Pension of £12,000, pots, a salary) as if typed. The reading still counts what it needs
 * and says it assumed it (statePensionOf kind 'assumed'), exactly as before.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { enterGuestMode, leaveGuestMode } from '../../src/firebase/AuthService.js';
import { clearGuestData, loadScenario } from '../../src/firebase/FirestoreService.js';
import { createNewScenario, invalidateScenarioCache } from '../../src/storage/ScenarioRepository.js';
import { invalidateStressCache } from '../../src/storage/StressRepository.js';
import { invalidateCache as invalidateDecisionCache } from '../../src/storage/DecisionRepository.js';
import { effectiveStressSettings } from '../../src/services/PlanReading.js';
import { statePensionOf } from '../../src/reading/statePension.js';
import { DEFAULT_CHARGES_PCT } from '../../src/services/Charges.js';

const fresh = () => { invalidateScenarioCache(); invalidateStressCache(); invalidateDecisionCache(); };
afterEach(() => { leaveGuestMode(); clearGuestData(); fresh(); });
const NOW = new Date(2026, 10, 21, 12);

describe('a new plan stores only what was given (step F6, D2)', () => {
  it('Jo, 58, stopping at 62: the ages and the timing are stored; no State Pension, pots or salary nobody gave', async () => {
    enterGuestMode(); clearGuestData(); fresh();
    const given = { configured: true, currentAge: 58, currentAgeAsOf: '2026-11-21', retired: false, retireAge: 62, duration: 33 };
    const id = await createNewScenario('Jo', '', ['stress', 'decision'], { stressSettings: given }, true);
    const plan = await loadScenario(id);
    const S = plan.stressTool.settings;
    for (const k of ['statePension', 'statePensionYear', 'equityMin', 'bondMin', 'cashTarget', 'baseSalary']) expect(S, k).not.toHaveProperty(k);
    expect(S).toMatchObject(given);
    expect(S.chargesPct).toBe(DEFAULT_CHARGES_PCT);   // the charge every new plan is given, in both views (6.19.0)
    // the reading still counts a State Pension, and says it assumed it
    expect(statePensionOf(plan, { now: NOW }).kind).toBe('assumed');
    expect(effectiveStressSettings(plan, { now: NOW }).statePension).toBe(12000);
  });
});
