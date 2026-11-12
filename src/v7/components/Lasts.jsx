/**
 * The chance the money lasts as long as you do, on every answer (7.8.0: research/v7/replan-nov-2026.md 5; the build spec's
 * section 6). Two pieces, both drawn inside an answer's headline block:
 *
 *   <LastsLines result={result} />     the answer's own sentences under its headline, in order: the fixed-age line to the
 *                                      plan-to age ([data-fixed="age"]), Bold's consequence, what happens if the money
 *                                      runs out (how long it pays, how much of the plan is still paid, what comes in
 *                                      after it), and what the other levels ask for. Draws only what the answer wrote:
 *                                      in the rollback (no weighing) nothing.
 *   <LevelStrip q result dispatch words />   "How careful?": the three levels, each label leading with what it asks for
 *                                      ("18 times in 20: Balanced"), so the word is never read as the mix of the same
 *                                      name; a press sets the `confidence` box (draft/set) and the answer is worked out
 *                                      again. Drawn only while the answer weighs, and carries [data-weighted]: it sits in
 *                                      a block with the fixed-age line. Never saved anywhere but the answer's own boxes.
 *
 * Computes nothing: the words are the answer's sentences and the copy's.
 */
import { Sentence } from './Sentence.jsx';
import { Button } from './Button.jsx';
import { LEVELS_WORDS } from '../copy/common.js';

const ORDER = ['fixed', 'boldLine', 'floor', 'howLong', 'howMuch', 'left', 'cost'];
const LEVEL_IDS = ['careful', 'balanced', 'bold'];

/** The first two (straight under the line) and the rest (under the bad case), as the screens draw them. */
export const LASTS_TOP = ['fixed', 'boldLine'];
export const LASTS_AFTER = ['floor', 'howLong', 'howMuch', 'left', 'cost'];

export function LastsLines({ result, only = ORDER }) {
  const s = (result && result.sentences) || {};
  const lines = ORDER.filter((k) => s[k] && only.includes(k));
  if (!lines.length) return null;
  return (
    <div class="lasts-lines" data-testid={only === ORDER ? 'lasts.lines' : `lasts.lines.${only[0]}`}>
      {lines.map((k) => <Sentence key={k} s={s[k]} source={result} class={`lasts-${k}`} data-testid={`lasts.${k}`} />)}
    </div>
  );
}

export function LevelStrip({ q, result, dispatch, words = null }) {
  if (!result || !result.levels || !LEVEL_IDS.includes(result.level)) return null;
  void words;
  // the strip is drawn only while weighing, so it always says the levels as chances (LEVELS_WORDS): the copy's field
  // options say the counts the rollback's "Try a change" uses
  const label = LEVELS_WORDS.label;
  const options = LEVELS_WORDS.options;
  // drawn only while the answer weighs (in the rollback the answer is as it was before 7.8.0, "Try a change" holds the
  // box), and only beside the fixed-age line the answer wrote (the render rule)
  const weighted = Boolean(result.basis && result.basis.weighted);
  if (!weighted || !(result.sentences && result.sentences.fixed)) return null;
  const id = `${q}-level-title`;
  return (
    <div class="level-strip" role="group" aria-labelledby={id} data-testid={`${q}.level`} data-level={result.level} data-weighted="1">
      <span class="level-label" id={id}>{label}</span>
      <div class="level-choices">
        {LEVEL_IDS.map((k) => (
          <Button key={k} testid={`${q}.level.${k}`} kind="choice" aria-pressed={result.level === k ? 'true' : 'false'}
            onClick={() => dispatch({ type: 'draft/set', q, path: 'confidence', value: k })}>{options[k]}</Button>
        ))}
      </div>
      <p class="note level-help">{LEVELS_WORDS.help}</p>
    </div>
  );
}
