/**
 * The answer contract (V7 build brief 4.3) — JSDoc types only. Nothing runs here.
 *
 * @typedef {object} Env
 * @property {string} today                 'YYYY-MM-DD'. Required; never defaulted.
 * @property {number} futures               Required. The runner passes 100 then 1000; tests pass 40.
 * @property {number} [seed]                Default 0.
 * @property {boolean} [trace]              true adds `trace` to the result.
 * @property {(done: number, total: number) => void} [onProgress]
 * @property {(i: number, years: number) => *} [futureReturns]   Tests only: replaces the futures.
 * @property {'chart' | 'all' | 'answer' | 'grid'} [detail]      A: 'chart' (default) | 'all'; B: 'answer' (default) | 'grid' (step 4 brief 4.7, 4.8).
 * @property {number[]} [ages]              Tests only (A): exactly these stop ages.
 * @property {{ equity: number, bond: number, cash: number }} [mix]         Tests only: an exact drawing mix.
 * @property {{ equity: number, bond: number, cash: number }} [savingMix]   Tests only: an exact saving mix.
 * @property {number} [savingsGrowth]       Tests only: the drawing years' ISA rate (config.isaReturn); default the engine's 3%.
 * @property {'reference'} [solver]         Tests only: the reference band solver.
 *
 * @typedef {string | { key: string, kind: 'money' | 'age' | 'pot' } | { fixed: string }} Part
 *   `key` is a dotted path into the result ('monthly.careful', 'phases.1.shown.fromPots', 'inputs.you.pot').
 *   `kind: 'pot'` is formatted to the nearest £1,000 (format.pot); 'money' to the pound; 'age' whole years.
 *   `fixed` is a count or a fixed figure the answer itself wrote ('9', '10', '2026/27').
 *
 * @typedef {object} Sentence
 * @property {string} id                    e.g. 'c.head'
 * @property {string} text                  What a person reads. text === the parts joined, each key formatted by format.js.
 * @property {Part[]} parts
 *
 * @typedef {object} Assumed
 * @property {string} id                    e.g. 'state-pension-full'
 * @property {string|null} field            The field that changes it. Always set when source is 'default'.
 * @property {'default' | 'entered' | 'rule'} source
 * @property {number|string|null} value
 * @property {string} text
 * @property {Part[]} parts
 *
 * @typedef {object} Warning
 * @property {string} id
 * @property {'note' | 'important'} severity
 * @property {string} text
 * @property {Part[]} parts
 *
 * @typedef {object} PersonPhase
 * @property {'you' | 'partner'} who
 * @property {number} statePension
 * @property {number} finalSalary
 * @property {number} fromPension
 * @property {number} fromSavings
 * @property {number} tax
 * @property {number} takeHome
 * @property {boolean} higherRate        Some of what this person draws is taxed at 40% (the higher-rate warning).
 * @property {boolean} locked            Their pension is closed in this phase: they are under the earliest pension age (nothing drawn from it).
 *
 * @typedef {object} Phase                  For the careful amount; £ a month, today's prices.
 * @property {number} fromAge               Ages of `whose`.
 * @property {number} toAge                 Equal to the next phase's fromAge; the last one's is endAge.
 * @property {{ you: { from: number, to: number }, partner?: { from: number, to: number } }} ages
 * @property {number} takeHome
 * @property {number} fromPension
 * @property {number} fromSavings
 * @property {number} fromPots              fromPension + fromSavings
 * @property {number} statePension          Before tax.
 * @property {number} finalSalary           Before tax.
 * @property {number} tax                   On all of it.
 * @property {PersonPhase[]} byPerson
 * @property {boolean} beforeStatePension
 * @property {number} [fromWork]             A and B (step 4, conflict 33): what part-time work adds to take-home in this phase, after tax, £ a month.
 * @property {number} [work]                 A and B: the part-time earnings themselves, before tax, £ a month (phases add up with this one).
 * @property {boolean} [pensionOpen]         A and B: false while anyone's pension is closed in this phase (a closed pension pays nothing).
 *   byPerson entries carry their own `fromWork` and `pensionOpen` (and `locked`) on A and B; neutral (0 / true) where nothing applies.
 * @property {{ takeHome: number, fromPots: number, statePension: number, finalSalary: number, fromWork?: number }} shown
 *   Whole pounds for display, which add up exactly: takeHome = fromPots + statePension + finalSalary (+ fromWork on A and B).
 *
 * @typedef {{ careful: number, middling: number, good: number }} Three
 *
 * ---- The saving years (step 4 brief 4.7, 4.8) ------------------------------------------------------------------
 *
 * @typedef {object} SavingOutcome            One per person, for the shown row (A) or the stop age (B).
 * @property {'you' | 'partner'} who
 * @property {number} stopAge
 * @property {number} yearsSaving             S
 * @property {{ pension: number, savings: number }} potToday
 * @property {{ total: number, own: number|null, employer: number|null, savings: number }} payIn   £ a month, today's prices, as given.
 * @property {{ pension: Three, savings: Three, total: Three }} potAtStop                           At the stop, today's prices, whole £.
 * @property {{ total: number }} paidIn       Over the saving years, today's prices.
 * @property {{ saving: string, drawing: string, slideYears: number }} mix                          slideYears 10, or 0 when the levels agree.
 * @property {number} chargeAYear             0.005 by default.
 *
 * @typedef {object} SaveRow                  One month of the saving trace (env.trace only).
 * @property {'you' | 'partner'} who
 * @property {number} m                       Month from today, 0-based.
 * @property {number} age
 * @property {number} potStart
 * @property {{ total: number, savings: number }} paidIn   At the start of the month, before growth.
 * @property {number} growth
 * @property {number} charge
 * @property {number} potEnd                  = potStart + paidIn.total + growth − charge, to 1p.
 * @property {number} savingsStart
 * @property {number} savingsIn
 * @property {number} savingsEnd
 * @property {number} priceIndex
 *
 * @typedef {object} AgeRow                   One stop age of question A.
 * @property {number} age                     The first person's ("your") age at the stop, as agesToShow and stop.age; run-out ages are the younger person's, as C.
 * @property {{ you: number, partner?: number }} ages
 * @property {string} stopYear                'YYYY'
 * @property {'final'} status
 * @property {'yes' | 'close' | 'no'} verdict   At `spend`: yes when fails ≤ floor(n/10), close ≤ floor(n/4), no otherwise.
 * @property {number} lasted                  Share of lives in which `spend` lasted to the end age, 0–1.
 * @property {{ words: string, only: boolean, count: number|null }} outOfTen
 * @property {number} runOutAge               In a bad case; = endAge when it lasted.
 * @property {Three} monthly                  C's band at this stop age: £ a month, after tax, today's prices, whole £10.
 * @property {Three} yearly
 * @property {Three} lastedAt
 * @property {Three} runOutAgeAt
 * @property {number} spare                   max(0, monthly.careful − spend.perMonth)
 * @property {Three & { byPerson: { who: string, pension: number, savings: number }[] }} potAtStop   Household pension + savings, today's prices, whole £; byPerson at the middling position.
 * @property {{ total: number, byPerson: { who: string, amount: number }[] }} paidIn                Over the saving years, today's prices.
 * @property {number} yearsSaving             S
 * @property {number} gapYears                Years from the stop until the first pension opens (0 = none).
 * @property {Phase[] | null} phases          The shown row only, at `spend`.
 * @property {null | { toAge: number, extraMonthly: number, lastedFrom: number, lastedTo: number, runOutFrom: number, runOutTo: number, potExtra: number, sameish: boolean }} oneMoreYear
 *   The difference to the next age's row when that age is in ages[]; sameish when |extraMonthly| ≤ 20.
 *
 * @typedef {object} AnswerA                  Plain data; JSON.stringify-safe; nothing undefined; no per-life arrays outside `trace`.
 * @property {'ok' | 'invalid' | 'guaranteed-only' | 'none'} status
 * @property {{ field: string, messageId: string }[]} [problems]   Only when 'invalid'; then nothing below is present.
 * @property {object} [inputs]                As used, defaults filled in.
 * @property {'you' | 'partner'} [whose]
 * @property {{ perMonth: number, perYear: number, kind: 'amount' | 'level', level: null | 'minimum' | 'moderate' | 'comfortable' }} [spend]
 * @property {{ kind: 'age' | 'ages', age: number }} [stop]      age = shown.age
 * @property {{ kind: 'named' | 'earliest' | 'noneWorked' | 'nothing', age: number, verdict: 'yes' | 'close' | 'no', lasted: number,
 *              outOfTen: { words: string, only: boolean, count: number|null }, runOutAge: number }} [headline]
 * @property {AgeRow} [shown]                 Deep-equals the ages[] entry for stop.age.
 * @property {AgeRow[]} [ages]                In age order, no repeats (agesToShow).
 * @property {{ yes: number|null, close: number|null }} [earliest]   "Show me ages": from every whole age from today's to 75.
 *   An age named: the first yes among the rows — and when the age named does not last and no row before it does, every later
 *   whole age to 75 is tried in turn and the first that lasts is a row (J18: B's stop-later, A's own "show me ages").
 *   `close` is the first row that is not a "no".
 * @property {{ you: number, partner?: number }} [pensionOpens]   The age each person can first touch a pension.
 * @property {number} [gapYears]
 * @property {null | { amount: number, untilAge: number }} [savingsNeeded]   The closed periods' savings draw, today's prices (from the phases).
 * @property {null | { yearly: number, years: number, fromAge: number, toAge: number, lastedWith: number, lastedWithout: number, runOutWith: number, runOutWithout: number,
 *            without: { verdict: string, lasted: number, runOutAge: number, monthly: { careful: number } }, oneMore: { years: number, lasted: number, runOutAge: number } }} [partTime]
 * @property {SavingOutcome[]} [saving]       Per person, for the shown row.
 * @property {{ monthlyAfterTax: number }} [guaranteed]
 * @property {Assumed[]} [assumed]
 * @property {Warning[]} [warnings]
 * @property {{ head: Sentence, sub: Sentence, line: Sentence, bad: Sentence, after?: Sentence, range: Sentence, pot: Sentence, pays: Sentence[],
 *              savingsNeeded?: Sentence, chart: Sentence[], oneMore?: Sentence, oneMoreMoves?: Sentence, partTime?: Sentence, partTimeOneMore?: Sentence,
 *              change?: Sentence, none?: Sentence, nothing?: Sentence, late?: Sentence }} [sentences]
 * @property {{ today: string, futures: number, seed: number, failuresAllowed: number, closeAllowed: number, historyEnd: string, engineVersion: string,
 *              endAge: number, detail: 'chart' | 'all', lifeYears: number, bondDraws: 'life', cashRule: 'previous-year', grid: 'yearly',
 *              strategyId: 'pots-and-valves', cutsSwitchedOff: true, split: { who: string, share: number }[] }} [basis]
 * @property {{ money: 'todays-prices', tax: 'after-tax', period: 'month', who: 'household' }} [units]
 * @property {{ saving: { atCareful: { futureId: number, rows: SaveRow[] } }, drawing: object, lives: { id: number, potAtStop: number, runOutMonth: number|null, most: number }[] }} [trace]
 * @property {{ c: { ok: boolean, same: boolean } }} [handOver]   Step 4 brief J10. The hand-over to C at the shown age:
 *   `ok` — C takes that age (a pension may not start before it opens unless there are savings to live on meanwhile);
 *   `same` — C then shows this row's careful amount exactly (no saving risk of its own, the 0.5% charge, nothing into
 *   savings each month, no part-time work: C asks none of those).
 *   Sentences added at joining up (J11): `agesNote` (detail 'all': the ages before a pension opens, the ages left out);
 *   `oneMore` may be 'a.oneMore.less' (the next age pays less on these futures); `change` names part-time work.
 *
 * @typedef {object} AnswerB
 * @property {'ok' | 'invalid' | 'guaranteed-only' | 'out-of-reach' | 'none'} status
 * @property {{ field: string, messageId: string }[]} [problems]
 * @property {object} [inputs]
 * @property {'you' | 'partner'} [whose]
 * @property {{ perMonth: number, perYear: number, kind: 'amount' | 'level', level: null | string }} [spend]
 * @property {{ age: number, year: string }} [stop]
 * @property {{ you: number, partner?: number }} [ages]
 * @property {{ saving: number, drawing: number }} [years]
 * @property {{ you: number, partner?: number }} [pensionOpens]
 * @property {number} [gapYears]
 * @property {SavingOutcome[]} [saving]
 * @property {null | (Three & { byPerson: { who: string, pot: number }[] })} [number]   Whole £1,000, today's prices; the pension pot(s) at the stop. Headline = number.careful.
 * @property {boolean} [already]              Today's pension pot ≥ number.careful.
 * @property {{ lasted: number, outOfTen: { words: string, only: boolean, count: number|null }, fails: number }} [chance]
 *   ONE TEST (step 4 brief J9): the share of lives in which the money lasted to the end age, paying in as now until the
 *   stop and then spending the target — the whole-life count, A's verdict at the stop age. Equal to wholeLife.
 * @property {boolean} [onCourse]             chance.fails ≤ floor(n/10): A's "yes" at the stop age.
 * @property {{ now: number, own: number|null, employer: number|null, needed: number|null, extra: number, confidence: 'nineInTen' | 'threeInFour',
 *              at: { nineInTen: number|null, threeInFour: number|null }, outside: number|null, savingsNow: number }} [payIn]   £ a month, whole £10 up.
 *   at.* (J9): the least whole £10 a month into the pension (the household's, split as now) at which the WHOLE life lasts
 *   in 9 lives out of 10 (at most floor(n/4) failing for threeInFour) — with, before a pension opens, `outside` a month
 *   going into savings when that is more than now. null above the ceiling (no one's part above £10,000).
 *   outside (J9): the least whole £10 a month into savings (the household's, split evenly) at which the years before a
 *   pension opens never fail (CLOSED_YEARS_FAILS = 0), with a pension that cannot run out behind them; never below what
 *   goes in now. null when no pension is closed at the stop.
 * @property {{ now: Three, needed: Three | null }} [potAtStop]   Household pension + savings, today's prices.
 * @property {number} [short]                 max(0, number.careful − potAtStop.now.careful) (a guide, as the number is)
 * @property {number} [monthlyIfShort]        J9: the careful amount from the stop paying in as now — A's careful amount at this
 *   stop age, C's from that age with that pay-in.
 * @property {{ lasted: number, outOfTen: object, runOutAge: number }} [wholeLife]   One run per life at today's pay-in then the target.
 * @property {null | { amount: number, careful: number, untilAge: number }} [outside]   The savings the closed years draw
 *   (`amount`, from the phases, today's prices) and the least whole £1,000 that carries those years in EVERY life tried
 *   with a pension that cannot run out behind them (`careful`, never less than `amount`: J1, and J9 — the closed years
 *   do not spend the 1-in-10 allowance on their own). The guide number's search holds each life's savings at no less.
 * @property {{ stopLater: null | { age: number, lasted: number }, payMore: null | { payIn: number, savingsIn: number|null, lasted: number },
 *              spendLess: null | { spend: number, lasted: number }, moreRisk: null | { level: string, payIn: number|null, lasted: number, helps: boolean },
 *              accept: { lasted: number, short: number, monthlyIfShort: number } }} [levers]
 *   J9: each, applied and B asked again, gives its own figures. stopLater — the first age above the stop, to 75, at which
 *   today's pay-in passes the one test (A's earliest age that works, above the stop); payMore — payIn the pay-in that gets
 *   there, never less than now's, savingsIn what goes into savings a month when that must rise; spendLess — the careful
 *   amount paying in as now (= monthlyIfShort); moreRisk — B again with the saving risk one level up (helps: it lowers a
 *   pay-in into the pension that has to rise). No lever carries a number (the guide number is the headline's only).
 * @property {null | { ages: { age: number, number: number|null, cells: { payIn: number, lasted: number, outOfTen: object, verdict: 'yes'|'close'|'no' }[] }[],
 *              payIns: number[], reaches: boolean }} [grid]   detail 'grid' only. J9: rows gridToShow(…, { stopLater, needed })
 *   (the stop-later age a row, the pay-in that gets there the last column); every cell the one test at that stop age and
 *   pay-in; `reaches` — some cell lasted in 9 lives out of 10 (else sentences.gridNone says so).
 * @property {{ c: { ok: boolean, same: boolean } }} [handOver]   As A's (J10), at the stop age.
 *   Sentences added (J9): 'b.head.zero' / 'b.sub.zero' / 'b.line.zero' / 'b.bad.zero' (a number of nought: the savings pay),
 *   'b.payIn.head.savings' … (only the savings fall short), lever.stopLaterNone, gridNone; 'b.line' is the guide number's.
 *   J18: 'b.guide' (the number is a guide; the bad years while saving and once stopped are rarely the same future, so the
 *   pay-in is the answer); 'b.bad' no longer weighs the bad-case pot against the number; warning 'partner-stops-with-you'.
 * @property {Phase[]} [phases]
 * @property {{ monthlyAfterTax: number }} [guaranteed]
 * @property {Assumed[]} [assumed]
 * @property {Warning[]} [warnings]
 * @property {{ head: Sentence, sub: Sentence, line: Sentence, bad: Sentence, payInHead?: Sentence, payInSub?: Sentence, payInLine?: Sentence, payInBad?: Sentence,
 *              potsNow: Sentence, potsNeeded?: Sentence, wholeLife: Sentence, outside?: Sentence, lever: Object<string, Sentence>, gridCell?: Sentence,
 *              change?: Sentence, none?: Sentence, have?: Sentence, nothing?: Sentence }} [sentences]
 * @property {object} [basis]                 A's, with detail 'answer' | 'grid', potStep: 1000, potMax: 5000000, payInCeiling: 10000 a person (20000 for a couple), laterYears: 10.
 * @property {object} [units]
 * @property {object} [trace]
 *
 * @typedef {object} AnswerC                Plain data: no functions, no Dates, nothing undefined. JSON.stringify-safe.
 * @property {'ok' | 'invalid' | 'guaranteed-only' | 'none'} status
 * @property {{ field: string, messageId: string }[]} [problems]   Only when 'invalid'; then nothing below is present.
 * @property {object} [inputs]              As used, defaults filled in.
 * @property {Three} [monthly]              £ a month, after tax, today's prices, household; whole £10.
 * @property {Three} [yearly]               monthly × 12
 * @property {Three} [lasted]               Share of futures that lasted to endAge, 0–1.
 * @property {Three} [runOutAge]            In a bad case; whole years; careful = endAge by construction.
 * @property {'you' | 'partner'} [whose]    Whose age the ages refer to (the younger; 'you' when single).
 * @property {{ monthlyAfterTax: number }} [guaranteed]
 * @property {Phase[]} [phases]
 * @property {null | { perMonth: number, lasted: number, runOutAge: number, covered: boolean }} [take]
 * @property {Assumed[]} [assumed]
 * @property {Warning[]} [warnings]
 * @property {{ head: Sentence, sub: Sentence, line: Sentence, bad: Sentence, range: Sentence, madeOf: Sentence[],
 *              take?: Sentence, small?: Sentence, none?: Sentence, nothing?: Sentence }} [sentences]
 * @property {{ today: string, futures: number, seed: number, failuresAllowed: number, historyEnd: string,
 *              engineVersion: string, startAge: number, endAge: number, accessAge: number, start: string,
 *              years: number, split: { who: string, share: number }[], strategyId: 'pots-and-valves',
 *              cutsSwitchedOff: true }} [basis]
 *   On the lives (start.kind 'age': step 4 brief J8) the basis adds yearsSaving, lifeYears, bondDraws 'life',
 *   cashRule 'previous-year', grid 'yearly', and the split is by the middling pots at the start.
 * @property {{ total: number, byPerson: { who: string, total: number }[] }} [payIn]   J8: what goes into each pension a month
 *   (own + employer, or one figure). On the lives always; from now only when "still paying in?" was answered yes (it is
 *   then not counted: nothing more goes in from now, and the 'pay-in-unused' note says so). Hand-overs to A and B read it.
 * @property {Three & { byPerson: { who: string, pension: number, savings: number }[] }} [potAtStart]   J8, on the lives:
 *   the household's pension + savings when the money is first taken, today's prices, whole £ (A's potAtStop).
 * @property {SavingOutcome[]} [saving]       J8, on the lives: per person, A's shape (the saving risk is C's one risk).
 *   Sentences added (J8): `payIn` ('c.payIn' — "Paying in £800 a month until 67, rising with prices; the pot invested at
 *   Balanced, about half in shares, until then." — or 'c.payIn.none'), `pot` ('c.pot', the pot at the start).
 * @property {{ from: number, until: number, who: ('you'|'partner')[], careful: number, partnerUntil: number|null, reachable: number,
 *              need: number, instead: { age: number, monthly: Three, lasted: Three } }} [closedYears]   J18, on the lives: the years
 *   before a closed pension opens set the amount — some pension closed at the start, less than half the pension money open
 *   then, and the savings and open pensions there (middling, `reachable`) short of the closed years' draw (`need`) at the
 *   careful amount starting `until` (your age when enough opens; `instead` is C's own answer from that age). The figures
 *   above stay the band at the start (A's row); `sentences.none` ('c.none.closed') says it in words with both amounts, in
 *   place of the headline, and the rail shows no figure.
 *   Warnings added (J18): 'savings-run-short' (on the lives, every pension closed at the start, a bad case at the take or
 *   the middling amount running out before the first opens), 'annual-allowance' / '-partner' (what goes in, a person, over
 *   £60,000 a year), 'partner-stops-with-you' (a partner past their State Pension age, the money from later than now).
 * @property {{ money: 'todays-prices', tax: 'after-tax', period: 'month', who: 'household' }} [units]
 * @property {object} [trace]               Only when env.trace (brief 4.3). On the lives: { saving: { atCareful }, futures,
 *   evaluations } — the saving months of the bad-case life and every life's most and run-out months (no drawing rows).
 */
export {};
