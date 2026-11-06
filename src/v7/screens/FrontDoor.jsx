/**
 * The front door (rail-screens-language.md 2.1): "What would you like to know?" and the six questions in the
 * visitor's words, grouped by where the person is (7.1.0, research/v7/after-7.md J1). Question C takes its first number here; A, B and D go to their first step; E opens "Your plans"
 * (switch-readiness.md gate 3); F opens "not answered here yet".
 * Also drawn, with one extra line, for an address that leads nowhere.
 */
import { Field, formView, LinkButton, Button } from '../components/index.js';
import { href, parse } from '../router/routes.js';
import { frontDoor } from '../rail/index.js';
import { FRONT, COMMON } from '../copy/common.js';

export function FrontDoor(state, dispatch) {
  const form = formView(state);
  // Where each question opens: a built one at its first step, E at "Your plans", F at "not answered here yet" (rail/index.js).
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
        {/* the site's line, where the header has no room for it (a phone: components.css) */}
        <p class="front-tagline" data-testid="front.tagline">{COMMON.tagline}</p>
        <h1 tabIndex={-1}>{FRONT.title}</h1>
        {state.route.screen === 'notFound' && <p class="notice" role="status">{FRONT.notFound}</p>}
        <p class="lead">{FRONT.intro}</p>
        {/* grouped by where the person is (7.1.0): still working, stopping soon or stopped, with a plan; then the one decision */}
        {FRONT.groups.map((g) => (
          <section key={g.id} class={`question-group question-group-${g.id}`} data-group={g.id} aria-labelledby={g.title ? `front-group-${g.id}` : undefined}>
            {g.title && <h2 id={`front-group-${g.id}`} class="question-group-title">{g.title}</h2>}
            <ul class="questions">
          {g.ids.map((id) => FRONT.questions.find((x) => x.id === id)).map((q) => (q.id === 'c'
            ? (
              <li key={q.id} class="question question-c" data-testid="front.q.c" onKeyDown={onKeyDown}>
                <Field form={form} path="you.pot" dispatch={dispatch} testid="front.c.pot" label={q.ask} help="" placeholder={q.potHint} showError={false} />
                <p class="question-then">{q.then}</p>
                <LinkButton testid="front.c.show" kind="primary" href={showHref}>{q.button}</LinkButton>
              </li>
            )
            : (
              <li key={q.id} class="question">
                <a href={door[q.id] ? door[q.id].href : href.soon(q.id)} data-testid={`front.q.${q.id}`}>
                  {/* one block of words: on a phone the question and "not answered here yet" run on as one line */}
                  <span class="question-text">
                    <span class="question-ask">{q.ask}</span>
                    {q.more && <span class="question-more">{q.more}</span>}
                    {!(door[q.id] && (door[q.id].built || door[q.id].place)) && <span class="question-not">{FRONT.notYet}</span>}
                  </span>
                </a>
              </li>
            )))}
            </ul>
            {g.id === 'plan' && <p class="note front-sign-in" data-testid="front.signInLine">{FRONT.signIn} <a href={href.account()} data-testid="front.signIn">{FRONT.signInLink}</a></p>}
          </section>
        ))}
        {/* the example plan (road-to-7.md step 11): made in this window for a visitor, as an ordinary plan for an account */}
        <p class="note front-example" data-testid="front.exampleLine">{FRONT.example} <Button testid="front.example" kind="quiet" onClick={() => dispatch({ type: 'plan/example' })}>{FRONT.exampleButton}</Button></p>
      </>
    )
  };
}
