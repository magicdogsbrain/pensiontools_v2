/**
 * Question D, step 2 — "Will it last?" (research/v7/answer-D.md 3.4–3.8; road-to-7.md step 7). Draws one of:
 *   - the short form, when the four things (or a figure that is wrong) are needed on this step (rule R3);
 *   - "Sorry, we could not work that out." when the run failed;
 *   - "Working out your answer…" until there is a figure;
 *   - the answer: the verdict band (yes / close / no at what you take), its sentence, the bad-case line, advice and
 *     warnings; "Could I spend more?" (the headroom and the band in full); what it is made of; what was assumed — then
 *     the two levers that are tried on the answer's own lives, "Would some work help?" and "What if shares fell by a
 *     fifth?", what next, and "Keep this as a plan". Greyed and marked "Updating" while a new one is worked out.
 * Computes nothing: every figure is the answer's, drawn by Money and Sentence. A lever not opened costs nothing: the
 * answer function runs it only when its box says so (work.has, fall.has — draft fields of the `try` group).
 */
import { Sentence, MadeOf, Assumed, Working, Problem, Field, Button, LinkButton, KeepPanel, withFixedCounts, stepLabel, blank } from '../../components/index.js';
import { href } from '../../router/routes.js';
import { ADVICE_SHORT } from '../../copy/common.js';
import { D } from '../../copy/d.js';
import { saverFrame, ShortForm, Warnings, AnswerRegion } from '../a/AnswerScreen.jsx';

const VERDICTS = ['yes', 'close', 'no'];
const set = (path, value) => ({ type: 'draft/set', q: 'd', path, value });

/** The verdict band: the word, large, and what was tested — carrying data-verdict (test plan R14). The sentences are the answer's. */
function Band({ result }) {
  const s = result.sentences || {};
  if (!s.head || !VERDICTS.includes(result.verdict)) return null;
  return (
    <div class={`band verdict is-${result.verdict}`} data-verdict={result.verdict}>
      <Sentence s={s.head} source={result} class="figure" id="answer-figure" />
      {s.sub && <Sentence s={s.sub} source={result} class="figure-sub" />}
    </div>
  );
}

/** "Could I spend more?" (answer-D.md 3.5): the headroom line, then the band in full with its key. */
function SpendMore({ result }) {
  const s = result.sentences || {};
  if (!s.headroom) return null;
  const t = D.answer;
  return (
    <section class="block spend-more" data-testid="d.more" aria-labelledby="more-title">
      <h2 id="more-title">{t.moreTitle}</h2>
      <Sentence s={s.headroom} source={result} class="headroom" data-testid="d.answer.headroom" data-headroom={result.headroom ? result.headroom.kind : undefined} />
      {s.middling && <Sentence s={s.middling} source={result} />}
      {s.good && <Sentence s={s.good} source={result} />}
      <p class="note range-key" data-testid="d.more.key">{withFixedCounts(t.moreNote)}</p>
    </section>
  );
}

/**
 * "Would some work help?" (answer-D.md 3.6): pay a year and for how many years, then "Try it" (work.has on — with the
 * boxes filled from a sensible start when empty, so the answer is never dropped to the short form by the press), the
 * answer's own sentences for it, year by year, and "Take the work away". The boxes write the draft's work.* fields.
 */
function WorkLever({ form, result, dispatch }) {
  const t = D.answer;
  const s = result.sentences || {};
  const on = form.parsed.values['work.has'] === true;
  const draft = form.draft;
  const tryIt = () => {
    const actions = [];
    if (blank(draft['work.yearly'])) actions.push(set('work.yearly', '12,000'));
    if (blank(draft['work.years'])) actions.push(set('work.years', '3'));
    actions.push(set('work.has', true));
    actions.forEach((a) => dispatch(a));
  };
  return (
    <section class="block lever lever-work" data-testid="d.lever.work" data-lever-on={on ? '1' : '0'} aria-labelledby="work-title">
      <h2 id="work-title">{t.workTitle}</h2>
      <p class="note">{t.workNote}</p>
      <div class="try-row try-work">
        <Field form={form} path="work.yearly" dispatch={dispatch} testid="d.try.work.yearly" label={t.workYearly} help="" placeholder="12,000" showError={on} />
        <Field form={form} path="work.years" dispatch={dispatch} testid="d.try.work.years" label={t.workYears} help="" placeholder="3" showError={on} />
        {on
          ? <Button testid="d.lever.work.off" onClick={() => dispatch(set('work.has', false))}>{D.buttons.workOff}</Button>
          : <Button testid="d.lever.work.try" kind="primary" onClick={tryIt}>{D.buttons.workTry}</Button>}
      </div>
      {result.work && s.work && (
        <div class="lever-result" data-testid="d.work.result">
          <Sentence s={s.work} source={result} class="lever-line" />
          {s.workBad && <Sentence s={s.workBad} source={result} class="bad" />}
          {s.workCareful && <Sentence s={s.workCareful} source={result} />}
          {Array.isArray(s.workRows) && s.workRows.length > 0 && (
            <>
              <p class="note">{t.workRows}</p>
              <ul class="work-rows">{s.workRows.map((row, i) => <li key={row.id + i}><Sentence as="span" s={row} source={result} /></li>)}</ul>
            </>
          )}
        </div>
      )}
    </section>
  );
}

