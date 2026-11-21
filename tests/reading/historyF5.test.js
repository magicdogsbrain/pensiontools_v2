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
