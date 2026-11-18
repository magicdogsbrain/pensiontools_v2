/**
 * Small pieces of plain English the planner shows (v6 usability audit, 17 Oct 2026), kept out of index.html:
 *  - how many strategies there are, counted from the registry — never typed in ("six strategies" said nine);
 *  - the State Pension the engines ASSUME when none was entered, said wherever that figure is used;
 *  - the question before a new version of the plan document is written;
 *  - the question before the plan is locked from the Stress settings.
 *
 * Pure: strings in, strings out. The dialogs are shown by index.html's appConfirm (never a browser dialog).
 */
import { listStrategies } from '../strategies/registry.js';
import { LOCK } from '../v7/copy/lock.js';
import { grossToNet } from '../services/TaxCalculator.js';
import { takenBeforeTax, taxFreeShareOf } from '../services/BeforeTax.js';
import { markFact } from '../reading/mark.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const gbp = (v) => '£' + Math.round(+v || 0).toLocaleString('en-GB');

const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

/** How many strategies the registry holds. */
export function strategyCount() {
  return listStrategies().length;
}

/** 'nine' — the count as a word (digits past twelve). */
export function strategyCountWord(n = strategyCount()) {
  return WORDS[n] ?? String(n);
}

/** Fill every element marked data-strategy-count with the word. */
export function paintStrategyCounts(doc, n = strategyCount()) {
  if (!doc || !doc.querySelectorAll) return;
  for (const el of doc.querySelectorAll('[data-strategy-count]')) el.textContent = strategyCountWord(n);
}

/**
 * The State Pension a plan assumes when none was entered: planFromSettings sets `spAssumed` and falls back to the
 * engine's default (£12,000 a year from plan year 12 unless the Timing block says otherwise). '' when one was entered.
 * @param {object} p  the plan (stressTest.planFromSettings), or anything with spAssumed, spAnnual, startAge, spStartYear
 */
export function assumedStatePensionWords(p) {
  if (!p || !p.spAssumed || !(p.spAnnual > 0)) return '';
  const age = (+p.startAge || 0) + (+p.spStartYear || 0);
  return 'assumed ' + gbp(p.spAnnual) + ' a year from ' + (age > 0 ? age : 'State Pension age') + ' — no State Pension was entered in Settings';
}

/** The alert above an order sheet or a strategy page sized on an assumed State Pension; '' when none is assumed. */
export function assumedStatePensionAlertHtml(p) {
  const w = assumedStatePensionWords(p);
  if (!w) return '';
  return '<div class="alert alert-warning" style="font-size:12px;margin-top:8px;"><strong>State Pension ' + esc(w) + '.</strong> The rungs below are sized on it: enter your forecast date and weekly amount in Settings for a real answer.</div>';
}

/**
 * The note under the State Pension boxes in Settings when nothing is entered: the figure every run then assumes
 * (StressRepository's default £12,000 a year; IncomeSchedule.defaultSpYear puts it at age 67).
 */
export function assumedStatePensionSettingsNote(entered) {
  if (entered) return '';
  return 'Nothing entered: every run assumes ' + gbp(12000) + ' a year from age 67, and every figure that uses the State Pension says so. Enter your forecast date and weekly amount for a real answer.';
}

/** The "+ SP £x" cell note: ' (assumed)' when the figure is the engine's default. */
export function assumedStatePensionTag(p) {
  return p && p.spAssumed ? ' (assumed)' : '';
}

/** The button that writes a new plan document from today's settings (was "Refresh the document"). */
export const NEW_DOCUMENT_VERSION_LABEL = 'Write a new version from today\'s settings';

/** The question before a new version is written over the current plan document. */
export function newDocumentVersionQuestion({ strategyName = '', lockedAt = '' } = {}) {
  return {
    html: '<h3 style="margin:0 0 10px;">Write a new version of the plan document?</h3>'
      + '<p style="font-size:14px;margin:0 0 8px;">The current document' + (lockedAt ? ' (' + esc(lockedAt) + (strategyName ? ', ' + esc(strategyName) : '') + ')' : '') + ' becomes a past version, kept under "Previous versions" on this page.</p>'
      + '<p style="font-size:14px;margin:0 0 8px;">A new one is written from the plan\'s settings as they stand today, with the strategy run again at today\'s prices. "Where you are" then reads against the new version.</p>'
      + '<p style="font-size:14px;margin:0;">Nothing else changes: the plan stays locked, and your recorded months are kept.</p>',
    okLabel: 'Write the new version',
    cancelLabel: 'Keep the current document'
  };
}

/**
 * The lock refused (7.12.0): the one sentence V7's lock page says (src/v7/copy/lock.js LOCK.unaffordable), for the fit
 * PlanCommit.lockFitOf reads from the run. Plain text.
 */
export function lockFitWords(fit) {
  if (!fit) return '';
  const U = LOCK.unaffordable;
  const gbp = (v) => '£' + Math.round(+v || 0).toLocaleString('en-GB');
  if (fit.ladder) return U.ladder.replace('{cost}', gbp(fit.cost)).replace('{pots}', fit.isa ? U.potsIsa : U.potsPension).replace('{amount}', gbp(fit.pots)).replace('{short}', gbp(fit.short));
  return U.other.replace('{reason}', fit.reason || (fit.short ? gbp(fit.short) + ' short' : 'it cannot be paid for'));
}

/** The question before the plan is locked from the Stress settings page. */
export function lockFromStressQuestion() {
  return {
    html: '<h3 style="margin:0 0 10px;">Lock this plan?</h3><ul style="margin:0 0 10px 18px;font-size:13px;line-height:1.5;">'
      + '<li>Your Stress settings are saved first, then <strong>frozen</strong> — and so are the Decision tool\'s. The Decision tool runs exactly this plan.</li>'
      + '<li>The <strong>plan document</strong> is written: your age against the tax years, the income steps, who pays each year, the strategy verdict and cones, the pots and the shopping list, the assumptions — the record you read against each month of retirement.</li>'
      + '<li>The strategy can no longer be switched on this plan; "Try a strategy" what-ifs still run. How often you draw, your records, what you hold and the Budget stay changeable.</li>'
      + '<li>You can unlock later — you are shown exactly what that does first.</li></ul>',
    okLabel: 'Lock the plan',
    cancelLabel: 'Not yet'
  };
}

/**
 * The Stress settings' line under the income shape (7.12.0): the first step as the shape holds it (a year gross, counted as
 * if every pound were taxed, the figure the engines read) and what reaches the bank a month; with a quarter of each
 * withdrawal tax-free, also what is taken before tax for it (services/BeforeTax.js, the figure the months and the plan
 * document take). `access`: the form's access method.
 */
export function firstStepNoteHtml(amount, { pa = 12570, brl = 50270, hrl = 125140, access = 'drawdown' } = {}) {
  const gross = +amount || 0;
  const netMo = grossToNet(gross, pa, brl, hrl) / 12;
  const f = taxFreeShareOf({ accessMethod: access });
  const taken = f > 0 ? takenBeforeTax(gross, { taxFreeFraction: f, pa, brl, hrl }) : null;
  return '<strong>First step ' + markFact('income.step.0.beforeTax', gbp(gross)) + '/yr gross ≈ ' + markFact('income.step.0.monthAfterTax', gbp(netMo)) + '/mo take-home</strong> at today\'s bands. '
    + (taken != null && Math.round(taken) !== Math.round(gross) ? 'With a quarter of each payment tax-free, you take ' + gbp(taken) + ' a year before tax for it. ' : '');
}
