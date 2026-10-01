# Charges (funds and platform) — one setting, both apps (map and design, 1 Oct 2026)

Status (1 Oct 2026, evening): built as mapped below, not yet released (6.19.0 to come). The pins went one way
the map did not foresee: rather than leave the goldens and the appPaths pin alone, each now carries a charged twin
beside every uncharged entry (the same config or settings with `chargesPct: 0.5`), so both live paths are pinned —
the uncharged entries byte-identical, the twins showing what 0.5% does. This is the map for the owner's decision of
1 October 2026:

> "Yes half a percent. But put it as a config parameter somewhere - like in the various plan settings."

Today neither app takes fund or platform charges off once money is being drawn. The 1.5% a year cut on US share
returns stands for world shares, not for costs (`ladderEngine.js:27-34`, `index.html:9983`). V7 takes 0.5% a
year off only while saving (`SAVING.charge`, `src/answers/shared/rules.js:36`). Today's Assumptions page says
so: "Not modelled: Fund charges, platform fees" (`index.html:9986`).

The rules decided (implement):

1. **One setting per plan**: "Charges (funds and platform), % a year". Default 0.5, range 0–3, steps of 0.05.
   It goes in Stress tester → Settings (with the other plan assumptions) and in V7's "Add more detail" for C,
   A and B, listed under what was assumed, with Change.
2. **It applies every month, while saving and while drawing**, to money held in funds and cash inside
   pensions, ISAs and taxable accounts. That covers the equity, bond, diversifier and cash pots, the ISA, the
   taxable account (GIA) and V7's savings. It does **not** apply to gilts held directly in a ladder, to
   annuities, or to final-salary and State Pensions. The help text says why: State Pensions, final-salary
   pensions and annuities have no such charge, and platforms usually charge a small fixed fee for gilts held
   directly (review of 1 Oct 2026: the first wording, "the platform fee on those is usually a small fixed
   amount", read as a fee on a State Pension). Each charged pot is multiplied by (1 − c)^(1/12) after that month's growth.
3. **Locked plans keep their figures.** A locked plan with no stored setting runs at 0% until it is unlocked,
   and shows "0% (this plan was locked before charges were added; unlock to change)". New plans, and plans made
   from a V7 answer, get 0.5. Unlocked plans that already exist get 0.5 through a schemaVersion 2 migration.
4. **Charges are a projection input only.** Recorded months, the Decision tool's actual balances and a locked
   plan's document never change.
5. **Every figure that moves is explained.** A pin is re-pinned only with a report of how far each figure moved.

The owner's other answer in the same message ("Yes couples stopping in different years") is a separate piece
of work. How it touches charges is covered in section 9.

---

## 1. The design in one paragraph

The plan's stress settings get one new key, `stressTool.settings.chargesPct` (a percent: 0.5 means 0.5% a
year). One small pure module, `src/services/Charges.js`, holds the constants and two functions:

- `chargesPctOf(settings)`: the stored value if it is a finite number from 0 to 3, **otherwise 0**.
- `monthlyChargeFactor(pct)`: 1 when pct is 0, otherwise `Math.pow(1 - pct / 100, 1 / 12)`.

There is one constant, `DEFAULT_CHARGES_PCT = 0.5`. `createSimulationConfigFromSettings` copies
`chargesPct: chargesPctOf(settings)` into every engine config. Every engine computes `chargeM` once per run
with `monthlyChargeFactor`. It multiplies each charged pot by `chargeM` in **one block placed straight after
that month's growth**.

The key choice: **absent means 0 in the engine.** No engine, config builder or what-if has to know whether a
plan is locked. A locked plan that predates charges has no key, so it runs exactly as it does today, figure
for figure. No golden, pin or test config that lacks the key moves. Multiplying by exactly 1 is exact in IEEE
arithmetic, and `Math.pow(1, 1/12) === 1`. The 0.5 default is **written**, not inferred:

- by the new-plan template, `getDefaultScenario`;
- by the V7 plan seed;
- by the v2 migration, for unlocked plans;
- by unlock, when the key is missing (owner to confirm, see D2).

This was checked in a scratch copy of the engine, with no product code changed:

- With the charge block in `simulate` and the same block at the same point in `fastEngine.runFast`, **8,160
  side-by-side runs** were byte-identical. Those runs covered every C fixture and C state, at charges of 0.05,
  0.5, 1.35 and 3%, at three amounts each, over 40 futures. Identical means the same failure flag, the same
  failure month, and each end pot to the bit.
- At 0% the block is skipped, so every existing run is unchanged by construction.

## 2. The map: every place money grows

"Applies?" follows rule 2. "Where" is the single place to apply the charge.

### 2a. Today's planner — the monthly engine (Pots & Valves, Buckets in order)

