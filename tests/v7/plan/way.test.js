/**
 * The pure reading and writer of "How the money is taken" (research/v7/way-and-mix.md 2, 7): wayOf on the corpus (the plan's
 * way, each way's restored dials, the lock), the dials' units (a stored param ↔ the dial, a card's values as a strategy
 * page's bag), checkDials, the cards from a reading and a ways state (one open, the other eight ranked, a card that needs a
 * run), and wayPatch — the switch as the planner's own (PlanCommit.switchPatch: StrategyState.switchStrategy, cleanParams,
 * the funds restore) written as dotted paths that are all declared (WAY_WRITES), read∘write∘read identity over the corpus
 * and random dials (fast-check): every other byte unchanged, Undo byte for byte; a locked plan writes nothing; only the
 * dials typed go into the switch; the root strategy block is setActiveStrategy's shape.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { wayOf, checkDials, cardsOf, wayPatch, applyPatch, dialUnitsOf, stratDialsOf, stashOf, rankedIds, cardLines, runKeyOf } from '../../../src/answers/plan/way.js';
import { switchPatch, restoredParamsFor, dialParams } from '../../../src/services/PlanCommit.js';
import { switchStrategy, cleanParams, allowedKeys, OWNED_KEYS } from '../../../src/services/StrategyState.js';
import { ENGINE_VERSION } from '../../../src/strategies/version.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { WAY_IDS, WAY_DIALS, WAY_WRITES, ALL_WRITES, RANK_BYS } from '../../../src/answers/plan/schema.js';
import { get } from '../../../src/answers/plan/about.js';
import { corpus, entryOf, entriesAt, TODAY, DATES, noon } from './_plans.js';

const C = corpus();
const AT = '2026-10-02T14:03:00.000Z';
const isLocked = (p) => !!(p.decisionTool && p.decisionTool.settings && p.decisionTool.settings.locked);
const text = (v) => JSON.stringify(v);
const strip = (plan) => { const out = JSON.parse(JSON.stringify(plan)); for (const p of ALL_WRITES) { const parts = p.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; } return out; };

/** A fake nine-way result: every way affordable but the last, with figures that rank them in a known order. */
function fakeResult(ids = WAY_IDS, { current = 'pots-and-valves' } = {}) {
  return { strategyId: current, priced: 'bundled', ways: ids.map((id, i) => (id === 'gilt-rotation'
    ? { id, affordable: false, reason: { why: 'cost', cost: 900000, short: 100000 }, a: null, bought: true, dials: { defaults: { cashYears: 2, bridgeCash: 0, spareGrowth: 'kept', rotateCutAge: 75, rotateTrigger: 30, rotateDisarmYears: 8 }, ranWith: { cashYears: 2, bridgeCash: 0, spareGrowth: 'kept', rotateCutAge: 75, rotateTrigger: 30, rotateDisarmYears: 8 } } }
    : { id, affordable: true, reason: null, bought: id !== 'pots-and-valves' && id !== 'buckets-in-order',
      a: { strategyId: id, chancePct: 99 - i * 3, share: (99 - i * 3) / 100, typicalLeft: 500000 - i * 10000, badCaseLeft: 50000, goodCaseLeft: 900000, years: 33, futures: 1000, histories: 700 },
      ruin: { mc: 1 + i * 3, hist: 0 }, terminal: { p10: 50000, p50: 500000 - i * 10000, p90: 900000 }, coverage: 99 - i, spentMedian: 1000000, worst12: 20000, vol: 0.1, vac: 10 + i, coverageRatio: 1.2 - i * 0.05,
      cost: id === 'pots-and-valves' || id === 'buckets-in-order' ? 0 : 300000, left: id === 'pots-and-valves' || id === 'buckets-in-order' ? null : 200000,
      dials: { defaults: Object.fromEntries(WAY_DIALS[id].map((d) => [d.key, d.default == null ? (d.type === 'money' ? 20000 : 80) : d.default])), ranWith: Object.fromEntries(WAY_DIALS[id].map((d) => [d.key, d.default == null ? (d.type === 'money' ? 20000 : 80) : d.default])) } })),
    basis: { today: TODAY, engine: 'one-test', runs: 9 } };
}

