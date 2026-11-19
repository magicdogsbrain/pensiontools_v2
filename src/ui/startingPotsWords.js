/**
 * What the Stress tester says about the pots a run starts from — the two lines that disagreed with what the engine
 * runs on (review of "save this as a plan", 1 Oct 2026). Pure: settings in, HTML out (figures only, no user text).
 *
 *   startSummaryHtml(settings, { fromAnswer, locked, atStop })
 *                                                the line above Monte Carlo, History and Scenarios. Retiring later, the
 *                                                runs start from the pots AT RETIREMENT (today's pots scaled to the pot at
 *                                                the stop — potScaleOf, as createSimulationConfigFromSettings does), said
 *                                                from the reading's pot at the stop (`atStop`, src/reading/atStop.js) and
 *                                                its pension today, marked (step F1); nothing until it is in. On a plan
 *                                                made from a V7 answer it also gives the quick answer's own figure.
 *                                                It ends with the fund and platform charge the runs take (6.19.0)
 *                                                and, for a plan with an ISA, how the ISA grows (6.22.0).
 *   potsAtRetirementLine(p)                      the Timing block's line, from the reading's pot at the stop
 *                                                (src/reading/atStop.js potAtStop: the middle with its bad and good cases
 *                                                from the same lives, or the pots a locked plan was locked with).
 */
import { spAssumedWords, SP_CHANGE_IT } from '../reading/statePension.js';
import { potScaleOf, isaAtRetirementOf } from '../services/PotsAtRetirement.js';
import { earlyPensionDrawOf, earlyPensionDrawWords } from '../services/PlanTiming.js';
import { closedYearsWords } from '../services/PensionLock.js';
import { pensionLockForSettings } from '../strategies/stressTest.js';
import { answerLastedWords } from '../services/PlanSeed.js';
import { chargesRunLine, hasStoredCharges, formatChargesPct } from './chargesSetting.js';
import { chargesPctOf } from '../services/Charges.js';
import { isaGrowthRunLine } from './isaGrowthSetting.js';
import { markFact } from '../reading/mark.js';
import { money, moneyK } from '../reading/format.js';
import { dayWords } from '../answers/plan/dates.js';

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

/** The two strategies that buy a gilt ladder with the whole pot (stressTest.js fullGiltTest, rotationTest). */
const GILT_LADDER_IDS = new Set(['full-il-gilt', 'gilt-rotation']);
const LADDER_NAMES = { 'full-il-gilt': 'full index-linked gilt ladder', 'gilt-rotation': 'gilt ladder + rotation' };

/**
 * The pots a gilt-ladder strategy is bought from, as stressTest.js planFromSettings sizes them (found 18 Oct
 * 2026: a ladder + rotation plan was told its runs start from an equity/bond/cash split it never uses).
 *  - pension: the strategy's own pinned "Total in your SIPP" (scaled to retirement), else the total of the fund boxes;
 *  - ISA: the pinned ISA total (scaled), else the ISA the runs start from; left out when the ISA is held back
 *    (availablePot: a held ISA never funds rungs).
 */
export function ladderPotsOf(settings) {
  const s = settings || {};
  const params = s.strategyParams || {};
  const k = potScaleOf(s);
  const pinned = +params.sippTotal > 0;
  const pension = pinned ? params.sippTotal * k.sipp
    : ((+s.equityMin || 0) + (+s.bondMin || 0) + (+s.cashTarget || 0) + (+s.diversifierStart || 0)) * k.sipp;
  const isa = pinned ? ((+params.isaTotal || 0) > 0 ? params.isaTotal * k.isa : isaAtRetirementOf(s, 0)) : isaAtRetirementOf(s);
  const held = s.isaDrawdownStrategy === 'hold';
  return { pinned, pension, isa, held, used: pension + (held ? 0 : isa) };
}

