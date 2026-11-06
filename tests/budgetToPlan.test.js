/**
 * The Budget's "Use £X a month as my spending" (6.23.0, usability audit decision 6): it writes the spending figure and
 * nothing else, asks first, and can be undone. And the three false promises are gone from the words.
 */
import { describe, it, expect, vi } from 'vitest';
import { budgetSpendingPatch, spendingBefore, plusTenth, aMonth, useSpendingWords, SPENDING_KEYS } from '../src/services/BudgetToPlan.js';
import { defaultBudget, markBudgetAgesSet, budgetSharePctAtAge, myAnnualNetAtAge, budgetToCsv, parseBudgetCsv } from '../src/services/BudgetModel.js';
import { budgetSummaryWords } from '../src/services/PlanSeed.js';
import { showUndoToast } from '../src/ui/undoToast.js';
import { readFileSync } from 'node:fs';

const money = (n) => '£' + Math.round(n).toLocaleString('en-GB');

describe('what the button writes', () => {
  it('only the spending figure: the first step, the target and the schedule that follows the steps', () => {
    const stress = { duration: 30, shapeAgeNow: 60, incomeSteps: [{ fromAge: 60, amount: 40000 }, { fromAge: 75, amount: 30000 }], strategyId: 'floor-and-flex', strategyParams: { essentialsAnnual: 20000 }, strategyState: { 'floor-and-flex': { strategyParams: { essentialsAnnual: 20000 } } } };
    const patch = budgetSpendingPatch(defaultBudget(), stress, 36000);
    expect(Object.keys(patch).sort()).toEqual([...SPENDING_KEYS].sort());
    expect(patch.baseSalary).toBe(36000);
    expect(patch.incomeShape).toBe('phases');
    expect(patch.incomeSteps).toEqual([{ fromAge: 60, amount: 36000 }, { fromAge: 75, amount: 30000 }]);   // the later steps are the person's
    expect(patch.shapeAgeNow).toBe(60);
    expect(patch.targetSchedule.length).toBe(31);
    expect(patch.targetSchedule[0]).toBe(36000);
    expect(patch.targetSchedule[15]).toBe(30000);
    expect(patch).not.toHaveProperty('strategyParams');     // never the Floor & Flex essentials
    expect(patch).not.toHaveProperty('strategyState');
    expect(stress.incomeSteps[0].amount).toBe(40000);        // the input is not changed
  });
  it('a plan with no shape yet gets one step at its start; a Budget nobody gave ages to starts at 57, one with ages at retirement', () => {
    expect(budgetSpendingPatch(defaultBudget(), { duration: 30 }, 30000)).toMatchObject({ shapeAgeNow: 57, incomeSteps: [{ fromAge: 57, amount: 30000 }] });
    expect(budgetSpendingPatch(markBudgetAgesSet(defaultBudget(50, 62)), { duration: 30 }, 30000).shapeAgeNow).toBe(62);
  });
  it('Undo puts back exactly the keys it changed, as they were — absent keys as null — and the Decision target', () => {
    const before = spendingBefore({ baseSalary: 40000, incomeSteps: [{ fromAge: 60, amount: 40000 }], duration: 30 }, { baseSalary: 40000 });
    expect(before.stress).toEqual({ baseSalary: 40000, incomeShape: null, incomeSteps: [{ fromAge: 60, amount: 40000 }], shapeAgeNow: null, targetSchedule: null });
    expect(before.decision).toEqual({ baseSalary: 40000 });
    expect(spendingBefore(undefined, undefined).decision.baseSalary).toBeNull();
  });
});

