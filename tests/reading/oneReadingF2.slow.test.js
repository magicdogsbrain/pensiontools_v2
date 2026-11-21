/**
 * Step F2 (lead4.md D2, D6): for EVERY parity fixture, an income step, the State Pension and the budget's line have ONE value
 * whoever asks — the simple view's plan page and spend page, the full view's line under the income shape and its plan
 * document — because each is drawn from the one reader (src/reading/income.js, statePension.js, budget.js).
 */
import { describe, it, expect } from 'vitest';
import { FIXTURES, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';
import { upgradeScenario } from '../../src/firebase/scenarioMigration.js';
import { incomeStepsOf } from '../../src/reading/income.js';
import { statePensionOf, spAssumedWords } from '../../src/reading/statePension.js';
import { budgetLineOf } from '../../src/reading/budget.js';
import { budgetFiguresOf, normalisedBudget } from '../../src/answers/plan/budget.js';
import { planPage } from '../../src/answers/plan/read.js';
import { spendOf } from '../../src/answers/plan/spend.js';
import { firstStepNoteOfPlan, documentStepsOf } from '../../src/ui/incomeStepBox.js';
import { unmarked } from '../../src/reading/mark.js';
import { money } from '../../src/reading/format.js';

const NOW = new Date(2026, 10, 16, 12);
const up = (p) => upgradeScenario(JSON.parse(JSON.stringify(p)), { now: NOW }).scenario;

describe('one reading of income, the State Pension and the budget line, every parity fixture', () => {
  for (const f of FIXTURES) {
    it(f.key, () => {
      const plans = f.plans().map(up);
      const plan = plans.find((p) => p.id === f.subject);
      const entries = plans.map((p) => ({ plan: p }));
      const read = incomeStepsOf(plan, { now: NOW });
      const pg = planPage(entries, plan.id, 'plan', { today: PARITY_DAY });
      const pays = pg.steps.find((s) => s.id === 'plan').sections.find((s) => s.id === 'pays');
      const stepLines = pays.lines.filter((l) => l.id === 'pays.step');
      expect(stepLines.length, 'plan page steps').toBe(read.steps.length);
      if (read.steps.length) {
        // the full view's line under the income shape says the reading's first step, a year before tax and a month after tax
        const note = unmarked(firstStepNoteOfPlan(plan, NOW));
        expect(note).toContain(money(read.steps[0].beforeTax) + ' a year before tax');
        expect(note).toContain(money(read.steps[0].monthAfterTax) + ' a month after tax');
        // the simple spend page's first figure before tax is the same
        const sp = spendOf(entries, plan.id, { today: PARITY_DAY });
        if (!sp.locked) expect(sp.firstGross).toBe(money(read.steps[0].beforeTax));
      }
      if (read.locked) {
        const ds = documentStepsOf(plan, NOW, plan.planDocument);
        if (plan.planDocument && Array.isArray(plan.planDocument.steps) && plan.planDocument.steps.length) expect(ds.map((s) => s.beforeTax)).toEqual(read.steps.map((s) => s.beforeTax));
      }
      // the State Pension: a start the person gave is a day; an assumed one is said in words with the runs' age
      const s = statePensionOf(plan, { now: NOW });
      if (s.startDate) expect(s.startWords).toMatch(/^\d{1,2} [A-Z][a-z]+ \d{4}$/);
      if (s.assumed) expect(spAssumedWords(s)).toMatch(/^State Pension: we assumed £[\d,]+ a year before tax from (age \d+|your State Pension age), as none was entered\.$/);
      // the budget line: the simple view's budget figures are the one function's (a plan's own budget, not shared)
      const B = budgetFiguresOf(plan, entries);
      if (!B.shared && B.workedOut) expect(B.essentialsMonthly).toBe(budgetLineOf(normalisedBudget(plan.budgetTool.settings)).essentials);
      if (f.key === 'budget') expect(B.workedOut).toBe(true);
    });
  }
});
