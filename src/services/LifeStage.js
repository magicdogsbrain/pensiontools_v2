/**
 * Life stage — where this plan's owner is, derived from what the plan already knows. Never asked.
 *
 * Two axes: commitment (draft / locked) and time (before the plan start / after it), with "already
 * retired" from the Timing block splitting "before the start" into saving and the bridge. Each stage
 * says which tools lead, which are read-only, which are hidden, what the next-step banner says, and
 * what moves the person on. The stage is recomputed on every load; only the journey (stage changes
 * with dates) is persisted, so a corrected age or start year can never strand anyone.
 *
 * Pure: no DOM, no storage.
 */
import { deriveTiming, taxYearLabel, taxYearStartOf, monthsUntilStart, monthsUntilMonth } from './PlanTiming.js';
import { saverReading, saverPrices, savingPathVersion, pathStart, pathCountsIsa, v3PensionLineAt, figureOrNull, monthOf, monthWords, OLD_PATH_CPI } from './SaverReading.js';

export const APPROACHING_YEARS = 5;   // how far out "approaching retirement" starts (Chris, 10 Sep 2026)

export const STAGES = Object.freeze({
  saving: {
    key: 'saving', label: 'Saving', chip: 'saving',
    leads: ['budget', 'accumulation'], readOnly: [], hidden: [],
    banner: { text: 'You are saving. Set the income you will want (Budget), then check you are on course for it (Accumulation planner). The Stress tester can price the plan on the pots you will have at retirement.', btn: 'Open the Accumulation planner', tab: 'accumulation' }
  },
  approaching: {
    key: 'approaching', label: 'Approaching retirement', chip: 'approaching',
    leads: ['stress', 'strategies', 'accumulation'], readOnly: [], hidden: [],
    banner: { text: 'Within five years of your plan start. Pick the strategy you will retire on and stress-test it — then lock the plan and start moving your holdings into it.', btn: 'Open the Stress tester', tab: 'stress' }
  },
  'committed-saving': {
    key: 'committed-saving', label: 'Committed, still saving', chip: 'to go',
    leads: ['accumulation'], readOnly: ['stress', 'strategies'], hidden: [],
    banner: { text: 'Your plan is locked and starts in {start}. Keep saving and buying the target portfolio; the Decision tool opens when the plan starts.', btn: 'Open the plan document', tab: 'decision', sub: 'plandoc' }
  },
  bridge: {
    key: 'bridge', label: 'Retired — run-up to the plan\'s first tax year', chip: 'run-up',
    leads: ['decision'], readOnly: ['stress', 'strategies'], hidden: ['accumulation'],
    banner: { text: 'Retired, drawing from your SIPP cash until the plan\'s first tax year, {start}. Record each month in the Decision tool; the ladder\'s rungs and the plan\'s tracks begin in {start}.', btn: 'Open the Decision tool', tab: 'decision' }
  },
  running: {
    key: 'running', label: 'Running the plan', chip: 'running',
    leads: ['decision'], readOnly: ['stress', 'strategies'], hidden: ['accumulation'],
    banner: null   // the where-am-I strip is the banner
  },
  'draft-retired': {
    key: 'draft-retired', label: 'Retired, designing the plan', chip: 'retired',
    leads: ['stress', 'strategies'], readOnly: [], hidden: ['accumulation'],
    banner: { text: 'You are retired and the plan is still a draft. Stress-test it, then lock it from the Stress tester\'s Settings page to write the plan document and start recording months.', btn: 'Open the Stress tester', tab: 'stress' }
  },
  unknown: {
    key: 'unknown', label: 'Getting started', chip: '',
    leads: ['budget'], readOnly: [], hidden: [],
    banner: null   // the onboarding chain (budget → target → stress → decision) speaks here
  }
});

/**
 * @param {object} scenario  { stressTool: { settings }, decisionTool: { settings, history, taxYears }, planDocument }
 * @returns {{ key, label, chip, leads, readOnly, hidden, banner, locked, retired, timingMode, firstTaxYear,
 *   startLabel, yearsToStart, monthsToStart, beforeStart, hasRecords, hasDocument, reasons: string[] }}
 */
