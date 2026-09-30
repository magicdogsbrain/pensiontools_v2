# V7 step 3 — the build brief for the first slice (question C)

**"I've got about £X — what is that a month?"** built end to end in the new shell, beside the current app,
couple-ready, with every test layer attached. Written 30 Sep 2026 against v6.15.0. Nothing here is built.

This is the one document builders follow. It settles every point on which the five specification documents
in this folder disagree. **Where this brief and another document differ, this brief wins.** The other
documents remain the detailed reference for the parts this brief points to:

| Document | Still the reference for |
|---|---|
| `architecture.md` | Why the design is what it is; the layer rules |
| `answer-C-and-household.md` | The household model (1.2–1.6), the arithmetic (2.3), warnings (2.7), worked examples (2.10) |
| `rail-screens-language.md` | The screen drawings and words (Part 2), the language guide and banned list (Part 3) |
| `test-plan-slice-C.md` | Each test's assertions (sections 1–9), CI set-up (10–11) |
| `architecture-A.md`, `architecture-B.md` | The record only. Do not build from them. |

Contents: 1 the architecture in one page · 2 every conflict and its resolution · 3 the file tree ·
4 the contracts · 5 the work packages · 6 tests written first · 7 done means · 8 out of scope ·
9 decisions waiting for the owner.

---

## 1. The architecture in one page

- **A separate page and a separate build.** `v7/index.html`, built by `vite.v7.config.js` into `docs/v7/`.
  The current app's build, page and worker are not edited. The address `/v7/` is the switch; nothing links
  to it and it is marked "do not index".
- **Preact draws the screens.** It is the only new run-time dependency. Screens are functions of the state.
  No `useState` in screens; hooks only inside `src/v7/components/` and only for focus.
- **One state object, one pure reducer.** The state survives `JSON.stringify`. Whatever was typed is held
  as typed, by field path. Effects (address, worker, session storage, clock) are the only code that touches
  the outside, and live in `src/v7/effects/`.
- **The screen works out nothing.** Every number comes from `src/answers/c/answer.js`, a pure function
  `answerC(inputs, env)` with a declared input list, `SCHEMA_C`. It returns numbers, sentences and the list
  of what was assumed. Sentences are built there, from the same numbers.
- **The answer runs in V7's own worker** (`src/v7/effects/answerWorker.js`): a first figure from 100
  futures, then the final figure from 1,000.
- **Addresses** are after the `#`: `/v7/#/`, `/v7/#/c/numbers`, `/v7/#/c/answer`. Figures never appear in
  an address. Every move between steps is an ordinary link.
- **Nothing is saved in this slice.** No sign-in, no Firebase, no saved plans. What was typed is kept in
  this tab only (`sessionStorage` key `pt_v7_draft`). A test fails the build if `src/v7/` imports
  `src/storage` or `src/firebase`.
- **Test seams**: `data-key` + `data-value` on every number; `data-testid` from field paths and step ids;
  `#app[data-ready="1"]` and a `pt:done` event; `window.__pt` in the test build only.
- **Two engine fixes ship first, outside the slice, as their own 6.x releases** (package 0): the income-tax
  sum above £100,000, and a faster tax-free branch in `planDrawdown`.

```
address ──► state ──► App(state) ──► screens/components (Preact; no arithmetic)
              ▲                            │ dispatch(action)
        reducer (pure) ◄───────────────────┘
              ▲
           effects: address · run (worker → src/answers → today's engines) · draft store · clock
```

---

## 2. Every conflict between the documents, resolved

"A", "B" = the two architecture proposals. "HH" = `answer-C-and-household.md`. "Rail" =
`rail-screens-language.md`. "Tests" = `test-plan-slice-C.md`.

### 2.1 Names and places

| # | Conflict | Decided |
|---|---|---|
| 1 | Page: `v7.html` (A) or `v7/index.html` (B) | `v7/index.html`, served at `/v7/` |
| 2 | One build with two pages (A) or two builds (B) | Two builds. `vite.v7.config.js` |
| 3 | Switch: the address (A) or a `pt_shell` browser setting (B) | The address. No `pt_shell`, no edit to `index.html` |
| 4 | Answer module: `src/answers/potToMonthly.js` (A), `src/answers/questionC.js` (B), `src/v7/answers/answerC.js` (HH) | `src/answers/c/answer.js`, exporting `answerC` |
| 5 | Input list: inside the answer file (A), `src/v7/schema/questionC.js` (B), `householdSchema` beside the model (HH), "beside the function" (Tests) | `src/answers/c/schema.js`, exporting `SCHEMA_C`. No words in it |
| 6 | Sentence templates: `src/answers/sentences.js` (A) or `src/v7/copy/` (B) | `src/answers/c/sentences.js`. Labels, help, errors and buttons: `src/v7/copy/` |
| 7 | Banned list: `src/v7/copy/banned.js` (Rail) or `tests/v7/wording/banned.js` (Tests) | `src/v7/copy/banned.js` (kept beside the words; nothing in the app imports it, so it is not shipped). Content = Rail 3.2 |
| 8 | Screens folder: `screens/` (A) or `doors/` (B) | `src/v7/screens/`. The word "door" is not used anywhere, code or screen |
| 9 | Browser tests: `tests/browser/*.spec.js` (B) or `e2e/*.spec.js` (Tests) | `e2e/` |
| 10 | Answer tests: `tests/answers/` (A, B) or `tests/v7/c/` (Tests) | `tests/v7/c/` and siblings, as Tests section 13 |
| 11 | Question id: `c` (A, B, Tests) or `C` (Rail) | Lower case `c` in every id, key, address and test id. Rail's ids become `c.head`, `c.blank` and so on |
| 12 | Step ids: one screen (A); `figures`, `answer`, `next` (B); `numbers`, `answer`, `ways`, `keep` (Rail) | Rail's four. `ways` and `keep` are on the rail but not built (section 8) |
| 13 | Addresses: `#/what-is-that-a-month` (A), `#/c/figures` (B) | `#/c/numbers`, `#/c/answer`, `#/c/ways`, `#/c/keep` |
| 14 | Worker: add messages to `engineWorker.js` (A, B); job type `answer-c` (HH) | A new V7 worker; messages `init` and `answer` with `q: 'c'`. `engineWorker.js` untouched |
| 15 | Lift `createSimulationConfigFromSettings` out of `StressRepository` now (B) | Not in this slice. `toEngine` builds the engine config directly; a test compares it with today's function on the same settings (HH 2.9 rule 3) |
| 16 | Render tests with `@testing-library/preact` and `.test.jsx` (B) or `checkScreen` in `.test.js` (Tests) | `checkScreen`, `.test.js`, Preact's own `render`. No testing library |
| 17 | Ready mark: `data-ready="1"` + `pt:done` (A), `data-ready="true"` (B), `data-busy` + `data-ready` (Rail) | `#app[data-ready="1"]` when nothing is running and the final figure is drawn, else `"0"`; and a `pt:done` event. Also `#app[data-answer="none|first|final"]` |
| 18 | Test hooks: A's list, B's list, plus `__pt.answer` (Tests) | One list, section 4.9 |
| 19 | State: `clock` + `market` (A) or `env` (B); parsed values (A) or text as typed (B) | `env`; text as typed; section 4.5 |
| 20 | Market data: pinned and sent to the worker (A, Tests) | Question C reads **no** live gilt or share prices — only the bundled market history. `env` carries no market data in this slice. Tests M14 becomes "swapping the gilt file changes nothing" |

### 2.2 The inputs

