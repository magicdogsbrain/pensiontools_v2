# Release-note bullets — batch A (budget, visitors, retirements)

For the next entry in `src/releases.js` (the version bump and the entry itself are left to the release). Plain English,
as the What's new page shows it. Source: research/v7/v6-usability-audit.md, section 1 (problems 6, 8, 9), 2.1, 2.3
and section 5 (decisions 6, 7, 8, 9), every one approved by the owner.

## changes

- Budget: the button into the plan is now "Use £X a month as my spending". It asks first and says what it replaces
  ("was £Y a month"), it changes one thing only — the plan's spending figure (the first step of your income shape, and
  the target both tools work to) — and it offers Undo for about 15 seconds afterwards. It still refuses on a locked plan.
- Budget: a "+10%" button beside it uses your budget with a tenth on top, for breathing room. It replaces the
  "Optional headroom" box.
- Budget: the page now says plainly what the budget does and does not do to the plan: "The budget is a guide. Only
  'Use as my spending' changes the plan." Age bands and one-off costs stay on the budget, for your eye.
- Budget, couples: "vs PLSA (couple)" now compares your household's whole spend with the couple standard, not one
  person's share.
- Visitors: "Just try it" starts a plan of your own (the setup wizard), and "Look around an example" opens the £1M
  example plan, which is read-only. Without an account you can keep up to three plans of your own in this browser
  window, still within the three free hours.
- Visitors: one rule, said the same way everywhere — "Kept in this browser window until you close it. Make a free
  account to keep it for good." The Budget's chip says "Kept in this window" for a guest.
- Landing page: one line at the top, "New: answer one question in about two minutes (preview)", links to the preview's
  questions.
- A new account and "+ New plan" go straight to the setup wizard.

## corrections

- Budget, couples: a blank "Change who pays over time" row (just added, nothing typed) counted as "from age 0, my
  share 0%" and wiped your share of the household budget. A blank or half-filled row is now ignored.
- Budget: three promises that never happened are gone from the words — that "who pays over time" fed the plan's
  per-year target automatically, that age bands lowered the plan, and that one-off costs reached it. None of them did;
  the code that would have sent one-offs to the plan was never called, and has been deleted.
- Budget: "Use as the start of my income shape" silently rewrote the Floor & Flex essentials as well as the spending
  figure. It no longer touches them.
- Visitors: the words contradicted each other ("nothing saved" beside "Saved ✓"); a guest was offered Delete Account,
  which could not work; and Reset as a guest showed "Welcome, Guest! Your account is set up". All three are fixed.
- Visitors: "Just try it" opened a stranger's £1M plan and emptied the window of any other guest plan. It no longer
  deletes anything.

## effects (per tool, on saved plans)

- Budget: a saved "Optional headroom" figure is no longer read (it stays in the saved budget, harmlessly; the CSV
  export no longer carries it, and an older export's headroom row is skipped on import).
- Budget: the words on the page change; the figures do not. Nothing in any plan moves until you press the button.
- Stress tester: the "Start from your Decision plan → Copy from Decision Tool" button is gone (one plan has one set of
  settings). The "Seeded from Decision Tool" note under it is gone with it.
- Decision tool: the "Start from your Stress Tester → Use ALL Stress settings / Copy target amount only" buttons are
  gone. Locking a plan still carries the Stress settings into the Decision tool, as before.
- All tools: a plan's tools follow its life stage — every tab is on for every plan. Plans saved with only one tool on
  now show both; nothing in them changes. The "⚙ Edit Tools" item in the plan menu, and the per-tool wizard it opened,
  are gone.
- All tools: the welcome tour is retired with nothing in its place.

## actions

- Budget: if you used "Optional headroom", press "+10%" beside the Use button instead (or set the figure yourself in
  Stress tester → Settings → Your income shape).
- Couples: open the Budget and check "Change who pays over time" — if a blank row was wiping your share, your budget
  total now reads correctly.

## notes

- The example plan cannot be changed; a guest who wants their own figures starts their own plan from the plan menu.
- An older plan link with ?demo=1m still works: a visitor sees the read-only example; a signed-in user gets the demo
  added to their account as an ordinary plan.
