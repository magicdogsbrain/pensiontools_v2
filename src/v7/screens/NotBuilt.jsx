/**
 * A step that is on the rail but not built in this slice ("ways", "keep"): "This step is not in the preview yet."
 * with a link back to the answer. The rail stays, so nothing is a dead end.
 */
import { LinkButton } from '../components/index.js';
import { href } from '../router/routes.js';
import { C } from '../copy/c.js';
import { NOT_BUILT } from '../copy/common.js';

export function NotBuilt(state) {
  const step = C.steps[state.route.step] || C.steps.ways;
  return {
    question: 'c',
    rail: true,
    full: false,
    content: (
      <>
        <h1 tabIndex={-1}>{step.label}</h1>
        <p class="lead">{NOT_BUILT.line}</p>
        <div class="actions-row">
          <LinkButton kind="primary" href={href.step('c', 'answer')}>{NOT_BUILT.back}</LinkButton>
        </div>
      </>
    )
  };
}
