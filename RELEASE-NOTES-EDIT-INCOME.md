# Release bullets — the preview can change "Money that comes in anyway"

For the next `src/releases.js` entry (the shape of the 6.27.0 entry; version and date to be set at release time; engine
version unchanged, 6.22.0). Design: `research/v7/editing-in-v7.md` §7.

**title:** The preview can change "Money that comes in anyway"

**summary:** The second part of a plan you can change in the preview (/v7/) instead of the planner: your State Pension (the
full amount, your forecast, or none), each final-salary pension by the age it starts and how it rises, other income that
comes in anyway, income for some years by start and end age, and the lump sums you expect, by age. Each fact is asked once,
by age, before tax, in plain English; what it works out to — the State Pension's age and tax year, each pension's first tax
year, how many years an income runs — is shown, never asked. A save writes the same settings the planner's "Other income",
"Income streams & lump sums" and "State Pension" boxes write, and nothing else, with Undo. A locked plan is never changed.

**changes:**
- "Money that comes in anyway" (/v7/#/plan/<id>/income, from Your plan → "Change this here" beside the new "Money that comes in anyway" section): your State Pension as the full amount, your forecast (pounds a week, before tax) or none; final-salary pensions as cards, each with the amount a year, the age it starts and how it rises (with prices capped at 5%, with prices, not at all); other income for the whole plan; income for some years as cards (what it is, the amount, from age, to age or for the rest of the plan, how it rises); lump sums as cards (what it is, the amount, at age, a cash lump sum or an inherited pension or ISA). Beside each box, the saved value and where it came from. Under the boxes, what it works out to: "State Pension: £11,973 a year before tax from age 67 (tax year 2034/35)", "Final-salary pension 1: £9,400 a year before tax from age 65 (tax year 2032/33), going up with prices, capped at 5% a year", "Downsizing: £90,000 at age 69 (tax year 2036/37), a cash lump sum".
- A plan with no State Pension figure says what the planner then assumes — "every run assumes £12,000 a year before tax from age 67" — in the planner's own words, and offers "Leave it as assumed for now" beside the three choices until one is made.
- Ages, not plan years: every start, end and arrival is asked as an age and stored as the planner's own plan year (age less the plan's start age), the rule the planner's "Final-salary pension starts at age" box already uses; a start before the plan's first year is allowed and said; a start after its end is refused as the planner refuses it.
- The April 2028 note where it applies — a pension pot, stopping (or already drawing) before 6 April 2028, and 55 or 56 on that day: "Move into drawdown what you will need before 57 by 5 April 2028: after that, nothing new can be taken until you are 57."
- Save, Cancel, and after a save an Undo for fifteen seconds that puts the plan back as it was, byte for byte.
- It writes the same saved settings the planner's Stress Save writes for these boxes — the weekly State Pension amount (and, for none, the old yearly figure set to 0 so nothing is assumed), the final-salary amount, start year and age and rises, other income, the income streams list and the lump sums list — and nothing else. A saved State Pension date is never changed (it is also the birthday the plan reckons ages from); a plan with none that gains a State Pension gets the day its State Pension age is reached. A test proves every path written is on the step's declared list and that every other byte of the stored plan is unchanged; rows the step does not touch are kept byte for byte.
- Your plan's "Pots and other income" section is now two: "Pots" (still changed in the planner) and "Money that comes in anyway" (changed in the preview), the latter listing income for some years and lump sums too.
- Couples: your partner's State Pension and pensions are on your partner's plan; the page says so and links there. One save writes one plan.
- A locked plan is never changed: its "Money that comes in anyway" is read-only, and every write passes the lock guard before anything is sent.
- Without an account, this window's plans can be changed the same way while the free time is not used up.

**corrections:**
- The plan page's "will it last" stale line now also notices a changed State Pension or final-salary pension when the plan was made from a preview answer (the answer's own record carries both); before, only the ages and the plan's length were compared.

**effects:**
- stress: ["None until you press Save on \"Money that comes in anyway\"; a save writes that step's keys only and stamps the plan as every save of the planner does. A second or third final-salary pension is kept in the planner's own \"Income streams\" list as income for the rest of the plan, labelled \"Final-salary pension\"."]
- decision: ["None: the planner's Stress Save does not copy these boxes to the Decision settings, and neither does the preview."]
- budget: []
- strategies: []
- accumulation: []
- household: []

**actions:** ["None. To change your State Pension, pensions, other income or lump sums from the preview: Your plans → the plan → Your plan → \"Money that comes in anyway\" → \"Change this here\"."]

**notes:**
- "Where a cash lump sum can legally go (the ISA allowance, the pension within its limit, the rest in an ordinary account) and what its taxable part is held in stay the planner's: the preview keeps them as saved and never asks."
- "The draft of this step is text by box, kept in this tab with the other drafts and cleared on save, cancel or leaving the plan; a list is its card ids. No new browser key."
- "Not yet: \"What you spend\", \"Your pots and tax\" and \"Does it last?\" as editing steps. Engine version unchanged (6.22.0)."
