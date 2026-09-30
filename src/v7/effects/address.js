/**
 * The address effect (V7 build brief 4.8) — the only code that reads or writes the address.
 *
 *   address → state: at start-up and on every "hashchange", dispatch route/set with parse(location.hash).
 *   state → address: after every state change, if format(state.route) is not the address, set it.
 *
 * A move made by the app (pressing "Show what it pays") is a new entry, so the back button undoes it. An address
 * that was only tidied (an unknown one becoming #/not-found) replaces its entry, so the back button is not trapped.
 * An empty address is the front door and is left as it is.
 */
import { parse, format } from '../router/routes.js';
import { A } from '../state/actions.js';

const same = (hash, wanted) => hash === wanted || ((hash === '' || hash === '#') && wanted === '#/');

export function startAddress(store, win = window) {
  let reading = false;

  const read = () => {
    reading = true;
    try { store.dispatch({ type: A.ROUTE_SET, route: parse(win.location.hash) }); } finally { reading = false; }
    write(store.getState(), true);
  };
  const write = (state, tidyOnly) => {
    const wanted = format(state.route);
    if (same(win.location.hash, wanted)) return;
    if (tidyOnly && win.history && typeof win.history.replaceState === 'function') win.history.replaceState(null, '', wanted);
    else win.location.hash = wanted;
  };

  const stopListening = store.subscribe((state) => { if (!reading) write(state, false); });
  win.addEventListener('hashchange', read);
  read();

  return () => {
    stopListening();
    win.removeEventListener('hashchange', read);
  };
}
