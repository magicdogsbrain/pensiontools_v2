/**
 * A question with no steps of its own (build brief 2.4 #53; 7.0, research/v7/switch-readiness.md gate 3): one sentence and
 * a way on. E ("I have a plan. Test it.", and "Answer everything in full" from every question) points to "Your plans",
 * where a plan's own steps answer in full, and, for an answer worked out on this page, to keeping it as a plan (the page
 * says to); F is not answered here yet, nor on the classic planner, so its page sends nobody there.
 */
import { LinkButton, fill } from '../components/index.js';
import { href } from '../router/routes.js';
import { FRONT, SOON } from '../copy/common.js';
import { keepableAnswers } from '../state/select.js';

/** A question's words as a short name: C's is its second half ("What is that a month?"). */
const askOf = (id) => { const x = FRONT.questions.find((y) => y.id === id); return x.then || x.ask; };

export function Soon(state) {
  const q = FRONT.questions.find((x) => x.id === state.route.q) || FRONT.questions[0];
  const e = q.id === 'e';
  const keep = e ? keepableAnswers(state) : [];
  return {
    question: null,
    rail: false,
    full: false,
    content: (
      <>
        <h1 tabIndex={-1}>{q.then ? `${q.ask} ${q.then}` : q.ask}</h1>
        <p class="lead">{e ? SOON.e.line : SOON.line}</p>
        <div class="actions-row">
          {keep.map((k) => (
            <LinkButton key={k} testid={`soon.keep.${k}`} kind="primary" href={href.step(k, 'keep')}>{keep.length === 1 ? SOON.e.keep : fill(SOON.e.keepFrom, { ask: askOf(k) })}</LinkButton>
          ))}
          {e && <LinkButton testid="soon.plans" kind={keep.length ? undefined : 'primary'} href={href.plans()}>{SOON.e.plans}</LinkButton>}
          <LinkButton testid="soon.back" kind={e ? undefined : 'primary'} href={href.front()}>{SOON.back}</LinkButton>
        </div>
      </>
    )
  };
}
