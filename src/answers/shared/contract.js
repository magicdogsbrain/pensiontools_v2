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
 *
 * @typedef {string | { key: string, kind: 'money' | 'age' } | { fixed: string }} Part
 *   `key` is a dotted path into the result ('monthly.careful', 'phases.1.shown.fromPots', 'inputs.you.pot').
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
 * @property {{ takeHome: number, fromPots: number, statePension: number, finalSalary: number }} shown
 *   Whole pounds for display, which add up exactly: takeHome = fromPots + statePension + finalSalary.
 *
 * @typedef {{ careful: number, middling: number, good: number }} Three
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
 * @property {{ money: 'todays-prices', tax: 'after-tax', period: 'month', who: 'household' }} [units]
 * @property {object} [trace]               Only when env.trace (brief 4.3).
 */
export {};
