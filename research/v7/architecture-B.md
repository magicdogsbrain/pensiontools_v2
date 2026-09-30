# V7 shell — architecture B: built to be tested and kept up by one person plus agents

Draft for the owner, 30 Sep 2026. Nothing here is built. This is one of the competing architecture proposals
for the V7 shell; its bias is **testability and low upkeep**, and where that costs something else (polish,
cleverness, speed of the first demo) it says so.

Read with `research/v7-plan-of-plans.md` (the order of work and the owner's decisions) and `product-plan.md`
Part 1. Facts about the current app come from the four inventories and from reading the repository today
(v6.15.0); figures I have not measured are marked as estimates.

---

## 1. The position in one page

1. **Use Preact, and nothing else at run time.** Not Lit, not Svelte, not plain string-building modules, and
   not signals to begin with. About 5 KB gzipped added to a page that today ships 457 KB.
2. **One state object, one reducer, one render.** The whole screen is `render(<App state={state} />)`. State is
   plain data that survives `JSON.stringify`. Any screen can therefore be drawn from a saved fixture in a unit
   test, in a screenshot test and in the browser, with the same file.
3. **Inputs are declared once, as plain JavaScript objects.** No validator library. The declaration drives the
   form (label, help, limits, error wording, test id), the defaults, the validation, and the generated test
   cases (edge values, pairs of options). An input that is not declared cannot appear on a screen; a test
   enforces it.
4. **Every number comes from an answer function** in `src/answers/` — pure, given inputs, a date and pinned
   market data, returning values, the plain sentence and the list of what was assumed. Screens are not allowed
   to import an engine; a test enforces that too.
5. **Addresses are hash routes on a separate page**: `pensiontools.uk/v7/#/c/answer`. Works unchanged on
   Cloudflare Pages and the GitHub Pages mirror, needs no server rules, and the figures a person types never
   appear in the address.
6. **V7 is a second, separate build** into `docs/v7/`, from its own Vite config. The current app's bundle is
   not touched by V7 work — byte for byte — until cutover.
7. **Reused as they are**: the engines, the engine worker and its client, the repositories, the schema
   version and migration chain, Firebase auth, guest mode and its meter, the pure views and graphics.
8. **Cutover is a swap of two folders**, and so is rollback.

What this architecture deliberately does not do: server rendering, TypeScript source files, a CSS framework, a
state library, a form library, a router library, a design-system package. Each is a thing one person would
have to keep alive.

---

## 2. Component library or plain modules — the choice, costed

The current pure views (`PlanDocumentView.js`, `TransitionView.js`) are functions that return HTML strings.
That pattern tests well for read-only pages and is kept for them. It fails for forms: replacing a form's HTML
on every keystroke loses the cursor and focus, so string-built forms end up holding their state in the DOM —
which is exactly where 20 of the 61 September bugs lived. Something has to update the page from state without
destroying what the person is typing in. The question is whether to write that ourselves.

| | Plain modules (strings + hand patching) | **Preact** | Lit | Svelte 5 |
|---|---|---|---|---|
| Added to the page (gzipped, estimates from published sizes) | 0, plus our own patching code (a few hundred lines to write and keep) | about 4.5 KB; about 8 KB if signals are added later | about 6 KB | about 3–10 KB, grows with the number of components |
| Build change | none | two lines of config: Vite's built-in JSX transform pointed at Preact. No plugin | none (tagged templates) | a Vite plugin and a compiler; `.svelte` files |
| Content-Security-Policy (`script-src 'self'`, no eval) | fine | fine — no eval, no inline script | fine | fine |
| Inline styles | string `style="…"` needs today's `'unsafe-inline'` | sets styles through the DOM, so V7 could later drop `'unsafe-inline'` for its own path | its scoped styles need care under a strict style policy | fine |
| Unit render test in vitest + jsdom | easy for read-only; forms need hand-written event plumbing | `@testing-library/preact`: find by label and role, type, click. Mature | jsdom's support for custom elements and shadow DOM is partial; Testing Library does not look inside shadow roots | needs the plugin wired into vitest and the browser build condition; workable, more moving parts |
| Playwright | same for all | same | same (it sees through shadow DOM) | same |
| Global theme tokens, axe, the wording check | direct | direct (ordinary DOM) | shadow DOM gets in the way unless switched off, at which point little of Lit is left | direct |
| What agents know | each agent invents its own patching | the React way of writing components is the most widely known UI idiom there is; Preact is the same idiom | known, less common | Svelte 5 changed its syntax from Svelte 4; agents mix the two |
| Learning curve for the owner reading code | lowest | JSX looks like HTML inside JavaScript; one afternoon | template strings; custom elements are a new concept | a new file type and its own rules |
| Upkeep risk over five years | ours alone | small, stable, ten years old, one dependency with none of its own | stable | compiler and plugin versions must move with Vite |

**Position: Preact.** It removes the one thing plain modules do badly (keeping a form alive while state
changes), adds about 1% to the page, needs no plugin, leaves the security policy alone, and is the idiom agents
write most reliably. Svelte is the nicest to write but ties the project to a compiler and splits agent
knowledge across two syntaxes. Lit's main feature, shadow DOM, works against our theme, our wording check and
our unit tests.

**No signals at the start.** With one state object and a reducer, the simplest correct thing is to re-render
the whole app on each change and let Preact work out what differs. Screens here are forms and results, not
spreadsheets; that is quick. Signals add a second way for data to reach the screen, and "one way in" is what
makes fixtures work. Add them only if typing measurably lags on a phone (the performance budget in section 12
would show it).

**House rules that keep Preact from becoming a second big script**

- Components are functions of their props. **No `useState` in screens.** Anything a screenshot might need to
  show (an open panel, an error, a busy run) lives in the state object.
- Hooks are allowed only inside `src/v7/components/` and only for focus and measuring (`useRef`, `useEffect`).
- A screen file may import from `components/`, `copy/` and `format/` and nothing else. It may not import
  `src/services`, `src/strategies`, `src/answers`, `src/storage` or `src/firebase`. `tests/v7/boundaries.test.js`
  reads the import lines and fails otherwise. This is how "the screen computes nothing" is enforced rather than
  hoped for.
- No `window.*` functions. The inline-handler interpreter is not installed in V7; events are ordinary
  `onClick={...}` props that dispatch an action.

---

## 3. The shape: five layers, arrows one way

```
   address (#/c/answer)                    saved plan / guest plan / draft
            │                                         │
            ▼                                         ▼
   ┌──────────────────────────── state (one plain object) ───────────────────────────┐
   │ route · session · plan · draft · answers · ui · env                              │
   └───────▲───────────────────────────────┬─────────────────────────────────────────┘
           │ actions                        │ render(state)
   reducer (pure)                           ▼
           ▲                        screens and components (Preact) ── compute nothing
           │ results                        │ dispatch(action)
   effects (the only impure code) ◄─────────┘
     ├─ answers:  engineClient.runInWorker('answer', …) → src/answers/* → existing engines
     ├─ data:     src/storage repositories, schema + migrations, FirestoreService (guest or signed in)
     ├─ account:  AuthService, GuestMeter
     └─ address:  location.hash
```

| Layer | Where | Pure? | Tested by |
|---|---|---|---|
| Input declarations | `src/v7/schema/` | yes | unit tests; they also generate other tests |
| Answer functions | `src/answers/` | yes | generated cases, rules that must always hold, pinned fixtures |
| Reducer, router, rail | `src/v7/state/`, `src/v7/rail/` | yes | unit tests and random-walk tests |
| Screens and components | `src/v7/doors/`, `src/v7/components/` | yes (props in, DOM out) | render tests from fixtures; screenshots |
| Effects | `src/v7/effects/` | no — kept small | fakes in unit tests; real browser in Playwright |

The impure part is one folder. Everything else can be run in Node in milliseconds.

---

## 4. State: one object you can save to a file

```js
// The whole of V7's state. Plain data only: no functions, no Dates (ISO strings), no DOM.
{
  route:   { door: 'c', screen: 'answer', planId: 'draft', field: null },
  session: { kind: 'none' | 'guest' | 'user', name: '', verified: false, guestMinutesLeft: 180 },
  plan:    null | { /* the saved plan exactly as stored, schemaVersion 1, untouched keys kept */ },
  draft:   { c: { values: { … as typed … }, touched: ['people.0.pot'], errors: { } } },
  answers: { c: { status: 'idle' | 'busy' | 'ready' | 'failed', inputsKey: 'a41f…', result: { … } } },
  ui:      { theme: 'dark', sheet: null, openDetails: ['assumed'] },
  env:     { now: '2026-10-01T12:00:00', marketDataId: 'gilts-2026-09-29', appVersion: '7.0.0-dev', build: 'test' }
}
```

- **`draft` holds what was typed, as typed** (strings, including a half-finished "25,00"). `plan` holds what
  was saved. The form never reads saved values while the person is typing, and never writes to the plan until
  they say so. That separation removes the "form showed saved, not typed, values" bug class by construction.
- **`answers` carries a key made from the inputs it was computed from.** A screen shows a result only when
  the key matches the current inputs; otherwise it shows "working it out". A stale figure cannot be displayed.
- **`env` carries the date and the market-data stamp.** Nothing in V7 reads the clock directly; the existing
  `tests/determinism.test.js` scan is extended to `src/v7` and `src/answers`.
- **Locked plans**: the reducer has no action that changes `plan.decisionTool.settings`, `history`,
  `planDocument` or the archives. Those go only through the existing `PlanLock` and repository functions, from
  the effects layer, exactly as today. A random-walk test (section 10) asserts a locked plan is byte-identical
  after any sequence of navigation.

`reduce(state, action) → state` is pure. Effects listen after each action and do the impure work (save, run an
answer, change the address), then dispatch a result action. Every action is a plain object, so a whole session
can be recorded as a list and replayed in a test — useful for turning a hand-found bug into a fixture.

---

## 5. Inputs: declared once, used four times

Position: **plain JavaScript objects and about 200 lines of our own `validate`**, not Zod or Valibot. A
validator library checks shapes; it does not know a label, help text, which values sit on a tax threshold, or
whether a default must be shown to the person as something we assumed. We need all of those in one place, so
the declaration is ours. Types for agents and editors come from JSDoc comments; an optional `tsc --checkJs` on
`src/v7` and `src/answers` in CI catches misspelt keys without converting anything to TypeScript (open
question 3).

One declaration gives:

1. **The form.** `<Field input={…}>` draws the label, help, unit, keyboard type, limits, error and test id from
   it. There is no other way to put an input on a screen.
2. **Defaults and validation.** `defaults(inputs, env)` and `validate(inputs, values)` replace the defaults
   scattered through today's loader (`|| 35`, `|| 30000`, `?? 250000`).
3. **What was assumed.** Any input marked `assumed: true` that the person did not change is listed under the
   answer in plain words with a "Change" link to that field's address. No silent defaults (the age-45 and
   £12,000 State Pension findings).
