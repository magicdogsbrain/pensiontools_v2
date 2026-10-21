/**
 * Gate 8b (research/v7/way-and-mix.md 4, 6; road-to-7.md step 8): Try a change in the preview is the planner's "Try a
 * strategy" what-if, on the twelve fixtures and a table of box values — each box moved alone, then all together, and the
 * boxes untouched.
 *   1. The copy the boxes make (answers/plan/lastsRun.js trySettingsOf — the one function the planner's tryStrategySettings
 *      now calls with readTryBoxes()) equals the outputs pinned once from that same function into tryIdentity.pins.json
 *      (delete the file to pin again; a diff there is a change to what Try runs and must be meant).
 *   2. The tried verdict (runTry, what the V7 worker runs) equals the planner's runTryStrategyUI to the pound: the plan
 *      built as the planner's strategyPlanFor builds it (createSimulationConfigFromSettings, planFromSettings on the real-yield
 *      curve, the same clock), stressTestStrategy on the tried way, OneAnswer on the result — both sides on the bundled curve.
 *   3. "What's different" (tryDifferencesOf) names exactly the boxes moved; the boxes untouched say nothing on a plan whose
 *      pot box is its whole pot.
 * Slow in sum (one run a row a side); every figure to the pound.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { runTry, trySettings, trySettingsOf } from '../../../src/answers/plan/lastsRun.js';
import { tryDifferencesOf, tryBoxesOf, checkTry } from '../../../src/answers/plan/lasts.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { createSimulationConfigFromSettings } from '../../../src/storage/StressRepository.js';
import { planFromSettings, stressTestStrategy } from '../../../src/strategies/stressTest.js';
import { realYieldForYear } from '../../../src/services/LinkerUniverse.js';
import { oneAnswer } from '../../../src/services/OneAnswer.js';
import { WAY_IDS } from '../../../src/answers/plan/schema.js';
import { corpus, entryOf, TODAY, noon } from './_plans.js';

const C = corpus();
const now = noon(TODAY);
const PINS = join(process.cwd(), 'tests', 'v7', 'plan', 'tryIdentity.pins.json');
// numbers to a millionth: V8 versions differ in the last digit of a few float results (Node 20 vs 24 on fixture 06), and the pin is about what Try runs, not float noise
const sha = (v) => createHash('sha1').update(JSON.stringify(v, (k, x) => (typeof x === 'number' && Number.isFinite(x) ? Math.round(x * 1e6) / 1e6 : x))).digest('hex').slice(0, 16);
const r0 = (v) => Math.round(v || 0);
const ROWS = ['none', 'way', 'pot', 'isa', 'isaPolicy', 'income', 'years', 'cuts', 'cutPct', 'cutEsc', 'all'];
// the cuts are said as a difference for the family only (their depth and months whenever the figure differs, as the planner says them)
const FAMILY = ['pots-and-valves', 'buckets-in-order'];

/** The planner's boxes as saved (resetTryStrategyUI): the way, the pot box = sippTotal or the three pots, the ISA, the rest "as saved". */
function savedBoxes(s) {
  return {
    way: WAY_IDS.includes(s.strategyId) ? s.strategyId : 'pots-and-valves',
    pot: r0((s.strategyParams && s.strategyParams.sippTotal) || ((s.equityMin || 0) + (s.bondMin || 0) + (s.cashTarget || 0))),
    isa: r0(s.strategyParams && s.strategyParams.isaTotal != null ? s.strategyParams.isaTotal : (s.isaBalance || 0)),
    isaPolicy: 'saved', incomeMode: 'shape', income: 0, years: s.duration || 35, cuts: 'saved', cutPct: '', cutEsc: ''
  };
}
/** The table: each box moved alone (a value that differs from the plan's), then all together. */
function table(s) {
  const b = savedBoxes(s);
  const otherWay = WAY_IDS[(WAY_IDS.indexOf(b.way) + 1) % WAY_IDS.length];
  const moves = {
    way: { way: otherWay },
    pot: { pot: r0(b.pot * 0.8) },
    isa: { isa: b.isa + 10_000 },
    isaPolicy: { isaPolicy: 'hold' },
    income: { incomeMode: 'flat', income: r0((+s.baseSalary || 30_000) * 0.9) },
    years: { years: (s.duration || 35) === 30 ? 28 : 30 },
    cuts: { cuts: s.disableProtection ? 'on' : 'off' },
    cutPct: { cutPct: '30' },
    cutEsc: { cutEsc: '6' }
  };
  const rows = Object.entries(moves).map(([id, m]) => ({ id, boxes: { ...b, ...m } }));
  rows.push({ id: 'all', boxes: { ...b, ...Object.assign({}, ...Object.values(moves)) } });
  rows.unshift({ id: 'none', boxes: b });
  return rows;
}
/** index.html runTryStrategyUI's inline path: strategyPlanFor on the copy, stressTestStrategy on the tried way, the one answer. */
function plannerTry(c) {
  const p = planFromSettings(c, createSimulationConfigFromSettings({}, c), { yieldForYear: realYieldForYear, startAge: +c.shapeAgeNow || 57, now });
  const r = stressTestStrategy(c.strategyId, p);
  return { p, r, a: oneAnswer(r, p) };
}