| File:line | Pot | Applies? | Where / note |
|---|---|---|---|
| `SimulationEngine.js:411` `equity *= monthly(eqReturn)` | SIPP shares | Yes | One charge block after line 466, before `const totalGrowth` (line 468). |
| `:412` `bond *= monthly(annualBondReturn)` | SIPP bonds sleeve (a blended fund) | Yes | Same block. |
| `:413` `cash *= monthly(annualCashReturn)` | SIPP cash | Yes | Same block. |
| `:417-422` `growSleeve(gia, monthly(giaAnnual))` | Taxable account (GIA) | Yes, except its directly held gilt share | Same block. Add `chargeSleeve(gia, chargeM)` to `TaxableSleeve.js` (beside `growSleeve`, line 157): value × (1 − (1 − chargeM) × (1 − mix.gilt)). Cost basis is unchanged, as with growth. See D4. |
| `:423-438` ISA: `isa *= monthly(isaAnnual)` (own-funds mix), or `applyIsaGrowthMonthly` (flat 3%) | ISA | Yes | Same block, `if (isa > 0) isa *= chargeM`. Leave `IsaDrawdown.applyIsaGrowthMonthly` pure (it is also the Decision side's helper). |
| `:440-457` HODL (Ruffer-style fund) | Break-glass reserve fund in the SIPP | Yes (a fund) | Same block, `if (hodl > 0)`. The RNG draw at line 444 comes earlier, so the random stream is untouched. |
| `:459-466` diversifiers sleeve | Gold + trend funds | Yes | Same block, `if (diversifier > 0)`. |
| `:56` `const rng = seededRng(seed)` | — | — | Compute `const chargeM = monthlyChargeFactor(config.chargesPct)` here, once per run. |
| `:374-389` trace row | — | — | Add `traceRow.charge`: what the block took this month. It is needed by V7's month rows (2d) and by a conservation test. |
| `:199-202` bond-tent rebalance, `:280-302` windfalls, `:309-321` PCLS move | — | No growth | Untouched. |
| `runMonteCarlo :941`, `monteCarloReturns :957`, `simulateTraced :983`, `runHistorical :992`, `runScenario :1022`, `optimizeAllocation :1321` | — | Inherit | Every path goes through `simulate`. The market paths themselves are never charged. |

**Callers that build a config.** All of these go through `createSimulationConfigFromSettings`
(`StressRepository.js:327-427`), so one added line covers them:

- the Monte Carlo, History and Scenarios tabs (`src/app.js:250/273/286`);
- the allocation optimiser and the risk grid (`index.html:6708, 8084`);
- every strategy run (`index.html:6173, 6383, 6456, 8480, 10083`);
- the household and survivor checks (`index.html:10707-10708`);
- the required-pot search (`index.html:11019`);
- the retire sweep (`RetireSweep.js:86`);
- the engine worker (`src/workers/engineWorker.js`; the config is built on the page and cloned across).

`HouseholdService.js:54-55, 183, 231, 316-317` runs each partner's own config, so each partner's plan uses its
own charge. `wealthAt` (`:61-70`) holds a not-yet-started partner's opening pot flat, with no growth, so there
is nothing to charge.

### 2b. Today's planner — the bought strategies (`src/strategies`)

They all run on the real total-return index. The 1.5% world cut is already inside that index (`getRtr`,
`ladderEngine.js:39-47`). **The market series must stay uncharged.** `bootstrapPaths` (`:85`) feeds Pots &
Valves through `annualNominal` (`stressTest.js:225, 229`), and Pots & Valves charges itself, so charging the
series would charge it twice. The rotation trigger (2c) also reads the market, not a holding. So the charge
goes on the sleeve inside each loop: one `chargeM` value in the strategy config, defaulting to 1.

| File:line | Pot | Applies? | Where |
|---|---|---|---|
| `ladderEngine.js:147` (`stage1Band`), `:176` (`stage1Calendar`), `:207` (`stage2`) `V *= rtr[..]/rtr[..]` | Ladder & Ratchet equity sleeve | Yes | New argument `chargeM = 1`; `V *= chargeM` straight after the growth line. |
| `LadderAndRatchet.js:90` growth from the last calendar review to the ladder's end | same sleeve | Yes | × `Math.pow(chargeM, L − lastReview)`. |
| `LadderAndRatchet.js:116` (rungs still bought while drawing) | same sleeve | Yes | `V *= chargeM` after line 116. |
| `LadderAndRatchet.js:83-85, 135` | — | — | Pass `cfg.chargeM` into `stage1*` and `stage2`. |
| `LadderAndRatchet.js:103` `holdMultiple` | statistic (market) | No | It reads the market and stays uncharged. |
| `FloorAndFlex.js:113` (`runFlexCore`) `V *= series[..]/series[..]` | Flex sleeve / reserve / engine | Yes | `V *= cfg.chargeM ?? 1` after line 113. This one line covers Floor & Flex, Floor the schedule, Floor to an age and Bridge & engine (all `runFlexWindows` / `runFlexMonteCarlo`). |
| `stressTest.js:502` (`bridgeTest`, engine after the bridge age) and `:430` (`floorToAgeTest`, `grow`) | the same sleeve read later | Inherit | Both take ratios of `sleeveByYear`, which is already charged. |
| `GiltRotation.js:67` `sleeve *= series[..]/series[..]` | Equity sleeve after the rotation | Yes | `sleeve *= ctx.chargeM` after line 67. Add `chargeM` to `rotationPathsCtx` (`:90-119`). |
| `GiltRotation.js:61-62` all-time-high trigger | market | No | Must stay on the uncharged market. |
| `GiltRotation.js:38-43, 65` value of the block before rotation (gilts building toward redemption value) | Directly held gilts | No | Untouched. |
| `GiltLadderPlan.js:19-21` `cashCostFactor`; `:56` cash years; `compareRunner.js:160` and `stressTest.js:489` (Bridge & engine cash years) | Money-market cash for the first ladder years | Yes by rule 2 ("cash pots") | Owner decision D3: factor ((1 + drag) / (1 − c))^(k−1). |
| `GiltLadderPlan.js:71` rung costs, `ladderPvAt` (`stressTest.js:262`), `floorCost` (`FloorAndFlex.js:18`), `LadderPosition.js:168` | Gilt rungs | No | Untouched. |
| `stressTest.js:92-102` `applyWindfallsToNeed` (windfall held for later rungs "at its real value") and `fullGiltTest` `plan.spare` (flat) | Held as short gilts / cash; never grown | No (see D5) | Untouched; the help text says so. |
| `compareRunner.js:84-169` `deriveCompareConfigs` | — | — | Put `chargeM` into `lr`, `ff`, `fs`, `fa` and `be`, from the plan `p`. |
| `stressTest.js:112-177` `planFromSettings` | — | — | Add `chargesPct: cfg.chargesPct ?? 0` to `p`. `pnvCfg` (`:173`) already spreads `cfg`, so Pots & Valves and Buckets get it for free. |
| `stressTest.js:637` `requiredPotForStrategy`, `:655` `pnvDecadeSeries`, `compareRunner.js:29, 67, 189` | — | Inherit | They use `p` or `pnvCfg`. |

The ladder and floor goldens pin the reference maths with `setEquityHaircut(0)` and no `chargeM`. With the
default of 1 they do not move.

### 2c. Today's planner — saving years and other projections

| File:line | What grows | Applies? | Where / note |
|---|---|---|---|
| `AccumulationEngine.js:144-145` (`projectAccumulation`) `pot × (1 + r/12) + monthly` at the regulator's 2/5/8% projection rates, and the holder's own-mix line | Pension pot while saving | Yes (the regulator's projections are net of charges too) | New argument `chargesPct = 0`: `pot × (1 + r/12) × chargeM + monthly`. Every caller passes the plan's `chargesPct`. **The own-mix line double counts:** `Holdings.proportions` (`Holdings.js:62`) already takes off the weighted fund OCF from the holdings list. See R4. |
| Callers: `index.html:10989` (Accumulation planner), `PlanTiming.js:277, 279` (`projectedPotAtRetirement`, SIPP and ISA), `PlanDocument.js:157` (`buildAccumulationPath`), `RetireSweep.js:48` (`potAtAge`) | | | Pass `chargesPctOf(settings)`. |
| `RetireSweep.js:82` ISA at a candidate age `isaBalance × 1.02^years` | ISA while saving | Yes | × (1 − c)^years. |
| `index.html:8960` `_tmProjection` → saved `potAtRetirement` | — | Inherit | It is computed when the Timing block is saved. **Saved `potAtRetirement` values are not recomputed** (some were typed in by the person). See R3. |
| `DrawdownService.js:35, 105` (`generateDrawdownSchedule`): ISA left at inflation − 1% | ISA (deterministic table) | Yes | New option `chargesPct` (default 0). The Stress "Drawdown schedule" and "Glidepath" tables (`index.html:13285, 13325`) pass the plan's value. `PlanLock.buildPlanOfRecord` (`PlanLock.js:34`) is built from **Decision** settings and stays as it is (D6). |
| `legacyDecision.js` (`calcDecisionPWA`) | — | No | It works from the balances the person records. It never projects a pot (checked: no growth anywhere in the file). Rule 4 holds by construction. |
| `GlidepathService.generateGlidepathSchedule`, `IncomeSchedule`, `InflationModel`, `TaxYearWizardService`, `TransitionPlanner`, `LadderPosition`, `RotationStatus`, `BudgetModel` | — | No pot growth | Untouched. The 5% glide line at `index.html:9595` is a fixed rule line, not a projection. |

### 2d. V7 (`src/answers`)

| File:line | What grows | Applies? | Where |
|---|---|---|---|
| `saving.js:91, 102` `charge` from `household.saving.charge` (a fraction); `chargeM = Math.pow(1 − charge, 1/12)` | Pension and savings while saving | Already charged | Read `household.chargesPct` (household level, see below); `chargeM = monthlyChargeFactor(pct)`. At 0.5 this is the same number (0.5/100 === 0.005 exactly), so the saving-year pins do not move. |
| `saving.js:159` `G *= g[m] * plan.chargeM`; `:288-291` `savingRows` | | | No change in arithmetic. |
| `fastEngine.js:370-373` (pension closed: sleeves grow untouched, ISA grows) | Pension sleeves and ISA while the pension cannot yet be drawn | Yes | `if (chargeM !== 1) { equity *= chargeM; bond *= chargeM; cash *= chargeM; if (isa > 0) isa *= chargeM; }` straight after line 373. |
| `fastEngine.js:423-426` (normal months) | Pension sleeves and ISA while drawing | Yes | The same block straight after line 426. Compute `chargeM` beside `isaFactor` (`:324`) with the **same** `monthlyChargeFactor`. Keep each multiply a separate statement, in the same order as `simulate`: (x × growth) × charge, never x × (growth × charge). |
| `fastEngine.js:166-188` `fastEligible` | — | — | Add `(c.chargesPct === undefined \|\| (finite(c.chargesPct) && c.chargesPct >= 0 && c.chargesPct <= 3))`. Today the replica would quietly ignore a field it does not know. |
| `fastEngine.js:512` fallback to `simulate` | — | Inherit | The config carries `chargesPct`. |
| `toEngine.js:243-264` `run.base` | — | — | Add `chargesPct: household.chargesPct`. This is the one place V7's drawing runs get it (C, A, B, `band.js:76`, `bandReference.js:66`, `stopAt.js`). |
| `lives.js:31-41` the bond stream | Market factors only | No | Untouched; it is drawn per life and never charged. |
| `stopAt.js` | — | Inherit | Saving years come from `saving.js` kernels, drawing years from `fastEngine`. No growth of its own. |
| `c/answer.js:242-273` `rowsFromEngine`: `growth = potEnd − potStart + draw` (line 262) | Month rows | Shown | Add `charge` from `traceRow.charge`: `growth = potEnd − potStart + draw + charge`. Add `charge` to the row contract (`contract.js`, `Row`) and to the trace oracle (`tests/v7/oracles/fromTrace.mjs:40`: potStart + growth − charge − draw = potEnd). Without this the charge vanishes into "growth". |
| `c/onLives.js:101, 226` C's paying-in years use `SAVING.charge × 100` | | | Use C's own `inputs.charge`. |

**V7 model and words**

- **Household** (`household.js:36-37, 56, 61, 330-331, 384`): move the charge from `household.saving.charge`
  (a fraction, savers only) to a top-level `household.chargesPct` (a percent, every question).
  `HOUSEHOLD_LIMITS.charge` becomes `{ min: 0, max: 3 }`. The assumed id `charge-saving` becomes `charges`.
- **Inputs**:
  - `schemaParts.js:113` (A and B `moreFields`): max 2 → 3, step 0.05, boundaries [0, 0.05, 0.5, 1, 3], and
    the label changes.
  - `c/schema.js:74-79`: add the same `charge` field to C's "more".
  - `validate.js:72-74, 100`: `percent` takes one decimal today. It must take two and accept only multiples of
    0.05, comparing with a tolerance (`Math.abs(v × 20 − Math.round(v × 20)) < 1e-9`).
- **Conversion** happens once, in `monthlyChargeFactor`:
  - `a/toHousehold.js:87`: `/100` becomes pass-through.
  - `b/toHousehold.js:56`: drop `Math.round(x × 10) / 1000`, which rounds to 0.1 and would turn 0.05 into 0.1.
  - `a/answer.js:255` and `b/answer.js:399`: `chargeAYear` = pct / 100 for display only.
- **Carry and hand-over to C**:
  - `carry.js:22, 30`: move `'charge'` from `SAVER_FIELDS` to `HOUSEHOLD`, so C ↔ A ↔ B carry it.
  - `schemaParts.js:284`: `handOverToC.same` no longer needs the charge to equal 0.5, because C now asks for it.
- **Words**:
  - C's `charge-saving` (`c/sentences.js:465`) and `no-charges` (`:496`) become one line,
    `charges`, with field `charge`.
  - A's `charge-saving` (`a/sentences.js:377`) and B's (`b/sentences.js:302`) become the same `charges` line:
    "Charges of 0.5% a year come off your pension and savings every month, while you save and while you take
    the money."
  - Copy: `copy/a.js:424-427`, `copy/b.js:391`, and a new `copy/c.js` entry. Label: "Charges (funds and
    platform), a year". Help (as built, after review): "What your funds and your platform take each year, as a
    share of what you hold, while you save and while you draw. Not taken off State Pension or final-salary
    pensions: there is no such charge on those."
  - The banned-words list (`copy/banned.js`) has nothing against "charges", "funds" or "platform".
- **Constants**: `rules.js:36` `SAVING.charge` is replaced by the shared `DEFAULT_CHARGES_PCT`.
  `tests/v7/a/schema.test.js` asserts V7's default equals today's planner's.

## 3. Where the setting is read, and how a locked plan is told apart

- **Stored**: `stressTool.settings.chargesPct` only. It never goes into `decisionTool.settings`, so it cannot
  move `decisionSettingsChecksum` (`DecisionRepository.js:214-222`).
  - `seedDecisionFromStress` (`ScenarioRepository.js:207-250`) copies an explicit list of keys. It must
    **not** gain `chargesPct`; a test pins this.
  - `seedStressFromDecision` (`:144`) spreads `currentStress`, so the plan's own value survives.
- **Read for engines**: `createSimulationConfigFromSettings` gains `chargesPct: chargesPctOf(settings)`.
  `planFromSettings` copies it to `p`. `deriveCompareConfigs` turns it into `chargeM` for the bought strategies.
- **Where the default must NOT go** (each of these would hand 0.5 to a locked plan that has no key):
  - `StressRepository.getDefaultStressDB` (`:36-78`). It is merged **under** every stored plan on load
    (`migrateStressDB`, `:207-211`), so a locked plan would read 0.5.
  - `ScenarioRepository.getDefaultStressSettings` (`:60-96`). It is the fallback when a plan has no stress
    settings (`getActiveStressSettings`, `:597-600`), and it is merged under `currentStress` in
    `seedStressFromDecision` (`:147`).
- **Where the default goes**: `getDefaultScenario` (`:305-327`), as
  `stressTool: { settings: { ...getDefaultStressSettings(), chargesPct: DEFAULT_CHARGES_PCT } }`. Every new
  plan is made there:
  - "+ New plan" and the setup wizard (`createNewScenario`, `:420`);
  - the partner plan (`index.html:10895`);
  - the demo and guest plans (`index.html:4640, 5046`);
  - the V7 seed (`PlanSeed.js:438`).
- **The V7 seed**: the seed already carries the answer's checked `inputs` (`keep/planSeed.js:228`).
  `seedToScenario` (`PlanSeed.js:466`) writes `S.chargesPct = inputs.charge` when it is a valid percent,
  otherwise 0.5. **No seed version change** is needed (`checkSeed` ignores keys it does not know). An old V7
  tab without the field gives 0.5.
- **Telling a locked plan apart.** The engines never need to: a locked plan without the key runs at 0. Only
  two places need to know:
  - the **migration**: `decisionTool.settings.locked === true`, the flag behind the planner's own
    `planIsLocked()` (`index.html:13036`);
  - the **settings screen**, which shows the special text when `planIsLocked()` is true and the key is
    missing. `refreshStressLock` (`index.html:8455`) and `loadStressSettings` (`:11209`) already have the
    flag.
- **Fingerprints of a locked plan.** Only `decisionSettingsChecksum` is stored. It is stamped on each recorded
  month and on the plan of record.
  - The Stress checksum (`generateStressChecksum`, `StressRepository.js:197`) lives in memory and is never
    written.
  - `seedStressFromDecision`'s `decisionChecksum` hashes Decision settings.
  - The plan document carries no hash of the settings.
  - So no stored fingerprint covers `stressTool.settings`, and `chargesPct` moves none.
  - `ENGINE_VERSION` (`src/strategies/version.js`) is a stamp, never compared. Bump it with this release,
    because every strategy's arithmetic changes.

## 4. The migration (schemaVersion 1 → 2)

`src/storage/schema.js:18` `SCHEMA_VERSION = 2`; append to `MIGRATIONS` (`migrations.js:112-114`):

```js
/**
 * 1 → 2 (6.19.0). Fund and platform charges: an UNLOCKED plan is given the default, 0.5% a year, written into its
 * Stress settings. A LOCKED plan is not touched at all — not a key of its Stress settings, its Decision settings, its
 * plan document, its archives or its history: it runs without charges (absent reads as 0) until it is unlocked.
 */
function toV2(s) {
  const dt = isObj(s.decisionTool) ? s.decisionTool : null;
  if (dt && isObj(dt.settings) && dt.settings.locked === true) return s;              // locked: nothing
  const st = isObj(s.stressTool) && isObj(s.stressTool.settings) ? s.stressTool.settings : null;
  if (!st) return s;                         // no Stress settings: the new-plan template gives 0.5 when they are made
  if (typeof st.chargesPct === 'number' && Number.isFinite(st.chargesPct)) return s;  // already set (idempotent)
  st.chargesPct = DEFAULT_CHARGES_PCT;
  return s;
}
// MIGRATIONS: { to: 2, name: 'Fund and platform charges: 0.5% a year written into every unlocked plan', up: toV2 }
```

- **What the framework already enforces:**
  - no root key may be lost;
  - `planDocument`, `planDocumentArchive`, `planOfRecord(+Archive)` and `history` are byte-identical;
  - the Decision settings of a locked plan, or of one with records, are byte-identical.
- **New guard to add**: the Stress settings of a **locked** plan are byte-identical too. Add
  `out['stressTool.settings'] = bytes(st)` to `protectedParts` (`migrations.js:73-86`) when
  `dt.settings.locked === true`. That makes rule 3 enforced rather than promised, for this step and every later
  one.
- **Pure, idempotent, clock-free.** It runs on every read path that already calls `upgradeScenario`:
  - a signed-in load (`FirestoreService.js:92`);
  - a guest load (`:119`);
  - a plan being created (`:135`), which covers new plans, duplicates and a guest plan handed into an account.
- **An unlocked plan that already has records** gets 0.5 (rule 3 says unlocked). Charges are projection-only,
  so its recorded months do not move.
- **Duplicates** (`duplicateScenario`, `:477-518`): a copy of a v2 plan is not migrated again. A draft copy of
  a pre-charges locked plan therefore has no key and runs at 0. See D7.

## 5. Screens

- **Stress tester → Settings → "Your allocation"** (`index.html:3300-3420`): a new form group after the
  diversifiers box (`:3407-3415`).
  - The input is `ssChargesPct`: type number, min 0, max 3, step 0.05.
  - Label: "Charges (funds and platform), % a year", with the `hlp` tip in the help text above.
  - `loadStressSettings` (`:11209`, beside `ssIsaPolicy` at `:11257`) fills it from `chargesPctOf(s)`. When the
    plan is locked and the key is missing, the box is replaced by the text "0% (this plan was locked before
    charges were added; unlock to change)".
  - `saveStressSettingsUI` (`:11281`, beside `:11378`) writes `chargesPct`, clamped to [0, 3] and rounded to
    0.05. The form is disabled while locked, so a locked plan is never written from here.
