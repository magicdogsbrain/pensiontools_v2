/**
 * T5 (research/v7/your-plan.md 9; 3): the plan pages drawn from states — every committed plan at three dates, on every
 * step; the household pair; the list in each of its states. No box of any kind; every figure through Money (data-key,
 * data-value), rounded to the pound; a source on every panel line; the banned list by scope, with the retired rules on
 * retired stages and the saver rules on saving ones; no countdown anywhere; a locked plan's settings "Fixed when you
 * locked the plan", the unlock line once; a plan shown as saved offers no change.
 */
import { describe, it, expect } from 'vitest';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText, bannedHits } from '../render/checkScreen.js';
import { ALL_STEPS, STEPS, RETIRED_STAGES, SAVER_STAGES } from '../../../src/answers/plan/steps.js';
import { planPage } from '../../../src/answers/plan/read.js';
import { ADVICE_SHORT } from '../../../src/v7/copy/common.js';
import { corpus, entriesAt, entryOf, household, stateWith, DATES, TODAY } from './_plans.js';

const C = corpus();
function draw(state) {
  const root = document.createElement('div');
  root.id = 'app';
  const actions = [];
  render(h(App, { state, dispatch: (a) => actions.push(a) }), root);
  return { root, actions, text: visibleText(root), words: wordsOf(root) };
}
/** The screen's words less the plans' names: a name is the person's own text, shown exactly as typed (1.2), never checked. */
function wordsOf(root) {
  const copy = root.cloneNode(true);
  for (const el of copy.querySelectorAll('.plan-name')) el.remove();
  return visibleText(copy);
}
const COUNTDOWN = /\b\d+ (more )?(years?|months?|weeks?|days?) (to go|to wait|until|till|away|from now|before (your|the) (plan|ladder))\b|\bcount[\s-]?down\b|\bto go\b/i;

/** The checks every drawn plan page must pass (3.1, 3.7, 3.2). */
function checkPlanPage(root, text, scopes) {
  const problems = [];
  const words = wordsOf(root);
  if (root.querySelector('input, select, textarea')) problems.push('a box is drawn');
  if (root.querySelectorAll('main[data-screen]').length !== 1) problems.push('data-screen');
  if (!text.includes(ADVICE_SHORT)) problems.push('no ADVICE_SHORT');
  // every figure in the step's panel is drawn through Money: a digit with a pound sign and no data-value is a leak
  const panel = root.querySelector('[data-region="plan-step"]');
  if (panel) {
    for (const el of panel.querySelectorAll('.plan-value, .line, .plan-fact')) {
      const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.nodeValue).join('');
      if (/£\s?\d/.test(own)) problems.push(`a pound figure drawn as text: "${own.trim()}"`);
    }
    for (const el of panel.querySelectorAll('[data-key]')) {
      if (el.hasAttribute('data-value')) {
        const v = el.getAttribute('data-value');
        if (!/^-?\d+(\.\d+)?$/.test(v)) problems.push(`${el.getAttribute('data-key')} data-value ${v}`);
        if (el.getAttribute('data-kind') === 'money' && /\./.test(v)) problems.push(`${el.getAttribute('data-key')} is not whole pounds: ${v}`);
      }
    }
    // every line of the step's own panel names its source
    for (const li of panel.querySelectorAll(':scope > ul.plan-lines > li.plan-line')) if (!li.querySelector('.plan-source')) problems.push(`no source on line ${li.getAttribute('data-line')}`);
  }
  if (COUNTDOWN.test(words)) problems.push(`a countdown: ${COUNTDOWN.exec(words)[0]}`);
  for (const hit of bannedHits(words, scopes)) problems.push(hit);
  if (/undefined|NaN|\[object|\{\w+\}/.test(words)) problems.push('junk');
  return problems;
}
const scopesOf = (stageKey) => ['all', 'record', ...(RETIRED_STAGES.includes(stageKey) ? ['retired'] : []), ...(SAVER_STAGES.includes(stageKey) ? ['saver'] : [])];

