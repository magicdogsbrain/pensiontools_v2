/**
 * The words of "Save this as a plan" (research/v7/save-as-plan.md, "What the person sees" and Contract C.2, C.4).
 * Data only — this file imports nothing. Shown at the foot of every answer of C, A and B, and on each question's
 * own "Save this as a plan?" step.
 *
 * Open question 1 of the contract: the design says "Save"; the language guide (3.6) prefers "Keep", because "save"
 * also reads as saving money. The words are all here, so the owner's choice is a change to this file (and the
 * three steps.keep labels in copy/a.js, b.js, c.js). Open question 2: no "guest" — "without an account".
 */
export const KEEP = {
  title: 'Save this as a plan',
  /** On the step of its own, above the panel. */
  stepLead: 'A plan keeps these figures in the planner, where you can try them against the bad times, lock them and record each month.',
  nameLabel: 'Name',
  nameHelp: 'Filled in from this answer. Change it to anything you like.',
  save: 'Save as a plan',
  saving: 'Saving…',
  /** Contract Q2's line, with "window" for "tab" (the banned list keeps "tab" for the old app's tabs). */
  note: 'You can save as many as you like and compare them. Saving needs a free account, or you can carry on without one in this browser window.',
  privacy: 'Your figures wait in this browser until the plan is made, are never used after a day, and never go into the address.',
  /** On coming back to the question after saving. {name} is the plan's name as the person chose it. */
  saved: 'Saved as ‘{name}’. Try something else and save that too.',
  waiting: 'Your figures for ‘{name}’ are waiting in the planner.',
  /** The planner's word on coming back that no plan was made: "Not now" (or the box closed) … */
  declined: 'Not saved: you chose not to make ‘{name}’ in the planner. Your figures are still here; save again whenever you like.',
  /** … or it could not use the figures (a day old, from another version), or a sign-out deleted them. */
  notMade: '‘{name}’ was not saved as a plan. Your figures are still here; save again if you want it.',
  openPlanner: 'Open the planner',
  problems: {
    empty: 'Give the plan a name.',
    tooLong: 'Keep the name to 60 characters or fewer.',
    storage: 'This browser would not keep your figures, so the plan could not be made.',
    notReady: 'This answer cannot be saved yet. Wait for it to finish, then press "Save as a plan" again.'
  },
  /** Why saving is not offered, in place of the box. */
  why: {
    noAnswer: 'There is no answer to save yet.',
    notCurrent: 'Your answer is being worked out again. Saving is offered once it is up to date.',
    notFinal: 'Saving is offered once the answer is finished.',
    retired: 'This question is for people who are still working.',
    notOk: 'There is nothing from a pension pot to save as a plan here.',
    closedYears: 'Change the age the money starts to save this as a plan.'
  },
  backToAnswer: 'Back to your answer'
};