- **Strategies → Background → Assumptions & data** (`assumptionsPageHtml`, `index.html:9964`):
  - section 1's "Not modelled" row (`:9986`) loses "Fund charges, platform fees";
  - a new row, "Charges": "your plan's setting (0.5% a year unless changed), taken monthly from every fund and
    cash pot, the ISA and the taxable account; not from gilts held directly, annuities, final-salary or State
    Pensions";
  - the ISA row (`:10006`) says "before charges".
- **Plan document**: `PlanDocument.js:209-214` `assumptions` gains `chargesPct: chargesPctOf(settings)` on new
  documents only. `PlanDocumentView.js:127` shows it. A document without the key reads "Charges: not taken off
  (this plan was locked before charges were added)". Stored documents are never rewritten.
- **Unlock** (`index.html:13111-13135`): see D2.
- **V7**: C, A and B "Add more detail" gain or keep `charge`. The assumed list shows the `charges` line with
  Change.

## 6. What moves, and by how much (scratch estimates; to be re-measured on the real build)

These were measured on a scratch copy of the engine and the V7 adapter, with no product code changed.

**Today's planner**, Pots & Valves: £500,000 pension, £60,000 ISA, £30,000 a year, State Pension £12,000
from year 8, 35 years, 1,000 futures.

| Charges | Lasts (Monte Carlo) | Lasts (history) | Typical left, today's money |
|---|---|---|---|
| 0% | 89.3% | 79.4% | £183,700 |
| 0.5% | 82.9% | 73.0% | £100,500 |
| 1% | 75.2% | 69.8% | £55,700 |

