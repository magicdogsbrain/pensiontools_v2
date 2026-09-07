# Releasing PensionTools

Every user-visible change ships under a **version bump with a release note**. The note is data
(`src/releases.js`) that the app shows once to each user and lists on the What's new page, and a
test enforces it: `tests/releases.test.js` fails when `package.json`'s version has no matching top
entry, or when an entry is missing a section. So you cannot bump without explaining, or explain
without bumping.

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
3. `npx vitest run` — all green (the release test checks the contract).
4. `npm run build` (rebuilds `docs/` and stamps `docs/sw.js`).
5. Commit as `Release vX.Y.Z — <title>` and tag: `git tag vX.Y.Z`.
6. `git push --follow-tags origin main` (GitHub Pages mirror updates itself).
7. Deploy to pensiontools.uk: `npx wrangler pages deploy docs --project-name=pension-planner-pwa --branch=main`,
   then `curl -s https://pensiontools.uk/ | grep -o 'main-[^"]*'` must match `docs/index.html`.
8. If the release adds a data category, a processor or analytics: update
   `compliance/PRIVACY_POLICY.md` + `public/privacy.html` FIRST (see `compliance/GDPR_TODO.md`).

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
