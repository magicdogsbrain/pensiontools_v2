/**
 * The Decision settings boxes show what the plan holds and nothing else (lead4.md R2): a value the plan does not hold
 * empties its box. Both loaders in index.html fill through the one function (src/ui/decisionForm.js).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { decisionBoxValues, decisionPotsOf } from '../../src/ui/decisionForm.js';

describe('the Decision settings boxes', () => {
  it('a plan with no values shows empty boxes, never the factory figures', () => {
    const v = decisionBoxValues({});
    for (const [id, x] of Object.entries(v)) expect([id, x]).toEqual([id, '']);
    expect(decisionPotsOf({}).set).toBe(false);
  });
  it('a value the plan holds is shown as held, a 0 included', () => {
    const v = decisionBoxValues({ duration: 28, baseSalary: 31000, protectionFactor: 0, recoveryBuffer: 12000, consecutiveLimit: 2, protectionEscalateMonths: 6, isaBalance: 0 });
    expect(v).toMatchObject({ dsDuration: 28, dsBaseSalary: 31000, dsProtectionFactor: 0, dsRecoveryBuffer: 12000, dsConsecutiveLimit: 2, dsProtEscalate: 6, dsIsaBalance: 0 });
    expect(decisionPotsOf({ equityMin: 100000 })).toEqual({ equityMin: 100000, bondMin: 0, cashTarget: 0, diversifierStart: 0, set: true });
  });
  it('index.html fills the boxes through it in both loaders, with no fallback figures of its own', () => {
    const src = readFileSync('index.html', 'utf8');
    expect((src.match(/fillDecisionForm\(/g) || []).length).toBeGreaterThanOrEqual(3);   // the one filler, and its two callers
    for (const banned of [/dsDuration'\)\.value = [^;]*\|\| 35/, /\?\? 250000/, /dsBaseSalary'\)\.value = [^;]*\|\| 30000/, /dsProtectionFactor'\)\.value = [^;]*\|\| 20/, /dsRecoveryBuffer'\)\.value = [^;]*\|\| 15000/, /dsConsecutiveLimit'\)\.value = [^;]*\|\| 3/]) {
      expect(src).not.toMatch(banned);
    }
  });
});
