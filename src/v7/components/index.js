/** The component set — small on purpose (architecture B section 8). Screens import from here and from copy/. */
export { Shell } from './Shell.jsx';
export { Rail, stepLabel, labelFor } from './Rail.jsx';
export { Field, AskForm, formView, focusField, firstProblem, errorText, FIELDS, byPath, blank, SCHEMA_OF, COPY_OF } from './Field.jsx';
export { PersonBlock, FieldGroup } from './PersonBlock.jsx';
export { Money } from './Money.jsx';
export { Sentence } from './Sentence.jsx';
export { Headline } from './Headline.jsx';
export { MadeOf, withFixedCounts } from './MadeOf.jsx';
export { Assumed } from './Assumed.jsx';
export { TryAChange, SaverTryAChange } from './TryAChange.jsx';
export { Working } from './Working.jsx';
export { Problem } from './Problem.jsx';
export { Button, LinkButton } from './Button.jsx';
// Questions A and B (step 4 brief 4.13)
export { Verdict, VerdictWord, VERDICTS } from './Verdict.jsx';
export { AgesChart } from './AgesChart.jsx';
export { OutOfTenBar, countText, countPlain, filledCells } from './OutOfTenBar.jsx';
export { Pots } from './Pots.jsx';
export { Levers, LEVERS, leverActions } from './Levers.jsx';
export { Grid, gridReaches, onCarefulLine } from './Grid.jsx';
export { PayInSplit } from './PayInSplit.jsx';
export { Carried } from './Carried.jsx';
export { Retired, isRetired } from './Retired.jsx';
// The budget step and "Save this as a plan" (research/v7/budget-step.md, save-as-plan.md)
export { SpendHow, BudgetSheet, SpendBeside, SpendLine, BudgetAgainstC } from './Budget.jsx';
export { KeepPanel, PLANNER_LINK } from './KeepPanel.jsx';
