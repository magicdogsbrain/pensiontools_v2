# V7 shell — the decided architecture

Decided 30 Sep 2026 from the two proposals, which stay in this folder as the record
(`architecture-A.md`, `architecture-B.md`). Nothing here is built. Where this document and either proposal
disagree, this document wins. The code-level contracts (input list, answer result, state, addresses, test
hooks) are in `step3-build-brief.md`; this document says what was chosen and why.

Checked against the repository at v6.15.0 on 30 Sep 2026: `vite.config.js`, `package.json`,
`public/_headers`, `src/workers/engineWorker.js`, `src/workers/engineClient.js`,
`src/storage/StressRepository.js`, `.github/workflows/test.yml`. One thing was run: `calculateTax` at
£110,000, £125,140 and £150,000, which gave £32,432, £40,002 and £51,189 — the wrong figures the test plan
reported. Nothing else was run.

## 1. The decision in one table

The choice is **B's core with four things taken from A**.

| Question | Decided | From |
|---|---|---|
| What draws the screens | **Preact**, and nothing else at run time. No signals, no state, form or router library. | B |
| State | One plain object that survives `JSON.stringify`, one pure reducer, the whole app redrawn from it. No `useState` in screens. | B |
| Where V7 lives | Its own page at **`/v7/`**, from its **own build** (`vite.v7.config.js` → `docs/v7/`). The current app's files are byte-for-byte the same whether V7 exists or not. | B |
| The switch | **The address is the switch.** Nothing links to `/v7/`; it carries "do not index" markers and a "Preview" line. No setting in the browser, no edit to `index.html`. | A |
| Addresses | After the `#`: `/v7/#/c/numbers`, `/v7/#/c/answer`. One per step. Figures never appear in an address. | both; step names from the rail design |
| Who calculates | Only modules in `src/answers/`. Each is a declared input list plus one pure function `answer(inputs, env)`. | both |
| Where the input list lives | **Beside the answer**, in `src/answers/c/schema.js`, with no words in it. Labels and help text live in `src/v7/copy/`. | A (place), B (one declaration drives form, defaults, checks and test cases) |
| Sentences | Built inside the answer function from the same numbers, by templates in `src/answers/c/sentences.js`. `src/answers/` never imports from `src/v7/`. | A |
| The worker | A **new, separate worker** for V7 (`src/v7/effects/answerWorker.js`). The existing `engineWorker.js` and `engineClient.js` are not edited. | neither — see 3.3 |
| The old event interpreter (`data-on-*`) | Not used in V7. Events are ordinary Preact handlers that dispatch an action. | both |
| Firebase, saving, sign-in | **Not in the first slice at all.** No file in `src/v7/` may import `src/storage` or `src/firebase` yet; a test enforces it. | A, made stricter |
| Test seams | `window.__pt` in a test build only; `data-key` + `data-value` on every number; `data-ready="1"` on `#app` and a `pt:done` event. | both |
| Old shell | Frozen to fixes; its inline script may only shrink (a test). Code leaves it by pin → move → point the old shell at it → use from an answer. | A |
| Cutover | One release (7.0.0) that swaps the two build outputs and changes nothing about saved plans. Rollback is swapping back from the current commit, never redeploying an older build. | B (swap), A (rollback rule) |

New run-time dependency: `preact`. New development dependencies: `fast-check`, `@playwright/test`,
`@axe-core/playwright`. Not added: `@testing-library/preact`, TypeScript, `lit-html`, signals.

## 2. The judgement

### 2.1 One developer plus AI agents

A's shell is about 450 lines of our own code: a store, a router, a "regions" drawing routine and a form
binder. It has no dependency, which is attractive. But the drawing routine is the part a framework exists to
do, and A admits its weak spot: a form that changes shape while someone is using it. The question C form
changes shape five ways on one screen (State Pension "my forecast" opens a box; final-salary "yes" opens two;
"add a partner" opens five; "add more detail" opens four; "start from age" opens one). Under A each of those
replaces the form's HTML, which drops keyboard focus from the control just pressed. Every agent asked to fix
that would invent its own patch. A names `lit-html` as the fallback "by the end of step 4", which means
rewriting the screens of the first slice after the pattern has been set for every later one.

B hands that one job to Preact. The component idiom is the one agents write most reliably, and the house
rules (no `useState` in screens, screens import only components and words) stop it growing into a second big
script. **B wins this criterion.**

### 2.2 Every screen drawn from a saved state

Both can do it. A's is weaker in one respect: a form region "keyed by shape" is deliberately *not* redrawn
when values change, so what is in the boxes is no longer a pure function of the state, and the round-trip
test (type → state → draw → read back) has to reach into live boxes. In B the boxes are drawn from
`state.draft` every time, so a state file fully decides the screen. The same state files serve the render
tests, the screenshots and the browser journeys. **B wins.**

