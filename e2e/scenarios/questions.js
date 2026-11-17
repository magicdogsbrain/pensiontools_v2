/**
 * The catalogue: what people ask (brief 2.6), merged from ten walks and the research notes. One entry per question:
 *
 *   id       S1 … T6
 *   stage    saving · moving · living · couples · changing · later · trust
 *   text     the question, in the person's words
 *   asked    the same, as the person-sentence of a failure says it ("Jo, 33, asked <asked> and …")
 *   owner    the area that owns the screens that answer it: SAVER, FACTS, HOLD, MONTH, COUPLE, VIEWS, MEASURE, WORDS
 *   screen   the screens that should answer it
 *   sc       the scenarios that gate it (s01 …); [] when not gated, with `why`
 *   was      how it stood on 7.11.1 by the walks: Y answered, P partly, N not (the report replaces this with each run's)
 *
 * SCENARIOS lists every scenario of the brief; `built` is true once its spec file exists (tests/scenarioRules.test.js
 * holds the two together).
 */
export const QUESTIONS = Object.freeze([
  // Saving
  { id: 'S1', stage: 'saving', text: 'For £X a month at age Y, what do I pay in, in % and in pounds from my pay?', asked: 'what to pay in for the income wanted, in % and in pounds from pay', owner: 'SAVER', screen: 'Saving answer; plan home; What you pay in; full view Accumulation', sc: ['s01'], was: 'P' },
  { id: 'S2', stage: 'saving', text: 'What do I get if I carry on as I am?', asked: 'what carrying on as now gives', owner: 'SAVER', screen: 'Saving answer; plan home', sc: ['s01'], was: 'Y' },
  { id: 'S3', stage: 'saving', text: 'What I pay, my employer\'s part, and the tax relief: is each counted once?', asked: 'whether the pay-in, the employer\'s part and the tax relief are each counted once', owner: 'SAVER', screen: 'Every page that states a pay-in', sc: ['s03'], was: 'P' },
  { id: 'S4', stage: 'saving', text: 'What would £N more a month from my pay do?', asked: 'what more a month from pay would do', owner: 'SAVER', screen: 'Saving answer "Try a change"', sc: ['s03'], was: 'P' },
  { id: 'S5', stage: 'saving', text: 'What would a lump of £N now do?', asked: 'what a lump now would do', owner: 'SAVER', screen: 'Saving answer', sc: ['s25'], was: 'N' },
  { id: 'S6', stage: 'saving', text: 'Does my State Pension count, how much, from when, and how do I check mine?', asked: 'whether the State Pension counts, how much, from when, and how to check it', owner: 'FACTS', screen: 'Answer "What we assumed"; Money that comes in anyway', sc: ['s01', 's13'], was: 'P' },
  { id: 'S7', stage: 'saving', text: 'A year on: am I still on course?', asked: 'a year on, whether the plan is still on course', owner: 'SAVER', screen: 'Check-in; plan home', sc: ['s04'], was: 'P' },
  { id: 'S8', stage: 'saving', text: 'I had a pay rise. What changes?', asked: 'what a pay rise changes', owner: 'SAVER', screen: 'Check-in; What you pay in', sc: ['s04'], was: 'N' },
  { id: 'S9', stage: 'saving', text: 'What is my pension invested in, and does it matter ("the default fund")?', asked: 'what the pension is invested in', owner: 'HOLD', screen: 'The mix (saver\'s words)', sc: [], why: 'needs a design from its owner before there is a reading to pin', was: 'N' },
  { id: 'S10', stage: 'saving', text: 'When do I start moving to safer things, and into what?', asked: 'when the move to safer things starts, and into what', owner: 'HOLD', screen: 'Plan home; Moving page', sc: ['s19'], was: 'P' },
  { id: 'S11', stage: 'saving', text: 'Is it too late? At what age and amount could I stop?', asked: 'whether it is too late, and at what age and amount work could stop', owner: 'SAVER', screen: '"When can I stop?" answer', sc: ['s13'], was: 'P' },
  { id: 'S12', stage: 'saving', text: 'What are my ways forward, in pounds I could really find?', asked: 'the ways forward, in pounds that could really be found', owner: 'SAVER', screen: '"Ways to make it fit"', sc: ['s13'], was: 'P' },
  { id: 'S13', stage: 'saving', text: 'What is the least I could live on (published levels, and what they leave out)?', asked: 'the least that could be lived on', owner: 'WORDS', screen: '"What would you spend?"', sc: ['s13'], was: 'P' },
  { id: 'S14', stage: 'saving', text: 'I am paying in after having taken taxable money. What is my limit?', asked: 'the limit on paying in after taking taxable money', owner: 'SAVER', screen: 'Saving page (the £10,000 limit)', sc: [], why: 'needs a design from its owner before there is a reading to pin', was: 'P' },
  // Moving
  { id: 'M1', stage: 'moving', text: 'What does my pot pay a month from 60, and does it last?', asked: 'what the pot pays a month, and whether it lasts', owner: 'MEASURE', screen: 'Simple "What is my pot worth a month?"; full view Will it last?', sc: ['s15'], was: 'P' },
  { id: 'M2', stage: 'moving', text: 'What happens between stopping and my State Pension?', asked: 'what happens between stopping and the State Pension', owner: 'FACTS', screen: 'Answer "What it is made of"', sc: ['s15'], was: 'P' },
  { id: 'M3', stage: 'moving', text: 'What are the ways to draw it, in plain words?', asked: 'the ways to draw it, in plain words', owner: 'WORDS', screen: 'How the money is taken; Strategies', sc: [], why: 'needs a design from its owner before there is a reading to pin', was: 'P' },
  { id: 'M4', stage: 'moving', text: 'Do I have to tell it my funds? (totals only)', asked: 'whether totals are enough without the funds', owner: 'HOLD', screen: 'Every page after a lock', sc: ['s09'], was: 'P' },
  { id: 'M5', stage: 'moving', text: 'What do I do between now and stopping?', asked: 'what to do between now and stopping', owner: 'SAVER', screen: 'What you pay in; Accumulation', sc: ['s09'], was: 'N' },
  { id: 'M6', stage: 'moving', text: 'Which stage am I in?', asked: 'which stage the plan is in', owner: 'FACTS', screen: 'Home; plan chip', sc: ['s06', 's09'], was: 'N' },
  { id: 'M7', stage: 'moving', text: 'Is the plan I am locking affordable, and is its document true?', asked: 'whether the plan being locked is affordable and its document true', owner: 'FACTS', screen: 'Lock dialog; plan document', sc: ['s14'], was: 'N' },
  { id: 'M8', stage: 'moving', text: 'What do I still need to buy, and what would I sell to pay for it?', asked: 'what is still to buy, and what would be sold to pay for it', owner: 'HOLD', screen: 'Moving page; Transition', sc: ['s11'], was: 'P' },
  { id: 'M9', stage: 'moving', text: 'Why sell more than I buy? Where does the rest go?', asked: 'why more would be sold than bought, and where the rest goes', owner: 'HOLD', screen: 'Moving page', sc: ['s11'], was: 'N' },
  { id: 'M10', stage: 'moving', text: 'Can I say "this is how I hold it, that is my plan now"?', asked: 'whether what is held can be made the plan', owner: 'HOLD', screen: 'Moving page', sc: ['s11'], was: 'N' },
  { id: 'M11', stage: 'moving', text: 'I want to keep part of a fund. How, and what does it do to my risk?', asked: 'how to keep part of a fund, and what it does to the risk', owner: 'HOLD', screen: 'What you hold', sc: ['s22'], was: 'P' },
  { id: 'M12', stage: 'moving', text: 'Am I on track to finish before I stop?', asked: 'whether the move finishes before work stops', owner: 'HOLD', screen: 'Moving page; home', sc: ['s11'], was: 'P' },
  { id: 'M13', stage: 'moving', text: 'What happens to a gilt I hold that matures in a cash year?', asked: 'what happens to a gilt that matures in a cash year', owner: 'HOLD', screen: 'Moving page; Keep this', sc: ['s21'], was: 'P' },
  // Living on it
  { id: 'L1', stage: 'living', text: 'Will it last, and could I spend more?', asked: 'whether it lasts and whether more could be spent', owner: 'MEASURE', screen: '"Will it last?" answer; Does it last?', sc: ['s18'], was: 'Y' },
  { id: 'L2', stage: 'living', text: 'What do I take this month, and from which pot?', asked: 'what to take this month, and from which pot', owner: 'MONTH', screen: 'Month by month; Monthly Entry', sc: ['s08'], was: 'P' },
  { id: 'L3', stage: 'living', text: 'Why does less reach me than the plan\'s monthly figure?', asked: 'why less reaches the bank than the plan\'s monthly figure', owner: 'MONTH', screen: 'Month by month; tax-year set-up', sc: ['s07'], was: 'N' },
  { id: 'L4', stage: 'living', text: 'I recorded my first months. Am I on course?', asked: 'whether the first months recorded are on course', owner: 'MONTH', screen: 'Home "Where you are"; History', sc: ['s07'], was: 'N' },
  { id: 'L5', stage: 'living', text: 'I stopped part-way through a tax year. Which months count?', asked: 'which months count after stopping part-way through a tax year', owner: 'FACTS', screen: 'Home; Month by month', sc: ['s07'], was: 'N' },
  { id: 'L6', stage: 'living', text: 'What if markets fall 30% in year one?', asked: 'what a 30% fall in the first year does', owner: 'MEASURE', screen: 'Try the bad years', sc: ['s18'], was: 'Y' },
  { id: 'L7', stage: 'living', text: 'Am I drawing too little?', asked: 'whether too little is being drawn', owner: 'MEASURE', screen: 'Does it last?', sc: [], why: 'needs a design from its owner before there is a reading to pin', was: 'P' },
  { id: 'L8', stage: 'living', text: 'I want £N more a month on my locked plan. What happens, and how do I make it so?', asked: 'what more a month on a locked plan does, and how to make it the plan', owner: 'FACTS', screen: 'Try a change', sc: ['s18'], was: 'P' },
  { id: 'L9', stage: 'living', text: 'Is my plan still fine? Do I hold what it needs?', asked: 'whether the plan is still fine and what is held is what it needs', owner: 'HOLD', screen: 'Plan home; Your plan\'s mix', sc: ['s10'], was: 'P' },
  { id: 'L10', stage: 'living', text: 'How does what I hold differ from the plan, and does that add risk?', asked: 'how what is held differs from the plan, and whether that adds risk', owner: 'HOLD', screen: 'Your plan\'s mix', sc: ['s10'], was: 'P' },
  { id: 'L11', stage: 'living', text: 'Are my next few years paid for?', asked: 'whether the next few years are paid for', owner: 'HOLD', screen: 'Your plan\'s mix; What you hold', sc: ['s10'], was: 'N' },
  { id: 'L12', stage: 'living', text: 'Why are my own choices shown as mistakes?', asked: 'why their own choices are shown as mistakes', owner: 'HOLD', screen: 'What you hold; Monthly Entry', sc: ['s10'], was: 'N' },
  { id: 'L13', stage: 'living', text: 'Does money I expect count once?', asked: 'whether money expected counts once', owner: 'HOLD', screen: 'Your plan\'s mix', sc: [], why: 'needs a design from its owner before there is a reading to pin', was: 'P' },
  { id: 'L14', stage: 'living', text: 'A gilt I listed has matured. What does the site say?', asked: 'what the site says of a gilt that has matured', owner: 'HOLD', screen: 'What you hold', sc: [], why: 'needs a design from its owner before there is a reading to pin', was: 'N' },
  // Couples
  { id: 'C1', stage: 'couples', text: 'Together, do we have enough, and until whose age?', asked: 'whether together there is enough, and until whose age', owner: 'COUPLE', screen: 'Your household; Household tab', sc: ['s12'], was: 'P' },
  { id: 'C2', stage: 'couples', text: 'Who draws what, to pay least tax?', asked: 'who draws what to pay least tax', owner: 'COUPLE', screen: 'Who draws what (both views)', sc: [], why: 'needs a design from its owner before there is a reading to pin', was: 'P' },
  { id: 'C3', stage: 'couples', text: 'If one of us dies first, what does the other have?', asked: 'what the other has if one of them dies first', owner: 'COUPLE', screen: 'Survivor check', sc: ['s24'], was: 'P' },
  { id: 'C4', stage: 'couples', text: 'One of us stops a year earlier. What changes for both?', asked: 'what changes for both when one stops a year earlier', owner: 'COUPLE', screen: 'About you and when → household', sc: ['s12'], was: 'P' },
  { id: 'C5', stage: 'couples', text: 'Where do I see both of us, from either plan, in either view?', asked: 'where both of them are seen, from either plan, in either view', owner: 'COUPLE', screen: 'Home tile; Household tab', sc: ['s12'], was: 'P' },
  // Changing their mind
  { id: 'X1', stage: 'changing', text: 'What if £2,500, or stop at 58, or 65?', asked: 'what another income or stop age would do', owner: 'SAVER', screen: 'Answer "Try a change"; plan', sc: ['s02'], was: 'P' },
  { id: 'X2', stage: 'changing', text: 'I changed the stop age or the income on one page. Does every page follow?', asked: 'whether every page follows a change of stop age or income', owner: 'FACTS', screen: 'Every plan page, both views', sc: ['s02', 's05'], was: 'P' },
  { id: 'X3', stage: 'changing', text: 'Does the plan\'s name follow?', asked: 'whether the plan\'s name follows a change', owner: 'FACTS', screen: 'Home; plan picker', sc: ['s02'], was: 'N' },
  { id: 'X4', stage: 'changing', text: 'I picked one way of drawing, then another. What changed?', asked: 'what changed between two ways of drawing', owner: 'FACTS', screen: 'How the money is taken; Settings', sc: ['s14'], was: 'P' },
  { id: 'X5', stage: 'changing', text: 'I locked and regret it. Can I unlock, change, lock again, and see what was kept?', asked: 'whether a lock can be undone, changed, locked again and the history seen', owner: 'FACTS', screen: 'Your plan as locked', sc: ['s16'], was: 'Y' },
  { id: 'X6', stage: 'changing', text: 'Can I keep two versions and compare them?', asked: 'whether two versions can be kept and compared', owner: 'VIEWS', screen: 'Your plans', sc: ['s16'], was: 'P' },
  { id: 'X8', stage: 'changing', text: 'If I type my figures into the full view, are they kept, and does every answer use them?', asked: 'whether figures typed into the full view are kept and used', owner: 'VIEWS', screen: 'Full view Stress tester → Settings; Accumulation; Will it last?; Household', sc: ['s12'], was: 'N' },
  { id: 'X7', stage: 'changing', text: 'Can I close a plan and carry on with a new one?', asked: 'whether a plan can be closed and a new one carried on', owner: 'VIEWS', screen: 'Your plans', sc: ['s23'], was: 'P' },
  // Coming back later
  { id: 'R1', stage: 'later', text: 'Can I keep this, sign in, come back, and find it?', asked: 'whether a kept answer is found again after signing in', owner: 'VIEWS', screen: 'Keep → account → plan home', sc: ['s02'], was: 'P' },
  { id: 'R2', stage: 'later', text: 'Am I where I left off, in the view I chose, on the plan I had open?', asked: 'whether the site opens where it was left, in the view chosen', owner: 'VIEWS', screen: 'Landing, both views', sc: ['s16'], was: 'P' },
  { id: 'R3', stage: 'later', text: 'Does the home tell me the answer in pounds without opening anything?', asked: 'whether the home gives the answer in pounds without a press', owner: 'SAVER', screen: 'Plan home', sc: ['s02', 's04'], was: 'N' },
  { id: 'R4', stage: 'later', text: 'What is due next, the same in both views, true for today?', asked: 'what is due next, the same in both views', owner: 'FACTS', screen: 'Home "To do"; full view "Next:"', sc: ['s06'], was: 'P' },
  { id: 'R5', stage: 'later', text: 'Does the full view know what I typed in the simple view?', asked: 'whether the full view knows what was typed in the simple view', owner: 'VIEWS', screen: 'Full view first screen', sc: ['s07', 's16'], was: 'N' },
  // Trust
  { id: 'T1', stage: 'trust', text: 'Does every page give the same value for the same fact?', asked: 'whether every page gives the same value for the same fact', owner: 'FACTS', screen: 'The register', sc: ['s06'], was: 'P' },
  { id: 'T2', stage: 'trust', text: 'What is my pot today?', asked: 'what the pot is today', owner: 'FACTS', screen: 'Home; Pots; Hold; Review', sc: ['s06'], was: 'P' },
  { id: 'T3', stage: 'trust', text: 'Can I try everything without an account, and keep nothing?', asked: 'whether everything can be tried without an account', owner: 'VIEWS', screen: 'Front page', sc: ['s17'], was: 'Y' },
  { id: 'T4', stage: 'trust', text: 'Does looking ever change my plan?', asked: 'whether looking ever changes the plan', owner: 'VIEWS', screen: 'Every page', sc: ['s17'], was: 'Y' },
  { id: 'T5', stage: 'trust', text: 'Can I download my data and delete my account, from a bookmark?', asked: 'whether the account page opens from a bookmark', owner: 'VIEWS', screen: 'Your account', sc: ['s16'], was: 'P' },
  { id: 'T6', stage: 'trust', text: 'Is it telling me what I should do?', asked: 'whether the site tells them what they should do', owner: 'WORDS', screen: 'Every page', sc: [], every: true, why: 'checked on every page every scenario opens (the never-list)', was: 'P' },
  // The harness's own question (s00): never in the report's catalogue
  { id: 'H0', stage: 'harness', text: 'Does the harness say plainly what went wrong?', asked: 'whether the harness says plainly what went wrong', owner: 'TESTS', screen: 'none', sc: ['s00'], was: 'Y', harness: true }
]);

