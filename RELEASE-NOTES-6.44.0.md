# Release 6.44.0 — the draft entry for `src/releases.js`

Road step 11a (research/v7/road-to-7.md step 11, the first half: the plan menu, the account page, the visitor, What's new,
the name). The entry below goes at the top of `RELEASES` in `src/releases.js`, with the version bump in `package.json`, when
the lead releases (neither file is changed on this branch).

```js
  {
    version: '6.44.0', date: '2026-10-27', engineVersion: '6.37.0',
    title: 'The shell for 7.0, first half: the plan menu on "Your plans" (rename, a copy, the main plan, download, open a downloaded copy, delete), an account page with sign-in, sign-up, "Download everything" and "Delete my account", the three free hours without an account in the preview with the hand-over on sign-in and the read-only example, What’s new as a once-only pop-up and a page, and the preview’s name: Drawdown Planner',
    summary: 'The preview at /v7/ is now called Drawdown Planner, and a person can do there what the planner’s plan menu and header did. "Your plans" (#/plans) has a menu on every row: Rename (one write of the name, made unique), Make a copy (as it is, or with the monthly records — a copy with records is locked from the start, as the planner’s Duplicate makes it), Make this my main plan, Download this plan (a file on your own computer; nothing leaves the page), and Delete, after a confirm that names the plan and says it cannot be undone — a second confirm for a locked plan — and never the last plan; under the list, "Start a new plan" (the front door: every plan begins from a question), "Open a downloaded copy" (the file is checked, given its own name with "(opened)", and kept as a plan of its own; any problem is said in words and nothing is kept) and, without an account, "Look around an example". "Your account" (#/account) shows the email and whether it is confirmed, sends the password-reset email, downloads everything in one file (every plan and your settings), and deletes the account after two confirms that name what goes — every plan, every monthly record, every budget, the sign-in itself — exactly what the planner’s Delete Account deletes, one document at a time; signed out, it is the sign-in, sign-up and forgotten-password forms in plain words, with Google, and the same "Confirm your email" gate as the planner. Without an account the preview now keeps the planner’s three free hours (the same count, in this browser), the four reminders, and the stop when they are used up; the example plan to look around is read-only, does not count, and can be deleted; and after a sign-in made in the preview with plans in the window, "Bring in what you built without an account?" copies them into the account. What’s new pops up once after a sign-in or a visitor’s start with the releases not yet seen, and "What’s new" at the foot of every page lists every release. The planner itself is unchanged but for two corrections below.',
    changes: [
      'Preview, "Your plans": a menu on every row — Rename (a box on the row; the name made unique against the account’s other names; a locked plan may be renamed, its name being outside the lock), Make a copy (the question "as it is, or with the monthly records?" on a plan with records; the copy named "{name} (copy)", never the main plan; with the records it is locked from the start, "copied with records"), Make this my main plan (the old main plan’s flag off, this one’s on — nothing else written), Download this plan (the plan as a file, identity stripped, named "{name}-{date}.json"), Delete (a confirm naming the plan and "This cannot be undone."; for a locked plan a second confirm naming the lock; the last plan is never deleted; if the plan was the main one another becomes main first). Every write is the one write file’s, through the same declared paths and lock guard as every other; the delete is the preview’s first and only delete of a plan.',
      'Preview, "Your plans", under the list: "Start a new plan" leads to the front door (every plan begins from a question, kept from its answer: no blank plan is made); "Open a downloaded copy" takes a file this page or the planner downloaded — its id, account and flags are never trusted, nor its links to other plans (a partner link or a shared budget’s source: the opened copy stands alone until it is linked here), it is brought up to date and checked, made a plan of its own by the copy’s rules and named "{name} (opened)"; a file that is not a plan, one too big to be a plan (refused before it is read), or one that holds a plan with a problem, is refused in words and nothing is kept.',
      'Preview, "Your account" (#/account), signed in: the email and "Email confirmed", "Send me a password-reset email" (the planner has no in-app password change: the reset email is the way), "Download everything" (one file, drawdown-planner-everything-{date}.json: every plan identity-stripped and your settings), "Delete my account" (two confirms on the screen that name what goes; then every plan, the settings document and your fund-suggestion rows deleted one by one, this site’s browser storage cleared, the sign-in deleted; if the sign-in needs a fresh sign-in first, the page signs you out, says the data is already gone, and asks you to sign in again and press once more), "Sign out", the privacy policy.',
      'Preview, "Your account", signed out: sign in with email and password or Google, create a free account (the confirmation email is sent; the plans stay closed until it is followed — the same rule the server keeps), "Forgotten your password?" (its note reads "if there is an account for …" whether or not there is one: the form never says which emails have an account); the "Confirm your email" gate with "I’ve confirmed", "Send it again" and "Sign out" — the planner’s own screens in plain words, the service’s reasons in plain words. The password lives in its box and nowhere else. The idle sign-out after an hour across windows is as before.',
      'Preview, without an account: the three free hours (the planner’s own count, GuestMeter.js, kept in this browser: a minute counts while the page is shown and you were active, and only while plans of your own are in the window — the preview’s answers do not count), the four reminders at the planner’s milestones (a line, then a box with the two ways in), the banner line on "Your plans" with the one rule and the hours used, and the stop on every page but the account page once the hours are used up: "Your 3 free hours are used up — sign in to keep going".',
      'Preview, "Look around an example" on "Your plans" and the front door for a visitor: the planner’s example plan (£1,000,000, retired, £40,000 a year rising with prices) made in this window, its row and its page headed "Example — look around" (the planner’s own name for it stays in storage, so both apps know it), read-only (nothing on it can be changed; a copy of it is your own), not counted in the three plans, deletable. A signed-in person gets it as an ordinary plan, as the planner’s link does.',
      'Preview, after a sign-in or a sign-up confirmed in the preview with plans of your own in the window: "Bring in what you built without an account?" — each plan copied into the account as the planner’s hand-off copies it (named "… (from this window)"; the first made the main plan only when the account was empty; a couple made in the window arrives as a couple, each plan naming the other by the id the account gave it), the window’s list then without them; "No, leave them here" keeps them in the window.',
      'Preview, What’s new: the once-only pop-up after a sign-in or a visitor’s start, following the planner’s rules (the announced releases newer than the highest version seen — the mark in this browser or the account’s, whichever is higher; a new account and a first visit are marked seen without a pop-up); "Got it" marks this version seen in this browser and in the account; the page #/whats-new, linked from the foot of every page as "What’s new (version 6.44.0)", lists every release with what changed, the corrections, how it affects your plans part by part, what you may need to do and the notes, then the history before release notes; reading it marks seen.',
      'Preview, the name: "Drawdown Planner" in the page title, the heading and the footer; the "Preview of the next version" line stays. The planner’s own name, manifest and root address are unchanged (the switch is 7.0.0).'
    ],
    corrections: [
      'Planner and preview: "keep this work" from guest mode copied the read-only example plan into the new account as a read-only plan (GuestMeter.handoffPayload). The example is never handed over now; only plans of the person’s own are.',
      'Planner and preview: Duplicate on the example plan made another read-only example (the flag was carried into the copy) with the example’s "it cannot be changed" description. A copy is the person’s own plan now (services/PlanCopy.js, which the planner’s Duplicate uses too).'
    ],
    effects: {
      stress: ['None. Nothing on the plan menu or the account page writes a Stress setting; a copy is made by the planner’s own Duplicate rules (the charges and ISA-growth defaults of an unlocked copy as before).'],
      strategies: ['None. The strategy block is carried as stored on every copy and every opened file, exactly as the planner’s Duplicate carries it.'],
      decision: ['None. A locked plan’s Decision settings are never written by the menu: Rename and "Make this my main plan" touch the name and the flag only (outside the lock, as the planner’s own guard has them); Delete removes a locked plan only after two confirms, as the planner’s Delete does. A copy with the records is locked from the start ("copied with records"), as the planner’s Duplicate makes it — and, by the planner’s own rule, so is a copy "as it is" of a plan with a tax year set up (the set-up year counts as a record).'],
      household: ['None. A copy keeps the partner link, as the planner’s Duplicate does (one-sided: the partner’s plan still names the original until it is linked to the copy); an opened file’s partner link and shared-budget source are dropped (the file’s ids are not this account’s); a deleted partner plan leaves the other plan’s link pointing at nothing, as before. A couple brought in from the window is linked to each other’s new ids in the account.'],
      accumulation: [],
      budget: ['None. The budget is carried as stored on every copy and every opened file; "Delete my account" deletes it with the plan, as the planner’s Delete Account does.']
    },
    actions: [],
    notes: [
      'Retired from the preview (road-to-7.md step 11; the parity ledger’s row acct.admin): the administration panel — owner only; it stays on the classic page.',
      'Not in the preview (the ledger’s row acct.delete says so): the planner’s "Reset" (every plan deleted, the account kept). Delete the plans one by one, or the account; the planner’s Reset stays on the classic page.',
      'A locked plan is never changed in the preview. Deleting one after its two confirms is the planner’s own rule and allowed; renaming one and making it the main plan touch the name and the flag only, which the planner’s guard leaves outside the lock. Nothing is deleted automatically, anywhere; no delete offers Undo (the confirm says so).',
      'The preview’s only deletes: one plan after its confirm (one deleteDoc of users/{uid}/scenarios/{id}), and the account’s own deletion, document by document, after two confirms. The boundary test pins the files that may say so and counts their call sites; setDoc, writeBatch and runTransaction appear nowhere the preview can reach.',
      'Open a downloaded copy reads the file on the page and never sends it anywhere; the plan it holds is kept by the copy’s rules (the records carried and the copy then locked; the document left behind), so a downloaded locked plan comes back locked and ready for a new version of its document.',
      'What’s new in the preview shows each release’s notes as written in src/releases.js; the planner’s per-plan bullets are not drawn there. The release notes are quoted as written: the preview’s own words keep to its language guide, the quoted notes keep theirs.',
      'The visitor’s count is the planner’s own, in this browser: time spent in the planner as a guest and time spent in the preview with a plan in the window add up to the same three hours.',
      'Engine unchanged (6.37.0): nothing here changes a figure.'
    ]
  },
```

