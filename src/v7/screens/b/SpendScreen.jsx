/**
 * Question B, the budget step — "What would you spend?" (research/v7/budget-step.md). The same step as A's
 * (saverSpend), with B's input list, words and order. B and A share the household's one budget sheet.
 */
import { saverSpend } from '../a/SpendScreen.jsx';
import { LAYOUT_B } from './NumbersScreen.jsx';

export const SpendScreen = saverSpend('b', LAYOUT_B);