function ladderLine(s, locked, atStop = null) {
  const L = ladderPotsOf(s);
  const name = LADDER_NAMES[s.strategyId];
  const from = L.pinned ? 'the pension total in this strategy\'s own settings' : 'the total of your <strong>Settings</strong> fund boxes';
  let text;
  if (startsScaled(s)) {
    // a plan still saving buys the ladder when it stops, from the pots then: the reading's pot at the stop, to £1,000 and
    // marked (step F1); nothing said until it is in. A pinned total the runs scale differently is said as it is, unmarked.
    const at = atStop && +atStop.middle > 0 ? atStop : null;
    const same = at && moneyK(L.pension) === moneyK(at.middle);
    text = !at ? `This plan's way of drawing is the ${name}: every run buys the ladder when you stop, from your pots then (the Timing block)`
      : `This plan's way of drawing is the ${name}: every run buys the ladder when you stop, from ${moneyK(L.used)} — your pension, ${same ? markFact('pot.atStop', moneyK(at.middle)) : moneyK(L.pension)} in the middling case`;
    if (at && L.isa > 0) text += L.held ? `. Your ISA (${moneyK(L.isa)}) is held back and never buys rungs` : `, and your ISA, ${moneyK(L.isa)}`;
    if (at && at.source === 'worked' && at.from) text += `. Worked out from your pension today (${markFact('pot.today', money(at.from.pot))}) and ${money(at.from.monthly)} a month going in`;
  } else {
    text = `This plan's way of drawing is the ${name}: every run buys the ladder from ${fmt(L.used)} — your pension, ${fmt(L.pension)} (${from})`;
    if (L.isa > 0) text += L.held ? `. Your ISA (${fmt(L.isa)}) is held back and never buys rungs` : `, and your ISA, ${fmt(L.isa)}`;
  }
  // The money left over (strategyParams.spareGrowth, 6.35.0; on the rotation it fills a cut year: in shares from 6.36.0, kept from 6.37.0).
  const grown = !!(s.strategyParams && s.strategyParams.spareGrowth), rot = s.strategyId === 'gilt-rotation';
  text += '. The split into shares, bonds and cash in Settings does not apply to the gilts. Money left over after buying the ladder is '
    + (grown ? 'invested in shares (your <strong>Money left over</strong> setting), so what you would have left rides the market' + (rot ? '; it pays a rotated year the sleeve cannot, before that year counts as cut.' : '.') : 'counted at its value today, not grown' + (rot ? '; it pays a rotated year the sleeve cannot, before that year counts as cut.' : '.'));
  if (hasStoredCharges(s)) {
    const pct = chargesPctOf(s);
    const off = ['the cash years', ...(grown ? ['the money left over in shares'] : []), ...(rot ? ['after a rotation, the share fund'] : [])];
    text += pct > 0 ? ` Fund and platform charges of ${formatChargesPct(pct)}% a year come off ${off.length > 1 ? off.slice(0, -1).join(', ') + ' and' + (rot ? ', ' : ' ') + off[off.length - 1] : off[0]}; not off the gilts.` : ' No fund or platform charges are taken off (0% in <strong>Settings</strong>).';
  } else if (locked === true) {
    text += ' No fund or platform charges are taken off: this plan was locked before charges were added.';
  }
  return text;
}

