/**
 * How the ISA and savings grow, on today's planner's screens (6.22.0; research/saver-lock-and-savings-growth.md §3.5).
 * Pure: settings in, words and field state out — index.html paints them.
 *
 * The owner's decision (2 Oct 2026): every ISA grew at a fixed 3% a year, whatever prices did. Each plan now says how its
 * ISA and savings grow — "Mostly cash" (the default) or "Invested like my pension" — stored as
 * stressTool.settings.isaGrowth ('cash' | 'invested', services/IsaGrowth.js). Two other states replace the choice with a
 * line:
 *  - a plan locked before the choice existed has no setting and keeps the fixed 3% (every engine reads a missing value
 *    so) until it is unlocked — ISA_GROWTH_LOCKED_TEXT;
 *  - a plan whose list of funds to test holds ISA-wrapped funds runs its ISA at those funds (config.isaMix) whatever the
 *    choice says — ISA_GROWTH_FUNDS_TEXT.
 */
import { ISA_GROWTH, ISA_GROWTH_VALUES, DEFAULT_ISA_GROWTH, isIsaGrowth, isaGrowthOf, cashProjectionRate } from '../services/IsaGrowth.js';
import { isaFundsDecide } from '../services/IsaFunds.js';
import { isaAtRetirementOf, isaTodayOrAtRetirement } from '../services/PotsAtRetirement.js';
import { chargesUnlockNoteHtml } from './chargesSetting.js';
import { INFLATION_DEFAULTS } from '../constants.js';

export { isaGrowthOf, DEFAULT_ISA_GROWTH };

export const ISA_GROWTH_LABEL = 'How your ISA and savings grow';

/** The two choices, in the order shown ("Mostly cash" first: the default). */
export const ISA_GROWTH_CHOICES = Object.freeze([
  { value: ISA_GROWTH.CASH, label: 'Mostly cash', help: 'like cash: by last year\'s rise in prices, less 1% a year, never below nothing. For cash ISAs, savings accounts and money-market funds.' },
  { value: ISA_GROWTH.INVESTED, label: 'Invested like my pension', help: 'the same mix of shares, bonds and cash as your pension, in the same futures. For a stocks and shares ISA held like your pension.' }
]);

export const ISA_GROWTH_HINT = 'Used by Pots & Valves and Buckets in order. The other strategies spend the ISA as part of their own pot.';

export const ISA_GROWTH_HELP = 'How the money in your ISA and other savings grows in every run. "Mostly cash" grows it like the cash in your '
  + 'pension: by last year\'s rise in prices, less 1% a year, never below nothing. "Invested like my pension" grows it with your '
  + 'pension\'s shares, bonds and cash, in the same futures (your diversifiers and reserve are not part of it). The plan\'s fund '
  + 'and platform charge comes off either way. Pots & Valves and Buckets in order use it; the other strategies spend the ISA as '
  + 'part of their own pot.';

export const ISA_GROWTH_LOCKED_TEXT = 'A fixed 3% a year (this plan was locked before this choice was added; unlock to change)';
export const ISA_GROWTH_FUNDS_TEXT = 'Follows the ISA funds in your list of funds to test';

/** Whether the ISA funds in the plan's list of funds to test decide how its ISA grows (services/IsaFunds.js; kept here by name). */
export { isaFundsDecide };

/**
 * What the Settings field shows.
 *  - the ISA funds in the fund list decide: their line, not the choice;
 *  - a locked plan with no setting: the fixed-3% line (it runs at 3% until it is unlocked);
 *  - otherwise the two choices, holding the plan's own (or "Mostly cash" when it has none).
 * The lock freezes the choice itself (setStressSettingsEnabled); this only decides choice or line.
 * @returns {{ mode: 'choice'|'isa-funds'|'locked-before-choice', value: 'cash'|'invested', text: string }}
 */
export function isaGrowthFieldState(settings, { locked = false } = {}) {
  const value = isaGrowthOf(settings) || DEFAULT_ISA_GROWTH;
  if (isaFundsDecide(settings)) return { mode: 'isa-funds', value, text: ISA_GROWTH_FUNDS_TEXT };
  if (locked && !isaGrowthOf(settings)) return { mode: 'locked-before-choice', value, text: ISA_GROWTH_LOCKED_TEXT };
  return { mode: 'choice', value, text: '' };
}