## Decisions taken

The brief for 11a ruled on most points; these are the ones taken beyond it while building, each the owner can overturn.

1. **"Sign in" on "Your plans" is the preview's own account page** (`#/account`), no longer the hand-over to the planner's
   `?signin=1` door. The door itself keeps working (the OpenPlace `signin` place is untouched) for anything that still uses it.
2. **A copy "as it is" of a plan with a tax year set up is still locked.** The planner's `duplicateScenario` counts a set-up
   tax year as a record (`taxYears[].yearSetupComplete`) and locks the copy; the rules were lifted as they are
   (`services/PlanCopy.js`), so the two apps make the same copy. The copy box's words say "a copy as it is starts with no
   monthly records" (not "unlocked"), and the toast says "with the records, locked" when that is what it became.
3. **A copy of the example plan is the person's own plan** (its `example` flag and its "cannot be changed" description are
   dropped) — a correction in the note: the planner's Duplicate used to make another read-only example.
4. **"Make this my main plan" writes `isActive` alone**, with no `lastModified` stamp, as the planner's
   `setActiveScenarioDoc` does — so the list's order (most recently changed first) does not move with the flag.
5. **A deleted main plan's heir** is the first other plan that is not the example (the planner takes the first other plan).
6. **The opened file is kept by the copy's rules** (`copyOf` with the records carried): a downloaded locked plan comes back
   locked ("copied with records") with its document left behind, ready for "Write the new version"; the file's `id`, `uid`,
   `example` and `isActive` are stripped before anything else is read.
