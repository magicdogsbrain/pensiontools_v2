/**
 * Road step 11b's rows on the existing steps, drawn (research/v7/road-to-7.md step 11b): the out-of-date draft's offer on
 * "About you and when" with "Update it" (the boxes set, then Save) and "Leave it" (one write); the State Pension date box on
 * "Money that comes in anyway", under the choice, only while a State Pension is chosen, with its problem in words; where each
 * lump sum lands under its card; "Turn a lump sum into income" on "What you spend" — the line for each lump sum and the
 * press that moves the cards (the draft, not a write); the budget's buttons there link into the preview's budget step; the
 * picture's bars carry the motion rule in the stylesheet. No banned word in any scope a plan page is shown in.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText, bannedHits } from '../render/checkScreen.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { viewFor } from '../../../src/v7/effects/planSource.js';
import { taxYearStartOf } from '../../../src/services/PlanTiming.js';
import { ABOUT } from '../../../src/v7/copy/about.js';
import { INCOME } from '../../../src/v7/copy/income.js';
import { corpus, entryOf, stateWith, TODAY, noon } from './_plans.js';

const C = corpus();
const RETIRED = ['all', 'record', 'retired', 'planner'];
const copy = (v) => JSON.parse(JSON.stringify(v));
const thisTY = taxYearStartOf(noon(TODAY));

function draw(state, ...actions) {
  let s = state;
  for (const a of actions) s = reduce(s, typeof a === 'function' ? a(s) : a);
  s = reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) });
  const root = document.createElement('div');
  root.id = 'app';
  const out = [];
  render(h(App, { state: s, dispatch: (a) => out.push(a) }), root);
  const words = root.cloneNode(true);
  for (const el of words.querySelectorAll('.plan-name')) el.remove();
  return { state: s, root, actions: out, text: visibleText(root), words: visibleText(words) };
}
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
function staleRaw() {
  const p = copy(C['02-pnv-draft']);
  p.stressTool.settings.firstTaxYear = thisTY - 1;
  p.stressTool.settings.retired = true;
  delete p.stressTool.settings.staleDraftDismissedFor;
  return p;
}

describe('the out-of-date draft on "About you and when"', () => {
  it('the offer with its years, "Update it" sets the boxes and saves, "Leave it" asks for the one write; the toast after it; never on a plan as saved or one that was left', () => {
    const raw = staleRaw();
    const entries = [entryOf(raw, TODAY)];
    const { root, actions, words } = draw(stateWith(entries, '#/plan/' + raw.id + '/about'));
    const box = one(root, 'plan.about.stale');
    expect(box).not.toBe(null);
    expect(box.getAttribute('data-saved-year')).toBe(String(thisTY - 1));
    expect(box.textContent).toContain(`This plan was set to start in ${thisTY - 1}/${String(thisTY).slice(2)}, which has passed.`);
    one(root, 'plan.about.stale.update').click();
    expect(actions).toEqual([
      { type: 'plan/edit', planId: raw.id, path: 'stopped', value: 'yes' },
      { type: 'plan/edit', planId: raw.id, path: 'startWhen', value: 'now' },
      { type: 'plan/save', planId: raw.id }
    ]);
    one(root, 'plan.about.stale.leave').click();
    expect(actions.pop()).toEqual({ type: 'plan/staleLeave', planId: raw.id });
    expect(bannedHits(words, RETIRED)).toEqual([]);
    const left = draw(stateWith(entries, '#/plan/' + raw.id + '/about'), { type: A.PLAN_SAVED, planId: raw.id, previous: { 'stressTool.settings.staleDraftDismissedFor': undefined }, line: { id: 'staleLeft', slots: { yearSaved: '2025/26' } }, op: 'stale' });
    expect(left.text).toContain('Left as it is, starting in 2025/26. You will not be asked again for that year.');
    const plain = draw(stateWith([entryOf(C['02-pnv-draft'], TODAY)], '#/plan/' + C['02-pnv-draft'].id + '/about'));
    expect(one(plain.root, 'plan.about.stale')).toBe(null);
    const shown = draw(stateWith([{ ...entries[0], newer: true }], '#/plan/' + raw.id + '/about'));
    expect(one(shown.root, 'plan.about.stale')).toBe(null);
    expect(ABOUT.stale.line).toBeTypeOf('string');
  });
});

describe('the State Pension date and the lump sums on "Money that comes in anyway"', () => {
  const raw = C['12-lumpy-db-gia'];
  const entries = [entryOf(raw, TODAY)];
  const id = raw.id;

  it('the date box under the choice with the saved text and its source; typing dispatches plan/edit; a date of birth is said in its own words once the box is left; no box with no State Pension', () => {
    const { root, actions, words } = draw(stateWith(entries, '#/plan/' + id + '/income'));
    const box = one(root, 'plan.income.spDate');
    expect(box).not.toBe(null);
    expect(box.value).toBe('25 July 2034');
    expect(root.querySelector('label[for="plan.income.spDate"]').textContent).toContain(INCOME.fields.spDate.label);
    expect(root.querySelector('[data-saved-for="spDate"]')).not.toBe(null);
    box.value = '6 May 2035';
    box.dispatchEvent(new Event('input', { bubbles: true }));
    expect(actions.pop()).toEqual({ type: 'plan/edit', planId: id, path: 'spDate', value: '6 May 2035' });
    expect(bannedHits(words, RETIRED, { skip: ['pence'] })).toEqual([]);   // the forecast's weekly figure beside the choice carries pence, as the letter does (the step's own words: incomeRender.test.js)
    const wrong = draw(stateWith(entries, '#/plan/' + id + '/income'), { type: A.PLAN_EDIT, planId: id, path: 'spDate', value: '1967-05-06' }, { type: A.PLAN_TOUCH, planId: id, path: 'spDate' });
    expect(wrong.root.querySelector('[data-error-for="plan.income.spDate"], [id="plan.income.spDate.error"]').textContent).toBe(INCOME.errors.spDate.looksLikeBirth);
    const none = draw(stateWith(entries, '#/plan/' + id + '/income'), { type: A.PLAN_EDIT, planId: id, path: 'spKind', value: 'none' });
    expect(one(none.root, 'plan.income.spDate')).toBe(null);
  });

  it('where each lump sum lands, under its card, in the plan\'s own words; the typed amount moves it', () => {
    const { root } = draw(stateWith(entries, '#/plan/' + id + '/income'));
    expect(one(root, 'plan.income.lumps.landing.0').textContent).toBe(INCOME.lists.lumps.landing['lump.pension']);
    const cash = one(root, 'plan.income.lumps.landing.1');
    expect(cash.getAttribute('data-landing')).toMatch(/^lump\.cash\.i?p?t$/);
    expect(cash.textContent).toMatch(/^That year: £20,000 into the ISA/);
    expect(cash.textContent).toContain('a taxable account held as a 60/20/20 mix');
    const small = draw(stateWith(entries, '#/plan/' + id + '/income'), { type: A.PLAN_EDIT, planId: id, path: 'lumps.1.amount', value: '15,000' });
    expect(one(small.root, 'plan.income.lumps.landing.1').textContent).toBe('That year: £15,000 into the ISA; nothing left over for a taxable account.');
  });
});

describe('"Turn a lump sum into income" and the budget\'s links on "What you spend"', () => {
  const raw = C['12-lumpy-db-gia'];
  const entries = [entryOf(raw, TODAY)];
  const id = raw.id;

  it('a line for each lump sum with what it could support; the press dispatches the edits (the draft, no write); the cards then hold the steps; the budget buttons link into the preview', () => {
    const { root, actions, state, words } = draw(stateWith(entries, '#/plan/' + id + '/spend'));
    expect(one(root, 'plan.spend.lumps')).not.toBe(null);
    const lumps = state.plans.view.page.spend.lumps;
    expect(lumps.length).toBe(2);
    const line = one(root, `plan.spend.lumps.${lumps[1].id}`);
    expect(line.getAttribute('data-per-year')).toBe(String(lumps[1].perYearValue));
    expect(line.textContent).toContain(`Downsizing, £90,000 at age ${lumps[1].age}: ${lumps[1].perYear} a year more before tax over the ${lumps[1].years} years left`);
    one(root, `plan.spend.lumps.${lumps[1].id}.add`).click();
    expect(actions.every((a) => a.type === 'plan/edit')).toBe(true);
    expect(actions.map((a) => a.path)).toEqual(lumps[1].edits.map((e) => e.path));
    const after = draw(stateWith(entries, '#/plan/' + id + '/spend'), ...lumps[1].edits.map((e) => ({ type: A.PLAN_EDIT, planId: id, path: e.path, value: e.value })));
    const cards = after.root.querySelectorAll('[data-card^="steps."]');
    expect(cards.length).toBe(3);
    expect(after.root.querySelector(`[data-testid="plan.spend.steps.n1.fromAge"]`).value).toBe(String(lumps[1].age));
    expect(one(after.root, 'plan.spend.budget.change').getAttribute('href')).toBe('#/plan/' + id + '/budget');
    expect(bannedHits(words, RETIRED)).toEqual([]);
    expect(words).not.toMatch(/in the planner/);
  });

  it('the stylesheet eases the bars from one shape to the next, and the base sheet turns every transition off for less motion', () => {
    const css = readFileSync(join(process.cwd(), 'src', 'v7', 'styles', 'components.css'), 'utf8');
    expect(css).toMatch(/\.shape-plot rect\.part-pots, \.shape-plot rect\.part-income, \.shape-plot rect\.part-below \{ transition: y 450ms ease-out, height 450ms ease-out; \}/);
    const base = readFileSync(join(process.cwd(), 'src', 'v7', 'styles', 'base.css'), 'utf8');
    expect(base).toMatch(/@media \(prefers-reduced-motion: reduce\) \{\s*\*, \*::before, \*::after \{ animation: none !important; transition: none !important;/);
  });
});
