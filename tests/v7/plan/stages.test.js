/**
 * T1, T2 (research/v7/your-plan.md 9): one path from a saved plan to its stage and figures — the effective settings and
 * the stage the planner derives (src/services/PlanReading.js), on the 12 committed plans at 2 Oct 2026, 5 Apr 2027 and
 * 6 Apr 2027; the stage lines in V7's words; the steps for each stage (2.2); exactly one current step and one next
 * sentence; the owner-shaped household pair (6).
 */
import { describe, it, expect } from 'vitest';
import { effectiveStressSettings, planStage, whereAmIInputs, moveInputs, thisMonth } from '../../../src/services/PlanReading.js';
import { getStressSettingsAsync } from '../../../src/storage/StressRepository.js';
import { planRows, planPage, stageLine, dateOf, monthWords, dayWords } from '../../../src/answers/plan/read.js';
import { STEPS, stepsFor, NEXT_ORDER, ALL_STEPS } from '../../../src/answers/plan/steps.js';
import { PLAN } from '../../../src/v7/copy/plan.js';
import { corpus, entriesAt, entryOf, household, DATES, TODAY, noon } from './_plans.js';

const C = corpus();
const fill = (text, slots) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in slots ? slots[k] : m));
const lineText = (line) => (line ? fill(PLAN.stageLines[line.id], line.slots) : null);

describe('T1 — the stage of every committed plan, at three dates (your-plan.md "What was run" 4)', () => {
  const EXPECTED = {
    '2026-10-02': { '01-fresh-default': 'unknown', '02-pnv-draft': 'draft-retired', '03-gilt-ladder-runup': 'bridge', '04-buckets-running': 'running', '05-saver-committed': 'committed-saving',
      '06-pre-6.4-no-timing': 'running', '07-pre-6.13-flat-params': 'draft-retired', '08-dotted-keys': 'unknown', '09-couple-a': 'draft-retired', '10-couple-b': 'approaching', '11-guest-demo': 'draft-retired', '12-lumpy-db-gia': 'draft-retired' },
    '2027-04-05': { '03-gilt-ladder-runup': 'bridge' },
    '2027-04-06': { '03-gilt-ladder-runup': 'running' }
  };
  for (const today of DATES) {
    for (const [name, key] of Object.entries(EXPECTED[today])) {
      it(`${name} at ${today} is ${key}`, () => {
        const e = entryOf(C[name], today);
        expect(planStage(e.plan, { now: noon(today) }).key).toBe(key);
      });
    }
  }
  it('the locked ladder moves from bridge to running on 6 April 2027, and never shows a countdown', () => {
    const l = (today) => lineText(stageLine(planStage(entryOf(C['03-gilt-ladder-runup'], today).plan, { now: noon(today) }), entryOf(C['03-gilt-ladder-runup'], today).plan));
    expect(l('2026-10-02')).toBe('Retired. Your ladder pays from April 2027.');
    expect(l('2027-04-05')).toBe('Retired. Your ladder pays from April 2027.');
    expect(l('2027-04-06')).toBe('Retired. Living on the plan.');
    for (const today of DATES) expect(l(today)).not.toMatch(/\d+ (months?|years?) (to go|until|before)|countdown|to go/i);
  });
  it('the saver locked while saving reads "Plan locked. Still working until February 2038."; the approaching partner names no date', () => {
    const s = entryOf(C['05-saver-committed']).plan;
    expect(lineText(stageLine(planStage(s, { now: noon(TODAY) }), s))).toBe('Plan locked. Still working until February 2038.');
    const b = entryOf(C['10-couple-b']).plan;
    expect(lineText(stageLine(planStage(b, { now: noon(TODAY) }), b))).toBe('Stopping work within five years.');
    expect(lineText(stageLine({ key: 'unknown' }, {}))).toBe(null);
  });
  it('the effective settings are the ones the planner reads (StressRepository\'s own load path, in memory)', async () => {
    // the pure migration is the repository's: the same function, so the same settings whatever the plan's age
    const { migrateStressSettings, getDefaultStressDB } = await import('../../../src/services/PlanReading.js');
    for (const [name, raw] of Object.entries(C)) {
      const plan = entryOf(raw).plan;
      const ss = effectiveStressSettings(plan, { now: noon(TODAY) });
      const again = migrateStressSettings({ settings: plan.stressTool.settings, budget: plan.budgetTool && plan.budgetTool.settings }, noon(TODAY)).settings;
      for (const k of ['equityMin', 'bondMin', 'cashTarget', 'duration', 'firstTaxYear', 'retired', 'retireAge', 'incomeShape', 'strategyId']) expect(ss[k], `${name}.${k}`).toEqual(again[k]);
      expect(Object.keys(getDefaultStressDB().settings)).toContain('hodlValue');
    }
    expect(typeof getStressSettingsAsync).toBe('function');
  });
  it('the where-am-I inputs are the planner\'s: history ascending (at most 500), the ladder from the document only, the holdings, the tax years', () => {
    const plan = entryOf(C['03-gilt-ladder-runup']).plan;
    const i = whereAmIInputs(plan, { now: noon(TODAY) });
    expect(i.history.map((h) => h.date)).toEqual(['2026-07', '2026-08', '2026-09']);
    expect(i.ladderInDocument).toBe(true);
    expect(i.ladderPos && i.ladderPos.phase).toBe('before');
    expect(i.holdings.lines.length).toBeGreaterThan(0);
    expect(Object.keys(i.taxYears)).toEqual(['26/27']);
    expect(i.accHistory).toEqual([]);
    const many = { ...plan, decisionTool: { ...plan.decisionTool, history: Array.from({ length: 600 }, (_, k) => ({ date: '2000-' + String((k % 12) + 1).padStart(2, '0'), monthlyNet: k })) } };
    expect(whereAmIInputs(many, { now: noon(TODAY) }).history.length).toBe(500);
  });
  it('the move inputs read the document\'s target against what is held', () => {
    const m = moveInputs(entryOf(C['03-gilt-ladder-runup']).plan, { now: noon(TODAY) });
    expect(m.target.kind).toBe('ladder');
    expect(m.diff.kind).toBe('ladder');
    expect(moveInputs(entryOf(C['02-pnv-draft']).plan, { now: noon(TODAY) })).toBe(null);
    expect(thisMonth(noon(TODAY))).toBe('2026-10');
  });
});

