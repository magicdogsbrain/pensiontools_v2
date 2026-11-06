# Where 7.0.0 stands: the switch's gates and mechanics, checked against the code (4 Nov 2026)

road-to-7.md "Step 12 — The switch: 7.0.0" lists five gates and the mechanics of moving V7 to the root and the classic
app to `/classic/`. Steps 6–11b shipped (6.38.0–6.45.0), then 6.46.0–6.49.0. This note checks each gate and each
mechanical step against the code at `287f55e1` (6.49.0) and says what is left. It is a note only: nothing in the app
was changed. Work still to land before 7.0 (the engines' "plan as seen from today", "fill in from a chosen month",
"when you stopped work", moving a locked plan's start, moving to another plan, back to work, and a saver's verdict,
solver and check-in) is not planned here, but section 4 says which gates it reopens. Month by month stays on the classic
page at 7.0 (decided, road-to-7.md §3 decision 4).

---

## 1. The gates

| # | Gate | Status | Evidence | What is left |
|---|---|---|---|---|
| 1 | The twelve fixtures and a locally kept locked plan give identical figures through the classic path and V7's | **Met for the twelve fixtures; not run for the local plan** | Node, 9 files, 192 tests, all pass (§5). The classic-vs-V7 carriers are `tests/v7/plan/lastsRun.test.js` (L2: `runLasts`, what V7's worker runs, against the planner's own `strategyPlanFor` + `stressTestStrategy` + `oneAnswer`, lines 30–35; all 12 fixtures, four of them locked) and its lock-document block (the 8 unlocked fixtures, "to the byte"); `waysIdentity.test.js` (the 8 unlocked); `tryIdentity.test.js` (all 12, a table of boxes each); `householdIdentity.test.js` (the two couple pairs); `holdIdentity.test.js` (the four fixtures with a record: 03, 04, 05, 12); `budgetIdentity.test.js` (all 12 at three dates); `tests/oneAnswer.slow.test.js` (every classic screen reads one result); `tests/planCorpus.test.js` (the snapshot). The corpus is every `tests/fixtures/plans/NN-*.json` (`tests/v7/plan/_plans.js:24-26`). In the browser, `e2e/plan-lasts.spec.js:79` (corpus 02 and the locked 03) equals the Node run to the pound — passed at 1440. `tests/v7/cross/*` (187 tests, pass) and `e2e/sameness.spec.js` (3 tests, pass in Chromium) tie questions A, B, C and D to each other and to Node: they are not a classic-vs-V7 check, though road-to-7.md lists them under this gate. | (a) No runner compares V7 with the planner on a local plan: `tests/localPlans.local.test.js:1-16` pins the planner's own answers only, and no `tests/fixtures/local/` exists in the main checkout. Add a local identity block (L2 over `tests/fixtures/local/*.json`, skipped when there is none) and we run it ourselves. (b) Re-run all of the above after the last engine change before 7.0. (c) Optional: one browser check that reads the classic page's figure and V7's on the same planted plan (today the chain is classic screens = planner functions = `runLasts` = V7 page, each link tested, but never page to page). |
| 2 | A stored plan is byte-identical after being opened and browsed in V7 | **Met for plans kept in the window; account path met by unit test** | `e2e/crawl.spec.js:143-215`: the locked fixture 03 and its hand-off copy, every V7 address visited warm and cold, the questions used, every rail link followed — byte-identical, only V7's own keys written. `e2e/plan.spec.js:53-116`: two linked fixtures (03 locked, 05 saver), every rail step of the ladder (`ALL_STEPS`), every link — byte-identical, only the keys in `OWN_KEYS` (line 27). `tests/v7/plan/planSource.test.js` (11 tests): no write function exists to call, the upgrade runs in memory only (line 84). All three browser tests passed at 1440 (§5). | The crawl's address list (`e2e/helpers/app.js:104-123`) has no `#/plan/<id>/<step>` address, and `plan.spec` walks the ten rail steps of one plan: the sub-steps (`/about`, `/income`, `/spend`, `/pots`, `/lasts`, `/way`, `/mix`) and the saver's own steps are opened by their own specs, which test saving, not browsing. Extend the browse to every sub-step of every corpus plan, opened and left without saving. |
| 3 | Every rail step of every stage has a screen; NotBuilt is unreachable from a plan | **Met for plan pages; two question pages still say "not built"** | Every one of the seven stages' rails (`src/answers/plan/steps.js:10-18`) resolves through `parse`/`screenName` (`src/v7/router/routes.js:59-61, 103-115`) to a screen in `SCREENS` (`src/v7/screens/index.js:41-90`); every plan step has a builder (`src/answers/plan/read.js:625`). A plan address never yields `notBuilt` or `soon`. | NotBuilt remains at `#/c/ways` (C's optional rail step, `built: false`, `src/v7/rail/c.js:11`; linked from `src/v7/screens/c/AnswerScreen.jsx:137`). Soon remains at `#/soon/e` and `#/soon/f` (`src/v7/rail/questions.js:21-23`; the front door, `FrontDoor.jsx:41`; C's "Answer everything in full", `AnswerScreen.jsx:153`, `c/NumbersScreen.jsx:83`). From a plan both are two or three clicks away through the rail's "ask another question" (`src/v7/components/PlanRail.jsx:53`). Soon's button goes to `COMMON.links.current` = `'../'` (`src/v7/copy/common.js:39`), which at the root is V7 itself. We decide: build or retire C's "ways"; point E at "Your plans" or retire it; keep F as "not yet" with words that do not send people to the classic page (which has no F either). |
| 4 | No planned row in the parity ledger | **Met, and enforced since the groundwork (§7); the four retirements agreed 4 Nov 2026 (R13).** The rest of this row is the audit as it stood before | `tests/v7/parity/ledger.json`: 179 rows — 165 built, 14 retired, 0 planned, 0 designed, 0 building (counted from the file, as of 2026-10-27). `ledger.test.js` passes (20 tests). | No test fails on a planned or designed row: add one ("no row is planned, designed or building") so the gate holds itself. Four options are retired with `agreed: "to confirm"`: `budget.walkthrough` (ledger.json:527), `acct.reset-settings` (3809), `acct.tools` (3823), `acct.admin` (3839); `ledger.test.js:255-257` accepts "to confirm". Under the parity rule they need our agreement before 7.0, and the 7.0 test should then require "agreed". 8 built rows are "Built on the classic page" (`month.entry`, `month.advice`, `month.cadence`, `month.history`, `month.exports`, `month.tax-year`, `lock.plan-of-record`, `lock.arrival`): they depend on the hand-over reaching `/classic/` (§2 step 1). Re-count after the work before 7.0 lands: it adds keys and rows. |
| 5 | One real monthly record through the rail's hand-over | Note only (the lead) | The hand-over is `src/v7/effects/openPlace.js:15-30` (place `month`, `src/services/OpenPlace.js:42`); its browser test is `e2e/planner-month-fill.spec.js`. | At 7.0 the hand-over's target moves from `/` to `/classic/`: a record made before 7.0 proves the flow, and the browser suite proves the moved path. |

---

## 2. The mechanics, as a build list

Keep the **sources** where they are: `index.html` at the repository root (29 test files read it from there, for example
`tests/openPlace.test.js:39`, `tests/v7/shellRatchet.test.js:56`) and `v7/index.html`. Only the **outputs** move.

1. **One place that says where each app lives (can ship in a 6.x release first, no visible change).** Every link
   between the two apps is a relative string baked into its bundle today:
   - V7 to the classic page: `PLANNER = '../'` and `SIGN_IN_DOOR = '../?signin=1'` (`src/v7/effects/openPlace.js:15-16`;
     used at line 29 through `win.location.assign`, `src/v7/effects/index.js:71`); `COMMON.links.current = '../'` and
     `privacy: '../privacy.html'` (`src/v7/copy/common.js:39`; used by `Shell.jsx:56-57, 65`, `Soon.jsx:20`,
     `AccountScreen.jsx:168, 186`); `EQUITY_URL = '../data/equity.json'` (`src/v7/effects/move.js:26`).
   - The classic page to V7: `PREVIEW_PATH = 'v7/'` (`src/ui/components/OpenPlace.js:35`, the "Back" link, line 79);
     the landing page's `href="v7/"` (`src/ui/components/LandingPage.js:37`); `questionHref` → `'v7/#/…'`
     (`src/services/PlanSeed.js:409-411`, used by `NewPlanFromSeed.js:95` for old seeds).
   At the root, `'../'` resolves to `/` — V7 itself — so every "Change this", "Record a month", "Set up the tax year",
   "Open the plan document" and "Am I on course?" would reload V7 instead of reaching the classic page. From
   `/classic/`, `'v7/#/plan/…'` resolves to `/classic/v7/…`, a missing path that the host answers with V7's page at the
   wrong depth (its `./assets/` then miss too). Put the pair of paths in one module, set by a build flag through Vite's
   `define` (for example `LAYOUT=preview` today, `LAYOUT=switch` at 7.0), so the same commit can build either layout.
   That is also the rollback (step 11). Tests pinned to today's strings: `tests/v7/plan/openPlace.test.js:10-82`,
   `tests/openPlace.test.js:151, 187`, `tests/visitors.test.js:101`, `tests/planSeed.test.js:779-781`,
   `tests/v7/shell/move.test.js:164`, `tests/v7/screens/reviewFixes.test.js:315`,
   `tests/integration/newPlanFromSeed.browser.mjs:116`. `SIGN_IN_DOOR` is dead: the `signin` place is exported
   (`src/v7/screens/plan/PlansScreen.jsx:19`) but never dispatched — retarget or remove it.

2. **The browser tests' two addresses as constants.** `e2e/helpers/app.js:370` (`base = … + '/v7/'`) and 70 lines in
   28 files under `e2e/` write `/v7/`; five lines visit the classic page at `PROD + '/'`
   (`a-already-stopped.spec.js:74`, `planner-month-fill.spec.js:53`, `old-app-unchanged.spec.js:21, 56`,
   `production.spec.js:39`); seven hand-over checks in five specs wait for `pathname === '/'` (for example
   `plan.spec.js:131, 169, 202`, `plan-lock.spec.js:163`; also `plan-income`, `plan-pots`, `plan-spend`). Export `V7_PATH` and `CLASSIC_PATH` from the helper first (values `/v7/` and `/`), so
   7.0 flips two values. `playwright.config.js:107-108` waits for `/v7/` on both servers; its header comment (lines 4-6)
   describes today's layout.

3. **The builds.** Today the classic build runs first and empties `docs/` (`vite.config.js:11-13`;
   `vite.v7.config.js:1-3`), then V7 writes `docs/v7/` with no public folder (`vite.v7.config.js:13, 18`). At 7.0:
   V7 first, to `docs/` with `emptyOutDir: true` and `publicDir: 'public'` (the root needs `_headers`, `sw.js`,
   `privacy.html`, `data/`, the icons and favicon, `reddit/` for links from outside); then the classic page to
   `docs/classic/` (emptying only that folder). `package.json:8` ("build") and `:11` ("e2e:build": the test build moves to
   `dist/test` at its root, the published to `dist/prod` with `dist/prod/classic`). `scripts/stamp-sw.mjs:4-8` looks for
   `main-*.js` in `docs/index.html`; V7's entry is `index-*.js`, so it would fall back to `Date.now()` — point it at the
   right page or retire it with the kill switch (step 7). `RELEASING.md:117-121`: the deploy check greps `main-` in the
   live `/`; at 7.0 check V7's `index-` at `/` and the classic's `main-` at `/classic/`.

4. **Market data.** The nightly job writes `public/data/*.json` and `docs/data/*.json` only
   (`scripts/fetch-gilt-data.mjs:74, 247`; `.github/workflows/update-gilt-data.yml:45`). The classic page reads
   `./data/gilts.json` and `./data/equity.json` relative to itself (`src/services/LinkerUniverse.js:74`,
   `src/services/EquityIndex.js:15`, called at `index.html:4198-4199`), which at `/classic/` is `/classic/data/` — a copy
   made at build time and stale until the next release. Either the job also writes `docs/classic/data/` or the classic
   page reads `../data/` (which also works at `/` in development, since a path cannot go above the root). V7's
   `'../data/equity.json'` lands on `/data/` at the root only by that same rule: make it `./data/equity.json`. Known and
   unchanged: the classic engine worker asks for `assets/data/…` beside itself (`e2e/old-app-unchanged.spec.js:16-19`)
   and falls back to its bundled figures; at `/classic/` it resolves the classic page's data address from its own script
   in `/classic/assets/`, so with `../data/` it asks `/classic/data/` (§7).

5. **The page heads.** `v7/index.html:6` carries `<meta name="robots" content="noindex">` and `public/_headers:8-10`
   sends `X-Robots-Tag: noindex` on `/v7/*`: at 7.0 both move to the classic page (a meta in `index.html`, whose title is
   "Pension Planner v6", line 6, and `/classic/*` in `_headers`), or the whole site leaves search. `v7/index.html:8` links
   `../favicon.png`: make it `./favicon.png`. V7's page links no manifest and has no theme colour or touch icon; the
   classic page has all three (`index.html:7-12`).

6. **The manifest.** The live manifest is the repository-root `manifest.json` — Vite hashes it into
   `docs/assets/manifest-*.json` (`docs/index.html:7`) — with `start_url: "../index.html"`, which resolves to
   `/index.html`; `public/manifest.json` is an unused copy with other paths. Its name is still "Pension Planner" /
   "Pension" (`manifest.json:2-3`): step 11's rename reached the page title (`src/v7/copy/common.js:20`) but not the
   manifest. At 7.0: one manifest, linked from V7's page, named "Drawdown Planner", with `start_url` still resolving to
   `/index.html` (it has no `id`, so its start address is the installed app's identity) and scope `/`. The classic page
   drops its manifest link, so there is one installable app.

7. **The service worker** — section 3.

8. **Old `/v7/` addresses.** Bookmarks and shared links to `/v7/#/plan/<id>` must keep working: publish a stub
   `docs/v7/index.html` that does `location.replace('../' + location.hash)`. It works on Cloudflare and on the GitHub
   Pages mirror alike; a Cloudflare `_redirects` file would not reach the mirror, and the test server does not read one
   (`e2e/helpers/serve.mjs:62-100`).

9. **The words.** V7 calls itself "Drawdown Planner" (`src/v7/copy/common.js:20`) and the classic page "the planner" in
   about 50 on-screen strings (most in `plan.js`, `pots.js`, `spend.js`, `lasts.js`, `way.js`), for example
   "Record {month} in the planner" (`plan.js:335`). After the switch "the planner" is ambiguous: choose one name for the
   classic page and sweep. "Preview" leaves the screen: the banner (`common.js:25-27`, which becomes the "Use the
   previous version" link for at least two releases), "Not in the preview yet" (`common.js:46, 62, 68`), `guest.js:36`,
   `lasts.js:34`, and the `keepNotYet` lines (`a.js:66`, `b.js:60`, `c.js:52`, `d.js:49`; drawn only while Keep is unbuilt, `src/v7/components/Rail.jsx:88`); then "preview" can join `src/v7/copy/banned.js`. On the
   classic page: "Opened from the preview.", "Back to the preview", "Back to your plans in the preview"
   (`src/services/OpenPlace.js:105-113`) and the landing line (`LandingPage.js:37`). The privacy policy speaks of "the
   preview question pages" and "the planner" (`public/privacy.html:84-91`, `compliance/PRIVACY_POLICY.md:40-41`): reword,
   no new data category. `compliance/GDPR_TODO.md:113-170` names `/v7/` paths.

10. **Tests that pin today's layout.** `tests/v7/liveBundle.test.js:18-78` (the classic build to `docs`, V7 to
    `docs/v7`, the noindex meta, the `/v7/*` header, the exact build script at lines 76-77); `tests/v7/e2eRules.test.js:194-209`
    (noindex on `/v7/`, the `/v7` forward) and `:176` (`serviceWorkers: 'block'` — keep it, with one named spec allowed
    to override); `e2e/production.spec.js:17, 28-40` (the published V7 at `dist/prod/v7`, marked noindex);
    `e2e/old-app-unchanged.spec.js:21, 56-66` (the classic page at `/`, its files at `dist/prod/`).

11. **Rollback.** road-to-7.md says "swap the two outputs back from the same commit". Swapping folders alone breaks the
    hand-overs, because each bundle carries the other app's path (step 1). With the layout flag, rollback is: build the
    same commit with `LAYOUT=preview`, check it in the browser suite, deploy. Never redeploy an older build.

12. **The 7.0.0 note** lists everything retired, with its reason: the 14 retired ledger rows (the four once "to confirm"
    agreed 4 Nov 2026, R13), the preview banner, the `/v7/` address (now a forward), whatever we decide for E, F and C's "ways";
    and says Month by month stays on the classic page, reached from "This month". Short, as CLAUDE.md asks.

**Firebase and sign-in are not moved by a path change.** Google sign-in is a pop-up (`src/firebase/AuthService.js:185`,
`src/v7/effects/account.js:132`) through `authDomain: 'pensiontools-4b237.firebaseapp.com'`
(`src/firebase/projectConfig.js:10`); the verification and reset emails carry no continue address
(`AuthService.js:122, 139, 216`; `account.js:125, 139, 162`); the sign-in is kept per origin (`src/firebase/config.js:40`),
so `/` and `/classic/` share it, as they share the window's plans, the hand-over note and the guest meter (all in the
origin's storage, `src/services/OpenPlace.js:18-19`). One thing the repository cannot show: if the web API key has an
HTTP-referrer restriction in the Google Cloud console, it must allow the whole site, not a path.

---

## 3. The service worker

**How it is built and versioned today.** `public/sw.js` (`CACHE_NAME 'pension-planner-v17'`, line 1) is copied to
`docs/sw.js` and stamped by `scripts/stamp-sw.mjs` with the classic bundle's hash at every release (`RELEASING.md:117`);
the published one reads `pension-planner-D9NrS-eI` (`docs/sw.js:1`). `e2e:build` does not stamp it. **Nothing registers
it**: the classic page unregisters every registration on every load (`index.html:4189-4191`), and V7 has no service-worker
code at all. The browser suite blocks workers (`playwright.config.js:102`, enforced by `tests/v7/e2eRules.test.js:176`).

**What an installed phone holds.** (a) A home-screen install: its start address is `/index.html` (the manifest, §2
step 6); at 7.0 it opens V7, as long as the root page links a manifest with that start address. (b) A service worker,
only where a browser registered one before the unregister line shipped and has not opened the classic page since. Its
scope is `/`, so it controls V7 at the root and the classic page at `/classic/`. If it is the shape of today's file,
pages and scripts are fetched network-first (`public/sw.js:38-51`), so V7 arrives; everything else is cache-first
(`:55-72`), so a cached `data/*.json` or icon is served stale for good; offline, `/` falls back to the cached classic
page (`:49`), whose bundles are gone — a blank page. The comment at `index.html:4189` warns that an older worker was
cache-first for pages too, which would keep serving the old classic page at `/`.

**The hazard.** A browser replaces a worker only by fetching `/sw.js` again. If the 7.0 root has no `sw.js`, the host
answers that address with V7's page (a 200 with `text/html`: the fallback `e2e/helpers/serve.mjs:9-12` copies from
Cloudflare), the update fails, and the old worker stays indefinitely. So 7.0 must publish a `/sw.js`, as a kill switch:
on install, `skipWaiting()`; on activate, delete every cache, `self.registration.unregister()`, then `navigate` each open
window to its own address; no fetch handler, so nothing is intercepted. It needs no stamp (its bytes differ from every
earlier file). V7 should also unregister at start, as the classic page does (one line in `src/v7/main.jsx`). The kill
switch can ship in a 6.x release now — nothing registers `sw.js` today, so it changes nothing for anyone else — and clear
old workers before the switch; keep it for at least as long as the classic page stays.

**The test with a planted old cache.** A new spec (for example `e2e/old-worker.spec.js`) with
`test.use({ serviceWorkers: 'allow' })`, running its own server through `startServer` (`e2e/helpers/serve.mjs:62`) on a
third port, so the origin stays fixed while the folder under it changes: (1) serve a fixture "old site" — a page that
registers `./sw.js`, a cache-first `sw.js` of today's shape with `pension-planner-v17`, and a planted cache entry for `/`
holding a page marked as old (`caches.open(…).put('/', …)`); (2) stop the server and start it on the same port over the
7.0 build; reload, call `registration.update()`, wait for the controller to go; reload; expect V7's front door,
`caches.keys()` empty and no registration left. Repeat with a network-first old worker and with a cached
`data/equity.json`. `tests/v7/e2eRules.test.js` gains a rule: `'allow'` in that one spec only.

---

## 4. Risks

| # | Risk | Where | What limits it |
|---|---|---|---|
| R1 | Every hand-over to the classic page reloads V7 instead (Month by month unreachable) | `src/v7/effects/openPlace.js:15-16` | §2 step 1; the plan specs' landing checks moved to `/classic/` |
| R2 | The classic page's "Back" links land on a broken page | `src/ui/components/OpenPlace.js:35, 79`; `LandingPage.js:37` | §2 step 1 |
| R3 | The whole site marked "do not index" | `v7/index.html:6`; `public/_headers:8-10` | §2 step 5; `production.spec` asserts no noindex at `/` and noindex at `/classic/` |
| R4 | `/privacy.html` (the published policy address, `compliance/GDPR_TODO.md:62`) answered by V7's front door, and V7's privacy links with it | `vite.v7.config.js:13` (`publicDir: false`) | V7's build copies `public/`; a browser test opens `/privacy.html` and checks its heading |
| R5 | An old service worker kept for good | §3 | The kill switch at `/sw.js`; the planted-cache spec |
| R6 | Stale market data on the classic page | `scripts/fetch-gilt-data.mjs:74, 247` | §2 step 4 |
| R7 | Installed apps lose their name or identity | `manifest.json:2-5`; `v7/index.html` | §2 step 6; try an install on a phone before and after |
| R8 | Rollback by swapping folders breaks the hand-overs | §2 step 11 | The layout flag |
| R9 | Words: "the planner" now means two things; "preview" left on screen; Soon's "Open the current version" loops back to V7 | §2 step 9; `common.js:39`; `Soon.jsx:20` | The sweep; then "preview" banned |
| R10 | Accounts made in V7 have no settings document, so the What's new mark is not kept across devices: the 7.0 pop-up shows once per browser | `src/v7/effects/account.js:224` (update only, "no setDoc") | Accept, or let the settings document be made once (a new write name: its own property test, as `boundaries.test.js` rule 3c requires) |
| R11 | Old `/v7/` tabs fail to load lazy chunks after the deploy; old bookmarks miss | `RELEASING.md:167` (old tabs); §2 step 8 | The forward stub; this is today's behaviour at every deploy |
| R12 | Plans edited only in V7 never pass the classic page's load-time write-backs | `RELEASING.md:173-177`; reading in memory, `tests/v7/plan/planSource.test.js:84` | Fixtures 06, 07 and 08 (older shapes) are in every identity test; keep them there |
| R13 | Four options retired without our agreement yet: `budget.walkthrough`, `acct.reset-settings`, `acct.tools`, `acct.admin` | ledger.json:527, 3809, 3823, 3839 | Agreed 4 Nov 2026, the record their `agreed` names: each stays on the classic page, and nothing is removed from it. `ledger.test.js` requires the agreed form and fails on "to confirm" |
| R14 | Gate 1's local plan has no runner | `tests/localPlans.local.test.js` | §1 gate 1 (a) |
| R15 | The work still to land before 7.0 moves figures and adds keys | — | Re-run gates 1, 2 and 4 after the last of it; the saver's check-in can retire the `onCourse` hand-over (`src/answers/plan/read.js:503`) |
| R16 | The classic page's unregister line would remove any future V7 worker | `index.html:4191` | Since the groundwork (§7) the line asks each worker to update instead: an old one fetches the kill switch, a future V7 one is kept; it unregisters only a worker that cannot update |

---

## 5. What we ran (in this worktree, 4 Nov 2026)

- `npx vitest run tests/v7/plan/lastsRun.test.js tests/v7/plan/waysIdentity.test.js tests/v7/plan/tryIdentity.test.js
  tests/v7/plan/householdIdentity.test.js tests/v7/plan/holdIdentity.test.js tests/v7/plan/budgetIdentity.test.js
  tests/v7/plan/lock.test.js tests/oneAnswer.slow.test.js tests/planCorpus.test.js` — 9 files, 192 passed, none
  skipped (226 s).
- `npx vitest run tests/v7/cross` — 7 files, 187 passed.
- `npx vitest run tests/v7/plan/planSource.test.js tests/v7/plan/lasts.test.js tests/v7/boundaries.test.js
  tests/v7/e2eRules.test.js tests/releases.test.js tests/v7/parity/ledger.test.js tests/openPlace.test.js
  tests/v7/plan/openPlace.test.js tests/v7/shell/routes.test.js tests/v7/rail/rail.test.js tests/v7/plan/stages.test.js
  tests/v7/shell/plans.test.js tests/v7/liveBundle.test.js` — 13 files, 924 passed.
- `npm run e2e:build`, then at desktop-1440: `e2e/plan.spec.js` (the stored plans byte for byte), `e2e/crawl.spec.js`
  (the locked plan byte-identical after every address), `e2e/plan-lasts.spec.js` (both tests) — 4 passed; and
  `e2e/sameness.spec.js` in `sameness-chromium` — 3 passed.
- Every address resolved through the router with a scratch script (not committed): the table behind gate 3.

---

## 6. A brief for the 7.0.0 builder, in outline

**Before 7.0, in a 6.x release (no visible change):** the one module for the two paths and the layout flag (§2
step 1), with the tests that pin today's strings moved onto it; `V7_PATH` / `CLASSIC_PATH` in the browser helper (§2
step 2); the kill-switch `sw.js` and the planted-cache spec (§3); `./data/equity.json` in V7; the ledger test that fails
on a planned, designed or building row; the local identity block for gate 1; the wider browse for gate 2.

