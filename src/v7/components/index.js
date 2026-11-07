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
export { KeepPanel } from './KeepPanel.jsx';
// The spending shape (research/v7/spending-shape.md 4)
export { StepsField, stepErrorText } from './StepsField.jsx';
export { ShapeChart, ShapeAnswer, scaleTop, yearWords } from './ShapeChart.jsx';
// The saved plans, read-only (research/v7/your-plan.md)
export { PlanRail } from './PlanRail.jsx';
export { PlanLine, PlanSentence, PlanButtons, fill, changeAction, stepNameOf } from './PlanFigures.jsx';
// Editing a saved plan: "About you and when" (research/v7/editing-in-v7.md 2)
export { EditField } from './EditField.jsx';
export { UndoToast } from './UndoToast.jsx';
// The shell for 7.0 (research/v7/road-to-7.md step 11): the visitor's boxes, the hand-over, What's new
export { GuestNag, GuestStop, BringIn, NewsPopup, leftWords, usedWords } from './Visitor.jsx';
export { Release, ReleaseBody, Effects, dayWords } from './ReleaseNotes.jsx';
// The plan's home (7.3.0): the working spinner and the motion rule (research/v7/mockups/README.md)
export { RunRing, AtLeast, Held, useAtLeast, AT_LEAST_MS } from './Spinner.jsx';
export { countUp, slideAway, reducedMotion } from './motion.js';
export { Counted, notNowPress } from './Motion.jsx';
// The first visit (7.5.0; research/v7/mockups/README.md): the three pictures, one component each, and the page around an answer
export { LifeLine } from './LifeLine.jsx';
export { PotLife } from './PotLife.jsx';
export { YearCells } from './YearCells.jsx';
export { AnswerSlider, FigureTiles, KeepLine } from './AnswerPicture.jsx';