At £34,000 a year the chance of lasting falls from 68.8% to 55.8%. With protection off it falls from 70.2% to
61.8%.

**V7 question C**, careful amount a month at 1,000 futures, charges in the drawing years 0% → 0.5%:

| Fixture | Careful amount |
|---|---|
| F1 | £1,380 → £1,350 |
| F2 | £3,580 → £3,500 |
| F3 | £1,860 → £1,820 |
| F4 (still paying in; its saving years were already charged) | £2,290 → £2,220 |

Middling amounts fall by £40–110.

**Pins and what happens to them:**

- **Do not move** (no `chargesPct` in their configs):
  - stress, decision, ladder and floor-and-flex goldens (`tests/golden`);
  - `appPaths.pin.json`;
  - `calibration`, `conservation`, the crossval replays, `taxNetToGross.identity`, `determinism`.
- **Move, each with a report:**
  - V7 C, A and B fixtures and named states (`tests/v7/fixtures`, `tests/v7/states`, `made-with.json`);
  - V7 case lists (`npm run v7:cases`: the new C field adds dimensions);
  - V7 `drawing-result.json`;
  - plan corpus snapshot, for the eight unlocked fixtures (01, 02, 07, 08, 09, 10, 11, 12), once the corpus
    runs `upgradeScenario` (T10). The locked fixtures 03–06 must not move.
  - `appPaths` gains one **new** charged entry. The existing entries do not move. (As built: all three gained a
    charged twin, and the stress goldens gained one per config; no existing entry moved.)

