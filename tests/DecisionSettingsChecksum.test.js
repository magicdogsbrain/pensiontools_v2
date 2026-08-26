/**
 * decisionSettingsChecksum — stamps each saved decision with the plan settings it was computed
 * against, so the app can tell whether a decision still matches the (locked) plan and gate the
 * settings unlock on it. Must be stable, ignore the volatile `locked` flag, and move on real changes.
 */

import { describe, it, expect } from 'vitest';
import { decisionSettingsChecksum } from '../src/storage/DecisionRepository.js';

const base = {
  equityMin: 600000, bondMin: 480000, cashTarget: 120000, diversifierStart: 0,
  duration: 35, baseSalary: 59450, spendingProfile: 'flat', equityGlideEnabled: false,
  allocMode: 'risk', spStartDate: '21 April 2037', spWeeklyAmount: 221.2
};

describe('decisionSettingsChecksum', () => {
  it('is deterministic for identical settings', () => {
    expect(decisionSettingsChecksum(base)).toBe(decisionSettingsChecksum({ ...base }));
  });

  it('ignores the volatile `locked` flag (unlock/relock must not change it)', () => {
    expect(decisionSettingsChecksum({ ...base, locked: true }))
      .toBe(decisionSettingsChecksum({ ...base, locked: false }));
    expect(decisionSettingsChecksum({ ...base, locked: true }))
      .toBe(decisionSettingsChecksum(base));
    expect(decisionSettingsChecksum({ ...base, locked: false, lockedAt: 'x', lockedBy: 'y', unlockedAt: 'z', unlockCount: 3 }))
      .toBe(decisionSettingsChecksum(base));
  });

  it('is independent of key order (Firestore round-trips reorder keys)', () => {
    const reordered = Object.keys(base).sort().reverse().reduce((o, k) => { o[k] = base[k]; return o; }, {});
    expect(decisionSettingsChecksum(reordered)).toBe(decisionSettingsChecksum(base));
    expect(decisionSettingsChecksum({ ...base, taggedFunds: [{ b: 1, a: 2 }] })).toBe(decisionSettingsChecksum({ ...base, taggedFunds: [{ a: 2, b: 1 }] }));
  });

  it('changes when a plan-defining field changes', () => {
    const c0 = decisionSettingsChecksum(base);
    expect(decisionSettingsChecksum({ ...base, baseSalary: 60000 })).not.toBe(c0);
    expect(decisionSettingsChecksum({ ...base, spendingProfile: 'declining' })).not.toBe(c0);
    expect(decisionSettingsChecksum({ ...base, equityMin: 700000 })).not.toBe(c0);
  });

  it('returns a stable empty string for missing settings', () => {
    expect(decisionSettingsChecksum(null)).toBe('');
    expect(decisionSettingsChecksum(undefined)).toBe('');
  });
});
