/**
 * A saver's plan answers "am I paying in enough?" too, and stops pushing (research/saving-enough-and-check-in.md 4.1–4.7,
 * section 8; release step R2). Fictional people only (Alex, Sam), made here, never a real plan:
 *   - the round trip: a plan kept from a B answer, read by saverInputsOf on the day it was kept, gives back the answer's
 *     count and the pay-in it said would be on course — as a share of pay, in pounds, and with a saving mix apart from the
 *     drawing mix; read without the answer it was kept from, the plan's own figures give the same;
 *   - the share on the plan (4.5): kept beside the pounds, read only while they agree, the last edit winning; the saving mix
 *     the path and the verdict both read (4.4); the words on how pay-ins rise when the plan's rise is not the price rise;
 *   - the rail (4.1, 4.2): for every saver stage the next sentence never names what you hold, the move, the lock, Month by
 *     month or a tax year; the steps kept "For later" are addressable and unmarked; a plan locked while saving that never
 *     chose how often keeps today's sentence (P.pot, then P.working) word for word, month by month; the retired stages'
 *     rails are as they were;
 *   - one placing from the Accumulation tab's ages (4.6): V7's rail places it as the planner does, asks once to confirm the
 *     ages, and "About you and when" starts from them;
 *   - "What you pay in" draws the verdict from B's own sentences, with no banned word.
 */
import { describe, it, expect } from 'vitest';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { answerB } from '../../../src/answers/b/answer.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { seedToScenario } from '../../../src/services/PlanFromSeed.js';
import { upgradeScenario } from '../../../src/firebase/scenarioMigration.js';
import { saverInputsOf, saverRunKey } from '../../../src/answers/plan/saverInputs.js';
import { payInShareOf, shareSettings, savingMixOf, PRICE_RISE_PCT } from '../../../src/services/SaverPayIn.js';
import { savingPathMixes } from '../../../src/services/SavingPath.js';
import { RISK_PRESETS } from '../../../src/services/GlidepathService.js';
import { savingOf, savingPatch } from '../../../src/answers/plan/saving.js';
import { planPage } from '../../../src/answers/plan/read.js';
import { boxesOf as aboutBoxes, aboutPatch, applyPatch, bandsOf, netOf } from '../../../src/answers/plan/about.js';
import { amountAtAge } from '../../../src/services/IncomeSchedule.js';
import { STEPS, SAVER_STAGES, RETIRED_STAGES, laterFor, stepsFor, NEXT_ORDER } from '../../../src/answers/plan/steps.js';
import { PLAN } from '../../../src/v7/copy/plan.js';
import { SAVING as W } from '../../../src/v7/copy/saving.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { viewFor } from '../../../src/v7/effects/planSource.js';
import { visibleText, bannedHits } from '../render/checkScreen.js';
import { corpus, entryOf, entriesAt, stateWith, noon, DATES, TODAY } from './_plans.js';

const C = corpus();
const KEPT_ON = '2026-11-04';
const fill = (text, slots) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in slots ? slots[k] : m));
const copy = (v) => JSON.parse(JSON.stringify(v));
const ENV = { today: KEPT_ON, futures: 100, seed: 0, detail: 'answer' };

/** Sam, 41, still saving (fictional): the inputs of question B, with the pay-in as given. */
const sam = (payIn, more = {}) => ({ household: 'single', you: { pot: 62000, age: 41, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn },
  stop: { age: 63 }, spend: { kind: 'amount', amount: 1810 }, endAge: 95, ...more });

/** B's answer kept as a plan, as "Keep this as a plan" makes it, brought up to date as the plan source reads it. */
function kept(inputs, payIn = 'now') {
  const result = answerB(inputs, ENV);
  const seed = buildPlanSeed({ source: 'b', result, env: { today: KEPT_ON, appVersion: 'test' }, name: 'Sam saving', createdAt: KEPT_ON + 'T10:00:00.000Z', payIn });
  const made = seedToScenario(seed, KEPT_ON).yours;
  made.id = 'SamSaving01';
  const plan = upgradeScenario(copy(made), { now: noon(KEPT_ON) }).scenario;
  return { result, plan, seed };
}
const askAgain = (read) => answerB(read.inputs, { ...ENV, ...read.env });

