/**
 * The cuts and reserve boxes in the full view's Stress settings show what the plan holds, as the simple view's "Does it
 * last?" boxes do (check round 2: a buffer of £0 showed £15,000, a cut of 0 showed 0.8, 0 months showed 3, a reserve of
 * £0 showed £25,000; the simple view stores and shows the £0 buffer).
 */
import { describe, it, expect } from 'vitest';
import { protectionBoxValues, protectionFromBoxes } from '../src/ui/stressProtectionBoxes.js';
import { savedLasts } from '../src/answers/plan/lasts.js';

describe('protectionBoxValues', () => {
  it('a 0 the plan holds is shown as 0, never the default', () => {
    const v = protectionBoxValues({ recoveryBuffer: 0, protectionMult: 0, consecutiveLimit: 0, protectionEscalateMonths: 0, hodlValue: 0 });
    expect(v.ssRecoveryBuffer).toBe(0);
    expect(v.ssProtectionMult).toBe(0);
    expect(v.ssConsecutiveLimit).toBe(0);
    expect(v.ssProtEscalate).toBe(0);
    expect(v.ssHodlValue).toBe('');   // no reserve amount: the box is empty, as the simple view's
  });

  it('a value the plan lacks reads as the engines read it', () => {
    expect(protectionBoxValues({})).toMatchObject({ ssRecoveryBuffer: 15000, ssProtectionMult: 0.8, ssConsecutiveLimit: 3, ssProtEscalate: 12, ssHodlValue: '', ssDisableProtection: false, ssHodlEnabled: false });
    expect(protectionBoxValues({ recoveryBuffer: 9000, hodlValue: 30000, hodlEnabled: true, disableProtection: true })).toMatchObject({ ssRecoveryBuffer: 9000, ssHodlValue: 30000, ssHodlEnabled: true, ssDisableProtection: true });
  });

  it('the same buffer as the simple view\'s box for the same plan', () => {
    const plan = { id: 'p', stressTool: { settings: { configured: true, recoveryBuffer: 0, consecutiveLimit: 5, baseSalary: 20000, equityMin: 100000, bondMin: 50000, cashTarget: 10000 } } };
    const simple = savedLasts(plan, { today: '2026-11-19' }).values;
    const full = protectionBoxValues(plan.stressTool.settings);
    expect(full.ssRecoveryBuffer).toBe(simple.buffer);
    expect(full.ssConsecutiveLimit).toBe(simple.cutAfterMonths);
  });

  it('read back: a box holding 0 is 0; an empty box is a key left out, never a default', () => {
    const boxes = { ssRecoveryBuffer: '0', ssConsecutiveLimit: '', ssProtectionMult: '0.7', ssProtEscalate: '-2', ssHodlValue: '' };
    expect(protectionFromBoxes((id) => boxes[id])).toEqual({ recoveryBuffer: 0, consecutiveLimit: undefined, protectionMult: 0.7, protectionEscalateMonths: 0, hodlValue: undefined });
  });
});
