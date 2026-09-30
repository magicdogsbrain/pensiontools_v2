# V7 first slice — the test plan for question C

**"I've got about £X — what is that a month?"** Draft for the owner, 30 Sep 2026. Nothing here is built.

This is the test plan for step 3 of `research/v7-plan-of-plans.md`: question C built end to end in the new
rail shell, beside the current app, couple-ready, with every test layer attached. It is written so the tests
can be written **before** the code they test. Whatever this slice does becomes the rule for every later
screen: no later screen merges with fewer layers than this one.

It is one of several sub-plans. It depends on three that are being written alongside it, and says so where it
does: the **answer contract** for question C (exactly what is solved), the **rail and screen design**, and the
**language guide**. Two shell designs exist (`research/v7/architecture-A.md` and `architecture-B.md`); this
plan works with either, because both promise the same things to the tests (section 0.2).

## Read this first: what was found while writing the plan

1. **The app's tax sum is wrong above £100,000 a year.** `calculateTax` in `src/services/TaxCalculator.js`
   widens the 20% band as the tax-free allowance is withdrawn, so income between £100,000 and £125,140 is
   taxed at 50p in the pound instead of 60p. Run on today's code: £110,000 gives £32,432 (HMRC's rules give
   £33,432); £125,140 gives £40,002 (should be £42,516); £150,000 gives £51,189 (should be £53,703). Below
   £100,000 it is right to the penny. The existing test at `tests/TaxCalculator.test.js:48` checks only that
   the allowance shrinks, not the tax. The table in section 3.2 contains these rows, so the first run of this
   plan's tax check goes red on today's code. It needs its own fix and release note (it changes answers for
   anyone drawing over £100,000 a year of taxable income) and should not be folded quietly into the slice.
2. **Neither shell design lists "what would you like to spend" among question C's inputs**, but this plan was
   asked to cover spending at nothing, the three standard-of-living levels and a very high figure. It is
   included here as an optional input. The answer contract has to confirm it.
3. **The headline when guaranteed income starts later is not yet defined.** Someone aged 60 with a small pot
   and a State Pension from 67 cannot have one level monthly figure: the pot cannot fill seven years to that
   height. The tests below need a rule. A working rule is given in 0.3 and marked as such.

## 0. What the tests stand on

### 0.1 What already exists, and how it is reused

| Exists today | Reused for |
|---|---|
| `tests/helpers/clock.js` (`at`, `frozen`, `plain`, `diffPaths`, the two dates either side of 6 April) | Every dated test here. No new clock helper. |
| `tests/fixtures/plans/clock.mjs` + `run.mjs` (a child process with the time zone, date and random stream pinned) | The "same answer in any time zone" check on the three fixtures. |
| `tests/fixtures/plans/market/gilts.json`, `equity.json` and `CORPUS_NOW` (`2026-09-30T08:00:00.000Z`) in `checks.mjs` | The one pinned date and the one pinned market file for every test in this plan, in Node and in the browser. |
| `recordDiffs`, `sortKeys`, `sig12` in `tests/fixtures/plans/checks.mjs` | Comparing a pinned answer with a fresh one: exact on decisions, a tolerance on simulated money. Same rule, same code. |
| `tests/fixtures/plans/03-gilt-ladder-runup.json`, `04-buckets-running.json`, `06-…`, and `decisionSettingsChecksum` | "Browsing never changes a locked plan" (sections 6 and 7). |
| `tests/planCorpus.test.js`, `tests/ownerPlan.local.test.js` | Unchanged. They must stay green with no edit to `snapshot.json`: the proof that building V7 beside the app moved nothing in it. |
| `tests/determinism.test.js` block (c): the scan for `Math.random` and a bare `new Date()`; block (d): the random stream pinned to literal values | Extended to `src/answers/`. Block (d)'s literal values are also asserted inside each browser (section 9). |
| `tests/replay/_replay.js` `ukTax()` (tax written out by hand so the tests do not mark their own homework), `hasUndefined()` | The separate tax sum in the month-by-month check (3.1); the "can be saved" rule. |
| `tests/crossval/harness.js` (the idea: drive a second path over the same months and compare) | The pattern for 3.1. The file itself is about the monthly Decision step and is not touched. |
| `tests/golden/canonical.js` | Stable text of an answer for pinning. |
| `tests/InlineHandlers.test.js` (read the source, extract every expression, fail on what the grammar cannot take) | The pattern for the wording check over the strings file and the import-rule scan. V7 does not use the `data-on-*` handlers, so this test itself is not extended. |
| `tests/indexMarkup.test.js`, `tests/releases.test.js` | Unchanged; must stay green. |
| `research/bug-replay-catalogue.md` | Section 12 lists which September bugs each layer here is aimed at. |
| `PLSA_2024` in `src/services/BudgetModel.js` | The three standard-of-living figures, single and couple, used as boundary values. |
| `seededRng` in `src/utils/MathUtils.js` | The only random source the answer may use. |

### 0.2 What the shell must give the tests (both designs already promise these)

| Seam | Meaning |
|---|---|
| One pure function for question C in `src/answers/` | `answer(inputs, env)`; `env` carries the date, the market data, the seed and the number of futures. It reads no clock, no storage and no network. |
| A declared input list beside it | Field, type, range, default, boundary values, and when the field applies. |
| `data-key` and `data-value` on every number drawn | The name of the figure in the answer, and its raw value. There is no other way to print a number. |
| `data-sentence`, `data-assumed` on every headline | The plain sentence and the list of what was assumed. |
| `data-testid` from the field path | `c.you.pot`, `c.you.age` and so on. |
| A ready mark on the page | Set when nothing is running. Tests wait on it and never on a timer. |
| The rail as data | Stations, order, which are optional, which need what. |
| A test build with `window.__pt` | Set a state, pin the date and market data, put a plan into guest storage, count writes. Absent from the published build. |

**One adapter file, `tests/v7/c/_c.js`, is the only test file that knows the real names.** It exports
`answerC(inputs, env)`, `SCHEMA_C`, `TEST_ENV`, `get(answer, key)` and `renderScreen(id, state)`. If design A
is chosen (`potToMonthly.js`, values named `'monthly.typical'`) or design B (`questionC.js`,
`headline.monthly.middle`), only this file changes. The names used below are this plan's working names.

### 0.3 The working shape of the answer (to be replaced by the answer contract)

```js
answerC(inputs, { today, market, seed, futures, trace })  →
{
  inputs,                         // as used: defaults filled in
  monthly: {
    middle,                       // £ a month after tax, today's prices, household: lasts to the end age in a middling future (5 in 10)
    badCase,                      // the amount that still lasts in the bad case (at least 9 in 10 futures)
    good                          // lasts in 1 in 10 (shown small, if at all)
  },
  runOutAge: { bad },             // if you take `monthly.middle`: the age (of "you") at which the pots are empty in the bad case
  phases: [ { fromAge, toAge, total, fromPots, statePension, finalSalary } ],   // monthly, after tax, today's prices
  guaranteed: { monthlyAfterTax },        // State Pension + final-salary once all have started
  spending: null | { wanted, covered, spare, short, runOutAge: { bad } },
  basis: { today, futures, seed, failuresAllowed, marketAsOf, startAge, endAge, accessAge },
  assumed: [ { id, field, text, value, source: 'default' | 'entered' | 'rule' } ],
  units: { money: 'todays-prices', tax: 'after-tax', period: 'month', who: 'household' },
  sentence: { headline, prices, split, bad, safe, spending },
  trace: { middle: [...], bad: [...], futures: [ { id, runOutMonth | null, potAtEnd } ] }   // only when env.trace
}
```

A trace row is one month for one person: `{ m, age, potStart, growth, draw, taxFree, taxable, statePension,
finalSalary, tax, afterTax, potEnd, priceIndex }`, in pounds of that month, with `priceIndex` to turn them
into today's prices.

Working rules the tests assume, each of which the answer contract must confirm or replace:

- **The bad case** is the worst 1 in 10: of `N` futures, the amount "lasts in the bad case" when it fails in
  at most `floor(N / 10)` of them. One definition, in one helper.
- **Same futures for every input.** The list of futures depends only on the seed, never on the inputs. Without
  this, "more pot never gives less" cannot be tested, and two people comparing notes on a forum get noise.
- **Headline when income is not level** (finding 3): the headline is the first phase's total; later phases are
  never lower than the first.
- **Figures shown** are rounded down to the nearest £10 a month; ages are whole years. Raw values stay in
  `data-value`.
- **Under the age you can take a pension**: the money starts at the earliest age allowed and the pot is
  assumed to grow with nothing more paid in until then. Both facts appear under "what we assumed".

## 1. The inputs, as a list a program can read, and the cases made from it

### 1.1 The list

This is the content of the declared input list (file and exact layout per the chosen shell design). The test
suite reads it; nobody copies it by hand into tests.