4. **Generated tests.** `edgeCases(inputs)` (each number at its limits and thresholds), `pairCases(inputs)`
   (every pair of options together at least once) and a random generator for the nightly run, all read from
   the same declaration.

### Code sketch — the inputs for question C

```js
// src/v7/schema/questionC.js — "I've got about £X — what is that a month?"
// Plain data. Every user-facing word is here or in copy/, never in a screen.
import { money, age, choice, yesNo, person } from './kinds.js';

export const questionC = {
  id: 'c',
  fields: {
    who: choice({
      label: 'Who is this for?',
      options: [['one', 'Just me'], ['two', 'Two of us']],
      default: 'one',
    }),
    // One block per person: one block when who = 'one', two when who = 'two'.
    people: person({
      count: (v) => (v.who === 'two' ? 2 : 1),
      fields: {
        age: age({
          label: ['Your age', "Your partner's age"],
          min: 18, max: 100, required: true,
          edges: [54, 55, 57, 66, 67, 75],            // pension access and State Pension ages
        }),
        pot: money({
          label: ['Your pension savings', "Your partner's pension savings"],
          help: 'All pension pots added together. A rough figure is fine.',
          min: 0, max: 10_000_000, required: true,
          edges: [0, 1, 30_000, 268_275, 1_073_100],   // tax-free cash limits sit on these
        }),
        statePension: money({
          label: 'State Pension a year',
          help: 'Your forecast is on gov.uk. We have used the full amount until you change it.',
          default: (v, env) => env.rules.fullStatePensionAYear,
          assumed: 'a full State Pension of {value} a year',
          min: 0, max: 20_000, edges: [0],
        }),
        finalSalary: yesNo({
          label: 'Do you have a final-salary pension?',
          default: false,
          whenYes: {
            amount:  money({ label: 'How much a year', min: 1, max: 200_000, required: true }),
            fromAge: age({ label: 'From what age', min: 50, max: 80, required: true, edges: [55, 60, 65, 67] }),
          },
        }),
      },
    }),
    risk: choice({
      label: 'How should the money be invested?',
      options: [['cautious', 'Cautious'], ['balanced', 'Balanced'], ['adventurous', 'Adventurous']],
      default: 'balanced',
      assumed: 'a balanced mix of shares and bonds',
    }),
  },
  // Rules across fields. Each has the sentence shown when it fails.
  rules: [
    { test: (v) => v.people.every((p) => !p.finalSalary.yes || p.finalSalary.fromAge >= 50),
      say: 'A final-salary pension cannot start before age 50.' },
  ],
};
```

