/**
 * The front door. Two of them, by who is here:
 *
 * A stranger — anyone not signed in (7.5.0; research/v7/mockups/first-visit.html screen 1 and its README): one headline,
 * the pot over a life as the picture that explains it (the life line, the same component as a plan home's stage strip),
 * and three doors, one for each stage — "Still saving" opens "Am I saving enough?" (B) at its numbers, "Stopping soon"
 * takes C's first number in the door itself, "Already retired" opens "Will it last?" (D) at its numbers. The other
 * questions are plain links one tap away: A, F ("not answered here yet") and "I have a plan", which opens "Your plans".
 * No account, no meter and no sign-in line: the account is asked for only when something is kept.
 *
 * Someone signed in keeps today's front door unchanged (a later release redesigns it): "What would you like to know?" and
 * the six questions in the visitor's words, grouped by where the person is (7.1.0, research/v7/after-7.md J1). Question
 * C takes its first number here; A, B and D go to their first step; E opens "Your plans" (switch-readiness.md gate 3); F
 * opens "not answered here yet". Landing on the site signed in still opens "Your plans" first (effects/place.js).
 *
 * Both are also drawn, with one extra line, for an address that leads nowhere.
 */
import { Field, formView, LinkButton, Button, LifeLine } from '../components/index.js';
import { href, parse } from '../router/routes.js';
import { frontDoor } from '../rail/index.js';
import { LIFE_EXAMPLE } from '../state/select.js';
import { FRONT, COMMON } from '../copy/common.js';

/** The three doors, in the order of a life: the question each opens, and the stage it is coloured by. */
const DOORS = [{ q: 'b', stage: 'saving' }, { q: 'c', stage: 'moving' }, { q: 'd', stage: 'drawing' }];

function Stranger(state, dispatch) {
  const form = formView(state);
  const W = FRONT.stranger;
  const door = Object.fromEntries(frontDoor().map((q) => [q.id, q]));
  const showHref = href.step('c', 'numbers', 'you.age');
  const onKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); dispatch({ type: 'route/set', route: parse(showHref) }); }
  };
  const linkOf = (id) => (door[id] ? door[id].href : href.soon(id));
  const words = (q, d) => (
    <>
      <span class="door-tag"><i aria-hidden="true" />{d.stage}</span>
      <span class="door-ask">{d.ask}</span>
      <span class="door-what">{d.what}</span>
    </>
  );
  return {
    question: null,
    rail: false,
    full: false,
    content: (
      <div class="front is-stranger" data-front="stranger">
        <p class="front-tagline" data-testid="front.tagline">{COMMON.tagline}</p>
        <h1 tabIndex={-1} class="front-title">{W.title[0]}<em>{W.title[1]}</em>{W.title[2]}</h1>
        {state.route.screen === 'notFound' && <p class="notice" role="status">{FRONT.notFound}</p>}
        <p class="lead">{W.intro}</p>
        <LifeLine example={LIFE_EXAMPLE} words={W.life} />
        <ul class="doors" aria-label={W.doorsLabel}>
          {DOORS.map(({ q, stage }) => {
            const d = W.doors[q];
            if (q === 'c') {
              // C's quickest form is its first number, typed in the door itself; Enter or "Show me" goes on to the age
              return (
                <li key={q} class={`door is-${stage}`} data-door={q} data-testid="front.q.c" onKeyDown={onKeyDown}>
                  {words(q, d)}
                  <Field form={form} path="you.pot" dispatch={dispatch} testid="front.c.pot" label={d.potLabel} help="" placeholder={d.potHint} showError={false} />
                  <LinkButton testid="front.c.show" kind="pop" href={showHref}>{d.go}</LinkButton>
                </li>
              );
            }
            return (
              <li key={q} class={`door is-${stage}`} data-door={q}>
                <a class="door-link" href={linkOf(q)} data-testid={`front.q.${q}`}>
                  {words(q, d)}
                  <span class="door-go">{d.go} <span aria-hidden="true">→</span></span>
                </a>
              </li>
            );
          })}
        </ul>
        <nav class="front-plain" aria-label={W.othersLabel}>
          <a href={linkOf('a')} data-testid="front.q.a">{W.others.a}</a>
          <a href={linkOf('f')} data-testid="front.q.f">{W.others.f}{!(door.f && (door.f.built || door.f.place)) && <span class="question-not"> · {FRONT.notYet}</span>}</a>
          <a href={linkOf('e')} data-testid="front.q.e">{W.others.e}</a>
        </nav>
        {/* the example plan (road-to-7.md step 11): made in this window for a visitor, as an ordinary plan for an account */}
        <p class="note front-example" data-testid="front.exampleLine">{FRONT.example} <Button testid="front.example" kind="quiet" onClick={() => dispatch({ type: 'plan/example' })}>{FRONT.exampleButton}</Button></p>
      </div>
    )
  };
}

export function FrontDoor(state, dispatch) {
  if (!(state.session && state.session.kind === 'in')) return Stranger(state, dispatch);
  return SignedIn(state, dispatch);
}

/** Today's front door, for someone signed in (7.1.0): unchanged. */
function SignedIn(state, dispatch) {
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
