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
const MAX_LINES = 10531;

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