describe('the round trip: a plan kept from B gives back B\'s count and pay-in on the day it was kept (section 8)', () => {
  const cases = {
    'a share of pay, saving more boldly than drawing': sam({ kind: 'share', pay: 38000, ownPct: 6, employerPct: 4 }, { savingRisk: 'adventurous', risk: 'balanced' }),
    'your part and your employer\'s in pounds, to the penny': sam({ kind: 'split', own: 333.33, employer: 211.17 }),
    'one figure, with savings and what goes into them': sam({ kind: 'total', total: 417.07 }, { savings: 12000, savingsIn: 150, savingRisk: 'cautious' })
  };
  for (const [name, inputs] of Object.entries(cases)) {
    it(name, () => {
      const { result, plan } = kept(inputs);
      const read = saverInputsOf(plan, { today: KEPT_ON });
      expect(read.ok).toBe(true);
      const again = askAgain(read);
      expect(again.chance.fails).toBe(result.chance.fails);
      expect(again.verdict).toEqual(result.verdict);
      expect(again.payIn.needed).toBe(result.payIn.needed);
      expect(again.enough && again.enough.atLevel && again.enough.atLevel.payIn).toBe(result.enough && result.enough.atLevel && result.enough.atLevel.payIn);
      // read from the plan's own figures alone (as if it had not come from B), the count and the pay-in are the same
      const bare = { ...plan }; delete bare.fromAnswer;
      const plain = saverInputsOf(bare, { today: KEPT_ON });
      expect(plain.ok).toBe(true);
      const own = askAgain(plain);
      expect(own.chance.fails).toBe(result.chance.fails);
      expect(own.payIn.needed).toBe(result.payIn.needed);
    }, 30000);
  }
  it('kept "on course": the plan pays in what B said would be enough, and reads back on course', () => {
    const { result, plan } = kept(sam({ kind: 'share', pay: 38000, ownPct: 6, employerPct: 4 }), 'enough');
    expect(result.verdict.band).not.toBe('yes');
    const s = plan.accumulationTool.settings;
    expect(s.payInKind).toBe('share');
    expect(s.ownPct).toBe(result.enough.atLevel.parts[0].ownPct);
    const again = askAgain(saverInputsOf(plan, { today: KEPT_ON }));
    expect(again.chance.fails).toBe(result.enough.atLevel.fails);
  }, 30000);
  it('a group the person changed since is read from the plan, not from the answer', () => {
    const { plan } = kept(sam({ kind: 'split', own: 333.33, employer: 211.17 }));
    plan.accumulationTool.settings = { ...plan.accumulationTool.settings, netMonthly: 400 };
    const read = saverInputsOf(plan, { today: KEPT_ON });
    expect(read.notes.from.payIn).toBeUndefined();
    expect(read.inputs.you.payIn).toEqual({ kind: 'split', own: 500, employer: 211.17 });
    expect(read.notes.from.spend).toBe(true);
  });
  it('asked at Bold: the plan gives back the answer\'s level too (the person chose it: levelChosen, 7.8.0), not a plan figure', () => {
    const { result, plan } = kept(sam({ kind: 'share', pay: 38000, ownPct: 6, employerPct: 4 }, { confidence: 'bold' }));
    const read = saverInputsOf(plan, { today: KEPT_ON });
    expect(read.inputs.confidence).toBe('bold');
    const again = askAgain(read);
    expect(again.chance.fails).toBe(result.chance.fails);
    expect(again.payIn.needed).toBe(result.payIn.needed);
    expect(again.sentences.enoughHead.text).toBe(result.sentences.enoughHead.text);
    // a plan kept at the level we start at, or one with no record of an answer, reads at Balanced
    expect(saverInputsOf(kept(sam({ kind: 'total', total: 400 })).plan, { today: KEPT_ON }).inputs.confidence).toBe('balanced');
    const bare = { ...plan }; delete bare.fromAnswer;
    expect(saverInputsOf(bare, { today: KEPT_ON }).inputs.confidence).toBe('balanced');
  }, 30000);
});

describe('the aim is the figure the plan draws from its start, not its first step', () => {
  /** Alex, 38 (fictional): £2,200 a month from 64, 1.5% less each year, then £1,800 from 75. */
  const alex = () => ({ household: 'single', you: { pot: 48000, age: 38, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'total', total: 500 } },
    stop: { age: 64 }, spend: { kind: 'amount', amount: 2200, then: 'falls', fallsPct: 1.5, steps: [{ fromAge: 75, perMonth: 1800, then: 'level' }] }, endAge: 95 });
  it('the stop moved later on "About you and when": the figure in force at the new start, with the steps after it', () => {
    const { plan } = kept(alex());
    const p = aboutPatch(plan, { ...aboutBoxes(plan, { today: KEPT_ON }), stopAge: '68' }, { today: KEPT_ON });
    expect(p.ok).toBe(true);
    const moved = applyPatch(plan, p.patch);
    const ss = moved.stressTool.settings;
    expect(ss.shapeAgeNow).toBe(68);
    const read = saverInputsOf(moved, { today: KEPT_ON });
    expect(read.ok).toBe(true);
    const engines = amountAtAge(ss.incomeSteps, 68, ss.baseSalary || 0);
    expect(read.notes.aimYearly).toBe(Math.round(engines));
    expect(read.inputs.spend.amount).toBe(Math.round(netOf(engines, bandsOf(ss)) / 12));
    expect(read.inputs.spend.amount).toBeLessThan(2200);
    for (const st of read.inputs.spend.steps || []) expect(st.fromAge).toBeGreaterThan(68);
    expect(read.inputs.spend.steps.at(-1)).toMatchObject({ fromAge: 75, perMonth: 1800 });
  }, 30000);
  it('steps that start before the stop: the one in force at the stop is the aim', () => {
    const { plan } = kept(sam({ kind: 'total', total: 400 }));
    const p = copy(plan);
    delete p.fromAnswer;
    const ss = p.stressTool.settings;
    p.stressTool.settings = { ...ss, incomeShape: 'phases', baseSalary: 0, targetSchedule: null, incomeSteps: [{ fromAge: 60, amount: 36000 }, { fromAge: 62, amount: 24000 }, { fromAge: 75, amount: 20000 }] };
    const read = saverInputsOf(p, { today: KEPT_ON });
    expect(ss.shapeAgeNow).toBe(63);
    expect(read.notes.aimYearly).toBe(24000);
    expect(read.inputs.spend.amount).toBe(Math.round(netOf(24000, bandsOf(ss)) / 12));
    expect(read.inputs.spend.steps).toEqual([{ fromAge: 75, perMonth: Math.round(netOf(20000, bandsOf(ss)) / 12), then: 'level' }]);
  });
});