**Decisions we take first:** the classic page's name in words; question E, question F and C's "ways"; the four "to
confirm" retirements; whether the classic page keeps a manifest (we suggest not); which of the two data-path fixes.

**7.0.0 itself:** flip the flag; the build order and public folder (§2 step 3); the data path (step 4); the heads,
manifest and `_headers` (steps 5, 6); the `/v7/` forward (step 8); the word sweep and the privacy wording (step 9); the
tests and specs (step 10); `RELEASING.md`'s build and deploy checks; the release note (step 12). Same saved-plan shape:
no migration ships with it (architecture.md §3.9).

**Done when:** the whole vitest suite passes; the browser suite passes with V7 at `/` and the classic page at
`/classic/` (every plan spec's hand-over landing at `/classic/` and back); the planted-old-worker spec passes;
`/privacy.html`, `/data/*.json`, `/classic/data/*.json` and `/sw.js` are served as files, not the fallback; a rollback
build from the same commit (`LAYOUT=preview`) passes `production.spec` and `old-app-unchanged.spec` in today's layout;
gates 1–4 re-run after the last pre-7.0 change, and gate 5 recorded by us.

---

## 7. Landed before 7.0, with no visible change (the groundwork of §6)

- **Where each app lives:** `src/appLayout.js` holds every address the two apps hand each other, for both layouts
  (`preview`, today and the default; `switch`, 7.0). `LAYOUT=switch` at build time picks the second: both Vite configs hand
  the name to `define` (`__PT_LAYOUT__`), and a bundle carries its own layout's addresses only (checked by building both
  into a scratch folder). A misspelt flag stops the build. Readers: `PLANNER` and `SIGN_IN_DOOR` (retargeted, beside the
  planner), `COMMON.links`, `EQUITY_URL` (`./data/equity.json` at 7.0), `PREVIEW_PATH`, the landing page's line,
  the classic page's two privacy links (the landing page's and the sign-in screen's footers: `../privacy.html` at 7.0,
  the policy's one published address), `questionHref`, and the default address of the classic page's market-data loads (`loadLiveGilts`, `loadLiveEquity`:
  `../data/` at 7.0, the root's folder, which the nightly job keeps fresh; the job is unchanged). The classic engine
  worker asks with the same address, resolved from its own script in `assets/`: `/assets/data/` today (no file there, so
  it keeps its bundled figures, as before), `/classic/data/` at 7.0 (a copy made at build time, if the classic build
  makes one; its bundled figures if not). The browser specs allow that one missing file through `WORKER_DATA_MISSING`
  (`e2e/helpers/paths.js`), built from the layout. `src/v7/copy/common.js` imports it — the one import a copy file has.
- **The browser tests' addresses:** `e2e/helpers/paths.js` (`V7_PATH`, `CLASSIC_PATH`, `atClassic`, re-exported by
  `app.js`) follows the same flag; every spec line and `playwright.config.js`'s two waits use them.
