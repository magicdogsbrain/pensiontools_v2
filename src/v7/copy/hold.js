/**
 * The words of "What you hold" (research/v7/holdings-and-move.md §2; road-to-7.md step 10). Data only — this file imports
 * nothing. Placeholders are written {likeThis} and filled by the screen. On screen the four types of account are
 * "Pension", "ISA", "Other account" and "Cash"; never "wrapper", "holdings ledger", "transition" or "portfolio"
 * (src/v7/copy/banned.js is the law). The record is the person's own figures, exact — never "about".
 */
export const HOLD = {
  title: 'What you hold',
  lead: 'What you actually hold today, by account. The plan is tested on its own mix; this record is separate, and nothing here is copied from the plan.',
  headline: {
    none: 'Not recorded yet.',
    main: 'Pension {pension}, ISA {isa}',
    gia: ', other account {gia}',
    cash: ', cash {cash}',
    updated: '. Updated {date}.',
    undated: '.'
  },
  recordSource: { typed: 'Typed in.', paste: 'Pasted from your platform.', imported: 'Taken over from an older list.', none: '' },
  atLock: 'Your plan was locked on {lockedOn} with {summary} recorded{date}.',
  atLockDate: ' on {date}',
  atLockNone: 'Your plan was locked on {lockedOn} with nothing recorded here.',
  locked: 'This plan is locked. This record is still yours to change: it is what is true today, not the plan. The plan’s own snapshot of it stays as locked.',
  readonly: 'This plan is shown as it was saved and cannot be changed here. Nothing has been lost.',
  sections: { lines: 'Line by line', add: 'Add a line', paste: 'Paste a table', mix: 'What you hold, as a mix' },
  wrappers: { SIPP: 'Pension', ISA: 'ISA', GIA: 'Other account', CASH: 'Cash' },
  wrapperOf: { SIPP: 'pension', ISA: 'ISA', GIA: 'other account', CASH: 'cash' },
  groupTotal: '{total} in all',
  none: 'Nothing on the record yet. Add a line, or paste the table from your platform.',
  line: {
    code: 'Code {code}',
    sedol: 'SEDOL {sedol}',
    asOf: 'as of {date}',
    counted: 'Counted as',
    fields: {
      units:        { label: 'Units' },
      value:        { label: 'Value, in pounds' },
      contribution: { label: 'New money a month, in pounds' },
      ocf:          { label: 'Yearly charge, %' }
    },
    saveNote: 'A changed box saves when you leave it.',
    remove: 'Remove',
    removeConfirm: 'Remove ‘{name}’ from your {wrapper}? Nothing is sold; this only changes the record.',
    removeYes: 'Remove it',
    removeNo: 'Keep it'
  },
  counted: { shares: 'shares', bonds: 'bonds', cash: 'cash', diversifiers: 'gold and trend', gilt: 'a gilt ({code})', giltNoCode: 'a gilt', bankCash: 'cash in the bank', fund: 'a fund', ask: 'What is this?' },
  whats: { shares: 'Shares', bonds: 'Bonds', cash: 'Cash', diversifiers: 'Gold and trend', unknown: 'Don’t know' },
  errors: {
    notANumber: 'Figures only, like 50,000.',
    tooLow: '0 or more, please.',
    tooHigh: 'A smaller figure, please.',
    required: 'This box is needed.',
    notAnOption: 'One of the choices, please.'
  },
  add: {
    lead: 'A fund by code or name from our own list, a gilt by its code, SEDOL or year, or “cash” as an amount — and the account it is held in. A filled line saves at once.',
    fields: {
      wrapper: { label: 'Held in', options: { SIPP: 'Pension', ISA: 'ISA', GIA: 'Other account', CASH: 'Cash' } },
      text:    { label: 'Code, name, gilt or “cash”' },
      value:   { label: 'Value, in pounds' },
      units:   { label: 'Units (the face value, for a gilt)' }
    },
    match: 'Add {ticker} — {name}',
    matchGilt: 'Add the gilt {ticker} — {name}',
    matchCash: 'Add cash',
    asTyped: 'Add ‘{text}’ as typed',
    asTypedNote: 'A line added as typed is on the record and in the total; say what it is counted as and it counts in the mix.',
    none: 'Nothing in our list matches. Add it as typed and say what it is counted as.'
  },
  paste: {
    open: 'Paste a table from your platform',
    close: 'Close the paste',
    lead: 'Open the page on your platform that lists what you own, select the table, copy, and paste it here. Any layout works: the page looks for a name, units, a value and a code. Nothing you paste leaves this page.',
    wrapper: 'These lines are held in',
    label: 'The pasted table',
    whatIsThis: 'What is this?',
    readAs: 'Read as {name}.',
    answered: 'Counted as your answer.',
    unknown: 'Marked “don’t know”: on the record, in the total, not in the mix until you say what it is.',
    unrecognised: 'Not recognised: say what it is.',
    columns: { pasted: 'Pasted', value: 'Value', what: 'What is this?' },
    summary: '{read} line{s} read, {total} in all.',
    summaryRecognised: '{recognised} recognised ({recognisedTotal}).',
    summaryUnrecognised: '{unrecognised} not recognised ({unrecognisedTotal}): say what each is under “What is this?” and they count.',
    summaryUnknown: '{unknown} marked “don’t know” ({unknownTotal}): on the record, in the total, not in the mix until you say what they are.',
    leftOutTitle: 'Left out, and why',
    leftOut: 'Line {line} “{text}”: {why}.',
    whys: { total: 'a total line, not something you hold', cashHeading: 'a cash heading with no value', noName: 'no name or code on the line', noValue: 'no value on the line', other: 'the page could not read it' },
    merge: 'Adding these lines updates {updated} you already have and adds {added}.',
    unseenTitle: 'Not in what you pasted — sold?',
    unseenLead: 'These lines in your {wrapper} were not in the paste. Nothing is removed by itself: remove any you have sold.',
    add: 'Add these lines to your {wrapper}',
    clear: 'Clear the paste'
  },
  mix: {
    line: 'Shares {shares}%, bonds {bonds}%, gold and trend {diversifiers}%, cash {cash}% — on {total} across your accounts.',
    charge: 'Yearly charge, weighted: {charge}%.',
    notCounted: 'Not counted in the mix: {list}.',
    none: 'Nothing with a value yet.',
    newMoney: 'New money goes: {parts} — {monthly} a month in all.',
    newMoneyPart: '{amount} a month to {word}',
    note: 'The plan is tested on its own mix, not on this one.'
  },
  toast: {
    added: 'Saved. ‘{name}’ added to your {wrapper}.',
    edited: 'Saved. ‘{name}’ changed.',
    removed: 'Saved. ‘{name}’ removed from your {wrapper}.',
    pasted: 'Saved. {updated} line{s} updated, {added} added to your {wrapper}.',
    undone: 'Put back as it was.',
    unchanged: 'Nothing to save.',
    savedShort: 'Saved.'
  },
  problems: {
    locked: 'This plan is locked, so this could not be written.',
    notHere: 'That plan is not in this {store}. Nothing was written.',
    usedUp: 'The free time without an account is used up. Nothing was written.',
    nobody: 'Nobody is signed in and this plan is not in this window. Nothing was written.',
    storage: 'This browser would not keep the change. Nothing was written.',
    failed: 'The change could not be written. Nothing has changed.',
    problems: 'Something typed here could not be read: check the boxes.',
    readonly: 'This plan is shown as it was saved and cannot be changed here.',
    store: { account: 'account', 'window': 'window' }
  },
  buttons: { undo: 'Undo', close: 'Close', back: 'Back to your plan', move: 'Moving to your plan’s mix' },
  saving: 'Saving…'
};
