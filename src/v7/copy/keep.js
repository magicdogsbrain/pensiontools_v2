/**
 * The words of "Keep this as a plan" (research/v7/save-as-plan.md "What the person sees" and Contract C.4; road-to-7.md
 * step 7: the preview makes the plan itself). Data only — this file imports nothing. Shown at the foot of every answer of
 * C, A, B and D, and on each question's own "Keep this as a plan?" step.
 *
 * Open question 1 of the contract, settled with step 7: "Keep" and "Kept as", never "Save" (the language guide 3.6: "save"
 * also reads as saving money). Open question 2: no "guest" — "without an account".
 */
export const KEEP = {
  title: 'Keep this as a plan',
  /** D with a locked plan in the account (answer-D.md 3.8): a separate plan beside the one you follow. */
  titleSeparate: 'Keep this as a separate plan',
  /** On the step of its own, above the panel. */
  stepLead: 'A plan keeps these figures under "Your plans", where you can test it against the bad times, lock it and record each month.',
  nameLabel: 'Name',
  nameHelp: 'Filled in from this answer. Change it to anything you like.',
  save: 'Keep as a plan',
  saveSeparate: 'Keep as a separate plan',
  saving: 'Keeping…',
  /** Contract Q2's line, with "window" for "tab" (the banned list keeps "tab" for the old app's tabs). */
  note: 'You can keep as many as you like and compare them. Keeping a plan needs a free account, or you can keep up to three in this browser window without one.',
  privacy: 'Your figures go into the plan and nowhere else. They never go into the address.',
  /** With a locked plan in the account (D): the plan you follow is not touched. */
  separate: 'Your locked plan stays the one you follow month by month.',
  /** After keeping. {name} is the plan's name as kept (with " (2)" when the name was taken). */
  made: {
    inAccount: 'Kept as ‘{name}’ in your account.',
    inWindow: 'Kept as ‘{name}’ in this browser window.'
  },
  /** A couple: the partner's plan beside it. */
  madePartner: 'Your partner’s part is in ‘{name}’.',
  /** With a locked plan in the account (D): no lock sentence. */
  madeSeparate: 'Your locked plan is still the one you follow.',
  /** "Lock this plan?" — the link to the new plan's lock step (road-to-7.md step 6). */
  lockThis: 'Lock this plan?',
  toPlans: 'Your plans',
  tryAnother: 'Try something else and keep that too.',
  problems: {
    empty: 'Give the plan a name.',
    tooLong: 'Keep the name to 60 characters or fewer.',
    notReady: 'This answer cannot be kept yet. Wait for it to finish, then press "Keep as a plan" again.',
    /** Without an account the window holds three plans already (services/GuestPlans.js GUEST_PLANS_FULL_MESSAGE's meaning). */
    full: 'Without an account you can keep up to three plans in this browser window. Make a free account to keep more — your plans come with you.',
    /** The free time without an account is used up: the same words the editing steps use. */
    usedUp: 'Your free time without an account is used up. Sign in to keep this plan.',
    unverified: 'Your email address is not confirmed yet, so a plan cannot be kept in your account. Confirm it from the email we sent, then keep it again.',
    storage: 'This browser would not keep the plan. Nothing was kept.',
    failed: 'Sorry, the plan could not be kept. Nothing was kept. Your figures are still here: try again.',
    /** A couple: the partner's plan was made, yours was not (nothing is deleted automatically). */
    partial: 'Your partner’s plan was kept as ‘{name}’, but yours could not be. Nothing has been deleted: try again, and remove the extra plan from the planner’s menu if you need to.'
  },
  /** Why keeping is not offered, in place of the box. */
  why: {
    noAnswer: 'There is no answer to keep yet.',
    notCurrent: 'Your answer is being worked out again. Keeping is offered once it is up to date.',
    notFinal: 'Keeping is offered once the answer is finished.',
    retired: 'This question is for people who are still working.',
    notOk: 'There is nothing from a pension pot to keep as a plan here.',
    closedYears: 'Change the age the money starts to keep this as a plan.'
  },
  backToAnswer: 'Back to your answer'
};
