/**
 * E1–E3 (research/v7/editing-in-v7.md 5): the pure reader and writer of "About you and when".
 *  - E1: aboutOf on the 12 corpus plans × 3 dates; read∘write∘read is identity (fast-check over random plans and typed
 *    boxes); a patch names only ABOUT_WRITES paths; every other byte of the plan is unchanged; Undo puts it back exactly.
 *  - E2: the stale-answer rule, and P.recheck on the page.
 *  - E3: the sub-step tables for every stage × locked × linked, and on every corpus plan × date.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { aboutOf, aboutPatch, applyPatch, boxesOf, savedAbout, checkAbout, answerAge, parseMonth, get, derivedLines } from '../../../src/answers/plan/about.js';
import { ABOUT_FIELDS, ABOUT_PATHS, ABOUT_WRITES, ALL_WRITES, MIN_YEARS } from '../../../src/answers/plan/schema.js';
import { STEPS, stepsFor, subStepsFor, SUB_STEPS, ALL_SUB_STEPS, NEXT_ORDER } from '../../../src/answers/plan/steps.js';
import { planPage } from '../../../src/answers/plan/read.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { ABOUT } from '../../../src/v7/copy/about.js';
import { PLAN } from '../../../src/v7/copy/plan.js';
import { corpus, entriesAt, entryOf, household, DATES, TODAY, noon } from './_plans.js';

const C = corpus();
const strip = (plan) => { const out = JSON.parse(JSON.stringify(plan)); for (const p of ALL_WRITES) { const parts = p.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; } return out; };
const text = (v) => JSON.stringify(v);

/** The unlocked corpus plans that carry an age (the ones a person can edit without first typing one). */
const EDITABLE = Object.values(C).filter((p) => !(p.decisionTool && p.decisionTool.settings && p.decisionTool.settings.locked) && +(p.stressTool.settings.currentAge) > 0);

