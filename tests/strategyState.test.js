/**
 * Per-strategy inputs kept apart (6.13.0): switching strategy leaves no stray data from the deselected one;
 * switching back restores exactly what was there; Pots & Valves never sees the mini-pot totals.
 */
import { describe, it, expect } from 'vitest';
import { OWNED_KEYS, SHARED_KEYS, ownedKeys, allowedKeys, cleanParams, activeParams, stashStrategy, switchStrategy, sortLegacyParams } from '../src/services/StrategyState.js';
import { STRATEGY_NAMES } from '../src/strategies/stressTest.js';

const deepHasUndefined = (v) => v === undefined || (Array.isArray(v) ? v.some(deepHasUndefined) : (v && typeof v === 'object' ? Object.values(v).some(deepHasUndefined) : false));

describe('the key map', () => {
  it('covers every strategy the engine knows, and only those', () => {
    expect(Object.keys(OWNED_KEYS).sort()).toEqual(Object.keys(STRATEGY_NAMES).sort());
  });
  it('owned keys per strategy, as the engine and readStrategyParams read them', () => {
    expect(ownedKeys('ladder-and-ratchet')).toEqual(['ladderYears', 'drawAnnual', 'triggerMode', 'bandThreshold']);
    expect(ownedKeys('floor-and-flex')).toEqual(['essentialsAnnual', 'horizonAge', 'sleeveRate', 'treatsRule', 'ratchet']);
    expect(ownedKeys('floor-the-schedule')).toEqual([]);
    expect(ownedKeys('floor-to-age')).toEqual(['floorToAge', 'borrowedFloor']);
    expect(ownedKeys('bridge-and-engine')).toEqual(['bridgeAge', 'cashYears']);
    expect(ownedKeys('full-il-gilt')).toEqual(['cashYears', 'bridgeCash']);
    expect(ownedKeys('gilt-rotation')).toEqual(['cashYears', 'bridgeCash', 'rotateCutAge', 'rotateTrigger', 'rotateDisarmYears']);
    expect(ownedKeys('buckets-in-order')).toEqual(['bucketBand']);
    expect(ownedKeys('pots-and-valves')).toEqual([]);
    expect(ownedKeys('nope')).toEqual([]);
    ownedKeys('full-il-gilt').push('x');   // a copy: the map is not mutable through it
    expect(OWNED_KEYS['full-il-gilt']).toEqual(['cashYears', 'bridgeCash']);
  });
  it('the mini-pot totals are shared by every strategy except Pots & Valves', () => {
    expect(SHARED_KEYS).toEqual(['sippTotal', 'isaTotal']);
    expect(allowedKeys('pots-and-valves')).toEqual([]);
    expect(allowedKeys('floor-the-schedule')).toEqual(['sippTotal', 'isaTotal']);
    expect(allowedKeys('full-il-gilt')).toEqual(['cashYears', 'bridgeCash', 'sippTotal', 'isaTotal']);
  });
});

describe('cleanParams / activeParams', () => {
  const bag = { floorToAge: 80, borrowedFloor: { soldAt: '2026-09-01' }, cashYears: 3, bridgeCash: 50000, sippTotal: 1179422, isaTotal: 60000, essentialsAnnual: 40000, bucketBand: 10, mystery: 1, gone: undefined };
  it('keeps only the owned + shared keys', () => {
    expect(cleanParams('full-il-gilt', bag)).toEqual({ cashYears: 3, bridgeCash: 50000, sippTotal: 1179422, isaTotal: 60000 });
    expect(cleanParams('floor-to-age', bag)).toEqual({ floorToAge: 80, borrowedFloor: { soldAt: '2026-09-01' }, sippTotal: 1179422, isaTotal: 60000 });
    expect(cleanParams('floor-and-flex', bag)).toEqual({ essentialsAnnual: 40000, sippTotal: 1179422, isaTotal: 60000 });
  });
  it('Pots & Valves never sees sippTotal (or anything else)', () => {
    expect(cleanParams('pots-and-valves', bag)).toEqual({});
    expect(activeParams({ strategyId: 'pots-and-valves', strategyParams: bag })).toEqual({});
    expect(activeParams({ strategyParams: bag })).toEqual({});   // no strategyId = P&V
  });
  it('null / missing params and undefined values are handled; an unknown strategy keeps everything defined', () => {
    expect(cleanParams('full-il-gilt', null)).toEqual({});
    expect(cleanParams('full-il-gilt', { cashYears: undefined, bridgeCash: null })).toEqual({ bridgeCash: null });
    expect(cleanParams('future-strategy', bag)).toEqual({ ...bag, gone: undefined });
    expect('gone' in cleanParams('future-strategy', bag)).toBe(false);
  });
});

