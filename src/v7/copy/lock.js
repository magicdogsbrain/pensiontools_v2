/**
 * The words of "Lock the plan" (research/v7/road-to-7.md step 6; v6-usability-audit.md 2.6; your-plan.md 7 and owner
 * question 4(a)), of the unlock offered once on "Your plan as locked", and of "Write a new version from today's settings".
 * Data only — this file imports nothing. Placeholders are written {likeThis} and filled by the screen. The figures are
 * never here: the lock writes the plan's own records.
 */
export const LOCK = {
  title: 'Lock the plan',
  lead: 'Locking fixes the plan and writes the plan document, so you can follow it month by month.',
  /** A saver (still working) may lock: the plan then follows the pot. */
  saver: 'You can lock it while you are still saving: the plan then follows your pot each month until you stop.',
  /** What the lock fixes: the plan's settings, for both tools. */
  fixes: {
    title: 'What the lock fixes',
    lead: 'The plan’s settings, so that every month is read against the same plan:',
    items: {
      ages: 'your ages and dates: your age today, when you stop, the first tax year, how long the plan runs;',
      income: 'the money that comes in anyway: the State Pension, a final-salary pension, other income, lump sums;',
      spend: 'what you spend: the first figure and every later step;',
      pots: 'your pots and tax: the pension, the ISA, the ordinary account, charges, the tax thresholds and the tax-free part;',
      way: 'the way of drawing ({strategy}) and its dials;',
      cuts: 'the rules for cutting income in a slump, and the emergency reserve.'
    },
    both: 'Month by month runs this plan, not its own starting values.'
  },
  /** What stays changeable on a locked plan. */
  stays: {
    title: 'What stays changeable',
    items: {
      records: 'your monthly records and each tax year’s set-up;',
      hold: 'what you hold;',
      budget: 'the budget (a guide beside the plan);',
      cadence: 'how often you draw;',
      payIn: 'what you pay in while you are still saving.'
    }
  },
  /** What you get. */
  gets: {
    title: 'What you get',
    items: {
      document: 'the plan document: the plan as committed, at the prices of the day you lock it, kept with every past version;',
      where: '“Where you are”: each month read against the plan — what you took, what the plan said, the difference;',
      records: 'month-by-month records on the classic page, each one against this plan.'
    }
  },
  /** The lock does not run anything new: the test is the plan's own. */
  test: 'The plan document carries the plan’s own test (“Does it last?”) as it stands on the day you lock. A gilt ladder is priced on the bundled yield curve here; the classic page prices it on the day’s live figures when it has them.',
  /** Changing it later. */
  later: 'To change a locked plan later, unlock it from “Your plan as locked”: the plan document is kept as a past version, and your records stay.',
  buttons: {
    lock: 'Lock this plan',
    confirm: 'Lock it',
    notNow: 'Not now',
    back: 'Back to your plan',
    seeLocked: 'Your plan as locked',
    undo: 'Undo',
    close: 'Close'
  },
  /** The confirm step, on the same screen (never a browser dialog). */
  confirm: {
    title: 'Lock this plan?',
    fixes: 'Its settings are fixed for both tools from now on, and the plan document is written from them at today’s prices.',
    stays: 'Your monthly records, what you hold, the budget, how often you draw and what you pay in stay changeable.',
    undo: 'You can undo this straight away; after that, unlocking is the way back, and it keeps the plan document as a past version.'
  },
  /** While the lock is under way: the plan's own test runs, then one write. */
  working: { title: 'Locking the plan and writing the plan document…', body: 'Running the plan’s own test, then writing the plan as committed.', progress: 'How far the working has got' },
  /** A locked plan reached by its address (R7). */
  locked: { title: 'This plan is locked', line: 'Locked {date}. Its settings are fixed for both tools; the plan document records what you committed to.' },
  /** The toast after the lock. */
  toast: {
    locked: 'Locked {date}. The plan document is written.',
    unlocked: 'Unlocked. The plan document is kept as a past version ({versions} kept).',
    newVersion: 'A new version of the plan document is written; the previous one is kept ({versions} kept).',
    firstVersion: 'The plan document is written.',
    undone: 'Put back as it was.',
    unchanged: 'Nothing has changed.'
  },
  /** Why nothing was written. */
  problems: {
    locked: 'This plan is already locked. Nothing was changed.',
    notLocked: 'This plan is not locked. Nothing was changed.',
    notHere: 'That plan is not in this account. Nothing was changed.',
    usedUp: 'Your free time without an account is used up. Sign in to keep and lock this plan.',
    nobody: 'Sign in to lock this plan. Nothing was changed.',
    storage: 'This browser would not keep the change. Nothing was changed.',
    failed: 'Sorry, the plan could not be locked. Nothing was changed.',
    noWorker: 'This browser cannot run the plan’s test in the background, so the plan document cannot be written here. The classic page locks the same plan.',
    readonly: 'This plan is shown as it was saved and cannot be changed here. Nothing has been lost.',
    problems: 'Sorry, the plan could not be locked. Nothing was changed.',
    noRun: 'Sorry, the plan’s test gave no figures to write. Nothing was changed.'
  },
  readonly: 'This plan is shown as it was saved and cannot be changed here. Nothing has been lost.',

  /** Unlocking, once only, on "Your plan as locked" (owner question 4(a)). */
  unlock: {
    line: 'To change a locked plan, unlock it first. Unlocking keeps this plan document as a past version, and your records stay.',
    button: 'Unlock this plan',
    title: 'Unlock this plan?',
    keeps: 'The plan document is kept as a past version ({versions} kept at most).',
    means: 'The settings can then change again. Months already recorded are kept; once different settings are saved, Month by month shows them as recorded under the plan as it was.',
    defaults: 'A plan locked before a setting existed gets that setting’s usual starting value on unlocking: {which}.',
    defaultsCharges: 'fund and platform charges of {charges}% a year',
    defaultsIsa: 'the ISA and savings growing mostly as cash',
    confirm: 'Unlock it',
    keep: 'Keep it locked',
    working: 'Unlocking…'
  },
  /** "Write a new version from today's settings" on a locked plan. */
  document: {
    button: 'Write a new version from today’s settings',
    firstButton: 'Write the plan document',
    title: 'Write a new version of the plan document?',
    firstTitle: 'Write the plan document?',
    keeps: 'The current document ({date}) becomes a past version, kept with the others ({versions} kept at most).',
    first: 'This plan was locked before plan documents existed, so it has none yet.',
    means: 'A new one is written from the plan’s settings as they stand, with the way of drawing run again at today’s prices. “Where you are” then reads against the new version.',
    nothingElse: 'Nothing else changes: the plan stays locked, and your recorded months are kept.',
    confirm: 'Write the new version',
    firstConfirm: 'Write it',
    keep: 'Keep the current document',
    notNow: 'Not now',
    working: 'Running the plan’s test and writing the plan document…'
  }
};