| # | Conflict | Decided |
|---|---|---|
| 21 | Shape: `you.*` / `partner.*` (A, Tests), `people[]` (B), `Household` (HH) | Two layers. The **form** uses flat paths `you.*`, `partner.*` (`SCHEMA_C`). `toHousehold(inputs, env)` turns them into HH's `Household`, which is what the arithmetic runs on and what later questions share |
| 22 | Couple switch: `couple` yes/no (A), `who` (B), `household` (Tests), "Add a partner" button (Rail) | Field `household`: `'single'` or `'couple'`, set by the "Add a partner" / "Remove" buttons |
| 23 | Final-salary fields: `hasFinalSalary` + `amount` + `startAge` (A); `yes` + `amount` + `fromAge` (B); `has` + `yearly` + `fromAge` (Tests); `amountPerYear` + `startAge` (HH) | Form: `finalSalary.has`, `.yearly`, `.fromAge`. Household: HH's names |
| 24 | State Pension: amount only (B); `included` + `yearly` + `fromAge` (Tests); full / forecast / none (Rail); derived age, editable (HH) | Form: `statePension.kind` = `full`, `forecast` or `none`; `.yearly` when `forecast`. The starting age is **worked out** from the age given, never asked, and listed under what was assumed as a rule |
| 25 | When the money starts: `stopWork` (HH), "Start taking it: now / from age" (Rail), `alreadyTaking` (Tests), absent (A, B) | Form: `start.kind` = `now` or `age`; `start.age`. No `alreadyTaking` field. Every question-C string must pass the "retired" wording rules in every state, so no flag is needed |
| 26 | Savings outside pensions: four pot boxes (HH), "Other savings you would spend" (Rail), absent (A, B, Tests) | One optional field `savings` under "Add more detail", treated as ISA money; for a couple, split evenly |
| 27 | Spending: not asked (HH), "What you expect to spend" (Rail), `spending.*` (Tests) | Not in this slice. Instead one optional number, `take` (pounds a month), from the "Try a change" row: the answer says how long that amount lasts. Tests M9–M12 and the F2/F3 spending lines are rewritten on `take` |
| 28 | Age limits: 40–90 (A), 18–100 (B, Tests, Rail), 50–90 for C (HH) | 18–100 |
| 29 | Pot of nothing: a form error (Rail) or a valid case (Tests CF4, CF6; HH) | Valid. The function handles it and returns a plain sentence; the form does not refuse it |
| 30 | Risk names: "medium", "lower" (Tests fixtures); Cautious / Balanced / Adventurous (all others) | `cautious`, `balanced`, `adventurous` = `RISK_PRESETS` in `GlidepathService.js` |
| 31 | Last-to age: `planToAge` (HH), `endAge` (Tests), `lastsTo` (Rail) | Form and result: `endAge`. Household: `planToAge` |
| 32 | Under the earliest pension age: pot grows until then (Tests) or is taken as it stands (HH) | As it stands: today's pot, today's prices, no growth and no saving, and said so (`pot-as-is`) |
| 33 | Age, or month and year of birth (HH prefers born; Rail asks age) | Age only. The birthday is taken to be today. Month and year of birth is a later addition (section 9) |

### 2.3 The result

