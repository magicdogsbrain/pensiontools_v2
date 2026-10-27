/**
 * Gate 11b, the budget (research/v7/road-to-7.md step 11b; budget-step.md "The rule"): a budget saved from the preview's budget
 * step is what the planner's saveBudget would write, field for field.
 *   1. The budget as the plan reads it (budget.js readBudget: ScenarioRepository.getActiveBudget's rule, lifted) and the planner's
 *      page shape (normalisedBudget: the defaults under it, every line with an id) — on the fixture as it is, a change that
 *      changes nothing writes nothing.
 *   2. Each change kind (a line's amount typed as a sum, its period, the essential tick, from and to an age, a breakdown into
 *      parts, a line added, removed, a copy for the partner, a one-off, "Did you miss anything?", "Fill the blanks", the level,
 *      "Start again", a spreadsheet opened, who pays changing over time) writes `budgetTool.settings` whole, equal to
 *      BudgetModel.budgetToSave(cleanBudgetForSave(the budget after the planner's own handler)) — the one function
 *      BudgetRepository.saveBudget now calls — with `derived` recomputed; Undo's previous is the stored object whole.
 *   3. A shared budget (one plan reading the household's): the lines go to the holder, this plan keeps its own side, exactly as
 *      ScenarioRepository.saveActiveBudget splits it (PlanCommit.sharedBudgetWrites, the same lifted function).
 *   4. The spreadsheet round-trips: the file the step downloads (budgetToCsv) opened again replaces the budget with the same lines.
 *   5. Everything is pinned once into budgetIdentity.pins.json (numbers to a millionth); delete the file to pin again.
 * The committed fixtures carry no budget lines (the owner's local one may), so the budgets are built from the planner's own
 * starter lines with the typical amounts filled in, on 12 (its own) and on the owner-shaped pair (05 reading 03's).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import fc from 'fast-check';
import { budgetOf, budgetPatch, budgetAfter, readBudget, normalisedBudget, checkBudget, totalsOf } from '../../../src/answers/plan/budget.js';
import { budgetToSave, cleanBudgetForSave, fillTypicalAmounts, idMaker, summariseBudget, budgetToCsv, parseBudgetCsv, resetBudgetLines, importedBudget, missingSuggestions, typicalMonthlyFor, breakdownAnnual } from '../../../src/services/BudgetModel.js';
import { sharedBudgetWrites, sharedBudgetView, ownSideOf } from '../../../src/services/PlanCommit.js';
import { BUDGET_WRITES, isBudgetPath } from '../../../src/answers/plan/schema.js';
import { applyPatch } from '../../../src/answers/plan/about.js';
import { corpus, entryOf, household, TODAY, noon } from './_plans.js';

const C = corpus();
const PINS = join(process.cwd(), 'tests', 'v7', 'plan', 'budgetIdentity.pins.json');
const sha = (v) => createHash('sha1').update(JSON.stringify(v, (k, x) => (typeof x === 'number' && Number.isFinite(x) ? Math.round(x * 1e6) / 1e6 : x))).digest('hex').slice(0, 16);
const sortKeys = (v) => (Array.isArray(v) ? v.map(sortKeys) : v && typeof v === 'object' ? Object.keys(v).sort().reduce((o, k) => { if (v[k] !== undefined) o[k] = sortKeys(v[k]); return o; }, {}) : v);
const bytes = (v) => JSON.stringify(sortKeys(v));
const copy = (v) => JSON.parse(JSON.stringify(v));
const pinned = existsSync(PINS) ? JSON.parse(readFileSync(PINS, 'utf8')) : null;
const made = {};

/** A fixture with a budget worth having: the planner's starter lines with the typical amounts filled, two one-offs with amounts, one line broken into parts. */
function withBudget(raw, { shared = false } = {}) {
  const plan = copy(raw);
  const base = normalisedBudget({ ...(plan.budgetTool && plan.budgetTool.settings), sharedWithPartner: shared });
  const idOf = idMaker(base);
  let b = resetBudgetLines(base, idOf);
  b = fillTypicalAmounts(b).budget;
  b.lines.filter((l) => typicalMonthlyFor(l.label, b) != null).slice(-1)[0].annual = null;   // one line with a typical amount left blank, for "Fill the blanks"
  b.oneOffs[0].amount = 18000; b.oneOffs[0].atAge = 66;   // every few years (the starter's everyYears)
  b.oneOffs[1].amount = 2500; b.oneOffs[1].atAge = 65; b.oneOffs[1].everyYears = null;   // once
  b.lines[0].breakdown = [{ label: 'Insurance', amount: 450, period: 'yr' }, { label: 'Fuel', amount: 80, period: 'mo' }];
  b.lines[0].breakdownOpen = true;
  b.lines[0].annual = breakdownAnnual(b.lines[0].breakdown);   // as the planner keeps a line with parts: their total
  b.lines[1].fromAge = 62; b.lines[1].toAge = 70;
  plan.budgetTool = { ...(plan.budgetTool || {}), settings: budgetToSave(cleanBudgetForSave(b)) };
  return plan;
}
const entriesOf = (...raws) => raws.map((r) => entryOf(r, TODAY));
/** A plan reading the household's budget, its own side settled as the planner's first save settles it (every own-side key present). */
function readerOf(saver, holderRaw, own) {
  const r = copy(saver);
  r.budgetTool = { sharedFrom: holderRaw.id, settings: ownSideOf(normalisedBudget(sharedBudgetView(holderRaw.budgetTool.settings, own, holderRaw.id))) };
  return r;
}

