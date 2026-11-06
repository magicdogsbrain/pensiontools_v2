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
import { bannedHits } from '../render/checkScreen.js';

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
    // 6.51.0: the reading carries the month work stopped or stops (`stopMonth`) — null on these plans, which do not say it
    const b = savedAbout(entryOf(C['10-couple-b']).plan, { today: TODAY });
    expect(b.values).toEqual({ age: 58, stopped: 'age', stopAge: 62, stopMonth: null, startWhen: null, endAge: 93, savedYear: null });
    expect(b.timing.startMonth).toBe('2030-01');
    expect(boxesOf(entryOf(C['10-couple-b']).plan, { today: TODAY })).toEqual({ age: '58', stopped: 'age', stopAge: '62', endAge: '93' });
    const d = savedAbout(entryOf(C['02-pnv-draft']).plan, { today: TODAY });
    // 7.3.3: next April is no longer a choice, so a draft saved for it (02) reads its year as saved; nothing is written by reading
    expect(d.values).toEqual({ age: 61, stopped: 'yes', stopAge: null, stopMonth: null, startWhen: 'saved', endAge: 95, savedYear: 2027 });
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
      'budgetTool.settings.retirementAge': 63,
      // the Accumulation tab's stop kept in step (release step R2: one stop on "What you pay in"); its age today already agrees
      'accumulationTool.settings.retirementAge': 63
    });
    expect(p.previous).toEqual({
      'stressTool.settings.retireAge': 62, 'stressTool.settings.firstTaxYear': 2029, 'stressTool.settings.shapeAgeNow': 62,
      'stressTool.settings.duration': 32, 'decisionTool.settings.firstTaxYear': 2029, 'budgetTool.settings.retirementAge': 62,
      'accumulationTool.settings.retirementAge': 62
    });
    // stopped, starting this tax year: the flag, no stop age, the chosen year, the budget's copy (7.3.3: next April is not offered)
    expect(aboutPatch(plan, { stopped: 'yes', startWhen: 'april', endAge: '90' }, { today: TODAY }).errors).toEqual({ startWhen: 'notAnOption' });
    const q = aboutPatch(plan, { stopped: 'yes', startWhen: 'now', endAge: '90' }, { today: TODAY });
    expect(q.patch).toEqual({
      'stressTool.settings.retired': true, 'stressTool.settings.retireAge': null, 'stressTool.settings.firstTaxYear': 2026,
      'stressTool.settings.shapeAgeNow': 59, 'decisionTool.settings.firstTaxYear': 2026,
      'budgetTool.settings.retired': true, 'budgetTool.settings.retirementAge': 59
    });
    // a month: the age reached in it is what the plan holds. Re-written in 6.51.0: the month itself is now kept
    // (stoppedWork), so it is said back as typed and the plan's year 0 is its tax year (research/plan-start.md §2 A: "the
    // tax year of the stop") — before, only the age was kept and the plan took the birthday month it is reached in
    // (January 2031) and that month's tax year, 2030/31, a year in which the person was still at work.
    const m = aboutPatch(plan, { stopped: 'month', stopMonth: 'June 2031' }, { today: TODAY });
    expect(m.patch['stressTool.settings.retireAge']).toBe(63);
    expect(m.patch['stressTool.settings.stoppedWork']).toBe('2031-06');
    expect(m.patch['stressTool.settings.firstTaxYear']).toBe(2031);
    const view = aboutOf([{ plan }], plan.id, { today: TODAY, typed: { stopped: 'month', stopMonth: 'June 2031' } });
    expect(view.derived[0]).toEqual({ id: 'monthAs', slots: { age: 63, month: 'June 2031' } });
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
    // 6.51.0: someone who has stopped may say the month, however long ago (up to this month), and choose any year offered
    pastMonth: fc.option(fc.tuple(fc.integer({ min: 2014, max: 2026 }), fc.integer({ min: 1, max: 12 })).map(([y, m]) => y + '-' + String(m).padStart(2, '0')).filter((x) => x <= TODAY.slice(0, 7)), { nil: null }),
    pick: fc.nat(),
    startWhen: fc.constantFrom('now'),   // 7.3.3: next April is no longer offered
    endExtra: fc.integer({ min: 0, max: 30 }),
    sex: fc.constantFrom('m', 'f'),
    chance: fc.constantFrom('10', '25', '50')
  }).map((r) => {
    const typed = { age: r.age, stopped: r.stopped, sex: r.sex, chance: r.chance };
    if (r.stopped === 'age') typed.stopAge = String(Math.min(85, +r.age + r.stopExtra));
    if (r.stopped === 'month') typed.stopMonth = r.stopMonth;
    // A plan whose saved stop is still to come (19's saving plan, back to work: research/plan-start.md §2 J — the first in the
    // corpus) shows that month in its box; saying "I have stopped" then asks for the month it happened, so one is given.
    const pastMonth = r.pastMonth || (saved.values.stopped === 'month' ? TODAY.slice(0, 7) : null);
    if (r.stopped === 'yes') {
      if (pastMonth) { typed.stopMonth = pastMonth; const offered = checkAbout(plan, typed, { today: TODAY }).offered; typed.startWhen = offered[r.pick % offered.length]; }
      else typed.startWhen = r.startWhen;
    }
    const c = checkAbout(plan, typed, { today: TODAY });
    typed.endAge = String(Math.min(110, (c.minEnd || saved.timing.shapeAgeNow + MIN_YEARS - 1) + r.endExtra));
    return typed;
  });
}