describe('a pension today with nothing going in, and the words beside the verdict', () => {
  /** Sam, 47 (fictional): £61,000 in a pension, nothing going in now, stopping at 60. */
  const samStopped = () => ({ household: 'single', you: { pot: 61000, age: 47, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'total', total: 0 } },
    stop: { age: 60 }, spend: { kind: 'amount', amount: 1500 }, endAge: 95 });
  it('keeping writes the pot and the ages, so the pot is still counted a year on, and the words say where it came from', () => {
    const { result, plan } = kept(samStopped());
    expect(plan.accumulationTool.settings).toMatchObject({ currentAge: 47, retirementAge: 60, potNow: 61000, netMonthly: 0, employerMonthly: 0 });
    const read = saverInputsOf(plan, { today: KEPT_ON });
    expect(read.inputs.you.pot).toBe(61000);
    expect(read.notes.potFrom).toBe('saved');
    expect(askAgain(read).chance.fails).toBe(result.chance.fails);
    const later = '2027-11-05';
    const on = saverInputsOf(entryOf(copy(plan), later).plan, { today: later });
    expect(on.inputs.you.pot).toBe(61000);
    expect(on.notes.potFrom).toBe('saved');
    // nothing goes in: nothing to rise, so no words on how pay-ins rise
    expect(read.notes.rise).toBe(null);
    expect(saverInputsOf({ ...plan, accumulationTool: { settings: { ...plan.accumulationTool.settings, escalationPct: 0 } } }, { today: KEPT_ON }).notes.rise).toBe(null);
  }, 30000);
  it('a plan with no saving figures for its pot: the words beside the verdict always say what the run counted', () => {
    // kept from an answer of an older V7 tab (seed version 1 writes no saving figures for a pot alone): on the day kept
    // the answer's pot is counted, and said to be
    const result = answerB(samStopped(), ENV);
    const seed = { ...buildPlanSeed({ source: 'b', result, env: { today: KEPT_ON, appVersion: 'test' }, name: 'Sam saving', createdAt: KEPT_ON + 'T10:00:00.000Z' }), seedVersion: 1 };
    const v1 = seedToScenario(seed, KEPT_ON).yours;
    v1.id = 'SamSaving01';
    expect(v1.accumulationTool).toBeUndefined();
    const read = saverInputsOf(upgradeScenario(copy(v1), { now: noon(KEPT_ON) }).scenario, { today: KEPT_ON });
    expect(read.inputs.you.pot).toBe(61000);
    expect(read.notes.potFrom).toBe('answer');
    expect(W.verdict.pot.answer).toBe('Your pot is the one you gave when you kept this plan.');
    expect(read.notes.rise).toBe(null);   // no saving figures at all: nothing said about how pay-ins rise
    // kept before keeping wrote them (the section missing from a plan this code would write it for): nothing is counted,
    // and the words say so and where to add it
    const { plan } = kept(samStopped());
    const old = copy(plan); delete old.accumulationTool;
    const r2 = saverInputsOf(old, { today: KEPT_ON });
    expect(r2.inputs.you.pot).toBe(0);
    expect(r2.notes.potFrom).toBe('none');
  });
  it('a couple\'s plan is said to be read on its own; a single person\'s is not', () => {
    const e = entryOf(C['10-couple-b']);
    const v = savingOf([e], e.plan.id, { today: TODAY }).verdict;
    expect(v.ok).toBe(true);
    expect(v.notes.couple).toBe(true);
    expect(saverInputsOf(kept(sam({ kind: 'total', total: 400 })).plan, { today: KEPT_ON }).notes.couple).toBe(false);
  });
});

