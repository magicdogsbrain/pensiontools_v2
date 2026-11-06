/**
 * The words of a plan's home (7.3.0; research/v7/one-product-design.md, "The plan home"; the mock-up
 * research/v7/mockups/first-visit.html, screen 4). Data only — this file imports nothing. Placeholders are written
 * {likeThis} and filled by the screen; the figures are never here: they are the plan's own records, drawn through Money.
 *
 * The home leads with what is due, then where you are, then everything else, folded away. It never pushes a question or a
 * try on someone carrying out a plan, and it never says "nothing to do" without the date something next will be.
 */
export const HOME = {
  title: 'Your plan',

  /** The three stages, said as words (never only a colour), and the strip under them. */
  stages: { saving: 'Saving', moving: 'Moving', drawing: 'Drawing', closed: 'Closed' },
  stageNone: 'Your plan',
  strip: {
    label: 'Where this plan is: saving, moving, drawing',
    now: 'you are here',
    done: 'done',
    to: 'to {month}',
    later: 'later'
  },
  /** The heading: the stage, and what it means today. */
  headline: {
    saving: 'Saving.',
    savingStop: 'Saving. You stop work in {month}.',
    moving: 'Moving.',
    movingMoves: 'Moving. {done} of {of} moves done.',
    drawing: 'Drawing.',
    draft: 'Drawing. Not locked yet.',
    closed: 'Closed.',
    none: 'Your plan.'
  },

  /** To do (the design's rank table): at most three, and the rest folded under "and N more". */
  todoTitle: 'To do',
  more: { one: 'and 1 more', many: 'and {n} more' },
  soonTitle: 'Soon',
  soonMark: 'Soon',
  notNow: 'Not now',
  notNowDone: 'Put off until you next open the site.',
  /** Each thing to do: a short title and a line under it. {slots} as read.js gives them. */
  items: {
    'closed.next':        { title: 'Carry on in ‘{next}’', detail: 'This plan closed at the end of {closed}. Its months stay here to read.' },
    'plan.noAge':         { title: 'Add your age', detail: 'We cannot tell where you are without it.' },
    'plan.agesFromSaving': { title: 'Check your ages', detail: 'Your age today and the age you want to stop work. We took them from your saving figures.' },
    'move.invite':        { title: 'Ready to plan the move?', detail: 'Your plan says you stop work in {stop}. Check the month you stop first.' },
    'lock.first':         { title: 'Lock the plan when it is right', detail: 'Check it lasts, then lock it. Months are recorded once it is locked.' },
    'month.taxYear':      { title: 'Set up {year}', detail: 'A new tax year: say what the plan pays this year before the first month is recorded.' },
    'month.arrive':       { title: 'Record your first month', detail: 'You stopped work in {stop}. Month by month then compares your pot with the plan’s.' },
    'month.record':       { title: 'Record {monthName}', detail: 'What your platform shows today. It takes a minute.' },
    'month.gap':          { title: 'Record {monthName}', detail: '{month} is not recorded yet. Months you missed can be filled in at once.' },
    'move.next':          { title: 'Move {n} of {of}: {label}', detail: 'Tick it on Moving to your plan’s mix when the order is placed.' },
    'move.finish':        { title: 'Update what you hold', detail: 'Every move is ticked. Update what you hold so it shows the plan’s mix.' },
    'checkin.first':      { title: 'Your first check-in', detail: 'Where your pot is today, and how often you want to check in.' },
    'checkin.due':        { title: 'Check in', detail: 'What your pot is worth today. It takes a minute.' },
    'checkin.behind':     { title: 'See what would put you on course', detail: 'At your last check-in ({last}) you were not on course yet.' },
    'saving.noAim':       { title: 'Say what you would want to spend', detail: 'To see whether what you pay in is enough.' },
    'hold.stale':         { title: 'Update what you hold', detail: 'Last updated on {date}.' },
    'draft.stale':        { title: 'Update the plan to today', detail: 'It was set to start in {savedYear}, which has passed. Or leave it as it is.' },
    'answer.stale':       { title: 'Check it still lasts', detail: 'The plan has changed since its ‘will it last’ answer.' },
    'household.pending':  { title: 'Your partner’s plan', detail: 'The plan it is linked with is not in this account. Link one, or leave it.' }
  },
  /** A soon item: shown apart, never counted. */
  soon: {
    'month.taxYear': { title: 'Set up {year}', detail: 'From 1 March you can set up the new tax year early; it is due from {month}.' }
  },
  /** A partner's plan's thing to do, one line each, named by that plan. */
  partnerItem: '{title} — ‘{name}’',

  /**
   * Nothing due, always with a date (never "nothing to do" alone). On a drawing plan "{month} is recorded" names the latest
   * month recorded; a quarter or a year recorded at once reaches ahead, so the date follows the plan's own cadence.
   */
  quiet: {
    savingNext: 'Nothing due. Your next check-in is {month}.',
    savingPot: '{monthName}’s pot is recorded. Nothing is due until {next}.',
    drawing: '{month} is recorded. Nothing is due until {next}.',
    draft: 'Months are recorded once the plan is locked.',
    closed: 'Closed {month}; carried on in ‘{name}’.',
    closedAlone: 'Closed {month}.'
  },

  /** The year view: the tax year's twelve months, what was drawn against what the plan said. */
  yearTitle: '{year}: taken against the plan',
  year: {
    label: 'The months of {year}',
    legendDrawn: 'taken',
    legendPlan: 'the plan said',
    legendFilled: 'filled in later',
    legendSetUp: 'year set up',
    legendDue: 'due',
    cell: {
      recorded: '{month}: recorded, {drawn} taken before tax',
      filled: '{month}: filled in later, {drawn} taken before tax',
      due: '{month}: due',
      setUp: '{month}: the tax year was set up from here',
      later: '{month}: still to come',
      none: '{month}: not recorded'
    },
    planSaid: '; the plan said {plan}',
    recordedCount: { none: 'No months recorded in {year} yet.', one: '1 month recorded in {year}.', many: '{n} months recorded in {year}.' }
  },

  whereTitle: 'Where you are',
  whereNone: 'Nothing recorded to read against the plan yet.',

  toolsTitle: 'Tools',

  /** Everything else, folded away. */
  stepsTitle: 'Your plan’s steps',
  stepsLead: 'Each step as the plan has it, with its result. Open one to see it in full.',
  changeTitle: 'Change the plan · Try something',
  changeTitleUnlocked: 'Change the plan',
  changeLockedLead: 'A try changes nothing in your locked plan.',
  change: {
    tryChange: 'Try a change (nothing changes)',
    tryWay: 'Try another way of drawing (nothing changes)',
    tryMix: 'Try another mix (nothing changes)',
    moveToNew: 'Move to a new plan (from Your plans)',
    backToWork: 'I’m going back to work (from Your plans)',
    unlock: 'Unlock it, from ‘Your plan as locked’',
    about: 'About you and when',
    income: 'Money that comes in anyway',
    spend: 'What you spend',
    pots: 'Your pots and tax',
    lasts: 'Does it last?',
    way: 'How the money is taken',
    mix: 'The mix',
    lock: 'Lock the plan'
  },
  askTitle: 'Ask a question with this plan’s figures',
  askLead: 'A question opens with this plan’s figures in its boxes. Nothing in the plan changes unless you say so there.',

  /** The rail's first link on a step page: back to the home. */
  railHome: 'Your plan’s home',
  /** A plan shown as saved: nothing is due, because nothing can be changed here. */
  readonly: 'This plan is shown as it was saved and cannot be changed here. Nothing has been lost.',
  toPlans: 'Your plans',
  /** On each row of "Your plans": how many things are due on that plan. */
  rowTodo: { one: '1 to do', many: '{n} to do' }
};

/** The working spinner (research/v7/mockups/README.md): a ring of small bars, each a life run, filling as futures are run. */
export const WORKING = {
  running: 'Running {total} futures… {done}',
  runningPlain: 'Running futures…',
  working: 'Working…'
};