const pinned = existsSync(PINS) ? JSON.parse(readFileSync(PINS, 'utf8')) : null;
const made = {};

describe('gate 8b — Try a change equals the planner\'s what-if on every fixture', { timeout: 900_000 }, () => {
  expect(Object.keys(C).length).toBe(12);
  for (const [name, raw] of Object.entries(C)) {
    it(`${name}: the copy pinned once; the verdict to the pound; "What's different" names the boxes moved`, () => {
      const plan = entryOf(raw).plan;
      const s = effectiveStressSettings(plan, { now });
      made[name] = {};
      for (const row of table(s)) {
        const c = trySettingsOf(s, row.boxes);
        expect(trySettings(plan, row.boxes, TODAY), row.id).toEqual(c);                         // the plan's path is the settings' path
        made[name][row.id] = { boxes: row.boxes, copy: sha(c) };
        if (pinned) expect(made[name][row.id], `${name} ${row.id}: the copy Try runs has changed`).toEqual(pinned[name][row.id]);
        // the verdict
        const mine = runTry(plan, { today: TODAY, boxes: row.boxes });
        const theirs = plannerTry(c);
        expect(mine.strategyId, row.id).toBe(c.strategyId);
        expect(mine.basis.runs).toBe(1);
        expect(JSON.parse(JSON.stringify(mine))).toEqual(mine);
        if (!theirs.a) { expect(mine.a, row.id).toBe(null); expect(mine.reason, row.id).toBe(theirs.r.reason || null); }
        else {
          expect(mine.a.chancePct, row.id).toBe(theirs.a.chancePct);
          expect(mine.a.share, row.id).toBe(theirs.a.share);
          expect(r0(mine.a.typicalLeft), row.id).toBe(r0(theirs.a.typicalLeft));
          expect(r0(mine.a.badCaseLeft), row.id).toBe(r0(theirs.a.badCaseLeft));
          expect(r0(mine.a.goodCaseLeft), row.id).toBe(r0(theirs.a.goodCaseLeft));
          expect(mine.a.years, row.id).toBe(theirs.a.years);
        }
        // "What's different"
        const ids = tryDifferencesOf(s, c).map((d) => d.id);
        const whole = r0((s.equityMin || 0) + (s.bondMin || 0) + (s.cashTarget || 0)) === savedBoxes(s).pot;
        if (row.id === 'none') { expect(ids, whole ? 'untouched' : 'untouched: the pot box is the SIPP total, not the three pots').toEqual(whole ? [] : ['pot']); continue; }
        const expected = (id, boxes) => {
          if (id === 'cuts') return FAMILY.includes(c.strategyId);                                                       // said for the family only
          if (id === 'cutPct') return Math.round((1 - (s.protectionMult ?? 0.8)) * 100) !== 30;                           // the planner's own lines: said whenever the figure differs
          if (id === 'cutEsc') return (s.protectionEscalateMonths ?? 12) !== 6;
          if (id === 'isaPolicy') return String(s.isaDrawdownStrategy) !== 'hold';
          if (id === 'isa') return boxes.isa !== (s.isaBalance || 0);
          if (id === 'pot') return !whole || boxes.pot !== savedBoxes(s).pot;
          return true;
        };
        const named = row.id === 'all' ? ROWS.slice(1, -1) : [row.id];
        for (const id of named) expect(ids.includes(id), `${row.id}: ${id}`).toBe(expected(id, row.boxes));
        if (row.id !== 'all') expect(ids.filter((x) => x !== row.id && !(x === 'pot' && !whole)), `${row.id} alone names nothing else`).toEqual([]);
      }
      // the preview's own starting boxes through its reading equal the planner's saved boxes (the income box aside: a month after tax, applied only when flat)
      const mine = checkTry(plan, tryBoxesOf(plan, { today: TODAY }), { today: TODAY });
      expect(mine.ok).toBe(true);
      expect({ ...mine.run, income: 0 }).toEqual(savedBoxes(s));
    });
  }
  it('the pins exist (written once from the same function) and cover every fixture and row', () => {
    if (!pinned) { writeFileSync(PINS, JSON.stringify(made, null, 1) + '\n'); return; }
    expect(Object.keys(pinned).sort()).toEqual(Object.keys(C).sort());
    for (const name of Object.keys(C)) expect(Object.keys(pinned[name])).toEqual(ROWS);
  });
});
