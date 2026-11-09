/**
 * 7.7.0 — the re-test of a POT plan (every strategy but a bought ladder): the plan's own one test — lastsRun.js planFor and
 * stressTestStrategy, the same engine and seed as "Does it last?" — on the locked settings and on those settings as held
 * (keepTest.js heldSettingsOf), with and without the money expected, and with what is kept by choice worth half or (one
 * company's shares) nothing. Slow: each side is a full run. Fictional plan ("Alex's plan") only.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { runKeepRetest, figuresOf } from '../src/answers/plan/keepRun.js';
import { planFor } from '../src/answers/plan/lastsRun.js';
import { effectiveStressSettings } from '../src/services/PlanReading.js';
import { stressTestStrategy } from '../src/strategies/stressTest.js';
import { keepFingerprint } from '../src/services/PlanAmendments.js';
import { amendPatch, keepTestOf } from '../src/answers/plan/keepTest.js';

const FIX = join(import.meta.dirname, 'fixtures', 'plans');
const TODAY = '2026-11-09';
const alex = (lines, expected) => {
  const p = JSON.parse(readFileSync(join(FIX, '04-buckets-running.json'), 'utf8'));
  p.id = 'AlexKeeps77';
  p.holdings.lines.push(...lines);
  if (expected) p.holdings.expected = expected;
  return p;
};
const single = (value, fundsGaps) => ({ wrapper: 'SIPP', ticker: 'EXMPL', name: 'Example Shares plc', units: 100, value, keep: { as: 'mine', fundsGaps } });

describe('a pot plan, tested with what is kept', () => {
  it('as locked is "Does it last?"\'s own run; as held differs only by what is kept; the shocks and the money expected each a run of their own', () => {
    const p = alex([single(120000, true)], [{ id: 'e1', label: 'Pension elsewhere', wrapper: 'SIPP', amount: 40000, by: '2028-06' }]);
    const before = JSON.stringify(p);
    const r = runKeepRetest(p, { today: TODAY });
    expect(JSON.stringify(p)).toBe(before);
    expect(r.ladder).toBe(false);
    expect(r.fingerprint).toBe(keepFingerprint(p.holdings));
    const now = new Date(TODAY + 'T12:00:00');
    const s = effectiveStressSettings(p, { now });
    const pp = planFor(s, now);
    expect(r.asLocked).toEqual(figuresOf(stressTestStrategy(s.strategyId, pp), pp));
    expect(r.runs).toBe(5);
    expect(r.withoutExpected).not.toBe(null);
    expect(r.withoutExpected.share).toBeLessThanOrEqual(r.asHeld.share + 0.005);
    expect(r.shock.counted).toBe(true);
    expect(r.shock.half.share).toBeLessThanOrEqual(r.asHeld.share + 0.005);
    expect(r.shock.nothing.share).toBeLessThanOrEqual(r.shock.half.share + 0.005);
    expect(r.kept[0]).toMatchObject({ single: true, counted: true, bucket: 'shares' });
    // and it can be agreed to
    expect(amendPatch(p, r, { at: '2026-11-09T12:00:00.000Z' }).ok).toBe(true);
    expect(keepTestOf(p, { result: r }).result.shock.map((x) => x.id)).toEqual(['shockHalf', 'shockNothing']);
  }, 120000);
  it('kept and not counted toward the plan: the plan pays from less, and a fall in what is kept changes nothing it pays', () => {
    const r = runKeepRetest(alex([single(200000, false)]), { today: TODAY });
    expect(r.asHeld.share).toBeLessThanOrEqual(r.asLocked.share + 0.005);
    expect(r.shock.counted).toBe(false);
    expect(r.shock.half).toEqual(r.asHeld);
    expect(r.withoutExpected).toBe(null);
    expect(r.runs).toBe(2);
  }, 120000);
});