export function deriveStage(scenario, now = new Date()) {
  const s = scenario || {};
  const stress = s.stressTool?.settings || {};
  const ds = s.decisionTool?.settings || {};
  const locked = !!ds.locked;
  const history = Array.isArray(s.decisionTool?.history) ? s.decisionTool.history : [];
  const taxYears = s.decisionTool?.taxYears || {};
  const hasRecords = history.length > 0 || Object.values(taxYears).some((t) => t && t.yearSetupComplete);
  const hasDocument = !!s.planDocument;
  const t = deriveTiming(stress, now);
  const thisTY = taxYearStartOf(now);
  // A future retiree is "before the start" until the retirement MONTH (their birthday), not just until the
  // plan's tax year begins — they may still be working in April of plan year 0 (6.10.3).
  const nowKey = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  const beforeStart = t.mode === 'future' && t.startMonth ? nowKey < t.startMonth : t.firstTaxYear > thisTY;
  const monthsToStart = t.mode === 'future' && t.startMonth ? monthsUntilMonth(t.startMonth, now) : monthsUntilStart(t.firstTaxYear, now);
  const reasons = [];
  let key;
  if (t.mode === 'legacy') {
    // No age today: the app cannot place them, and the implicit "next April" start means nothing here.
    // A locked legacy plan has records — it is running; a draft is simply getting started.
    key = locked ? 'running' : 'unknown';
    reasons.push('no age today in the Timing block');
  } else if (t.mode === 'future') {
    if (locked) key = beforeStart ? 'committed-saving' : 'running';
    else key = t.yearsToStart > APPROACHING_YEARS ? 'saving' : 'approaching';
    reasons.push('retiring at ' + t.retireAge + ' (' + taxYearLabel(t.firstTaxYear) + ')');
  } else {
    if (locked) key = beforeStart ? 'bridge' : 'running';
    else key = 'draft-retired';
    reasons.push('already retired; plan starts ' + taxYearLabel(t.firstTaxYear));
  }
  if (locked) reasons.push('plan locked' + (hasDocument ? ' with a plan document' : ''));
  const def = STAGES[key];
  // The transition tool (6.8.0) LEADS from Approaching to the plan start (and for a retiree still designing —
  // a reconcile of what is already held). It is never hidden (6.13.0): it is the home of the holdings record
  // ("What you hold"), which a saver records long before there is anything to transition, and a plan that is
  // Running still needs reconciling now and then (6.10.4) — so Saving and Getting started show it without leading with it.
  const leads = def.leads.slice(), hidden = def.hidden.slice();
  if (['approaching', 'committed-saving', 'bridge', 'draft-retired'].includes(key)) leads.push('transition');
  const startLabel = taxYearLabel(t.firstTaxYear);
  const banner = def.banner ? { ...def.banner, text: def.banner.text.replace(/\{start\}/g, startLabel) } : null;
  return {
    key, label: def.label, chip: chipText(def, monthsToStart, beforeStart),
    leads, readOnly: def.readOnly.slice(), hidden, banner,
    locked, retired: t.mode === 'retired', timingMode: t.mode, firstTaxYear: t.firstTaxYear, startLabel, startMonth: t.startMonth || null,
    yearsToStart: t.yearsToStart, monthsToStart, beforeStart, hasRecords, hasDocument, reasons
  };
}

function chipText(def, monthsToStart, beforeStart) {
  if (def.key === 'committed-saving' || def.key === 'bridge') {
    if (!beforeStart || monthsToStart <= 0) return def.chip;
    return monthsToStart >= 24 ? Math.round(monthsToStart / 12) + ' years to go' : monthsToStart + ' month' + (monthsToStart === 1 ? '' : 's') + ' to go';
  }
  return def.chip;
}