describe('every committed plan, every step, three dates (T5)', () => {
  for (const today of DATES) {
    it(`at ${today}`, () => {
      const entries = entriesAt(today);
      const problems = [];
      for (const e of entries) {
        for (const step of [null, ...ALL_STEPS]) {
          const state = stateWith(entries, '#/plan/' + e.plan.id + (step ? '/' + step : ''), { today });
          const { root, text } = draw(state);
          const pg = planPage(entries, e.plan.id, step, { today });
          // "Lock the plan" draws its own screen (road-to-7.md step 6; tests/v7/plan/lockRender.test.js), and so do "Your household" (step 9; householdRender.test.js, which holds its boxes to its own rules),
          // "What you hold" and "Moving to your plan's mix" (step 10; holdRender.test.js, moveRender.test.js), the budget and "What you pay in" (step 11b;
          // budgetRender.test.js, savingRender.test.js); every other step the plan page
          const own = { lock: 'plan.lock', household: 'plan.household', hold: 'plan.hold', move: 'plan.move', budget: 'plan.budget', saving: 'plan.saving' };
          expect(root.querySelector('main').getAttribute('data-screen')).toBe(own[step] || 'plan');
          if (!['household', 'hold', 'move', 'budget', 'saving'].includes(step)) for (const p of checkPlanPage(root, text, scopesOf(pg.stageKey))) problems.push(`${e.plan.id} ${step || '(first)'} [${pg.stageKey}]: ${p}`);
          // the rail: one current step, a link per listed step, the next sentence
          const rail = root.querySelector('[data-region="rail"]');
          if (!rail) problems.push(`${e.plan.id}: no rail`);
          else {
            if (rail.querySelectorAll('[aria-current="step"]').length !== 1) problems.push(`${e.plan.id} ${step}: current steps`);
            for (const s of pg.steps) if (!rail.querySelector(`[data-testid="rail.plan.${s.id}"]`)) problems.push(`${e.plan.id}: no rail link for ${s.id}`);
            if (!rail.querySelector('[data-testid="rail.next"] [data-next]').textContent.trim()) problems.push(`${e.plan.id}: empty next sentence`);
          }
        }
      }
      expect(problems).toEqual([]);
    });
  }
});

