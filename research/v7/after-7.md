# After 7.0: the three journeys the site exists for

7.0 put the question pages at the front of the site. Walking the site as real people do showed that only one journey
was ever finished: a first visit, without an account, answering one question. The other two journeys — keeping a plan
and coming back to it, and living on a plan month by month — break or send people away to the classic planner, and
none of them was ever tested signed in. This note sets out what the site is for, the journeys that follow from it, and
the releases that make each journey whole. Every example is fictional (Alex, Sam).

## 1. What the site is for

pensiontools.uk serves three kinds of visit, and most people move from one to the next over the years:

1. **Saving** (twenties to fifties): "Am I saving enough? How much do I need? What does 5% or 10% of my pay add up to,
   and when could I stop?" They want a ballpark in two minutes, in pounds a year and pounds a month, and a plan they can
   check in with once or twice a year.
2. **About to stop, or just stopped**: "When can I stop? Will it last? How should I take it?" They want a tested plan.
3. **Living on the plan**: "What do I draw this month? I have missed a few months — fill them in. How am I doing
   against the plan?" They come back every month. This is the visit that makes the site worth an account.

The site's name and its first page must speak to all three. "Drawdown Planner" speaks only to the third, and is jargon
to the first. The site is pensiontools.uk: its name on every page is **PensionTools**, with a plain line saying what it
does ("Plan your pension, from saving to living on it"). Drawdown is a word for the pages about drawing, not the name.

## 2. The journeys

**J1 — a first visit, saving.** The front page asks "What would you like to know?" and the questions are grouped by
where the person is: *Still working* (am I saving enough; when can I stop), *Stopping soon or stopped* (what is my pot
a month; will it last), *I have a plan* (your plans). "Am I saving enough?" gives the ballpark first: the pot to aim
for, what you pay in now and what that becomes, the % of pay that would be enough, in pounds a year and a month.

**J2 — keep it, sign in, come back.** "Keep as a plan" without an account offers to sign in or make an account, and
after signing in the person is on the plan they kept, at the step they were on — never on "Your account". A person who
is signed in and has plans, opening pensiontools.uk, lands where they left off (their last plan and step) with one
plain link to "All questions". The place is remembered per account (profile settings, no figures) and per window.

**J3 — living on the plan, month by month, in the new app.** On a drawing plan, "This month" is a step of the plan in
the new app: set up the tax year if it is not, see what to draw and from where, record the month, and — when months
are missing — fill them all in at once from the last recorded month (or the tax year's start) to now. History (plan
against actual) and the tax year's spreadsheet follow. The classic planner is no longer needed for any of it; when J3
is complete the classic planner can be retired.

## 3. The rule that was missing

Each journey is a browser test, run signed in against a local Firebase emulator (a "demo-" project that cannot reach
the live service), at desktop and phone widths. A release is not done until the journeys it touches pass end to end.

## 4. The releases

- **7.1.0 — Signed in, it works.** The emulator harness and signed-in journey tests; keep → sign in → back on the kept
  plan; a hand-over to the classic planner arrives signed in (the cause found and fixed); land where you left off;
  the name and the front page grouped by where you are.
- **7.2.0 — This month, in the new app.** Set up the tax year, what to draw and from where, record a month, fill in
  the missed months — the classic Month by month's own services reused, nothing worked out twice.
- **7.3.0 — History and the spreadsheet; the classic planner retires.** Plan against actual, the tax year's
  spreadsheet and the printed documents in the new app; the classic planner's link goes once nothing is left there.