/** Decision-tool gate: may a month be entered? Bridge months only exist for someone retired. */
export function decisionEntryAllowed(stage, entryMonth) {
  if (!stage) return { ok: true };
  if (stage.key === 'committed-saving') {
    const key = String(entryMonth || '').slice(0, 7);
    const gate = stage.startMonth || (stage.firstTaxYear + '-04');
    if (!/^\d{4}-\d{2}$/.test(key) || key < gate) {
      const [y, m] = gate.split('-').map(Number);
      const mon = MONTHS[m - 1];
      return { ok: false, reason: 'This plan is locked and you retire in ' + mon + ' ' + y + ' (plan year 0 is ' + stage.startLabel + '). Monthly entries open then — until then you are still saving, so record your pot on the Accumulation planner instead.' };
    }
  }
  return { ok: true };
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * Before a Decision month locks a SAVER's plan (6.20.2). Recording a month, or setting up its tax year, locks the plan
 * (PlanLock.lockPlanIfNeeded). For someone still saving that is rarely meant: the lock writes no saving path, freezes
 * the plan, and the Decision tool then takes no more months until they stop (decisionEntryAllowed). So a plan in future
 * mode, before the month it stops and not locked yet, asks first. Everyone else keeps today's behaviour: null.
 * @returns {{ title: string, paragraphs: string[], okLabel: string, cancelLabel: string }|null}
 */
export function decisionLockQuestion(stage) {
  if (!stage || stage.locked || stage.timingMode !== 'future' || !stage.beforeStart) return null;
  const m = /^(\d{4})-(\d{2})$/.exec(String(stage.startMonth || ''));
  const when = m ? MONTHS[+m[2] - 1] + ' ' + m[1] : 'you retire (' + stage.startLabel + ')';
  return {
    title: 'Lock this plan?',
    paragraphs: [
      'Your plan says you are still saving until ' + when + '. Recording a month in the Decision tool locks the plan.',
      'Locking freezes the plan: its Stress tester and Decision tool settings cannot be changed until you unlock it, and the Decision tool takes no more months until you stop saving.',
      'While you are saving, record your pot each month on the Accumulation tab instead. That does not lock anything.',
      'To lock the plan on purpose, use Stress tester → Settings → "Lock plan & create the plan document". It also writes the plan document, which follows your saving month by month.'
    ],
    okLabel: 'Lock the plan and carry on',
    cancelLabel: 'Not now'
  };
}

/**
 * Arrival check: the first month after a locked-while-saving plan starts brings the real pots. Compare them with what the
 * locked plan expected at the stop — with the SAME measure as the monthly reading (6.22.0, services/SaverReading.js):
 *  - a version-3 path (locks from 6.22.0): pension + ISA (when the path counts one) against the path's middle line at the
 *    stop, both in pounds of the day. With no ISA figure above £0 in the entry — a blank box, or the Decision box left at
 *    £0, which there means "use the tax year's ISA set-up" — the pension against the path's own pension line, and the
 *    words say the ISA is left out (review of 6.22.0: a blank box was read as £0, so a saver on course was offered to
 *    unlock and re-plan);
 *  - an older path: the pension, put into the path's prices (2.5% a year, as the path was drawn), against the path's own
 *    line at the stop (its "your mix" line when it has one, else the middle line);
 *  - no path (locked with no pot on record, or before 6.7.0): the pension at retirement the plan was priced on, the pot
 *    put into the prices of the day the document was written in the same way.
 * Until 6.22.0 it set the pot in the pounds of the day against a figure in the prices of the lock, pension only, so a
 * saver exactly on course after years of rising prices was told to unlock and re-plan.
 * @param {{ sipp: number, isa?: number|string|null }} potsEntered   the first Decision entry's pension (equity + bond + cash)
 *   and its ISA box as it stands (blank or null: no figure)
 * @param {{ tolerance?: number, now?: Date, at?: string|Date }} [opts]   `at`: the entry's month ('YYYY-MM'); default this month (`now`)
 * @returns {null | { expected, actual, compared, ratio, within, measure: 'path-v3'|'path-v3-pension'|'path-v2'|'priced', message }}
 */
export function arrivalCheck(stage, planDocument, potsEntered, { tolerance = 0.10, now = new Date(), at = now } = {}) {
  if (!stage || !planDocument || stage.timingMode !== 'future' || stage.beforeStart) return null;
  const doc = planDocument;
  const sipp = +(potsEntered?.sipp || 0);
  const isaFig = figureOrNull(potsEntered ? potsEntered.isa : null);
  const isaIn = isaFig == null ? 0 : isaFig;
  const version = savingPathVersion(doc);
  const pathOk = version != null && Array.isArray(doc.accumulation.path) && doc.accumulation.path.length > 0;
  const pctOff = (r) => (r > 1 ? '+' : '') + Math.round((r - 1) * 100) + '%';
  const within = (r) => Math.abs(r - 1) <= tolerance;
  const tail = (r) => (within(r) ? ' — within ' + Math.round(tolerance * 100) + '%. The locked plan runs as it is.'
    : ' (' + pctOff(r) + '). Run the locked plan on what you have, or unlock and re-plan — the plan document is kept as version one either way.');
  // A reading at the stop: the entry's month, but never read past the path's end (clamped to it).
  if (pathOk) {
    if (version === 3 && pathCountsIsa(doc) && !(isaIn > 0)) {
      const line = v3PensionLineAt(doc, at);
      if (!(line > 0)) return null;
      const ratio = sipp / line;
      return { expected: Math.round(line), actual: Math.round(sipp), compared: Math.round(sipp), ratio, within: within(ratio), measure: 'path-v3-pension',
        message: 'Your pension pot is ' + gbp(sipp) + ' against ' + gbp(line) + ' the locked path expects in your pension at the stop (its middle line, in pounds of the day). No ISA figure was entered with this month, so your ISA is left out' + tail(ratio) };
    }
    const r = saverReading(doc, { at, pension: sipp, isa: isaIn });
    if (!r || !(r.expected > 0) || r.compared == null) return null;
    const ratio = r.compared / r.expected;
    if (version === 3) {
      const what = r.isaCounted ? 'Your pension and ISA come to ' : 'Your pension pot is ';
      return { expected: r.expected, actual: r.actual, compared: r.compared, ratio, within: within(ratio), measure: 'path-v3',
        message: what + gbp(r.actual) + ' against ' + gbp(r.expected) + ' the locked path expects at the stop (its middle line, in pounds of the day)' + tail(ratio) };
    }
    return { expected: r.expected, actual: r.actual, compared: r.compared, ratio, within: within(ratio), measure: 'path-v2',
      message: 'Your pension pot is ' + gbp(r.actual) + pricesWords(doc, r.compared, r.prices.factor, 'the locked path was drawn') + ', against ' + gbp(r.expected) + ' the locked path expects at the stop' + tail(ratio) };
  }
  const par = doc.pots?.potAtRetirement;
  const expected = +(par?.sipp || 0) > 0 ? +par.sipp : +(doc.pots?.sipp || 0);
  if (!(expected > 0)) return null;
  const pr = saverPrices({ createdAt: doc.createdAt, lockedAt: doc.lockedAt }, monthOf(at) || at);
  const compared = sipp / pr.factor;
  const ratio = compared / expected;
  return { expected, actual: sipp, compared: Math.round(compared), ratio, within: within(ratio), measure: 'priced',
    message: 'Your pot is ' + gbp(sipp) + pricesWords({ createdAt: doc.createdAt, lockedAt: doc.lockedAt }, compared, pr.factor, 'the plan document was written') + ', against ' + gbp(expected) + ' the plan was priced on' + tail(ratio) };
}

/** ", which is £Y in the prices of July 2026, when the locked path was drawn (prices assumed to rise 2.5% a year, as the path does)" */
function pricesWords(doc, compared, factor, when) {
  const start = pathStart(doc).at;
  if (!start || !(Math.abs(factor - 1) >= 0.0005)) return '';
  return ', which is ' + gbp(compared) + ' in the prices of ' + monthWords(start) + ', when ' + when + ' (prices assumed to rise ' + (OLD_PATH_CPI * 100).toFixed(1) + '% a year, as the path does)';
}

const gbp = (v) => '£' + Math.round(+v || 0).toLocaleString('en-GB');

/** Append a stage change to the journey (pure; returns the same array when nothing changed). */
export function journeyAppend(journey, stage, now = new Date(), note = null) {
  const list = Array.isArray(journey) ? journey : [];
  const last = list[list.length - 1];
  if (last && last.stage === stage.key) return list;
  return [...list, { stage: stage.key, label: stage.label, at: now.toISOString(), ...(note ? { note } : {}) }].slice(-40);
}
