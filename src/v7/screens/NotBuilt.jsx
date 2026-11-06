/**
 * A step that is on the rail but not built yet: "This step is not here yet." with a link back to the question's answer.
 * The rail stays, so nothing is a dead end. No rail has such a step at 7.0 (C's "ways" left its rail: switch-readiness.md
 * gate 3; tests/v7/rail/rail.test.js holds every step built), so no address reaches this screen; it stays for a step
 * added before it is built.
 */
import { LinkButton } from '../components/index.js';
import { href } from '../router/routes.js';
import { C } from '../copy/c.js';
import { A } from '../copy/a.js';
import { B } from '../copy/b.js';
import { NOT_BUILT } from '../copy/common.js';

const COPY = { a: A, b: B, c: C };

export function NotBuilt(state) {
  const q = COPY[state.route.q] ? state.route.q : 'c';
  const words = COPY[q];
  const step = words.steps[state.route.step] || { label: words.title };
  return {
    question: q,
    rail: true,
    full: false,
    content: (
      <>
        <h1 tabIndex={-1}>{step.label}</h1>
        <p class="lead">{NOT_BUILT.line}</p>
        <div class="actions-row">
          <LinkButton kind="primary" href={href.step(q, 'answer')}>{q === 'c' ? NOT_BUILT.back : words.buttons.back}</LinkButton>
        </div>
      </>
    )
  };
}