describe('the month work stopped (6.51.0, research/plan-start.md §2 C/D, §3): a past month accepted, its tax year the default', () => {
  const plan = () => entryOf(C['02-pnv-draft']).plan;   // retired, a draft, its income from next April (2027/28), to 95
  const fill = (t, slots) => String(t).replace(/\{(\w+)\}/g, (m, k) => (k in slots ? slots[k] : m));
  it('stopped in October 2023: the years from then are offered, the stop\'s year chosen, and the plan keeps its end age', () => {
    const c = checkAbout(plan(), { stopMonth: 'October 2023' }, { today: TODAY });
    expect(c.errors).toEqual({});
    expect(c.offered).toEqual(['stop', 'y2024', 'y2025', 'now', 'saved']);   // 7.3.3: never next April; 02's own saved year kept
    expect(c.values.startWhen).toBe('stop');
    const p = aboutPatch(plan(), { stopMonth: 'October 2023' }, { today: TODAY });
    expect(p.patch['stressTool.settings.stoppedWork']).toBe('2023-10');
    expect(p.patch['stressTool.settings.firstTaxYear']).toBe(2023);
    expect(p.patch['decisionTool.settings.firstTaxYear']).toBe(2023);
    for (const k of Object.keys(p.patch)) expect(ABOUT_WRITES).toContain(k);
    const after = applyPatch(plan(), p.patch);
    const s = savedAbout(after, { today: TODAY });
    expect(s.values).toMatchObject({ stopped: 'yes', stopMonth: '2023-10', startWhen: 'stop', endAge: 95 });
    expect(boxesOf(after, { today: TODAY }).stopMonth).toBe('October 2023');
    expect(aboutPatch(after, {}, { today: TODAY }).patch).toEqual({});
    // running, not out of date: no "update it to today" (P.stale), and the plan reads where it stands
    expect(aboutOf([entryOf(after)], after.id, { today: TODAY }).stale).toBeNull();
    expect(planPage([entryOf(after)], after.id, null, { today: TODAY }).next.id).toBe('P.draft');
    const view = aboutOf([entryOf(after)], after.id, { today: TODAY });
    expect(view.derived.map((d) => d.id)).toEqual(['stoppedIn', 'firstYear', 'started', 'runs', 'stepsFrom']);
    expect(view.yearStop).toBe('2023/24');
    const words = view.derived.map((d) => fill(ABOUT.derived[d.id], d.slots));
    expect(words[0]).toBe('You stopped work in October 2023.');
    expect(words[2]).toBe('Your plan’s income started in 2023/24. It is worked out from where it stands today: tax year 2026/27, at ' + (s.timing.shapeAgeNow + 3) + ', for the years that are left.');
    for (const w of words) for (const hit of bannedHits(w, ['all', 'record', 'retired'])) expect(hit).toBe('');
  });
  it('a year between the stop\'s and this one may be chosen, never a later one (7.3.3); a stop this tax year offers this year first', () => {
    const p = aboutPatch(plan(), { stopMonth: '2023-10', startWhen: 'y2025' }, { today: TODAY });
    expect(p.patch['stressTool.settings.firstTaxYear']).toBe(2025);
    expect(aboutPatch(plan(), { stopMonth: '2026-08', startWhen: 'april' }, { today: TODAY }).errors).toEqual({ startWhen: 'notAnOption' });
    // 02's own saved year stays on offer as saved (a choice made before), and keeping it writes no new year
    const kept = aboutPatch(plan(), { stopMonth: '2026-08', startWhen: 'saved' }, { today: TODAY });
    expect(kept.patch['stressTool.settings.stoppedWork']).toBe('2026-08');
    expect(kept.patch['stressTool.settings.firstTaxYear']).toBeUndefined();
    const v = aboutOf([entryOf(applyPatch(plan(), kept.patch))], plan().id, { today: TODAY });
    expect(v.derived.map((d) => d.id)).not.toContain('startsLater');   // no words for months before the plan
    expect(checkAbout(plan(), { stopMonth: '2026-08' }, { today: TODAY })).toMatchObject({ offered: ['now', 'saved'], values: { startWhen: 'now' } });
  });
  it('a year never saved (a retiree with no saved year and no stop month) is named by its year alone, never "as saved"', () => {
    const p = plan();
    expect(aboutOf([entryOf(p)], p.id, { today: TODAY }).yearSavedIsSet).toBe(true);   // 02 saved 2027/28
    const unsaved = JSON.parse(JSON.stringify(p));
    delete unsaved.stressTool.settings.firstTaxYear; delete unsaved.stressTool.settings.legacyFirstTaxYear;
    const a = savedAbout(unsaved, { today: TODAY });
    expect(a.values.startWhen).toBe('saved');
    expect(a.savedYearIsSet).toBe(false);
    const v = aboutOf([entryOf(unsaved)], unsaved.id, { today: TODAY });
    expect(v.yearSavedIsSet).toBe(false);
    expect(ABOUT.fields.startWhen.notSaved.replace('{yearSaved}', '2027/28')).not.toMatch(/saved/i);
  });
  it('stopped at 17, long ago: the end age offered is never one the box refuses (the property test below found one)', () => {
    const c = checkAbout(plan(), { age: '30', stopped: 'yes', stopMonth: '2014-01', startWhen: 'stop' }, { today: TODAY });
    expect(c.errors).toEqual({});
    expect(c.minEnd).toBe(23);                                 // the box's lowest age, not 17 + 5 − 1
    expect(checkAbout(plan(), { age: '30', stopped: 'yes', stopMonth: '2014-01', startWhen: 'stop', endAge: String(c.minEnd) }, { today: TODAY }).errors).toEqual({});
  });
  it('under "I have stopped work" a month ahead, or before the age of 16, is refused; blank says nothing (as every plan before)', () => {
    expect(checkAbout(plan(), { stopMonth: 'June 2030' }, { today: TODAY }).errors).toEqual({ stopMonth: 'month-ahead' });
    expect(checkAbout(plan(), { stopMonth: '1950-01' }, { today: TODAY }).errors).toEqual({ stopMonth: 'too-early' });
    expect(checkAbout(plan(), { stopMonth: '' }, { today: TODAY }).errors).toEqual({});
    expect(aboutPatch(plan(), { stopMonth: '' }, { today: TODAY }).patch).toEqual({});
    // choosing a stop at an age clears a month that was saved
    const after = applyPatch(plan(), aboutPatch(plan(), { stopMonth: '2023-10' }, { today: TODAY }).patch);
    expect(aboutPatch(after, { stopped: 'age', stopAge: '66' }, { today: TODAY }).patch['stressTool.settings.stoppedWork']).toBe(null);
  });
});

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
      // Re-written in 6.51.0: a month work stopped or stops is kept (stoppedWork) and reads back as typed — a stop to come
      // reads as "I will stop in a month" with its month, no longer as the age reached in it; a past month keeps its choice.
      const sameMonth = (a, b) => JSON.stringify(parseMonth(a)) === JSON.stringify(parseMonth(b));
      // a blank month box says nothing: a plan that already says when work stopped keeps it (6.56.0's fixture 18 carries one on)
      const kept = plan.stressTool.settings.stoppedWork || null;
      if (typed.stopped === 'yes') { expect(boxes.stopped).toBe('yes'); expect(boxes.startWhen).toBe(typed.startWhen); if (typed.stopMonth) expect(sameMonth(boxes.stopMonth, typed.stopMonth)).toBe(true); else if (kept) expect(sameMonth(boxes.stopMonth, kept)).toBe(true); else expect(boxes.stopMonth).toBeUndefined(); }
      else if (typed.stopped === 'month') { expect(boxes.stopped).toBe('month'); expect(sameMonth(boxes.stopMonth, typed.stopMonth)).toBe(true); }
      else { expect(boxes.stopped).toBe('age'); expect(boxes.stopAge).toBe(typed.stopAge); }
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
    expect(stale(changed({ stopped: 'yes', startWhen: 'now' })).diffs).toEqual(['stopped', 'years']);
    expect(stale(changed({ endAge: '95' })).diffs).toEqual(['years']);
    // a change made in the planner is caught the same way (the inputs are the record): no date of the change when none is newer
    const planner = { ...plan, stressTool: { ...plan.stressTool, settings: { ...plan.stressTool.settings, duration: 40 } } };
    expect(stale(planner)).toMatchObject({ diffs: ['years'], changedOn: null });
  });
  it('the page: P.recheck after a saver\'s check-in sentences (release step R3) and just before P.stale; the sentence and its button to the run; the stale line; not on a locked plan', () => {
    // 7.3.0 (retaken on purpose): the design's rank table — the check-ins (10–12), an aim (13), what you hold (14), the move
    // still to make on a drawing plan with no record of what it holds (rank 8, "drawing (lower)"), then the out-of-date
    // answer and draft (15)
    expect(NEXT_ORDER.slice(NEXT_ORDER.indexOf('P.pot'), NEXT_ORDER.indexOf('P.recheck'))).toEqual(['P.pot', 'P.checkinDue', 'P.behind', 'P.noAim', 'P.holdStale', 'P.moveLater']);
    expect(NEXT_ORDER.indexOf('P.recheck')).toBe(NEXT_ORDER.indexOf('P.stale') - 1);
    expect(PLAN.next['P.recheck']).toContain('check it still lasts');
    const plan = withAnswer(base);
    const changed = applyPatch({ ...plan, lastModified: '2026-10-02T09:00:00.000Z' }, aboutPatch(plan, { endAge: '95' }, { today: TODAY }).patch);
    const pg = planPage([{ plan: changed }], changed.id, 'plan', { today: TODAY });
    // 7.3.0: due behind the saver's first check-in (rank 10), with its words and button as before
    expect(pg.next.id).toBe('P.firstCheckIn');
    const recheck = pg.due.find((d) => d.pid === 'P.recheck');
    expect(recheck.id).toBe('answer.stale');
    expect(recheck.button).toEqual({ id: 'recheck', href: '#/plan/' + changed.id + '/lasts', slots: {} });   // into "Does it last?" inside V7 (editing-in-v7.md 10), no hand-over
    expect(pg.answerStale).toMatchObject({ workedOutOn: '20 September 2026', changedOn: '2 October 2026' });
    // the unchanged plan (7.3.0, retaken on purpose: it was P.approaching): no out-of-date answer, and its Next is the saver's
    // first check-in, the design's rank 10, ahead of the "approaching" sentence that says where things stand
    expect(planPage([{ plan }], plan.id, 'plan', { today: TODAY }).due.map((d) => d.pid)).not.toContain('P.recheck');
    expect(planPage([{ plan }], plan.id, 'plan', { today: TODAY }).next.id).toBe('P.firstCheckIn');
    expect(planPage([{ plan }], plan.id, 'plan', { today: TODAY }).answerStale).toBe(null);
    const locked = { ...changed, decisionTool: { ...changed.decisionTool, settings: { ...changed.decisionTool.settings, locked: true, lockedAt: '2026-10-01T00:00:00.000Z' } } };
    expect(planPage([{ plan: locked }], locked.id, 'plan', { today: TODAY }).answerStale).toBe(null);
  });
});

