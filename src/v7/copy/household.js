/**
 * The words of "Your household" (research/v7/road-to-7.md step 9; your-plan.md 6; v6-usability-audit.md 2.10). Data only —
 * this file imports nothing. Placeholders are written {likeThis} and filled by the screen. The figures are never here: they
 * are the one test's own, pooled by the planner's HouseholdService and read through OneAnswer.js. The planner's Household
 * tab says "survivor", "DB", "years from now", "today's money" and "about £"; the preview asks in ages, says "final-salary
 * pension", "at today's prices", and gives every figure to the pound (src/v7/copy/banned.js is the law).
 */
export const HOUSEHOLD = {
  title: 'Your household',
  lead: 'Two plans, one household: whether the money lasts for both of you when one pot pays for the other, who draws what, and what happens if one of you dies or needs care. Nothing here changes a plan until you press a button that says so.',
  savedValue: '({value})',
  source: { saved: 'From your plan, saved {date}', savedUndated: 'As saved in the plan', locked: 'Fixed when you locked the plan on {date}.' },
  sections: {
    partner: 'Your partner’s plan',
    verdict: 'Does the money last for both of you?',
    detail: 'Year by year',
    split: 'Who draws what',
    survivor: 'If one of you dies first',
    care: 'If one of you needs care',
    budget: 'One budget for the household',
    whoPays: 'Who pays what'
  },
  /** The link (6): the partner's plan, linked either way; the other plans here to choose from. */
  partner: {
    with: 'With ‘{name}’: {line}',
    linkedMine: 'This plan points at ‘{name}’.',
    linkedTheirs: '‘{name}’ points at this plan.',
    linkedBoth: 'Each plan points at the other.',
    open: 'Open ‘{name}’',
    none: 'No partner’s plan is linked yet. Choose one below, or keep the answer to “When can I afford to stop work?” as a couple: that makes two linked plans.',
    missing: 'Your partner’s plan is not in this {store}. The plan this one points at cannot be read here, so the two cannot be checked together.',
    choose: 'Link a plan as your partner’s',
    chooseLabel: 'Your partner’s plan',
    chooseNone: '— choose a plan —',
    link: 'Link ‘{name}’',
    unlink: 'Unlink',
    unlinkConfirm: 'Unlink ‘{name}’ from this plan? Both plans stay as they are; only the link goes.',
    linkConfirm: 'Link ‘{name}’ as your partner’s plan? The link is written on this plan only; the other plan is not changed.',
    noOthers: 'There is no other plan here to link. Make one from a question first.',
    notSet: '‘{name}’ has no figures saved yet. Open it, fill in its pots and spending, and come back.',
    store: { account: 'account', 'window': 'window' }
  },
  /** The pooled verdict first (2.10), then each plan alone. */
  verdict: {
    button: 'Check the two plans together',
    again: 'Check again',
    rerun: 'Check again with this limit',
    working: 'Running both plans through the one test, each as it is and drawing together…',
    progress: 'How far the working has got',
    failed: 'Sorry, the two plans could not be checked. Nothing has changed.',
    noWorker: 'This browser cannot run the test in the background, so the two plans cannot be checked here.',
    ran: 'Tried in {runs} run{s} ({ms} s).',
    ranUntimed: 'Tried in {runs} run{s}.',
    stale: 'The limit has changed since this was checked.',
    head: { yes: 'On course together', close: 'Not on course yet, together', no: 'At risk, together' },
    headline: 'The household’s money lasts {words}.',
    pooled: 'When one plan falls short — its money runs out, or a way of drawing that cuts instead cuts it — the other pays that share; the household falls short only when both have.',
    covered: 'In {n} of {of} futures one plan fell short and the other paid, typically from age {from}.',
    coveredEarliest: 'In {n} of {of} futures one plan fell short and the other paid, typically from age {from} (from {earliest} at the earliest).',
    rows: { household: 'The household together', a: '{name}’s plan on its own', b: '{name}’s plan on its own', both: 'Both plans, each lasting on its own' },
    cell: '{words} ({pct}%)',
    cellHousehold: '{words}',
    ways: 'Run with each plan’s own way of drawing: {wayA} for {a}, {wayB} for {b} — paired future for future on the same markets. “Lasts” means paid in full (for Floor to an age and Gilt ladder + rotation: never cut; for Floor & Flex: no lean year).',
    shifted: 'One of you starts drawing later than the other. A plan not yet begun is not year-shifted under a way that buys its income, so the figure together is a rough guide for the years before it begins.',
    same: 'Both plans face the same markets, so a bad decade hits you both at once: this check runs you both through identical futures instead of treating your plans as unrelated.',
    whatToDo: 'The weaker side is {name}’s plan ({pct}% on its own). Open that plan and try a slightly lower spending figure, stopping a little later, the bond tent, or a different share of the budget between you — then check again here.',
    unaffordable: '{name}’s way of drawing cannot be bought with its pots as set{reason}. Change that plan first.',
    reasonWas: ' ({reason})'
  },
  /** Year by year: where the money comes from, and what is left combined (the planner's two tables), behind one button. */
  detail: {
    open: 'Show the years',
    close: 'Hide the years',
    timeline: { title: 'Where the money comes from', bridge: 'Until {year} at least one of you is still waiting for a State Pension: those are the years when your pots do the most work. This is usually where a couple’s plan is tightest.',
      columns: { year: 'Year', a: '{name} needs', b: '{name} needs', sp: 'State Pensions', other: 'Other income that comes anyway', draw: 'From your pots' }, working: 'still working',
      note: 'At today’s prices, a year. Rows where something changes and every fifth year. The last column is what your pots must provide after everything that comes anyway.' },
    left: { title: 'What you would have left, combined', lead: 'Everything both plans hold — pensions, ISAs, gilts not yet repaid — at today’s prices.', columns: { year: 'Year', p10: 'In a bad case (the worst 1 in 10)', p50: 'Middling', p90: 'In a good case (the best 1 in 10)' } }
  },
  /** Who draws what (household-draw-split.md 4), in exact pounds. */
  split: {
    headline: 'Drawing together saves {year} a year in tax — {until} by the time {small} is {untilAge}.',
    why: 'Your pots are unequal ({a} and {b}). When each of you draws for your own plan, {big} pays 40% tax on {over} a year while {allowance} of {small}’s tax-free allowance and {band} of {small}’s 20% band go unused.',
    bandMost: 'most',
    cost: 'The cost: {small}’s pot is spent as the years before the State Pension are paid from it — {together} left at {untilAge} in a middling case, instead of {own} if each of you draws for your own plan.',
    costShort: 'The cost: {small}’s pot is spent as the years before the State Pension are paid from it.',
    closing: 'Paying the tax keeps {small}’s pot, and your money more separate. Drawing together leaves the household {amount} {better} at 90.',
    closingShort: 'Paying the tax keeps {small}’s pot, and your money more separate.',
    choice: 'This is your choice; neither is wrong.',
    better: { yes: 'better off', no: 'worse off' },
    none: 'Drawing together would not save much tax here: each of you draws for your own plan, and that is already about as cheap as it gets. The comparison shows only when the first full year would save more than £1,000.',
    unchanged: 'Each of you already draws within your own tax-free allowance and 20% band, so there is nothing to move between you.',
    dismissed: 'You chose to keep things as they are: each of you draws for your own plan.',
    showAgain: 'Show the comparison again',
    columns: { what: '', own: 'Each for their own', together: 'Drawing together' },
    rows: {
      taxYear: 'Tax a year (first full year)',
      taxUntil: 'Tax until {small} is {untilAge} / over the whole plan',
      potA: '{name}’s pot at {ages} (middling)',
      potB: '{name}’s pot at {ages} (middling)',
      lasts: 'The money lasts for the household (9 futures out of 10 is on course)',
      left: 'Left for the household when {name} is 90, at today’s prices (middling / bad case, the worst 1 in 10)'
    },
    both: '{own} / {together}',
    steps: { title: 'What each of you would draw', one: '{name}: {steps}.', step: '{amount} a year before tax from {fromAge}' },
    figures: 'Every figure is from the runs: the tax from the plan’s own tax sums on each year’s draws at today’s prices; the pots, the count of futures and what is left from both plans through the same 1,000 futures each way.',
    limit: {
      title: 'A limit on {small}’s pot',
      lead: 'Optional. Keep {small}’s pot until an age (drawn evenly to it, nothing after), or keep at least a sum in it.'
    },
    use: 'Use this split',
    useCopies: 'Make copies of both plans with this split',
    keep: 'Keep things as they are',
    lockedNote: '{names} {is}: a locked plan is never changed. The copies are unlocked, linked to each other; your plans stay exactly as they are.',
    isOne: 'is a locked plan', areTwo: 'are locked plans',
    confirm: {
      title: 'Use this split?',
      write: 'Write the split into both plans as their income shape? You can undo this straight afterwards.',
      copies: 'Make a copy of each plan with the split as its income shape? Your plans stay exactly as they are; the copies are unlocked, linked to each other.',
      change: '{name}: {from} → {to}',
      unchanged: '{name}: unchanged ({from})',
      yes: 'Use this split', yesCopies: 'Make the copies', notNow: 'Not now'
    },
    kept: 'Kept as ‘{a}’ and ‘{b}’ in your {where}: unlocked copies, linked to each other. Your plans are untouched.',
    keptWhere: { account: 'account', 'window': 'browser window' },
    openCopy: 'Open ‘{name}’'
  },
  /** The survivor question in ages (2.10). */
  survivor: {
    lead: 'The hard question most tools skip. The one who is left keeps their own pensions, inherits what the other’s plan has left then (pensions go to them free of tax before 75), loses one State Pension, and typically needs about 70% of the joint spending. Both plans run through their own way of drawing.',
    button: 'Try it',
    again: 'Try it again',
    working: 'Running both plans through their own way of drawing…',
    failed: 'Sorry, that could not be tried. Nothing has changed.',
    noWorker: 'This browser cannot run the test in the background, so this cannot be tried here.',
    close: 'Put it away',
    stale: 'The boxes have changed since this was tried.',
    ran: 'Tried in {runs} runs ({ms} s).',
    ranUntimed: 'Tried in {runs} runs.',
    headline: 'If {deceased} died at {atAge}, {survivor}’s plan lasts {middling} with a middling inheritance, and {bad} with a bad-case one (the worst 1 in 10).',
    headlineOne: 'If {deceased} died at {atAge}, {survivor}’s plan lasts {middling} with a middling inheritance; with a bad-case one (the worst 1 in 10) it could not be tested ({badReason}).',
    cannot: 'If {deceased} died at {atAge}, {survivor}’s plan could not be tested as set ({reason}). Change that plan first.',
    unaffordable: '{deceased}’s plan could not be tested as set{reason}. Change that plan first.',
    rows: {
      inherit: '{survivor} inherits {middling} in a middling case, {bad} in a bad case (the worst 1 in 10), at today’s prices — what {deceased}’s own plan ({way}) has left then{held}.',
      held: ' (including the ISA {deceased}’s plan holds aside, {heldIsa})',
      spend: '{survivor} then spends {gross} a year before tax ({net} after tax), at today’s prices — {pct}% of what you both spend after tax.',
      way: '{survivor}’s plan runs on its own way of drawing ({way}) with the inheritance arriving that year.'
    },
    note: 'A check, not advice. Simplifications: pensions inherited free of tax (death before 75); the ISA goes across as ISA (the spouse’s extra allowance); the inheritance is split between pension and ISA in the shares {deceased}’s plan held at the start; gilts still held count at the value they would reach if interest rates did not move; the bad case sets {deceased}’s worst 1 in 10 against every one of {survivor}’s futures, not future by future.'
  },
  /** The care question in ages (2.10). */
  care: {
    lead: 'Nursing care often costs £80,000 to £100,000 a year. This adds the full cost on top of normal spending (deliberately cautious) as a one-off cost in that person’s plan and runs both plans again through their own way of drawing. It models the cost only — never what a council might pay.',
    button: 'Try it',
    again: 'Try it again',
    working: 'Running both plans again with the care years included…',
    failed: 'Sorry, that could not be tried. Nothing has changed.',
    noWorker: 'This browser cannot run the test in the background, so this cannot be tried here.',
    close: 'Put it away',
    stale: 'The boxes have changed since this was tried.',
    ran: 'Tried in {runs} runs ({ms} s).',
    ranUntimed: 'Tried in {runs} runs.',
    headline: 'With {name} needing care from {fromAge} for {years} year{s} ({cost} a year after tax, {total} in all, at today’s prices): the household’s money lasts {withWords} — {withoutWords} without care.',
    pooled: 'When one plan falls short, the other pays that share.',
    both: 'Both plans each lasting on its own: {bothWith} with care, {bothWithout} without.',
    note: 'A check, not advice. The cost is added in full on top of normal spending, as a one-off cost of {totalGross} before tax in all; nothing a council might pay is modelled.',
    cannot: 'The plans could not be tested as set ({reason}).'
  },
  /** One budget for the household (decision 5), with "Keeping money separate?" as the option. */
  budget: {
    separateQuestion: 'Keeping money separate?',
    lead: 'A couple is one household: share this plan’s budget and ‘{name}’ reads the same lines, with “who pays” still its own. Keeping money separate is the other choice: each plan keeps its own budget.',
    mine: 'This plan’s budget is the household’s: ‘{name}’ reads the same lines, with its own share of who pays.',
    theirs: 'The household’s budget is ‘{name}’s: this plan reads the same lines, with its own share of who pays.',
    none: 'Each plan has its own budget at the moment.',
    share: 'Share this plan’s budget with ‘{name}’',
    separateTheirs: 'Give ‘{name}’ a separate budget',
    separateMine: 'Keep a separate budget on this plan',
    confirm: {
      share: 'Share this plan’s budget? ‘{name}’ then reads this plan’s budget lines; its own side of who pays stays its own. You can undo this straight afterwards.',
      separate: 'Keep the budgets separate? ‘{name}’ keeps a copy of the lines as last read and is no longer tied to this plan’s budget. You can undo this straight afterwards.',
      yes: 'Yes', notNow: 'Not now'
    }
  },
  /** The budget's who-pays (ledger budget.who-pays): me, partner or shared, and my share. */
  whoPays: {
    open: 'Who pays what',
    close: 'Hide who pays what',
    lead: 'Mark each line Me, Partner or Shared. Your plan funds only your share — costs your partner covers drop out of your spending figure but still show in the household total.',
    readsShared: 'The lines are the household’s, held on ‘{name}’: a change to who pays a line is written there; your share is written on this plan.',
    fields: {
      shared: { label: 'Some of these costs are paid by a partner', options: { yes: 'Yes', no: 'No' } },
      mySharePct: { label: 'Your share of any shared cost, %', help: 'Each line can have its own share instead.' },
      paidBy: { label: 'Who pays', options: { me: 'Me', partner: 'Partner', shared: 'Shared' } },
      lineShare: { label: 'Your share of this line, % (blank: the share above)' }
    },
    errors: {
      shared: { notAnOption: 'Yes or no.' },
      mySharePct: { required: 'A whole percent, like 50.', notANumber: 'A whole percent, please, like 50.', tooLow: 'A percent of 0 or more.', tooHigh: 'Up to 100.' },
      paidBy: { notAnOption: 'Me, Partner or Shared.' },
      lineShare: { notANumber: 'A whole percent, please, like 50.', tooLow: 'A percent of 0 or more.', tooHigh: 'Up to 100.' }
    },
    lines: 'Lines', oneOffs: 'One-off costs', noLines: 'No lines on the budget yet.',
    save: 'Save who pays', cancel: 'Cancel'
  },
  /** The boxes of the questions, in ages. */
  fields: {
    'limit.kind':   { label: 'A limit on the smaller pot', options: { none: 'None', untilAge: 'Keep it until an age', keepAtLeast: 'Keep at least a sum in it' } },
    'limit.age':    { label: 'Until age' },
    'limit.amount': { label: 'Keep at least, in pounds' },
    'survivor.who':      { label: 'Who dies', options: { a: '{a}', b: '{b}' } },
    'survivor.atAge':    { label: 'At what age' },
    'survivor.spendPct': { label: 'The one who is left spends, % of what you both spend' },
    'survivor.dbPct':    { label: 'Final-salary pension paid to the one who is left, %' },
    'care.who':     { label: 'Who needs care', options: { a: '{a}', b: '{b}' } },
    'care.fromAge': { label: 'From what age' },
    'care.years':   { label: 'For how many years' },
    'care.cost':    { label: 'Cost a year after tax, in pounds, at today’s prices' }
  },
  errors: {
    'limit.kind':   { notAnOption: 'One of the three, please.' },
    'limit.age':    { required: 'An age, like 67.', notANumber: 'An age, please, like 67.', tooLow: 'An age of 55 or more.', tooHigh: 'An age up to 100.' },
    'limit.amount': { required: 'A sum, like 50,000.', notANumber: 'Figures only, like 50,000.', tooLow: 'At least £1.', tooHigh: 'A sum up to £50,000,000, please.' },
    'survivor.who':      { notAnOption: 'One of the two, please.' },
    'survivor.atAge':    { required: 'An age, like 75.', notANumber: 'An age, please, like 75.', tooLow: 'An age of 18 or more.', tooHigh: 'An age up to 110.' },
    'survivor.spendPct': { required: 'A whole percent, like 70.', notANumber: 'A whole percent, please, like 70.', tooLow: 'From 40%.', tooHigh: 'Up to 100%.' },
    'survivor.dbPct':    { required: 'A whole percent, like 50.', notANumber: 'A whole percent, please, like 50.', tooLow: 'From 0%.', tooHigh: 'Up to 100%.' },
    'care.who':     { notAnOption: 'One of the two, please.' },
    'care.fromAge': { required: 'An age, like 85.', notANumber: 'An age, please, like 85.', tooLow: 'An age of 18 or more.', tooHigh: 'An age up to 110.' },
    'care.years':   { required: 'A number of years, like 3.', notANumber: 'A whole number of years, please.', tooLow: 'At least 1 year.', tooHigh: 'Up to 15 years.' },
    'care.cost':    { required: 'A sum, like 90,000.', notANumber: 'Figures only, like 90,000.', tooLow: 'At least £1.', tooHigh: 'A sum up to £1,000,000, please.' }
  },
  locked: {
    lead: 'This plan is locked, so its settings are fixed: the checks still run; the split would be written into copies, never into this plan.',
    partner: '‘{name}’ is locked too.'
  },
  readonly: 'This plan is shown as it was saved and cannot be changed here. Nothing has been lost.',
  notRun: 'This plan is shown as it was saved, so nothing is run here. Nothing has been lost.',
  buttons: { undo: 'Undo', close: 'Close', back: 'Back to your plan', tryAgain: 'Try again' },
  saving: 'Saving…',
  toast: {
    linked: 'Saved. The partner’s plan is linked.',
    unlinked: 'Saved. The plans are no longer linked.',
    split: 'Saved. Both plans now draw together, tax first: the split is {a}’s and {b}’s income shape. “Does it last?” runs again on each.',
    kept: 'Saved. You chose to keep things as they are.',
    shownAgain: 'Saved. The comparison is shown again.',
    shared: 'Saved. ‘{b}’ now reads this plan’s budget.',
    separate: 'Saved. Each plan has its own budget again.',
    whoPays: 'Saved. Who pays what is written into the budget.',
    savedShort: 'Saved.', undone: 'Put back as it was.', unchanged: 'Nothing has changed.'
  },
  problems: {
    locked: 'This plan is locked, so nothing was changed. The split goes into copies instead; the link and the budget can still change.',
    notHere: 'That plan is not in this {store}. Nothing was changed.',
    usedUp: 'Your free time without an account is used up. Sign in to keep and change this plan.',
    nobody: 'Sign in to change this plan. Nothing was changed.',
    storage: 'This browser would not keep the change. Nothing was changed.',
    failed: 'Sorry, the change could not be saved. Nothing was changed.',
    partial: 'The first copy was made; the second, or its link, could not be. Nothing is deleted: open “Your plans” to see what is there.',
    problems: 'Have a look at the boxes marked above.',
    noRun: 'The two plans have not been checked as saved: check them again, then choose.',
    noPartner: 'No partner’s plan is linked. Link one first.',
    full: 'This browser window holds its three plans already; the two copies need room. Sign in to keep more.',
    unverified: 'Your email address is not confirmed yet, so nothing can be made in the account.',
    readonly: 'This plan is shown as it was saved and cannot be changed here. Nothing has been lost.'
  }
};
