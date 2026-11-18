/**
 * The parity fixtures (lead4.md section 2, G2): fictional plans across the stages and shapes, made by the app's own code —
 * an answer kept through the keep path (answer → buildPlanSeed → plansFromSeed), changed by the plan pages' own patches
 * (lockPatch, holdPatch, checkInPatch, budgetPatch, monthRecordPatch, taxYearPatch, closeWrite/successorOf), or taken from
 * the saved-plan corpus (tests/fixtures/plans/, itself written by driving the app's repositories: build.mjs). Every person
 * and figure is invented (Alex, Sam, Jo, Pat, Kim).
 *
 * Importing src is allowed HERE: the parity sweep compares the two views with each other and holds no expected figure.
 * The same fixtures are read by unit tests (tests/reading/parityFixtures.test.js).
 *
 *   FIXTURES                    [{ key, label, subject, plans() }]: `plans()` gives fresh raw plan documents (as stored),
 *                               `subject` is the id of the plan the sweep opens (it is the active one)
 *   PARITY_TODAY                the one clock of both views: 16 November 2026, mid-morning in London
 *   SWITCH_FIXTURES             more accounts of several plans, for the plan switches only (not swept: the ratchet files
 *                               hold the sweep's plans)
 *   SWITCHES                    [{ key, fixture, from, to }]: plan `from` open in the full view, then `to` chosen from its
 *                               menu (e2e/parity/roundtrip.spec.js)
 *   fixtureNamed(key)           a fixture of either list
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { answerA } from '../../../src/answers/a/answer.js';
import { answerB } from '../../../src/answers/b/answer.js';
import { answerD } from '../../../src/answers/d/answer.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { plansFromSeed } from '../../../src/answers/keep/planCreate.js';
import { upgradeScenario } from '../../../src/firebase/scenarioMigration.js';
import { applyPatch } from '../../../src/answers/plan/about.js';
import { lockPatch } from '../../../src/answers/plan/lock.js';
import { runForDocument } from '../../../src/answers/plan/lastsRun.js';
import { holdPatch } from '../../../src/answers/plan/hold.js';
import { checkInPatch, checkInBoxesOf } from '../../../src/answers/plan/checkIn.js';
import { budgetPatch } from '../../../src/answers/plan/budget.js';
import { monthRecordPatch, taxYearPatch } from '../../../src/answers/plan/month.js';
import { getDefaultScenario } from '../../../src/services/PlanFromSeed.js';

/** 16 November 2026, mid-morning in London (e2e/scenarios/routes.js TODAY): both views run on this clock. */
export const PARITY_TODAY = '2026-11-16T10:00:00.000Z';
export const PARITY_DAY = '2026-11-16';

const HERE = dirname(fileURLToPath(import.meta.url));
const CORPUS = join(HERE, '..', '..', '..', 'tests', 'fixtures', 'plans');
const copy = (v) => JSON.parse(JSON.stringify(v));
const corpus = (name) => JSON.parse(readFileSync(join(CORPUS, name + '.json'), 'utf8'));
const noon = (day) => { const [y, m, d] = day.split('-').map(Number); return new Date(y, m - 1, d, 12); };
const ENV = (day) => ({ today: day, futures: 100, seed: 0, trace: false });
const ANSWER = { a: answerA, b: answerB, d: answerD };

/** An answer kept as a plan on `on` through the keep path: { yours, partner } as the store would hold them. */
function kept(q, inputs, { on, id, name, partnerId = null, payIn = 'now' }) {
  const result = ANSWER[q](inputs, ENV(on));
  const seed = buildPlanSeed({ source: q, result, env: { today: on, appVersion: 'parity' }, name: { chosen: name }, createdAt: on + 'T10:00:00.000Z', payIn });
  if (!seed) throw new Error(`parity fixture ${id}: question ${q} could not be kept`);
  const made = plansFromSeed(seed, { now: noon(on), first: true });
  const yours = { ...made.yours, id };
  const partner = made.partner ? { ...made.partner, id: partnerId || id + 'P' } : null;
  if (partner) yours.household = { partnerScenarioId: partner.id };
  return { yours, partner };
}

/** A plan brought up to date as both views read it on `day` (the upgrade the plan source runs). */
const upToDate = (plan, day = PARITY_DAY) => upgradeScenario(copy(plan), { now: noon(day) }).scenario;