describe('E3 — the sub-step tables', () => {
  it('"about", "income" and "spend" sit under "plan"; they are listed for every stage × locked × linked that lists "plan" — every stage does', () => {
    expect(SUB_STEPS).toEqual({ plan: ['about', 'income', 'spend', 'pots', 'lasts', 'way', 'mix'] });
    expect(ALL_SUB_STEPS).toEqual(['about', 'income', 'spend', 'pots', 'lasts', 'way', 'mix']);
    for (const stage of Object.keys(STEPS)) for (const locked of [false, true]) for (const linked of [false, true]) for (const manyPlans of [false, true]) {
      const steps = stepsFor(stage, { locked, linked, manyPlans }).map((s) => s.id);
      const subs = subStepsFor(stage, { locked, linked, manyPlans });
      expect(subs.length > 0).toBe(steps.includes('plan'));
      if (steps.includes('plan')) expect(subs).toEqual([{ id: 'about', under: 'plan' }, { id: 'income', under: 'plan' }, { id: 'spend', under: 'plan' }, { id: 'pots', under: 'plan' }, { id: 'lasts', under: 'plan' }, { id: 'way', under: 'plan' }, { id: 'mix', under: 'plan' }]);
    }
  });
  for (const today of DATES) {
    it(`every corpus plan at ${today}: the page carries the sub-step, and the plan step's About section links to it`, () => {
      const entries = entriesAt(today);
      for (const e of entries) {
        const pg = planPage(entries, e.plan.id, 'plan', { today });
        expect(pg.subSteps).toEqual([{ id: 'about', under: 'plan' }, { id: 'income', under: 'plan' }, { id: 'spend', under: 'plan' }, { id: 'pots', under: 'plan' }, { id: 'lasts', under: 'plan' }, { id: 'way', under: 'plan' }, { id: 'mix', under: 'plan' }]);
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
    // 7.3.0 (retaken on purpose): the lock is the design's rank 4 and an out-of-date draft rank 15, so the draft's own
    // sentence comes first; "update it to today" is due with it, into "About you and when" as before
    expect(stale.next.id).toBe('P.draft');
    const st = stale.due.find((d) => d.pid === 'P.stale');
    expect(st.id).toBe('draft.stale');
    expect(st.button.href).toBe('#/plan/' + old.id + '/about');
    // Re-written in 6.51.0 (research/plan-start.md §7): the same retired draft with a past start that says when work stopped
    // (in that tax year) is running, not out of date — no "update it to today" nudge; its next sentence is the draft's own
    const said = JSON.parse(JSON.stringify(old));
    said.stressTool.settings.stoppedWork = '2025-09';
    const running = planPage([entryOf(said)], said.id, null, { today: TODAY });
    expect(running.next.id).toBe('P.draft');
    expect(aboutOf([entryOf(said)], said.id, { today: TODAY }).stale).toBeNull();
  });
  it('the fields and their words line up; the declared writes are the planner\'s timing keys', () => {
    for (const f of ABOUT_FIELDS) { expect(ABOUT.fields[f.path].label, f.path).toBeTypeOf('string'); if (f.type === 'choice') for (const o of f.options) expect(ABOUT.fields[f.path].options[o], `${f.path}.${o}`).toBeTypeOf('string'); }
    for (const p of ABOUT_WRITES) expect(p).toMatch(/^(stressTool|decisionTool|budgetTool|accumulationTool)\.settings\.[a-zA-Z]+$/);
    // of the Accumulation tab's settings, only its two ages (kept in step with the stop; the rest is "What you pay in"'s)
    expect(ABOUT_WRITES.filter((p) => p.startsWith('accumulationTool.'))).toEqual(['accumulationTool.settings.currentAge', 'accumulationTool.settings.retirementAge']);
    // the second step's declared list sits between this step's and the stamp (editing-in-v7.md 7.3)
    expect(ALL_WRITES.slice(0, ABOUT_WRITES.length)).toEqual([...ABOUT_WRITES]);
    expect(ALL_WRITES[ALL_WRITES.length - 1]).toBe('lastModified');
  });
});
