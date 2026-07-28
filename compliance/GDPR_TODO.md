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
      controller. **Still to do:** add the ICO registration number once registered (update both
      `compliance/PRIVACY_POLICY.md` and `public/privacy.html`).
- [x] Unused `measurementId` removed from the Firebase config 2026-07-28 (Analytics was never
      initialised). If Analytics is ever enabled, update the privacy policy first.
- [x] Also removed internal notes (`audit-jul-2026.md`, `model-review-feb-2026.md`, `roadmap.md`)
      from `public/` 2026-07-28 — Vite was copying them into the published site; canonical copies
      live in `research/`.

## Admin (not code — do in the console)
- [ ] Enable **2-Step Verification** on the Google account that owns `pensiontools-4b237`.

---
See also: `compliance/PRIVACY_POLICY.md` (this repo) and the company Record of Processing in the
AshworthEnterprises workspace (`compliance/DATA_PROCESSING_RECORD.md`).
