/**
 * The headline of an answer (build brief 4.9): <section data-headline="levels.balanced.monthly"> (the level's amount,
 * 7.8.0) holding the large
 * figure, what it is, the sentence a person could read aloud ([data-sentence]), the bad-case line, ADVICE_SHORT,
 * and whatever the screen puts under them (warnings, what it is made of, what was assumed). `afterLine` is drawn
 * straight under the sentence: C's plain statement of what goes in until the money starts.
 *
 * 7.8.0: under the line, the fixed-age line and Bold's consequence; under the bad case, what comes in if the money runs
 * out and what the other levels ask for (Lasts.jsx: only the sentences the answer wrote). `strip`: "How careful?", drawn
 * straight under the fixed-age line, in the order A, B and D use.
 *
 * It refuses to draw without its sentence: a figure never stands alone.
 */
import { Sentence } from './Sentence.jsx';
import { ADVICE_SHORT } from '../copy/common.js';
import { LastsLines, LASTS_TOP, LASTS_AFTER } from './Lasts.jsx';

export function Headline({ result, k: given = null, afterLine = null, strip = null, children }) {
  const s = result && result.sentences;
  const k = given || `levels.${(result && result.level) || 'balanced'}.monthly`;
  if (!s || !s.head || !s.line) return null;
  return (
    <section class="headline" data-headline={k} aria-labelledby="answer-figure">
      <div class="band">
        <Sentence s={s.head} source={result} class="figure" id="answer-figure" />
        <Sentence s={s.sub} source={result} class="figure-sub" />
      </div>
      <Sentence s={s.line} source={result} class="line" data-sentence={k} />
      <LastsLines result={result} only={LASTS_TOP} />
      {/* "How careful?" straight under the fixed-age line, as A, B and D draw it: on the first screen with the verdict */}
      {strip}
      {afterLine}
      <Sentence s={s.bad} source={result} class="bad" />
      <LastsLines result={result} only={LASTS_AFTER} />
      <p class="advice">{ADVICE_SHORT}</p>
      {children}
    </section>
  );
}
