/**
 * The Household tab's words and table (household-draw-split.md §4; usability audit §2.10): the headline is unmissable
 * and equals the table; the household verdict comes first; every figure is from the split or the runs; the choices and
 * the limit are there; the Budget's line when the budget is shared. HTML from data, no DOM needed beyond jsdom.
 */
import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { householdDrawSplit, comparisonFigures, headlineWords, about } from '../src/services/HouseholdDraw.js';
import { combineHouseholdStrategies } from '../src/services/HouseholdService.js';
import { splitSectionHtml, splitDismissedHtml, splitConfirmHtml, verdictSectionHtml, householdVerdictHtml, timelineSectionHtml, wealthSectionHtml, whatToDoHtml, survivorCareHtml, budgetShareHtml, budgetSharedLineHtml } from '../src/ui/householdView.js';
import { householdIncomeTimeline } from '../src/services/HouseholdService.js';
import { splitChanges } from '../src/services/HouseholdSplitApply.js';

const NOW = new Date('2026-10-17T10:00:00Z');
const BANDS = { pa: 12570, brl: 50270, hrl: 125140 };
const stressA = { configured: true, retired: true, currentAge: 64, shapeAgeNow: 64, duration: 28, baseSalary: 64100, equityMin: 600000, bondMin: 250000, cashTarget: 60000, isaBalance: 0, other: 0, isaDrawdownStrategy: 'hold', dbAmount: 6100, dbStartYear: 0, statePension: 11973, statePensionYear: 3, accessMethod: 'drawdown', ...BANDS, strategyId: 'pots-and-valves' };
const stressB = { configured: true, retired: true, currentAge: 59, shapeAgeNow: 59, duration: 33, baseSalary: 0, equityMin: 125000, bondMin: 45000, cashTarget: 15000, isaBalance: 0, other: 0, isaDrawdownStrategy: 'hold', statePension: 11973, statePensionYear: 8, accessMethod: 'ufpls', ...BANDS, strategyId: 'pots-and-valves' };
const split = householdDrawSplit({ settings: stressA, name: 'Alex' }, { settings: stressB, name: 'Sam' }, { now: NOW });
const text = (h) => new JSDOM('<body>' + h + '</body>').window.document.body.textContent.replace(/\s+/g, ' ').trim();
const doc = (h) => new JSDOM('<body>' + h + '</body>').window.document;

/** A strategy result as the worker sends it back (compact), with a per-future read-out for the pooled verdict. */
const mk = (dur, p50start, terminal, ruin) => ({ affordable: true, ruin: { mc: ruin }, terminal: { p50: terminal, p10: terminal / 2 }, n: { mc: 1000 },
  cones: { wealth: { p50: Array.from({ length: dur + 1 }, (_, y) => Math.max(0, p50start - y * (p50start / dur))), p10: Array.from({ length: dur + 1 }, () => 0) } },
  survivedMc: Array.from({ length: 10 }, (_, i) => i % 10 >= ruin / 10), futuresMc: { terminal: Array.from({ length: 10 }, () => terminal), failYear: Array.from({ length: 10 }, (_, i) => (i % 10 >= ruin / 10 ? null : 3)) },
  samples: { wealth: Array.from({ length: 10 }, () => Array.from({ length: dur + 1 }, (_, y) => Math.max(0, p50start - y * (p50start / dur)))) } });
const runs = (() => {
  const own = { rA: mk(28, 910000, 400000, 10), rB: mk(33, 185000, 150000, 0) }, tog = { rA: mk(28, 910000, 700000, 0), rB: mk(33, 185000, 0, 30) };
  return {
    own: { ...own, combined: combineHouseholdStrategies(own.rA, own.rB, { needA: split.needs.own.a, needB: split.needs.own.b, startAgeA: 64, startAgeB: 59 }) },
    together: { ...tog, combined: combineHouseholdStrategies(tog.rA, tog.rB, { needA: split.needs.together.a, needB: split.needs.together.b, startAgeA: 64, startAgeB: 59 }) }
  };
})();
const fig = comparisonFigures(split, runs);

