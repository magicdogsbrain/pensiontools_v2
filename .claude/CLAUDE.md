# PensionTools (v2)

UK pension **drawdown planning and stress-testing** PWA. Not financial advice — it runs
calculations on figures the user enters.

## ⚠️ Data protection / GDPR (read before touching auth, Firestore, or data models)

PensionTools is operated by **Usefulish Ltd** (company no. 17360947), the data controller. This
app stores **personal financial data server-side in Firestore** (portfolio balances over time,
pension/ISA/SIPP figures, State Pension forecast, tax details, and a full household budget incl.
health-related and dependent/partner spend), tied to each logged-in user — so security and
documentation matter. Compliance work + the privacy policy live in **`compliance/`**:

- `compliance/GDPR_TODO.md` — prioritised, file-referenced checklist. `firestore.rules` exists and
  locks every path to `users/{uid}` (admin/* and fundSuggestions have their own rules); email
  verification is enforced; account deletion wipes Firestore + auth. Keep the live rules in step with
  the file (`firebase deploy --only firestore:rules`) whenever the rules change.
- `compliance/PRIVACY_POLICY.md` — the policy to publish and link from the app.

If working on authentication, Firestore reads/writes, the scenario/decision/budget models, or the
saved-data flow, consult these first.

## Architecture (quick orientation)
- **Vanilla JS + Vite** PWA. Backend is **Firebase** (project `pensiontools-4b237`): **Firebase
  Auth** (email/password + Google) and **Cloud Firestore**.
- Firestore layout: `users/{uid}/scenarios/{scenarioId}` — a "scenario" is a saved plan that
  **embeds** the user's financial data (decision tool settings + dated history of real pot values,
  stress tool, budget tool). `users/{uid}/profile/settings` exists in code but is currently unused.
- Key files: `src/firebase/{config,AuthService,FirestoreService}.js`,
  `src/storage/{Scenario,Decision,Budget}Repository.js`, `src/models/Decision.js`,
  `src/services/BudgetModel.js`, `src/ui/components/AuthPanel.js`, `index.html`.
- Hosting: GitHub Pages (static build in `docs/`).
- **Note:** the repo `README.md` wrongly says data is stored in browser localStorage — it is not;
  everything is in Firestore behind login. Don't rely on the README for the data model.
