/**
 * The parity fixtures (lead4.md G2, e2e/parity/fixtures/plans.js) are unit fixtures too: every one builds through the
 * app's own seed and patch functions, opens without an upgrade error, and has its subject plan active and named. The
 * stages and shapes the design lists are all there.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { FIXTURES, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';
import { upgradeScenario } from '../../src/firebase/scenarioMigration.js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const noon = (day) => { const [y, m, d] = day.split('-').map(Number); return new Date(y, m - 1, d, 12); };
const isLocked = (p) => !!(p.decisionTool && p.decisionTool.settings && p.decisionTool.settings.locked);

describe('the parity fixtures', () => {
  it('sixteen or more, each key once, each plan id once across them all', () => {
    expect(FIXTURES.length).toBeGreaterThanOrEqual(16);
    expect(new Set(FIXTURES.map((f) => f.key)).size).toBe(FIXTURES.length);
  });

  const built = Object.fromEntries(FIXTURES.map((f) => [f.key, f.plans()]));

  it.each(FIXTURES.map((f) => [f.key, f]))('%s: builds, opens, its subject active and named', (key, f) => {
    const plans = built[key];
    expect(plans.length).toBeGreaterThan(0);
    const subject = plans.find((p) => p.id === f.subject);
    expect(subject, 'the subject plan').toBeTruthy();
    expect(subject.isActive).toBe(true);
    expect(plans.filter((p) => p.isActive).length).toBe(1);
    for (const p of plans) {
      const u = upgradeScenario(JSON.parse(JSON.stringify(p)), { now: noon(PARITY_DAY) });
      expect(u.error || null, `${p.id} opens`).toBeNull();
      expect(typeof (p.planDetails && p.planDetails.name)).toBe('string');
    }
  }, 60_000);

  it('covers the stages and shapes of the design (G2)', () => {
    const subjects = FIXTURES.map((f) => built[f.key].find((p) => p.id === f.subject));
    const keys = FIXTURES.map((f) => f.key);
    for (const k of ['saver-draft', 'saver-payin', 'saver-locked-pots', 'saver-locked-ladder', 'saver-checkin', 'mover-holdings', 'mover-totals',
      'retired-draft', 'retired-locked-pots', 'retired-locked-ladder', 'retired-everything', 'couple', 'wizard-defaults', 'budget', 'closed-successor', 'age-only']) {
      expect(keys).toContain(k);
    }
    expect(subjects.filter(isLocked).length).toBeGreaterThanOrEqual(4);
    const ladder = built['retired-locked-ladder'].find((p) => p.id === 'ParRetiredLadder');
    expect(ladder.stressTool.settings.strategyId).toBe('full-il-gilt');
    expect((ladder.holdings && ladder.holdings.lines || []).length).toBeGreaterThan(0);
    expect(built['saver-checkin'][0].accumulationTool.checkIns.at(-1).paused).toEqual({ from: '2026-08', to: null });
    expect(built['budget'][0].budgetTool.settings.lines.length).toBe(4);
    expect(built['retired-locked-pots'][0].decisionTool.history.map((h) => h.date)).toEqual(['2026-09', '2026-10']);
    expect(built.couple.map((p) => p.household && p.household.partnerScenarioId).filter(Boolean).length).toBe(2);
  });

  it('every plan the gate\'s floor holds is still here under its name (e2e/parity/coverage.json "fixtures")', () => {
    const floor = JSON.parse(readFileSync(join(process.cwd(), 'e2e', 'parity', 'coverage.json'), 'utf8'));
    expect(floor.fixtures.length).toBeGreaterThanOrEqual(16);
    expect(floor.fixtures.filter((k) => !FIXTURES.some((f) => f.key === k))).toEqual([]);
  });
});
