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

## P2 — ✉️ Enforce email verification (free)
Currently email/password accounts are usable unverified.
- [ ] After `createUserWithEmailAndPassword` (`src/firebase/AuthService.js`), call
      `sendEmailVerification(user)`.
- [ ] Gate the app on `user.emailVerified` (block save/load until verified; show a "verify your
      email" prompt with a resend button in `src/ui/components/AuthPanel.js`).
- [ ] Keep the `email_verified` requirement in the Firestore rules above.
- [ ] Google sign-in accounts are already verified — no action for those.

## P3 — 🗑️ Right to erasure (account deletion)
- [ ] `deleteAccount()` exists in `AuthService.js` but has **no caller/UI** — wire up a
      "Delete my account" button that: (1) runs `wipeAllUserData()` (already exists in
      `FirestoreService.js`) to purge all `users/{uid}/…` docs, THEN (2) calls `deleteAccount()`
      to remove the Firebase Auth account. Double-confirm before running.

## P4 — 🌍 Data residency
- [x] Checked 2026-07-26: the Firestore location is **`nam5` (United States multi-region)** — NOT
      UK/EU. The location cannot be changed on an existing database. Privacy policy updated to
      disclose the US transfer (DPF UK Extension + Google DP terms as safeguards).
- [ ] Decide: either keep US storage with that disclosure (lawful, but weaker optics for a UK
      finance app), or migrate — create a new Firestore database/project in `europe-west2` (London)
      and copy the `users/{uid}` data across. With one active user, migration is cheap now and only
      gets harder.

## P5 — Docs & disclosure
- [ ] The `README.md` claims "all data is stored in browser localStorage" — this is **false**
      (data is in Firestore). Correct it.
- [ ] Publish `compliance/PRIVACY_POLICY.md` (in this folder) and link it from the app UI + footer,
      naming Usefulish Ltd as controller. Add the ICO registration number once registered.
- [ ] `measurementId G-80XX542QZE` is in the Firebase config but Analytics is **not** initialised
      in code — either remove it or, if you enable Analytics later, update the privacy policy first.

## Admin (not code — do in the console)
- [ ] Enable **2-Step Verification** on the Google account that owns `pensiontools-4b237`.

---
See also: `compliance/PRIVACY_POLICY.md` (this repo) and the company Record of Processing in the
AshworthEnterprises workspace (`compliance/DATA_PROCESSING_RECORD.md`).
