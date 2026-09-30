# V7 shell — architecture A: the smallest thing that works

Draft for the owner, 30 Sep 2026. Nothing here is built. This is one of the competing proposals for the
"rail and screen" shell that step 3 of `research/v7-plan-of-plans.md` needs. It is optimised for one thing:
the least new machinery that still meets every fixed decision. Where a choice was close, the option with
fewer moving parts won, and the runner-up is named so it can be swapped in later.

Checked against the repository on 30 Sep 2026 (v6.15.0): `vite.config.js`, `public/_headers`,
`src/workers/*`, `src/ui/inlineHandlers.js`, `src/storage/schema.js` and `migrations.js`,
`src/firebase/*`, `src/services/GuestMeter.js`, `src/services/LinkerUniverse.js`, `EquityIndex.js`,
`RELEASING.md`, `.github/workflows/test.yml`. Nothing was run.

## 1. The proposal in one page

| Question | Answer |
|---|---|
| How does V7 sit beside the current app? | A second page, `v7.html`, built by the same Vite build into the same `docs/` folder. The current `index.html` is not touched. |
| How is it deployed without being linked? | It ships with every release at `pensiontools.uk/v7.html`. Nothing links to it, and it carries "do not index" markers. The switch is the address. |
| Framework? | None. Screens are plain functions that take the state and return HTML text. About 450 lines of shell code in total. Fallback if that proves painful: `lit-html` (see 6.3). |
| Addresses | The part of the address after `#`. One per screen, one per saved plan. Works on Cloudflare Pages and the GitHub Pages mirror with no server rules. |
| State | One store object: the plan, the quick-question answers so far, where you are on the rail, today's date, market data, and the results of calculations. |
| Who calculates? | Only "answer" modules in `src/answers/`: a declared list of inputs plus one pure function. Light ones run directly, heavy ones in the existing worker. Screens only read results. |
| Forms | Drawn from the answer's input list. One listener for the whole page writes typed values into the store. No per-field code. |
| Events and the security policy | V7 does not use the `data-on-*` expression interpreter. It uses two fixed attributes, `data-bind` and `data-action`. The security policy stays exactly as it is. |
| Existing engines, saving, sign-in, guest mode | Imported as they are. Firebase is loaded only when someone signs in or opens a saved plan, so a first answer never waits for it. |
| Test seams | `window.__pt` in a test build only; `data-value` on every number; `data-testid` from the input list; a `pt:done` event and a `data-ready` mark. |
| Cutover | Swap which page is the default, in one commit. Both pages keep shipping. Rolling back is swapping them again. |

New runtime dependencies: none. New development dependencies: none for the shell itself (Playwright and
fast-check belong to the test strategy plan, not to this one).

## 2. Living beside the current app

### 2.1 A second page, not a flag inside the first

Two options were weighed.

- **A flag inside `index.html`** (for example `?v7=1` deciding which shell boots). Rejected. `index.html` is
  a 14,559-line file whose inline script runs on load, registers 345 window functions and starts sign-in.
  A flag there means the new shell inherits the old page's markup, styles and start-up order, and every V7
  test would be loading the old shell too.
- **A second page, `v7.html`** (proposed). About 30 lines of HTML and one script tag. Vite already has a
  named input list; adding a page is one line. The two shells share `src/` modules through Vite's normal
  code splitting, so an engine fix reaches both.

```js
// vite.config.js — the only change
rollupOptions: { input: { main: './index.html', v7: './v7.html' }, ... }
```

`scripts/stamp-sw.mjs` reads the `main-<hash>.js` name from `docs/index.html`; the `v7` entry produces
`v7-<hash>.js`, so that script is unaffected. The service worker is not registered by the current app (it is
actively unregistered at start-up), so there is no cache to confuse.

### 2.2 Deployed, but not linked

- `v7.html` is built into `docs/` and deployed with every release by the existing steps in `RELEASING.md`.
- Nothing in `index.html`, the landing page, the manifest or the release notes links to it.
- `v7.html` has `<meta name="robots" content="noindex">`, and `public/_headers` gains a block
  `/v7.html` → `X-Robots-Tag: noindex`.
- The page shows a one-line strip while it is not the default: "Preview of the next version. Your saved
  plans are safe; the current version is here." with a link back to `./`.
- The owner (and anyone he sends the address to) opens `pensiontools.uk/v7.html` on any device. That is the
  switch. No setting, no local storage flag, nothing to forget to turn off.

Release notes: a page nobody is pointed at is not a user-visible change, so V7 work ships inside ordinary
releases without its own entry until cutover. The 7.0.0 entry is written at cutover. (Owner to confirm; see
section 15.)

### 2.3 What V7 may and may not do to saved plans while both exist

- V7 reads saved plans through the same repositories as the current app, so the same upgrade chain runs on
  load whichever page opened the plan.
- V7 never writes `decisionTool.settings`, `decisionTool.history`, `planDocument` or `planDocumentArchive`
  on a locked plan. `migrations.js` already refuses any upgrade step that alters them; V7's save path
  carries the same check (section 9.3).
- Anything V7 adds to a saved plan is a **new key at the root** (proposed: `household` and `answers`),
  added through one new upgrade step (`schemaVersion` 2) when the first slice that saves needs it. The
  current shell ignores root keys it does not know and its saves are partial updates, so it leaves them
  alone.
- The first slice (question C) saves nothing to a plan at all (section 9.1), so step 3 needs no upgrade
  step.

## 3. Directory tree