```js
export const SCHEMA_C = {
  id: 'c',
  fields: [
    { path: 'household', type: 'choice', options: ['single', 'couple'], default: 'single' },

    { path: 'you.age', type: 'age', min: 18, max: 100, required: true,            // no default: a silent "45" was bug G2
      boundaries: [18, 40, 54, 55, 56, 57, 66, 67, 68, 75, 90, 100] },
    { path: 'you.pot', type: 'money', min: 0, max: 10_000_000, required: true,
      boundaries: [0, 1, 10_000, 250_000, 1_073_100, 3_000_000, 10_000_000] },    // 1,073,100 × 25% = the £268,275 tax-free limit
    { path: 'you.statePension.included', type: 'yesNo', default: true },
    { path: 'you.statePension.yearly', type: 'money', min: 0, max: 20_000, default: 'rules.fullStatePensionYearly',
      when: { 'you.statePension.included': true }, boundaries: [0, 1, 6_000, 'default', 20_000] },
    { path: 'you.statePension.fromAge', type: 'age', min: 66, max: 68, default: 'rules.statePensionAge(you.age, today)',
      when: { 'you.statePension.included': true }, boundaries: [66, 67, 68] },
    { path: 'you.finalSalary.has', type: 'yesNo', default: false },
    { path: 'you.finalSalary.yearly', type: 'money', min: 1, max: 200_000, required: true,
      when: { 'you.finalSalary.has': true }, boundaries: [1, 9_000, 12_570, 50_270, 200_000] },
    { path: 'you.finalSalary.fromAge', type: 'age', min: 50, max: 75, required: true,
      when: { 'you.finalSalary.has': true }, boundaries: [50, 55, 60, 65, 67, 75] },

    // partner.* is you.* again, each with  when: { household: 'couple' }  added.
    // partner.pot defaults to 0 (required: false): "my partner has no pension" is one tap, not a number.

    { path: 'risk', type: 'choice', options: ['cautious', 'balanced', 'adventurous'], default: 'balanced' },
    { path: 'spending.kind', type: 'choice', options: ['none', 'level', 'amount'], default: 'none' },
    { path: 'spending.level', type: 'choice', options: ['minimum', 'moderate', 'comfortable'],
      when: { 'spending.kind': 'level' } },                                        // PLSA_2024, single or couple by household
    { path: 'spending.yearly', type: 'money', min: 0, max: 500_000, when: { 'spending.kind': 'amount' },
      boundaries: [0, 14_400, 31_300, 43_100, 22_400, 59_000, 250_000] },
    { path: 'endAge', type: 'age', min: 75, max: 105, default: 95, boundaries: [75, 95, 100, 105] },
    { path: 'alreadyTaking', type: 'yesNo', default: false }                       // wording only: a retired person gets no "when you stop" words
  ],
  rules: [
    { id: 'end-after-now', test: 'endAge > age of the younger person', say: 'The age the money has to last to must be older than you are now.' },
    { id: 'fs-started', note: 'finalSalary.fromAge <= age means it is already being paid; allowed, never an error' }
  ]
};
```

Counted by a test: a single person **must type two things** (age, pot). Everything else has a shown default.
A couple types four.

### 1.2 The schema's own test (`tests/v7/c/schema.test.js`)

- Every field has a type, a label in the strings file, and (numbers) `min`, `max` and a `boundaries` list that
  includes `min` and `max`; every choice lists its options.
- `validate(defaults(SCHEMA_C) + the required fields)` passes; every boundary value passes; `min − 1` and
  `max + 1` fail with a plain sentence that contains no banned word.
- Every `when` names a field that exists and is declared earlier.
- No required field has a default, and no field is both optional and without a default.
- The count of required fields for `household: 'single'` is at most 5 (today: 2).
- Every field path appears as a `data-testid` on the rendered form, and the form has no input that is not in
  the list (checked in section 5).

### 1.3 Libraries

- **`fast-check`** (version 3, used directly with vitest; no plug-in needed) for random cases and for random
  walks of the rail. It prints the seed and the smallest failing input, so a failure can be pasted back as a
  permanent case.
- **No library for the pairs.** A small generator in the repository, `tests/v7/gen/pairs.mjs` (about 80
  lines, greedy, no randomness, so the same list every time). An outside tool adds nothing here and one more
  thing to keep working.

### 1.4 The pairs (`tests/v7/gen/pairs.mjs`, `build-cases.mjs`, `tests/v7/c/cases.pairs.json`)

