/**
 * Motion (research/v7/mockups/README.md, the motion rule): it shows an amount or time passing, and nothing else. A figure
 * counts up to its value; the year view fills month by month and the stage dot slides to its place (both in CSS:
 * components.css, `.home-year` and `.stage-strip`); a to-do slides away when it is done. Every movement ends on the
 * complete picture, runs in under a second, and does not happen at all when the person's system asks for less motion —
 * then the final frame is drawn at once. No animation library.
 *
 *   reducedMotion()                         whether less motion is asked for (false where it cannot be told)
 *   countUp(root, { ms })                   every money figure under `root` counts from nothing to its own text
 *   slideAway(el, done, { ms })             `el` slides out, then `done()` runs (at once with less motion)
 *
 * The figures are Money's own (data-value, data-kind="money"): the count is drawn over each one (its data-count, shown by
 * components.css while it is .is-counting) in the formatter's words and ends on the very text Money drew, which is never
 * changed — so a reader or a test that does not wait sees the same page as one that does. A figure the screen redraws
 * while it is counting stops counting at once.
 */
import { money } from '../../answers/shared/format.js';

const G = typeof globalThis === 'object' ? globalThis : {};

export function reducedMotion() {
  try { return typeof G.matchMedia === 'function' && G.matchMedia('(prefers-reduced-motion: reduce)').matches === true; } catch { return false; }
}

const frame = (fn) => (typeof G.requestAnimationFrame === 'function' ? G.requestAnimationFrame(fn) : null);

export function countUp(root, { ms = 700 } = {}) {
  if (!root || reducedMotion() || typeof G.requestAnimationFrame !== 'function') return;
  const els = [...root.querySelectorAll('[data-kind="money"][data-value]')].filter((el) => Number.isFinite(+el.getAttribute('data-value')) && Math.abs(+el.getAttribute('data-value')) >= 1);
  for (const el of els) {
    // 7.5.0: the figure's own text is never changed — the count is drawn over it (components.css .is-counting, from
    // data-count), so the page's words are the answer's at every moment for a reader, a test or a screen reader
    const to = +el.getAttribute('data-value');
    const end = el.textContent;
    let start = null;
    const stop = () => { el.classList.remove('is-counting'); el.removeAttribute('data-count'); };
    el.setAttribute('data-count', money(0));
    el.classList.add('is-counting');
    const step = (t) => {
      // the screen drew another figure here meanwhile: stop counting and show it
      if (el.textContent !== end || !el.isConnected) { stop(); return; }
      if (start === null) start = t;
      const k = Math.min(1, (t - start) / ms);
      if (k >= 1) { stop(); return; }
      const eased = 1 - (1 - k) * (1 - k) * (1 - k);
      el.setAttribute('data-count', money(Math.round(to * eased)));
      frame(step);
    };
    frame(step);
  }
}

export function slideAway(el, done, { ms = 320 } = {}) {
  if (!el || reducedMotion() || typeof G.setTimeout !== 'function') { done(); return; }
  el.classList.add('is-leaving');
  let called = false;
  const finish = () => { if (!called) { called = true; done(); } };
  el.addEventListener('animationend', finish, { once: true });
  G.setTimeout(finish, ms + 80);
}
