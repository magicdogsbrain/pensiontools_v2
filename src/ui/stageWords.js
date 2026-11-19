/**
 * The stage, said by the full view (lead4.md D5, R7; step F1): ONE helper for every place the full view names where the plan
 * is — the chip beside the plan button and the card that says what "draft" and "locked" mean. Both say the reading's three
 * words (src/reading/timing.js stage: Saving / Moving / Living on it, or Closed) and, for a locked saver, the reading's time
 * to go (src/reading/timing.js yearsToGo, in the one formatter's words). The placing's own label (LifeStage STAGES[k].label,
 * "Committed, still saving" and the like) is never printed: it is how the plan is placed, not what either view calls it.
 *
 *   stageWordsHtml({ placing, word, yearsToGo })   '<stage word> · <n> to go' (marked), or '' when the plan is not placed
 *   whereYouAreHtml({ placing, word, yearsToGo })  the card's paragraph: "Where you are: <the same words>." and why, or ''
 *
 * `placing` is LifeStage.deriveStage's result (its key and reasons); `word` and `yearsToGo` are the reading's. Pure.
 */
import { markFact } from '../reading/mark.js';
import { formatFact } from '../reading/format.js';

const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const placed = (placing, word) => !!(placing && placing.key !== 'unknown' && word);

export function stageWordsHtml({ placing, word, yearsToGo } = {}) {
  if (!placed(placing, word)) return '';
  // a locked saver's time to the stop (the placing's chip says "to go" only then), from the reading
  const toGo = /to go/.test(placing.chip || '') && yearsToGo > 0 ? ' · ' + markFact('yearsToGo', esc(formatFact('yearsToGo', yearsToGo))) + ' to go' : '';
  return markFact('stage', esc(word)) + toGo;
}

export function whereYouAreHtml({ placing, word, yearsToGo } = {}) {
  if (!placed(placing, word)) return '';
  const why = Array.isArray(placing.reasons) && placing.reasons.length ? 'Worked out from ' + esc(placing.reasons.join('; ')) + '. ' : '';
  return '<p style="margin-bottom:10px;"><strong style="color:var(--text);">Where you are: ' + stageWordsHtml({ placing, word, yearsToGo }) + '.</strong> '
    + '<span style="color:var(--text-muted);">' + why + 'The stage decides which tools lead (underlined), which are frozen with the lock (dimmed) and which do not apply (hidden — a retiree has nothing to accumulate). Change your age or the plan start in Stress → Settings → Timing to move it.</span></p>';
}