/** Every change kind the step makes, on a plan's budget as read. */
function changesFor(B) {
  const first = B.lines[0], second = B.lines[1], last = B.lines[B.lines.length - 1];
  const oneOff = B.oneOffs[0];
  const missing = missingSuggestions(B)[0];
  return {
    amountSum: { kind: 'line', id: first.id, field: 'amount', value: 11.99 + 8.99 },
    period: { kind: 'line', id: second.id, field: 'period', value: second.period === 'mo' ? 'yr' : 'mo' },
    essential: { kind: 'line', id: last.id, field: 'essential', value: last.tier !== 'essential' },
    fromAge: { kind: 'line', id: second.id, field: 'fromAge', value: 64 },
    agesClosed: { kind: 'ages', id: second.id, open: false },
    part: { kind: 'part', id: first.id, i: 0, field: 'amount', value: 500 },
    partAdd: { kind: 'partAdd', id: first.id },
    partRemove: { kind: 'partRemove', id: first.id, i: 1 },
    partToggle: { kind: 'partToggle', id: last.id },
    add: { kind: 'add', tier: 'discretionary', label: 'Allotment' },
    remove: { kind: 'remove', id: second.id },
    duplicate: { kind: 'duplicate', id: first.id },
    oneOff: { kind: 'oneOff', id: oneOff.id, field: 'amount', value: 20000 },
    addOneOff: { kind: 'addOneOff', label: 'A new boiler' },
    removeOneOff: { kind: 'removeOneOff', id: oneOff.id },
    suggest: { kind: 'suggest', label: missing.label },
    fill: { kind: 'fill' },
    tier: { kind: 'tier', tier: 'comfortable' },
    reset: { kind: 'reset' },
    spreadsheet: { kind: 'spreadsheet', text: budgetToCsv(B) },
    phaseAdd: { kind: 'phaseAdd' }
  };
}

