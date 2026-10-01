/**
 * Question B, step 2 — "Am I on course, and what should I pay in?" (screens-A-B.md 4.2, 4.4, 6; step 4 brief 4.8,
 * 4.13; one test everywhere, brief section 10). One headline, with its band, its sentence and its bad-case line: when
 * short, what to pay in (B's answer: what makes the money last in 9 futures out of 10), with the number after it in a
 * smaller block as the guide it is (the pot that, with exactly that at the stop, pays the spending in 9 futures out of
 * 10); on course, the number's headline; no pension pot needed, or none enough: a headline in words. Then what the pot
 * could be by the stop age, the whole-life line, the ways to make it fit (not when on course), what was assumed; try a
 * change; what next. Computes nothing.
 */
import { Sentence, Pots, Levers, Assumed, SaverTryAChange, Working, Problem, Retired, isRetired, LinkButton, SpendLine, KeepPanel } from '../../components/index.js';
import { href } from '../../router/routes.js';
import { ADVICE_SHORT } from '../../copy/common.js';
import { B } from '../../copy/b.js';
import { saverFrame, ShortForm, Warnings, AnswerRegion, ToC } from '../a/AnswerScreen.jsx';

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

/**
 * "What next?" for B: A with the figures carried; C from the stop age (C is asked from what is typed — the pot now,
 * what goes in, the savings — never from a pot worked out here), not before a pension can be touched. "Save this as a
 * plan" follows it, at the foot of the answer.
 */
function WhatNext({ result, dispatch }) {
  const t = B.answer;
  const carry = (to) => () => dispatch({ type: 'draft/carry', from: 'b', to });
  return (
    <section class="block next" data-region="next" aria-labelledby="next-title">
      <h2 id="next-title">{t.nextTitle}</h2>
      <ul class="next-list">
        <li><LinkButton testid="b.next.a" href={href.step('a', 'numbers')} onClick={carry('a')}><span>{B.buttons['next.a']}</span></LinkButton></li>
        <ToC q="b" result={result} k="stop.age" dispatch={dispatch} words={t} />
      </ul>
    </section>
  );
}

