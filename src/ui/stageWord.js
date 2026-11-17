/**
 * The stage, in the simple view's words, for the full view's plan chip (7.12.0, one stage vocabulary): Saving, Moving,
 * Living on it, Closed — the word the plan's home says, read the same way (LifeStage.stageOf on the full view's own
 * placing). The full view said "Committed, still saving" where the home said "Moving". Null when the plan is not placed.
 */
import { stageOf } from '../services/LifeStage.js';
import { HOME } from '../v7/copy/home.js';

export function stageWordOf(scenario, placing, now = new Date()) {
  if (!scenario || !placing || placing.key === 'unknown') return null;
  let st = null; try { st = stageOf(scenario, now, { placing }); } catch { st = null; }
  return st && st.key && HOME.stages[st.key] ? HOME.stages[st.key] : null;
}