describe('T2 — the rail: the steps for every stage, one current step, one next sentence', () => {
  it('the 2.2 table', () => {
    expect(STEPS.bridge).toEqual(['month', 'where', 'plan', 'hold', 'move', 'budget', 'household']);
    expect(STEPS.running).toEqual(STEPS.bridge);
    expect(STEPS.saving).toEqual(['saving', 'pot', 'plan', 'budget', 'lock', 'hold', 'household']);
    expect(STEPS['committed-saving'][0]).toBe('pot');
    expect(stepsFor('bridge', { locked: true, linked: false, manyPlans: false }).map((s) => s.id)).toEqual(['month', 'where', 'plan', 'hold', 'move', 'budget']);
    expect(stepsFor('saving', { locked: false, linked: true, manyPlans: false }).map((s) => s.id)).toContain('lock');
    expect(stepsFor('saving', { locked: true, linked: true, manyPlans: false }).map((s) => s.id)).not.toContain('lock');
    expect(stepsFor('committed-saving', { locked: true, linked: false, manyPlans: true }).find((s) => s.id === 'pot').optional).toBe(false);
    expect(stepsFor('saving', { locked: false, linked: false, manyPlans: true }).find((s) => s.id === 'pot').optional).toBe(true);
    for (const id of NEXT_ORDER) expect(PLAN.next[id], id).toBeTypeOf('string');
    for (const id of ALL_STEPS) expect(PLAN.steps[id], id).toBeTruthy();
  });
  for (const today of DATES) {
    it(`every committed plan at ${today}: exactly one current step, every listed step built, one next sentence with words`, () => {
      const entries = entriesAt(today);
      for (const e of entries) {
        for (const step of [null, ...ALL_STEPS]) {
          const pg = planPage(entries, e.plan.id, step, { today });
          expect(pg.found).toBe(true);
          expect(pg.steps.filter((s) => s.state === 'current').length, `${e.plan.id} ${step}`).toBe(1);
          for (const s of pg.steps) { expect(s.error, `${e.plan.id} ${s.id}: ${s.error}`).toBeUndefined(); expect(s.result && typeof s.result.text, `${e.plan.id} ${s.id}`).toBe('string'); }
          expect(NEXT_ORDER).toContain(pg.next.id);
          const sentence = fill(PLAN.next[pg.next.id], pg.next.slots);
          expect(sentence).not.toMatch(/\{\w+\}/);
          if (step && !STEPS[pg.stageKey].includes(step)) expect(pg.steps.find((s) => s.id === step).listed).toBe(false);
        }
      }
    });
  }
  it('the next sentence: the 2.4 table on the corpus', () => {
    const at = (name, today, step = null) => { const es = entriesAt(today); const id = entryOf(C[name], today).plan.id; return planPage(es, id, step, { today }); };
    expect(at('03-gilt-ladder-runup', '2026-10-02').next.id).toBe('P.month');          // October 2026 is not recorded
    expect(at('03-gilt-ladder-runup', '2027-04-06').next.id).toBe('P.taxyear');        // 2027/28 is not set up
    expect(at('05-saver-committed', '2026-10-02').next.id).toBe('P.pot');             // October's pot is not recorded
    expect(at('02-pnv-draft', '2026-10-02').next.id).toBe('P.draft');
    expect(at('10-couple-b', '2026-10-02').next.id).toBe('P.approaching');
    expect(at('01-fresh-default', '2026-10-02').next.id).toBe('P.noAge');
    // a plan saved by a newer version: P.readonly, with no button and no Change buttons
    const es = entriesAt(TODAY); const first = es[0];
    const newer = [{ ...first, newer: true }, ...es.slice(1)];
    const pg = planPage(newer, first.plan.id, null, { today: TODAY });
    expect(pg.next.id).toBe('P.readonly'); expect(pg.next.button).toBe(null); expect(pg.readonly).toBe(true);
    for (const s of pg.steps) for (const b of s.buttons) expect(b.href, `${s.id}.${b.id}`).toBeTruthy();
  });
  it('the month step: recorded when the latest record is this month or later; P.idle then', () => {
    const plan = entryOf(C['03-gilt-ladder-runup']).plan;
    const recorded = { ...plan, decisionTool: { ...plan.decisionTool, history: [...plan.decisionTool.history, { date: '2026-10', monthlyNet: 3395.33, monthlyTax: 938, taxYear: '26/27' }] } };
    const pg = planPage([{ plan: recorded, newer: false, failed: false }], plan.id, 'month', { today: TODAY });
    expect(pg.steps.find((s) => s.id === 'month').result.text).toBe('October 2026 recorded: £3,395 after tax');
    expect(pg.next.id).toBe('P.idle');
    expect(fill(PLAN.next['P.idle'], pg.next.slots)).toBe('October 2026 is recorded. Nothing to do until November.');
    const paidAhead = { ...plan, decisionTool: { ...plan.decisionTool, history: [...plan.decisionTool.history, { date: '2026-11', monthlyNet: 3400, monthlyTax: 900 }] } };
    expect(planPage([{ plan: paidAhead }], plan.id, 'month', { today: TODAY }).steps.find((s) => s.id === 'month').done).toBe(true);
  });
});

