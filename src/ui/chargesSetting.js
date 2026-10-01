/**
 * Fund and platform charges on today's planner's screens (6.19.0; research/charges-setting.md §5). Pure: settings in,
 * words and field state out — index.html paints them.
 *
 * The owner's decision (1 Oct 2026): "Yes half a percent. But put it as a config parameter somewhere - like in the
 * various plan settings." So one box in Stress tester → Settings, stored as stressTool.settings.chargesPct (percent a
 * year). A locked plan with no setting (locked before charges were added) runs at 0% and shows CHARGES_LOCKED_TEXT in
 * place of the box until it is unlocked.
 */
import { chargesPctOf, isChargesPct, normaliseChargesPct, DEFAULT_CHARGES_PCT } from '../services/Charges.js';

// index.html's inline script may only shrink (tests/v7/shellRatchet.test.js): it imports what it needs from here alone.
export { chargesPctOf, DEFAULT_CHARGES_PCT };

export const CHARGES_LABEL = 'Charges (funds and platform), % a year';

export const CHARGES_HELP = 'What your funds and your platform take each year, as a share of what you hold — for example a 0.2% '
  + 'tracker on a 0.25% platform is 0.45%. It is taken off every month, while you save and while you draw, from the money '
  + 'held in funds and cash in your pension, ISA and taxable account. It is not taken off State Pensions, final-salary '
  + 'pensions or annuities, which have no such charge, or off gilts you hold directly (platforms usually charge a small '
  + 'fixed fee for those).';

export const CHARGES_LOCKED_TEXT = '0% (this plan was locked before charges were added; unlock to change)';

/** True when the plan has a charge of its own saved (0 included). */
export function hasStoredCharges(settings) {
  return isChargesPct(settings && settings.chargesPct);
}

/** A percent as a person would type it: 0.5 → "0.5", 0.45 → "0.45", 0 → "0" (never 0.30000000000000004). */
export function formatChargesPct(pct) {
  return String(Math.round((+pct || 0) * 100) / 100);
}

/**
 * What the Settings box shows.
 *  - a locked plan with no setting: the text, not the box (it runs at 0% until it is unlocked);
 *  - otherwise the box, holding what the runs take: the plan's setting, or 0 when it has none.
 * The lock freezes the box itself (setStressSettingsEnabled); this only decides box or text.
 * @returns {{ mode: 'input'|'locked-before-charges', value: number, text: string }}
 */
export function chargesFieldState(settings, { locked = false } = {}) {
  if (locked && !hasStoredCharges(settings)) return { mode: 'locked-before-charges', value: 0, text: CHARGES_LOCKED_TEXT };
  const value = chargesPctOf(settings);
  return { mode: 'input', value, text: formatChargesPct(value) };
}

/**
 * The charge to save from what is in the box: clamped to 0–3 and put on the 0.05 grid; an empty or unreadable box
 * keeps the plan's own (effective) value.
 * @param {string|number} inputValue
 * @param {object} current - the plan's Stress settings as stored
 */
export function chargesForSave(inputValue, current) {
  const v = normaliseChargesPct(inputValue);
  return v == null ? chargesPctOf(current) : v;
}

/**
 * The sentence the lines above Monte Carlo, History and Scenarios end with.
 *  - a charge: what comes off, and what not;
 *  - 0%: none;
 *  - no setting on a plan known to be locked: none, and why;
 *  - no setting otherwise (lock not known): nothing — the line is as it always was.
 */
export function chargesRunLine(settings, { locked = null } = {}) {
  if (hasStoredCharges(settings)) {
    const pct = chargesPctOf(settings);
    if (pct > 0) return 'Fund and platform charges of ' + formatChargesPct(pct) + '% a year come off every month (change it in <strong>Settings</strong>); not off gilts held directly, annuities, final-salary or State Pensions.';
    return 'No fund or platform charges are taken off (0% in <strong>Settings</strong>).';
  }
  return locked === true ? 'No fund or platform charges are taken off: this plan was locked before charges were added.' : '';
}

/**
 * Beside the box: what the person's holdings' own fund charges (OCF, weighted by value) come to, so they add the
 * platform's fee — the plan's one setting replaces the funds' own charges on the Accumulation planner's "your mix" line.
 * @param {number} weightedOcf - a fraction (0.0018 = 0.18%), Holdings.proportions().weightedOcf
 */
export function holdingsChargesHint(weightedOcf) {
  if (!(+weightedOcf > 0)) return '';
  return 'Your holdings\' own fund charges come to about ' + (weightedOcf * 100).toFixed(2) + '% a year; add your platform\'s fee.';
}

/** The line under the box: what is charged, then the holdings' own charges when known (else a typical total). */
export function chargesHintText(weightedOcf) {
  return 'Taken off every month from your funds and cash — not from gilts you hold directly, annuities, final-salary or State Pensions. '
    + (holdingsChargesHint(weightedOcf) || '0.5% is a typical total.');
}

/**
 * Paint the Settings box (#ssChargesPct), the locked-plan words in its place (#ssChargesLocked) and the line under it
 * (#ssChargesHint) from chargesFieldState(). Does nothing when the page has no box.
 * @param {Document} doc
 * @param {{ mode: string, text: string }} state
 * @param {number} [weightedOcf] - the holdings' own fund charges, a fraction
 */
export function paintChargesField(doc, state, weightedOcf = 0) {
  const box = doc && doc.getElementById('ssChargesPct'), lockedEl = doc && doc.getElementById('ssChargesLocked'), hint = doc && doc.getElementById('ssChargesHint');
  if (!box || !lockedEl || !state) return;
  const words = state.mode === 'locked-before-charges';
  box.style.display = words ? 'none' : '';
  if (!words) box.value = state.text;
  lockedEl.textContent = words ? state.text : '';
  lockedEl.style.display = words ? '' : 'none';
  if (hint) hint.textContent = chargesHintText(weightedOcf);
}

/**
 * The bullet the unlock confirmation gains on a plan locked before charges (D2): unlocked, it gets the default.
 * @param {number} pct - the charge it will get
 */
export function chargesUnlockNoteHtml(pct) {
  return '<li><strong>Fund and platform charges:</strong> this plan was locked before charges were added, so its figures have been worked out without them. '
    + 'Once it is unlocked, ' + formatChargesPct(pct) + '% a year is taken off its projections — its chance of lasting and the amount left go down. '
    + 'Change it in Stress tester → Settings.</li>';
}

/** The note under the Accumulation planner's table. `mixOn`: the "your mix" line is shown. */
export function accumulationChargesNoteHtml(pct, mixOn = false) {
  const words = pct > 0
    ? 'After fund and platform charges of ' + formatChargesPct(pct) + '% a year (your plan\'s setting in Stress tester → Settings)' + (mixOn ? '; the "your mix" line takes this in place of your funds\' own charges' : '') + '.'
    : 'No fund or platform charges taken off (see Stress tester → Settings).';
  return '<p class="hint" style="margin:6px 0 0;">' + words + '</p>';
}
