# Asset-class sub-modelling — capital-market assumptions research

**Status: COMPLETE.** This document consolidates the deep-research done for the asset-class
sub-modelling phase (the "Diversifiers" 4th bucket + per-sub-class return / yield / vol /
correlation profiles). It supersedes the scattered workflow runs — **this research does not
need to be re-run.**

- **Purpose:** ground the tool's forward return/vol/correlation assumptions for UK/sterling
  decumulation in established, citable sources — FCA-regulated figures where they exist, and
  current (2025/2026) market CMAs otherwise.
- **Provenance:** two deep-research workflow passes plus re-verification —
  `wf_3248f0c1-615` (Pass 1, crisis hedges), `wf_2998bea2-403` (Pass 2, UK fixed income),
  and verify run `wha44db3h`. Raw agent transcripts and downloaded primary sources
  (BlackRock CMA spreadsheet, FCA COBS-13 + PwC PDFs, BoE gilt-crisis paper, Vanguard,
  DMO/linker yields) live in the previous session's scratchpad.
- **Verification note:** the FCA/regulated figures below are triple-voted CONFIRMED
  (3-0 / 2-0). Several current-market figures show as "unverified" in the raw output only
  because the re-verification voters *errored out on the session rate limit*
  (`erroredVotes: 3, validVotes: 0`) — **not** because they were refuted. They are sourced
  from strong primaries (Vanguard CMM, DMO/dividenddata, TradingEconomics, BoE) and flagged
  below as "market data — re-verify before relying for advice".

---

## 1. Decision (what the model should use)

Per the user's stated preference — **most accurate, slightly pessimistic** — and confirmed
2026-07-11:

1. **Central case = current forward CMAs** (BlackRock / JPM / Vanguard, ~4–6% nominal gilts).
2. **Conservative/regulated option = FCA prescribed rates** (offer as a togglable mode).
3. **Cash stays at the FCA −1% real** assumption — this research *validated* the existing
   cash model (`cash = max(0, prevInflation − 1%)`).
4. **Model short vs. long gilts as SEPARATE sub-classes** — their crisis behaviour is
   completely different (see §4).
5. **Add a 4th bucket "Diversifiers"** (gold + long treasuries + trend/macro); keep the risk
   names (Cautious / Balanced / Adventurous) but make each a 4-way split.

**Directional 4-bucket grid** (shares / bonds / diversifiers / cash):

| Preset | Shares | Bonds | Diversifiers | Cash |
|---|---|---|---|---|
| Cautious | 30 | 45 | 12 | 13 |
| Balanced | 50 | 30 | 15 | 5 |
| Adventurous | 65 | 15 | 15 | 5 |

The diversifier sleeve (~10–20%) is **defensible but modest** — tail protection, not a free
lunch (10% gold moved a failsafe SWR ~3.58 → 3.96%). Same character as the bond tent.

---

## 2. FCA-regulated anchors (CONFIRMED, primary sources)

These are regulator-imposed **ceilings**, not expected returns — firms must use lower rates
where the underlying investments justify.

| Item | Value | Source |
|---|---|---|
| COBS-13 projection caps — **personal/stakeholder pension**, investment-linked annuities | Lower **2%** · Intermediate **5%** · Higher **8%** (nominal) | COBS 13 Annex 2 |
| COBS-13 projection caps — **all other products** | Lower **1.5%** · Intermediate **4.5%** · Higher **7.5%** | COBS 13 Annex 2 |
| Lower/higher spread rule | Always **±3%** around the intermediate | COBS 13 Annex 2 |
| Asset-class granularity | **None** — caps are by *product category*, not asset class. No per-asset volatility groups in COBS-13. | COBS 13 Annex 2 |
| **Cash / money-market — real return** | **−1.5% to −0.5% (midpoint −1%)**; nominal 1%–2% (mid ~1.5%), on a 2.5% GDP-deflator | FCA/PwC 2017 *Rates of return for FCA prescribed projections* |
| Gilts — real return (risk-free anchor) | **−1% to 0% (midpoint −0.5%)**; nominal ~2% at the time | FCA/PwC 2017 |
| £ IG corporate bonds | **+0.6% to +1% over gilts** → real 0.1%–0.5%, nominal 2.6%–3% | FCA/PwC 2017 |
| **AS TM1 / SMPI** accumulation rates (eff. 1 Oct 2023) — 4 volatility groups | **1% / 3% / 5% / 7%** nominal (groups 1–4) | FRC AS TM1; PensionsAge; Elston |

