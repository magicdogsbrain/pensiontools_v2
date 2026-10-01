/**
 * The shell tests for questions A and B (step 4 brief, package P4). Not a test file.
 *
 * In the tree, rail/questions.js keeps OPEN = ['c'] until the joining-up change (so C's pinned states, pictures and
 * tests stay as they are). The A and B shell tests open all three the way the joined-up branch will, by standing in
 * for questions.js with every question of STEP_LISTS open:
 *
 *   vi.mock('../../../src/v7/rail/questions.js', async () => (await import('./_allOpen.js')).allOpen());
 *
 * Everything else in the shell reads OPEN, QUESTIONS and BUILT from that module, so nothing else is mocked. The stand-in
 * is in its own file (_allOpen.js), which imports nothing of the shell, so building it cannot go round in a circle.
 */
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { currentKey } from '../../../src/v7/state/select.js';

export const TODAY = '2026-09-30';
export const fresh = (o = {}) => initialState({ today: TODAY, build: 'test', ...o });
export const run = (state, ...actions) => actions.reduce((s, a) => reduce(s, a), state);
export const set = (q, path, value) => ({ type: A.DRAFT_SET, q, path, value });
export const route = (screen, q = null, step = null, focus = null) => ({ screen, q, step, planId: null, focus });
export const at = (state, q, step) => reduce(state, { type: A.ROUTE_SET, route: route('step', q, step) });

/** A's four things (single person): age 50, pot £250,000, stop at 60, £2,000 a month. */
export const typedA = (state = fresh(), { age = '50', pot = '250,000', stop = '60', spend = '2,000' } = {}) =>
  run(state, set('a', 'you.age', age), set('a', 'you.pot', pot), set('a', 'stop.age', stop), set('a', 'spend.amount', spend));

/** B's five things: age 45, pot £180,000, £700 a month in, stop at 60, £2,000 a month. */
export const typedB = (state = fresh(), { age = '45', pot = '180,000', payIn = '700', stop = '60', spend = '2,000' } = {}) =>
  run(state, set('b', 'you.age', age), set('b', 'you.pot', pot), set('b', 'you.payIn.total', payIn), set('b', 'stop.age', stop),
    set('b', 'spend.amount', spend));

/** C's two things. */
export const typedC = (state = fresh(), pot = '250,000', age = '58') => run(state, set('c', 'you.pot', pot), set('c', 'you.age', age));

/** A result shaped like A's (the stub's fields the shell reads). `payIn`: what goes into your pension a month (saving[0]). */
export const resultA = ({ detail = 'chart', verdict = 'close', kind = 'named', age = 60, earliestYes = 61, middling = 480000, status = 'ok', payIn = 600 } = {}) => ({
  status,
  stop: { kind: kind === 'named' ? 'age' : 'ages', age },
  headline: { kind, age, verdict, lasted: 0.8, runOutAge: 89 },
  shown: { age, potAtStop: { careful: 400000, middling, good: 560000 } },
  earliest: { yes: earliestYes, close: 60 },
  saving: [{ who: 'you', payIn: { total: payIn } }],
  basis: { historyEnd: '2025-12', detail }
});

/** A result shaped like B's. */
export const resultB = ({ detail = 'answer', onCourse = false, careful = 470000, status = 'ok', age = 60, payIn = 700 } = {}) => ({
  status,
  stop: { age, year: '2041' },
  number: careful === null ? null : { careful, middling: careful - 70000, good: careful - 130000 },
  onCourse,
  payIn: { now: payIn, needed: 1050 },
  saving: [{ who: 'you', payIn: { total: payIn } }],
  grid: detail === 'grid' ? { payIns: [700, 800], ages: [] } : null,
  basis: { historyEnd: '2025-12', detail }
});

const asTyped = (n) => String(Math.abs(Math.round(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const getIn = (obj, key) => String(key).split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);

/**
 * What the map (state/carry.js) says the target should hold after draft/carry, worked out from the map itself:
 * a typed source as typed; a fixed value as given; a figure of the source's answer — only an answer for what is typed
 * now, first or final — as typed text, else nothing (the box is emptied). `map` is CARRY[from→to].
 * @returns {{ values: object, touched: string[] }}  the target's carried values, and every field the carry marks
 */
export function carriedBy(map, state, from) {
  const values = {};
  const touched = [];
  const answer = state.answers[from];
  const readable = !!answer && (answer.status === 'first' || answer.status === 'final') && answer.inputsKey === currentKey(state, from);
  for (const [src, toPath] of map) {
    if (typeof src === 'string') {
      const v = state.draft[from].values[src];
      if (typeof v !== 'string' && typeof v !== 'boolean') continue;
      values[toPath] = v;
    } else if ('fixed' in src) values[toPath] = String(src.fixed);
    else if ('result' in src) {
      const n = readable ? getIn(answer.result, src.result) : undefined;
      if (typeof n === 'number' && Number.isFinite(n)) values[toPath] = asTyped(n);
      else delete values[toPath];
    }
    if (!touched.includes(toPath)) touched.push(toPath);
  }
  return { values, touched };
}

/** The runner's steps by hand: working, first, final for what is typed now. */
export function answered(state, q, result, kind = A.ANSWER_FINAL) {
  const key = currentKey(state, q);
  return run(state, { type: A.ANSWER_WORKING, q, inputsKey: key }, { type: kind, q, inputsKey: key, result });
}