// Chris-like plan on Floor to an age, with a borrowed floor on record and the Stress "funds to test" list.
const fundsA = [{ ticker: 'TR29', value: 39690, wrapper: 'SIPP', units: 36000 }, { ticker: 'VWRP', value: 60000, wrapper: 'ISA' }];
const base = {
  strategyId: 'floor-to-age', allocMode: 'funds', taggedFunds: fundsA, equityMin: 300000, bondMin: 800000, cashTarget: 79422,
  strategyParams: { floorToAge: 80, borrowedFloor: { soldAt: '2026-09-01', tidms: ['T40'] }, sippTotal: 1179422, isaTotal: 60000, essentialsAnnual: 40000 }
};

describe('switchStrategy', () => {
  const s1 = switchStrategy(base, 'full-il-gilt', { savedAt: '2026-09-16T10:00:00.000Z' });
  it('a stray floorToAge (and the borrowed floor) does not survive a switch to full-il-gilt', () => {
    expect(s1.strategyId).toBe('full-il-gilt');
    expect(s1.strategyParams.floorToAge).toBeUndefined();
    expect(s1.strategyParams.borrowedFloor).toBeUndefined();
    expect(s1.strategyParams.essentialsAnnual).toBeUndefined();
    expect(Object.keys(s1.strategyParams).sort()).toEqual(['isaTotal', 'sippTotal']);   // the shared pot totals travel to a bought strategy
    expect(s1.allocMode).toBe('risk');
    expect(s1.taggedFunds).toEqual([]);
    expect(s1.equityMin).toBe(300000);   // the rest of the settings untouched
  });
  it('stashes the outgoing strategy, cleaned to its own keys, with the caller\'s savedAt', () => {
    expect(s1.strategyState['floor-to-age']).toEqual({
      strategyParams: { floorToAge: 80, borrowedFloor: { soldAt: '2026-09-01', tidms: ['T40'] }, sippTotal: 1179422, isaTotal: 60000 },
      allocMode: 'funds', taggedFunds: fundsA, savedAt: '2026-09-16T10:00:00.000Z'
    });
    expect(s1.strategyState['full-il-gilt']).toBeUndefined();
  });
  it('does not mutate the settings passed in', () => {
    expect(base.strategyId).toBe('floor-to-age');
    expect(base.strategyParams.floorToAge).toBe(80);
    expect(base.strategyState).toBeUndefined();
    expect(base.taggedFunds).toBe(fundsA);
  });
  it('switching back restores exactly what was there; the gilt strategy\'s dials are stashed and gone from the flat bag', () => {
    const gilt = { ...s1, strategyParams: { ...s1.strategyParams, cashYears: 3, bridgeCash: 50000 }, allocMode: 'risk' };
    const back = switchStrategy(gilt, 'floor-to-age', { savedAt: '2026-10-01T00:00:00.000Z' });
    expect(back.strategyId).toBe('floor-to-age');
    expect(back.strategyParams).toEqual({ floorToAge: 80, borrowedFloor: { soldAt: '2026-09-01', tidms: ['T40'] }, sippTotal: 1179422, isaTotal: 60000 });
    expect(back.allocMode).toBe('funds');
    expect(back.taggedFunds).toEqual(fundsA);
    expect(back.strategyParams.cashYears).toBeUndefined();
    expect(back.strategyState['full-il-gilt']).toEqual({ strategyParams: { cashYears: 3, bridgeCash: 50000, sippTotal: 1179422, isaTotal: 60000 }, allocMode: 'risk', taggedFunds: [], savedAt: '2026-10-01T00:00:00.000Z' });
    expect(back.strategyState['floor-to-age'].savedAt).toBe('2026-09-16T10:00:00.000Z');   // the earlier stash is what came back
  });
  it('Pots & Valves receives nothing — not even the shared totals — and passes nothing on', () => {
    const pv = switchStrategy(base, 'pots-and-valves', { savedAt: 't' });
    expect(pv.strategyParams).toEqual({});
    expect(pv.taggedFunds).toEqual([]);
    const rot = switchStrategy(pv, 'gilt-rotation', { savedAt: 't2' });
    expect(rot.strategyParams).toEqual({});   // nothing to carry from P&V
    expect(rot.strategyState['pots-and-valves']).toEqual({ strategyParams: {}, allocMode: 'risk', taggedFunds: [], savedAt: 't2' });
  });
  it('a plan with no strategyId is treated as Pots & Valves; no savedAt → null (no clock in pure code)', () => {
    const s = switchStrategy({ strategyParams: { sippTotal: 5 }, taggedFunds: [{ ticker: 'A', value: 1, junk: undefined }] }, 'full-il-gilt');
    expect(s.strategyState['pots-and-valves']).toEqual({ strategyParams: {}, allocMode: 'funds', taggedFunds: [{ ticker: 'A', value: 1 }], savedAt: null });
    expect(s.strategyParams).toEqual({});
    expect(deepHasUndefined(JSON.parse(JSON.stringify(s)))).toBe(false);
    expect(deepHasUndefined(s.strategyState)).toBe(false);
  });
  it('carryShared:false starts a fresh strategy with an empty bag', () => {
    expect(switchStrategy(base, 'full-il-gilt', { carryShared: false }).strategyParams).toEqual({});
  });
  it('stashStrategy alone keeps an existing savedAt when none is given', () => {
    const st = stashStrategy(s1, 'floor-to-age');
    expect(st.strategyState['floor-to-age'].savedAt).toBe('2026-09-16T10:00:00.000Z');
    expect(st.strategyParams).toEqual(s1.strategyParams);   // flat fields untouched
  });
  it('tolerates strategyState entries with missing fields, and a strategyState that is not an object', () => {
    const partial = { ...base, strategyState: { 'full-il-gilt': {}, 'gilt-rotation': { strategyParams: { cashYears: 2, floorToAge: 1 } }, 'buckets-in-order': null, 'bridge-and-engine': 'junk' } };
    const a = switchStrategy(partial, 'full-il-gilt', { savedAt: 't' });
    expect(a.strategyParams).toEqual({});
    expect(a.allocMode).toBe('risk');
    expect(a.taggedFunds).toEqual([]);
    const b = switchStrategy(partial, 'gilt-rotation', { savedAt: 't' });
    expect(b.strategyParams).toEqual({ cashYears: 2 });   // cleaned to its own keys on the way back
    expect(b.allocMode).toBe('risk');
    const c = switchStrategy(partial, 'buckets-in-order', { savedAt: 't' });   // null entry = no stash: a clean start with the shared totals
    expect(c.strategyParams).toEqual({ sippTotal: 1179422, isaTotal: 60000 });
    const d = switchStrategy(partial, 'bridge-and-engine', { savedAt: 't' });   // a string entry likewise
    expect(d.strategyParams).toEqual({ sippTotal: 1179422, isaTotal: 60000 });
    expect(d.strategyState['floor-to-age'].savedAt).toBe('t');
    for (const x of [a, b, c, d]) expect(deepHasUndefined(x.strategyState)).toBe(false);
    const arr = switchStrategy({ ...base, strategyState: [1, 2] }, 'full-il-gilt', { savedAt: 't' });
    expect(Object.keys(arr.strategyState)).toEqual(['floor-to-age']);
    expect(switchStrategy({ ...base, strategyState: null }, 'full-il-gilt').strategyState['floor-to-age'].allocMode).toBe('funds');
  });
});

