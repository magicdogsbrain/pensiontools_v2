# Releasing PensionTools

Every user-visible change ships under a **version bump with a release note**. The note is data
(`src/releases.js`) that the app shows once to each user and lists on the What's new page, and a
test enforces it: `tests/releases.test.js` fails when `package.json`'s version has no matching top
entry, or when an entry is missing a section. So you cannot bump without explaining, or explain
without bumping.

## Before anything reaches main

`main` is the publishing branch, so three things stand between a change and a user:

- **CI on every push and pull request** (`.github/workflows/test.yml`): `npm ci`, the full suite,
  then `npm run build`. A red run means do not release from that commit.
- **The nightly data bot is gated** (`.github/workflows/update-gilt-data.yml`): it fetches gilt and
  equity data, runs the full suite against the new data, and commits only if it passes. On failure
  nothing is pushed, the run goes red and GitHub emails you; yesterday's data stays live.
- **Two test tiers.** `npm run test:fast` while working (skips files named `*.slow.test.js`, a few
  seconds); `npm run test:all` before a release (everything, about a minute; the same as
  `npx vitest run`). A test file that takes more than a few seconds gets the `.slow.test.js` suffix;
  nothing else changes, because the include glob matches both.

## The browser job (V7, from the first slice)

Beside the vitest job, `.github/workflows/test.yml` runs a **separate** `browser` job on every push: it
builds the published bundle and V7's test build (`npm run e2e:build` → `dist/prod`, `dist/test`), serves
them with the real headers of `public/_headers` (`e2e/helpers/serve.mjs`, so a script the security policy
would block is found before deployment), and walks them in Chromium, WebKit and Firefox with Playwright
(`e2e/*.spec.js`, `playwright.config.js`). The two jobs do not wait for each other, and the nightly data
update never runs the browser job — a Playwright problem cannot block the data bot. Browsers are cached
by the exact Playwright version in `package.json`; every container tag in the workflows must equal it
(`tests/v7/e2eRules.test.js` checks).

- **While the V7 stubs stand**, the scripts that need a part not built yet are *skipped with the reason*
  (`e2e/helpers/app.js` `BUILT` / `waitsFor`); the moment a stub is replaced they run. Nothing to switch on.
- **At home**: `npm run e2e:build && npm run e2e` (about 10 seconds per script; the first run needs
  `npx playwright install chromium webkit firefox`). `npm run e2e -- c-forum-guest` for one journey.
  The report is `playwright-report/index.html`; `test-results/` holds traces of failures, the pictures
  (`test-results/screens/`) and the counted first answer (`test-results/first-answer/<project>.json`).