describe('E1 — the reading, on every corpus plan at three dates', () => {
  for (const today of DATES) {
    it(`at ${today}: found, every field has words, every derived line has words, every path written is declared`, () => {
      const entries = entriesAt(today);
      for (const e of entries) {
        const a = aboutOf(entries, e.plan.id, { today });
        expect(a.found).toBe(true);
        expect(a.fields.map((f) => f.path)).toEqual(ABOUT_PATHS);
        for (const f of a.fields) expect(ABOUT.fields[f.path], f.path).toBeTruthy();
        for (const d of a.derived) expect(ABOUT.derived[d.id], d.id).toBeTypeOf('string');
        for (const k of Object.keys(a.patch)) expect(ABOUT_WRITES).toContain(k);
        expect(a.locked).toBe(!!(e.plan.decisionTool && e.plan.decisionTool.settings && e.plan.decisionTool.settings.locked));
        expect(a.editable).toBe(!a.locked);
        if (a.locked) { expect(a.patch).toEqual({}); expect(a.lockedOn).toBeTypeOf('string'); }
        // a plan with an age has no problem as saved; one without needs its age and whether they have stopped
        const hasAge = +(effectiveStressSettings(e.plan, { now: noon(today) }).currentAge) > 0;
        if (hasAge) expect(a.errors, e.plan.id).toEqual({});
        else { expect(a.errors.age).toBe('required'); expect(a.errors.stopped).toBe('required'); expect(a.derived.map((d) => d.id)).toEqual(['noAge']); }
        // the suggestion reads the typed age; none without one
        expect(!!a.suggestion).toBe(hasAge);
      }
    });
  }
  it('the saved facts: 10 stops at 62 in January 2030 and plans to 93; 02 has stopped, starts next April, plans to 95; 03 (locked) reads its document', () => {
    const b = savedAbout(entryOf(C['10-couple-b']).plan, { today: TODAY });
    expect(b.values).toEqual({ age: 58, stopped: 'age', stopAge: 62, startWhen: null, endAge: 93, savedYear: null });
    expect(b.timing.startMonth).toBe('2030-01');
    expect(boxesOf(entryOf(C['10-couple-b']).plan, { today: TODAY })).toEqual({ age: '58', stopped: 'age', stopAge: '62', endAge: '93' });
    const d = savedAbout(entryOf(C['02-pnv-draft']).plan, { today: TODAY });
    expect(d.values).toEqual({ age: 61, stopped: 'yes', stopAge: null, startWhen: 'april', endAge: 95, savedYear: null });
    expect(d.ageSource).toEqual({ kind: 'saved', at: '14 August 2026' });
    const l = savedAbout(entryOf(C['03-gilt-ladder-runup']).plan, { today: TODAY });
    expect(l.locked).toBe(true);
    expect(l.source.kind).toBe('locked');
    expect(l.values.stopped).toBe('yes');
  });
  it('the derived lines: stopping later says the month and the age; stopped says the first tax year; both say the run and the start age', () => {
    const es = entriesAt(TODAY);
    const b = aboutOf(es, C['10-couple-b'].id, { today: TODAY });
    expect(b.derived).toEqual([
      { id: 'stopIn', slots: { month: 'January 2030', age: 62 } },
      { id: 'firstYear', slots: { year: '2029/30', y: 2029 } },
      { id: 'runs', slots: { years: 32, from: 'January 2030', endAge: 93 } },
      { id: 'stepsFrom', slots: { age: 62 } }
    ]);
    const d = aboutOf(es, C['02-pnv-draft'].id, { today: TODAY });
    expect(d.derived.map((x) => x.id)).toEqual(['firstYear', 'runs', 'stepsFrom']);
    expect(d.derived[1].slots).toEqual({ years: 33, from: 'April 2027', endAge: 95 });
    expect(derivedLines(null, 30)).toEqual([{ id: 'noAge', slots: {} }]);
  });
  it('a plan as saved writes nothing (10, 02, 09, 12); a plan without its pins stored writes the pins the planner\'s own load would (11)', () => {
    for (const name of ['10-couple-b', '02-pnv-draft', '09-couple-a', '12-lumpy-db-gia']) expect(aboutPatch(entryOf(C[name]).plan, {}, { today: TODAY }).patch, name).toEqual({});
    const g = aboutPatch(entryOf(C['11-guest-demo']).plan, {}, { today: TODAY });
    expect(Object.keys(g.patch)).toContain('stressTool.settings.retired');
    expect(g.patch['stressTool.settings.currentAgeAsOf']).toBe(TODAY);
    for (const k of Object.keys(g.patch)) expect(ABOUT_WRITES).toContain(k);
  });
  it('the write: the stop age and the end age changed on 10 — the exact paths and values, as the planner\'s Save writes them', () => {
    const plan = entryOf(C['10-couple-b']).plan;
    const p = aboutPatch(plan, { stopAge: '63', endAge: '95' }, { today: TODAY });
    expect(p.ok).toBe(true);
    expect(p.patch).toEqual({
      'stressTool.settings.retireAge': 63,
      'stressTool.settings.firstTaxYear': 2030,
      'stressTool.settings.shapeAgeNow': 63,
      'stressTool.settings.duration': 33,
      'decisionTool.settings.firstTaxYear': 2030,
      'budgetTool.settings.retirementAge': 63
    });
    expect(p.previous).toEqual({
      'stressTool.settings.retireAge': 62, 'stressTool.settings.firstTaxYear': 2029, 'stressTool.settings.shapeAgeNow': 62,
      'stressTool.settings.duration': 32, 'decisionTool.settings.firstTaxYear': 2029, 'budgetTool.settings.retirementAge': 62
    });
    // stopped, starting next April: the flag, no stop age, the chosen year, the budget's copy
    const q = aboutPatch(plan, { stopped: 'yes', startWhen: 'april', endAge: '90' }, { today: TODAY });
    expect(q.patch).toEqual({
      'stressTool.settings.retired': true, 'stressTool.settings.retireAge': null, 'stressTool.settings.firstTaxYear': 2027,
      'stressTool.settings.shapeAgeNow': 60, 'stressTool.settings.duration': 31, 'decisionTool.settings.firstTaxYear': 2027,
      'budgetTool.settings.retired': true, 'budgetTool.settings.retirementAge': 60
    });
    // a month: the age reached in it is what the plan holds; the plan's own month for that age is said back
    const m = aboutPatch(plan, { stopped: 'month', stopMonth: 'June 2031' }, { today: TODAY });
    expect(m.patch['stressTool.settings.retireAge']).toBe(63);
    const view = aboutOf([{ plan }], plan.id, { today: TODAY, typed: { stopped: 'month', stopMonth: 'June 2031' } });
    expect(view.derived[0]).toEqual({ id: 'monthAs', slots: { age: 63, month: 'January 2031' } });
    // a new age today is dated today; the same age keeps its date
    expect(aboutPatch(plan, { age: '59' }, { today: TODAY }).patch['stressTool.settings.currentAgeAsOf']).toBe(TODAY);
    expect(aboutPatch(plan, { age: '58' }, { today: TODAY }).patch).toEqual({});
  });
  it('a locked plan: no patch, whatever is typed', () => {
    const plan = entryOf(C['03-gilt-ladder-runup']).plan;
    const p = aboutPatch(plan, { endAge: '99' }, { today: TODAY });
    expect(p.ok).toBe(false);
    expect(p.errors).toEqual({ plan: 'locked' });
    expect(p.patch).toEqual({});
  });
  it('the problems, in their ids: required, not a number, below the age today, a month passed, too short a plan, too high', () => {
    const plan = entryOf(C['10-couple-b']).plan;
    const errs = (typed) => checkAbout(plan, typed, { today: TODAY }).errors;
    expect(errs({ age: '' })).toEqual({ age: 'required' });
    expect(errs({ age: 'abc' })).toEqual({ age: 'notANumber' });
    expect(errs({ age: '17' })).toEqual({ age: 'tooLow' });
    expect(errs({ stopAge: '57' })).toEqual({ stopAge: 'stop-before-age' });
    expect(errs({ stopAge: '58' })).toEqual({});
    expect(errs({ stopAge: '86' })).toEqual({ stopAge: 'tooHigh' });
    expect(errs({ stopped: 'month', stopMonth: '2026-09' })).toEqual({ stopMonth: 'month-passed' });
    expect(errs({ stopped: 'month', stopMonth: '2026-10' })).toEqual({ stopMonth: 'month-passed' });
    expect(errs({ stopped: 'month', stopMonth: 'soon' })).toEqual({ stopMonth: 'notAMonth' });
    expect(errs({ stopped: 'month', stopMonth: '' })).toEqual({ stopMonth: 'required' });
    expect(errs({ stopped: 'yes' })).toEqual({ startWhen: 'required' });
    expect(errs({ stopped: 'yes', startWhen: 'saved' })).toEqual({ startWhen: 'notAnOption' });   // the saved year is a stop age's, not offered
    expect(errs({ endAge: '65' })).toEqual({ endAge: 'too-short' });                               // the plan's first year is 62: at least 66
    expect(errs({ endAge: '66' })).toEqual({});
    expect(errs({ endAge: '111' })).toEqual({ endAge: 'tooHigh' });
    expect(errs({ sex: 'x' })).toEqual({ sex: 'notAnOption' });
    expect(checkAbout(plan, { endAge: '65' }, { today: TODAY }).minEnd).toBe(62 + MIN_YEARS - 1);
  });
  it('parseMonth reads the forms a person types', () => {
    expect(parseMonth('2030-06')).toEqual({ y: 2030, m: 6 });
    expect(parseMonth('2030-6')).toEqual({ y: 2030, m: 6 });
    expect(parseMonth('6/2030')).toEqual({ y: 2030, m: 6 });
    expect(parseMonth('June 2030')).toEqual({ y: 2030, m: 6 });
    expect(parseMonth('jun 2030')).toEqual({ y: 2030, m: 6 });
    expect(parseMonth('2030-13')).toBe(null);
    expect(parseMonth('Junk 2030')).toBe(null);
    expect(parseMonth('')).toBe(null);
  });
  it('the suggestion: the planner\'s own helper, by the typed age, sex and chance; "applied" when the box holds it', () => {
    const plan = entryOf(C['10-couple-b']).plan;
    const a = aboutOf([{ plan }], plan.id, { today: TODAY, typed: { sex: 'f', chance: '25' } });
    expect(a.suggestion.endAge).toBe(93);
    expect(a.suggestion.applied).toBe(true);     // 10 plans to 93 already
    expect(a.suggestion.slots).toEqual({ age: 93, who: 'women', ageNow: 58, chance: '25' });
    const b = aboutOf([{ plan }], plan.id, { today: TODAY, typed: { sex: 'm', chance: '10', endAge: '90' } });
    expect(b.suggestion.endAge).toBe(96);
    expect(b.suggestion.applied).toBe(false);
  });
  it('a plan not in the list, and the partner link both ways', () => {
    expect(aboutOf(entriesAt(TODAY), 'NoSuchPlan', { today: TODAY }).found).toBe(false);
    const { ladder, saver } = household();
    const entries = [entryOf(ladder), entryOf(saver)];
    expect(aboutOf(entries, saver.id, { today: TODAY }).partners).toEqual([{ id: 'HouseLadder01', name: 'Ladder plan' }]);
    expect(aboutOf(entries, ladder.id, { today: TODAY }).partners).toEqual([{ id: 'HouseSaver02', name: 'Saving plan' }]);
  });
});

