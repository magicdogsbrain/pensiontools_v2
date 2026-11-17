/**
 * The words of a plan's home (7.3.0; research/v7/one-product-design.md, "The plan home"; the mock-up
 * research/v7/mockups/first-visit.html, screen 4). Data only — this file imports nothing. Placeholders are written
 * {likeThis} and filled by the screen; the figures are never here: they are the plan's own records, drawn through Money.
 *
 * The home leads with what is due, then where you are, then everything else, folded away. It never pushes a question or a
 * try on someone carrying out a plan, and it never says "nothing to do" without the date something next will be.
 */
export const HOME = {
  /** "Are you paying in enough?" on a saving plan's home (7.12.0): the answer's own sentences, and the ways on from it. */
  saver: {
    title: 'Are you paying in enough?',
    working: 'Working out whether what you pay in is enough…',
    noAim: 'Your plan has no income set for when you stop, so there is nothing yet to test what you pay in against.',
    noAimLink: 'What you spend',
    noWorker: 'This browser cannot work this out here.',
    failed: 'Sorry, this could not be worked out. Nothing was changed.',
    change: 'Change what you want or what you pay in',
    ways: 'See the ways to make it fit',
    /** The block's own lines (answers/plan/saverBlock.js): what you want, and a share of pay beside pounds. */
    lines: {
      want: 'You want {amount} a month after tax, at today’s prices, from age {age}.',
      nowShare: 'In all that is {pct}% of your pay.',
      enoughShare: 'That is {pct}% of your pay in all.'
    },
    invalid: 'Some of your plan’s figures are outside what this test can take, so it cannot say yet. Check “About you and when” and “What you pay in”.'
  },
  title: 'Your plan',

  /**
   * The line under the headline (7.10.0, home.js headLineOf): only what the headline, the move window's line and To do do not
   * say already, each fact once; these words where the plan's own line (copy/plan.js stageLines) would repeat one of them.
   * "Locked {date}." is said beside it, or alone.
   */
  headLine: {
    ladder: 'Your ladder’s first gilt pays from {month}.',
    backToWork: 'You went back to work.'
  },

  /** The three stages, said as words (never only a colour), and the strip under them. The key stays `drawing`. */
  stages: { saving: 'Saving', moving: 'Moving', drawing: 'Living on it', closed: 'Closed' },
  strip: {
    label: 'Where this plan is: saving, moving, living on it',
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
    drawing: 'Living on it.',
    draft: 'Living on it. Not locked yet.',
    closed: 'Closed.',
    none: 'Your plan.'
  },

  /** To do (7.10.0): at most one shown — the plan's own and a partner's in one list — and the rest folded under "and N more". */
  todoTitle: 'To do',
  more: { one: 'and 1 more', many: 'and {n} more' },
  soonTitle: 'Soon',
  notNow: 'Not now',
  /**
   * The ways to put a to-do away (7.10.0), stored on the plan so it stays away on every device: "Not now" until next month;
   * the others for good, for that occurrence of the to-do.
   */
  dismiss: { notNow: 'Not now', notThisTime: 'Not this time', seen: 'I have seen this', done: 'I have done this' },
  /** Said under the list once a to-do on this plan was put off: until when. */
  putOff: 'Put off until {month}.',
  /** Each thing to do: a short title and a line under it. {slots} as read.js gives them. */
  items: {
    'closed.next':        { title: 'Carry on in ‘{next}’', detail: 'This plan closed at the end of {closed}. Its months stay here to read.' },
    'plan.noAge':         { title: 'Add your age', detail: 'We cannot tell where you are without it.' },
    'plan.agesFromSaving': { title: 'Check your ages', detail: 'Your age today and the age you want to stop work. We took them from your saving figures.' },
    /** An unlocked plan whose stop month has passed (7.10.0): asked, never moved on quietly. */
    'plan.confirmStop':   { title: 'Did you stop work in {stop}?', detail: 'Your plan says you stop work in {stop}. If you have, say so on About you and when; if not, change the month there.' },
    'month.taxYear':      { title: 'Set up {year}', detail: 'A new tax year: say what the plan pays this year before the first month is recorded.' },
    'month.arrive':       { title: 'Record your first month', detail: 'You stopped work in {stop}. Month by month then compares your pot with the plan’s.' },
    'month.record':       { title: 'Record {monthName}', detail: 'What your platform shows today. It takes a minute.' },
    'month.gap':          { title: 'Record {month}', detail: 'It is not recorded yet. Months you missed can be filled in at once.' },
    /** The review (7.10.0): one page in every phase; a saver's is the check-in. */
    'review.due':         { title: 'Your review', detail: 'Due {reviewOften}. A few figures, a few minutes. Nothing about your plan changes unless you say so.' },
    'review.offCourse':   { title: 'Past your line at your last two reviews', detail: 'At your last two reviews that worked out the chance, the money lasted as long as you do {a} and then {b}; your line is {line} in 20. The review shows what you can change.' },
    'household.pending':  { title: 'Your partner’s plan', detail: 'The plan it is linked with is not in this account. Link one, or leave it.' },
    /** Moving (7.12.0): what is still to buy for the plan's mix, and the months left before work stops. */
    'move.toBuy':         { title: 'Moving to your plan’s mix: {toBuy} still to buy, {windowLeft} left', detail: 'The move page says what to buy and what pays for it. It is optional: you can also say that what you hold is how you want to hold it.' }
  },
  /** Off course said another way: by the guardrails rule, or from readings kept before 7.8.0 that say no figure. */
  offCourse: {
    guardrails: 'At your last two reviews your plan took more than a fifth more of what your pots hold than it took when the plan as locked began. The review shows what you can change.',
    plain: 'At your last two reviews that worked out the chance, the money did not last as long as you do often enough for your line of {line} in 20. The review shows what you can change.'
  },
  /** A soon item: shown apart, never counted. */
  soon: {
    'month.taxYear': { title: 'Set up {year}', detail: 'From 1 March you can set up the new tax year early; it is due from {month}.' }
  },
  /** A partner's plan's thing to do, one line each, named by that plan. */
  partnerItem: '{title} — ‘{name}’',

  /**
   * Nothing due, always with a date or the review's own line (never "nothing to do" alone). On a plan recording its months
   * "{month} is recorded" names the latest month recorded; a quarter or a year recorded at once reaches ahead, so the date
   * follows the plan's own cadence.
   */
  quiet: {
    review: 'Nothing due. Your next review is {month}.',
    reviewAny: 'Nothing due. You can review your plan whenever you like.',
    drawing: '{month} is recorded. Nothing is due until {next}.',
    closed: 'Closed {month}; carried on in ‘{name}’.',
    closedAlone: 'Closed {month}.'
  },
  /** The review's line, when the quiet line does not say its date already (7.10.0). */
  review: {
    next: 'Your next review: {month}.',
    any: 'Review your plan whenever you like.',
    link: 'Review now'
  },
  /** The move window (7.10.0): the one clock between saving and living on it. */
  moveWindow: {
    moving: 'In your move window: {left} left, to {stop}.',
    movingNoRecord: 'In your move window: {left} left, to {stop}. You can record what you hold when you like.',
    agreed: 'You accepted what you hold on {date}. You stop work in {stop}.',
    agreedAsItStands: 'You accepted your plan as it stands on {date}. You stop work in {stop}.',
    saving: 'Your move window opens in {from}.'
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
      none: '{month}: not recorded',
      /** Before the plan's first payment (7.12.0): not the plan's month, never "not recorded". */
      before: '{month}: before your plan’s first payment',
      beforeUnknown: '{month}: before your first record'
    },
    planSaid: '; the plan said {plan}',
    recordedCount: { none: 'No months recorded in {year} yet.', one: '1 month recorded in {year}.', many: '{n} months recorded in {year}.' }
  },

  whereTitle: 'Where you are',
  whereNone: 'Nothing recorded to read against the plan yet.',
  /**
   * What is held differently from the plan's mix, on a plan living on its money (7.10.0): one information line, never a
   * to-do and never a sale, with the way to test it. {held} and {mix} are shares of the pension.
   */
  drift: {
    shares: 'Shares are {held}% of your pension; the plan’s mix has {mix}% in shares.',
    bonds: 'Bonds are {held}% of your pension; the plan’s mix has {mix}% in bonds.',
    cash: 'Cash is {held}% of your pension; the plan’s mix has {mix}% in cash.',
    diversifiers: 'Other investments are {held}% of your pension; the plan’s mix has {mix}% in other investments.',
    ladder: 'Your ladder does not yet hold the gilt for {year}.',
    /** Moving (7.10.0): where what is held stands against the mix the plan moves to, inside the move window. */
    moving: {
      shares: 'Shares are {held}% of your pension; your plan moves to {mix}% in shares.',
      bonds: 'Bonds are {held}% of your pension; your plan moves to {mix}% in bonds.',
      cash: 'Cash is {held}% of your pension; your plan moves to {mix}% in cash.',
      diversifiers: 'Other investments are {held}% of your pension; your plan moves to {mix}% in other investments.',
      close: 'What you hold is within 5% of your pension of the mix your plan moves to.'
    },
    link: 'Test with what I hold',
    /** A ladder's gap is read on What you hold (its years), never tested on the review. */
    ladderLink: 'See what you hold'
  },
  /** The full reading, with where each figure is from, is on the "Where you are" step. */
  whereMore: 'See where you are in full',
  /** A plan that starts before its pension can usually be taken (7.4.0): from 7.4.1 the plan holds the pension back until then. */
  pensionAccess: 'Before {age}, this plan pays you from your other savings, not your pension.',
  /** … and when the other savings cannot pay those years in full (7.4.1): the words of the "Does it last?" step (LASTS.pensionShort). */
  pensionShort: 'Before {age} your plan can’t take money from your pension. Your other savings run short by {amount} a year in {years}.',

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
  /** Questions: the figures are promised only for a question that really opens with them (a saver's "Am I saving enough?"). */
  askTitle: 'Ask a question with this plan’s figures',
  askTitlePlain: 'Ask a question',
  askLead: '‘{question}’ opens with this plan’s figures in its boxes. Nothing in the plan changes unless you say so there.',
  askLeadPlain: 'Each question opens on its own page with its own boxes. Nothing in the plan changes unless you say so there.',

  /** The rail's first link on a step page: back to the home. */
  railHome: 'Your plan’s home',
  /** A plan shown as saved: nothing is due, because nothing can be changed here. */
  readonly: 'This plan is shown as it was saved and cannot be changed here. Nothing has been lost.',
  toPlans: 'Your plans',
  /** On each row of "Your plans": how many things are due on that plan. */
  rowTodo: { one: '1 to do', many: '{n} to do' }
};

/**
 * The working spinner (research/v7/mockups/README.md): a ring of small bars filling as the run goes. The count is said only
 * in the unit the run really counts (the ways, the mixes, the household's tests), never as futures it has not counted.
 */
export const WORKING = {
  running: 'Running futures…',
  count: {
    ways: '{done} of {total} ways tried',
    mixes: '{done} of {total} mixes tried',
    tests: '{done} of {total} tests run'
  }
};
