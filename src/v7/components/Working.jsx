/**
 * "Working out your answer…" — the same everywhere. Shows how far the run has got when the shell says, and the
 * second sentence only once the shell has marked the run slow (after five seconds).
 *
 * Since 7.5.0 the visible sign is the working spinner (Spinner.jsx RunRing; research/v7/mockups/README.md): a ring of bars
 * filling as the run reports how far it has got, its words saying only that futures are being run (an answer's run reports
 * its own stages, which are not futures a person would count). The ring's <progress> carries the same count for a screen
 * reader. The questions' answers draw the answer the moment the state holds it — the page's ready mark is read from the
 * state, so a drawing held back would show another page than the one the state says — and the first pass of 100 futures
 * is what the ring shows; the plan's own runs keep their least time (Spinner.jsx AtLeast).
 */
import { RunRing } from './Spinner.jsx';
import { C } from '../copy/c.js';

export function Working({ answer }) {
  const p = answer && answer.progress;
  const known = p && typeof p.done === 'number' && typeof p.total === 'number' && p.total > 0;
  return (
    <div class="working" role="status">
      <p class="working-title">{C.answer.working}</p>
      <RunRing progress={known ? p : null} label={C.answer.progress} testid="answer.working.ring" />
      <p>{C.answer.trying}</p>
      {answer && answer.slow && <p class="working-slow">{C.answer.slow}</p>}
    </div>
  );
}