function Answer({ state, dispatch, frame }) {
  const { form, answer, result, stale, first } = frame;
  const s = result.sentences || {};
  const open = (id) => state.ui.open.includes(id);
  // The number headline is drawn only for a number above £0. "No pension pot is needed" (the savings and State Pension
  // pay for it), the State Pension alone covering it, or no pot up to the most we try, is said in a headline of its own
  // words, with no figure to key.
  const hasNumber = !!(s.head && s.line && result.number && isNum(result.number.careful) && result.number.careful > 0);
  const noPot = !hasNumber && !!(s.head && s.line) && (result.status === 'guaranteed-only' || result.number === null || result.number.careful === 0);
  const sameAsLine = (x) => !!(x && s.line && x.text === s.line.text);
  const onCourse = result.onCourse === true;
  const payIn = !onCourse && s.payInHead && s.payInLine && result.payIn && isNum(result.payIn.needed);
  // The pay-in is B's answer (one test everywhere): when short, it is the one headline, and the number — a guide, the
  // pot that with exactly that at the stop pays the spending in 9 futures out of 10 — follows in a smaller block of its
  // own, never a second headline card, with the sentence that says why the two are not to be added up (the reviewers'
  // finding, 1 Oct 2026). On course, or no pay-in to name, the number's block is the headline. The warnings sit in the
  // first headline on the screen.
  const numberHead = (hasNumber || noPot) && (payIn && hasNumber
    ? (
      <section class="block guide" data-guide="number.careful" aria-labelledby="guide-title">
        <h2 id="guide-title" class="guide-title">{B.answer.guideTitle}</h2>
        <Sentence s={s.head} source={result} class="guide-figure" />
        <Sentence s={s.sub} source={result} class="figure-sub" />
        <Sentence s={s.line} source={result} class="line" data-sentence="number.careful" />
        <Sentence s={s.bad} source={result} class="bad" />
        {s.guide && <Sentence s={s.guide} source={result} class="guide-why" data-testid="b.guide.why" />}
        {s.outside && <Sentence s={s.outside} source={result} class="outside" />}
      </section>
    )
    : (
      <section class="headline" data-headline={hasNumber ? 'number.careful' : undefined} data-testid={noPot ? 'b.headline.noPot' : undefined} aria-labelledby="answer-figure">
        <div class="band">
          <Sentence s={s.head} source={result} class="figure" id="answer-figure" />
          <Sentence s={s.sub} source={result} class="figure-sub" />
        </div>
        <Sentence s={s.line} source={result} class="line" data-sentence={hasNumber ? 'number.careful' : undefined} />
        <Sentence s={s.bad} source={result} class="bad" />
        {hasNumber && s.guide && <Sentence s={s.guide} source={result} class="guide-why" data-testid="b.guide.why" />}
        {s.outside && <Sentence s={s.outside} source={result} class="outside" />}
        <p class="advice">{ADVICE_SHORT}</p>
        {!payIn && <Warnings result={result} />}
      </section>
    ));
  const payInHead = payIn && (
    <section class="headline" data-headline="payIn.needed" aria-labelledby="pay-in-figure">
      <div class="band">
        <Sentence s={s.payInHead} source={result} class="figure" id="pay-in-figure" />
        <Sentence s={s.payInSub} source={result} class="figure-sub" />
      </div>
      <Sentence s={s.payInLine} source={result} class="line" data-sentence="payIn.needed" />
      <Sentence s={s.payInBad} source={result} class="bad" />
      <p class="advice">{ADVICE_SHORT}</p>
      <Warnings result={result} />
    </section>
  );
  return (
    <>
      <AnswerRegion words={B} stale={stale} first={first}>
        {payInHead}
        {numberHead || <>{s.nothing && <Sentence s={s.nothing} source={result} class="nothing" />}{!payIn && <Warnings result={result} />}</>}
        {noPot && s.nothing && !sameAsLine(s.nothing) && <Sentence s={s.nothing} source={result} class="nothing" />}
        {!payIn && !onCourse && answer.status === 'first' && !s.none && !s.have && <p class="working-note" role="status">{B.answer.payInWorking}</p>}
        {s.none && !(noPot && sameAsLine(s.none)) && <Sentence s={s.none} source={result} class="none" />}
        {s.have && <Sentence s={s.have} source={result} class="have" />}
        <Pots result={result} q="b" />
        {s.wholeLife && <Sentence s={s.wholeLife} source={result} class="check-line" />}
        {!onCourse && <Levers result={result} dispatch={dispatch} />}
        {(result.assumed || []).length > 0 && <Assumed q="b" result={result} open={open('assumed')} all={open('allAssumed')} dispatch={dispatch} />}
      </AnswerRegion>
      <SpendLine state={state} q="b" dispatch={dispatch} />
      <SaverTryAChange q="b" state={state} form={form} result={result} dispatch={dispatch} />
      <WhatNext result={result} dispatch={dispatch} />
      <KeepPanel state={state} q="b" dispatch={dispatch} />
      <p class="full-detail"><LinkButton testid="b.action.fullDetail" kind="quiet" href={href.soon('e')}>{form.couple ? B.buttons.fullDetailCouple : B.buttons.fullDetail}</LinkButton></p>
    </>
  );
}

export function AnswerScreen(state, dispatch) {
  if (isRetired(state, 'b')) return { question: 'b', rail: true, full: false, view: 'retired', content: <Retired q="b" dispatch={dispatch} /> };
  const frame = saverFrame(state, 'b');
  let body;
  if (frame.kind === 'short') body = <ShortForm form={frame.form} dispatch={dispatch} need={B.answer.needFive} />;
  else if (frame.kind === 'failed') body = <Problem form={frame.form} dispatch={dispatch} />;
  else if (frame.kind === 'working') body = <Working answer={frame.answer} />;
  else body = <Answer state={state} dispatch={dispatch} frame={frame} />;
  return {
    question: 'b',
    rail: true,
    full: true,
    content: (
      <>
        <h1 tabIndex={-1}>{B.steps.answer.label}</h1>
        {body}
      </>
    )
  };
}
