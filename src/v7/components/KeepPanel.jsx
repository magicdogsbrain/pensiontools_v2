/**
 * "Keep this as a plan" (research/v7/save-as-plan.md "What the person sees"; road-to-7.md step 7: the preview makes the
 * plan itself): at the foot of every answer of C, A, B and D, and on each question's own step. Draws; works nothing out —
 * whether the answer can be kept, the suggested name, the check of what was typed and whether a locked plan is in the
 * account (D's "separate plan") are the shell's (state/select.js keepView).
 *
 *   <KeepPanel state q dispatch heading />
 *
 * The name box is filled with the suggestion (never "My plan") and can be changed. "Keep as a plan" dispatches
 * keep/save; the one write file (effects/planWrite.js) makes a NEW plan in the account, or in this window without one,
 * and says so: "Kept as ‘…’ in your account." with "Lock this plan?" (the new plan's lock step) and "Your plans". D with a
 * locked plan in the account keeps a separate plan and offers no lock. Nothing is deleted; there is no Undo for a plan made.
 */
import { keepView } from '../state/select.js';
import { href } from '../router/routes.js';
import { Button, LinkButton } from './Button.jsx';
import { KEEP } from '../copy/keep.js';

const fill = (text, values) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in values ? values[k] : m));
const BOX_PROBLEMS = ['empty', 'tooLong'];

export function KeepPanel({ state, q, dispatch, heading = true }) {
  const v = keepView(state, q);
  const id = `${q}.keep.name`;
  const boxProblem = BOX_PROBLEMS.includes(v.problem) ? v.problem : null;
  const otherProblem = v.problem && !boxProblem ? v.problem : null;
  const described = boxProblem ? `${id}.error` : `${id}.help`;
  const titleId = `${q}-keep-title`;
  const made = v.made;
  return (
    <section class="block keep" data-region="keep" data-keep={v.can ? 'open' : v.why} aria-labelledby={heading ? titleId : undefined}>
      {heading && <h2 id={titleId}>{v.separate ? KEEP.titleSeparate : KEEP.title}</h2>}
      {made && (
        <div class="notice saved" role="status" data-testid={`${q}.keep.made`} data-plan-id={made.id}>
          <p>
            {fill(made.where === 'window' ? KEEP.made.inWindow : KEEP.made.inAccount, { name: made.name })}
            {made.partnerName ? ' ' + fill(KEEP.madePartner, { name: made.partnerName }) : ''}
            {made.separate ? ' ' + KEEP.madeSeparate : ''}
            {' '}{KEEP.tryAnother}
          </p>
          <p class="actions-row">
            {!made.separate && <LinkButton testid={`${q}.keep.lock`} kind="primary" href={href.plan(made.id, 'lock')}>{KEEP.lockThis}</LinkButton>}
            <LinkButton testid={`${q}.keep.plans`} kind="quiet" href={href.plans()}>{KEEP.toPlans}</LinkButton>
          </p>
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
            {otherProblem && <p class="notice keep-problem" role="alert" data-testid={`${q}.keep.problem`} data-problem={otherProblem}>{fill(KEEP.problems[otherProblem] || KEEP.problems.failed, { name: v.partnerKept || '' })}</p>}
            <div class="actions-row">
              <Button testid={`${q}.action.save`} kind="primary" type="submit" aria-busy={v.saving ? 'true' : undefined}>{v.saving ? KEEP.saving : v.separate ? KEEP.saveSeparate : KEEP.save}</Button>
            </div>
            {v.separate && <p class="note" data-testid={`${q}.keep.separate`}>{KEEP.separate}</p>}
          </form>
        )
        : <p class="note" data-testid={`${q}.keep.why`}>{KEEP.why[v.why] || KEEP.why.noAnswer}</p>}
      <p class="note">{KEEP.note}</p>
      <p class="note">{KEEP.privacy}</p>
    </section>
  );
}