describe('the reading (wayOf) on every corpus plan at three dates', () => {
  for (const today of DATES) {
    it(`at ${today}: found; the way is the plan's; a stash for every way; the cut dials; locked and readonly plans are not editable; the run key is lasts.js's`, () => {
      const entries = entriesAt(today);
      for (const e of entries) {
        const w = wayOf(entries, e.plan.id, { today });
        expect(w.found).toBe(true);
        expect(WAY_IDS).toContain(w.strategyId);
        expect(Object.keys(w.stash)).toEqual(WAY_IDS);
        expect(w.cuts.protectionOn === 'yes' || w.cuts.protectionOn === 'no').toBe(true);
        expect(w.locked).toBe(isLocked(e.plan));
        expect(w.editable).toBe(!w.locked);
        expect(w.runKey).toBe(runKeyOf(e.plan));
        if (w.locked) { expect(w.lockedOn).toBeTypeOf('string'); expect(w.source.kind).toBe('locked'); }
        expect(w.endAge).toBeGreaterThan(60);
      }
      const newer = entries.map((x, i) => (i === 0 ? { ...x, newer: true } : x));
      const r = wayOf(newer, newer[0].plan.id, { today });
      expect(r.readonly).toBe(true); expect(r.editable).toBe(false); expect(r.runKey).toBe(null);
      expect(wayOf(entries, 'nobody', { today }).found).toBe(false);
    });
  }
  it('07 (a pre-6.13 flat bag sorted into stashes): each way\'s restored dials are its own, in dial units; the rotation\'s are the active bag\'s', () => {
    const plan = entryOf(C['07-pre-6.13-flat-params']).plan;
    const w = wayOf([{ plan }], plan.id, { today: TODAY });
    expect(w.strategyId).toBe('gilt-rotation');
    // the spare's growth is absent in the bag (kept, the engine's reading): not a value of its own, so the card shows the default
    expect(w.stash['gilt-rotation']).toEqual({ cashYears: 3, bridgeCash: 25000, rotateCutAge: 75, rotateTrigger: 30, rotateDisarmYears: 5 });
    expect(w.stash['floor-to-age']).toEqual({ floorToAge: 80 });
    expect(w.stash['floor-and-flex']).toEqual({ essentialsAnnual: 26000, horizonAge: 92, sleeveRatePct: 4, ratchet: 'off' });   // the old "none" reads as off; no treats rule stored
    expect(w.stash['ladder-and-ratchet']).toEqual({ ladderYears: 15, triggerMode: 'band', bandThreshold: 1.2 });   // drawAnnual 0 reads as "the plan's target": not a value
    expect(w.stash['bridge-and-engine']).toEqual({ bridgeAge: 67, cashYears: 3 });
    expect(w.stash['buckets-in-order']).toEqual({ bucketBand: 10 });
    expect(w.stash['pots-and-valves']).toEqual({});
    expect(w.stash['floor-the-schedule']).toEqual({});
  });
  it('02 (Pots & Valves, nothing stashed): every other way starts from nothing of its own', () => {
    const plan = entryOf(C['02-pnv-draft']).plan;
    const w = wayOf([{ plan }], plan.id, { today: TODAY });
    for (const id of WAY_IDS) expect(w.stash[id], id).toEqual({});
    expect(w.cuts).toEqual({ protectionOn: 'yes', cutPct: 20, consecutiveLimit: 3 });
  });
});