## 7. Tests first (each written to fail before the code)

**Engine and shared module**

- **T1 `tests/Charges.test.js`**:
  - `chargesPctOf` returns 0 for absent, null, NaN, a string, a negative or a value above 3; otherwise the
    value.
  - `monthlyChargeFactor(0) === 1`; `monthlyChargeFactor(0.5) === Math.pow(0.995, 1/12)`.
  - Twelve months of the factor equal (1 − c) to 1e-12.
  - V7's default equals `DEFAULT_CHARGES_PCT`.
- **T2 `SimulationEngine.test.js` additions**:
  - Absent and `chargesPct: 0` are byte-identical to today on the golden matrix (whole result object).
  - Zero returns, no draw: every pot (equity, bond, cash, ISA, HODL, diversifiers) equals start × (1 − c)^years
    to 1e-9.
  - The GIA charges only its non-gilt share; an all-gilt GIA is untouched.
  - The random stream is unchanged (HODL and bond draws are the same with and without charges).
  - A higher charge never gives a larger final pot or a later failure, over 200 futures.
- **T3 `tests/integration/conservation.test.js`**: start − Σ draws − Σ `trace.charge` = end, exactly as the
  test does today for draws.

**Bought strategies and projections**

- **T4 strategies** (`strategyExtensions` / `newStrategies`):
  - each bought strategy at `chargeM = 1` equals today (goldens);
  - at 0.5% the sleeve's `sleeveByYear` is lower in every window;
  - rung costs, `floorCost` and `ladderPvAt` are unchanged;
  - the rotation trigger month is identical with and without charges, so the trigger reads the market.
