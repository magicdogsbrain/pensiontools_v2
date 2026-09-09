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
  stress tool, budget tool). `users/{uid}/profile/settings` holds per-user preferences only
  (`lastSeenVersion` for the once-only release-notes pop-up); it is wiped with the account.
- Key files: `src/firebase/{config,AuthService,FirestoreService}.js`,
  `src/storage/{Scenario,Decision,Budget}Repository.js`, `src/models/Decision.js`,
  `src/services/BudgetModel.js`, `src/ui/components/AuthPanel.js`, `index.html`.
- Hosting: the static build in `docs/` is served by Cloudflare Pages at **pensiontools.uk** (manual
  deploy, see `RELEASING.md`) and mirrored by GitHub Pages.
- **Note:** the repo `README.md` wrongly says data is stored in browser localStorage — it is not;
  everything is in Firestore behind login. Don't rely on the README for the data model.

## Releases (read `RELEASING.md` before shipping anything user-visible)
Every user-visible change ships under a **version bump with a release note**: `package.json` is the
one version source (`src/constants.js` imports it); the note is an entry in `src/releases.js`
(changes, corrections, per-tool effects on saved plans, actions, notes, optional `affects(scenario)`)
that `tests/releases.test.js` enforces — a bump without notes, or notes without a bump, fails the
suite. Minor/major releases pop up once per user (signed in: profile doc; guest: localStorage);
every release is listed under Strategies → Background → What's new. Tag `vX.Y.Z`, push, deploy.

## Plan lock and the plan document (v6.5.0)
ONE lock for both tools (`src/services/PlanLock.js`): set by the Decision tool's first record, or by the user
from Stress tester → Settings → "Lock plan & create the plan document". Locked: Stress and Decision settings
frozen, strategy switch refused (`setActiveStrategyChecked` in index.html), "Try a strategy" what-ifs still run.
The **plan document** (`scenario.planDocument`, archive at `planDocumentArchive`) is the snapshot of the plan as
committed — built by `src/services/PlanDocument.js` from settings + `planFromSettings` + the strategy result,
rendered by `src/ui/components/PlanDocumentView.js`; `whereAmI()` reads it against today and the recorded
months. Unlock archives it. Never store functions or `samples` in it.
