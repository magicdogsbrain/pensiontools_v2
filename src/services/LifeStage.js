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

export const APPROACHING_YEARS = 5;   // how far out "approaching retirement" starts (Chris, 10 Sep 2026)

export const STAGES = Object.freeze({
  saving: {
    key: 'saving', label: 'Saving', chip: 'saving',
    leads: ['budget', 'accumulation'], readOnly: [], hidden: [],
    banner: { text: 'You are saving. Set the income you will want (Budget), then check you are on track for it (Accumulation planner). The Stress tester can price the plan on the pots you will have at retirement.', btn: 'Open the Accumulation planner', tab: 'accumulation' }
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
    key: 'bridge', label: 'Bridge to the plan start', chip: 'bridge',
    leads: ['decision'], readOnly: ['stress', 'strategies'], hidden: ['accumulation'],
    banner: { text: 'Retired, living on the bridge cash until the plan starts in {start}. Record each month in the Decision tool; the ladder and the plan\'s tracks begin in {start}.', btn: 'Open the Decision tool', tab: 'decision' }
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
  // The transition tool (6.8.0) leads from Approaching to the plan start (and for a retiree still designing
  // — a reconcile of what is already held); it has no job while saving far out or once the plan is running.
  const leads = def.leads.slice(), hidden = def.hidden.slice();
  if (['approaching', 'committed-saving', 'bridge', 'draft-retired'].includes(key)) leads.push('transition');
  // Still shown while Running: a plan locked and started the same day has a ladder to buy, and a ladder that
  // is running still needs reconciling now and then (6.10.4). Hidden only while saving far out.
  if (['saving', 'unknown'].includes(key)) hidden.push('transition');
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
      const mon = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m - 1];
      return { ok: false, reason: 'This plan is locked and you retire in ' + mon + ' ' + y + ' (plan year 0 is ' + stage.startLabel + '). Monthly entries open then — until then you are still saving, so record your pot on the Accumulation planner instead.' };
    }
  }
  return { ok: true };
}

/**
 * Arrival check: the first month after a locked-while-saving plan starts brings the real pots. Compare
 * them with what the plan was priced on. Returns null when nothing to check.
 */
export function arrivalCheck(stage, planDocument, potsEntered, { tolerance = 0.10 } = {}) {
  if (!stage || !planDocument || stage.timingMode !== 'future' || stage.beforeStart) return null;
  const par = planDocument.pots?.potAtRetirement;
  const expected = +(par?.sipp || 0) > 0 ? +par.sipp : +(planDocument.pots?.sipp || 0);
  if (!(expected > 0)) return null;
  const actual = +(potsEntered?.sipp || 0);
  const ratio = actual / expected;
  const within = Math.abs(ratio - 1) <= tolerance;
  return { expected, actual, ratio, within, message: within
    ? 'Your pot is ' + gbp(actual) + ' against ' + gbp(expected) + ' the plan was priced on — within ' + Math.round(tolerance * 100) + '%. The locked plan runs as it is.'
    : 'Your pot is ' + gbp(actual) + ' against ' + gbp(expected) + ' the plan was priced on (' + (ratio > 1 ? '+' : '') + Math.round((ratio - 1) * 100) + '%). Run the locked plan on what you have, or unlock and re-plan — the plan document is kept as version one either way.' };
}

const gbp = (v) => '£' + Math.round(+v || 0).toLocaleString('en-GB');

/** Append a stage change to the journey (pure; returns the same array when nothing changed). */
export function journeyAppend(journey, stage, now = new Date(), note = null) {
  const list = Array.isArray(journey) ? journey : [];
  const last = list[list.length - 1];
  if (last && last.stage === stage.key) return list;
  return [...list, { stage: stage.key, label: stage.label, at: now.toISOString(), ...(note ? { note } : {}) }].slice(-40);
}
