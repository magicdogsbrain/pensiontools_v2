/**
 * 7.11.1 — "What you spend" on the plan's home reads the budget exactly as the budget page does.
 *
 * Before: the home counted the budget's lines by `amount`, but a budget line keeps its figure in `annual`, so every real budget
 * read "What you spend · Not worked out" on the home while the budget page showed its total; and the home and the spend page
 * read the cached `derived` totals of the plan's own budget, never a household's shared one. Now there is one reader
 * (answers/plan/budget.js budgetFiguresOf: readBudget, then summariseBudget on its lines), used by the home, the spend page
 * and the budget page's totals.
 *
 * Fictional plans only: Alex (a corpus plan given a budget of three lines, each a yearly figure), and Sam (a second plan that
 * shares Alex's budget, paying 40% of the shared lines).
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { planPage } from '../../../src/answers/plan/read.js';
import { budgetOf, budgetFiguresOf } from '../../../src/answers/plan/budget.js';
import { spendOf } from '../../../src/answers/plan/spend.js';
import { defaultBudget } from '../../../src/services/BudgetModel.js';
import { entryOf, corpus } from './_plans.js';

const TODAY = '2026-11-15';
const LINES = [
  { id: 'l1', label: 'Food', tier: 'essential', annual: 4800, paidBy: 'shared' },
  { id: 'l2', label: 'Council tax', tier: 'essential', annual: 2400, paidBy: 'shared' },
  { id: 'l3', label: 'Holidays', tier: 'discretionary', annual: 3600, paidBy: 'shared' }
];
/** Alex: a corpus plan with a budget of yearly lines and no cached totals at all; `shared`: Alex pays 60% of the shared lines. */
function alexRaw({ shared = false } = {}) {
  const p = JSON.parse(JSON.stringify(corpus()['04-buckets-running']));
  p.id = 'AlexBudget01';
  p.planDetails = { ...p.planDetails, name: 'Alex plan' };
  p.budgetTool = { settings: { ...defaultBudget(60, 60), currentAge: 66, retirementAge: 60, ...(shared ? { sharedWithPartner: true, mySharePct: 60 } : {}), lines: LINES.map((l) => ({ ...l })), oneOffs: [] } };
  delete p.household;
  return p;
}
/** Sam: another plan that reads Alex's budget (one budget for the household), paying 40% of the shared lines. */
function samRaw() {
  const p = JSON.parse(JSON.stringify(corpus()['04-buckets-running']));
  p.id = 'SamBudget01';
  p.planDetails = { ...p.planDetails, name: 'Sam plan' };
  p.budgetTool = { sharedFrom: 'AlexBudget01', settings: { mySharePct: 40, currentAge: 64, retirementAge: 64 } };
  delete p.household;
  return p;
}
const stepOf = (entries, id) => planPage(entries, id, 'budget', { today: TODAY }).steps.find((s) => s.id === 'budget');

describe('the home reads the budget as the budget page does', () => {
  const entries = [{ plan: entryOf(alexRaw(), TODAY).plan }];
  const id = 'AlexBudget01';

  it('a budget of yearly lines, with no cached totals, is worked out on the home: its total and its essentials, a month after tax', () => {
    const step = stepOf(entries, id);
    expect(step.result.id).toBe('budget.total');
    expect(step.done).toBe(true);
    expect(step.figures).toEqual({ total: Math.round((4800 + 2400 + 3600) / 12), essentials: Math.round((4800 + 2400) / 12) });
    expect(step.result.text).toBe('£900 a month after tax, £600 of it essentials. A guide only');
  });

  it('the home, the spend page and the budget page give the one figure', () => {
    const page = budgetOf(entries, id, { today: TODAY });
    expect(page.totals.has).toBe(true);
    expect(page.totals.monthly).toBe('£900');
    const spend = spendOf(entries, id, { today: TODAY });
    expect(spend.budget).toMatchObject({ workedOut: true, total: '£900', essentials: '£600' });
    expect(budgetFiguresOf(entries[0].plan, entries)).toMatchObject({ workedOut: true, monthly: 900, essentialsMonthly: 600, shared: false });
  });

  it('stale cached totals are never read: the lines are', () => {
    const raw = alexRaw();
    raw.budgetTool.settings.derived = { allInComfortableMonthly: 5000, essentialMonthlyNet: 4000 };
    const es = [{ plan: entryOf(raw, TODAY).plan }];
    expect(stepOf(es, id).figures).toEqual({ total: 900, essentials: 600 });
  });

  it('a budget with no figures is not worked out, on the home and on the budget page alike', () => {
    const raw = alexRaw();
    raw.budgetTool.settings.lines = raw.budgetTool.settings.lines.map((l) => ({ ...l, annual: 0 }));
    const es = [{ plan: entryOf(raw, TODAY).plan }];
    expect(stepOf(es, id).result.id).toBe('budget.none');
    expect(budgetOf(es, id, { today: TODAY }).totals.has).toBe(false);
    expect(spendOf(es, id, { today: TODAY }).budget.workedOut).toBe(false);
    const none = alexRaw(); delete none.budgetTool;
    expect(stepOf([{ plan: entryOf(none, TODAY).plan }], id).result.id).toBe('budget.none');
  });
});

describe('a household\'s shared budget', () => {
  const entries = [{ plan: entryOf(alexRaw({ shared: true }), TODAY).plan }, { plan: entryOf(samRaw(), TODAY).plan }];

  it('the plan that reads it says its own side of the household\'s lines, as its budget page does', () => {
    const page = budgetOf(entries, 'SamBudget01', { today: TODAY });
    expect(page.totals.has).toBe(true);
    const step = stepOf(entries, 'SamBudget01');
    expect(step.result.id).toBe('budget.total');
    expect(step.figures.total).toBe(Math.round((4800 + 2400 + 3600) * 0.4 / 12));
    expect('£' + step.figures.total.toLocaleString('en-GB')).toBe(page.totals.monthly);
    expect(spendOf(entries, 'SamBudget01', { today: TODAY }).budget.total).toBe(page.totals.monthly);
    // the plan holding the lines says its side: 60%
    expect(stepOf(entries, 'AlexBudget01').figures.total).toBe(Math.round((4800 + 2400 + 3600) * 0.6 / 12));
    expect(budgetFiguresOf(entries[1].plan, entries)).toMatchObject({ shared: true, monthly: (4800 + 2400 + 3600) * 0.4 / 12 });
  });
});
