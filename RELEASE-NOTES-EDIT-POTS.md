# Release bullets: the preview can change "Your pots and tax"

For the next release entry in `src/releases.js` (the shape of the 6.29.0 entry; no bump made here, engine version
unchanged at 6.22.0). Design: `research/v7/editing-in-v7.md` section 9.

```js
  {
    version: 'x.y.z', date: 'YYYY-MM-DD', engineVersion: '6.22.0',
    title: 'The preview can change "Your pots and tax"',
    summary: 'The fourth part of a plan you can change in the preview (/v7/) instead of the planner: your pension pot today (and, if you are still working, what you expect to have at the day you stop), your ISAs and savings and how they grow and are used, your ordinary account, charges, the tax thresholds and whether they rise, and how you take the tax-free part of your pension. Each fact is asked once, in plain English, with the saved value and where it came from beside it; the split of your pension, the risk level and the funds to test stay with the way of drawing and mix, and the page says so. A save writes the same settings the planner\'s "Your allocation", "Charges", "Tax thresholds" and "How you\'ll take this pension" boxes write, and nothing else, with Undo. A locked plan is never changed.',
    changes: [
      '"Your pots and tax" (/v7/#/plan/<id>/pots, from Your plan → "Change this here" beside "Pots"): your pension pot today as one figure; if you are still working, what you expect to have at the day you stop (or leave it blank for the planner\'s own figures, worked out from what you pay in and shown beside the boxes); your ISAs and savings today, how they grow ("Mostly cash" or "Invested like my pension") and how the ISA is used; your ordinary account — how much, what it holds, your tax band for it — your earnings this year and whether £20,000 a year is moved into the ISA; charges (funds and platform) as a percent a year; the tax-free allowance and the two thresholds, rising with prices or frozen; your 25% tax-free part (kept separate or already taken, or a quarter of each draw, for how many years, then the rest into the ISA); and band fill. Beside each box, the saved value and where it came from.',
      'Under the boxes, what it works out to: the pots today, the split as saved ("£280,000 shares, £120,000 bonds, £40,000 cash") with where to change it, the pots at the day you stop (typed, the planner\'s own figures, or your answer\'s own middling and bad-case figures), how the ISAs grow, what the charge comes off, the bands, and how each draw is taxed.',
      'A setting your way of drawing ignores says so under its box — "Not used by this way of drawing" — as the planner says beside its own boxes: for a ladder, a floor or a rotation the tax-free part, band fill, earnings and bed-and-ISA; and how the ISAs grow once the plan is running. A way of drawing sized on its own pot figures says that those are set with the way of drawing.',
      'What each tax choice saves over the plan is not a figure the plan holds, so the page says it comes from "Does it last?", later, and never works it out itself.',
      'Save, Cancel, and after a save an Undo for fifteen seconds that puts the plan back as it was, byte for byte.',
      'It writes the same saved settings the planner\'s Stress Save writes for these boxes — the three pots your pension is held in (your total in the proportions already saved, so the mix is untouched), the pots at the stop, the ISA and its two choices, the ordinary account and its mix and band, earnings, bed-and-ISA, the charge, the three thresholds and whether they rise, the tax-free part and band fill — and nothing else. A key the plan did not have is written only when you choose something other than what the plan already read it as. A test proves every path written is on the step\'s declared list, that every other byte of the stored plan is unchanged, and that the planner\'s own readers of each setting see what the preview showed.',
      'Couples: your partner\'s pots and tax are on your partner\'s plan; the page says so and links there. One save writes one plan.',
      'A locked plan is never changed: its "Your pots and tax" is read-only (the figures from the plan document), a plan locked before charges or the ISA growth choice were added says so and keeps its figures, and every write passes the lock guard before anything is sent. Without an account, this window\'s plans can be changed the same way while the free time is not used up.'
    ],
    corrections: [
      'The plan page\'s "will it last" stale line now also notices a changed pension pot or ISA when the plan was made from a preview answer (the answer\'s own record against the plan\'s pots, to the pound).'
    ],
    effects: {
      stress: ['None until you press Save on "Your pots and tax"; a save writes that step\'s keys only and stamps the plan as every save of the planner does. A pension total typed here is split into the three pots in the proportions the plan already holds; on a plan with no pots yet, the balanced split, as the planner would.'],
      decision: ['None: the planner\'s Stress Save does not copy these boxes to the Decision settings, and neither does the preview.'],
      budget: [], strategies: ['None: the split of the pension, the risk level, the funds to test, the diversifiers, the bond tent and every strategy\'s own dials stay with the way of drawing and mix.'], accumulation: [], household: []
    },
    actions: ['None. To change your pots, charges or tax settings from the preview: Your plans → the plan → Your plan → "Pots" → "Change this here".'],
    notes: [
      'A typed figure for the pots at the day you stop is saved exactly as the planner\'s Timing block saves it; both boxes left blank on a plan that had typed figures goes back to the planner\'s own figures, which it works out the next time it draws the plan (until then every run uses today\'s pots, as a plan without the figures always has).',
      'A charge typed between the planner\'s steps of 0.05 lands on the nearest step, as the planner\'s own Save puts it.',
      'The draft of this step is text by box, kept in this tab with the other drafts and cleared on save, cancel or leaving the plan. No new browser key.',
      'Not yet: "Does it last?" as an editing step; the way of drawing and mix. Engine version unchanged (6.22.0).'
    ]
  },
```