function patched(plan, result, what) {
  if (!result || !result.ok) throw new Error(`parity fixture ${plan.id}: ${what} refused: ${JSON.stringify(result && result.errors)}`);
  return applyPatch(plan, result.patch);
}

/** The plan locked as the plan page locks it: the document built on the plan's own one test. */
function locked(plan, day) {
  const p = upToDate(plan, day);
  const run = runForDocument(p, { today: day });
  return patched(p, lockPatch(p, { now: noon(day), run, entries: [{ plan: p }] }), 'the lock');
}

function held(plan, lines, day) {
  let p = upToDate(plan, day);
  for (const line of lines) p = patched(p, holdPatch(p, { kind: 'add', line }, { today: day }), 'a holding');
  return p;
}

const active = (plan, on = true) => ({ ...plan, isActive: on });

// ---- the people, made up -------------------------------------------------------------------------------------------

const JO_A = { you: { age: 41, pot: 60000, payIn: { total: 500 } }, savings: 10000, stop: { kind: 'age', age: 60 }, spend: { kind: 'amount', amount: 2000 } };
const SAM_B = { household: 'single', you: { pot: 120000, age: 44, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'split', own: 375, employer: 250 } },
  stop: { age: 67 }, spend: { kind: 'amount', amount: 2200 }, endAge: 95 };
const PAT_B = { household: 'single', you: { pot: 210000, age: 52, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'split', own: 400, employer: 300 } },
  stop: { age: 63 }, spend: { kind: 'amount', amount: 2100 }, endAge: 95 };
const ALEX_MOVE = { household: 'single', you: { pot: 380000, age: 58, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'split', own: 500, employer: 400 } },
  stop: { age: 60 }, spend: { kind: 'amount', amount: 1600 }, endAge: 95 };
const KIM_D = { household: 'single', you: { age: 66, pot: 300000, taxFreeTaken: 'no' }, savings: 30000, spend: { kind: 'amount', amount: 2000 } };

const SIPP_LINES = [
  { wrapper: 'SIPP', name: 'Global equity index fund', ticker: 'VWRL', value: 230000 },
  { wrapper: 'SIPP', name: 'UK gilt index fund', value: 90000 },
  { wrapper: 'SIPP', name: 'Cash', value: 40000 },
  { wrapper: 'ISA', name: 'Global equity index fund', ticker: 'VWRL', value: 30000 }
];