Required to get an answer, single person: **age and pension savings** — two numbers. A couple: four. Everything
else has a shown default. That is the "handful of numbers" in the fixed decisions, and the time-to-first-answer
test counts them.

Where these answers are stored in a saved plan (a new optional key beside `stressTool` and `decisionTool`, so
no migration is needed under the rule in `RELEASING.md`) belongs to the "Household and guaranteed income"
sub-plan; this architecture only requires that the stored form is the validated values object and that a pure
adapter turns it into the engine's config.

---

## 6. Answer functions and the existing engines

```
answerC(values, { now, market, rules, seed, runs })
  → { headline: { monthly: { bad, middle, good } },        // bad = the worst 1 in 10
      sentence: 'About £1,450 a month in today's money, from now to age 95. In a bad case …',
      assumed:  [{ field: 'people.0.statePension', text: 'a full State Pension of £12,548 a year' }, …],
      series:   { incomeByAge: […] },                        // what the chart plots
      trace:    { … month-by-month figures for the independent check … } }
```

- Lives in `src/answers/questionC.js`. Imports the existing engines (`SimulationEngine`, `stressTest`,
  `TaxCalculator`, `HouseholdService`) and nothing from `firebase`, `storage` or `ui`.
- **Couple-ready from the first line**: `values.people` is always a list; a single person is a list of one.
  There is no separate single-person path to reshape later.
- **Sentences are made here**, by templates in `src/v7/copy/`, from the same numbers. The screen prints the
  sentence; it does not assemble one.
- **The one piece of current code that has to move**: the pure part of `createSimulationConfigFromSettings`
  sits inside `src/storage/StressRepository.js`, which imports Firebase. It is lifted into a pure module and
  the repository re-exports it, so the current app sees no difference; the existing pinned
  `tests/integration/appPaths.test.js` is the proof. Until then answer functions cannot run in the worker
  without dragging storage in.

### The engine worker

Reused as it is. `src/workers/engineClient.js` already gives `runInWorker(type, payload, onProgress)` with
failure handling. V7 adds **one** message type, `'answer'`, to `engineWorker.js`:
`{ question: 'c', values, env } → result`. The existing seven types are not touched. Every answer runs there;
none runs on the main thread. While it runs, `answers.c.status` is `'busy'` and the screen root carries
`data-ready="false"`; when the result lands it flips to `"true"`. Tests wait on that attribute and never on a
timer.

The random generator has been the integer one since 6.13.4, so a seed gives the same answer in the worker, in
Node and on every device. That is what lets a browser test compare the figure on screen with the same function
run in Node.

---

## 7. Addresses and the rail

**Hash routes on `/v7/`.** Reasons: the site is static with `base: './'`; GitHub Pages has no rewrite rules;
the security policy sets `base-uri 'none'`; and the existing `?demo=`, `?signup=1`, `?signin=1` parameters
keep working in front of the `#`. The address holds the screen and the plan, never the figures — a person's
pot size should not sit in browser history or in a link they paste into a forum.

| Address | Screen |
|---|---|
| `/v7/#/` | The front door: the six questions |
| `/v7/#/c/figures` | Question C, your figures (a new, unsaved try) |
| `/v7/#/c/answer` | Question C, your answer |
| `/v7/#/c/next` | Question C, what you could do next |
| `/v7/#/c/figures?field=people.0.statePension` | The same screen with that field focused (the "Change" links) |
| `/v7/#/plan/<planId>/c/answer` | The same screens for a saved plan |
| `/v7/#/plans`, `/v7/#/account` | Saved plans; account |

`parse(hash) → route` and `format(route) → hash` are pure and tested as a round trip. `resolve(route, state)`
(also pure) applies the guards: an unknown address goes to the front door; an answer screen with no figures
goes to the figures screen with nothing lost; a plan id the person does not own goes to their plans. There is
**one** `navigate(route)`; the phone bar and the desktop rail both call it.

**The rail is data**, one small file per question:

```js
// src/v7/rail/questionC.js
export const railC = [
  { id: 'figures', label: 'Your figures' },
  { id: 'answer',  label: 'Your answer',  needs: (state) => hasRequired(state.draft.c) },
  { id: 'next',    label: 'What next',    optional: true },
];
```

Because the rail is data, a test can walk it: every step reachable, every step has a next step or is marked as
an end, no step demands another tool first. Step names are chosen per life stage by `LifeStage.deriveStage`
(reused); a retired person never sees a step or sentence that counts down to a start.