describe('the dials\' units', () => {
  it('a stored param reads as the dial shows it, and back: the sleeve rate as a percent, the spare as kept or invested, a 0 pound figure as not set', () => {
    const d = (id, key) => WAY_DIALS[id].find((x) => x.key === key);
    expect(dialUnitsOf(d('floor-and-flex', 'sleeveRatePct'), 0.04)).toBe(4);
    expect(dialUnitsOf(d('floor-and-flex', 'sleeveRatePct'), 0.0325)).toBe(3.25);
    expect(dialUnitsOf(d('full-il-gilt', 'spareGrowth'), true)).toBe('invested');
    expect(dialUnitsOf(d('full-il-gilt', 'spareGrowth'), false)).toBe('kept');
    expect(dialUnitsOf(d('full-il-gilt', 'spareGrowth'), undefined)).toBe(null);
    expect(dialUnitsOf(d('floor-and-flex', 'ratchet'), 'none')).toBe('off');
    expect(dialUnitsOf(d('floor-and-flex', 'ratchet'), 'extend')).toBe('extend');
    expect(dialUnitsOf(d('ladder-and-ratchet', 'drawAnnual'), 0)).toBe(null);
    expect(dialUnitsOf(d('full-il-gilt', 'bridgeCash'), 0)).toBe(0);
    expect(dialUnitsOf(d('ladder-and-ratchet', 'triggerMode'), 'calendar')).toBe('calendar');
    expect(dialUnitsOf(d('ladder-and-ratchet', 'triggerMode'), 'odd')).toBe(null);
    expect(stratDialsOf('floor-and-flex', { sleeveRatePct: 3.5, treatsRule: 'fixed', ratchet: 'off' })).toEqual({ sleeveRatePct: 3.5, treatsRule: 'fixed', ratchet: 'off' });
    expect(stratDialsOf('full-il-gilt', { spareGrowth: 'invested', cashYears: 1 })).toEqual({ spareGrowth: true, cashYears: 1 });
    expect(stratDialsOf('pots-and-valves', { protectionOn: 'no', cutPct: 30 })).toEqual({ protectionOn: false, cutPct: 30 });
    expect(stratDialsOf('floor-to-age', { floorToAge: 82, odd: 1 })).toEqual({ floorToAge: 82 });
    // through the planner's own reading of a dial bag: the sleeve rate back to a fraction, the cut dials onto the settings
    expect(dialParams('floor-and-flex', stratDialsOf('floor-and-flex', { sleeveRatePct: 3.5 })).params).toEqual({ sleeveRate: 0.035 });
    expect(dialParams('pots-and-valves', stratDialsOf('pots-and-valves', { protectionOn: 'no', cutPct: 30, consecutiveLimit: 4 })).patch).toEqual({ disableProtection: true, protectionMult: 0.7, consecutiveLimit: 4 });
  });
  it('every dial of every way is a key the way may keep (or a cut dial), and the planner\'s owned keys are all dials but the rotation\'s borrowed floor and the shared pots', () => {
    for (const id of WAY_IDS) {
      const keys = WAY_DIALS[id].filter((d) => !d.cut).map((d) => (d.key === 'sleeveRatePct' ? 'sleeveRate' : d.key));
      for (const k of keys) expect(allowedKeys(id), `${id}.${k}`).toContain(k);
      for (const k of OWNED_KEYS[id]) if (k !== 'borrowedFloor') expect(keys, `${id}.${k}`).toContain(k);
    }
    expect(WAY_DIALS['floor-the-schedule']).toEqual([]);
  });
  it('checkDials: typed text over the base; a problem by key; a dial not typed keeps the base', () => {
    const base = { floorToAge: 80 };
    expect(checkDials('floor-to-age', {}, base)).toEqual({ ok: true, values: { floorToAge: 80 }, errors: {}, shown: { floorToAge: '80' } });
    expect(checkDials('floor-to-age', { floorToAge: '82' }, base).values).toEqual({ floorToAge: 82 });
    expect(checkDials('floor-to-age', { floorToAge: '' }, base).errors).toEqual({ floorToAge: 'required' });
    expect(checkDials('floor-to-age', { floorToAge: 'ninety' }, base).errors).toEqual({ floorToAge: 'notANumber' });
    expect(checkDials('floor-to-age', { floorToAge: '59' }, base).errors).toEqual({ floorToAge: 'tooLow' });
    expect(checkDials('floor-to-age', { floorToAge: '96' }, base).errors).toEqual({ floorToAge: 'tooHigh' });
    expect(checkDials('floor-and-flex', { sleeveRatePct: '3.25', essentialsAnnual: '£20,000', treatsRule: 'fixed' }, {}).values).toEqual({ sleeveRatePct: 3.25, essentialsAnnual: 20000, treatsRule: 'fixed', horizonAge: null, ratchet: null });
    expect(checkDials('floor-and-flex', { treatsRule: 'odd' }, {}).errors).toEqual({ treatsRule: 'notAnOption' });
    expect(checkDials('ladder-and-ratchet', { bandThreshold: '1.2' }, {}).values.bandThreshold).toBe(1.2);
  });
});

