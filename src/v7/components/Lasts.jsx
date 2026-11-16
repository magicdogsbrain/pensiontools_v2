/**
 * The chance the money lasts as long as you do, on every answer (7.8.0: research/v7/replan-nov-2026.md 5; the build spec's
 * section 6). Two pieces, both drawn inside an answer's headline block:
 *
 *   <LastsLines result={result} />     the answer's own sentences under its headline, in order: the fixed-age line to the
 *                                      plan-to age ([data-fixed="age"]), Bold's consequence, what happens if the money
 *                                      runs out (how long it pays, how much of the plan is still paid, what comes in
 *                                      after it), and what the other levels ask for. Draws only what the answer wrote:
 *                                      in the rollback (no weighing) nothing.
 *   <ChanceMore result keys />         "More about the chance": the counts to one age, once a page, closed (7.12.0).
 *   <LevelStrip q result dispatch words />   "How careful?": the three levels, each label leading with what it asks for
 *                                      ("18 times in 20: Balanced"), so the word is never read as the mix of the same
 *                                      name; a press sets the `confidence` box (draft/set) and the answer is worked out
 *                                      again. Drawn only while the answer weighs, and carries [data-weighted]: it sits in
 *                                      a block with the fixed-age line. Never saved anywhere but the answer's own boxes.
 *
 * Computes nothing: the words are the answer's sentences and the copy's; the counts in the labels are marked data-fixed
 * (counts the copy wrote, never a figure worked out).
 */
import { Sentence } from './Sentence.jsx';
import { Button } from './Button.jsx';
import { withFixedCounts } from './MadeOf.jsx';
import { LEVELS_WORDS, CHANCE_MORE } from '../copy/common.js';

const ORDER = ['fixed', 'boldLine', 'floor', 'howLong', 'howMuch', 'left', 'cost'];
const LEVEL_IDS = ['careful', 'balanced', 'bold'];

/**
 * Bold's consequence (straight under the line) and the rest (under the bad case), as the screens draw them. The count to
 * one age ('fixed') is said once a page, in ChanceMore (7.12.0).
 */
export const LASTS_TOP = ['boldLine'];

/** Whether "More about the chance" starts open (7.12.0: closed; the body says the chance, the count to one age is a press away). */
export const CHANCE_MORE_OPEN = false;

/**
 * "More about the chance": ONE closed block a page (7.12.0), inside the answer's headline or verdict block. It holds the
 * count to one age of every chance the page says (`keys`: the answer's sentences, in order, those it wrote) and how the
 * chance is counted, said once. Drawn only while the answer weighs.
 */
export function ChanceMore({ result, keys = ['fixed'] }) {
  const s = (result && result.sentences) || {};
  if (!(result && result.basis && result.basis.weighted)) return null;
  const lines = keys.filter((k, i) => s[k] && keys.indexOf(k) === i);
  if (!lines.length) return null;
  const level = LEVEL_IDS.includes(result.level) ? result.level : 'balanced';
  const asks = CHANCE_MORE.asks[level];
  return (
    <details class="chance-more" data-testid="chance.more" open={CHANCE_MORE_OPEN}>
      <summary>{CHANCE_MORE.title}</summary>
      {lines.map((k) => <Sentence key={k} s={s[k]} source={result} class={`lasts-${k}`} data-testid={`lasts.${k}`} />)}
      <p class="note chance-help">{withFixedCounts(`${CHANCE_MORE.help} ${asks}`)}</p>
    </details>
  );
}
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
  // box), and only when the answer wrote the fixed-age line (said in ChanceMore, with how the chance is counted)
  const weighted = Boolean(result.basis && result.basis.weighted);
  if (!weighted || !(result.sentences && result.sentences.fixed)) return null;
  const id = `${q}-level-title`;
  return (
    <div class="level-strip" role="group" aria-labelledby={id} data-testid={`${q}.level`} data-level={result.level} data-weighted="1">
      <span class="level-label" id={id}>{label}</span>
      <div class="level-choices">
        {LEVEL_IDS.map((k) => (
          <Button key={k} testid={`${q}.level.${k}`} kind="choice" aria-pressed={result.level === k ? 'true' : 'false'}
            onClick={() => dispatch({ type: 'draft/set', q, path: 'confidence', value: k })}><span class="level-option">{withFixedCounts(options[k])}</span></Button>
        ))}
      </div>
    </div>
  );
}
