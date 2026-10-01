/**
 * A step that is on the rail but not built yet ("ways" on C; "keep" is built: save-as-plan.md): "This step is not in
 * the preview yet." with a link back to the question's answer. The rail stays, so nothing is a dead end.
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
  const step = words.steps[state.route.step] || C.steps.ways;
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