/** The choice to save: the one ticked, else the plan's own, else "Mostly cash". */
export function isaGrowthForSave(choice, current) {
  return isIsaGrowth(choice) ? choice : (isaGrowthOf(current) || DEFAULT_ISA_GROWTH);
}

/** The ticked choice on the Settings page (radio name "ssIsaGrowth"), or null. */
export function readIsaGrowthChoice(doc) {
  const el = doc && doc.querySelector('input[name="ssIsaGrowth"]:checked');
  return el && isIsaGrowth(el.value) ? el.value : null;
}

/**
 * Paint the choice (#ssIsaGrowthChoices with radios named ssIsaGrowth) or the line in its place (#ssIsaGrowthLocked).
 * Does nothing when the page has no field.
 */
export function paintIsaGrowthField(doc, state) {
  const box = doc && doc.getElementById('ssIsaGrowthChoices'), line = doc && doc.getElementById('ssIsaGrowthLocked');
  if (!box || !line || !state) return;
  const words = state.mode !== 'choice';
  for (const r of doc.querySelectorAll('input[name="ssIsaGrowth"]')) r.checked = r.value === state.value;
  box.style.display = words ? 'none' : '';
  line.textContent = words ? state.text : '';
  line.style.display = words ? '' : 'none';
}

/**
 * The sentence the lines above Monte Carlo, History and Scenarios gain, for a plan with an ISA.
 *  - the ISA funds decide: say so; a choice: what it is;
 *  - no setting on a plan known to be locked: the fixed 3%, and why;
 *  - no setting otherwise, or no ISA: nothing (the line is as it always was).
 */
export function isaGrowthRunLine(settings, { locked = null } = {}) {
  const s = settings || {};
  if (!((+s.isaBalance || 0) > 0) && !(isaAtRetirementOf(s) > 0)) return '';   // no ISA today and none at retirement
  if (isaFundsDecide(s)) return 'Your ISA grows as the ISA funds in your list of funds to test.';
  const kind = isaGrowthOf(s);
  if (kind === ISA_GROWTH.CASH) return 'Your ISA grows like cash: by last year\'s rise in prices, less 1% a year (change it in <strong>Settings</strong>).';
  if (kind === ISA_GROWTH.INVESTED) return 'Your ISA is invested like your pension: the same mix, in the same futures (change it in <strong>Settings</strong>).';
  return locked === true ? 'Your ISA grows at a fixed 3% a year: this plan was locked before the choice of how it grows was added.' : '';
}

/**
 * Stress tester → Drawdown: the sentence its fixed table gains about the ISA left (research/saver-lock-and-savings-growth.md
 * §2c). That table is one projection at the assumed rise in prices (DrawdownService), so its ISA always grows by the cash
 * rule there, max(0, inflation − 1%). Where the runs grow it otherwise ("Invested like my pension", the ISA funds in the
 * fund list, or a plan locked before the choice at a fixed 3%), it says so, so the table does not read as a second answer.
 * Nothing for a plan with no ISA, or with no setting when the lock is not known.
 * @param {object} settings  the plan's Stress settings
 * @param {{ inflation?: number, locked?: boolean|null }} o  the table's own rise in prices; whether the plan is locked
 */
export function drawdownIsaNoteHtml(settings, { inflation = INFLATION_DEFAULTS.ASSUMED_CPI, locked = null } = {}) {
  const s = settings || {};
  if (!(+isaTodayOrAtRetirement(s) > 0)) return '';
  const rate = (cashProjectionRate(Number.isFinite(+inflation) ? +inflation : INFLATION_DEFAULTS.ASSUMED_CPI) * 100).toFixed(1) + '% a year';
  const here = 'The ISA left grows like cash here (your assumed rise in prices less 1%, ' + rate + ')';
  if (isaFundsDecide(s)) return here + '. The 1,000 futures and the history grow it as the ISA funds in your list of funds to test.';
  const kind = isaGrowthOf(s);
  if (kind === ISA_GROWTH.CASH) return 'The ISA left grows like cash here: your assumed rise in prices less 1%, ' + rate + ', never below nothing, the same rule the 1,000 futures and the history use.';
  if (kind === ISA_GROWTH.INVESTED) return here + ': this one fixed table has no futures for your pension\'s mix to follow. The 1,000 futures and the history grow it invested like your pension, as you chose.';
  return locked === true ? here + '. The 1,000 futures and the history grow this plan\'s ISA at a fixed 3% a year: it was locked before the choice of how it grows was added.' : '';
}

