# Export your plan to a local JSON file (for `tests/ownerPlan.local.test.js`)

Your real plan is the main safety fixture for the V7 work, but this repository is public, so the file lives
only on your machine in `tests/fixtures/local/` (git-ignored). Nothing here uploads anything.

The app has no export button and exposes no plan object on `window` (the script is a module), so the route is
the browser's DevTools console reading your plan straight from Firestore with the sign-in the page already
holds. The site's CSP blocks `eval` in page scripts, but code typed into the DevTools console is not page
script and is not subject to it; the one network call goes to `firestore.googleapis.com`, which the CSP's
`connect-src` allows.

**Status: written from the code, not yet run against the live site** (it needs your sign-in). If step 3 does
not produce a file, see "If it does not work" at the bottom.

## Steps (Chrome or Edge, signed in at https://pensiontools.uk)

1. Open the app, sign in, and make sure the plan you want is the active one (its name is in the header).
2. Open DevTools → **Console** (`⌥⌘J` on a Mac, `Ctrl+Shift+J` on Windows). If Chrome asks, type `allow pasting`.
3. Paste this and press Enter:

```js
(async () => {
  // The Firebase sign-in the page keeps in localStorage (config.js sets browserLocalPersistence).
  const key = Object.keys(localStorage).find((k) => k.startsWith('firebase:authUser:'));
  if (!key) throw new Error('Not signed in (no firebase:authUser entry) — sign in and try again');
  const user = JSON.parse(localStorage.getItem(key));
  const token = user.stsTokenManager.accessToken;
  const url = 'https://firestore.googleapis.com/v1/projects/pensiontools-4b237/databases/(default)/documents/users/' + user.uid + '/scenarios?pageSize=100';
  const res = await fetch(url, { headers: { Authorization: 'Bearer ' + token } });
  if (!res.ok) throw new Error('Firestore said ' + res.status + ' — reload the page (refreshes the sign-in) and try again');
  // Firestore's REST form wraps every value in its type; unwrap back to the plain document the app sees.
  const dec = (v) => 'nullValue' in v ? null : 'booleanValue' in v ? v.booleanValue : 'integerValue' in v ? Number(v.integerValue)
    : 'doubleValue' in v ? Number(v.doubleValue) : 'stringValue' in v ? v.stringValue : 'timestampValue' in v ? v.timestampValue
    : 'arrayValue' in v ? (v.arrayValue.values || []).map(dec) : 'mapValue' in v ? obj(v.mapValue.fields) : null;
  const obj = (f) => Object.fromEntries(Object.entries(f || {}).map(([k, x]) => [k, dec(x)]));
  const plans = ((await res.json()).documents || []).map((d) => ({ id: d.name.split('/').pop(), ...obj(d.fields) }));
  const active = plans.find((p) => p.isActive) || plans[0];
  if (!active) throw new Error('No plans found for this account');
  const out = active;            // ← every plan instead: const out = plans;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(out, null, 1)], { type: 'application/json' }));
  a.download = 'my-plan.json';
  a.click();
  console.log('Exported "' + (active.planDetails && active.planDetails.name) + '" (' + plans.length + ' plan(s) in the account)');
})();
```

4. Move the downloaded `my-plan.json` into `tests/fixtures/local/` (create the folder if it is not there).
5. Check it is ignored — this must print the `.gitignore` rule, and `git status` must not list the file:

```sh
git check-ignore -v tests/fixtures/local/my-plan.json
```

6. Pin the answers once, then run the net whenever you like:

```sh
PIN_OWNER_PLAN=1 npx vitest run tests/ownerPlan.local.test.js   # writes tests/fixtures/local/my-plan.pinned.json
npx vitest run tests/ownerPlan.local.test.js                    # compares against it
```

Re-export and re-pin when the plan itself changes (a month recorded, an unlock, a re-lock) — not to turn a red
test green. A red test after a code change means the code changed what your plan says.

## Notes

- The file is the raw Firestore document: exactly what the app's loader receives, before `normalizeScenario`
  and the load migrations. That is what the test wants — it runs those steps itself.
- The export is a read. It does not change the plan, the lock or `lastModified`.
- Guest mode keeps its plans in the tab instead: `copy(sessionStorage.getItem('pt_guest_scenarios'))` puts them
  (an array) on the clipboard — useful for trying the local test without touching a real account.
- Do not paste the file, or the pinned answers, into an issue, a commit, a chat or a test that is committed.

## If it does not work

The snippet depends on one Firebase detail — the `firebase:authUser:…` entry in localStorage with a fresh
`stsTokenManager.accessToken` (valid for an hour; a page reload renews it). If Firebase ever moves that, the
smallest code change that gives the same file is a hook in `index.html`'s module script, next to the other
`window.*` handlers (it needs `loadAllScenarios` added to the existing `./src/firebase/index.js` import):

```js
// Plan export for local testing: the active plan exactly as loaded from Firestore (normalised, before the
// repositories' in-memory migrations). Read-only; nothing is sent anywhere.
window.exportActivePlan = async function () {
  const plans = await loadAllScenarios();
  const active = plans.find((p) => p.isActive) || plans[0];
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(active, null, 1)], { type: 'application/json' }));
  a.download = 'my-plan.json';
  a.click();
};
```

then `exportActivePlan()` in the console. That is a user-visible-surface change (a new global), so it ships
under a version bump with a release note like any other; it also doubles as the data-portability export the
GDPR work may want a button for.
