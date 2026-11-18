/**
 * 7.12.0 round 3 (walker 10) — the Decision tool's month box, the banner and the line under Calculate name the same month.
 * Opened on a plan with September recorded and October not, the box was moved to October (the month to record) while the
 * line under it still said "Press Calculate to work out November 2026", the month the page first put in the box. Today is
 * pinned to 18 November 2026 here, so the month to record is October 2026.
 */
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { openMonthlyEntry } from '../src/ui/monthlyEntry.js';
import { createMonthEntry } from '../src/ui/monthFillEntry.js';

describe('the month box and the line under Calculate', () => {
  beforeAll(() => { vi.useFakeTimers({ toFake: ['Date'] }); vi.setSystemTime(new Date(2026, 10, 18, 12)); });
  afterAll(() => { vi.useRealTimers(); });
  it('name the same month once the box is moved to the month to record', async () => {
    document.body.innerHTML = '<form id="decisionForm"><input type="month" id="entryMonth" value="2026-11"><p id="saveStateNote"></p><button id="saveBtn" disabled></button></form>';
    const entry = createMonthEntry({ doc: document, getHistoryAsync: async () => [] });
    entry.watchForm();
    entry.setState('none');
    expect(document.getElementById('saveStateNote').textContent).toContain('November 2026');
    openMonthlyEntry([{ date: '2026-08', sipp: 2500 }, { date: '2026-09', sipp: 2500 }], {});
    expect(document.getElementById('entryMonth').value).toBe('2026-10');
    await new Promise((r) => setTimeout(r, 5));
    const note = document.getElementById('saveStateNote').textContent;
    expect(note).toContain('October 2026');
    expect(note).not.toContain('November 2026');
  });
});