/** Random typed boxes that pass the checks for a plan, as a person would type them. */
function validTyped(plan) {
  const saved = savedAbout(plan, { today: TODAY });
  return fc.record({
    age: fc.integer({ min: 30, max: 75 }).map(String),
    stopped: fc.constantFrom('yes', 'age', 'month'),
    stopExtra: fc.integer({ min: 0, max: 10 }),
    stopMonth: fc.tuple(fc.integer({ min: 2027, max: 2040 }), fc.integer({ min: 1, max: 12 })).map(([y, m]) => y + '-' + String(m).padStart(2, '0')),
    startWhen: fc.constantFrom('now', 'april'),
    endExtra: fc.integer({ min: 0, max: 30 }),
    sex: fc.constantFrom('m', 'f'),
    chance: fc.constantFrom('10', '25', '50')
  }).map((r) => {
    const typed = { age: r.age, stopped: r.stopped, sex: r.sex, chance: r.chance };
    if (r.stopped === 'age') typed.stopAge = String(Math.min(85, +r.age + r.stopExtra));
    if (r.stopped === 'month') typed.stopMonth = r.stopMonth;
    if (r.stopped === 'yes') typed.startWhen = r.startWhen;
    const c = checkAbout(plan, typed, { today: TODAY });
    typed.endAge = String(Math.min(110, (c.minEnd || saved.timing.shapeAgeNow + MIN_YEARS - 1) + r.endExtra));
    return typed;
  });
}