> **Key validation:** the FCA cash figure (−1% real) is *exactly* the tool's existing cash
> model. See the cash-model decision memo.

---

## 3. Current market CMAs & yields (2025/2026 — central case)

*Market data — strong primary/secondary sources; re-verify current levels before using for
advice as they move.*

| Sub-class | Nominal total return | Yield | Vol | Duration | Eq-corr |
|---|---|---|---|---|---|
| UK gilts — all-stocks | ~4.2–6.0% (Vanguard CMM: **5.0–6.0%**) | curve below | 5.6–7.8% (Vanguard **7.8%**) | ~8–9y | ~0.26 |
| UK gilts — **short 0–5y** (buffer) | ~4.2–4.4% | 4.2–4.4% | low (~2–3%) | ~2–3y | low |
| UK gilts — **long 15y+** | ~6.4% | 5.5%+ | **10.8%** | ~15y+ | ~0.20 |
| UK index-linked (long) | ~4.4–5.0% | **real 2.2–2.46%** (post-2022 reversal) | 9.6–11.2% | long | ~0.33 |
| £ IG corporate | ~5.2–5.4% | ~5%+ | 5.3–8.2% | ~6–7y | **~0.41** (half-equity) |
| Global-agg £-hedged | ~4.0–5.0% (Vanguard **4.0–5.0%**) | — | ~5.3% | — | — |
| US treasuries £-hedged | ~3.5–4.5% (Vanguard **3.5–4.5%**) | — | ~6.8% | — | — |
| Infrastructure debt | ~IG **+115bps** | high | moderate | — | low |
| Cash / MMF | ~3.4% nom (FCA −1% real) | ≈ base rate | ~0 | 0 | ~0 |

**Current UK gilt curve (10 Jul 2026, TradingEconomics):** 2y **4.23%** · 5y **4.41%** ·
10y **4.88%** · 20y **5.52%** · 30y **5.61%** — upward-sloping, long ~1.4pp over short.

**Index-linked real yields (12 Jul 2026, dividenddata):** positive across the whole curve —
~0.4% short end up to ~2.46% long end (2041 linker 2.215%, 2050/51 ~2.463%). A complete
reversal of the deeply-negative pre-2022 real yields.

**Diversifiers (Pass 1 anchors, DMS/AQR/JPM):** global equity ~7% nom / ~2% yield / 15–17%
vol; **gold** ~5.5% nom / 0% yield / 15–16% vol / eq-corr 0.01–0.31; **trend-following**
cash+3–5% / eq-corr 0.07 (−0.26 in stress); broad bonds ~4.6% nom.

---

## 4. Crisis-hedge behaviour (the actual point of the diversifier bucket)

**Ranking:** trend-following **>** gold **>** long-duration (deflation only) **>>**
credit/high-yield (equity-like — **not** a hedge).

- **Short gilts = the reliable buffer** — barely moved in 2022.
- **Long gilts CRASHED in 2022** (>100bp yield jump in days); long linkers hit hardest
  (real-yield spike crushes long-duration linker prices). **Duration is the risk, not a safe
  haven.** (BoE *Anatomy of the 2022 gilt-market crisis*.)
- **Govt bonds hedge equities ONLY in a low-inflation regime** — they rallied in the GFC /
  dot-com / Covid (UST +19.6 / +30 / +8.1%), but *fell with equities* in 1973–74 and 2022.
- **Stock-bond correlation is regime-switching** — flipped negative ~1997, positive again in
  2022. → **regime-switching correlation is ESSENTIAL**; validates the correlation overlay in
  the stress-testing roadmap.
- **Gold** near-uncorrelated (~0.01 since 1972, 0.31 over 5y); held up in 2022 when stocks
  *and* bonds both fell — but variable, not reliable.
- **Trend** = real crisis alpha but **lagged** — loses the first ~10%, pays in prolonged
  selloffs (2008/2022), useless in V-shaped 2020.
