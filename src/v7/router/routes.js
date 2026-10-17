/**
 * Addresses (V7 build brief 4.8). Pure: text in, route out, and back.
 *
 *   parse(hash)   → route      unset fields are null
 *   format(route) → hash       format(parse(h)) === h for every address in ROUTES; parse(format(r)) deep-equals r
 *
 * No figure ever appears in an address. `focus` is a field path (letters and dots only).
 */
import { QUESTIONS, BUILT } from '../rail/questions.js';

/** Every kind of address, for tests and for anyone who needs the list. `:step`, `:q` and `:focus` are the only variables. */
export const ROUTES = [
  { pattern: '#/',            screen: 'front' },
  { pattern: '#/c/:step',     screen: 'step' },      // numbers, answer, ways, keep
  { pattern: '#/soon/:q',     screen: 'soon' },      // a, b, d, e, f — never c
  { pattern: '#/plans',       screen: 'plans' },     // the saved plans of the account (or this window)
  { pattern: '#/plan/:planId',       screen: 'plan' },   // one saved plan, on its stage's first step
  { pattern: '#/plan/:planId/:step', screen: 'plan' },   // … on a named step (research/v7/your-plan.md 4.2)
  { pattern: '#/not-found',   screen: 'notFound' }   // what any unknown address becomes
];

export const NOT_FOUND = Object.freeze({ screen: 'notFound', q: null, step: null, planId: null, focus: null });
const FOCUS = /^[A-Za-z]+(\.[A-Za-z]+)*$/;
/** A saved plan's id: the one place a digit may appear in an address. It holds no figure (your-plan.md 3.8). */
export const PLAN_ID = /^[A-Za-z0-9_-]{1,64}$/;
/** The steps of "Your plan" (src/answers/plan/steps.js ALL_STEPS; named here so the router imports no reader). */
export const PLAN_STEPS = Object.freeze(['month', 'where', 'plan', 'pot', 'saving', 'budget', 'lock', 'hold', 'move', 'household']);
/** The editing sub-steps under a plan (src/answers/plan/steps.js ALL_SUB_STEPS): #/plan/<id>/about, /income, /spend (editing-in-v7.md 2, 7, 8). */
export const PLAN_SUB_STEPS = Object.freeze(['about', 'income', 'spend']);
const planStepOk = (s) => PLAN_STEPS.includes(s) || PLAN_SUB_STEPS.includes(s);

const route = (screen, q = null, step = null, focus = null, planId = null) => ({ screen, q, step, planId, focus });

export function parse(hash) {
  let text = String(hash ?? '');
  if (text.startsWith('#')) text = text.slice(1);
  let focus = null;
  const at = text.indexOf('?');
  if (at !== -1) {
    const query = text.slice(at + 1);
    text = text.slice(0, at);
    const m = /^focus=(.*)$/.exec(query);
    if (!m || !FOCUS.test(m[1])) return { ...NOT_FOUND };
    focus = m[1];
  }
  if (text === '' || text === '/') return route('front', null, null, focus);
  const parts = text.split('/');                       // '/c/numbers' → ['', 'c', 'numbers']
  if (parts[0] !== '') return { ...NOT_FOUND };
  // the saved plans: #/plans, #/plan/<id>, #/plan/<id>/<step> (never a focus: there is no box on a plan page)
  if (parts.length === 2 && parts[1] === 'plans' && focus === null) return route('plans');
  if (parts[1] === 'plan' && (parts.length === 3 || parts.length === 4) && focus === null && PLAN_ID.test(parts[2]) && (parts.length === 3 || planStepOk(parts[3]))) {
    return route('plan', null, parts.length === 4 ? parts[3] : null, null, parts[2]);
  }
  if (parts.length !== 3) return { ...NOT_FOUND };
  const [, first, second] = parts;
  if (first === 'soon') {
    const q = QUESTIONS.find((x) => x.id === second);
    return q && !q.built ? route('soon', q.id, null, focus) : { ...NOT_FOUND };
  }
  const question = BUILT[first];
  if (question && question.steps.some((s) => s.id === second)) return route('step', first, second, focus);
  return { ...NOT_FOUND };
}

export function format(r) {
  const tail = r && r.focus && FOCUS.test(r.focus) ? `?focus=${r.focus}` : '';
  if (!r) return '#/not-found';
  if (r.screen === 'front') return '#/' + tail;
  if (r.screen === 'step' && BUILT[r.q] && BUILT[r.q].steps.some((s) => s.id === r.step)) return `#/${r.q}/${r.step}${tail}`;
  if (r.screen === 'soon' && QUESTIONS.some((x) => x.id === r.q && !x.built)) return `#/soon/${r.q}${tail}`;
  if (r.screen === 'plans') return '#/plans';
  if (r.screen === 'plan' && typeof r.planId === 'string' && PLAN_ID.test(r.planId)) return `#/plan/${r.planId}` + (r.step && planStepOk(r.step) ? `/${r.step}` : '');
  return '#/not-found';
}

/** Shorthands for links: href.step('c', 'numbers', 'you.age') → '#/c/numbers?focus=you.age'. */
export const href = {
  front: () => format(route('front')),
  step: (q, step, focus = null) => format(route('step', q, step, focus)),
  soon: (q) => format(route('soon', q)),
  plans: () => format(route('plans')),
  plan: (planId, step = null) => format(route('plan', null, step, null, planId))
};

/**
 * The name of the screen a route draws — the value of data-screen (brief 4.9):
 * 'front' | 'c.numbers' | 'c.answer' | 'soon' | 'notBuilt' | 'plans' | 'plan' | 'plan.about' | 'plan.income'. An unknown address draws the front door.
 */
export function screenName(r) {
  if (!r || r.screen === 'front' || r.screen === 'notFound') return 'front';
  if (r.screen === 'soon') return 'soon';
  if (r.screen === 'plans') return 'plans';
  if (r.screen === 'plan') return r.step && PLAN_SUB_STEPS.includes(r.step) ? 'plan.' + r.step : 'plan';
  const step = BUILT[r.q] && BUILT[r.q].steps.find((s) => s.id === r.step);
  if (!step) return 'front';
  return step.built ? `${r.q}.${r.step}` : 'notBuilt';
}