/** The plans. Each `plans()` returns fresh copies; `subject` is opened by the sweep in both views. */
export const FIXTURES = Object.freeze([
  {
    key: 'saver-draft', label: 'a saver\'s draft, kept from "When can I stop?"', subject: 'ParSaverDraft',
    plans: () => [active(kept('a', JO_A, { on: PARITY_DAY, id: 'ParSaverDraft', name: 'Jo saving' }).yours)]
  },
  {
    key: 'saver-payin', label: 'a saver kept from the pay-in question a year ago', subject: 'ParSaverPayIn',
    plans: () => [active(kept('b', SAM_B, { on: '2025-11-12', id: 'ParSaverPayIn', name: 'Sam saving' }).yours)]
  },
  {
    key: 'saver-locked-pots', label: 'a saver locked on pots', subject: 'ParSaverLocked',
    plans: () => [active(locked(kept('b', PAT_B, { on: '2026-10-01', id: 'ParSaverLocked', name: 'Pat saving' }).yours, '2026-10-01'))]
  },
  {
    key: 'saver-locked-ladder', label: 'a saver locked on a gilt ladder (the corpus\'s saver, its way of drawing set to the ladder before the lock)', subject: 'ParSaverLadder',
    plans: () => {
      const p = corpus('05-saver-committed');
      delete p.planDocument; delete p.household;
      p.decisionTool.settings = { ...p.decisionTool.settings, locked: false };
      delete p.decisionTool.settings.lockedAt; delete p.decisionTool.settings.lockedBy; delete p.decisionTool.planOfRecord;
      p.stressTool.settings = { ...p.stressTool.settings, strategyId: 'full-il-gilt' };
      p.strategy = { ...(p.strategy || {}), id: 'full-il-gilt' };
      p.id = 'ParSaverLadder'; p.planDetails = { ...p.planDetails, name: 'Pat on a ladder' };
      return [active(locked(p, '2026-10-01'))];
    }
  },
  {
    // the same saver's ladder not locked yet: both views draw the order sheet of a plan still being made
    key: 'saver-ladder-draft', label: 'a saver\'s draft on a gilt ladder (the corpus\'s saver, its way of drawing set to the ladder)', subject: 'ParLadderDraft',
    plans: () => {
      const p = corpus('05-saver-committed');
      delete p.planDocument; delete p.household;
      p.decisionTool.settings = { ...p.decisionTool.settings, locked: false };
      delete p.decisionTool.settings.lockedAt; delete p.decisionTool.settings.lockedBy; delete p.decisionTool.planOfRecord;
      p.stressTool.settings = { ...p.stressTool.settings, strategyId: 'full-il-gilt' };
      p.strategy = { ...(p.strategy || {}), id: 'full-il-gilt' };
      p.id = 'ParLadderDraft'; p.planDetails = { ...p.planDetails, name: 'Jo on a ladder' };
      return [active(p)];
    }
  },
  {
    key: 'saver-checkin', label: 'a saver with a check-in recorded during a pause in paying in', subject: 'ParSaverCheckIn',
    plans: () => {
      const day = '2026-10-05';
      const p = upToDate(kept('b', SAM_B, { on: '2025-11-12', id: 'ParSaverCheckIn', name: 'Sam with a pause' }).yours, day);
      const typed = { ...checkInBoxesOf(p, { today: day }), 'ci.pension': '128000', 'ci.paused': 'yes', 'ci.pausedFrom': '2026-08' };
      return [active(patched(p, checkInPatch(p, typed, { today: day, now: noon(day) }), 'the check-in'))];
    }
  },
  {
    key: 'mover-holdings', label: 'a mover in the window, with what they hold listed line by line', subject: 'ParMoverHeld',
    plans: () => [active(held(kept('b', ALEX_MOVE, { on: '2026-06-01', id: 'ParMoverHeld', name: 'Alex moving' }).yours, SIPP_LINES, PARITY_DAY))]
  },
  {
    key: 'mover-totals', label: 'a mover in the window, with totals only', subject: 'ParMoverTotals',
    plans: () => [active(kept('b', ALEX_MOVE, { on: '2026-06-01', id: 'ParMoverTotals', name: 'Alex moving, totals' }).yours)]
  },
  {
    key: 'retired-draft', label: 'retired, a draft on pots, kept from "Will it last?"', subject: 'ParRetiredDraft',
    plans: () => [active(kept('d', KIM_D, { on: PARITY_DAY, id: 'ParRetiredDraft', name: 'Kim retired' }).yours)]
  },
  {
    key: 'retired-locked-pots', label: 'retired, locked on pots, the tax year set up and months recorded', subject: 'ParRetiredPots',
    plans: () => {
      let p = locked(kept('d', KIM_D, { on: '2026-08-03', id: 'ParRetiredPots', name: 'Kim on pots' }).yours, '2026-08-03');
      p = upToDate(p, '2026-09-10');
      p = patched(p, taxYearPatch(p, { 'mo.month': '2026-09', 'ty.toDate': '9000', 'ty.taxToDate': '600' }, { today: '2026-09-10' }), 'the tax year');
      for (const [month, day, equity, bond, cash] of [['2026-09', '2026-09-10', '190000', '70000', '36000'], ['2026-10', '2026-10-09', '192000', '70500', '33500']]) {
        p = upToDate(p, day);
        p = patched(p, monthRecordPatch(p, { 'mo.month': month, 'mo.mode': 'type', 'mo.equity': equity, 'mo.bond': bond, 'mo.cashT': cash }, { today: day, nowIso: day + 'T10:00:00.000Z' }), 'the month ' + month);
      }
      return [active(p)];
    }
  },
  {
    key: 'retired-locked-months', label: 'retired, locked, months recorded and the tax year set up (the corpus\'s running plan)', subject: 'ParRetiredMonths',
    plans: () => { const p = corpus('04-buckets-running'); delete p.household; p.id = 'ParRetiredMonths'; return [active(p)]; }
  },
  {
    key: 'retired-locked-ladder', label: 'retired, locked on a ladder with some gilts held', subject: 'ParRetiredLadder',
    plans: () => { const p = corpus('13-stopped-drawing-since'); delete p.household; p.id = 'ParRetiredLadder'; return [active(p)]; }
  },
  {
    key: 'retired-everything', label: 'retired with a final-salary pension, lump sums, an ISA and a general account', subject: 'ParEverything',
    plans: () => { const p = corpus('12-lumpy-db-gia'); delete p.household; p.id = 'ParEverything'; return [active(p)]; }
  },
  {
    key: 'couple', label: 'a linked couple: one saving, one retired', subject: 'ParCoupleSam',
    plans: () => {
      const ladder = corpus('20-locked-start-after-stop'), saver = corpus('10-couple-b');
      ladder.id = 'ParCoupleKim'; ladder.planDetails = { ...ladder.planDetails, name: 'Kim' }; ladder.isActive = false;
      saver.id = 'ParCoupleSam'; saver.planDetails = { ...saver.planDetails, name: 'Sam' }; saver.isActive = true;
      saver.household = { partnerScenarioId: ladder.id };
      ladder.household = { partnerScenarioId: saver.id };
      return [saver, ladder];
    }
  },
  {
    key: 'wizard-defaults', label: 'a plan made by the full view\'s wizard defaults (the corpus\'s fresh default)', subject: 'ParWizard',
    plans: () => { const p = corpus('01-fresh-default'); p.id = 'ParWizard'; return [active(p)]; }
  },
  {
    key: 'budget', label: 'a retired draft with a budget filled in on its budget page', subject: 'ParBudget',
    plans: () => {
      let p = upToDate(kept('d', KIM_D, { on: '2026-11-02', id: 'ParBudget', name: 'Kim with a budget' }).yours);
      const change = (c) => {
        const r = budgetPatch(p, [{ plan: p }], c, { today: PARITY_DAY });
        if (!r.ok) throw new Error('parity fixture ParBudget: the budget refused ' + c.kind);
        for (const w of r.writes) p = applyPatch(p, w.patch);
        return r.budget;
      };
      for (const [label, tier, amount] of [['Food', 'essential', 4800], ['Energy', 'essential', 2400], ['Council tax', 'essential', 2100], ['Holidays', 'discretionary', 3000]]) {
        const b = change({ kind: 'add', label, tier });
        change({ kind: 'line', id: b.lines[b.lines.length - 1].id, field: 'amount', value: amount });
      }
      return [active(p)];
    }
  },
  {
    key: 'closed-successor', label: 'a closed plan and the plan that follows it', subject: 'ParNext',
    plans: () => {
      const old = corpus('18-moved-to-new-plan'), next = corpus('18-moved-to-new-plan-next');
      const oldId = old.id, nextId = next.id;
      const text = (p) => JSON.parse(JSON.stringify(p).split(oldId).join('ParClosed').split(nextId).join('ParNext'));
      const a = text(old), b = text(next);
      a.id = 'ParClosed'; b.id = 'ParNext'; a.isActive = false; b.isActive = true;
      delete a.household; delete b.household;
      return [b, a];
    }
  },
  {
    key: 'age-only', label: 'a plan with nothing but an age', subject: 'ParAgeOnly',
    plans: () => {
      const p = getDefaultScenario('Just an age', '', ['stress', 'decision'], noon(PARITY_DAY));
      p.id = 'ParAgeOnly';
      p.stressTool = { settings: { currentAge: 50, currentAgeAsOf: PARITY_DAY } };
      return [active({ ...p, createdAt: PARITY_TODAY, lastModified: PARITY_TODAY })];
    }
  }
]);

/** Accounts for the plan switches only: two savers, each plan as the sweep's own fixture builds it, the first open. */
export const SWITCH_FIXTURES = Object.freeze([
  {
    key: 'two-savers', label: 'two savers, unlinked: Jo saving and Sam saving', subject: 'ParSaverDraft',
    plans: () => [...FIXTURES.find((f) => f.key === 'saver-draft').plans().map((p) => active(p, true)), ...FIXTURES.find((f) => f.key === 'saver-payin').plans().map((p) => active(p, false))]
  }
]);

/** The plan switches the gate makes inside the full view: a saver to a retired partner and back, and one saver to another. */
export const SWITCHES = Object.freeze([
  { key: 'Sam>Kim', fixture: 'couple', from: 'ParCoupleSam', to: 'ParCoupleKim' },
  { key: 'Kim>Sam', fixture: 'couple', from: 'ParCoupleKim', to: 'ParCoupleSam' },
  { key: 'Jo>Sam', fixture: 'two-savers', from: 'ParSaverDraft', to: 'ParSaverPayIn' }
]);

export const fixtureNamed = (key) => FIXTURES.find((f) => f.key === key) || SWITCH_FIXTURES.find((f) => f.key === key) || null;
