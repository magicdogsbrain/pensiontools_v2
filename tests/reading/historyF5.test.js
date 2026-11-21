/**
 * Step F5 (lead4.md D17, R4): a History row shows the record's own figures and its month. The move words a record kept
 * when it was saved ("Move £X Equity→Bond") are never shown, in the page or in the download, and a record with no source
 * kept never claims where the money came from.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const detail = html.slice(html.indexOf('function renderHistoryDetail'), html.indexOf('window.selectHistoryEntry = function'));

describe('History: a record shows its own figures, never the move words it kept', () => {
  it('the detail never prints the stored move words', () => {
    expect(detail.length).toBeGreaterThan(1000);
    expect(detail).not.toMatch(/h\.rebal\b/);
    expect(detail).not.toContain('Rebalancing Suggestions');
  });
  it('nothing in the page reads the stored move words (the download included)', () => {
    expect(html).not.toMatch(/\.rebal\b/);
    expect(html).not.toContain("'Rebalance'");
  });
  it('a record with no source kept says only that it was paid from the pension', () => {
    expect(detail).not.toContain("matured rung — nothing is sold");
    expect(detail).toContain("'From your pension'");
    expect(html).not.toContain("'cash bucket / matured rung'");
  });
  it('the detail says the record\'s month', () => {
    expect(detail).toContain('formatHistoryTabDate(h.date)');
  });
});

import { recordMovesOf } from '../../src/services/PlanRuleWords.js';
import { MONTH } from '../../src/v7/copy/month.js';
describe('History: what the plan\'s rule did that month, read as the live month reads it (PlanRuleWords)', () => {
  it('a record\'s move is the rule\'s words, dated, never the order it kept', () => {
    expect(recordMovesOf({ date: '2026-11-03', rebal: 'Move £8,000 Equity→Bond' })).toEqual([{ id: 'sharesToBonds', slots: { amount: '£8,000' } }]);
    expect(recordMovesOf({ date: '2026-11-03', rebal: 'Move £6,500 Bond→Equity' })).toEqual([{ id: 'bondsToShares', slots: { amount: '£6,500' } }]);
    expect(recordMovesOf({ date: '2026-11-03', rebal: '' })).toEqual([]);
    expect(recordMovesOf({ date: '2026-11-03', rebal: 'Move £8,000 Equity→Bond', contract: true })).toEqual([]);
    expect(recordMovesOf(null)).toEqual([]);
    for (const id of ['sharesToBonds', 'bondsToShares']) {
      expect(MONTH.advice.movesThen[id]).toMatch(/^The plan’s rule moved money from/);   // the record's own figures are its balances; the move's size is not one of them (the gate counts it as a figure no reading gives)
      expect(MONTH.advice.movesThen[id]).not.toMatch(/Equity|Bond→|Move £|should|recommend/);
    }
    expect(MONTH.advice.movesThenTitle).toBe('What the plan’s rule did in {month}');
  });
  it('the detail draws the record\'s moves through it, with the record\'s month, under a heading with no "recommendation"', () => {
    expect(detail).toContain('recordMovesOf(h)');
    expect(detail).toContain('MONTH.advice.movesThenTitle');
    expect(detail).not.toContain('Monthly Recommendation');
    expect(detail).toContain('What this month recorded');
  });
});