describe('the headline section', () => {
  const html = splitSectionHtml({ split, fig, mode: 'write' });
  const t = text(html);

  it('leads with the saving a year and until the smaller pot\'s owner is 67, in the design\'s words', () => {
    // 6.45.0 (household-draw-split.md 9.2, 9.4): the default limit keeps Sam's pot until 67 (£23,125 a year), and every pound is compared,
    // so Sam's quarter-tax-free pounds in the band replace Alex's taxed ones: £8,045 a year, £64,362 by 67
    expect(t).toMatch(/^Who draws what: drawing together, tax first Drawing together saves about £8,000 a year in tax — about £64,000 by the time Sam is 67\./);
    expect(t).toContain('Your pots are very unequal (£910,000 and £190,000). When each of you draws for your own plan, Alex pays 40% on £13,800 a year while £12,570 of Sam’s tax-free allowance and most of Sam’s 20% band go unused.');
  });

  it('the headline equals the table: the yearly figure is the first-year row, the total is the until-67 row', () => {
    const d = doc(html);
    const rows = [...d.querySelectorAll('#hhSplitTable tbody tr')].map((tr) => [...tr.children].map((td) => td.textContent.trim()));
    const first = rows.find((r) => r[0].startsWith('Tax a year'));
    const until = rows.find((r) => r[0].startsWith('Tax until Sam is 67'));
    const own1 = +first[1].replace(/[£,]/g, ''), tog1 = +first[2].replace(/[£,]/g, '');
    expect(about(own1 - tog1)).toBe(about(split.saving.year));
    expect(t).toContain('saves about ' + about(own1 - tog1) + ' a year');
    const ownU = +until[1].split(' / ')[0].replace(/[£,]/g, ''), togU = +until[2].split(' / ')[0].replace(/[£,]/g, '');
    expect(about(ownU - togU)).toBe(about(split.saving.until));
    expect(t).toContain('about ' + about(ownU - togU) + ' by the time Sam is 67');
    expect(own1).toBe(13072);
    expect(Math.abs(tog1 - 5027)).toBeLessThan(5);   // under the default limit: Sam's £23,125 a year, its pounds cheaper than Alex's
  });

  it('the cost to the smaller pot, each pot at 67/75/90, lasts in N of 10, left at 90 middling and bad case, the closing line', () => {
    expect(t).toContain('The cost: Sam’s pot is spent as the bridge to the State Pension: about ' + about(fig.cost.together) + ' at 67 in a middling case, instead of about ' + about(fig.cost.own) + ' if each of you draws for your own plan.');
    expect(t).toContain('Alex\'s pot at 67 / 75 / 90 (middling)');
    expect(t).toContain('Sam\'s pot at 67 / 75 / 90 (middling)');
    const lastsRow = [...doc(html).querySelectorAll('#hhSplitTable tbody tr')].find((tr) => tr.children[0].textContent.startsWith('The money lasts for the household (9 in 10 is on course)'));
    expect(lastsRow.children[1].textContent).toBe(fig.own.lasts.household.words.replace(/^in /, ''));
    expect(lastsRow.children[2].textContent).toBe(fig.together.lasts.household.words.replace(/^in /, ''));
    expect(t).toContain('Left for the household when Alex is 90, today\'s prices (middling / bad case)');
    expect(t).toContain('Paying the tax keeps Sam’s pot, and your money more separate. Drawing together leaves the household about ' + about(fig.betterOff90) + (fig.betterOff90 >= 0 ? ' better off' : ' worse off') + ' at 90. This is your choice; neither is wrong.');
  });

  it('the two columns are "As the two plans are written" and "Paid as a couple, tax first" (household-draw-split.md 9.1)', () => {
    const heads = [...doc(html).querySelectorAll('#hhSplitTable thead th')].map((th) => th.textContent);
    expect(heads).toEqual(['', 'As the two plans are written', 'Paid as a couple, tax first']);
    expect(t).not.toMatch(/Each for their own|Drawing together\s*$/);
  });

  it('the limit controls, the two choices, and copies when a plan is locked', () => {
    const d = doc(html);
    expect(d.querySelector('#hhLimitKind option[value="untilAge"]').textContent).toBe('Keep Sam\'s pot until an age');
    // the default limit (9.2) shows as chosen; "None" is the fast split, its value the form's 'none' (HouseholdDraw.limitFrom)
    expect(d.querySelector('#hhLimitKind option[value="untilAge"]').selected).toBe(true);
    expect(d.querySelector('#hhLimitKind option[value="none"]').textContent).toBe('None');
    expect(d.querySelector('#hhLimitAge').value).toBe('67');
    expect(d.querySelector('[data-on-click="rerunHouseholdSplit()"]')).toBeTruthy();
    expect(d.querySelector('#hhUseSplit').textContent).toBe('Use this split');
    expect(d.querySelector('#hhKeepAsIs').textContent).toBe('Keep things as they are');
    const copies = text(splitSectionHtml({ split, fig, mode: 'copies', locked: ['Alex'] }));
    expect(copies).toContain('Make copies of both plans with this split');
    expect(copies).toContain('Alex is a locked plan: a locked plan is never changed.');
    expect(text(splitDismissedHtml())).toContain('You chose to keep things as they are');
    expect(doc(splitDismissedHtml()).querySelector('[data-on-click="showHouseholdSplitAgain()"]')).toBeTruthy();
  });

  it('before the runs are in, the headline stands on the split and the table says the figures are coming', () => {
    const early = text(splitSectionHtml({ split, fig: null, mode: 'write', running: true }));
    expect(early).toContain('Drawing together saves about £8,000 a year in tax');
    expect(early).toContain('The runs are still going…');
    expect(early).toContain('…');
  });

  it('the 2028 note and the ladder note appear when they apply', () => {
    const with2028 = householdDrawSplit({ settings: stressA, name: 'Alex' }, { settings: { ...stressB, currentAge: 55, shapeAgeNow: 55, statePensionYear: 12 }, name: 'Sam' }, { now: NOW });
    expect(text(splitSectionHtml({ split: with2028, fig: null }))).toContain('Sam will be 56 on 6 April 2028: take the months up to the 57th birthday in one go before then (or check whether the scheme gives a protected pension age).');
    const ladder = householdDrawSplit({ settings: { ...stressA, strategyId: 'full-il-gilt', strategyParams: { sippTotal: 900000 } }, name: 'Alex' }, { settings: stressB, name: 'Sam' }, { now: NOW });
    expect(text(splitSectionHtml({ split: ladder, fig: null }))).toContain('Alex’s plan is a gilt ladder: the comparison sizes the ladder to the lower draw, as if the rungs not needed were sold today.');
  });

  it('the confirm lists what changes', () => {
    const own = { stressTool: { settings: stressA } }, partner = { stressTool: { settings: stressB } };
    const h = splitConfirmHtml(splitChanges(split, own, partner), 'write');
    expect(text(h)).toContain('Write the split into both plans as their income shape? You can undo this straight afterwards.');
    expect(text(h)).toContain('Alex: £64,100 a year → £32,930 a year from 64');   // Alex below the top of the band, Sam's £23,125 paying the rest
    expect(text(splitConfirmHtml([], 'copies'))).toContain('Your plans stay exactly as they are');
  });

  it('plain English: no "scenario", no "undefined", no "NaN"', () => {
    for (const h of [html, splitDismissedHtml(), verdictSectionHtml({ r: runs.own.combined, ownName: 'Alex', pName: 'Sam' })]) expect(text(h)).not.toMatch(/scenario|undefined|NaN|null/i);
  });
});

