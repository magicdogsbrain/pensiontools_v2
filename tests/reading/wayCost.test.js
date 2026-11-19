/**
 * What a bought way costs (lead4.md R6, D9): ONE function (compareRunner.wayCostOf) read by both views — the simple view's
 * ways list (answers/plan/waysRun.js wayResult) and the full view's Strategies overview (index.html) — and each figure
 * drawn in a mark of its own way (`way.<id>.cost`), so the parity gate holds the two views to one value per way.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { wayCostOf } from '../../src/strategies/compareRunner.js';
import { wayResult } from '../../src/answers/plan/waysRun.js';
import { FACT, factId, patternOf } from '../../src/reading/facts.js';

const read = (p) => readFileSync(resolve(process.cwd(), p), 'utf8');

describe('what a bought way costs: one function', () => {
  const sig = { total: 300000.4, bridgeCost: 90000.6, floorCost: 210000, baseLadderCost: 150000 };
  it('reads each bought way\'s own figure, and 0 for the ways that buy nothing', () => {
    const at = (strategyId) => wayCostOf({ strategyId, signature: sig });
    expect(at('full-il-gilt')).toBe(300000.4);
    expect(at('gilt-rotation')).toBe(300000.4);
    expect(at('bridge-and-engine')).toBe(90000.6);
    expect(at('floor-the-schedule')).toBe(210000);
    expect(at('floor-to-age')).toBe(210000);
    expect(at('floor-and-flex')).toBe(210000);
    expect(at('ladder-and-ratchet')).toBe(150000);
    expect(at('pots-and-valves')).toBe(0);
    expect(at('buckets-in-order')).toBe(0);
    expect(wayCostOf(null)).toBe(0);
    expect(wayCostOf({ strategyId: 'full-il-gilt' })).toBe(0);
  });
  it('is the simple view\'s cost: wayResult reads it', () => {
    const r = { strategyId: 'bridge-and-engine', affordable: true, signature: sig, ruin: { mc: 0, hist: 0 }, terminal: { p10: 0, p50: 0, p90: 0 }, worst12: { min: 0 } };
    const p = { pot: 400000, isa: 0, startAge: 60, years: 35 };
    let w;
    try { w = wayResult('bridge-and-engine', r, p); } catch { w = null; }
    if (w) expect(w.cost).toBe(Math.round(wayCostOf(r)));
    expect(read('src/answers/plan/waysRun.js')).not.toMatch(/function costOf\b/);
  });
  it('is the full view\'s cost: index.html keeps no copy of its own', () => {
    const html = read('index.html');
    expect(html).not.toMatch(/const costOf\s*=/);
    expect(html).toMatch(/wayCostOf\(/);
  });
});

describe('each way\'s cost is a fact of its own', () => {
  it('way.<id>.cost, the way\'s id as the key', () => {
    expect(factId(FACT.WAY_COST, 'full-il-gilt')).toBe('way.full-il-gilt.cost');
    expect(patternOf('way.floor-to-age.cost')).toBe(FACT.WAY_COST);
    expect(patternOf('way..cost')).toBe(null);
  });
  it('the full view marks the cost it draws in the overview, the simple view the cost line of the plan\'s own run', () => {
    expect(read('index.html')).toMatch(/markFact\(factId\(FACT\.WAY_COST, id\)/);
    expect(read('src/v7/screens/plan/WayScreen.jsx')).toMatch(/card\.costFact/);
  });
});