```
v7.html                         the new page: <div id="app">, one module script, nothing inline
src/
  answers/                      PURE. No DOM, no storage, no clock, no fetch. Shared by screens, worker, tests.
    index.js                    the list of answers: { c: potToMonthly, ... }
    schema.js                   field types, validate(schema, inputs), defaults(schema), boundary values
    potToMonthly.js             question C: schema + answer(inputs, ctx)
    sentences.js                plain-sentence templates: (result) -> text, one per headline
    (whenCanIStop.js, savingEnough.js, willItLast.js ... one per question, steps 4-6)
  v7/
    main.js                     start-up: store, router, mount, market, worker, test hooks (test build only)
    store.js                    createStore + the reducer + setIn/getIn            (~90 lines)
    router.js                   parse / format / start                              (~60 lines)
    mount.js                    draws regions, keeps focus, raises the done signal  (~70 lines)
    form.js                     fields(schema, values, errors) -> HTML; the one input listener (~90 lines)
    actions.js                  the table of named actions buttons may call         (~40 lines)
    html.js                     html`` tag that escapes by default; money(), age(), pct(), num()  (~60 lines)
    rail.js                     the rail as data (stations, order, optional, guards) + railHtml(state)
    runner.js                   watches inputs, runs answers (direct or worker), stores results (~70 lines)
    market.js                   loads gilt and share data once, records where it came from
    session.js                  sign-in, guest mode, plan load/save — the ONLY file that imports Firebase (lazy)
    testHooks.js                window.__pt — imported only when the build mode is "test"
    strings.js                  every user-facing word that is not a sentence template (rail labels, buttons)
    v7.css                      tokens copied from the current app, rail, form, answer card, phone layout
    screens/
      index.js                  the list of screens
      frontDoor.js              the six questions
      c-answer.js               question C: form and answer on one screen
      notFound.js
  workers/
    engineWorker.js             existing; gains two message types: "init" and "answer" (section 8)
    engineClient.js             existing; gains whenReady()
tests/
  v7/
    store.test.js  router.test.js  form.test.js  rail.test.js
    screens.render.test.js      every screen x generated states: no "undefined", every number has a sentence
    noTestHook.test.js          the built docs/ bundle does not contain "__pt"
    shellRatchet.test.js        index.html's inline script may only get shorter (section 10)
  answers/
    potToMonthly.test.js        boundaries, rules that always hold, independent recomputation
e2e/                            browser tests (owned by the test strategy plan; listed here for the seams only)
```

Two rules about this tree, both checkable by a test that scans imports:

1. `src/answers/**` imports only from `src/services`, `src/strategies`, `src/models`, `src/utils`, `src/data`.
   Never from `src/v7`, `src/ui`, `src/storage` or `src/firebase`.
2. `src/v7/screens/**` imports only `html.js`, `form.js`, `strings.js`, `rail.js`, the pure graphic builders
   in `src/ui/*Graphic.js`, and **the `schema` export** of an answer. Never the `answer` function, never an
   engine, never a repository. This is how "the screen computes nothing" is enforced rather than hoped for.

## 4. Addresses: the router

### 4.1 Why the part after `#`

Cloudflare Pages could rewrite clean paths, but the GitHub Pages mirror cannot, and the build uses relative
asset paths (`base: './'`). Addresses after `#` need nothing from the server, survive a reload on both hosts,
and the browser's back button works. At cutover `v7.html#/…` becomes `/#/…` with no change to the router.

### 4.2 The address scheme

| Address | Screen |
|---|---|
| `#/` | The front door: the six questions |
| `#/what-is-that-a-month` | Question C, working on figures not yet saved as a plan |
| `#/when-can-i-stop`, `#/am-i-saving-enough`, `#/will-it-last` | A, B, D in the same way (steps 4–6) |
| `#/plan/<planId>` | A saved plan's home: where you are on the rail |
| `#/plan/<planId>/<station>` | One station of the rail for that plan, e.g. `…/compare`, `…/what-you-hold`, `…/this-month` |
| `#/plan/<planId>/<station>?show=<detail>` | A named detail opened on that station (a strategy, an age, a section) |
| `#/sign-in`, `#/plans`, `#/whats-new` | Account screens |

Rules:

- **Figures never go in the address.** Pot sizes and ages stay in the store. Addresses end up in browser
  history, screenshots and forwarded messages; this app's data protection stance is that financial figures
  do not leak that way. A test opens a screen directly by seeding the store through the test hook instead.
- An address that needs figures which are not there yet does not bounce the person elsewhere: the screen
  itself shows the few questions it needs (the "every entry point is legitimate" requirement).
- An address for a plan the person cannot open (signed out, wrong account, deleted) shows a plain screen
  with the two ways forward, never a blank page.
- The router is two pure functions plus ten lines of wiring, so the rail checks can run in vitest.

### 4.3 Sketch — `src/v7/router.js`

```js
import { screens } from './screens/index.js';

// '#/plan/abc123/compare?show=ladder' -> { screen: 'plan.compare', planId: 'abc123', params: { show: 'ladder' } }
export function parse(hash) {
  const [pathPart, queryPart = ''] = String(hash || '').replace(/^#/, '').split('?');
  const parts = pathPart.split('/').filter(Boolean).map(decodeURIComponent);
  const params = Object.fromEntries(new URLSearchParams(queryPart));
  let planId = null;
  if (parts[0] === 'plan' && parts[1]) { planId = parts[1]; parts.splice(0, 2); }
  const path = '/' + parts.join('/');
  const hit = screens.find((s) => s.path === path && !!s.needsPlan === !!planId);
  return { screen: hit ? hit.id : 'notFound', planId, params };
}

// The reverse. format(parse(x)) === x for every known address (tested).
export function format({ screen, planId = null, params = {} }) {
  const s = screens.find((x) => x.id === screen);
  if (!s) return '#/';
  const base = (planId ? '/plan/' + encodeURIComponent(planId) : '') + (s.path === '/' && planId ? '' : s.path);
  const q = new URLSearchParams(params).toString();
  return '#' + (base || '/') + (q ? '?' + q : '');
}

// Wiring: the address drives the store, never the other way round.
export function startRouter(store, win = window) {
  const sync = () => store.dispatch({ type: 'route', route: parse(win.location.hash) });
  win.addEventListener('hashchange', sync);
  sync();
  return {
    go(route, { replace = false } = {}) {
      const h = format(route);
      if (h === win.location.hash) return;
      if (replace) win.history.replaceState(null, '', h), sync();
      else win.location.hash = h;                 // fires hashchange -> sync
    }
  };
}
```

