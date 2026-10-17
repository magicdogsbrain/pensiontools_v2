/**
 * Monthly entry asks for what a platform shows (decision 10, research/v7/v6-usability-audit.md §2.7):
 * "Pension total; of which cash; of which bond funds or gilts". Shares are the rest; a gilt-ladder plan is
 * the total less cash (nobody adds up 22 rungs). Last month's figures are pre-filled. Entry by type stays as
 * an option. The engine still receives the same per-type figures; the record keeps what was typed and the split.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { splitFromPlatform, prefillFromHistory, enteredBlock, platformBoxes, prefillNote } from '../src/services/MonthlyEntry.js';
import { decisionToHistory } from '../src/models/Decision.js';
import { platformEntryHtml, paintEntryMode, readMonthlyEntry, prefillMonthlyEntry, ENTRY_MODE_KEY } from '../src/ui/monthlyEntry.js';
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
