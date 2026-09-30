# Export your plan to a local JSON file (for `tests/ownerPlan.local.test.js`)

Your real plan is the main safety fixture for the V7 work, but this repository is public, so the file lives
only on your machine in `tests/fixtures/local/` (git-ignored). Nothing here uploads anything.

From v6.15.0 the app has a menu item for this, so no DevTools are needed.

## Steps (signed in at https://pensiontools.uk)

1. Open the app, sign in, and make sure the plan you want is the active one (its name is in the header).
2. Click the plan name in the header and choose **Download this plan (JSON)** (on a phone: the ≡ menu →
   "Download this plan (JSON)"). The browser saves `<plan-name>-<YYYY-MM-DD>.json` to your downloads folder.
3. Move that file into `tests/fixtures/local/` (create the folder if it is not there; it is git-ignored) and
   rename it `my-plan.json` — the name `tests/ownerPlan.local.test.js` looks for.
4. Check it is ignored — this must print the `.gitignore` rule, and `git status` must not list the file:

```sh
git check-ignore -v tests/fixtures/local/my-plan.json
```

5. Pin the answers once, then run the net whenever you like:

```sh
PIN_OWNER_PLAN=1 npx vitest run tests/ownerPlan.local.test.js   # writes tests/fixtures/local/my-plan.pinned.json
npx vitest run tests/ownerPlan.local.test.js                    # compares against it
```

Re-export and re-pin when the plan itself changes (a month recorded, an unlock, a re-lock) — not to turn a red
test green. A red test after a code change means the code changed what your plan says.

## Notes

- The file is the plan document as the app's loader receives it from Firestore (after `normalizeScenario`
  and the saved-plan schema upgrade, so it carries `schemaVersion`; before the repositories' load
  migrations), plus its `id`. That is what the test wants — it runs the
  migrations itself.
- The document holds no account identity: the uid is only in its Firestore path, and there is no email in
  it. The export removes any `uid` / `email` field regardless (`src/services/PlanExport.js`).
- The export is a read. It does not change the plan, the lock or `lastModified`, and nothing is sent anywhere.
- It works in guest mode too (the guest plan held in the tab).
- The file contains your real figures. Do not paste it, or the pinned answers, into an issue, a commit, a
  chat or a test that is committed.
