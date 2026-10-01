/**
 * Question A, step 2 — "Could I stop at 60?" (screens-A-B.md 3.2–3.6, 6; step 4 brief 4.7, 4.13). Draws one of:
 *   - the retired view, when the draft describes someone who has stopped (data-view="retired");
 *   - the short form, when the four things (or a figure that is wrong) are needed on this step (rule R3);
 *   - "Sorry, we could not work that out." when the run failed;
 *   - "Working out your answer…" until there is a figure;
 *   - the answer: the verdict, its sentence, the bad-case line, advice and warnings; what you could spend from the
 *     stop age and the pot by then; the years before the State Pension; the ages side by side; one more year; what
 *     was assumed — then try a change and what next. Greyed and marked "Updating" while a new one is worked out.
 * Computes nothing: every figure is the answer's, drawn by Money, Sentence and OutOfTenBar.
 *
 * saverFrame() is the part A's and B's steps share: which of short form / failed / working / answer to draw.
 */
import {
  AskForm, FieldGroup, Field, Sentence, Money, Verdict, AgesChart, Pots, MadeOf, Assumed, SaverTryAChange, Working, Problem,
  Retired, isRetired, formView, stepLabel, withFixedCounts, Button, LinkButton, SpendLine, KeepPanel
} from '../../components/index.js';
import { isCurrent } from '../../state/select.js';
import { href } from '../../router/routes.js';
import { ADVICE_SHORT } from '../../copy/common.js';
import { A } from '../../copy/a.js';
import { get } from '../../../answers/shared/format.js';

const EMPTY_ANSWER = Object.freeze({ status: 'idle', inputsKey: null, result: null, before: null, progress: null, slow: false });

/** What the short form asks for, by question: these top-level fields (with what is drawn inside them). */
export const SHORT = {
  a: ['you.age', 'you.pot', 'stop.kind', 'spend.kind'],
  b: ['you.age', 'you.pot', 'you.payIn.kind', 'stop.age', 'spend.kind']
};

/** The fields the short form draws: SHORT's, everything that applies inside them, and every field with a problem. */
export function shortFormPaths(form) {
  const top = SHORT[form.q];
  const errors = Object.keys(form.parsed.errors);
  const inside = (f) => Object.keys(f.when || {}).some((p) => top.includes(p));
  const extra = form.fields.filter((f) => errors.includes(f.path) && !top.includes(f.path) && !inside(f)).map((f) => f.path);
  return { top, extra };
}

/**
 * Which of the four bodies a saver step draws, and the pieces every one of them needs.
 * @returns {{ kind: 'short'|'failed'|'working'|'answer', form, answer, result, stale, first }}
 */
export function saverFrame(state, q) {
  const form = formView(state, q);
  const answer = state.answers[q] || EMPTY_ANSWER;
  const result = answer.result;
  const usable = !!result && result.status !== 'invalid' && answer.status !== 'failed';
  const wrong = Object.keys(form.parsed.errors);
  let kind = 'answer';
  if (wrong.length > 0 || (!form.parsed.ok && !usable)) kind = 'short';
  else if (answer.status === 'failed' || (result && result.status === 'invalid')) kind = 'failed';
  else if (!result) kind = 'working';
  const stale = answer.status === 'working' || (form.parsed.ok && !isCurrent(state, q));
  const first = answer.status === 'first' && !stale;
  return { kind, form, answer, result, stale, first };
}

/** The short form: what the step needs, asked on the step itself (rule R3) — never a bounce back to step 1. */
export function ShortForm({ form, dispatch, need }) {
  const words = form.copy;
  const { top, extra } = shortFormPaths(form);
  const allMissing = Object.values(form.parsed.errors).every((id) => id === 'required');
  return (
    <AskForm form={form} dispatch={dispatch} data-region="form" class="ask short-form">
      <p class="lead">{allMissing ? need : words.answer.needFix}</p>
      {top.map((p) => <FieldGroup key={p} form={form} path={p} dispatch={dispatch} />)}
      {extra.map((p) => <Field key={p} form={form} path={p} dispatch={dispatch} />)}
      <div class="actions-row">
        <Button testid={`${form.q}.action.show`} kind="primary" type="submit">{words.buttons.show}</Button>
        <LinkButton href={href.step(form.q, 'numbers')}>{words.buttons.otherQuestionsFirst}</LinkButton>
      </div>
      <p class="note">{words.answer.sensible}</p>
    </AskForm>
  );
}

