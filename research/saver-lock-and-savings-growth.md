# A saver's locked plan that reads true, how savings grow, and one bar for "on course" (map and design, 2 Oct 2026)

Status: built in the working tree for 6.22.0, not yet released (2 Oct 2026). The figures in section 7 came from a
scratch copy of the engine before the build; the measured figures and every moved pin's moved-by table are in the
6.22.0 lead report and the release note. Not built from this design: owner decision D6 (pay-ins on plans made from a
V7 answer still rise by 0% a year). Written against 6.21.0.

This is the map for three things the owner approved on 2 Oct 2026 (research/v7-plan-of-plans.md §10; square-one audit
§3 and §5 item 2; answer-D.md §2.2):

- **(A) A saver's locked plan you can trust.** Put the recorded pot into the plan's prices (as 6.20.1 did for retired
  people). Count the ISA and what goes into it, on both sides. Make the plan document's "Refresh" restart the saving
  path's clock. Make the arrival check use the same measure. For **new** locks, draw the saving path from V7's
  saving-years engine (one future per life, with the 1-in-10 line), where practical. Documents already locked are not
  touched.
- **(B) How savings grow, in both apps.** One setting per plan with two choices: "Mostly cash" (the default: grows like
  the pension's cash, last year's rise in prices less 1%, never below nothing) and "Invested like my pension" (the
  pension's mix, on the same futures). A plan with no setting keeps today's fixed 3% inside the engines, so locked
  plans keep their figures. New plans and V7 start at "Mostly cash"; a schemaVersion 3 migration gives every unlocked
  plan "Mostly cash". In V7 the choice sits under the savings box in C, A and B, is carried between them and is saved
  into the plan seed. Every pin that moves is re-pinned with a table of how far it moved.
- **(C) One bar for "on course".** It means "lasts in 9 futures out of 10" everywhere. Today "Am I on track?" uses 85%
  and the age sweep 90%. The words and the thresholds change, with a release note.

Rules for the build: tests first; plain English on every screen; no version bump or releases.js edit until release (the
6.22.0 note is drafted in section 11); no build into docs/; browser checks as a guest only; index.html's script may only
shrink (logic goes into modules); the parity ledger must gain a row for every new saved key.

---

## 1. The design in one page

**The setting (B).** One new key, `stressTool.settings.isaGrowth`, with the value `'cash'` or `'invested'`. The same
name is used everywhere: the engine config (`config.isaGrowth`), V7's form field and household (`isaGrowth`), and the
plan seed. One small pure module, `src/services/IsaGrowth.js`, holds the names, the default (`'cash'`), the check
(`isIsaGrowth`), the reader (`isaGrowthOf(settings)` → `'cash' | 'invested' | null`, where null means "no setting") and
the weights for "invested".

- **No setting means today's 3%.** Neither engine needs to know whether a plan is locked. A config without `isaGrowth`
  runs the line it runs today (`applyIsaGrowthMonthly(isa, config.isaReturn ?? 3%)`), so every golden, pin and locked
  plan is unchanged by construction. This is the 6.19.0 charges pattern (research/charges-setting.md §1).
- **"Mostly cash"** multiplies the ISA each month by the month's cash factor, the same number the pension's cash gets
  (`monthly(cashNominalReturn(prevInf))`). No new random draw.
- **"Invested like my pension"** multiplies the ISA each month by `wE × shares factor + wB × bonds factor + wC × cash
  factor`: the pension's own three factors that month, weighted by the pension's mix. No new random draw: the bonds
  factor is the one the pension's bonds already drew. That is why this is a new, simpler option and not the existing
  `isaMix` path, which draws its own bond returns (answer-D.md §2.2).
- **The ISA funds in a fund list still win.** When the plan's "funds to test" list holds ISA-wrapped funds
  (`deriveIsaMix`, StressRepository.js:461), the engine already models the ISA at those funds (`config.isaMix`). That
  stays exactly as it is, and the setting shows a sentence instead of the two choices.
- **Written, not inferred.** `'cash'` is written by the new-plan template, the V7 seed, the v3 migration (unlocked plans
  only), "Reset to defaults", an unlocked copy of a plan that has no setting, and unlock. It is **never** put in the
  defaults merged under stored plans (`getDefaultStressSettings`, `getDefaultStressDB`): that would hand it to every
  locked plan (charges R1).

**The saver's reading (A).**

- *Documents already locked* (plan document version 2 and older) are read differently, but never rewritten:
  - the path's clock starts when the document was written (`createdAt`), not at the first lock, so a refreshed
    document reads from its own start;
  - the path is read at the month of the pot record, not at today's date;
  - the recorded pot is put into the path's prices, at the rate the path itself was built with (2.5% a year; see 4.1);
  - pension against pension, as the path holds only the pension, and the words say the ISA is not in this older path.
- *New locks* (plan document version 3) get a saving path drawn on V7's saving-years engine: 1,000 lives, seed 0, the
  pension and the ISA each with what goes into them, the plan's charge and the ISA's growth setting. Each year stores
  the middling line and the 1-in-10 bad and good lines, in pounds of the day and in the prices of the day the path was
  drawn. The reading compares the recorded pot (pension + ISA) with the lines in pounds of the day, so no guess about
  prices is needed.
- *The arrival check* uses the reading's own function at the arrival month: the same accounts, the same pounds, the
  same line. The Decision entry's ISA box is passed in, so the ISA counts when the document counts it.
- *What goes into the ISA* gets a home in today's app: `accumulationTool.settings.isaMonthly` ("Into ISAs and savings,
  £ a month"). The V7 seed writes it from `savingsIn`.

**One bar (C).** A constant `ON_COURSE_SHARE = 0.9` in `src/services/OnCourse.js`, with the words "lasts in 9 futures
out of 10". "Am I on track?" becomes "Am I on course?" and searches for the pot that lasts in 9 futures out of 10. The
age sweep's default is already 90%; its words change and its other choices stay as choices. The couples checks move
from 85% to 90%. V7 already uses this bar (`BAND.careful = 0.9`; `VERDICT.yes = 0.10`); a test holds the two apps to
one number.

---

## 2. The map: every place ISAs and savings grow

"Today" is the line as it stands in 6.21.0. "Change" is what the design does there.

### 2a. Today's planner: the monthly engine

| File:line | What | Today | Change |
|---|---|---|---|
| `constants.js:37-43` `ISA_DEFAULTS.RETURN` | The fixed rate | 0.03, "money-market nominal growth" | Stays: it is what "no setting" means. Comment says so. |
| `stressDefaults.js:48` `isaReturn: ISA_DEFAULTS.RETURN` | Every Stress settings map carries 3% | Merged under every stored plan | Stays. Never gains `isaGrowth` (R1). |
| `SimulationEngine.js:409-416` | The month's factors: `monthly(eqReturn)`, `monthly(annualBondReturn)`, `monthly(annualCashReturn)` | Computed inline for each pot | Compute each once into `fE`, `fB`, `fC` (the same values, so bit for bit). The ISA block reads them. |
| `SimulationEngine.js:430-442` `config.isaMix` | ISA at the fund list's ISA funds | Draws its own bond returns | Unchanged, and still first. |
| `SimulationEngine.js:443-445` `applyIsaGrowthMonthly(isa, config.isaReturn ?? 3%)` | The fixed rate | Every plan without ISA funds | Becomes the "no setting" branch. Before it: `'cash'` → `isa *= fC`; `'invested'` → `isa *= wE*fE + wB*fB + wC*fC`. Each guarded by `isa > 0`. |
| `SimulationEngine.js:197-202` bond tent | The pension's shares/bonds split moves by `glideShare` | — | With "invested", the ISA's shares/bonds part is split by the same year's `glideShare` (cash share unchanged). |
| `SimulationEngine.js:475-500` charge block | ISA charged after growth | `if (isa > 0) isa *= chargeM` | Unchanged: the charge comes off after either kind of growth. |
| `SimulationEngine.js:56` start of `simulate` | — | — | Work out the weights once per run: `isaGrowthWeights(config)` from `IsaGrowth.js` (explicit `config.isaGrowthMix`, else the run's own `equityStart : bondStart : cashStart`, else all cash). |
| `IsaDrawdown.js:70` `applyIsaGrowthMonthly` | The fixed-rate helper | Also the Decision side's | Unchanged. |
| `runMonteCarlo :968`, `monteCarloReturns :984`, `simulateTraced :1010`, `runHistorical :1019`, `runScenario :1049`, `optimizeAllocation :1348` | — | — | Inherit through `simulate`. Because "invested" reads the run's own start pots, the optimiser's trial mixes and the pot scaling carry the ISA with them. |
| Windfall to ISA (`:285-`), bed-and-ISA, band-fill recycling, PCLS moved to the ISA at the switch, a held ISA (`isaHeld`) | Money that lands in the ISA | Grows at 3% | Grows by the setting, like the rest of the ISA. |
| Trace row (`:379-395`) | — | — | Add `isaGrowth` (the month's ISA factor) so the conservation and oracle tests can see it. |

**The one place a config is built.** `createSimulationConfigFromSettings` (`StressRepository.js:350-…`, `isaReturn` at
`:401`) gains `...(isaGrowthOf(settings) ? { isaGrowth: isaGrowthOf(settings) } : {})`. It does **not** pass
`isaGrowthMix`: the engine reads the run's own pots, so the optimiser and the "pots at retirement" scaling follow. That
one line covers the Monte Carlo, History and Scenarios tabs, the optimiser, every strategy run, the household and
survivor checks, the required-pot search, the retire sweep and the engine worker (the same list as charges §2a).

### 2b. Today's planner: the strategies (`src/strategies`)

| File:line | What | Change |
|---|---|---|
| `stressTest.js:112-178` `planFromSettings`, `pnvCfg` (`:178`) spreads the config | Pots & Valves and Buckets in order | Inherit `isaGrowth`. |
| `stressTest.js:36-37` `availablePot = pot + (isaHold ? 0 : isa)`; `compareRunner.js:89` | The bought strategies (both ladders, rotation, floor-and-flex family, bridge and engine) spend the ISA as part of their pot, or leave a held ISA out entirely | No change, on purpose: the ISA becomes rungs or the strategy's own invested part. The setting's help says it applies to Pots & Valves and Buckets in order. |
| `stressTest.js:217`, `:247` wealth band = `potByYear + isaByYear` | — | Inherit. |
| `stressTest.js:643` `requiredPotForStrategy(…, successTarget = 0.85)` | The bar | See section 6. |

### 2c. Today's planner: the saving years and other projections

| File:line | What grows | Today | Change |
|---|---|---|---|
| `PlanTiming.js:269-285` `projectedPotAtRetirement` → the Timing block (`index.html:8942`) → saved `potAtRetirement` | ISA at retirement | `projectAccumulation` at the FCA middle rate (5% nominal) less charges, **nothing paid in** | No setting: as today. `'cash'`: the cash rule at the planner's 2.5% CPI (1.5% a year nominal). `'invested'`: the pension's own line (its mix line when holdings are tagged, else the middle line). Pays in `accumulation.isaMonthly`. A saved `potAtRetirement` is not recomputed until the Timing block is saved (R7). |
| `RetireSweep.js:86` ISA at each candidate age | ISA while saving | `isaBalance × 1.02^years` (2% a year after prices) | No setting: as today. Otherwise the same rule as `projectedPotAtRetirement`, with `isaMonthly` paid in. |
| `AccumulationEngine.js:139-175` `projectAccumulation` | Pension (and, through PlanTiming, the ISA) | FCA 2/5/8% lines | Gains one option, `fixedNominal` (the cash line), used only for the ISA. The pension lines are untouched. |
| `PlanDocument.js:144-168` `buildAccumulationPath` | The locked saving path | Pension only | Version 2 path kept for old documents; version 3 path on V7's engine (section 4.2). |
| `index.html:10937-10988` Accumulation planner projection | Pension | FCA lines | Gains an "ISA and savings" line, by the setting, with `isaMonthly`. The table moves into a module (`src/ui/accumulationProjection.js`) so the script shrinks (R17). |
| `DrawdownService.js:38, 111` deterministic drawdown schedule | ISA left over each year | Already the cash rule at the assumed CPI (`max(0, CPI − 1%)`) | Unchanged. With "invested" the table's note says the ISA is shown growing like cash here. |
| `PlanLock.buildPlanOfRecord` (via DrawdownService) | The Decision tool's yardstick | Cash rule, frozen at lock | Unchanged (it is protected, as charges D6). |
| `legacyDecision.js` | — | Works from recorded balances; no projection | Unchanged. |
| `TaxableSleeve.js:157` `growSleeve` | The taxable account | Its own mix (`taxableMix`) | Unchanged: it is not savings in this sense; it has its own setting. |
| `HouseholdService.js` `wealthAt` | A not-yet-started partner's pots | Held flat | Unchanged. The checks run each partner's own config, so each partner's own setting. |

### 2d. V7 (`src/answers`)

| File:line | What grows | Today | Change |
|---|---|---|---|
| `rules.js:17` `RULES.savingsGrowth: 0.03` | The rate the words quote | 3% | Replaced by `RULES.isaGrowthDefault = DEFAULT_ISA_GROWTH` (imported from `IsaGrowth.js`). `tests/v7/a/schema.test.js` asserts it equals today's planner's default. |
| `saving.js:11`, `:168-178` `growthOf`, `:191-227` `unitKernel` | Savings while saving | **The pension's saving mix** (one kernel for both pots: "The pension and the savings of a person grow by the same f") | `'invested'`: as today, bit for bit. `'cash'`: a second unit kernel for savings with `g(m) = monthly(cash(y))`. `savingKernel(…, 'savings')` picks it. |
| `saving.js:238-261` `savingKernel`, `potsByPerson`; `stopAt.js:93-101` | Savings at the stop | — | Inherit through the kernel. |
| `saving.js:332-357` `savingRows` (`savEnd` at `:347`) | The saving months' rows | `(sav + paidS) × g[m] × chargeM` | `g_s[m]` by the setting. |
| `fastEngine.js:204` `fastEligible` | — | Accepts `isaReturn` | Also accepts `isaGrowth === undefined`, `'cash'`, or `'invested'` **with** a valid `isaGrowthMix`. Anything else falls back to `simulate`. |
| `fastEngine.js:361` `isaFactor` | — | `(1 + isaReturn ?? 3%)^(1/12)` | Kept for "no setting". |
| `fastEngine.js:450` (pension closed) and `:513` (normal months) `isa = isa * isaFactor` | Savings while drawing | Fixed 3% | `'cash'`: `isa * pf.mCash[year]`. `'invested'`: `isa * (wE*pf.mEq[year] + wB*pf.mBond[month] + wC*pf.mCash[year])`, in the same order as `simulate`. |
| `toEngine.js:323-` `run.base` | Every drawing run (C, A, B, `band.js`, `bandReference.js`, `stopAt.js`) | `isaReturn` only under the tests' `env.savingsGrowth` | Adds `isaGrowth: household.isaGrowth` and, for "invested", `isaGrowthMix: mix` (the household's drawing mix). A savings-only run has no pension, so the mix must be explicit. `env.savingsGrowth` (tests only, a fixed rate) still wins: it sets `isaReturn` and leaves `isaGrowth` out. |
| `lives.js` | The bond stream | — | Untouched: "invested" reads the stream the pension reads. |
| `household.js:296-415` `expandHousehold`, `:416-` `validateHousehold`, typedef `:39` | — | — | `household.isaGrowth`, `'cash'` when not given (noted as assumed), checked against the two values. |
| `a/toHousehold.js:118`, `b/toHousehold.js:79`, `c/toHousehold.js:67` | — | Map `charge` | Also map `isaGrowth`. |
| Schemas: `a/schema.js:29`, `b/schema.js:47`, `c/schema.js:92` (the savings box) | — | — | A `choice` field straight after the savings box, same group (section 3.6). |
| `src/v7/state/carry.js:48` `HOUSEHOLD` | — | Carries `charge` | Also carries `isaGrowth` (C ↔ A ↔ B). |
| Sentences: `a/sentences.js:604` (`isa-fixed-growth`), `:680` (`savings-fixed-growth` warning); `b/sentences.js:441-442`, `:485`; `c/sentences.js:620` (`savings-as-isa`) | Words | "growing at a fixed 3% a year" | One line `savings-growth` with field `isaGrowth`, and a gentler warning (section 3.6). |
| `src/v7/copy/a.js:337`, `b.js`, `c.js:305` | Words | — | The field's label, options and help. |
| `contract.js:15` | `env.savingsGrowth` documented | — | Says it is a tests-only fixed rate that wins over the choice. |
| `answers/keep/planSeed.js` | The seed carries the checked inputs | — | Carries `isaGrowth` with them, no seed version change (`checkSeed` ignores keys it does not know). |
| `PlanSeed.js:691-696` (`isaReturn: 0.03`), `:730-740` (`accumulationTool`) | The plan made from an answer | — | `S.isaGrowth = isIsaGrowth(inputs.isaGrowth) ? … : 'cash'`. `accumulationTool.settings.isaMonthly = payIn.savingsIn`; the saving section is written when either pay-in is above £0. |

### 2e. Left alone, and why

- **The bought strategies.** The ISA is spent buying rungs or held in the strategy's own invested part. Growing it as
  cash there would count it twice.
- **The taxable account.** It has its own mix setting.
- **The Decision tool and its plan of record.** They work from recorded balances; the yardstick already grows the ISA
  by the cash rule.
- **`isaReturn` on stored plans.** It stays on every plan: it is what a plan without the new setting runs at.

---

## 3. Design (B): the setting

### 3.1 The module: `src/services/IsaGrowth.js` (pure)

```js
export const ISA_GROWTH = Object.freeze({ CASH: 'cash', INVESTED: 'invested' });
export const DEFAULT_ISA_GROWTH = 'cash';
export const isIsaGrowth = (v) => v === 'cash' || v === 'invested';
/** The plan's choice, or null when it has none (the engines then run today's fixed rate). */
export const isaGrowthOf = (settings) => (settings && isIsaGrowth(settings.isaGrowth) ? settings.isaGrowth : null);
/**
 * "Invested like my pension": the weights of the month's three factors. An explicit mix (V7) wins; otherwise the run's
 * own pension pots; with no pension, all cash. Pure, computed once per run.
 */
export function isaGrowthWeights(config) { /* { equity, bond, cash }, summing to 1 */ }
/** The deterministic projections' yearly nominal rate (PlanTiming, RetireSweep): cash → max(0, cpi − 1%). */
export function isaProjectionRate(kind, { cpi = 0.025, pensionRate }) { /* … */ }
```

The diversifier sleeve and the break-glass reserve are left out of the weights. They are the pension's own crisis
reserve, not its mix. The help text says the ISA follows the pension's shares, bonds and cash.

### 3.2 The engines

Both engines, the same arithmetic, the same order:

```js
// SimulationEngine, straight after the pension's own growth, where the fixed-rate line is now
if (config.isaMix && isa > 0) { /* unchanged */ }
else if (config.isaGrowth === 'cash') { if (isa > 0) isa = isa * fC; }
else if (config.isaGrowth === 'invested') { if (isa > 0) isa = isa * (wE * fE + wB * fB + wC * fC); }   // wE/wB after glideShare
else { isa = applyIsaGrowthMonthly(isa, config.isaReturn ?? ISA_DEFAULTS.RETURN); }
```

In `fastEngine.runFast`, `fE = pf.mEq[year]`, `fB = pf.mBond[month]`, `fC = pf.mCash[year]`. These are the same doubles
`simulate` computes, so the identity test holds bit for bit. A scratch copy of `simulate` with exactly this block ran
the four plans of section 7. The fast path change itself is to be proved by `speed.identity` on the build (R2).

### 3.3 Where it is stored, and the locked rule

- **Stored**: `stressTool.settings.isaGrowth` only. Never in the Decision settings, so `decisionSettingsChecksum` cannot
  move. `seedDecisionFromStress` (`ScenarioRepository.js:211`) copies a fixed list of keys and must not gain it (a test
  pins this). `seedStressFromDecision` (`:148`) spreads the current Stress settings, so the plan's own value survives.
- **Written** (always `'cash'` unless the person or the answer chose otherwise):
  - `getDefaultScenario` (`ScenarioRepository.js:309-330`), beside `chargesPct`. That covers "+ New plan", the set-up
    wizard, the partner plan, the demo and guest plans and the V7 seed's starting plan;
  - `resetStressSettings` (`StressRepository.js:323-333`);
  - `getActiveStressSettings` (`ScenarioRepository.js:635-641`), the unlocked fallback;
  - the V7 seed (`PlanSeed.js`), from the answer's own choice;
  - an unlocked copy of a plan with no setting (`duplicateScenario`, `:536-546`). Charges (D7) wrote the original's
    effective 0% so the copy reproduces it. Here the original's effective rule (a fixed 3%) is not one of the two
    choices, and the owner has called it wrong. So the copy is treated as a new plan and gets `'cash'` (owner D3);
  - unlock (`index.html` `unlockDecisionSettings`, `:13070-13095`). A plan with no setting gets `'cash'`, and the
    unlock list says so (owner D4). One module function, `unlockPatchesOf(stressSettings)`, returns the charge and the
    ISA patches together, replacing the inline `chargesPatchOnUnlock` call on the same line, so the script does not
    grow.
- **Never written**: `getDefaultStressSettings` (`stressDefaults.js:16`) and `getDefaultStressDB`. Both are merged
  under stored plans (`migrateStressDB`, `StressRepository.js:215`), so a default there reaches every locked plan.

### 3.4 The migration (schemaVersion 2 → 3)

`src/storage/schema.js`: `SCHEMA_VERSION = 3`; append to `MIGRATIONS` (`migrations.js:148-151`):

```js
/**
 * 2 → 3 (6.22.0). How ISAs and savings grow (research/saver-lock-and-savings-growth.md §3): an UNLOCKED plan is given
 * "Mostly cash" (`isaGrowth: 'cash'`) in its Stress settings. A LOCKED plan is not touched at all: it has no setting,
 * which every engine reads as today's fixed 3%, until it is unlocked (unlock then writes 'cash').
 *  - A valid choice already saved is kept; anything else is replaced by 'cash'.
 *  - A plan with no Stress settings is left without them (the unlocked reader gives the default).
 *  - A plan whose fund list holds ISA funds gets 'cash' too: those funds still decide its ISA (config.isaMix wins).
 * Only the Stress settings are written, so decisionSettingsChecksum cannot move on any plan.
 */
function toV3(s) {
  if (planLocked(s)) return s;
  const st = isObj(s.stressTool) && isObj(s.stressTool.settings) ? s.stressTool.settings : null;
  if (!st) return s;
  if (!isIsaGrowth(st.isaGrowth)) st.isaGrowth = DEFAULT_ISA_GROWTH;
  return s;
}
// { to: 3, name: 'How ISAs and savings grow: "Mostly cash" written into every unlocked plan; locked plans untouched', up: toV3 }
```

The framework already refuses any step that changes a locked plan's Stress settings (from step 2,
`LOCKED_STRESS_GUARD_FROM`), its plan document, archives, history, or the Decision settings of a plan with records. It
runs on every read path that calls `upgradeScenario` (signed-in load, guest load, plan creation).
`accumulation.isaMonthly` is **not** written: no setting means nothing paid in, which is what the plan said before.

### 3.5 Today's planner: screens and words

- **Stress tester → Settings → Your allocation**, straight under "How the ISA is used" (`ssIsaPolicy`,
  `index.html:3343-3347`). Two radio buttons in the markup (markup is not counted by the ratchet):

  > **How your ISA and savings grow**
  > ( ) **Mostly cash** — like cash: by last year's rise in prices, less 1% a year, never below nothing. For cash ISAs,
  > savings accounts and money-market funds.
  > ( ) **Invested like my pension** — the same mix of shares, bonds and cash as your pension, in the same futures. For a
  > stocks and shares ISA held like your pension.
  > *Used by Pots & Valves and Buckets in order. The other strategies spend the ISA as part of their own pot.*

  Two other states replace the buttons with a line, worked out by `isaGrowthFieldState(settings, { locked, isaFunds })`
  in a new `src/ui/isaGrowthSetting.js` (index.html calls it beside `paintChargesField`; no new script lines beyond the
  call):
  - locked with no setting: "A fixed 3% a year (this plan was locked before this choice was added; unlock to change)";
  - ISA funds in the fund list: "Follows the ISA funds in your list of funds to test".
- **Load and save**: `loadStressSettings` (`:11240`, beside `ssIsaPolicy`) and `saveStressSettingsUI` (`:11361`, on the
  same object literal as `chargesPct`) through `isaGrowthForSave(value, current)`. The form is disabled while locked.
- **The line above Monte Carlo, History and Scenarios** (`src/ui/startingPotsWords.js:50`): add
  `isaGrowthRunLine(settings, { locked })`, for example "Your ISA grows like cash (last year's rise in prices, less 1%)."
- **Strategies → Background → Assumptions & data** (`index.html:9988`): the ISA row reads the plan's choice from a
  module function instead of `ISA_DEFAULTS.RETURN`.
- **Accumulation planner**: a new box "Into ISAs and savings (£ a month)" (`acIsaMonthly`) beside the pension
  contributions; `readAccumulationInputs` (`:10898-10909`) reads it; the projection gains an "ISA and savings" line
  (section 2c). The projection table's HTML moves into `src/ui/accumulationProjection.js` first, so the script shrinks.
- **Plan document**: `assumptions.isaGrowth` on new documents. An older document without it reads "ISA: grew at a fixed
  3% a year (this plan was locked before the choice was added)". Stored documents are never rewritten.

### 3.6 V7: placement, words, carrying and the seed

- **Field**, in all three schemas straight after `savings`, in the savings box's own group (C and B: "Add more detail";
  A: the short form):
  `{ path: 'isaGrowth', type: 'choice', options: ['cash', 'invested'], default: 'cash', group: <the savings box's> }`.
  It shows once the savings box holds a figure above £0 (or money goes into savings each month); otherwise it is hidden
  and its default stands. It has a default, so it never counts as an input in the first-answer budgets.
