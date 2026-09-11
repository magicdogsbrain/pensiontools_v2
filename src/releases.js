/**
 * Release notes — the one record of what each version changed, what it corrected, how it
 * affects the plans users have already saved in each tool, and what they may need to do.
 *
 * This file is DATA the app renders (the once-only "What's new" pop-up and the What's new page)
 * and a CONTRACT the test suite enforces (tests/releases.test.js): the top entry's version must
 * equal package.json's version, so a version bump without notes — or notes without a bump —
 * fails the build. See RELEASING.md for the checklist.
 *
 * Entry shape (newest first):
 *   version        'x.y.z' — the app version (package.json). Patch releases (z > 0) are listed
 *                  on the page but do not pop up unless `announce: true`.
 *   date           ISO date the release went live.
 *   engineVersion  src/strategies/version.js ENGINE_VERSION shipped with it (pinned on plan lock).
 *   title, summary one line + one paragraph, plain English, no jargon.
 *   changes[]      what is new.
 *   corrections[]  what was wrong before and is now right — say so plainly.
 *   effects{}      per tool (TOOL_IDS): how a plan saved under the previous version now reads.
 *                  An empty array = "no effect"; say so rather than omitting the tool.
 *   actions[]      what a user may need to do (enter something new, re-run something, review a setting).
 *   notes[]        anything else: rules used, data notes, known limits still open.
 *   announce       optional override of the minor/major rule.
 *   affects(scenario, ctx) optional: plan-specific bullets for one saved scenario. MUST tolerate
 *                  any shape ({} included) — old plans predate most fields.
 */
import { ENGINE_VERSION } from './strategies/version.js';
import { deriveTiming } from './services/PlanTiming.js';

export const TOOL_IDS = ['budget', 'stress', 'strategies', 'decision', 'accumulation', 'household'];
export const TOOL_LABELS = {
  budget: 'Budget Planner', stress: 'Stress Tester', strategies: 'Strategies (compare & switch)',
  decision: 'Decision tool (monthly)', accumulation: 'Accumulation planner', household: 'Household (couples)'
};

const gbp = (v) => '£' + Math.round(+v || 0).toLocaleString('en-GB');

