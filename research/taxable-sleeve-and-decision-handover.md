# Taxable sleeve (GIA) — what shipped, and what the Decision tool still needs

Written 6 Sep 2026. Stress Tester side is DONE and deployed. The Decision tool side is NOT
started — this file is the handover for that work.

## 1. Why any of this exists

A lump sum in retirement (downsizing, inheritance, maturing policy) **cannot legally be put in a
pension or an ISA at any useful speed**:

| Route | Limit |
|---|---|
| ISA | **£20,000 / yr** |
| SIPP | the LOWER of: 100% of relevant UK earnings (floor **£3,600 gross**), and the annual allowance — **£10,000 (MPAA)** once a DC pension has been flexibly accessed, else £60,000 |
| Everything else | has to sit **unwrapped and taxable** (a GIA) |

**The MPAA is the binding cap for essentially every user of this app**: a drawdown plan has by
definition flexibly accessed, so £10,000 applies, not £60,000. `mpaaTriggered` therefore defaults
to `true`. (`ACCUMULATION_RULES.MPAA` in AccumulationEngine.js already had this — reuse it.)

Worked example, £100k lump sum:

| Person | ISA | SIPP | Taxable |
|---|---|---|---|
| Retired, no earnings | £20,000 | £3,600 | **£76,400** |
| Retired, £30k earnings | £20,000 | £10,000 | **£70,000** |
| Not yet flexibly accessed, £30k earnings | £20,000 | £30,000 | £50,000 |

Before this work the app had **no wrapper that could hold the balance**, so windfalls were dropped
straight into the SIPP pots or the ISA and compounded tax-free. That overstated outcomes for
anyone who entered one.

## 2. What shipped (Stress Tester)

**`src/services/TaxableSleeve.js`** (new, 16 tests in `tests/TaxableSleeve.test.js`)
- `newSleeve(value, mix)` — `mix` is `{ equity, bond, gilt, cash }` shares. Tracks `value` and
  `basis` (cost) separately; growth raises value, never basis — that is where the gain accrues.
- `sleeveIncome` / `incomeTaxOnSleeve(sleeve, band)` — dividends taxed above the £500 allowance
  (8.75%/33.75%), savings income above £1,000/£500 (20%/40%).
- `withdrawFromSleeve(sleeve, amount, band, cgtUsed)` — sells a pro-rata slice, CGT above the
  £3,000 exemption (18%/24%), returns `{ taken, cgt, net, cgtUsed }`.
- `bedAndIsa(sleeve, allowance, band, cgtUsed)` — moves up to £20k out, realising CGT.
- `sippRoomFor({ relevantEarnings, mpaaTriggered })`, `shelterLumpSum(amount, opts)`.
- **GILTS ARE CGT-EXEMPT.** `withdrawFromSleeve` multiplies the chargeable gain by
  `1 - mix.gilt`. This is the whole reason tax is modelled rather than approximated with a flat
  drag: a GIA gilt ladder is near tax-free (tiny coupon, CGT-free uplift) while a GIA equity
  portfolio is not. A flat haircut gets this backwards.

**`src/services/SimulationEngine.js`**
- `const gia = newSleeve(config.taxableStart, config.taxableMix)` alongside the ISA.
- Windfalls now route through `shelterLumpSum` — ISA / SIPP / GIA by the real limits. `toIsa`
  now means "use the ISA allowance" (default on), not "put all of it in an ISA".
