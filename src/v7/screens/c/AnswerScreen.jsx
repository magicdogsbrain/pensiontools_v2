/**
 * Question C, step 2 — "What does it pay a month?" (rail-screens-language.md 2.3–2.6, with the build brief's
 * changes). Draws one of:
 *   - the short form, when the two numbers (or a figure that is wrong) are needed on this step (rule R3);
 *   - "Sorry, we could not work that out." when the run failed;
 *   - "Working out your answer…" until there is a figure;
 *   - the answer: headline, sentence, bad-case line, advice, warnings, what it is made of, what was assumed,
 *     try a change, what next — greyed and marked "Updating" while a new one is worked out.
 * Computes nothing: every figure is the answer's, drawn by Money and Sentence.
 */
import { AskForm, Field, formView, Button, LinkButton, Headline, Sentence, MadeOf, Assumed, TryAChange, Working, Problem, FIELDS } from '../../components/index.js';
import { isCurrent } from '../../state/select.js';
import { href } from '../../router/routes.js';
import { frontDoor } from '../../rail/index.js';
import { C } from '../../copy/c.js';

/**
 * Whether the answer is for someone whose money starts now with the State Pension already being paid — read from
 * the answer, never worked out here: the first stretch of years has State Pension in it and the start is "now".
 * "What next?" then leads with "Already stopped?".
 */
export const alreadyStopped = (result) => !!(result && result.inputs && result.inputs.start && result.inputs.start.kind === 'now'
  && Array.isArray(result.phases) && result.phases[0] && result.phases[0].statePension > 0);

/**
 * A "still working?" link to question A or B. Once that question is open (step 4's joining up) it carries C's figures
 * across (draft/carry, src/v7/state/carry.js) and opens its numbers step at the first box left to fill
 * (screens-A-B.md 5; step 4 brief conflict 46); until then it is the honest "not in the preview yet" link.
 */
const OPENS = { a: () => href.step('a', 'numbers', 'stop.age'), b: () => href.step('b', 'numbers', 'you.payIn.total') };
function ToSaver({ q, dispatch, children }) {
  const open = frontDoor().some((x) => x.id === q && x.built);
  if (!open) return <LinkButton href={href.soon(q)}>{children}</LinkButton>;
  return <LinkButton testid={`c.next.${q}`} href={OPENS[q]()} onClick={() => dispatch({ type: 'draft/carry', from: 'c', to: q })}>{children}</LinkButton>;
}

/** "What next?": the two prompts, "Already stopped?" first for someone already drawing their State Pension; then "Keep". */
function WhatNext({ result, dispatch }) {
  const working = (
    <div class="next-group" key="working" data-testid="c.next.working">
      <p class="next-prompt">{C.answer.stillWorking}</p>
      <ul class="next-list">
        <li><ToSaver q="a" dispatch={dispatch}>{C.answer.whenStop}</ToSaver></li>
        <li><ToSaver q="b" dispatch={dispatch}>{C.answer.savingEnough}</ToSaver></li>
      </ul>
    </div>
  );
  const stopped = (
    <div class="next-group" key="stopped" data-testid="c.next.stopped">
      <p class="next-prompt">{C.answer.stopped}</p>
      <ul class="next-list">
        <li><LinkButton href={href.soon('d')}>{C.answer.willItLast}</LinkButton></li>
      </ul>
    </div>
  );
  return (
    <section class="block next" data-region="next" aria-labelledby="next-title">
      <h2 id="next-title">{C.answer.nextTitle}</h2>
      {alreadyStopped(result) ? [stopped, working] : [working, stopped]}
      <p class="next-keep">
        {/* "Keep" is not in the preview yet: a quiet link that says so, never the thing to do next */}
        <LinkButton kind="quiet" testid="c.action.keep" href={href.step('c', 'keep')}>{C.buttons.keepNotYet}</LinkButton>
      </p>
    </section>
  );
}