describe('the locked ladder in its run-up (03) and the committed saver (05)', () => {
  const entries = entriesAt(TODAY);
  const ladder = entries.find((e) => e.plan.id === C['03-gilt-ladder-runup'].id);
  const saver = entries.find((e) => e.plan.id === C['05-saver-committed'].id);
  it('03 opens on This month with the stage line, no countdown, and "Record October in the planner"', () => {
    const { root, text, actions } = draw(stateWith(entries, '#/plan/' + ladder.plan.id));
    expect(root.querySelector('[data-testid="plan.stageLine"]').textContent).toBe('Retired. Your ladder pays from April 2027. Locked 1 July 2026.');
    expect(root.querySelector('h1').textContent).toBe('This month');
    expect(text).toContain('October 2026 is not recorded yet');
    expect(text).toContain('Next: record October 2026.');
    const btn = root.querySelector('[data-testid="plan.month.record"]');
    expect(btn.textContent).toBe('Record October in the planner');
    btn.click();
    expect(actions).toEqual([{ type: 'plan/change', planId: ladder.plan.id, place: 'month', back: '#/plan/' + ladder.plan.id + '/month' }]);
    // the last records, exact, each from its record
    expect(root.querySelectorAll('[data-line="month.record"]').length).toBe(3);
    expect(text).toContain('From your record, September 2026');
    expect(text).not.toMatch(/about £/);
  });
  it('03 "Your plan as locked": every section fixed on the lock day, the unlock line once, the prices said, the document\'s steps', () => {
    const { root, text } = draw(stateWith(entries, '#/plan/' + ladder.plan.id + '/plan'));
    expect(root.querySelector('h1').textContent).toBe('Your plan as locked');
    expect(text).toContain('£52,000 a year before tax; your ladder pays from April 2027 (tax year 2027/28)');
    const sections = [...root.querySelectorAll('[data-section]')].map((s) => s.getAttribute('data-section'));
    expect(sections).toEqual(['about', 'pays', 'pots', 'income', 'way', 'mix', 'else']);
    expect((text.match(/Fixed when you locked the plan on 1 July 2026\./g) || []).length).toBe(7);   // six sections and "Everything else"
    expect(root.querySelectorAll('[data-testid="plan.unlock"]').length).toBe(1);
    expect(text).toContain('At the prices of July 2026.');
    expect(text).toContain('From age 58: £52,000 a year before tax (tax year 2027/28)');
    expect(text).toContain('From age 78: £36,000 a year before tax (tax year 2047/48), falling 1% a year');
    expect(text).toContain('How the money is taken: Full gilt ladder.');
    expect(root.querySelector('[data-testid^="plan.plan.change."]')).toBe(null);   // no Change on a locked plan
    expect(root.querySelector('[data-testid="plan.plan.openDocument"]').textContent).toBe('Open the plan document in the planner');
    expect(root.querySelector('[data-testid="plan.plan.testLocked"]')).not.toBe(null);
    expect(text).toContain('How this plan got here');
  });
  it('03 Where you are: months recorded this tax year, taken before tax, the plan\'s figure, the ladder from the document', () => {
    const { root, text } = draw(stateWith(entries, '#/plan/' + ladder.plan.id + '/where'));
    expect(text).toMatch(/3 months recorded in 2026\/27: £13,000 taken before tax; the plan says £[\d,]+ for the year/);
    expect(text).not.toContain('months to go');
    expect(root.querySelector('[data-key="drawn"]').getAttribute('data-value')).toBe('13000');
    expect(text).toContain('From your plan as locked, 1 July 2026');
  });
  it('03 What you hold and Moving to your plan\'s mix (their own screens since step 10; the plan page\'s panels keep the figures and link here)', () => {
    const hold = draw(stateWith(entries, '#/plan/' + ladder.plan.id + '/hold'));
    expect(hold.root.querySelector('main').getAttribute('data-screen')).toBe('plan.hold');
    expect(hold.text).toContain('Pension £1,050,008, ISA £79,962');
    expect(hold.text).toContain('Updated 20 June 2026');
    const move = draw(stateWith(entries, '#/plan/' + ladder.plan.id + '/move'));
    expect(move.text).toMatch(/\d+ of 23 gilts bought/);
    expect(move.text).toContain('Optional. Skipping it means what you hold may not match what the plan was tested on.');
    // the rail's panels on the plan page: the record's figure with its date and the stale flag, and the links into the two steps (no hand-over to the planner)
    const page = draw(stateWith(entries, '#/plan/' + ladder.plan.id + '/plan'));
    const pg = planPage(entries, ladder.plan.id, 'plan', { today: TODAY });
    expect(pg.steps.find((s) => s.id === 'hold').buttons).toEqual([{ id: 'changeHold', href: '#/plan/' + ladder.plan.id + '/hold', slots: {} }]);
    expect(pg.steps.find((s) => s.id === 'move').buttons).toEqual([{ id: 'openMove', href: '#/plan/' + ladder.plan.id + '/move', slots: {} }]);
    expect(page.root.querySelector('[data-testid="rail.plan.hold"]').getAttribute('href')).toBe('#/plan/' + ladder.plan.id + '/hold');
  });
  it('05 opens on This month\'s pot; Where you are reads the pot against the path; the lock is not offered again', () => {
    const { root, text } = draw(stateWith(entries, '#/plan/' + saver.plan.id));
    expect(root.querySelector('[data-testid="plan.stageLine"]').textContent).toBe('Plan locked. Still working until February 2038. Locked 15 July 2026.');
    expect(root.querySelector('h1').textContent).toBe('This month’s pot');
    expect(text).toContain('October’s pot is not recorded yet');
    expect(text).toContain('Your plan is locked and you stop work in February 2038. Next: record this month’s pot.');
    expect(root.querySelector('[data-testid="rail.plan.lock"]')).toBe(null);
    const where = draw(stateWith(entries, '#/plan/' + saver.plan.id + '/where'));
    expect(where.text).toMatch(/£319,800 on September 2026; the plan’s middle line for then is £[\d,]+/);
    expect(where.text).toContain('From your record, September 2026');
  });
  it('a step not on the stage\'s list still opens and says so (R7)', () => {
    // the retired ladder lists no "What you pay in": its own screen (step 11b) opens all the same and says so; the plan page's own steps say so too (pot on the ladder)
    const { root, text } = draw(stateWith(entries, '#/plan/' + ladder.plan.id + '/saving'));
    expect(root.querySelector('[data-testid="plan.notListed"]')).not.toBe(null);
    expect(text).toContain('Nothing paid in');
    const pot = draw(stateWith(entries, '#/plan/' + ladder.plan.id + '/pot'));
    expect(pot.root.querySelector('[data-testid="plan.notListed"]')).not.toBe(null);
  });
  it('a plan shown as saved: the sentence, and not one Change button', () => {
    const newer = entries.map((e) => (e === ladder ? { ...e, newer: true } : e));
    const { root, text } = draw(stateWith(newer, '#/plan/' + ladder.plan.id + '/plan'));
    expect(root.querySelector('[data-testid="plan.readonly"]')).not.toBe(null);
    expect(text).toContain('This plan is shown as it was saved and cannot be changed here. Nothing has been lost.');
    expect(root.querySelector('[data-testid^="plan.plan.change."]')).toBe(null);
    expect(root.querySelector('.plan-actions')).toBe(null);
  });
  it('an unlocked saver (10): Change buttons per section, "Everything else" with "Show every setting"', () => {
    const b = entries.find((e) => e.plan.id === C['10-couple-b'].id);
    const { root, text, actions } = draw(stateWith(entries, '#/plan/' + b.plan.id + '/plan'));
    expect(root.querySelector('h1').textContent).toBe('Your plan');
    expect(text).toContain('Stopping work at 62, in January 2030');
    // every section is edited inside V7 now (the way of drawing since way-and-mix.md 2.1): no "Change this in the planner" on a section
    expect(root.querySelector('[data-testid^="plan.plan.change."]:not([data-testid="plan.plan.change.else"])')).toBe(null);
    // "About you and when" is edited inside V7 (editing-in-v7.md 2): a link to the step, never the planner
    expect(root.querySelector('[data-testid="plan.plan.change.about"]')).toBe(null);
    expect(root.querySelector('[data-testid="plan.plan.edit.about"]').getAttribute('href')).toBe('#/plan/' + b.plan.id + '/about');
    expect(root.querySelector('[data-testid="plan.plan.edit.about"]').textContent).toBe('Change this here');
    // "What the plan pays" is edited inside V7 too (editing-in-v7.md 8): a link to the spend step
    expect(root.querySelector('[data-testid="plan.plan.change.pays"]')).toBe(null);
    expect(root.querySelector('[data-testid="plan.plan.edit.pays"]').getAttribute('href')).toBe('#/plan/' + b.plan.id + '/spend');
    // "Your pots and tax" is edited inside V7 too (editing-in-v7.md 9): a link to the pots step
    expect(root.querySelector('[data-testid="plan.plan.change.pots"]')).toBe(null);
    expect(root.querySelector('[data-testid="plan.plan.edit.pots"]').getAttribute('href')).toBe('#/plan/' + b.plan.id + '/pots');
    // "How the money is taken" is in V7 too (way-and-mix.md 2.1): a link to the way step
    expect(root.querySelector('[data-testid="plan.plan.edit.way"]').getAttribute('href')).toBe('#/plan/' + b.plan.id + '/way');
    expect(root.querySelector('[data-testid="plan.plan.edit.way"]').textContent).toBe('Change this here');
    expect(actions.filter((a) => a.type === 'plan/change')).toEqual([]);
    expect(text).not.toContain('Fixed when you locked');
    expect(text).toContain('At today’s prices.');
    expect(root.querySelector('[data-testid="plan.plan.allOptions"]').textContent).toBe('Show every setting');
    const all = draw(stateWith(entries, '#/plan/' + b.plan.id + '/plan', { open: ['allOptions'] }));
    expect(all.root.querySelectorAll('[data-option]').length).toBeGreaterThan(20);
    expect(all.root.querySelector('[data-testid="plan.plan.allOptions"]').textContent).toBe('Show only what has been changed');
    for (const p of checkPlanPage(all.root, all.text, scopesOf('approaching'))) expect(p).toBe('');
  });
});

