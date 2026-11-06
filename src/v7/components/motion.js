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
 * The figures are Money's own (data-value, data-kind="money"): the count writes the formatter's words for each step and
 * ends on the very text Money drew, so a reader or a test that waits sees the same page as one that does not. A figure
 * the screen redraws while it is counting is left to the screen.
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
    // the figure's own text node is changed in place (never replaced), so the screen's next draw still finds it
    const node = el.firstChild;
    if (!node || node.nodeType !== 3 || el.childNodes.length !== 1) continue;
    const to = +el.getAttribute('data-value');
    const end = node.data;
    let start = null;
    let wrote = money(0);
    node.data = wrote;
    const step = (t) => {
      // the screen drew something else meanwhile: leave it be
      if (node.data !== wrote) return;
      if (start === null) start = t;
      const k = Math.min(1, (t - start) / ms);
      const eased = 1 - (1 - k) * (1 - k) * (1 - k);
      wrote = k >= 1 ? end : money(Math.round(to * eased));
      node.data = wrote;
      if (k < 1) frame(step);
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
