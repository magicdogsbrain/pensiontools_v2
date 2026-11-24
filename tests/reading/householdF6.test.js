/**
 * Step F6 (lead4.md D20, G1): the household check's figures have one reader each and carry the same marks in both views.
 * The full view's HTML (src/ui/householdView.js) is read here; the simple view draws the same slots and marks
 * (HouseholdScreen.jsx through householdSlotMarks / householdRowFact / HOUSEHOLD_LEAD_FINDS), and the parity gate compares the two.
 */
import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { verdictSectionHtml, timelineSectionHtml, wealthSectionHtml, survivorCareHtml } from '../../src/ui/householdView.js';
import { householdYearsOf, householdLeftOf, householdSlotMarks, householdRowFact, CHECK_DEFAULTS } from '../../src/answers/plan/household.js';
import { HOUSEHOLD } from '../../src/v7/copy/household.js';

const doc = (html) => new JSDOM('<body>' + html + '</body>').window.document;
const facts = (d) => Object.fromEntries([...d.querySelectorAll('[data-fact]')].map((e) => [e.getAttribute('data-fact'), e.textContent]));

describe('the household check, marked the same in both views (step F6)', () => {
  it('each plan on its own and both carry their chance as household.#.chance; the household row carries none of its own', () => {
    const r = { runs: 1000, jointSuccess: 0.93, successA: 0.97, successB: 0.949, pooled: { success: 0.96, shortA: { n: 0 }, shortB: { n: 37, median: 93, earliest: 87 } } };
    const f = facts(doc(verdictSectionHtml({ r, ownName: 'Jo', pName: 'Pat' })));
    expect(f['household.a.chance']).toBe('97%');
    expect(f['household.b.chance']).toBe('94.9%');
    expect(f['household.both.chance']).toBe('93%');
    expect(householdRowFact('household')).toBe(null);
    // only this plan's name is marked as the plan's name: "Jo" in the row and in the sentence of who paid
    expect(f['plan.name']).toBe('Jo');
  });

  it('a name slot is the plan\'s name only when it names this plan', () => {
    expect(householdSlotMarks('covered', { short: 'Pat', payer: 'Jo' }, 'Jo')).toEqual({ payer: 'plan.name' });
    expect(householdSlotMarks('starts', { a: 'Jo', b: 'Pat' }, 'Jo')).toEqual({ a: 'plan.name', total: 'household.start.total', potA: 'household.start.a', potB: 'household.start.b' });
  });

  it('the year rows shown are one rule: the first, every fifth, and each row where what the table says changes', () => {
    // by hand: 12 rows; Jo stops work after year 2 (row 3 changes), the State Pensions start at row 7; rows 0, 5, 10 are fifth rows
    const rows = Array.from({ length: 12 }, (_, i) => ({ year: i, workingA: i < 3, workingB: false, spA: i >= 7 ? 11000 : 0, spB: 0, db: 0, other: 0, needA: 18000, needB: 20000, drawNeed: 30000 }));
    const shown = householdYearsOf(rows, 2030).filter((x) => x.shown).map((x) => x.year);
    expect(shown).toEqual(['2030', '2033', '2035', '2037', '2040']);
    // the full view draws exactly those rows, each cell keyed by its year and column
    const d = doc(timelineSectionHtml(rows, 'Jo', 'Pat', 2030));
    expect([...d.querySelectorAll('[data-fact-table="household.years"] tbody tr')].map((tr) => tr.getAttribute('data-year'))).toEqual(shown);
    expect(d.querySelector('[data-row="2037"][data-col="sp"]').textContent).toBe('£11,000');
    expect(d.querySelector('[data-row="2030"][data-col="a"]').textContent).toBe('still working');
  });

  it('what is left combined: every fifth year of the fan, the same cells in the full view', () => {
    const fan = Array.from({ length: 11 }, (_, i) => ({ year: i, p10: 1000 * i, p50: 2000 * i, p90: 3000 * i }));
    expect(householdLeftOf(fan, 2030).map((x) => x.year)).toEqual(['2030', '2035', '2040']);
    const d = doc(wealthSectionHtml(fan, 2030));
    expect(d.querySelector('[data-fact-table="household.left"] [data-row="2035"][data-col="p50"]').textContent).toBe('£10,000');
  });

  it('the survivor and care questions open with the one set of figures, marked', () => {
    const f = facts(doc(survivorCareHtml('Jo', 'Pat')));
    expect(f['household.survivor.spendPct']).toBe(CHECK_DEFAULTS.spendPct + '%');
    expect(f['household.care.low']).toBe('£80,000');
    expect(f['household.care.high']).toBe('£100,000');
    // the words' share is the survivor check's own starting figure
    expect(HOUSEHOLD.survivor.lead).toContain('about ' + CHECK_DEFAULTS.spendPct + '% of the joint');
  });
});