The generator does not pair raw fields; it pairs **dimensions**, each a short list of named values that know
which fields they set. This is what keeps impossible cases out (a partner's age for a single person).

| Dimension | Values |
|---|---|
| Household | single · couple |
| Your age | 40 · 54 · 55 · 56 · 57 · 66 · 67 · 68 · 75 · 90 |
| Your pot | 0 · 1 · 10,000 · 250,000 · 1,073,100 · 3,000,000 |
| Risk | cautious · balanced · adventurous |
| Your State Pension | none · the full amount (default) · part (£6,000 a year) |
| Your final-salary pension | none · £9,000 from 60 · £9,000 from 65 · £60,000 from 60 |
| Spending | not given · 0 · minimum · moderate · comfortable · £250,000 a year |
| End age | 95 · 100 |
| Already taking money | no · yes |
| Partner's age | not applicable · 54 · 62 · 70 |
| Partner's pot | not applicable · 0 · 150,000 · 1,073,100 |
| Partner's State Pension | not applicable · none · full |
| Partner's final-salary pension | not applicable · none · £9,000 from 60 |

- **Every pair of values appears together in at least one case.** The partner dimensions take "not
  applicable" exactly when the household is single; the generator treats that as a fixed link, not a pair to
  cover. Expect roughly 70 to 90 cases (the two largest dimensions are 10 × 6).
- **The core in every combination**: household (2) × final-salary (yes, no) × State Pension (yes, no) × risk
  (3) × already taking (2) = 48 cases on one middle-of-the-road person (age 60, £250,000), added to the list.
- **Age boundaries one at a time**: each age in the list, single, £250,000, defaults: 10 more cases. This is
  where the pension access age (55, rising to 57 from 6 April 2028) and the State Pension ages (66, 67, 68)
  are crossed in isolation, so a failure names the age.
- `build-cases.mjs` writes `cases.pairs.json` (readable: one case per line, with a name such as
  `couple·age57·pot1·cautious·…`). The file is committed.
- `tests/v7/c/pairs.test.js` then: (a) regenerates the list and fails if it differs from the committed file
  (a changed input list forces a regenerate and shows the difference in review); (b) checks with its own
  double loop, not the generator's, that every pair is present; (c) runs every case through `checkAnswer()`
  (all of section 2.1) with the small number of futures.

Honest limit, repeated from the plan of plans: a bug that needs three particular values together can pass the
pairs. The nightly random run is the net under that.

### 1.5 Random cases built from the list (`tests/v7/gen/arbitrary.mjs`)

```js
import fc from 'fast-check';

/** One field → values, three times out of four a boundary value, otherwise anything in range. */
function fieldArb(f, env) {
  if (f.type === 'yesNo') return fc.boolean();
  if (f.type === 'choice') return fc.constantFrom(...f.options);
  const edges = (f.boundaries || [f.min, f.max]).map((b) => (b === 'default' ? resolveDefault(f, env) : b));
  return fc.oneof(
    { weight: 3, arbitrary: fc.constantFrom(...edges) },
    { weight: 1, arbitrary: fc.integer({ min: f.min, max: f.max }) }
  );
}

/** Whole, valid inputs: every field drawn, then fields whose `when` is false are dropped and defaults applied. */
export function arbitraryInputs(schema, env) {
  const record = Object.fromEntries(schema.fields.map((f) => [f.path, fieldArb(f, env)]));
  return fc.record(record)
    .map((flat) => normalise(schema, flat, env))          // the app's own normalise: drops what does not apply, fills defaults
    .filter((inputs) => validate(schema, inputs).ok);      // cross-field rules (end age after today's age)
}
```

### 1.6 One generated-property test, in full (`tests/v7/c/properties.test.js`, first property)

```js
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { answerC, SCHEMA_C, TEST_ENV } from './_c.js';
import { arbitraryInputs } from '../gen/arbitrary.mjs';

// Every push: a fixed seed and a small count, so a red run is the code's fault and can be repeated exactly.
// Nightly: FC_SEED is unset (a fresh seed, printed on failure) and FC_RUNS is large.
const RUNS = Number(process.env.FC_RUNS || 60);
const SEED = process.env.NIGHTLY ? undefined : 20260930;
const LIMIT = SCHEMA_C.fields.find((f) => f.path === 'you.pot').max;

describe('C — more in the pot never gives a smaller answer', () => {
  it('holds for any valid inputs and any extra amount, on the same futures', () => {
    fc.assert(
      fc.property(
        arbitraryInputs(SCHEMA_C, TEST_ENV),
        fc.integer({ min: 1, max: 500_000 }),
        (inputs, extra) => {
          fc.pre(inputs.you.pot + extra <= LIMIT);
          const richer = { ...inputs, you: { ...inputs.you, pot: inputs.you.pot + extra } };

          const a = answerC(inputs, TEST_ENV);
          const b = answerC(richer, TEST_ENV);

          // Same futures in both runs, or the comparison means nothing.
          expect(b.basis.seed).toBe(a.basis.seed);
          expect(b.basis.futures).toBe(a.basis.futures);

          expect(b.monthly.badCase).toBeGreaterThanOrEqual(a.monthly.badCase);
          expect(b.monthly.middle).toBeGreaterThanOrEqual(a.monthly.middle);
          expect(b.monthly.good).toBeGreaterThanOrEqual(a.monthly.good);

          // With a spending figure the question is "how long does it last": more pot never brings the day forward.
          if (a.spending) {
            expect(b.spending.runOutAge.bad).toBeGreaterThanOrEqual(a.spending.runOutAge.bad);
            if (a.spending.covered) expect(b.spending.covered).toBe(true);
          }
          // Guaranteed income is not the pot's business.
          expect(b.guaranteed.monthlyAfterTax).toBe(a.guaranteed.monthlyAfterTax);
        }
      ),
      { seed: SEED, numRuns: RUNS, verbose: 1 }
    );
  });
});
```

`TEST_ENV` is `{ today: '2026-09-30', market: <the pinned files>, seed: 1, futures: 40, trace: false }`. Forty
futures is small but real (the same figure `tests/determinism.test.js` uses); the rules in section 2 hold at
any number. A failure found by this test is copied, with its seed, into `tests/v7/c/found.cases.json`, which
`pairs.test.js` also runs for ever after.

## 2. Rules that must hold for any input

### 2.1 On one answer: `checkAnswer(answer)` in `tests/v7/c/invariants.js`

One function, called from the pairs, the random cases, the three fixtures, the nightly run and the browser
sameness run. It returns a list of plain-English failures; the test asserts the list is empty.

| # | Rule | Exact assertion |
|---|---|---|
| I1 | Nothing is not-a-number, infinite or missing | Every number in the answer passes `Number.isFinite`; `hasUndefined(answer) === false` (the helper from `tests/replay/_replay.js`); no function anywhere in it |
| I2 | Nothing is negative | `monthly.*`, every phase figure, `guaranteed.monthlyAfterTax`, every trace money field `>= 0`. No negative zero: `Object.is(x, -0) === false` |
| I3 | Bad, middle, good are in order | `monthly.badCase <= monthly.middle <= monthly.good` |
| I4 | Phases add up | For each phase, `total === fromPots + statePension + finalSalary` to the penny; phases are in age order, touch with no gap, first `fromAge === basis.startAge`, last `toAge === basis.endAge` |
| I5 | Headline is the first phase | `monthly.middle === phases[0].total` (the working rule in 0.3) and `phases[i].total >= phases[0].total` |
| I6 | No pot, nothing from the pot | A person whose pot is 0 has `draw === 0` in every trace row. If every pot is 0: `fromPots === 0` in every phase and `monthly.badCase === monthly.middle === monthly.good` (nothing is left to chance) |
| I7 | Ages make sense | `basis.startAge >= you.age`; `basis.startAge >= basis.accessAge` when `you.pot > 0`; `basis.startAge <= runOutAge.bad <= basis.endAge`; all whole numbers |
| I8 | The bad case is the worst 1 in 10 | `basis.failuresAllowed === Math.floor(basis.futures / 10)` |
| I9 | Units are stated | `units` deep-equals `{ money: 'todays-prices', tax: 'after-tax', period: 'month', who: 'household' }` |
| I10 | Every default that was used is listed | For each field whose value came from a default, `assumed` has an entry with that `field` and `source: 'default'`. For each entry with `source: 'entered'`, the value equals the input. The list always has entries for: start age, end age, how the pot is invested, tax-free quarter, tax rates of which year, prices rising, and (couple) "both of you are alive throughout" |
| I11 | Every sentence carries its own number | For each sentence with a `{figure}` slot, the text contains `format(displayed(figure))` exactly once, and no other amount that is not also a named figure of the answer |
| I12 | The tax-free limit | Per person, over the whole trace: `sum(taxFree) <= 268,275` in pounds of the day; and for every month `taxFree <= 0.25 * draw + 0.005` |
| I13 | Tax is sane | Every tax year in the trace, per person: `0 <= tax <= taxable income`; `afterTax <= statePension + finalSalary + draw` |
| I14 | Nothing drawn before it is allowed | No trace row has `draw > 0` with `age < basis.accessAge`; no `statePension > 0` before that person's State Pension age; no `finalSalary > 0` before its start age |
| I15 | Can be saved | `JSON.parse(JSON.stringify(answer.inputs))` deep-equals `answer.inputs`; text length under 100,000 characters |

### 2.2 Between two answers (`tests/v7/c/properties.test.js` and `metamorphic.test.js`)

Each is a fast-check property over `arbitraryInputs`, on the same seed for both runs. "No lower" means `>=`
on `monthly.badCase`, `monthly.middle` and `monthly.good` together.

| # | Change to the inputs | What must happen |
|---|---|---|
| M1 | More in your pot (section 1.6) | No lower; guaranteed income unchanged |
| M2 | More State Pension, or more final-salary pension, or the same one from an earlier age | No lower |
| M3 | A longer life to cover (`endAge + 1`) | `monthly.*` no higher |
| M4 | One year older, same pot, same end age, both ages at or above the access age | No lower (the same pot over fewer years; the guaranteed income starts at the same ages as before) |
| M5 | Swap "you" and "partner" | The household figures are identical: `monthly`, `guaranteed`, `spending`, every phase total. Only the per-person labels move |
| M6 | A couple whose partner has no pot, no State Pension, no final-salary pension and the same age | Identical to the single answer for "you", to the penny |
| M7 | A couple with pots (P, 0) against (P/2, P/2), same ages, nothing else different | The even split is no lower (two tax-free allowances in use) |
| M8 | Change a field that does not apply: the final-salary start age when there is none; any partner field when single; the State Pension amount when it is switched off | The answer is identical, byte for byte |
| M9 | Give a spending figure where there was none | `monthly`, `phases`, `guaranteed`, `runOutAge` identical; only `spending` and its sentence appear |
| M10 | Feed the answer back: spending = `monthly.badCase × 12` | `spending.covered === true`, `spending.runOutAge.bad === basis.endAge` |
| M11 | Feed back `monthly.badCase × 12 + £600` a year (£50 a month more) | `spending.covered === false` and `spending.runOutAge.bad < basis.endAge` |
| M12 | Feed back `monthly.middle × 12` | `spending.runOutAge.bad === runOutAge.bad` (two routes to one figure) |
| M13 | The day changes from 4 to 8 April 2027, the age typed stays the same | `diffPaths` shows changes only in a listed set of fields (`basis.today`, the tax year named under "assumed"). A new path in the list is a new dependence on today's date, to be decided on purpose. Same method as `tests/determinism.test.js` block (b) |
| M14 | The gilt prices file is swapped for a different night's | Identical answer, unless `basis.marketAsOf` says question C uses it; then only fields the contract lists may move |
| M15 | The wall clock is moved to 2031 with `env.today` unchanged | Identical (the `frozen(FAR_WALL_CLOCK, fn)` check from `tests/determinism.test.js` block (a)) |
| M16 | Run it twice | Identical |

No exceptions list is expected. Tax never takes more than 60p of an extra pound, so more money before tax is
always more after it; if M1 or M2 fails, it is a bug, not a cliff. Should a real exception appear it goes in
`tests/v7/c/exceptions.md` with a reason, and that file growing is a line in the release note.

Left out on purpose, as the plan of plans decided: doubling every figure and every threshold.

### 2.3 Nightly only: does the headline depend on luck?

Each of the three fixtures at the full number of futures on five seeds. `monthly.middle` and
`monthly.badCase`, as displayed, must not differ by more than 5% between seeds, and `spending.covered` must
not flip. If they do, the number of futures is too low for that headline — a design finding, reported, and a
reason to fail the night.

## 3. Independent checks

### 3.1 The headline worked out again from the month-by-month trace

`tests/v7/oracles/fromTrace.mjs`: about 100 lines, imports **nothing** from `src/`. It takes `answer.trace`
and `answer.basis` and returns its own figures. `tests/v7/c/trace.test.js` runs it on the three fixtures, the
48 core cases and every age-boundary case (with `env.trace: true`) and compares.

| Recomputed from the trace | Compared with | How close |
|---|---|---|
| Each month, each person: `potStart + growth − draw` | `potEnd` of that row, and `potStart` of the next | 1p |
| First row's `potStart` | the pot typed in (grown to the start age, if under the access age — then checked against the listed growth assumption) | 1p |
| Each tax year, each person: tax on `statePension + finalSalary + taxable`, by the hand-written sum in `tests/v7/oracles/ukTax.mjs` (section 3.2's rules, not `TaxCalculator`) | The sum of that year's `tax` column | 1p |
| Each month: `statePension + finalSalary + draw − tax`, divided by `priceIndex`, summed over the household | `phases[i].total` for that age | £1 |
| Smallest monthly household total, today's prices, over all months the pots last, on the middle trace | `monthly.middle` | £1 |
| First age with `potEnd === 0` for every person, on the bad trace | `runOutAge.bad` | exact |
| Sort `trace.futures` by run-out month (never = last), take the one at position `floor(N/10)` from the worst | It is the future named as "the bad case"; and the number of futures that ran out at `monthly.badCase` is `<= floor(N/10)` | exact |
| Months in which State Pension is paid, from each person's State Pension age | Every such row equals the yearly amount ÷ 12, uprated by `priceIndex`; none before | 1p |
| `sum(taxFree)` per person | `<= 268,275` | exact |

This is the check the test-engineer critic asked for: "screen equals engine" only proves the wiring; this
proves the headline means what its sentence says.

### 3.2 Tax: HMRC's rules as a table (`tests/v7/oracles/hmrc-income-tax-2026-27.json`, `tax.test.js`)

Each row carries a source and the date it was checked. The figures below are worked by hand from the
published 2026/27 rates for England, Wales and Northern Ireland (allowance £12,570; 20% on the next £37,700;
40% up to £125,140; 45% above; the allowance falls by £1 for every £2 over £100,000). **Before the file is
committed each row is checked against gov.uk "Income Tax rates and Personal Allowances" and one HMRC worked
example of the allowance reduction**, and the page address and date go in the row. The test runs every row
against `calculateTax` and against the answer's own tax step.

| Taxable income in the year | Tax | Note |
|---|---|---|
| 12,570 | 0 | |
| 12,571 | 0.20 | |
| 20,000 | 1,486 | |
| 50,270 | 7,540 | top of the 20% band |
| 50,271 | 7,540.40 | |
| 60,000 | 11,432 | |
| 100,000 | 27,432 | last pound before the allowance shrinks |
| 110,000 | 33,432 | **today's code: 32,432** |
| 125,140 | 42,516 | **today's code: 40,002** |
| 150,000 | 53,703 | **today's code: 51,189** |

The step from the pot to the pocket (a quarter of each withdrawal tax-free, the rest taxed with other income):

| Other taxable income | Taken from the pot | Taxed part | Tax | In the pocket | Note |
|---|---|---|---|---|---|
| 0 | 16,760 | 12,570 | 0 | 16,760 | the most that comes out tax-free in a year |
| 0 | 16,761 | 12,570.75 | 0.15 | 16,760.85 | one pound over |
| 0 | 40,000 | 30,000 | 3,486 | 36,514 | |
| 12,547.60 | 20,000 | 27,547.60 | 2,995.52 | 29,552.08 | with a State Pension of £241.30 a week × 52 (figure to be confirmed against the app's constant) |
| 21,547.60 | 10,000 | 29,047.60 | 3,295.52 | 28,252.08 | State Pension and a £9,000 final-salary pension |
| 0 | 80,000 | 60,000 | 11,432 | 68,568 | into the 40% band |
| 0 | 160,000 | 120,000 | 39,432 | 120,568 | allowance down to 2,570 |
| 0 | 40,000, tax-free limit already used | 40,000 | 5,486 | 34,514 | after £268,275 of tax-free cash |
| couple, 0 each | 16,760 each | 12,570 each | 0 | 33,520 | two allowances |
| one person, 0 | 33,520 | 25,140 | 2,514 | 31,006 | the same money in one name |

And backwards, because the answer solves for the amount to take: wanting £36,514 in the pocket with no other
income must give £40,000 from the pot, within 1p; each row above is run in both directions.

Out of scope for this slice, and listed under "what we assumed" so nobody is misled: Scottish rates, the
marriage allowance, and the extra tax a provider may take from a first payment and refund later.

### 3.3 Cases with an exact answer (`tests/v7/c/closedForm.test.js`)

The answer function takes its futures from `env`. For these tests `env.futures` is replaced by one made-up
future: prices flat, every investment returning exactly 0%.

| Case | Inputs | Exact answer |
|---|---|---|
| CF1 pot ÷ years | Single, 65, £300,000, no State Pension, no final-salary, to 95 | £10,000 a year is taken; £7,500 of it is taxable, under the allowance, so no tax. `monthly.badCase === monthly.middle === monthly.good`, each within £1 of 833.33; shown as "£830"; 360 trace rows; last `potEnd` under £360 (the solver works in whole pounds a month: at most £1 × 360 months left over) |
| CF2 the same with tax | Same, £603,360 | £20,112 a year; taxed part 15,084; tax 502.80; in the pocket 19,609.20 → 1,634.10 a month, within £1 |
| CF3 run-out age | Single, 57, £600,000, spending £28,014 a year (= £30,000 from the pot less £1,986 tax) | `spending.runOutAge.bad === 77`; `spending.covered === false` for an end age of 95 |
| CF4 no pot | Single, 67, pot 0, full State Pension | `monthly.middle` = State Pension ÷ 12, no tax (it is under the allowance); `phases.length === 1`; no trace row has a draw |
| CF5 the tax-free limit | Single, 65, £1,073,100, then £1,073,101 | `sum(taxFree)` is 268,275.00 in the first and no more than 268,275.00 in the second |
| CF6 nothing at all | Single, 60, pot 0, no State Pension | Every figure 0; the sentence is the "nothing to pay out" sentence, not "£0 a month until 95"; nothing reads "-£0" |
| CF7 a couple is two singles | Two people, both CF1 | Household figure is exactly twice CF1 |

A second family with a fixed growth rate above zero can follow once the contract states whether money is
taken at the start or the end of a month; the 0% cases do not depend on that, which is why they come first.

## 4. The three worked fixtures, with their sentences

`tests/v7/fixtures/c/*.json`. Each file holds: the inputs; the sentence templates below; the pinned answer
(numbers filled by the first run, compared afterwards with `recordDiffs`: exact on ages, flags and displayed
figures, a tolerance on raw simulated money); and an `approved: { by, date }` line. `fixtures.test.js` fails
if a sentence or a displayed figure changes, and fails if `approved` is missing. The owner reads each file
once; after that any change arrives as a difference in English.

The words in braces are figures from the answer, as displayed. The rest is pinned now, letter for letter.
(The language guide may reword them; then they are re-approved once.)

### F1 — the forum guest: one person, 58, about £250,000

Inputs: single, age 58, pot £250,000, everything else left alone (medium risk, full State Pension, no
final-salary pension, no spending figure, to 95).

- Headline: "About **{monthly.middle}** a month after tax, from now until you are 95."
- Prices: "That is in today's prices, and it goes up with prices each year."
- Split: "Until you are {you.statePension.fromAge} all of it comes from your pot. From then your State Pension
  pays {statePension monthly} of it and your pot pays the rest."
- Bad case: "In a bad case — the worst 1 in 10 of the futures we tried — taking that much would empty your pot
  when you are {runOutAge.bad}. After that you would have your State Pension and nothing else."
- Safer figure: "To be covered even in that bad case, take about {monthly.badCase} a month."
- What we assumed (each a line, each with a "Change" link): "You start taking money now, at 58." · "Your pot
  is invested at medium risk: about half in shares, the rest in bonds and cash." · "You get the full State
  Pension, {weekly} a week, from age {fromAge}. Your own forecast is on gov.uk." · "A quarter of everything
  you take from the pot is tax-free. The rest is taxed as income at this year's rates." · "You have no other
  income." · "The money has to last until you are 95, and nothing is left over."

### F2 — a couple: 62 and 60

Inputs: couple; you 62, pot £400,000, final-salary pension £9,000 a year from 65; partner 60, pot £150,000;
both full State Pension; medium risk; spending "moderate" (£43,100 a year for a couple, shown as £3,590 a
month); to 95.

- Headline: "Between you, about **{monthly.middle}** a month after tax, from now until the younger of you is
  95."
- Spending, one of two, chosen by `spending.covered`: "You said you would like £3,590 a month. This covers it,
  with about {spending.spare} a month to spare." / "You said you would like £3,590 a month. This is about
  {spending.short} a month short."
- Bad case: "In a bad case — the worst 1 in 10 of the futures we tried — spending £3,590 a month would empty
  your pots when you are {spending.runOutAge.bad}. After that you would have {guaranteed.monthlyAfterTax} a
  month from your State Pensions and your final-salary pension."
- Extra lines under what we assumed: "Each of you pays tax on your own income, with your own tax-free
  allowance." · "Your final-salary pension pays £9,000 a year from age 65 and rises with prices." · "Both of
  you are alive throughout. What one of you would be left with is a separate check."

### F3 — already retired: 68, taking money now

Inputs: single, 68, already taking money; pot £180,000; State Pension £11,000 a year (entered, already being
paid); final-salary pension £6,000 a year from 60 (already being paid); lower risk; spending £2,200 a month;
to 95.

- Headline: "Your pot can add about **{phases[0].fromPots}** a month to the {guaranteed.monthlyAfterTax} a
  month you already get. That is about {monthly.middle} a month after tax, until you are 95."
- Spending: as F2, with "You spend £2,200 a month."
- Bad case: "In a bad case — the worst 1 in 10 of the futures we tried — spending £2,200 a month would empty
  your pot when you are {spending.runOutAge.bad}."
- A figure that can be pinned today, because it needs no futures: £17,000 a year of pensions, less
  (17,000 − 12,570) × 20% = £886 tax, is £16,114 a year, **£1,342.83 a month, shown as "£1,340"**.
- Must not appear anywhere on any screen for this fixture: "when you retire", "until you retire", "when you
  stop work", "years to go", "plan starts", any count of years or months to a start.

Each fixture also runs through `checkAnswer()`, through the trace check, in the child process under `TZ=UTC`
and `TZ=Europe/London` (same answer), and is the seeded state for the render tests, the browser journeys and
the screenshots — one set of figures the whole way down.

## 5. Drawing the screens from state, without a browser

`tests/v7/c/render.test.js`, in jsdom, inside the ordinary suite. Seconds, every push.

**The named states** (`tests/v7/states/c/*.json`), each a whole state the shell can draw, with the answer
inside produced by the answer function and pinned (a test fails if a fresh run no longer matches, so screens
cannot drift from the engine):

`front-door` · `figures-blank` · `figures-half-typed-with-an-error` · `figures-couple-open` ·
`answer-working` · `answer-F1` · `answer-F2` · `answer-F3` · `answer-nothing-to-pay` (CF6) ·
`answer-assumed-open` · `answer-failed`

Plus every one of the 48 core cases drawn on the answer screen.

**`checkScreen(root, state)` in `tests/v7/render/checkScreen.js`** — one helper, run on every drawn state here
and again on the live page in the browser (section 7):

| # | Check | Exact assertion |
|---|---|---|
| R1 | No rubbish | Visible text matches none of: `undefined`, `NaN`, `null`, `Infinity`, `[object`, `-£0`, `£-`, `£NaN`, `{`, `}` (an unfilled slot) |
| R2 | Every number is the answer's number | For every `[data-value]`: it has a `data-key`; `Number(el.dataset.value) === get(state.answer, el.dataset.key)` exactly; its text is `format(displayed(value))` |
| R3 | No number from anywhere else | Remove every `[data-value]` and every `[data-fixed]` element (for fixed words such as "1 in 10"), then the remaining text contains no digit. This is "the screen computes nothing", enforced |
| R4 | Every headline is complete | Each `[data-headline]` contains a number, a non-empty `[data-sentence]` and a `[data-assumed]` with at least one line; the sentence contains that number's text |
| R5 | What was assumed is all there | The lines under `[data-assumed]` are exactly `state.answer.assumed`, in order; every line whose source is a default has a link to the field that changes it |
| R6 | Same figure, same value | Two elements with the same `data-key` carry the same `data-value` |
| R7 | The form is the input list | Inputs on the form = the fields that apply in this state, no more, no fewer; each has a `data-testid` equal to its path, a visible label, and the state's value |
| R8 | Round trip | `readForm(root)` deep-equals `state.draft.c`. With fast-check: any valid inputs → drawn → read back → the same inputs (the test aimed at the largest class of September bugs) |
| R9 | One main heading | Exactly one `h1`; headings do not skip a level |
| R10 | One, not "1 years" | No `\b1 (years|months|futures|pensions)\b` |
| R11 | Wording | The banned list below, by scope |
| R12 | Money looks like money | Every money text matches `^£\d{1,3}(,\d{3})*$` (whole pounds, no pence, no minus) |

**The banned list** (`tests/v7/wording/banned.js`; owned by the language guide, enforced here). It runs twice:
over the strings and sentence-template files as text (the pattern of `tests/InlineHandlers.test.js`), and over
every drawn state.

| Scope | Banned |
|---|---|
| Everywhere in V7 | "decumulation", "plan year", "bridge", "Stress Tester", "accumulation", "glidepath", "Monte Carlo", "percentile", "simulation", "sequence risk", "wrapper", "crystallis", "UFPLS", "PCLS", "nominal", "real terms", "tbc", "todo" |
| Everywhere, as whole words | "gross", "net" (say "before tax", "after tax"); "DB", "DC", "SIPP" on first-answer screens |
| "stress test" | Allowed only in a string tagged as the feature's name. Question C's screens have no such string, so here it is simply banned |
| States where the person is already taking money, or is past the start age | "when you retire", "until you retire", "when you stop work", "years to go", "months to go", "plan starts", "countdown", "to retirement", and the pattern `in \d+ (years|months)` |
| The front door and question C | "sign up", "create an account", "log in" as a step before the answer (a link in the header is fine: the check is on the rail's steps and the form) |

## 6. The rail, tested as data

`tests/v7/rail/rail.test.js` (pure, every push). For slice C the rail is small — the front door, "Your
figures", "Your answer", and whatever "what next" the rail design adds — and the test is written for any size.

| # | Check | Exact assertion |
|---|---|---|
| L1 | Every step can be reached | A search from the front door over the declared links visits every station of every question |
| L2 | No dead ends | Every station has at least one onward link, or is marked `end: true`; every station has a way back to the front door |
| L3 | Links point somewhere | Every link target is a station that exists; every station has a screen in the screens list and a label in the strings file |
| L4 | Addresses work both ways | `parse(format(route))` deep-equals `route` for every station, with and without a plan id; an unknown address resolves to the front door; no figure ever appears in an address |
| L5 | Nothing demands another tool first | Opening any station's address with an empty state resolves to a screen that asks for the missing figures in place, never to an error or a "set this up elsewhere first" |
| L6 | Questions not built yet are honest | The front door's links for A, B, D, E and F lead to a screen that says what is coming and offers a way on; none is a dead link |
| L7 | Random walks | fast-check: up to 8 moves from (open an address, follow a link, back, change question, type a value, reload) against a ten-line model of "where you should be". After every move: the address names the current station, exactly one station is marked as "you are here", and `checkScreen` passes |
| L8 | The wrong person is never sent the wrong way | For a state marked "already taking money", no rail label or link text is on the retired banned list |

`tests/v7/rail/lockedNoWrite.test.js` — **a locked plan is never written to by browsing**:

- Load each locked fixture from the corpus (`03-gilt-ladder-runup`, `04-buckets-running`,
  `06-pre-6.4-no-timing`) into the V7 state through the shell's own loading path, with a storage stand-in that
  records every write.
- Apply 200 random walks of 8 moves (L7's generator, browsing moves only, including opening question C with
  the plan open and typing figures into it).
- Assert: the recorded writes number **zero**; `decisionSettingsChecksum` is unchanged; `decisionTool.settings`,
  `decisionTool.history`, `planDocument` and `planDocumentArchive` are byte-identical (`sortKeys` +
  `JSON.stringify` before and after); `schemaVersion` is unchanged.
- And the other direction: `tests/planCorpus.test.js` and `tests/ownerPlan.local.test.js` pass with no change
  to their pinned files.

`tests/v7/boundaries.test.js` — the import rules, as a scan of `import` lines:

- Files under `src/answers/` import nothing from the screen code, `src/ui`, `src/storage` or `src/firebase`;
  contain no `Math.random`; read no clock except through `env` (the scan from `tests/determinism.test.js`
  block (c), pointed at the new folder).
- Screen files import no answer function and no engine, only the input list, strings and formatters.
- After a build, no file in the published output contains `__pt`.

## 7. Journeys in a real browser

Playwright (`@playwright/test`), against a **local build**, never the live site, never a real account. Every
journey is in guest mode or needs no session at all.

### 7.1 The two builds and what each is for

| Build | Made by | Used for |
|---|---|---|
| **Published build**, exactly as deployed | `vite build --outDir dist/prod` (the normal configuration; `dist/` is already ignored by git, so `docs/` is not touched) | The forum guest's journey and count; the security-policy walk; the "current app unchanged" walk. **No hooks exist in it.** |
| **Test build** | the same with `--mode test`, into `dist/test` | Seeded journeys, the crawl, screenshots. Has `window.__pt`. Never deployed. |

Both are served by `e2e/helpers/serve.mjs`, a 40-line static server that reads `public/_headers` and sends the
same security headers Cloudflare sends. `vite preview` does not send them, so today a script the policy would
block is found only after deployment.

### 7.2 Pinning, seeding and "ready"

| Need | Test build | Published build (hooks off) |
|---|---|---|
| The date | `__pt` sets the shell's `today` to `2026-09-30` before the first draw | Playwright's `page.clock.setFixedTime('2026-09-30T08:00:00Z')`: fixes the date, leaves timers running |
| Market data | `__pt` pins the files in `tests/fixtures/plans/market/` and re-sends them to the worker | `page.route('**/data/gilts.json')` and `…/equity.json` answered from the same files |
| Proof the pin took | The journey asserts `basis.today` and `basis.marketAsOf` as drawn on the page (both are in "what we assumed") equal the pinned values. A pin that silently failed makes a red test, not a flaky one | same |
| A starting state | `__pt` draws a named state from `tests/v7/states/` (screenshots), or puts a corpus plan into guest storage through the normal loading chain (the locked-plan crawl) | None. The person types. That is the point of this build's journey |
| Seed and number of futures | The published defaults. Tests do not lower them in the browser: the wait is part of what is measured | same |
| Ready | `ready(page)` waits for the shell's ready mark. No test calls `waitForTimeout`; a vitest check greps `e2e/` for it and fails if found | same |
| Browser settings | `locale: 'en-GB'`, `timezoneId: 'Europe/London'`, `serviceWorkers: 'block'`, `reducedMotion: 'reduce'`, one fixed colour scheme | same |

The worker matters here: a fixed date in the page does not reach a worker by itself. The rule that makes this
safe is already in the fixed decisions — the date and the market data are **inputs** to the answer, sent by
the page — and the "proof the pin took" line is what checks it.

### 7.3 What every journey asserts, without being asked

`e2e/helpers/app.js` wraps each step, so these are not repeated in the scripts:

- No console error, no failed request, no security-policy violation report.
- After every step: `checkScreen` (section 5) on the live page.
- **Screen equals engine**: every `[data-value]` on the page is collected with its key and compared with
  `answerC` run in Node on the same inputs, date, market files and seed (`e2e/helpers/answerInNode.js`).
  Decisions exact; money within the tolerance of section 9.
- Reload: the same address, the same figures, the same values in the boxes.
- Nothing scrolls sideways; every control is inside the screen's width.

### 7.4 The three journeys

**J1 — the forum guest with two minutes** (`e2e/c-forum-guest.spec.js`; published build, hooks off; phone 390
and desktop 1440). A person arrives from a forum link at the front door, picks "I've got about £X — what is
that a month?", types 250000 and 58 one key at a time (120 ms a key — this is what catches a box that loses
its place after every digit), leaves the rest, and asks for the answer. Asserts F1's sentences and figures.
Then counts, and writes the counts to `test-results/first-answer.json`:

| Counted | Budget | How |
|---|---|---|
| Things that must be filled in | at most 5 (expected 2) | fields the person touched |
| Screens | at most 3 (front door, figures, answer) | distinct stations passed |
| Clicks or taps | at most 6 | counted by the wrapper |
| Sign-up, sign-in, tour or pop-up before the answer | 0 | any dialog or any address outside the question fails |
| Wait from asking to the answer being ready | under 3 seconds with the processor slowed four times (a mid-range phone) | Chromium's throttle, measured to the ready mark |
| Whole journey at typing speed, by the machine | under 20 seconds | start of load to ready |

The machine count guards against creep: a sixth box, a fourth screen, a slow first run. It does not prove a
real 58-year-old finishes in two minutes. For that, the owner times one real person (or himself, cold) once
per release and writes the figure in the release checklist. No invented "seconds per field" sum.

**J2 — a couple** (`e2e/c-couple.spec.js`; test build, typed not seeded; phone and desktop). Starts as J1,
then says "two of us" part-way through, after the first answer is already showing. Asserts: nothing already
typed is lost; the partner's boxes appear; the answer shows "working" and then F2's figures; the final-salary
pension's start age is asked as an age; "answer in full detail" opens from the answer and comes back with the
same figures; changing the partner's pot changes every place the household figure is shown, together.

**J3 — a retired person** (`e2e/c-retired.spec.js`; test build; phone and iPad 744). Types F3's figures,
ticks that they are already taking money. Asserts F3's sentences, the £1,340 figure, and the retired banned
list on every screen passed, including the rail labels and the "what next" links.

**Also, as one script each:**

- `e2e/crawl.spec.js` (test build): for each named state, open every station's address directly; on each:
  ready, `checkScreen`, screen equals engine, the accessibility rules (section 8.3), the geometry checks.
  Then the locked-plan check in the browser: put corpus plan 03 into guest storage, read the stored text,
  open every station and follow every rail link, read it again — byte-identical, and `__pt`'s write count is 0.
- `e2e/production.spec.js` (published build): J1's path once more with the policy-violation listener as the
  only assertion, and a check that `window.__pt` is undefined.
- `e2e/old-app-unchanged.spec.js` (published build): the current app opens at `/`, guest mode starts, the tab
  bar is there, a demo plan produces a result, no console error. Ten lines of protection for the live app
  while two shells share the source. (Expect this script to be the one that shows where the current shell
  cannot be driven; keep it to what works.)

## 8. Pictures, contrast and keyboard

### 8.1 Which screens, which sizes

Sizes: **phone 390 × 844, iPad 744 × 1133, 1024 × 768, desktop 1440 × 900**. One theme to start: whichever is
the V7 default. The second theme is added when the first set has been stable for a release and the owner is
keeping up with the reviews, not before.

| Screen (named state) | 390 | 744 | 1024 | 1440 |
|---|---|---|---|---|
| Front door | ✓ | ✓ | ✓ | ✓ |
| Your figures, blank | ✓ | ✓ | ✓ | ✓ |
| Your figures, couple open, one error showing | ✓ | ✓ | | ✓ |
| Answer, F1 | ✓ | ✓ | ✓ | ✓ |
| Answer, F2 (couple, spending line) | ✓ | ✓ | | ✓ |
| Answer, F3 (retired) | ✓ | ✓ | | ✓ |
| Answer with "what we assumed" open | ✓ | | | ✓ |
| Answer, nothing to pay out (CF6) | ✓ | | | |
| Rail list pulled up (phone only) | ✓ | | | |

**25 pictures.** Full page, not just the first screenful. Few enough that one person will really look at
every difference.

### 8.2 Keeping them stable, and how a baseline is approved

- **Pictures are only ever made and compared on the CI machine**, in the official Playwright container at the
  exact version in `package.json` (a vitest check fails if the workflow's image tag and the package version
  differ). The app uses the system's own typeface, which is a different typeface on a Mac and on Linux;
  nothing is compared on the Mac, so that never matters and no Docker is needed at home. If the V7 design
  adopts its own bundled typeface, better still; the test waits for `document.fonts.ready` either way.
- Each picture is of a **named state**, set through `__pt`, with the date and market data pinned: the same
  figures every time. No typing, no waiting on an engine.
- Animations and transitions off (`animations: 'disabled'`, reduced motion on), the text cursor hidden,
  scale 1, Chromium only.
- Allowed difference: 0.1% of pixels (`maxDiffPixelRatio: 0.001`). Nothing is masked; a picture that needs a
  mask is showing something unpinned, and that is fixed instead.
- **Approval.** On every push the pictures are compared; a difference fails the run and attaches a report with
  before, after and the difference. To accept a change the owner runs the "Approve screenshots" workflow from
  the GitHub Actions page on that branch (one button). It regenerates the pictures and commits them as one
  commit named "Screenshots approved: …". GitHub shows old and new side by side in that commit. Baselines
  change in no other way: nobody runs the update command on a Mac, because pictures made there would not
  match the CI machine's and the next push would fail.
- **First baseline**: taken only after the owner has looked at the screen design on a real phone and said yes.
  A picture test detects change, not ugliness.

### 8.3 Checks that need no approved picture

Run in the crawl, at all four sizes, on every station and named state:

- **Contrast and labels**: `@axe-core/playwright`, WCAG 2.1 A and AA rules, zero violations. Exceptions, if
  any, in `e2e/axe-exceptions.json`, each with a reason. (This is the check that would have caught the
  white-on-grey boxes.)
- **Geometry**: `document.documentElement.scrollWidth <= clientWidth`; every `[data-testid]` box lies within
  the screen's width; no two children of the header or the rail overlap; at 390, every button, link and box
  is at least 44 px tall. (This is the check aimed at the broken iPad header.)
- **Keyboard** (`e2e/keyboard.spec.js`, desktop): Tab visits the boxes in the order of the input list and then
  the button; every stop shows a visible focus ring (computed outline or box-shadow is not "none"); Enter
  gives the answer; focus lands on the answer's heading; the "Change" links under "what we assumed" put focus
  in the right box; Escape closes the phone rail list; nothing traps the Tab key.

Honest limits: the accessibility tool finds perhaps a third to a half of real problems; Playwright's WebKit is
close to Safari on an iPad but is not it. One look on a real iPad and a real phone per release stays on the
checklist.

## 9. The same answer in every browser

The owner's app gave different results on different machines until 6.13.4. For V7 that is tested from the
first answer function.

`e2e/sameness.spec.js`, run in **Chromium, WebKit and Firefox**:

1. The page loads the built answer module (the test build exposes `__pt.answer(id, inputs, env)`, which calls
   the same function the screen's worker calls — one addition to the hooks the two shell designs list) and,
   separately, runs it through the worker.
2. It is given a list of cases and returns the answers as data. Node runs the same list.
3. Compared, case by case, against Node's answer:

| Part of the answer | Rule |
|---|---|
| Every decision: `spending.covered`, `runOutAge.bad`, `spending.runOutAge.bad`, every age in `basis`, the number of futures that ran out, which future is "the bad case" | **Exactly equal** |
| Every figure as displayed (rounded to £10) and every sentence, letter for letter | **Exactly equal** (this also catches a browser that formats "£1,230" differently) |
| The `assumed` list | Exactly equal |
| Raw money | Within 1p, or one part in a thousand million, whichever is larger (the last digit of `Math.pow` and `Math.exp` differs between engines; this is the rule `recordDiffs` already uses) |
| Direct call against worker call, in the same browser | Byte-identical |
| The first five values of `seededRng(1)` | Equal to the literal values pinned in `tests/determinism.test.js` block (d) |

Cases: on every push, the three fixtures, the seven closed-form cases and the ten age-boundary cases (20). At
night, the whole pairs list, the 48 core cases and 200 random cases from a fresh seed.

If a case ever lands on a knife-edge (a last-digit difference flips a displayed £10), that is a real finding:
it is pinned in `found.cases.json` and the answer function is made robust to it (the solver already works in
whole pounds a month and counts whole futures, which is what makes this rare). It is never fixed by loosening
the rule on decisions.

The journeys J1 and J3 also run in WebKit at 390 and 744 at night, as the nearest thing to the owner's iPad.

## 10. What runs when, how long it may take, and the gate

### 10.1 Every push (`.github/workflows/test.yml`)

| Job | Contents | Budget |
|---|---|---|
| `test` (exists) | The whole vitest suite as now, plus `tests/v7/**`: schema, pairs + core + found cases through `checkAnswer`, properties (fixed seed, 60 runs each), metamorphic, trace check, tax table, closed forms, fixtures, render + wording, rail + locked-plan, import rules. Then the build | `tests/v7` adds at most **90 seconds**. Whole job under 6 minutes (limit 15) |
| `browser` (new) | Build both; J1, J2, J3, production walk, old-app walk (Chromium, 390 and 1440); crawl with screen-equals-engine, accessibility and geometry at four sizes; keyboard; 25 pictures; sameness on 20 cases in three browsers | Under **8 minutes** (limit 15) |

The 90 seconds is a target to be measured, not a promise: it assumes the answer function takes about 30 ms
at 40 futures in Node. **Time ten cases on the first day the function exists**; if it is slower, cut the
per-push random runs first (60 → 25), never the pairs, the fixtures or the independent checks.

While working: `npm run test:fast` as today (the slowest new files take the `.slow.test.js` name so it stays
a few seconds), and `npm run e2e -- c-forum-guest` for one journey.

### 10.2 Every night (`.github/workflows/nightly.yml`, 02:30 UTC, before the data update at 06:30)

| Contents | Budget |
|---|---|
| Random cases from a fresh seed: 2,000 runs of each property and of `checkAnswer`, stopped at 10 minutes; any failure is printed as its smallest input with its seed | 10 min |
| The luck check (2.3): three fixtures × five seeds at the full number of futures | 2 min |
| The trace check on the whole pairs list | 2 min |
| A sweep of dates on the three fixtures: 31 December, 1 January, 5 and 6 April, the day before and after a birthday, the first day of the State Pension. Only the listed fields may move | 1 min |
| Sameness: the full list in Chromium, WebKit and Firefox | 6 min |
| J1 and J3 in WebKit at 390 and 744; J1 in Firefox | 3 min |
| **Total** | **under 25 minutes** |

A red night sends GitHub's usual email. The failing input is added to `found.cases.json` with the fix; that
is the rule that turns a night's luck into a permanent test. The data update's own gate
(`update-gilt-data.yml`) is unchanged: it runs the vitest suite, which now includes `tests/v7`.

### 10.3 Before the slice is called done (once, by hand)

**Planted faults.** Each of these is put into a scratch copy, one at a time, and the test that goes red is
written beside it. A fault that nothing catches is a hole in this plan, fixed before the slice ships. (This is
the cheap, honest stand-in for the mutation testing the plan of plans cut.)

| Planted fault | Expected to go red |
|---|---|
| Tax-free part 30% instead of 25% | tax table; closed form CF1 |
| The 20% band widens as the allowance shrinks (today's bug) | tax table, rows 110,000 and above |
| The bad case taken as the worst 2 in 10 | I8; trace check (position in the sorted futures) |
| The partner's tax-free allowance forgotten | M7; the couple rows of the tax table; CF7 |
| State Pension paid a year early | I14; trace check |
| The futures list depends on the pot | M1 (sooner or later); the `basis.seed` line in 1.6 |
| A screen adds two figures itself | R3; the import rule |
| The sentence built from a different field than the figure beside it | I11; R4 |
| A default State Pension used but not listed | I10; R5 |
| "when you retire" in a string shown to F3 | R11; J3 |
| A save issued when a locked plan is opened | locked-plan test; crawl |
| `Math.random` in the answer | the scan; M16 |
| A figure formatted with the browser's own locale | sameness (sentences letter for letter) |
| The answer reads the clock | M15; the scan |
| A sixth required box | schema test; J1's count |
| The ready mark set before the worker replies | J1 (screen equals engine fails on stale figures) |

### 10.4 The gate for the slice — eight lines

The slice is done, and the page may be published (still unlinked, the current app still the default), when:

1. **Both jobs are green** on the commit, in CI, not only on the Mac.
2. **The current app is untouched**: `planCorpus`, `ownerPlan.local` (run by the owner on his machine),
   `indexMarkup`, `releases` and the old-app walk pass with no pinned file changed.
3. **No rule fails**: `checkAnswer` and the properties report nothing on the pairs, the core, the found cases
   and the last night's random run; `exceptions.md` is empty or every line is in the release note.
4. **The independent checks agree**: tax table to the penny (which means the fix for finding 1 has shipped
   first, under its own release note), closed forms exact, headlines equal to the trace.
5. **The owner has approved** the three fixtures' sentences and figures, and the first 25 pictures.
6. **The first answer is counted** on the published build: at most 5 things to fill in, at most 3 screens, no
   sign-up, under 3 seconds' wait on a slowed processor; and the owner's own stopwatch figure is written down.
7. **The same decisions in three browsers**: last night's full run is green and is of this commit or the one
   before.
8. **A locked plan is never written to by browsing**, in the pure test and in the browser; and the published
   build contains no test hook.

Not gates: coverage percentages, any score from a simulated person, reading-ease scores. A walk by an agent
with a charter ("you are 58, you have a letter saying £250,000, find out what that is a month; say what
confused you") is run once before the owner's review and its notes are read, not scored.

## 11. Changes to CI

### 11.1 `package.json`

```json
"scripts": {
  "e2e:build": "vite build --outDir dist/prod && vite build --mode test --outDir dist/test",
  "e2e": "playwright test",
  "e2e:approve": "playwright test e2e/screens.spec.js --update-snapshots",
  "v7:cases": "node tests/v7/gen/build-cases.mjs"
},
"devDependencies": {
  "fast-check": "^3.23.0",
  "@playwright/test": "1.55.0",
  "@axe-core/playwright": "^4.10.0"
}
```

`@playwright/test` is pinned to an exact version, because the container image and the pictures are tied to
it. (Version numbers here are the shape, not a recommendation: take the current stable ones on the day.) If
design B's separate V7 build configuration is chosen, `e2e:build` runs that too; nothing else changes.

`.gitignore` gains `test-results/` and `playwright-report/`. `vitest` needs no change: its include is
`tests/**/*.test.js`, and the browser scripts live in `e2e/` as `*.spec.js`.

### 11.2 `test.yml` — the new job, beside the existing one

```yaml
  browser:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    container:
      image: mcr.microsoft.com/playwright:v1.55.0-noble   # browsers, their system libraries and fonts, all pinned
    env:
      HOME: /root            # Firefox refuses to start in a container without this
      TZ: Europe/London
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run e2e:build
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: browser-report
          path: |
            playwright-report/
            test-results/
          retention-days: 14
```

The container is the simplest correct answer for one person: nothing to install, nothing to cache, and the
same typefaces every time, which is what keeps the pictures stable. It costs about a minute to fetch.

If the fetch proves too slow, the alternative is to install and cache on the plain runner (pictures then need
their own pinned typeface):

```yaml
      - id: pw
        run: echo "v=$(node -p "require('@playwright/test/package.json').version")" >> "$GITHUB_OUTPUT"
      - uses: actions/cache@v4
        id: pwcache
        with:
          path: ~/.cache/ms-playwright
          key: playwright-${{ runner.os }}-${{ steps.pw.outputs.v }}
      - if: steps.pwcache.outputs.cache-hit != 'true'
        run: npx playwright install --with-deps chromium webkit firefox
      - if: steps.pwcache.outputs.cache-hit == 'true'
        run: npx playwright install-deps chromium webkit firefox     # system libraries are not in the cache
```

### 11.3 `nightly.yml` (new)

Same container. `on: schedule: cron '30 2 * * *'` and `workflow_dispatch`. Two steps after the build:
`NIGHTLY=1 FC_RUNS=2000 npx vitest run tests/v7` and `NIGHTLY=1 npx playwright test --project=all-browsers`.
`permissions: contents: read`. Uploads the same report.

### 11.4 `screenshots.yml` (new) — the "Approve screenshots" button

`on: workflow_dispatch` with the branch chosen in the GitHub page. Same container. Steps: build, `npm run
e2e:approve`, commit `e2e/screens.spec.js-snapshots/` as "Screenshots approved: <run number>", push to the
same branch. `permissions: contents: write` for this workflow only.

### 11.5 `playwright.config.js` — the shape

- `testDir: 'e2e'`, `fullyParallel: true`, `retries: 0` (a test that needs a retry is hiding something;
  fix the wait), `forbidOnly: true` in CI, `reporter: [['html'], ['list']]`.
- `webServer`: two entries, `node e2e/helpers/serve.mjs dist/prod 4173` and `… dist/test 4174`.
- `use`: `locale: 'en-GB'`, `timezoneId: 'Europe/London'`, `serviceWorkers: 'block'`,
  `reducedMotion: 'reduce'`, `trace: 'retain-on-failure'`.
- Projects: `phone-390`, `ipad-744`, `wide-1024`, `desktop-1440` (Chromium; the default set on a push);
  `sameness-chromium`, `sameness-webkit`, `sameness-firefox` (only `sameness.spec.js`);
  `all-browsers` (nightly: WebKit and Firefox journeys).
- `expect.toHaveScreenshot`: `{ maxDiffPixelRatio: 0.001, animations: 'disabled', caret: 'hide', scale: 'css' }`.

## 12. Which September bugs each layer is aimed at

From `research/bug-replay-catalogue.md`. None of these bugs is in question C — it did not exist — but each is
a kind of bug, and the slice is where the net for that kind is first built. (The catalogue's own rule applies
afterwards: any bug found by hand in V7 is recorded with the layer that should have caught it, and the test
is added.)

| Kind of bug (catalogue id) | Layer here |
|---|---|
| "undefined" in a sentence (B1); "£0.00" beside whole pounds (C1) | R1, R12 |
| A default used and described as if entered (G4: £12,000 State Pension); an invisible "age 45" (G2) | I10, R5; no default on age |
| A figure that looks like under-payment because before-tax and after-tax are mixed (D1); two figures on different bases side by side (C5) | I9 units; R6 |
| Visiting a screen changed the plan (B2); opening settings changed saved figures (G1) | Locked-plan test; R8 round trip |
| A box that lost its place after every digit (R6.2.3) | J1 types one key at a time |
| A spinner left running over a finished result (B6); a frozen page (PERF1, PERF2) | The ready mark; J1's wait budget |
| A figure on screen that was not the engine's figure (N1) | Screen equals engine |
| A summary figure defined wrongly while everything added up (B7) | The trace check (3.1) |
| Plans moving a year every 1 January (R6.4.0-a) | M13, M15; the nightly date sweep |
| Different results on different machines (fixed in 6.13.4) | Section 9 |
| A pop-up or race on first arrival (N3) | J1 runs with hooks off, as a first-time visitor |

## 13. Files to create

**Tests, no browser** (`tests/v7/`)

| File | Purpose |
|---|---|
| `c/_c.js` | The adapter: the only file that knows the real names of the answer function, its input list and the shell's draw function. Exports `TEST_ENV` |
| `gen/pairs.mjs` | The all-pairs generator over dimensions (no randomness) |
| `gen/build-cases.mjs` | Writes `c/cases.pairs.json` (pairs + 48 core + 10 age cases) |
| `gen/arbitrary.mjs` | fast-check generators built from the input list, leaning on the boundary values |
| `c/cases.pairs.json` | The committed case list |
| `c/found.cases.json` | Every failing input ever found by a random run, kept for good (starts empty) |
| `c/exceptions.md` | Reviewed exceptions to the rules (starts empty) |
| `c/schema.test.js` | The input list's own rules; the count of required boxes |
| `c/invariants.js` | `checkAnswer(answer)`: rules I1–I15 |
| `c/pairs.test.js` | The list is current, every pair is present, every case passes `checkAnswer` |
| `c/properties.test.js` | M1–M4, M8–M12, M16 on random inputs |
| `c/metamorphic.test.js` | M5–M7 (couples), M13–M15 (date, market file, wall clock) |
| `oracles/fromTrace.mjs` | The headline worked out again from the months; imports nothing from `src/` |
| `oracles/ukTax.mjs` | Income tax written out by hand, including the allowance reduction; imports nothing from `src/` |
| `oracles/hmrc-income-tax-2026-27.json` | The two tables of 3.2, each row with its source and the date checked |
| `oracles/tax.test.js` | Runs the tables against `calculateTax` and against the answer's pot-to-pocket step, both directions |
| `c/trace.test.js` | Section 3.1 |
| `c/closedForm.test.js` | CF1–CF7 |
| `fixtures/c/F1-forum-guest.json`, `F2-couple.json`, `F3-retired.json` | Inputs, sentence templates, pinned answer, approval line |
| `c/fixtures.test.js` | Pinned answers and sentences; approval present; same answer under two time zones (child process, reusing `tests/fixtures/plans/clock.mjs`) |
| `states/c/*.json` | The eleven named states |
| `render/checkScreen.js` | R1–R12; used in jsdom and in the browser |
| `wording/banned.js` | The banned list by scope |
| `wording/wording.test.js` | The list run over the strings and sentence-template files as text |
| `c/render.test.js` | Every named state and the 48 core cases drawn and checked; the form round trip |
| `rail/rail.test.js` | L1–L8 |
| `rail/lockedNoWrite.test.js` | Locked corpus plans, random walks, zero writes, byte-identical |
| `boundaries.test.js` | Import rules; no clock, no `Math.random` in answers; no `__pt` in the published build; Playwright versions match; no `waitForTimeout` in `e2e/` |

**Browser** (`e2e/`)

| File | Purpose |
|---|---|
| `helpers/serve.mjs` | Static server that sends the real security headers |
| `helpers/app.js` | `open`, `ready`, pin date and market, seed a state or a guest plan, the step wrapper with its automatic checks and counters |
| `helpers/answerInNode.js` | Runs the answer in Node for the same inputs, for screen-equals-engine and sameness |
| `c-forum-guest.spec.js` | J1 and the counted first answer (published build, hooks off) |
| `c-couple.spec.js` | J2 |
| `c-retired.spec.js` | J3 |
| `crawl.spec.js` | Every station × every named state: checks, accessibility, geometry; locked plan untouched |
| `production.spec.js` | Security policy respected; no test hook |
| `old-app-unchanged.spec.js` | The current app still starts and answers |
| `keyboard.spec.js` | Tab order, focus, Enter, Escape |
| `screens.spec.js` + `screens.spec.js-snapshots/` | The 25 pictures and their baselines |
| `sameness.spec.js` | The same answers in Chromium, WebKit and Firefox |
| `axe-exceptions.json` | Accepted accessibility exceptions with reasons (starts empty) |

**Set-up**

| File | Purpose |
|---|---|
| `playwright.config.js` | Section 11.5 |
| `.github/workflows/test.yml` | Gains the `browser` job |
| `.github/workflows/nightly.yml` | The night run |
| `.github/workflows/screenshots.yml` | The approval button |
| `package.json`, `.gitignore` | Scripts, three development dependencies, two ignored folders |
| `RELEASING.md` | A short section: the browser job, how to approve pictures, the stopwatch line, the real-iPad look |

## 14. Order of writing, test first

1. `_c.js` with the function names stubbed; the input list; `schema.test.js`. (Red until the list exists.)
2. `oracles/ukTax.mjs`, the tax table, `tax.test.js`. **Red on today's code above £100,000** — fix
   `calculateTax` under its own release before going on.
3. `closedForm.test.js`, `invariants.js`, the three fixtures' inputs and sentence templates. These define the
   answer function before a line of it is written.
4. The answer function, until 3 is green. Then `fromTrace.mjs` and `trace.test.js`.
5. `pairs.mjs`, the case list, `pairs.test.js`; `arbitrary.mjs`, `properties.test.js`, `metamorphic.test.js`.
   Time ten cases; set the per-push counts.
6. `checkScreen.js`, the banned list, the named states; then the screens until `render.test.js` is green.
   `rail.test.js`, `lockedNoWrite.test.js`, `boundaries.test.js`.
7. Playwright: `serve.mjs`, `app.js`, J1 on the published build, the `browser` job in CI. Then J2, J3, crawl,
   keyboard, sameness.
8. Owner looks at the screens on a real phone; first pictures approved; `nightly.yml`.
9. Planted faults (10.3); owner's review of fixtures; the gate.

## 15. Questions this plan needs answered

1. **Fix the tax sum above £100,000 now, as its own release?** Recommended yes: it is wrong today, it is
   independent of V7, and step 2 above cannot go green without it.
2. **Is "what would you like to spend" part of question C's first screen**, as an optional extra, or does it
   wait for question D? The tests for it (M9–M12, the spending sentences) drop out cleanly if it waits.
3. **Which figure is the headline**: the middling one with the bad case beside it (as written here, and as the
   research example reads), or the bad-case one, which is the more cautious habit of the current app?
4. **The headline when guaranteed income starts later** (finding 3): is "the first phase's figure" the right
   rule, or should the screen show two figures, before and after?
5. **Someone aged 54 to 56 today and the rise in the pension access age to 57 on 6 April 2028**: with an age
   and no date of birth, the earliest age cannot always be known. Ask for the month and year of birth only in
   that band, or assume the later age and say so under "what we assumed"? The age-boundary cases need the rule.
6. **The State Pension default**: the full new rate for 2026/27 (£241.30 a week is the figure used in the
   table above; to be checked against gov.uk and the app's constant when the table is entered).
7. **Which theme is the first set of pictures taken in?**
8. **May the owner's stopwatch figure be a line in `RELEASING.md`'s checklist**, replacing any modelled
   "human seconds"?