describe('E1 — properties: read∘write∘read is identity; only declared keys change; Undo puts the plan back exactly', () => {
  it('for random editable plans and random valid boxes', () => {
    fc.assert(fc.property(fc.constantFrom(...EDITABLE).chain((raw) => { const plan = entryOf(raw).plan; return validTyped(plan).map((typed) => ({ plan, typed })); }), ({ plan, typed }) => {
      const c = checkAbout(plan, typed, { today: TODAY });
      expect(c.errors).toEqual({});
      const p = aboutPatch(plan, typed, { today: TODAY });
      expect(p.ok).toBe(true);
      for (const k of Object.keys(p.patch)) expect(ABOUT_WRITES).toContain(k);
      expect(Object.keys(p.previous).sort()).toEqual(Object.keys(p.patch).sort());
      const after = applyPatch(plan, p.patch);
      // every byte outside the declared paths is the same
      expect(text(strip(after))).toBe(text(strip(plan)));
      // read again: the boxes hold what was typed (a month becomes the age reached in it)
      const boxes = boxesOf(after, { today: TODAY });
      expect(boxes.age).toBe(typed.age);
      expect(boxes.endAge).toBe(typed.endAge);
      if (typed.stopped === 'yes') { expect(boxes.stopped).toBe('yes'); expect(boxes.startWhen).toBe(typed.startWhen); }
      else { expect(boxes.stopped).toBe('age'); if (typed.stopped === 'age') expect(boxes.stopAge).toBe(typed.stopAge); else expect(+boxes.stopAge).toBeGreaterThanOrEqual(+typed.age); }
      // writing the read boxes again changes nothing
      expect(aboutPatch(after, {}, { today: TODAY }).patch).toEqual({});
      expect(aboutPatch(after, boxes, { today: TODAY }).patch).toEqual({});
      // Undo: the previous values back, byte for byte
      expect(text(applyPatch(after, p.previous))).toBe(text(plan));
    }), { numRuns: 150 });
  });
  it('the saved values read from a written plan are the planner\'s own reading of it (effectiveStressSettings)', () => {
    fc.assert(fc.property(fc.constantFrom(...EDITABLE).chain((raw) => { const plan = entryOf(raw).plan; return validTyped(plan).map((typed) => ({ plan, typed })); }), ({ plan, typed }) => {
      const after = applyPatch(plan, aboutPatch(plan, typed, { today: TODAY }).patch);
      const ss = effectiveStressSettings(after, { now: noon(TODAY) });
      expect(ss.currentAge).toBe(+typed.age);
      expect(ss.retired).toBe(typed.stopped === 'yes');
      expect(ss.duration).toBe(+typed.endAge - ss.shapeAgeNow + 1);
      expect(get(after, 'decisionTool.settings.firstTaxYear')).toBe(ss.firstTaxYear);
    }), { numRuns: 60 });
  });
});

