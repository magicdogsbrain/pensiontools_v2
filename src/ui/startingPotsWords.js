/**
 * What the Stress tester says about the pots a run starts from — the two lines that disagreed with what the engine
 * runs on (review of "save this as a plan", 1 Oct 2026). Pure: settings in, HTML out (figures only, no user text).
 *
 *   startSummaryHtml(settings, { fromAnswer, locked })
 *                                                the line above Monte Carlo, History and Scenarios. Retiring later, the
 *                                                runs start from the pots AT RETIREMENT (today's pots scaled by the
 *                                                Timing block's pots at retirement — potScaleOf, as
 *                                                createSimulationConfigFromSettings does); it said today's. On a plan
 *                                                made from a V7 answer it also gives the quick answer's own figure.
 *                                                It ends with the fund and platform charge the runs take (6.19.0)
 *                                                and, for a plan with an ISA, how the ISA grows (6.22.0).
 *   potsAtRetirementLine(projection, override)    the Timing block's line. With pots at retirement typed in the boxes
 *                                                (or put there by a V7 answer) those are what every strategy is priced
 *                                                on, and the planner's own projection is for comparison; it said the
 *                                                projection was.
 */
import { potScaleOf, sippTodayOf, isaAtRetirementOf } from '../services/PotsAtRetirement.js';
import { answerLastedWords } from '../services/PlanSeed.js';
import { chargesRunLine } from './chargesSetting.js';
import { isaGrowthRunLine } from './isaGrowthSetting.js';

const fmt = (n) => '£' + Math.round(+n || 0).toLocaleString('en-GB');

/** The ISA the runs start from when there is none today but one at retirement (money going into it), else 0 (review of 6.22.0). */
function isaFromNothing(s) {
  return (+s.isaBalance || 0) > 0 ? 0 : isaAtRetirementOf(s);
}

/** True when the runs start from scaled pots (retiring later, with pots at retirement set), or from an ISA at retirement with none today. */
export function startsScaled(settings) {
  const s = settings || {};
  const k = potScaleOf(s);
  return s.retired === false && (k.sipp !== 1 || k.isa !== 1 || isaFromNothing(s) > 0);
}

export function startSummaryHtml(settings, { fromAnswer = null, locked = null } = {}) {
  const s = settings || {};
  const knowsSp = ('statePension' in s) || ('spStartDate' in s);
  const spNote = knowsSp && (!s.spStartDate || !s.spWeeklyAmount)
    ? ` <span style="color:var(--warning, #f59e0b);">State Pension not entered — assuming ${fmt(s.statePension || 0)}/yr from age 67 (plan year ${Math.max(0, 67 - (+s.shapeAgeNow || 67))}); set your real forecast in Settings.</span>`
    : '';
  const k = potScaleOf(s);
  const div = (+s.diversifierStart || 0) > 0 ? ` · Diversifiers ${fmt(s.diversifierStart * k.sipp)}` : '';
  let text;
  if (startsScaled(s)) {
    const sipp = sippTodayOf(s) * k.sipp, isa = isaAtRetirementOf(s);
    const fromNothing = isaFromNothing(s) > 0;
    text = `Starting balances at retirement (age ${+s.shapeAgeNow || s.retireAge}), as every run uses them: `
      + `Equity ${fmt(s.equityMin * k.sipp)} · Bond ${fmt(s.bondMin * k.sipp)}${div} · Cash ${fmt(s.cashTarget * k.sipp)} (pension ${fmt(sipp)}) · ISA ${fmt(isa)}. `
      + `These are your <strong>Settings</strong> pots today (pension ${fmt(sippTodayOf(s))}, ISA ${fmt(s.isaBalance)}${fromNothing ? ' today' : ''}) scaled to the pots at retirement in the Timing block`
      + `${fromNothing ? ', with the ISA at retirement taken as the Timing block gives it (there is no ISA today to scale)' : ''}. Edit them in the Settings tab.`;
  } else {
    text = 'Starting balances come from your <strong>Settings</strong> (Fund Minimums): '
      + `Equity ${fmt(s.equityMin)} · Bond ${fmt(s.bondMin)}${div} · Cash ${fmt(s.cashTarget)}. Edit them in the Settings tab.`;
  }
  // Fund and platform charges (6.19.0): what every run takes off. `locked` (when the caller knows it) lets a plan locked
  // before charges say why it has none.
  const charges = chargesRunLine(s, { locked });
  if (charges) text += ' ' + charges;
  // How the ISA grows (6.22.0): "Mostly cash", "Invested like my pension", the ISA funds, or a locked plan's fixed 3%.
  const isaLine = isaGrowthRunLine(s, { locked });
  if (isaLine) text += ' ' + isaLine;
  const lasted = fromAnswer ? answerLastedWords(fromAnswer) : '';
  if (lasted) {
    text += ` <span class="hint">This plan was made from a quick answer, where ${lasted}. ${fromAnswer.stop && fromAnswer.stop.kind === 'later'
      ? 'These runs start from the middling pot at retirement and do not vary the years before it, so they can differ.'
      : 'These runs are the planner\'s own test, so they can differ.'}</span>`;
  }
  return text + spNote;
}

export function potsAtRetirementLine(p, override = {}) {
  const proj = 'SIPP ' + fmt(p.sipp) + ' (cautious ' + fmt(p.low) + ', strong ' + fmt(p.high) + ') · ISA ' + fmt(p.isa);
  const how = p.hasContributions ? ' with your Accumulation planner contributions' : ' (growth only — no contributions saved on the Accumulation tab)';
  const o = override || {};
  if (+o.sipp > 0 || +o.isa > 0) {
    const parts = [];
    if (+o.sipp > 0) parts.push('SIPP <strong>' + fmt(o.sipp) + '</strong>');
    if (+o.isa > 0) parts.push('ISA <strong>' + fmt(o.isa) + '</strong>');
    return 'Every strategy is priced on the pots at retirement in the boxes below: ' + parts.join(' · ') + ' (today\'s money). '
      + 'For comparison, the planner\'s own projection, middle band' + how + ': ' + proj + '. '
      + 'The pots below are what the strategy is tested on — record what you hold on the Transition tab.';
  }
  return 'Pots at retirement in today\'s money, middle band' + how + ': SIPP <strong>' + fmt(p.sipp) + '</strong> (cautious ' + fmt(p.low) + ', strong ' + fmt(p.high) + ') · ISA <strong>' + fmt(p.isa) + '</strong>. '
    + 'Every strategy is priced on these; the pots below are what the strategy is tested on — record what you hold on the Transition tab.';
}