Every link on a screen is an ordinary `<a href="#/…">` built with `format()`. Ordinary links mean the back
button, "open in new tab" and keyboard use all work with no code, and a crawler test can collect every
`href` on a screen and check each one parses to a known screen.

## 5. One store

### 5.1 The shape

```js
{
  route:   { screen: 'c.answer', planId: null, params: {} },        // where on the rail
  clock:   { today: '2026-09-30' },                                  // set once at start; pinned in tests
  market:  { status: 'bundled' | 'live', asOf: '2026-09-29', gilts: {...}, equity: {...} },
  session: { status: 'none' | 'guest' | 'signedIn', name: null, guestMinutesUsed: 0 },
  plan:    null,            // the saved plan exactly as the repository returned it; never edited in place
  planStatus: 'none' | 'loading' | 'ready' | 'missing' | 'newer',
  draft:   { c: { you: { age: 60, pot: 250000 }, couple: false, partner: {...}, risk: 'balanced', ... } },
  answers: { c: { status: 'idle' | 'invalid' | 'running' | 'done' | 'failed',
                  inputsKey: '…', errors: {}, result: null } },
  ui:      { touched: {}, open: {} }     // which fields have been visited; which "show me more" panels are open
}
```

Everything a screen can show is in here. There are no `window._*` caches, no values read back out of input
boxes, and no module-level variables in `src/v7`. `plan` is what is saved; `draft` is what someone has typed
on a quick question before there is a plan. A station of a saved plan edits a working copy under
`draft.plan`, and saving is an explicit action (section 9.3) — so browsing a plan cannot change it.

### 5.2 Rules

- The only way to change state is `store.dispatch(action)`. The reducer is pure: same state and action in,
  same state out. It never calls an engine, storage or the clock.
- Anything that takes time or touches the outside (run an answer, load a plan, save, fetch market data)
  is a **subscriber**: it watches state, does its work, and dispatches the outcome. There are four:
  `mount.js` (draws), `runner.js` (answers), `session.js` (plans and sign-in), `market.js`.
- Subscribers are told once per batch, in a microtask, so ten field changes in one tick cost one redraw.

### 5.3 Sketch — `src/v7/store.js`

```js
export const getIn = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);

// Returns a new object with `path` set; untouched branches are shared, so "did this part change?" is ===.
export function setIn(obj, path, value) {
  const [head, ...rest] = path.split('.');
  const cur = obj && typeof obj === 'object' ? obj : {};
  const next = rest.length ? setIn(cur[head], rest.join('.'), value) : value;
  return cur[head] === next ? cur : { ...cur, [head]: next };
}

const WRITABLE = /^(draft|ui)\./;          // typed input may only land here — never in plan, clock or market

export function reduce(state, a) {
  switch (a.type) {
    case 'route':   return { ...state, route: a.route };
    case 'field':   if (!WRITABLE.test(a.path)) throw new Error('not writable: ' + a.path);
                    return setIn(state, a.path, a.value);
    case 'touched': return setIn(state, 'ui.touched.' + a.path.replace(/\./g, '/'), true);
    case 'answer':  return setIn(state, 'answers.' + a.id, a.entry);      // { status, inputsKey, errors, result }
    case 'clock':   return { ...state, clock: { today: a.today } };
    case 'market':  return { ...state, market: a.market };
    case 'session': return { ...state, session: a.session };
    case 'plan':    return { ...state, plan: a.plan, planStatus: a.status };
    case 'seed':    return { ...state, ...a.patch };                       // test build and sign-in hand-off only
    default:        return state;
  }
}

export function createStore(initial, reducer = reduce) {
  let state = initial, queued = false, busy = 0;
  const subs = new Set();
  const flush = () => { queued = false; for (const f of subs) f(state); };
  return {
    get: () => state,
    subscribe(f) { subs.add(f); return () => subs.delete(f); },
    dispatch(action) {
      const next = reducer(state, action);
      if (next === state) return;
      state = next;
      if (!queued) { queued = true; queueMicrotask(flush); }
    },
    // Outside work in progress (an answer running, a plan loading). The done signal waits for zero.
    begin() { busy++; }, end() { busy = Math.max(0, busy - 1); if (!queued) { queued = true; queueMicrotask(flush); } },
    isBusy: () => busy > 0 || queued
  };
}
```

The initial state comes from `initialState({ today, draft })`, where `draft` is read once from
`sessionStorage` key `pt_v7_draft` (so a reload keeps what was typed; closing the tab forgets it, the same
promise guest mode makes today). A small subscriber writes `state.draft` back when it changes.

## 6. Screens: state in, HTML out

### 6.1 The contract

A screen is a plain object. It has an id, an address, a place on the rail, the answers it shows, and
**regions**: named functions from state to HTML text.

Why regions and not one function for the whole screen: if the whole screen were replaced on every
keystroke, the box being typed in would be destroyed mid-word (and on an iPhone the keyboard would drop).
So a screen is split into a few regions, and `mount.js` replaces a region only when its text has actually
changed. A form region is built so that typing does not change its text (see 6.2); the answer region
changes on every new result. That single rule replaces what a framework's "diffing" would do, and it is
about 25 lines.

Every region's output obeys the display rules, which generic tests check on every screen for generated
states:

- Every number is written through a formatter in `html.js` that also emits `data-value` (the raw number)
  and `data-key` (its name in the answer, e.g. `monthly.bad`): `money(r.values['monthly.bad'], 'monthly.bad')`
  → `<span data-key="monthly.bad" data-value="1520">£1,520</span>`. There is no other way to print a
  number, so "the number on screen equals the engine's number" is a generic check.
- Every headline is a `<section data-headline="…">` containing its number, its plain sentence
  (`data-sentence`) and its list of what was assumed (`data-assumed`). A render test fails a headline
  missing any of the three.
- Every input, button and link has a `data-testid` derived from the field path or action name, never
  hand-written, so tests and screens cannot drift apart.