- **Words** (`src/v7/copy/{a,b,c}.js`):
  - label "How your savings grow";
  - options "Mostly cash" / "Invested like my pension";
  - option help "they grow by about last year's rise in prices, less 1%" / "the same mix as your pension, in the same
    futures".
- **What was assumed** (one line, id `savings-growth`, field `isaGrowth`, with Change):
  - cash: "Your savings are treated as ISA money: tax-free to take. They grow like cash, by last year's rise in prices
    less 1% a year, never below nothing.";
  - invested: "Your savings are treated as ISA money: tax-free to take. They are invested like your pension: the same
    mix, in the same futures."
- **The warning** `savings-fixed-growth` (A, B) becomes `savings-mostly-cash`, as information, shown only when most of
  the money at the stop is savings and the choice is cash: "Most of the money when you stop is in savings, and they are
  treated as mostly cash, which only just keeps up with prices. If yours are invested, choose 'Invested like my
  pension' under the savings box." D's planned `d-savings-cash` warning (answer-D.md §2.2) is no longer needed.
- **Both phases.** The choice applies while saving and while drawing (owner D1). "Invested" while saving keeps today's
  arithmetic exactly (the saving mix and its slide). "Cash" while saving is new.
- **Carried** C ↔ A ↔ B (`carry.js` `HOUSEHOLD`), and C's hand-over sameness rule needs nothing new because C asks it.
- **Saved into the plan seed**: through the seed's checked inputs; `seedToScenario` writes `S.isaGrowth`.
- **Banned words** (`copy/banned.js`): nothing in these words is on the list; the wording test runs them.

