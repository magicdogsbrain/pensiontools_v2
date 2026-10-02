/**
 * Question B, step 1 — "What have you saved, and what are you paying in?" (screens-A-B.md 4.1). Four things to type
 * for one person (age, pot, what goes in each month, the age in mind); what you would spend is the next step's (the
 * budget step). Savings and the rest under "Add more detail". The same step as A's (saverNumbers), with B's input
 * list, words and order.
 */
import { saverNumbers } from '../a/NumbersScreen.jsx';

/**
 * The top-level fields of B's numbers step, in the order drawn. Each one's dependants are drawn inside it. A couple's
 * stop is a choice — an age, or "I've already stopped" (couples-different-years.md 2.2) — with the age box inside "At an
 * age" (`inside`); one person is asked the age alone, as before (select.js choiceAsked).
 */
export const LAYOUT_B = {
  you: ['you.age', 'you.pot', 'you.payIn.kind', 'stop.kind', 'stop.age', 'you.statePension.kind', 'you.finalSalary.has'],
  partner: ['partner.age', 'partner.pot', 'partner.stop.kind', 'partner.payIn.kind', 'partner.statePension.kind', 'partner.finalSalary.has'],
  // "How your savings grow" straight under the savings box, once there is money in savings (select.js choiceAsked)
  more: ['savings', 'isaGrowth', 'you.alreadyDrawing', 'partner.alreadyDrawing', 'savingsIn', 'savingRisk', 'risk', 'charge', 'endAge', 'confidence'],
  // the spending shape's fields: drawn by its own block under the figure (StepsField), never by LayoutField
  spend: ['spend.kind', 'spend.then', 'spend.steps'],
  /** Drawn first under more detail, each only while it applies (someone who has stopped). */
  taxFree: ['you.taxFreeTaken', 'partner.taxFreeTaken'],
  inside: { 'stop.kind': { age: ['stop.age'] } }
};

export const NumbersScreen = saverNumbers('b', LAYOUT_B);