One thing is taken from the test plan rather than from B: render tests use Preact's own `render` into a
jsdom container and the project's `checkScreen` helper, not `@testing-library/preact`. One dependency fewer,
and the test files stay `.js`, so the existing test pattern (`tests/**/*.test.js`) is unchanged.

### 2.3 The security policy

Equal. Neither uses `eval` or inline script. V7's page has one module script tag. Preact sets styles through
the page's own objects rather than `style="…"` text, so V7 adds no new dependence on `'unsafe-inline'`. The
browser job serves the built page with the real `public/_headers` and walks question C, so the policy is
exercised before deployment for the first time.

### 2.4 Size and speed on a phone

Preact is about 4.5 KB compressed (a published figure, not measured here) against A's zero. Both remove the
real cost, which is the 457 KB main script of today's app, and both keep Firebase off the first-answer path.
The difference between A and B is under 1% of what a first-time visitor downloads today. **A wins narrowly;
it does not matter.**

What does matter is the answer itself. The household plan measured 13 seconds for the default case at 1,000
futures on a fast laptop. That is an engine problem, not a shell problem, and it is handled by two things in
the build brief: a first figure from 100 futures, then the final figure from 1,000; and a speed-up of
`planDrawdown`'s tax-free branch as its own 6.x release.

### 2.5 How little it disturbs the live app

A adds a second page to the *same* build. The bundler is then free to move shared code into new files that
today's page would load — a change to the live app for no benefit. A also edits `engineWorker.js`, which the
live app runs. B's separate build leaves today's scripts identical, but B also edits `engineWorker.js` and
lifts code out of `StressRepository.js`.

The decided design goes further than either: **the first slice edits no file the live app loads.** V7 has
its own build and its own worker. Question C does not read a saved plan, so
`createSimulationConfigFromSettings` does not need lifting yet (it is lifted when a later slice opens saved
plans, by A's pin-move-point method). The only shared files touched are `vite.config.js` (two settings that
tell the bundler how to read `.jsx` files, of which the live app has none), `package.json`, `.gitignore`,
`public/_headers` (one added block for `/v7/*`) and the CI workflow. A test compares the file names in
`docs/assets/` before and after to prove the live bundle did not change.

Two engine fixes do touch the live app, and ship as their own 6.x releases with release notes, outside the
slice: the income-tax sum above £100,000, and the `planDrawdown` speed-up.

### 2.6 Cutover safety for a locked plan

Both proposals protect a locked plan the same way: V7 reads saved plans through today's repositories (so the
version check and upgrade chain apply), turns saved settings into engine inputs through today's functions
(so there is one path from plan to numbers), and refuses to write a locked plan's Stress or Decision settings,
history or plan documents. Since 6.20.2 today's repositories enforce the settings half themselves: every save of a
locked plan's Stress or Decision settings is refused unless it changes only a named bookkeeping key (the plan-start
pin, the unlock itself; the list is in `src/services/LockedPlanGuard.js`), and the store applies the same rule to the
plan as stored, just before it writes, so a tab that loaded the plan before it was locked elsewhere is refused too.
V7 inherits the rule by going through them.

For the first slice the protection is stronger and simpler: **V7 cannot write a plan because it cannot
import the code that does.** The import test fails the build if any file under `src/v7/` imports
`src/storage` or `src/firebase`. The only thing V7 stores is one browser key of its own, `pt_v7_draft`, in
session storage. A browser test puts a locked fixture plan where today's app keeps guest plans, visits every
V7 address, and checks the stored plan is identical afterwards.

From B: the 7.0.0 release changes which shell is the default and nothing about the shape of saved plans; any
shape change ships in a 6.x release first, where today's app already understands it. From A: roll back by
swapping the outputs again from the current commit; never by redeploying an old build, which may not know the
current `schemaVersion`.

### 2.7 The result

| Criterion | A | B | Decided design |
|---|---|---|---|
| One developer plus agents | Own drawing code; forms that change shape are a known weak spot | Known idiom; one small dependency | B |
| Every screen from a state file | Yes, except live form boxes | Yes, fully | B, without the extra testing library |
| Security policy | Unchanged | Unchanged | Unchanged, and tested before deploy |
| Size on a phone | 0 KB added | about 4.5 KB added | B; the saving against today is the same |
| Disturbance to the live app | Shared build; worker edited | Separate build; worker edited; repository code lifted | Separate build, separate worker, nothing lifted yet |
| Locked-plan safety | Save guard | Save guard + folder swap | No save path at all in the first slice; both guards when saving arrives |

## 3. The design

### 3.1 Layers