describe('the household pair: the retired partner\'s plan and the working partner\'s', () => {
  const { ladder, saver } = household();
  const entries = [entryOf(ladder), entryOf(saver)];
  it('the retired partner\'s household step (its own screen since 6.42.0) names the saver and opens their plan inside V7; the plan page\'s household section links to it', () => {
    const { root, text } = draw(stateWith(entries, '#/plan/HouseLadder01/household'));
    expect(root.querySelector('main').getAttribute('data-screen')).toBe('plan.household');
    expect(text).toContain('With ‘Saving plan’: still saving.');
    expect(root.querySelector('[data-testid="plan.household.openPartner"]').getAttribute('href')).toBe('#/plan/HouseSaver02');
    expect(root.querySelector('[data-testid="plan.household.check"]')).not.toBe(null);
    const pg = planPage(entries, 'HouseLadder01', 'plan', { today: TODAY });
    expect(pg.steps.find((s) => s.id === 'household').buttons.find((b) => b.id === 'checkTogether').href).toBe('#/plan/HouseLadder01/household');
  });
  it('the working partner\'s plan: What you pay in first; the household step says the ladder pays from April 2027; no countdown', () => {
    const { root, text } = draw(stateWith(entries, '#/plan/HouseSaver02'));
    expect(root.querySelector('h1').textContent).toBe('What you pay in');
    expect(text).toContain('£600 a month from you, £450 from your employer');
    const h = draw(stateWith(entries, '#/plan/HouseSaver02/household'));
    expect(h.text).toContain('With ‘Ladder plan’: retired. Their ladder pays from April 2027.');
    expect(COUNTDOWN.test(h.words)).toBe(false);
    expect(bannedHits(h.words, scopesOf('saving'))).toEqual([]);
  });
  it('the sign-out button shows while signed in on a plan page, and dispatches session/out', () => {
    const { root, actions } = draw(stateWith(entries, '#/plans'));
    root.querySelector('[data-testid="nav.signOut"]').click();
    expect(actions).toEqual([{ type: 'session/out' }]);
    const nobody = draw(stateWith(entries, '#/plans', { session: 'nobody', source: 'window' }));
    expect(nobody.root.querySelector('[data-testid="nav.signOut"]')).toBe(null);
    const front = draw(stateWith(null, '#/'));
    expect(front.root.querySelector('[data-testid="nav.signOut"]')).toBe(null);
    expect(front.root.querySelector('[data-testid="nav.plans"]').getAttribute('href')).toBe('#/plans');
  });
});

