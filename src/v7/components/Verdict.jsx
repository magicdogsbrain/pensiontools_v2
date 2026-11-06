/**
 * Question A's verdict (step 4 brief 4.13, conflict 16): the band at the top of the answer — the verdict in words,
 * large ("Close — stopping at 60 is tight"), and under it what was tested — carrying data-verdict="yes|close|no".
 * The verdict is a word and a colour token, never only a colour (test plan R14). The words are the answer's own
 * sentences (a.head.*, a.sub); the screen chooses nothing.
 *
 *   <Verdict result={result} />                 the band
 *   <VerdictWord verdict="close" words={…} />   the word for one row of the chart ("close"), with the same mark
 */
import { Sentence } from './Sentence.jsx';

export const VERDICTS = ['yes', 'close', 'no'];

export function Verdict({ result }) {
  const s = result && result.sentences;
  const verdict = result && result.headline && result.headline.verdict;
  if (!s || !s.head || !VERDICTS.includes(verdict)) return null;
  return (
    <div class={`band verdict is-${verdict}`} data-verdict={verdict}>
      <Sentence s={s.head} source={result} class="figure" id="answer-figure" />
      <Sentence s={s.sub} source={result} class="figure-sub" />
    </div>
  );
}

export function VerdictWord({ verdict, words }) {
  if (!VERDICTS.includes(verdict)) return null;
  return <span class={`verdict-word is-${verdict}`} data-verdict={verdict}>{words[verdict]}</span>;
}
