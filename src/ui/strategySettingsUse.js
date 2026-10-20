/**
 * Which Stress settings each way of drawing uses (v6 usability audit, problem 4, 17 Oct 2026).
 *
 * Choosing any of the seven "bought" strategies (ladders, floors, rotation) hid the whole "Your allocation" section —
 * and with it six settings their engines still read: the plan's length (stressTest.planFromSettings), fund and platform
 * charges (compareRunner / GiltLadderPlan), how the ISA grows (PlanTiming.projectedIsaRows, to the day you stop), the
 * taxable account (stressTest.lumpyByYear spends it in year 0), relevant earnings and bed-and-ISA. Only the Pots &
 * Valves machinery is theirs alone: the risk level / funds list, the pot boxes (a bought strategy has its own), the
 * diversifiers sleeve, the bond tent, protection, the emergency reserve and how the pension is accessed.
 *
 * The markup marks those parts `data-pnv-only`; the shared settings sit outside them and show for every strategy. A
 * setting a way of drawing really ignores says so beside the box ("Not used by this way of drawing — …").
 *
 * DOM access goes through the `doc` argument; nothing here reads `window`.
 */
import { STRATEGY_IDS } from '../strategies/registry.js';

/** The strategies that buy their income (a ladder, a floor, a rotation): no Pots & Valves machinery. */
export const BOUGHT_STRATEGIES = Object.freeze([
  STRATEGY_IDS.LADDER_AND_RATCHET, STRATEGY_IDS.FLOOR_AND_FLEX, STRATEGY_IDS.FLOOR_THE_SCHEDULE, STRATEGY_IDS.FLOOR_TO_AGE,
  STRATEGY_IDS.FULL_IL_GILT, STRATEGY_IDS.BRIDGE_AND_ENGINE, STRATEGY_IDS.GILT_ROTATION
]);

/** True for a strategy that hides the Pots & Valves machinery. */
export const isBoughtStrategy = (id) => BOUGHT_STRATEGIES.includes(id);

/** The parts of the Stress settings form only Pots & Valves (and Buckets in order) use. */
export function pnvOnlySections(doc) {
  return doc && doc.querySelectorAll ? [...doc.querySelectorAll('[data-pnv-only]')] : [];
}

/** The settings every way of drawing shows, with the id of the note beside each. */
export const SHARED_SETTINGS = Object.freeze({
  duration: 'ssUseDuration',
  taxable: 'ssUseTaxable',
  gia: 'ssUseGia',           // relevant earnings and bed-and-ISA, one note
  isaGrowth: 'ssUseIsaGrowth',
  charges: 'ssUseCharges'
});

const NOT_USED = 'Not used by this way of drawing';

/**
 * The note beside a shared setting for a strategy: '' when the engine uses it as it says; otherwise plain words
 * beginning "Not used by this way of drawing".
 */
export function settingUseNote(strategyId, key, { isaHold = false } = {}) {
  if (!isBoughtStrategy(strategyId)) return '';
  switch (key) {
    case 'gia':
      return NOT_USED + ' — a lump sum buys the next years of income instead of being moved into the ISA or the pension, so your earnings and bed-and-ISA do not come into it.';
    case 'isaGrowth':
      return isaHold
        ? NOT_USED + ' once it is running — it leaves the held ISA out, untouched. Until the day you stop, it still sets how your ISA grows.'
        : NOT_USED + ' once it is running — it spends the ISA as part of its own pot. Until the day you stop, it still sets how your ISA grows.';
    default:
      return '';   // the plan's length, the taxable account and charges: used by every strategy
  }
}

/**
 * What happens to a held ISA under `strategyId` (sweep 20 Oct 2026): the Pots & Valves engines draw it last; a bought
 * strategy leaves it out of what it buys and never draws it (stressTest availablePot).
 */
export function heldIsaNote(strategyId) {
  return isBoughtStrategy(strategyId)
    ? 'This way of drawing leaves a held ISA out: it buys nothing with it and never draws from it.'
    : 'Money in a held ISA is only used once the SIPP and the taxable account have both run out.';
}

/** Write the notes beside the shared settings for `strategyId`. Returns the notes it wrote, by key. */
export function paintSettingUseNotes(doc, strategyId) {
  const out = {};
  const policy = doc && doc.getElementById ? doc.getElementById('ssIsaPolicy') : null;
  const opts = { isaHold: !!policy && policy.value === 'hold' };
  for (const [key, id] of Object.entries(SHARED_SETTINGS)) {
    const el = doc && doc.getElementById ? doc.getElementById(id) : null;
    const text = settingUseNote(strategyId, key, opts);
    out[key] = text;
    if (el) { el.textContent = text; el.style.display = text ? '' : 'none'; }
  }
  return out;
}