export function AnswerScreen(state, dispatch) {
  const form = formView(state);
  const answer = state.answers.c;
  const result = answer.result;
  const usable = !!result && result.status !== 'invalid' && answer.status !== 'failed';
  const wrong = Object.keys(form.parsed.errors).filter((p) => p !== 'take');
  const shortForm = wrong.length > 0 || (!form.parsed.ok && !usable);

  let body;
  if (shortForm) {
    const need = new Set(['you.pot', 'you.age', ...Object.keys(form.parsed.errors)]);
    body = (
      <AskForm form={form} dispatch={dispatch} data-region="form" class="ask short-form">
        <p class="lead">{wrong.length && !(wrong.includes('you.pot') && wrong.includes('you.age')) ? C.answer.needFix : C.answer.needTwo}</p>
        {FIELDS.filter((f) => need.has(f.path)).map((f) => <Field key={f.path} form={form} path={f.path} dispatch={dispatch} />)}
        <div class="actions-row">
          <Button testid="c.action.show" kind="primary" type="submit">{C.buttons.show}</Button>
          <LinkButton href={href.step('c', 'numbers')}>{C.buttons.otherQuestionsFirst}</LinkButton>
        </div>
        <p class="note">{C.answer.sensible}</p>
      </AskForm>
    );
  } else if (answer.status === 'failed' || (result && result.status === 'invalid')) {
    body = <Problem form={form} dispatch={dispatch} />;
  } else if (!result) {
    body = <Working answer={answer} />;
  } else {
    const stale = answer.status === 'working' || (form.parsed.ok && !isCurrent(state, 'c'));
    const first = answer.status === 'first' && !stale;
    const s = result.sentences || {};
    const open = (id) => state.ui.open.includes(id);
    // The "nothing to draw on" sentence stands where the headline would be, so the warning that says the same is not drawn twice.
    const shownWarnings = (result.warnings || []).filter((w) => !(s.nothing && w.id === 'nothing-to-draw'));
    const warnings = shownWarnings.length > 0 && (
      <ul class="warnings">
        {shownWarnings.map((w) => <li key={w.id} data-warning-id={w.id} class={`warning is-${w.severity}`}><Sentence as="span" s={w} source={result} /></li>)}
      </ul>
    );
    const assumed = (result.assumed || []).length > 0 && <Assumed result={result} open={open('assumed')} all={open('allAssumed')} dispatch={dispatch} />;
    const madeOf = <MadeOf result={result} open={open('madeOf')} dispatch={dispatch} />;
    const take = s.take && <Sentence s={s.take} source={result} class="take-line" />;
    // Money first taken at a later age: what goes in until then, said plainly under the figure ("Paying in £800 a month
    // until 67, rising with prices; the pot invested at Balanced … until then"), and what the pot could be by then.
    const payIn = s.payIn && <Sentence s={s.payIn} source={result} class="pay-in-line" data-testid="c.answer.payIn" />;
    const potThen = s.pot && <Sentence s={s.pot} source={result} class="pot-line" data-testid="c.answer.pot" />;

    body = (
      <>
        <div class={`answer${stale ? ' is-stale' : ''}`} data-region="answer" aria-live="polite" aria-busy={stale ? 'true' : 'false'}>
          {stale && <p class="updating" role="status">{C.answer.updating}</p>}
          {first && <p class="note first-figure">{C.answer.first}</p>}
          {s.none
            ? <><Sentence s={s.none} source={result} class="none" />{warnings}{take}{assumed}</>
            : s.head && s.line && !s.nothing
              ? (
                <Headline result={result} afterLine={payIn || potThen ? <>{payIn}{potThen}</> : null}>
                  {s.small && (
                    <div class="small-pot">
                      <Sentence s={s.small} source={result} />
                      <LinkButton testid="c.action.ways" kind="quiet" href={href.step('c', 'ways')}>{C.buttons.ways}</LinkButton>
                    </div>
                  )}
                  {warnings}
                  {take}
                  {madeOf}
                  {assumed}
                </Headline>
              )
              : <><Sentence s={s.nothing} source={result} class="nothing" />{warnings}{take}{result.status !== 'none' && madeOf}{assumed}</>}
        </div>
        <TryAChange state={state} form={form} result={result} dispatch={dispatch} />
        <WhatNext result={result} dispatch={dispatch} />
        <p class="full-detail"><LinkButton testid="c.action.fullDetail" kind="quiet" href={href.soon('e')}>{form.couple ? C.buttons.fullDetailCouple : C.buttons.fullDetail}</LinkButton></p>
      </>
    );
  }

  return {
    question: 'c',
    rail: true,
    full: true,
    content: (
      <>
        <h1 tabIndex={-1}>{C.steps.answer.label}</h1>
        {body}
      </>
    )
  };
}