### 3.7 The parity ledger (`tests/v7/parity/ledger.json`)

- Row `pots.isa-growth`: add the key `stress.isaGrowth`; status **built** (files `src/services/IsaGrowth.js`,
  `src/answers/shared/schemaParts.js` or the three schemas, `src/answers/shared/saving.js`,
  `src/answers/shared/toEngine.js`), step `done`, with the note "One choice under the savings box: 'Mostly cash' or
  'Invested like my pension', in both apps; a plan locked before it keeps a fixed 3%."
- New row `save.isa-pay-in` ("What goes into ISAs and savings each month"), key `accumulation.isaMonthly`, **built**
  (`src/answers/shared/schemaParts.js`: `savingsIn`).
- Row for the saving path and monthly pot record (audit §4 "Saving path and monthly pot record"): its note says new
  locks draw the path on V7's engine (step `s2-saver-reading`).
- Run `node tests/v7/parity/write-md.mjs` so research/v7/parity-ledger.md matches. The ledger gate fails first when the
  two keys appear, which is the test-first order for this part.

---

## 4. Design (A): the saver's locked plan

### 4.1 Documents already locked (version 2 and older): the reading is fixed, the document is not touched

What they hold: `accumulation.path` rows (pension only) of `projectAccumulation` at the FCA 2/5/8% nominal rates,
**deflated by exactly 2.5% a year** (`assumedCpi` default, `AccumulationEngine.js:139, 166`), plus `potMix` when
holdings were tagged. `whereAmI` (`PlanDocument.js:536-550`) reads it with three faults:

| Fault | Today | Fix (display only) |
|---|---|---|
| The pot's pounds | Compares the recorded pot (pounds of its month) with the path (pounds of the day it was drawn). After ten years at 2.5% a pot exactly on the projection reads about 28% ahead | `saverPrices(doc, at)`: the factor `1.025^(years from the path's start to the record's month)`. The pot is divided by it. 2.5% is not a guess here: it is the exact rate the path was deflated with, so this compares the pot with the FCA projection in the same pounds. Any other rate (6.20.1's 4% for retired people) would put an exactly-on-course pot behind by construction. |
| The clock | `lockedAt` (the first lock), and "now" is `today` | The path's own start: `doc.createdAt` (a refreshed document, and one created after an old lock, start from their own day). The path is read at the **record's** month, not today (6.20.1 reads the band at the pot's month for the same reason). |
| The accounts | Pension against the pension path | Kept: both sides are pension, so like with like. The words add "This path was drawn before ISAs were counted: it follows your pension only." |

The words say the prices too: "Pension pot £340,000 (recorded March 2029), which is £322,000 in the prices of July 2026,
when this path was drawn (prices assumed to rise 2.5% a year, as the path does), against £318,000 on the locked path:
on or above the locked path."

### 4.2 New locks (plan document version 3): the path on V7's saving-years engine

`PLAN_DOCUMENT_VERSION = 3`. `buildAccumulationPath` keeps the version 2 builder for reading old documents and gains a
version 3 builder in a new pure module, `src/services/SavingPath.js`:

- **The people and pots.** One person (each partner's plan is its own). Pension today: the SIPP lines under What you
  hold, else the Accumulation planner's pot today, else none (then the gap is recorded as today, `potNow: null`). ISA
  today: the ISA lines under What you hold, else the Stress settings' `isaBalance`.
- **What goes in.** Pension: `contributionBreakdown(...).totalMonthly` (gross, with the employer's). ISA:
  `accumulation.isaMonthly`. Both rise by the planner's "Raise contributions by (%/yr)", as pounds of the day (that is
  what the box means today). See owner D6 for plans made from a V7 answer.
- **The mixes.** While saving: the holdings' mix (diversifiers counted with bonds), else the plan's allocation. At the
  stop: the plan's allocation (`equityMin : bondMin : cashTarget`). V7's slide between them over the last 10 years
  (`SAVING.slideYears`).
- **Charge and ISA growth.** The plan's `chargesPct`; the plan's `isaGrowth` (cash: the cash factor; invested: the
  saving mix, as V7 does; no setting: the fixed `isaReturn`).
- **The lives.** `livesList(1000, S + 1, { seed: 0 })` (`lives.js`): one future per life, the same lives V7's B uses.
  A plan made from a V7 answer and locked straight away is read on the same futures as its answer.
- **The arithmetic.** A new export in `saving.js`, `savingYearsByLife(plan, person, lives, { payNominal })`, running
  the same `growthOf` factors forward month by month and recording each year's end. With pay-ins that rise with prices
  it equals `potsByPerson` at the stop to 1e-9 of the pot (a test). About 1,000 × 12S multiplications: well under a
  second at lock time. `SavingPath.js` is loaded only when a plan is locked or its document refreshed (R9), and hands
  the finished path to `buildPlanDocument`, which stays pure.
- **What is stored** (plain numbers only; no typed arrays, functions or lives):
  `accumulation: { version: 3, asOf: 'YYYY-MM', lives: 1000, seed: 0, startAge, retireAge, years, potNow, isaNow,
  totalMonthly, isaMonthly, escalationPct, chargesPct, isaGrowth, mixes: { saving, drawing }, path: [{ year, age,
  nominal: { careful, middling, good }, real: { careful, middling, good }, pension: { middling }, isa: { middling },
  paidIn }] }`.
  - `careful` is the 1-in-10 bad line: the pot that 9 futures in 10 reach (`bandIndexes`, position floor(n/10)).
  - `good` is the 1-in-10 good line.
  - `nominal` is pounds of the day; `real` is the prices of `asOf`.
  - About 6 KB for a 25-year path.

**The reading.** The recorded pot is the record's pension plus its ISA (the record already keeps both:
`recordAccumulationMonth`, `index.html:8795-8808`). It is compared with `nominal` at the record's month, so no price
guess is needed: each future carries its own prices. The bands are named as the retired strip names them (6.20.1):
"below the plan's 1-in-10 bad line", "between the 1-in-10 bad line and the middle", "between the middle and the 1-in-10
good line", "above the 1-in-10 good line". A missing ISA figure, when the document counts an ISA, gives no verdict and
says "add your ISA to the monthly record", as 6.20.1 does for retired people.

Why pounds of the day here rather than "the plan's prices" (owner D5): a lives-based path has no single price path, and
any one assumed rate would misread pots in futures where prices moved differently. The approved intent, like with like,
is met without a guess. The document's own table shows the `real` lines ("today's money").

**The document shows both figures it was locked with.** "The plan was priced on £P at 60 (Timing block); on the
futures this path was drawn on, the middle pot at 60 is £M." Today's Timing block still projects at the FCA middle
rate, so the two can differ (R6).

### 4.3 "Refresh" restarts the clock

`createPlanDocumentNow` (`index.html:8513-8526`) archives the old document and writes a new one through
`buildPlanDocumentNow` (`:8466-8478`), which keeps `lockedAt` from the Decision settings. The fix is in the reader: the
clock starts at `accumulation.asOf` (version 3), else `createdAt`, else `lockedAt`. A refresh is the person's own
action, archives the old document untouched, and writes a version 3 document from today's pot.

### 4.4 The arrival check uses the same measure

`arrivalCheck` (`LifeStage.js:162-173`) today compares the pension entered in the first Decision month with
`potAtRetirement.sipp` (in the prices of the day the Timing block was saved), with no price change and no ISA.

New: `arrivalCheck(stage, doc, { sipp, isa })` calls the reading's own function, `saverReading(doc, { at: entry month,
pots })`, at the arrival month:

- version 3: pension + ISA against the path's `nominal.middling` at the stop;
- version 2: pension, in the path's prices, against the path's own line at the stop (its "your mix" line when it has
  one, else the middle line);
- no path (a plan locked with no pot on record, or before 6.7.0): `potAtRetirement` in the same way as version 2.

The rule stays: within 10% runs as locked; outside, the choice is offered. The message names the measure: "Your pension
and ISA come to £X against £Y the locked path expects at the stop (in pounds of the day)…". The caller
(`index.html:6032`) passes `{ sipp: equity + bond + cash, isa: +entryIsa }` on the same line.

### 4.5 Saver screens touched

- The strip: `whereAmIHtml` (`PlanDocumentView.js:269-277`) gets its saver sentence from a new pure
  `saverReadingText(reading)`.
- The document: section 4b (`PlanDocumentView.js:158-169`) renders version 3 as a table by age (middle, 1-in-10 bad and
  good lines, in today's money; pension and ISA middle lines; paid in). Version 2 renders exactly as today.
- The Accumulation tab's strip (`index.html:8788-8791`) and the plan document page (`whereAmINow`, `:8531-8539`) call the
  same `whereAmI`: no new lines.

---

## 5. Not in this piece (said so that nobody looks for it)

- Pricing the drawing years on V7's engine (the Timing block's projection stays FCA-based). That is E's job.
- Re-running the strategy on the pot you arrive with ("does it still last in 9 futures out of 10 on what you have?").
  It is the better arrival check, and it is heavier. Recommended as a follow-up.
- V7 opening a saved plan, and V7's own saver station (square-one §5 item 4).

---

## 6. Design (C): one bar for "on course"

`src/services/OnCourse.js`: `ON_COURSE_SHARE = 0.9`, `ON_COURSE_PCT = 90`, `ON_COURSE_WORDS = 'lasts in 9 futures out of
10'`, `isOnCourse(share)`. V7's `BAND.careful` and `1 − VERDICT.yes` are asserted equal to it.