export const RELEASES = [
  {
    version: '6.11.2', date: '2026-09-11', engineVersion: '6.4.0',
    title: '"Tax saved" means tax-free money used, nothing else',
    summary: 'The History and monthly record compared the year\'s tax with the tax on your TARGET drawn entirely from the SIPP. Any month the SIPP draw fell short of the target for another reason — protection, the run-up before year 0, a month already paid — showed a "saving" that was not one (a September run-up month reported £1,462 a year saved with nothing tax-free in it). The comparison is now the money actually delivered this tax year, had all of it been taxable SIPP income: an ISA draw, a GIA slice or an UFPLS tax-free slice can save tax; nothing else can.',
    changes: [],
    corrections: ['"Tax saved" reported for months with no tax-free money in them.'],
    effects: { decision: ['The tax-saved line on new records is nil unless an ISA, GIA or tax-free slice was used; the recommendation and the tax due are unchanged. Old records keep the figure they stored.'], stress: [], strategies: [], household: [], budget: [], accumulation: [] },
    actions: [], notes: []
  },
  {
    version: '6.11.1', date: '2026-09-11', engineVersion: '6.4.0',
    title: 'The months before year 0 are the run-up, paid from your SIPP cash',
    summary: 'The app called the months before a plan\'s first tax year "bridge months" and their money "bridge cash", as if it were something separate. It is not: for a retiree who has already stopped work it is the same SIPP cash (a money-market fund such as CSH2) the cash years will use, and nothing bridges anything. They are now the "run-up" and the source reads "SIPP cash". The sums are unchanged.',
    changes: ['Stage chip, Decision alert, plan document, History source column and the tax-year setup now say "run-up" and "SIPP cash to the first April" instead of "bridge".'],
    corrections: [],
    effects: { decision: [], stress: [], strategies: [], household: [], budget: [], accumulation: [] },
    actions: [], notes: []
  },
  {
    version: '6.11.0', date: '2026-09-11', engineVersion: '6.4.0',
    title: 'State Pension: the monthly payment from the month it starts',
    summary: 'In the tax year your State Pension begins, the Decision tool and the tax-year setup used to spread the year\'s partial total over twelve months — £402 a month for a pension that actually pays £997 from November. Now the months before the start show nothing from it and the SIPP covers the gap; from the start month the full monthly payment arrives and the SIPP draw drops. The year\'s tax still uses the true partial total.',
    changes: ['Monthly recommendation: State Pension shown as the amount actually received that month.', 'Tax-year setup: the confirmation says "£997/month from 9 November 2026 — the months before it are drawn from the SIPP".'],
    corrections: ['First-year State Pension was averaged over twelve months.'],
    effects: { decision: ['Only the tax year in which your State Pension starts changes, and only the split between SIPP and State Pension month by month. Later years are unchanged.'], stress: [], strategies: [], household: [], budget: [], accumulation: [] },
    actions: [], notes: []
  },
  {
    version: '6.10.5', date: '2026-09-11', engineVersion: '6.4.0',
    title: 'Pasting gilts, and reconciling a ladder that is already running',
    summary: 'From the retrospective-adopter walk-through: pasting a gilt ladder into My funds could make the settings save fail outright, a pasted gilt whose code had to be guessed did not match its rung, and the Transition tab told a running plan it had "1 month to go".',
    changes: ['Transition on a plan already running: the schedule is spread over the next six months (a reconcile), and a future retiree\'s deadline is the retirement month.', 'Paste holdings on a draft plan that has been stress-tested but not locked: rungs are matched against the last run\'s order sheet.'],
    corrections: ['Applying a paste could leave empty fields on a holding that the database refuses, and the whole Settings save failed with "Failed to save stress data". Fixed.', 'A pasted gilt known only by name (or a guessed code such as T31) now matches its rung by maturity year, so it reads as held rather than as a sale plus a purchase.'],
    effects: { stress: ['If a save failed after a paste, paste again — it saves now.'], strategies: [], decision: [], household: [], budget: [], accumulation: [] },
    actions: [], notes: []
  },
  {
    version: '6.10.4', date: '2026-09-11', engineVersion: '6.4.0',
    title: 'Locking commits the whole plan to the Decision tool',
    summary: 'Found by walking seven made-up people through the stages. The big one: locking from the Stress tester froze the settings but never copied the plan\'s pots, floors, ISA and State Pension into the Decision tool, which kept the defaults it was created with — a £380k plan was judged "24% below target" against £500k floors. Locking now seeds the Decision settings from the Stress plan first. Three smaller ones with it.',
    changes: ['Transition tab stays available while the plan is Running (a plan locked and started the same day still has its ladder to buy; a running ladder needs reconciling now and then).'],
    corrections: [
      'Lock from Stress settings: the Decision tool now runs the plan as locked — pots, floors, ISA policy, State Pension, strategy, taxable account — not its defaults. Plans locked before this fix: unlock, then lock again from the Stress settings page.',
      'A locked, running plan no longer shows the "start the budget walk-through" banner.',
      'The where-you-are strip no longer calls a pot-strategy plan "bought by contract" in its first year (every cone is flat at year 0; the test now looks at the whole run).',
      'A "Tax Saved -£0.00" row no longer appears from floating-point dust.'
    ],
    effects: { decision: ['Plans locked from the Stress tester after this release run on the plan\'s own pot floors. Earlier locked pot-strategy plans: unlock and re-lock once.'], stress: [], strategies: [], household: [], budget: [], accumulation: [] },
    actions: ['If you locked a Pots & Valves, Buckets, Floor-to-age, Bridge & engine or Ladder & ratchet plan before today and the Decision tool shows pot minimums you never set: unlock (Decision → Settings), then lock again from Stress → Settings.'],
    notes: [],
    affects(scenario) {
      const ds = scenario?.decisionTool?.settings || {};
      const ss = scenario?.stressTool?.settings || {};
      if (!ds.locked || !Object.keys(ss).length) return [];
      const diff = ['equityMin', 'bondMin', 'cashTarget'].some((k) => +ds[k] > 0 && +ss[k] > 0 && Math.abs(+ds[k] - +ss[k]) > 1);
      return diff ? ['This locked plan\'s Decision pot floors differ from its Stress plan — unlock and re-lock from Stress → Settings to bring them in line.'] : [];
    }
  },
  {
    version: '6.10.3', date: '2026-09-11', engineVersion: '6.4.0',
    title: 'Retiring later: the month you retire, not just the tax year',
    summary: 'The plan\'s years are tax years, because the gilt ladder buys whole ones, but a person retires on a birthday. Someone 59 in September with an October birthday, retiring at 61, has plan year 0 in 2027/28 — and retires in October 2027, thirteen months away, not "in seven months". The Timing summary, the stage chip, the "committed, still saving" countdown and the Decision tool\'s gate now all use the retirement month; the ladder and the plan document keep the tax year.',
    changes: ['Timing summary for retire-later plans: "You retire in October 2027 at 61, 13 months away; the plan\'s year 0 is tax year 2027/28".', 'A plan locked while still saving stays "committed, still saving" until the retirement month, and the Decision tool opens that month, even if plan year 0\'s April has passed.'],
    corrections: ['The countdown and the Decision gate used 6 April of plan year 0, which for many people is months before they actually stop work.'],
    effects: { stress: ['Retire-later plans: the summary line changes; nothing in the numbers.'], decision: ['Committed-while-saving plans: entries open in the retirement month rather than the preceding April.'], strategies: [], household: [], budget: [], accumulation: [] },
    actions: [], notes: []
  },
  {
    version: '6.10.2', date: '2026-09-11', engineVersion: '6.4.0',
    title: 'Retiring later: the plan is priced on the pots you typed, not the defaults',
    summary: 'Found while walking new plans through the stages. On a plan created moments earlier, the Timing block projected the pots at retirement from the saved settings — which for a new plan are the £1m defaults — rather than from the pot typed into the form. A £180k saver was stress-tested as a £1.5m one. The block now reads the form as it stands, and the settings save re-derives the timing from the whole form (pots, ages, State Pension date) at the moment of saving.',
    changes: ['The Timing block re-renders when the State Pension date is typed, since that date sets the birthday the plan-start year is counted from.'],
    corrections: ['Retire-later plans saved before this fix may carry a wrong "pot at retirement". Open Stress → Settings and press Save once; the figure is recomputed from the form.', 'The plan-start year could come out a year late when the State Pension date was entered after the Timing block had rendered. Saving now recomputes it.'],
    effects: { stress: ['Retire-later plans only; already-retired plans are unaffected. After a re-save the cones and ladders price on the right pots.'], strategies: [], decision: [], household: [], budget: [], accumulation: [] },
    actions: ['If you have a plan with "I will retire at age X": open its Stress settings and press Save Settings once.'],
    notes: []
  },
  {
    version: '6.10.1', date: '2026-09-10', engineVersion: '6.4.0',
    title: 'Stage always shown; ladder CSV without pot targets; printable PDFs',
    summary: 'Three fixes from Chris: a plan whose next-step banner had been dismissed never got its life stage worked out (so the Accumulation tab stayed visible for a retiree and the chip said only "locked"); the Tax Years CSV carried Pots & Valves targets and a rebalance column for gilt-ladder plans; and the Decision PDFs printed the app\'s dark colours and its buttons, which came out illegible on an iPad.',
    changes: ['The plan chip names the stage: "🔒 locked · Bridge to the plan start · 7 months to go". Click it for why, and what the stage does to the tabs.'],
    corrections: [
      'The life stage is now worked out on every load, whether or not the next-step banner is dismissed. Retirees no longer see the Accumulation tab (its figures were derived from the Budget and My funds, never entered).',
      'Tax Years → Export CSV on a gilt-ladder plan: columns are date, paid from, SIPP draw, ISA draw, gilt ladder value, cash, total, tax and net. No targets, no rebalance.',
      'Download PDF (monthly record, tax year, plan document): black text on white, no buttons or delete controls, coloured only for good/bad verdicts.'
    ],
    effects: { decision: ['CSV and PDF exports of ladder plans change shape as above; pot-strategy plans are unchanged.'], accumulation: ['Hidden for retirees, as intended since 6.6.0.'], stress: [], strategies: [], household: [], budget: [] },
    actions: [], notes: []
  },
  {
    version: '6.10.0', date: '2026-09-10', engineVersion: '6.4.0',
    title: '"When could I retire?" — the quick spin for savers',
    summary: 'A new card at the top of the Accumulation planner. Type the income you want (or leave it to your income shape), pick the confidence you want, and it spins every age from next year to 75: your pension pot projected to that age from what you hold and pay in, then your strategy run from that age. The answer reads "at £40,000 a year you could retire at 61 with 90% confidence, or at 58 with 75%". Re-run it every year as the numbers move.',
    changes: [
      'Accumulation planner → "When could I retire?": income, confidence target, Spin. A table per age with the pot it was priced on, the chance the money lasts, years covered and the worst 12 months; the earliest age clearing your target is highlighted.',
      'Runs in the background worker with progress; 200 futures per age and every sixth history — a compass, not the full stress test. For the age you pick, set it in the Timing block and run the Stress tester proper.'
    ],
    corrections: [],
    effects: { accumulation: ['New card; nothing else on the tab changes.'], stress: [], strategies: [], decision: [], household: [], budget: [] },
    actions: ['Savers: make sure the Timing block has your age today and My funds has what you hold (paste it), then spin.'],
    notes: ['The income shape\'s steps are moved to start at each candidate age, so "£40k to 75 then £32k" keeps its shape whichever year you stop. A typed income is flat for life.']
  },
  {
    version: '6.9.0', date: '2026-09-10', engineVersion: '6.4.0',
    title: 'Paste your holdings from any platform',
    summary: 'Copy the holdings table from your platform\'s page or export — AJ Bell, HL, ii, Vanguard, a workplace scheme, anything — and paste it into My funds. The tool reads names, units, values and SEDOLs in whatever layout it finds, matches each line to the fund catalogue or to your plan\'s gilt order sheet, shows a preview you check, then merges into your holdings: lines you already have are updated, new ones added, lines missing from the paste are listed for you to remove if sold.',
    changes: [
      'My funds (Stress tester Settings): a "Paste holdings from your platform" button with a preview (pasted line, read as, units, value, match) and one Apply.',
      'Gilts are matched to the plan\'s order sheet by SEDOL, by code (TR30), or by maturity year and "index-linked"; funds by ticker then name; money-market funds as cash. Unrecognised lines are kept for you to categorise.',
      'Transition tab: "Paste my holdings" when the ledger is empty.',
      'Merges never touch other wrappers, and keep the cost and £/month you had entered on a line.'
    ],
    corrections: [],
    effects: { stress: [], strategies: [], decision: [], household: [], budget: [], accumulation: ['A pasted SIPP fills "pot today" and the proportions on the Accumulation planner.'] },
    actions: ['Open Stress tester → Settings → My funds → Paste holdings; pick the wrapper the paste belongs to; check the preview; Apply; Save Settings.'],
    notes: ['Everything is parsed in your browser; nothing pasted is sent anywhere. Per-platform CSV importers were considered and rejected: workplace pensions have no export, and DIY-platform formats drift — one layout-agnostic parser serves them all.'],
  },
  {
    version: '6.8.0', date: '2026-09-10', engineVersion: '6.4.0',
    title: 'Transition tool: from what you hold to the plan',
    summary: 'A new Transition tab, shown from "approaching retirement" until the plan starts. It takes the plan document\'s target — every rung of a gilt ladder in units plus the cash years, or the year-0 mix in pounds for a pot strategy — and diffs it against what you hold under My funds: buy, sell, already held, left alone. Then it lays the moves out on a dated schedule to the plan start (cash years first, near rungs before far ones, sales in tranches, new contributions before sales) and lets you tick each order off as you place it.',
    changes: [
      'Transition tab (Approaching, Committed-while-saving, Bridge, and Retired-designing stages): target, buy/sell/hold tables with tick-offs, a dated schedule, progress ("62% of the target is held; next: buy the 2031 rung"), and the assumptions the schedule makes (wrappers, tax on sales, gilt units, decision points).',
      'Gilts in My funds: enter the gilt code (e.g. TR30, TG36) with units and value; the tool matches rungs by code or SEDOL. A rung within 2% of its target counts as held.',
      'Retrospective adopters: a ladder that is already mostly held reads as a reconcile — top-ups and surpluses only.'
    ],
    corrections: [],
    effects: { stress: [], strategies: [], decision: [], household: [], budget: [], accumulation: ['The Transition tab reads the same ledger as the Accumulation planner; contributions entered there fund the schedule before sales.'] },
    actions: ['Lock the plan, then open Transition and enter what you hold under My funds (ticker or gilt code, value, units for gilts, wrapper). Tick each order off as you place it.'],
    notes: ['Nothing here places an order, and the pound figures are indicative — gilt prices and index ratios move daily. CSV import of platform holdings (AJ Bell first) is next.'],
    affects(scenario) {
      const locked = !!scenario?.decisionTool?.settings?.locked;
      const tf = scenario?.stressTool?.settings?.taggedFunds || [];
      if (locked && scenario?.planDocument && !tf.length) return ['This plan is locked with a plan document but has no holdings entered — the Transition tab will read everything as "to buy" until you enter what you hold.'];
      return [];
    }
  },
  {
    version: '6.7.0', date: '2026-09-10', engineVersion: '6.4.0',
    title: 'Holdings ledger: tickers in, proportions modelled — and a monthly pot record while you save',
    summary: 'Your holdings are entered once, under "My funds" in the Stress tester\'s Settings, and every tool reads the same list. Each line now carries its cost and the money going into it each month. The Accumulation planner shows what those holdings roll up to — so much in shares, bonds, diversifiers and cash — and projects a fourth line at your own mix, net of costs, beside the FCA bands. Multi-asset funds (LifeStrategy, HSBC Global Strategy) split into their parts. A plan locked while you are still saving now keeps the projected path in its plan document, and a one-line-a-month pot record reads against it.',
    changes: [
      'My funds: two new columns — cost (% a year) and £ a month going in. Optional; used for the "your mix" line and to say where new money lands.',
      'Fund catalogue: Vanguard LifeStrategy 20/40/60/80/100 and HSBC Global Strategy Cautious/Balanced/Dynamic split across shares and bonds by their mix.',
      'Accumulation planner: "What you hold" (proportions, cost, expected real return at long-run assumptions, contribution destinations); pot today filled from the ledger; the projection gains a "your mix" column.',
      'Accumulation planner: "Record this month\'s pot" — pension pot, ISA, taxable — with a "where you are" strip against the locked path once the plan is locked.',
      'Plan document: section 4b, "Getting there", the locked accumulation path; the where-am-I strip for savers reads the latest record against it; the arrival check uses it when the plan starts.'
    ],
    corrections: ['A LifeStrategy or Global Strategy fund used to count as one asset class. It now counts as its actual split, so the shares/bonds proportions and the engine\'s bond sub-weights are right for holders of multi-asset funds.'],
    effects: {
      stress: ['Plans holding a multi-asset fund under My funds: the bucket roll-up changes to the fund\'s real split (e.g. LifeStrategy 80 → 80% shares, 20% bonds), which can move the cones slightly. Single-class funds are unchanged.'],
      accumulation: ['A new "your mix" projection line when holdings are tagged; otherwise unchanged.'],
      decision: [], strategies: [], household: [], budget: []
    },
    actions: ['If you hold a multi-asset fund, check its ticker is in the catalogue (VLS80 etc.) so it splits; add cost and £/month to the lines you contribute to.'],
    notes: ['The planner models proportions of asset classes, never a fund\'s own return — a world tracker is a world tracker. Tickers matter again at the transition, where the next release turns today\'s holdings into the plan\'s target portfolio.'],
    affects(scenario) {
      const tf = scenario?.stressTool?.settings?.taggedFunds || [];
      const multi = tf.filter((f) => /^(VLS(20|40|60|80|100)|HSBCGS[BCD])$/i.test(String(f.ticker || '')));
      return multi.length ? ['This plan holds ' + multi.map((f) => f.ticker).join(', ') + ' — now split into shares and bonds; the roll-up and cones may move a little.'] : [];
    }
  },
  {
    version: '6.6.0', date: '2026-09-10', engineVersion: '6.4.0',
    title: 'The app knows where you are: saving, approaching, committed, bridge, running',
    summary: 'Every plan now has a life stage, worked out from your age today, the plan start and the lock — never asked. The stage decides which tools lead, which are frozen with the lock, and which do not apply (a retiree has nothing to accumulate). The next-step banner speaks for the stage, the plan chip shows it, and the plan document keeps the dated journey through the stages. A plan locked while you are still saving now waits for its start date before the Decision tool takes months, and checks the pot you arrive with against the pot it was priced on.',
    changes: [
      'Stages: Saving (more than five years out), Approaching (within five years), Committed while still saving, Bridge (retired, before the plan start), Running, and Retired-designing. The leading tools are underlined; tools frozen with the lock are dimmed; the Accumulation planner is hidden for retirees.',
      'Setup wizard: a new starting point, "I\'m already drawing my pension — pick up from here", for someone retired for a while: the plan starts this tax year with what you hold, then Stress → lock → Decision, with no back-filling.',
      'Decision tool: a plan locked while still saving takes no monthly entries before its start (record your pot on the Accumulation planner until then). The first month after the start runs an arrival check: if the real pot is more than 10% from the pot the plan was priced on, you choose between running the locked plan on what you have and unlocking to re-plan.',
      'Plan document: section 5, "Journey", lists each stage change with its date.',
      'Stress tester, retiring later: the Timing summary says that funds entered under "My funds" are today\'s holdings and set the starting mix only — the plan is priced on the pots at retirement.'
    ],
    corrections: [],
    effects: {
      stress: ['Nothing in the numbers. Locked plans already had a read-only Settings page; it is now also dimmed in the tab bar.'],
      accumulation: ['Hidden on plans whose Timing block says "already retired". Change the Timing block to bring it back.'],
      decision: ['Committed-while-saving plans: entries before the start are refused with the start date. Everyone else: unchanged.'],
      strategies: [], household: [], budget: []
    },
    actions: ['Check the plan chip next to the plan name: it now says which stage the app thinks you are in. If it is wrong, the Timing block in Stress → Settings is where the app reads it from.'],
    notes: ['Next: a holdings ledger shared by the Accumulation planner, the Stress tester and a transition tool that turns today\'s holdings into the plan\'s target portfolio by the start date.'],
    affects(scenario) {
      const ss = scenario?.stressTool?.settings || {};
      const locked = !!scenario?.decisionTool?.settings?.locked;
      if (!Object.keys(ss).length) return [];
      if (!(+ss.currentAge > 0)) return ['No age today on this plan, so its stage reads "Getting started" until you enter one in the Timing block.'];
      if (ss.retired === true) return ['Retired: the Accumulation planner is hidden on this plan' + (locked ? '; the stage is Bridge or Running depending on the plan start.' : '.')];
      if (ss.retired === false && locked) return ['Locked while still saving: the Decision tool waits for the plan start; record your pot on the Accumulation planner until then.'];
      return [];
    }
  },
  {
    version: '6.5.4', date: '2026-09-09', engineVersion: '6.4.0',
    title: 'Already taken this month\'s payment? Plan from next month',
    summary: 'The tool has always assumed you enter a month BEFORE its payment goes out: the recommendation is that payment, and "payments to come" counts it (April shows 12). If this month\'s payment has already been made, a new tick box on Monthly Entry moves the entry to next month: give the balances after the payment, and the tax-year setup asks for income and tax to date including this month. Labels now say "payments to come (incl. this month)" instead of "remaining months".',
    changes: [
      'Monthly Entry: "This month\'s payment has already been made — plan from next month" tick box (with a help tip on the month frame). March cannot roll into April — start with April\'s setup instead.',
      'Tax-year setup, History and Tax Years: "Remaining months" is now "Payments to come this tax year (including this month\'s)".',
      'Bridge year: the suggested target is the plan\'s first income step (the rate the bridge cash was sized for), with a note on how many of the payments to come the bridge cash covers.'
    ],
    corrections: ['The bridge-year suggestion spread the whole bridge cash over the months left, overstating the rate for anyone already part-way through the year.'],
    effects: { decision: ['No change to saved entries or recommendations. The tick box only sets which month you are entering.'], stress: [], strategies: [], household: [], budget: [], accumulation: [] },
    actions: ['If you recorded this month after its payment had already gone out: delete that entry (and its tax-year setup if it was the first), tick the box, and re-enter from next month with post-payment balances.'],
    notes: []
  },
  {
    version: '6.5.3', date: '2026-09-09', engineVersion: '6.4.0',
    title: 'History view: ladder plans no longer fall back to pot floors',
    summary: 'On a gilt-ladder plan, opening History before the Monthly Entry screen had drawn could still show glidepath targets and a "surplus" on a saved month. The record view now looks the plan\'s strategy up itself.',
    changes: [],
    corrections: ['History → a month\'s record: the strategy is resolved from the plan when the page opens, not from whatever the Monthly Entry screen last rendered, so contract strategies always get the ladder view (no pot floors, no rebalancing, source = cash bucket / bridge cash).'],
    effects: { decision: ['Ladder plans only; display only.'], stress: [], strategies: [], household: [], budget: [], accumulation: [] },
    actions: [], notes: []
  },
  {
    version: '6.5.2', date: '2026-09-09', engineVersion: '6.4.0',
    title: 'Tax-year page speaks plainly',
    summary: 'The Tax Years detail used payroll words that did not fit a pension: "Target annual salary", "Income before pension start", "Tax-Inefficient". They now say what they mean, and the tax already paid (entered in the mid-year setup) is shown.',
    changes: ['Tax Years → year detail: "Target income for the year (gross, all sources)", "Income received earlier this tax year", "Tax already paid on it (PAYE)" when entered, and the mode reads "Full target from the SIPP" or "Tax-efficient — SIPP to the basic-rate limit, ISA tops up".'],
    corrections: [],
    effects: { decision: ['Wording only; the figures and the recommendation are unchanged.'], stress: [], strategies: [], household: [], budget: [], accumulation: [] },
    actions: [], notes: []
  },
  {
    version: '6.5.1', date: '2026-09-09', engineVersion: '6.4.0',
    title: 'Tax-year page: no target mix for gilt-ladder plans',
    summary: 'The Tax Years page showed "This Year\'s Target Mix" — a Pots & Valves card — for plans on a gilt ladder, where there is no mix to keep. It is now hidden for contract strategies, as it already was on the monthly record.',
    changes: [],
    corrections: ['Tax Years → a year\'s detail no longer shows the target-mix / rebalance card for gilt-ladder plans (Full index-linked gilt ladder, Gilt ladder + rotation, Floor the schedule).'],
    effects: { decision: ['Ladder plans only: one card fewer on the Tax Years page. Nothing else changes.'], stress: [], strategies: [], household: [], budget: [], accumulation: [] },
    actions: [], notes: []
  },
  {
    version: '6.5.0', date: '2026-09-09', engineVersion: '6.4.0',
    title: 'Lock your plan and keep the plan document',
    summary: 'When you are happy with the stress test, press "Lock plan & create the plan document" on the Stress tester\'s Settings page. Your settings freeze for both tools, and the app writes the plan document: your age against the tax years, the income steps as a picture and a table, who pays each year, the strategy verdict and cones, the pots and the shopping list, the assumptions, and how the Decision tool will run it. It is kept as the record of what you committed to, and the Decision tool shows where you are against it each month.',
    changes: [
      'Stress tester → Settings: a Lock button beside Save. Locking saves, runs your strategy, freezes the settings for both tools and writes the plan document. The same lock the Decision tool applies on its first entry — one lock, one chip.',
      'Decision tool → new "Plan document" tab: a "Where you are" strip (plan year and age, the step you are on and the next one, this year\'s income so far against the plan, your pot against the plan\'s cone, the ladder position for gilt plans), then the document itself, with Download PDF and previous versions.',
      'Monthly Entry shows the same "where you are" line under each recommendation.',
      'Plans locked before this release: the Stress settings banner and the Plan document tab offer "Create the plan document now".',
      'Unlocking a plan now unlocks the Stress settings too and moves the plan document to previous versions; a new one is written when you lock again.'
    ],
    corrections: [
      'The Stress tester\'s settings and the strategy could be changed on a locked plan, so a locked Decision plan could quietly diverge from the Stress plan it was built on. Both are now frozen together; "Try a strategy" what-ifs still run.',
      'The plan-lock explainer said the Stress tester is never locked. It now describes the lock you can set yourself.'
    ],
    effects: {
      stress: ['Locked plans: the Settings page is read-only until you unlock (the banner explains what changes). Draft plans are unaffected.'],
      strategies: ['Switching strategy on a locked plan asks you to unlock or duplicate first.'],
      decision: ['Nothing changes in the recommendation. The new Plan document tab reads the document against your recorded months.'],
      household: [], budget: [], accumulation: []
    },
    actions: ['If your plan is already locked: open Decision tool → Plan document → "Create the plan document now", then download the PDF and keep it.', 'If you have not locked yet: finish the stress test, then press Lock on the Stress settings page.'],
    notes: ['The document is a snapshot: it does not change when markets, prices or the app move. Refresh it deliberately (the old version is kept) if you re-plan.'],
    affects(scenario) {
      const locked = !!scenario?.decisionTool?.settings?.locked;
      if (locked && !scenario?.planDocument) return ['This plan is locked but has no plan document yet — create it from the Plan document tab.'];
      return [];
    }
  },
  {
    version: '6.4.2', date: '2026-09-09', engineVersion: '6.4.0',
    title: 'Saved monthly records match the live screen for gilt-ladder plans',
    summary: 'The saved record and its PDF for a plan on a gilt ladder (or any contract strategy) no longer show Pots & Valves pot floors, a "surplus" or rebalancing moves, and the source reads "the cash bucket" or "bridge cash" rather than "sell bonds". Months before the plan starts are labelled bridge months.',
    changes: [
      'Saved records carry how the month was paid (contract strategy source and note) and whether it was a bridge month; the History view and PDF use them. Older records fall back to the plan\'s current strategy.',
      'Live recommendation in a bridge month on a ladder plan: the source is the bridge cash — nothing is sold, no rung is due yet.'
    ],
    corrections: [
      'The "tax saved" comparison for a plan with a State Pension or other income counted that income twice, inventing a saving of a few hundred pounds a month. Full-target-from-SIPP months now show no saving, as they should.',
      'History cards and PDFs said "Year 0" for a month before the plan started; they now say "Bridge year (plan starts 2027/28)".'
    ],
    effects: {
      decision: ['Ladder plans: re-download any monthly PDF — the pot-floor and rebalancing sections are gone and the source is correct. The recommendation figures are unchanged. "Tax saved" falls for plans with a State Pension or other income (it was overstated).'],
      stress: [], strategies: [], household: [], budget: [], accumulation: []
    },
    actions: [],
    notes: []
  },
  {
    version: '6.4.1', date: '2026-09-09', engineVersion: '6.4.0',
    title: 'Mid-year tax-year setup: tell it the tax you have already paid',
    summary: 'The tax-year wizard\'s mid-year step now takes the PAYE already deducted this year (from your payslips) alongside the income received. The tax still to come is then the year\'s total less what is paid — right for someone who has been drawing a pension since April. Left blank, the old assumption stands.',
    changes: [
      'Mid-year step: a second box, "tax already deducted on that income". It is saved with the tax year and the monthly recommendation\'s tax figure uses it too.',
      'The confirmation screen names the two modes plainly: "Full target from the SIPP" rather than "Tax-Inefficient".'
    ],
    corrections: [
      'For a retiree already drawing under PAYE, the mid-year setup assumed the income to date had been taxed on its own bands and so pushed the whole higher-rate band into the months left — overstating the tax to come by several hundred pounds a month and understating the expected take-home. The gross draw was never affected.',
      'In a partial first year, other income and the State Pension were counted in full on top of the income to date (which already held their earlier months) — a small double count of tax, now pro-rated to the months left.'
    ],
    effects: {
      decision: ['Tax years already set up are unchanged until you re-run the setup: Tax Years → the year → "Reconfigure via Wizard" lets you enter the tax paid.'],
      stress: [], strategies: [], household: [], budget: [], accumulation: []
    },
    actions: ['If you are setting up a mid-year first year and have been drawing since April: enter the PAYE to date from your payslip\'s "to-date totals" so the expected tax and take-home match what you actually receive.'],
    notes: []
  },
  {
    version: '6.4.0', date: '2026-09-09', engineVersion: '6.4.0',
    title: 'Your plan knows when it starts',
    summary: 'A new "When your plan starts" block at the top of the Stress tester settings: your age today, whether you have already retired or will retire at a given age, and the tax year your plan starts in. That start is saved with the plan and is year 0 for every tool — the gilt ladders, the cones, and the Decision tool — instead of being assumed to be "next April" every time the app was opened.',
    changes: [
      'Timing block in Stress tester → Settings: age today (shared with the Budget page), "already retired" or "retire at age X", and the plan start (this tax year or next 6 April for retirees; the year you reach the age for future retirees). The income steps start at the age you reach in that year.',
      'Retiring later: the pots you enter are today\'s. The plan is priced on the pots projected to retirement in today\'s money — from your Accumulation planner contributions at the middle band, or a figure you type in — and the gilt ladders say they are indicative, priced at today\'s real yields.',
      'Decision tool: tax years before the plan starts are bridge years. The tax-year wizard says so and suggests your bridge cash spread over the months left (or the plan\'s first step); the monthly view flags the bridge; "plan vs actual" leaves bridge months out of the comparison.',
      'Lump sums and one-off spends show the tax year their plan year means ("in year 1 · 2028/29"), so a year means the same thing everywhere.',
      'Duration shows the age it runs to, and moving the plan start keeps the end age constant.'
    ],
    corrections: [
      'The plan\'s first tax year was never saved and fell back to "the calendar year after today", so every plan silently moved a year later each 1 January — a gilt ladder built in 2026 for 2027/28 would have re-priced itself for 2028/29 on New Year\'s Day. It is now saved.',
      'The Decision tool counted plan years from a hard-coded 2026/27 in three places and from "the first tax year set up" in two others. It now counts from the plan\'s start everywhere, so a plan starting 2027/28 steps its income down in the right April and its pot tracks line up with the Stress tester.',
      'The State Pension\'s plan year is now the tax year its date falls in minus the plan start (exact), and its first-year share is measured against 6 April. The settings preview and the engine used to disagree about it for anyone not yet retired.'
    ],
    effects: {
      stress: ['Plans with an age today (from the Budget page or the setup wizard) get a saved start derived from it — for most that is the same next-April start as before, so nothing moves. Plans without an age today keep the old assumption until you enter one.', 'Anyone not yet retired: the State Pension lands in the right plan year in the preview and the run alike; the cones may move slightly where it did not before.'],
      strategies: ['Gilt ladders and rotation are priced for the saved start year — the same rungs as before for a plan starting next April, and no longer a year late after 1 January.'],
      decision: ['Plan year 0 is the plan\'s start. If your Decision tool history began in 2026/27 and your plan starts then too, nothing changes. If your plan starts later, months before it are now bridge months and the yearly targets, inflation chain and pot tracks are read from the right year.'],
      household: [], budget: ['Age today is shared with the Timing block — change it in either place.'], accumulation: ['Its projected pot now feeds the Stress tester when you say you will retire later.']
    },
    actions: ['Open Stress tester → Settings → "When your plan starts" and check three things: your age today, retired or not, and the start tax year. Save. Then check the income steps still start at the age you meant.', 'If you use the Decision tool and your plan starts after the current tax year, expect the tax-year wizard to call this year a bridge year.'],
    notes: ['Next: "when can I retire?" — sweep candidate retirement ages and show the confidence at each, with the earliest age that clears 90%.'],
    affects(scenario) {
      const s = scenario?.stressTool?.settings || {};
      const out = [];
      if (!Object.keys(s).length) { /* nothing set up yet */ }
      else if (!(+s.currentAge > 0)) out.push('This plan has no age today, so it keeps the old assumption (starts next April with the steps from age ' + (s.shapeAgeNow || 57) + '). Enter your age in the Timing block to pin it.');
      else {
        const t = deriveTiming(s);
        out.push('Plan start: tax year ' + t.firstTaxYear + '/' + String(t.firstTaxYear + 1).slice(2) + (t.mode === 'future' ? ' (retiring at ' + t.retireAge + ')' : ' (already retired)') + ' — the same next-April start as before unless you change it.');
        if (+s.shapeAgeNow > 0 && t.shapeAgeNow !== +s.shapeAgeNow) out.push('Your income steps were labelled from age ' + s.shapeAgeNow + '; the age you actually reach in that first plan year is ' + t.shapeAgeNow + ', so the steps now start there and each later step lands ' + Math.abs(t.shapeAgeNow - s.shapeAgeNow) + ' year' + (Math.abs(t.shapeAgeNow - s.shapeAgeNow) === 1 ? '' : 's') + (t.shapeAgeNow > s.shapeAgeNow ? ' earlier' : ' later') + ' in plan time. Check the step ages in Settings.');
      }
      const ty = scenario?.decisionTool?.taxYears || {};
      if (Object.keys(ty).length) out.push('Decision tool: plan year 0 is now the plan\'s start; tax years before it are bridge years.');
      return out;
    }
  },
  {
    version: '6.3.0', date: '2026-09-09', engineVersion: '6.2.1',
    title: 'Guest mode is a trial — and your guest work comes with you when you sign in',
    summary: 'Guest mode ("Just try it") now measures active use in this browser: gentle reminders along the way, and after three hours of use it stops until you sign in. Whichever way you sign in — from a reminder, the banner, or the stop — the plan, budget and settings you built as a guest are copied into your account. Nothing is lost.',
    changes: [
      'The guest banner shows how much of the three free hours you have used and offers two buttons: create an account and keep this work, or sign in to an existing one and keep it.',
      'Reminders at 15, 45, 90 and 150 minutes of active use (a tab left open does not count). The last two are a dialog you can dismiss.',
      'At three hours guest mode stops. Signing in (or creating an account) copies your guest plans into the account as "… (from guest)" — you are asked first.',
      '"Create a free account to keep it" used to wipe the guest plan on the way to sign-up. It now keeps it.'
    ],
    corrections: [],
    effects: { stress: [], strategies: [], decision: [], household: [], budget: [], accumulation: [] },
    actions: ['If you have been using guest mode: sign in once and take your work with you. It is the only way it is kept, and the only way we can support you.'],
    notes: ['The meter and the hand-off live in your browser only (see the privacy policy). Only signed-in users can be supported; guest mode remains a try-before-you-sign-in.']
  },
  {
    version: '6.2.7', date: '2026-09-08', engineVersion: '6.2.1',
    title: 'Cash years in the gilt ladders are priced honestly',
    summary: 'The "years funded from cash first" dial on the Full index-linked gilt ladder and Bridge & engine treated cash as holding its value. It now costs inflation minus 1% a year — the same assumption every other strategy already uses for cash — so a long cash run shows its true cost instead of looking free. The dial is capped at 5 and explains itself.',
    changes: ['The dial says what it is for (the first year or two, where no gilt matures in the right window) and is capped at 5.'],
    corrections: ['Cash set aside for year k now costs 1.01^(k−1) per £1 of need. Two cash years move the ladder\'s cost by well under 1%; fifteen would have been about 7% too cheap, with no index-linking.'],
    effects: {
      stress: ['Plans on the Full index-linked gilt ladder or Bridge & engine: the ladder cost and spare move slightly (a few hundred pounds on a typical two-year float); a plan set to more than 5 cash years is clamped to 5 next time you open its dials.'],
      strategies: ['The ranked table\'s "what you pay today" for those two strategies moves the same way.'],
      decision: [], household: [], budget: [], accumulation: []
    },
    actions: ['If you had set more than 3 cash years, look at the dial: it was never meant to be a cash-bucket strategy — Bridge & engine or Buckets in order model a large cash sleeve properly.'],
    notes: ['Engine version 6.2.1: a strategy\'s arithmetic changed.']
  },
  {
    version: '6.2.6', date: '2026-09-08', engineVersion: '6.2.0',
    title: 'Turn a lump sum into income, if you want to',
    summary: 'A lump sum pays for your income shape; it does not raise it. The strategies already use it (more rungs, bigger pots), but the income line only rises if you raise a step — and nothing said so. Under the picture each lump sum now says what it could support per year from its age, with a button that adds that to your steps.',
    changes: [
      'Under the income shape: "▲ £600,000 Sell the rental at 65 pays for the shape above — it is not added to it. Spread evenly over the 25 years left it could support about £24,000/yr more" with an "Add £24,000/yr to my income from 65" button.',
      'The button adds a step at that age (or raises the one already there) and every later step by the same amount. The lump sum stays in the plan as the money that pays for it. Today\'s money, no growth assumed — slightly cautious, and what the ladder strategies assume too.',
      'The same line says where the money lands that year — the ISA slice, the SIPP room, and the taxable account held as gilts (CGT-free) or shares (dividends and gains taxed) — because that is how the strategies grow and tax it while it waits to be spent.'
    ],
    corrections: [],
    effects: { stress: ['Nothing changes unless you press the button; if you do, your income shape rises and every strategy prices the higher schedule against the pot plus the lump sum.'], strategies: [], decision: ['If you raise the shape, the Decision tool\'s target follows on the next Stress save (draft plans) or your next tax-year set-up (locked plans).'], household: [], budget: [], accumulation: [] },
    actions: [],
    notes: []
  },
  {
    version: '6.2.5', date: '2026-09-08', engineVersion: '6.2.0',
    title: 'Income streams, lump sums and one-off spends on the income shape',
    summary: 'The income-shape picture now draws your income streams (rent, part-time work) as layers for their years, and marks each lump sum and one-off spend at the age it happens. Editing them refreshes the picture at once.',
    changes: [
      'Income streams appear as grey layers inside the bars for the years they run, like the DB pension.',
      'Lump sums (▲) and one-off spends (▼) are marked at their age with the amount and label. A lump sum is not income — it lands in your pots or taxable account and the strategies spend it over the years — so it is a marker, not a layer.',
      'Changing anything under Income streams & lump sums redraws the picture immediately.'
    ],
    corrections: ['Streams were counted in the schedule\'s guaranteed-income floor but not drawn, so the picture and the arithmetic disagreed.'],
    effects: { stress: [], strategies: [], decision: [], household: [], budget: [], accumulation: [] },
    actions: [],
    notes: []
  },
  {
    version: '6.2.4', date: '2026-09-07', engineVersion: '6.2.0', announce: true,
    title: 'The income shape shows its slopes — and never dips below your State Pension',
    summary: 'The income-shape picture now draws the slope of every step and animates to the new shape when you move a slider; the schedule can never fall below the guaranteed income of the year (State Pension, DB pension, other income); and an audit confirmed every engine, strategy and projection reads the same sloped schedule.',
    changes: [
      'Your income shape: bars follow each step\'s slope, a line traces the path over them, and both ease into place when you change a slider or tick "glide".',
      'A step is your TOTAL income for the year — State Pension, other pensions and the pot together — and the editor now says so. If a slope would take the shape below the guaranteed income that year, it is held there and a note tells you from which age.'
    ],
    corrections: [
      'The picture used its own flat-step arithmetic, so it ignored the slopes the engines were running (6.2.1 to 6.2.3).',
      '"Use as my plan\'s target" from the Budget page rebuilt the schedule with the same flat arithmetic, dropping the slopes on a plan re-seeded from the Budget. It now uses the engines\' compiler.'
    ],
    effects: {
      stress: ['Plans re-seeded from the Budget in 6.2.1–6.2.3 with sloped steps: the schedule was flat then and is sloped now — the Stress Tester and every strategy follow it. Plans whose slope dipped below the State Pension are held at that floor.'],
      strategies: ['Same as the Stress Tester.'],
      decision: ['The tax-year wizard suggests from the (now correct) schedule copy; recorded months are untouched.'],
      household: [], budget: [], accumulation: []
    },
    actions: ['Open Stress Settings → Your income shape once and look at the picture: it is now what the engines run.'],
    notes: ['Audit of every schedule consumer: both engines, the nine strategies, the drawdown and glidepath projections, the tax-year wizard, the couples check, the layered charts and the Decision copy all read the compiled schedule.'],
    affects(scenario) {
      const ss = scenario?.stressTool?.settings || {};
      const sloped = Array.isArray(ss.incomeSteps) && ss.incomeSteps.some((x) => x && ((+x.decline > 0) || x.glideToNext));
      return sloped ? ['This plan\'s steps carry slopes: check the picture in Stress Settings and re-save if the schedule looks flat (it was, if you re-seeded from the Budget).'] : [];
    }
  },
  {
    version: '6.2.3', date: '2026-09-07', engineVersion: '6.2.0',
    title: 'Hotfix: lump-sum amount box',
    summary: 'The one-off lump sum amount box under Income streams and lump sums lost focus after every digit (since 6.1.0 the row re-drew itself to update its "where it goes" note). The note now updates in place.',
    changes: [],
    corrections: ['Typing a lump-sum amount no longer stops after one digit.'],
    effects: { stress: [], strategies: [], decision: [], household: [], budget: [], accumulation: [] },
    actions: [],
    notes: []
  },
  {
    version: '6.2.2', date: '2026-09-07', engineVersion: '6.2.0',
    title: 'Hotfix: missing sub-tabs',
    summary: 'In 6.2.1 the Stress Tester, Budget and Strategies tabs lost their content and sub-tab ribbons; only the Decision tool showed its ribbon. A stray closing tag from removing the old spending control. Fixed within the hour.',
    changes: [],
    corrections: ['Removing the Decision tool\'s "Spending over retirement" control took one closing tag too many, nesting every later tab inside the Decision settings grid. A structure test now guards the tab panels.'],
    effects: { stress: [], strategies: [], decision: [], household: [], budget: [], accumulation: [] },
    actions: ['Reload once if a tab still looks empty.'],
    notes: []
  },
  {
    version: '6.2.1', date: '2026-09-07', engineVersion: '6.2.0', announce: true,
    title: 'Income steps with a slope; fairer cuts for Buckets in order',
    summary: 'The "Spending over retirement" control is gone: each income step now carries its own slope, so you say how fast each phase drifts down (or glides into the next). And Buckets in order now decides on spending cuts by looking at the whole pot against the whole plan track, not at a signal it triggered by design.',
    changes: [
      'Your income shape: every step has a slider — how much it falls each year in today\'s money (0 to 5%) — and a "glide evenly to the next step" tick box that walks the income down smoothly instead of a cliff. The preview and every strategy follow it.',
      'The separate "Spending over retirement" (level / declining) control has been removed from Stress and Decision settings. Plans that had "Declining with age" were converted to steps that reproduce the same curve exactly.',
      'Buckets in order + spending cuts: cuts now start when the whole SIPP has sat below the whole glidepath track for the configured number of months, and end when it is back above the track plus the recovery buffer — the same test the Decision tool applies for a Buckets plan.'
    ],
    corrections: [
      'Buckets in order draws from cash first by design, so the old "three cash draws in a row" test was always true and cuts fired on any dip below the growth floors. A test plan showed cuts in 83 of 100 futures and 394 of 396 months in the Lost Decade scenario — most of that was the rule, not the market.'
    ],
    effects: {
      stress: [
        'Plans on Buckets in order with spending cuts on: fewer cut months, so the Monte Carlo, Historical and Scenarios results improve; the "as configured" ranked comparison moves too (level footing is unchanged).',
        'Plans that used "Declining with age": your steps now show the drift explicitly (a step at year 5 falling 1% a year, level again from year 25). Numbers are identical; you can now change the slope.'
      ],
      strategies: ['Ranked figures move only for Buckets plans with cuts on. Nothing else changed.'],
      decision: [
        'Buckets plans: the monthly protection decision uses the same whole-pot test (a "below track" flag is now saved on each record; the streak starts counting from your next entry).',
        'A Decision copy of a "Declining" plan keeps its schedule (the curve is baked into it) and the tax-year wizard suggests the same figures as before.'
      ],
      household: [], budget: [], accumulation: []
    },
    actions: [
      'If you had "Declining with age", open Stress Settings → Your income shape and check the slopes are what you meant; adjust the sliders or tick "glide" where a cliff was never intended.',
      'Buckets in order plans with cuts on: re-run the Stress Tester to see the corrected results.'
    ],
    notes: ['Engine version 6.2.0: a strategy\'s arithmetic changed (Buckets in order protection).'],
    affects(scenario) {
      const out = [];
      const ss = scenario?.stressTool?.settings || {};
      if (ss.spendingMigratedFrom === 'declining' || ss.spendingProfile === 'declining') out.push('This plan used "Declining with age": its steps now carry that slope explicitly (same numbers).');
      if (ss.strategyId === 'buckets-in-order' && ss.disableProtection === false) out.push('This plan is Buckets in order with spending cuts on: its cut months will fall — re-run the Stress Tester.');
      return out;
    }
  },
  {
    version: '6.2.0', date: '2026-09-07', engineVersion: '6.1.0',
    title: 'Trustworthy comparisons',
    summary: 'A day of testing every Stress Tester tab and three years of the Decision tool found eight bugs and four traps. None crashed anything; several put the wrong number in front of you, and one quietly rewrote saved allocations. All fixed. The Decision tool itself was clean.',
    changes: [
      'Stress Settings keeps a saved allocation that is not a preset as "Custom — your saved split" (with the exact amounts) instead of snapping it to the nearest risk level. Pick a risk card only if you want to change it.',
      'Stress Settings shows the "age today" it uses (from the Budget page) under the State Pension inputs, and says when it is not set.',
      'Try a strategy, the survivor check and the care check run in the background worker, so the page no longer freezes for a minute.',
      'The Drawdown and Glidepath tabs start from the plan\'s own horizon.',
      'Saving now times out after 20 seconds, retries once, and tells you if it failed — instead of "Saving…" for ever.'
    ],
    corrections: [
      'Visiting the Drawdown or Glidepath tab changed the plan\'s horizon for everything that ran afterwards — the ranked comparison, Try a strategy, the couples check. A 30-year plan was compared over 35 years.',
      'For a plan saved on Buckets in order, the Pots & Valves row of the ranked table WAS Buckets in order (identical to the pound).',
      '"Worst 12 months" for the bought strategies (Floor the schedule, Ladder & Ratchet, Floor to an age) counted only the rungs bought — a year a lump sum or a DB pension paid showed as £0 or £28,000 on a plan whose income never dipped. It is now the income you actually receive.',
      'The risk summary read "chance of a cut after undefined" for Gilt ladder + rotation.',
      'The Historical tab on a contract strategy left a spinner running above the finished result.',
      'Switching plan left the previous plan\'s strategy card on the Monte Carlo tab.',
      'With no State Pension entered, the comparison used a £12,000 default from year 0 and said "State Pension only (from age N)" as if you had entered it. It now says it is an assumption, in the table and on every card.',
      'Zero amounts rendered as "£0.00"; the Decision tool\'s calculation reason read "Protection | Protection".'
    ],
    effects: {
      stress: [
        'The ranked comparison changes for plans with a lump sum, a DB pension, or an inherited pension (worst-12 figures rise to the real income), for plans saved on Buckets in order (the Pots & Valves row now differs), and for anyone who opened Glidepath or Drawdown before comparing (the horizon is now the plan\'s).',
        'Saved fund minimums that were not a preset are shown and kept exactly. If you saved Stress Settings since mid-August and had a custom split, check the Custom amounts — the earlier build snapped them.'
      ],
      strategies: ['Same as the Stress Tester: ranked figures move for the plans above. Nothing else about a strategy changed.'],
      decision: ['No numbers change. The calculation reason text is tidier.'],
      household: ['Survivor and care checks give the same answers, faster and without freezing the page.'],
      budget: [],
      accumulation: []
    },
    actions: [
      'Open Stress Settings once: if your allocation now reads "Custom — your saved split", the amounts shown are what was saved — keep them or pick a risk level.',
      'Re-run the Strategies overview if your plan has a lump sum, a DB pension, uses Buckets in order, or you had opened Glidepath before comparing.',
      'If your State Pension line says "assumed — none entered", enter your forecast date and weekly amount in Settings.'
    ],
    notes: [
      'Full findings, with the code locations and tests: research/qa-audit-7-sep-2026.md.',
      'Still open from that audit: Buckets in order with spending cuts on treats every month as a cash-draw month, so cuts hinge on growth alone (a modelling decision to make, not a defect); the CSV export was not exercised.',
      'Engine version unchanged (6.1.0): no strategy\'s arithmetic changed, only what is measured and shown.'
    ],
    affects(scenario) {
      const out = [];
      const ss = scenario?.stressTool?.settings || {};
      const pot = (+ss.equityMin || 0) + (+ss.bondMin || 0) + (+ss.cashTarget || 0) + (+ss.diversifierStart || 0);
      const presets = [[0.3, 0.45, 0.25], [0.5, 0.4, 0.1], [0.7, 0.25, 0.05]];
      if (pot > 0 && ss.allocMode !== 'funds') {
        const f = [(+ss.equityMin || 0) / pot, (+ss.bondMin || 0) / pot, (+ss.cashTarget || 0) / pot];
        const isPreset = presets.some((pr) => pr.every((v, i) => Math.abs(v - f[i]) <= 0.011));
        if (!isPreset) out.push('This plan\'s allocation (' + Math.round(f[0] * 100) + '/' + Math.round(f[1] * 100) + '/' + Math.round(f[2] * 100) + ') is not a preset: it now shows as Custom and is kept exactly.');
      }
      if (ss.strategyId === 'buckets-in-order') out.push('This plan uses Buckets in order: the Pots & Valves row in its ranked table was a copy of Buckets — re-run the overview to see the real comparison.');
      const lumps = (Array.isArray(ss.windfalls) ? ss.windfalls.filter((w) => w && w.amount > 0).length : 0) + (+ss.dbAmount > 0 ? 1 : 0);
      if (lumps) out.push('This plan has a lump sum or DB pension: the bought strategies\' "worst 12 months" figure now counts that income.');
      if (pot > 0 && !ss.spStartDate && !(+ss.spWeeklyAmount > 0)) out.push('No State Pension is entered on this plan: the comparison now says the £12,000-from-67 figure is an assumption.');
      return out;
    }
  },
  {
    version: '6.1.0', date: '2026-09-07', engineVersion: '6.1.0',
    title: 'Taxable accounts and lump sums',
    summary: 'Money held outside a pension or ISA is now modelled properly: an investment account you already hold, and lump sums that arrive during retirement (an inheritance, a house sale, a maturing policy) — including the tax each actually suffers and the limits on where the money can legally go. It reaches both engines and every strategy.',
    changes: [
      'Stress Tester settings: a "Taxable investments today" section — the balance, what it holds (shares, gilts, bond funds, mixed or cash), your tax band, relevant earnings, and whether to move £20,000 a year into the ISA (bed-and-ISA).',
      'Income streams and lump sums: each lump sum now says what it is (cash, an inherited pension, an inherited ISA) and, for cash, what its taxable part will be held in. Cash is routed through this year\'s ISA allowance and pension room; the rest stays taxable.',
      'The taxable account is drawn before the ISA (least tax-efficient money first), net of capital gains tax. Gilts held there are CGT-free, so a gilt account is close to tax-free while a share account is not.',
      'Decision tool: the monthly entry takes the taxable account\'s balance and cost; the tool sells from it before the ISA, works out the CGT with the £3,000 exemption tracked per tax year, and carries the cost forward to next month. Lump sums and bed-and-ISA are advice alerts — it never moves money silently.',
      'Every strategy sees the taxable account: the ladder and floor strategies now count it (and lump sums) as money that buys rungs, not only the Pots & Valves engine.',
      'The "?" help pop-ups on the settings forms work on hover and on touch.',
      'The Assumptions & data page lists the taxable-account rules.'
    ],
    corrections: [
      'The pension contribution cap for anyone already drawing a pension is £10,000 (the MPAA), not £60,000 — a lump sum can shelter far less into a SIPP than the previous build allowed.',
      'The ISA allowance was being used up to three times in one year (a lump sum\'s slice, bed-and-ISA and band-fill recycling each assumed a fresh £20,000). One allowance per tax year now.',
      'Lump sums were treated as fixed pounds while the form said "today\'s money". They now rise with inflation to the year they arrive (choose "level" for a fixed sum).',
      'Survivor check: an inherited pension stays a pension and an inherited ISA passes into the survivor\'s ISA. A 6 September build briefly pushed both into a taxable account.',
      'The taxable account\'s tax was calculated and then dropped from the totals; it is now in lifetime tax.',
      'The ladder and floor strategies ignored lump sums entirely (one-off spends were modelled, one-off receipts were not) — a bias against every ladder in the ranked table.',
      'With the ISA policy set to Hold, the plan was still moving money INTO the ISA (bed-and-ISA and a lump sum\'s ISA slice), locking spendable money in a pot it had promised not to draw. It no longer does.'
    ],
    effects: {
      stress: [
        'Plans with no taxable account and no lump sums are unchanged to the penny.',
        'Plans with a lump sum will show different numbers: the ISA slice once a year, the sum rising with inflation, and the taxable remainder taxed. Expect slightly lower wealth and a more realistic result.',
        'Plans whose ISA policy is Hold: bed-and-ISA is now ignored (the checkbox greys out) and a cash lump sum\'s ISA slice stays taxable. An inherited ISA still joins the held ISA.'
      ],
      strategies: [
        'The ranked comparison now credits ladders and floors with lump sums and an existing taxable account, so the order of strategies can change for plans that have either.'
      ],
      decision: [
        'Plans with no taxable account are unchanged. The two new monthly-entry boxes default to £0.',
        'Locked plans: nothing recorded is re-judged. The new boxes simply appear on your next entry.',
        'The tax-year wizard has a new optional box for capital gains already realised this year.'
      ],
      household: [
        'The survivor check routes an inherited pension and ISA into the right wrappers again; results for couples with a partner\'s pension or ISA may move.'
      ],
      budget: [],
      accumulation: []
    },
    actions: [
      'If you hold investments outside a pension or ISA, enter them in Stress Settings → Your pot → Taxable investments today, and say what the account holds.',
      'Decision tool users: enter the taxable account\'s balance and what it cost on your next monthly entry (the cost is pre-filled from then on).',
      'If you expect an inheritance or a house sale, add it under Income streams and lump sums with what it is and how the taxable part will be held.',
      'If your ISA policy is Hold, read the note under bed-and-ISA; if band-fill recycling is also on, decide whether you really want recycled money going into an ISA you will not draw.',
      'Re-run the Stress Tester and the Strategies overview to see the updated numbers for plans with a lump sum or a taxable account.'
    ],
    notes: [
      'Rules used: ISA £20,000 a year; MPAA £10,000; pension relief floor £3,600 gross; dividend allowance £500 (8.75% / 33.75%); savings allowance £1,000 / £500; CGT exemption £3,000 (18% / 24%); UK gilts exempt from CGT; inherited pension = beneficiary drawdown; inherited ISA = additional permitted subscription.',
      'Still open: gilts in the taxable account grow at the engine\'s bond return rather than the real-yield curve the ladders price on; losses are not carried forward; the history CSV export does not yet include the taxable-account columns.',
      'Engine version 6.1.0.'
    ],
    affects(scenario) {
      const out = [];
      const ss = scenario?.stressTool?.settings || {};
      const ds = scenario?.decisionTool?.settings || {};
      const windfalls = Array.isArray(ss.windfalls) ? ss.windfalls.filter((w) => w && w.amount > 0) : [];
      const hold = ss.isaDrawdownStrategy === 'hold';
      if (+ss.taxableStart > 0) out.push('This plan holds ' + gbp(ss.taxableStart) + ' in a taxable account: it is now drawn before the ISA and taxed on its dividends and gains (' + (ss.taxableMix === 'gilt' ? 'gilts, so CGT-free' : 'held as ' + (ss.taxableMix || 'shares')) + ').');
      if (windfalls.length) out.push('This plan expects ' + windfalls.length + ' lump sum' + (windfalls.length > 1 ? 's' : '') + ' (' + windfalls.map((w) => gbp(w.amount) + ' in year ' + (w.year ?? '?')).join(', ') + '): each is now routed through the ISA allowance and pension room, with the rest taxable.');
      if (hold && ss.bedAndIsa !== false && (+ss.taxableStart > 0 || windfalls.length)) out.push('The ISA is on Hold, so bed-and-ISA no longer happens for this plan and a cash lump sum\'s ISA slice stays in the taxable account.');
      if (hold && ss.bandFillRecycle) out.push('Band-fill recycling is on while the ISA is on Hold: recycled money lands in an ISA this plan never draws — review one of the two.');
      if (ds.locked) out.push('The Decision plan is locked' + (scenario?.strategy?.engineVersion ? ' (engine ' + scenario.strategy.engineVersion + ' at lock)' : '') + ': recorded months are not re-judged; the taxable-account boxes appear on your next entry.');
      return out;
    }
  }
];

// ---------------------------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------------------------

/** 'x.y.z' → [x, y, z], or null when it is not a plain semver. */
export function parseVersion(v) {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(String(v || '').trim());
  return m ? [+m[1], +m[2], +m[3]] : null;
}

/** Standard three-part compare: negative when a < b, 0 when equal, positive when a > b. */
export function compareVersions(a, b) {
  const pa = parseVersion(a) || [0, 0, 0], pb = parseVersion(b) || [0, 0, 0];
  for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pa[i] < pb[i] ? -1 : 1;
  return 0;
}

/** Announced = pops up once. Default: minor and major releases (patch 0); `announce` overrides. */
export function isAnnounced(rel) {
  if (!rel) return false;
  if (typeof rel.announce === 'boolean') return rel.announce;
  const p = parseVersion(rel.version);
  return !!p && p[2] === 0;
}

/** Announced releases newer than the version the user last saw (null/'' = never seen any). */
export function releasesSince(lastSeen, releases = RELEASES) {
  return releases.filter((r) => isAnnounced(r) && (!lastSeen || compareVersions(r.version, lastSeen) > 0));
}

export function latestRelease(releases = RELEASES) { return releases[0] || null; }

export { ENGINE_VERSION };
