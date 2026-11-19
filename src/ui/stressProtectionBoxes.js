/**
 * The full view's cuts and reserve boxes (Stress settings → protection), filled from the same reading as the simple view's
 * "Does it last?" boxes (answers/plan/lasts.js cutsValuesOf, lead4.md R1/R2): a value the plan holds, 0 included, shows as
 * held (a buffer of £0 is £0, never £15,000); one it lacks shows as the engines read it. And back: what the boxes hold, as
 * the plan's keys (an empty box is a key left out, never a default written in its place).
 *
 *   protectionBoxValues(settings)   { ssConsecutiveLimit, ssProtectionMult, ssProtEscalate, ssRecoveryBuffer, ssHodlValue,
 *                                     ssDisableProtection, ssHodlEnabled } (the two ticks as booleans)
 *   protectionFromBoxes(get)        the keys from the boxes; get(id) → the box's value text
 */
import { cutsValuesOf } from '../answers/plan/lasts.js';
import { SIMULATION_DEFAULTS } from '../constants.js';

const num = (v) => (v == null || v === '' || !Number.isFinite(+v) ? null : +v);

export function protectionBoxValues(settings) {
  const s = settings && typeof settings === 'object' ? settings : {};
  const v = cutsValuesOf(s);
  return {
    ssConsecutiveLimit: v.cutAfterMonths,
    ssProtectionMult: num(s.protectionMult) ?? SIMULATION_DEFAULTS.PROTECTION_MULTIPLIER,   // this box shows the multiplier itself
    ssProtEscalate: v.deeperAfterMonths,
    ssRecoveryBuffer: v.buffer,
    ssHodlValue: v.reserveAmount == null ? '' : v.reserveAmount,
    ssDisableProtection: v.cutsOn === 'no',
    ssHodlEnabled: v.reserveOn === 'yes'
  };
}

export function protectionFromBoxes(get) {
  const n = (id) => { const t = String(get(id) ?? '').trim(); return t === '' || !Number.isFinite(+t) ? undefined : +t; };
  const esc = n('ssProtEscalate');
  return {
    consecutiveLimit: n('ssConsecutiveLimit'),
    protectionMult: n('ssProtectionMult'),
    protectionEscalateMonths: esc == null ? undefined : Math.max(0, esc),
    recoveryBuffer: n('ssRecoveryBuffer'),
    hodlValue: n('ssHodlValue')
  };
}
