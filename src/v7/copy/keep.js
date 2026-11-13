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
  /**
   * 7.8.0: the answer counts to an age more than 45 years after the money starts (the plan-to age follows how long people
   * live); a plan runs 45 years at most, so it is kept to an earlier age. {kept} the age the kept plan runs to ("to 97" = to the 97th birthday), {years} 45,
   * {age} the answer's plan-to age.
   */
  cut: 'The plan this keeps runs to {kept}: {years} years from when the money starts is the longest a plan runs. This answer counts to {age}.',
  save: 'Keep as a plan',
  saveSeparate: 'Keep as a separate plan',
  /**
   * "Am I saving enough?" when not on course (research/saving-enough-and-check-in.md 3.6, decision 7): which pay-in the plan
   * keeps, asked with two buttons and neither chosen. {now} and {enough} are the figures as the answer says them: a share
   * of pay, or pounds a month (and the savings a month for the years before a pension can be touched).
   */
  payIn: {
    ask: 'Which pay-in should the plan keep?',
    now: 'Keep: paying in as now ({now})',
    nowNothing: 'Keep: paying nothing in, as now',
    enough: 'Keep: paying in {enough} (on course)',
    aMonth: '{amount} a month',
    between: '{amount} a month between you',
    withSavings: '{pension}, and {savings} a month into savings',
    savingsOnly: 'Keep: paying in as now, and {savings} a month into savings (on course)',
    note: 'Neither is chosen for you. You can change what goes in later, in the plan.'
  },
  saving: 'Keeping…',
  /**
   * A new plan as the second choice (6.59.0: trying figures changes a plan only when the person says so, and a new plan is
   * made only when asked for): under "Use these in ‘…’" on B opened from a plan, and once a plan has been kept from this answer.
   */
  newTitle: 'Or keep these as a new plan',
  anotherTitle: 'Or keep these as another new plan',
  saveNew: 'Keep as a new plan',
  saveAnother: 'Keep as another new plan',
  /** Contract Q2's line, with "window" for "tab" (the banned list keeps "tab" for the old app's tabs). Each keep is one new plan. */
  note: 'Each keep makes one new plan. Keeping a plan needs a free account, or you can keep up to three in this browser window without one.',
  privacy: 'Your figures go into the plan and nowhere else. They never go into the address.',
  /** With a locked plan in the account (D): the plan you follow is not touched. */
  separate: 'Your locked plan stays the one you follow month by month.',
  /** After keeping. {name} is the plan's name as kept (with " (2)" when the name was taken). */
  made: {
    inAccount: 'Kept as ‘{name}’ in your account.',
    inWindow: 'Kept as ‘{name}’ in this browser window.'
  },
  /**
   * Without an account (7.1.0, research/v7/after-7.md J2): the way to keep a plan in an account. After signing in, or making
   * an account, the person comes straight back — to the plan kept here, now in the account, or to this answer to keep it.
   */
  account: {
    kept: 'To keep it for good, on any device, sign in or make a free account. You come straight back to it, in your account.',
    keptButton: 'Sign in or make an account',
    first: 'Have an account, or want one? Sign in first and the plan is kept there.',
    firstButton: 'Sign in first'
  },
  /** A couple: the partner's plan beside it. */
  madePartner: 'Your partner’s part is in ‘{name}’.',
  /** With a locked plan in the account (D): no lock sentence. */
  madeSeparate: 'Your locked plan is still the one you follow.',
  /** A plan an earlier press made, found by a later one with other figures on screen: those figures are not in it. */
  madeEarlier: 'It holds the figures you tried before, not the ones on screen now.',
  /** "Lock this plan?" — the link to the new plan's lock step (road-to-7.md step 6). */
  lockThis: 'Lock this plan?',
  /** A plan kept from "Am I saving enough?" (saving-enough-and-check-in.md 4.3): its own "What you pay in" first. */
  seeSaving: 'See whether what you pay in is enough',
  /** …and when you have already stopped and your partner is still saving, their plan's. */
  seeSavingPartner: 'See whether what your partner pays in is enough',
  /** The second button for a saver (saving-enough-and-check-in.md 4.3; release step R3): the plan's first check-in. */
  firstCheckIn: 'Start your first check-in',
  firstCheckInPartner: 'Start the first check-in on your partner’s plan',
  toPlans: 'Your plans',
  /** After keeping: the plan is opened from here, and trying other figures here changes nothing in it. */
  open: 'Open ‘{name}’',
  tried: 'Trying other figures here changes nothing in it.',
  triedUse: 'Trying other figures here changes nothing in it until you use them.',
  /**
   * "Use these in ‘…’" (6.59.0; answers/plan/useAnswer.js): "Am I saving enough?" opened from a saver's plan, or answered after
   * a plan was kept from it, writes its saving figures back onto that plan — only when this is pressed. {name} is the plan's.
   */
  use: {
    title: 'Use these in your plan',
    /** The keep step's own heading and lead when the figures can go into the plan B was opened from (KeepScreen). */
    stepLabel: 'Use these in your plan?',
    stepLead: 'Your plan changes only when you use these figures in it. A new plan is made only if you ask for one.',
    lead: 'You opened this from ‘{name}’. Trying figures here changes nothing in it until you use them.',
    reading: 'Looking for your plan…',
    button: 'Use these in ‘{name}’',
    working: 'Putting these in ‘{name}’…',
    /** B not on course: which pay-in the plan takes, two buttons, neither chosen (as Keep asks it). */
    ask: 'Which pay-in should ‘{name}’ use?',
    now: 'Use: paying in as now ({now})',
    nowNothing: 'Use: paying nothing in, as now',
    enough: 'Use: paying in {enough} (on course)',
    savingsOnly: 'Use: paying in as now, and {savings} a month into savings (on course)',
    what: 'Only what goes in changes in ‘{name}’: what goes into your pension each month, and into ISAs and savings. Its ages, its pot and what you spend stay as they are.',
    /** What changed, on the answer page (useAnswer.js line ids). */
    done: {
      usedAnswer: '‘{name}’ now has {payIn} going into your pension. Nothing else in it changed.',
      usedAnswerSavings: '‘{name}’ now has {payIn} going into your pension, and {savings} a month into ISAs and savings. Nothing else in it changed.',
      usedSame: '‘{name}’ already has these figures, so nothing changed.'
    },
    see: 'See what you pay in, in ‘{name}’',
    toast: { saved: 'Put in ‘{name}’.', unchanged: 'Nothing to change in ‘{name}’.', undone: 'Put back as it was.', undoing: 'Putting it back…' },
    undo: 'Undo',
    close: 'Close',
    /** Why these figures cannot go into the plan: said, with the one thing to do next. */
    why: {
      unread: 'Your plans could not be read just now, so these figures cannot go into your plan from here. Read them again from “Your plans”.',
      example: '‘{name}’ is the example plan, which cannot be changed.',
      readonly: '‘{name}’ is shown as it was saved and cannot be changed here.',
      closed: '‘{name}’ is closed, so what goes in cannot change there.',
      notSaving: '‘{name}’ no longer says you are still saving, so what goes in cannot change there.',
      couple: 'These figures are for the two of you, and ‘{name}’ is one person’s plan, so they cannot go into it.',
      stopped: 'These figures say you have stopped work, so there is nothing to pay into ‘{name}’.',
      noAnswer: 'Once the answer is up to date you can use these figures in ‘{name}’.'
    },
    /** Why a press changed nothing. Nothing partial is ever written. */
    problems: {
      locked: '‘{name}’ is locked, and a locked plan does not take this change. Nothing was changed.',
      notSaving: '‘{name}’ no longer says you are still saving, so nothing was changed.',
      readonly: '‘{name}’ is shown as it was saved and cannot be changed here. Nothing was changed.',
      notHere: '‘{name}’ is not here any more. Nothing was changed.',
      usedUp: 'Your free time without an account is used up. Sign in to change your plans.',
      nobody: 'Sign in to change your plans.',
      unverified: 'Your email address is not confirmed yet. Confirm it from the email we sent, then try again.',
      storage: 'This browser would not keep the change. Nothing was changed.',
      failed: 'Sorry, that did not work. Nothing was changed in ‘{name}’: try again.'
    }
  },
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
    /**
     * A keep sent whose answer never came, and the account could not be read to see: a retry finds the plan if it was made —
     * the plan of the figures kept then, said so when other figures are on screen by then.
     */
    unsure: 'We could not reach your account to tell whether the plan was kept. Look in “Your plans”, or press Keep again: if the plan was made, you are told so and no second one is made.',
    /** A couple: the partner's plan was made, yours was not (nothing is deleted automatically). */
    partial: 'Your partner’s plan was kept as ‘{name}’, but yours could not be. Nothing has been deleted: try again, and delete the extra plan from “Your plans” if you need to.'
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
  backToAnswer: 'Back to your answer',
  /**
   * The rail's next line and button wherever they lead to keeping (rail/index.js KEEP_NEXT; components/Rail.jsx): they follow
   * the panel — the press it leads with, named as its button is — and never ask for the same answer to be kept again.
   */
  rail: {
    use: 'Next: when you are happy with these figures, use them in ‘{name}’.',
    made: 'Next: open ‘{name}’, the plan you kept from this answer.',
    payIn: 'Next: check the name, then choose which pay-in the plan keeps.',
    newPlan: 'Next: check the name, then press "Keep as a new plan".',
    separate: 'Next: check the name, then press "Keep as a separate plan".',
    buttons: { useIn: 'Use these in your plan', openKept: 'Open the plan you kept' }
  }
};
