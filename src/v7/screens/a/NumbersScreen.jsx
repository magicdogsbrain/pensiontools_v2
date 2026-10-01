/**
 * Question A, step 1 — "What have you got, and what do you want to spend?" (screens-A-B.md 3.1). Four things to
 * type for one person (age, pot, the age in mind, spending); everything else starts sensible. "Add a partner" and
 * "Add more detail" open on this same step. Computes nothing: every box is drawn from SCHEMA_A and the state by Field.
 *
 * The person is drawn in the order of the drawing — the things to type first, the settings that start sensible
 * after — not the order of the input list; LAYOUT_A says it, and the tests read it. A field that depends on a choice
 * is drawn inside that choice's option (FieldGroup), so the form holds exactly the fields that apply.
 *
 * saverNumbers(q, layout) is the numbers step of A and B alike; B passes its own layout and words.
 */
import { AskForm, FieldGroup, PayInSplit, Carried, Retired, isRetired, formView, focusField, Button, LinkButton } from '../../components/index.js';
import { href } from '../../router/routes.js';

/** The top-level fields of A's numbers step, in the order drawn. Each one's dependants are drawn inside it. */
export const LAYOUT_A = {
  you: ['you.age', 'you.pot', 'you.payIn.kind', 'savings', 'stop.kind', 'spend.kind', 'partTime.has', 'you.statePension.kind', 'you.finalSalary.has'],
  partner: ['partner.age', 'partner.pot', 'partner.payIn.kind', 'partner.statePension.kind', 'partner.finalSalary.has'],
  more: ['you.alreadyDrawing', 'partner.alreadyDrawing', 'savingsIn', 'savingRisk', 'risk', 'charge', 'endAge']
};

/** Under the spending choice, once a level is picked: what that level is a month (words, checked against the rule). */
export function LevelLine({ form }) {
  const level = form.shown['spend.level'];
  if (form.shown['spend.kind'] !== 'level' || !level) return null;
  const n = form.copy.numbers;
  const who = form.couple ? 'couple' : 'single';
  const text = n.levelIs.replace('{level}', form.copy.fields['spend.level'].options[level])
    .replace('{amount}', form.copy.levels[who][level]).replace('{who}', n.levelWho[who]);
  return <p class="help level-line" data-testid={`${form.q}.spend.levelIs`}>{text}</p>;
}

/** One top-level field of a saver layout: the pay-in block, the spending choice with its level line, or a FieldGroup. */
export function LayoutField({ form, path, dispatch }) {
  if (path.endsWith('.payIn.kind')) return <PayInSplit who={path.split('.')[0]} form={form} dispatch={dispatch} />;
  if (path === 'spend.kind') return <FieldGroup form={form} path={path} dispatch={dispatch} extra={<LevelLine form={form} />} />;
  return <FieldGroup form={form} path={path} dispatch={dispatch} />;
}

export function saverNumbers(q, layout) {
  return function NumbersScreen(state, dispatch) {
    const form = formView(state, q);
    const words = form.copy;
    if (isRetired(state, q)) return { question: q, rail: true, full: false, view: 'retired', content: <Retired q={q} dispatch={dispatch} /> };
    const { couple, moreOpen } = form;
    const set = (path, value) => dispatch({ type: 'draft/set', q, path, value });
    const toggleMore = () => dispatch({ type: 'ui/toggle', id: 'more' });
    // "+ Add a partner": the partner's block opens and the keyboard goes to its first box (as C).
    const addPartner = (e) => {
      const el = e.currentTarget.form;
      set('household', 'couple');
      if (el) focusField(el, 'partner.age', q);
    };
    const draw = (paths) => paths.map((p) => <LayoutField key={p} form={form} path={p} dispatch={dispatch} />);
    return {
      question: q,
      rail: true,
      full: false,
      content: (
        <>
          <h1 tabIndex={-1}>{words.steps.numbers.label}</h1>
          <p class="lead">{words.numbers.intro}</p>
          <Carried form={form} />
          <AskForm form={form} dispatch={dispatch} data-region="form" data-carried-from={form.carriedFrom || undefined}>
            <div class="person person-you">{draw(layout.you)}</div>

            {couple && (
              <section class="block partner" aria-labelledby="partner-title">
                <div class="block-head">
                  <h2 id="partner-title">{words.numbers.partnerTitle}</h2>
                  <Button testid={`${q}.action.removePartner`} kind="quiet" data-focus-for={`${q}.household`} onClick={() => set('household', 'single')}>{words.buttons.removePartner}</Button>
                </div>
                <div class="person person-partner">{draw(layout.partner)}</div>
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
                {draw(layout.more)}
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
  };
}

export const NumbersScreen = saverNumbers('a', LAYOUT_A);
