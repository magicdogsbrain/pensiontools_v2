/**
 * Monthly entry asks for what a platform shows (decision 10, research/v7/v6-usability-audit.md §2.7):
 * "Pension total; of which cash; of which bond funds or gilts". Shares are the rest; a gilt-ladder plan is
 * the total less cash (nobody adds up 22 rungs). Last month's figures are pre-filled. Entry by type stays as
 * an option. The engine still receives the same per-type figures; the record keeps what was typed and the split.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { splitFromPlatform, prefillFromHistory, enteredBlock, platformBoxes, prefillNote } from '../src/services/MonthlyEntry.js';
import { decisionToHistory } from '../src/models/Decision.js';
import { platformEntryHtml, paintEntryMode, readMonthlyEntry, prefillMonthlyEntry, prefillForEntryMonth, installMonthlyEntryHandlers, ENTRY_MODE_KEY } from '../src/ui/monthlyEntry.js';
import { parse } from '../src/ui/inlineHandlers.js';

describe('splitFromPlatform — the platform view becomes the engine\'s per-type figures', () => {
  it('a pot plan: shares are the rest', () => {
    const s = splitFromPlatform({ total: 300000, cash: 20000, bonds: 80000 }, { contract: false, hasDiversifiers: false });
    expect(s).toMatchObject({ equity: 200000, bond: 80000, cash: 20000, diversifier: 0 });
    expect(s.problem).toBeNull();
  });
  it('a plan with a gold-and-trend sleeve keeps that box, and it comes off the shares too', () => {
    const s = splitFromPlatform({ total: 300000, cash: 20000, bonds: 80000, diversifiers: 10000 }, { contract: false, hasDiversifiers: true });
    expect(s).toMatchObject({ equity: 190000, bond: 80000, cash: 20000, diversifier: 10000 });
  });
  it('without a sleeve the diversifiers box is ignored even if a figure is passed', () => {
    const s = splitFromPlatform({ total: 300000, cash: 20000, bonds: 80000, diversifiers: 10000 }, { contract: false, hasDiversifiers: false });
    expect(s).toMatchObject({ equity: 200000, diversifier: 0 });
  });
  it('a gilt-ladder plan: the total less cash is the gilts — no bonds box, no shares', () => {
    const s = splitFromPlatform({ total: 250000, cash: 30000, bonds: 999 }, { contract: true });
    expect(s).toMatchObject({ equity: 0, bond: 220000, cash: 30000, diversifier: 0 });
    expect(s.problem).toBeNull();
  });
  it('the parts cannot add up to more than the total', () => {
    const s = splitFromPlatform({ total: 100000, cash: 60000, bonds: 50000 }, { contract: false });
    expect(s.problem).toMatch(/add up to more than the pension total/);
    expect(s.equity).toBe(0);
  });
  it('a missing total is said plainly; blanks for the parts read as nothing held there', () => {
    expect(splitFromPlatform({ total: '', cash: '', bonds: '' }, { contract: false }).problem).toMatch(/pension total/i);
    const s = splitFromPlatform({ total: '120000', cash: '', bonds: '' }, { contract: false });
    expect(s).toMatchObject({ equity: 120000, bond: 0, cash: 0, problem: null });
  });
  it('whole pounds in, whole pounds out', () => {
    const s = splitFromPlatform({ total: 100000.4, cash: 10000.4, bonds: 0 }, { contract: false });
    expect(s.equity).toBe(90000);
    expect(s.cash).toBe(10000);
  });
});

describe('prefillFromHistory — last month\'s figures, ready to change', () => {
  const sept = { date: '2026-09', equity: 200000, bond: 80000, cash: 20000, entered: { mode: 'platform', typed: { total: 300000, cash: 20000, bonds: 80000, diversifiers: 0 }, split: { equity: 200000, bond: 80000, cash: 20000, diversifier: 0 } } };
  const aug = { date: '2026-08', equity: 210000, bond: 79000, cash: 21000 };
  it('takes the latest record\'s typed figures when it has them', () => {
    const p = prefillFromHistory([aug, sept], { contract: false });
    expect(p).toMatchObject({ from: '2026-09', total: 300000, cash: 20000, bonds: 80000, diversifiers: 0 });
  });
  it('an older record without them is rebuilt from its per-type figures (recorded months are read, never changed)', () => {
    const p = prefillFromHistory([aug], { contract: false });
    expect(p).toMatchObject({ from: '2026-08', total: 310000, cash: 21000, bonds: 79000, diversifiers: 0 });
    expect(aug).toEqual({ date: '2026-08', equity: 210000, bond: 79000, cash: 21000 });
  });
  it('the latest month wins whatever order the list is in', () => {
    expect(prefillFromHistory([sept, aug], { contract: false }).from).toBe('2026-09');
  });
  it('nothing recorded: nothing to pre-fill', () => {
    expect(prefillFromHistory([], { contract: false })).toBeNull();
    expect(prefillFromHistory(null, { contract: false })).toBeNull();
  });
  it('a gilt-ladder record: the gilts are the bonds figure', () => {
    const p = prefillFromHistory([{ date: '2027-05', equity: 0, bond: 220000, cash: 30000, contract: true }], { contract: true });
    expect(p).toMatchObject({ total: 250000, cash: 30000, bonds: 220000 });
  });
  it('the note names the month the figures come from', () => {
    expect(prefillNote({ from: '2026-09' })).toBe('Last month\'s figures (September 2026) are filled in — change them to this month\'s.');
    expect(prefillNote(null)).toBe('');
  });
});

describe('prefillFromHistory for a month earlier than the latest record (a month that was missed, 3 Nov 2026): the record before it', () => {
  const jul = { date: '2026-07', equity: 385300, bond: 151800, cash: 52600 };
  const sep = { date: '2026-09', equity: 388200, bond: 151900, cash: 47600 };
  const nov = { date: '2026-11', equity: 390000, bond: 150000, cash: 45000 };
  it('an October entry with September and November recorded fills from September, not November', () => {
    expect(prefillFromHistory([sep, nov], { month: '2026-10' })).toMatchObject({ from: '2026-09', total: 587700, cash: 47600, bonds: 151900 });
    expect(prefillFromHistory([nov, sep], { month: '2026-10' }).from).toBe('2026-09');   // whatever order the list is in
  });
  it('an August entry with July and September recorded fills from July', () => {
    expect(prefillFromHistory([jul, sep], { month: '2026-08' })).toMatchObject({ from: '2026-07', total: 589700, cash: 52600, bonds: 151800 });
  });
  it('the entry month at or after the latest record: the latest, as always', () => {
    expect(prefillFromHistory([sep, nov], { month: '2026-12' }).from).toBe('2026-11');
    expect(prefillFromHistory([sep, nov], { month: '2026-11' }).from).toBe('2026-11');
    expect(prefillFromHistory([sep, nov], { month: '2027-03' }).from).toBe('2026-11');
  });
  it('a recorded month entered again, with later records: the record before it, never its own or a later one', () => {
    expect(prefillFromHistory([jul, sep, nov], { month: '2026-09' }).from).toBe('2026-07');
  });
  it('a month before every record has nothing to pre-fill from; no month, or one that is not a month, reads as before', () => {
    expect(prefillFromHistory([sep, nov], { month: '2026-06' })).toBeNull();
    expect(prefillFromHistory([sep, nov], {}).from).toBe('2026-11');
    expect(prefillFromHistory([sep, nov], { month: 'October' }).from).toBe('2026-11');
    expect(prefillFromHistory([sep, nov], { month: null }).from).toBe('2026-11');
  });
});

describe('enteredBlock — the record keeps exactly what was typed plus the derived split', () => {
  it('platform mode', () => {
    const b = enteredBlock('platform', { total: 300000, cash: 20000, bonds: 80000, diversifiers: 0 }, { equity: 200000, bond: 80000, cash: 20000, diversifier: 0 });
    expect(b).toEqual({ mode: 'platform', typed: { total: 300000, cash: 20000, bonds: 80000, diversifiers: 0 }, split: { equity: 200000, bond: 80000, cash: 20000, diversifier: 0 } });
  });
  it('by-type mode records the four boxes as typed', () => {
    const b = enteredBlock('type', { equity: 200000, bond: 80000, cash: 20000, diversifier: 5000 }, { equity: 200000, bond: 80000, cash: 20000, diversifier: 5000 });
    expect(b.mode).toBe('type');
    expect(b.typed.diversifier).toBe(5000);
  });
  it('no undefined anywhere — Firestore refuses it', () => {
    const b = enteredBlock('platform', { total: 1, cash: undefined, bonds: null }, { equity: 1, bond: 0, cash: 0, diversifier: undefined });
    const walk = (o) => { for (const v of Object.values(o)) { expect(v).not.toBeUndefined(); if (v && typeof v === 'object') walk(v); } };
    walk(b);
  });
  it('decisionToHistory carries the block only when the decision has one — older records keep their shape', () => {
    const base = { date: '2026-10', equity: 1, bond: 1, cash: 1, sippDraw: 0, other: 0, statePension: 0 };
    expect(decisionToHistory(base)).not.toHaveProperty('entered');
    const with_ = decisionToHistory({ ...base, entered: enteredBlock('platform', { total: 3, cash: 1, bonds: 1, diversifiers: 0 }, { equity: 1, bond: 1, cash: 1, diversifier: 0 }) });
    expect(with_.entered.mode).toBe('platform');
  });
  it('decisionToHistory marks a record made with "This month\'s payment has already been made" (paidAhead: true) and no other', () => {
    const base = { date: '2026-11', equity: 1, bond: 1, cash: 1, sippDraw: 0, other: 0, statePension: 0 };
    expect(decisionToHistory(base)).not.toHaveProperty('paidAhead');
    expect(decisionToHistory({ ...base, paidAhead: false })).not.toHaveProperty('paidAhead');
    expect(decisionToHistory({ ...base, paidAhead: 'yes' })).not.toHaveProperty('paidAhead');
    expect(decisionToHistory({ ...base, paidAhead: true }).paidAhead).toBe(true);
  });
});

describe('the planner marks the record made with the tick through its one write path (index.html, src/ui/monthFillEntry.js)', () => {
  const html = readFileSync('index.html', 'utf8');
  const save = readFileSync('src/ui/monthFillEntry.js', 'utf8');
  it('handleDecisionSubmit takes the tick from readMonthlyEntry (the page script may only get shorter) and sets paidAhead beside what was typed wherever the decision is calculated; a batch marks its first record alone', () => {
    expect(html).not.toMatch(/const paidAhead = /);   // the tick is read in src/ui/monthlyEntry.js readMonthlyEntry (entry.paidAhead), not here
    expect(html.match(/currentDecision\.entered = entry\.entered; currentDecision\.paidAhead = entry\.paidAhead;/g)).toHaveLength(2);
    expect(html.match(/currentDecision\.entered = entry\.entered;/g)).toHaveLength(2);
    // the save flow moved out of the page script (3 Nov 2026: the missed months filled in): the batch's loop is in
    // src/ui/monthFillEntry.js, still marking its first record alone; tests/monthFillEntry.test.js drives it with the tick on and off
    expect(html).toContain('await monthEntry.save(currentDecision);');
    expect(save).toContain('await deps.save({ ...current, date, month: date, paidAhead: j === 0 && !!current.paidAhead });');
  });
});

describe('platformBoxes — what the form asks for', () => {
  it('a pot plan asks for total, cash and bond funds or gilts', () => {
    const b = platformBoxes({ contract: false, hasDiversifiers: false });
    expect(b.map((x) => x.key)).toEqual(['total', 'cash', 'bonds']);
    expect(b[0].label).toBe('Pension total');
    expect(b[1].label).toBe('of which cash');
    expect(b[2].label).toBe('of which bond funds or gilts');
  });
  it('a plan with a gold-and-trend sleeve keeps its box', () => {
    const b = platformBoxes({ contract: false, hasDiversifiers: true });
    expect(b.map((x) => x.key)).toEqual(['total', 'cash', 'bonds', 'diversifiers']);
    expect(b[3].label).toBe('of which gold and trend');
  });
  it('a gilt-ladder plan asks only for the total and the cash', () => {
    const b = platformBoxes({ contract: true, hasDiversifiers: true });
    expect(b.map((x) => x.key)).toEqual(['total', 'cash']);
    expect(b[0].hint).toMatch(/gilts/i);
  });
});

describe('the form (jsdom)', () => {
  const FORM = `
    <div id="entryPlatform"></div>
    <div id="entryByType">
      <input type="number" id="entryEquity"><input type="number" id="entryBond"><input type="number" id="entryCash">
      <div id="entryDiversifierGroup"><input type="number" id="entryDiversifier" value="0"></div>
    </div>
    <p id="entryModeNote"></p>`;
  beforeEach(() => { document.body.innerHTML = FORM; try { localStorage.clear(); } catch (e) { /* jsdom */ } });

  it('platformEntryHtml draws the boxes with the words, the pre-fill note and the switch link; every handler parses', () => {
    const html = platformEntryHtml({ contract: false, hasDiversifiers: true });
    expect(html).toContain('id="entryPlatTotal"');
    expect(html).toContain('id="entryPlatCash"');
    expect(html).toContain('id="entryPlatBonds"');
    expect(html).toContain('id="entryPlatDiversifiers"');
    expect(html).toContain('Pension total');
    expect(html).toContain('of which bond funds or gilts');
    expect(html).toContain('Enter by type instead');
    expect(html).toContain('id="entryPrefillNote"');
    for (const m of html.matchAll(/data-on-(?:click|change|input)="([^"]*)"/g)) expect(() => parse(m[1])).not.toThrow();
    const ladder = platformEntryHtml({ contract: true, hasDiversifiers: false });
    expect(ladder).not.toContain('id="entryPlatBonds"');
    expect(ladder).not.toContain('id="entryPlatDiversifiers"');
  });
  it('paintEntryMode shows one block and hides the other, and remembers the choice for this browser', () => {
    paintEntryMode('platform', { contract: false, hasDiversifiers: false });
    expect(document.getElementById('entryPlatform').style.display).not.toBe('none');
    expect(document.getElementById('entryByType').style.display).toBe('none');
    paintEntryMode('type', { contract: false, hasDiversifiers: false });
    expect(document.getElementById('entryPlatform').style.display).toBe('none');
    expect(document.getElementById('entryByType').style.display).not.toBe('none');
    expect(localStorage.getItem(ENTRY_MODE_KEY)).toBe('type');
  });
  it('readMonthlyEntry in platform mode derives the split and writes it into the by-type boxes the rest of the form reads', () => {
    paintEntryMode('platform', { contract: false, hasDiversifiers: true });
    document.getElementById('entryPlatTotal').value = '300000';
    document.getElementById('entryPlatCash').value = '20000';
    document.getElementById('entryPlatBonds').value = '80000';
    document.getElementById('entryPlatDiversifiers').value = '10000';
    const r = readMonthlyEntry({ contract: false, hasDiversifiers: true });
    expect(r.problem).toBeNull();
    expect(r).toMatchObject({ equity: 190000, bond: 80000, cash: 20000, diversifier: 10000 });
    expect(r.entered.mode).toBe('platform');
    expect(r.entered.typed.total).toBe(300000);
    expect(document.getElementById('entryEquity').value).toBe('190000');
    expect(document.getElementById('entryBond').value).toBe('80000');
    expect(document.getElementById('entryCash').value).toBe('20000');
    expect(document.getElementById('entryDiversifier').value).toBe('10000');
  });
  it('readMonthlyEntry in platform mode says what is wrong instead of guessing', () => {
    paintEntryMode('platform', { contract: false, hasDiversifiers: false });
    document.getElementById('entryPlatTotal').value = '';
    expect(readMonthlyEntry({ contract: false, hasDiversifiers: false }).problem).toMatch(/pension total/i);
  });
  it('readMonthlyEntry in by-type mode reads the four boxes as before', () => {
    paintEntryMode('type', { contract: false, hasDiversifiers: false });
    document.getElementById('entryEquity').value = '200000';
    document.getElementById('entryBond').value = '80000';
    document.getElementById('entryCash').value = '20000';
    document.getElementById('entryDiversifier').value = '5000';
    const r = readMonthlyEntry({ contract: false, hasDiversifiers: false });
    expect(r).toMatchObject({ equity: 200000, bond: 80000, cash: 20000, diversifier: 5000, problem: null });
    expect(r.entered).toMatchObject({ mode: 'type', typed: { equity: 200000, bond: 80000, cash: 20000, diversifier: 5000 } });
  });
  it('a gilt-ladder plan in platform mode: total less cash is the gilts', () => {
    paintEntryMode('platform', { contract: true, hasDiversifiers: false });
    document.getElementById('entryPlatTotal').value = '250000';
    document.getElementById('entryPlatCash').value = '30000';
    const r = readMonthlyEntry({ contract: true, hasDiversifiers: false });
    expect(r).toMatchObject({ equity: 0, bond: 220000, cash: 30000 });
  });
  it('prefillMonthlyEntry fills both views from last month and says so; nothing recorded leaves them blank', () => {
    paintEntryMode('platform', { contract: false, hasDiversifiers: false });
    const hist = [{ date: '2026-09', equity: 200000, bond: 80000, cash: 20000 }];
    prefillMonthlyEntry(hist, { contract: false, hasDiversifiers: false });
    expect(document.getElementById('entryPlatTotal').value).toBe('300000');
    expect(document.getElementById('entryPlatCash').value).toBe('20000');
    expect(document.getElementById('entryPlatBonds').value).toBe('80000');
    expect(document.getElementById('entryEquity').value).toBe('200000');
    expect(document.getElementById('entryPrefillNote').textContent).toContain('September 2026');
    prefillMonthlyEntry([], { contract: false, hasDiversifiers: false });
    expect(document.getElementById('entryPlatTotal').value).toBe('');
    expect(document.getElementById('entryPrefillNote').textContent).toBe('');
  });
});