/** A plan made from a V7 answer: the answer's own record of its inputs (PlanSeed.js fromAnswer), matching the plan's settings. */
function withAnswer(plan, { savedOn = '2026-09-20T10:00:00.000Z', lastModified = '2026-09-20T10:00:00.000Z', patch = {} } = {}) {
  const ss = plan.stressTool.settings;
  const later = ss.retired === false;
  const person = { who: 'you', ageToday: ss.currentAge, ageAtStop: later ? ss.retireAge : ss.currentAge, years: ss.duration, stop: { kind: later ? 'later' : 'now', yearsFromNow: later ? ss.retireAge - ss.currentAge : 0 } };
  return { ...JSON.parse(JSON.stringify(plan)), lastModified, fromAnswer: { createdAt: savedOn, today: '2026-09-20', source: later ? 'a' : 'c', endAge: ss.shapeAgeNow + ss.duration - 1, years: ss.duration, stop: person.stop, people: [{ ...person, ...patch }], who: 'you', savedOn, answer: { lasted: 9, verdict: 'yes', monthly: null, runOutAge: null, potAtStop: null, number: null, payInNeeded: null } } };
}

describe('E2 — the stale-answer rule', () => {
  const base = entryOf(C['10-couple-b']).plan;
  it('a plan whose settings match its answer\'s record is not stale; one with no stored answer never is', () => {
    const plan = withAnswer(base);
    expect(answerAge(plan, effectiveStressSettings(plan, { now: noon(TODAY) }))).toBe(null);
    expect(answerAge(base, effectiveStressSettings(base, { now: noon(TODAY) }))).toBe(null);
    expect(answerAge({ ...base, fromAnswer: { savedOn: '2026-09-20' } }, base.stressTool.settings)).toBe(null);
  });
  it('each of the four facts changed makes it stale, with the day it was worked out and the day the plan changed', () => {
    const plan = withAnswer(base);
    const changed = (typed) => applyPatch({ ...plan, lastModified: '2026-10-02T09:00:00.000Z' }, aboutPatch(plan, typed, { today: TODAY }).patch);
    const stale = (p) => answerAge(p, effectiveStressSettings(p, { now: noon(TODAY) }));
    expect(stale(changed({ age: '59' }))).toMatchObject({ workedOutOn: '20 September 2026', changedOn: '2 October 2026', lasted: 9, diffs: ['age'] });
    expect(stale(changed({ stopAge: '63' })).diffs).toEqual(['stopAge', 'years']);   // the end age is kept, so the years change with the stop
    expect(stale(changed({ stopped: 'yes', startWhen: 'april' })).diffs).toEqual(['stopped', 'years']);
    expect(stale(changed({ endAge: '95' })).diffs).toEqual(['years']);
    // a change made in the planner is caught the same way (the inputs are the record): no date of the change when none is newer
    const planner = { ...plan, stressTool: { ...plan.stressTool, settings: { ...plan.stressTool.settings, duration: 40 } } };
    expect(stale(planner)).toMatchObject({ diffs: ['years'], changedOn: null });
  });
  it('the page: P.recheck after P.working and before P.stale; the sentence and its button to the run; the stale line; not on a locked plan', () => {
    expect(NEXT_ORDER.indexOf('P.recheck')).toBe(NEXT_ORDER.indexOf('P.working') + 1);
    expect(NEXT_ORDER.indexOf('P.recheck')).toBe(NEXT_ORDER.indexOf('P.stale') - 1);
    expect(PLAN.next['P.recheck']).toContain('check it still lasts');
    const plan = withAnswer(base);
    const changed = applyPatch({ ...plan, lastModified: '2026-10-02T09:00:00.000Z' }, aboutPatch(plan, { endAge: '95' }, { today: TODAY }).patch);
    const pg = planPage([{ plan: changed }], changed.id, 'plan', { today: TODAY });
    expect(pg.next.id).toBe('P.recheck');
    expect(pg.next.button).toEqual({ id: 'recheck', place: 'test', slots: {} });
    expect(pg.answerStale).toMatchObject({ workedOutOn: '20 September 2026', changedOn: '2 October 2026' });
    expect(planPage([{ plan }], plan.id, 'plan', { today: TODAY }).next.id).toBe('P.approaching');
    expect(planPage([{ plan }], plan.id, 'plan', { today: TODAY }).answerStale).toBe(null);
    const locked = { ...changed, decisionTool: { ...changed.decisionTool, settings: { ...changed.decisionTool.settings, locked: true, lockedAt: '2026-10-01T00:00:00.000Z' } } };
    expect(planPage([{ plan: locked }], locked.id, 'plan', { today: TODAY }).answerStale).toBe(null);
  });
});

