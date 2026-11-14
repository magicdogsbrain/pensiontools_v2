# PensionTools — Data Protection / GDPR To-Do

**Controller:** Usefulish Ltd (company no. 17360947), 71-75 Shelton Street, Covent Garden,
London, WC2H 9JQ. **Firebase project:** `pensiontools-4b237`.

This app stores **personal financial data server-side** in Firestore (real portfolio balances
over time, pension/ISA/SIPP figures, State Pension forecast, tax details, and a full itemised
household budget incl. health-related spend, dependents and partner info), tied to each
logged-in user. That makes proper security and documentation important. Work these in priority
order.

## P1 — 🔒 Firestore security rules (CRITICAL, do first)
There is **no `firestore.rules` file in this repo**. The rules are the only thing stopping one
user reading another user's financial data.
- [x] Checked the live rules for `pensiontools-4b237` (2026-07-26, via Rules API): they were **not**
      open — users were already locked to their own `users/{uid}` subtree since 2026-01-23. The only
      gap was no `email_verified` requirement.
- [x] Add a `firestore.rules` file to this repo (source-controlled) — **done and deployed 2026-07-26**
      (adds the `email_verified` requirement; the only existing account is a verified Google login,
      so nobody is locked out). Baseline:
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{db}/documents {
      match /users/{uid}/{document=**} {
        allow read, write: if request.auth != null
                           && request.auth.uid == uid
                           && request.auth.token.email_verified == true;
      }
    }
  }
  ```
- [x] Add `firebase.json` deploy config (+ `.firebaserc` targeting `pensiontools-4b237`); deploy with
      `firebase deploy --only firestore:rules`.

## P2 — ✉️ Enforce email verification (free) — DONE 2026-07-28
- [x] `signUpWithEmail` (`src/firebase/AuthService.js`) now sends a verification email on signup;
      `sendVerificationEmail()` and `reloadCurrentUser()` added for the resend/refresh flow.
- [x] App gated on `user.emailVerified` in `src/ui/components/AuthScreen.js` (the live auth UI —
      note `AuthPanel.js` is dead code, never initialised): unverified users get a full-screen
      "Verify your email" prompt with resend / I've-verified / sign-out buttons.
- [x] `email_verified` requirement kept in the Firestore rules.
- [x] Google sign-in accounts are already verified — no action needed.

## P3 — 🗑️ Right to erasure (account deletion) — DONE 2026-07-28
- [x] "Delete Account" button added to the app header (`index.html`): double-confirms, then runs
      `wipeAllUserData()` to purge all `users/{uid}/…` docs, then `deleteAccount()` to remove the
      Firebase Auth account. Handles `auth/requires-recent-login` by asking the user to
      re-authenticate and retry (data is already purged by that point).

## P4 — 🌍 Data residency
- [x] Checked 2026-07-26: the Firestore location was **`nam5` (United States multi-region)**.
- [x] **Migrated 2026-07-28 to `europe-west2` (London)**: dumped all docs via the REST API,
      deleted the `(default)` database, recreated it in `europe-west2`, restored and verified all
      documents byte-identical, redeployed the rules. Privacy policy now states Firestore data is
      in the UK; Firebase **Auth** identity data (a global Google service) may still be processed
      in the US, disclosed with DPF UK Extension safeguards.

## P5 — Docs & disclosure
- [x] `README.md` localStorage claim corrected 2026-07-28 — now describes Firestore (London) +
      auth + security rules.
- [x] Policy published 2026-07-28 as `public/privacy.html` (served at `/privacy.html` on the
      site), linked from the auth screen footer and landing page footer, naming Usefulish Ltd as
      controller. ICO registration **ZC209401** (registered 29 Jul 2026, expires 28 Jul 2027,
      auto-renews by DD; certificate held offline by the company) — number in the policy since 3 Aug 2026.
- [x] Unused `measurementId` removed from the Firebase config 2026-07-28 (Analytics was never
      initialised). If Analytics is ever enabled, update the privacy policy first.
- [x] Also removed internal notes (`audit-jul-2026.md`, `model-review-feb-2026.md`, `roadmap.md`)
      from `public/` 2026-07-28 — Vite was copying them into the published site; canonical copies
      live in `research/`.

## Admin (not code — do in the console)
- [x] **2-Step Verification** already enabled on the Google account that owns `pensiontools-4b237`
      (confirmed by the account holder, 2026-08-03).
- [ ] **Who the administrator is moved out of `firestore.rules` (before the repository goes public).** The rules
      named the administrator's Firebase uid; they now ask whether a document `admins/{uid}` exists for the signed-in
      account (`isAdmin()` in `firestore.rules`), and no client may read or write `admins/*`. One-off steps, in this
      order, so the administrator is never locked out of the admin panel:
      1. Firebase console → `pensiontools-4b237` → Authentication → Users: copy the administrator's **User UID**.
      2. Firestore → Start collection `admins` → Document ID = that uid → no fields needed (an empty document is
         enough: the rules only check that it exists). Add one document per administrator.
      3. Deploy the rules from this repository: `firebase deploy --only firestore:rules`.
      4. Sign in as the administrator and open the admin panel (it appears only when the `adminPrivate/access` probe
         is allowed); sign in as any other account and check it does not appear.
      To remove an administrator, delete their `admins/{uid}` document; nothing else changes. The document holds no
      personal data (its id is the account's uid and it has no fields); when an administrator deletes their account,
      delete their `admins/` document too. The rule is held by `e2e/signed-in/admins-rule.spec.js` against the local
      emulators (the real `firestore.rules`, never the live project).

## New processing added 2026-08-16 (document before next policy publish)
- [x] `fundSuggestions` collection (policy sentence added + published 16 Aug 2026): when a user
      categorises an unknown fund ticker, the app logs
      {ticker, name, chosen category, uid, timestamp} to an admin-only queue (curation telemetry).
      Add a sentence to the privacy policy in the pending single-URL rewrite. Rules restrict
      reads to an administrator (an account listed in `admins/`); users can only create their own records.
- `admin/*` config docs hold NO personal data (curated fund/typical-amount datasets).

---
**All items complete as of 2026-08-03.** Ongoing obligations: keep the ICO registration current
(ZC209401, auto-renews by direct debit, expires 28 Jul 2027); update the privacy policy before any
material change (new processors, analytics, new data categories); report any personal-data breach
to the ICO within 72 hours.

---
See also: `compliance/PRIVACY_POLICY.md` (this repo) and the company Record of Processing in the
company's records (`compliance/DATA_PROCESSING_RECORD.md`).

## Security & privacy pass — 27 Aug 2026 (done)
- XSS: all user/remote strings escaped (`budEsc` now escapes quotes too); toasts use textContent; fund catalogue/search/ticker inputs escaped; ticker whitelist `[A-Z0-9.-]{1,12}` on input and on admin publish; scenario names/descriptions escaped in the plan menu and household selector.
- CSV export: formula injection neutralised (leading = + - @ tab CR prefixed with ').
- Budget calculator: `Function()` replaced by a recursive-descent arithmetic parser.
- Firestore rules: `fundSuggestions` create constrained (field whitelist, ticker shape/length); users may read/delete their own suggestions; account deletion now removes them (right to erasure). Rules deployed 27 Aug 2026.
- Auth: ID token refreshed after email verification; explicit local persistence.
- Bundle: console output stripped from production; debug hooks dev-only; `index-old.html` and stale root `sw.js` removed.
- Headers (Cloudflare `_headers`): CSP in report-only mode (inline handlers still require 'unsafe-inline'), nosniff, referrer-policy, X-Frame-Options, permissions-policy. TODO: review CSP reports, then enforce.
- Privacy contact changed from a personal address to privacy@usefulish.uk — **create/forward this mailbox**.
- Personal financial documents moved out of the repository.

## Release notes & app preferences — 7 Sep 2026 (done)
- New data category **App preferences**: `users/{uid}/profile/settings.lastSeenVersion` (the last
  release whose notes the user has seen) — covered by the existing `users/{uid}/**` rule and by
  `wipeAllUserData`. Policy updated (table row + "Storage in your browser" paragraph, which also
  documents the pre-existing localStorage/sessionStorage items: idle timer, dismissed banners,
  guest-tab plan). No new processor, no analytics.

## "Your plans" and "Your plan" in the V7 preview, read-only — 17 Oct 2026 (written, NOT yet published or deployed)
- **No new processor, no new Firestore path, no new data category.** The preview (`/v7/#/plans`, `/v7/#/plan/<id>`) reads
  the same plans under the same rules: one `getDocs` of `users/{uid}/scenarios` through ONE file,
  `src/v7/effects/planSource.js`, with Firestore's read-only "Lite" library (no cache on the device). The sign-in is the
  planner's own (one project, the same persistence); an unconfirmed email is not read (the server would refuse it, and the
  preview does not try). Nothing the preview can reach can write a plan: `tests/v7/boundaries.test.js` walks every import
  from the preview's entry points and fails on any write call, on any Firebase name but the read-only ones, and on any
  storage or Firebase file other than the adapter and five named pure files; `tests/v7/plan/planSource.test.js` proves
  no write function is ever called. Each plan is brought up to date in memory by today's own upgrade; its "write back"
  flag is ignored.
- **The plan list is never cached beyond the page.** The plans live in the page's memory only: never in
  `pt_v7_draft`, never in an address (a plan's id only, which holds no figure), cleared on `pagehide`, on sign-out and
  when the person becomes nobody. Read again when the page is shown again.
- **Without an account:** the plans a window kept without an account (`sessionStorage['pt_guest_scenarios']`, today's
  own key) are shown read-only, read with `getItem` only, and only when nobody is signed in; looking does not count
  against the free hours (`pt_guest_minutes` is read, never written).
- **Browser storage, new, both this window only, neither holding figures or names:** `sessionStorage['pt_open_place']`,
  the hand-over request from "Change this" (the plan's id, the page and the way back; deleted when the planner reads it,
  or refused after ten minutes); `sessionStorage['pt_open_plan']`, which plan this window's planner is on (the account's
  open plan is not moved; nothing is written to any plan). The preview also records activity under the planner's own
  `localStorage['pt_lastActivity']` so an idle planner window cannot sign out someone reading the preview; the preview's
  own sign-out and idle sign-out delete the saved-answer seed and its receipt, as every sign-out must.
- [x] One sentence added to `compliance/PRIVACY_POLICY.md` and `public/privacy.html` ("Storage in your browser"),
      "Last updated" set to 17 October 2026.
- [ ] To read and approve the wording, then publish with the release that ships this.
- [ ] The signed-in path is not yet walked in a browser against the emulator (no test account was used; the design's T11
      and T12 wait for `firebase-tools` and an `emulators` block). The guest path is walked (e2e/plan.spec.js).

## "Save this as a plan" from the V7 preview — 1 Oct 2026 (written, NOT yet published or deployed)
- **No new processor, no new Firestore path, no new data category.** A plan made from a V7 answer is an ordinary
  plan under `users/{uid}/scenarios` (or the guest tab's session storage), covered by the existing rules and wiped
  by `wipeAllUserData`. It carries a `fromAnswer` record (the answer's inputs: ages, pots, pay-ins, State Pension,
  final-salary figures) and, if one was worked out, the budget lines in `budgetTool` — the same categories as today.
  Only `createScenario` writes (new documents); the one write to an existing plan is the `isActive` flag.
- **Browser storage, new:** the plan seed, `localStorage['pt_v7_plan_seed']` — the answer's figures and any budget
  lines (which may include health spend) — never in an address, never USED after a day. Deleted when the plan is made,
  on "Not now", on sign-out by any route (menu, idle timer, verify-email screen: `onAuthStateChange` signed-in → nobody),
  Reset and Delete Account, and by the first read after its day — today's app reads it at every start, and V7's pages
  (`/v7/`) now purge a day-old or unreadable seed at every start too, whichever tab wrote it. Nothing can delete it at
  the 24-hour mark itself if neither page is opened again, so the policy says "never used after a day … deleted …
  otherwise the next time you open PensionTools or the preview pages", not "held at most a day" (review, 1 Oct 2026).
  (`src/services/PlanSeed.js`, `src/ui/components/NewPlanFromSeed.js`, `src/v7/effects/planSeed.js`). V7's own draft
  store, `sessionStorage['pt_v7_draft']` (what was typed on the question pages, the budget sheet, the plan name),
  lives in that tab only and goes when the tab closes. So does the planner's receipt,
  `sessionStorage['pt_v7_plan_receipt']`: for each seed, its time, what became of it (made / declined / refused /
  cleared) and, when made, the plan's name — so V7 says "Saved as" only when a plan was made.
- [x] Sentences added to `compliance/PRIVACY_POLICY.md` and `public/privacy.html` ("Storage in your browser"),
      "Last updated" set to 1 October 2026.
- [ ] To read and approve the wording, then publish with the release that ships today's side (6.17.1 or 6.18.0).
- [ ] Signed-in path not yet walked in a browser (no test account was used): guest hand-off then the seed, a new
      account getting the confirm step instead of onboarding, email verification then the seed.

## The shell for 7.0 in the V7 preview: sign-in, verification, deletion and export paths — 27 Oct 2026 (written, NOT yet published or deployed)
Road step 11a (research/v7/road-to-7.md step 11; release 6.44.0). The preview (`/v7/`) now has its own account page and plan
menu, so the planner's page is no longer on a person's path for these. **No new processor, no new Firestore path, no new
data category**: the preview reads and writes the same documents under the same rules, through three named files and no other
(`tests/v7/boundaries.test.js` 3b and 3c pin the files, the Firebase names each may import, and the number of write and
delete call sites).
- **Sign-in and sign-up** (`src/v7/effects/account.js` `startAccount`; `src/v7/screens/AccountScreen.jsx`): the planner's
  own flows (`src/firebase/AuthService.js`: email and password, the Google pop-up, `createUserWithEmailAndPassword` then
  `sendEmailVerification`, `sendPasswordResetEmail`) on the same Firebase project with the same persistence (the plan source's
  handles; no second app). The password is read from its box on submit and carried in one action to the effect; it is never
  held in the state, never written to storage (`tests/v7/shell/account.test.js` checks the whole state's JSON for it). The
  forgotten-password form never says which emails have an account: the service's `auth/user-not-found` on the reset email is
  told as done (`account.js` `reset`), and the note reads "If there is an account for …" either way (`copy/account.js`
  `forms.resetSent`; pinned in `account.test.js`).
- **The verification gate** (`AccountScreen.jsx` "Confirm your email"): an unconfirmed account reads nothing — the server's
  rule (`firestore.rules`: `email_verified`) and the plan source's own (`planSource.js`: no read for 'unverified'); "I've
  confirmed" reloads the user and refreshes the ID token (`AuthService.reloadCurrentUser`'s rule) before the plans are read.
- **The account's settings document** (`users/{uid}/profile/settings`, the App-preferences category): read once per sign-in
  with `getDocs` of the profile collection, into page memory only (`ui.profile`); written by the account effect's one
  `updateDoc` with `lastSeenVersion` when a release's notes are dismissed or read (`src/v7/effects/whatsNew.js`); a document
  that does not exist is left alone (no `setDoc` anywhere the preview can reach).
- **Deletion** (`account.js` `remove`, after two confirms the reducer insists on: `src/v7/state/reduce.js` `account/ask`):
  exactly what `FirestoreService.wipeAllUserData` wipes, one document at a time — every `users/{uid}/scenarios/{id}` (read
  again first), `users/{uid}/profile/settings`, every `fundSuggestions` row whose `uid` is the person's (a query; an older rule
  refusing the read does not stop the rest, as the planner's does) — then this site's `localStorage` and `sessionStorage`
  cleared, then `deleteUser`. On `auth/requires-recent-login` the data is already gone: the person is signed out and asked to
  sign in again and press once more (the planner's own handling, in words on the page). A document that will not delete
  stops the deletion there, nothing more is changed, and the page says so.
- **A plan deleted** (`src/v7/effects/planWrite.js` `remove`): one `deleteDoc` of `users/{uid}/scenarios/{id}` after a confirm
  that names the plan (a second for a locked plan); never the last plan; never automatic. Without an account: the window's
  list without the plan, one `setItem` of `pt_guest_scenarios`.
- **Export** (`src/v7/effects/download.js`; `account.js` `everythingJson`): "Download this plan" and "Download everything"
  (every plan and the settings document) each save ONE file on the person's own computer through a Blob and an anchor —
  identity stripped (`src/services/PlanExport.js` `stripIdentity`); nothing is sent anywhere. "Open a downloaded copy" reads
  the file on the page (`planWrite.js` `openFile`), strips identity again, never trusts the file's `id`, `uid`, `example` or
  `isActive`, and keeps the plan under the person's own account or window as a plan of their own.
- **Browser storage, the preview now writes two more of the planner's own keys**, both already in the policy: the What's new
  mark `localStorage['pt_lastSeenVersion']` (`whatsNew.js`, the one file that may name it) and the visitor's count and
  reminders `pt_guest_minutes` / `pt_guest_nag_level` (through `src/services/GuestMeter.js` only; `src/v7/effects/guestMeter.js`
  names no key). The hand-over after a sign-in (`planWrite.js` `bringIn`) copies the window's plans into the account through
  the one create and never carries the read-only example plan (a correction to the planner's `handoffPayload` too); it is
  offered whenever the session becomes 'in' while the page is open — a sign-in, or a sign-up followed by "I've confirmed"
  (`planSource.js` watches `session/set`), never on a page opened already signed in — and only after the person says yes. No
  hand-off stash is written by the preview (`pt_guest_handoff` is the planner's own, read by nothing in V7).
- [ ] To read and approve the wording of the deletion confirms (`src/v7/copy/account.js` `remove.ask1`, `ask2`,
      `needsSignIn`, `done`) against `compliance/PRIVACY_POLICY.md` "How long we keep it" — the preview names "every plan,
      every monthly record, every budget, the sign-in itself" where the policy says "your account and all data".
- [ ] To decide whether `public/privacy.html` and `compliance/PRIVACY_POLICY.md` should name the preview's account
      page and its "Download everything" as the in-app way to a portable copy ("Your rights"), and whether "guest mode"
      should read "without an account" there too. No sentence was changed in this step.
- [ ] The signed-in paths are tested with fakes only (`tests/v7/shell/account.test.js`, `guest.test.js`, `whatsNew.test.js`);
      no real account was used and the live project was not touched. The sign-in, deletion and hand-over flows are not yet
      walked in a browser against the emulator.

## A saver's check-in in the V7 preview — 5 Nov 2026 (written, NOT yet published or deployed)
- **No new collection, no new server, no new processor.** A check-in (research/saving-enough-and-check-in.md 5; release
  step R3) is part of the plan it belongs to, under `accumulationTool` (`checkIns`, `checkInEvery`, and for a plan not
  locked `path` and `pathArchive`), written through the one write file (`src/v7/effects/planWrite.js`, kind `checkIn`):
  the same lawful basis (contract), the same storage, the same rules. It adds a dated history of pay and what is paid in
  beside the pot values already kept (`accumulationTool.history`, which the check-in also writes), and a free-text note.
- **The note is free text and could hold special-category data**, so: the screen asks people to leave out anything about
  their health (`src/v7/copy/checkin.js`, `fields['ci.note'].help`); it is capped at 280 characters
  (`src/answers/plan/schema.js` `CHECKIN_FIELDS`, `src/answers/plan/checkIn.js` `NOTE_MAX`); it lives only inside its
  check-in, so it is deleted with the plan and with the account; and the plan's download includes it
  (`src/services/PlanExport.js`). Each of these is held by `tests/v7/plan/checkIn.test.js`. While typed and not yet kept,
  it sits in the tab's own draft (`sessionStorage['pt_v7_draft']`), which goes when the tab closes.
- **Reminders stay in the app.** "Add to my calendar" saves a calendar file made in the browser that holds the date of the
  next check-in and the words "PensionTools check-in" (`checkIn.js` `calendarText`, saved by `src/v7/effects/download.js`),
  with only what the calendar format itself needs beside them: its version, who made it, the day it was saved and an
  event id told apart by plan (letters made from the plan's id, never the id itself). No figures, no email, no
  notification, nothing sent anywhere.
- [x] `compliance/PRIVACY_POLICY.md` and `public/privacy.html`: the "Financial data" row names "pay and what you pay into
      pensions, your saving check-ins and any note you write", and its purpose "run your drawdown plan and your saving
      plan"; "Last updated" set to 5 November 2026.
- [ ] To read and approve the wording, then publish with the release that ships the check-in — setting "Last updated" in
      both copies to the day that release ships (it reads 5 November 2026, the day the wording was written).

## Back to work: money taken from a pension flexibly, carried by a close — 5 Nov 2026 (written, NOT yet published or deployed)
- **No new collection, no new server, no new processor, no new kind of data.** Going back to work (research/plan-start.md
  §2 J) closes a plan with the close that already exists and makes a saving plan through the one create (planner:
  `src/ui/planCloseUi.js`; preview: `src/v7/effects/planWrite.js`, kind `close`). The only new key is `flexibleAccess`
  at the new plan's root: `{ since: 'YYYY-MM', fromPlanId }` — the month of the first taxable draw recorded on the plan
  closed, and that plan's id (`src/services/FlexibleAccess.js`). It is derived from the drawdowns already stored in the
  same account (the Month by month records), is copied by every later close, and is deleted with the plan and with the
  account like everything else in it; the plan's download carries it as part of the plan.
- **Covered by the policy as it stands.** The "Financial data" row already names drawdowns, and its purpose ("run your
  drawdown plan and your saving plan") is what the fact is for: saying the £10,000 limit on what goes into pensions once
  money has been taken flexibly. The lawful basis is the same (contract). No sentence of `compliance/PRIVACY_POLICY.md`
  or `public/privacy.html` was changed.
- **Never written on the plan closed.** The close writes only its two keys there (`closedAt`, `nextPlanId`), and the lock
  guard keeps a closed plan's own copy of the fact as it was (`src/services/PlanClosed.js` `FROZEN_WHEN_CLOSED`), so the
  fact reaches no plan the person did not move on to. Held by `tests/backToWork.test.js`.

## 7.0: Drawdown Planner becomes the front page, the classic planner moves to /classic/ — 5 Nov 2026 (written, NOT yet published or deployed)
- **No new collection, no new processor, no new Firestore path, no new data category.** Only the addresses move
  (research/v7/switch-readiness.md §2): V7 (Drawdown Planner) is served at the site's root and the classic planner at
  `/classic/`; the old `/v7/` address forwards to the same place at the root. Both pages are on the same origin, so the
  sign-in, the plans kept in a window without an account, the hand-over note and the guest meter are shared exactly as
  before (all in the origin's own storage, `src/services/OpenPlace.js`); the sections above that name `/v7/` describe the
  same storage, now at `/`.
- **The policy keeps its one published address, `/privacy.html`.** Both pages link it (`src/appLayout.js`: `./privacy.html`
  from the root, `../privacy.html` from `/classic/`); `tests/publishedSite.test.js` checks the deployed folder serves it as
  a file, never the front page in its place, and `e2e/production.spec.js` opens it.
- [x] `compliance/PRIVACY_POLICY.md` and `public/privacy.html`: "the preview question pages" are "the question pages", and
      the hand-over is "from a plan's pages to the classic planner". No new category, so "Last updated" stays the day the
      wording was written (5 November 2026) until the release ships.
- [ ] If the web API key has an HTTP-referrer restriction in the Google Cloud console, check it allows the whole site, not
      a path (switch-readiness.md §2, "Firebase and sign-in are not moved by a path change").

## How long the money has to last: an optional "figures for women or for men" on the question pages — 11 Nov 2026 (written, NOT yet published or deployed)
- **One new optional field, no new collection, processor or Firestore path.** Questions A to D ask, under "Add more
  detail", whether to use the life-table figures for women or for men (`you.sex`, `partner.sex`, "Figures for how long
  people live"; choices "Not said", "The figures for women", "The figures for men"; "Not said" is the default and reads
  the figures for women, the cautious side; the partner's is asked only for a couple). It
  only chooses which ONS life table weights the futures (src/answers/shared/weigh.js); it is never sent anywhere.
- **Where it is kept:** in an answer's own inputs (the page address while a question is open, as every other box), and,
  when a person keeps an answer as a plan, in the kept seed's inputs (`fromAnswer.inputs[who].sex`) — so a signed-in
  person's choice is stored in Firestore under `users/{uid}/scenarios/{id}`, deleted with the plan or the account as
  every other figure. Sex is not a field of its own on the plan: it is read from the answer the plan was kept from, a
  locked plan document records the definition it was tested with, and an accepted risk holds only a hash that changes
  with it; all are deleted with the plan or the account.
- **Lawful basis:** Contract, as the other ages and dates. It is optional and can be left as "Not said" at no loss: the
  figures for women test the money for longer.
- [x] `compliance/PRIVACY_POLICY.md` and `public/privacy.html`: the "Ages / dates" row names it as optional.
- [ ] To read and approve the wording, then publish with the release that ships 7.8.0 — setting "Last updated" then.

## "Try the bad years" and "I accept this risk" on any plan — 14 Nov 2026 (written, NOT yet published or deployed)
- **No new collection, processor, Firestore path or root field.** A plan's existing list of agreements
  (`users/{uid}/scenarios/{id}.planAmendments`, 7.7.0's "I accept this risk" for what is kept by choice) can now also
  hold two more kinds of entry, `stress` and `confidence`: written only when the person presses "I accept this risk" on a
  row of "Try the bad years" and confirms, one live entry per row, removed by "Withdraw this".
- **What an entry holds:** when it was accepted, which row (a fall at the start, lower returns, spending a tenth more,
  prices rising faster, or the plan as it stands), what the row was tried on (the way of drawing, the start age, the
  years, the first tax year, the size of the change), the figures shown then (the chance, the fixed-age count, the
  plan-to age, the run-out ages, the coverage, the floor, the typical money left, the cuts), a fingerprint, the app
  version and the plan document's date. The fingerprint is a hash of the plan's settings, the kept sex and the
  household's reason: **no copy of the settings, no pots, no income, no sex and no level is stored in the entry**.
- **Never written on opening a page.** The rows run only on a button, in the browser, and are kept in the page's memory
  only; nothing is sent anywhere. Copying a plan drops its agreements; closing a plan freezes them; deleting the plan or
  the account deletes them.
- **Lawful basis:** Contract, as the plan's other figures: it is the person's own note on their plan.
- [x] `compliance/PRIVACY_POLICY.md` and `public/privacy.html`: the "Financial data" row adds "the risks you say you
      accept on a plan, with the figures they were tested on".
- [x] The sex paragraph above says how the plan reads it now that an accepted risk carries a hash that changes with it.
- [ ] To read and approve the wording, then publish with the release that ships 7.9.0 — setting "Last updated" then.
