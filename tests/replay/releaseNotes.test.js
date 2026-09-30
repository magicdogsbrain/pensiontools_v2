/**
 * Bug replays — the release notes. Three September fixes could not repair a plan already saved wrong: the note
 * has to TELL the owner of such a plan what to do. These pin that the right plan is told and the wrong one is not.
 * They guard the REMEDY, not the bug (P5 and G1 were form wiring and wait for the browser layer), so the catalogue
 * does not count them as replays of those bugs. Ids are from research/bug-replay-catalogue.md.
 */
import { describe, it, expect } from 'vitest';
import { RELEASES } from '../../src/releases.js';
import { frozenAt, at } from './_replay.js';

const note = (v) => RELEASES.find((r) => r.version === v);

describe('a plan the fix could not repair is told so', () => {
  it('P5-note — a plan locked before 6.10.4 whose Decision floors are not its Stress floors is told to unlock and re-lock', () => {
    const stress = { equityMin: 114000, bondMin: 171000, cashTarget: 95000 };
    const bad = { stressTool: { settings: stress }, decisionTool: { settings: { locked: true, equityMin: 250000, bondMin: 200000, cashTarget: 50000 } } };
    const good = { stressTool: { settings: stress }, decisionTool: { settings: { locked: true, ...stress } } };
    const draft = { stressTool: { settings: stress }, decisionTool: { settings: { locked: false, equityMin: 250000, bondMin: 200000, cashTarget: 50000 } } };
    expect(note('6.10.4').affects(bad).join(' ')).toMatch(/unlock and re-lock/);
    expect(note('6.10.4').affects(good)).toEqual([]);
    expect(note('6.10.4').affects(draft)).toEqual([]);
  });

  it('G1-note — a plan whose saved split is not a preset is told it now shows as Custom and is kept exactly', () => {
    const custom = { stressTool: { settings: { equityMin: 300000, bondMin: 250000, cashTarget: 50000, spStartDate: '1 June 2033', spWeeklyAmount: 230 } } };   // 50/42/8: the audit's P1
    const preset = { stressTool: { settings: { equityMin: 300000, bondMin: 240000, cashTarget: 60000, spStartDate: '1 June 2033', spWeeklyAmount: 230 } } };   // 50/40/10: Balanced
    expect(note('6.2.0').affects(custom).join(' ')).toMatch(/not a preset.*Custom.*kept exactly/);
    expect(note('6.2.0').affects(preset)).toEqual([]);
  });

  it('R6.4.0-a-note — a plan is told the start year it is now pinned to, and the same one whatever day it is read', async () => {
    const plan = { stressTool: { settings: { currentAge: 56, currentAgeAsOf: '2026-09-09', retired: true, firstTaxYear: 2027, shapeAgeNow: 57 } } };
    const sept = await frozenAt(at(2026, 9, 10), () => note('6.4.0').affects(plan));
    const jan = await frozenAt(at(2027, 1, 15), () => note('6.4.0').affects(plan));
    expect(sept[0]).toMatch(/Plan start: tax year 2027\/28 \(already retired\)/);
    expect(jan[0]).toBe(sept[0]);
  });
});
