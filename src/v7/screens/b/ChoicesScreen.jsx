/**
 * Question B, step 3 — "What if I stop later, or pay in more, or both?" (screens-A-B.md 4.3; step 4 brief 4.11,
 * 4.13, conflict 37). The grid of stop age against pay-in, each cell the count out of 10 of futures that reached the
 * pot that stop age needs. It needs one more pass of the answer at more detail ('grid'); until it lands the step
 * says it is working them out (the page is marked partial by the shell). On course, it says so first.
 */
import { Money, Sentence, Grid, gridReaches, Working, Problem, Retired, isRetired, withFixedCounts, LinkButton } from '../../components/index.js';
import { href } from '../../router/routes.js';
import { B } from '../../copy/b.js';
import { saverFrame, ShortForm, AnswerRegion } from '../a/AnswerScreen.jsx';

export function ChoicesScreen(state, dispatch) {
  if (isRetired(state, 'b')) return { question: 'b', rail: true, full: false, view: 'retired', content: <Retired q="b" dispatch={dispatch} /> };
  const frame = saverFrame(state, 'b');
  const t = B.choices;
  let body;
  if (frame.kind === 'short') body = <ShortForm form={frame.form} dispatch={dispatch} need={B.answer.needFive} />;
  else if (frame.kind === 'failed') body = <Problem form={frame.form} dispatch={dispatch} />;
  else if (frame.kind === 'working') body = <Working answer={frame.answer} />;
  else {
    const { result, answer, stale, first } = frame;
    const ready = !!result.grid && !answer.extending;
    const couple = !!(result.inputs && result.inputs.household === 'couple');
    body = (
      <AnswerRegion words={B} stale={stale} first={first}>
        {result.onCourse === true && <p class="on-course" data-testid="b.choices.onCourse">{t.onCourse}</p>}
        <p class="lead">{t.spending} <Money source={result} k="spend.perMonth" /> {couple ? t.spendingEndCouple : t.spendingEnd} <Money source={result} k="basis.endAge" kind="age" />.</p>
        {ready
          ? (
            <>
              <Grid result={result} dispatch={dispatch} />
              {!gridReaches(result) && (result.sentences && result.sentences.gridNone
                ? <Sentence s={result.sentences.gridNone} source={result} class="grid-none" data-testid="b.grid.none" />
                : <p class="grid-none" data-testid="b.grid.none">{withFixedCounts(t.none)}</p>)}
              <p class="note grid-key">{withFixedCounts(t.key)} <span class="grid-key-guide">{withFixedCounts(t.keyGuide)}</span></p>
              {!couple && <p class="note">{t.press}</p>}
            </>
          )
          : <p class="working-note" role="status">{t.working}</p>}
        <p><LinkButton testid="b.action.back" href={href.step('b', 'answer')}>{B.buttons.back}</LinkButton></p>
      </AnswerRegion>
    );
  }
  return {
    question: 'b',
    rail: true,
    full: true,
    content: (
      <>
        <h1 tabIndex={-1}>{B.steps.choices.label}</h1>
        {body}
      </>
    )
  };
}