- Text comes from `strings.js` or `sentences.js`, so the wording check can read every word without a
  browser.

### 6.2 Sketch — `src/v7/screens/c-answer.js`

```js
import { html, money, age, list } from '../html.js';
import { fields } from '../form.js';
import { T } from '../strings.js';
import { schema } from '../../answers/potToMonthly.js';      // the input list only — never the function

export const cAnswer = {
  id: 'c.answer',
  path: '/what-is-that-a-month',
  rail: { question: 'c', station: 'answer' },
  title: () => T.c.title,                                     // "What is my pension a month?"
  answers: ['c'],                                             // runner.js keeps state.answers.c up to date

  // The form is redrawn only when its SHAPE changes (partner added, final-salary pension yes/no),
  // never because a value was typed. Typed values live in the boxes and in state.draft.c.
  regions: {
    form: {
      key: (s) => [s.draft.c.couple, s.draft.c.you.hasFinalSalary, s.draft.c.partner?.hasFinalSalary].join('|'),
      html: (s) => html`
        <form data-testid="c.form" novalidate>
          <h1 tabindex="-1">${T.c.title}</h1>
          ${fields(schema, s.draft.c, { base: 'draft.c', group: 'you' })}
          ${fields(schema, s.draft.c, { base: 'draft.c', group: 'couple' })}
          ${s.draft.c.couple ? fields(schema, s.draft.c, { base: 'draft.c', group: 'partner' }) : ''}
          ${fields(schema, s.draft.c, { base: 'draft.c', group: 'risk' })}
        </form>`
    },
    answer: {
      html: (s) => {
        const a = s.answers.c;
        if (!a || a.status === 'idle' || a.status === 'invalid') return html`<p class="hint">${T.c.waiting}</p>`;
        if (a.status === 'running') return html`<p class="hint" role="status">${T.working}</p>`;
        if (a.status === 'failed') return html`<p class="problem" role="alert">${T.couldNotWorkOut}</p>`;
        const r = a.result;
        return html`
          <section data-headline="monthly" class="answer">
            <p class="big">${money(r.values['monthly.typical'], 'monthly.typical')} ${T.aMonthAfterTax}</p>
            <p data-sentence="monthly">${r.sentence.typical}</p>
            <p class="bad-case">${T.inABadCase} ${money(r.values['monthly.bad'], 'monthly.bad')} ${T.aMonth}.
               <span data-sentence="monthly.bad">${r.sentence.bad}</span></p>
            <details data-assumed="monthly"><summary>${T.whatWeAssumed}</summary>${list(r.assumed)}</details>
          </section>
          <nav class="next">
            <a href="#/when-can-i-stop" data-testid="next.a">${T.next.whenCanIStop}</a>
            <a href="#/am-i-saving-enough" data-testid="next.b">${T.next.savingEnough}</a>
          </nav>`;
      }
    }
  }
};
```

Notes on the sketch:

- The screen has no arithmetic, no `if (pot > …)`, no rounding. `r.sentence.typical` was built by
  `src/answers/sentences.js` inside the answer, from the same numbers, so the sentence cannot disagree with
  the figure.
- `html` escapes every inserted value unless it came from another `html` call or a formatter, so text a
  person typed (a plan name, a fund name) cannot become markup. The current app's `esc()` does this by hand
  at each site; here it is the default.
- The wording shown above is illustrative. The real words are the language guide's job; the shape to note
  is that "a bad case" is always a labelled figure next to the main one, with its own sentence.

### 6.3 Sketch — `src/v7/mount.js` (the part that matters)

```js
export function mount(root, store, screens) {
  let drawn = { screen: null, keys: {}, html: {} };
  store.subscribe((s) => {
    const screen = screens.find((x) => x.id === s.route.screen) || screens.find((x) => x.id === 'notFound');
    root.dataset.ready = '0';
    if (drawn.screen !== screen.id) {                        // new screen: build the frame once
      root.innerHTML = frameHtml(s, screen);                 // rail + one empty <div data-region="…"> per region
      drawn = { screen: screen.id, keys: {}, html: {} };
      document.title = screen.title(s) + ' · PensionTools';
      queueMicrotask(() => root.querySelector('h1')?.focus());   // keyboard and screen-reader users land on the heading
    }
    for (const [name, region] of Object.entries(screen.regions)) {
      const key = region.key ? region.key(s) : null;
      if (region.key && drawn.keys[name] === key) continue;  // form whose shape has not changed: leave it alone
      const out = String(region.html(s));
      if (drawn.html[name] === out) continue;                // nothing changed in this region
      root.querySelector(`[data-region="${name}"]`).innerHTML = out;
      drawn.keys[name] = key; drawn.html[name] = out;
    }
    updateRail(root, s); showFieldErrors(root, s);           // small targeted updates, no redraw
    if (!store.isBusy()) {                                   // the done signal (section 11)
      root.dataset.ready = '1';
      root.dispatchEvent(new CustomEvent('pt:done', { bubbles: true, detail: { screen: screen.id } }));
    }
  });
}
```

Field error messages are not part of the form's text; each field has an empty `<p data-error-for="path">`
slot that `showFieldErrors` fills from `state.answers.<id>.errors` and `state.ui.touched`. So an error can
appear under a box while the person is still in it, without the box being replaced.

**If this proves painful.** The known weak spot is a form region that must change shape while the person
is typing in it (for example a list of pensions with "add another"). The first remedy is smaller regions
(one per row). If by the end of step 4 there are more than a handful of such workarounds, adopt
**`lit-html`** (the template part of Lit, used on its own): roughly 3 kB compressed, no build step, no
`eval` so the security policy is unaffected, and its templates are the same tagged `html` text used here,
so screens change little. Its cost: one runtime dependency to keep updated, screens return template
objects instead of text (the jsdom render tests must render before reading), and one more concept for
whoever maintains this. React, Vue, Svelte and Preact were not considered further: each brings a build
plug-in or a component model this app does not need, and none helps with the real work, which is the
answers.

## 7. Forms from the input list

