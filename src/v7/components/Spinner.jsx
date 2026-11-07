/**
 * The working spinner (research/v7/mockups/README.md, "The working spinner"): the tests run thousands of futures, so the
 * page shows that it is working — a ring of small bars filling as the worker reports how far it has got. The words beside it
 * count only what the worker really counts, in that run's own unit ("3 of 9 ways tried", "2 of 8 mixes tried"); a run whose
 * steps are not something a person would count (the "Does it last?" run reports its two stages, not its futures) says only
 * that futures are being run. Never a count of futures the page does not have. The bar under it stays a real <progress>
 * for a screen reader.
 *
 *   <RunRing progress={{ done, total }} unit="ways" label="…" />
 *   <AtLeast busy={…} working={<RunRing …/>}>{the verdict}</AtLeast>   the verdict waits until the ring has shown ~600 ms
 *   <Held busy={…}>{(held) => …}</Held>                                 the same wait, for a page whose verdict is spread out
 *   <HeldAnswer busy={…} working={<Working …/>}>{the answer}</HeldAnswer>   the same wait for a question's first answer (7.5.0),
 *        marked on the page while it holds (data-holding) and saying when it lets go (the bubbling pt:held event), so the
 *        page's ready mark (effects/index.js markReady, main.jsx) never says ready while the ring still shows
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

export function RunRing({ progress, label, testid, unit = null }) {
  const known = !!(progress && typeof progress.done === 'number' && typeof progress.total === 'number' && progress.total > 0);
  const on = known ? Math.max(0, Math.min(BARS, Math.round((progress.done / progress.total) * BARS))) : 0;
  // the count only in the run's own unit; with no unit (or none known yet) the words say only that it is working
  const counted = known && unit && WORKING.count[unit] ? fill(WORKING.count[unit], { total: count(progress.total), done: count(progress.done) }) : null;
  return (
    <div class={`run-ring${known ? ' is-known' : ' is-turning'}`} data-testid={testid}>
      <svg class="run-ring-svg" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        {Array.from({ length: BARS }, (_, i) => (
          <rect key={i} class={`run-ring-bar${i < on ? ' is-on' : ''}`} x="23" y="3" width="2" height="9" rx="1" transform={`rotate(${(360 / BARS) * i} 24 24)`} />
        ))}
      </svg>
      <span class="run-ring-words">{counted || WORKING.running}</span>
      {known ? <progress class="sr-only" value={progress.done} max={progress.total} aria-label={label} /> : <progress class="sr-only" aria-label={label} />}
    </div>
  );
}

/**
 * True while `busy`, and for at least AT_LEAST_MS once busy was seen, so a verdict never pops in the instant a run ends. A
 * screen drawn already done (a page opened on a verdict) is never held.
 */
export function useAtLeast(busy) {
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
  return !!busy || held;
}

/**
 * A question's answer, held behind the ring for the least time once a run was seen (the README: "a verdict never pops in
 * instantly"). The answer's state is ready before the page shows it, so the page marks the hold (data-holding="1") and tells
 * the ready mark when it ends (pt:held, bubbling from here) — the page is never marked ready on the ring. Its box takes no
 * room of its own (display: contents), so the page's layout is the answer's.
 */
export function HeldAnswer({ busy, working, children }) {
  const held = useAtLeast(busy);
  const ref = useRef(null);
  const was = useRef(false);
  useEffect(() => {
    if (was.current && !held && ref.current) ref.current.dispatchEvent(new CustomEvent('pt:held', { bubbles: true }));
    was.current = held;
  }, [held]);
  return <div class="held-answer" ref={ref} data-holding={held && !busy ? '1' : undefined}>{held ? working : children}</div>;
}

/** Shows `working` while `busy` (and the least time after), then `children`. */
export function AtLeast({ busy, working, children }) {
  return useAtLeast(busy) ? working : children;
}

/** The same wait for a page whose verdict is in several places: `children(held)`, held true while working or held. */
export function Held({ busy, children }) {
  return children(useAtLeast(busy));
}
