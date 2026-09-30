/**
 * The headline of an answer (build brief 4.9): <section data-headline="monthly.careful"> holding the large
 * figure, what it is, the sentence a person could read aloud ([data-sentence]), the bad-case line, ADVICE_SHORT,
 * and whatever the screen puts under them (warnings, what it is made of, what was assumed).
 *
 * It refuses to draw without its sentence: a figure never stands alone.
 */
import { Sentence } from './Sentence.jsx';
import { ADVICE_SHORT } from '../copy/common.js';

export function Headline({ result, k = 'monthly.careful', children }) {
  const s = result && result.sentences;
  if (!s || !s.head || !s.line) return null;
  return (
    <section class="headline" data-headline={k} aria-labelledby="answer-figure">
      <div class="band">
        <Sentence s={s.head} source={result} class="figure" id="answer-figure" />
        <Sentence s={s.sub} source={result} class="figure-sub" />
      </div>
      <Sentence s={s.line} source={result} class="line" data-sentence={k} />
      <Sentence s={s.bad} source={result} class="bad" />
      <p class="advice">{ADVICE_SHORT}</p>
      {children}
    </section>
  );
}