describe('E3 — the sub-step tables', () => {
  it('"about", "income" and "spend" sit under "plan"; they are listed for every stage × locked × linked that lists "plan" — every stage does', () => {
    expect(SUB_STEPS).toEqual({ plan: ['about', 'income', 'spend'] });
    expect(ALL_SUB_STEPS).toEqual(['about', 'income', 'spend']);
    for (const stage of Object.keys(STEPS)) for (const locked of [false, true]) for (const linked of [false, true]) for (const manyPlans of [false, true]) {
      const steps = stepsFor(stage, { locked, linked, manyPlans }).map((s) => s.id);
      const subs = subStepsFor(stage, { locked, linked, manyPlans });
      expect(subs.length > 0).toBe(steps.includes('plan'));
      if (steps.includes('plan')) expect(subs).toEqual([{ id: 'about', under: 'plan' }, { id: 'income', under: 'plan' }, { id: 'spend', under: 'plan' }]);
    }
  });
  for (const today of DATES) {
    it(`every corpus plan at ${today}: the page carries the sub-step, and the plan step's About section links to it`, () => {
      const entries = entriesAt(today);
      for (const e of entries) {
        const pg = planPage(entries, e.plan.id, 'plan', { today });
        expect(pg.subSteps).toEqual([{ id: 'about', under: 'plan' }, { id: 'income', under: 'plan' }, { id: 'spend', under: 'plan' }]);
        const about = pg.steps.find((s) => s.id === 'plan').sections.find((s) => s.id === 'about');
        expect(about.href).toBe('#/plan/' + e.plan.id + '/about');
        expect(about.sub).toBe('about');
      }
    });
  }
  it('the next sentence\'s links into the step: no age (01) and a start year that has passed go to #/plan/<id>/about inside V7', () => {
    const entries = entriesAt(TODAY);
    const fresh = planPage(entries, C['01-fresh-default'].id, null, { today: TODAY });
    expect(fresh.next.id).toBe('P.noAge');
    expect(fresh.next.button).toEqual({ id: 'addAge', href: '#/plan/' + C['01-fresh-default'].id + '/about', slots: {} });
    const old = JSON.parse(JSON.stringify(C['02-pnv-draft']));
    old.stressTool.settings.firstTaxYear = 2025;
    const stale = planPage([entryOf(old)], old.id, null, { today: TODAY });
    expect(stale.next.id).toBe('P.stale');
    expect(stale.next.button.href).toBe('#/plan/' + old.id + '/about');
  });
  it('the fields and their words line up; the declared writes are the planner\'s timing keys', () => {
    for (const f of ABOUT_FIELDS) { expect(ABOUT.fields[f.path].label, f.path).toBeTypeOf('string'); if (f.type === 'choice') for (const o of f.options) expect(ABOUT.fields[f.path].options[o], `${f.path}.${o}`).toBeTypeOf('string'); }
    for (const p of ABOUT_WRITES) expect(p).toMatch(/^(stressTool|decisionTool|budgetTool)\.settings\.[a-zA-Z]+$/);
    // the second step's declared list sits between this step's and the stamp (editing-in-v7.md 7.3)
    expect(ALL_WRITES.slice(0, ABOUT_WRITES.length)).toEqual([...ABOUT_WRITES]);
    expect(ALL_WRITES[ALL_WRITES.length - 1]).toBe('lastModified');
  });
});
