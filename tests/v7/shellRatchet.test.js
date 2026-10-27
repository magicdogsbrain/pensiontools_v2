/**
 * The old shell only shrinks (research/v7/architecture.md, section 1 "Old shell"): index.html's inline script is
 * frozen to fixes from V7 step 3 on. New behaviour goes into V7 (src/v7/), not into this script.
 *
 * When a fix makes the script SHORTER, lower MAX_LINES to the new count in the same change.
 * If a fix truly must add lines, raise MAX_LINES in that change and say why in the commit — that is a decision,
 * and this test exists so that it is one.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// 10,585 counted at v6.15.0, 30 Sep 2026. "Save this as a plan" (research/v7/save-as-plan.md, Contract C.2 and open
// question 15) added its import, the start-up call, the call after sign-in and the call on sign-out; its steps live in
// src/ui/components/NewPlanFromSeed.js and src/services/PlanSeed.js. Its review (1 Oct 2026) moved the Stress tester's
// "starting balances" and pots-at-retirement words and the Budget page's target words out to modules
// (src/ui/startingPotsWords.js, PlanSeed.budgetSummaryWords), so the script ends 2 lines SHORTER than it started: 10,583.
// 6.20.2's safety fixes (research/v7/square-one-audit.md §5 item 1) put their logic in modules — the lock guard in the
// repositories, the next-step banner (src/services/NextStep.js), the phone's More sheet (src/ui/mobileMenu.js), the
// Budget's income-shape arithmetic (src/services/BudgetToPlan.js) — and the script ends 52 lines shorter: 10,531.
// 6.22.0 (how the ISA grows, a saver's lock that reads true, one bar for "on course") put its logic in modules — the
// setting's words and state (src/ui/isaGrowthSetting.js), the saver's reading (src/services/SaverReading.js) and path
// (src/services/SavingPath.js, loaded by src/ui/savingPathForLock.js), the Accumulation planner's table and "Am I on
// course?" (src/ui/accumulationProjection.js), the bar and its words (src/services/OnCourse.js) — and the script ends
// 30 lines shorter: 10,501.
// 6.23 (the monthly entry asks what a platform shows; every pasted line counts) moved the entry card's helpers — the
// per-fund popup, the plausibility guard, the taxable account's cost pre-fill, the view switch — to src/ui/monthlyEntry.js
// and the paste preview to src/ui/components/HoldingsPasteView.js, and the script ends 84 lines shorter: 10,417.

// 6.23.0 (usability audit decisions 6–9: the budget's one button into the plan, visitors, and five retirements) put its
// logic in modules — the budget's figure, question and Undo (src/services/BudgetToPlan.js, src/ui/undoToast.js), the
// guest's three plans and the read-only example (src/services/GuestPlans.js), the guest's words (GuestMeter.js) — and
// deleted the welcome tour, the Edit Tools modal and its per-tool wizard, the tab-visibility code, the "Copy from
// Stress / Decision" buttons and the headroom box: the script ends 315 lines shorter: 10,186.
// Merged 6.23.0 (batches A, B and C): the limit is set to the merged script length below.
// 6.24.0 (one "will it last" answer per plan; usability audit decision 2) retired the Monte Carlo tab's own run, the
// Historical tab's own run, the looped Scenarios, the allocation optimiser and the ranking's level-footing toggle, and put
// the one answer's words and screens in modules (src/services/OneAnswer.js, src/services/NamedStarts.js,
// src/ui/oneAnswerView.js): the script ends 786 lines shorter: 9,313.
// 6.25.0 (who draws what; usability audit decision 5) put the Household tab's results in modules — the rule
// (src/services/HouseholdDraw.js), the writes (src/services/HouseholdSplitApply.js), the HTML (src/ui/householdView.js),
// the one household budget (src/storage/ScenarioRepository.js) — and the script ends 21 lines shorter: 9,292.
// The household sweep (Oct 2026: the survivor and care checks through each plan's own test) put their words in
// src/ui/householdView.js (survivorResultHtml, careResultHtml) and the script ends 15 lines shorter: 9,277.
// Road step 11b (6.45.0) lifted the Budget page's handlers (BudgetModel.js), "Turn a lump sum into income"
// (IncomeSchedule.lumpIntoSteps) and the named stresses' start years (NamedStarts.SCENARIO_START): 92 lines shorter: 9,185.
const MAX_LINES = 9185;

describe('index.html\'s inline script may only get shorter', () => {
  const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].filter((m) => !/\bsrc=/.test(m[1]));

  it('there is still exactly one inline script', () => {
    expect(scripts.length).toBe(1);
  });
  it(`it has at most ${MAX_LINES} lines`, () => {
    const lines = scripts[0][2].split('\n').length;
    expect(lines).toBeLessThanOrEqual(MAX_LINES);
  });
});