---

## 8. Screens and components

### The component set (small on purpose)

| Component | What it guarantees |
|---|---|
| `Shell`, `Rail`, `PhoneBar` | Page frame; rail as a numbered list with the current step marked; one `navigate` |
| `Field` (`MoneyField`, `AgeField`, `ChoiceField`, `YesNoField`) | Label tied to input, help and error announced, right phone keyboard, test id from the declaration |
| `PersonBlock` | One person's fields; repeated for a couple |
| `Headline` | The figure, its raw value in `data-value`, its sentence in `data-sentence` — refuses to render without a sentence |
| `BadCase` | "In a bad case (the worst 1 in 10) …" with its own figure and sentence |
| `Assumed` | "What we assumed" with a Change link per line |
| `Chart` | Wraps the existing graphic builders; always carries its plotted numbers as a table a test (and a screen reader) can read |
| `Working`, `Problem` | Busy and failed states, identical everywhere |
| `OldView` | Mounts an existing HTML-string view (`PlanDocumentView`, `TransitionView`, the auth screens) unchanged |

### Code sketch — a screen

```jsx
// src/v7/doors/c/AnswerScreen.jsx — draws the answer to question C. Computes nothing.
import { Shell, Headline, BadCase, Assumed, Chart, Working, Problem, Button } from '../../components/index.js';
import { copy } from '../../copy/questionC.js';

export function AnswerScreen({ state, dispatch }) {
  const { status, result, inputsKey } = state.answers.c;
  const current = inputsKey === state.draft.c.key;        // never show a figure for other inputs
  const ready = status === 'ready' && current;

  return (
    <Shell state={state} dispatch={dispatch} title={copy.answerTitle} ready={ready || status === 'failed'}>
      {status === 'failed' && <Problem say={copy.failed} onRetry={() => dispatch({ type: 'answer/run', door: 'c' })} />}
      {status !== 'failed' && !ready && <Working say={copy.working} />}

      {ready && (
        <>
          <Headline
            id="c.monthly.middle"
            value={result.headline.monthly.middle}
            unit="pounds-a-month"
            sentence={result.sentence}
          />
          <BadCase
            id="c.monthly.bad"
            value={result.headline.monthly.bad}
            unit="pounds-a-month"
            sentence={result.badCaseSentence}
          />
          <Chart id="c.incomeByAge" kind="incomeLayers" series={result.series.incomeByAge}
                 caption={copy.chartCaption} />
          <Assumed
            lines={result.assumed}
            onChange={(field) => dispatch({ type: 'go', route: { door: 'c', screen: 'figures', field } })}
          />
          <p class="small-print">{copy.notAdvice}</p>
          <div class="actions">
            <Button kind="quiet" onClick={() => dispatch({ type: 'go', route: { door: 'c', screen: 'figures' } })}>
              {copy.changeFigures}
            </Button>
            <Button onClick={() => dispatch({ type: 'go', route: { door: 'c', screen: 'next' } })}>
              {copy.whatNext}
            </Button>
          </div>
        </>
      )}
    </Shell>
  );
}
```

Things to notice: no arithmetic; no engine import; the two comparisons are about *which* state to draw, not
about money; every word comes from `copy/` or from the result; the busy and failed states are ordinary
branches a fixture can select.

### Accessibility is in the components, not added after

- `Field`: a real `<label for>`; help and error joined with `aria-describedby`; `aria-invalid` on error; money
  fields are `type="text"` with `inputmode="decimal"` (not `type="number"`, which mangles commas and scrolls
  by accident); ages use `inputmode="numeric"`.
- Choices are radio buttons inside `<fieldset><legend>`; yes/no the same.
- `Shell`: one `<h1>` per screen; after a move, focus goes to it; a "Skip to your figures" link; the rail is
  `<nav aria-label="Your steps">` holding an `<ol>`, the current step marked `aria-current="step"`.
- The answer area is `aria-live="polite"`, so "working it out" and the result are announced.
- An error summary at the top of a form links to each field in error.
- Targets at least 44 px at phone width; visible focus ring from a token; `prefers-reduced-motion` turns
  movement off (which also steadies screenshots).
- `Chart` always renders its numbers as a table inside a "Show the figures" panel.
- Colours come only from tokens in `styles/tokens.css`, in a dark and a light set, each pair checked for
  contrast by a unit test as well as by axe in the browser (the white-on-grey inputs would have failed both).
- The system font stack already in use is kept: no web-font download, and the same glyphs in every screenshot.

Because these live in eight or nine components, a fix lands once. The generic render test (section 10) fails
any screen with an input lacking a label or a test id.

---

## 9. Reuse of what exists

| Existing piece | How V7 uses it | Change needed |
|---|---|---|
| Engines (`src/services`, `src/strategies`) | Called only from `src/answers/` | None, apart from lifting the pure config builder out of `StressRepository` (section 6) |
| `engineClient.js` / `engineWorker.js` | As is | One added message type, `'answer'` |
| `src/storage` repositories | Called only from `src/v7/effects/data.js` | None |
| `schema.js`, `migrations.js` | Plans load through the same chain. V7 honours the "newer than this app" refusal and shows its message | None for slice C (a new optional key needs no migration) |
| `AuthService`, `FirestoreService` | As is. Firebase is loaded only when needed (section 12) | None |
| `AuthScreen.js`, `AuthPanel.js` | Mounted through `OldView`; email verification flow untouched | Restyle later |
| Guest mode | The first answer needs neither sign-in nor guest mode: it lives in `draft`, kept in this tab's `sessionStorage`. "Keep this" enters guest mode (`enterGuestMode`) and creates a guest plan through the repositories; signing in carries it across with the existing hand-off | None |
| `GuestMeter.js` | Pure already; V7's effects call `tick`, show the same messages in a banner | None |
| Idle sign-out (one hour) | Logic is inside `index.html` today | Lift into a small pure module with an injected clock, used by both shells |
| `LifeStage.deriveStage` | Chooses rail wording per stage | None |
| `PlanLock`, `PlanDocument`, `PlanDocumentView` | From step 7; mounted through `OldView` | Wording only |
| SVG graphic builders, `Charts.js` | Inside `Chart` | Light-theme tokens |
| Inline-handler interpreter | Not installed in V7 | — (see open question 5 for old views that contain `data-on-*`) |
| `tests/helpers/clock.js`, plan fixture corpus, `ownerPlan.local.test.js` | The base for V7's fixtures and the cutover gate | Extended, not replaced |

