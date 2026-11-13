/**
 * Question B, step 3 — "What if I stop later, or pay in more, or both?" (screens-A-B.md 4.3; step 4 brief 4.11,
 * 4.13, conflict 37). The grid of stop age against pay-in, each cell the count out of 10 of futures that reached the
 * pot that stop age needs. It needs one more pass of the answer at more detail ('grid'); until it lands the step
 * says it is working them out (the page is marked partial by the shell). On course, it says so first. A couple who stop in
 * different years (the answer's `apart`) spend that amount "once you have both stopped" (couples-different-years.md 2.4).
 */
import { Money, Sentence, Grid, gridReaches, Working, Problem, Retired, isRetired, withFixedCounts, LinkButton, fill } from '../../components/index.js';
import { ageText } from '../../../answers/shared/format.js';
import { LEVELS_WORDS } from '../../copy/common.js';
import { href } from '../../router/routes.js';
import { B } from '../../copy/b.js';
import { saverFrame, ShortForm, AnswerRegion } from '../a/AnswerScreen.jsx';

export function ChoicesScreen(state, dispatch) {
  if (isRetired(state, 'b')) return { question: 'b', rail: true, full: false, view: 'retired', content: <Retired q="b" dispatch={dispatch} state={state} /> };
  const frame = saverFrame(state, 'b');
  const t = B.choices;
  let body;
  if (frame.kind === 'short') body = <ShortForm form={frame.form} dispatch={dispatch} need={B.answer.needFive} state={state} />;
  else if (frame.kind === 'failed') body = <Problem form={frame.form} dispatch={dispatch} />;
  else if (frame.kind === 'working') body = <Working answer={frame.answer} />;
  else {
    const { result, answer, stale, first } = frame;
    const ready = !!result.grid && !answer.extending;
    const couple = !!(result.inputs && result.inputs.household === 'couple');
    // 7.8.0, while weighing: the key says what a cell counts (to the plan-to age, in twentieths) and what a marked cell means
    // (on course at the level chosen); the guide pot is a count to the same age
    const weighing = !!(result.basis && result.basis.weighted);
    const level = result.level || 'balanced';
    const slots = { age: ageText(result.chance && typeof result.chance.planToAge === 'number' ? result.chance.planToAge : result.basis.endAge),
      level: LEVELS_WORDS.names[level] || 'Balanced', n: LEVELS_WORDS.twentieths[level] || LEVELS_WORDS.twentieths.balanced };
    const key = weighing ? fill(couple ? t.keyWCouple : t.keyW, slots) : t.key;
    const keyGuide = weighing ? fill(t.keyGuideW, slots) : t.keyGuide;
    const none = weighing ? fill(t.noneW, slots) : t.none;
    body = (
      <AnswerRegion words={B} stale={stale} first={first}>
        {result.onCourse === true && <p class="on-course" data-testid="b.choices.onCourse">{t.onCourse}</p>}
        <p class="lead">{t.spending} <Money source={result} k="spend.perMonth" /> {couple ? (result.apart ? t.spendingEndApart : t.spendingEndCouple) : t.spendingEnd} <Money source={result} k="basis.endAge" kind="age" />.</p>
        {ready
          ? (
            <>
              <Grid result={result} dispatch={dispatch} />
              {!gridReaches(result) && (result.sentences && result.sentences.gridNone
                ? <Sentence s={result.sentences.gridNone} source={result} class="grid-none" data-testid="b.grid.none" />
                : <p class="grid-none" data-testid="b.grid.none">{withFixedCounts(none)}</p>)}
              <p class="note grid-key" data-testid="b.grid.key">{withFixedCounts(key)} <span class="grid-key-guide">{withFixedCounts(keyGuide)}</span></p>
              {Array.isArray(result.grid.shares) && <p class="note grid-key-share" data-testid="b.grid.shareKey">{t.shareKey}</p>}
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
