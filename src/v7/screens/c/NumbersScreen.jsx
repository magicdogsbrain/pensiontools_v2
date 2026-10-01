/**
 * Question C, step 1 — "What have you got?" (rail-screens-language.md 2.2). The short form: two numbers to type,
 * "Are you still paying into this pension?" (the owner's report, 1 Oct 2026: the most likely situation, so on this
 * form, never under more detail — "Yes" opens your part and your employer's part inside it), and the settings that
 * start sensible; "Add a partner" and "Add more detail" open on this same step. Computes nothing: every box is drawn
 * from the input list (SCHEMA_C, in its order) and the state by Field.
 */
import { AskForm, Field, PersonBlock, formView, focusField, Button, LinkButton } from '../../components/index.js';
import { href } from '../../router/routes.js';
import { C } from '../../copy/c.js';

export function NumbersScreen(state, dispatch) {
  const form = formView(state);
  const { couple, moreOpen } = form;
  const set = (path, value) => dispatch({ type: 'draft/set', q: 'c', path, value });
  const toggleMore = () => dispatch({ type: 'ui/toggle', id: 'more' });
  // "+ Add a partner": the partner's block opens and the keyboard goes to its first box. The page is redrawn
  // as the action is applied, so the box is there to focus; the form is read before the button leaves the page.
  const addPartner = (e) => {
    const form = e.currentTarget.form;
    set('household', 'couple');
    if (form) focusField(form, 'partner.age');
  };
  return {
    question: 'c',
    rail: true,
    full: false,
    content: (
      <>
        <h1 tabIndex={-1}>{C.steps.numbers.label}</h1>
        <p class="lead">{C.numbers.intro}</p>
        <AskForm form={form} dispatch={dispatch} data-region="form">
          <PersonBlock who="you" form={form} dispatch={dispatch} />

          {couple && (
            <section class="block partner" aria-labelledby="partner-title">
              <div class="block-head">
                <h2 id="partner-title">{C.numbers.partnerTitle}</h2>
                <Button testid="c.action.removePartner" kind="quiet" data-focus-for="c.household" onClick={() => set('household', 'single')}>{C.buttons.removePartner}</Button>
              </div>
              <PersonBlock who="partner" form={form} dispatch={dispatch} />
              <p class="note">{C.numbers.partnerDone}</p>
            </section>
          )}

          <div class="actions-row">
            {!couple && <Button testid="c.action.addPartner" data-focus-for="c.household" onClick={addPartner}>+ {C.buttons.addPartner}</Button>}
            <Button testid="c.action.moreDetail" aria-expanded={moreOpen ? 'true' : 'false'} aria-controls={moreOpen ? 'more-detail' : undefined} onClick={toggleMore}>
              {moreOpen ? C.buttons.hideDetail : `+ ${C.buttons.moreDetail}`}
            </Button>
          </div>

          {moreOpen && (
            <section class="block more" id="more-detail" aria-labelledby="more-title">
              <div class="block-head">
                <h2 id="more-title">{C.numbers.moreTitle}</h2>
                <Button testid="c.action.closeMore" kind="quiet" onClick={toggleMore}>{C.buttons.closeMore}</Button>
              </div>
              <Field form={form} path="savings" dispatch={dispatch} />
              <Field form={form} path="risk" dispatch={dispatch} />
              <Field form={form} path="charge" dispatch={dispatch} />
              <Field form={form} path="endAge" dispatch={dispatch} />
            </section>
          )}

          <p class="full-detail">
            <LinkButton testid="c.action.fullDetail" kind="quiet" href={href.soon('e')}>{couple ? C.buttons.fullDetailCouple : C.buttons.fullDetail}</LinkButton>
          </p>
          <div class="submit-row">
            <Button testid="c.action.show" kind="primary" type="submit">{C.buttons.show}</Button>
          </div>
          <p class="note">{C.numbers.stays}</p>
        </AskForm>
      </>
    )
  };
}