- **T5 `AccumulationEngine.test.js`**: `projectAccumulation` with no `chargesPct` equals today; with c, zero
  contributions give pot × ((1 + r/12) × chargeM)^12y. Plus `RetireSweep` and `projectedPotAtRetirement` pass
  the plan's charge.

**Migration and locked plans**

- **T6 `tests/migrations.test.js`**:
  - SCHEMA_VERSION is 2;
  - an unlocked plan gains `chargesPct: 0.5`, and nothing else changes byte for byte;
  - a locked plan is byte-identical (Stress settings included), and its `decisionSettingsChecksum` and
    `planDocument` are unchanged;
  - an existing `chargesPct` (0, 1.25) is kept;
  - running the step twice is harmless;
  - a deliberately bad step that touches a locked plan's Stress settings is refused (the new guard).
- **T7 `ScenarioRepository.test.js` / `ScenarioSettings.test.js`**:
  - `getDefaultScenario().stressTool.settings.chargesPct === 0.5`;
  - `getDefaultStressSettings()` and `getDefaultStressDB()` do **not** carry it;
  - `seedDecisionFromStress` never copies it;
  - `migrateStressDB` on a locked plan without the key yields no key, and the config gets 0.
- **T8 `DecisionSettingsChecksum.test.js`**: the checksum of every corpus fixture is unchanged across
  `upgradeScenario` to v2.
- **T9 `planSeed.test.js` / `planSeed.v7.test.js`**: a seed whose inputs say `charge: 1.25` makes a plan with
  `chargesPct: 1.25`; a seed with no charge makes 0.5.
- **T10 plan corpus**: `checks.mjs` evaluates through `upgradeScenario`. New check (5): unlocked fixtures carry
  0.5 and locked ones carry no key, with an unchanged headline. The snapshot is re-pinned with a moved-by
  report. The corpus has a cap of 12 fixtures (`planCorpus.test.js`), and every fixture is already at
  schemaVersion 0, so no new "old shape" fixture is needed.

**V7**

- **T11 identity**: `tests/v7/c/speed.identity.test.js` and the slow variant: random households carry random
  charges, including 0, 0.05, 0.5 and 3; fixtures run at 0 and at 0.5. `tests/v7/saving/locked.test.js`: the
  chain in `chain.mjs` passes the charge.
- **T12 V7 behaviour**:
  - closed forms: C's drawing years with zero returns lose exactly (1 − c) a year; the saving forms CF-S2 are
    unchanged;
  - invariant: a higher charge never gives a larger careful amount (C, A, B);
  - trace oracle: `potStart + growth − charge − draw = potEnd`;
  - `validate` accepts 0.05 and 2.95 and rejects 0.07 and 3.05;
  - `toHousehold`: 0.05 stays 0.05;
  - carry C ↔ A ↔ B keeps `charge`; `handOverToC.same` with a charge of 1.25 is true;
  - wording: the `charges` line has field `charge` and passes the banned-words list.
- **T13 screens** (`tests/indexMarkup.test.js`, `tests/replay`):
  - `ssChargesPct` exists with min 0, max 3, step 0.05;
  - the locked-without-key text appears and the box is absent;
  - save writes a clamped value;
  - the Assumptions page no longer says charges are not modelled.