describe('the month box (jsdom): a month earlier than this calendar month is filled from the record before it, and filled again only when its record changes', () => {
  const FORM = `
    <input type="month" id="entryMonth">
    <div id="entryPlatform"></div>
    <div id="entryByType">
      <input type="number" id="entryEquity"><input type="number" id="entryBond"><input type="number" id="entryCash">
      <div id="entryDiversifierGroup"><input type="number" id="entryDiversifier" value="0"></div>
    </div>
    <p id="entryModeNote"></p>`;
  const jul = { date: '2026-07', equity: 385300, bond: 151800, cash: 52600 };
  const sep = { date: '2026-09', equity: 388200, bond: 151900, cash: 47600 };
  const nov = { date: '2026-11', equity: 390000, bond: 150000, cash: 45000 };
  const box = (id) => document.getElementById(id);
  // the clock is pinned (the Date alone, so the handlers' timers still run): 3 November 2026, a report
  beforeEach(() => { document.body.innerHTML = FORM; try { localStorage.clear(); } catch (e) { /* jsdom */ } vi.useFakeTimers({ toFake: ['Date'] }); vi.setSystemTime(new Date(2026, 10, 3, 12)); });
  afterEach(() => { vi.useRealTimers(); });
  it('prefillMonthlyEntry reads the month box when it is earlier than this month; prefillForEntryMonth fills again on a change of record and leaves typed figures alone otherwise', () => {
    paintEntryMode('platform', { contract: false, hasDiversifiers: false });
    box('entryMonth').value = '2026-10';
    expect(prefillMonthlyEntry([jul, sep], { contract: false, hasDiversifiers: false })).toMatchObject({ from: '2026-09' });
    expect(box('entryPlatTotal').value).toBe('587700');
    expect(box('entryPrefillNote').textContent).toContain('September 2026');
    // the month moves on: the same record, so what is typed stays
    box('entryPlatTotal').value = '600000';
    box('entryMonth').value = '2026-11';
    expect(prefillForEntryMonth([jul, sep])).toBeNull();
    expect(box('entryPlatTotal').value).toBe('600000');
    // the month moves back to August (the month that was missed): July's record, in both views, and the note says so
    box('entryMonth').value = '2026-08';
    expect(prefillForEntryMonth([jul, sep])).toMatchObject({ from: '2026-07' });
    expect(box('entryPlatTotal').value).toBe('589700');
    expect(box('entryPlatCash').value).toBe('52600');
    expect(box('entryPlatBonds').value).toBe('151800');
    expect(box('entryEquity').value).toBe('385300');
    expect(box('entryPrefillNote').textContent).toContain('July 2026');
    // the same month again: nothing moved
    expect(prefillForEntryMonth([jul, sep])).toBeNull();
    // a month before every record: nothing to fill from, the boxes cleared
    box('entryMonth').value = '2026-05';
    expect(prefillForEntryMonth([jul, sep])).toBeNull();
    expect(box('entryPlatTotal').value).toBe('');
    expect(box('entryPrefillNote').textContent).toBe('');
    // a month given outright wins over the box, and is never kept as an option
    expect(prefillMonthlyEntry([jul, sep], { month: '2026-10' })).toMatchObject({ from: '2026-09' });
    expect(prefillMonthlyEntry([jul, sep])).toBeNull();                              // the box still says May: nothing before it
  });
  it('the installed handlers listen to the month box: a change reads the history it was handed and fills the boxes for that month', async () => {
    paintEntryMode('platform', { contract: false, hasDiversifiers: false });
    const reads = [];
    installMonthlyEntryHandlers({ holdingsLines: () => [], effectiveSubClass: () => null, liveCatalogueEntry: () => null, SUB_ASSET_PROFILES: {}, getHistoryAsync: async (o) => { reads.push(o); return [jul, sep]; }, getDecisionSettingsAsync: async () => ({}) });
    box('entryMonth').value = '2026-10';
    prefillMonthlyEntry([jul, sep], { contract: false, hasDiversifiers: false });
    expect(box('entryPlatTotal').value).toBe('587700');
    box('entryMonth').value = '2026-08';
    box('entryMonth').dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 0));
    expect(reads).toEqual([{ limit: 1000 }]);
    expect(box('entryPlatTotal').value).toBe('589700');
    expect(box('entryEquity').value).toBe('385300');
    expect(box('entryPrefillNote').textContent).toContain('July 2026');
    // an 'input' alone (the "paid this month" tick moves the month on with one) is not a change: nothing read, nothing touched
    box('entryMonth').value = '2026-09';
    box('entryMonth').dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 0));
    expect(reads.length).toBe(1);
    expect(box('entryPlatTotal').value).toBe('589700');
  });
  it('reopened in the month the entry was made ("This month\'s payment has already been made" dates it a month on): the box at this month fills from the latest record as it always did, and the only record is never blank', () => {
    vi.setSystemTime(new Date(2026, 9, 20, 12));   // 20 October 2026: the entry was made this month, dated November
    paintEntryMode('platform', { contract: false, hasDiversifiers: false });
    box('entryMonth').value = '2026-10';           // the planner sets the box to this month at start-up
    expect(prefillMonthlyEntry([sep, nov], { contract: false, hasDiversifiers: false })).toMatchObject({ from: '2026-11' });
    expect(box('entryPlatTotal').value).toBe('585000');
    expect(box('entryPrefillNote').textContent).toContain('November 2026');
    expect(prefillMonthlyEntry([nov], { contract: false, hasDiversifiers: false })).toMatchObject({ from: '2026-11' });
    expect(box('entryPlatTotal').value).toBe('585000');
    // the hand-over on this month (the box set to it again, and a change dispatched) moves nothing
    expect(prefillForEntryMonth([sep, nov])).toBeNull();
    expect(box('entryPlatTotal').value).toBe('585000');
    // a month earlier than this one, by hand: the record before it; back to this month: the latest again
    box('entryMonth').value = '2026-09';
    expect(prefillForEntryMonth([jul, sep, nov])).toMatchObject({ from: '2026-07' });
    expect(box('entryPlatTotal').value).toBe('589700');
    box('entryMonth').value = '2026-10';
    expect(prefillForEntryMonth([jul, sep, nov])).toMatchObject({ from: '2026-11' });
    expect(box('entryPlatTotal').value).toBe('585000');
    // a month given outright is read as it is, this month included
    expect(prefillMonthlyEntry([sep, nov], { month: '2026-10' })).toMatchObject({ from: '2026-09' });
    // a month after this one in the box (the tick itself moved it on): the latest, as always
    box('entryMonth').value = '2026-11';
    expect(prefillMonthlyEntry([sep, nov])).toMatchObject({ from: '2026-11' });
  });
});

