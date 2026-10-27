/**
 * Budget Repository — persistence for the net-first budgeting tool (Stage 0).
 *
 * Stored per scenario (via ScenarioRepository), like the Decision/Stress settings. Deliberately
 * cache-free: it reads through the centrally-cached active scenario, so switching plans / login / logout
 * can't leave a stale budget behind.
 */

import { getActiveBudget, saveActiveBudget } from './ScenarioRepository.js';
import { budgetToSave, defaultBudget } from '../services/BudgetModel.js';

/**
 * Loads the active plan's budget, merged over the defaults so older/partial records are safe to use.
 * @returns {Promise<object>} Budget object
 */
export async function getBudgetAsync() {
  try {
    const b = await getActiveBudget();
    return { ...defaultBudget(), ...(b || {}) };
  } catch (error) {
    console.error('Error loading budget:', error);
    return defaultBudget();
  }
}

/**
 * Saves the budget to the active plan, recomputing the cached summary (essential/comfortable/suggested
 * gross) so consumers never read a stale derived block.
 * @param {object} budget - Budget to save
 * @returns {Promise<object>} The saved budget (with fresh `derived`)
 */
export async function saveBudget(budget) {
  const toSave = budgetToSave(budget);   // the one shape, lifted (6.45.0): the preview's budget step writes the same object
  await saveActiveBudget(toSave);
  return toSave;
}