/** "What if shares fell by a fifth?" (answer-D.md 3.7): one press; the answer's own sentences; "Put the shares back". */
function FallLever({ form, result, dispatch }) {
  const t = D.answer;
  const s = result.sentences || {};
  const on = form.parsed.values['fall.has'] === true;
  return (
    <section class="block lever lever-fall" data-testid="d.lever.fall" data-lever-on={on ? '1' : '0'} aria-labelledby="fall-title">
      <h2 id="fall-title">{t.fallTitle}</h2>
      <p class="note">{t.fallNote}</p>
      <div class="actions-row">
        {on
          ? <Button testid="d.lever.fall.off" onClick={() => dispatch(set('fall.has', false))}>{D.buttons.fallOff}</Button>
          : <Button testid="d.lever.fall.try" kind="primary" onClick={() => dispatch(set('fall.has', true))}>{D.buttons.fall}</Button>}
      </div>
      {result.fall && s.fall && (
        <div class="lever-result" data-testid="d.fall.result">
          <Sentence s={s.fall} source={result} class="lever-line" />
          {s.fallCareful && <Sentence s={s.fallCareful} source={result} />}
          {s.fallUnchanged && <Sentence s={s.fallUnchanged} source={result} />}
        </div>
      )}
    </section>
  );
}

/** "What next?": the questions that are theirs if someone is still working — A, about you or about your partner. */
function WhatNext({ result }) {
  const t = D.answer;
  const couple = !!(result.inputs && result.inputs.household === 'couple');
  return (
    <section class="block next" data-region="next" aria-labelledby="next-title">
      <h2 id="next-title">{t.nextTitle}</h2>
      <p class="next-prompt">{couple ? t.partnerWorking : t.stillWorking}</p>
      <ul class="next-list">
        <li><LinkButton testid="d.next.a" href={href.step('a', 'numbers')}><span>{D.buttons.toA}</span></LinkButton></li>
        {couple && <li><LinkButton testid="d.next.a.partner" href={href.step('a', 'numbers')}><span>{D.buttons.toAPartner}</span></LinkButton></li>}
      </ul>
    </section>
  );
}

/** The answer itself, for a result that can be drawn. */
function Answer({ state, dispatch, frame }) {
  const { form, result, stale, first } = frame;
  const s = result.sentences || {};
  const open = (id) => state.ui.open.includes(id);
  const t = D.answer;
  const headline = !!(s.head && s.line && VERDICTS.includes(result.verdict));
  // no pot and no savings: the verdict stands (the pensions alone), and the band gives way to one sentence; the levers go
  const levers = headline && result.status === 'ok';
  return (
    <>
      <AnswerRegion words={D} stale={stale} first={first}>
        {headline
          ? (
            <section class="headline" data-headline="verdict" aria-labelledby="answer-figure">
              <Band result={result} />
              <Sentence s={s.line} source={result} class="line" data-sentence="verdict" />
              <Sentence s={s.bad} source={result} class="bad" />
              <p class="advice">{ADVICE_SHORT}</p>
              <Warnings result={result} />
            </section>
          )
          : <>{s.none && <Sentence s={s.none} source={result} class="none" data-testid="d.answer.none" />}<Warnings result={result} /></>}
        {headline && s.headroom && <SpendMore result={result} />}
        {headline && !s.headroom && s.nothing && <Sentence s={s.nothing} source={result} class="nothing" data-testid="d.answer.nothing" />}
        <MadeOf result={result} q="d" open={open('madeOf')} dispatch={dispatch} title={t.madeOfTitle} note={t.madeOfNote} lines={s.madeOf || []} />
        {(result.assumed || []).length > 0 && <Assumed q="d" result={result} open={open('assumed')} all={open('allAssumed')} dispatch={dispatch} />}
      </AnswerRegion>
      {levers && <WorkLever form={form} result={result} dispatch={dispatch} />}
      {levers && <FallLever form={form} result={result} dispatch={dispatch} />}
      <WhatNext result={result} />
      <KeepPanel state={state} q="d" dispatch={dispatch} />
      <p class="full-detail"><LinkButton testid="d.action.fullDetail" kind="quiet" href={href.soon('e')}>{form.couple ? D.buttons.fullDetailCouple : D.buttons.fullDetail}</LinkButton></p>
    </>
  );
}

export function AnswerScreen(state, dispatch) {
  const frame = saverFrame(state, 'd');
  let body;
  if (frame.kind === 'short') body = <ShortForm form={frame.form} dispatch={dispatch} need={D.answer.needFour} state={state} />;
  else if (frame.kind === 'failed') body = <Problem form={frame.form} dispatch={dispatch} />;
  else if (frame.kind === 'working') body = <Working answer={frame.answer} />;
  else body = <Answer state={state} dispatch={dispatch} frame={frame} />;
  return {
    question: 'd',
    rail: true,
    full: true,
    content: (
      <>
        <h1 tabIndex={-1}>{stepLabel(state, 'd', 'answer')}</h1>
        {body}
      </>
    )
  };
}