describe('the share on the plan, the saving mix and the rise (4.4, 4.5, decision D6)', () => {
  it('the share is kept beside the pounds it lands, in one write, and read only while they agree', () => {
    const { plan } = kept(sam({ kind: 'share', pay: 38000, ownPct: 6, employerPct: 4 }));
    const s = plan.accumulationTool.settings;
    expect(s).toMatchObject({ salary: 38000, schemeType: 'ras', netMonthly: 152, employerMonthly: 126.67, payInKind: 'share', ownPct: 6, employerPct: 4, escalationPct: PRICE_RISE_PCT });
    expect(shareSettings({ pay: 38000, ownPct: 6, employerPct: 4 })).toMatchObject({ netMonthly: 152, employerMonthly: 126.67 });
    expect(payInShareOf(s)).toEqual({ pay: 38000, ownPct: 6, employerPct: 4, own: 190, employer: 126.67 });
    // the classic page changes the pounds: the share no longer agrees, and the pounds are read
    expect(payInShareOf({ ...s, netMonthly: 160 })).toBe(null);
    expect(payInShareOf({ ...s, schemeType: 'netpay' })).toBe(null);
    expect(payInShareOf({ ...s, salary: 40000 })).toBe(null);
    const changed = { ...plan, fromAnswer: undefined, accumulationTool: { ...plan.accumulationTool, settings: { ...s, netMonthly: 160 } } };
    expect(saverInputsOf(changed, { today: KEPT_ON }).inputs.you.payIn).toEqual({ kind: 'split', own: 200, employer: 126.67 });
    // the rail's step says the share while it agrees
    const pg = planPage([{ plan }], plan.id, 'saving', { today: KEPT_ON });
    const line = pg.steps.find((x) => x.id === 'saving').lines.find((l) => l.id === 'saving.share');
    expect(line.sentence.text).toBe('6% of your pay from you, 4% from your employer');
    expect(PLAN.lineAfter['saving.share']).toBe(', going up with your pay (we assume pay rises with prices)');
  });
  it('V7\'s own Save keeps the share and the saving mix as they are; the pounds changed, the share is read as pounds', () => {
    const { plan } = kept(sam({ kind: 'share', pay: 38000, ownPct: 6, employerPct: 4 }, { savingRisk: 'adventurous' }));
    const p = savingPatch(plan, { netMonthly: '160' }, { today: KEPT_ON });
    const next = p.patch['accumulationTool.settings'];
    expect(next).toMatchObject({ netMonthly: 160, payInKind: 'share', ownPct: 6, employerPct: 4, savingMix: { equity: 0.7, bond: 0.25, cash: 0.05 } });
    expect(payInShareOf(next)).toBe(null);
    expect(savingPatch(plan, {}, { today: KEPT_ON }).patch).toEqual({});   // nothing typed: nothing written
  });
  it('the saving mix: kept only when the answer saved apart from its drawing mix; the path reads it after what you hold, before the allocation', () => {
    expect(kept(sam({ kind: 'total', total: 400 })).plan.accumulationTool.settings.savingMix).toBeUndefined();
    const { plan } = kept(sam({ kind: 'total', total: 400 }, { savingRisk: 'cautious', risk: 'adventurous' }));
    const acc = plan.accumulationTool.settings;
    const c = RISK_PRESETS.cautious;
    expect(acc.savingMix).toEqual({ equity: c.equity, bond: c.bond, cash: c.cash });
    expect(savingMixOf(acc)).toEqual({ equity: c.equity, bond: c.bond, cash: c.cash });
    const ss = plan.stressTool.settings;
    const mixes = savingPathMixes(ss, null, acc);
    expect(mixes.saving).toEqual(savingMixOf(acc));
    expect(mixes.fromSavingMix).toBe(true);
    expect(savingPathMixes(ss, null, {}).saving).toEqual(mixes.drawing);   // absent: the old rule
    const held = { total: 1000, buckets: { shares: 1, bonds: 0, diversifiers: 0, cash: 0 } };
    expect(savingPathMixes(ss, held, acc).saving).toEqual({ equity: 1, bond: 0, cash: 0 });   // what you hold still comes first
  });
  it('the words on how pay-ins rise: none at the price rise; less or more otherwise (until R4 reads the plan\'s own rise)', () => {
    const { plan } = kept(sam({ kind: 'total', total: 400 }));
    const at = (pct) => saverInputsOf({ ...plan, accumulationTool: { ...plan.accumulationTool, settings: { ...plan.accumulationTool.settings, escalationPct: pct } } }, { today: KEPT_ON }).notes.rise;
    expect(at(2.5)).toBe(null);
    expect(at(0)).toEqual({ pct: 0, path: 'less' });
    expect(at(1)).toEqual({ pct: 1, path: 'less' });
    expect(at(4)).toEqual({ pct: 4, path: 'more' });
    // the corpus saver raises by 1% a year: its page says so
    const e = entryOf(C['05-saver-committed']);
    const v = savingOf([e], e.plan.id, { today: TODAY });
    expect(v.verdict.notes.rise).toEqual({ pct: '1', path: 'less' });
    expect(fill(W.verdict.rise.less, v.verdict.notes.rise)).toBe('This reads what you pay in as going up with prices. Your plan raises it by 1% a year, so what the pot could be by the stop, below, assumes less goes in later.');
  });
  it('no aim, no saving years, a plan shown as saved: no question is asked', () => {
    const { plan } = kept(sam({ kind: 'total', total: 400 }));
    const noAim = copy(plan); noAim.stressTool.settings = { ...noAim.stressTool.settings, incomeShape: 'level', baseSalary: 0, incomeSteps: [{ fromAge: 63, amount: 0 }] };
    expect(saverInputsOf(noAim, { today: KEPT_ON })).toEqual({ ok: false, why: 'noAim' });
    expect(saverInputsOf(entryOf(C['04-buckets-running']).plan, { today: TODAY })).toEqual({ ok: false, why: 'notSaving' });
    expect(savingOf([{ plan, newer: true }], plan.id, { today: KEPT_ON }).verdict).toEqual({ ok: false, why: 'readonly', key: null });
    const ok = savingOf([{ plan }], plan.id, { today: KEPT_ON }).verdict;
    expect(ok.key).toBe(saverRunKey(plan.id, saverInputsOf(plan, { today: KEPT_ON })));
  });
});