/** The bullet the unlock confirmation gains on a plan locked before the choice: unlocked, it grows like cash. */
export function isaGrowthUnlockNoteHtml() {
  return '<li><strong>How your ISA grows:</strong> this plan was locked before this choice was added, so its ISA has grown at a fixed 3% a year. '
    + 'Once it is unlocked it grows like cash ("Mostly cash": by last year\'s rise in prices, less 1% a year), so its figures can move either way. '
    + 'Change it in Stress tester → Settings.</li>';
}

/** Every bullet the unlock confirmation gains from ScenarioRepository.unlockPatchesOf's patch (charges, then the ISA). */
export function unlockNotesHtml(patch) {
  if (!patch) return [];
  const out = [];
  if (patch.chargesPct != null) out.push(chargesUnlockNoteHtml(patch.chargesPct));
  if (patch.isaGrowth != null) out.push(isaGrowthUnlockNoteHtml());
  return out;
}

/** Strategies → Background → Assumptions & data: the ISA row, [name, value, note] (the page is not one plan's). */
export function isaAssumptionsRow() {
  return ['ISA',
    'Your plan\'s setting in Stress tester → Settings: "Mostly cash" (the default) grows like the cash in your pension — last year\'s rise in prices less 1% a year, never below nothing; "Invested like my pension" follows your pension\'s shares, bonds and cash in the same futures. Before charges. Drawn per the ISA policy (bridge / longevity / <em>hold</em>)',
    '<em>Hold</em> keeps the ISA out of every strategy\'s funding; it is never sold to buy rungs. The plan\'s fund and platform charge comes off it every month. An ISA made of ISA funds in your list of funds to test follows those funds. A plan locked before the choice was added keeps a fixed 3% a year until it is unlocked.'];
}

/** The plan document's line (assumptions.isaGrowth, recorded at lock). A document without the key grew at a fixed 3%. */
export function isaGrowthAssumptionText(A) {
  if (A && A.isaFromFunds) return 'as the ISA funds in the list of funds to test';
  const kind = A ? A.isaGrowth : undefined;
  if (kind === ISA_GROWTH.CASH) return 'mostly cash: by last year\'s rise in prices, less 1% a year, never below nothing';
  if (kind === ISA_GROWTH.INVESTED) return 'invested like the pension: its shares, bonds and cash, in the same futures';
  if (A && 'isaGrowth' in A) return 'a fixed 3% a year';
  return 'grew at a fixed 3% a year (this plan was locked before the choice was added)';
}

/**
 * The Accumulation planner's ISA line: how it grows here, in words, for the note under the table. `kind` null: a plan
 * without the choice (projected as the Timing block does for it: the middle rate, nothing paid in); 'funds': the ISA funds
 * in the list of funds to test decide in the runs, and the line here is the middle rate (PlanTiming.isaProjectionOf).
 */
export function accumulationIsaNote(kind, isaMonthly = 0) {
  const pay = isaMonthly > 0 ? ' with £' + Math.round(isaMonthly).toLocaleString('en-GB') + ' a month going in' : ' with nothing going in';
  if (kind === ISA_GROWTH.CASH) return 'ISA and savings: mostly cash, ' + (cashProjectionRate(INFLATION_DEFAULTS.ASSUMED_CPI) * 100).toFixed(1) + '% a year at 2.5% price rises' + pay + '.';
  if (kind === ISA_GROWTH.INVESTED) return 'ISA and savings: invested like your pension, at the middle rate' + pay + '.';
  if (kind === 'funds') return 'ISA and savings: at the middle rate' + pay + '. The runs grow it as the ISA funds in your list of funds to test.';
  return 'ISA and savings: at the middle rate with nothing going in (this plan was locked before the choice of how the ISA grows was added).';
}

export { ISA_GROWTH_VALUES };