### 7.1 The input list is the form

Each answer declares its inputs once. The same declaration drives four things: the form, validation, the
generated test cases (boundaries and pairs), and the `data-testid` values.

```js
// src/answers/potToMonthly.js (extract)
export const schema = {
  id: 'c',
  cost: 'heavy',                       // 'light' = run directly; 'heavy' = run in the worker
  fields: [
    { path: 'you.age',  group: 'you', type: 'age',   label: 'Your age', min: 40, max: 90, required: true,
      boundaries: [54, 55, 57, 66, 67, 75] },
    { path: 'you.pot',  group: 'you', type: 'money', label: 'Your pension pots, added together',
      hint: 'A rough figure is fine.', min: 0, max: 20000000, required: true, boundaries: [0, 1, 30000, 1073100] },
    { path: 'you.hasFinalSalary', group: 'you', type: 'yesNo', label: 'Do you have a final-salary pension?', default: false },
    { path: 'you.finalSalary.amount',   group: 'you', type: 'money', label: 'How much a year, before tax?',
      showIf: { 'you.hasFinalSalary': true }, required: true },
    { path: 'you.finalSalary.startAge', group: 'you', type: 'age',   label: 'From what age?',
      showIf: { 'you.hasFinalSalary': true }, required: true, min: 50, max: 75 },
    { path: 'couple',   group: 'couple', type: 'yesNo', label: 'Is this for you and a partner?', default: false },
    // partner.* mirrors you.* with showIf: { couple: true }
    { path: 'risk',     group: 'risk', type: 'choice', label: 'How should the money be invested?',
      options: [['cautious', 'Cautious'], ['balanced', 'Balanced'], ['adventurous', 'Adventurous']], default: 'balanced' }
  ]
};
```

`showIf` is a plain lookup (`path` equals `value`), not an expression — nothing to interpret. The two-minute
budget (at most five things to fill in for a single person) is counted from this list by a test.

Couples: the partner's fields are in the same list from day one, which is what "couple-ready" means for the
first slice. "Answer in full detail at any point" is a second, longer list for the same answer
(`schema.detail`), opened by a link on the form; the answer function takes both and uses defaults for
whatever was not given, and lists each default under "what we assumed".

### 7.2 Binding, generically

`fields(schema, values, { base, group })` writes, for each visible field:

```html
<label for="f-draft.c.you.pot">Your pension pots, added together</label>
<input id="f-draft.c.you.pot" data-bind="draft.c.you.pot" data-type="money" data-testid="c.you.pot"
       inputmode="numeric" autocomplete="off" value="250,000" aria-describedby="h-… e-…">
<p id="h-…" class="hint">A rough figure is fine.</p>
<p id="e-…" class="error" data-error-for="draft.c.you.pot"></p>
```

and **one** listener on the page root does the rest:

```js
const PARSE = {
  money: (v) => { const n = Number(String(v).replace(/[£,\s]/g, '')); return v === '' || Number.isNaN(n) ? null : n; },
  age:   (v) => (v === '' ? null : Math.trunc(Number(v))),
  yesNo: (v, el) => (el.type === 'checkbox' ? el.checked : v === 'yes'),
  choice: (v) => v, text: (v) => v
};
export function bindForms(root, store) {
  const onInput = (e) => {
    const el = e.target.closest?.('[data-bind]');
    if (!el) return;
    store.dispatch({ type: 'field', path: el.dataset.bind, value: PARSE[el.dataset.type](el.value, el) });
  };
  root.addEventListener('input', onInput);
  root.addEventListener('change', onInput);
  root.addEventListener('focusout', (e) => {                 // errors show once a field has been left
    const el = e.target.closest?.('[data-bind]');
    if (el) store.dispatch({ type: 'touched', path: el.dataset.bind });
  });
}
```

That is the whole binding layer. There is no `getElementById`, no "read the form into settings" function
and no "write settings into the form" function — the two places where the current shell's data-changing
bugs lived. A value that is in the store is the value; a box is only a way to type it.