/** Every next sentence of a saver stage, filled. */
const nextText = (pg) => fill(PLAN.next[pg.next.id], pg.next.slots);
const NAMES_THE_PUSH = /what you hold|move|lock|Month by month|record \w+ \d{4}|tax year|set up/i;

describe('the rail: a saver is never pushed off saving (4.1, 4.2)', () => {
  it('the steps: a saver opens on What you pay in; what you hold, the move and the lock are "For later" far from the stop; the retired stages as they were', () => {
    expect(STEPS.saving[0]).toBe('saving');
    expect(STEPS.approaching[0]).toBe('saving');
    expect(STEPS['committed-saving'][0]).toBe('checkin');   // the check-in took the pot step's place (release step R3)
    expect(STEPS.running).toEqual(['month', 'where', 'plan', 'hold', 'move', 'budget', 'household']);
    expect(STEPS.bridge).toBeUndefined();   // 7.4.2: no placing before a retired plan's start
    expect(STEPS['draft-retired']).toEqual(['plan', 'budget', 'lock', 'month', 'hold', 'move', 'household']);   // Month by month, optional, saying to lock first (7.2.0)
    expect(laterFor('saving')).toEqual(['lock', 'hold']);
    expect(laterFor('approaching')).toEqual([]);
    expect(laterFor('committed-saving', { yearsToStop: 12 })).toEqual(['hold', 'move']);
    expect(laterFor('committed-saving', { yearsToStop: 4.5 })).toEqual([]);
    for (const k of RETIRED_STAGES) expect(laterFor(k)).toEqual([]);
    const saving = stepsFor('saving', { locked: false, linked: false, manyPlans: true });
    expect(saving.map((x) => x.id)).toEqual(['saving', 'checkin', 'plan', 'budget', 'household', 'lock', 'hold']);
    expect(saving.filter((x) => x.later).map((x) => x.id)).toEqual(['lock', 'hold']);
    for (const k of RETIRED_STAGES) expect(stepsFor(k, { locked: true, linked: true, manyPlans: true }).some((x) => x.later)).toBe(false);
  });
  for (const today of DATES) {
    it(`every corpus saver at ${today}: the next sentence names none of the push; a step for later reads "For later" and still opens`, () => {
      const entries = entriesAt(today);
      for (const e of entries) {
        const pg = planPage(entries, e.plan.id, null, { today });
        if (!SAVER_STAGES.includes(pg.stageKey)) continue;
        if (pg.next.id === 'P.pot' || pg.next.id === 'P.working') continue;   // a locked saver's sentence, word for word (below)
        expect(nextText(pg), e.plan.id).not.toMatch(NAMES_THE_PUSH);
        for (const s of pg.steps.filter((x) => x.later)) {
          if (!s.done) expect(s.railResult.text, e.plan.id + ' ' + s.id).toBe('For later');
          else expect(s.railResult).toBe(null);
          const opened = planPage(entries, e.plan.id, s.id, { today });
          expect(opened.current).toBe(s.id);
          expect(opened.steps.find((x) => x.id === s.id).listed).toBe(true);
        }
      }
    });
  }
  it('the linked saver (unlocked, more than five years away): opens on What you pay in; the lock and what you hold for later; "see whether what you pay in is enough"', () => {
    const saver = copy(C['05-saver-committed']);
    delete saver.planDocument; delete saver.journey;
    saver.decisionTool.settings = { ...saver.decisionTool.settings, locked: false };
    const entries = [entryOf(saver), entryOf(C['02-pnv-draft'])];
    const pg = planPage(entries, saver.id, null, { today: TODAY });
    expect(pg.stageKey).toBe('saving');
    expect(pg.current).toBe('saving');
    expect(pg.steps.filter((x) => x.later).map((x) => x.id)).toEqual(['lock', 'hold']);
    // 7.3.0 (retaken on purpose): never checked in, the first check-in is due (the design's rank 10); P.saving, word for word,
    // is what the rail says once nothing is due
    expect(pg.next.id).toBe('P.firstCheckIn');
    expect(pg.next.button).toEqual({ id: 'checkIn', href: '#/plan/' + saver.id + '/checkin', slots: {} });
    expect(PLAN.next['P.saving']).toBe('Next: see whether what you pay in is enough, then check in once a year.');
  });
  it('no aim: "say what you would want to spend", linking to What you spend; never on a locked plan', () => {
    const saver = copy(C['10-couple-b']);
    saver.stressTool.settings = { ...saver.stressTool.settings, incomeShape: 'level', baseSalary: 0, incomeSteps: [], targetSchedule: null };
    const pg = planPage([entryOf(saver)], saver.id, null, { today: TODAY });
    expect(pg.stageKey).toBe('approaching');
    // 7.3.0: the first check-in comes first (rank 10); the aim is due after it (rank 13), with its words and link as before
    expect(pg.next.id).toBe('P.firstCheckIn');
    const aim = pg.due.find((d) => d.pid === 'P.noAim');
    expect(aim.id).toBe('saving.noAim');
    expect(fill(PLAN.next[aim.pid], aim.slots)).toMatch(/^Next: say what you would want to spend from [A-Z][a-z]+ \d{4}, to see whether what you pay in is enough\.$/);
    expect(aim.button.href).toBe('#/plan/' + saver.id + '/spend');
  });
  it('a plan locked while saving that never chose how often: today\'s next sentence, word for word, month by month (P.pot, then P.working)', () => {
    const raw = C['05-saver-committed'];
    const stop = 'February 2038';
    const months = ['2026-10-02', '2026-11-15', '2026-12-31', '2027-01-01', '2027-02-28', '2027-03-31'];
    for (const today of months) {
      const e = entryOf(raw, today);
      const pg = planPage([e], e.plan.id, null, { today });
      expect(pg.stageKey).toBe('committed-saving');
      expect(pg.next.id, today).toBe('P.pot');
      expect(nextText(pg)).toBe(`Your plan is locked and you stop work in ${stop}. Next: record this month’s pot.`);
      // the same words open the check-in now, "Each month" kept (4.2; release step R3)
      expect(pg.next.button).toEqual({ id: 'recordPot', href: '#/plan/' + e.plan.id + '/checkin', slots: {} });
      // this month's pot recorded: P.working, word for word
      const mon = today.slice(0, 7);
      const withPot = copy(raw);
      withPot.accumulationTool.history = [...withPot.accumulationTool.history.filter((r) => r.date !== mon), { date: mon, sipp: 330000, isa: 42000, gia: 0, total: 372000, recordedAt: today + 'T12:00:00.000Z' }];
      const e2 = entryOf(withPot, today);
      const pg2 = planPage([e2], e2.plan.id, null, { today });
      expect(pg2.next.id, today).toBe('P.working');
      expect(nextText(pg2)).toBe(`Your plan is locked and you stop work in ${stop}. Next: check you are still saving enough.`);
      // and its button, as before release step R2: the planner's own check, in its old words
      expect(pg2.next.button).toEqual({ id: 'onCourse', place: 'onCourse', slots: {} });
      expect(PLAN.buttons[pg2.next.button.id]).toBe('Am I on course? (in the classic planner)');
    }
    expect(PLAN.next['P.pot']).toBe('Your plan is locked and you stop work in {stop}. Next: record this month’s pot.');
    expect(PLAN.next['P.working']).toBe('Your plan is locked and you stop work in {stop}. Next: check you are still saving enough.');
    // more than five years from the stop: what you hold and the move are for later
    const pg = planPage([entryOf(raw)], raw.id, null, { today: TODAY });
    expect(pg.steps.filter((x) => x.later).map((x) => x.id)).toEqual(['hold', 'move']);
  });
  it('the retired stages\' next sentences and rails are untouched by the saver\'s (the corpus at three dates)', () => {
    for (const today of DATES) {
      const entries = entriesAt(today);
      for (const e of entries) {
        const pg = planPage(entries, e.plan.id, null, { today });
        if (!RETIRED_STAGES.includes(pg.stageKey)) continue;
        expect(pg.steps.some((x) => x.later), e.plan.id).toBe(false);
        expect(['P.agesFromSaving', 'P.noAim', 'P.saving', 'P.approaching']).not.toContain(pg.next.id);
      }
    }
    for (const id of ['P.agesFromSaving', 'P.noAim']) expect(NEXT_ORDER).toContain(id);
  });
});

