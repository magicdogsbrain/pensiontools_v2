/**
 * Questions A and B, the budget step — "What would you spend?" (research/v7/budget-step.md). Between "Your numbers"
 * and the answer:
 *
 *   How would you like to work it out?   ( ) Work it out line by line — better, about 5 minutes
 *                                        ( ) Just put in one figure — quicker
 *   [the budget sheet, when line by line]
 *   What you would spend   (o) An amount £ [ ____ ] a month, after tax    ( ) pick a level
 *   [once: "You are skipping the budget …"]
 *   Your budget adds up to £2,340 a month.  [Use £2,340 a month]
 *   The national guide levels …
 *   [ Show if it works ]
 *
 * THE RULE: every answer uses the one figure in the box. The budget is beside it as a guide; "Use £X a month" copies its
 * total in, and nothing else does — editing the budget later never moves the figure. Computes nothing: the box is drawn
 * by Field from the question's input list; every budget figure comes from state/select.js.
 *
 * saverSpend(q, layout) is the spend step of A and B alike.
 */
import { AskForm, Retired, isRetired, formView, Button, SpendHow, BudgetSheet, SpendBeside } from '../../components/index.js';
import { skipNoteDue } from '../../state/select.js';
import { BUDGET } from '../../copy/budget.js';
import { LayoutField, LAYOUT_A } from './NumbersScreen.jsx';

export function saverSpend(q, layout) {
  return function SpendScreen(state, dispatch) {
    if (isRetired(state, q)) return { question: q, rail: true, full: false, view: 'retired', content: <Retired q={q} dispatch={dispatch} /> };
    const form = formView(state, q);
    const words = form.copy;
    const lines = state.draft[q] && state.draft[q].spendHow === 'lines';
    return {
      question: q,
      rail: true,
      full: false,
      content: (
        <>
          <h1 tabIndex={-1}>{words.steps.spend.label}</h1>
          <p class="lead">{BUDGET.spend.lead}</p>
          <SpendHow state={state} q={q} dispatch={dispatch} />
          {lines && <BudgetSheet state={state} q={q} dispatch={dispatch} />}
          <AskForm form={form} dispatch={dispatch} data-region="form" class="ask spend-form">
            {layout.spend.map((p) => <LayoutField key={p} form={form} path={p} dispatch={dispatch} />)}
            {skipNoteDue(state, q) && <p class="notice skip-note" data-testid={`${q}.spend.skipNote`}>{BUDGET.spend.skipNote}</p>}
            <SpendBeside state={state} q={q} dispatch={dispatch} />
            <div class="submit-row">
              <Button testid={`${q}.action.show`} kind="primary" type="submit">{words.buttons.show}</Button>
            </div>
          </AskForm>
        </>
      )
    };
  };
}

export const SpendScreen = saverSpend('a', LAYOUT_A);