Both shells run on the same origin, so they share the sign-in session and the guest plan in `sessionStorage`.
A plan made in one can be opened in the other — which is what makes side-by-side checking possible.

**Data protection.** V7 stores no new category of personal data. The unsaved try sits in `sessionStorage` in
the person's own browser, as guest plans do today. Any new browser-storage key, and the new key inside the
saved plan, should be checked against `compliance/PRIVACY_POLICY.md` before the slice is published
(open question 6). The production build keeps dropping console output, so figures never reach a log.

---

## 10. The tests, layer by layer, for slice C

| Layer | File(s) | Runs | What it proves |
|---|---|---|---|
| Declarations | `tests/v7/schema.test.js` | every push | Every field has a label, limits, a test id; defaults are valid; `validate(defaults())` passes |
| Form round trip | `tests/v7/roundTrip.test.js` | every push | Any valid values → typed into the form → saved → reloaded → the same values. Random cases from the declaration. The single test aimed at the biggest September bug class |
| Answer: generated | `tests/answers/questionC.gen.test.js` | edges and pairs every push; thousands of random cases nightly | Rules that must hold: nothing negative, bad ≤ middle ≤ good, more pot never gives less, a couple with a second person of nothing equals the single answer, the monthly figure fed back in lasts as stated |
| Answer: independent | `tests/answers/questionC.trace.test.js` | every push | Each headline recomputed from the month-by-month trace by separate code |
| Answer: scenarios | `tests/answers/scenarios/*.json` | every push | One fixture per research scenario for question C, with its expected sentence, read once by the owner |
| Render | `tests/v7/render/*.test.jsx` | every push | Every screen × every named state draws; generic checks on all of them (below) |
| Rail | `tests/v7/rail.test.js` | every push | Random walks of up to 8 moves: no dead end; a locked plan is byte-identical afterwards |
| Boundaries | `tests/v7/boundaries.test.js` | every push | Screens import no engine; answers import no storage; the production bundle contains no test hook |
| Journeys | `tests/browser/journeys/*.spec.js` | every push (Chromium, phone and desktop); WebKit nightly | A scripted person walks question C; figure on screen = figure from Node; reload lands on the same screen |
| First answer | `tests/browser/firstAnswer.spec.js` | every push | Counts inputs, screens, clicks and waiting for question C against the budget |
| Screenshots | `tests/browser/screens.spec.js` | before a release, on the CI machine only | Named states at phone, iPad and desktop, dark and light, against approved pictures |
| Policy | `tests/browser/production.spec.js` | every push | The real production build, served with the real `_headers`, opens and answers question C with no policy violation |

**Named states** are the hinge. `tests/v7/states/` holds a dozen state objects for question C (blank; half
typed with an error; single answer; couple with a final-salary pension; busy; failed; guest near the end of
the meter; signed in; phone sheet open). The render tests, the screenshot tests and a developer opening the
test build all use the same files. The `result` inside each is produced by the answer function and pinned, and
a test fails if the pinned result no longer matches a fresh run — so screens are drawn in milliseconds without
running an engine, and cannot drift from it.

**Generic checks on every render** (one helper, `checkScreen(container, state)`): no "undefined", "NaN",
"-£0.00", "[object"; no banned word ("decumulation", "plan year", "Stress Tester", "bridge"; and for a retired
state no "until you retire", "plan starts", "years to go"); every headline has a sentence and the number in
the sentence equals `data-value`; every input has a label and a test id; exactly one `h1`; singular wording
when the count is 1.

### Code sketch — a unit render test

```jsx
// tests/v7/render/questionC.answer.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/preact';
import { App } from '../../../src/v7/App.jsx';
import { states } from '../states/questionC.js';            // named, serialisable state fixtures
import { checkScreen, numberIn } from '../helpers/checkScreen.js';

const draw = (state) => render(<App state={state} dispatch={() => {}} />);

describe('Question C — your answer', () => {
  // Every named state must draw and pass the generic checks: wording, labels, headline = sentence.
  for (const [name, state] of Object.entries(states)) {
    it(`draws "${name}" cleanly`, () => {
      const { container } = draw(state);
      checkScreen(container, state);
    });
  }

  it('shows the engine figure and says it in a sentence', () => {
    const state = states.coupleWithFinalSalary;
    draw(state);
    const result = state.answers.c.result;

    const headline = screen.getByTestId('headline-c.monthly.middle');
    expect(Number(headline.dataset.value)).toBe(result.headline.monthly.middle);
    expect(numberIn(headline.dataset.sentence)).toBe(result.headline.monthly.middle);

    const bad = screen.getByTestId('headline-c.monthly.bad');
    expect(bad).toHaveTextContent('worst 1 in 10');
    expect(Number(bad.dataset.value)).toBeLessThanOrEqual(result.headline.monthly.middle);
  });

  it('lists everything it assumed, each with a way to change it', () => {
    const state = states.singleAllDefaults;
    draw(state);
    const list = screen.getByRole('list', { name: 'What we assumed' });
    const lines = within(list).getAllByRole('listitem');
    expect(lines).toHaveLength(state.answers.c.result.assumed.length);
    for (const line of lines) expect(within(line).getByRole('button', { name: /change/i })).toBeTruthy();
  });

  it('never shows a figure worked out from different inputs', () => {
    const stale = structuredClone(states.singleAllDefaults);
    stale.draft.c.key = 'something-else';                    // the person has typed since
    draw(stale);
    expect(screen.queryByTestId('headline-c.monthly.middle')).toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent(/working it out/i);
  });

  it('says nothing about a start date to someone already retired', () => {
    const { container } = draw(states.retiredSingle);
    expect(container.textContent).not.toMatch(/until you retire|years to go|plan starts/i);
  });
});
```