describe('one placing from the Accumulation tab\'s ages (4.6)', () => {
  /** Alex, 30, with ages typed only in the saving figures (fictional): no age in the plan's timing. */
  function alex() {
    const p = copy(C['01-fresh-default']);
    p.id = 'AlexSaving01';
    p.accumulationTool = { settings: { currentAge: 30, retirementAge: 67, salary: 31000, potNow: 9000, netMonthly: 100, schemeType: 'ras', employerMonthly: 93, escalationPct: 0, isaMonthly: 0 } };
    return p;
  }
  it('V7 places it as the planner does — saving — opens on What you pay in, and asks once to confirm the ages', () => {
    const e = entryOf(alex());
    const pg = planPage([e], e.plan.id, null, { today: TODAY });
    expect(pg.stageKey).toBe('saving');
    expect(pg.saver).toBe(true);
    expect(pg.current).toBe('saving');
    expect(pg.next.id).toBe('P.agesFromSaving');
    expect(nextText(pg)).toBe('Next: check your age today and the age you want to stop work. We took them from your saving figures.');
    expect(pg.next.button).toEqual({ id: 'checkAges', href: '#/plan/' + e.plan.id + '/about', slots: {} });
    // "About you and when" starts from those ages, so Save writes them into the plan's timing
    expect(aboutBoxes(e.plan, { today: TODAY })).toMatchObject({ age: '30', stopped: 'age', stopAge: '67' });
    // the verdict reads the same ages
    const read = saverInputsOf(e.plan, { today: TODAY });
    expect(read.notes.fromAccumulation).toBe(true);
    if (read.ok) { expect(read.inputs.you.age).toBe(30); expect(read.inputs.stop.age).toBe(67); }
  });
  it('locked, it stays where it was (running)', () => {
    const p = alex();
    p.decisionTool.settings = { ...p.decisionTool.settings, locked: true };
    expect(planPage([entryOf(p)], p.id, null, { today: TODAY }).stageKey).toBe('running');
  });
  it('confirming the ages on "About you and when" with nothing changed leaves the verdict\'s inputs as they were', () => {
    const e = entryOf(alex());
    const before = saverInputsOf(e.plan, { today: TODAY });
    expect(before.ok).toBe(true);
    const boxes = aboutBoxes(e.plan, { today: TODAY });
    expect(before.inputs.endAge).toBe(+boxes.endAge + 1);   // the plan's own last age, on its own clock
    const p = aboutPatch(e.plan, boxes, { today: TODAY });
    expect(p.ok).toBe(true);
    const after = saverInputsOf(applyPatch(e.plan, p.patch), { today: TODAY });
    expect(after.ok).toBe(true);
    expect(after.notes.fromAccumulation).toBe(false);
    expect(after.inputs).toEqual(before.inputs);
  });
});