describe('gate 11b — the budget saved from the preview is what the planner\'s saveBudget writes', () => {
  it('the committed fixtures carry no budget lines, so the gate builds its own from the planner\'s starter lines (the owner\'s local fixture is the real one)', () => {
    for (const raw of Object.values(C)) expect(((raw.budgetTool && raw.budgetTool.settings && raw.budgetTool.settings.lines) || []).filter((l) => l && (l.annual > 0 || l.amount > 0))).toHaveLength(0);
  });

  it('12: the budget as read is the planner\'s page shape; a change that changes nothing writes nothing; every line keeps its id', () => {
    const plan = entryOf(withBudget(C['12-lumpy-db-gia'])).plan;
    const read = readBudget(plan, [{ plan }]);
    expect(read.shared).toBe(false);
    expect(read.holder).toBe(plan);
    const B = normalisedBudget(read.budget);
    expect(B.lines.every((l) => typeof l.id === 'string' && l.id)).toBe(true);
    expect(bytes(B)).toBe(bytes({ ...B, ...plan.budgetTool.settings }));
    // a line's name set to what it is: the budget after it, saved, is the stored object — so nothing is written
    const first = B.lines[0];
    const same = budgetPatch(plan, [{ plan }], { kind: 'line', id: first.id, field: 'label', value: first.label }, { today: TODAY });
    expect(same.ok).toBe(true);
    expect(same.writes).toEqual([]);
    expect(bytes(same.budget)).toBe(bytes(plan.budgetTool.settings));
    // a line or a one-off cost is named before it is added (a nameless one would be left out by the save): no name, no change
    expect(budgetPatch(plan, [{ plan }], { kind: 'add', tier: 'essential', label: '  ' }, { today: TODAY }).ok).toBe(false);
    expect(budgetPatch(plan, [{ plan }], { kind: 'addOneOff' }, { today: TODAY }).ok).toBe(false);
  });

  it('12: each change kind writes the whole budget as the planner\'s saveBudget would (budgetToSave over cleanBudgetForSave of the planner\'s own handler), Undo the stored object whole; pinned', () => {
    const raw = withBudget(C['12-lumpy-db-gia']);
    const plan = entryOf(raw).plan;
    const entries = [{ plan }];
    const B = normalisedBudget(readBudget(plan, entries).budget);
    const pins = {};
    for (const [name, change] of Object.entries(changesFor(B))) {
      const p = budgetPatch(plan, entries, change, { today: TODAY });
      expect(p.ok, name).toBe(true);
      expect(p.writes.length, name).toBe(1);
      expect(p.writes[0].planId).toBe(String(plan.id));
      for (const k of Object.keys(p.writes[0].patch)) expect(BUDGET_WRITES, name).toContain(k);
      // the planner's own handler, lifted, on the budget as read — then its save shape
      const after = budgetAfter(B, change, { now: noon(TODAY) });
      expect(after, name).not.toBe(null);
      const want = budgetToSave(cleanBudgetForSave(after.b));
      expect(bytes(p.writes[0].patch['budgetTool.settings']), name).toBe(bytes(want));
      expect(bytes(p.writes[0].previous['budgetTool.settings']), name).toBe(bytes(plan.budgetTool.settings));
      // derived is the totals of the budget written (what every reader of `derived` sees)
      const written = p.writes[0].patch['budgetTool.settings'];
      expect(bytes(written.derived)).toBe(bytes(summariseBudget(written)));
      // ids stay unique
      const ids = [...written.lines.map((l) => l.id), ...written.oneOffs.map((o) => o.id)];
      expect(new Set(ids).size, name).toBe(ids.length);
      // the plan after the write reads back as the change says
      const next = applyPatch(plan, p.writes[0].patch);
      const again = normalisedBudget(readBudget(next, [{ plan: next }]).budget);
      expect(bytes(again), name).toBe(bytes(normalisedBudget(written)));
      pins[name] = sha(written);
    }
    // the particular rules the planner keeps
    const sum = budgetPatch(plan, entries, changesFor(B).amountSum, { today: TODAY }).writes[0].patch['budgetTool.settings'];
    expect(sum.lines[0].annual).toBeCloseTo((B.lines[0].period === 'mo' ? 12 : 1) * (11.99 + 8.99), 6);   // a sum, the period's own annual
    const parts = budgetPatch(plan, entries, changesFor(B).part, { today: TODAY }).writes[0].patch['budgetTool.settings'];
    expect(parts.lines[0].annual).toBe(500 + 80 * 12);   // the parts' total becomes the line (breakdownAnnual)
    const closed = budgetPatch(plan, entries, changesFor(B).agesClosed, { today: TODAY }).writes[0].patch['budgetTool.settings'];
    expect(closed.lines[1].fromAge).toBe(null); expect(closed.lines[1].toAge).toBe(null);
    const dup = budgetPatch(plan, entries, changesFor(B).duplicate, { today: TODAY }).writes[0].patch['budgetTool.settings'];
    expect(dup.lines[1].label).toBe(B.lines[0].label + ' (partner)'); expect(dup.lines[1].paidBy).toBe('partner');
    const added = budgetPatch(plan, entries, changesFor(B).add, { today: TODAY });
    const newLine = added.writes[0].patch['budgetTool.settings'].lines.slice(-1)[0];
    expect(newLine).toMatchObject({ label: 'Allotment', tier: 'discretionary', annual: null });
    expect(added.line).toEqual({ id: 'added', slots: { name: 'Allotment' } });
    expect(added.focus).toBe('line.' + newLine.id + '.amount');
    const filled = budgetPatch(plan, entries, changesFor(B).fill, { today: TODAY });
    expect(filled.line).toEqual({ id: 'filled', slots: { n: '1', s: '' } });   // the one blank line
    expect(filled.writes[0].patch['budgetTool.settings'].lines.every((l) => l.annual > 0 || typicalMonthlyFor(l.label, B) == null)).toBe(true);
    const twice = budgetPatch(applyPatch(plan, filled.writes[0].patch), entries, changesFor(B).fill, { today: TODAY });
    expect(twice.writes, 'every line with a typical amount has one already').toEqual([]);
    const reset = budgetPatch(plan, entries, changesFor(B).reset, { today: TODAY }).writes[0].patch['budgetTool.settings'];
    expect(reset.lines.every((l) => l.annual == null)).toBe(true);
    expect(reset.currentAge).toBe(B.currentAge);
    // 4. the spreadsheet round-trips: the file opened again holds the same lines (the ids fresh)
    const sheet = budgetPatch(plan, entries, changesFor(B).spreadsheet, { today: TODAY }).writes[0].patch['budgetTool.settings'];
    const strip = (b) => ({ ...b, lines: b.lines.map(({ id, breakdownOpen, ...l }) => { void id; void breakdownOpen; return l; }), oneOffs: b.oneOffs.map(({ id, ...o }) => { void id; return o; }) });
    expect(strip(sheet).lines.map((l) => [l.label, l.annual, l.period, l.tier])).toEqual(strip(plan.budgetTool.settings).lines.map((l) => [l.label, l.annual, l.period, l.tier]));
    expect(sheet.oneOffs.map((o) => [o.label, o.amount, o.atAge, o.everyYears])).toEqual(plan.budgetTool.settings.oneOffs.map((o) => [o.label, o.amount, o.atAge, o.everyYears]));
    made['12-lumpy-db-gia'] = pins;
    if (pinned) expect(pins).toEqual(pinned['12-lumpy-db-gia']);
  });

  it('a shared budget (05 reading 03\'s): the lines go to the holder, this plan keeps its own side — PlanCommit.sharedBudgetWrites, the function ScenarioRepository.saveActiveBudget calls; pinned', () => {
    const { ladder, saver } = household();
    const holderRaw = withBudget(ladder, { shared: true });
    const readerRaw = readerOf(saver, holderRaw, { sharedWithPartner: true, mySharePct: 40, currentAge: 48, retirementAge: 60 });
    const [h, r] = entriesOf(holderRaw, readerRaw);
    const entries = [h, r];
    const read = readBudget(r.plan, entries.map((e) => ({ plan: e.plan })));
    expect(read.shared).toBe(true);
    expect(read.holder.id).toBe(holderRaw.id);
    expect(bytes(read.budget)).toBe(bytes(sharedBudgetView(h.plan.budgetTool.settings, r.plan.budgetTool.settings, holderRaw.id)));
    const B = normalisedBudget(read.budget);
    const pins = {};
    for (const [name, change] of Object.entries({ amount: changesFor(B).amountSum, phaseAdd: changesFor(B).phaseAdd, remove: changesFor(B).remove })) {
      const p = budgetPatch(r.plan, entries, change, { today: TODAY });
      expect(p.ok, name).toBe(true);
      const want = budgetToSave(cleanBudgetForSave(budgetAfter(B, change, { now: noon(TODAY) }).b));
      const split = sharedBudgetWrites(r.plan, h.plan, want);
      const toHolder = p.writes.find((w) => w.planId === String(holderRaw.id));
      const toSelf = p.writes.find((w) => w.planId === String(readerRaw.id));
      if (name === 'phaseAdd') {
        // who pays over time is this plan's own side: the holder's lines are untouched — only its `derived` follows the view
        // that was saved (the planner's saveActiveBudget writes the saver's derived onto the household's plan; carried as it is)
        expect(bytes(toSelf.patch['budgetTool.settings']), name).toBe(bytes(split.own));
        expect(toSelf.patch['budgetTool.settings'].splitPhases).toEqual([{ fromAge: '', mySharePct: '' }]);
        if (toHolder) {
          const hs = toHolder.patch['budgetTool.settings'], st = h.plan.budgetTool.settings;
          expect(Object.keys(hs).filter((k) => bytes(hs[k]) !== bytes(st[k])), name).toEqual(['derived']);
        }
      } else {
        expect(bytes(toHolder.patch['budgetTool.settings']), name).toBe(bytes(split.holder));
        expect(toHolder.patch['budgetTool.settings'].sharedWithPartner, 'the holder\'s own flag is left as it is').toBe(h.plan.budgetTool.settings.sharedWithPartner);
        expect('splitPhases' in toHolder.patch['budgetTool.settings'], 'the own side never reaches the holder').toBe(false);
        expect(toSelf, 'this plan\'s own side is unchanged by a line').toBeUndefined();
      }
      pins[name] = sha(p.writes.map((w) => ({ planId: w.planId, settings: w.patch['budgetTool.settings'] })));
    }
    // the view this plan reads: the holder's lines, its own share (40%, not the holder's)
    const v = budgetOf(entries, readerRaw.id, { today: TODAY });
    expect(v.shared).toBe(true);
    expect(v.holderName).toBe('Ladder plan');
    expect(v.groups[0].lines.length + v.groups[1].lines.length).toBe(B.lines.length);
    made['05-reading-03'] = pins;
    if (pinned) expect(pins).toEqual(pinned['05-reading-03']);
  });

  it('every corpus plan at three dates: the reading is found, the totals are figures, no box without words, the file text is the planner\'s', () => {
    for (const today of ['2026-10-02', '2027-04-05', '2027-04-06']) {
      const entries = Object.values(C).map((r) => entryOf(r, today));
      for (const e of entries) {
        const v = budgetOf(entries, e.plan.id, { today });
        expect(v.found, e.plan.id).toBe(true);
        expect(v.groups.map((g) => g.tier)).toEqual(['essential', 'discretionary']);
        expect(JSON.stringify(v.totals)).not.toMatch(/NaN|undefined/);
        expect(typeof v.csvText).toBe('string');
        expect(v.csvText.startsWith('﻿Type,Section,Item')).toBe(true);
        expect(v.totals.has).toBe(false);   // no amounts in the committed fixtures
        expect(budgetOf(entries, 'NoSuchPlan', { today }).found).toBe(false);
      }
    }
    const v = budgetOf(entriesOf(withBudget(C['12-lumpy-db-gia'])), C['12-lumpy-db-gia'].id, { today: TODAY });
    expect(v.totals.has).toBe(true);
    expect(v.totals.monthly).toMatch(/^£[\d,]+$/);
    expect(v.totals.recurring.length).toBe(1);
    expect(v.totals.singles.length).toBe(1);
    expect(v.groups[0].lines[0].parts.length).toBe(2);
    expect(v.groups[0].lines[0].partsOpen).toBe(true);
    expect(v.groups[0].lines[1].banded).toBe(true);
    expect(v.missing.length).toBeGreaterThan(5);
    expect(Object.keys(v.adds).sort()).toEqual(['discretionary', 'essential', 'oneOff']);
    expect(v.adds.essential.change).toBe(null);
    expect(totalsOf(normalisedBudget(withBudget(C['12-lumpy-db-gia']).budgetTool.settings)).has).toBe(true);
  });

  it('the boxes: a sum typed is read (budget.sums); an age typed as a year becomes an age; a wrong figure is said beside its box and carries no change', () => {
    const plan = entryOf(withBudget(C['12-lumpy-db-gia'])).plan;
    const B = normalisedBudget(readBudget(plan, [{ plan }]).budget);
    const id = B.lines[0].id;
    const c = checkBudget(plan, [{ plan }], { ['line.' + id + '.amount']: '=200*12', ['line.' + id + '.fromAge']: '2031', ['line.' + id + '.toAge']: 'many', 'add.essential': ' Allotment ', 'add.oneOff': '' }, { today: TODAY });
    const l = c.lines.find((x) => x.id === id);
    expect(l.fields.amount.change).toEqual({ kind: 'line', id, field: 'amount', value: 2400 });
    expect(l.fields.fromAge.change.value).toBe(2031 - (noon(TODAY).getFullYear() - B.currentAge));
    expect(l.fields.toAge.error).toBe('notANumber');
    expect(l.fields.toAge.change).toBe(null);
    expect(c.ok).toBe(false);
    expect(c.adds.essential.change).toEqual({ kind: 'add', tier: 'essential', label: ' Allotment ' });
    expect(c.adds.oneOff.change).toBe(null);
    for (const p of ['line.b1.amount', 'line.b12.part.0.amount', 'oneOff.b3.atAge', 'phase.0.mySharePct', 'import.text', 'add.essential', 'add.oneOff']) expect(isBudgetPath(p), p).toBe(true);
    for (const p of ['line.amount', 'budget.lines', 'about', 'line.b1.nothing', 'import', 'add.other']) expect(isBudgetPath(p), p).toBe(false);
  });

  it('property: whatever the change, every path written is declared, the write is the save shape of a budget with unique ids and its own totals, and a plan not in the list is never written', () => {
    const raw = withBudget(C['12-lumpy-db-gia']);
    const plan = entryOf(raw).plan;
    const entries = [{ plan }];
    const B = normalisedBudget(readBudget(plan, entries).budget);
    const ids = B.lines.map((l) => l.id);
    const change = fc.oneof(
      fc.record({ kind: fc.constant('line'), id: fc.constantFrom(...ids), field: fc.constantFrom('amount', 'period', 'essential', 'fromAge', 'toAge', 'label'), value: fc.oneof(fc.integer({ min: 0, max: 5000 }), fc.constantFrom('mo', 'yr', true, false, null, 'Fuel')) }),
      fc.record({ kind: fc.constant('part'), id: fc.constantFrom(...ids), i: fc.integer({ min: 0, max: 2 }), field: fc.constantFrom('amount', 'period', 'label'), value: fc.oneof(fc.integer({ min: 0, max: 500 }), fc.constantFrom('mo', 'yr', 'Part')) }),
      fc.record({ kind: fc.constant('partToggle'), id: fc.constantFrom(...ids) }),
      fc.record({ kind: fc.constant('add'), tier: fc.constantFrom('essential', 'discretionary', 'other'), label: fc.constantFrom('', ' ', 'Allotment') }),
      fc.record({ kind: fc.constant('addOneOff'), label: fc.constantFrom('', 'A boiler') }),
      fc.record({ kind: fc.constant('remove'), id: fc.constantFrom(...ids, 'nope') }),
      fc.record({ kind: fc.constant('duplicate'), id: fc.constantFrom(...ids) }),
      fc.record({ kind: fc.constantFrom('fill', 'reset', 'phaseAdd') }),
      fc.record({ kind: fc.constant('tier'), tier: fc.constantFrom('minimum', 'moderate', 'comfortable', 'lavish') }),
      fc.record({ kind: fc.constant('suggest'), label: fc.constantFrom('Alcohol', 'Hearing', 'Nothing of the sort') })
    );
    fc.assert(fc.property(fc.array(change, { minLength: 1, maxLength: 6 }), (changes) => {
      let p = plan;
      for (const c of changes) {
        const r = budgetPatch(p, [{ plan: p }], c, { today: TODAY });
        if (!r.ok) continue;
        for (const w of r.writes) {
          expect(w.planId).toBe(String(plan.id));
          for (const k of Object.keys(w.patch)) expect(BUDGET_WRITES).toContain(k);
          const s = w.patch['budgetTool.settings'];
          const all = [...s.lines.map((l) => l.id), ...s.oneOffs.map((o) => o.id)];
          expect(new Set(all).size).toBe(all.length);
          expect(bytes(s.derived)).toBe(bytes(summariseBudget(s)));
          expect(bytes(s)).toBe(bytes(budgetToSave(cleanBudgetForSave(s))));
          p = applyPatch(p, w.patch);
        }
      }
    }), { numRuns: 60 });
    expect(budgetPatch(plan, entries, { kind: 'line', id: 'nope', field: 'amount', value: 1 }, { today: TODAY }).ok).toBe(false);
    expect(budgetPatch(plan, entries, { kind: 'spreadsheet', text: 'nothing here' }, { today: TODAY }).ok).toBe(false);
    expect(budgetPatch(plan, entries, { kind: 'import', text: budgetToCsv(B) }, { today: TODAY }).ok, 'the old name is no kind').toBe(false);
  });

  it('pins written once', () => {
    if (!pinned) writeFileSync(PINS, JSON.stringify(made, null, 1) + '\n');
    const have = pinned || made;
    expect(Object.keys(have).sort()).toEqual(['05-reading-03', '12-lumpy-db-gia']);
    expect(Object.keys(have['12-lumpy-db-gia']).length).toBe(21);
  });

  it('the lifted planner functions agree with the page shape: resetBudgetLines keeps the ages, importedBudget takes the file\'s settings', () => {
    const b = normalisedBudget({ currentAge: 50, retirementAge: 61, lines: [], oneOffs: [] });
    const r = resetBudgetLines(b, idMaker(b));
    expect(r.currentAge).toBe(50); expect(r.retirementAge).toBe(61);
    expect(r.lines.length).toBeGreaterThan(20);
    const parsed = parseBudgetCsv(budgetToCsv({ ...r, currentAge: 52, plsaTier: 'comfortable' }), noon(TODAY));
    const i = importedBudget(b, parsed, idMaker(b));
    expect(i.currentAge).toBe(52); expect(i.plsaTier).toBe('comfortable'); expect(i.lines.length).toBe(r.lines.length);
    // a Setting row with a blank amount (parseBudgetCsv: null) keeps the budget's own age, as the planner's page does (its age boxes skip a null and are read back on save)
    const blankAge = parseBudgetCsv(budgetToCsv({ ...r, currentAge: 52 }).replace(/^(Setting,,Current age,)\d+/m, '$1'), noon(TODAY));
    expect(blankAge.settings.currentAge).toBe(null);
    const j = importedBudget(b, blankAge, idMaker(b));
    expect(j.currentAge).toBe(50); expect(j.retirementAge).toBe(61); expect(j.lines.length).toBe(r.lines.length);
  });

  it('"Replace the budget with it": a sheet whose age rows are blank keeps the budget\'s own ages in the write (the planner re-reads its age boxes, which a null never changed)', () => {
    const plan = entryOf(withBudget(C['12-lumpy-db-gia'])).plan;
    const entries = [{ plan }];
    const B = normalisedBudget(readBudget(plan, entries).budget);
    const text = budgetToCsv(B).replace(/^(Setting,,Current age,)\d+/m, '$1').replace(/^(Setting,,Plan to age,)\d+/m, '$1');
    expect(parseBudgetCsv(text, noon(TODAY)).settings).toMatchObject({ currentAge: null, endAge: null });
    const w = budgetPatch(plan, entries, { kind: 'spreadsheet', text }, { today: TODAY });
    expect(w.ok).toBe(true);
    const next = w.writes[0].patch['budgetTool.settings'];
    expect([next.currentAge, next.retirementAge, next.endAge]).toEqual([B.currentAge, B.retirementAge, B.endAge]);
    expect(next.lines.length).toBe(B.lines.length);
  });

  it('a breakdown part with no saved period reads as a year: the period its amount is summed at (BudgetModel.breakdownAnnual) and the one the planner\'s panel shows', () => {
    const raw = withBudget(C['12-lumpy-db-gia']);
    const line = raw.budgetTool.settings.lines.find((l) => Array.isArray(l.breakdown) && l.breakdown.length);
    line.breakdown.push({ label: 'Older part', amount: 240 });   // a row a hand or an older page made: no period
    line.annual = breakdownAnnual(line.breakdown);
    const plan = entryOf(raw).plan;
    const c = checkBudget(plan, [{ plan }], {}, { today: TODAY });
    const l = c.lines.find((x) => x.id === String(line.id));
    expect(l.parts.map((p) => p.period.shown)).toEqual(['yr', 'mo', 'yr']);
    expect(l.partsTotal).toBe(450 + 80 * 12 + 240);
  });
});
