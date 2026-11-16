/**
 * Question C, step 2 — "What does it pay a month?" (rail-screens-language.md 2.3–2.6, with the build brief's
 * changes). Draws one of:
 *   - the short form, when the two numbers (or a figure that is wrong) are needed on this step (rule R3);
 *   - "Sorry, we could not work that out." when the run failed;
 *   - "Working out your answer…" until there is a figure;
 *   - the answer: headline, sentence, bad-case line, advice, warnings, what it is made of, what was assumed,
 *     try a change, what next — greyed and marked "Updating" while a new one is worked out.
 * The slider ("What if you took this a month?") and "Take, a month" under Try a change write the take box. When the answer
 * was worked out for an amount other than the level's own, the block reads for THAT amount (state/pictures.js takeReading:
 * the answer's take sentences where its level's stand), and the line under the slider keeps the level's amount in view
 * with "Back to £…" (takeTried), which empties the take box. The three tiles stay the most you could take at each level.
 * Computes nothing: every figure is the answer's, drawn by Money and Sentence.
 */
import { LevelStrip } from '../../components/Lasts.jsx';
import { StressStrip } from '../../components/StressStrip.jsx';
import { AskForm, Field, formView, Button, LinkButton, Headline, Sentence, MadeOf, Assumed, TryAChange, Working, HeldAnswer, Problem, FIELDS, BudgetAgainstC, KeepPanel, StepsField, ShapeAnswer, AnswerSlider, FigureTiles, KeepLine, Money } from '../../components/index.js';
import { isCurrent, cAnswerYouStopped, isShapePath, answerSlider, answerTiles, tilesKey, takeReading, takeTried, staleView } from '../../state/select.js';
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
 * Whether the answer is from now for a couple of whom you have stopped and your partner stops later — read from the
 * answer's `apart` block, never worked out here, by the same reading the carry picks its map with (state/carry.js
 * cAnswerYouStopped). "What next?" then asks about your partner, and the links carry "I've already stopped"
 * (CARRY_C_YOU_STOPPED; couples-different-years.md 5.4).
 */
export const partnerStillWorking = cAnswerYouStopped;

/**
 * A "still working?" link to question A or B. Once that question is open (step 4's joining up) it carries C's figures
 * across (draft/carry, src/v7/state/carry.js) and opens its numbers step at the first box left to fill
 * (screens-A-B.md 5; step 4 brief conflict 46); until then it is the honest "not in the preview yet" link. About your
 * partner (`partner`), there is no box left to fill: it opens on the numbers as they are.
 */
const OPENS = { a: () => href.step('a', 'numbers', 'stop.age'), b: () => href.step('b', 'numbers', 'you.payIn.total') };
function ToSaver({ q, dispatch, partner = false, children }) {
  const open = frontDoor().some((x) => x.id === q && x.built);
  if (!open) return <LinkButton href={href.soon(q)}>{children}</LinkButton>;
  return <LinkButton testid={`c.next.${q}`} href={partner ? href.step(q, 'numbers') : OPENS[q]()} onClick={() => dispatch({ type: 'draft/carry', from: 'c', to: q })}>{children}</LinkButton>;
}

/** Words with figures in their {slots}: the slots are drawn (Money), the rest is text. */
function slotted(text, slots) {
  return String(text).split(/(\{\w+\})/).filter((t) => t !== '').map((t, i) => {
    const m = /^\{(\w+)\}$/.exec(t);
    return m && m[1] in slots ? <span key={i} class="slot">{slots[m[1]]}</span> : t;
  });
}

/**
 * Under the slider while it sits on an amount other than the level's: "At Balanced you could take about £1,920 a month."
 * and "Back to £1,920", which empties the take box — the slider and the page return to the level's amount. Nothing is
 * written anywhere but the box.
 */
function TakeTried({ tried, result, dispatch }) {
  const amount = () => <Money source={result} k={tried.key} />;
  return (
    <div class="take-solved" data-testid="c.answer.solved">
      <p class="take-solved-line">{slotted(C.answer.solvedLine[tried.level] || C.answer.solvedLine.balanced, { amount: amount() })}</p>
      <Button testid="c.answer.back" kind="plain" onClick={() => dispatch({ type: 'draft/set', q: 'c', path: 'take', value: '' })}>
        <span class="btn-words">{slotted(C.answer.backTo, { amount: amount() })}</span>
      </Button>
    </div>
  );
}