describe('one stop on the page: "About you and when" keeps the Accumulation tab\'s ages in step', () => {
  it('the stop moved: the verdict, the pot table and the planner\'s Accumulation tab all name the new stop', () => {
    const { plan } = kept(sam({ kind: 'total', total: 400 }));
    expect(plan.accumulationTool.settings.retirementAge).toBe(63);
    const p = aboutPatch(plan, { ...aboutBoxes(plan, { today: KEPT_ON }), stopAge: '66' }, { today: KEPT_ON });
    expect(p.patch['accumulationTool.settings.retirementAge']).toBe(66);
    const moved = applyPatch(plan, p.patch);
    expect(moved.accumulationTool.settings).toMatchObject({ currentAge: 41, retirementAge: 66 });
    const v = savingOf([{ plan: moved }], moved.id, { today: KEPT_ON });
    expect(v.verdict.inputs.stop.age).toBe(66);
    expect(v.ages.retirementAge).toBe(66);
    expect(v.rows.at(-1).age).toBe(66);
    // every other saving figure is as it was
    const { currentAge, retirementAge, ...rest } = moved.accumulationTool.settings;
    void currentAge; void retirementAge;
    const { currentAge: c0, retirementAge: r0, ...was } = plan.accumulationTool.settings;
    void c0; void r0;
    expect(rest).toEqual(was);
  });
  it('a plan with no saving figures, or one that says work has stopped, is not given any', () => {
    const { plan } = kept(sam({ kind: 'total', total: 400 }));
    const none = copy(plan); delete none.accumulationTool;
    const p = aboutPatch(none, { ...aboutBoxes(none, { today: KEPT_ON }), stopAge: '66' }, { today: KEPT_ON });
    expect(Object.keys(p.patch).some((k) => k.startsWith('accumulationTool'))).toBe(false);
    const stopped = aboutPatch(plan, { ...aboutBoxes(plan, { today: KEPT_ON }), stopped: 'yes' }, { today: KEPT_ON });
    expect(Object.keys(stopped.patch).some((k) => k.startsWith('accumulationTool'))).toBe(false);
  });
});

