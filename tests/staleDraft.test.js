/**
 * 6.15.0 — a DRAFT whose start year has passed is offered an update to today (never moved or deleted
 * automatically), the start-year drop-down is never blank, and the plan can be downloaded as a file.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { staleDraft, staleDraftMessage, startYearChoices, deriveTiming } from '../src/services/PlanTiming.js';
import { stripIdentity, planExportFileName, planExportJson } from '../src/services/PlanExport.js';
import { parse } from '../src/ui/inlineHandlers.js';

const SEP_2029 = new Date(2029, 8, 9);          // tax year 2029/30
const retired = { currentAge: 62, currentAgeAsOf: '2026-03-01', spStartDate: '12 June 2030', retired: true, retireAge: null, firstTaxYear: 2027, shapeAgeNow: 64, duration: 30 };

describe('staleDraft: a draft whose saved start year has passed', () => {
  // Re-written in 6.51.0 (research/plan-start.md §3, "staleDraft"): a passed start year means "out of date" only for a plan
  // that does not say when work stopped (as every plan here) — or that started before the stop. Someone who stopped work and
  // whose plan's income started that tax year or later is running, not stale: the case after the next.
  it('offers the current tax year, in our words (a retiree with no stop month)', () => {
    const sd = staleDraft(retired, { locked: false, now: SEP_2029 });
    expect(sd).toEqual({ savedYear: 2027, savedLabel: '2027/28', suggestedYear: 2029, suggestedLabel: '2029/30', mode: 'retired' });
    expect(staleDraftMessage(sd)).toBe('This plan was set to start in 2027/28, which has passed. Update it to start now (2029/30)?');
  });
  it('a retiree who stopped work, with the plan\'s income from that tax year or later, is running: never offered it', () => {
    const stopped = { ...retired, stoppedWork: '2027-02' };                       // stopped in 2026/27; year 0 2027/28 (a later start)
    expect(staleDraft(stopped, { now: SEP_2029 })).toBeNull();
    expect(staleDraft({ ...stopped, firstTaxYear: 2026 }, { now: SEP_2029 })).toBeNull();   // year 0 = the stop's tax year
    // a start before the stop is still offered; so is a start whose stop month has not come (not "stopped")
    expect(staleDraft({ ...stopped, firstTaxYear: 2025 }, { now: SEP_2029 })).toMatchObject({ savedYear: 2025 });
    expect(staleDraft({ ...retired, stoppedWork: '2030-02' }, { now: SEP_2029 })).toMatchObject({ savedYear: 2027 });
    // stopping later in a month: stale once that month's tax year has passed, not the year the age is reached
    const later = { ...retired, retired: false, retireAge: 64, firstTaxYear: null, stoppedWork: '2028-06' };
    expect(staleDraft(later, { now: new Date(2029, 3, 5) })).toBeNull();
    expect(staleDraft(later, { now: SEP_2029 })).toMatchObject({ savedYear: 2028, mode: 'future' });
  });
  it('a locked plan is never offered it, nor one with months already recorded', () => {
    expect(staleDraft(retired, { locked: true, now: SEP_2029 })).toBeNull();
    expect(staleDraft(retired, { locked: false, hasRecords: true, now: SEP_2029 })).toBeNull();
  });
  it('is not stale while the saved year is this tax year or later; 6 April is the boundary', () => {
    expect(staleDraft(retired, { now: new Date(2026, 8, 30) })).toBeNull();      // starts next April
    expect(staleDraft(retired, { now: new Date(2027, 8, 30) })).toBeNull();      // in its first year
    expect(staleDraft(retired, { now: new Date(2028, 3, 5) })).toBeNull();       // last day of 2027/28
    expect(staleDraft(retired, { now: new Date(2028, 3, 6) })).toMatchObject({ savedYear: 2027, suggestedYear: 2028 });
  });
  it('"Leave it" is remembered for that saved year only', () => {
    expect(staleDraft({ ...retired, staleDraftDismissedFor: 2027 }, { now: SEP_2029 })).toBeNull();
    expect(staleDraft({ ...retired, staleDraftDismissedFor: 2026 }, { now: SEP_2029 })).toMatchObject({ savedYear: 2027 });
  });
  it('retiring later: stale once the tax year of the retire age has passed; the suggestion is the current tax year', () => {
    const future = { ...retired, retired: false, retireAge: 64, firstTaxYear: null };   // reaches 64 in 2027/28
    expect(staleDraft(future, { now: new Date(2026, 8, 30) })).toBeNull();
    expect(staleDraft(future, { now: new Date(2027, 8, 30) })).toBeNull();
    expect(staleDraft(future, { now: SEP_2029 })).toEqual({ savedYear: 2027, savedLabel: '2027/28', suggestedYear: 2029, suggestedLabel: '2029/30', mode: 'future' });
    // a retire age still ahead is never stale, whatever year happens to be stored
    expect(staleDraft({ ...future, retireAge: 70, firstTaxYear: 2020 }, { now: SEP_2029 })).toBeNull();
  });
  it('a plan with no age recorded: its saved or pinned start year counts', () => {
    expect(staleDraft({ firstTaxYear: 2027 }, { now: SEP_2029 })).toMatchObject({ savedYear: 2027, suggestedYear: 2029, mode: 'legacy' });
    expect(staleDraft({ legacyFirstTaxYear: 2027 }, { now: SEP_2029 })).toMatchObject({ savedYear: 2027, mode: 'legacy' });
    expect(staleDraft({}, { now: SEP_2029 })).toBeNull();
    expect(staleDraft(null, { now: SEP_2029 })).toBeNull();
  });
  it('taking the suggestion clears it: the plan then starts this tax year', () => {
    const sd = staleDraft(retired, { now: SEP_2029 });
    const updated = { ...retired, firstTaxYear: sd.suggestedYear };
    expect(staleDraft(updated, { now: SEP_2029 })).toBeNull();
    expect(deriveTiming(updated, SEP_2029)).toMatchObject({ mode: 'retired', firstTaxYear: 2029, shapeAgeNow: 66 });
  });
});

describe('startYearChoices: the start-year drop-down is never blank', () => {
  it('a saved year that is not offered is kept, labelled "(saved)"; next April is never offered (7.3.3)', () => {
    const t = deriveTiming(retired, SEP_2029);
    const c = startYearChoices(t, retired.firstTaxYear);
    expect(c).toEqual([
      { year: 2027, label: '2027/28 (saved)', saved: true },
      { year: 2029, label: 'this tax year — pick up from here — 2029/30', saved: false }
    ]);
    expect(c.some((x) => x.year === t.firstTaxYear)).toBe(true);   // the selected value exists
  });
  it('the saved year stays on offer after another year is picked in the form', () => {
    const t = deriveTiming({ ...retired, firstTaxYear: 2029 }, SEP_2029);
    expect(startYearChoices(t, 2027).map((x) => x.year)).toEqual([2027, 2029]);
  });
  it('a plan saved for next April keeps that year, as saved, beside this tax year: nothing new can be chosen later', () => {
    const now = new Date(2026, 8, 30);
    expect(startYearChoices(deriveTiming(retired, now), 2027).map((x) => x.label)).toEqual(['this tax year — pick up from here — 2026/27', '2027/28 (saved)']);
    expect(startYearChoices(deriveTiming({ ...retired, firstTaxYear: 2026 }, now), null).length).toBe(1);
  });
  it('a retiree who has saved no year and given no stop month: the derived year is shown by its year alone, never "(saved)"', () => {
    const now = new Date(2026, 10, 6);
    const t = deriveTiming({ currentAge: 62, retired: true }, now);
    expect(t.firstTaxYear).toBe(2026);   // 7.4.0: this tax year (it was next April)
    const c = startYearChoices(t, null);
    expect(c.map((x) => x.label)).toEqual(['this tax year — pick up from here — 2026/27']);
    expect(c.some((x) => x.saved)).toBe(false);
    expect(c.some((x) => x.year === t.firstTaxYear)).toBe(true);   // the selected value still exists
  });
});

describe('plan export helpers', () => {
  it('the file is <plan-name>-<YYYY-MM-DD>.json, safe as a file name, dated by the local day', () => {
    expect(planExportFileName('My plan', new Date(2026, 8, 30))).toBe('My-plan-2026-09-30.json');
    expect(planExportFileName('  Alex & Jo: 70k/55k "ladder"  ', new Date(2027, 0, 5))).toBe('Alex-Jo-70k55k-ladder-2027-01-05.json');
    expect(planExportFileName('', new Date(2026, 8, 30))).toBe('plan-2026-09-30.json');
    expect(planExportFileName('../../etc', new Date(2026, 8, 30))).toBe('etc-2026-09-30.json');
  });
  it('uid and email fields are stripped at any depth; everything else is byte-for-byte the document', () => {
    const doc = { id: 'abc', isActive: true, uid: 'U1', planDetails: { name: 'P', ownerEmail: 'a@b.c' },
      stressTool: { settings: { firstTaxYear: 2027, email: 'a@b.c', taggedFunds: [{ ticker: 'VWRL', value: 1, userId: 'U1' }] } }, decisionTool: { history: [] } };
    const out = stripIdentity(doc);
    expect(out).toEqual({ id: 'abc', isActive: true, planDetails: { name: 'P' }, stressTool: { settings: { firstTaxYear: 2027, taggedFunds: [{ ticker: 'VWRL', value: 1 }] } }, decisionTool: { history: [] } });
    expect(doc.uid).toBe('U1');                                   // the plan in memory is not touched
    expect(JSON.parse(planExportJson(doc))).toEqual(out);
    expect(planExportJson(doc)).not.toMatch(/U1|a@b\.c/);
    const clean = { id: 'x', stressTool: { settings: { baseSalary: 40000, incomeSteps: [{ fromAge: 57, amount: 40000 }], potAtRetirement: null } } };
    expect(JSON.parse(planExportJson(clean))).toEqual(clean);     // nothing to strip: unchanged
  });
});

describe('index.html wiring (read from the source; no browser here)', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  it('the banner has two homes — the Timing block and the top of the Stress settings — and two buttons', () => {
    expect(html).toMatch(/id="ssStaleDraftBanner" class="[^"]*stale-draft-banner/);
    expect(html).toMatch(/id="tmStaleDraftBanner" class="[^"]*stale-draft-banner/);
    expect(html.indexOf('id="ssLockBanner"')).toBeLessThan(html.indexOf('id="ssStaleDraftBanner"'));
    expect(html.indexOf('id="ssTimingBlock"')).toBeLessThan(html.indexOf('id="tmStaleDraftBanner"'));
    expect(html.indexOf('id="tmStaleDraftBanner"')).toBeLessThan(html.indexOf('id="tmAge"'));
    expect(html).toContain('data-on-click="updateStaleDraft()">Update the plan</button>');
    expect(html).toContain('data-on-click="dismissStaleDraft()">Leave it</button>');
    for (const fn of ['updateStaleDraft', 'dismissStaleDraft', 'exportActivePlan']) expect(html).toContain('window.' + fn + ' = async function');
    expect(html).toContain('staleDraftDismissedFor: sd.savedYear');
  });
  it('the download is in the plan menu and the phone menu, and its handlers fit the no-eval grammar', () => {
    expect(html).toMatch(/id="scenarioExportBtn"[^>]*data-on-click="exportActivePlan\(\)">Download this plan \(JSON\)<\/button>/);
    expect(html).toContain('closeMobileSheet(); exportActivePlan();');
    for (const e of ['updateStaleDraft()', 'dismissStaleDraft()', 'exportActivePlan()', 'closeMobileSheet(); exportActivePlan();']) expect(() => parse(e)).not.toThrow();
  });
  it('the start-year drop-down is built from startYearChoices', () => {
    expect(html).toContain('startYearChoices(t, savedStart)');
  });
  it('no label says protection waits for "cash draws" — the rule is months below the glidepaths', () => {
    expect(html).not.toMatch(/Cash Draws Before Protection/i);
    expect(html).not.toMatch(/Cash months before it cuts/i);
    expect((html.match(/<label>Months Below Glidepath Before Protection<\/label>/g) || []).length).toBe(2);
  });
});