### Code sketch — a Playwright journey

```js
// tests/browser/journeys/forumGuest.spec.js — a guest with two minutes and two numbers.
import { test, expect } from '@playwright/test';
import { answerC } from '../../../src/answers/questionC.js';
import { questionC } from '../../../src/v7/schema/questionC.js';
import { defaults } from '../../../src/v7/schema/validate.js';
import { testEnv } from '../env.js';                         // pinned date, market data, seed
import { ready, noJunk, consoleErrors } from '../helpers.js';

test('two numbers in, a monthly figure out, no sign-up', async ({ page }) => {
  const errors = consoleErrors(page);
  await page.goto('/v7/#/');
  await page.evaluate((env) => window.__pt.setEnv(env), testEnv);   // test build only

  await page.getByRole('link', { name: /what is that a month/i }).click();
  await expect(page).toHaveURL(/#\/c\/figures$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();

  await page.getByLabel('Your age').fill('58');
  await page.getByLabel('Your pension savings').fill('250,000');
  await page.getByRole('button', { name: 'Show my answer' }).click();

  await ready(page);                                          // waits for data-ready="true"; never a sleep
  await expect(page).toHaveURL(/#\/c\/answer$/);
  await expect(page.getByText(/sign in|create an account/i)).toHaveCount(0);

  // The figure on screen is the figure the answer function gives in Node for the same inputs.
  const values = { ...defaults(questionC, testEnv), people: [{ ...defaults(questionC, testEnv).people[0], age: 58, pot: 250000 }] };
  const expected = answerC(values, testEnv);
  const headline = page.getByTestId('headline-c.monthly.middle');
  expect(Number(await headline.getAttribute('data-value'))).toBe(expected.headline.monthly.middle);
  await expect(headline).toContainText(expected.sentence);
  expect(Number(await page.getByTestId('headline-c.monthly.bad').getAttribute('data-value')))
    .toBe(expected.headline.monthly.bad);

  // What was assumed is listed, and "Change" goes straight to that field.
  await page.getByRole('list', { name: 'What we assumed' })
    .getByRole('listitem').filter({ hasText: 'State Pension' })
    .getByRole('button', { name: /change/i }).click();
  await expect(page.getByLabel('State Pension a year')).toBeFocused();

  // Reload lands on the same screen with the same figures typed.
  await page.goBack();
  await page.reload();
  await ready(page);
  await expect(page).toHaveURL(/#\/c\/answer$/);
  await expect(headline).toHaveAttribute('data-value', String(expected.headline.monthly.middle));

  await noJunk(page);                                         // no "undefined", "-£0.00", banned words
  expect(errors()).toEqual([]);
});
```

A couple version of the same journey ("Two of us", four numbers, a final-salary pension of £9,000 a year from
age 60) ships in the same slice; that is what "couple-ready" means in practice.

---

## 11. The test build and its hooks

- **Two builds from one source.** `vite build --config vite.v7.config.js` (production, into `docs/v7/`) and
  the same with `--mode test` (into `dist/v7-test/`, which `.gitignore` already covers).
- In test mode only, the entry file loads `src/v7/testing/hooks.js`, which puts one object on the page:

  | Hook | Does |
  |---|---|
  | `__pt.setState(state)` | Draws any named state directly (used for screenshots) |
  | `__pt.getState()` | Returns the current state as data (used to compare screen with state) |
  | `__pt.setEnv({ now, marketDataId, seed })` | Pins the date, market data and seed |
  | `__pt.seedPlan(plan)` | Puts a plan fixture into guest storage, through the normal migration chain |
  | `__pt.meter(minutes)` | Sets the guest meter, so its messages can be tested without waiting |
  | `__pt.writes()` | Counts writes to storage since load (for "browsing never changes a locked plan") |

- The hooks file is a bundled module served from the same origin, so the strict script policy holds. The
  production build does not contain it: the import sits behind `import.meta.env.MODE === 'test'`, which Vite
  removes, and `tests/v7/boundaries.test.js` fails if the string `__pt` appears anywhere in `docs/v7/`.
- The test build keeps console output (so a journey can assert "no errors"); the production build keeps
  dropping it.
- **The production build is also exercised**, without hooks: `tests/browser/serve.mjs` is a 40-line static
  server that reads `public/_headers` and sends the same security headers Cloudflare does.
  `production.spec.js` walks question C on it and fails on any policy violation. Today the policy is never
  tested before deployment.
- **Screenshots are taken only on the CI machine** (one Linux image, one browser version), by a workflow the
  owner starts by hand. It publishes before / after / difference pictures; approving means committing the new
  pictures. Nothing is compared on the Mac, so no Docker set-up is needed and there are no "my machine draws
  fonts differently" failures.
- **Signed-in journeys** need the Firebase emulator, which the repository does not have. Not in slice C:
  question C never needs an account. It becomes necessary at step 7 (saved plans in the rail), and is the
  right way to do it then — no real account, no live data.

New development dependencies: `preact` (run time), `@testing-library/preact`, `@playwright/test`,
`@axe-core/playwright`, `fast-check`. Optional: `typescript` for checking only.

---

## 12. Performance

Measured today (v6.15.0 build in `docs/assets`, gzipped): main script **457 KB**, engine worker **119 KB**.
A first-time visitor downloads and parses the main script before seeing anything.

V7 splits by what the person asked for:

| Piece | Loaded when | Budget, gzipped (to be confirmed at the first build) |
|---|---|---|
| Shell: Preact, state, router, rail, components, front door, styles | Always | 35 KB |
| One question's screens, declaration and wording | The person opens that question (`import('./doors/c/index.js')`) | 15 KB each |
| Engine worker (answer functions + engines) | Started as soon as a question opens, so it is ready before "Show my answer" | about today's 119 KB, off the main thread |
| Firebase (auth + Firestore) | Only when the person chooses to sign in or keep a plan, or a flag in `localStorage` says this browser has signed in before | not on the first-answer path at all |
| Old views (plan document, auth screens) | When first shown | as they are |