| # | Conflict | Decided |
|---|---|---|
| 34 | Names of the three amounts: typical / bad (A); bad / middle / good (B); low / middle / high (HH); careful / middling / good (Rail); badCase / middle / good (Tests) | `monthly.careful`, `monthly.middling`, `monthly.good` |
| 35 | The headline: careful (HH, Rail) or middle (A, B, Tests) | **Careful**: the most that lasted to `endAge` in 9 futures out of 10 |
| 36 | "Good": lasted in 1 future in 4 (HH) or the best 1 in 10 (Rail, Tests) | 1 in 10, so "good case" has one meaning everywhere and mirrors "bad case". One constant (`BAND`) changes it |
| 37 | Shape of the income: a level household amount, with the pot paying more before the State Pension (HH); a level amount from the pot with the total stepping up (Rail drawing); "first phase's total" (Tests) | HH's: a **level household take-home** at today's prices. Guaranteed income fills it first; the pots pay the rest. Where guaranteed income later exceeds the figure, later years are higher, never lower |
| 38 | Headline words: "from your pot" (Rail) | Dropped, because the figure includes the State Pension once it starts. Section 4.4 has the templates |
| 39 | Breakdown: `madeOf` by period (HH), `parts[]` (Rail), `phases[]` (Tests) | `phases[]`, for the careful amount |
| 40 | Assumptions: `{id, text, value}` (A), `{field, text}` (B), `{id, sentence, changeAt}` (HH), `assumptions[]` (Rail), `{id, field, text, value, source}` (Tests) | `assumed[]` = `{ id, field, source, value, text, parts }`; ids from HH 2.5 |
| 41 | Run-out age: `lastsToAge.*` (HH), `badRunOutAge` (Rail), `runOutAge.bad` (Tests) | `runOutAge.careful`, `.middling`, `.good` — each the age in a bad case (the worst 1 in 10) |
| 42 | Rounding: down to £10 (HH, Tests); nearest £10 from £1,000, nearest £5 below, careful down (Rail) | The three solved amounts are whole multiples of £10, rounded **down**. Other monthly figures the answer derives: nearest £10 from £1,000, nearest £5 below. Figures fixed by rule or typed are exact |
| 43 | Sentences as plain text (all) against "no digit on screen without a `data-key`" (Tests R3) | A sentence is `{ id, text, parts }`; figures inside it are references the screen wraps in `data-key` / `data-value`. Section 4.3 |
| 44 | Chart series in the result (B) or not (HH) | No chart in this slice |
| 45 | Comparison with living standards (HH `comparedWith`) | Not in this slice (not on Rail's screen) |
| 46 | Charges: "Charges of 0.5% a year" chip (Rail drawing) or none modelled (HH) | None modelled. Assumed line `no-charges` |
| 47 | Full State Pension: £12,500 (Rail drawing), £241.30 a week (HH, Tests) | One constant in `src/answers/shared/rules.js`, checked against gov.uk before it is committed |
| 48 | Seed: `i × 7919 + 3` fixed (HH) or `env.seed` (Tests) | Future `i` of seed `s` uses `(s × 100003 + i) × 7919 + 3`. The published seed is 0, which gives HH's formula and so the same futures as the strategy comparison |
| 49 | Number of futures: default 1,000 inside the function (HH); always from `env` (Tests) | Always from `env.futures`. The runner asks for 100 then 1,000. Tests use 40 |
| 50 | Wait budget: answer ready in 3 s (Tests J1, B) or first figure 3 s, final 15 s (HH) | HH's: first figure 3 s, final 15 s, processor slowed four times |

### 2.4 The screens and the rail

| # | Conflict | Decided |
|---|---|---|
| 51 | Test id of a headline: `headline-c.monthly.middle` (B), `data-headline="C.monthly.careful"` (Rail), `data-key` (A, Tests) | `<section data-headline="monthly.careful">`; numbers carry `data-key="monthly.careful"`; the screen root carries `data-question="c"` |
| 52 | Input test ids: `c.you.pot` (A, Tests) or from the declaration (B) | `data-testid="c.<path>"`, e.g. `c.you.pot` |
| 53 | A, B, D, E, F on the front door: open the current app (Rail) or an honest "coming" screen (Tests L6) | Each opens `#/soon/<letter>`: one sentence that it is not built in the preview yet, a link to the current version, and a way back |
| 54 | "Answer in full detail" goes to question E (Rail) | The button is present and opens `#/soon/e` |
| 55 | "Way of taking it" in the try-a-change row (Rail) | Left out of the row in this slice |
| 56 | Life stage words from `LifeStage.js` (B reuses labels; Rail bans them) | `deriveStage` is not called in this slice (there is no plan). Rail rule R9 stands for later slices |
| 57 | Locked-plan "zero writes" test through the shell's loading path (Tests 6) against no plan loading in the slice | Replaced for this slice by: the import rule (V7 cannot import the save code) and a browser check that a locked fixture in today's guest storage is byte-identical after every V7 address is visited. The full random-walk test arrives with plan loading |
| 58 | Themes: dark and light from the start (B) or one (Tests) | One theme: tokens copied from today's app. The second waits |
| 59 | "No digit outside `data-value`" on the whole screen (Tests R3) against words that contain figures ("aged 50 or over", "Step 2 of 4") | R3 applies inside `[data-region="answer"]` only. `ADVICE_FULL` sits in the footer region |

---

## 3. The file tree to create

`(stub)` = created by package 1 in a minimal form so others can build against it, then owned by the package
named. Nothing outside this tree is created. Files edited are listed at the end.

```
v7/
  index.html                         P1   <div id="app">, one module script, noindex; nothing inline
vite.v7.config.js                    P1
playwright.config.js                 P5

src/answers/
  index.js                           P1   export const ANSWERS = { c: { schema: SCHEMA_C, answer: answerC } }
  shared/
    contract.js                      P1   JSDoc types only: Env, Sentence, Assumed, Warning, Phase, AnswerC
    rules.js                         P1   UK figures the answers use (4.2)
    validate.js                      P1   defaults, fieldsThatApply, parseDraft, validate
    format.js                        P1   money, shownMonthly, outOfTen, ageText
    household.js                     P2   Household type, expandHousehold, validateHousehold, statePensionAge,
                                          pensionAccessAge, householdStart
    toEngine.js                      P2   toEngine(household, takeHomeAYear, env) → one engine config per person
    futures.js                       P2   futureReturns(i, years, env)
    band.js                          P2   mostPerFuture, bandFrom, badCaseAge
  c/
    schema.js                        P1   SCHEMA_C (complete)
    toHousehold.js                   P2   toHousehold(inputs, env) → Household
    answer.js                        P2   (stub) answerC(inputs, env)
    sentences.js                     P2   the templates of 4.4 and sentencesFor(result)

src/v7/
  main.jsx                           P3   (stub) start-up
  App.jsx                            P4   (stub) state → the right screen
  state/
    initial.js                       P1→P3  initialState({ today, build, draft })
    actions.js                       P1→P3  the action list of 4.6, as documented constants
    reduce.js                        P3
    select.js                        P3   pure readers: parsedDraft, currentKey, isCurrent, stepStates
    inputsKey.js                     P3
  router/
    routes.js                        P1→P3  ROUTES, parse, format
  rail/
    questions.js                     P1→P3  the six questions for the front door
    c.js                             P1→P3  QUESTION_C (4.7)
    index.js                         P3   railFor(state)
  effects/
    index.js                         P3   startEffects(store)
    store.js                         P3   createStore(initial, reduce)
    address.js                       P3
    run.js                           P3   the runner: first pass, final pass, stale results dropped
    workerClient.js                  P3
    answerWorker.js                  P3
    draftStore.js                    P3   sessionStorage key pt_v7_draft
    clock.js                         P3   the only read of the real date
  testing/
    hooks.js                         P3   window.__pt (test build only)
  components/
    index.js  Shell.jsx  Rail.jsx  Field.jsx  PersonBlock.jsx  Money.jsx  Sentence.jsx  Headline.jsx
    MadeOf.jsx  Assumed.jsx  TryAChange.jsx  Working.jsx  Problem.jsx  Button.jsx          P4
  screens/
    index.js  FrontDoor.jsx  Soon.jsx  NotBuilt.jsx  c/NumbersScreen.jsx  c/AnswerScreen.jsx   P4
  copy/
    common.js                        P4   header, footer, ADVICE_SHORT, ADVICE_FULL, preview line, buttons
    c.js                             P4   labels, help, errors, next sentences for question C
    banned.js                        P4   Rail 3.2, as data
  styles/
    tokens.css  base.css  components.css                                                   P4

tests/v7/
  c/_c.js                            P1   the adapter (4.10)
  c/schema.test.js                   P1
  boundaries.test.js                 P1   the import rules; no clock or Math.random in answers
  shellRatchet.test.js               P1   index.html's inline script may only get shorter
  liveBundle.test.js                 P1   vite.config.js still has exactly one input and the same output names
  stubs/c-result.json                P1   a hand-made AnswerC (figures of HH example 1) for the stub
  shared/validate.test.js  shared/format.test.js                                           P1
  c/invariants.js  c/closedForm.test.js  c/fixtures.test.js  c/trace.test.js
  c/pairs.test.js  c/properties.test.js  c/metamorphic.test.js  c/feedback.slow.test.js
  c/cases.pairs.json  c/found.cases.json  c/exceptions.md                                  P2
  household.test.js                  P2
  gen/pairs.mjs  gen/build-cases.mjs  gen/arbitrary.mjs                                    P2
  oracles/ukTax.mjs  oracles/fromTrace.mjs  oracles/hmrc-income-tax-2026-27.json  oracles/tax.test.js   P2
  fixtures/c/F1-forum-guest.json  F2-couple.json  F3-retired.json                          P2
  shell/reduce.test.js  shell/routes.test.js  shell/select.test.js  shell/run.test.js
  shell/draftStore.test.js  shell/worker.test.js                                           P3
  rail/rail.test.js                  P3
  render/checkScreen.js  c/render.test.js  c/roundTrip.test.js
  wording/wording.test.js  styles/contrast.test.js
  states/c/*.json  states/build-states.mjs                                                 P4
  e2eRules.test.js                   P5   no waitForTimeout in e2e/; Playwright version = container tag

e2e/                                 P5
  helpers/serve.mjs  helpers/app.js  helpers/answerInNode.js
  c-forum-guest.spec.js  c-couple.spec.js  c-retired.spec.js  crawl.spec.js  production.spec.js
  old-app-unchanged.spec.js  keyboard.spec.js  screens.spec.js  sameness.spec.js  axe-exceptions.json

.github/workflows/nightly.yml  .github/workflows/screenshots.yml                           P5
```

**Existing files edited, and by whom — nobody else touches them**

| File | Package | Change |
|---|---|---|
| `package.json` | P1 | dependencies `preact`; dev `fast-check`, `@playwright/test` (exact version), `@axe-core/playwright`; scripts `build` (adds the V7 build after `stamp-sw`), `build:v7`, `dev:v7`, `e2e:build`, `e2e`, `e2e:approve`, `v7:cases`. P0 changes only the `version` line |
| `vite.config.js` | P1 | `esbuild` gains `jsx: 'automatic', jsxImportSource: 'preact'` (so tests can read `.jsx`). Nothing else |
| `.gitignore` | P1 | `test-results/`, `playwright-report/` |
| `public/_headers` | P1 | add a block `/v7/*` → `X-Robots-Tag: noindex` |
| `.github/workflows/test.yml` | P5 | the `browser` job |
| `RELEASING.md` | P5 | browser job, approving pictures, the stopwatch line, the real-phone look |
| `tests/determinism.test.js` | P1 | extend the existing scan to `src/answers/` (or do it in `boundaries.test.js` and leave this file alone — preferred) |
| `src/services/TaxCalculator.js`, `src/services/DrawdownStrategy.js`, their tests, `src/releases.js` | P0 | the two engine fixes |

Not edited by anyone in this slice: `index.html`, anything under `src/workers/`, `src/storage/`,
`src/firebase/`, `src/ui/`, `src/strategies/`, and every `src/services/` file except the two in package 0.

---

## 4. The contracts

### 4.1 The input list — `src/answers/c/schema.js`

```js
// No words here. Labels, help and error sentences are in src/v7/copy/c.js, keyed by path.
export const SCHEMA_C = {
  id: 'c',
  fields: [
    { path: 'household', type: 'choice', options: ['single', 'couple'], default: 'single', group: 'who' },

    { path: 'you.pot', type: 'money', min: 0, max: 10_000_000, required: true, group: 'you',
      boundaries: [0, 1, 10_000, 30_000, 250_000, 1_073_100, 3_000_000, 10_000_000] },
    { path: 'you.age', type: 'age', min: 18, max: 100, required: true, group: 'you',     // never a default
      boundaries: [18, 40, 54, 55, 56, 57, 66, 67, 68, 75, 90, 100] },

    { path: 'start.kind', type: 'choice', options: ['now', 'age'], default: { rule: 'startKind' }, group: 'you' },
    { path: 'start.age', type: 'age', min: 18, max: 100, default: { rule: 'startAge' },
      when: { 'start.kind': 'age' }, group: 'you', boundaries: [55, 57, 60, 67] },

    { path: 'you.statePension.kind', type: 'choice', options: ['full', 'forecast', 'none'], default: 'full', group: 'you' },
    { path: 'you.statePension.yearly', type: 'money', min: 0, max: 20_000, required: true,
      when: { 'you.statePension.kind': 'forecast' }, group: 'you', boundaries: [0, 1, 6_000, 12_570, 12_571, 20_000] },

    { path: 'you.finalSalary.has', type: 'yesNo', default: false, group: 'you' },
    { path: 'you.finalSalary.yearly', type: 'money', min: 1, max: 200_000, required: true,
      when: { 'you.finalSalary.has': true }, group: 'you', boundaries: [1, 9_000, 12_570, 50_270, 100_000, 125_140, 200_000] },
    { path: 'you.finalSalary.fromAge', type: 'age', min: 50, max: 75, required: true,
      when: { 'you.finalSalary.has': true }, group: 'you', boundaries: [50, 55, 60, 65, 67, 75] },

    // The partner block: every field also has  when: { household: 'couple' }.
    { path: 'partner.age', type: 'age', min: 18, max: 100, required: true, when: { household: 'couple' }, group: 'partner',
      boundaries: [18, 54, 57, 62, 70, 100] },
    { path: 'partner.pot', type: 'money', min: 0, max: 10_000_000, default: 0, when: { household: 'couple' }, group: 'partner',
      boundaries: [0, 150_000, 1_073_100] },
    { path: 'partner.statePension.kind', type: 'choice', options: ['full', 'forecast', 'none'], default: 'full',
      when: { household: 'couple' }, group: 'partner' },
    { path: 'partner.statePension.yearly', type: 'money', min: 0, max: 20_000, required: true,
      when: { household: 'couple', 'partner.statePension.kind': 'forecast' }, group: 'partner' },
    { path: 'partner.finalSalary.has', type: 'yesNo', default: false, when: { household: 'couple' }, group: 'partner' },
    { path: 'partner.finalSalary.yearly', type: 'money', min: 1, max: 200_000, required: true,
      when: { household: 'couple', 'partner.finalSalary.has': true }, group: 'partner' },
    { path: 'partner.finalSalary.fromAge', type: 'age', min: 50, max: 75, required: true,
      when: { household: 'couple', 'partner.finalSalary.has': true }, group: 'partner' },

    // "Add more detail" — all optional, each with a default that is listed under what was assumed.
    { path: 'savings', type: 'money', min: 0, max: 10_000_000, default: 0, group: 'more', boundaries: [0, 1, 150_000] },
    { path: 'risk', type: 'choice', options: ['cautious', 'balanced', 'adventurous'], default: 'balanced', group: 'more' },
    { path: 'endAge', type: 'age', min: 75, max: 105, default: 95, group: 'more', boundaries: [75, 95, 100, 105] },

    // "Try a change" — optional; never on the numbers step.
    { path: 'take', type: 'money', min: 0, max: 50_000, default: null, group: 'try', boundaries: [0, 1, 1_000, 50_000] }
  ],
  rules: [
    { id: 'start-not-before-now',    fields: ['start.age', 'you.age'] },   // start.age >= you.age
    { id: 'start-not-before-access', fields: ['start.age', 'you.age'] },   // start.age >= the earliest pension age, when you.pot > 0
    { id: 'end-after-start',         fields: ['endAge'] }                  // endAge > the younger person's age at the start
  ],
  defaultRules: {
    // startKind: 'now' if you.age is at or past the earliest pension age on env.today (or you.pot is 0); else 'age'
    // startAge:  the earliest pension age for this person (55 before 6 April 2028, 57 from then; birthday taken as today)
  }
};
```

A single person must type **two** things (`you.pot`, `you.age`); a couple, three (`partner.age` too;
`partner.pot` starts at 0). A test counts them; the limit is five.

The checked inputs (what `answerC` receives) are the same paths as a nested object, with fields that do not
apply removed and defaults filled in:

```js
{ household: 'single', you: { pot: 250000, age: 58, statePension: { kind: 'full' }, finalSalary: { has: false } },
  start: { kind: 'now' }, savings: 0, risk: 'balanced', endAge: 95, take: null }
```

`src/answers/shared/validate.js` (pure; the only place a limit is checked):

```js
defaults(schema, values, env)            // → { [path]: value } for every field that applies and has a default
fieldsThatApply(schema, values)          // → field[]; a field applies when every entry of its `when` matches
parseDraft(schema, draftValues, env)     // text as typed → { ok, inputs, errors: { [path]: messageId }, usedDefault: path[] }
validate(schema, inputs, env)            // checked inputs → { ok, errors }
// messageIds: 'required', 'notANumber', 'tooLow', 'tooHigh', and each rule id above.
// Money text accepts "£", commas and spaces. Ages are whole years.
```

### 4.2 Rules the answers use — `src/answers/shared/rules.js`

```js
export const RULES = {
  taxYear: '2026/27',
  fullStatePensionWeekly: 241.30,      // UNVERIFIED — check against gov.uk before committing; yearly = weekly × 52
  pensionAccess: { before: 55, from: 57, changesOn: '2028-04-06' },
  taxFreeShare: 0.25,
  taxFreeLimit: 268275,                // = LUMP_SUM_ALLOWANCE in PensionAccess.js; a test asserts they are equal
  personalAllowance: 12570, basicRateLimit: 50270, higherRateLimit: 125140,   // asserted equal to TAX_DEFAULTS
  maxYears: 45,
  smallPot: 30000
};
export const BAND = { careful: 0.9, middling: 0.5, good: 0.1 };   // the share of futures each amount must last in
```

### 4.3 The answer function — `src/answers/c/answer.js`

```js
/**
 * Pure. Same inputs and env → the same result on every device. Reads no clock, storage, network or screen.
 * Never throws for a bad value: returns status 'invalid' with the problems.
 * @param {object} inputs  checked inputs (4.1). Unchecked inputs are checked here again.
 * @param {Env} env
 * @returns {AnswerC}
 */
export function answerC(inputs, env) {}

// Env
{ today: '2026-09-30',          // required; never defaulted
  futures: 1000,                // required; the runner passes 100 then 1000; tests pass 40
  seed: 0,                      // optional, default 0
  trace: false,                 // optional; true adds `trace`
  onProgress: (done, total) => {},            // optional
  futureReturns: (i, years) => returns }      // optional, tests only: replaces the futures (closed-form cases)
```

**The arithmetic is HH section 2.3**, with these changes:

1. Inputs arrive as `SCHEMA_C` inputs; `toHousehold(inputs, env)` builds the `Household` (HH 1.2) and
   `expandHousehold` fills the rest. Mapping: `you.pot` → `people[0].pots.pension`; `savings` → ISA money
   (a couple: half each); `start.kind: 'now'` → `stopWork: { kind: 'already' }`, otherwise
   `{ kind: 'age', age }`, the partner starting at the same time; `statePension.kind: 'none'` → amount 0;
   `finalSalary` → HH's list of one, `increases: 'pricesCapped5'`; `age` → born, the birthday being today.
2. Futures come from `futures.js`: future `i` is `bootstrapPaths((seed × 100003 + i) × 7919 + 3, years × 12)`
   then `annualNominal(...)`, unless `env.futureReturns` is given. The list depends only on `seed`, `futures`
   and the number of years — never on any amount.
3. People are put in a fixed order by content before any run (HH 2.3 step 3).
4. For each future, the most the household could take (`mostPerFuture`), searched to £10 a month. Sort those
   `N` figures upwards into `s[0..N-1]`. Then, each rounded down to a whole £10:
   `careful = s[floor(N/10)]`, `middling = s[floor(N/2)]`, `good = s[N − ceil(N/10)]`.
   So the careful amount fails in at most `floor(N/10)` futures. That is the one definition of "a bad case".
5. `runOutAge.x`: run every future at amount `x`; take each future's run-out age (the younger person's age;
   `endAge` if it never runs out); sort upwards; take the entry at position `floor(N/10)`.