/** The warnings the answer gave, in its words — less any that `skip` names (one the headline already says). */
export function Warnings({ result, skip = [] }) {
  const list = ((result && result.warnings) || []).filter((w) => !skip.includes(w.id));
  if (!list.length) return null;
  return (
    <ul class="warnings">
      {list.map((w) => <li key={w.id} data-warning-id={w.id} class={`warning is-${w.severity}`}><Sentence as="span" s={w} source={result} /></li>)}
    </ul>
  );
}

/** The answer region's frame: aria-live, greyed and marked "Updating" while stale, the first-figure note. */
export function AnswerRegion({ words, stale, first, children }) {
  return (
    <div class={`answer${stale ? ' is-stale' : ''}`} data-region="answer" aria-live="polite" aria-busy={stale ? 'true' : 'false'}>
      {stale && <p class="updating" role="status">{words.answer.updating}</p>}
      {first && <p class="note first-figure">{words.answer.first}</p>}
      {children}
    </div>
  );
}

/**
 * The hand-over to "What is that a month?" at `age`: whether C takes that age (`ok`), and whether C then shows the same
 * careful figure (`same`: C asks nothing this answer was given beyond it). The answer says so itself (handOver.c, the
 * rule handOverToC); an answer without it is read by the plainer rule that C cannot start a pension before it can be
 * touched — a comparison of two ages the answer gave. `same` is then unknown (null).
 */
export function handOverC(result, age) {
  const hand = result && result.handOver && result.handOver.c;
  if (hand && typeof hand.ok === 'boolean') return { ok: hand.ok && typeof age === 'number', same: typeof hand.same === 'boolean' ? hand.same : null };
  const opens = result && result.pensionOpens && result.pensionOpens.you;
  return { ok: typeof age === 'number' && !(typeof opens === 'number' && age < opens), same: null };
}

/** The link to C, its words one span (a narrow screen wraps them as one line of text, never as columns), and — when C
 * does not ask everything this answer was given — a note that its figure can differ. */
export function ToC({ q, result, k, dispatch, words }) {
  const age = get(result, k);
  const hand = handOverC(result, age);
  if (!hand.ok) return null;
  return (
    <li>
      <LinkButton testid={`${q}.next.c`} href={href.step('c', 'answer')} onClick={() => dispatch({ type: 'draft/carry', from: q, to: 'c' })}>
        <span>{words.toCStart} <Money source={result} k={k} kind="age" />{words.toCEnd}</span>
      </LinkButton>
      {hand.same === false && <p class="note to-c-differs" data-testid={`${q}.next.c.differs`}>{words.toCDiffers}</p>}
    </li>
  );
}

/**
 * "What next?" for A: B with the figures carried; C from the stop age shown (C is asked from what is typed — the pot
 * now, what goes in, the savings — so it shows the same careful figure as here). "Save this as a plan" follows it, at
 * the foot of the answer. Each link's words are one span, so a narrow screen wraps them as one line of text, never as
 * columns.
 */
function WhatNext({ result, dispatch }) {
  const t = A.answer;
  const carry = (to) => () => dispatch({ type: 'draft/carry', from: 'a', to });
  return (
    <section class="block next" data-region="next" aria-labelledby="next-title">
      <h2 id="next-title">{t.nextTitle}</h2>
      <ul class="next-list">
        <li><LinkButton testid="a.next.b" href={href.step('b', 'numbers', 'you.payIn.total')} onClick={carry('b')}><span>{A.buttons['next.b']}</span></LinkButton></li>
        <ToC q="a" result={result} k="shown.age" dispatch={dispatch} words={t} />
      </ul>
    </section>
  );
}

/** The ages side by side on the answer step: the chart, its key, and the way to every age. */
function ChartBlock({ result, answer, dispatch }) {
  const t = A.answer;
  const byAges = result.inputs && result.inputs.stop && result.inputs.stop.kind === 'ages';
  const ready = answer.status !== 'first' && Array.isArray(result.ages) && result.ages.length > 0;
  return (
    <section class="block chart" aria-labelledby="chart-title">
      <h2 id="chart-title">{byAges ? t.chartTitleAges : t.chartTitle}</h2>
      <p class="note">{t.chartSpending} <Money source={result} k="spend.perMonth" /> {t.aMonth}</p>
      {ready
        ? (
          <>
            <AgesChart result={result} dispatch={dispatch} />
            <p class="note chart-key">{withFixedCounts(t.chartKey)}</p>
            {byAges && <p class="note">{t.chartPress}</p>}
          </>
        )
        : <p class="working-note" role="status">{t.chartWorking}</p>}
      <p><LinkButton testid="a.action.seeAges" href={href.step('a', 'ages')}>{A.buttons.seeAges}</LinkButton></p>
    </section>
  );
}