- **The kill switch:** `public/sw.js` (no stamp: `scripts/stamp-sw.mjs` is retired and `npm run build` no longer runs it);
  `e2e/old-worker.spec.js` (the one spec allowed to run workers) clears a planted cache-first worker and today's
  network-first one; `tests/killSwitch.test.js` pins its steps and order. V7 does not unregister at start yet (§3 suggests
  one line in `src/v7/main.jsx`; the spec relies on V7 having no worker code, to prove the kill switch alone clears it).
  The classic page's start-up line (`index.html`) now asks each worker to update rather than unregistering it: unregistering
  at once left the old caches and left another open tab served by the old worker, because the kill switch was never
  fetched; the update fetches it, and it clears every tab (the spec's third case: two tabs, a plain visit to the classic
  page). It unregisters only a worker that cannot update, as before.
- **Gate 4 holds itself:** `ledger.test.js` fails on a row planned, designed or being built, and on anything a person
  sees, sets or records retired without `approved (agreed <date>, <where>)`; the four retirements are agreed (R13: they
  stay on the classic page).
- **Gate 1's local half:** `tests/v7/plan/localIdentity.local.test.js` runs L2 (`tests/v7/plan/_l2.js`, shared with
  `lastsRun.test.js`) over `tests/fixtures/local/*.json`; skipped when there is none.