/** Every scenario of the brief (3.3). `built`: its spec file exists. Part 2 (s13 to s25) is a later sitting. */
export const SCENARIOS = Object.freeze({
  s00: { file: 's00-harness.spec.js', who: 'the harness', built: true, part: 1 },
  s01: { file: 's01-jo-pay-in.spec.js', who: 'Jo, 33', built: true, part: 1 },
  s02: { file: 's02-jo-keeps-and-changes.spec.js', who: 'Jo, 33', built: true, part: 1 },
  s03: { file: 's03-sam-pay-in-units.spec.js', who: 'Sam, 45', built: true, part: 1 },
  s04: { file: 's04-sam-a-year-later.spec.js', who: 'Sam, 45', built: true, part: 1 },
  s05: { file: 's05-sam-stops-later.spec.js', who: 'Sam, 45', built: true, part: 1 },
  s06: { file: 's06-checker-sweep.spec.js', who: 'the checker', built: true, part: 1, seeded: true },
  s07: { file: 's07-kim-first-months.spec.js', who: 'Kim, 62', built: true, part: 1 },
  s08: { file: 's08-kim-this-month.spec.js', who: 'Kim, 62', built: true, part: 1 },
  s09: { file: 's09-alex-totals-only.spec.js', who: 'Alex, 57', built: true, part: 1 },
  s10: { file: 's10-alex-gilts-for-cash-years.spec.js', who: 'Alex, 64', built: true, part: 1 },
  s11: { file: 's11-sam-moving.spec.js', who: 'Sam, 59', built: true, part: 1 },
  s12: { file: 's12-couple-stops-earlier.spec.js', who: 'Kim, 66 and Sam, 61', built: true, part: 1 },
  ...Object.fromEntries(['s13', 's14', 's15', 's16', 's17', 's18', 's19', 's20', 's21', 's22', 's23', 's24', 's25'].map((s) => [s, { file: null, who: null, built: false, part: 2 }]))
});
