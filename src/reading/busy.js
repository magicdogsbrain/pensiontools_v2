/**
 * The busy mark (lead4.md section 2, G1): while any run is in flight the page's root element carries `data-busy`, in
 * both views, so the parity sweep waits for every figure to land before it reads. Markup only.
 *
 *   setBusy(source, on)        a named source of work (the simple view's runs, the full view's worker) is busy or not
 *   trackBusy(promise, source) counts a run in flight until it settles; returns the promise
 *
 * The attribute's value lists the busy sources ("worker simple"); it is removed when none is.
 */
const counts = new Map();

function rootEl() {
  return typeof document !== 'undefined' && document.documentElement ? document.documentElement : null;
}

function paint() {
  const el = rootEl();
  if (!el) return;
  const names = [...counts.entries()].filter(([, n]) => n > 0).map(([k]) => k).sort();
  if (names.length) el.setAttribute('data-busy', names.join(' '));
  else el.removeAttribute('data-busy');
}

export function setBusy(source, on) {
  counts.set(String(source), on ? 1 : 0);
  paint();
}

export function trackBusy(promise, source = 'run') {
  const k = String(source);
  counts.set(k, (counts.get(k) || 0) + 1);
  paint();
  const done = () => { counts.set(k, Math.max(0, (counts.get(k) || 1) - 1)); paint(); };
  Promise.resolve(promise).then(done, done);
  return promise;
}

/** For tests: every source cleared. */
export function clearBusy() {
  counts.clear();
  paint();
}
