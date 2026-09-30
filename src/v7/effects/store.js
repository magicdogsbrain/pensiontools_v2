/**
 * The store: holds the one state object, applies actions through the pure reducer, and tells whoever is listening.
 *
 *   createStore(initial, reduce) → { getState, dispatch, subscribe }
 *   subscribe(fn) → stop()          fn(state, action, previousState), after each action that changed the state
 *
 * An action sent from inside a listener (effects do this) is applied after the one under way has been told to
 * every listener, in the order sent — so every listener sees every state, in order.
 */
export function createStore(initial, reduce) {
  let state = initial;
  let listeners = [];
  const queue = [];
  let busy = false;

  function dispatch(action) {
    queue.push(action);
    if (busy) return;
    busy = true;
    try {
      while (queue.length) {
        const next = queue.shift();
        const previous = state;
        state = reduce(state, next);
        if (state === previous) continue;
        for (const fn of listeners.slice()) fn(state, next, previous);
      }
    } finally {
      busy = false;
      queue.length = 0;                       // after a throw (test build only) nothing half-done is left behind
    }
  }

  return {
    getState: () => state,
    dispatch,
    subscribe(fn) {
      listeners = [...listeners, fn];
      return () => { listeners = listeners.filter((f) => f !== fn); };
    }
  };
}
