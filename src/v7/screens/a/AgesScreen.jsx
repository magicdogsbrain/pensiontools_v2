/**
 * Question A, step 3 — "What about every other age?" (screens-A-B.md 3.3; step 4 brief 4.11, 4.13, conflict 43).
 * Every whole age from 50 (or today's age) to 75 in one table, [data-table="ages"], each age a link to the answer
 * for it. The table needs one more pass of the answer at more detail ('all'); until it lands the step shows the
 * ages the answer step already has, with "Working out the other ages…" (the page is marked partial by the shell).
 * Opened with nothing usable typed, the step asks for what it needs, as the answer step does.
 */
import { Money, AgesChart, Working, Problem, Retired, isRetired, withFixedCounts, LinkButton } from '../../components/index.js';
import { href } from '../../router/routes.js';
import { A } from '../../copy/a.js';
import { SHAPE } from '../../copy/shape.js';
import { saverFrame, ShortForm, AnswerRegion, spendingWords } from './AnswerScreen.jsx';

/**
 * Why the first rows pay little or nothing: a pension cannot be touched before the age the answer gives
 * (pensionOpens), so a stop before it is paid from other savings alone. Drawn for each person with a row before that
 * age — a comparison of the answer's own ages, nothing worked out.
 */
function ClosedNotes({ result }) {
  const t = A.answer.tableClosed;
  const opens = result.pensionOpens || {};
  const rows = result.ages || [];
  const before = (who) => typeof opens[who] === 'number'
    && rows.some((row) => typeof (row.ages && row.ages[who]) === 'number' ? row.ages[who] < opens[who] : who === 'you' && row.age < opens[who]);
  const couple = !!(result.inputs && result.inputs.household === 'couple');
  const who = ['you', 'partner'].filter(before);
  if (!who.length) return null;
  return (
    <p class="note closed-note" data-testid="a.ages.closedNote">
      {who.map((w, i) => (
        <span key={w}>{i > 0 ? ' ' : ''}{couple ? t[w] : t.single} <Money source={result} k={`pensionOpens.${w}`} kind="age" />.</span>
      ))}
      {' '}{t.then}
    </p>
  );
}

/** The table starts at 50 (with the age now): said, so a gap between the age now and 50 is not a mystery. */
function From50({ result }) {
  const age = result.inputs && result.inputs.you && result.inputs.you.age;
  if (typeof age !== 'number' || age >= 49) return null;
  return <p class="note" data-testid="a.ages.from50">{withFixedCounts(A.answer.tableFrom50)}</p>;
}

export function AgesScreen(state, dispatch) {
  if (isRetired(state, 'a')) return { question: 'a', rail: true, full: false, view: 'retired', content: <Retired q="a" dispatch={dispatch} state={state} /> };
  const frame = saverFrame(state, 'a');
  const t = A.answer;
  let body;
  if (frame.kind === 'short') body = <ShortForm form={frame.form} dispatch={dispatch} need={A.answer.needFour} state={state} />;
  else if (frame.kind === 'failed') body = <Problem form={frame.form} dispatch={dispatch} />;
  else if (frame.kind === 'working') body = <Working answer={frame.answer} />;
  else {
    const { result, answer, stale, first } = frame;
    const all = result.basis && result.basis.detail === 'all' && !answer.extending;
    body = (
      <AnswerRegion words={A} stale={stale} first={first}>
        <section class="block every-age" aria-labelledby="every-age-title">
          <h2 id="every-age-title">{t.tableTitle}</h2>
          <p class="note">{t.chartSpending} <Money source={result} k="spend.perMonth" /> {spendingWords(result, t)}</p>
          <AgesChart result={result} dispatch={dispatch} table={all} />
          {!all && <p class="working-note" role="status">{t.chartWorking}</p>}
          <p class="note chart-key">{withFixedCounts(result.shapeAt ? SHAPE.answer.agesKey : t.chartKey)}</p>
          {all && <ClosedNotes result={result} />}
          {all && <From50 result={result} />}
          {all && <p class="note">{t.chartPress}</p>}
        </section>
        <p><LinkButton testid="a.action.back" href={href.step('a', 'answer')}>{A.buttons.back}</LinkButton></p>
      </AnswerRegion>
    );
  }
  return {
    question: 'a',
    rail: true,
    full: true,
    content: (
      <>
        <h1 tabIndex={-1}>{A.steps.ages.label}</h1>
        {body}
      </>
    )
  };
}
