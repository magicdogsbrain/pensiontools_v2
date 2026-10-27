# Who draws what: the tax a couple saves by drawing together (design, 12 Oct 2026)

Owner, 9–12 Oct 2026: a couple with badly unequal pots pays far more tax than it needs to when each plan draws for
itself. Drawing so that the smaller pot uses its owner's tax-free allowance and 20% band, and the larger pot stays out
of the 40% band, can save over £12,000 a year. But it spends the smaller pot faster, and it is a choice: "we have chosen
couples tax efficiency over independence from each other". The tool must make the trade **abundantly clear**: how much
the tax-efficient way saves, against simply paying the tax and making the smaller pot last longer.

## 1. What exists today

- Two linked plans, each with its own income steps (`HouseholdService.js`); the Household tab checks them together on
  the same markets (`runHouseholdMonteCarlo`, paired paths, calendar-aligned).
- `allowanceNudge` (HouseholdService.js:247): one sentence, year 0 only, saving reckoned at 20% of the shifted slice. It
  under-states the saving (the real difference is 40% against about 15% when the smaller pot takes a quarter tax-free),
  ignores the later years, and says nothing about what it costs the smaller pot.

## 2. When it shows

Whenever, in any year of the plan, one person's taxable draw is above the 20% band (£50,270, rising as the plan's tax
bands rise) while the other has unused allowance or 20% band — worked out from each plan's own income steps, State
Pension, final-salary pension and way of drawing (fully taxed, or a quarter tax-free). It is shown at the top of the
Household tab, not as a footnote, when the yearly saving is more than £1,000.

## 3. The two ways, side by side

Both are worked out on the same futures (the paired Monte Carlo), for every year of the plan:

| | **Each draws for their own plan** | **Drawing together, tax first** |
|---|---|---|
| Rule | Each plan's income steps as set | Each year the household's after-tax spending is split so the lower-taxed person fills their allowance and 20% band first; the other draws the rest, staying at or below the top of the 20% band where the money allows |
| Respects | — | each person's way of drawing (fully taxed / a quarter tax-free), State Pensions and final-salary pensions as they start, a ladder's fixed rungs (money a rung pays beyond the draw is reinvested in the plan's growth part), the 2028 pension-age change |
| Optional limit | — | "Keep [Sam]'s pot until [67]" (the bridge: drawn evenly to that age, then stops) or "Keep at least £[X] in [Sam]'s pot" |

The split is worked out year by year in today's prices with the app's own tax sums (`planDrawdown`, `grossToNet`), and
becomes each plan's income steps for the comparison run. Nothing is saved to either plan unless the person chooses it
(section 5).

## 4. What it says (the headline must be unmissable)

> **Drawing together saves about £12,800 a year in tax — about £140,000 by the time Sam is 67.**
> Your pots are very unequal (£1,180,000 and £220,000). When each of you draws for your own plan, Alex pays 40% on
> £33,000 a year while £12,570 of Sam's tax-free allowance and most of her 20% band go unused.
>
> **The cost:** Sam's pot is spent as the bridge to her State Pension: about £0 at 67 in a middling case, instead of
> about £X if each of you draws for your own plan.
>
> | | Each for their own | Drawing together |
> |---|---|---|
> | Tax a year (first full year) | £20,892 | £8,115 |
> | Tax until Sam is 67 / over the whole plan | £… / £… | £… / £… |
> | Alex's pot at 67 / 75 / 90 (middling) | … | … |
> | Sam's pot at 67 / 75 / 90 (middling) | … | … |
> | The money lasts (9 in 10 is on course) | … in 10 | … in 10 |
> | Left for the household at 90, today's prices (middling / bad case) | … | … |
>
> Paying the tax keeps Sam's pot, and your money more separate. Drawing together leaves the household about £X better
> off at 90. **This is your choice; neither is wrong.**

Every figure is from the run, never a guess; the bad case (worst 1 in 10) sits beside the middling one. Words for the
2028 change when it applies: "Sam will be 56 on 6 April 2028: take the months up to her 57th birthday in one go before
then (or check whether her scheme gives a protected pension age)."

## 5. Choosing it

"Use this split" writes the split as income steps into each plan (Sam: £1,716 a month gross until 67; Alex: his
draw capped at the top of the 20% band, the rest from his pot), after showing exactly what changes. A locked plan is
never changed: the offer is "Make copies of both plans with this split" (the copies are unlocked drafts, named by the
person). "Keep things as they are" dismisses it for that pair of plans until either plan changes.

## 6. V7

The couples answers (C, A, B, D) use the same split rule when a couple's pots are unequal, show the same two-column
comparison under "What it is made of", and carry the choice into a saved plan. One rule, in `src/services/` so both
apps share it.

## 7. Tests

- The owner's figures (from his own review, kept as a local-only fixture): £83,650 alone → £20,892 tax; £50,270 +
  £1,716 a month → £8,115; household after tax equal within £20.
- The split never lowers the household's after-tax spending in any year; never draws more than a pot holds; respects
  fixed rungs and the bridge limit; with equal pots and equal draws it changes nothing.
- The two-column figures equal the paired runs; the headline equals the table.
- Locked plans: byte-identical after "Use this split" (copies only).

## 8. To check before building

- How today's gilt-ladder engine treats money a rung pays beyond the year's draw. Checked 12 Oct 2026: it doesn't — a
  ladder is sized to the plan's yearly need, and money not needed for rungs (`plan.spare`, GiltRotation.js:110) is held
  at its real value, not grown. A bought ladder whose owner now draws less has no model at all. The owner wants the
  excess (and his £90,000 transfer) reinvested in risk assets: the ladder strategies need an "excess and spare go to the
  growth part" option before the comparison can show his case truly. Until then the comparison says so in one line.
- The paired run when the smaller pot runs out before its age limit in a bad case: the other plan then covers the rest
  (household lasts), and the words say from what age that happens.

## 9. Addendum, 27 Oct 2026: the couple's baseline, the default limit, and the words (owner's decisions)

The owner tried the built page (6.42.0 planner; V7 since 6.42.0) on two plans as written — the larger plan drawing £83,650
a year, the smaller plan paying its owner a monthly sum by UFPLS — and found the first thing shown was the smaller pension
drawing some £40,000 a year for five or six years, with no sense of why, and the pot gone by about 62. The sums were right
(the page answered "same take-home between you, least tax, year by year"); the default and the words were wrong. The
decisions below change sections 3 to 5 and are the rule from 6.45.0 on. Every figure in this section is the Alex/Sam
example of section 4, with Sam's plan paying £1,500 a month (£18,000 a year net) by UFPLS; nothing here is a person's plan.

**9.1 What is held fixed is the couple's take-home, and the page says so.** The comparison's two columns are **"As the
two plans are written"** and **"Paid as a couple, tax first"**. Above the table, one line states the baseline: *"Between
you, after tax: £80,758 a year, both ways. The only question is which pension pays how much of it."* The smaller
pension's line says what its figure is made of: *"Sam's pension pays £41,781 a year: the £18,219 its plan pays plus
£23,562 that Alex's pension stops paying."* No "own", "yours" or "hers": the two pensions are named by their plans'
names, because HMRC taxes them separately and that is the only reason a saving exists. The headline's words of section 4
keep their figures; "Each for their own" and "Drawing together" are retired.

**9.2 The default is the paced split, not the fast one.** With no limit chosen, the rule keeps the smaller pot until its
owner's State Pension age — section 3's "Keep [Sam]'s pot until [67]", drawn evenly to that age on what is left — so the
first figure a couple sees is the one that does not empty a pension. The fast split (today's no-limit behaviour) becomes
the option **"Draw Sam's pension faster"**, shown from the split's own count without an engine run: *"saves about £9,100 a year
more; Sam's pension gone at about 62"*. Choosing it reruns the page. The limit's "None" option means this fast split;
`householdDrawSplit` takes `limit: null` as the default limit (until the smaller pot's State Pension age) and
`{ kind: 'none' }` as no limit, so the planner's Household tab follows the same default (one rule, section 6). The cap of
section 3 stands: a pension may always pay what its own plan pays.

**9.3 A box for what the couple needs after tax, a year.** Default: the two plans' take-home added together (today's N).
A lower sum typed — the owner's case where the larger plan's figure already covers the couple — is the N the split works
to; the page then says *"Between you, after tax: £62,758 a year (you typed it; the two plans as written pay £80,758)."*
With N below the two plans' take-home the own draws are first scaled to N in proportion to their nets, then the rule runs
as before. The box is a what-if on this page only: "Use this split" writes the split's steps, which carry the typed need.

**9.4 Every pound is compared, not only the pounds above the band.** Step 1 of section 3 kept each plan's draw within its
20% band and moved only the 40% part. But a pound drawn as a quarter tax-free inside the 20% band costs 15p and a fully
taxed pound in the same band costs 20p, so there are cheaper pounds below the band too. The rule becomes a cost-ordered
fill of N across both people's slabs — allowance (0p), ISA (0p, where the ISA is not on hold), a quarter-tax-free pound in
the 20% band (15p), a taxed pound in the 20% band (20p), a quarter-tax-free pound in the 40% band (30p), a taxed pound in
the 40% band (40p), and so on — with ties broken for the plan's own draw, so two equal plans change nothing and equal-cost
pounds never move between the two for nothing. Pot caps and the limit bind as before. On the example this takes Sam to the
top of her 20% band and Alex down toward his allowance in the fast split; under the default limit Sam's cap binds first
and the difference is small.

**9.5 The years after the smaller pot is empty are counted.** In the split's own count a person "may always take what
their own plan draws" even after the pot is gone, so the tax table stopped charging for those years. Once the smaller pot
is empty in the count, its plan's draw is paid by the larger pension at that pension's marginal rate (step 3's fallback),
and the tax "until Sam is 67 / over the whole plan" includes it. The pooled verdict already did this with real runs; the
table now agrees with it. This is what makes the fast split's "saves more" honest: on the example its saving over the
bridge is smaller than the first years suggest.

**9.6 Tests.** The owner's figures of section 7 stand. Added, on the couple fixtures and random couples: the couple's
take-home is never lower either way; under the default limit the smaller pot's balance at its State Pension age is not
below nothing in the split's count; tax together is not above tax as written in any year at the same net; the fast
split's first-year saving is not below the paced one's, and its "gone at" age is not after the State Pension age; two
equal plans change nothing; a typed need below the two plans' take-home gives a split whose net equals the typed need;
the household copy contains none of "own", "yours", "hers", "his" as words about money (src/v7/copy/banned.js gets them
for the household page). The planner's Household tab (index.html, householdView.js) takes the default limit and the two
column headings; its other words are not reworked (the classic page is retired at 7.0 but for month by month).