- Sleeve grows monthly at **its own mix** (not the SIPP's), pays income tax annually, optionally
  beds-and-ISAs £20k/yr (`config.bedAndIsa`, default true).
- **Draw order: GIA first, ISA last** — least tax-efficient money first. `giaRescue` sits just
  before `isaRescue`, net of CGT.
- Counted in `potByYear`, `total`, `finalNominal`.

**`src/storage/StressRepository.js`** — new config keys: `taxableStart`, `taxableMix`,
`giaTaxBand` ('basic'|'higher'), `bedAndIsa` (default true), `relevantEarnings`.

**index.html** — windfall editor shows `windfallSplitNote()`: what actually lands where, per
windfall, instead of a tickbox implying £100k could go into an ISA.

**Golden hashes** — ONE regenerated in `tests/integration/fixtures/appPaths.sha.json`:
`db-floor-schedule-divers`, the only path with a windfall. The other two are byte-identical,
which is the evidence the change is correctly scoped. Anyone without a windfall sees no change.

## 3. NOT DONE — the Decision tool work

### 3a. The Decision tool has no GIA at all
- Monthly entry form (`index.html` ~2250-2295) has Equity / Bond / Cash / ISA / Diversifiers.
  Needs a **GIA balance** field (and it should be hidden for contract-ladder plans in the same
  way `applyDecisionStrategyMode()` hides Equity/Diversifiers — see CONTRACT_IDS).
- `src/services/legacyDecision.js` does not know the wrapper exists.

### 3b. Sourcing and tax — the real work
`planSourcing()` / `planSourcingOrdered()` (`src/services/WithdrawalSourcing.js`) decide which
SIPP pot pays. The GIA is a **different wrapper**, not another pot, and the tax treatment is the
point:
- A GIA withdrawal is **mostly not taxable income** — only the realised gain is chargeable, and
  only above the £3,000 exemption; gilts are exempt entirely.
- So drawing £10k from a GIA does **not** fill the personal allowance or basic-rate band the way
  a £10k SIPP draw does. `legacyDecision`'s band-filling maths (`other`, `BRL` headroom,
  `projectedAnnualTaxable`) must treat GIA draws separately or it will wrongly conclude the
  bands are full.
- Recommended order to mirror the Stress engine: **GIA → SIPP (to fill bands) → ISA**.

### 3c. Cost-basis persistence
The Stress engine holds `basis` in memory for a run. The Decision tool is longitudinal — basis
has to **persist between months and years** (a saved field on the decision settings or a
per-year record), or CGT can't be computed. This is the main new storage requirement.

### 3d. Annual CGT exemption is a TAX-YEAR thing
`cgtUsed` resets each tax year. The Decision tool already has tax-year config
(`getTaxYearConfigAsync`) — the £3,000 exemption used to date belongs there, alongside `other`.
Consider surfacing "CGT allowance used this year" in the tax-year wizard.

### 3e. Seeding
`seedDecisionFromStress()` (`src/storage/ScenarioRepository.js`) must copy the new keys —
`taxableStart`, `taxableMix`, `giaTaxBand`, `bedAndIsa`, `relevantEarnings` — the same way it
now copies `strategyId`/`strategyParams`/income shape. It is currently an explicit field list, so
they will be silently dropped until added. (This is exactly the D1 bug from the 30 Aug audit.)

## 4. Also still open (found, not fixed)

- **Ladder strategies ignore windfalls entirely.** `lumpyByYear` handles `extraIncomes` and
  `extraWithdrawals` but not `windfalls`; `stressTest.js` / `compareRunner.js` /
  `GiltLadderPlan.js` never see them. So one-off SPENDS are modelled in ladders but one-off
  RECEIPTS are not — which biases the ranked comparison against every ladder strategy. Now that
  there is a correct place to put the money this is a much smaller job: make the windfall
  available to `availablePot` from its year and let the builder buy the extra rungs.
- **No GIA input in Stress settings UI.** `taxableStart` is wired through the config but there is
  no field for someone who already holds a GIA today — only windfalls create one.

## 5. Rules reference (so the next session does not re-derive it)
ISA £20,000/yr · MPAA £10,000 · Annual Allowance £60,000 · relief floor £3,600 gross ·
dividend allowance £500 (8.75% / 33.75%) · savings allowance £1,000 basic / £500 higher ·
CGT exemption £3,000 (18% / 24%) · **UK gilts are exempt from CGT** (coupon taxable as income).
