/**
 * Question B, step 1 — "What have you saved, and what are you paying in?" (screens-A-B.md 4.1). Four things to type
 * for one person (age, pot, what goes in each month, the age in mind); what you would spend is the next step's (the
 * budget step). Savings and the rest under "Add more detail". The same step as A's (saverNumbers), with B's input
 * list, words and order.
 */
import { saverNumbers } from '../a/NumbersScreen.jsx';

/** The top-level fields of B's numbers step, in the order drawn. Each one's dependants are drawn inside it. */
export const LAYOUT_B = {
  you: ['you.age', 'you.pot', 'you.payIn.kind', 'stop.age', 'you.statePension.kind', 'you.finalSalary.has'],
  partner: ['partner.age', 'partner.pot', 'partner.payIn.kind', 'partner.statePension.kind', 'partner.finalSalary.has'],
  more: ['savings', 'you.alreadyDrawing', 'partner.alreadyDrawing', 'savingsIn', 'savingRisk', 'risk', 'charge', 'endAge', 'confidence'],
  spend: ['spend.kind']
};

export const NumbersScreen = saverNumbers('b', LAYOUT_B);