6. `take`, when given: one run of every future at that amount → `take.lasted`, `take.runOutAge`.
7. No pots at all: skip the search; the three amounts are the guaranteed take-home; status `guaranteed-only`
   (or `none` when there is no guaranteed income either). This is a named test case.
8. The default way of taking the money is fixed: today's `pots-and-valves` engine with its automatic cut
   switched off (`disableProtection: true`), a quarter of each pension withdrawal tax-free (`ufpls`), tax
   bands rising with prices. No live gilt or share data is read.
9. If the start is before a pension holder can touch the pension, the start moves to the first date they can
   and warning `pension-locked` is added (HH 2.7).

**The result**

```js
// AnswerC — plain data: no functions, no Dates, nothing undefined. JSON.stringify-safe.
{
  status: 'ok' | 'invalid' | 'guaranteed-only' | 'none',
  problems: [ { field, messageId } ],                 // only when 'invalid'; then nothing below is present

  inputs: { … },                                      // as used, defaults filled in

  monthly:   { careful, middling, good },             // £ a month, after tax, today's prices, household; whole £10
  yearly:    { careful, middling, good },             // monthly × 12
  lasted:    { careful, middling, good },             // share of futures that lasted to endAge, 0–1
  runOutAge: { careful, middling, good },             // in a bad case; whole years; careful = endAge by construction
  whose: 'you' | 'partner',                           // whose age the ages refer to (the younger; 'you' when single)

  guaranteed: { monthlyAfterTax },                    // State Pension and final-salary pension once all have started

  phases: [ {                                         // for the careful amount; in order, no gaps
    fromAge, toAge,                                   // ages of `whose`; toAge of the last = endAge
    ages: { you: { from, to }, partner?: { from, to } },
    takeHome, fromPension, fromSavings, fromPots,     // raw, £ a month, today's prices; fromPots = fromPension + fromSavings
    statePension, finalSalary, tax,                   // before tax; tax on all of it
    byPerson: [ { who, statePension, finalSalary, fromPension, fromSavings, tax, takeHome } ],
    beforeStatePension: boolean,
    shown: { takeHome, fromPots, statePension, finalSalary }   // whole pounds for display, which add up exactly
  } ],

  take: null | { perMonth, lasted, runOutAge, covered },       // covered = lasted >= 0.9

  assumed:  [ Assumed ],                              // every default and rule used, in the fixed order of HH 2.5
  warnings: [ { id, severity: 'note' | 'important', text, parts } ],   // ids and wording: HH 2.7
  sentences: { head, sub, line, bad, range, madeOf: [Sentence], take?, small?, none?, nothing? },

  basis: { today, futures, seed, failuresAllowed,     // failuresAllowed = floor(futures / 10)
           historyEnd,                                // last month of bundled market history ('YYYY-MM')
           engineVersion,                             // APP_VERSION from src/constants.js
           startAge, endAge, accessAge, start: 'YYYY-MM', years,
           split: [ { who, share } ], strategyId: 'pots-and-valves', cutsSwitchedOff: true },
  units: { money: 'todays-prices', tax: 'after-tax', period: 'month', who: 'household' },

  trace?: {                                           // only when env.trace
    atCareful:  { futureId, rows: [Row] },            // the bad-case future, run at the careful amount
    atMiddling: { futureId, rows: [Row] },            // the bad-case future at the middling amount
    futures: [ { id, most, runOutMonth: { careful, middling, good } } ]   // null = never
  }
}

// Row — one month for one person, in pounds of that month (Tests 0.3)
{ who, m, age, potStart, growth, draw, taxFree, taxable, statePension, finalSalary, tax, afterTax, potEnd, priceIndex }

// Sentence — `text` is what a person reads; `parts` lets the screen mark each figure.
{ id: 'c.head',
  text: 'About £1,380 a month',
  parts: [ 'About ', { key: 'monthly.careful', kind: 'money' }, ' a month' ] }
// A part is a string, { key, kind: 'money' | 'age' }, or { fixed: '9' } for a count the answer itself wrote.
// `key` is a dotted path into this result ('monthly.careful', 'phases.1.shown.fromPots', 'inputs.you.pot').
// Rule: text === the parts joined, with each key formatted by format.js. A test asserts it.

// Assumed
{ id: 'state-pension-full', field: 'you.statePension.kind' | null, source: 'default' | 'entered' | 'rule',
  value: 12547.6 | 'balanced' | null, text, parts }
```