describe('the household pair shaped like the owner\'s (your-plan.md 1.5, 6)', () => {
  const { ladder, saver } = household();
  const entries = [entryOf(ladder), entryOf(saver)];
  it('the list puts them together under "Your household", each by its own name with one stage line; the link is one way', () => {
    const rows = planRows(entries, { today: TODAY });
    expect(rows.groups.map((g) => g.id)).toEqual(['household']);
    const names = rows.groups[0].rows.map((r) => r.name).sort();
    expect(names).toEqual(['Ladder plan', 'Saving plan']);
    const l = rows.groups[0].rows.find((r) => r.name === 'Ladder plan');
    expect(lineText(l.line)).toBe('Retired. Your ladder pays from April 2027.');
    expect(l.lockedOn).toBe('1 July 2026');
    const s = rows.groups[0].rows.find((r) => r.name === 'Saving plan');
    expect(lineText(s.line)).toBe('Still saving.');
    expect(s.lockedOn).toBe(null);
    expect(saver.household).toBeUndefined();
  });
  it('the retired partner\'s plan opens on This month; the household step names the saver with their line, and opens their plan inside V7', () => {
    const pg = planPage(entries, ladder.id, null, { today: TODAY });
    expect(pg.current).toBe('month');
    expect(pg.retired).toBe(true);
    const h = pg.steps.find((s) => s.id === 'household');
    expect(h.result.text).toBe('With ‘Saving plan’');
    expect(h.theirLine.id).toBe('saving');
    expect(h.buttons.find((b) => b.id === 'openPartner').href).toBe('#/plan/HouseSaver02');
    expect(h.buttons.find((b) => b.id === 'checkTogether').href).toBe('#/plan/HouseLadder01/household');   // the two together, inside V7 (road-to-7.md step 9)
  });
  it('the working partner\'s plan opens on What you pay in; its household step points back at the ladder, retired', () => {
    const pg = planPage(entries, saver.id, null, { today: TODAY });
    expect(pg.current).toBe('saving');
    expect(pg.saver).toBe(true);
    expect(pg.steps.find((s) => s.id === 'saving').result.text).toBe('£600 a month from you, £450 from your employer');
    const h = pg.steps.find((s) => s.id === 'household');
    expect(h.theirLine.id).toBe('bridge-ladder');
    expect(fill(PLAN.theirLines[h.theirLine.id], h.theirLine.slots)).toBe('retired. Their ladder pays from April 2027.');
    expect(h.buttons.find((b) => b.id === 'checkTogether').href).toBe('#/plan/HouseSaver02/household');   // this plan's own household step, inside V7
  });
  it('a partner named but not in the account: "not in this account"; no link and one plan: no household step', () => {
    const alone = planPage([entryOf(ladder)], ladder.id, 'household', { today: TODAY });
    expect(alone.steps.find((s) => s.id === 'household').result.text).toBe('Your partner’s plan is not in this account');
    const one = planPage([entryOf(saver)], saver.id, null, { today: TODAY });
    expect(one.steps.map((s) => s.id)).not.toContain('household');
  });
  it('an unknown id: not found', () => {
    expect(planPage(entries, 'NoSuchPlan', null, { today: TODAY }).found).toBe(false);
  });
  it('dates are words, never stamps', () => {
    expect(monthWords('2027-04')).toBe('April 2027');
    expect(dayWords('2026-07-01T08:15:00.000Z')).toBe('1 July 2026');
    expect(dateOf('2026-10-02').getDate()).toBe(2);
    expect(() => dateOf('not a date')).toThrow();
  });
});