So the forum guest's path to a first answer is about 50 KB of script on the main thread plus the worker, in
place of 457 KB. The budgets are enforced by `tests/v7/bundleSize.test.js` reading the build output, and by the
first-answer test: at most 2 required inputs (4 for a couple), at most 2 screens, no sign-up, engine wait
under 3 seconds with the processor slowed four times, no main-thread pause over 200 ms. The figures are written
to a small file per release so drift is visible.

The service worker stays unregistered, as the current app already does at boot. Whether V7 should work offline
is a separate decision for after cutover.

---

## 13. Living beside the current app

- **Separate build, separate folder.** A second Vite config, `vite.v7.config.js`, with `v7/index.html` as its
  input and `docs/v7/` as its output. `npm run build` runs the current build first (which empties `docs/`),
  then the V7 build. The two share source modules but not output files, so **the current app's scripts are
  identical whether or not V7 exists**. (The alternative — one build with two entry pages — lets the bundler
  move shared code into new files that the current page would then load; that is a change to the live app for
  no benefit.)
- **Unlinked.** Nothing in `index.html` points to `/v7/`. The page carries `<meta name="robots"
  content="noindex">`. It is reachable only by typing the address. It shows "Preview — not finished" in the
  header until cutover.
- **The switch.** One key in this browser's `localStorage`, `pt_shell`, read by a three-line check at the top
  of each page: absent or `classic` → the current app; `v7` → `/` forwards to `/v7/`. Before cutover only the
  owner sets it (from a link on the V7 page: "Use this version from now on in this browser" / "Go back"). This
  is the only edit V7 makes to `index.html` before cutover, and it can wait until step 7.
- **Same origin, same data.** Sign-in and guest plans are shared. V7 reads and writes plans only through the
  repositories, so the schema version, the migration chain, the "newer than this app" refusal and the locked
  plan protections apply without being re-implemented.
- **What V7 may not write before cutover**: anything inside a locked plan. Slice C writes only its own new key
  (and only when the person chooses to keep the plan). The rail test asserts zero writes when browsing a
  locked fixture.
- **Releases.** While V7 is unlinked it is not user-visible, so it needs no release note; it rides along in
  whatever is published from `main`. The switch link and the cutover are user-visible and ship under a version
  bump in the usual way (open question 4).
- **CI.** The existing `test` job gains the V7 build. A second job, `browser`, installs Chromium and runs the
  journeys, the first-answer count and the production-policy walk. It must pass for a commit to be released.

---

## 14. Cutover and rollback

**The rule (fixed decision):** V7 becomes the default only when the owner's locked plan gives identical
results in both.

**How that is checked, mechanically**

1. `tests/ownerPlan.local.test.js` already runs the owner's real plan (kept on his machine, never in the
   repository) through the current paths with the date and market data pinned. A sibling,
   `tests/v7/ownerParity.local.test.js`, runs the same file through V7's answer functions and compares every
   figure the two shells both show: the strategy result, the plan document, where-am-I, and this month's
   decision. Any difference is printed as a list of paths. It must be empty.
2. The same comparison runs on the twelve committed fixtures in `tests/fixtures/plans/`, in CI, on every push.
3. A browser walk on the owner's machine opens the plan in both shells and compares the `data-value` figures
   screen by screen.
4. The plan is byte-identical in storage before and after being opened and browsed in V7.

**Cutover, as one release (7.0.0)**

- The two build configs swap outputs: V7 builds to `docs/`, the current app to `docs/classic/`.
- `pt_shell` meaning flips: absent → V7; `classic` → forwards to `/classic/`. A "Use the previous version"
  link sits in the account menu for at least two minor releases.
- The rename to "Drawdown Planner" and the release note ship with it.
- `scripts/stamp-sw.mjs` and step 7 of `RELEASING.md` (the `grep` for `main-…`) are updated for the new file
  names.

**Rollback**

- *For one person*: the "Use the previous version" link. Instant, their choice, nothing lost — both shells
  read the same plans.
- *For everyone*: swap the two outputs back and deploy. No data step, **provided** no plan-shape change ships
  in the same release as the cutover. That is a rule of this architecture: 7.0.0 changes which shell is the
  default and nothing about saved data. Any shape change goes out in a 6.x release beforehand, through the
  migration chain, where the current app already understands it.
- *Cloudflare Pages* also keeps previous deployments, so the last 6.x can be restored from its dashboard in a
  minute if the build itself is at fault.

The old shell is deleted only when the owner says so, not on a timer.

---

## 15. Directory tree