7. **The example on the front door** is a line under the six questions, drawn for everyone (the front door does not know who
   is signed in): a visitor gets the read-only example in the window; an account gets an ordinary plan, as the planner's
   `?demo=1m` link gives a signed-in visitor.
8. **The visitor's meter counts only while plans of the person's own are in the window** and nobody is signed in — never on the
   question pages (the parity ledger's note for ways.guest-trial: the preview's answers do not count), never for the example
   alone. The stop is drawn on every page but the account page (the way out) while nobody is signed in and the hours are used
   up, as the brief says; its box offers the account page alone (an earlier draft also linked to the questions, which the same
   stop covers — the words promised what the overlay denied). If the owner would rather the questions stayed usable once the
   hours are gone, the stop can be drawn on the plan pages only: one line in `state/select.js guestView`.
9. **The hand-over's mark is "(from this window)"** in the preview (the planner keeps its "(from guest)": `handoffPayload`
   gained a suffix argument), because the preview never says "guest". After the hand-over the window's list is written
   without the plans brought in (the example stays) — one setItem, never a removeItem.
10. **"Reset" is not in the preview** (the planner's "delete every plan, keep the account"); the ledger row acct.delete is
    built for the account's deletion and says so. Deleting plans one by one does the same.
11. **The account's settings document is read with `getDocs` of the profile collection** (no `getDoc`: not among the
    allowed names) and written with the account effect's one `updateDoc`; a document that does not exist yet is left alone
    (no `setDoc` anywhere V7 can reach), as the brief says.
