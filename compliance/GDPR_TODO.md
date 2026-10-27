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
      (confirmed by the account owner, 2026-08-03).

## New processing added 2026-08-16 (document before next policy publish)
- [x] `fundSuggestions` collection (policy sentence added + published 16 Aug 2026): when a user
      categorises an unknown fund ticker, the app logs
      {ticker, name, chosen category, uid, timestamp} to an admin-only queue (curation telemetry).
      Add a sentence to the privacy policy in the pending single-URL rewrite. Rules restrict
      reads to the admin account; users can only create their own records.
- `admin/*` config docs hold NO personal data (curated fund/typical-amount datasets).

---
**All items complete as of 2026-08-03.** Ongoing obligations: keep the ICO registration current
(ZC209401, auto-renews by direct debit, expires 28 Jul 2027); update the privacy policy before any
material change (new processors, analytics, new data categories); report any personal-data breach
to the ICO within 72 hours.

---
See also: `compliance/PRIVACY_POLICY.md` (this repo) and the company Record of Processing in the
AshworthEnterprises workspace (`compliance/DATA_PROCESSING_RECORD.md`).

## Security & privacy pass — 27 Aug 2026 (done)
- XSS: all user/remote strings escaped (`budEsc` now escapes quotes too); toasts use textContent; fund catalogue/search/ticker inputs escaped; ticker whitelist `[A-Z0-9.-]{1,12}` on input and on admin publish; scenario names/descriptions escaped in the plan menu and household selector.
- CSV export: formula injection neutralised (leading = + - @ tab CR prefixed with ').
- Budget calculator: `Function()` replaced by a recursive-descent arithmetic parser.
- Firestore rules: `fundSuggestions` create constrained (field whitelist, ticker shape/length); users may read/delete their own suggestions; account deletion now removes them (right to erasure). Rules deployed 27 Aug 2026.
- Auth: ID token refreshed after email verification; explicit local persistence.
- Bundle: console output stripped from production; debug hooks dev-only; `index-old.html` and stale root `sw.js` removed.
- Headers (Cloudflare `_headers`): CSP in report-only mode (inline handlers still require 'unsafe-inline'), nosniff, referrer-policy, X-Frame-Options, permissions-policy. TODO: review CSP reports, then enforce.
- Privacy contact changed from a personal address to privacy@usefulish.uk — **create/forward this mailbox**.
- Personal financial documents moved out of the repo folder to ../pensiontools_private_docs/.

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
- [ ] Owner to read and approve the wording, then publish with the release that ships this.
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
- [ ] Owner to read and approve the wording, then publish with the release that ships today's side (6.17.1 or 6.18.0).
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
  held in the state, never written to storage (`tests/v7/shell/account.test.js` checks the whole state's JSON for it).
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
  the one create and never carries the read-only example plan (a correction to the planner's `handoffPayload` too). No
  hand-off stash is written by the preview (`pt_guest_handoff` is the planner's own, read by nothing in V7).
- [ ] Owner to read and approve the wording of the deletion confirms (`src/v7/copy/account.js` `remove.ask1`, `ask2`,
      `needsSignIn`, `done`) against `compliance/PRIVACY_POLICY.md` "How long we keep it" — the preview names "every plan,
      every monthly record, every budget, the sign-in itself" where the policy says "your account and all data".
- [ ] Owner to decide whether `public/privacy.html` and `compliance/PRIVACY_POLICY.md` should name the preview's account
      page and its "Download everything" as the in-app way to a portable copy ("Your rights"), and whether "guest mode"
      should read "without an account" there too. No sentence was changed in this step.
- [ ] The signed-in paths are tested with fakes only (`tests/v7/shell/account.test.js`, `guest.test.js`, `whatsNew.test.js`);
      no real account was used and the live project was not touched. The sign-in, deletion and hand-over flows are not yet
      walked in a browser against the emulator.
