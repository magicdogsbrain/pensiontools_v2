/**
 * Each question's own step "Save this as a plan?" (research/v7/save-as-plan.md; the `keep` step of rail-screens-
 * language.md 1.4–1.5): one line on what would be saved — the answer's own sentence — and the panel that is also at
 * the foot of the answer. With nothing to save yet it says so and leads back to the answer, which asks for anything
 * missing itself (rule R3). A's and B's retired view replaces it, as it does every step of theirs. Computes nothing.
 */
import { KeepPanel, Retired, isRetired, Sentence, LinkButton, stepLabel } from '../components/index.js';
import { keepView } from '../state/select.js';
import { href } from '../router/routes.js';
import { KEEP } from '../copy/keep.js';

/** The answer's own sentence that says what is being saved: C's and A's line, B's pay-in line (or its number's). */
const LINE = { c: (s) => s.line, a: (s) => s.line, b: (s) => s.payInLine || s.line };

export function keepScreen(q) {
  return function KeepScreen(state, dispatch) {
    if (q !== 'c' && isRetired(state, q)) return { question: q, rail: true, full: false, view: 'retired', content: <Retired q={q} dispatch={dispatch} /> };
    const v = keepView(state, q);
    const r = state.answers[q] && state.answers[q].result;
    const line = v.can && r && r.sentences ? LINE[q](r.sentences) : null;
    return {
      question: q,
      rail: true,
      full: false,
      content: (
        <>
          <h1 tabIndex={-1}>{stepLabel(state, q, 'keep')}</h1>
          <p class="lead">{KEEP.stepLead}</p>
          {line && <Sentence s={line} source={r} class="keep-summary" data-testid={`${q}.keep.summary`} />}
          <KeepPanel state={state} q={q} dispatch={dispatch} heading={false} />
          <div class="actions-row">
            <LinkButton testid={`${q}.keep.back`} href={href.step(q, 'answer')}>{KEEP.backToAnswer}</LinkButton>
          </div>
        </>
      )
    };
  };
}
