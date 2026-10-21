/**
 * Gate 10 (research/v7/road-to-7.md step 10, §4: "the ledger round-trips byte for byte"; holdings-and-move.md §7): "What you
 * hold" and "Moving to your plan's mix" in the preview are the planner's record and Transition page, on the fixtures with a
 * record (03 the locked ladder with 8 lines, 04 and 05 a mix, 12 a pasted record).
 *   1. The record read in V7 (HoldingsRecord.normaliseHoldings, the planner's own load) and written back unchanged (a change
 *      that changes nothing, stamped with its own day) gives a `holdings` object byte-identical to the fixture's — the keys
 *      sorted, as Firestore hands objects back in its own order.
 *   2. Each change kind — a line added as typed, a field edited, a line removed, the fixture's own lines re-pasted as a table
 *      and merged — equals the planner's lifted function (HoldingsRecord.holdingsWith, HoldingsPaste.applyPaste) on the same
 *      input; the re-paste updates every line it names and adds none.
 *   3. On 03 (ladder) and 04 / 05 (a mix) the buy, sell and held lists, the progress and the schedule the move reads equal
 *      TransitionPlanner's with the same `today` (through PlanReading.moveInputs, the planner's Transition page's inputs), and
 *      the order sheet's rows equal the document's orders that pay (GiltLadderPlan.orderSheetRows); a tick-off and its untick
 *      round-trip the transition object.
 *   4. One run of the one test: runHeld on 04 (the mix as held) equals stressTestStrategy on the same settings through
 *      OneAnswer, to the pound — the only run in this gate.
 *   5. Everything is pinned once into holdIdentity.pins.json (numbers to a millionth: Node 20 and 24 differ in a last digit);
 *      delete the file to pin again — a diff there is a change to what the record or the move says and must be meant.
 * Under a minute.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { holdPatch, holdRecordOf, checkHold, holdOf } from '../../../src/answers/plan/hold.js';
import { moveOf, tickPatch, heldMixSettings, savedMove } from '../../../src/answers/plan/move.js';
import { runHeld } from '../../../src/answers/plan/moveRun.js';
import { normaliseHoldings, holdingsWith, stampHoldings } from '../../../src/services/HoldingsRecord.js';
import { applyPaste, parsePaste } from '../../../src/services/HoldingsPaste.js';
import { targetHoldings, diffHoldings, sequence, progress, tickMove, untickMove } from '../../../src/services/TransitionPlanner.js';
import { orderSheetRows } from '../../../src/strategies/GiltLadderPlan.js';
import { moveInputs, planStage, effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { planFromSettings, stressTestStrategy } from '../../../src/strategies/stressTest.js';
import { simulationConfigFromSettings } from '../../../src/services/SimulationConfig.js';
import { realYieldForYear } from '../../../src/services/LinkerUniverse.js';
import { oneAnswer } from '../../../src/services/OneAnswer.js';
import { HOLD_WRITES, MOVE_WRITES } from '../../../src/answers/plan/schema.js';
import { corpus, entryOf, TODAY, noon } from './_plans.js';

const C = corpus();
const now = noon(TODAY);
const PINS = join(process.cwd(), 'tests', 'v7', 'plan', 'holdIdentity.pins.json');
const sha = (v) => createHash('sha1').update(JSON.stringify(v, (k, x) => (typeof x === 'number' && Number.isFinite(x) ? Math.round(x * 1e6) / 1e6 : x))).digest('hex').slice(0, 16);
const sortKeys = (v) => (Array.isArray(v) ? v.map(sortKeys) : v && typeof v === 'object' ? Object.keys(v).sort().reduce((o, k) => { if (v[k] !== undefined) o[k] = sortKeys(v[k]); return o; }, {}) : v);
/** Byte for byte, the keys sorted: Firestore hands objects back in its own order, so the order of keys is not the record. */
const bytes = (v) => JSON.stringify(sortKeys(v));
const r0 = (v) => Math.round(v || 0);
const WITH_RECORD = ['03-gilt-ladder-runup', '04-buckets-running', '05-saver-committed', '12-lumpy-db-gia'];
const pinned = existsSync(PINS) ? JSON.parse(readFileSync(PINS, 'utf8')) : null;
const made = {};

/** The fixture's own pension lines as a platform would list them: a table to paste back. */
function tableOf(rec, wrapper) {
  const rows = rec.lines.filter((l) => l.wrapper === wrapper && (l.ticker || l.name)).map((l) => [l.name || l.ticker, l.ticker || '', l.units == null ? '' : String(l.units), l.value == null ? '' : '£' + l.value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })].join('\t'));
  return ['Investment\tTicker\tUnits\tValue', ...rows].join('\n');
}
const moveListOf = (x) => ({ key: x.key, units: x.units == null ? null : r0(x.units), amount: x.amount == null ? null : r0(x.amount), heldUnits: x.heldUnits == null ? null : r0(x.heldUnits), heldValue: x.heldValue == null ? null : r0(x.heldValue) });
const holdListOf = (x) => ({ key: x.key, heldUnits: x.heldUnits == null ? null : r0(x.heldUnits), heldValue: x.heldValue == null ? null : r0(x.heldValue), spare: x.spare == null ? null : r0(x.spare) });