- **Gate 2's wider browse:** `e2e/plan.spec.js` opens every step and sub-step of every corpus plan (at 1440) and finds
  the stored plans byte-identical.

Still for 7.0 itself: flip the flag and the build order (§2 step 3), the heads and manifest, `_headers`, the `/v7/`
forward, the words, and the layout-pinned tests of §2 step 10 (`tests/v7/liveBundle.test.js` and the noindex rules).

---

## 8. 7.0 itself (5 Nov 2026, from 6.57.0)

What the build list of §2 became, with the decisions of §6 as taken:

- **The flag** defaults to `switch` (`src/appLayout.js`); `LAYOUT=preview` builds the layout before 7.0 from the same
  commit. `vite.layout.js` holds where each build writes and each page's head. Each build empties its own folder only
  (V7's build, at the site's root, leaves `classic/` alone), so `npm run build` keeps its two commands in either order;
  `SITE_OUT` names the site's folder for the browser tests (`dist/prod`, `dist/test`), in place of `V7_OUT`. `vite`
  (the dev server, which serves the source folders as they are) takes the preview layout unless `LAYOUT` names one.
- **Heads and manifest:** V7's page links `public/manifest.json` ("Drawdown Planner", `start_url` `./index.html` and
  scope `./`, so an installed app keeps `/index.html` as its identity), the icons and the theme colour, and is indexed.
  The classic page (title "The classic planner") links no manifest and no home-screen app, takes the root's favicon,
  and is marked "do not index" in its head and by `/classic/*` in `_headers` (`/v7/*` keeps its rule, for the forward and
  for a rollback build). The repository-root `manifest.json` is used by the rollback build only.
