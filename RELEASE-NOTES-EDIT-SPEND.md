# Release bullets: the preview can change "What you spend"

For the next release entry in `src/releases.js` (the shape of the 6.28.0 entry; no bump made here, engine version
unchanged at 6.22.0). Design: `research/v7/editing-in-v7.md` section 8.

```js
  {
    version: 'x.y.z', date: 'YYYY-MM-DD', engineVersion: '6.22.0',
    title: 'The preview can change "What you spend"',
    summary: 'The third part of a plan you can change in the preview (/v7/) instead of the planner: what you spend a month after tax from the start, how it changes as you get older — any number of later steps by age, each staying the same, falling by a percentage a year or moving evenly to the next, with "Suggest go-go, go-slow and no-go years" — and one-off costs at an age. The before-tax figure the plan saves is shown under every amount, never asked. Your budget sits beside it as a guide only. A save writes the same settings the planner\'s "Your income shape" and "Extra spend" boxes write, and nothing else, with Undo. A locked plan is never changed.',
    changes: [
      '"What you spend" (/v7/#/plan/<id>/spend, from Your plan → "Change this here" beside "What the plan pays"): the figure from the plan\'s first year, a month after tax at today\'s prices, and what happens from it (stays the same, falls by a percentage a year, moves evenly to the next step); later steps as cards, each from an age, with its share of the start; one-off costs as cards (what it is, the amount a year after tax, at age, for how many years, going up with prices or a fixed sum). Beside each box, the saved value and where it came from; under every amount, the figure before tax as the plan saves it ("£38,000 a year before tax").',
      'As many steps and tapers as the planner: any number of steps by age, a fall of 0.25% to 10% a year in quarter points (the planner\'s slider stops at 5%; the plan reads any), "moves evenly to the next step" on every step but the last, and the first row\'s own fall. "Suggest go-go, go-slow and no-go years" is the planner\'s own rule (15% less from 75 and 30% less from 85, to the nearest £500 a year before tax, never below your budget\'s essentials), said a month after tax.',
      'The picture of every year: one bar a year from the plan\'s start, the part your State Pension and other pensions pay lighter, the go-go, go-slow and no-go bands, your budget\'s essentials dashed (a guide), and "Show each year" as a table. A year the pensions pay more than the shape is drawn at what they pay, and a line says so — the planner\'s "never below the income you get anyway".',
      'Your budget, as a guide: its all-in total and essentials a month after tax beside the boxes, with "Use £X a month at the start" (one tap into the first row; you can change it) and "Change the budget lines (in the planner)". It is never used to work out what you need: the plan uses the figures in the boxes. Not worked out: the page says you are choosing by one figure and that working it out line by line is the better way.',
      'Under the boxes, what it works out to: "From age 60: £3,410 a month after tax (£48,000 a year before tax), moving evenly to £2,476 at 76.", each one-off cost with its tax year and its before-tax figure on top of that year.',
      'Save, Cancel, and after a save an Undo for fifteen seconds that puts the plan back as it was, byte for byte.',
      'It writes the same saved settings the planner\'s Stress Save writes for these boxes — the income steps (the shape), the year-by-year schedule every engine reads, the first figure, the Decision copy\'s first figure and schedule, and the one-off costs — and nothing else; a row you did not touch is kept byte for byte. A test proves every path written is on the step\'s declared list and that every other byte of the stored plan is unchanged, and that the planner\'s own reading of the plan shows the steps the preview showed.',
      'Couples: your partner\'s spending is on your partner\'s plan; the page says so and links there. One save writes one plan.',
      'A locked plan is never changed: its "What you spend" is read-only (the figures and the picture from the plan document), and every write passes the lock guard before anything is sent. Without an account, this window\'s plans can be changed the same way while the free time is not used up.'
    ],
    corrections: [
      'The plan page\'s "will it last" stale line now also notices a changed first figure when the plan was made from a preview answer (the answer\'s own take-home row against the plan\'s first step, through the same tax sum, within £1 a month).'
    ],
    effects: {
      stress: ['None until you press Save on "What you spend"; a save writes that step\'s keys only and stamps the plan as every save of the planner does. A plan saved before 6.2.0 with the old "declining with age" setting has it set to "flat" with the steps on that save, exactly as the planner\'s own Save does (the taper lives on the steps).'],
      decision: ['The first figure and the year-by-year schedule are kept in step with the Stress settings on a save, as the planner\'s Save does while a plan is unlocked.'],
      budget: ['None: the budget is read as a guide and never written from this step.'],
      strategies: [], accumulation: [], household: []
    },
    actions: ['None. To change what you spend from the preview: Your plans → the plan → Your plan → "What the plan pays" → "Change this here".'],
    notes: [
      'The planner saves each step a year before tax; the preview asks a month after tax and converts with the planner\'s own tax sum at the plan\'s own bands, so a figure typed reads back as typed and an untouched figure keeps its saved before-tax amount to the pound. A one-off cost\'s before-tax figure is the planner\'s marginal sum on top of that year\'s figure, so a cost left untouched keeps its saved row whatever else changed.',
      'The essentials Floor & Flex buys as a floor stay with the way of drawing, in the planner; the page says so on a Floor & Flex plan.',
      'The draft of this step is text by box, kept in this tab with the other drafts and cleared on save, cancel or leaving the plan. No new browser key.',
      'Not yet: "Your pots and tax" and "Does it last?" as editing steps; editing the budget\'s lines inside the preview. Engine version unchanged (6.22.0).'
    ]
  },
```
