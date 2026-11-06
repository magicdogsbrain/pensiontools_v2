/**
 * The words of "Your plans" and "Your plan" (research/v7/your-plan.md 1, 2.3, 2.4, 2.5; rail-screens-language.md 1.3).
 * Data only — this file imports nothing. Placeholders are written {likeThis} and filled by the screen.
 *
 * The figures are never here: they are the plan's own records, drawn by the screen with their source (your-plan.md 3).
 * Every stage line uses the key and the dates only — never the planner's label, chip or banner (R9).
 */
export const PLAN = {
  /** The header of every V7 page, and the plan pages' own. */
  header: { plans: 'Your plans', ask: 'Ask a question', signOut: 'Sign out' },

  /** The list (1.2). */
  list: {
    title: 'Your plans',
    readAt: 'Read at {time}',
    readAgain: 'Read again',
    opening: 'Opening your plans…',
    groups: { household: 'Your household', other: 'Other plans', 'window': 'Kept in this window only, without an account', previous: 'Previous plans' },
    open: 'Open',
    lockedOn: 'Locked {date}.',
    madeOn: 'Made from your answer on {date}.',
    shownAsSaved: 'Shown as saved.',
    /** A saver's check-in has fallen due (research/saving-enough-and-check-in.md 5.2): the reminder stays in the app. */
    checkInDue: 'Check-in due.',
    empty: 'There are no plans in this account yet. Ask a question, then keep the answer as a plan.',
    emptyWindow: 'There are no plans in this window. Ask a question, then keep the answer as a plan.',
    /** Nobody signed in (1.1). */
    signIn: 'Sign in to see your plans.',
    signInButton: 'Sign in',
    noAccount: 'No account? Ask a question: an answer needs no account.',
    /** Email not confirmed. */
    unverified: 'Your email address is not confirmed yet, so your plans cannot be read. Confirm it from the email we sent, or go to your account page to send it again.',
    openPlanner: 'Open the classic planner',
    /** The read failed. */
    failed: 'Sorry, we could not read your plans. Nothing was changed.',
    tryAgain: 'Try again',
    /** The free time without an account is used up (design question 5). */
    usedUp: 'Your free time without an account is used up. Sign in or create an account to keep and see this plan.',
    /** An id that is not in the account. */
    unknown: 'That plan is not in this account.',
    toPlans: 'Your plans',
    /** The browser refused the hand-over's note (1.4). */
    leaveProblem: 'This browser would not pass the request to the classic planner. Open it from the link to the previous version at the top of this page.',

    /** The plan menu (research/v7/road-to-7.md step 11): the actions on each row, their confirms, their results. */
    actions: {
      /** The row's buttons. */
      rename: 'Rename',
      copy: 'Make a copy',
      main: 'Make this my main plan',
      mainNow: 'Your main plan',
      download: 'Download this plan',
      remove: 'Delete',
      /** The example plan's row (GuestPlans.js DEMO_PLANS): to look around, never changed. */
      exampleRow: 'Example — look around',
      exampleLine: 'An example to look around. It cannot be changed: make a copy to start from its figures, or start your own plan from a question.',
      /** Under the list. */
      start: 'Start a new plan',
      startHelp: 'A new plan comes from a question: pick one, then keep the answer as a plan.',
      openCopy: 'Open a downloaded copy',
      openCopyClose: 'Close',
      openHelp: 'A file you downloaded from here or from the classic planner. It is checked, given its own name with “(opened)”, and kept as a plan of its own; nothing else is changed. The file never leaves this page.',
      openPick: 'The file',
      example: 'Look around an example',
      exampleHelp: 'A ready-made plan to look around before you type anything: a pension pot of £1,000,000, already retired, £40,000 a year rising with prices.',
      /** Rename: the box on the row. */
      renameLabel: 'New name',
      renameSave: 'Rename it',
      notNow: 'Not now',
      /** Make a copy: the question on the row (the planner's "Copy with history / Settings only"). */
      copyAsk: 'Copy ‘{name}’ as it is, or with its monthly records? A copy with the records is locked from the start, as the plan you copy it from is; a copy as it is starts with no monthly records.',
      copyAskPlain: 'Make a copy of ‘{name}’? The copy is a plan of its own, not locked.',
      copyPlain: 'Copy it as it is',
      copyWithRecords: 'Copy it with the records (locked)',
      copyYes: 'Make the copy',
      /**
       * Move to a new plan (6.56.0, research/plan-start.md §2 I): the box on a row of a plan someone has lived on. The old plan
       * is closed at the month before the one chosen and kept to read; a new plan, not locked, is made from its figures.
       */
      close: 'Move to a new plan',
      closeIntro: 'Move from a month you choose to a new plan made from the figures of ‘{name}’.',
      closeKeeps: '‘{name}’ closes at the end of the month before, and is kept as it is: its months stay here to read, and nothing after that month can be recorded on it.',
      closeNew: 'The new plan is not locked, so you can change anything in it before you lock it. Its first tax year is the one the month is in; its income steps keep their ages, it ends at the same age, and the month you stopped work is kept.',
      closeAsk: 'Put in what you hold today. The boxes are filled in from {from}.',
      closeHeld: 'What you hold moves to the new plan.',
      closeMonth: 'Move from',
      closeMonthOption: '{month} (tax year {year})',
      closeName: 'Name of the new plan',
      closePension: 'Pension pot today',
      closeIsa: 'ISAs today',
      closeGia: 'Ordinary investment account today',
      closePartner: 'Link ‘{partner}’ with the new plan as your partner’s plan, instead of this one (and the budget you share, if you share one)',
      closeYes: 'Close this plan and make the new one',
      /**
       * Back to work (research/plan-start.md §2 J): the same close, the second reason. The plan someone has drawn on closes at the
       * month before work starts again; a saving plan made from its figures carries it on until they stop again.
       */
      closeWorking: 'I’m going back to work',
      closeWorkingIntro: 'Going back to work? ‘{name}’ closes when work starts again, and a saving plan made from its figures carries it on until you stop again.',
      closeWorkingNew: 'The new plan is a saving plan, not locked: say what you and your employer pay in on its page ‘What you pay in’, and check in with it there. Its income steps keep their ages and it ends at the same age; the plan you draw on begins when you stop again.',
      closeWorkingMonth: 'Back to work from',
      closeStopAsk: 'When do you expect to stop again? A month, or an age if you are not sure of the month.',
      closeStopMonth: 'The month you expect to stop (for example June 2031)',
      closeStopAge: 'Or the age you expect to stop at',
      closeFlexible: 'Since you took money from your pension flexibly in {month}, what you and your employer pay into pension pots in a tax year is limited to £10,000 before tax charges apply. The new plan carries this.',
      closeWorkingYes: 'Close this plan and start saving',
      /** Delete: the confirm on the row, and the second one for a locked plan. There is no Undo. */
      deleteAsk: 'Delete ‘{name}’? Its settings, its records and its budget go with it. This cannot be undone.',
      deleteLockedAsk: '‘{name}’ is locked ({lockedOn}). Delete it all the same? Its plan document and every month recorded against it go too. This cannot be undone.',
      deleteYes: 'Delete it',
      deleteLockedYes: 'Yes, delete the locked plan',
      /**
       * Delete several (6.59.0): the person's own tidy-up of plans they no longer want — ticks on the rows, ONE confirm that
       * names each plan and the count, then each deleted as "Delete it" deletes one, with the same refusals. Never undone.
       */
      several: 'Delete several',
      severalHelp: 'Tick each plan you want to delete. Nothing is deleted until you have seen the list and said yes.',
      severalTick: 'Delete ‘{name}’',
      severalCount: { none: 'Nothing ticked yet.', one: '1 plan ticked.', many: '{n} plans ticked.' },
      severalGo: 'Delete the ticked plans',
      severalClose: 'Put the ticks away',
      severalAsk: { one: 'Delete this plan? Its settings, its records and its budget go with it. This cannot be undone.', many: 'Delete these {n} plans? Their settings, records and budgets go with them. This cannot be undone.' },
      severalLocked: '— locked ({lockedOn}): its plan document and every month recorded against it go too',
      severalYes: { one: 'Yes, delete it', many: 'Yes, delete these {n} plans' },
      /** Every plan ticked: the last plan is never deleted, so the confirm says which one stays before anything goes. {name} is quoted. */
      severalStays: 'One plan always has to stay, so {name} stays.',
      /** A locked plan among them: a second confirm, as deleting one locked plan asks again. {name} and {names} are quoted. */
      severalLockedAsk: { one: '{name} is locked ({lockedOn}). Delete it all the same? Its plan document and every month recorded against it go too. This cannot be undone.',
        many: '{names} are locked. Delete them all the same? Their plan documents and every month recorded against them go too. This cannot be undone.' },
      severalLockedYes: { one: 'Yes, delete the locked plan', many: 'Yes, delete the locked plans' },
      /** The example plan is named by what it is, never by its stored name. */
      severalExample: 'the example plan',
      severalTickExample: 'Delete the example plan',
      severalWorking: 'Deleting…',
      severalDeleted: 'Deleted: {names}.',
      severalNone: 'Nothing was deleted.',
      severalRefused: '{name} was not deleted. {why}',
      severalDoneClose: 'Close',
      /** While the action runs. */
      working: 'One moment…',
      /** After each. */
      done: {
        renamed: 'Renamed to ‘{name}’.',
        copied: 'Copied as ‘{name}’.',
        copiedLocked: 'Copied as ‘{name}’, with the records, locked.',
        main: '‘{name}’ is now your main plan.',
        deleted: '‘{name}’ has been deleted.',
        opened: 'Opened as ‘{name}’.',
        example: 'The example plan is here to look around.',
        brought: 'Brought in {n} plan{s} from this window.',
        closed: '‘{old}’ is closed. ‘{name}’ carries on from {month}.',
        closedWorking: '‘{old}’ is closed. ‘{name}’ carries on from {month}, saving until you stop again.'
      },
      /** Why an action did nothing, in words. Nothing partial is ever written. */
      problems: {
        lastPlan: 'This is the only plan here, so it cannot be deleted. Keep an answer as another plan first.',
        example: 'This is the example plan, to look around. It cannot be changed: make a copy, or start your own plan from a question.',
        notHere: 'That plan is not here any more. Read again.',
        readonly: 'This plan is shown as it was saved and cannot be changed here.',
        full: 'Without an account you can keep up to three plans in this browser window. Make a free account to keep more — your plans come with you.',
        usedUp: 'Your free time without an account is used up. Sign in to change your plans.',
        nobody: 'Sign in to change your plans.',
        unverified: 'Your email address is not confirmed yet. Confirm it from the email we sent, then try again.',
        storage: 'This browser would not keep the change. Nothing was changed.',
        failed: 'Sorry, that did not work. Nothing was changed: try again.',
        badFile: 'That file is not a plan this page can open. Nothing was kept.',
        fileTooBig: 'That file is too big to be a plan, so it was not read. Nothing was kept.',
        fileProblems: 'That file holds a plan with a problem, so it was not kept: {problem}.',
        empty: 'Give the plan a name.',
        tooLong: 'Keep the name to 60 characters or fewer.',
        locked: 'This plan is locked. Unlock it from ‘Your plan as locked’ first.',
        notClosable: 'This plan cannot be moved to a new one from that month. Read again and choose another.',
        noPots: 'Put in the pension pot you hold today (0 if none).',
        /** The new plan was made, this one not closed: trying again carries on with that plan and makes no other. */
        madeNotClosed: 'The new plan ‘{name}’ was made, but this plan could not be closed. Try again: it carries on with ‘{name}’ and makes no other plan.',
        /** Back to work: when work is expected to stop again (PlanClose.workingStopOf). */
        stopNone: 'Say when you expect to stop again: a month, or an age.',
        stopMonth: 'Give the month you expect to stop as a month and a year, for example June 2031.',
        stopAge: 'Give the age you expect to stop at as a whole number, 85 at most.',
        stopSoon: 'The stop has to come after the month you go back to work, and after this month.',
        stopAgeSoon: 'Give an age older than you are today, which you reach after the month you go back to work.',
        stopLate: 'That stop leaves fewer than five years before the age the plan ends at: change its end age on ‘About you and when’ first, or stop earlier.',
        noAge: 'This plan does not say how old you are: give your age on ‘About you and when’ first.'
      }
    }
  },

  /** The stage lines (rail-screens-language.md 1.3). {month} is a month in words: "April 2027". */
  stageLines: {
    saving: 'Still saving.',
    approaching: 'Stopping work within five years.',
    'committed-saving': 'Plan locked. Still working until {month}.',
    'draft-retired': 'Retired. Plan not locked yet.',
    'bridge-ladder': 'Retired. Your ladder pays from {month}.',
    'bridge-plan': 'Retired. Your plan pays from {month}.',
    running: 'Retired. Living on the plan.',
    'running-ladder': 'Retired. Living on the plan; your ladder’s first gilt pays from {month}.',
    /** A closed plan (6.56.0): kept to read; the plan that carries it on named when it is here. */
    closed: 'Closed {month}; carried on as ‘{name}’.',
    'closed-alone': 'Closed {month}.',
    /** Closed at a change-over still to come: lived on until then. */
    closing: 'Closes at the end of {month}; carries on as ‘{name}’.',
    'closing-alone': 'Closes at the end of {month}.',
    /** Closed for going back to work (research/plan-start.md §2 J): a saving plan carries it on. */
    'closed-working': 'Closed {month}: back to work; carried on as ‘{name}’.',
    'closing-working': 'Closes at the end of {month}: back to work; carries on as ‘{name}’.'
  },
  /** The same about a partner, on the household step ("With ‘…’: …"). */
  theirLines: {
    saving: 'still saving.',
    approaching: 'stopping work within five years.',
    'committed-saving': 'plan locked. Still working until {month}.',
    'draft-retired': 'retired. Plan not locked yet.',
    'bridge-ladder': 'retired. Their ladder pays from {month}.',
    'bridge-plan': 'retired. Their plan pays from {month}.',
    running: 'retired. Living on the plan.',
    'running-ladder': 'retired. Living on their plan; their ladder’s first gilt pays from {month}.',
    closed: 'closed {month}; carried on as ‘{name}’.',
    'closed-alone': 'closed {month}.'
  },

  /** One plan (1.3). */
  page: {
    title: 'Your plan',
    lockedOn: 'Locked {date}.',
    shownAsSaved: 'This plan is shown as it was saved and cannot be changed here. Nothing has been lost.',
    railNav: 'The steps of your plan',
    railTitle: 'Your plan',
    position: 'Your plan: {step}',
    optional: 'optional',
    marks: { current: 'You are here', done: 'Done', open: 'Not done yet', later: 'For later' },
    /** A saver's steps kept for later (research/saving-enough-and-check-in.md 4.1): there to open, never "Not done yet". */
    laterTitle: 'For later',
    close: 'Close',
    notListed: 'This step is not on your plan’s list at the moment. It opens all the same.',
    source: {
      record: 'From your record, {date}',
      recordUndated: 'From your record',
      hold: 'From What you hold, {date}',
      holdUndated: 'From What you hold',
      locked: 'From your plan as locked, {date}',
      lockedUndated: 'From your plan as locked',
      saved: 'As saved in the plan',
      savedOn: 'As saved in the plan, {date}',
      budget: 'From your budget (a guide)'
    },
    stale: 'Check this figure: it is from {date}.',
    fixed: 'Fixed when you locked the plan on {date}.',
    prices: 'At the prices of {month}.',
    pricesToday: 'At today’s prices.',
    changeThis: 'Change this in the classic planner',
    /** The one unlock line (design question 4(a)): the unlock is offered on the "Your plan as locked" step only (6.38.0); every other screen says where. */
    unlock: 'To change a locked plan, unlock it first from ‘Your plan as locked’. Unlocking keeps this plan document as a past version, and your records stay.',
    pastVersions: 'Past versions: {n}',
    journeyTitle: 'How this plan got here',
    journeyArrival: 'Arrival check on {date}',
    journeyClosed: 'Closed; carried on in a new plan',
    /** The plan that carries a closed one on (6.56.0): what came before it, and the way back to its months. */
    before: 'Under your previous plan ‘{name}’ until {month} — its months are there.',
    beforeAlone: 'Under your previous plan until {month} — its months are there.',
    closedKeeps: 'This plan is kept as it was when it closed: its plan document and its months stay here to read, and nothing of it changes again.',
    closedKeepsNoDocument: 'This plan is kept as it was when it closed: its months stay here to read, and nothing of it changes again.',
    /** A step of a closed plan opened by its address (what you hold, the move, the household): read here, changed there. */
    closedStep: 'This plan is closed and kept as it was: make changes on ‘{name}’, the plan that carries it on.',
    closedStepAlone: 'This plan is closed and kept as it was.',
    askTitle: 'Ask a question',
    ask: { a: 'When can I afford to stop work?', b: 'Am I saving enough?', c: 'What is that a month?', d: 'Will it last?' },
    /** On every page of a plan kept in this window (1.4): since 2 Nov 2026 the planner opens on it by itself, no account asked for. */
    windowWarning: 'This plan is kept in this browser window only. The classic planner opens on it without an account.',
    leaveProblem: 'This browser would not pass the request to the classic planner. Open the classic planner and choose ‘{name}’ from the plan menu.',
    showAll: 'Show every setting',
    hideAll: 'Show only what has been changed',
    noneChanged: 'Nothing has been moved away from the starting values.',
    /** The stored "will it last" answer is older than its inputs (editing-in-v7.md 4). */
    answerStale: 'Your ‘will it last’ answer was worked out on {date}, before the plan was changed on {changed}.',
    answerStaleUndated: 'Your ‘will it last’ answer was worked out on {date}, before the plan was changed.'
  },

  /** The steps, by id: the name on the rail and the short name on a phone. */
  steps: {
    month:     { label: 'Month by month', short: 'Month by month' },
    where:     { label: 'Where you are', short: 'Where you are' },
    plan:      { label: 'Your plan', short: 'Your plan', locked: 'Your plan as locked' },
    pot:       { label: 'This month’s pot', short: 'This month’s pot' },
    checkin:   { label: 'Check in', short: 'Check in' },
    saving:    { label: 'What you pay in', short: 'Pay in' },
    budget:    { label: 'What you spend', short: 'Spend' },
    lock:      { label: 'Lock the plan', short: 'Lock' },
    hold:      { label: 'What you hold', short: 'What you hold' },
    move:      { label: 'Moving to your plan’s mix', short: 'Your plan’s mix' },
    household: { label: 'Your household', short: 'Household' }
  },

  /** The lines of a step's panel, by id: a label before the figure. {slots} as read.js gives them. */
  lines: {
    'month.yearSetUp': 'Tax year {year}: set up.',
    'month.yearNotSetUp': 'Tax year {year}: not set up yet.',
    'month.record': '',
    /** A month was missed (2.3): the later record was worked out without it and nothing rewrites it. */
    'month.gapLater': '{month} was recorded without it and stays as it is.',
    'where.saverPot': 'Your pot',
    'where.saverLine': 'The plan’s middle line for then',
    'where.compareLess': '',
    'where.compareLessCut': '',
    'where.compareMore': '',
    'where.compareSame': '',
    'where.taken': 'Taken before tax in {year}',
    'where.planned': 'The plan says, for {year}',
    'where.step': 'Step {n} of {of} of your plan',
    'where.pot': 'Your pot',
    'where.potMid': 'The plan’s middle line',
    'where.ladderMonthly': 'Your ladder pays',
    'says.pays': '',
    'says.sp': '',
    'says.spAssumed': '',
    'says.noSp': '',
    'says.bad': '',
    'says.badContract': '',
    'says.cuts': '',
    'says.cutsOff': '',
    'says.cutsBought': '',
    'about.age': 'Age today',
    'about.stopAt': 'Stopping work at',
    'about.retired': 'Retired.',
    'about.stoppedIn': 'Retired. Stopped work in {month}.',
    'about.firstYear': 'First tax year: {year}.',
    'about.runs': 'The plan runs',
    'pays.step': '',
    'pots.pension': 'Pension pot',
    'pots.split': 'Split',
    'pots.isa': 'ISA',
    'pots.gia': 'Ordinary investment account',
    'pots.atStop': 'Pots when you stop',
    'pots.statePension': 'State Pension',
    'pots.statePensionOld': 'State Pension',
    'pots.noStatePension': 'No State Pension figure.',
    'pots.finalSalary': 'Final-salary pension',
    'pots.other': 'Other income',
    'income.stream': '{label}',
    'income.streamLife': '{label}',
    'income.lump': '{label}',
    'way.strategy': 'How the money is taken: {strategy}.',
    'way.dial': '{dial}',
    /** "The mix" (way-and-mix.md 3): how the pension is held (the old "The mix is set {mode}" line of the way section, said in full here). */
    'mix.heldLevel': 'Held at the {level} level.',
    'mix.heldSplit': 'Held as your own split.',
    'mix.heldFunds': 'Held as the funds to test.',
    'mix.amounts': 'The split',
    'mix.funds': 'The funds to test',
    'mix.sleeveOn': 'A slice of gold and trend funds, held flat and sold first in a downturn.',
    'mix.sleeveOff': 'No slice of gold and trend funds.',
    'mix.tentOn': 'The bond tent is on: shares start lower and rise to this mix over the first {years} years.',
    'mix.tentOff': 'The bond tent is off: the mix is held flat.',
    'mix.tentBuckets': 'The bond tent is not used by Buckets in order.',
    'mix.bought': 'This way of drawing buys your income; the mix does not apply.',
    'pot.latest': 'Recorded for {month}',
    'saving.you': 'From you',
    'saving.employer': 'From your employer',
    'saving.isa': 'Into ISAs and savings',
    'saving.rise': 'Rising by',
    /** What you pay in as a share of pay, while it agrees with the pounds (saving-enough-and-check-in.md 4.5). */
    'saving.share': 'As a share of your pay',
    'budget.totalLine': 'All in',
    'budget.essentialsLine': 'Essentials',
    'hold.total': 'In all',
    'move.held': 'Held',
    'household.partner': 'With ‘{name}’:'
  },
  /** The lines' extra words: the "from" on a State Pension, a final-salary pension, the age's date. */
  lineAfter: {
    'about.age': ' (as of {asOf})',
    'about.stopAt': ', in {month}',
    'pots.statePension': ' from {from}',
    'pots.statePensionOld': ' from tax year {year}',
    'pots.finalSalary': ' from {from}',
    'income.stream': ' from age {from} to age {to}',
    'income.streamLife': ' from age {from}',
    'income.lump': ' at age {age}, {what}',
    'saving.share': ', going up with your pay (we assume pay rises with prices)'
  },
  /** What a lump sum is (the planner's wrapper), in words. */
  wrappers: { cash: 'a cash lump sum', pension: 'an inherited pension', isa: 'an inherited ISA' },
  /** The strategies in plain names. The one with an ampersand is spelt as the planner spells it. */
  strategies: {
    'pots-and-valves': 'Pots and valves',
    'buckets-in-order': 'Buckets in order',
    'bridge-and-engine': 'Bridge & engine',
    'ladder-and-ratchet': 'Ladder and ratchet',
    'floor-and-flex': 'Floor and flex',
    'floor-the-schedule': 'Floor the schedule',
    'floor-to-age': 'Floor to an age',
    'full-il-gilt': 'Full gilt ladder',
    'gilt-rotation': 'Gilt ladder with a rotation'
  },
  /** The strategies' dials, by key. A key not here is shown as it is named. */
  dials: {
    sippTotal: 'Pension pot the plan is built on',
    isaTotal: 'ISA the plan is built on',
    cashYears: 'Years held in cash',
    bridgeCash: 'Cash set aside for the years before the ladder pays',
    floorYears: 'Years the floor covers',
    reserveYears: 'Years in the reserve',
    bridgeAge: 'Age the engine takes over',
    toAge: 'Age the floor is bought to',
    growthShare: 'Share left to grow',
    ratchetStep: 'Ratchet step',
    trigger: 'Rotation trigger',
    flexShare: 'Share that flexes'
  },
  allocModes: { risk: 'by risk level', custom: 'as a custom split', funds: 'from the funds to test' },
  /** The three levels (way-and-mix.md 3.2a), as the "Held at the {level} level" line names them. */
  levels: { cautious: 'cautious', balanced: 'balanced', adventurous: 'adventurous' },

  /** The sections of "Your plan" (2.3). */
  sections: {
    about: 'About you',
    pays: 'What the plan pays',
    pots: 'Pots',
    income: 'Money that comes in anyway',
    way: 'How the money is taken',
    mix: 'The mix',
    else: 'Everything else this plan uses'
  },

  /** Notes a step shows under its figures, by id. */
  notes: {
    'where.ladderNotInDocument': 'The ladder is not in this plan document. The classic planner shows it at today’s prices.',
    'saving.notFrozen': 'What you pay in is not frozen by the lock.',
    'budget.guide': 'A guide beside your plan’s own figure. It changes nothing in the plan.',
    'lock.what': 'Locking fixes the plan and writes the plan document, so you can follow it month by month.',
    'lock.saver': 'You can lock it while you are still saving: the plan then follows your pot each month until you stop.',
    'lock.locked': 'Its settings are fixed for both tools; the plan document records what you committed to.',
    'move.optional': 'Optional. Skipping it means what you hold may not match what the plan was tested on.'
  },

  /** Buttons (2.3), by id. {month}: a month’s name; {year}: a tax year; {name}: a plan’s name. */
  buttons: {
    record: 'Record {month}',
    setUpYear: 'Set up {year}',
    monthByMonth: 'Open Month by month',
    lockFirst: 'Lock the plan',
    seeDocument: 'See it on the plan document in the classic planner',
    openDocument: 'Open the plan document in the classic planner',
    exports: 'Your records by tax year, a spreadsheet for each year and the printed documents (in the classic planner)',
    testLocked: 'Test the plan in the classic planner. Nothing you try there changes your locked plan.',
    testPlan: 'Test it in the classic planner',
    changeThis: 'Change this in the classic planner',
    /** Into "What you pay in" and the budget inside V7 (road-to-7.md step 11b). */
    recordPot: 'Record this month’s pot',
    /** A saver's check-in (research/saving-enough-and-check-in.md 5; release step R3), inside V7. */
    checkIn: 'Check in',
    changeSaving: 'Change this here',
    /** The next sentence of a plan locked while saving (P.working): the planner's own check, as before release step R2. */
    onCourse: 'Am I on course? (in the classic planner)',
    /**
     * "What you pay in"'s own buttons (release step R2): the plan's verdict first, inside V7, for someone still saving; the
     * planner's fixed-rate check a quiet link.
     */
    payingEnough: 'Are you paying in enough?',
    potCheck: 'The classic planner’s pot check (fixed rates)',
    /** A saver's next steps (saving-enough-and-check-in.md 4.2), each inside V7. */
    seeSaving: 'What you pay in',
    setAim: 'What you spend',
    checkAges: 'About you and when',
    changeBudget: 'Change this here',
    /** The lock step reached on a locked plan (R7): the way to "Your plan as locked". */
    seeLocked: 'Your plan as locked',
    /** Into "What you hold" and "Moving to your plan's mix" inside V7 (road-to-7.md step 10). */
    changeHold: 'Change this here',
    openMove: 'Open it',
    openPartner: 'Open ‘{name}’',
    /** A closed plan's way to the plan that carries it on, and back (6.56.0). */
    openNext: 'Open ‘{name}’',
    openPrevious: 'Open ‘{name}’',
    /** Into "Your household" inside V7 (road-to-7.md step 9): the two together, or the link. */
    checkTogether: 'Check the two plans together',
    linkOne: 'Link one',
    addAge: 'Add your age',
    updateIt: 'Update it',
    /** Into the editing step inside V7 (editing-in-v7.md 2). */
    editAbout: 'Change this here',
    seeAbout: 'See these',
    /** Into "How the money is taken" on a locked plan (way-and-mix.md 2.1): the nine ways run, nothing is written. */
    tryWay: 'Try another way (nothing changes)',
    /** Into "The mix" on a locked plan (way-and-mix.md 3.3): the tries and the comparison run, nothing is written. */
    tryMix: 'Try another mix (nothing changes)',
    /** Into "Does it last?" inside V7 (editing-in-v7.md 10): the one test runs there, no hand-over. */
    recheck: 'Check it still lasts',
    lasts: 'Does it last?',
    lastsLocked: 'Does it last? (as locked, and today)',
    /** 7.3.0: the buttons of the things due that the plan's home gathers. */
    checkStop: 'Check the month you stop',
    seeMove: 'See the move',
    updateHold: 'Update what you hold'
  },

  /** The next sentence (2.4), by id, first match wins. */
  next: {
    'P.readonly': 'This plan is shown as it was saved and cannot be changed here. Nothing has been lost.',
    'P.closed': 'This plan closed at the end of {closed}. Its months stay here to read; carry on in ‘{next}’.',
    'P.closedAlone': 'This plan closed at the end of {closed}. Its months stay here to read.',
    'P.noAge': 'We cannot tell where you are without your age. Next: add it.',
    'P.agesFromSaving': 'Next: check your age today and the age you want to stop work. We took them from your saving figures.',
    'P.arrive': 'You stopped work in {stop}. Next: record your first month; Month by month then compares your pot with the plan’s.',
    'P.taxyear': 'Next: set up the {year} tax year.',
    'P.month': 'Next: record {month}.',
    'P.idle': '{month} is recorded. Nothing to do until {nextMonth}.',
    'P.noAim': 'Next: say what you would want to spend from {stop}, to see whether what you pay in is enough.',
    'P.pot': 'Your plan is locked and you stop work in {stop}. Next: record this month’s pot.',
    'P.working': 'Your plan is locked and you stop work in {stop}. Next: check you are still saving enough.',
    'P.recheck': 'The plan has changed since its ‘will it last’ answer. Next: check it still lasts.',
    'P.stale': 'This plan was set to start in {savedYear}, which has passed. Next: update it to today, or leave it as it is.',
    'P.draft': 'Next: check it lasts, then lock it when it is right.',
    'P.approaching': 'Next: see how the plan draws from {stop}.',
    /** A saver's check-in (research/saving-enough-and-check-in.md 4.2; release step R3): due, behind, on course. */
    'P.checkinDue': 'Next: your {often} check-in (the last was {last}).',
    'P.behind': 'At your last check-in ({last}) you were not on course yet. Next: see what would put you on course.',
    'P.onCourse': 'On course at your last check-in ({last}). Next check-in: {nextCheck}.',
    'P.nextCheckIn': 'You checked in for {last}. Next check-in: {nextCheck}.',
    'P.saving': 'Next: see whether what you pay in is enough, then check in once a year.',
    /**
     * 7.3.0 (research/v7/one-product-design.md, "The to-do reader"): the things due that the plan's home gathers, said on the
     * rail too when one is first. The move invitation points at the stop month until agreeing to move arrives.
     */
    'P.invite': 'Your plan says you stop work in {stop}. Ready to plan the move? Next: check the month you stop.',
    'P.moveNext': 'Next: move {n} of {of} to your plan’s mix: {label}.',
    'P.moveLater': 'Next: move {n} of {of} to your plan’s mix: {label}.',
    'P.moveFinish': 'Every move is ticked. Next: update what you hold, so it shows the plan’s mix.',
    'P.firstCheckIn': 'Next: your first check-in. It says where your pot is today, and how often you want to check in.',
    'P.holdStale': 'What you hold was last updated on {date}. Next: update it.',
    'P.householdPending': 'Your partner’s plan is not in this account. Next: link one, or leave it.'
  },

  /** "Everything else this plan uses" (2.5): each row's name and the label of each fact. */
  options: {
    'inc.streams':            { name: 'Income for some years', facts: { annual: 'A year', fromAge: 'From age', years: 'For years' } },
    'inc.lump-sums':          { name: 'One-off lump sums', facts: { amount: 'Amount', atAge: 'At age' } },
    'inc.extra-spends':       { name: 'Extra spends', facts: { amount: 'A year', atAge: 'From age', years: 'For years' } },
    'inc.final-salary-rises': { name: 'How the final-salary pension rises', facts: { rises: 'Rises' } },
    'inc.state-pension-old':  { name: 'State Pension, the older way (a yearly figure and a year)', facts: { yearly: 'A year', fromYear: 'Years after the first tax year' } },
    'tax.bands':              { name: 'Tax thresholds', facts: { pa: 'Tax-free allowance', brl: 'Basic rate up to', hrl: 'Higher rate up to' } },
    'tax.mode':               { name: 'Whether the thresholds rise', facts: { mode: 'Thresholds' } },
    'tax.tax-free-cash':      { name: 'The tax-free quarter', facts: { how: 'Taken' } },
    'tax.ufpls-years':        { name: 'Tax-free slices for some years', facts: { years: 'Years', thenRest: 'Then the rest into the ISA' } },
    'tax.band-fill':          { name: 'Fill the basic-rate band and move the rest into the ISA', facts: { on: 'On' } },
    'tax.bed-and-isa':        { name: 'Move £20,000 a year into the ISA', facts: { on: 'On' } },
    'tax.earnings':           { name: 'Earnings that count for pension saving', facts: { yearly: 'A year' } },
    'prot.cuts':              { name: 'Cuts in a slump', facts: { off: 'Switched off', after: 'After this many draws from cash', cutTo: 'Income cut to', deeperAfter: 'A deeper cut after this many months', buffer: 'Buffer before the cut ends' } },
    'prot.reserve':           { name: 'Emergency reserve', facts: { on: 'On', amount: 'Amount' } },
    'pots.diversifiers':      { name: 'Diversifiers (gold and trend funds)', facts: { amount: 'Amount' } },
    'pots.bond-tent':         { name: 'Bond tent', facts: { on: 'On', endgame: 'At the end' } },
    'pots.isa-use':           { name: 'How the ISA is used', facts: { use: 'Used' } },
    'pots.isa-growth':        { name: 'How the ISA and savings grow', facts: { grows: 'Grows', fixedRate: 'Fixed rate', floor: 'ISA floor' } },
    'pots.charges':           { name: 'Fund and platform charges', facts: { yearly: 'A year' } },
    'pots.funds-to-test':     { name: 'Funds to test', facts: { name: 'Fund', value: 'Value' } },
    'draw.cadence':           { name: 'How often you draw', facts: { how: 'Drawn' } },
    'timing.stale-draft':     { name: '“Leave it” on an out-of-date start year', facts: { year: 'Year left as it was' } },
    'lock.lock':              { name: 'The lock', facts: { locked: 'Locked', at: 'On', by: 'By' } },
    'lock.unlock':            { name: 'Unlocks', facts: { times: 'Times unlocked', last: 'Last unlocked' } },
    'month.seeded':           { name: 'Where a copy came from', facts: { from: 'From' } },
    'mach.configured':        { name: 'Settings saved at least once', facts: { stress: 'The plan’s settings', decision: 'Month by month settings' } },
    'mach.declining':         { name: 'The old “declining with age” profile, folded into the steps', facts: { folded: 'Folded in' } },
    'mach.old-names':         { name: 'Old names of the pot floors', facts: { present: 'Still carried' } },
    'mach.risk-mode':         { name: 'The example plan’s risk mode', facts: { mode: 'Mode' } },
    'mach.start-date':        { name: 'The old month-by-month start date', facts: { date: 'Date' } }
  },
  /** The plain words for a row's choices, by fact value. */
  choices: {
    cpi: 'with prices', lpi5: 'with prices, capped at 5%', level: 'not at all',
    inflates: 'rise with prices', frozen: 'frozen',
    drawdown: 'a quarter of each withdrawal tax-free', ufpls: 'in tax-free slices', pcls: 'the quarter up front',
    minimiseEarlyTax: 'to keep early tax down', maximiseLongevity: 'to make the money last', hold: 'held, never drawn for income',
    invested: 'as the plan’s mix', cash: 'mostly as cash', fixed: 'at a fixed rate',
    monthly: 'every month', quarterly: 'every three months', annual: 'once a year',
    equity: 'in shares', gilt: 'in gilts', bond: 'in bond funds', balanced: 'in a mix', basic: 'at the basic rate', higher: 'at the higher rate',
    band: 'sells only when well above the glide', glide: 'follows the glide'
  },
  yes: 'yes',
  no: 'no'
};