/** The answer itself, for a result that can be drawn. */
function Answer({ state, dispatch, frame }) {
  const { form, answer, result, stale, first } = frame;
  const s = result.sentences || {};
  const open = (id) => state.ui.open.includes(id);
  const t = A.answer;
  const headline = s.head && s.line && result.headline && result.headline.verdict;
  const plain = s.none || s.nothing;
  // "No age up to 75 worked" is the headline itself: the warning that says the same is not drawn under it again.
  const said = result.headline && result.headline.kind === 'noneWorked' ? ['not-in-range'] : [];
  return (
    <>
      <AnswerRegion words={A} stale={stale} first={first}>
        {headline
          ? (
            <section class="headline" data-headline="verdict" aria-labelledby="answer-figure">
              <Verdict result={result} />
              <Sentence s={s.line} source={result} class="line" data-sentence="verdict" />
              {s.partTime && <Sentence s={s.partTime} source={result} class="part-time-line" />}
              <Sentence s={s.bad} source={result} class="bad" />
              {s.after && <Sentence s={s.after} source={result} class="after" />}
              {s.late && <Sentence s={s.late} source={result} class="late" />}
              <p class="advice">{ADVICE_SHORT}</p>
              <Warnings result={result} skip={said} />
            </section>
          )
          : <>{plain && <Sentence s={plain} source={result} class={s.none ? 'none' : 'nothing'} />}<Warnings result={result} /></>}
        {headline && <Pots result={result} q="a" />}
        <MadeOf result={result} q="a" open={open('madeOf')} dispatch={dispatch} title={t.yearsTitle} note={t.yearsNote}
          lines={s.pays || []} after={s.savingsNeeded && <Sentence s={s.savingsNeeded} source={result} class="savings-needed" />} />
        {headline && <ChartBlock result={result} answer={answer} dispatch={dispatch} />}
        {(s.oneMore || s.partTimeOneMore) && (
          <section class="block one-more" aria-labelledby="one-more-title">
            <h2 id="one-more-title">{t.oneMoreTitle}</h2>
            {s.oneMore && <Sentence s={s.oneMore} source={result} />}
            {s.oneMoreMoves && <Sentence s={s.oneMoreMoves} source={result} />}
            {s.partTimeOneMore && <Sentence s={s.partTimeOneMore} source={result} />}
          </section>
        )}
        {(result.assumed || []).length > 0 && <Assumed q="a" result={result} open={open('assumed')} all={open('allAssumed')} dispatch={dispatch} />}
      </AnswerRegion>
      <SpendLine state={state} q="a" dispatch={dispatch} />
      <SaverTryAChange q="a" state={state} form={form} result={result} dispatch={dispatch} />
      <WhatNext result={result} dispatch={dispatch} />
      <KeepPanel state={state} q="a" dispatch={dispatch} />
      <p class="full-detail"><LinkButton testid="a.action.fullDetail" kind="quiet" href={href.soon('e')}>{form.couple ? A.buttons.fullDetailCouple : A.buttons.fullDetail}</LinkButton></p>
    </>
  );
}

export function AnswerScreen(state, dispatch) {
  if (isRetired(state, 'a')) return { question: 'a', rail: true, full: false, view: 'retired', content: <Retired q="a" dispatch={dispatch} /> };
  const frame = saverFrame(state, 'a');
  let body;
  if (frame.kind === 'short') body = <ShortForm form={frame.form} dispatch={dispatch} need={A.answer.needFour} />;
  else if (frame.kind === 'failed') body = <Problem form={frame.form} dispatch={dispatch} />;
  else if (frame.kind === 'working') body = <Working answer={frame.answer} />;
  else body = <Answer state={state} dispatch={dispatch} frame={frame} />;
  return {
    question: 'a',
    rail: true,
    full: true,
    content: (
      <>
        <h1 tabIndex={-1}>{stepLabel(state, 'a', 'answer')}</h1>
        {body}
      </>
    )
  };
}
