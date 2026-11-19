/**
 * The words of "What you pay in" on a saved plan (research/v7/road-to-7.md step 11b). Data only — this file imports nothing.
 * Placeholders are written {likeThis} and filled by the screen. The figures are never here. The saver rules hold: what you
 * pay in, never a contribution; the tax the government adds back, said with the words "tax relief"; what the pot could be
 * by the stop in a cautious, middle and strong case, never a forecast or a rate promised.
 */
/**
 * What goes in now, one way on every screen (7.12.0, services/SaverPayIn.js payInSaid): "you" is never followed by a bare
 * amount; what leaves take-home pay and what lands in the pension are both said.
 */
const PAY_IN_NOW = {
  pounds: 'You pay in {takeHome} a month from your take-home pay. With the tax added back that is {landed} in your pension.',
  poundsEmployer: 'You pay in {takeHome} a month from your take-home pay. With the tax added back that is {landed} in your pension. Your employer adds {employer}: {total} a month in all.',
  share: 'You pay in {ownPct}% of your pay and your employer {employerPct}%: {takeHome} a month from your take-home pay, {total} a month into your pension in all.',
  before: '{landed} a month goes into your pension from your pay before tax; your take-home pay is about {takeHome} less.',
  beforeEmployer: '{landed} a month goes into your pension from your pay before tax; your take-home pay is about {takeHome} less. Your employer adds {employer}: {total} a month in all.',
  employerOnly: 'Your employer pays in {employer} a month; nothing goes in from your pay.',
  none: 'Nothing goes into your pension each month.'
};