- **Data:** the classic page reads `../data/`; its build copies `public/data/` to `classic/data/` for the engine worker.
- **`/v7/`:** `v7/index.html` and `v7/forward.js` (the policy runs no script written in a page) forward to `../` with
  the query and the `#/…` part.
- **The service worker:** V7's start-up asks any old worker to update, as the classic page's does; `e2e/old-worker.spec.js`
  gains a plain visit to V7's page after the deploy.
- **Gate 3 (decided):** C's "ways" step left its rail (it was never built; `#/c/ways` is now an unknown address, the
  front door); E's door opens "Your plans" (`ELSEWHERE` in `src/v7/rail/questions.js`), and its page (`#/soon/e`, from
  "Answer everything in full" and old links) points there; F's page says "This question is not answered here yet." and
  links nowhere but the questions. No rail has an unbuilt step (`tests/v7/rail/rail.test.js`); `NotBuilt` stays for a step
  added before it is built. Ledger rows `ways.question-e` (built), `ways.question-f` (built: the "not yet" page only),
  `ways.c-ways` (retired, agreed 5 Nov 2026: never built).
- **Words:** "preview" is banned in V7's words (`banned.js`); the banner is the line to the previous version ("This is the
  new version. Use the previous version."); V7 calls the classic page "the classic planner" wherever it sends people
  there; the save refusals on a locked plan point to "Your plan as locked"; the classic page says "Opened from Drawdown
  Planner." and "Back to Drawdown Planner"; the privacy policy says "the question pages" and "the classic planner".
  The lock's label, `decisionTool.settings.lockedBy`, which the classic planner shows in its banner and "Show every
  setting" beside "By": a new lock says "locked in Drawdown Planner" (`src/answers/plan/lock.js` `LOCKED_BY`); a plan
  locked before 7.0 keeps "locked in the preview", as every saved value is kept, and Undo accepts either label.
- **Checks:** `tests/publishedSite.test.js` (the deployed folder, its heads, the forward, the files served as files by
  the test server), `tests/v7/liveBundle.test.js` (the two configurations in both layouts), `e2e/production.spec.js`
  (the noindex moved, the files asked for by name, the old address), `RELEASING.md` "Where each bundle lives".