Validation is `validate(schema, inputs)` in `src/answers/schema.js` (pure): required, type, min and max,
and any cross-field rule the answer declares as a named function in its own module (for example "final-salary
start age is not before your age minus …"). It returns `{ ok, errors: { path: messageId } }`. Messages are
plain sentences in `strings.js`.

### 7.3 Buttons

Most things a person clicks are links (section 4). The few that are not — "save this as a plan", "lock the
plan", "sign out", "print" — are `<button data-action="save-plan" data-arg="…">`. One click listener looks
the name up in the table in `actions.js` and calls it with `(store, router, arg)`. An unknown name throws
in development and is reported in the test build. No expression is parsed.

## 8. Running answers; the worker and its "ready" signal

### 8.1 The answer contract

```js
// every module in src/answers/
export const schema = { id, cost, fields, detail? };
export function answer(inputs, ctx) { ... }
//   inputs: exactly what validate(schema, …) accepted, defaults filled in
//   ctx:    { today: '2026-09-30', market: { gilts, equity, asOf } }   — the ONLY source of date and market data
//   returns { values: { 'monthly.typical': 1850, 'monthly.bad': 1520, … },   raw numbers, named
//             sentence: { typical: '…', bad: '…' },                          from sentences.js
//             assumed: [{ id: 'statePension', text: 'Full State Pension from 67', value: 11973 }, …],
//             trace?: { … } }                                                 month-by-month, for the independent check
```

"A bad case" is one definition everywhere: the tenth-percentile outcome of the runs (the worst 1 in 10),
computed inside the answer by one shared helper, so no screen and no second answer can define it
differently.

Question C's `answer` is new code but thin: it turns a pot, an age, a risk level and any guaranteed income
into the settings the existing engine already takes (`planFromSettings` and the strategy stress test in
`src/strategies/stressTest.js`, tax from `TaxCalculator.js`, life expectancy from `LongevityModel.js`), and
solves for the monthly figure. What exactly it solves for is the "answer contract" sub-plan's job, not this
document's.

### 8.2 `runner.js`

One subscriber. For each answer id the current screen lists:

1. Take the inputs from the draft (or the plan's working copy), fill defaults, validate.
2. Make `inputsKey` = a stable text of inputs + `clock.today` + `market.asOf`. If it equals the stored
   entry's key, do nothing.
3. If invalid: store `{ status: 'invalid', errors }`.
4. If `cost: 'light'`: call `answer()` directly and store the result.
5. If `cost: 'heavy'`: store `{ status: 'running' }`, wait 250 ms for typing to pause, send to the worker,
   and store the result **only if the inputs key is still the current one** (a late result for old inputs
   is dropped — this is the "stale figure after an edit" class of bug, closed at one point).

`store.begin()` / `store.end()` bracket each run so the done signal waits for it.

### 8.3 The worker

The existing `engineWorker.js` and `engineClient.js` are kept. Two additions:

- **`init` message.** Today the worker fetches market data itself on first use, so the page and the worker
  can disagree and a test cannot pin it. V7 sends `{ type: 'init', today, market }` once; the worker calls
  the existing `setLiveGilts` / equity setter with that data and replies `{ ready: true }`.
  `engineClient.whenReady()` returns a promise for that reply. Until it resolves, `store.isBusy()` is true,
  so the page's `data-ready` mark also covers "the worker is up". The old message types keep their current
  behaviour, so the current app is unaffected.
- **`answer` message.** `{ type: 'answer', id: 'c', inputs }` → the worker looks the id up in
  `src/answers/index.js` and calls the same `answer(inputs, ctx)`. One generic message type serves every
  question; adding question A adds no worker code.

If the worker cannot start (old browser, blocked), `runInWorker` already rejects; `runner.js` then runs the
answer directly with the "working…" message showing. Slower, never wrong.

Progress for long runs uses the existing `onProgress` callback and is shown as a plain count ("Trying age
61 of 67"), stored under `answers.<id>.progress`.

## 9. Reusing engines, saving, sign-in and guest mode without the old shell

### 9.1 What the first slice needs: almost none of it

Question C is answered from typed figures held in `state.draft.c` and `sessionStorage`. It needs no
account, no guest session, no Firebase and no saved plan. So **`main.js` does not import Firebase at all**;
the first screen is the shell (about 450 lines), the answer module and the engines it calls. This is what
makes "first answer in under two minutes on a phone" an engineering fact rather than a hope, and it is why
`session.js` is the only file allowed to import `src/firebase/*` and `src/storage/*`, and only through
`import()` when first needed.

### 9.2 What is reused, as it is

| Existing module | Used by V7 for | Change needed |
|---|---|---|
| `src/strategies/*`, `src/services/*` engines | Everything an answer computes | None. They already take an injected date (`now`). |
| `src/workers/engineClient.js`, `engineWorker.js` | Heavy runs | Two added message types (8.3). |
| `src/services/LinkerUniverse.js`, `EquityIndex.js` | Market data | None. `market.js` calls the existing loaders and setters, and records source and date in the store. |
| `src/firebase/AuthService.js` | Sign-in, sign-out, guest mode, delete account | None. |
| `src/ui/components/AuthScreen.js` | The sign-in screen | None to start (it wires its own listeners, no `data-on-*`); restyle later. Shown at `#/sign-in`. |
| `src/firebase/FirestoreService.js`, `src/storage/ScenarioRepository.js` | Listing, opening, saving plans; the guest store | None. The upgrade chain and the "plan is newer than this app" refusal come with them. |
| `src/storage/schema.js`, `migrations.js` | Plan version | One new step when V7 first saves a new root key. |
| `src/services/GuestMeter.js` | Guest time allowance | None. Storage is already injected; V7 uses the same keys, so time spent in either shell counts once. |
| `src/services/PlanLock.js`, `PlanDocument.js`, `PlanTiming.js`, `LifeStage.js`, `Holdings*.js`, `TransitionPlanner.js` | Steps 7–8 | As each is needed; those that import repositories get the repository passed in instead (the engine inventory lists them). |
| `src/ui/*Graphic.js`, `PlanDocumentView.js`, `TransitionView.js`, `ReleaseNotesView.js` | Charts and documents | None; they are already data-in, text-out. |
| `src/ui/inlineHandlers.js` | — | Not used by V7. Stays for the current app. |

### 9.3 `session.js`: the one door to stored data

```
openPlan(id)      -> dispatch plan/loading -> repository load (upgrade chain runs) -> dispatch plan/ready | missing | newer
saveWorkingCopy() -> guard -> repository save -> dispatch plan/ready
startGuest()      -> enterGuestMode(); start the meter (GuestMeter.tick once a minute, clock from the store)
signIn / signOut  -> AuthService; on sign-in, hand the guest's plans over with the existing GuestMeter hand-off
```

The save guard is a pure function with its own tests: given the plan as loaded and the working copy, it
refuses (nothing written, plain message shown) if the plan is locked and any of `decisionTool.settings`,
`decisionTool.history`, `planDocument`, `planDocumentArchive` differs, or if the stored plan is newer than
this code. It reuses `decisionSettingsFrozen` and the comparison already in `migrations.js`.

A saved plan opened in V7 is turned into engine inputs by **the same functions the current app uses**
(`createSimulationConfigFromSettings`, `planFromSettings`). V7 does not get its own reading of saved
settings. That is what makes "identical results in both" achievable: there is one path from saved plan to
numbers, and two pages displaying it.

### 9.4 Guest mode and the front door

Proposed: the quick questions (A–D from typed figures) are **not** a guest session and are not metered —
they are the front door, and nothing is stored beyond the tab. The guest session (and its three-hour
allowance) begins when someone chooses "keep this and build a plan" without signing in. This is an owner
decision (section 15).

## 10. Getting calculations out of the old shell, over time

The old shell is not rewritten and not tidied for its own sake. Code leaves it only when a V7 slice needs
it, by the same four moves each time:

1. **Pin.** Write a test that captures what the old function returns today for the saved-plan fixtures
   (`tests/fixtures/plans/`) — including any behaviour that looks wrong.
2. **Move.** Put the logic in `src/` as a pure function taking plain objects. No behaviour change.
3. **Point the old shell at it.** `index.html` imports the new function and its old body is deleted. The
   current app now runs the extracted code, so it is exercised by real use before V7 depends on it.
4. **Use it from an answer.** Fixes to the behaviour, if any, are a separate release with a release note.

Guard rails:

- **The old shell only shrinks.** `tests/v7/shellRatchet.test.js` records the line count of the inline
  script in `index.html` and fails if it grows. From step 3, the old shell gets bug fixes and extraction
  edits only; new features go to V7.
- **Order is set by the slices**, not by tidiness: step 3 needs nothing from the old shell; steps 4–5 need
  the saving-years inputs; step 6 the "what can I draw from here" assembly; step 7 the rules inside
  `saveStressSettingsUI` (State Pension date check, low-value confirmation, locked refusal, the order of
  writes) and `setActiveStrategyChecked`; step 8 the monthly record and tax-year set-up wiring.
- The detailed list is the "screen-code extraction map" sub-plan. This document fixes only the method.

What is never extracted: navigation, the tab bar, the guidance banner chain, the form read/write functions,
the `window._*` caches. V7 replaces them; they are deleted with the old page.

## 11. Test seams

### 11.1 `window.__pt` — test build only

```js
// src/v7/testHooks.js
export function installTestHooks(store, router, deps) {
  window.__pt = {
    seed(patch)        { store.dispatch({ type: 'seed', patch }); },           // any part of the state, incl. draft and plan
    setClock(isoDate)  { store.dispatch({ type: 'clock', today: isoDate }); },
    pinMarket(snapshot){ deps.market.pin(snapshot); },                          // also re-sent to the worker
    state()            { return structuredClone(store.get()); },
    values()           { return Object.fromEntries([...document.querySelectorAll('[data-value]')].map((e) => [e.dataset.key, Number(e.dataset.value)])); },
    whenDone()         { return new Promise((res) => (document.getElementById('app').dataset.ready === '1' ? res() : document.addEventListener('pt:done', () => res(), { once: true }))); },
    guestMeterOff()    { deps.session.meterOff(); }
  };
}
```

`main.js` loads it as `if (import.meta.env.MODE === 'test') (await import('./testHooks.js')).installTestHooks(…)`.
Vite replaces `import.meta.env.MODE` at build time, so the release build contains neither the call nor the
file. The test build is a separate command writing to a separate folder (`vite build --mode test --outDir
dist-test`) and is never deployed. `tests/v7/noTestHook.test.js` fails if `__pt` appears anywhere under
`docs/assets/`. The test build also defaults the clock and market data to pinned values (the existing
`tests/fixtures/plans/market/` snapshots), so a test that forgets to pin is still repeatable.

### 11.2 What is on the page for tests

| Seam | Where | Used by |
|---|---|---|
| `data-value` + `data-key` on every number | `html.js` formatters, no other way to print a number | "screen equals engine" check |
| `data-headline`, `data-sentence`, `data-assumed` | every headline | render tests; wording check |
| `data-testid` | derived from field paths, action names, link targets | browser scripts |
| `data-region` | `mount.js` | targeted assertions |
| `data-ready="1"` on `#app`, and a `pt:done` event | `mount.js`, after a draw with nothing running | browser scripts wait on this, never on a timer |
| `data-series` on each chart (the plotted numbers) | chart wrapper in `html.js` | chart checks |
| Real `<a href>` for every move | screens and rail | the crawl: every station reachable, no dead ends |

### 11.3 What runs without a browser

Because a screen is `state → text`, most checks are ordinary vitest tests in jsdom and take seconds:
every screen drawn for generated states (single or couple, final-salary yes or no, each stage, locked or
not, guest or signed in) with the generic assertions (no "undefined", "NaN", "-£0.00"; every headline has
number, sentence and assumptions; no countdown wording for a retired state); router round-trips; rail
reachability as a graph check over `rail.js` and the screens' links; the reducer; the form generator
against each schema. The browser layers (journeys, screenshots, contrast, timing) sit on the seams above
and are specified in the test strategy plan.

### 11.4 The three import rules, as a test

One test scans import statements: the two rules in section 3, plus "only `src/v7/session.js` imports
`src/firebase` or `src/storage`". Breaking "the screen computes nothing" fails the build.

## 12. Security policy

The policy in `public/_headers` allows scripts only from the site itself (plus named Google and Cloudflare
hosts) and forbids inline script and `eval`. It applies to every page, so `v7.html` is covered with no
change.

- `v7.html` contains no inline script. Its one tag is `<script type="module" src="./src/v7/main.js">`.
- V7 renders with `innerHTML`, which the policy permits; safety comes from the escaping `html` tag (6.2).
- **The `data-on-*` interpreter: keep it for the current app, do not use it in V7.** It exists because the
  old markup calls hundreds of global functions with arguments, and it resolves names on `window`. V7 has
  no global functions to call. `data-bind` (a store path, checked against the writable list in the reducer)
  and `data-action` (a name looked up in a fixed table) need no parser and cannot reach anything that is
  not in the table. The interpreter and its test are deleted with the old page after cutover.
- Styles: the policy allows inline styles today. V7 uses classes and its own stylesheet and keeps inline
  `style` to chart geometry, so tightening `style-src` later remains possible.
- A release smoke test serves the built `docs/` with the real `_headers` and completes question C, so the
  policy is exercised, not assumed.

## 13. Rail

The rail is data, in `rail.js`: for each question, an ordered list of stations, each with an id, the screen
it opens, a plain label from `strings.js`, whether it is optional, and a `state → 'done' | 'here' | 'next' |
'later' | 'notNeeded'` function. `railHtml(state)` draws it (a row of steps on a wide screen, a "Step 2 of
5 — what's next" strip with a pull-up list on a phone). Because it is data plus a pure function, "no dead
ends" and "a saver is never sent to the monthly step" are graph checks in vitest. Station lists and labels
are the rail design sub-plan's job; this document fixes only that the rail is declared, not coded into
screens, and that the address — not the rail — is the source of "where am I".

For the first slice the rail has one question with two stations ("Your figures", "Your answer", on one
screen) and the front door. That is enough to prove the rail, the phone layout and the checks.

## 14. Cutover and rollback

### 14.1 Before the switch

A parity check runs on every change from step 7 on. It takes a saved plan, produces the full set of named
values (`data-key` → number) two ways — through the current app's path (the existing
`tests/integration/appPaths` route from settings to results) and through V7's answers — and requires them
equal to the penny. It runs on the fixture plans in CI, and on the owner's own locked plan on his machine
only (`tests/ownerPlan.local.test.js` already follows that pattern; the plan is never in the repository).
Because V7 reads saved settings through the same functions as the current app (9.3), a difference here
means a real fault, not two readings of the same plan.

The switch happens when: the owner's plan matches; every rail station has a screen; the release gates in
the test strategy pass on `v7.html`; and the owner has used V7 for one real monthly record.

### 14.2 The switch (release 7.0.0) — one commit

1. `index.html` is renamed `classic.html`; `v7.html` is renamed `index.html`. The Vite input list becomes
   `{ main: './index.html', classic: './classic.html' }`. `stamp-sw.mjs` keeps working (the new default is
   the `main` entry).
2. The preview strip and the "do not index" markers move from the new page to `classic.html`. The new page
   gets a small "Use the previous version" link in the account menu, kept for two releases.
3. Links that arrive with `?signup=1` / `?signin=1` are mapped to `#/sign-in` by four lines in `main.js`.
4. The 7.0.0 release note is written, including the rename to "Drawdown Planner" and what it means for
   saved plans ("nothing changes in your saved plan or its numbers").

No data is moved at the switch. Both pages read and write the same saved plans with the same
`schemaVersion`.

### 14.3 Rolling back

- **Roll back = swap the two files again and deploy**, from the current commit. It is the reverse of one
  commit and takes one build. Do **not** roll back by redeploying an older build: an older build may not
  know the current `schemaVersion`, and would (correctly) refuse to save plans touched since.
- This is safe because of the rule in 2.3: anything V7 added to a plan is a root key the classic page
  ignores, and locked-plan settings, history and documents were never written by V7.
- After two releases with no rollback, `classic.html`, `src/ui/inlineHandlers.js`, the old overlays
  (`LandingPage`, `OnboardingPage`, `SetupWizard`) and their tests are deleted in one commit.

### 14.4 During coexistence

- A plan edited in one page and open in the other: the existing "plan is newer" refusal covers a version
  difference; for same-version edits the rule is last save wins, as it is today between two tabs.
- Release notes pop-up: the "last seen version" record is shared (profile document, or local storage for a
  guest), so a person sees a note once whichever page they use.
- The nightly market-data job and CI need no change: they run the whole suite, which now includes `tests/v7`.

## 15. Risks, and what this proposal does not do

| Risk | What limits it |
|---|---|
| Region redraws lose the cursor in a form that changes shape mid-typing | Forms keyed by shape; one region per repeating row; `lit-html` as the named fallback (6.3). |
| Two shells drift: a fix lands in one | Shared `src/` modules; old shell only shrinks; the parity check. |
| A home-made router and store are one more thing to maintain | About 150 lines between them, fully unit-tested, no clever parts; both could be replaced without touching a screen, because screens see only `state` and `href`. |
| Addresses after `#` look dated | They cost nothing to serve on both hosts. Clean paths can come later with a Cloudflare rewrite if the mirror is dropped; the router's two functions are the only code that changes. |
| The answer for C needs market data before first paint | Bundled snapshots are used immediately and marked as such under "what we assumed"; live data replaces them and the answer reruns once. |
| Text-built HTML invites a missed escape | The `html` tag escapes by default; a test feeds `<script>` and `"` through every text field of every schema and checks the output. |

Not covered here, by design: the station list and phone layout (rail and screen design plan); what question
C solves for and its sentences (answer contract); the wording (language guide); which browser tests run
when (test strategy); the new saved-plan keys for households (household plan).

## 16. Decisions for the owner

1. **Second page at `pensiontools.uk/v7.html`, present but unlinked, from the first slice.** Agreed, or
   should it stay off the live site until it is further along?
2. **No framework**, with `lit-html` as the named fallback if forms become awkward. Agreed?
3. **Figures never appear in an address.** This means a link to your answer cannot be sent to someone else;
   they would see the question with empty boxes. Agreed?
4. **The quick questions are not metered as guest time**; the three-hour allowance starts when someone
   keeps their figures as a plan without signing in. Agreed?
5. **No release note for unlinked V7 work until 7.0.0.** Agreed, or a short line in "What's new" each time?
6. **The old page gets fixes only from step 3 on**, and may only get smaller. Agreed?
7. **Keep the previous version reachable for two releases after the switch**, then delete it. Agreed?

## 17. What step 3 builds, in order

1. `v7.html`, the Vite input, `_headers` block, preview strip. An empty page at its address, deployed.
2. `store.js`, `router.js`, `html.js`, `mount.js`, `form.js`, `actions.js` with their unit tests and the
   import-rule test.
3. `testHooks.js`, the test build command, the "no test hook in the release bundle" test, the done signal.
4. `src/answers/schema.js` and `potToMonthly.js` with its input list, boundary cases, the rules that must
   always hold and the independent recomputation — the number side, finished before any screen shows it.
5. Worker `init` and `answer` messages; `runner.js`; `market.js`.
6. `frontDoor.js` and `c-answer.js`, `rail.js` with its two stations, `v7.css` for phone, iPad and desktop.
7. Render tests over generated states; the first browser journey (a forum guest with two minutes); the
   counted first answer; screenshots at three widths; the wording check.
8. The old-shell ratchet test, so the rule in section 10 starts on the same day.