describe('the cards (cardsOf)', () => {
  const plan = entryOf(C['02-pnv-draft']).plan;
  const reading = wayOf([{ plan }], plan.id, { today: TODAY });
  const held = (W = {}) => ({ key: reading.runKey, status: 'done', result: fakeResult(), open: null, dials: {}, tried: {}, rankBy: 'lasts', ...W });
  it('the plan\'s own way first and open; the other eight ranked by the one answer\'s share (ties by coverage), the unaffordable last; "More columns" orders change the ranks, never the first card', () => {
    const v = cardsOf(reading, held());
    expect(v.found).toBe(true);
    expect(v.cards).toHaveLength(9);
    expect(v.cards[0]).toMatchObject({ id: 'pots-and-valves', current: true, open: true, rank: 0, needsRun: false, has: true, affordable: true });
    expect(v.cards.filter((c) => c.open)).toHaveLength(1);
    expect(v.cards.at(-1)).toMatchObject({ id: 'gilt-rotation', affordable: false, open: false });
    expect(v.cards.at(-1).lines).toEqual([{ id: 'cannot', slots: { cost: '£900,000', short: '£100,000' } }]);
    expect(v.cards.map((c) => c.rank)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    for (const by of RANK_BYS) {
      const o = cardsOf(reading, held({ rankBy: by }));
      expect(o.cards[0].id).toBe('pots-and-valves');
      expect(o.rankBy).toBe(by);
      expect(rankedIds(fakeResult().ways, by).at(-1)).toBe('gilt-rotation');
    }
    expect(cardsOf(reading, held({ rankBy: 'left' })).cards.map((c) => c.rank)).toEqual(rankedIds(fakeResult().ways, 'left').length ? cardsOf(reading, held({ rankBy: 'left' })).cards.map((c) => rankedIds(fakeResult().ways, 'left').indexOf(c.id)) : []);
  });
  it('a result for another key is not this plan\'s: no figures, the cards in the planner\'s order, nothing open but the plan\'s own', () => {
    const v = cardsOf(reading, held({ key: 'other' }));
    expect(v.has).toBe(false);
    expect(v.cards.map((c) => c.id)).toEqual(['pots-and-valves', ...WAY_IDS.filter((id) => id !== 'pots-and-valves')]);
    for (const c of v.cards) { expect(c.has).toBe(false); expect(c.lines).toEqual([]); expect(c.verdict).toBe(null); }
  });
  it('opening a card: its dials start from the stash over the run\'s defaults; the same values as the comparison ran need no run; a dial typed needs one; a try held for those values satisfies it; a try for other values is stale', () => {
    const open = cardsOf(reading, held({ open: 'floor-to-age' }));
    const c = open.cards.find((x) => x.id === 'floor-to-age');
    expect(c.open).toBe(true);
    expect(open.cards[0].open).toBe(false);
    expect(c.dials.map((d) => d.key)).toEqual(['floorToAge']);
    expect(c.dials[0]).toMatchObject({ shown: '80', error: null, min: 60, max: 95 });
    expect(c.needsRun).toBe(false);
    const typed = cardsOf(reading, held({ open: 'floor-to-age', dials: { 'floor-to-age': { floorToAge: '82' } } })).cards.find((x) => x.id === 'floor-to-age');
    expect(typed).toMatchObject({ needsRun: true, stale: true, values: { floorToAge: 82 }, typed: true });
    const working = cardsOf(reading, held({ open: 'floor-to-age', dials: { 'floor-to-age': { floorToAge: '82' } }, tried: { 'floor-to-age': { status: 'working', values: { floorToAge: 82 }, result: null, reason: null, ms: null } } })).cards.find((x) => x.id === 'floor-to-age');
    expect(working.needsRun).toBe(false);
    expect(working.tried.status).toBe('working');
    const triedR = { ...fakeResult().ways[6], tried: true, a: { ...fakeResult().ways[6].a, chancePct: 77, share: 0.77 }, basis: { today: TODAY, engine: 'one-test', runs: 1 } };
    const done = cardsOf(reading, held({ open: 'floor-to-age', dials: { 'floor-to-age': { floorToAge: '82' } }, tried: { 'floor-to-age': { status: 'done', values: { floorToAge: 82 }, result: triedR, reason: null, ms: 180 } } })).cards.find((x) => x.id === 'floor-to-age');
    expect(done).toMatchObject({ needsRun: false, stale: false, tried: { status: 'done', runs: 1, ms: 180 } });
    expect(done.verdict.chancePct).toBe(77);
    const moved = cardsOf(reading, held({ open: 'floor-to-age', dials: { 'floor-to-age': { floorToAge: '84' } }, tried: { 'floor-to-age': { status: 'done', values: { floorToAge: 82 }, result: triedR, reason: null, ms: 180 } } })).cards.find((x) => x.id === 'floor-to-age');
    expect(moved).toMatchObject({ needsRun: true, stale: true });
    const bad = cardsOf(reading, held({ open: 'floor-to-age', dials: { 'floor-to-age': { floorToAge: 'x' } } })).cards.find((x) => x.id === 'floor-to-age');
    expect(bad).toMatchObject({ needsRun: false, ok: false, values: null });
    expect(bad.dials[0].error).toBe('notANumber');
  });
  it('a way with a stash of its own opens with those values and needs a run (the comparison ran it on the active bag)', () => {
    const p7 = entryOf(C['07-pre-6.13-flat-params']).plan;
    const r7 = wayOf([{ plan: p7 }], p7.id, { today: TODAY });
    const result = fakeResult(WAY_IDS, { current: 'gilt-rotation' });
    const v = cardsOf(r7, { key: r7.runKey, status: 'done', result, open: 'floor-and-flex', dials: {}, tried: {}, rankBy: 'lasts' });
    const ff = v.cards.find((c) => c.id === 'floor-and-flex');
    expect(ff.dials.find((d) => d.key === 'essentialsAnnual').shown).toBe('26000');
    expect(ff.dials.find((d) => d.key === 'horizonAge').shown).toBe('92');
    expect(ff.needsRun).toBe(true);
    expect(v.cards[0].id).toBe('gilt-rotation');
  });
  it('a locked plan with a document: the comparison line on a card that is not the document\'s way, once it has a figure', () => {
    const sam = entryOf(C['03-gilt-ladder-runup']).plan;
    const r3 = wayOf([{ plan: sam }], sam.id, { today: TODAY });
    expect(r3.locked).toBe(true);
    expect(r3.document).toMatchObject({ lockedOn: expect.any(String) });
    const v = cardsOf(r3, { key: r3.runKey, status: 'done', result: fakeResult(WAY_IDS, { current: 'full-il-gilt' }), open: 'floor-to-age', dials: {}, tried: {}, rankBy: 'lasts' });
    expect(v.cards.find((c) => c.id === 'floor-to-age').compare).toMatchObject({ id: 'compare', slots: { docWay: 'full-il-gilt', way: 'floor-to-age' } });
    expect(v.cards.find((c) => c.id === 'full-il-gilt').compare).toBe(null);
  });
  it('cardLines: the words\' ids for an affordable way, a bought way, a contract way and one that cannot be bought', () => {
    const ways = fakeResult().ways;
    expect(cardLines(ways[0], { endAge: 95, current: true }).map((l) => l.id)).toEqual(['lastsYours', 'sub', 'left']);
    expect(cardLines(ways[2], { endAge: 95 }).map((l) => l.id)).toEqual(['lasts', 'sub', 'left', 'cost']);
    expect(cardLines(ways[5], { endAge: 95 }).map((l) => l.id)).toEqual(['lasts', 'subContract', 'left', 'cost']);
    expect(cardLines(ways[5], { endAge: 95 })[1].slots).toEqual({ years: '33', toAge: '95' });
    expect(cardLines({ ...ways[2], left: 0 }).map((l) => l.id)).toEqual(['lasts', 'sub', 'left', 'costAll']);
    expect(cardLines(ways[8]).map((l) => l.id)).toEqual(['cannot']);
    expect(cardLines({ id: 'full-il-gilt', affordable: false, reason: { why: 'noGilt' } }).map((l) => l.id)).toEqual(['cannotGilt']);
  });
});

describe('the write (wayPatch): the planner\'s switch, field for field', () => {
  const UNLOCKED = Object.values(C).filter((p) => !isLocked(p));
  it('on every unlocked corpus plan, for every way: the paths are declared; the values are switchPatch\'s on the effective settings; the block is setActiveStrategy\'s shape; the plan after the write reads the way and its params', () => {
    for (const raw of UNLOCKED) {
      const plan = entryOf(raw).plan;
      const ss = effectiveStressSettings(plan, { now: noon(TODAY) });
      for (const id of WAY_IDS) {
        const p = wayPatch(plan, id, {}, { today: TODAY, at: AT });
        expect(p.ok, `${raw.id} → ${id}`).toBe(true);
        for (const k of Object.keys(p.patch)) expect(WAY_WRITES, k).toContain(k);
        const sp = switchPatch(ss, id, {}, { savedAt: TODAY, at: AT });
        for (const [k, v] of Object.entries(sp.settings)) {
          const path = 'stressTool.settings.' + k;
          const after = path in p.patch ? p.patch[path] : get(plan, path);
          expect(text(after === undefined ? null : after), `${raw.id} → ${id}: ${k}`).toBe(text(v === undefined ? null : v));
        }
        expect(p.patch.strategy || get(plan, 'strategy')).toEqual({ id, params: sp.strategyParams, lockedAt: AT, engineVersion: ENGINE_VERSION });
        const written = applyPatch(plan, p.patch);
        expect(written.stressTool.settings.strategyId).toBe(id);
        expect(written.stressTool.settings.strategyParams).toEqual(cleanParams(id, written.stressTool.settings.strategyParams));
        // the outgoing way is stashed, dated today; nothing it owned survives in the flat bag
        const sw = switchStrategy(ss, id, { savedAt: TODAY });
        expect(written.stressTool.settings.strategyState).toEqual(sw.strategyState);
        expect(written.stressTool.settings.strategyState[ss.strategyId || 'pots-and-valves'].savedAt).toBe(TODAY);
        // every other byte unchanged; Undo puts it back byte for byte
        expect(strip(written)).toEqual(strip(plan));
        const back = applyPatch(written, Object.fromEntries(Object.entries(p.previous).map(([k, v]) => [k, v])));
        expect(JSON.stringify(back)).toBe(JSON.stringify(plan));
      }
    }
  });
  it('07 (funds to test, a stash per way): switching to a way whose stash has a funds list re-derives the pots from it (switchPatch\'s funds restore), and the dials typed go on top of the stash', () => {
    const plan = entryOf(C['07-pre-6.13-flat-params']).plan;
    const p = wayPatch(plan, 'floor-to-age', { floorToAge: '82' }, { today: TODAY, at: AT });
    expect(p.ok).toBe(true);
    expect(p.patch['stressTool.settings.strategyId']).toBe('floor-to-age');
    expect(p.patch['stressTool.settings.strategyParams']).toEqual({ floorToAge: 82, sippTotal: 995000, isaTotal: 55000 });
    expect(p.patch['stressTool.settings.subAsset']).toBeTruthy();
    const ss = effectiveStressSettings(plan, { now: noon(TODAY) });
    const sp = switchPatch(ss, 'floor-to-age', { floorToAge: 82 }, { savedAt: TODAY, at: AT });
    expect(p.patch['stressTool.settings.subAsset']).toEqual(sp.settings.subAsset);
    expect(sp.settings.allocMode).toBe('funds');
    expect(sp.settings.taggedFunds).toHaveLength(5);
    expect(p.line).toEqual({ id: 'way', slots: { way: 'floor-to-age' } });
  });
  it('only the dials typed go into the switch: an untouched dial leaves the key absent; the spare kept writes false; the cut dials go as the Stress keys', () => {
    const plan = entryOf(C['02-pnv-draft']).plan;
    const none = wayPatch(plan, 'gilt-rotation', {}, { today: TODAY, at: AT });
    expect(none.patch['stressTool.settings.strategyParams'], 'an empty bag stays the empty bag: not written').toBe(undefined);
    expect(applyPatch(plan, none.patch).stressTool.settings.strategyParams).toEqual({});
    const some = wayPatch(plan, 'gilt-rotation', { rotateCutAge: '78', spareGrowth: 'invested' }, { today: TODAY, at: AT });
    expect(some.patch['stressTool.settings.strategyParams']).toEqual({ rotateCutAge: 78, spareGrowth: true });
    const kept = wayPatch(plan, 'gilt-rotation', { spareGrowth: 'kept' }, { today: TODAY, at: AT });
    expect(kept.patch['stressTool.settings.strategyParams']).toEqual({ spareGrowth: false });
    const cuts = wayPatch(plan, 'buckets-in-order', { cutPct: '30', protectionOn: 'no', bucketBand: '15' }, { today: TODAY, at: AT });
    expect(cuts.patch['stressTool.settings.protectionMult']).toBe(0.7);
    expect(cuts.patch['stressTool.settings.disableProtection']).toBe(true);
    expect(cuts.patch['stressTool.settings.strategyParams']).toEqual({ bucketBand: 15 });
    expect(cuts.patch['stressTool.settings.consecutiveLimit']).toBe(undefined);
    // the sleeve rate typed as a percent is stored as the planner stores it
    const ff = wayPatch(plan, 'floor-and-flex', { sleeveRatePct: '3.5' }, { today: TODAY, at: AT });
    expect(ff.patch['stressTool.settings.strategyParams']).toEqual({ sleeveRate: 0.035 });
  });
  it('a locked plan, an unknown way and a dial with a problem write nothing', () => {
    const sam = entryOf(C['03-gilt-ladder-runup']).plan;
    expect(wayPatch(sam, 'floor-to-age', {}, { today: TODAY, at: AT })).toMatchObject({ ok: false, errors: { plan: 'locked' }, patch: {} });
    const plan = entryOf(C['02-pnv-draft']).plan;
    expect(wayPatch(plan, 'nothing', {}, { today: TODAY, at: AT })).toMatchObject({ ok: false, errors: { way: 'unknown' }, patch: {} });
    expect(wayPatch(plan, 'floor-to-age', { floorToAge: '12' }, { today: TODAY, at: AT })).toMatchObject({ ok: false, errors: { floorToAge: 'tooLow' }, patch: {} });
  });
  it('property: whatever is typed (within the dials\' ranges), every path written is declared, the plan read back carries the way and the typed values, and Undo is byte for byte', () => {
    const plans = UNLOCKED.map((raw) => entryOf(raw).plan);
    const dialArb = (d) => (d.type === 'choice' ? fc.constantFrom(...d.options) : d.type === 'money' ? fc.integer({ min: d.min, max: Math.min(d.max, 2000000) }).map(String) : d.type === 'count' || d.type === 'age' ? fc.integer({ min: d.min, max: d.max }).map(String) : fc.integer({ min: Math.round(d.min * 100), max: Math.round(d.max * 100) }).map((n) => String(n / 100)));
    const typedArb = fc.constantFrom(...WAY_IDS).chain((id) => fc.tuple(fc.constant(id), fc.dictionary(fc.constantFrom(...WAY_DIALS[id].map((d) => d.key), 'none'), fc.constant(true)).chain((keys) => fc.record(Object.fromEntries(Object.keys(keys).filter((k) => k !== 'none').map((k) => [k, dialArb(WAY_DIALS[id].find((d) => d.key === k))]))))));
    fc.assert(fc.property(fc.integer({ min: 0, max: plans.length - 1 }), typedArb, (pi, [id, typed]) => {
      const plan = plans[pi];
      const p = wayPatch(plan, id, typed, { today: TODAY, at: AT });
      expect(p.ok).toBe(true);
      for (const k of Object.keys(p.patch)) expect(WAY_WRITES).toContain(k);
      const written = applyPatch(plan, p.patch);
      expect(written.stressTool.settings.strategyId).toBe(id);
      const prm = written.stressTool.settings.strategyParams;
      for (const [k, v] of Object.entries(typed)) {
        const d = WAY_DIALS[id].find((x) => x.key === k);
        if (d.cut) continue;
        const stored = k === 'sleeveRatePct' ? prm.sleeveRate : prm[k];
        expect(dialUnitsOf(d, stored), `${id}.${k}`).toEqual(checkDials(id, { [k]: v }, {}).values[k]);
      }
      expect(strip(written)).toEqual(strip(plan));
      expect(JSON.stringify(applyPatch(written, p.previous))).toBe(JSON.stringify(plan));
    }), { numRuns: 60 });
  });
  it('restoredParamsFor is the planner\'s: the active bag cleaned when it is this way\'s, else the stash, else nothing', () => {
    const s = { strategyId: 'floor-to-age', strategyParams: { floorToAge: 80, cashYears: 9, sippTotal: 1 }, strategyState: { 'full-il-gilt': { strategyParams: { cashYears: 2, odd: 1 } } } };
    expect(restoredParamsFor(s, 'floor-to-age')).toEqual({ floorToAge: 80, sippTotal: 1 });
    expect(restoredParamsFor(s, 'full-il-gilt')).toEqual({ cashYears: 2, odd: 1 });
    expect(restoredParamsFor(s, 'bridge-and-engine')).toEqual({});
    expect(stashOf(s, 'full-il-gilt')).toEqual({ cashYears: 2 });
  });
});