- **Pictures** (`e2e/screens.spec.js`, 25 of them): made and uploaded with the report on every push, **not
  compared** until the owner has looked at the three screens on a real phone and approved a first set.
  To approve: run the **"approve screenshots"** workflow from the Actions page on the branch (one button).
  It makes the pictures in the official Playwright container — the only place pictures are ever made or
  compared, so the typefaces are the same every time — and commits them to `e2e/screens.spec.js-snapshots/`
  as "Screenshots approved: <run>". Never run `--update-snapshots` on a Mac: its pictures would not match
  the CI machine's. Once a set is approved, comparing on every push is switched on by adding
  `SCREENS_GATE: '1'` to the environment of a job that runs `screens.spec.js` **in the same container**
  (the plain runner's typefaces differ; move the picture step into a container job when the gate goes on).
- **While another package's screens are mid-change**, `E2E_IGNORE=<regexp>` drops matching screen-check
  problems locally so the rest of a journey can be seen. Never in a workflow (the rules test checks).
- **The night run** (`.github/workflows/nightly.yml`, 02:30 UTC, and by hand): the long random runs
  (`NIGHTLY=1 FC_RUNS=2000 npx vitest run tests/v7`), the full sameness list in three browsers, and the
  journeys in WebKit at phone and iPad widths and in Firefox. A red night sends the usual email; the
  failing input goes into `tests/v7/c/found.cases.json`.
- **The wait budget** (first figure within 3 s, final within 15 s with the processor slowed four times) is
  measured by `c-forum-guest.spec.js` at full speed and multiplied by four, because Chromium can slow a
  page's processor but not a worker's; the figures are in `test-results/first-answer/`.

### Before a V7 release: the stopwatch line and the real-phone look

The machine's count guards against creep (a sixth box, a fourth screen, a slow first run); it does not
prove a real person finishes in two minutes. Once per release the owner:

1. Times one real person (or himself, cold) from arriving at `/v7/` to the first figure, and writes the
   figure here in the release commit: **stopwatch: __ s (who, device, date)**.
2. Opens the three screens (front door, your numbers, the answer) on a real phone and a real iPad, since
   Playwright's WebKit is close to Safari but is not it, and says yes before the first pictures are approved.

## Version numbers

- `package.json` `version` is the ONE source. `src/constants.js` imports it; the header chip, the
  fixed version chip, the Assumptions page and `<title>` all read from it.
- **Minor / major** (`6.2.0`, `7.0.0`): anything a user can see or that changes a saved plan's
  numbers. Pops up once for every user (signed in or guest) on their next visit.
- **Patch** (`6.1.1`): small fixes with no visible change. Listed on the page, no pop-up. Set
  `announce: true` on the entry to force a pop-up anyway.
- `src/strategies/version.js` `ENGINE_VERSION` is separate: bump it only when a strategy's
  arithmetic changes (it is pinned on the plan when it locks). Record it on the release entry.

## Checklist

1. `npm version minor --no-git-tag-version` (or `patch` / `major`) — bumps `package.json` only.
2. Add the top entry to `RELEASES` in `src/releases.js`. Fill EVERY section, plain English:
   - `title`, `summary` — what a user would say changed.
   - `changes[]`, `corrections[]` — say plainly what was wrong before.
   - `effects{}` — one array per tool (`budget, stress, strategies, decision, accumulation,
     household`); an empty array means "no effect" and is rendered as such. Write it from the point
     of view of a plan saved under the PREVIOUS version: do its numbers move? Is anything re-judged?
   - `actions[]` — what they may need to enter, re-run or review.
   - `notes[]` — rules used, data notes, known limits still open, engine version.
   - `affects(scenario)` — optional plan-specific bullets (must tolerate `{}`; see the 6.1.0 entry).
   - `engineVersion` — the `ENGINE_VERSION` shipping with it.
3. `npm run test:all` (= `npx vitest run`) — all green (the release test checks the contract).
4. `npm run build` (rebuilds `docs/` and stamps `docs/sw.js`).
5. Commit as `Release vX.Y.Z — <title>` and tag: `git tag vX.Y.Z`.
6. `git push --follow-tags origin main` (GitHub Pages mirror updates itself).
7. Deploy to pensiontools.uk: `npx wrangler pages deploy docs --project-name=pension-planner-pwa --branch=main`,
   then `curl -s https://pensiontools.uk/ | grep -o 'main-[^"]*'` must match `docs/index.html`.
8. If the release adds a data category, a processor or analytics: update
   `compliance/PRIVACY_POLICY.md` + `public/privacy.html` FIRST (see `compliance/GDPR_TODO.md`).

## Saved-plan schema version (`schemaVersion`)

Every saved plan carries one whole number at its ROOT, `schemaVersion` (absent = 0, every plan saved
before 6.15.0). `src/storage/schema.js` holds the one constant, `SCHEMA_VERSION`; the ordered chain
of upgrades is `MIGRATIONS` in `src/storage/migrations.js`. On every load (signed in, guest, and
when a plan is created — a new plan, a copy, a guest plan brought into an account) the plan is
normalised and then moved up the chain, and written back once if anything changed.
`tests/migrations.test.js` enforces the contract: `SCHEMA_VERSION` must equal the last entry's `to`
and the chain must be contiguous from 1 — so you cannot bump without a migration, or add a
migration without bumping.

**When to add one.** Only when the SHAPE of a saved plan changes: a key renamed, moved or split, a
value that must be written down once instead of worked out on every load. A new optional key that
is read with a default needs no migration.

**How to add one.**

1. Bump `SCHEMA_VERSION` by one in `src/storage/schema.js`.
2. Append ONE entry to `MIGRATIONS`: `{ to: <new version>, name: '<plain English>', up(scenario, { now }) }`.
   Never edit an entry that has shipped — plans in the wild have already been through it.
3. Add a fixture of the OLD shape to `tests/fixtures/plans/` (see `build.mjs`), so the corpus keeps
   a plan that has to make the journey, and update the "this release is schema version N" test.
4. Say what it does to saved plans in the release note's `effects{}`.

**Rules for every step** (the runner refuses a step that breaks the ones marked *enforced*, and
the plan is then left exactly as it was):

- Pure and synchronous. No storage, no DOM; the clock is the `now` passed in. The result must not
  depend on today's date (the tests run each fixture either side of 6 April).
- Patch paths; keep every key you do not know. Never rebuild an object from a fixed list of keys —
  the write-back is a full replace, so anything left out is gone for good. No root key may
  disappear (*enforced*).
- Idempotent: run on its own output it changes nothing.
- Never touch `planDocument`, `planDocumentArchive`, `decisionTool.planOfRecord`,
  `decisionTool.planOfRecordArchive` or `decisionTool.history` (*enforced*). They are the record of
  what was committed; change how they are READ instead.
- **Never add, rename or remove a key inside `decisionTool.settings` of a plan that is locked or
  has records** (*enforced*). That map is what `decisionSettingsChecksum` hashes; move it and every
  recorded month shows as "under previous settings". Put new things at the root or under a new map.
- A step that throws abandons the whole chain for that plan: nothing is written, the plan opens as
  it is, and the next load tries again. There is no backup collection — this rule is the safety.

**Old tabs.** A tab left open across a deploy still runs the old code. Every save first reads the
stored plan's `schemaVersion`; if it is greater than the tab's `SCHEMA_VERSION` the save is refused
and the app shows "This plan was updated by a newer version of the app — reload the page". This
guard shipped in 6.15.0, so only bundles from 6.15.0 onward are protected: do not ship schema
version 2 until 6.15.0 has been live long enough for older tabs to have been closed.

**Still done the old way** (worked out on load, outside the chain): the plan's start year
(`PlanTiming.pinTiming`, written back by `StressRepository.loadStressDBAsync` since 6.14.0 — it
depends on today's date and the Budget's age, so it cannot be a pure step), the "Declining with
age" spending bake, and the merge of default Stress settings.

## How users see it

- The "What's new" pop-up appears once per announced release, after the app has loaded. Signed-in
  users: the last version seen is stored on their profile (`users/{uid}/profile/settings.lastSeenVersion`),
  so it is once across devices; guests: in this browser (`localStorage pt_lastSeenVersion`).
  First-time visitors and brand-new accounts never see it (nothing to compare): their marker is set
  to the current version silently. Flip `ANNOUNCE_TO_FIRST_VISIT_GUESTS` in index.html to change
  that for guests. Reading the What's new page also counts as seen. The header chip shows a dot
  while an announced release is unseen.
- Strategies → Background → **What's new** lists every release; the header chip and the mobile
  "More" sheet link to it.
- There is no live "new version available" banner: the service worker is not registered (legacy
  registrations are removed at boot), so a reload fetches the new bundle. A banner would need a
  registered worker or a `version.json` poll — out of scope for now.