`src/answers/shared/format.js` — the one formatter, used by the sentences and by the screen's `Money`:

```js
money(n)          // 1380 → '£1,380'; whole pounds; never a minus, never pence; 0 → '£0'
shownMonthly(n)   // a derived monthly figure → nearest £10 from £1,000, nearest £5 below
ageText(n)        // 95 → '95'
outOfTen(share)   // Rail 3.4 "Counting out of 10" → { words: 'in 9 futures out of 10', only: false }
```

### 4.4 The sentences — `src/answers/c/sentences.js`

These replace Rail 3.3's question-C rows and Tests section 4's sentence drafts. `{…}` are keys of the result.
Every string here must pass the banned list in every state, including the "retired" rules: no stop-work
words, no length of time to wait, "guaranteed" never appears (say "your State Pension" and "your
final-salary pension").

| Id | Template |
|---|---|
| `c.head` | About {monthly.careful} a month |
| `c.sub` | after tax, from {now / age N} until you are {endAge}, going up each year with prices |
| `c.sub.couple` | after tax, for the two of you, from {now / when you are N} until the younger of you is {endAge}, going up each year with prices |
| `c.line` | With {sources}, you could have about {monthly.careful} a month after tax, from {now / age N} until you are {endAge}. That amount lasted in 9 futures out of 10. |
| `c.line.couple` | With {sources}, the two of you could have about {monthly.careful} a month after tax, from {now / when you are N} until the younger of you is {endAge}. That amount lasted in 9 futures out of 10. |
| `{sources}` | built from what was given, joined with commas and "and": "a pot of {inputs.you.pot}" · "pots of {inputs.you.pot} and {inputs.partner.pot}" · "savings of {inputs.savings}" · "your State Pension" / "your State Pensions" · "your final-salary pension" |
| `c.bad` | In a bad case (the worst 1 in 10), {monthly.careful} a month only just lasts to {endAge}. If you took {monthly.middling} a month instead, a bad case would run out at age {runOutAge.middling}. |
| `c.bad.after` | (added when `guaranteed.monthlyAfterTax` > 0) After that you would have {guaranteed.monthlyAfterTax} a month from your State Pension[ and your final-salary pension]. |
| `c.range` | You could take: careful {monthly.careful}, middling {monthly.middling}, good {monthly.good} a month. |
| `c.madeOf.pots` | Until {the next phase's fromAge}: {shown.takeHome} a month, all from your {pot / pots / pot and savings}. (If it is the only phase: "All of it comes from your {pot / pots / pot and savings}.") |
| `c.madeOf.mixed` | From {fromAge}: {shown.statePension} State Pension[ + {shown.finalSalary} final-salary pension] + {shown.fromPots} from your {pot / pots}. |
| `c.madeOf.paid` | (State Pension already being paid) Your State Pension ({shown.statePension} a month)[ + {shown.finalSalary} final-salary pension] + {shown.fromPots} from your {pot / pots}. |
| `c.madeOf.tax` | (only when tax is not nought) Tax of {tax} a month is already taken off. |
| `c.take` | Taking {take.perMonth} a month, the money lasted to {endAge} {outOfTen(take.lasted)}. In a bad case (the worst 1 in 10) it would run out at age {take.runOutAge}. |
| `c.take.fine` | Taking {take.perMonth} a month, the money lasted to {endAge} in every future we tried, including the bad cases (the worst 1 in 10). |
| `c.small` | A pot of {inputs.you.pot} is small to spread over {basis.years} years. Many people with a pot this size take it as one or a few lump sums instead. |
| `c.none` | With these figures there is no monthly amount that lasts to {endAge}. Try a later start age or a shorter time. |
| `c.nothing.pensions` | (`guaranteed-only`) There is no pot to draw on, so this is your State Pension[ and your final-salary pension] only: {guaranteed.monthlyAfterTax} a month after tax. |
| `c.nothing` | (`none`) With no pot and no pension income there is nothing to work out here. If your money is in ISAs or cash, put it under "Add more detail". |

Couples name the person by "you" and "your partner". The three fixtures' sentences (F1, F2, F3) are generated
from these templates by the first green run, pinned letter for letter, and approved once by the owner.

Assumed lines: ids and wording from HH 2.5, with two changes: `risk-balanced` becomes `risk` with the Rail
3.1 wording for each level ("Balanced: about half in shares"), and `tax-rules` reads "Tax rules for 2026/27
in England, Wales and Northern Ireland, with allowances rising with prices." A line with `source: 'default'`
always has a `field`; a line with `source: 'rule'` may have `field: null`.

### 4.5 The state — `src/v7/state/initial.js`

```js
{
  route:   { screen: 'front' | 'step' | 'soon' | 'notFound', q: null | 'a'…'f', step: null | string,
             planId: null, focus: null | string },
  env:     { today: '2026-09-30', build: 'prod' | 'test', appVersion: '6.15.0', historyEnd: null | '2023-12' },
  session: { kind: 'none' },                       // fixed in this slice
  plan:    null,                                   // fixed in this slice
  draft:   { c: { values: { [path]: string | boolean },   // text exactly as typed; choices as their option; yes/no as boolean
                  touched: [ path ],                       // fields that have been left
                  asked: false } },                        // "Show what it pays" has been pressed
  answers: { c: { status: 'idle' | 'working' | 'first' | 'final' | 'failed',
                  inputsKey: null | string,        // the inputs `result` was worked out from
                  result: null | AnswerC,
                  before: null | { monthly: { careful } },   // the previous final answer, for "Before / Now"
                  progress: null | { done, total },
                  slow: false } },                 // set after 5 seconds of working
  ui:      { railOpen: false, open: [ 'partner' | 'more' | 'assumed' | 'madeOf' | 'allAssumed' ], online: true }
}
```

Pure readers in `state/select.js` (screens may call these; they do no money arithmetic):

```js
parsedDraft(state, 'c')     // → parseDraft(SCHEMA_C, state.draft.c.values, state.env)
currentKey(state, 'c')      // → inputsKey(parsed.inputs, state.env) or null when not ok
isCurrent(state, 'c')       // → answers.c.inputsKey === currentKey
errorsToShow(state, 'c')    // → { [path]: messageId } for fields that are touched, or all when draft.c.asked
```

`inputsKey(inputs, env)` = a stable text of the checked inputs (sorted keys) + `env.today` +
`env.appVersion`. It does not include `futures`: the first and final passes share a key.

### 4.6 Actions — `src/v7/state/actions.js`

| Action | Effect on the state |
|---|---|
| `{ type: 'route/set', route }` | replaces `route`; closes the rail sheet |
| `{ type: 'draft/set', q, path, value }` | sets one typed value. Setting `household` to `single` keeps the partner's values (so "Remove" then "Add" loses nothing) |
| `{ type: 'draft/touch', q, path }` | adds to `touched` |
| `{ type: 'draft/ask', q }` | sets `asked: true`; if the draft parses, also sets `route` to the `answer` step |
| `{ type: 'draft/reset', q }` | empties the draft and the answer |
| `{ type: 'answer/working', q, inputsKey }` | `status: 'working'`; keeps the old `result` on screen (greyed); copies the old final careful amount into `before` |
| `{ type: 'answer/progress', q, inputsKey, done, total }` | ignored unless `inputsKey` is the one being worked on |
| `{ type: 'answer/first', q, inputsKey, result }` | `status: 'first'`, stores the result. Ignored if the key is stale |
| `{ type: 'answer/final', q, inputsKey, result }` | `status: 'final'`. Ignored if the key is stale |
| `{ type: 'answer/failed', q, inputsKey }` | `status: 'failed'`; the draft is untouched |
| `{ type: 'answer/slow', q }` | `slow: true` |
| `{ type: 'answer/retry', q }` | clears `inputsKey` so the runner starts again |
| `{ type: 'ui/toggle', id }` | adds or removes `id` in `ui.open` |
| `{ type: 'ui/rail', open }` | the phone rail sheet |
| `{ type: 'ui/online', online }` | |
| `{ type: 'env/set', patch }` | start-up and the test hook only |
| `{ type: 'state/replace', state }` | the test hook only |

No action can change `plan` or `session` in this slice. The reducer throws on an unknown action type in the
test build and ignores it in the published build.

### 4.7 The rail — `src/v7/rail/c.js`, `questions.js`, `index.js`

```js
// rail/c.js
export const QUESTION_C = {
  id: 'c',
  steps: [
    { id: 'numbers', optional: false, built: true,  end: false, needs: [] },
    { id: 'answer',  optional: false, built: true,  end: false, needs: ['you.pot', 'you.age'] },
    { id: 'ways',    optional: true,  built: false, end: false, needs: ['answer'] },
    { id: 'keep',    optional: true,  built: false, end: true,  needs: ['answer'] }
  ]
};
// Labels, short labels and the next sentences are in copy/c.js under the same ids
// (Rail 1.4: "What have you got?" / "Your numbers", "What does it pay a month?" / "What it pays", …).

// rail/questions.js — the front door, in order
export const QUESTIONS = [ { id: 'a', built: false }, { id: 'b', built: false }, { id: 'c', built: true },
                           { id: 'd', built: false }, { id: 'e', built: false }, { id: 'f', built: false } ];

// rail/index.js — pure
railFor(state) → {
  question: 'c',
  steps: [ { id, state: 'current' | 'done' | 'open', optional, built, href,
             result: null | Sentence } ],          // numbers: what was typed ("£250,000, age 58");
                                                   // answer: "about £1,380 a month" from the result
  position: { n: 2, of: 4 },
  next: { id: 'c.blank' | 'c.fix' | 'c.ready' | 'c.working' | 'c.failed' | 'c.answered',
          button: null | { labelId, href } | { labelId, action } }
}
```

Exactly one step is `current`; exactly one next sentence applies (first match in the order of Rail 1.4's
table: failed, working, blank, fix, ready, answered). `try-only`, `hidden` and the "kept" sentences are not
built in this slice. An unbuilt step opens `NotBuilt`: "This step is not in the preview yet." with a link
back to the answer. No step is ever blocked: `#/c/answer` with nothing typed shows the two-box form of Rail
2.4 on that step.

### 4.8 Addresses — `src/v7/router/routes.js`

| Address | `route` | Screen |
|---|---|---|
| `#/` (or empty) | `{ screen: 'front' }` | `FrontDoor` |
| `#/c/numbers` | `{ screen: 'step', q: 'c', step: 'numbers' }` | `c/NumbersScreen` |
| `#/c/answer` | `{ screen: 'step', q: 'c', step: 'answer' }` | `c/AnswerScreen` |
| `#/c/ways`, `#/c/keep` | `{ screen: 'step', q: 'c', step }` | `NotBuilt` |
| `#/soon/a` … `#/soon/f` (not `c`) | `{ screen: 'soon', q }` | `Soon` |
| any of the above + `?focus=<field path>` | the same with `focus` set | the same, with that field focused (opening its block if closed) |
| anything else, including `#/plan/…` | `{ screen: 'notFound' }` | `FrontDoor` with one line: "We could not find that page. Here are the questions." |

```js
parse(hash)   → route          // pure; unset fields are null
format(route) → hash           // pure; format(parse(h)) === h for every row above; parse(format(r)) deep-equals r
```

`effects/address.js`: on `hashchange`, dispatch `route/set` with `parse(location.hash)`. After every state
change, if `format(state.route) !== location.hash`, set `location.hash`. Nothing else reads or writes the
address. No figure ever appears in one; a test formats every route reachable from a state full of figures and
checks the text holds no digit.

### 4.9 What the page carries for tests, and the hooks

| On the page | Rule |
|---|---|
| `#app` | `data-ready="1"` only when no run is under way and any answer shown is final; else `"0"`. `data-answer="none" \| "first" \| "final"`. A `pt:done` event (bubbling) each time `data-ready` becomes `"1"` |
| Screen root | `data-screen="front" \| "c.numbers" \| "c.answer" \| "soon" \| "notBuilt"`, `data-question="c"` |
| Regions | `data-region="rail" \| "form" \| "answer" \| "next" \| "footer"` |
| Every number from the answer | `<span data-key="monthly.careful" data-value="1380">£1,380</span>` — drawn only by `Money` and `Sentence`. `data-value` is the raw value at that key; the text is `format.js`'s |
| Counts the answer wrote ("9", "10") | `<span data-fixed>` |
| Headline | `<section data-headline="monthly.careful">` holding the number, `[data-sentence="monthly.careful"]` (the `c.line` sentence), the `c.bad` sentence, `ADVICE_SHORT`, and `[data-assumed]` |
| What was assumed | `[data-assumed]` with one `[data-assumed-id="<id>"]` per entry of `result.assumed`, in order; entries with a `field` hold a link to `#/c/numbers?focus=<field>` with `data-testid="assumed.<id>.change"` |
| Inputs | `data-testid="c.<path>"` (radio options: `c.<path>.<option>`); `id` = the same; a real `<label for>` |
| Field errors | `data-error-for="c.<path>"` |
| Buttons and links | `c.action.show`, `c.action.addPartner`, `c.action.removePartner`, `c.action.moreDetail`, `c.action.fullDetail`, `c.try.pot.down`, `c.try.pot.up`, `c.try.start.down`, `c.try.start.up`, `c.try.risk.<level>`, `c.try.take`, `c.action.retry`, `c.action.change` |
| Rail | `rail.c.<step>` on each step link; `rail.next` on the next sentence; `rail.line` on the phone line; `aria-current="step"` on the current step |
| Front door | `front.q.<letter>` on each question; `front.c.pot` on the pot box (bound to `draft.c.values['you.pot']`); `front.c.show` (goes to `#/c/numbers?focus=you.age`) |

```js
// src/v7/testing/hooks.js — loaded only when import.meta.env.MODE === 'test'
window.__pt = {
  setState(state),              // dispatch state/replace — draws any named state
  getState(),                   // a copy of the state
  setEnv({ today }),            // dispatch env/set and re-send `init` to the worker
  answer(q, inputs, env),       // calls the answer function on the page itself (for the sameness test)
  answerInWorker(q, inputs, env),
  writes(),                     // { [storageKey]: count } of session and local storage writes since load
  whenDone()                    // a promise for data-ready="1"
};
```

### 4.10 The worker, and the test adapter

```js
// page → worker                                          worker → page
{ id, type: 'init', today }                               { id, ready: true, historyEnd, engineVersion }
{ id, type: 'answer', q: 'c', inputs, env }               { id, progress: { done, total } } …  then  { id, result }  or  { id, error }
// env here = { today, futures, seed, trace: false }. Payloads go through cloneSafe (src/utils/cloneSafe.js).
```

`effects/run.js`, for the question on screen, whenever the state changes:

1. If the route is not the `answer` step, or the draft does not parse, do nothing.
2. If `currentKey` equals `answers.c.inputsKey` and the status is `first`, `final` or `working`, do nothing.
3. Otherwise: wait 250 ms for typing to pause (none on the first run after `draft/ask`); end any worker run
   under way; dispatch `answer/working`; run with `futures: 100` → `answer/first`; run with `futures: 1000`
   → `answer/final`. After 5 seconds without a final result dispatch `answer/slow`. On any error dispatch
   `answer/failed`. If no worker can start, run the same two passes on the page.

The worker is created when question C is first opened, so it is ready before the button is pressed.

```js
// tests/v7/c/_c.js — the only test file that knows real paths
export { answerC } from '../../../src/answers/c/answer.js';
export { SCHEMA_C } from '../../../src/answers/c/schema.js';
export const TEST_ENV = { today: '2026-09-30', futures: 40, seed: 0, trace: false };
export const get = (answer, key) => key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), answer);
export function renderScreen(state) { /* h(App, { state, dispatch: () => {} }) into a fresh jsdom div; returns the div */ }
export function readForm(root) { /* { [path]: value } read back from the boxes */ }
```

### 4.11 Build set-up

```js
// vite.v7.config.js — the shape; confirm paths on the first build
import { defineConfig } from 'vite';
import { resolve } from 'node:path';
const here = import.meta.dirname;
export default defineConfig(({ mode }) => ({
  root: resolve(here, 'v7'),
  base: './',
  publicDir: false,
  esbuild: { jsx: 'automatic', jsxImportSource: 'preact', drop: mode === 'test' ? [] : ['console', 'debugger'] },
  worker: { format: 'es' },
  build: {
    outDir: resolve(here, process.env.V7_OUT || 'docs/v7'), emptyOutDir: true,
    rollupOptions: { output: { entryFileNames: 'assets/[name]-[hash].js', chunkFileNames: 'assets/[name]-[hash].js',
                               assetFileNames: 'assets/[name]-[hash].[ext]' } }
  },
  server: { port: 3001, fs: { allow: [here] } }
}));
```

```json
"build":     "vite build && node scripts/stamp-sw.mjs && vite build --config vite.v7.config.js",
"build:v7":  "vite build --config vite.v7.config.js",
"dev:v7":    "vite --config vite.v7.config.js",
"e2e:build": "vite build --outDir dist/prod && V7_OUT=dist/prod/v7 vite build --config vite.v7.config.js && V7_OUT=dist/test/v7 vite build --config vite.v7.config.js --mode test",
"e2e":       "playwright test",
"e2e:approve": "playwright test e2e/screens.spec.js --update-snapshots",
"v7:cases":  "node tests/v7/gen/build-cases.mjs"
```

The current build must run first: it empties `docs/`. `v7/index.html` has `<meta name="robots"
content="noindex">`, `<div id="app" data-ready="0">`, one `<script type="module" src="../src/v7/main.jsx">`
and the stylesheet links; no inline script or style.

---

## 5. The work packages

One prerequisite package and five that run side by side. File lists are those marked in section 3 and do not
overlap. A change to a contract in section 4 is made by the person leading the slice, in this brief first,
then in package 1's files — never by a package on its own.

```
P0 engine fixes (own releases) ──────────────────────────────┐ (needed only for the tax table and the speed gate)
P1 foundations and stubs ──┬─► P2 the number ────────────────┤
                           ├─► P3 the shell ─────────────────┼─► joining up ─► the gate
                           ├─► P4 screens, words, styles ────┤
                           └─► P5 browser tests and CI ──────┘
```

### P0 — two engine fixes, each its own 6.x release with a release note (not part of the slice's files)

| Fix | What | Proof |
|---|---|---|
| Income tax above £100,000 | `calculateTax` must not widen the 20% band as the allowance is withdrawn. Today: £110,000 → £32,432 (should be £33,432); £125,140 → £40,002 (£42,516); £150,000 → £51,189 (£53,703). Confirmed by running today's code | The tax table (Tests 3.2) green; pinned outputs that move are listed in the release note |
| `planDrawdown` tax-free branch | Replace the 80-step search with the exact formula (HH 2.8) | Existing pinned outputs within their tolerance; a before/after timing in the release note |

P0 can run at the same time as everything else. Nothing waits for it except the two gate lines that name it.

### P1 — foundations and stubs (one builder; lands first, in a day or two)

Delivers, complete: the build set-up (4.11), `SCHEMA_C`, `validate.js`, `format.js`, `rules.js`,
`contract.js`, `routes.js`, `rail/c.js`, `rail/questions.js`, `actions.js`, `initial.js`, the adapter, the
import-rule tests.

Delivers as stubs, so that every other package can run from the first hour:

| Stub | Does | Then owned by |
|---|---|---|
| `src/answers/c/answer.js` | checks the inputs; returns `tests/v7/stubs/c-result.json` with `inputs` and `basis.today` filled in (status `invalid` for bad inputs) | P2 |
| `src/v7/App.jsx` | draws `<main data-screen="…">` with the screen's name | P4 |
| `src/v7/main.jsx` | makes the state, draws `App` into `#app`, sets `data-ready="1"` | P3 |

`tests/v7/stubs/c-result.json` is a complete, valid `AnswerC` made by hand from HH example 1 (careful £1,380,
middling £1,590, run-out age 76; a made-up `good`), including sentences and `assumed`. It is what P4 draws
and P5 walks until the real function lands.

Done when: `npm run build` produces `docs/v7/index.html`; `npm run dev:v7` shows the stub page; the whole
existing suite is green; `docs/assets/` holds the same file names as before the change.

### P2 — the number (needs P1)

`src/answers/shared/{household,toEngine,futures,band}.js`, `src/answers/c/{toHousehold,answer,sentences}.js`
and their tests. Builds on today's engines without editing them. Reference: HH 1.2–1.6, 2.3, 2.7, with the
changes in 4.3.

On the first day the function runs, time ten cases at 40 futures and write the figure in the pull request.
The test plan assumed about 30 ms a case; HH's measurements suggest nearer 500 ms before P0's speed-up. If
so: per-push properties drop from 60 runs to 25 and the pairs list runs at 20 futures; the fixtures, closed
forms and the trace check are never cut. Slow files take the `.slow.test.js` name.

Done when: section 6's P2 tests are green with the real function; the three worked examples of HH 2.10
reproduce (careful amounts £1,380, £3,610, £1,540 at 1,000 futures; `good` will differ from HH's "high").

### P3 — the shell (needs P1)

State, reducer, readers, rail function, effects, worker, hooks. Works against the stub answer. Owns the
ready mark and the `pt:done` event.

Done when: section 6's P3 tests are green; on `npm run dev:v7`, typing into P1's stub page (or P4's screens
once there) reaches the state, the address follows the route, reload keeps what was typed, and the worker
returns the stub result through both passes.

### P4 — screens, components, words, styles (needs P1)

Everything a person sees. Drawings and words: Rail Part 2 (front door 2.1, numbers 2.2, answer 2.3, nothing
entered 2.4, working 2.5, failed 2.6, small pot), with the changes in section 2 of this brief — in
particular: the headline has no "from your pot" and no second "in all" line; no charges chip; no "way of
taking it" control; no spending box; "Answer in full detail" and the other five questions open `Soon`.
Language guide: Rail Part 3 in full. One theme, tokens taken from today's app.

Components carry the accessibility rules of B section 8. `Field` is the only way to draw an input; `Money`
and `Sentence` the only way to draw a number from the answer.

Done when: section 6's P4 tests are green for every named state; the owner has looked at the three screens
on a real phone.

### P5 — browser tests and CI (needs P1; goes fully green at joining up)

Playwright set-up, the static server that sends the real `public/_headers`, the journeys, the crawl, the
pictures, the sameness run, the three workflows, and the `RELEASING.md` section. Reference: Tests 7–11, with
`/v7/` addresses, the test ids of 4.9, and the wait budget of conflict 50. Writes every script against the
contracts and P1's stubs; `production.spec.js` and `old-app-unchanged.spec.js` can be green on day one.

Done when: the `browser` job is green in CI on the joined-up branch.

### Joining up (the slice lead)

1. Swap the stub answer for P2's function; delete `tests/v7/stubs/`.
2. Run `tests/v7/states/build-states.mjs` so every named state holds a real, pinned answer.
3. All of P5 green. First pictures approved by the owner after he has seen the screens on a real phone.
4. The planted faults of Tests 10.3, one at a time, each going red where expected.
5. The gate in section 7.

---

## 6. The tests each package writes first

Each package writes these before the code they test; they start red.

| Package | First tests (file) | What they fix in place |
|---|---|---|
| **P0** | The tax table rows above £100,000 (`tests/TaxCalculator.test.js`); a timing test and the existing pinned outputs for `planDrawdown` | The two fixes |
| **P1** | `c/schema.test.js` — every field has a type, limits and boundary values including its limits; every `when` names an earlier field; no required field has a default; a single person has at most 5 required fields (today 2). `shared/validate.test.js` — `parseDraft` on typed text ("250,000", "£250000", "", "abc"); each boundary passes; one below and one above fail; defaults by rule at ages 54, 55, 56, 57 either side of 6 April 2028. `shared/format.test.js` — `money`, `shownMonthly`, the out-of-ten table. `boundaries.test.js` — the four import rules of `architecture.md` 3.1. `shellRatchet.test.js`, `liveBundle.test.js` | The contracts themselves |
| **P2** | `c/closedForm.test.js` (CF1–CF7 of Tests 3.3, using `env.futureReturns`) · `c/invariants.js` = `checkAnswer` (I1–I15, renamed to this brief's fields; I5 becomes "`monthly.careful` equals `phases[0].takeHome` and no later phase is lower"; I8 stays) · `fixtures/c/F1–F3` inputs · `household.test.js` (State Pension age and pension access age by birth date; a partner with nothing; swap of partners) · `oracles/ukTax.mjs` + `tax.test.js` (red until P0's fix ships — expected). Then, once the function exists: `c/trace.test.js`, `gen/*`, `c/pairs.test.js`, `c/properties.test.js` (M1–M4, M8, M16; M10–M12 on `take`), `c/metamorphic.test.js` (M5–M7, M13, M15; M14 as "swapping the gilt file changes nothing"), `c/feedback.slow.test.js` (HH 2.9 rule 3: the careful amount, saved in today's settings shape and run through `createSimulationConfigFromSettings` → `planFromSettings` → `stressTestStrategy('pots-and-valves')`, fails in at most 10% of futures) | What the number means |
| **P3** | `shell/reduce.test.js` — each action of 4.6; a stale `answer/first` or `answer/final` is ignored; no action changes `plan` or `session`; the state survives `JSON.parse(JSON.stringify())` after any sequence. `shell/routes.test.js` — the round trip for every row of 4.8; unknown → `notFound`; no digit in any formatted address. `shell/select.test.js`. `rail/rail.test.js` — L1–L8 of Tests 6 (L6: the five unbuilt questions lead to `Soon`, which has a way on; L8: all of question C passes the retired rules); exactly one `current` step and one next sentence for every generated state; random walks of 8 moves with fast-check. `shell/run.test.js` — with a fake worker: two passes in order; a change mid-run ends the old run and its result never reaches the state; failure → `answer/failed`; the 5-second `slow`. `shell/draftStore.test.js` — reload keeps the draft; a storage that throws is survived; the only key written is `pt_v7_draft`. `shell/worker.test.js` — `init` then `answer` through the real worker module's message handler | Wiring and the "stale figure" class of bug |
| **P4** | `render/checkScreen.js` (R1–R12 of Tests 5; R3 inside `[data-region="answer"]`) and `c/render.test.js` over the named states `front-door`, `numbers-blank`, `numbers-half-typed-with-an-error`, `numbers-couple-open`, `numbers-more-open`, `answer-nothing-entered`, `answer-working`, `answer-first`, `answer-F1`, `answer-F2`, `answer-F3`, `answer-updating`, `answer-take`, `answer-small-pot`, `answer-pensions-only`, `answer-nothing`, `answer-assumed-open`, `answer-failed`, `soon-a`, `not-built-ways`, `not-found` — first drawn with the stub result. `c/roundTrip.test.js` — any valid inputs → drawn → `readForm` → the same values (fast-check). `wording/wording.test.js` — the banned list over `copy/*.js` and `src/answers/c/sentences.js` as text, and over every drawn state; every field path has a label; `ADVICE_SHORT` under every headline and `ADVICE_FULL` on every answer step, letter for letter. `styles/contrast.test.js` — every text and background token pair meets 4.5 to 1 | What a person reads |
| **P5** | `e2e/production.spec.js` (published build: no policy violation, `window.__pt` undefined, no `__pt` text in `dist/prod/v7/`) and `e2e/old-app-unchanged.spec.js` — both green against P1's stub. Then `c-forum-guest.spec.js` (J1, published build, hooks off, typed one key at a time, with the counts), `c-couple.spec.js` (J2), `c-retired.spec.js` (J3), `crawl.spec.js` (every address × every named state; and: corpus plan 03 placed where today's app keeps guest plans is byte-identical after the crawl, and `__pt.writes()` names only `pt_v7_draft`), `keyboard.spec.js`, `sameness.spec.js`, `screens.spec.js`. `tests/v7/e2eRules.test.js` | The real page, the real policy |

---

## 7. Done means

The slice is done, and `/v7/` may be published (unlinked; the current app still the default), when all of
these hold on one commit:

1. **Both CI jobs are green** (`test` and `browser`), in CI, not only on the Mac.
2. **The current app is untouched.** `planCorpus`, `indexMarkup`, `releases`, the old-app walk and (on the
   owner's machine) `ownerPlan.local` pass with no pinned file changed. `index.html`, `src/workers/`,
   `src/storage/`, `src/firebase/` and `src/ui/` show no difference from the commit the slice started on.
   `docs/assets/` for the current app holds the same file names as a build of that commit (P0's releases
   aside).
3. **No rule fails.** `checkAnswer` and every property report nothing on the pairs list, the 48 core cases,
   the found cases and the last night's random run. `exceptions.md` is empty.
4. **The independent checks agree.** Closed forms exact; headlines equal to the month-by-month trace; the
   tax table to the penny (so P0's tax fix has shipped); the careful amount fed back through today's
   saved-plan path fails in at most 1 future in 10.
5. **The three worked examples reproduce**, and the owner has approved the three fixtures' sentences and
   figures and the first set of pictures.
6. **The first answer is counted on the published build**: at most 5 things to fill in (expected 2), at most
   3 screens, at most 6 clicks, no sign-up or pop-up; first figure within 3 seconds and final figure within
   15 seconds with the processor slowed four times (so P0's speed-up has shipped, or the owner has accepted
   the measured figure in writing); the owner's own stopwatch time is written in the release checklist.
7. **The same answer in three browsers**: decisions, displayed figures and sentences exactly equal; raw money
   within 1p.
8. **V7 cannot change a plan**: the import rule is green; the locked fixture is byte-identical after the
   crawl; the published build contains no test hook.
9. **Every planted fault went red** where Tests 10.3 says it should.
10. **Every word passes the banned list**, in the strings and on every drawn state.
11. **Sizes are written down**: the compressed size of the shell, of question C and of the worker, against
    the budgets of `architecture.md` 3.8. Over budget is a finding to explain, not a failure.

---

## 8. Out of scope for this slice

| Not built | What stands in its place |
|---|---|
| Keeping a plan, sign-in, the free-time allowance, Firebase, `householdInput` on a saved plan, any `schemaVersion` change | The `keep` step is on the rail and opens "not in the preview yet". HH 1.7 is the design for when it is built |
| Opening a saved or locked plan in V7; the "Your plan" rail; try-a-change on a locked plan; life stages | `#/plan/…` addresses show "page not found". Rail 1.5–1.6 are the design for later |
| Step 3, "What are the ways to take it?" (annuity, cashing in) | On the rail, not built |
| Questions A, B, D, E, F | `Soon` screen with a link to the current version |
| "Answer in full detail" | The button opens `Soon` for question E |
| Spending, living-standard levels, comparison with living standards | The `take` control only |
| Charts; "See it year by year" | The made-of lines only |
| Month and year of birth; an editable State Pension age; more than one final-salary pension; other income; part-time work; tax-free cash already taken; a fund list | The household model has the fields (HH 1.2); the form does not ask |
| Charges; Scottish tax; allowances frozen for some years | Stated under what was assumed |
| A second colour theme; offline use; the service worker | — |
| The `pt_shell` forward, any link from the current app to V7, any edit to `index.html` | The address `/v7/` |
| Lifting `createSimulationConfigFromSettings` out of `StressRepository`; any other move of code out of the old shell | The ratchet test starts now; moves start with the first slice that needs one |
| Live gilt and share prices in V7 | Question C uses bundled market history only |
| Release note for V7 itself | None until 7.0.0 (P0's two releases have their own) — see section 9 |

---

## 9. Decisions waiting for the owner

Builders proceed on the "decided" column of section 2. These are the points where the owner may wish to
overrule; each is a small change if made before joining up.

1. **The headline is the careful amount** (lasted in 9 futures out of 10), with the middling amount and its
   bad-case age beneath. Confirm.
2. **"Good" means the best 1 in 10**, not 1 in 4 as the household plan proposed. It is about 8% higher and,
   taken in a bad case, runs out sooner. One constant changes it.
3. **The income is a level household amount**, so the pot pays more before the State Pension starts and less
   after. The alternative (a level amount from the pot, with the total stepping up) is what the screen
   drawing showed.
4. **Two engine fixes as their own releases before the slice is called done**: the tax sum above £100,000
   (wrong today) and the faster `planDrawdown`.
5. **The full State Pension figure** (£241.30 a week for 2026/27) needs checking against gov.uk, and a line
   in the yearly update checklist.
6. **`/v7/` on the live site, unlinked, as soon as the slice passes its gate** — or kept off the site until
   more is built. (The repository's `docs/` folder is what is published, so the next release build would
   include it.)
7. **No release note for V7 until 7.0.0**, on the argument that a page nobody is pointed at is not a visible
   change.
8. **The privacy policy**: does the unsaved try, held in this tab's session storage under `pt_v7_draft`,
   need a line before `/v7/` is reachable?
9. **The other five questions on the front door** open a plain "not in the preview yet" screen with a link
   to the current version. Or hide them until built?
10. **Steps 3 and 4 of question C** ("ways to take it", "keep this plan") are on the rail but not built in
    this slice. Accept a first slice that cannot keep a plan?
11. **Age only, birthday taken as today.** Someone within a year of a State Pension age change, or aged 54
    to 56 across April 2028, may be a year out. Add month and year of birth for those ages in the next slice?
12. **Plan to age 95 by default** (a couple: until the younger is 95); **allowances rising with prices**;
    **no charges taken off**; **England, Wales and Northern Ireland tax only** — each stated under what was
    assumed. Confirm each, or say which should become an input.
13. **Preact** as the one new run-time dependency.
14. **Pictures**: about 25, made on the CI machine, approved by pressing one button in GitHub before a
    release. Willing? And which theme first (proposed: today's dark one)?
15. **The letters A–F** as small labels on the front door: keep or drop?
16. **The Pension Wise sentence** in the closing advice line: confirm it is acceptable to Usefulish Ltd.
