/**
 * "Working out your answer…" — the same everywhere. Shows how far the run has got when the shell says, and the
 * second sentence only once the shell has marked the run slow (after five seconds).
 */
import { C } from '../copy/c.js';

export function Working({ answer }) {
  const p = answer && answer.progress;
  const known = p && typeof p.done === 'number' && typeof p.total === 'number' && p.total > 0;
  return (
    <div class="working" role="status">
      <p class="working-title">{C.answer.working}</p>
      <p>{C.answer.trying}</p>
      {known
        ? <progress value={p.done} max={p.total} aria-label={C.answer.progress} />
        : <progress aria-label={C.answer.progress} />}
      {answer && answer.slow && <p class="working-slow">{C.answer.slow}</p>}
    </div>
  );
}
