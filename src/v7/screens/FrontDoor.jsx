/**
 * The front door (rail-screens-language.md 2.1): "What would you like to know?" and the six questions in the
 * visitor's words. Question C takes its first number here; A and B, once open, go to their first step; the others
 * open "not in the preview yet".
 * Also drawn, with one extra line, for an address that leads nowhere.
 */
import { Field, formView, LinkButton, Button } from '../components/index.js';
import { href, parse } from '../router/routes.js';
import { frontDoor } from '../rail/index.js';
import { FRONT } from '../copy/common.js';

export function FrontDoor(state, dispatch) {
  const form = formView(state);
  // Where each question opens: a built one at its first step, the others at "not in the preview yet" (rail/index.js).
  const door = Object.fromEntries(frontDoor().map((q) => [q.id, q]));
  const showHref = href.step('c', 'numbers', 'you.age');
  const onKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); dispatch({ type: 'route/set', route: parse(showHref) }); }
  };
  return {
    question: null,
    rail: false,
    full: false,
    content: (
      <>
        <h1 tabIndex={-1}>{FRONT.title}</h1>
        {state.route.screen === 'notFound' && <p class="notice" role="status">{FRONT.notFound}</p>}
        <p class="lead">{FRONT.intro}</p>
        <ul class="questions">
          {FRONT.questions.map((q) => (q.id === 'c'
            ? (
              <li key={q.id} class="question question-c" data-testid="front.q.c" onKeyDown={onKeyDown}>
                <span class="letter" aria-hidden="true">C</span>
                <Field form={form} path="you.pot" dispatch={dispatch} testid="front.c.pot" label={q.ask} help="" placeholder={q.potHint} showError={false} />
                <p class="question-then">{q.then}</p>
                <LinkButton testid="front.c.show" kind="primary" href={showHref}>{q.button}</LinkButton>
              </li>
            )
            : (
              <li key={q.id} class="question">
                <a href={door[q.id] ? door[q.id].href : href.soon(q.id)} data-testid={`front.q.${q.id}`}>
                  <span class="letter" aria-hidden="true">{q.id.toUpperCase()}</span>
                  {/* one block of words: on a phone the question and "not in the preview yet" run on as one line */}
                  <span class="question-text">
                    <span class="question-ask">{q.ask}</span>
                    {q.more && <span class="question-more">{q.more}</span>}
                    {!(door[q.id] && door[q.id].built) && <span class="question-not">{FRONT.notYet}</span>}
                  </span>
                </a>
              </li>
            )))}
        </ul>
        {/* the example plan (road-to-7.md step 11): made in this window for a visitor, as an ordinary plan for an account */}
        <p class="note front-example" data-testid="front.exampleLine">{FRONT.example} <Button testid="front.example" kind="quiet" onClick={() => dispatch({ type: 'plan/example' })}>{FRONT.exampleButton}</Button></p>
      </>
    )
  };
}