```
   address (#/c/answer)                         what was typed (this tab only)
            │                                              │
            ▼                                              ▼
   ┌────────────────────── state: one plain object ──────────────────────┐
   │ route · env · session · plan · draft · answers · ui                  │
   └──────▲───────────────────────────────┬──────────────────────────────┘
          │ actions                        │ draw(state)
   reducer (pure)                          ▼
          ▲                        screens and components (Preact) — work out nothing
          │ results                        │ dispatch(action)
   effects (the only code that touches the outside) ◄──┘
     ├─ address:  location.hash ⇄ state.route
     ├─ run:      answerWorker → src/answers/c/answer.js → today's engines, unchanged
     ├─ draft:    sessionStorage key pt_v7_draft
     └─ clock:    reads the date once at start-up
```

| Layer | Folder | Pure | May import |
|---|---|---|---|
| Answers | `src/answers/` | yes | `src/services`, `src/strategies`, `src/models`, `src/utils`, `src/data`, `src/constants.js`, itself |
| State, addresses, rail | `src/v7/state/`, `router/`, `rail/` | yes | each other; `src/answers/*/schema.js`; `src/answers/shared/validate.js` |
| Screens and components | `src/v7/screens/`, `components/`, `App.jsx` | yes (state in, page out) | `preact`, `components/`, `copy/`, `router/routes.js`, `state/select.js`, `src/answers/shared/format.js`, a question's `schema.js` |
| Words | `src/v7/copy/` | data | nothing |
| Effects | `src/v7/effects/`, `main.jsx`, `testing/hooks.js` | no | anything in `src/v7`, `src/answers/index.js` |

Rules a test enforces by reading `import` lines (`tests/v7/boundaries.test.js`):

1. `src/answers/**` never imports `src/v7`, `src/ui`, `src/storage` or `src/firebase`, and contains no
   `Math.random`, `Date.now` or bare `new Date()`.
2. Screens and components never import an answer function or an engine.
3. Nothing in `src/v7/` imports `src/storage`, `src/firebase`, `src/workers` or `src/ui/inlineHandlers.js`
   (first slice; rule 3 is relaxed for one named effects file when saving arrives).
4. Only files in `src/v7/effects/` and `src/v7/testing/` use `window`, `location`, `sessionStorage`,
   `Worker` or the clock.

### 3.2 State

One object. Everything a screen can show is in it; nothing is read back out of a box.

- `draft` holds what was typed, **as typed** (text, including a half-finished "25,00"), keyed by field path.
  A pure function turns it into checked inputs or a list of problems.
- `answers.c` carries the key of the inputs it was worked out from. A screen shows a figure only when that
  key matches what is typed now; otherwise it shows the old figure greyed and marked "Updating".
- `env.today` is the only date anything in V7 uses. The one place the real clock is read is
  `effects/clock.js`, at start-up.
- `plan` and `session` exist in the shape from day one and stay empty in the first slice.

The reducer is pure. Effects watch the state after each action, do the outside work, and dispatch the
outcome. Every action is a plain object, so a session can be recorded and replayed in a test.

### 3.3 The worker

V7 starts its own worker, `src/v7/effects/answerWorker.js`. It understands two messages:

- `init` — carries today's date; replies `ready` with the last month of market history the engine holds.
- `answer` — carries the question id, the checked inputs and the run settings; replies with progress counts
  and then the result.

Reasons for a separate worker rather than adding a message type to `engineWorker.js`: the live app's worker
bundle stays identical; V7's worker does not fetch live gilt and share prices it does not need (question C
uses only the bundled market history, the same futures the strategy comparison uses); and the date reaches
the worker as an input, so a pinned date in a test is pinned there too.

A new run while one is under way ends the old worker and starts a fresh one, so a phone is never working on
figures nobody is waiting for. A late result for old inputs is dropped by its key. If a worker cannot start,
the answer runs on the page itself with "Working out your answer" showing — slower, never wrong.

When a later slice needs the existing strategy runs (question E), the V7 worker imports the same engine
functions; `engineWorker.js` is deleted with the old page.

### 3.4 Addresses

`parse(hash)` and `format(route)` are pure and tested as a round trip. Every move between steps is an
ordinary link built with `format()`, so the back button, "open in new tab" and the keyboard work with no
code, and a test can collect every link on a screen and check it leads somewhere.

An address that needs figures which are not there shows a short form for just those figures on that step.
An unknown address shows the front door with one line saying the page was not found. The address for a saved
plan (`#/plan/<id>/c/answer`) is reserved and not built in the first slice.

### 3.5 Forms

`Field` draws one input from its declaration (type, limits, test id) and its words from `copy/`. There is no
other way to put an input on a screen, and a test checks the form holds exactly the fields that apply — no
more, no fewer. Boxes are controlled by the state. Money boxes are text boxes with a number keypad; nothing
reformats what is being typed until the box is left.

Accessibility is inside the components (real labels, errors joined to their box, one main heading that takes
focus after a move, 44-pixel targets on a phone, colours only from tokens with a contrast test), as B
specified.