describe('readMonthlyEntry carries the "This month\'s payment has already been made" tick (paidAhead)', () => {
  const BOXES = '<div id="entryPlatform"></div><div id="entryByType"><input type="number" id="entryEquity" value="380000"><input type="number" id="entryBond" value="100000"><input type="number" id="entryCash" value="20000"><div id="entryDiversifierGroup"><input type="number" id="entryDiversifier" value="0"></div></div><p id="entryModeNote"></p>';
  beforeEach(() => { document.body.innerHTML = BOXES + '<input type="checkbox" id="entryPaidThisMonth">'; try { localStorage.clear(); localStorage.setItem(ENTRY_MODE_KEY, 'type'); } catch (e) { /* jsdom */ } });
  it('false without the tick or without the box, true with it, on the figures path and the problem path alike', () => {
    expect(readMonthlyEntry({ contract: false, hasDiversifiers: false })).toMatchObject({ equity: 380000, paidAhead: false });
    document.getElementById('entryPaidThisMonth').checked = true;
    expect(readMonthlyEntry({ contract: false, hasDiversifiers: false })).toMatchObject({ equity: 380000, paidAhead: true });
    try { localStorage.setItem(ENTRY_MODE_KEY, 'platform'); } catch (e) { /* jsdom */ }   // the platform view with no total typed: the problem path carries the tick too
    expect(readMonthlyEntry({ contract: false, hasDiversifiers: false })).toMatchObject({ problem: expect.any(String), paidAhead: true });
    document.getElementById('entryPaidThisMonth').remove();
    try { localStorage.setItem(ENTRY_MODE_KEY, 'type'); } catch (e) { /* jsdom */ }
    expect(readMonthlyEntry({ contract: false, hasDiversifiers: false }).paidAhead).toBe(false);
  });
});
