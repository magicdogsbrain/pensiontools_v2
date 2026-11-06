/**
 * Question D, step 1 — "What have you got, and what do you take?" (research/v7/answer-D.md 3.2–3.3; road-to-7.md step 7).
 * One form: whether you have stopped, your age, what is left in your pension pots, the tax-free part (one tap, never a
 * guess), your State Pension and any final-salary pension, your savings and how they grow, and what you take a month —
 * then "Will it last?" (draft/ask), which asks for anything missing here and opens the answer. "Add a partner" and "Add
 * more detail" open on this same step. Computes nothing: every box is drawn from SCHEMA_D and the state by Field.
 *
 * The way in (answer-D.md 3.10): someone with a plan in the account (or this window) is told so at the top, with a link
 * to each plan's own test — "Does it last?" — where the same three levers run on the plan itself; the form below is the
 * test afresh. Which plans there are is the shell's reading (state/select.js dWayIn); this screen only links.
 *
 * Still working? "Not yet" under "Have you stopped work?" says, in that box's own sentence, that "When can I afford to
 * stop work?" is the question for you — the form never bounces anyone, and never hides what it holds.
 */
import { AskForm, Carried, formView, focusField, Button, LinkButton } from '../../components/index.js';
import { LayoutField } from '../a/NumbersScreen.jsx';
import { dWayIn } from '../../state/select.js';
import { href } from '../../router/routes.js';
import { D } from '../../copy/d.js';

/** The top-level fields of D's one form, in the order drawn. Each one's dependants are drawn inside it. */
export const LAYOUT_D = {
  you: ['stopped', 'you.age', 'you.pot', 'you.taxFreeTaken', 'you.statePension.kind', 'you.finalSalary.has', 'savings', 'isaGrowth', 'spend.kind'],
  partner: ['partner.age', 'partner.pot', 'partner.stopped', 'partner.taxFreeTaken', 'partner.statePension.kind', 'partner.finalSalary.has'],
  more: ['risk', 'charge', 'endAge']
};

const fill = (text, values) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in values ? values[k] : m));

/** "You have a plan already": the link to each plan's own test (answer-D.md 3.10). Nothing when none is known of. */
export function WayIn({ state }) {
  const w = dWayIn(state);
  if (!w.plans.length) return null;
  return (
    <section class="block way-in notice" data-testid="d.wayIn" aria-labelledby="way-in-title">
      <h2 id="way-in-title" class="sr-only">{D.steps.answer.label}</h2>
      <p>{w.plans.length === 1 ? D.numbers.hasPlan : D.numbers.hasPlans}</p>
      <ul class="next-list">
        {w.plans.map((p) => (
          <li key={p.id}><LinkButton testid={`d.wayIn.${p.id}`} kind="primary" href={href.plan(p.id, 'lasts')}><span>{fill(D.buttons.openPlan, { name: p.name })}</span></LinkButton></li>
        ))}
      </ul>
      <p class="note">{D.numbers.orAfresh}</p>
    </section>
  );
}

export function NumbersScreen(state, dispatch) {
  const q = 'd';
  const form = formView(state, q);
  const words = form.copy;
  const { couple, moreOpen } = form;
  const set = (path, value) => dispatch({ type: 'draft/set', q, path, value });
  const toggleMore = () => dispatch({ type: 'ui/toggle', id: 'more' });
  const addPartner = (e) => {
    const el = e.currentTarget.form;
    set('household', 'couple');
    if (el) focusField(el, 'partner.age', q);
  };
  const draw = (paths) => paths.map((p) => <LayoutField key={p} form={form} path={p} dispatch={dispatch} layout={LAYOUT_D} />);
  return {
    question: q,
    rail: true,
    full: false,
    content: (
      <>
        <h1 tabIndex={-1}>{words.steps.numbers.label}</h1>
        <WayIn state={state} />
        <p class="lead">{words.numbers.intro}</p>
        <Carried form={form} />
        <AskForm form={form} dispatch={dispatch} data-region="form">
          <div class="person person-you">{draw(LAYOUT_D.you)}</div>

          {couple && (
            <section class="block partner" aria-labelledby="partner-title">
              <div class="block-head">
                <h2 id="partner-title">{words.numbers.partnerTitle}</h2>
                <Button testid={`${q}.action.removePartner`} kind="quiet" data-focus-for={`${q}.household`} onClick={() => set('household', 'single')}>{words.buttons.removePartner}</Button>
              </div>
              <div class="person person-partner">{draw(LAYOUT_D.partner)}</div>
              <p class="note">{words.numbers.partnerDone}</p>
            </section>
          )}

          <div class="actions-row">
            {!couple && <Button testid={`${q}.action.addPartner`} data-focus-for={`${q}.household`} onClick={addPartner}>+ {words.buttons.addPartner}</Button>}
            <Button testid={`${q}.action.moreDetail`} aria-expanded={moreOpen ? 'true' : 'false'} aria-controls={moreOpen ? 'more-detail' : undefined} onClick={toggleMore}>
              {moreOpen ? words.buttons.hideDetail : `+ ${words.buttons.moreDetail}`}
            </Button>
          </div>

          {moreOpen && (
            <section class="block more" id="more-detail" aria-labelledby="more-title">
              <div class="block-head">
                <h2 id="more-title">{words.numbers.moreTitle}</h2>
                <Button testid={`${q}.action.closeMore`} kind="quiet" onClick={toggleMore}>{words.buttons.closeMore}</Button>
              </div>
              {draw(LAYOUT_D.more)}
            </section>
          )}

          <p class="full-detail">
            <LinkButton testid={`${q}.action.fullDetail`} kind="quiet" href={href.soon('e')}>{couple ? words.buttons.fullDetailCouple : words.buttons.fullDetail}</LinkButton>
          </p>
          <div class="submit-row">
            <Button testid={`${q}.action.show`} kind="primary" type="submit">{words.buttons.show}</Button>
          </div>
          <p class="note">{words.numbers.stays}</p>
        </AskForm>
      </>
    )
  };
}