```
vite.config.js                  current app build (unchanged)
vite.v7.config.js               V7 build → docs/v7/   (--mode test → dist/v7-test/)
playwright.config.js
v7/
  index.html                    about 30 lines: <div id="app">, one module script, noindex
src/
  answers/                      PURE. inputs + date + market data → result. No firebase, storage, ui.
    questionC.js
    contract.js                 the shape every answer must return (values, sentence, assumed, series, trace)
    toEngineConfig.js           validated values → the existing engines' config
  services/  strategies/  models/  utils/  data/     (existing engines — unchanged)
  storage/                      (existing — schema.js, migrations.js, repositories)
  firebase/                     (existing)
  workers/
    engineClient.js             (existing)
    engineWorker.js             (existing + one message type: 'answer')
  ui/                           (existing pure views and graphics — reused through OldView / Chart)
  v7/
    main.jsx                    boot: read address → initial state → render; start effects; test hooks in test mode
    App.jsx                     state → the right screen. Nothing else.
    state/
      initial.js                the empty state
      reduce.js                 (state, action) → state. Pure.
      actions.js                the list of actions, documented
      inputsKey.js              stable key for "which inputs was this answer for"
    router/
      routes.js                 parse(hash) ⇄ format(route); resolve(route, state)
    rail/
      index.js                  steps for a question + state → what the rail shows
      questionC.js
    schema/
      kinds.js                  money, age, choice, yesNo, person
      validate.js               defaults(), validate(), parse typed text → value
      cases.js                  edgeCases(), pairCases(), random generator (for tests)
      questionC.js
    copy/
      common.js                 shared words; the banned-word list lives beside it
      questionC.js              every sentence template and label for question C
    format/
      money.js  age.js          display only: £1,450 · "age 67"
    components/
      Shell.jsx  Rail.jsx  PhoneBar.jsx
      Field.jsx  PersonBlock.jsx
      Headline.jsx  BadCase.jsx  Assumed.jsx
      Chart.jsx  Working.jsx  Problem.jsx  Button.jsx  OldView.jsx
      index.js
    doors/
      front/FrontDoor.jsx       the six questions
      c/
        index.js                what the router loads for question C (its own download)
        FiguresScreen.jsx
        AnswerScreen.jsx
        NextScreen.jsx
    effects/
      index.js                  runs after each action; the ONLY impure code in V7
      answers.js                runInWorker('answer', …) and the result action
      data.js                   repositories, draft in sessionStorage, guest plan, hand-off
      account.js                AuthService, GuestMeter ticks, idle sign-out
      address.js                location.hash ⇄ route
    styles/
      tokens.css                colours (dark and light), spacing, type sizes
      base.css  components.css  print.css
    testing/
      hooks.js                  window.__pt — test build only
tests/
  answers/
    questionC.gen.test.js       edges, pairs, rules that must always hold
    questionC.trace.test.js     headline recomputed from the monthly trace
    scenarios/                  one JSON per research scenario, with its expected sentence
  v7/
    states/questionC.js         named state fixtures (shared by render, screenshot and browser tests)
    helpers/checkScreen.js      the generic checks run on every render
    render/*.test.jsx
    schema.test.js  roundTrip.test.js  rail.test.js  routes.test.js  reduce.test.js
    boundaries.test.js          who may import what; no test hook in the production build
    bundleSize.test.js
    ownerParity.local.test.js   skipped unless the owner's plan file is present
  browser/
    serve.mjs                   static server that applies public/_headers
    env.js  helpers.js
    journeys/forumGuest.spec.js  journeys/coupleFinalSalary.spec.js
    firstAnswer.spec.js  production.spec.js  screens.spec.js
    screens/                    approved pictures (made on the CI machine only)
  (all existing test folders unchanged)
```

---

## 16. What slice C costs under this architecture

Rough guesses in days of focused agent-plus-review work, not commitments. I have not built any of it.

| Piece | Days |
|---|---|
| Second build, `v7/index.html`, Preact wiring, tokens and base styles | 1 |
| State, reducer, router, rail, effects skeleton, with their tests | 2–3 |
| Input kinds, `validate`, case generators, the question C declaration | 2 |
| Components with accessibility built in, and `checkScreen` | 3 |
| Lifting the pure config builder out of `StressRepository`; `'answer'` in the worker | 1 |
| `answerC` itself (the "what can this pot pay" solve, couple-ready) and its generated tests | 4–6 — the real unknown; it is new engine work, not shell work |
| Three screens, named states, render tests | 2 |
| Playwright set-up, static server with headers, two journeys, first-answer count, CI job | 2 |
| Screenshot workflow and first approved pictures | 1 |
| **Total** | **about 18–21 days**, of which roughly 12 is shell and test machinery that every later question reuses |

Later questions then cost: a declaration, an answer function, a rail file, screens, named states. The
machinery is paid for once.

---

## 17. Risks and honest limits

- **The test build is not the production build.** The hooks and kept console output make them differ. The
  production-policy walk narrows the gap but only covers the path it walks.
- **Whole-app re-render** is a bet that screens stay small. The long-task budget will show if it stops being
  true; the fix (signals, or splitting the render) is local.
- **`OldView` is a hole in the rules.** Old HTML-string views are not drawn from V7 state in the same strict
  way and carry old wording. Each one needs its own wording pass, and the generic checks must run on their
  output too.
- **Hash addresses are slightly uglier** than plain paths and are invisible to search engines. The landing
  and trust pages (step 9) should be ordinary static pages for that reason, not screens in this shell.
- **Screenshots detect change, not ugliness**, and only for the named states someone wrote.
- **The bundle budgets are estimates** until the first build; the Preact size is from published figures, not
  measured here.
- **The answer for question C does not exist yet.** This document fixes its contract, not its arithmetic. If
  the solve is slow, the under-three-seconds budget may force fewer simulated futures for the first answer
  and a fuller run afterwards — a product decision, not an architectural one.

---

## 18. Open questions for the owner

1. **Preact alone, without signals** — accepted as the starting point?
2. **Address form** `pensiontools.uk/v7/#/c/answer`, with figures never in the address. This rules out "send
   someone a link to my answer". Acceptable, or is a shareable answer wanted later?
3. **Type checking without TypeScript** (`tsc --checkJs` over `src/v7` and `src/answers` in CI): worth one
   more development dependency?
4. **Release notes while V7 is unlinked**: is "reachable only by typing the address" outside the
   every-visible-change rule, as assumed here?
5. **Old views with `data-on-*` handlers** (the plan document's buttons, the auth screens): wrap them with a
   small named handler table inside `OldView`, or rewrite each as a Preact component when its step arrives?
   This proposal assumes wrap first, rewrite when touched.
6. **Privacy policy**: the unsaved try in `sessionStorage`, the `pt_shell` and "has signed in before" keys in
   `localStorage` — confirm whether `compliance/PRIVACY_POLICY.md` needs a line before slice C is reachable.
7. **Light theme**: build it with slice C (the tokens and the contrast test make it cheap now, expensive
   later), or dark only until cutover?
8. **Screenshots on the CI machine only**, approved by committing the pictures — is that review step one you
   are willing to do before each release, for about ten to twelve pictures in slice C?
