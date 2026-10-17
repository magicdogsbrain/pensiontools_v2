/**
 * Dates in UK words everywhere the planner shows one (v6 usability audit, problem 3, 17 Oct 2026): no "2026-09", no
 * "2027-04-06", no US order.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { ukMonth, ukDate, ukDay } from '../src/ui/ukDates.js';

describe('ukDates', () => {
  it('a stored month or day reads as words', () => {
    expect(ukMonth('2026-09')).toBe('September 2026');
    expect(ukMonth('2030-07-31')).toBe('July 2030');
    expect(ukDate('2027-04-06')).toBe('6 April 2027');
    expect(ukDate('2027-04')).toBe('April 2027');
    expect(ukDate('2026-09-05T18:00:00.000Z')).toBe('5 September 2026');
    expect(ukDay(new Date(2027, 3, 6))).toBe('6 April 2027');
    expect(ukDay('2026-09-09T18:00:00.000Z').endsWith('September 2026')).toBe(true);
  });
  it('leaves what it cannot read alone (a free-text State Pension date), and gives nothing for nothing', () => {
    expect(ukDate('21 April 2037')).toBe('21 April 2037');
    expect(ukMonth('')).toBe('');
    expect(ukMonth(null)).toBe('');
    expect(ukDate(undefined)).toBe('');
    expect(ukDay('nonsense')).toBe('');
    expect(ukMonth('2026-13')).toBe('2026-13');
  });
});

describe('index.html shows no ISO month or US-order date', () => {
  const html = readFileSync('index.html', 'utf8');
  it('the order sheet, the saving records and the seeded-from notes use the UK words', () => {
    expect(html).not.toContain("o.matures.slice(0, 7)");
    expect(html).not.toContain("(o.matures || '').slice(0, 7)");
    expect(html).not.toMatch(/budEsc\(r\.date\) \+ '<\/td>'/);
    expect(html).not.toContain('.toLocaleDateString()');   // the browser's locale (US order on many machines)
    expect(html).not.toContain("toLocaleDateString('en-US");
  });
});
