/**
 * The pages the parity gate opens (lead4.md section 2): every step of a plan in the simple view, every tab and sub-tab of
 * the full view, and how each is opened as a person opens it. Shared by the sweep (sweep.spec.js) and the round trips
 * (roundtrip.spec.js).
 */
import { expect } from '@playwright/test';
import { STRATEGY_NAMES } from '../../src/strategies/stressTest.js';
import { shownPlanName } from '../../src/services/PlanName.js';
import { closeNews } from '../scenarios/routes.js';

/** The facts a page shows as words (collect.js counts them outside a mark): the stage, the lock, the way, the plan's name. */
export const wordsOf = (plan, now) => ({
  exact: ['Saving', 'Moving', 'Living on it', 'Locked', 'Not locked', '🔒 locked', '✏️ draft', ...Object.values(STRATEGY_NAMES)],
  anywhere: [shownPlanName(plan, { now })].filter((n) => typeof n === 'string' && n.length > 2)
});

/** Every step of a plan in the simple view ('' is its home). */
export const SIMPLE_PAGES = Object.freeze(['', 'plan', 'about', 'income', 'spend', 'pots', 'lasts', 'way', 'mix', 'saving', 'checkin', 'review', 'month', 'where', 'lock', 'hold', 'move', 'budget', 'household']);

/** A press on a simple page that opens a figure drawn closed (the year table on "Does it last?"). */
export const SIMPLE_PRESS = Object.freeze({ lasts: '[data-testid="plan.lasts.schedule"]' });

/** Every tab and sub-tab of the full view. */
export const FULL_PAGES = Object.freeze([
  { name: 'budget', tab: 'budget' },
  // the full view works the one test out on a press ("Run the test"); the simple view without one — the sweep presses it, as a
  // person reading the figure does, so the figures can be compared (that a press is needed is said in the handover, lead4.md D24)
  { name: 'will it last', tab: 'stress', sub: 'montecarlo', press: 'button[data-on-click="runMonteCarloUI()"]' },
  { name: 'stress history', tab: 'stress', sub: 'historical' },
  { name: 'scenarios', tab: 'stress', sub: 'scenarios' },
  // the year table is drawn on a press in the full view ("Show Schedule") and opened on a press in the simple view
  { name: 'drawdown', tab: 'stress', sub: 'drawdown', press: 'button[data-on-click="showDrawdownScheduleUI()"]' },
  { name: 'glidepath', tab: 'stress', sub: 'glidepath' },
  { name: 'stress settings', tab: 'stress', sub: 'stresssettings' },
  { name: 'strategies', tab: 'strategies' },
  // this month's figures are worked out on a press ("Calculate"); on a plan not locked that press asks to lock it first, so
  // the sweep presses it only on a locked plan (the simple view shows the month only once locked)
  { name: 'monthly entry', tab: 'decision', sub: 'entry', press: '#decisionForm button[type="submit"]', onlyLocked: true },
  { name: 'history', tab: 'decision', sub: 'history' },
  // the plan document draws its sections folded; a person reading it opens them (the sweep opens every fold of the document)
  { name: 'plan document', tab: 'decision', sub: 'plandoc', openFolds: '#planDocumentPage' },
  { name: 'tax years', tab: 'decision', sub: 'taxyears' },
  { name: 'decision settings', tab: 'decision', sub: 'decisionsettings' },
  // "Am I on course?" is worked out when the tab opens, in the worker, as in the simple view (lead4.md R6; step M): no press
  { name: 'accumulation', tab: 'accumulation' },
  { name: 'transition', tab: 'transition' },
  { name: 'household', tab: 'household' }
]);

/** Opens a tab (and sub-tab) of the full view as a person does; false when the stage does not offer it. */
export async function fullTab(page, { tab, sub }) {
  await closeNews(page);
  const t = page.locator(`.tab[data-tab="${tab}"]`);
  if (!(await t.isVisible().catch(() => false))) return false;
  await t.click();
  if (!sub) return true;
  const s = page.locator(`.sub-tab[data-${tab}tab="${sub}"]`);
  const shows = () => expect(s).toBeVisible({ timeout: 5_000 }).then(() => true, () => false);
  if (!(await shows())) { await t.click(); if (!(await shows())) return false; }
  await s.click();
  return true;
}

/** The full view's chip says the open plan is locked. */
export const fullLocked = async (page) => /locked/.test(String(await page.locator('[data-fact="lock.state"]').first().innerText().catch(() => '')));

