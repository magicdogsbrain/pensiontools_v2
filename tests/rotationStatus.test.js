import { describe, it, expect } from 'vitest';
import { rotationStatus, ROTATION_DEFAULTS } from '../src/services/RotationStatus.js';

const rotDoc = (params = {}, extra = {}) => ({ strategy: { id: 'gilt-rotation', params: { rotateCutAge: 75, ...params }, contract: true }, timing: { firstTaxYear: 2027, shapeAgeNow: 57 }, ...extra });
// A document without timing: the whole-years `ageToday` is then the age the watch reads.
const bareDoc = (params = {}, extra = {}) => ({ strategy: { id: 'gilt-rotation', params: { rotateCutAge: 75, ...params }, contract: true }, ...extra });
const TODAY = new Date(2026, 8, 16);

describe('rotationStatus', () => {
  it('is null for anything but the rotation strategy', () => {
    expect(rotationStatus({ strategy: { id: 'full-il-gilt', params: {} } }, { today: TODAY })).toBeNull();
    expect(rotationStatus({ strategy: { id: 'pots-and-valves' } }, { today: TODAY })).toBeNull();
    expect(rotationStatus(null, { today: TODAY })).toBeNull();
    expect(rotationStatus({}, { today: TODAY })).toBeNull();
  });
  it('armed at 57: cut 75, trigger 30% (stored as a percent), disarm 8 years before → 67', () => {
    const s = rotationStatus(bareDoc({ rotateTrigger: 30 }), { today: TODAY, ageToday: 57 });
    expect(s).toMatchObject({ applies: true, cutAge: 75, triggerPct: 0.30, disarmAge: 67, disarmYears: 8, state: 'armed', ageToday: 57, yearsArmed: 10, firedAt: null });
    expect(s.text).toBe('Rotation watch armed: if world equities close 30% below their all-time high while you are 67 or younger, the rungs above 75 are sold and buy the equity fund. Nothing to do until then.');
  });
  it('defaults match the engine (GiltRotation.js): cut 75, 30%, disarm 8', () => {
    const s = rotationStatus({ strategy: { id: 'gilt-rotation', params: {} } }, { today: TODAY, ageToday: 60 });
    expect(s).toMatchObject({ cutAge: ROTATION_DEFAULTS.cutAge, triggerPct: ROTATION_DEFAULTS.triggerPct, disarmAge: 67, state: 'armed' });
  });
  it('honours the dials: cut 80, trigger given as a fraction, a custom disarm window', () => {
    const s = rotationStatus(bareDoc({ rotateCutAge: 80, rotateTrigger: 0.35, rotateDisarmYears: 5 }), { today: TODAY, ageToday: 70 });
    expect(s).toMatchObject({ cutAge: 80, triggerPct: 0.35, disarmAge: 75, disarmYears: 5, state: 'armed', yearsArmed: 5 });
    expect(s.text).toContain('35% below');
    expect(s.text).toContain('while you are 75 or younger');
    expect(s.text).toContain('rungs above 80');
  });
  it('armed THROUGH the plan year the disarm age is reached (the engine: y <= lastRotateYear), disarmed from the next', () => {
    expect(rotationStatus(bareDoc(), { today: TODAY, ageToday: 66 }).state).toBe('armed');
    expect(rotationStatus(bareDoc(), { today: TODAY, ageToday: 67 })).toMatchObject({ state: 'armed', yearsArmed: 0 });   // the last armed year
    expect(rotationStatus(bareDoc(), { today: TODAY, ageToday: 68 }).state).toBe('disarmed');
    const s = rotationStatus(bareDoc(), { today: TODAY, ageToday: 70 });
    expect(s.state).toBe('disarmed');
    expect(s.yearsArmed).toBeNull();
    expect(s.text).toMatch(/disarmed.*held to maturity.*nothing to do/i);
    // the engine's own arithmetic, dial for dial: cut 80, disarm 5 → armed at 75, not at 76
    expect(rotationStatus(bareDoc({ rotateCutAge: 80, rotateDisarmYears: 5 }), { today: TODAY, ageToday: 75 }).state).toBe('armed');
    expect(rotationStatus(bareDoc({ rotateCutAge: 80, rotateDisarmYears: 5 }), { today: TODAY, ageToday: 76 }).state).toBe('disarmed');
  });
  it('fired when the strategy params carry a borrowed floor, or the document records the rotation', () => {
    const viaParams = rotationStatus(rotDoc({ borrowedFloor: { soldAt: '2031-03-02', tidms: ['TR45'], years: [{ Y: 2045, age: 75, need: 40000 }], proceeds: 120000 } }), { today: TODAY, ageToday: 61 });
    expect(viaParams.state).toBe('fired');
    expect(viaParams.firedAt).toBe('2031-03-02');
    expect(viaParams.text).toContain('Rotation fired on 2 March 2031');
    expect(viaParams.text).toContain('borrowed floor');
    // The document is a lock-time snapshot: the shell passes the LIVE params when a rotation happened afterwards
    const live = rotationStatus(rotDoc(), { today: TODAY, ageToday: 61, params: { borrowedFloor: { soldAt: '2030-11-01' } } });
    expect(live.state).toBe('fired');
    const rec = rotationStatus(rotDoc({}, { rotation: { fired: true, firedAt: '2029-06-01' } }), { today: TODAY, ageToday: 59 });
    expect(rec).toMatchObject({ state: 'fired', firedAt: '2029-06-01' });
    // the document's rotation record alone — a firedAt, or a borrowedFloor — is enough (the shell writes both at the switch)
    expect(rotationStatus(rotDoc({}, { rotation: { firedAt: '2029-06-01' } }), { today: TODAY })).toMatchObject({ state: 'fired', firedAt: '2029-06-01' });
    expect(rotationStatus(rotDoc({}, { rotation: { borrowedFloor: { soldAt: '2029-06-02', tidms: ['TR46'] } } }), { today: TODAY })).toMatchObject({ state: 'fired', firedAt: '2029-06-02' });
    const journey = rotationStatus(rotDoc({}, { journey: [{ stage: 'running', at: '2027-04-06' }, { stage: 'rotated', at: '2030-01-05' }] }), { today: TODAY, ageToday: 59 });
    expect(journey.state).toBe('fired');
  });
  it('reads the PLAN-YEAR age from the document timing, as the engine does — timing wins over a whole-years age today', () => {
    // 57 in 2027/28 → 56 in 2026/27 (a bridge year) → armed; 2037/38 → 67, the last armed year; 2038/39 → 68 → disarmed
    expect(rotationStatus(rotDoc(), { today: TODAY })).toMatchObject({ ageToday: 56, state: 'armed', yearsArmed: 11 });
    expect(rotationStatus(rotDoc(), { today: new Date(2037, 5, 1) })).toMatchObject({ ageToday: 67, state: 'armed', yearsArmed: 0 });
    expect(rotationStatus(rotDoc(), { today: new Date(2038, 5, 1) })).toMatchObject({ ageToday: 68, state: 'disarmed' });
    // a birthday late in the plan year: the whole-years age today says 66 in June 2037, but the engine's year-11 age is 67 — still armed either way;
    // in June 2038 the whole-years age says 67 (armed) while the plan-year age is 68 — the engine has disarmed, so the watch says so
    expect(rotationStatus(rotDoc(), { today: new Date(2038, 5, 1), ageToday: 67 })).toMatchObject({ ageToday: 68, state: 'disarmed' });
    expect(rotationStatus(rotDoc(), { today: TODAY, ageToday: 70 })).toMatchObject({ ageToday: 56, state: 'armed' });
  });
  it('no age anywhere → armed, with no years-armed figure', () => {
    const s = rotationStatus({ strategy: { id: 'gilt-rotation', params: {} } }, { today: TODAY });
    expect(s).toMatchObject({ state: 'armed', ageToday: null, yearsArmed: null });
  });
  it('every field is JSON-safe (nothing undefined)', () => {
    const s = rotationStatus(rotDoc(), { today: TODAY, ageToday: 57 });
    expect(Object.values(s).some((v) => v === undefined)).toBe(false);
    expect(JSON.parse(JSON.stringify(s))).toEqual(s);
  });
});
