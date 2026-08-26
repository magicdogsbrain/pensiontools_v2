# Strategy presentation — design proposal (26 Aug 2026)

**Problem.** Six strategies now exist (Pots & Valves, Ladder & Ratchet, Floor & Flex, Floor the
schedule, Floor to an age, Full index-linked gilt ladder). They are presented as six cards, a
row-per-metric table and a grid of six identical result cards. A reader cannot *see* how any of
them works, cannot tell which question each one answers, and the honest trade-offs (certainty vs
upside vs effort vs what a 1966-style decade does) are buried in prose. The user's own journey this
week — from "the pots strategy always wins" to a fully specified gilt ladder — is the use case: the
presentation must let someone else make that journey in an hour, not a week.

## Principles

1. **Mechanism first, numbers second.** Each strategy gets one picture that shows *what moves money
   where and when*. Numbers come after the reader understands the machine.
2. **Same plan, same markets, same axes.** Every visual uses the reader's own plan and the same
   history/futures, so differences are the strategy, never the inputs. (stressTestStrategy already
   guarantees this — the UI must not break it.)
3. **Show the failure, not just the success.** Every page shows the strategy's characteristic
   failure — the ladder's cliff, P&V's cuts, F&F's lean years, the reserve arriving small at 80, the
   gilt ladder's "official inflation ≠ your inflation" — as a picture, with a real decade (1966,
   2000) driving it.
4. **No advice, real data, provenance on every number.** Prices, curves, index ratios dated on the
   page; the "what this is / what it is not" box once per page, substantive, not wallpaper.
5. **Interactive where it teaches, static where it doesn't.** Dials that change the *shape* of the
   picture (ladder length, floor level, cut %) earn their place; dials that only change a number do not.

## Information architecture

```
Stress Tester
└── Strategies (sub-tab)  →  becomes a section with its own left nav
    ├── Overview: "six ways to turn a pot into an income"   (comparison page)
    ├── Pots & Valves
    ├── Ladder & Ratchet
    ├── Floor & Flex
    ├── Floor the schedule
    ├── Floor to an age, then decide
    ├── Full index-linked gilt ladder
    └── Gilt ladders explained (the existing explainer, promoted)
```

Each strategy page has the same five blocks, in the same order:

| Block | Content |
|---|---|
| **1. The machine** | Infographic (inline SVG, animated on scroll/step): pots and valves; a staircase of rungs with a sleeve and a trigger line; a floor slab with a flex sleeve on top; the schedule as a staircase fully bought; the schedule to age A with a reserve and a "decide" flag at A; the calendar of gilts each maturing before an April. |
| **2. Turn the dials** | 2–4 dials specific to the strategy; the machine picture *and* the two cones (wealth, income) redraw live from stressTestStrategy on the reader's plan. |
| **3. Two real decades** | The 1966 and 1985 starts (and 2000 for the reserve strategies) drawn on the same axes: income delivered by year, wealth by year. The bad decade is the point. |
| **4. Where it shines / how it fails** | Three-and-three, plus the effort line ("what you do each month / each year") and the exit ("how you get out of it"). |
| **5. The honest numbers** | The standard stress-test block (ruin, worst-12, guaranteed-to, terminal, cones) and for the gilt strategies the order sheet with provenance. |

## The comparison page

- **A matrix, not a table of numbers:** rows = the six strategies; columns = *what you get* (guaranteed
  income, upside), *what you pay* (cost today / share of pot, expected leftover), *what can go wrong*
  (chance of cut/ruin, worst year, the failure shape), *what you do* (monthly / yearly / once), *how you
  get out* (exit). Cells are short phrases plus one number each, all from the same stressTestAll run.
- **The same six cones stacked on one axis**, income and wealth, with a slider that scrubs through
  plan years and a toggle for "cuts off for everyone" (the level-footing switch).
- **"Pick the question you are asking"** at the top: *I want to know my number for life* → floors;
  *I want the most money over my life* → P&V; *I want certainty now and options later* → floor to an
  age; *I never want to think about it again* → full gilt ladder. Not a recommender — a router.

## Infographic concepts (one line each, to be sketched)

- **Pots & Valves:** four tanks (shares, bonds, cash, ISA) with valves into a monthly tap; floors marked on each tank; a "protection" valve that throttles the tap when the tanks are below their floors; refilling arrows in good years.
- **Ladder & Ratchet:** a staircase of rungs (years) rising to the right; a sleeve balloon above a glide line; when the balloon crosses the line, a rung is added to the staircase. Failure: the balloon deflates before the staircase reaches the horizon — a cliff.
- **Floor & Flex:** a concrete floor slab (essentials) across the whole timeline; a flexible sleeve above that pays "treats" as a % of its size; the slab never moves, the treats do.
- **Floor the schedule:** the income steps (60/50/40) drawn as a staircase, fully shaded "bought"; a small reserve box to the side, growing, with a once-a-year check-valve into more steps.
- **Floor to an age:** the same staircase shaded to age A; after A the steps are outlined, not filled; the reserve box has a "decide here" flag at A with three outcomes drawn (buys the steps / buys smaller steps / buys an annuity).
- **Full gilt ladder:** a calendar strip of tax years; above each April, a gilt icon with its maturity date landing just before; cash years at the left; double-drops shown as one gilt feeding two Aprils; nothing else on the page — the point is emptiness.

## Interactivity that earns its place

| Strategy | Dials |
|---|---|
| P&V | spending cuts on/off, cut %, allocation risk level |
| L&R | ladder years, bolted draw, band threshold |
| F&F | essentials, floor-to age, sleeve % |
| Floor the schedule | (income shape only — from Settings) |
| Floor to an age | the age |
| Full gilt ladder | cash years, bridge, (income shape from Settings) |
| Comparison | scrub year, cuts-off-for-all toggle |

## Honesty features carried over

World-equity data note; the RPI→CPIH 2030 note on every gilt page; debasement box (own inflation, relative to wages, fiscal drag); prices/curve/index-ratio dates; "not a recommendation" once, plainly.

## Build plan (after review)

1. Page shell + left nav + the five-block template (no new dependencies; inline SVG).
2. Six infographics as static SVG with CSS step-animation (no JS libraries).
3. Dials wired to stressTestStrategy (already single-source) — debounce, run in a worker if the P&V run (~2s) hurts.
4. Comparison matrix + stacked cones + the question router.
5. Copy pass with the failure line for each strategy written by hand.

Estimated: shell + template 1 day; infographics 2 days; dials + comparison 1–2 days; copy ½ day.

## Open questions for the user

- Left-nav section inside the Stress Tester, or a top-level "Strategies" tab?
- Should the comparison default to "cuts off for everyone" (level footing) or to each strategy as the user configured it?
- Is a static illustration per strategy enough, or do you want the step-through animation (the storyboard in the UX brief §4)?
