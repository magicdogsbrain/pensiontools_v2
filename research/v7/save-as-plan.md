# Save as a plan — from a V7 answer into a named plan (design, 1 Oct 2026)

Owner, 1 Oct 2026: "there needs to be a way to feed this user input into a plan but we must allow the user to name
the plan or name it something that could allow them to try something else — ie not 'my plan'. The auto naming of the
plan could include the retirement age and monthly amount maybe?"

## What the person sees

At the foot of every answer (C, A, B), under "What next?":

> **Save this as a plan**
> Name `[ Stop at 67 · £1,850 a month ]`  ← filled in, can be changed
> [Save as a plan]
> You can save as many as you like and compare them. Saving needs an account (or carries on in the guest trial).

After saving: "Saved as 'Stop at 67 · £1,850 a month'. Try something else and save that too." with a link to open it.

## The suggested name

Built from the answer, never "My plan". In today's money, whole £10s, at most 50 characters.

| Where | Pattern | Example |
|---|---|---|
| C, still working | Stop at {start age} · £{careful} a month | Stop at 67 · £1,850 a month |
| C, drawing now | From {age now} · £{careful} a month | From 62 · £1,400 a month |
| A | Stop at {shown age} · £{spend} a month | Stop at 60 · £1,800 a month |
| B | Stop at {age} · £{spend} a month · paying £{pay-in} | Stop at 62 · £2,000 a month · paying £950 |
| Couple | Stop at {you} and {partner} · … | Stop at 60 and 58 · £3,500 a month |

- A and B name the spend the person tried (a name describes the try, not a promise); C names the careful figure.
- If the name is already used, " (2)", " (3)" … is added at save time.
- The box can be edited; an empty name or one over 60 characters is refused with a plain message.

## Where the plan goes (until V7 has its own planner)

The plan is created in **today's planner** (v6), which has the detail: strategies, the stress test, the plan
document, the lock, the monthly record. V7 has no storage of its own yet, so:

1. V7 writes a **plan seed** (the checked inputs, the answer's key figures, the suggested name, the V7 version) to
   localStorage on the same site (pensiontools.uk serves both / and /v7/). **Never in the address bar** — no
   personal figures in URLs.
2. It opens `/#new-plan`. Today's app reads the seed, asks the person to sign in or carry on as a guest if needed,
   shows the name again to confirm, then creates a **new** plan (never overwrites one, never touches a locked plan),
   makes it the active plan, and deletes the seed. A seed older than a day is discarded.
3. A pure mapping, `src/services/PlanSeed.js` (`seedToScenario(seed, today)`), turns the seed into the plan:
   pot(s), ages, State Pension, final-salary pension, savings as ISA, risk level, the age you stop as the plan's first
   tax year, the monthly spend as the target, pay-ins into the saving section, couple → the partner's plan as today's
   app does it. Tested on its own; the created plan passes the schemaVersion checks.

## The figures in the plan

Today's planner tests the drawing years from a pot at the start. With money still going in, the plan starts from
the **middling pot** the saving years give at the stop age (recommended; using the careful pot and then testing
again would count the caution twice — the fault just fixed between A and B). The plan records "from £X at 67, a
middling case; £Y in a bad case" so the person sees both.

The planner's own stress test will not give exactly V7's figure (it does not vary the saving years). The plan says so
once, in one line. When V7's planner replaces today's, the figures become one.

## Tests

- Name builder: every pattern, couple, rounding, 50-char cut, duplicate suffix, never "My plan".
- seedToScenario: each field lands where today's app reads it; C/A/B seeds; single/couple; pay-in 0; already
  drawing; stop before 57 with savings; created plan passes migrations and the plan-corpus checks.
- Browser: save from C, A and B as guest and signed in (test account), two saves give two plans, the seed is gone
  afterwards, a locked plan is untouched, nothing personal in any URL.
- GDPR: a new kind of write to Firestore from a new entry point — checked against compliance/GDPR_TODO.md; the seed
  in localStorage is listed in the privacy policy's browser-storage line if it is not covered already.