### 3.6 Living beside the current app

- `npm run build` runs today's build first (which empties `docs/`), then the V7 build into `docs/v7/`.
- `/v7/` carries `<meta name="robots" content="noindex">`, and `public/_headers` gains `X-Robots-Tag:
  noindex` for `/v7/*`. The page shows one line: "Preview of the next version. The current version is here."
- Both shells are on the same site, so when saving arrives they share sign-in and saved plans.
- B's browser setting (`pt_shell`) that forwards `/` to `/v7/` is **not** built now. It would be the first
  edit to `index.html`; it waits for the cutover plan.

### 3.7 Test build and hooks

Two builds from one source: the published one (`docs/v7/`, or `dist/prod/v7/` for the browser job) and a
test one (`--mode test`, `dist/test/v7/`, never deployed). Only the test build loads
`src/v7/testing/hooks.js`, which puts `window.__pt` on the page. A browser test fails if `__pt` appears
anywhere in the published output. The forum-guest journey and the security-policy walk run on the published
build with no hooks; seeded journeys and screenshots use the test build. Screenshots are made and compared
only on the CI machine.

### 3.8 Performance budgets

| Piece | Loaded | Budget (compressed; to be measured at the first build) |
|---|---|---|
| Shell: Preact, state, addresses, rail, components, front door, styles | always | 35 KB |
| Question C: screens and words | when the question opens | 15 KB |
| The V7 worker: answer functions and engines | started when a question opens | about today's 119 KB, off the page's own thread |
| Firebase | not in the first slice | — |

First answer, measured in the browser with the processor slowed four times: first figure within 3 seconds of
asking, final figure within 15 seconds, no pause on the page over 200 ms.

### 3.9 Cutover and rollback (for step 8; recorded here so nothing built now blocks it)

Before the switch: the owner's locked plan (on his machine, never in the repository) and the twelve committed
fixture plans give identical figures through today's path and through V7's, to the penny; the stored plan is
byte-identical after being opened and browsed in V7; every rail step has a screen; the owner has used V7 for
one real monthly record.

The switch is release 7.0.0: V7 builds to `docs/`, today's app to `docs/classic/`; a "Use the previous
version" link stays for at least two releases; the rename to "Drawdown Planner" and the release note ship
with it. No change to the shape of saved plans in that release.

Rollback: swap the two outputs back from the current commit and deploy. Never redeploy an older build.
The old page is deleted only when the owner says so.

## 4. What was rejected, and why

| Rejected | Why |
|---|---|
| A's "regions" drawing routine and shape-keyed forms | Loses focus when a form changes shape; boxes stop being a function of the state |
| A's second page inside the same build | Lets the bundler reshuffle the live app's files |
| A's and B's added message type in `engineWorker.js` | Edits a file the live app runs, for a slice that does not need it |
| B's lift of `createSimulationConfigFromSettings` now | Question C does not read saved settings; do it when a slice does |
| B's `pt_shell` forward | First edit to `index.html`; not needed while the address is the switch |
| B's `@testing-library/preact` | The project's own `checkScreen` and test ids cover it |
| B's input list under `src/v7/schema/` holding labels | The answer and its tests need the list without the screen code; words belong in one place |
| B's `OldView` wrapper | Nothing from the old views is shown in the first slice; decide when the first one is needed |
| `lit-html`, Svelte, Lit, signals | As argued in A section 6.3 and B section 2 |
| Type checking with `tsc --checkJs` | One more tool to keep working; revisit after the slice |

## 5. Risks that remain

| Risk | What limits it |
|---|---|
| The answer is slow on a phone (13 s for 1,000 futures on a fast laptop today) | First figure from 100 futures; the `planDrawdown` speed-up as its own release; the budget is measured in CI |
| Two separate builds drift (a setting changed in one) | Both read the same `src/`; the browser job builds and walks both; the "live bundle unchanged" test |
| Redrawing the whole app on each keystroke lags | Screens are small; the 200 ms budget shows it; the fix (splitting the draw) is local |
| The test build is not the published build | The forum-guest journey, its counts and the policy walk run on the published build |
| V7 at `/v7/` is reachable by anyone who guesses the address | Not linked, not indexed, marked "Preview", stores nothing outside the tab |
| Preact is a dependency to keep current | Small, stable, no dependencies of its own |

## 6. Decisions still the owner's

1. Preact as the one run-time dependency — accepted?
2. `/v7/` on the live site, unlinked, from the first slice — or kept off until later?
3. No release note for unlinked V7 work until 7.0.0 (the two engine fixes do get notes) — accepted?
4. Figures never in an address, so an answer cannot be sent to someone as a link — accepted?
5. The old page gets fixes only from now on, and its inline script may only shrink — accepted?