export const SAVING = {
  payInNow: PAY_IN_NOW,
  title: 'What you pay in',
  lead: 'What goes into your pension each month, from your take-home pay and from your employer, into ISAs and savings, and how it rises each year. The plan works the rest out and shows it below: what each payment becomes once the tax the government adds back is counted, and what the pot could be by the stop.',
  source: { saved: 'From your plan, saved {date}', savedUndated: 'As saved in the plan' },
  /** When work stops and how long is left to save, from the plan's timing (services/SaverFacts.js), said once. Never a
   * countdown ("years from now"; banned.js countdown-any): the saving years, from the age today. */
  ages: {
    ages: 'You stop work in {month}, at {to}: {span} of saving from age {from}. The ages are on “About you and when”.',
    agesNoMonth: 'You stop work at {to}: {span} of saving from age {from}. The ages are on “About you and when”.'
  },
  agesNone: 'The plan has no age today or no age to stop at, so nothing can be worked out yet. Add them on “About you and when”.',
  stopped: 'The plan says you have stopped work, so there are no saving years to work out. What you pay in is kept all the same.',
  notFrozen: 'What you pay in is not frozen by the lock: change it as it changes.',
  /**
   * The limit carried from a plan drawn on and closed (research/plan-start.md §2 J): the rule, said whatever is paid in, and
   * when what goes in now is more. What the rule is, never what to do.
   */
  allowance: 'Since you took money from your pension flexibly in {month}, what you and your employer pay into pension pots in a tax year is limited to £10,000 before tax charges apply.',
  allowanceOver: 'What goes in now comes to {yearly} a year, more than £10,000: the part above it is taxed back.',
  /** A saving plan made on going back to work, its change-over still to come: no pot record before its first month. */
  notYet: 'This plan carries on from {month}, when you go back to work: record your pot here from then. Until then your months are recorded on your previous plan.',
  readonly: 'This plan is shown as it was saved and cannot be changed here. Nothing has been lost.',
  /**
   * "What you want" (7.12.0): the first section, the amount to spend and the stop age beside what goes in, saved by the one
   * Save. The same two facts as "What you spend" and "About you and when".
   */
  want: {
    title: 'What you want',
    lead: 'What you want to spend each month once you stop work, and when you stop. Each figure here and under “Each month” is saved in your plan as you leave its box, and the answer below follows it.',
    later: 'Your spending changes from {age}. This is the amount at the start; the later steps are on “What you spend”.',
    /** (7.12.0) A step of the spending starts at or before the stop: the box is that step's amount. */
    inForce: 'Your spending changes before you stop: this is the amount from {age}, the one in force when you stop. The other steps are on “What you spend”.',
    locked: '{monthly} a month after tax from {stopAge}. These are part of your locked plan. To change them, unlock it from “Your plan as locked”, change them here and lock it again. What you pay in can still be changed below.',
    fields: {
      'want.monthly': { label: 'To spend a month after tax, at today’s prices, in pounds' },
      'want.stopAge': { label: 'From age (when you stop work)' }
    },
    errors: {
      'want.monthly': { notANumber: 'Figures only, like 2,000.', tooLow: 'An amount of £1 or more.', tooHigh: 'An amount up to £50,000 a month, please.', notWithSpend: 'This amount does not fit the steps on “What you spend”. Change it there.' },
      'want.stopAge': { notANumber: 'A whole age, like 60.', tooLow: 'An age of 18 or more.', tooHigh: 'An age up to 85, please.', notAhead: 'An age after the one you are now.', notWithAbout: 'This age does not fit the other ages on “About you and when”. Change it there.' }
    }
  },
  sections: { payIn: 'Each month', relief: 'How tax relief works, and your salary', pot: 'What the pot could be by the stop', records: 'This month’s pot', onCourse: 'In the full view' },
  fields: {
    netMonthly:      { label: 'What you pay in a month, from your take-home pay, in pounds', help: 'What leaves your pay. The tax the government adds back is worked out below.' },
    employerMonthly: { label: 'Your employer’s part, a month, in pounds' },
    isaMonthly:      { label: 'Into ISAs and savings, a month, in pounds', help: 'From take-home pay, with no tax added back. It rises each year as your pension payments do.' },
    escalationPct:   { label: 'Raise what you pay in by, % a year', help: 'Each year’s payments this much higher than the last; blank for no rise.' },
    schemeType:      { label: 'How tax relief is given', options: { ras: 'Relief at source: the provider adds the basic-rate tax back', netpay: 'Taken from your pay before it is taxed', salsac: 'Salary sacrifice: pay given up, before tax and National Insurance' }, help: 'Tax relief is the tax the government adds back when you pay into a pension. Your payslip or your scheme’s page says which of the three it is.' },
    salary:          { label: 'Your salary, a year before tax, in pounds', help: 'So the rate of tax added back, and anything to claim from HMRC, can be worked out.' },
    potNow:          { label: 'Your pension pot today, in pounds', help: 'Blank: the pension lines under “What you hold”.' },
    'record.month':   { label: 'The month', help: 'Like 2026-10.' },
    'record.pension': { label: 'Pension pot, in pounds' },
    'record.isa':     { label: 'ISA, in pounds', help: 'Blank for no figure; 0 for an empty ISA.' },
    'record.gia':     { label: 'Other savings and investments, in pounds' }
  },
  errors: {
    netMonthly:      { notANumber: 'Figures only, like 600.', tooLow: 'An amount of £0 or more.', tooHigh: 'An amount up to £100,000 a month, please.' },
    employerMonthly: { notANumber: 'Figures only, like 450.', tooLow: 'An amount of £0 or more.', tooHigh: 'An amount up to £100,000 a month, please.' },
    isaMonthly:      { notANumber: 'Figures only, like 200.', tooLow: 'An amount of £0 or more.', tooHigh: 'An amount up to £100,000 a month, please.' },
    escalationPct:   { notANumber: 'A percent, like 1 or 2.5.', range: 'A percent from 0 to 20, please.' },
    schemeType:      { notAnOption: 'One of the three, please.' },
    salary:          { notANumber: 'Figures only, like 48,000.', tooLow: 'An amount of £0 or more.', tooHigh: 'An amount up to £10,000,000, please.' },
    potNow:          { notANumber: 'Figures only, like 120,000.', tooLow: 'An amount of £0 or more.', tooHigh: 'An amount up to £50,000,000, please.' },
    'record.month':   { notAMonth: 'A month like 2026-10, please.', required: 'Pick the month first.', beforePlan: 'That month comes before this plan carries on: it is recorded on your previous plan.' },
    'record.pension': { notANumber: 'Figures only, like 318,400.', tooLow: 'An amount of £0 or more.', tooHigh: 'An amount up to £50,000,000, please.', nothingToRecord: 'Type at least the pension pot.' },
    'record.isa':     { notANumber: 'Figures only, like 41,100.', tooLow: 'An amount of £0 or more.', tooHigh: 'An amount up to £50,000,000, please.' },
    'record.gia':     { notANumber: 'Figures only, like 5,000.', tooLow: 'An amount of £0 or more.', tooHigh: 'An amount up to £50,000,000, please.' }
  },
  /** "How tax relief works, and your salary": the planner's breakdown sentence, in lines. */
  relief: {
    lead: 'Tax relief is the tax the government adds back when you pay into a pension. What that means each month, from the figures above:',
    'relief.none': 'Nothing paid in yet: type what you pay in a month and the sum appears here.',
    'relief.month': 'Each month you pay {you}; {gross} goes into your pension, {relief} of it the tax added back.',
    'relief.monthNi': 'Each month you pay {you}; {gross} goes into your pension, {relief} of it the tax added back, and {ni} of National Insurance is saved too.',
    'relief.monthNone': 'Each month you pay {you}, and {gross} goes into your pension: no tax is added back at this salary.',
    'relief.employer': 'Your employer adds {employer}.',
    'relief.total': '{total} a month goes in, in all: each £1 in the pot costs you {pence}p.',
    'relief.claim': 'At {salary} you pay higher-rate tax on {above} of your pay. On what you pay in you can claim {claim} a year back from HMRC, through a tax return or by asking HMRC. It is not added by itself.',
    'relief.salsac': 'Salary sacrifice also saves your employer National Insurance; many employers add some or all of that — ask. From April 2029 the saving is capped at £2,000 a year of pay given up.',
    'relief.nonTaxpayer': 'Below the tax-free allowance the provider still adds 25% on payments up to £3,600 a year before the addition (£2,880 from you) — relief at source only.'
  },
  /** What the pot could be by the stop: the regulator's three rates, at today's prices. */
  pot: {
    lead: 'At today’s prices, with what you pay in rising as set. The three cases are the regulator’s own rates before charges: cautious {low}%, middle {mid}%, strong {high}% a year.',
    charges: 'After fund and platform charges of {charges}% a year, your plan’s own setting.',
    chargesNone: 'No fund or platform charges taken off: your plan has none set.',
    mix: 'Your mix: what you hold today — shares {shares}%, bonds {bonds}%, gold and trend {diversifiers}%, cash {cash}% — at its long-run return less its costs ({mix}% a year before prices). It never promises a fund’s own return.',
    mixCharge: 'The plan’s charge replaces the funds’ own ({charge}% a year).',
    /** Where the pot the table starts from comes from (services/PensionToday.js), said once. */
    potNow: {
      record: 'From your pension of {value}, recorded {month}.',
      recordUndated: 'From your pension of {value}, as you recorded it last.',
      holdings: 'From your pension of {value}, the pension lines under “What you hold”.',
      saved: 'From your pension of {value}, as saved in your plan.',
      answer: 'From your pension of {value}, as you gave it when you kept this plan.',
      plan: 'From your pension of {value}, the pension total in your plan.',
      typed: 'From your pension of {value}, as typed above. Save to keep it.',
      none: 'No pension pot is in your plan yet, so this starts from nothing. You can add it in the box for your pension pot today.'
    },
    /** The pot at the stop the plan uses (services/PotsAtStop.js), said above the regulator's table (7.12.0). */
    atStop: 'In a middling case your pension could be {value} at {age}. That is the figure your plan uses. The table below shows the regulator’s fixed rates, for comparing with your provider’s statement; they are lower.',
    columns: { age: 'Age', low: 'Cautious', mid: 'Middle', mix: 'Your mix', high: 'Strong', paidIn: 'Paid in (in the pounds of each year)', isa: 'ISA and savings' },
    isa: {
      cash: 'ISA and savings: mostly cash, at the cash rule and 2.5% price rises, with {isaMonthly} a month going in.',
      invested: 'ISA and savings: invested like your pension, at the middle rate, with {isaMonthly} a month going in.',
      funds: 'ISA and savings: at the middle rate, with {isaMonthly} a month going in. The runs grow it as the ISA funds in your list of funds to test.',
      before: 'ISA and savings: at the middle rate with nothing going in (this plan was locked before the choice of how the ISA grows was added).'
    },
    warnings: {
      'warn.mpaa': 'Your monthly records show flexible income already taken from a pension, which caps tax-relieved payments at £10,000 a year for good — this plan pays in more. The excess is taxed back.',
      'warn.allowance': 'What goes in adds up to more than £60,000 a year. Unused allowance from the last three tax years may cover it; otherwise the excess is taxed at your rate.',
      'warn.taper': 'Above £200,000 of income the yearly allowance may taper: £1 lost for every £2 over £260,000, down to £10,000.',
      'warn.access': 'The earliest age a pension can be touched rises to 57 on 6 April 2028. Stopping before that means living from ISAs and other savings until it can be.',
      'warn.largePot': 'Above £1,073,100 the £268,275 limit on tax-free cash means less than a quarter comes out tax-free — worth planning early.'
    }
  },
  /** "Record this month's pot": one line a month, read against the locked plan's path on "Where you are". */
  records: {
    lead: 'One line a month: your pension pot, your ISA and other savings, as they stand. “Where you are” reads the latest against the plan’s path once the plan is locked. Nothing recorded is ever deleted here.',
    button: 'Record it',
    none: 'Nothing recorded yet.',
    columns: { month: 'Month', pension: 'Pension pot', isa: 'ISA', gia: 'Other', total: 'In all' },
    more: '{n} record{s} in all; the last 36 shown.'
  },
  onCourse: {
    lead: 'The full view says this same answer, under “Am I on course?”, with the fixed-rate table beside it.',
    button: 'The same answer in the full view'
  },
  /**
   * "Are you paying in enough?" (research/saving-enough-and-check-in.md 2, 3, 4.4; release step R2): question B's own answer
   * on the plan's figures, drawn with B's own sentences. These are the words around it: what the aim is in the plan's own
   * unit, what is read and how, and what to do when there is nothing to test against.
   */
  verdict: {
    title: 'Are you paying in enough?',
    /** Shown while what is typed differs from what is saved (7.12.0): the answer is worked out for the boxes as typed. */
    ifSaved: 'The answer below is for what you have typed. It is saved in your plan as you leave the box.',
    lead: 'The same test as “Am I saving enough?”, on your plan’s own figures: your pot, what you pay in now, your State Pension and what your plan says you would want to spend from when you stop.',
    aim: 'Your plan’s {aimYearly} a year before tax is {aimMonthly} a month after tax, at today’s prices: the figure tested here.',
    working: 'Working out whether what you pay in is enough…',
    failed: 'Sorry, this could not be worked out. Nothing was changed.',
    noWorker: 'This browser cannot work this out here.',
    retry: 'Try again',
    noAim: 'Your plan has no income set for when you stop, so there is nothing yet to test what you pay in against. Say what you would want to spend first.',
    noAimLink: 'What you spend',
    invalid: 'Some of your plan’s figures are outside what this test can take — an age, a pot or what goes in — so it cannot say yet. Check “About you and when” and the boxes below.',
    aboutLink: 'About you and when',
    share: 'What you pay in is read as a share of your pay — {ownPct}% from you and {employerPct}% from your employer — going up with your pay; we assume pay rises with prices.',
    rise: {
      less: 'This reads what you pay in as going up with prices. Your plan raises it by {pct}% a year, so what the pot could be by the stop, below, assumes less goes in later.',
      more: 'This reads what you pay in as going up with prices. Your plan raises it by {pct}% a year, so what the pot could be by the stop, below, assumes more goes in later.',
      none: 'This reads what you pay in as going up with prices. Your plan keeps it the same in pounds each year, so what the pot could be by the stop, below, assumes less goes in later.'
    },
    draws: 'This check lets each future save its own pot, then draw. “Does it last?” says the same chance, and what is left and when, drawing the way your plan draws.',
    drawsLink: 'Does it last?',
    couple: 'This reads your plan on its own; reading two linked plans together comes later.',
    /** A plan that draws by a way other than pots and valves or buckets (7.10.0): what the verdict is worked out on. */
    way: 'Worked out as if the money were drawn from pots; your plan draws by {way}.'
  },
  buttons: { save: 'Save', cancel: 'Cancel', undo: 'Undo', close: 'Close', back: 'Back to your plan' },
  toast: {
    ...Object.fromEntries(Object.entries(PAY_IN_NOW).map(([k, v]) => ['saving.' + k, 'Saved. ' + v])),
    ...Object.fromEntries(Object.entries(PAY_IN_NOW).map(([k, v]) => ['savingWant.' + k, 'Saved. {wantMonthly} a month from {wantAge}. ' + v])),
    recorded: 'Recorded {month}: {total} in all.',
    savedShort: 'Saved.', undone: 'Put back as it was.', unchanged: 'Nothing has changed.'
  },
  problems: {
    locked: 'This plan is locked, so nothing was changed.',
    notHere: 'That plan is not in this account. Nothing was changed.',
    usedUp: 'Your free time without an account is used up. Sign in to keep and change this plan.',
    nobody: 'Sign in to change this plan. Nothing was changed.',
    storage: 'This browser would not keep the change. Nothing was changed.',
    failed: 'Sorry, the change could not be saved. Nothing was changed.',
    problems: 'Have a look at the boxes marked above.',
    readonly: 'This plan is shown as it was saved and cannot be changed here. Nothing has been lost.'
  },
  saving: 'Saving…'
};
