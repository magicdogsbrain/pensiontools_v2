# What "success" means: how careful should our answers be?

Research note, November 2026. For design of 7.8.0 and later. Not advice: PensionTools shows consequences.

**The question.** Our answers say how big a pot, or how much paid in, makes money last to the planned age. Today
"careful" means "lasts in 9 of 10 simulated futures". We want our numbers to sit where most advisers would put them,
without building in a large chance of dying with far more than the person needed.

**Our model in brief** (for the reader): historical and bootstrap futures, 0.5% a year charges, full new State
Pension by default, spending that rises with prices, to a fixed planned age. For a single person planning to 95, going from "half the futures" to "9 in 10" asks for about 38–44% more money, depending on the stop age.

---

## 1. What advisers call success

**No UK rule sets a success percentage.** The FCA's review of retirement income advice does not require cashflow
modelling. It expects firms to test whether income can last, to plan past average life expectancy, and to show the
poorer outcomes and a bad start (FCA TR24/1, 2024, paras 2.7–2.17,
https://www.fca.org.uk/publication/thematic-reviews/tr24-1.pdf). Its cashflow-modelling page asks firms to show
lower-percentile outcomes and a large early fall, and notes a 65-year-old man has a 1 in 4 chance of reaching 92. It
never names a target rate (FCA, 2024,
https://www.fca.org.uk/firms/undertaking-cashflow-modelling-demonstrate-suitability-retirement-related-advice).

The FCA gave as poor practice a report quoting "a 95% chance the fund would last until average life expectancy" with
no explanation (TR24/1, 2024, section 3, same URL). The point: a probability on its own, to an average age, is not
enough.

**What firms do.** In the FCA's survey, 276 of 962 firms had a house withdrawal rate: 45 used 3%, 199 used 4% and 32
used 5%. 409 of 956 used stochastic modelling (TR24/1, 2024, paras 1.29–1.31, URL above).

**The band in practice is about 75–90%:**

| Source | Level | Year / URL |
|---|---|---|
| MoneyGuidePro "Confidence Zone" (US software) | 75–90% (some firms 70–90%); mid-to-upper 90s read as over-saving | 2012–2024, https://foolwealth.com/insights/will-your-retirement-plan-be-successful-how-you-can-gauge-the-likelihood |
| Practitioner consensus (US) | 80–90%, "most advisers" | 2014, https://money.cnn.com/2014/10/21/retirement/monte-carlo-success-rate/ |
| Blanchett | "80% is probably the right target" | 2023, https://rpc.cfainstitute.org/blogs/enterprising-investor/2023/rethinking-outcome-metrics-for-financial-planning |
| Vanguard UK | 85% over 30 years | 2021, https://www.vanguard.co.uk/content/dam/intl/europe/documents/en/whitepapers/sustainable-spending-rates-in-turbulent-markets-uk-en-pro.pdf |
| Morningstar (US and UK) | 90% over 30 years | 2025–2026, https://global.morningstar.com/en-gb/personal-finance/is-4-still-safe-withdrawal-rate-uk-retirees-2026 |
| Adviser floor (survey cited by Kitces) | ~90% of advisers would not endorse below 70% | 2021, https://www.kitces.com/blog/monte-carlo-retirement-projection-probability-success-adjustment-minimum-odds/ |

Fidelity's UK adviser guide, written in response to TR24/1, says "a 90% probability of success over 30 years may be
overly conservative" for people with other assets, and that a 90% target "can lead people to underspend" (Fidelity
Adviser Solutions, 2026,
https://adviserservices.fidelity.co.uk/media/fnw/guides/sustainable-withdrawal-rates-for-drawdown-clients.pdf).

**Stacking.** A fixed planned age stacks caution on top of the success rate. Kitces notes that 90% over 30 years for a
65-year-old couple is about 98.2% once the chance of dying earlier is counted (Kitces.com, 2020–2023,
https://www.kitces.com/blog/monte-carlo-analysis-customize-probability-success-risk-tolerance-spending-portfolio-volatility/).
We plan to 95 by default. A 60-year-old has a 14% (men) or 23% (women) chance of reaching 95 (IFS, 2025,
https://ifs.org.uk/sites/default/files/2025-03/Individuals-challenges-managing-pensions-through-retirement-1.pdf). Our
9 in 10 to 95 is therefore more careful than an adviser's 9 in 10 to 90.

## 2. Why one success rate misleads

- **Size of the shortfall.** Pass/fail "completely ignores the magnitude of failure": being £1 short in the last
  year counts as failing. In Blanchett's example the success rate is 50% while average goal completion is 90%
  (Blanchett, 2023, URL above). Pfau prefers the shortfall in the worst 5% of futures (Pfau & Young, 2023,
  https://www.advisorperspectives.com/articles/2023/01/10/the-dangers-of-monte-carlo-simulations).
- **When it fails.** Running out at 93 is not running out at 78. Estrada and Kritzman's "coverage ratio" counts
  years paid over years planned: 0.9 means 27 of 30 years paid, 1.1 means about 3 years of spending left (2019,
  https://blog.iese.edu/jestrada/files/2019/03/TDOISR.pdf).
- **The floor.** In the UK an empty pot does not mean no income: the State Pension remains. The full new State
  Pension is £230.25 a week (£11,973 a year) in 2025/26, and two of them meet the Minimum standard for a couple
  (£21,600 in 2025) (Pensions UK, 2025, https://retirementlivingstandards.org.uk/news/2025-rls-update). With a large
  floor, "failure" means a cut, not destitution (Tharp, Kitces.com, 2021, URL above).
- **People adjust.** Kitces suggests renaming failure "probability of adjustment" (2013,
  https://www.kitces.com/blog/renaming-the-outcomes-of-a-monte-carlo-retirement-projection/). In US history, some
  real cut was needed in 96.3% of sequences even at a 95% level, and a cut of 35% or more in about 15% of them (Tharp,
  2022,
  https://www.kitces.com/blog/monte-carlo-guardrails-probability-of-adjustment-success-client-communication-dynamic-retirement-spending/).
  "Outcomes, not probabilities, are what matter."
- **It depends on the inputs.** The same 4% rule scores from 62% to over 95% across published return forecasts
  (Pfau & Young, 2023, URL above). A rate quoted to the nearest percent suggests more accuracy than any model has.

## 3. UK withdrawal evidence

UK history is harsher than the US. The 4% rule survived the worst period in only 4 of 17 countries, and the UK was not
one of them (Pfau, 2010,
https://financialplanningassociation.org/article/journal/DEC10-international-perspective-safe-withdrawal-rates-demise-4-percent-rule).

Fixed real income, 30 years, before charges unless stated:

| Level | UK figure | Source |
|---|---|---|
| 100% (never failed) | 2.9% (60% equities), 3.1% (100%); over 40 years 2.4% (60%) | Monevator, 2025, https://monevator.com/safe-withdrawal-rate-uk/ |
| 100% (never failed) | 3.43% (50/50 UK), 3.77% best mix, 1900–2008 | Pfau 2010 via FinalytiQ, 2015, https://finalytiq.co.uk/withdrawal-rates-in-retirement-portfolios-is-the-4-rule-safe-for-uk-clients/ |
| 90% | 4.01% (50/50 UK, history); 4.1% (forward-looking, ~30% equities) | same; Morningstar UK 2026, URL in section 1 |
| 90%, net of 1% fee | 3.0% (60/40) | Morningstar UK 2016 via FinalytiQ, https://finalytiq.co.uk/morningstar-research-safe-withdrawal-rate-still-pretty-safe/ |
| 85% | 4.0% (global 60/40) | Vanguard UK, 2021, URL in section 1 |
| ~75% | 4% failed in 24% of 30-year periods at 60% equities (41% over 40 years) | Monevator, 2025, URL above |
| 50% | ~5.3% median (60/40) | Monevator, 2025, https://monevator.com/whats-the-safe-withdrawal-rate-danger-zone/ |

Fidelity's guide, on Morningstar 2025 data (50% equities, 30 years), shows the cost of each step: 5.3% at 50%
success, 4.7% at 70%, 4.4% at 80%, 4.2% at 85%, 3.9% at 90%, 2.1% at 100% (2026, URL in section 1). Going from 80% to
90% costs about half a point of income; the last 10 points, from 90% to 100%, cost nearly half the income.

Charges: each 1% a year cuts the safe rate by about 0.4–0.65 points (Kitces, 2010,
https://www.kitces.com/blog/the-impact-of-investment-costs-on-safe-withdrawal-rates/), or about half the cost on UK
history (Monevator, 2025). Our 0.5% default costs roughly 0.2–0.3 points.

What people actually do: 44.9% of UK drawdown pots with regular withdrawals were drawn at 8% or more in 2024/25,
including nearly 80% of pots under £30k but about 14% of pots of £250k or more (Broadstone via IFA Magazine, 2025,
https://ifamagazine.com/proportion-of-pensions-being-withdrawn-at-8-hits-highest-ever-level-across-all-pot-sizes/).
Only 30.6% of first-time access was advised (FCA, 2025,
https://www.fca.org.uk/data/retirement-income-market-data-2024-25). Both overspending and underspending are common.

## 4. The cost of being too careful

**Retirees mostly die rich.**

- England: financial wealth falls about 1.8% a year, roughly 31% between 70 and 90, while remaining life expectancy
  falls about 75% (IFS BN236, 2018, https://www.ifs.org.uk/sites/default/files/output_url_files/BN236.pdf).
- UK retirees' incomes rise faster than spending: the share saving goes from 59% at 67 to 69% at 75 (IFS R209, 2022,
  https://ifs.org.uk/sites/default/files/2022-09/IFS-Report-R209-How-does-spending-change-through-retirement.pdf).
- In 2023–24, 26% of £250k+ drawdown pots drew less than 2% a year (IFS, 2025, URL in section 1).
- US: the median household with $500k+ had spent only 11.8% of its assets after 20 years (EBRI Issue Brief 447,
  2018, https://www.ebri.org/crawler/view/asset-decumulation-or-asset-preservation-what-guides-retirement-spending).
- Under a rigid 4% rule in US history, median wealth after 30 years is about 2.8 times the start (Kitces, 2015,
  https://www.kitces.com/blog/the-ratcheting-safe-withdrawal-rate-a-more-dominant-version-of-the-4-rule/). A 95%
  plan left nearly three times its legacy goal unspent (Tharp, 2021, URL in section 1).

"100% probability of success is 100% risk of underspending." The 50% level is the neutral best guess (Fitzpatrick,
Kitces.com, 2024, https://www.kitces.com/blog/retirement-income-risk-monte-carlo-probability-sucess-over-under-spend/).

**One motive for hoarding is going.** From 6 April 2027 most unused pension funds come into Inheritance Tax (HMRC,
2025, https://www.gov.uk/government/publications/inheritance-tax-unused-pension-funds-and-death-benefits).

**Flexible spending is the usual way out.** Being willing to trim spending after bad years lifts the starting income:

- Morningstar UK: 4.1% fixed rising to 5.7% with flexible rules floored at 90% of starting spending (2026,
  https://ifamagazine.com/flexibility-and-balance-are-key-to-withdrawal-rate-success-for-uk-retirees/).
- Vanguard UK: £52,000 vs £40,000 from £1m at 85% (about 30% more), with a 5% ceiling and 2.5% floor on yearly
  changes (2021, URL in section 1).
- Risk-based guardrails: start at 80%, cut when the plan falls to 25%, raise when it reaches 100%. Historical cuts
  were 0–32%, far smaller than older guardrail rules (Tharp & Fitzpatrick, 2024,
  https://www.kitces.com/blog/guyton-klinger-guardrails-retirement-income-rules-risk-based/).

**Counterweights.** UK spending stays roughly flat in real terms, and better-off households spend more through their
60s and 70s, so we should not assume spending falls (IFS R209, 2022, URL above; contrast Blanchett's US ~1% a year
fall, 2014, https://www.financialplanningassociation.org/sites/default/files/2020-09/MAY14%20JFP%20Blanchett_0.pdf).
Living to very old ages is more likely than it was (IFS, 2025). Some underspending is deliberate, for care costs: the
IFS links expecting a care home with slower drawdown (BN236, 2018).

## 5. Saving targets people are given

UK targets are expressed in pounds or as a share of pay, not as a probability.

- **Retirement Living Standards 2026** (after tax, no housing costs): Minimum £13,900 one person / £22,500 two;
  Moderate £32,700 / £45,400; Comfortable £45,400 / £62,700. Pensions UK calls them indicative, not personal targets
  (Pensions UK, 2026, https://retirementlivingstandards.org.uk/news/2026-rls-update).
- **As a pot:** about £413k (Moderate) or £691k (Comfortable) for one person with full State Pension, priced off an
  annuity at 66 (Quilter, 2026,
  https://media.quilter.com/search/2026/pension-pot-required-for-comfortable-retirement-reaches-691000/). This is an
  annuity price, not a drawdown success level.
- **Replacement rates:** 80% of pre-retirement pay for low earners, 67% for median, 50% for high earners (DWP, 2025,
  https://www.gov.uk/government/statistics/analysis-of-future-pension-incomes-2025/analysis-of-future-pension-incomes-2025).
  DWP finds 43% of working-age people undersaving on this measure.
- **Contribution rate:** the PLSA proposes at least 12% of pay, 6% + 6% (PLSA, 2023,
  https://www.plsa.co.uk/Portals/0/Documents/Policy-Documents/2023/Five-Steps-to-Better-Pensions-Final-Report-Oct-2023.pdf).
  A median earner on 8% has less than a 50/50 chance of adequacy (PPI, 2024,
  https://pensionspolicyinstitute.org.uk/media/mwal1sfp/20240620-ae-contributions-briefing-paper-final.pdf).
- **Starting later costs more:** about 7% of pay from 22, about 13% from 40 (Pensions Commission interim report,
  2026, https://www.gov.uk/government/news/britain-is-undersaving-for-retirement-warns-pensions-commission;
  secondary-reported, check against the report).

These are population yardsticks. Our "pay in" answer is personal (their spending, their age, their pot), so the
yardsticks are context, not the target.

## 6. What this means for us

1. **Default to "Balanced" at 4 in 5 (80%).** It is the middle of the adviser band (75–90%), Blanchett's suggested
   target and the starting point of risk-based guardrails (sections 1, 4). Our planned age (95) already stacks caution
   (section 1), and the State Pension floor makes the shortfall smaller (section 2). If the engine can only do the
   existing levels, 3 in 4 is defensible for the same reasons; 9 in 10 should not be the default.
2. **Offer three named levels, numbers always visible:** Careful = 9 in 10 (Morningstar's and Fidelity's benchmark),
   Balanced = 4 in 5 (default), Bold = 1 in 2 (the neutral best guess; makes sense only if the person will cut later).
   Show the levels as "in N of 10 futures we tried", never as a bare percentage (FCA criticism, section 1).
3. **Always show the cost of each step up.** For example: "Careful asks for £X more than Balanced." In our fictional
   example the step from half to 9 in 10 is 38–44% more pot. Advisers' data show the last steps cost the most
   (section 3).
4. **Always show what falling short looks like**, for the futures that fail at the chosen level: the average age the
   money runs out; the income after that (State Pension only, as a share of their planned spending); and years paid
   out of years planned (coverage ratio). Add the shortfall in the worst 1 in 10 futures (section 2).
5. **Show the other side: money likely left over.** The middle amount left at the planned age, in today's money, and
   in the best 1 in 10. This makes the risk of dying rich as visible as the risk of running out (section 4).
6. **Show a flexible-spending line, as a second figure, not the headline.** "If you are willing to cut spending by up
   to 10% after bad years, the same pot supports about £Y a month", with how often a cut was needed and its typical
   size. Evidence: +30–40% starting income (section 4). Only once the engine models the rule; keep the fixed real
   income as the headline because it needs no promise of future cuts.
7. **Derive "pot to aim for" at the chosen level**, net of charges, with State Pension, to the planned age, and show
   the pots at the other two levels beside it.
8. **Derive "pay in" with one probability over the whole run** (saving years and drawing years together), not 9 in 10
   on the saving years and again on the pot. Use the same chosen level as the pot answer, and retire the separate
   nineInTen / threeInFour switch for the pay-in solve.
9. **Give UK yardsticks as context only.** Beside "pay in", show the 12% of pay benchmark and where their spending
   sits against the Retirement Living Standards. Never as the target (section 5).
10. **Wording shows consequences and does not advise.** Say "In 8 of 10 futures we tried, this lasts to 95. In the
    other 2, the money runs out at about 88 on average; after that, State Pension only: about £Z a year." Avoid "safe",
    "should", "recommended" and "success"; use "lasts" and "runs out". Say the choice of level is theirs, and that
    advisers commonly work between 3 in 4 and 9 in 10.
11. **Say what the numbers do not know**: futures are drawn from past markets; a different market history or
    forecast can move a "9 in 10" a long way (section 2).

## 7. Open questions

- **Planned age vs lifetime.** Should we offer "lasts for life in N of 10" (with survival odds, as the FCA asks for
  couples) beside "lasts to 95"? That would end the stacking but needs mortality tables in the engine.
- **Which market history?** Our futures' data source sets the level. Do we use UK or global history, and how does it
  compare with Monevator's UK figures? We should check our 9 in 10 result against the 2.9–3.1% UK never-failed and
  ~4% at 90% figures, after charges and State Pension.
- **4 in 5 or 3 in 4 for Balanced?** Depends on the cost of adding an 80% level to the engine and on testing the
  labels with people.
- **Flexible-spending rule.** Which rule (Vanguard ceiling/floor, Morningstar 90% floor, risk-based guardrails), and
  can we model it without implying a promise?
- **Care costs and bequests.** Should a "keep £X back" input replace extra caution for people who want to leave money
  or cover care? That is honest about why someone saves more, instead of hiding it in the confidence level.
- **Couples.** A floor of two State Pensions changes how bad a shortfall is; the failure measures need a household
  version.
- **Spending shape.** UK evidence suggests flat real spending, so our default is fine; we could let people pick a
  gentle fall later, citing the US smile only as an option.