## 8. Risks

- **R1 One default, one place.** A 0.5 placed in any merge-under-stored default (`getDefaultStressDB`,
  `getDefaultStressSettings`) silently hands charges to every locked plan. T7 guards it.
- **R2 Byte-identity with the replica.** Fold the charge into the growth factor (`mEq × chargeM`) in one engine
  and not the other, or reorder the multiplies, and `speed.identity` fails. The same block at the same point
  passed 8,160 scratch runs.
- **R3 Retiring-later plans.** A saved `potAtRetirement` is an input, sometimes typed in, so it is not
  recomputed. After migration the drawing years of such a plan are charged at once. Its years before
  retirement are charged only when the Timing block is next saved.
  - The Timing block already shows the fresh projection beside the saved figure.
  - Its wording should say that charges are now taken off the projection.
  - Owner: accept this, or ask for a one-off notice on such plans.
- **R4 Double counting on the own-mix line.** The Accumulation planner's "your mix" line already takes off the
  holdings list's weighted OCF (`Holdings.js:62`). Proposed:
  - that line uses `expectedNominal − CPI − chargesPct` (the plan's one setting replaces the list's OCF);
  - the screen shows the list's weighted OCF beside the setting as a hint ("your funds' own charges come to
    0.18%; add your platform's fee").
- **R5 The cut in V7 percent rounding.** B rounds the charge to 0.1 (`b/toHousehold.js:56`, `b/answer.js:399`)
  and `validate` allows one decimal. Both must change, or 0.05 steps break.
- **R6 C gains a field.** It joins "Add more detail" only, so the counted first-answer budgets do not change.
  The pairs lists, states, pictures and wording tests all regenerate. The hand-over sameness rule changes.
- **R7 V7 month rows.** Without a `charge` column the charge hides inside "growth" and the trace oracle cannot
  see it. This is a contract change (`contract.js` `Row`).
- **R8 Locked plans compared with new ones.** A locked pre-charges plan runs at 0%, and its "Try a strategy"
  what-ifs run at 0% too. That is like for like within the plan, but it is not comparable with a new plan at
  0.5%. The settings text says so.
- **R9 Household pairs** may mix a locked partner at 0% with an unlocked one at 0.5%. Each partner is right for
  their own plan, and the joint result is shown as it is.
- **R10 A plan with records and no lock flag.** This is a plan from before auto-lock that was never locked.
  The migration treats it as unlocked (0.5), which matches what the planner shows it as. Its recorded months do
  not move.

## 9. Decisions for the owner