describe('the verdict: the household first, each pot second', () => {
  it('says the pooled chance first, then each plan on its own and both as separate plans', () => {
    const r = runs.own.combined;
    const h = verdictSectionHtml({ r, ownName: 'Alex', pName: 'Sam', startsNote: 'Sam\'s plan begins later.' });
    const d = doc(h);
    expect(d.querySelector('#hhHouseholdVerdict').textContent).toContain('the household\'s money lasts in');
    expect(d.querySelector('#hhHouseholdVerdict').textContent).toContain('When one plan falls short (its money runs out, or a strategy that cuts instead cuts it), the other pays that share; the household falls short only when both have.');
    const rows = [...d.querySelectorAll('tbody tr')].map((tr) => tr.children[0].textContent);
    expect(rows[0]).toContain('The household together');
    expect(rows[1]).toBe('Alex\'s plan on its own');
    expect(rows[3]).toBe('Both plans, each lasting on its own');
    expect(d.querySelector('#hhStartsNote').textContent).toBe('Sam\'s plan begins later.');
    expect(householdVerdictHtml({ jointSuccess: 0.95, pooled: null })).toContain('On course');
    expect(householdVerdictHtml({ jointSuccess: 0.5, pooled: null })).toContain('At risk');
  });
  it('the other sections render from their data', () => {
    const rows = householdIncomeTimeline(stressA, stressB, null, NOW);
    expect(text(timelineSectionHtml(rows, 'Alex', 'Sam', 2026))).toContain('Where the money comes from, year by year');
    expect(text(wealthSectionHtml(runs.own.combined.potFan, 2026))).toContain('What you\'d have left, combined');
    expect(whatToDoHtml({ jointSuccess: 0.95, successA: 0.95, successB: 0.99, pooled: { success: 0.95 } }, 'Alex', 'Sam')).toBe('');
    expect(text(whatToDoHtml({ jointSuccess: 0.5, successA: 0.5, successB: 0.99, pooled: null }, 'Alex', 'Sam'))).toContain('The weaker side is Alex');
    const sc = doc(survivorCareHtml('Alex', 'Sam'));
    expect(sc.querySelector('#hhWhoDies option[value="B"]').textContent).toBe('Sam');
    expect(sc.querySelector('[data-on-click="runCareUI()"]')).toBeTruthy();
  });
});

describe('one budget for the household', () => {
  it('the Household tab says which plan\'s budget is the household\'s and offers the share', () => {
    expect(text(budgetShareHtml({ ownName: 'Alex', pName: 'Sam', sharedFrom: false, sharedTo: false }))).toContain('share this plan\'s budget and Sam\'s plan reads the same lines');
    expect(doc(budgetShareHtml({ ownName: 'Alex', pName: 'Sam' })).querySelector('[data-on-click="shareHouseholdBudget()"]').textContent).toBe('Share this plan\'s budget with Sam');
    expect(text(budgetShareHtml({ ownName: 'Alex', pName: 'Sam', sharedTo: true }))).toContain('This plan\'s budget is the household\'s: Sam\'s plan reads the same budget lines');
    expect(text(budgetShareHtml({ ownName: 'Alex', pName: 'Sam', sharedFrom: true }))).toContain('The household\'s budget is Sam\'s: this plan reads the same budget lines');
  });
  it('the Budget page\'s line', () => {
    expect(text(budgetSharedLineHtml({ sharedFromName: 'Alex' }))).toBe('This is your household\'s budget, shared with Alex: the lines are the same on both plans; your share of who pays is this plan\'s own.');
    expect(text(budgetSharedLineHtml({ sharedToNames: ['Sam'] }))).toContain('shared with Sam');
    expect(budgetSharedLineHtml({})).toBe('');
  });
});
