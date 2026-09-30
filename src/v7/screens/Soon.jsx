/**
 * A question that is not in the preview yet (build brief 2.4 #53): one sentence, a link to the current version,
 * and a way back.
 */
import { LinkButton } from '../components/index.js';
import { href } from '../router/routes.js';
import { FRONT, SOON, COMMON } from '../copy/common.js';

export function Soon(state) {
  const q = FRONT.questions.find((x) => x.id === state.route.q) || FRONT.questions[0];
  return {
    question: null,
    rail: false,
    full: false,
    content: (
      <>
        <h1 tabIndex={-1}>{q.then ? `${q.ask} ${q.then}` : q.ask}</h1>
        <p class="lead">{SOON.line}</p>
        <div class="actions-row">
          <LinkButton kind="primary" href={COMMON.links.current}>{SOON.current}</LinkButton>
          <LinkButton href={href.front()}>{SOON.back}</LinkButton>
        </div>
      </>
    )
  };
}