- **D1 Version.** Proposed 6.19.0, a minor release, so the note pops up once. ENGINE_VERSION is 6.19.0 too.
- **D2 Unlock.** Proposed: unlocking a plan that has no key writes 0.5 in the same step, and the unlock
  confirmation says so ("This plan was locked before charges were added: from now on 0.5% a year is taken off
  its projections; change it in Settings"). The alternative is to leave it at 0% until the person changes it.
- **D3 Cash years of the gilt-ladder strategies** (Full ladder, Rotation, Bridge & engine) are money-market
  cash inside the SIPP. Rule 2 says cash is charged. Proposed: charge them, so the cash years cost a little
  more (year 2 of a 2-cash-year ladder: +0.5% of that year's need). A locked ladder plan (the owner's own) is
  unaffected.
- **D4 Gilts inside the taxable account.** The model treats them as held directly (no capital gains tax).
  Proposed: not charged, consistent with rule 2's "gilts held directly". The alternative is to charge the
  whole account.
- **D5 Money held for later rungs** (a windfall waiting to buy rungs, a ladder's spare) is modelled as holding
  its real value, as short gilts or cash. Proposed: leave it uncharged and say so. The alternative is to charge
  it as cash.
- **D6 The Decision tool's plan-vs-actual yardstick** (`buildPlanOfRecord`, built from Decision settings,
  frozen at lock). Proposed: unchanged in this release, because it is not checksummed but it is protected.
  Taking charges off its ISA line would mean reading the Stress setting at lock. Follow-up if wanted.
- **D7 Copies.** Proposed: an unlocked copy of a plan that has no key gets the effective value written
  explicitly (0). The copy then reproduces the original's figures, and the 0 is visible and editable. The
  alternative is 0.5, treating the copy as a new plan.
- **D8 V7 range.** A and B allow 0–2% today. Proposed 0–3% in steps of 0.05, matching today's planner, as the
  rules say.
- **Couples stopping in different years** (the owner's other answer). Charges are now the same in both
  phases, so a person's monthly factor no longer depends on whether that person has stopped. When `saving.js`
  gains a per-person saving length S (it assumes one stop year today, `saving.js:84`, `stopAt.js:59, 65`), the
  charge needs no per-person handling. That simplifies the change. It does not block it.

## 10. Draft release note (for `src/releases.js`; not added)

Final draft after the review of 1 October 2026 (three findings: the help text read as a fee on a State Pension;
the correction understated the moves; the summary read as if every locked plan, now and later, ran without
charges). The ranges in the correction are the measured ones: a plan close to the edge loses about 4 to 15 points
(golden base on History 4.4, no State Pension on Monte Carlo 14.5), a comfortable plan up to about 6 on History
(HODL golden, 100 → 94.1), and the amount typically left falls by about a fifth to two fifths (19%–42%), more when
little is left (corpus 01, −65%) and less over 20 years (−13% to −17%). Ship it with `ENGINE_VERSION = '6.19.0'`.

```js
const pctText = (v) => String(Math.round((+v || 0) * 100) / 100);

export const ENTRY = {
  version: '6.19.0', date: '2026-10-__', engineVersion: '6.19.0',
  title: 'Fund and platform charges are now taken off: 0.5% a year unless you change it',
  summary: 'Until now no charges were taken off once money was being drawn, which made every plan look better than it is likely to be. Each plan now has one setting, "Charges (funds and platform), % a year", starting at 0.5%. It comes off every month, while you save and while you draw, from the money held in funds and cash in your pension, ISA and taxable account. It does not come off gilts you hold directly, annuities, final-salary or State Pensions. A plan that was already locked keeps its figures: it runs without charges until you unlock it.',
  changes: [
    'Stress tester → Settings → Your allocation: "Charges (funds and platform), % a year", from 0% to 3% in steps of 0.05%. Put in what your funds charge plus what your platform charges (for example, a 0.2% tracker on a 0.25% platform is 0.45%). The line under the box shows what the funds you hold charge, so you only add the platform\'s fee.',
    'Monte Carlo, History, Scenarios, every strategy, the Strategies comparison, the Household checks, the drawdown schedule, the Accumulation planner, the Timing block\'s pots at retirement and the retire-at-what-age sweep all take the charge off. The line above Monte Carlo, History and Scenarios says what charge the runs take.',
    'A plan document written from now on records the charge it was worked out at, under Assumptions.',
    'New plans and plans reset to defaults start at 0.5%; a plan made from a preview answer starts at the charge that answer used (0.5% unless you changed it).',
    'Preview at /v7/: the same setting under "Add more detail" in all three questions. It is now taken off while you draw as well as while you save.'
  ],
  corrections: [
    'Fund and platform charges were not taken off once money was being drawn (the Assumptions page listed them as "not modelled"), so every plan looked better than it is likely to be. At 0.5% a year, a plan close to the edge loses about 4 to 15 points of its chance of lasting, and even a comfortable plan can lose up to about 6 points on the History tab. The amount typically left falls by about a fifth to two fifths: by more when little is left, and by less when the plan runs for fewer years. Gilts held directly are not charged, so plans built on them move least. For example, the guest demo (£1M, £40,000 a year rising) goes from lasting in 94% of futures to 90%, and the amount it typically leaves falls by about 30%.'
  ],
  effects: {
    budget: [],
    stress: [
      'Unlocked plans: 0.5% a year is now taken off, so the chance of lasting and the amount left go down.',
      'Plans already locked: unchanged. The setting reads "0% (this plan was locked before charges were added; unlock to change)" and the runs say no charges are taken off. A plan locked from now on keeps the charge it had when it was locked.'
    ],
    strategies: [
      'Unlocked plans: every strategy\'s figures move. The parts held in funds and cash are charged; gilts held directly are not, so a gilt ladder moves least. The cash years before a ladder\'s first rung cost a little more. The rotation trigger still reads the market, not your holding.'
    ],
    decision: [
      'No effect: months already recorded, your balances, the plan-versus-actual yardstick and a locked plan\'s document keep their figures. Charges are a projection input only.'
    ],
    accumulation: [
      'Projections to retirement now take the charge off every month. The "your mix" line uses the plan\'s charge in place of your funds\' own charges, so they are not counted twice.',
      'A "pots at retirement" figure saved in the Timing block changes only when you next save the Timing block.'
    ],
    household: ['Each partner\'s plan uses its own charge. A partner plan that was already locked stays at 0% until it is unlocked.']
  },
  actions: [
    'Check the charge in Stress tester → Settings: your funds\' yearly charge plus your platform\'s fee.',
    'If you are retiring later, open the Timing block and save it, so the pots at retirement include charges.',
    'A plan that was already locked stays at 0%. To have charges taken off, unlock it: it then takes 0.5% a year, which you can change. To keep its record as it is, duplicate it instead (the copy starts at the plan\'s own 0%, which you can change).'
  ],
  notes: [
    'Not charged: State Pensions, final-salary pensions and annuities, which have no such charge, and gilts you hold directly (a ladder\'s rungs, the gilts in a taxable account), for which platforms usually charge a small fixed fee. Money held back for later rungs (a windfall, a ladder\'s spare) is held at its real value and not charged.',
    'Each charged pot is multiplied by (1 − c)^(1/12) after each month\'s growth, so twelve months take off exactly c. At 0% every figure is exactly what it was.',
    'Saved plans: schema version 2. On first load, every unlocked plan is given 0.5% in its Stress settings. A plan locked at that point is not touched at all: its settings, plan document, archives and history stay as they were, and its Decision checksum does not move.',
    'The −1.5 points a year cut on US share returns stands for world shares, not costs; it is unchanged.',
    'Engine version 6.19.0: every strategy\'s arithmetic changed (it changes a result only when the plan has a charge).'
  ],
  affects: (scenario) => {
    const s = scenario && typeof scenario === 'object' ? scenario : {};
    const st = s.stressTool && typeof s.stressTool === 'object' ? s.stressTool.settings : null;
    if (!st || typeof st !== 'object') return [];
    const locked = !!(s.decisionTool && s.decisionTool.settings && s.decisionTool.settings.locked);
    const v = st.chargesPct;
    const pct = typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 3 ? v : null;
    if (pct === null) {
      return locked ? ['This plan is locked, so it is held at 0%: its figures do not move. Unlock it and 0.5% a year is taken off from then on (Stress tester → Settings).'] : [];
    }
    if (pct === 0) return ['This plan takes no charges off (0% in Stress tester → Settings), so its figures are as they were.'];
    return ['This plan now takes ' + pctText(pct) + '% a year off for fund and platform charges, so its chance of lasting and the amount left are lower than before. Change it in Stress tester → Settings.'];
  }
};
```
