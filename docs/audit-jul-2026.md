# PensionTools v2 — Audit (July 2026)

Audit of the codebase, GitHub repo, and live site
(https://magicdogsbrain.github.io/pensiontools_v2/), including empirical
verification against production Firestore data (read-only) and local
reproduction of the financial model.

## Method
- Read `src/` modules, `index.html` source, and build/deploy setup.
- Ran the unit suite (`vitest`): **93/93 passing**.
- Live site: read-only inspection of the signed-in account's real Firestore
  documents via the Firestore REST API (using the browser's own auth token —
  no writes, no data modified).
- Reproduced the State Pension calculation locally against the real source
  module with the live scenario's parameters.

---

## Findings by priority

### 🔴 CRITICAL — Saved data does not persist (root cause found & confirmed)

**Symptom (user-reported):** entered data, logged out and back in, data was gone.

**Root cause:** `FirestoreService.saveScenario()` (src/firebase/FirestoreService.js:116)
writes with `setDoc(ref, data, { merge: true })` using **dot-notation keys**
supplied by `ScenarioRepository` — e.g. `{ 'decisionTool.settings': ... }`,
`{ 'decisionTool.history': ... }`, `{ 'decisionTool.taxYears': ... }`,
`{ 'stressTool.settings': ... }`, `{ 'planDetails.name': ... }`.

Firestore only interprets dotted keys as **nested field paths** with
`updateDoc()`. With `setDoc(..., { merge: true })` a dotted key becomes a
**literal top-level field name containing a dot** — it does *not* update the
nested map.

**Proof (live production document, active scenario, top-level fields):**
```
decisionTool            ← real nested map (written once, at creation)
decisionTool.history    ← 👻 phantom literal field (every history save landed here)
decisionTool.settings   ← 👻 phantom literal field (every settings save landed here)
decisionTool.taxYears   ← 👻 phantom literal field
stressTool
stressTool.settings     ← 👻 phantom literal field
```

On reload, `getActiveScenarioAsync()` reads `scenario.decisionTool.settings`
(the *nested* map = wizard defaults from creation time) and silently ignores
the phantom `"decisionTool.settings"` field. It *appears* to work in-session
only because the repository also updates its in-memory cache
(ScenarioRepository.js:405-408); after logout the cache clears and the reload
returns the original defaults.

**Affected saves:** decision settings, stress settings, history, tax years,
scenario rename, scenario description. (`updateScenarioTools` uses a
non-dotted key `{ enabledTools }`, so it happens to work.)

**Fix:** for dotted-key saves use `updateDoc()` (the active scenario doc always
exists), or build a nested object for `setDoc` merge, e.g.
`setDoc(ref, { decisionTool: { settings } }, { merge: true })`.

**Data recovery:** the user's real edits are sitting in the phantom fields. A
one-off migration can copy `"decisionTool.settings"` → `decisionTool.settings`
(etc.) before the fix takes over, to recover otherwise-lost data.

### 🔴 CRITICAL — State Pension silently dropped for 1900s / DOB dates

**Symptom (user concern):** users may enter their **date of birth** instead of
their State Pension start date; a start date "in the past" may not be counted.

**Root cause:** `calculateStatePensionForTaxYear()`
(src/utils/StatePensionUtils.js:200-203) compares tax years as
**lexicographically-sorted 2-digit strings** (`getTaxYear` returns `"YY/YY"`).
A date in the 1900s yields e.g. `"70/71"`, which sorts *after* real projection
years like `"26/27".."40/41"` — so it is treated as the year **2070**, and the
pension is judged "not started yet" in every projection year.

**Proof (local run against real source, weekly £230, tax years 26/27–40/41):**

| SP Start Date entered | Interpreted as | SP in projection |
|---|---|---|
| `21-4-1970` (DOB / any 1900s date) | "70/71" → **2070** | **£0 every year** ❌ |
| `21-4-2038` (correct future) | "38/39" | £0 until 2038, then £12,565 ✅ |
| `21-4-2024` (legit past, 2000s) | "24/25" | received & inflated every year ✅ |

The **live account currently holds `21-4-1970`** in this field — so its
projections are silently excluding State Pension income entirely.

**Two defects:**
1. No validation on the "State Pension Start Date" field (accepts DOB / absurd
   past dates). "Annual Amount (calculated)" shows £11,960 regardless, which
   masks the problem.
2. The 2-digit-year lexicographic comparison. Fix: compare chronologically
   (parse to a real date / 4-digit year) rather than by string sort, and/or
   validate that the SP start date is sane (not before, say, the current year
   for someone not yet retired; reject obvious birth-year entries).

---

### 🟢 GOOD — Firestore security is correctly configured

Empirically verified with the signed-in user's own token (read-only probes):

| Probe | Result |
|---|---|
| Read a *different* user's `users/{otherUid}/scenarios` | **403** ✅ |
| List the top-level `users` collection | **403** ✅ |
| Anonymous (no token) read of own path | **403** ✅ |

Data is pathed per-user (`users/{uid}/...`) and the rules enforce
`auth.uid == userId`. **Not** in test mode. Cross-user isolation holds.

> Note: the Firebase web `apiKey` in `src/firebase/config.js` is public by
> design (it's an identifier, not a secret) — safe to ship. Security rests on
> the rules, which are sound. Recommend committing `firestore.rules` to the
> repo so they're versioned and reviewable (currently absent).

---

### 🟡 MEDIUM

- **Legacy-schema scenarios don't load.** Two of the three production scenarios
  use the pre-restructure schema (`decisionSettings`/`stressSettings`/`name`
  as top-level, from before commit 099e865). The current code reads
  `decisionTool.*`, so these scenarios silently render as defaults. Needs a
  migration or explicit handling.
- **No CI.** `.github/workflows` is absent — the 93 tests never run on push,
  and the `docs/` build is committed by hand (easy to ship stale). Add a
  workflow that runs `vitest` and rebuilds `docs/`.
- **npm audit:** 28 advisories (4 critical, 8 high), almost all dev/transitive
  (`undici`, `ws` via Firebase tooling) — not in the shipped browser bundle.
  Low real risk; run `npm audit fix`.
- **Model accuracy** (per docs/model-review-feb-2026.md): S&P-500 optimism bias
  (~1.5–2%/yr vs a global benchmark) and missing equity-bond correlation are
  the two substantive modelling gaps. Both are documented with fixes in that
  review.

### 🟢 LOW / housekeeping

- **README hosted URL is wrong** — points to `/pension-planner-pwa/`; actual is
  `/pensiontools_v2/`.
- **Numeric fund inputs accept negatives** (no `min="0"`) — e.g. Equity Fund
  took `-100000`. Add input bounds / validation.
- **Leftover files:** `index-old.html` (222 KB legacy monolith) and a stale
  `dist/` folder — delete both.
- **30 `console.log` calls** left in `src/` (auth-flow debug noise) — strip for
  production.

---

## Suggested order of work
1. Fix the `saveScenario` dot-notation bug + migrate recoverable phantom-field
   data. (Unblocks all persistence.)
2. Fix State Pension year comparison + add SP-start-date validation.
3. Migrate/handle legacy-schema scenarios.
4. Add CI (vitest + build), fix README URL, delete legacy files, input bounds.
5. Model improvements from the Feb review (correlation, equity assumption).