describe('the figure and the words', () => {
  it('+10% raises the figure by a tenth, to the pound', () => {
    expect(plusTenth(2264)).toBe(2490);
    expect(plusTenth(0)).toBe(0);
    expect(plusTenth('abc')).toBe(0);
    expect(aMonth(2264.4, money)).toBe('£2,264 a month');
  });
  it('the button names the figure; the question says what it replaces and that it can be undone', () => {
    const w = useSpendingWords({ monthly: 2264, wasMonthly: 3333, plusTen: false }, money);
    expect(w.button).toBe('Use £2,264 a month as my spending');
    expect(w.ask).toBe('Use £2,264 a month as your spending? It replaces the plan\'s spending figure (was £3,333 a month). Nothing else in the plan changes, and you can undo it for a few seconds afterwards.');
    expect(w.done).toBe('Your spending is now £2,264 a month take-home (was £3,333 a month).');
    expect(w.undone).toBe('Put back: your spending is £3,333 a month again.');
    expect(w.plusTen).toBe('+10%');
    const t = useSpendingWords({ monthly: 2490, wasMonthly: null, plusTen: true }, money);
    expect(t.ask).toContain('That is your budget with a tenth on top.');
    expect(t.ask).toContain('It becomes the plan\'s spending figure.');
    expect(t.plusTen).toBe('+10% on (£2,490 a month)');
    expect(t.undone).toBe('Put back: your spending is as it was again.');
  });
  it('the Budget page says plainly what the budget does and does not do to the plan', () => {
    const f = { allInMonthly: 2837.33, allInAnnual: 34048, periodicMonthly: 187.5, targetGrossAnnual: 39417, shared: false };
    const w = budgetSummaryWords(f, null, money);
    expect(w.handoff).toContain('The budget is a guide. Only “Use as my spending” changes the plan');
    expect(w.handoff).toContain('Age bands and one-off costs stay here');
    expect(w.handoff).not.toMatch(/becomes the|target both tools work to/);
    expect(w.allInCaption).toBe('£34,048/yr — a guide; it changes nothing until you use it');
    expect(w.targetLine).toBe('If you use it: <strong>£2,837/mo take-home</strong> <span style="color:var(--text-muted);">(≈ £39,417/yr before tax)</span>');
    expect(budgetSummaryWords({ ...f, useMonthly: 3121, plusTen: true }, null, money).targetLine).toContain('<strong>£3,121/mo take-home</strong>');
    expect(budgetSummaryWords({ ...f, useMonthly: 3121, plusTen: true }, null, money).targetLine).toContain('your budget with a tenth on top');
    for (const t of Object.values(w)) expect(t).not.toMatch(/headroom/i);
  });
  it('the three false promises are gone from the page, and the "Optional headroom" box with them', () => {
    const html = readFileSync('index.html', 'utf8');
    expect(html).not.toContain('follows this automatically');
    expect(html).not.toContain('Optional headroom');
    expect(html).not.toContain('targetHeadroomMonthly');
    expect(html).not.toContain('targetScheduleFromBudget');
    expect(html).not.toContain('Use as the start of my income shape');
    expect(html).not.toContain('planned for the year they fall');
    expect(html).toContain('The budget is a guide. Only ‘Use as my spending’ changes the plan.');
  });
});

describe('a blank "who pays over time" row is ignored', () => {
  const budget = {
    retirementAge: 60, currentAge: 58, endAge: 95, sharedWithPartner: true, mySharePct: 70,
    lines: [{ label: 'Everything', tier: 'essential', annual: 10000, paidBy: 'shared' }], oneOffs: []
  };
  it('a row just added (both boxes empty) does not count as "from age 0, 0%"', () => {
    const blank = { ...budget, splitPhases: [{ fromAge: '', mySharePct: '' }] };
    expect(budgetSharePctAtAge(blank, 60)).toBe(70);
    expect(myAnnualNetAtAge(blank, 60)).toBe(7000);
    expect(budgetSharePctAtAge({ ...budget, splitPhases: [{ fromAge: null, mySharePct: null }, null] }, 70)).toBe(70);
  });
  it('a half-filled row does not count either; a filled row does', () => {
    expect(budgetSharePctAtAge({ ...budget, splitPhases: [{ fromAge: 63, mySharePct: '' }] }, 65)).toBe(70);
    expect(budgetSharePctAtAge({ ...budget, splitPhases: [{ fromAge: '', mySharePct: 50 }] }, 65)).toBe(70);
    expect(budgetSharePctAtAge({ ...budget, splitPhases: [{ fromAge: 63, mySharePct: 50 }] }, 65)).toBe(50);
    expect(budgetSharePctAtAge({ ...budget, splitPhases: [{ fromAge: 63, mySharePct: 0 }] }, 65)).toBe(0);   // a real 0% is a real 0%
  });
  it('the CSV no longer carries a headroom row, and an older export\'s row is skipped without a warning', () => {
    const csv = budgetToCsv({ ...budget, targetHeadroomMonthly: 200, lines: [], oneOffs: [] });
    expect(csv).not.toMatch(/headroom/i);
    const r = parseBudgetCsv(csv + '\r\nSetting,,Headroom £/mo,200,,,,,,,,');
    expect(r.warnings.filter((w) => /headroom/i.test(w))).toEqual([]);
    expect(r.settings).not.toHaveProperty('targetHeadroomMonthly');
  });
});

describe('the Undo toast', () => {
  it('shows the message with an Undo button, runs the undo once, and goes away by itself', async () => {
    vi.useFakeTimers();
    const undo = vi.fn();
    const { el } = showUndoToast('Your spending is now £2,264 a month.', undo, { ms: 15000 });
    expect(document.body.contains(el)).toBe(true);
    expect(el.textContent).toContain('Your spending is now £2,264 a month.');
    expect(el.querySelector('button').textContent).toBe('Undo');
    el.querySelector('button').click();
    expect(undo).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(400);
    expect(document.body.contains(el)).toBe(false);
    const second = showUndoToast('again', undo, { ms: 15000 });
    vi.advanceTimersByTime(15400);
    expect(document.body.contains(second.el)).toBe(false);
    expect(undo).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