- **Unhedged US treasuries in GBP** add a currency kicker in sterling crises (GBP fell 2022),
  but that's an FX bet layered on the rate bet.

**Killed marketing over-claims:** several gold-lobby / product-seller performance claims were
refuted during verification.

---

## 5. Engine changes when this is built

- Per-asset **yield** field; **income-first draw** (income → spend → sell shortfall via
  existing band-management/protection → reinvest surplus). "Never sell in a normal year"
  *emerges* when yield ≥ target — no special mode. **Yield is for REPRESENTATION, not
  performance** (a dividend is economically a forced sale; total-return held constant, end
  pots are identical). Engineering value is in **asset diversity + correlation**, not the
  income mechanic.
- Capital return = total − yield.
- Per-sub-class return / vol / correlation wired into the MC + historical generators and the
  correlation overlay; cash model unchanged.
- **Opt-in / golden-safe; cross-validation must still hold.**
- Model short vs. long gilts separately; add the Diversifiers bucket; relabel "Cash" as
  "cash & short gilts".

---

## 6. Sources

**Primary (regulated / official):**
- FCA COBS 13 Annex 2 — https://handbook.fca.org.uk/handbook/COBS/13/Annex2.html
- FCA/PwC 2017 *Rates of return for FCA prescribed projections* — https://www.fca.org.uk/publication/research/rates-return-fca-prescribed-projections.pdf
- FRC *Actuarial Standard Technical Memorandum AS TM1* — https://www.frc.org.uk/library/standards-codes-policy/actuarial/actuarial-standard-technical-memorandum-as-tm1/
- Bank of England yield curves — https://www.bankofengland.co.uk/statistics/yield-curves
- BoE *An anatomy of the 2022 gilt-market crisis* — https://www.bankofengland.co.uk/-/media/boe/files/working-paper/2023/an-anatomy-of-the-2022-gilt-market-crisis.pdf
- UK DMO gilt market — https://www.dmo.gov.uk/data/gilt-market/
- UBS *Global Investment Returns Yearbook 2025* (DMS) — https://www.ubs.com/global/en/investment-bank/insights-and-data/2025/global-investment-returns-yearbook-2025.html
- JPM 2026 Long-Term Capital Market Assumptions — https://am.jpmorgan.com/us/en/asset-management/institutional/about-us/media/press-releases/jp-morgan-releases-2026-long-term-capital-market-assumptions/
- BlackRock Capital Market Assumptions — https://www.blackrock.com/institutions/en-us/insights/thought-leadership/capital-market-assumptions
- Vanguard *What's driving the outlook for gilt returns* (Capital Markets Model) — https://www.vanguard.co.uk/professional/insights/whats-driving-the-outlook-fo-gilt-returns
- Aviva Investors *Illiquidity premia* (2026) — https://www.avivainvestors.com/en-us/views/aiq-investment-thinking/2026/02/illiquidity-premia/

**Secondary / market data:**
- TradingEconomics UK gilt yields — https://tradingeconomics.com/united-kingdom/government-bond-yield
- dividenddata index-linked gilt yields — https://www.dividenddata.co.uk/index-linked-gilts-prices-yields.py
- PensionsAge / Elston — AS TM1 rate changes
- Barclays Equity Gilt Study — https://www.courtiers.co.uk/wp-content/uploads/2020/09/barclays-equity-gilt-study.pdf
- Cambridge JBS (DMS 125-year summary) — https://www.jbs.cam.ac.uk/2025/report-stocks-have-far-outperformed-over-the-past-125-years/
- Monevator (gilts / linkers / US treasuries explainers)
- MetLife — infrastructure debt

---

## 7. Caveats

- Pass-1 correlation anchors are **US/USD** and **unconditional** — real portfolios need the
  regime-switching overlay (eq-bond corr flips positive in inflation shocks).
- SWR uplifts from the diversifier research are single-author, in-sample.
- FCA caps are *ceilings*, not expected returns — the intermediate must reflect each asset's
  real potential.
- **Not financial advice.** Model the *structure*; do not recommend specific funds. A tool
  that picks specific funds for a retail user edges toward FCA-regulated advice → frame as
  model portfolios / educational examples.
