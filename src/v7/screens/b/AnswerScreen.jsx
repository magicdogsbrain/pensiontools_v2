/**
 * Question B, step 2 — "Am I on course, and what should I pay in?" (screens-A-B.md 4.2, 4.4, 6; step 4 brief 4.8,
 * 4.13; one test everywhere, brief section 10), said straight (research/saving-enough-and-check-in.md 2–3, release R1).
 *
 * The order is the answer's: first the verdict — its band in words ("Not on course for £1,810 a month from 63"), the
 * first sentence that says how it stands paying in as now AND what share of pay (or pounds) would put you on course,
 * the 3-in-4 line in the Close band, what you could spend from the stop with the State Pension and how far that falls
 * short of the aim, and the bad case at the aim; then "what would be enough" (the figure, what lands a month and until
 * when, its own count, the other chance) and the other ways beside it (Levers: stop later, spend less, a one-off sum, …);
 * then the guide number in a smaller block of its own (the pot that, with exactly that at the stop, pays the spending in 9
 * futures out of 10), never a second headline. "The State Pension covers it" keeps its own headline in words. Then what
 * the pot could be by the stop age, what was assumed; try a change; what next. Computes nothing.
 */
import { Sentence, Pots, Levers, Assumed, SaverTryAChange, Working, HeldAnswer, Problem, Retired, isRetired, LinkButton, SpendLine, KeepPanel, ShapeAnswer, AnswerSlider, FigureTiles, PotLife, KeepLine } from '../../components/index.js';
import { answerSlider, answerTiles, tilesKey, potPicture } from '../../state/select.js';
import { PICTURE } from '../../copy/picture.js';
import { href } from '../../router/routes.js';
import { ADVICE_SHORT } from '../../copy/common.js';
import { B } from '../../copy/b.js';
import { saverFrame, ShortForm, Warnings, AnswerRegion, ToC, aboutPartner } from '../a/AnswerScreen.jsx';

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

/**
 * "What next?" for B: A with the figures carried; C from the stop age (C is asked from what is typed — the pot now,
 * what goes in, the savings — never from a pot worked out here), not before a pension can be touched. "Save this as a
 * plan" follows it, at the foot of the answer. An answer about your partner ("I've already stopped") hands over in its
 * own words: the reducer carries "I've already stopped" with it (state/carry.js carryFor; couples-different-years.md 5.4).
 */
function WhatNext({ result, dispatch, partner }) {
  const t = B.answer;
  const carry = (to) => () => dispatch({ type: 'draft/carry', from: 'b', to });
  return (
    <section class="block next" data-region="next" aria-labelledby="next-title">
      <h2 id="next-title">{t.nextTitle}</h2>
      <ul class="next-list">
        <li><LinkButton testid="b.next.a" href={href.step('a', 'numbers')} onClick={carry('a')}><span>{B.buttons[partner ? 'next.a.partner' : 'next.a']}</span></LinkButton></li>
        <ToC q="b" result={result} k="stop.age" dispatch={dispatch} words={t} partner={partner} />
      </ul>
    </section>
  );
}

const VERDICTS = ['yes', 'close', 'no'];