describe('"What you pay in" draws the plan\'s verdict in B\'s own sentences', () => {
  function draw(state) {
    const s = reduce(state, { type: A.PLANS_VIEW, view: viewFor(state) });
    const root = document.createElement('div');
    root.id = 'app';
    render(h(App, { state: s, dispatch: () => {} }), root);
    return { root, words: visibleText(root) };
  }
  it('due: the working line; held: the verdict, what would be enough, the aim in the plan\'s own unit; no banned word', () => {
    const { plan } = kept(sam({ kind: 'share', pay: 38000, ownPct: 6, employerPct: 4 }));
    const entries = [{ plan, newer: false, failed: false }];
    const base = stateWith(entries, '#/plan/' + plan.id + '/saving', { today: KEPT_ON });
    const due = draw(base);
    const T = 'plan.saving.verdict';
    expect(due.root.querySelector(`[data-testid="${T}"]`).getAttribute('data-status')).toBe('working');
    expect(due.root.querySelector(`[data-testid="${T}.working"]`).textContent).toBe(W.verdict.working);
    const v = savingOf(entries, plan.id, { today: KEPT_ON }).verdict;
    const result = answerB(v.inputs, { ...ENV, ...v.env });
    let s = reduce(base, { type: A.SAVER_WORKING, key: v.key });
    s = reduce(s, { type: A.SAVER_FINAL, key: v.key, result });
    const held = draw(s);
    const box = held.root.querySelector(`[data-testid="${T}"]`);
    expect(box.getAttribute('data-status')).toBe('final');
    expect(box.getAttribute('data-verdict')).toBe(result.verdict.band);
    expect(box.textContent).toContain(result.sentences.verdictHead.text);
    expect(box.textContent).toContain(result.sentences.enoughHead.text);
    expect(held.root.querySelector(`[data-testid="${T}.aim"]`).textContent).toMatch(/^Your plan’s £[\d,]+ a year before tax is £1,810 a month after tax, at today’s prices: the figure tested here\.$/);
    expect(held.root.querySelector(`[data-testid="${T}.share"]`).textContent).toBe('What you pay in is read as a share of your pay — 6% from you and 4% from your employer — going up with your pay; we assume pay rises with prices.');
    expect(held.root.querySelector(`[data-testid="${T}.rise"]`)).toBe(null);
    expect(held.root.querySelector('[data-testid="plan.saving.onCourse"]').textContent).toBe('The classic planner’s pot check (fixed rates)');
    expect(bannedHits(held.words, ['all', 'record', 'saver', 'planner'])).toEqual([]);
    expect(held.words).not.toMatch(/undefined|NaN|\{\w+\}/);
    // a failure: in words, with "Try again"
    const failed = draw(reduce(reduce(base, { type: A.SAVER_WORKING, key: v.key }), { type: A.SAVER_FAILED, key: v.key }));
    expect(failed.root.querySelector(`[data-testid="${T}.failed"]`).textContent).toContain(W.verdict.failed);
    expect(failed.root.querySelector(`[data-testid="${T}.retry"]`)).not.toBe(null);
    // a single person's plan says nothing about being read on its own
    expect(held.root.querySelector(`[data-testid="${T}.couple"]`)).toBe(null);
  }, 30000);
  it('the rail: the steps kept for later sit under "For later", unmarked and never "(optional)"; a redraw keeps the same links', () => {
    const saver = copy(C['05-saver-committed']);
    delete saver.planDocument; delete saver.journey;
    saver.decisionTool.settings = { ...saver.decisionTool.settings, locked: false };
    const entries = [entryOf(saver), entryOf(C['02-pnv-draft'])];
    // the rail on a page of the plan ("Your plan"): since 7.3.0 the plan's own address is its home, which draws no rail
    const base = reduce(stateWith(entries, '#/plan/' + saver.id + '/plan', { today: TODAY }), { type: A.PLANS_VIEW, view: viewFor(stateWith(entries, '#/plan/' + saver.id + '/plan', { today: TODAY })) });
    const root = document.createElement('div');
    root.id = 'app';
    render(h(App, { state: base, dispatch: () => {} }), root);
    // "What you pay in" is the saver's first step: its first button is the plan's verdict, inside V7, named for the question
    // (read here from the reading: the step's own address draws its own screen)
    const first = planPage(entries, saver.id, null, { today: TODAY });
    expect(first.current).toBe('saving');
    const sb = first.steps.find((x) => x.id === 'saving').buttons;
    expect(sb[0]).toMatchObject({ id: 'payingEnough', href: '#/plan/' + saver.id + '/saving', primary: true });
    expect(PLAN.buttons.payingEnough).toBe('Are you paying in enough?');
    expect(sb.find((b) => b.id === 'potCheck')).toMatchObject({ place: 'onCourse', quiet: true });
    expect(root.querySelector('[data-testid="rail.later"]').textContent).toBe(PLAN.page.laterTitle);
    const later = [...root.querySelectorAll('.rail-later .rail-step')];
    expect(later.map((li) => li.querySelector('a').getAttribute('data-testid'))).toEqual(['rail.plan.lock', 'rail.plan.hold']);
    expect(later.some((li) => li.classList.contains('is-open'))).toBe(true);
    for (const li of later) {
      expect(li.textContent).not.toContain('(' + PLAN.page.optional + ')');
      expect(li.textContent).not.toContain(PLAN.page.marks.open);
      if (!li.classList.contains('is-open')) continue;   // done already: marked done, as any step
      expect(li.querySelector('.rail-mark').textContent).toBe('');
      expect(li.querySelector('.sr-only').textContent).toBe(PLAN.page.marks.later + ': ');
      expect(li.querySelector('.rail-result').textContent).toBe('For later');
    }
    // the rail drawn again (its sheet opened): every link is the same element, so focus on the rail is kept
    const links = [...root.querySelectorAll('.plan-rail a[data-testid^="rail.plan."]')];
    expect(links.length).toBeGreaterThan(4);
    render(h(App, { state: reduce(base, { type: 'ui/rail', open: true }), dispatch: () => {} }), root);
    const again = [...root.querySelectorAll('.plan-rail a[data-testid^="rail.plan."]')];
    expect(root.querySelector('.plan-rail').classList.contains('is-open')).toBe(true);
    expect(again.length).toBe(links.length);
    again.forEach((a, i) => expect(a, a.getAttribute('data-testid')).toBe(links[i]));
  });
  it('a couple\'s plan: the verdict says it reads this plan on its own', () => {
    const e = entryOf(C['10-couple-b']);
    const { root } = draw(stateWith([e], '#/plan/' + e.plan.id + '/saving', { today: TODAY }));
    expect(root.querySelector('[data-testid="plan.saving.verdict.couple"]').textContent).toBe(W.verdict.couple);
  });
});