describe('sortLegacyParams — a pre-6.13.0 flat bag sorted into per-strategy stashes', () => {
  // Chris-like legacy plan: active full-il-gilt, but the bag still holds Floor-to-age and rotation dials from earlier tries
  const legacy = {
    strategyId: 'full-il-gilt', allocMode: 'funds', taggedFunds: fundsA, equityMin: 1,
    strategyParams: { cashYears: 3, bridgeCash: 50000, sippTotal: 1179422, isaTotal: 60000, floorToAge: 80, borrowedFloor: { soldAt: '2026-09-01' }, rotateCutAge: 75, ladderYears: undefined }
  };
  it('creates a stash for every other known strategy whose keys are in the bag, cleaned to its keys; the flat fields stay', () => {
    const out = sortLegacyParams(legacy);
    expect(out).not.toBe(legacy);
    expect(out.strategyParams).toBe(legacy.strategyParams);   // untouched: activeParams() reads it clean, the first switch sheds the strays
    expect(out.strategyId).toBe('full-il-gilt');
    expect(Object.keys(out.strategyState).sort()).toEqual(['bridge-and-engine', 'floor-to-age', 'gilt-rotation']);
    expect(out.strategyState['floor-to-age']).toEqual({ strategyParams: { floorToAge: 80, borrowedFloor: { soldAt: '2026-09-01' }, sippTotal: 1179422, isaTotal: 60000 }, allocMode: 'funds', taggedFunds: fundsA, savedAt: null });
    expect(out.strategyState['gilt-rotation'].strategyParams).toEqual({ cashYears: 3, bridgeCash: 50000, rotateCutAge: 75, sippTotal: 1179422, isaTotal: 60000 });
    expect(out.strategyState['bridge-and-engine'].strategyParams).toEqual({ cashYears: 3, sippTotal: 1179422, isaTotal: 60000 });
    expect(out.strategyState['full-il-gilt']).toBeUndefined();      // the active strategy is not stashed
    expect(out.strategyState['pots-and-valves']).toBeUndefined();   // owns no keys
    expect(out.strategyState['ladder-and-ratchet']).toBeUndefined();   // an undefined value is not "in the bag"
    expect(deepHasUndefined(out.strategyState)).toBe(false);
    expect(legacy.strategyState).toBeUndefined();   // input not mutated
    // the stashes restore on a switch exactly as a 6.13 stash would
    const sw = switchStrategy(out, 'floor-to-age', { savedAt: 't' });
    expect(sw.strategyParams).toEqual({ floorToAge: 80, borrowedFloor: { soldAt: '2026-09-01' }, sippTotal: 1179422, isaTotal: 60000 });
    expect(sw.strategyState['full-il-gilt'].strategyParams).toEqual({ cashYears: 3, bridgeCash: 50000, sippTotal: 1179422, isaTotal: 60000 });
  });
  it('is a no-op (same object back) when nothing is stray, when a strategyState already exists, or when nothing can be placed', () => {
    const clean = { strategyId: 'full-il-gilt', strategyParams: { cashYears: 3, sippTotal: 5 } };
    expect(sortLegacyParams(clean)).toBe(clean);
    const has = { ...legacy, strategyState: { 'floor-to-age': { strategyParams: {}, allocMode: 'risk', taggedFunds: [], savedAt: null } } };
    expect(sortLegacyParams(has)).toBe(has);
    const empty = { ...legacy, strategyState: {} };   // an empty state counts as absent
    expect(sortLegacyParams(empty).strategyState['floor-to-age']).toBeTruthy();
    const pvShared = { strategyId: 'pots-and-valves', strategyParams: { sippTotal: 5, isaTotal: 1 } };   // stray for P&V, but owned by nobody
    expect(sortLegacyParams(pvShared)).toBe(pvShared);
    const pvDials = { strategyParams: { sippTotal: 5, floorToAge: 80, mystery: 2 } };   // no strategyId = P&V
    expect(Object.keys(sortLegacyParams(pvDials).strategyState)).toEqual(['floor-to-age']);
    expect(sortLegacyParams(pvDials).strategyState['floor-to-age']).toEqual({ strategyParams: { floorToAge: 80, sippTotal: 5 }, allocMode: 'risk', taggedFunds: [], savedAt: null });
    const unknown = { strategyId: 'future-strategy', strategyParams: { floorToAge: 80 } };
    expect(sortLegacyParams(unknown)).toBe(unknown);
    expect(sortLegacyParams(null)).toEqual({});
    expect(sortLegacyParams({ strategyId: 'full-il-gilt', strategyParams: null })).toEqual({ strategyId: 'full-il-gilt', strategyParams: null });
  });
});