| Where | Today | Change |
|---|---|---|
| `index.html:3741-3748` "Am I on track?" markup | "…the pot that gives **85% success**" | "Am I on course?" … "the pot that **lasts in 9 futures out of 10**" |
| `index.html:10994` loading text | "the pot that gives 85% success" | "…that lasts in 9 futures out of 10" |
| `index.html:11002` `requiredPotForSuccess(baseConfig, 0.85, 300)` | 85% | `ON_COURSE_SHARE` |
| `index.html:11003, 11008` basis notes | "for 85% Monte-Carlo success…" | "to last in 9 futures out of 10 with…" (the notes move to a module function) |
| `index.html:11005` `requiredPotForStrategy(…, 0.85)` | 85% | `ON_COURSE_SHARE` |
| `index.html:11014` | "on track ✓" | "on course ✓" |
| `AccumulationEngine.js:197` default `successTarget = 0.85` | 85% | `ON_COURSE_SHARE` |
| `stressTest.js:643` default `successTarget = 0.85` | 85% | `ON_COURSE_SHARE` |
| `index.html:3711` sweep title | "which age clears 90%?" | "which age is on course: lasts in 9 futures out of 10?" |
| `index.html:3715` "Confidence I want" 90 (default) / 85 / 75 / 95 | A picker | Kept, by the parity rule: "9 in 10 (on course)" first and default, the others as choices (owner D8) |
| `RetireSweep.js:104, 112` defaults 90; headline "with 90% confidence", "or at 58 with 75%" | Words | Default `ON_COURSE_PCT`; "you could stop at 61 and be on course (it lasted in 9 futures out of 10)"; the 75% aside reads "in 3 futures out of 4" |
| `index.html:8603` sweep colours (≥ target green, ≥ 75 amber) | — | Unchanged |
| `index.html:10718-10719, 10766` couples "Looking solid" at ≥ 85% | 85% | ≥ 90%: "On course: the money lasted for both of you in N% of 1,000 futures (9 in 10 or more)" (owner D7) |
| `index.html:10831, 10858` survivor and care checks ≥ 85% green | 85% | 90% |
| `index.html:6276, 7215` strategy verdict ≥ 90 "Very likely to last", ≥ 75 "Likely" | Already 90 | Unchanged (E gives every strategy V7's verdict words later) |
| `index.html:7171` ISA lasts the full term ≥ 80% | A different measure | Unchanged |
| `PlanSeed.js:528-529` `answerLastedWords`: 85% and up reads "in 9 futures out of 10" | Calls 85–90% "9 in 10" | Uses V7's `lastedText` (`format.js`): 85% to under 90% reads "in just under 9 futures out of 10" |
| `LifeStage.js:20`, `NextStep.js:28`, `LandingPage.js:77`, `OnboardingPage.js:153-154` | "on track"; "85% Monte-Carlo success" | "on course"; "lasts in 9 futures out of 10" |
| V7 (`rules.js` `BAND`, `VERDICT`; `copy/banned.js:217` bans "on track") | Already 9 in 10 | Asserted equal |

---

## 7. What moves, and by how much (scratch estimates; to be measured again on the build)

Measured on a scratch copy of `simulate` with the block in 3.2, 1,000 Monte Carlo futures and every history window,
0.5% charges. "Left" is the median amount left at the end in today's money.

| Plan | ISA grows | MC lasts | History lasts | MC typical left |
|---|---|---|---|---|
| Golden base (£1.2M pension, £59,450 a year, State Pension from year 5) + £200,000 ISA | fixed 3% (today) | 89.8% | 82.5% | £655,600 |
| | mostly cash | 90.3% | 87.3% | £639,900 |
| | invested like the pension | 93.4% | 100% | £808,200 |
| £500,000 pension (60/30/10) + £60,000 ISA, £30,000 a year, State Pension £12,000 from year 8 | fixed 3% | 83.5% | 76.2% | £150,800 |
| | mostly cash | 83.2% | 79.4% | £140,100 |
| | invested | 87.1% | 90.5% | £248,200 |
| £100,000 pension + £250,000 ISA, £27,000 a year, State Pension now, 27 years | fixed 3% | 84.8% | 70.4% | £49,300 |
| | mostly cash | 97.0% | 94.4% | £30,400 |
| | invested | 97.5% | 100% | £244,100 |
| the same, cuts in a slump off | fixed 3% | 43.3% | 38.0% | £0 |
| | mostly cash | 21.0% | 12.7% | £0 |
| | invested | 86.4% | 85.9% | £161,000 |

**The direction is mixed, and the release note must say so.** Cash earns more than 3% in the high-inflation futures
where bad cases are, so with cuts in a slump on, the chance of lasting often rises. It earns less on average (about 1%
a year below prices, against roughly nothing for 3% fixed), so the amount left falls, and a plan with no cuts that is
near the edge can fall sharply (43% to 21% above). "Invested" raises most figures. These are four plans. The build
measures the golden matrix, the corpus and the V7 fixtures and reports every one.

**V7 while saving** (`livesList(1000)`, balanced mix, £50,000 savings plus £300 a month, 0.5% charges, at the stop,
today's money; careful / middling):

| Years to the stop | Invested (today's V7) | Mostly cash |
|---|---|---|
| 5 | £59,500 / £77,500 | £60,000 / £66,000 |
| 15 | £99,800 / £142,500 | £87,200 / £102,800 |
| 25 | £144,200 / £228,200 | £112,900 / £138,700 |

So "Mostly cash" as V7's default lowers a long saver's savings at the stop by about a quarter to two fifths in the
middle case. B's pay-in answers rise and A's ages move later for savers with savings. Today's planner moves the same
way: `projectedPotAtRetirement` grows a £40,000 ISA over 12 years to about £54,100 at the FCA middle rate (corpus fixture 05 holds £54,126),
and to about £35,600 as cash (R3).

**Saver reading, plan corpus fixture 05** (locked July 2026, records July to September 2026): the September pot moves
from about £319,800 to £318,200 in the path's prices, and it is read at September instead of today. Its band stays "on
or above the locked path". After ten years the same fix removes a 28% overstatement.

**On course at 9 in 10**: the pot "Am I on course?" asks for rises. Typically by a few percent to about a tenth, more
for plans near the edge; to be measured on the corpus.

**Pins**
- **Do not move** (no `isaGrowth` in their configs): the stress, decision, ladder and floor-and-flex goldens; the
  existing `appPaths` entries; calibration, conservation, crossval replays, determinism; the locked corpus fixtures'
  engine figures (03–06).
- **Gain twins** (like charges): each stress golden and `appPaths` entry gains a `'cash'` and an `'invested'` twin, so
  every live path is pinned.
- **Move, each with a moved-by table**: the plan corpus snapshot for the unlocked fixtures with an ISA (after `toV3`)
  and fixture 05's saving band; V7 C, A and B fixtures, named states, `made-with.json`, `drawing-result.json`, the case
  lists (`npm run v7:cases`: one new choice), the saving-years closed forms for savings; the e2e screenshots of A's short
  form and of B's and C's "Add more detail".

---

## 8. Tests first (each written to fail before the code)

**The setting, engines**
1. `tests/IsaGrowth.test.js`: the names and default; `isaGrowthOf` (absent, null, a number, a wrong string give null);
   `isaGrowthWeights` (explicit mix wins; pots; no pension gives all cash; the bond tent splits shares and bonds);
   `isaProjectionRate` (cash at 2.5% is 1.5%; never below 0).
2. `SimulationEngine.test.js`: no `isaGrowth` is byte-identical to today on the golden matrix (whole result), with and
   without charges. `'cash'`, zero draws: the ISA after a year equals start × Π monthly(cash)^12 × chargeM^12 to 1e-9.
   `'invested'` with weights (1, 0, 0) follows the equity factor exactly. The random stream is unchanged (the pension's
   bond returns in the trace are identical with and without `isaGrowth`). `isaMix` still wins. The bond tent moves the
   ISA's split.
3. `tests/integration/conservation.test.js`: start − draws − charges + growth = end, with the trace's ISA factor, for
   both choices.
4. `tests/v7/c/speed.identity.test.js` (and the slow variant): random households carry both choices (and none);
   fixtures run at each; the closed-pension branch too. `fastEligible` refuses `'invested'` without `isaGrowthMix` and
   any other value.
5. `tests/v7/saving/*`: `'invested'` gives today's kernel bit for bit; `'cash'` savings kernel equals the closed form
   with cash factors; `savingRows` savings rows obey their trace rule; the pension kernel never depends on the choice.
6. V7 behaviour: a household with no savings and nothing paid into savings gives identical results under both
   choices; the choice is carried C ↔ A ↔ B; the schema default equals `DEFAULT_ISA_GROWTH`; `validate` refuses other
   values; the `savings-growth` sentence's text equals its parts and passes the banned-words list.
7. Strategies: Pots & Valves through `planFromSettings` carries the choice; the bought strategies' results are
   identical under both choices (their goldens).
8. Projections: `projectedPotAtRetirement` and `RetireSweep.potAtAge` with no setting equal today; with `'cash'` and
   `'invested'` the ISA follows its rule; `isaMonthly` is counted.

**Storage and the locked rule**
9. `tests/migrations.test.js`: `SCHEMA_VERSION` is 3; an unlocked plan gains `isaGrowth: 'cash'` and nothing else
   changes byte for byte; a locked plan is byte-identical (Stress settings included); a valid choice is kept, an invalid
   one replaced; twice is harmless; no Stress settings, untouched; a step that touches a locked plan's Stress settings is
   refused.
10. `ScenarioRepository` / `ScenarioSettings`: `getDefaultScenario` carries `'cash'`; `getDefaultStressSettings` and
    `getDefaultStressDB` do not; `seedDecisionFromStress` never copies it; `migrateStressDB` on a locked plan without
    the key gives no key and a config without `isaGrowth`; reset writes it; an unlocked copy of a plan without it gets
    `'cash'`, a locked copy is left alone; `unlockPatchesOf` gives both patches.
11. `DecisionSettingsChecksum.test.js`: every corpus fixture's checksum is unchanged through `upgradeScenario` to v3.
12. `planSeed.test.js` / `planSeed.v7.test.js`: a seed with `isaGrowth: 'invested'` makes a plan with it; none makes
    `'cash'`; `savingsIn` becomes `accumulation.isaMonthly`; the saving section is written when only `savingsIn` is
    above £0.
13. `createSimulationConfigFromSettings`: passes `isaGrowth` only when set; `isaReturn` unchanged.

**The saver's reading**
14. Old documents (`tests/whereAmISaver.test.js`, new): a pot exactly on the FCA projection after ten years reads "on or
    above the locked path" (today: "above the strong line"); a refreshed document reads from its own `createdAt`; the
    path is read at the record's month; the words carry the 2.5% and the month; the stored document is byte-identical
    after reading; fixture 05 keeps its band.
15. New documents (`tests/savingPath.test.js`): the same inputs give the same document; with `env.futureReturns` (flat
    prices and returns) the lines equal the closed form; with pay-ins rising with prices the stop equals V7's
    `potsByPerson` to 1e-9; the ISA and `isaMonthly` are counted; the ISA follows the choice; careful ≤ middling ≤ good
    each year; only plain JSON; under 20 KB for 45 years.
16. Reading new documents: pension + ISA on both sides; no ISA figure when the document counts one gives no verdict and
    says what to add; band words as 6.20.1's.
17. Arrival check (`tests/lifeStage.test.js`): it calls the reading at the arrival month; a pot exactly on the path at
    the stop is within; the ISA counts on version 3; version 2 stays pension-only in the path's prices; no path falls
    back to `potAtRetirement` in the same way.

**One bar**
18. `tests/onCourse.test.js`: the constant; V7's `BAND.careful` and `1 − VERDICT.yes` equal it; the two required-pot
    defaults equal it; `RetireSweep` defaults and headline words; `answerLastedWords(0.87)` says "just under 9".
19. `tests/indexMarkup.test.js`: no "85% success"; "Am I on course?"; the sweep picker's first, default option is 9 in
    10; the couples check threshold; the ISA choice exists with two values and the locked line.

**Gates**
20. The parity ledger gate fails until the two new keys have rows (this is the first test to fail).
21. `tests/v7/shellRatchet.test.js`: `MAX_LINES` lowered to the new count.
22. `tests/releases.test.js` with the 6.22.0 entry, at release.
23. Browser, guest only: V7 A, B and C with the new choice at 390 and 1280 px; A's counted first answer unchanged;
    today's planner settings with the choice; the Accumulation planner's new box. Screenshots re-approved.

---

## 9. Risks

- **R1 One default, one place.** `'cash'` in a merge-under default reaches every locked plan. Test 10 guards it.
- **R2 Bit identity.** "Invested" must be the same three products summed in the same order in both engines. A factor
  computed differently (for example `monthly(eqReturn)` recomputed in a different expression) breaks `speed.identity`.
- **R3 V7 savers move a lot.** "Mostly cash" while saving lowers savings at the stop by about a quarter to two fifths
  over 15–25 years. The owner should see the measured fixture table before release.
- **R4 Mixed direction in today's planner.** Cash protects in high-inflation futures and earns less on average. The
  release note gives both directions and examples, never "your figures fall".
- **R5 Charges on cash savings.** The 6.19.0 rule takes the plan's charge off the ISA. A bank savings account or a cash
  ISA has no fund or platform charge, so "Mostly cash" with 0.5% charges is pessimistic for them (owner D2).
- **R6 Two figures at the stop.** The Timing block prices the plan at the FCA middle rate; the version 3 path is drawn
  on V7's lives. They can differ by several percent. The document shows both, and the arrival check reads the path.
- **R7 Saved pots at retirement.** A saved `potAtRetirement` is not recomputed on migration. An unlocked retire-later
  plan's ISA at retirement changes only when its Timing block is next saved. The release note's actions say so.
- **R8 Plans made from a V7 answer.** V7 assumed pay-ins rise with prices; the plan it makes raises them by 0% a year.
  Today's FCA path and the new path both under-count those pay-ins (owner D6).
- **R9 Bundle and time.** Today's app imports nothing from `src/answers` (checked: no import in `src/services`,
  `src/storage`, `src/ui`, `src/workers` or index.html). `SavingPath.js` would be the first. So `PlanDocument` must not
  import it statically: the lock and refresh load it with `await import(...)` (Vite gives it its own chunk), and pass the
  finished path into `buildPlanDocument`. That keeps `PlanDocument` pure and the main bundle as it is. 1,000 lives at
  lock take roughly a tenth of a second. The architecture rule (answers never import storage or ui) is not touched:
  this is a service importing an answer module, which no rule forbids, but it is new and should be named in
  architecture.md §3.1.
- **R10 Old documents stay pension-only.** Their reading is right, not complete. Refreshing (which archives the old
  one) gives a version 3 path.
- **R11 Nominal reading on new documents.** It needs no price guess, but neither measure can see a real loss of buying
  power when prices outrun the futures. The words say "in pounds of the day".
- **R12 A higher bar.** "Am I on course?" asks for a bigger pot; some savers move from "on track ✓" to "short by £X".
- **R13 Couples.** A locked partner (fixed 3%) and an unlocked one (cash) are each right for their own plan.
- **R14 ISA funds in a fund list.** Their tagged mix still decides; a migration writes `'cash'` that is not used while
  the funds are listed.
- **R15 Diversifiers and the reserve** are left out of "invested". Said in the help.
- **R16 Document size and the archive.** About 6 KB per version 3 document, kept in every archived copy.
- **R17 The script ratchet.** The Accumulation planner gains a box and a line. The projection table moves into a module
  first, so the script ends shorter.

---

## 10. Decisions for the owner (each with a recommendation)

- **D1 V7 while saving.** Should the choice apply while saving as well as while drawing? *Recommend yes*: the same money
  is held the same way before and after the stop. It moves V7 savers' answers (R3).
- **D2 Charges on "Mostly cash".** *Recommend keep* the one charge rule (money-market funds in an ISA do charge; slightly
  pessimistic). The other way: no charge on the ISA when it is "Mostly cash".
- **D3 Copies of a plan locked before the choice.** *Recommend* "Mostly cash" (a copy is a new, unlocked plan). The
  other way: keep the original's fixed 3% on the copy.
- **D4 Unlock.** *Recommend* writing "Mostly cash" on unlock, and saying so in the unlock list, as charges do.
- **D5 New saver documents read in pounds of the day.** *Recommend yes* (no price guess). The other way: the plan's
  prices at an assumed 2.5% a year, as old documents.
- **D6 Pay-ins on plans made from V7.** *Recommend* the seed writes "Raise contributions by" 2.5% (the planner's own
  price assumption), so the plan pays in roughly what the answer assumed. The exact way is a new "rise with prices"
  choice on the Accumulation planner, at the cost of a new setting.
- **D7 Couples checks at 9 in 10.** *Recommend yes*: they are verdicts on whether the money lasts.
- **D8 The sweep's picker.** *Recommend keep* the other confidence levels as choices (parity), with 9 in 10 first.
- **D9 Version.** 6.22.0, a minor release, so the note pops up once. `ENGINE_VERSION = '6.22.0'`.

---

## 11. Draft release note (for `src/releases.js`; not added)

```js
{
  version: '6.22.0', date: '2026-10-__', engineVersion: '6.22.0',
  title: 'Choose how your ISA grows; a locked saver\'s plan reads true; one bar for "on course"',
  summary: 'Until now every ISA grew at a fixed 3% a year, whatever prices did. Each plan now says how its ISA and savings grow: "Mostly cash" (the default), which grows like the cash in your pension, by last year\'s rise in prices less 1%, or "Invested like my pension", which follows your pension\'s mix in the same futures. A plan you locked earlier keeps its figures. If you locked your plan while still saving, the monthly reading now compares like with like: your pot is put into the path\'s own prices, refreshing the plan document starts its path again, and plans locked from now on count your ISA and what you pay into it. "On course" now means the money lasts in 9 futures out of 10 everywhere.',
  changes: [
    'Stress tester → Settings → Your allocation: "How your ISA and savings grow", with two choices. "Mostly cash" suits cash ISAs, savings accounts and money-market funds; "Invested like my pension" suits a stocks and shares ISA held like your pension. Pots & Valves and Buckets in order use it; the other strategies spend the ISA as part of their own pot, so it does not change them.',
    'Accumulation planner: a new box, "Into ISAs and savings (£ a month)", and a line for your ISA in the projection. The pots at retirement in the Timing block and the "When could I retire?" spin count it.',
    'A plan locked from now on while you are still saving draws its saving path on the preview\'s saving-years engine: 1,000 futures, with a middle line and the 1-in-10 bad and good lines, counting your pension and your ISA and what goes into each.',
    '"Am I on track?" is now "Am I on course?", and looks for the pot that lasts in 9 futures out of 10.',
    'Preview at /v7/: the same choice under the savings box in all three questions, carried between them and into a plan you save.'
  ],
  corrections: [
    'ISAs and savings grew at a fixed 3% a year whatever prices did. In a future where prices rise 8% a year, where bad cases are, that lost about 5% a year of buying power; where prices rise 1%, it beat cash. With "Mostly cash" the chance of lasting can go up or down: in our tests it went from 85% to 97% for someone with a large ISA and cuts in a slump, and from 43% to 21% for the same plan with no cuts. The amount typically left usually falls a little. With "Invested like my pension" most figures rise.',
    'A locked plan read while still saving compared your pot, in today\'s pounds, with a path in the pounds of the day it was locked. After ten years a pot exactly on course read about 28% ahead, and the arrival check could offer to unlock and re-plan. Your pot is now put into the path\'s own prices, the 2.5% a year it was drawn with, and read at the month you recorded it.',
    'Refreshing the plan document drew a new path from your pot that day, but the reading still counted from the first lock, so you looked behind. It now counts from the document\'s own day.',
    '"On track" meant lasting in 85% of futures on the Accumulation planner and 90% in the age spin, while the preview used 9 in 10. All now use 9 in 10, so "Am I on course?" asks for a somewhat bigger pot than before.'
  ],
  effects: {
    budget: [],
    stress: [
      'Unlocked plans: the ISA grows like cash unless you choose "Invested like my pension". The chance of lasting may rise or fall, and the amount left usually falls a little.',
      'Plans already locked: unchanged. The setting reads "A fixed 3% a year (this plan was locked before this choice was added; unlock to change)".'
    ],
    strategies: ['Pots & Valves and Buckets in order move with the ISA. The ladder and floor strategies are unchanged: they spend the ISA as part of their own pot.'],
    decision: [
      'Months already recorded do not change.',
      'If you locked while still saving, the first month after you stop compares your pot with the locked path in the same pounds, and counts your ISA on plans locked from 6.22.0.'
    ],
    accumulation: [
      '"Am I on course?" looks for the pot that lasts in 9 futures out of 10 (it used 85%), so it may now say you are short.',
      'The monthly reading against a locked path is in the same prices as the path, and is read at the month you recorded.',
      'Pots at retirement saved in the Timing block change only when you next save the Timing block.'
    ],
    household: ['The couples, survivor and care checks call a plan solid from 9 futures in 10 (it was 85%). Each partner\'s plan uses its own ISA setting.']
  },
  actions: [
    'Check "How your ISA and savings grow" in Stress tester → Settings: choose "Invested like my pension" if your ISA is invested.',
    'If you are still saving, enter what you pay into ISAs each month on the Accumulation planner, and save the Timing block.',
    'If you locked your plan while saving and want the new path, which counts your ISA, refresh the plan document. The old one is kept under previous versions.'
  ],
  notes: [
    '"Mostly cash" is the same rule as the cash in your pension: last year\'s rise in prices less 1%, never below nothing. "Invested like my pension" uses your pension\'s shares, bonds and cash in the same futures, with no separate draw of its own; your diversifiers and reserve are not part of it.',
    'An ISA made of the ISA funds in your list of funds to test still follows those funds.',
    'The plan\'s fund and platform charge still comes off the ISA either way.',
    'Saved plans: schema version 3. Every unlocked plan is given "Mostly cash"; a locked plan is not touched and keeps a fixed 3% until it is unlocked. Plan documents: version 3 for plans locked from now on; earlier documents are never rewritten.',
    'Engine version 6.22.0: the ISA\'s growth changed (it changes a result only when the plan has the setting).'
  ],
  affects: (scenario) => { /* locked with no setting: kept at 3%; 'cash' with an ISA: "now grows like cash"; 'invested': "follows your pension's mix"; a locked saver with a document: "the monthly reading now…" */ }
}
```

---

## 12. Build order (packages)

1. Ledger rows and `IsaGrowth.js` / `OnCourse.js` with their tests (gates 1, 18, 20).
2. Engines: `simulate`, `fastEngine`, config builder; identity and conservation tests; golden twins.
3. Storage: migration v3, defaults, copies, unlock; tests 9-13.
4. V7: field, household, saving kernel, toEngine, sentences, copy, carry, seed; fixtures re-pinned with moved-by.
5. Today's planner screens: the setting, run line, Assumptions row, Accumulation planner box and line (module first,
   ratchet lowered).
6. Saver: `saverReading` for old documents, arrival check, refresh clock; then `SavingPath.js` and document version 3;
   tests 14-17.
7. One bar: words and thresholds; tests 18-19.
8. Measure everything in section 7 on the build, write the moved-by tables, finish the release note.

---

## 13. Review of the build (2 Oct 2026): four fixes

Tests: `tests/isaAtRetirement.test.js` (1–3) and the last block of `tests/saverLock.test.js` (4), each written to fail first.

1. **No ISA today, money going into one.** The Timing block and the age spin counted the pay-ins, but every run started
   with an ISA of £0: `potScaleOf` can only scale an ISA above £0. `PlanTiming.isaAtRetirementOf(settings)` is now the
   ISA a run starts from — today's ISA × the scale, or, with no ISA today, `potAtRetirement.isa` itself — in
   `createSimulationConfigFromSettings`, in `planFromSettings` when a SIPP total is pinned with no ISA total, in the spin
   (`RetireSweep.sweepPlanAt`, exported so the tests see what the spin runs) and in the line above the runs. Only on a
   plan with the ISA choice: a plan locked before it keeps its figures (an ISA at retirement typed in the boxes with no ISA
   today was ignored then too, and still is on such a plan).
2. **A plan made from a V7 answer with no savings today.** The seed wrote V7's savings at the stop into `isaBalance` as a
   stand-in for today's (Q10), and the new readers then added the pay-ins again (+42% on B4-before-57; the saving path
   started the ISA at £71,476 for a saver holding £0, so a pot on course read below the bad line). The seed now writes
   `isaBalance: p.savings.today` (the pension's stand-in stays: its mix is three pots), and the savings at the stop stay the
   ISA at retirement; with fix 1 the runs start from the very same ISA as before. A plan saved that way by 6.15–6.21 is put
   right by the schemaVersion 3 step (`migrations.seededIsaStandIn`: unlocked, untouched since — the answer's £0 today,
   `potAtRetirement` still the answer's 'override', the ISA box still the stand-in). The two readers that take today's ISA
   as the ISA a retire-later plan starts with — the Stress tester's Drawdown table and the couples' allowance nudge — read
   `PotsAtRetirement.isaTodayOrAtRetirement`, so they see what they saw with the stand-in. (`sippTodayOf`, `potScaleOf`
   and `isaAtRetirementOf` moved to the light `src/services/PotsAtRetirement.js`, re-exported by PlanTiming.)
3. **An ISA of ISA funds in the list of funds to test.** The runs follow those funds and the choice is hidden behind
   their line, but the projections used the hidden "Mostly cash" (−34% on a shares ISA). `PlanTiming.isaProjectionOf`
   now gives one rule for the Timing block, the Accumulation column and the spin: with the funds deciding, the line used
   before the choice (6.21.0's figures) with the pay-ins. A saver's path grows that ISA at the funds' own mix on the same
   futures (`IsaFunds.isaFundsSavingMix`; a `savingsMix` option on V7's `savingYearsByLife`, absent = unchanged), stored as
   `isaFromFunds` and `isaMix`. `deriveIsaMix` and `isaFundsDecide` moved to `src/services/IsaFunds.js` (kept by name
   where they were).
4. **A blank ISA box was saved as £0.** On a path that counts an ISA, a pension exactly on course read "below the 1-in-10
   bad line", and the arrival check could offer to unlock. The monthly record now goes through
   `SaverReading.potRecordOf`: a blank ISA box is `isa: null`, a typed figure (£0 included) is marked `isaEntered: true`,
   and the table shows a dash. A record saved before 6.22.0 holds £0 for a blank box, so its £0 is read as no figure
   (`recordIsaOf`, on the table and in the strip alike) and the strip asks for the ISA. The arrival check reads the Decision ISA box as it stands; with no ISA
   figure above £0 (blank, or left at £0, which in that box means "use the tax year's ISA set-up") it sets the pension
   against the path's own pension middle line (`v3PensionLineAt`) and says the ISA is left out.
