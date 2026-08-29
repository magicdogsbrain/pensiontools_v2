# Rotation plan & design audit — 29 Aug 2026

Owner: Chris. Status: plan agreed in principle, app work pending.
All £ in Aug-2026 money. Illustration from the app's own engines, not advice.

## 0. Where the design stands

**Bought and verified.** 23 index-linked rungs, £950k, buying £1.21M of real income to age 91
(tax years 2030/31–2061/62). Three cash years (27/28–29/30) in CSH2 + SIPP cash, £226k held
against £240k needed; £64k expected from another SIPP, fallback £58.7k/yr for three years.
Manual + 73 calendar entries shipped. Ladder verified against the AJ Bell holdings PDF.

**Decided since.** The ladder is not the end state. It is a *floor plus optionality*: the long
rungs are dry powder that pays ~2.5% real to wait, and they get swapped into equities on a
pre-defined equity drawdown. The end state is "floor to age N + equity engine beyond".

## 1. The rotation plan

**Trigger.** Global/US equities ≥30% below their all-time high (any path — crash or grind).
Fire on the month it first crosses. No second condition, no valuation screen, no confirmation.

**What is sold.** The whole block of rungs funding ages 76–91: TR46, T47, TG48, TR50, TG51,
TG52, TG54, TR8F, TR56, T58. £262k today, growing ~2.5%/yr real while unsold.

**How much at once.** All of it, in one go. Tranching tested and rejected (see §2).

**Price discipline.** Sell whatever the gilt price. The block's value at the trigger date moves
the odds by a few points, not the decision (§2). Do NOT pre-sell into a linker rally and sit in
cash — the gilts are the waiting room and they pay 2.5% real; cash costs ~2.8%/yr.

**Rebuy.** None assumed. The plan is judged on never rebuying. Rebuying if the chance arises is
upside, not a requirement (round trip separately modelled: 10-year hold, 95–100% restores the
floor with £200–290k left over).

**Floor that is never sold.** Rungs funding ages ≤75 stay, always. With the State Pension from
67 that guarantees £65k to 67, £45k to 74 and £40k at 75 — every year fully covered until 75,
whatever markets do.

**If the trigger never fires.** Do nothing. The ladder pays as bought. There is no time-out and
no obligation to act: the un-rotated plan is already 100%/£70k-left. The rotation is optional
upside, not a repair.

**What it converts into.** Full linker cover to 75 + State Pension + equities beyond 75 —
i.e. the app's "Floor to an age then decide" shape.

## 2. Evidence

Sell the ages 76–91 block at the trigger, buy equities, never rebuy, draw £27,520/yr real
ages 76–91 (£440k total). Every historical month the market first crossed −30% below its ATH:

| Trigger age | Pays in full | Median left at 91 | vs swapping at a random month |
|---|---|---|---|
| 57 | 100% | £1,129k | 100% / £673k |
| 62 | 100% | £1,138k | 89% / £623k |
| 67 | 98% | £1,098k | 83% / £471k |
| 72 | 94% | £669k | 78% / £352k |

The trigger adds 11–16 points of success over acting at a random time and roughly doubles what
is left. Bootstrapped futures give 81–85% flat at every age — but bootstrap paths are
unconditional, so they cannot see the trigger at all; that column is the "trigger adds nothing"
floor. Honest range: **~84% pessimistic, ~98% on history.**

Robustness to the gilt price at the trigger date (block ±25%):

| Trigger age | Block −25% | As modelled | Block +25% |
|---|---|---|---|
| 62 | 96% | 100% | 100% |
| 67 | 91% | 98% | 100% |
| 72 | 84% | 94% | 100% |

**Episode by episode** (crossing months only, n=16, sell-to-75, all-in):
every episode paid at trigger-age 62. The ONLY failures are **1929-11 and 1930-06**, and only
when the trigger fires at 67 or 72. 1974-07 — the stagflation analogue — paid in all three
(£1,084k / £1,322k / £309k left).

**Tranching rejected.** Thirds at −30/−40/−50 with a 24-month timeout scored *worse* than
all-in on both success and leftover (e.g. trigger at 67: 81% vs 88%; median left £426k vs
£599k). The deeper levels often never arrive, so the timeout deploys later at higher prices
while the powder earns 2.5% instead of the rebound. Tranching's real value is behavioural, not
financial — if it is the difference between executing and freezing, use halves at −30/−45.

**Deeper triggers rejected.** Entering at 45%+ below peak scored worse than 30% over a 10-year
hold — those months include the way down. −50% has only a 20% chance of occurring within five
years vs 58% for −30%.

**Cut age.** Selling to 72 leaves the most (£722k median at trigger-67) at the same 88%;
selling to 80 is the most conservative and leaves least. 75 chosen as the balance: it keeps a
guaranteed floor through the go-slow years and still frees £262k.

## 3. Risks, stated plainly

1. **A 1929-scale collapse arriving after 65.** The one failure mode in 150 years of data.
   Mitigation: none available inside this plan; the fallback is spending flexibility in the 80s.
2. **No modern episodes in the test.** Data ends 2023-06, so a 30-year horizon excludes 2000
   and 2008 triggers entirely. n=16 episodes, all pre-1975.
3. **Behaviour.** Every number assumes the swap is executed in the worst week of a decade and
   then held for 15–30 years without touching it. This is the largest unmodelled risk.
4. **No floor beyond 75 after the swap.** Income above the State Pension becomes market-
   dependent from 76. In the failing 2–16% that means trimming in the 80s.
5. **RPI→CPIH from Feb 2030** reduces the uplift on every unsold rung by ~1%/yr.
6. **Capacity.** A borrowed floor that exists only in Chris's head cannot be inherited. It must
   be visible in the app and in the manual.

## 4. Decision rule, one paragraph

> While equities are within 30% of their all-time high: do nothing, run the ladder as bought.
> On the first month equities close 30% or more below their all-time high: sell the entire
> ages 76–91 rung block at market, whatever the price, and buy the global equity fund with all
> of it. Never sell a rung funding age 75 or younger. Rebuy the sold rungs only if real yields
> and the equity sleeve later make it free. If the trigger never fires, the plan stands as is.