12. **The screen checks leave the shell's own boxes and the quoted notes be:** `tests/v7/render/checkScreen.js` (R1, R7, R11)
    and `e2e/helpers/app.js` (lookOver) skip `[data-shell-box]` boxes (the account forms, the rename box, the file box — each
    still labelled) and `[data-quoted]` text (the release notes as written, which carry the planner's own words and braces).
13. **The pinned drawings were re-pinned once** (`V7_PIN_TODAY=1 V7_PIN_SCREENS=1`, `tests/v7/screens/apart.test.js` §7), as at
    6.39.0, because the product's name is on every screen; the header's account link, the footer's What's new link and the
    front door's example line are taken out before hashing, as "Your plans" was.
14. **The browser specs' key allow-lists widened** (`e2e/plan.spec.js`, `e2e/crawl.spec.js`): the preview now writes the
    planner's own `pt_lastSeenVersion` (a first visit is marked seen silently) and `pt_guest_minutes` / `pt_guest_nag_level`
    (the meter) by design; the stored plans are still byte-identical.
15. **The night run's rule** in `tests/v7/e2eRules.test.js` expects the 150-minute cap the workflow has carried since
    38a97067 (the rule still said 60 and failed at HEAD); main made the same change in 34ee4ff1, and the branch carries main's
    wording for the header comment and the rule's title letter for letter, so the merge applies clean — only the file list is
    the branch's.
16. **`tool-names` on the front door lets "Drawdown Planner" through** (`src/v7/copy/banned.js`), as it let "PensionTools"
    through — a change to the list, for the owner to sign off.
17. **The example plan is deletable** (the brief's section C), not refused as its section A's "never the example" would have
    it: the planner's own `deleteScenario` has no example check, and a visitor who has looked around should be able to clear
    it. `planWrite.js remove` takes it (`allowExample: true`), the heir is never the example, and `plans.test.js` pins it. To
    rule the other way: drop `allowExample` there (`placeOf` then refuses with 'example', whose words exist), take the Delete
    button off the example's row in `PlansScreen.jsx`, and flip the test.
18. **The hand-over is offered on every way the session becomes 'in' while the page is open**, not only on the listener's
    sign-in: `planSource.js` watches `session/set` (nobody or unverified → in) rather than `onAuthStateChanged`, because a
    sign-up followed by "I've confirmed" sets the session from the account effect and Firebase does not call the listener
    again for the same user — the stop's and the firm reminders' own way in. A page opened already signed in is never offered
    (its first known session), as before. The planner's `importGuestHandoff` runs from its auth-success callback, which its
    verify gate also reaches, so this is parity.
19. **The reducer insists on the row's confirm before a delete**: `plan/delete` is taken only while `ui.action` is the
    delete confirm open on that very plan, and for a locked plan only at its second step — the screen rule is now the
    state's, pinned in `plans.test.js` and the boundary test beside the account's two-confirm pin.
20. **"Open a downloaded copy" refuses a file over 4 MiB before reading it** (`planWrite.js OPEN_FILE_MAX_BYTES`: a plan is
    at most one Firestore document of 1 MiB, written with spaces) in its own words ('fileTooBig'), and drops the file's links
    to other plans (`household.partnerScenarioId`, `budgetTool.sharedFrom`): the file's ids are not this account's. A copy
    made on the page keeps its partner link, as the planner's Duplicate does — the note's household line said the opposite
    and is corrected.
21. **A couple brought in from the window is re-linked**: `bringIn` makes the partner first and the plan that names it with
    the id the account gave (as `createInAccount` makes a couple); a pair naming each other gets one write of the link after.
    The planner's own hand-off (`importGuestHandoff`) leaves the window's ids in place; it is not changed here.
22. **The example's row and page are headed by its tag**, "Example — look around", not the stored name (the planner's
    "r/FiredUK — £1M, £40k rising" breaks the banned list's money-short rule and is not plain English); the name stays in
    storage so both apps recognise the plan. Renaming the demo for both apps is the owner's call.
23. **The forgotten-password form never says which emails have an account**: the service's `auth/user-not-found` on the
    reset email is told as done, so the neutral note "If there is an account for …" is what is shown either way.
24. **The done-toast's close button is "Close"** (`PLAN.page.close`), not "Not now": a report of something done is not a
    thing to decline.
