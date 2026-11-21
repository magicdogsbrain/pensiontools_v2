/**
 * The History month list at phone width (#historyMobileSelector) shows the plan open now and nothing else (lead4.md R2; the
 * check of step LEFT, problem 2): after a switch to a plan with no months recorded it is empty, as when that plan is opened
 * directly. One filler (src/ui/historyMonthList.js) replaces the whole list every time, and renderHistory empties it before
 * anything is read, so no early return (no months, no months in the year chosen) leaves another plan's months behind.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fillHistoryMonthList } from '../src/ui/historyMonthList.js';

const select = () => { document.body.innerHTML = '<select id="historyMobileSelector"><option value="2026-09">Sep 2026</option></select>'; const s = document.getElementById('historyMobileSelector'); s.value = '2026-09'; return s; };

describe('the History month list', () => {
  it('no months: the list is empty, with no month chosen', () => {
    const s = select();
    fillHistoryMonthList(s, []);
    expect(s.options.length).toBe(0);
    expect(s.value).toBe('');
  });
  it('months: one option each, labelled by the caller, the chosen month selected', () => {
    const s = select();
    fillHistoryMonthList(s, [{ date: '2027-01' }, { date: '2027-02' }], { labelOf: (h) => 'M ' + h.date, chosen: '2027-02' });
    expect([...s.options].map((o) => [o.value, o.textContent])).toEqual([['2027-01', 'M 2027-01'], ['2027-02', 'M 2027-02']]);
    expect(s.value).toBe('2027-02');
  });
  it('a chosen month not in the list chooses none', () => {
    const s = select();
    fillHistoryMonthList(s, [{ date: '2027-01' }], { chosen: '2026-09' });
    expect(s.value).toBe('');
  });
  it('renderHistory empties the list before it reads the plan, and fills it through the one filler', () => {
    const src = readFileSync('index.html', 'utf8');
    const at = src.indexOf('async function renderHistory()');
    const fn = src.slice(at, src.indexOf('\n    }\n', at));
    const empty = fn.indexOf("fillHistoryMonthList(document.getElementById('historyMobileSelector'), [])");
    expect(empty).toBeGreaterThan(-1);
    expect(empty).toBeLessThan(fn.indexOf('await getHistoryAsync'));
    expect(fn).not.toMatch(/mobileSelector\.innerHTML/);
  });
});
