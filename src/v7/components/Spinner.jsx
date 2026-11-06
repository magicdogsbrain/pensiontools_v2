/**
 * The working spinner (research/v7/mockups/README.md, "The working spinner"): the tests run thousands of futures, so the
 * page shows that — a ring of small bars, each a share of the lives being run, filling as the worker reports how far it
 * has got, with the count beside it ("Running 1,000 futures… 640"). When the worker says nothing of how far it is, the
 * ring turns and the words say only that it is working: never a count it does not have. The bar under it stays a real
 * <progress> for a screen reader.
 *
 *   <RunRing progress={{ done, total }} label="…" />
 *   <AtLeast busy={…} working={<RunRing …/>}>{the verdict}</AtLeast>   the verdict waits until the ring has shown ~600 ms
 *
 * Draws only; the timing is a relative wait (no clock is read). With less motion asked for, the ring does not turn
 * (components.css) and the wait still holds, so a verdict never pops in before the ring was seen.
 */
import { useEffect, useRef, useState } from 'preact/hooks';
import { WORKING } from '../copy/home.js';
import { fill } from './PlanFigures.jsx';

const BARS = 24;
/** The least time the ring is shown before what it was working on appears. */
export const AT_LEAST_MS = 600;
const count = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export function RunRing({ progress, label, testid }) {
  const known = !!(progress && typeof progress.done === 'number' && typeof progress.total === 'number' && progress.total > 0);
  const on = known ? Math.max(0, Math.min(BARS, Math.round((progress.done / progress.total) * BARS))) : 0;
  return (
    <div class={`run-ring${known ? ' is-known' : ' is-turning'}`} data-testid={testid}>
      <svg class="run-ring-svg" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        {Array.from({ length: BARS }, (_, i) => (
          <rect key={i} class={`run-ring-bar${i < on ? ' is-on' : ''}`} x="23" y="3" width="2" height="9" rx="1" transform={`rotate(${(360 / BARS) * i} 24 24)`} />
        ))}
      </svg>
      <span class="run-ring-words">{known ? fill(WORKING.running, { total: count(progress.total), done: count(progress.done) }) : WORKING.runningPlain}</span>
      {known ? <progress class="sr-only" value={progress.done} max={progress.total} aria-label={label} /> : <progress class="sr-only" aria-label={label} />}
    </div>
  );
}

/**
 * Shows `working` while `busy`, and for at least AT_LEAST_MS once it has been shown, then `children`. A screen drawn
 * already done (a page opened on a verdict) shows the verdict at once.
 */
export function AtLeast({ busy, working, children }) {
  const [held, setHeld] = useState(false);
  const timer = useRef(null);
  const shown = useRef(false);
  useEffect(() => {
    if (busy && !shown.current) {
      shown.current = true;
      setHeld(true);
      timer.current = setTimeout(() => { timer.current = null; shown.current = false; setHeld(false); }, AT_LEAST_MS);
    }
    if (!busy && !timer.current) { shown.current = false; setHeld(false); }
  }, [busy]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return busy || held ? working : children;
}
