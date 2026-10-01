/**
 * "Save this as a plan" (research/v7/save-as-plan.md, "What the person sees"; Contract C.2, C.4): at the foot of every
 * answer of C, A and B, and on each question's own step. Draws; works nothing out — whether the answer can be saved,
 * the suggested name and the check of what was typed are the shell's (state/select.js keepView).
 *
 *   <KeepPanel state q dispatch heading />
 *
 * The name box is filled with the suggestion (never "My plan") and can be changed. "Save as a plan" dispatches
 * keep/save; the effect writes the plan seed to this browser and opens the planner, which makes a NEW plan. Coming
 * back: "Saved as '…'. Try something else and save that too." — only on the planner's word that it made the plan; or
 * that the figures are waiting there; or, on its word, that no plan was made ("Not now", figures it could not use).
 * No figure ever goes into an address: the link to the planner is ../#new-plan.
 */
import { keepView } from '../state/select.js';
import { Button, LinkButton } from './Button.jsx';
import { KEEP } from '../copy/keep.js';

const fill = (text, values) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in values ? values[k] : m));
export const PLANNER_LINK = '../#new-plan';
const BOX_PROBLEMS = ['empty', 'tooLong'];

export function KeepPanel({ state, q, dispatch, heading = true }) {
  const v = keepView(state, q);
  const id = `${q}.keep.name`;
  const boxProblem = BOX_PROBLEMS.includes(v.problem) ? v.problem : null;
  const otherProblem = v.problem && !boxProblem ? v.problem : null;
  const described = boxProblem ? `${id}.error` : `${id}.help`;
  const titleId = `${q}-keep-title`;
  return (
    <section class="block keep" data-region="keep" data-keep={v.can ? 'open' : v.why} aria-labelledby={heading ? titleId : undefined}>
      {heading && <h2 id={titleId}>{KEEP.title}</h2>}
      {v.sent && v.back === 'taken' && <p class="notice saved" role="status" data-testid={`${q}.keep.saved`}>{fill(KEEP.saved, { name: v.sent.name })}</p>}
      {v.sent && (v.back === 'declined' || v.back === 'notMade') && <p class="notice not-saved" role="status" data-testid={`${q}.keep.notSaved`}>{fill(KEEP[v.back], { name: v.sent.name })}</p>}
      {v.sent && v.back === 'waiting' && (
        <div class="notice waiting" data-testid={`${q}.keep.waiting`}>
          <p>{fill(KEEP.waiting, { name: v.sent.name })}</p>
          <p><LinkButton testid={`${q}.keep.open`} kind="quiet" href={PLANNER_LINK}>{KEEP.openPlanner}</LinkButton></p>
        </div>
      )}
      {v.can
        ? (
          <form class="keep-form" noValidate onSubmit={(e) => { e.preventDefault(); dispatch({ type: 'keep/save', q }); }}>
            <div class={`field field-name${boxProblem ? ' has-error' : ''}`}>
              <label for={id}>{KEEP.nameLabel}</label>
              <div class="box">
                <input type="text" inputmode="text" autocomplete="off" spellcheck={false} id={id} data-testid={id} name={id} value={v.name}
                  aria-invalid={boxProblem ? 'true' : undefined} aria-describedby={described}
                  onInput={(e) => dispatch({ type: 'keep/name', q, value: e.currentTarget.value })} />
              </div>
              {!boxProblem && <p class="help" id={`${id}.help`}>{KEEP.nameHelp}</p>}
              {boxProblem && <p class="error" id={`${id}.error`} data-error-for={id}>{KEEP.problems[boxProblem]}</p>}
            </div>
            {otherProblem && <p class="notice keep-problem" role="alert" data-testid={`${q}.keep.problem`}>{KEEP.problems[otherProblem]}</p>}
            <div class="actions-row">
              <Button testid={`${q}.action.save`} kind="primary" type="submit" aria-busy={v.saving ? 'true' : undefined}>{v.saving ? KEEP.saving : KEEP.save}</Button>
            </div>
          </form>
        )
        : <p class="note" data-testid={`${q}.keep.why`}>{KEEP.why[v.why] || KEEP.why.noAnswer}</p>}
      <p class="note">{KEEP.note}</p>
      <p class="note">{KEEP.privacy}</p>
    </section>
  );
}