describe('gate 10 — the record round-trips byte for byte, and the move reads as the planner\'s Transition page', { timeout: 120_000 }, () => {
  it('the four fixtures with a record are the four the design names', () => {
    const withRecord = Object.entries(C).filter(([, raw]) => raw.holdings && Array.isArray(raw.holdings.lines) && raw.holdings.lines.length).map(([n]) => n);
    expect(withRecord).toEqual(WITH_RECORD);
    expect(C['03-gilt-ladder-runup'].holdings.lines).toHaveLength(8);
  });

  for (const name of WITH_RECORD) {
    it(`${name}: read and written back unchanged is byte-identical; each change kind equals the planner's lifted function; the re-paste updates every line and adds none`, () => {
      const raw = C[name];
      const plan = entryOf(raw).plan;
      const rec = holdRecordOf(plan);
      // 1. the record as read is the record as stored (the planner's own normalisation changes nothing on a saved record)
      expect(bytes(rec)).toBe(bytes(raw.holdings));
      // … and written back unchanged: an edit that sets a field to what it is, stamped with the record's own day
      const same = holdPatch(plan, { kind: 'edit', index: 0, field: 'value', value: rec.lines[0].value }, { today: rec.updatedAt });
      expect(same.ok).toBe(true);
      expect(Object.keys(same.patch)).toEqual(['holdings']);
      for (const k of Object.keys(same.patch)) expect(HOLD_WRITES).toContain(k);
      expect(bytes(same.patch.holdings)).toBe(bytes(raw.holdings));
      expect(bytes(same.previous.holdings)).toBe(bytes(raw.holdings));
      // 2. each change kind equals the planner's lifted function on the same input
      const line = { wrapper: 'ISA', ticker: 'VWRP', name: 'Vanguard FTSE All-World (Acc)', sedol: null, units: 8, value: 1000, ocf: null, contribution: null, subClass: null, kind: 'fund', asOf: null };
      const added = holdPatch(plan, { kind: 'add', line }, { today: TODAY });
      expect(added.ok).toBe(true);
      expect(bytes(added.patch.holdings)).toBe(bytes(holdingsWith(rec, { kind: 'add', line }, { today: TODAY })));
      expect(added.patch.holdings.lines).toHaveLength(rec.lines.length + 1);
      expect(added.patch.holdings.updatedAt).toBe(TODAY);
      const edited = holdPatch(plan, { kind: 'edit', index: 1, field: 'units', value: '12.5' }, { today: TODAY });
      expect(edited.ok).toBe(true);
      expect(bytes(edited.patch.holdings)).toBe(bytes(holdingsWith(rec, { kind: 'edit', index: 1, field: 'units', value: '12.5' }, { today: TODAY })));
      expect(edited.patch.holdings.lines[1].units).toBe(12.5);
      const removed = holdPatch(plan, { kind: 'remove', index: 0 }, { today: TODAY });
      expect(removed.ok).toBe(true);
      expect(bytes(removed.patch.holdings)).toBe(bytes(holdingsWith(rec, { kind: 'remove', index: 0 }, { today: TODAY })));
      expect(removed.patch.holdings.lines).toHaveLength(rec.lines.length - 1);
      expect(removed.patch.holdings.source).toBe(rec.source);
      // the paste: the fixture's own pension lines re-pasted as a table, merged by the planner's own mergeLedger: every line updated, none added
      const text = tableOf(rec, 'SIPP');
      const pasted = holdPatch(plan, { kind: 'paste', text, wrapper: 'SIPP', answers: {} }, { today: TODAY });
      expect(pasted.ok).toBe(true);
      const orders = (plan.planDocument && plan.planDocument.strategy && plan.planDocument.strategy.r && plan.planDocument.strategy.r.plan && plan.planDocument.strategy.r.plan.orders) || [];
      const theirs = applyPaste(rec, parsePaste(text).rows, {}, 'SIPP', { today: TODAY, orders });
      expect(bytes(pasted.patch.holdings)).toBe(bytes(theirs.record));
      expect(theirs.added).toHaveLength(0);
      expect(theirs.updated).toHaveLength(rec.lines.filter((l) => l.wrapper === 'SIPP' && (l.ticker || l.name)).length);
      expect(theirs.unseen).toHaveLength(0);
      expect(pasted.patch.holdings.source).toBe('paste');
      expect(pasted.patch.holdings.lines).toHaveLength(rec.lines.length);
      // the values re-pasted to the pound come back whole (the planner's parsePaste rounds a pasted value); units and identity unchanged
      pasted.patch.holdings.lines.forEach((l, i) => { expect(l.ticker).toBe(rec.lines[i].ticker); expect(l.wrapper).toBe(rec.lines[i].wrapper); if (l.wrapper === 'SIPP' && rec.lines[i].value != null) expect(l.value).toBe(Math.round(rec.lines[i].value)); });
      // the reading says the same record (the page reads what the planner reads)
      const view = holdOf([{ plan }], plan.id, { today: TODAY });
      expect(view.count).toBe(rec.lines.length);
      expect(checkHold(plan, { 'paste.text': text, 'paste.wrapper': 'SIPP' }, { today: TODAY }).paste.rows).toHaveLength(theirs.matched.length);
      made[name] = { ...(made[name] || {}), record: sha(sortKeys(rec)), added: sha(sortKeys(added.patch.holdings)), edited: sha(sortKeys(edited.patch.holdings)), removed: sha(sortKeys(removed.patch.holdings)), pasted: sha(sortKeys(pasted.patch.holdings)) };
    });
  }

  for (const name of ['03-gilt-ladder-runup', '04-buckets-running', '05-saver-committed']) {
    it(`${name}: the buy, sell and held lists, the progress and the schedule equal TransitionPlanner with the same today; the order sheet equals the document's orders; a tick round-trips`, () => {
      const plan = entryOf(C[name]).plan;
      const rec = normaliseHoldings(plan.holdings);
      const doc = plan.planDocument;
      // the planner's Transition page inputs, line for line (PlanReading.moveInputs → TransitionPlanner)
      const m = moveInputs(plan, { now });
      const target = targetHoldings(doc, { today: now, params: m.strategyParams, runUpMonthly: m.runUpMonthly });
      const diff = diffHoldings(rec.lines, target);
      const prog = progress(diff, (plan.transition && plan.transition.done) || {});
      const stage = planStage(plan, { now });
      const seq = sequence(diff, { today: now, startYear: stage.firstTaxYear || doc.timing.firstTaxYear, startMonth: stage.startMonth || doc.timing.startMonth || null, contributionsMonthly: savedMove(plan, { today: TODAY }).contributionsMonthly });
      const view = moveOf([{ plan }], plan.id, { today: TODAY });
      expect(view.found).toBe(true);
      expect(view.kind).toBe(target.kind);
      expect(view.buy.map((b) => b.key)).toEqual(diff.buy.map((b) => b.key));
      expect(view.sell.map((b) => b.key)).toEqual(diff.sell.map((b) => b.key));
      expect(view.hold.map((b) => b.key)).toEqual(diff.hold.map((b) => b.key));
      expect(view.keep).toHaveLength(diff.keep.length);
      expect(view.progressPct).toBe(String(diff.progressPct));
      expect(view.complete).toBe(diff.complete);
      expect(view.movesDone).toBe(String(prog.doneCount));
      expect(view.moves).toBe(String(prog.total));
      expect(view.buy.map((b) => b.amount)).toEqual(diff.buy.map((b) => '£' + r0(b.amount).toLocaleString('en-GB')));
      expect(view.sell.map((b) => b.amount)).toEqual(diff.sell.map((b) => '£' + r0(b.amount).toLocaleString('en-GB')));
      expect(view.totals.buy).toBe('£' + r0(diff.totals.buyCost).toLocaleString('en-GB'));
      if (view.waiting) expect(['saving', 'committed-saving']).toContain(stage.key);
      else expect(['saving', 'committed-saving']).not.toContain(stage.key);
      // the schedule: the same steps, in order, to the pound (the saver's rule hides it on the screen; the reading still carries it)
      expect(view.schedule.steps.map((s) => [s.action, s.label, s.amount])).toEqual(seq.steps.map((s) => [s.action, s.label, '£' + r0(s.amount).toLocaleString('en-GB')]));
      expect(view.schedule.tranches).toBe(String(seq.tranches));
      // the order sheet: the document's orders that pay, in order, never re-priced
      const sheet = orderSheetRows(doc, rec.lines, { today: now, params: m.strategyParams, runUpMonthly: m.runUpMonthly });
      const paying = target.kind === 'ladder' ? doc.strategy.r.plan.orders.filter((o) => +o.pays > 0) : [];
      expect(sheet.map((r) => [r.tidm, r.sedol, r.matures, r.pays, r.nominal, r.cost])).toEqual(paying.map((o) => [o.tidm || '', o.sedol || '', o.matures || null, r0(o.pays), +o.nominal > 0 ? r0(o.nominal) : null, r0(o.cost)]));
      expect(view.sheet.map((r) => r.tidm)).toEqual(sheet.map((r) => r.tidm));
      if (target.kind === 'ladder') {
        expect(sheet.length).toBe(23);
        expect(view.sheet[0]).toMatchObject({ n: 1, tidm: 'T29', sedol: 'B3Y1JG8', matures: '22 March 2029', pays: '£156,000', nominal: '88600', cost: '£153,473', bought: 'part' });
        // every rung's bought mark is the diff's own reading
        for (const r of sheet) expect(['bought', 'part', 'not yet', 'paid', 'sold']).toContain(r.bought);
        expect(sheet.filter((r) => r.bought === 'bought').length).toBe(diff.hold.filter((h) => Array.isArray(h.taxYears)).length);
        expect(orderSheetRows(doc).map((r) => r.bought)).toEqual(paying.map(() => null));
      }
      // a tick-off and its untick: the whole object, round-tripped (TransitionPlanner.tickMove / untickMove)
      if (diff.buy.length) {
        const key = diff.buy[0].key;
        const t = tickPatch(plan, key, { today: TODAY, done: true });
        expect(t.ok).toBe(true);
        expect(Object.keys(t.patch)).toEqual(['transition']);
        for (const k of Object.keys(t.patch)) expect(MOVE_WRITES).toContain(k);
        expect(t.patch.transition).toEqual(tickMove(plan.transition, key, TODAY));
        expect(t.patch.transition.done[key]).toBe(TODAY);
        const ticked = { ...plan, transition: t.patch.transition };
        const u = tickPatch(ticked, key, { today: TODAY, done: false });
        expect(u.patch.transition).toEqual(untickMove(ticked.transition, key));
        expect(u.patch.transition.done).toEqual({});
        expect(tickPatch(plan, 'no:such', { today: TODAY, done: true }).ok).toBe(false);
        expect(moveOf([{ plan: ticked }], plan.id, { today: TODAY }).movesDone).toBe('1');
      }
      made[name] = { ...(made[name] || {}), moves: sha({ buy: diff.buy.map(moveListOf), sell: diff.sell.map(moveListOf), hold: diff.hold.map(holdListOf), keep: diff.keep.map((k) => k.ticker || k.name), progress: diff.progressPct, complete: diff.complete, schedule: seq.steps.map((s) => [s.when, s.action, s.label, r0(s.amount)]), sheet: sheet.map((r) => [r.tidm, r.nominal, r.cost, r.bought]) }) };
    });
  }

  it('04: one run on the mix as held (runHeld) equals stressTestStrategy on the same settings through OneAnswer, to the pound; nothing of the plan is written', () => {
    const plan = entryOf(C['04-buckets-running']).plan;
    const before = JSON.stringify(plan);
    const held = heldMixSettings(plan, { today: TODAY });
    expect(held).not.toBe(null);
    expect(held.fromPension).toBe(true);
    expect(held.pcts.shares + held.pcts.bonds + held.pcts.diversifiers + held.pcts.cash).toBeGreaterThanOrEqual(99);
    expect(held.settings.equityMin + held.settings.bondMin + held.settings.cashTarget + held.settings.diversifierStart).toBe(held.pot);
    const mine = runHeld(plan, { today: TODAY });
    expect(mine.basis.runs).toBe(1);
    expect(mine.affordable).toBe(true);
    const s = held.settings;
    const p = planFromSettings(s, simulationConfigFromSettings({}, s), { yieldForYear: realYieldForYear, startAge: +s.shapeAgeNow || 57, now });
    const theirs = oneAnswer(stressTestStrategy(s.strategyId, p), p);
    expect(mine.a.share).toBe(theirs.share);
    expect(mine.a.chancePct).toBe(theirs.chancePct);
    expect(r0(mine.a.typicalLeft)).toBe(r0(theirs.typicalLeft));
    expect(r0(mine.a.badCaseLeft)).toBe(r0(theirs.badCaseLeft));
    expect(JSON.stringify(plan)).toBe(before);
    // the way and everything but the four amounts are the plan's own
    const ss = effectiveStressSettings(plan, { now });
    for (const k of Object.keys(ss)) if (!['equityMin', 'bondMin', 'cashTarget', 'diversifierStart', 'allocMode'].includes(k)) expect(s[k], k).toEqual(ss[k]);
    made['04-buckets-running'] = { ...(made['04-buckets-running'] || {}), held: sha({ pcts: held.pcts, share: mine.a.share, typical: r0(mine.a.typicalLeft), bad: r0(mine.a.badCaseLeft) }) };
  });

  it('the pins exist (written once from the same functions) and cover every fixture with a record', () => {
    if (!pinned) { writeFileSync(PINS, JSON.stringify(made, null, 1) + '\n'); return; }
    expect(Object.keys(pinned).sort()).toEqual(WITH_RECORD);
    for (const name of WITH_RECORD) expect(made[name], `${name}: the record or the move has changed`).toEqual(pinned[name]);
  });
});