export function startSummaryHtml(settings, { fromAnswer = null, locked = null, atStop = null, sp = null } = {}) {
  const s = settings || {};
  // (step F2, lead4.md D2) an assumed State Pension is said in the words both views use, from the one reading of it
  // (src/reading/statePension.js `sp`): its age is the one the runs start it at, never a fixed one
  const spWords = spAssumedWords(sp);
  const spNote = spWords ? ` <span style="color:var(--warning, #f59e0b);">${spWords} ${SP_CHANGE_IT} (in Settings)</span>` : '';
  if (GILT_LADDER_IDS.has(s.strategyId)) {
    const lasted = fromAnswer ? answerLastedWords(fromAnswer) : '';
    return ladderLine(s, locked, atStop) + (lasted ? ` <span class="hint">This plan was made from a quick answer, where ${lasted}. These runs are the planner's own test, so they can differ.</span>` : '') + spNote + accessNote(s);
  }
  const k = potScaleOf(s);
  let text;
  if (startsScaled(s)) {
    // (step F1, lead4.md D3/D4) the pot at the stop and the pension today are the reading's (src/reading/atStop.js potAtStop),
    // to the formatter's rounding and marked, as the Timing line says them — never a sum of the pots of its own. Until the
    // reading is in, no figure is said.
    const at = atStop && +atStop.middle > 0 ? atStop : null;
    const age = at && Number.isFinite(+at.age) && +at.age > 0 ? +at.age : (+s.shapeAgeNow || s.retireAge);
    text = `Starting balances at retirement (age ${age}), as every run uses them: `;
    if (!at) text += 'your pots when you stop, from the Timing block.';
    else if (at.source === 'locked') {
      text += `the pots your plan was locked with, split as your <strong>Settings</strong> are (pension ${markFact('pot.atStop', moneyK(at.middle))}) · ISA ${moneyK(at.isa)}.`;
    } else {
      const from = at.from || {};
      text += `your <strong>Settings</strong> split of shares, bonds${(+s.diversifierStart || 0) > 0 ? ', diversifiers' : ''} and cash, grown to the middling case (pension ${markFact('pot.atStop', moneyK(at.middle))}) · ISA ${moneyK(at.isa)}. `
        + `Worked out from your pension today (${markFact('pot.today', money(from.pot))}) and ${money(from.monthly)} a month going in. Change what goes in on the Accumulation tab.`;
    }
  } else {
    const div = (+s.diversifierStart || 0) > 0 ? ` · Diversifiers ${fmt(s.diversifierStart * k.sipp)}` : '';
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
  // (7.12.0) a plan still saving: "Will it last?" leads with the saving chance worked out now (one chance per plan), so the
  // answer's figure from the day it was kept is not said beside it as a third
  const lasted = fromAnswer && s.retired !== false ? answerLastedWords(fromAnswer) : '';
  if (lasted) {
    text += ` <span class="hint">This plan was made from a quick answer, where ${lasted}. ${fromAnswer.stop && fromAnswer.stop.kind === 'later'
      ? 'These runs start from the middling pot at retirement and do not vary the years before it, so they can differ.'
      : 'These runs are the planner\'s own test, so they can differ.'}</span>`;
  }
  return text + spNote + accessNote(s);
}

/**
 * A plan that starts before its pension can usually be taken (7.4.0, PlanTiming.earlyPensionDrawOf): from 7.4.1 the runs hold
 * the pension back until then and pay those years from the other savings, so the summary every run starts from says what
 * the plan does — or, when those savings cannot pay the years in full, by about how much they run short and when
 * (PensionLock.closedYearsWords, on the run's own closed years). '' otherwise.
 */
function accessNote(s) {
  const now = new Date();
  let e = null; try { e = earlyPensionDrawOf(s, now); } catch { e = null; }
  let lock = null; try { lock = pensionLockForSettings(s, now); } catch { lock = null; }
  if (lock) return ' <span class="hint" data-note="pension-access">' + closedYearsWords(lock) + '</span>';
  return e ? ' <span class="hint" data-note="pension-access">' + earlyPensionDrawWords(e) + '</span>' : '';
}

export function potsAtRetirementLine(p) {
  if (!p) return '';
  // (step F1, lead4.md D4) the one model, the reading's (src/reading/atStop.js), never the boxes of the form: a locked plan's
  // pots are the ones it was locked with, said as that, with the day
  if (p.source === 'locked') {
    return 'Your plan was locked with <strong>' + markFact('pot.atStop', moneyK(p.middle)) + '</strong> in your pension and <strong>' + moneyK(p.isa) + '</strong> in ISAs and savings when you stop work (the middling case then' + (p.lockedAt ? ', on ' + dayWords(p.lockedAt) : '') + '). Every strategy is priced on these.';
  }
  const from = p.from || {};
  return 'Pots when you stop, in today\'s money: pension <strong>' + markFact('pot.atStop', moneyK(p.middle)) + '</strong> in a middling case ('
    + markFact('pot.atStop.low', moneyK(p.low)) + ' at the low end, ' + markFact('pot.atStop.high', moneyK(p.high)) + ' at the high end) · ISAs and savings <strong>' + moneyK(p.isa) + '</strong>. '
    + 'Worked out from your pension today (' + markFact('pot.today', money(from.pot)) + ') and ' + money(from.monthly) + ' a month going in, to age ' + p.age + ', over the same futures as every test. Every strategy is priced on these; they follow what you pay in, on the Accumulation tab.';
}