function Answer({ state, dispatch, frame }) {
  const { form, answer, result, stale, first } = frame;
  const s = result.sentences || {};
  const open = (id) => state.ui.open.includes(id);
  const band = result.verdict && result.verdict.band;
  // the verdict headline: every answer but "the State Pension covers it", which says so in a headline of its own words
  const verdict = !!(s.verdictHead && s.verdictLine && s.atAim && VERDICTS.includes(band));
  const hasNumber = !!(s.head && s.line && result.number && isNum(result.number.careful) && result.number.careful > 0);
  const noPot = !hasNumber && !!(s.head && s.line) && (result.status === 'guaranteed-only' || result.number === null || result.number.careful === 0);
  const sameAsLine = (x) => !!(x && s.line && x.text === s.line.text);
  const onCourse = result.onCourse === true;
  // spending that changes with age (spending-shape.md 7.2): said once, after the first headline's sentence that names the spending
  const shapeLine = s.shape && <Sentence s={s.shape} source={result} class="shape-line" data-testid="b.answer.shape" />;
  // the page around the answer (7.5.0, mock-up screen 2): the three figures, the pot becoming theirs, the Keep line — straight
  // under the verdict and its first sentence, so the picture is near the slider that moves it
  const top = (
    <>
      <FigureTiles q="b" source={result} tiles={answerTiles(state, 'b')} countKey={tilesKey(state, 'b')} />
      <PotLife picture={potPicture(state, 'b')} words={PICTURE.pot} />
      <KeepLine state={state} q="b" />
    </>
  );
  const verdictHead = verdict && (
    <section class="headline" data-headline="verdict" aria-labelledby="answer-figure">
      <div class={`band verdict is-${band}`} data-verdict={band}>
        <Sentence s={s.verdictHead} source={result} class="figure" id="answer-figure" />
      </div>
      <Sentence s={s.verdictLine} source={result} class="line" data-sentence="verdict" />
      {top}
      {s.verdictFour && <Sentence s={s.verdictFour} source={result} class="four" data-testid="b.verdict.four" />}
      {s.income && <Sentence s={s.income} source={result} class="income" data-testid="b.verdict.income" />}
      {shapeLine}
      <Sentence s={s.atAim} source={result} class="bad" />
      <p class="advice">{ADVICE_SHORT}</p>
      <Warnings result={result} />
    </section>
  );
  // what would be enough (3.5): straight under the verdict; its "Try" is the "Pay in more" way below it
  const enough = verdict && s.enoughHead && (
    <section class="block enough" data-enough={result.enough ? result.enough.how : undefined} aria-labelledby="enough-title">
      <h2 id="enough-title"><Sentence s={s.enoughHead} source={result} as="span" /></h2>
      {s.enoughLine && <Sentence s={s.enoughLine} source={result} class="enough-line" data-testid="b.enough.line" />}
      {s.enoughFour && <Sentence s={s.enoughFour} source={result} class="enough-four" data-testid="b.enough.four" />}
      {s.enoughPaused && <Sentence s={s.enoughPaused} source={result} class="note" data-testid="b.enough.paused" />}
      {s.enoughMatch && <Sentence s={s.enoughMatch} source={result} class="note" data-testid="b.enough.match" />}
    </section>
  );
  // the guide number, a smaller block of its own and never a second headline (the reviewers' finding, 1 Oct 2026): with
  // the sentence that says why the pot and the pay-in are not to be added up; no pension pot needed, or none enough, in words
  const guide = verdict && (hasNumber || noPot) && (
    <section class="block guide" data-guide={hasNumber ? 'number.careful' : 'none'} aria-labelledby="guide-title">
      <h2 id="guide-title" class="guide-title">{B.answer.guideTitle}</h2>
      <Sentence s={s.head} source={result} class="guide-figure" />
      <Sentence s={s.sub} source={result} class="figure-sub" />
      <Sentence s={s.line} source={result} class="line" data-sentence={hasNumber ? 'number.careful' : undefined} />
      <Sentence s={s.bad} source={result} class="bad" />
      {hasNumber && s.guide && <Sentence s={s.guide} source={result} class="guide-why" data-testid="b.guide.why" />}
      {s.outside && <Sentence s={s.outside} source={result} class="outside" />}
    </section>
  );
  // "The State Pension covers it": no verdict to say, the headline in its own words, as before
  const covered = !verdict && noPot && (
    <section class="headline" data-testid="b.headline.noPot" aria-labelledby="answer-figure">
      <div class="band">
        <Sentence s={s.head} source={result} class="figure" id="answer-figure" />
        <Sentence s={s.sub} source={result} class="figure-sub" />
      </div>
      <Sentence s={s.line} source={result} class="line" />
      {shapeLine}
      <Sentence s={s.bad} source={result} class="bad" />
      {s.outside && <Sentence s={s.outside} source={result} class="outside" />}
      <p class="advice">{ADVICE_SHORT}</p>
      <Warnings result={result} />
    </section>
  );
  return (
    <>
      {/* the slider: the one control, above the answer it moves (never greyed while the answer is worked out again) */}
      <AnswerSlider slider={answerSlider(state, 'b')} dispatch={dispatch} />
      <AnswerRegion words={B} stale={stale} first={first}>
        {verdictHead}
        {enough}
        {verdict && !onCourse && <Levers result={result} dispatch={dispatch} />}
        {guide || covered || <>{s.nothing && <Sentence s={s.nothing} source={result} class="nothing" />}{!verdict && <Warnings result={result} />}</>}
        {!verdict && top}
        {noPot && s.nothing && !sameAsLine(s.nothing) && <Sentence s={s.nothing} source={result} class="nothing" />}
        {!verdict && !onCourse && answer.status === 'first' && !s.none && !s.have && <p class="working-note" role="status">{B.answer.payInWorking}</p>}
        {s.none && !(noPot && sameAsLine(s.none)) && <Sentence s={s.none} source={result} class="none" />}
        {s.have && <Sentence s={s.have} source={result} class="have" />}
        <Pots result={result} q="b" />
        {/* the verdict's first sentence says the whole-life count; without a verdict the line says it */}
        {!verdict && s.wholeLife && <Sentence s={s.wholeLife} source={result} class="check-line" />}
        {!verdict && !onCourse && <Levers result={result} dispatch={dispatch} />}
        {(result.assumed || []).length > 0 && <Assumed q="b" result={result} open={open('assumed')} all={open('allAssumed')} dispatch={dispatch} />}
      </AnswerRegion>
      <ShapeAnswer state={state} q="b" dispatch={dispatch} />
      <SpendLine state={state} q="b" dispatch={dispatch} />
      <SaverTryAChange q="b" state={state} form={form} result={result} dispatch={dispatch} />
      <WhatNext result={result} dispatch={dispatch} partner={aboutPartner(state, 'b', result)} />
      <KeepPanel state={state} q="b" dispatch={dispatch} />
      <p class="full-detail"><LinkButton testid="b.action.fullDetail" kind="quiet" href={href.soon('e')}>{form.couple ? B.buttons.fullDetailCouple : B.buttons.fullDetail}</LinkButton></p>
    </>
  );
}

export function AnswerScreen(state, dispatch) {
  if (isRetired(state, 'b')) return { question: 'b', rail: true, full: false, view: 'retired', content: <Retired q="b" dispatch={dispatch} state={state} /> };
  const frame = saverFrame(state, 'b');
  let body;
  if (frame.kind === 'short') body = <ShortForm form={frame.form} dispatch={dispatch} need={B.answer.needFive} state={state} />;
  else if (frame.kind === 'failed') body = <Problem form={frame.form} dispatch={dispatch} />;
  else if (frame.kind !== 'working') body = <Answer state={state} dispatch={dispatch} frame={frame} />;
  // the first answer waits behind the ring for its least time (Spinner.jsx HeldAnswer: a verdict never pops in at once)
  const working = frame.kind === 'working';
  body = <HeldAnswer busy={working} working={<Working answer={frame.answer} />}>{working ? null : body}</HeldAnswer>;
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
