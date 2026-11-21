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
import { LABELS } from '../reading/labels.js';
import { FACT } from '../reading/facts.js';
import { money } from '../reading/format.js';
import { ACCESS_WORDS, accessAssumedWords } from '../reading/access.js';
import { markFact } from '../reading/mark.js';
import { spAssumedHtml, spAssumedWords } from '../reading/statePension.js';   // the one writer of the assumed State Pension words

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

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
 * engine's default (£12,000 a year from plan year 12 unless the Timing block says otherwise). Said by the ONE writer of
 * these words (src/reading/statePension.js spAssumedHtml: the simple income page's sentence), its amount and age marked.
 * @param {object} p  the plan (stressTest.planFromSettings), or anything with spAssumed, spAnnual, startAge, spStartYear
 */
function assumedOf(p) {
  if (!p || !p.spAssumed || !(p.spAnnual > 0)) return null;
  const age = (+p.startAge || 0) + (+p.spStartYear || 0);
  return { assumed: true, year: +p.spAnnual, startAge: age > 0 ? age : null };
}
/** The sentence, unmarked; '' when one was entered. */
export function assumedStatePensionWords(p) {
  return spAssumedWords(assumedOf(p));
}

/** The alert above an order sheet or a strategy page sized on an assumed State Pension; '' when none is assumed. */
export function assumedStatePensionAlertHtml(p) {
  const sp = assumedOf(p);
  if (!sp) return '';
  return '<div class="alert alert-warning" style="font-size:12px;margin-top:8px;"><strong>' + spAssumedHtml(sp) + '</strong> The rungs below are sized on it: enter your forecast date and weekly amount in Settings for a real answer.</div>';
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
 * The Stress settings' line under the income shape (step F2, lead4.md D6): the first step as the ONE reader of the steps
 * gives it (src/reading/income.js incomeStepsOf on the plan as saved) — what is taken a year before tax and what reaches the
 * bank a month, each with its one label (src/reading/labels.js), and how the tax-free part is taken (src/reading/access.js),
 * said as an assumption when nothing was chosen. Never the raw stored step, never the page's boxes or default bands.
 * `step`: { beforeTax, monthAfterTax } (null: nothing set, nothing said); `access`: { method, chosen }.
 */
export function firstStepNoteHtml(step, { access = null } = {}) {
  if (!step) return '';
  const b = LABELS[FACT.STEP_BEFORE_TAX], m = LABELS[FACT.STEP_MONTH_AFTER_TAX];
  const how = access ? ' ' + esc(ACCESS_WORDS[access.method] || '') + (access.chosen ? '.' : ': ' + esc(accessAssumedWords(access.method)) + ' <a href="#" data-on-click="openAccessMethod()">Change it</a>.') : '';
  return '<strong>First step: ' + b.label.toLowerCase() + ' ' + markFact('income.step.0.beforeTax', money(step.beforeTax)) + ' ' + b.basis + ', '
    + m.label.toLowerCase() + ' ' + markFact('income.step.0.monthAfterTax', money(step.monthAfterTax)) + ' ' + m.basis + '</strong>, on your plan\'s tax bands.' + how + ' ';
}