/** "What next?": the two prompts, "Already stopped?" first for someone already drawing their State Pension. "Keep this as a plan" follows. */
function WhatNext({ result, dispatch }) {
  const partner = partnerStillWorking(result);
  const working = (
    <div class="next-group" key="working" data-testid="c.next.working">
      <p class="next-prompt">{partner ? C.answer.partnerWorking : C.answer.stillWorking}</p>
      <ul class="next-list">
        <li><ToSaver q="a" partner={partner} dispatch={dispatch}>{partner ? C.answer.whenPartnerStop : C.answer.whenStop}</ToSaver></li>
        <li><ToSaver q="b" partner={partner} dispatch={dispatch}>{partner ? C.answer.partnerSavingEnough : C.answer.savingEnough}</ToSaver></li>
      </ul>
    </div>
  );
  const stopped = (
    <div class="next-group" key="stopped" data-testid="c.next.stopped">
      <p class="next-prompt">{C.answer.stopped}</p>
      <ul class="next-list">
        <li><LinkButton testid="c.next.d" href={href.step('d', 'numbers')}>{C.answer.willItLast}</LinkButton></li>
      </ul>
    </div>
  );
  return (
    <section class="block next" data-region="next" aria-labelledby="next-title">
      <h2 id="next-title">{C.answer.nextTitle}</h2>
      {alreadyStopped(result) ? [stopped, working] : [working, stopped]}
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
        {FIELDS.filter((f) => need.has(f.path) && f.group !== 'shape').map((f) => <Field key={f.path} form={form} path={f.path} dispatch={dispatch} />)}
        {/* a problem in the spending shape's steps: its block, open, with the sentence under the box */}
        {wrong.some((p) => isShapePath('c', p)) && <StepsField state={state} q="c" dispatch={dispatch} forceOpen />}
        <div class="actions-row">
          <Button testid="c.action.show" kind="primary" type="submit">{C.buttons.show}</Button>
          <LinkButton href={href.step('c', 'numbers')}>{C.buttons.otherQuestionsFirst}</LinkButton>
        </div>
        <p class="note">{C.answer.sensible}</p>
      </AskForm>
    );
  } else if (answer.status === 'failed' || (result && result.status === 'invalid')) {
    body = <Problem form={form} dispatch={dispatch} stale={!!staleView(state)} />;
  } else if (!result) {
    body = null;
  } else {
    const stale = answer.status === 'working' || (form.parsed.ok && !isCurrent(state, 'c'));
    const first = answer.status === 'first' && !stale;
    // the block reads for the amount being tried when the answer was worked out for one other than the level's (the
    // answer's own figures, its take sentences where the level's stand: state/pictures.js takeReading); else as always
    const reading = takeReading(state);
    const shown = reading ? reading.view : result;
    const s = shown.sentences || {};
    const open = (id) => state.ui.open.includes(id);
    // The "nothing to draw on" sentence stands where the headline would be, so the warning that says the same is not drawn twice.
    const shownWarnings = (result.warnings || []).filter((w) => !(s.nothing && w.id === 'nothing-to-draw'));
    const warnings = shownWarnings.length > 0 && (
      <ul class="warnings">
        {shownWarnings.map((w) => <li key={w.id} data-warning-id={w.id} class={`warning is-${w.severity}`}><Sentence as="span" s={w} source={result} /></li>)}
      </ul>
    );
    const assumed = (result.assumed || []).length > 0 && <Assumed result={result} open={open('assumed')} all={open('allAssumed')} dispatch={dispatch} />;
    const madeOf = <MadeOf result={shown} open={open('madeOf')} dispatch={dispatch} />;
    // the slider: the amount being tried. What it does is the block below (its headline, when the block reads for it);
    // under the slider, while it sits on another amount than the level's, the level's amount and the way back to it
    const slider = answerSlider(state, 'c');
    const tried = slider ? takeTried(state) : null;
    // with no headline to read for it (no amount lasts at the level), the amount tried is said in the block: its chance
    // with the fixed-age line beside it
    const take = (s.takeChance || s.take) && (
      <div class="take-lines" data-testid="c.answer.take">
        <Sentence s={s.takeChance || s.take} source={result} class="take-line" />
        {s.takeChance && s.takeFixed && <Sentence s={s.takeFixed} source={result} class="take-line" />}
      </div>
    );
    // Money first taken at a later age: what goes in until then, said plainly under the figure ("Paying in £800 a month
    // until 67, rising with prices; the pot invested at Balanced … until then"), and what the pot could be by then.
    const payIn = s.payIn && <Sentence s={s.payIn} source={result} class="pay-in-line" data-testid="c.answer.payIn" />;
    const potThen = s.pot && <Sentence s={s.pot} source={result} class="pot-line" data-testid="c.answer.pot" />;
    // spending that changes with age (spending-shape.md 7.2 c.shape): "That is at the start. Then, as you set it: …"
    const shapeLine = s.shape && <Sentence s={s.shape} source={result} class="shape-line" data-testid="c.answer.shape" />;

    // the page around the answer (7.5.0): the slider (what if you took…?) above it, the three figures and the Keep line under
    // the headline; C draws no pot picture (the README gives it to B and D)
    const top = !s.none && s.head && s.line && !s.nothing && (
      <>
        <FigureTiles q="c" source={result} tiles={answerTiles(state, 'c')} countKey={tilesKey(state, 'c')} />
        <KeepLine state={state} q="c" />
      </>
    );
    body = (
      <>
        <AnswerSlider slider={slider} dispatch={dispatch} stale={stale}>{tried && <TakeTried tried={tried} result={result} dispatch={dispatch} />}</AnswerSlider>
        <div class={`answer${stale ? ' is-stale' : ''}`} data-region="answer" aria-live="polite" aria-busy={stale ? 'true' : 'false'}>
          {stale && <p class="updating" role="status">{C.answer.updating}</p>}
          {first && <p class="note first-figure">{C.answer.first}</p>}
          {s.none
            ? <><Sentence s={s.none} source={result} class="none" />{warnings}{take}{assumed}</>
            : s.head && s.line && !s.nothing
              ? (
                <Headline result={shown} k={reading ? 'take.perMonth' : null} afterLine={payIn || potThen || shapeLine ? <>{shapeLine}{payIn}{potThen}</> : null}
                  strip={<LevelStrip q="c" result={shown} dispatch={dispatch} words={C} />}>
                  {top}
                  {s.small && (
                    <div class="small-pot">
                      <Sentence s={s.small} source={result} />
                    </div>
                  )}
                  {warnings}
                  {madeOf}
                  {assumed}
                </Headline>
              )
              : <><Sentence s={s.nothing} source={result} class="nothing" />{warnings}{take}{result.status !== 'none' && madeOf}{assumed}</>}
        </div>
        <ShapeAnswer state={state} q="c" dispatch={dispatch} />
        <BudgetAgainstC state={state} />
        {/* "Try the bad years" (7.9.0): on a final answer, run on a press */}
        <StressStrip state={state} q="c" dispatch={dispatch} />
        <TryAChange state={state} form={form} result={result} dispatch={dispatch} />
        <WhatNext result={result} dispatch={dispatch} />
        <KeepPanel state={state} q="c" dispatch={dispatch} />
        <p class="full-detail"><LinkButton testid="c.action.fullDetail" kind="quiet" href={href.soon('e')}>{form.couple ? C.buttons.fullDetailCouple : C.buttons.fullDetail}</LinkButton></p>
      </>
    );
  }

  // the first answer waits behind the ring for its least time (Spinner.jsx HeldAnswer: a verdict never pops in at once)
  const working = !shortForm && !(answer.status === 'failed' || (result && result.status === 'invalid')) && !result;
  body = <HeldAnswer busy={working} working={<Working answer={answer} />}>{body}</HeldAnswer>;
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
