/**
 * Question A, step 1 — "What have you got, and when would you stop?" (screens-A-B.md 3.1). Three things to type for
 * one person (age, pot, the age in mind); everything else starts sensible. What you would spend is the next step's
 * (the budget step, research/v7/budget-step.md): the button here, "Next: what you would spend", checks this step's own
 * boxes (draft/onward) and opens it. "Add a partner" and "Add more detail" open on this same step. Computes nothing:
 * every box is drawn from SCHEMA_A and the state by Field.
 *
 * The person is drawn in the order of the drawing — the things to type first, the settings that start sensible
 * after — not the order of the input list; LAYOUT_A says it, and the tests read it. A field that depends on a choice
 * is drawn inside that choice's option (FieldGroup), so the form holds exactly the fields that apply.
 *
 * saverNumbers(q, layout) is the numbers step of A and B alike; B passes its own layout and words.
 *
 * Couples who stop work in different years (research/v7/couples-different-years.md 2.1–2.3): the partner's stop sits
 * after their age and pot, before their pay-in (which "They already have" hides), with the pay line under it; "I've
 * already stopped" is one of your stop's options for a couple (hiding your pay-in and part-time work, and turning the
 * partner's question into the one the answer is about); "Already had the tax-free part?" is asked first under more
 * detail, for someone who has stopped only (`taxFree`: those fields hang on a stop question, so they are not top-level
 * fields of the layout). A couple who have both stopped get the retired view.
 */
import { AskForm, FieldGroup, PayInSplit, Carried, Retired, isRetired, formView, focusField, Button, LinkButton } from '../../components/index.js';
import { href } from '../../router/routes.js';

/**
 * The top-level fields of A's steps, in the order drawn. Each one's dependants are drawn inside it. `spend` is the
 * spend step's (the "What you would spend" box).
 */
export const LAYOUT_A = {
  you: ['you.age', 'you.pot', 'you.payIn.kind', 'savings', 'stop.kind', 'partTime.has', 'you.statePension.kind', 'you.finalSalary.has'],
  partner: ['partner.age', 'partner.pot', 'partner.stop.kind', 'partner.payIn.kind', 'partner.statePension.kind', 'partner.finalSalary.has'],
  more: ['you.alreadyDrawing', 'partner.alreadyDrawing', 'savingsIn', 'savingRisk', 'risk', 'charge', 'endAge'],
  // the spending shape's fields: drawn by its own block under the figure (StepsField), never by LayoutField
  spend: ['spend.kind', 'spend.then', 'spend.steps'],
  /** Drawn first under more detail, each only while it applies (someone who has stopped). */
  taxFree: ['you.taxFreeTaken', 'partner.taxFreeTaken']
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

/**
 * The choice a field is drawn inside by the layout's `inside` ({ choice: { option: [paths] } }), when that choice is on
 * the form; else null.
 */
function drawnInside(form, layout, path) {
  for (const [choice, byOption] of Object.entries((layout && layout.inside) || {})) {
    if (!Object.values(byOption).some((paths) => paths.includes(path))) continue;
    const f = form.byPath.get(choice);
    if (f && form.applies(f) && form.isAsked(choice)) return choice;
  }
  return null;
}

/**
 * One top-level field of a saver layout: the pay-in block, the spending choice with its level line, or a FieldGroup (with
 * whatever the layout draws inside its options). A field the layout draws inside a choice that is on the form is drawn
 * there, not again here.
 */
export function LayoutField({ form, path, dispatch, layout }) {
  // the spending shape's fields are its block's own (StepsField, on the spend step), never ordinary boxes
  const field = form.byPath.get(path);
  if (field && field.group === 'shape') return null;
  if (path.endsWith('.payIn.kind')) return <PayInSplit who={path.split('.')[0]} form={form} dispatch={dispatch} />;
  if (path === 'spend.kind') return <FieldGroup form={form} path={path} dispatch={dispatch} extra={<LevelLine form={form} />} />;
  if (drawnInside(form, layout, path)) return null;
  return <FieldGroup form={form} path={path} dispatch={dispatch} inside={(layout && layout.inside && layout.inside[path]) || {}} />;
}

export function saverNumbers(q, layout) {
  return function NumbersScreen(state, dispatch) {
    const form = formView(state, q);
    const words = form.copy;
    if (isRetired(state, q)) return { question: q, rail: true, full: false, view: 'retired', content: <Retired q={q} dispatch={dispatch} state={state} /> };
    const { couple, moreOpen } = form;
    const set = (path, value) => dispatch({ type: 'draft/set', q, path, value });
    const toggleMore = () => dispatch({ type: 'ui/toggle', id: 'more' });
    // "+ Add a partner": the partner's block opens and the keyboard goes to its first box (as C).
    const addPartner = (e) => {
      const el = e.currentTarget.form;
      set('household', 'couple');
      if (el) focusField(el, 'partner.age', q);
    };
    const draw = (paths) => paths.map((p) => <LayoutField key={p} form={form} path={p} dispatch={dispatch} layout={layout} />);
    return {
      question: q,
      rail: true,
      full: false,
      content: (
        <>
          <h1 tabIndex={-1}>{words.steps.numbers.label}</h1>
          <p class="lead">{words.numbers.intro}</p>
          <Carried form={form} />
          <AskForm form={form} dispatch={dispatch} action="draft/onward" data-region="form" data-carried-from={form.carriedFrom || undefined}>
            <div class="person person-you">{draw(layout.you)}</div>

            {couple && (
              <section class="block partner" aria-labelledby="partner-title">
                <div class="block-head">
                  <h2 id="partner-title">{words.numbers.partnerTitle}</h2>
                  <Button testid={`${q}.action.removePartner`} kind="quiet" data-focus-for={`${q}.household`} onClick={() => set('household', 'single')}>{words.buttons.removePartner}</Button>
                </div>
                <div class="person person-partner">{draw(layout.partner)}</div>
                {/* "You both stop in the same year" only while it is so: not once their stop is their own, nor once you have stopped */}
                <p class="note">{form.apart || form.asked === 'partner' ? words.numbers.partnerDoneApart : words.numbers.partnerDone}</p>
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
                {draw([...(layout.taxFree || []), ...layout.more])}
              </section>
            )}

            <p class="full-detail">
              <LinkButton testid={`${q}.action.fullDetail`} kind="quiet" href={href.soon('e')}>{couple ? words.buttons.fullDetailCouple : words.buttons.fullDetail}</LinkButton>
            </p>
            <div class="submit-row">
              <Button testid={`${q}.action.onward`} kind="primary" type="submit">{words.buttons.onward}</Button>
            </div>
            <p class="note">{words.numbers.stays}</p>
          </AskForm>
        </>
      )
    };
  };
}

export const NumbersScreen = saverNumbers('a', LAYOUT_A);