describe('the list (1.2) in each of its states', () => {
  const entries = entriesAt(TODAY);
  const list = (o, es = entries) => draw(stateWith(es, '#/plans', o));
  it('read: the groups, each plan by its own name with its stage line, Open; "Read at" and "Read again"', () => {
    const { root, text } = list({});
    expect(root.querySelector('main').getAttribute('data-screen')).toBe('plans');
    expect(root.querySelectorAll('[data-testid^="plans.group."]').length).toBe(2);
    expect(root.querySelector('[data-testid="plans.group.household"] h2').textContent).toBe('Your household');
    expect(text).toContain('‘Ours — Asha’');
    expect(text).toContain('‘My Plan’');                                    // never renamed
    expect(text).toContain('Retired. Your ladder pays from April 2027. Locked 1 July 2026.');
    expect(root.querySelectorAll('[data-testid^="plans.open."]').length).toBe(12);
    expect(text).toContain('Read at 14:03');
    expect(root.querySelector('[data-testid="plans.readAgain"]')).not.toBe(null);
    expect(root.querySelector('input, select, textarea')).toBe(null);
    const { words } = list({});
    for (const hit of bannedHits(words, ['all', 'record', 'retired'])) expect(hit).toBe('');
    expect(COUNTDOWN.test(words)).toBe(false);
  });
  it('checking, nobody, unverified, failed, used up, empty, the window\'s plans', () => {
    expect(draw(stateWith(null, '#/plans', { session: 'checking' })).root.querySelector('[data-testid="plans.opening"]')).not.toBe(null);
    const nobody = draw(stateWith([], '#/plans', { session: 'nobody', source: 'window' }));
    expect(nobody.root.querySelector('[data-testid="plans.nobody"]')).not.toBe(null);
    expect(nobody.text).toContain('Sign in to see your plans.');
    expect(nobody.text).toContain('No account? Ask a question: an answer needs no account.');
    // "Sign in" is V7's own account page since road-to-7.md step 11 (the planner's ?signin=1 door stays for the hand-over)
    expect(nobody.root.querySelector('a[data-testid="plans.signIn"]').getAttribute('href')).toBe('#/account');
    expect(nobody.actions).toEqual([]);
    const unverified = draw(stateWith(null, '#/plans', { session: 'unverified' }));
    expect(unverified.root.querySelector('[data-testid="plans.unverified"]')).not.toBe(null);
    expect(unverified.root.querySelector('[data-testid="plans.account"]').getAttribute('href')).toBe('#/account');
    let s = stateWith(null, '#/plans', { session: 'in' });
    s = { ...s, plans: { status: 'failed', source: 'account', readAt: null, list: [] } };
    const failed = draw(s);
    expect(failed.text).toContain('Sorry, we could not read your plans. Nothing was changed.');
    failed.root.querySelector('[data-testid="plans.tryAgain"]').click();
    expect(failed.actions).toEqual([{ type: 'plans/reading' }]);
    let u = stateWith([], '#/plans', { session: 'nobody', source: 'window' });
    u = { ...u, plans: { ...u.plans, usedUp: true } };
    expect(draw(u).text).toContain('Your free time without an account is used up.');
    expect(draw(stateWith([], '#/plans', { session: 'in' })).root.querySelector('[data-testid="plans.empty"]').textContent).toContain('There are no plans in this account yet.');
    const win = draw(stateWith(entries.slice(0, 2), '#/plans', { session: 'nobody', source: 'window' }));
    expect(win.root.querySelector('[data-testid="plans.group.window"] h2').textContent).toBe('Kept in this window only, without an account');
    expect(win.root.querySelectorAll('[data-testid^="plans.open."]').length).toBe(2);
    expect(win.root.querySelector('a[data-testid="plans.signIn"]').getAttribute('href')).toBe('#/account');
  });
  it('a plan page before the plans are read, and an unknown id', () => {
    expect(draw(stateWith(null, '#/plan/abc', { session: 'checking' })).root.querySelector('[data-testid="plan.opening"]')).not.toBe(null);
    const unknown = draw(stateWith(entries, '#/plan/NoSuchPlan'));
    expect(unknown.text).toContain('That plan is not in this account.');
    expect(unknown.root.querySelector('a[href="#/plans"]')).not.toBe(null);
    const warn = draw(stateWith(entries.slice(0, 1), '#/plan/' + entries[0].plan.id, { session: 'nobody', source: 'window' }));
    expect(warn.root.querySelector('[data-testid="plan.windowWarning"]').textContent).toBe('In the planner, press ‘Just try it — no account’ to carry on with this plan.');
  });
});
