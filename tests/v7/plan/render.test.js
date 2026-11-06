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
          // budgetRender.test.js, savingRender.test.js) and a saver's check-in, on its own address and the pot step's old one (release step
          // R3; checkInRender.test.js); every other step the plan page
          // … and Month by month (7.2.0; monthRender.test.js, which holds its boxes to its own rules), on its own address — a drawing plan
          // opens on it at its own address too, drawn as the plan page's first step
          const own = { lock: 'plan.lock', household: 'plan.household', hold: 'plan.hold', move: 'plan.move', budget: 'plan.budget', saving: 'plan.saving', checkin: 'plan.checkin', pot: 'plan.checkin', month: 'plan.month' };
          expect(root.querySelector('main').getAttribute('data-screen')).toBe(own[step] || 'plan');
          const opensOnMonth = step === null && pg.current === 'month';
          if (!['household', 'hold', 'move', 'budget', 'saving', 'checkin', 'pot', 'month'].includes(step) && !opensOnMonth) for (const p of checkPlanPage(root, text, scopesOf(pg.stageKey))) problems.push(`${e.plan.id} ${step || '(first)'} [${pg.stageKey}]: ${p}`);
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
  it('03 opens on Month by month with the stage line, no countdown, and "Record October" inside the new app (7.2.0: never the classic page)', () => {
    const { root, text } = draw(stateWith(entries, '#/plan/' + ladder.plan.id));
    expect(root.querySelector('[data-testid="plan.stageLine"]').textContent).toBe('Retired. Your ladder pays from April 2027. Locked 1 July 2026.');
    expect(root.querySelector('h1').textContent).toBe('Month by month');
    expect(text).toContain('October 2026 is not recorded yet');
    expect(text).toContain('Next: record October 2026.');
    const btn = root.querySelector('[data-testid="rail.next.button"]');
    expect(btn.textContent).toBe('Record October');
    expect(btn.getAttribute('href')).toBe('#/plan/' + ladder.plan.id + '/month');
    expect(root.querySelector('[data-testid="plan.month.submit"]').textContent).toBe('Record October 2026');
    // the last records, exact
    expect(root.querySelectorAll('[data-testid="plan.month.recent"] li').length).toBe(3);
    expect(text).toContain('September 2026: £');
    expect(text).not.toMatch(/about £/);
    expect(text).not.toContain('Record October in the classic planner');
  });
  it('03 "Your plan as locked": every section fixed on the lock day, the unlock line once, the prices said, the document\'s steps', () => {
    const { root, text } = draw(stateWith(entries, '#/plan/' + ladder.plan.id + '/plan'));
    expect(root.querySelector('h1').textContent).toBe('Your plan as locked');
    expect(text).toContain('£34,000 a year before tax; your ladder pays from April 2027 (tax year 2027/28)');
    const sections = [...root.querySelectorAll('[data-section]')].map((s) => s.getAttribute('data-section'));
    expect(sections).toEqual(['about', 'pays', 'pots', 'income', 'way', 'mix', 'else']);
    expect((text.match(/Fixed when you locked the plan on 1 July 2026\./g) || []).length).toBe(7);   // six sections and "Everything else"
    expect(root.querySelectorAll('[data-testid="plan.unlock"]').length).toBe(1);
    expect(text).toContain('At the prices of July 2026.');
    expect(text).toContain('From age 66: £34,000 a year before tax (tax year 2027/28)');
    expect(text).toContain('From age 79: £24,000 a year before tax (tax year 2040/41), falling 1% a year');
    expect(text).toContain('How the money is taken: Full gilt ladder.');
    expect(root.querySelector('[data-testid^="plan.plan.change."]')).toBe(null);   // no Change on a locked plan
    expect(root.querySelector('[data-testid="plan.plan.openDocument"]').textContent).toBe('Open the plan document in the classic planner');
    expect(root.querySelector('[data-testid="plan.plan.testLocked"]')).not.toBe(null);
    expect(text).toContain('How this plan got here');
  });
  it('03 Where you are: months recorded this tax year, taken before tax, the plan\'s figure, the ladder from the document', () => {
    const { root, text } = draw(stateWith(entries, '#/plan/' + ladder.plan.id + '/where'));
    expect(text).toMatch(/3 months recorded in 2026\/27: £8,500 taken before tax; the plan says £[\d,]+ for the year/);
    expect(text).not.toContain('months to go');
    expect(root.querySelector('[data-key="drawn"]').getAttribute('data-value')).toBe('8500');
    expect(text).toContain('From your plan as locked, 1 July 2026');
  });
  it('03 What you hold and Moving to your plan\'s mix (their own screens since step 10; the plan page\'s panels keep the figures and link here)', () => {
    const hold = draw(stateWith(entries, '#/plan/' + ladder.plan.id + '/hold'));
    expect(hold.root.querySelector('main').getAttribute('data-screen')).toBe('plan.hold');
    expect(hold.text).toContain('Pension £639,382, ISA £35,052');
    expect(hold.text).toContain('Updated 20 June 2026');
    const move = draw(stateWith(entries, '#/plan/' + ladder.plan.id + '/move'));
    expect(move.text).toMatch(/\d+ of 14 gilts bought/);
    expect(move.text).toContain('Optional. Skipping it means what you hold may not match what the plan was tested on.');
    // the rail's panels on the plan page: the record's figure with its date and the stale flag, and the links into the two steps (no hand-over to the planner)
    const page = draw(stateWith(entries, '#/plan/' + ladder.plan.id + '/plan'));
    const pg = planPage(entries, ladder.plan.id, 'plan', { today: TODAY });
    expect(pg.steps.find((s) => s.id === 'hold').buttons).toEqual([{ id: 'changeHold', href: '#/plan/' + ladder.plan.id + '/hold', slots: {} }]);
    expect(pg.steps.find((s) => s.id === 'move').buttons).toEqual([{ id: 'openMove', href: '#/plan/' + ladder.plan.id + '/move', slots: {} }]);
    expect(page.root.querySelector('[data-testid="rail.plan.hold"]').getAttribute('href')).toBe('#/plan/' + ladder.plan.id + '/hold');
  });
  it('05 opens on its check-in, which reads as its pot step did; Where you are reads the pot against the path; the lock is not offered again', () => {
    const { root, text } = draw(stateWith(entries, '#/plan/' + saver.plan.id));
    expect(root.querySelector('[data-testid="plan.stageLine"]').textContent).toBe('Plan locked. Still working until February 2038. Locked 15 July 2026.');
    // the check-in took the pot step's place (release step R3); a plan locked while saving that never chose how often reads
    // as before, word for word: this month's pot, and the next sentence
    expect(root.querySelector('h1').textContent).toBe('Check in');
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
    expect(root.querySelectorAll('[data-testid^="plans.group."]').length).toBe(3);
    expect(root.querySelector('[data-testid="plans.group.household"] h2').textContent).toBe('Your household');
    // a closed plan (18, 6.56.0) sits last, under "Previous plans", naming the plan that carries it on
    const previous = root.querySelector('[data-testid="plans.group.previous"]');
    expect(previous.querySelector('h2').textContent).toBe('Previous plans');
    expect(previous.textContent).toContain('‘Pots and valves 2023’');
    expect(previous.textContent).toContain('Closed March 2025; carried on as ‘Pots and valves from April 2025’.');
    expect([...root.querySelectorAll('[data-testid^="plans.group."]')].pop()).toBe(previous);
    expect(text).toContain('‘Ours — Asha’');
    expect(text).toContain('‘My Plan’');                                    // never renamed
    expect(text).toContain('Retired. Your ladder pays from April 2027. Locked 1 July 2026.');
    expect(root.querySelectorAll('[data-testid^="plans.open."]').length).toBe(17);   // 19 (back to work) joined the corpus with its two plans
    // 13 (6.51.0): living on its ladder since an earlier tax year, the cash years paying until its first gilt — said by the
    // ladder's own years, never a plan year or a count of years
    expect(text).toContain('Retired. Living on the plan; your ladder’s first gilt pays from April 2028. Locked 12 November 2024.');
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
    expect(warn.root.querySelector('[data-testid="plan.windowWarning"]').textContent).toBe('This plan is kept in this browser window only. The classic planner opens on it without an account.');
  });
});

describe('a month that was missed (a report of 3 Nov 2026): the earliest month not recorded is the one to record', () => {
  /** The corpus with ONE month taken out of 04\'s records (April to September 2026): August. */
  function withoutAugust() {
    const raws = Object.values(C).map((p) => JSON.parse(JSON.stringify(p)));
    const b = raws.find((p) => p.id === C['04-buckets-running'].id);
    b.decisionTool.history = b.decisionTool.history.filter((h) => h.date !== '2026-08');
    return { raws, id: b.id };
  }
  it('04 without August: "August 2026 is not recorded yet; September 2026 is.", the button records August and carries it, September stays as it is, the next line names August', () => {
    const { raws, id } = withoutAugust();
    const entries = entriesAt(TODAY, raws);
    const { root, text } = draw(stateWith(entries, '#/plan/' + id));
    expect(root.querySelector('h1').textContent).toBe('Month by month');
    expect(text).toContain('August 2026 is not recorded yet; September 2026 is.');
    expect(text).toContain('September 2026 was recorded without it and stays as it is.');
    expect(text).toContain('Next: record August 2026.');
    expect(text).not.toContain('Nothing to do until');
    expect(text).not.toContain('October 2026 is not recorded yet');
    // the rail's next button opens Month by month inside the new app (7.2.0), naming the month missed; the page offers it to fill in
    const btn = root.querySelector('[data-testid="rail.next.button"]');
    expect(btn.textContent).toBe('Record August');
    expect(btn.getAttribute('href')).toBe('#/plan/' + id + '/month');
    expect(root.querySelector('[data-testid="plan.month.gap"]').textContent).toContain('August 2026');
    // the line names its source (the September record) and the page passes every check a plan page must
    expect(root.querySelector('[data-line="month.gapLater"] .plan-source')).not.toBe(null);
    expect(checkPlanPage(root, text, scopesOf('running')).filter((p) => p !== 'a box is drawn')).toEqual([]);   // Month by month has its boxes by design (7.2.0)
    // the reading itself
    const pg = planPage(entries, id, 'month', { today: TODAY });
    const month = pg.steps.find((s) => s.id === 'month');
    expect(month.done).toBe(false);
    expect(month.result.id).toBe('month.gap');
    expect(month.buttons[0]).toMatchObject({ id: 'record', href: '#/plan/' + id + '/month', month: '2026-08', slots: { month: 'August' } });
    expect(pg.next.id).toBe('P.month');
    expect(pg.next.button.month).toBe('2026-08');
  });
  it('the latest month recorded and an earlier one missing (the reported case): never "recorded, nothing to do" — the gap first', () => {
    const { raws, id } = withoutAugust();
    const today = '2026-09-30';   // September, the latest record, is this month
    const entries = entriesAt(today, raws);
    const { text } = draw(stateWith(entries, '#/plan/' + id, { today }));
    expect(text).toContain('August 2026 is not recorded yet; September 2026 is.');
    expect(text).toContain('Next: record August 2026.');
    expect(text).not.toContain('September 2026 recorded');
    expect(text).not.toContain('Nothing to do until');
    // the plan as the corpus has it, the same day: recorded, as before
    const whole = draw(stateWith(entriesAt(today), '#/plan/' + id, { today }));
    expect(whole.text).toContain('September 2026 recorded');
    expect(whole.text).toContain('September 2026 is recorded. Nothing to do until October.');
  });
  it('two months missing: the earlier one first; months before the first record are never counted; the plan as the corpus has it is as before', () => {
    const { raws, id } = withoutAugust();
    const b = raws.find((p) => p.id === id);
    b.decisionTool.history = b.decisionTool.history.filter((h) => h.date !== '2026-06');
    const two = draw(stateWith(entriesAt(TODAY, raws), '#/plan/' + id));
    expect(two.text).toContain('June 2026 is not recorded yet; September 2026 is.');
    expect(two.text).toContain('Record June');
    expect(two.text).not.toContain('Record June in the classic planner');
    // April gone as well: the plan now begins in May, and May is not a gap
    b.decisionTool.history = b.decisionTool.history.filter((h) => h.date !== '2026-04');
    const later = draw(stateWith(entriesAt(TODAY, raws), '#/plan/' + id));
    expect(later.text).toContain('June 2026 is not recorded yet; September 2026 is.');
    expect(later.text).not.toContain('April 2026 is not');
    expect(later.text).not.toContain('May 2026 is not');
    const whole = draw(stateWith(entriesAt(TODAY), '#/plan/' + id));
    expect(whole.text).toContain('October 2026 is not recorded yet');
    expect(whole.text).not.toContain('October 2026 is not recorded yet;');
    expect(whole.text).toContain('Next: record October 2026.');
    expect(whole.root.querySelector('[data-line="month.gapLater"]')).toBe(null);
  });
  it('the month before a record made with "payment already made" (marked paidAhead) is not a gap, whatever the date; a gap further back still is; an unmarked record reads as before', () => {
    const { raws, id } = withoutAugust();
    const b = raws.find((p) => p.id === id);
    b.decisionTool.history.find((h) => h.date === '2026-09').paidAhead = true;   // September's entry was made in August, after August's payment
    const today = '2026-09-30';
    const sept = draw(stateWith(entriesAt(today, raws), '#/plan/' + id, { today }));
    expect(sept.text).toContain('September 2026 recorded');
    expect(sept.text).toContain('September 2026 is recorded. Nothing to do until October.');
    expect(sept.text).not.toContain('August 2026 is not recorded');
    // the calendar moves on: the reading is the same, October is the month to record and no "stays as it is" line
    const oct = draw(stateWith(entriesAt(TODAY, raws), '#/plan/' + id));
    expect(oct.text).toContain('October 2026 is not recorded yet');
    expect(oct.text).not.toContain('August 2026 is not recorded');
    expect(oct.text).toContain('Next: record October 2026.');
    expect(oct.root.querySelector('[data-line="month.gapLater"]')).toBe(null);
    const pg = planPage(entriesAt(TODAY, raws), id, 'month', { today: TODAY });
    expect(pg.steps.find((s) => s.id === 'month').gap).toBe(null);
    // July gone as well: August was paid, July was missed
    b.decisionTool.history = b.decisionTool.history.filter((h) => h.date !== '2026-07');
    const two = draw(stateWith(entriesAt(TODAY, raws), '#/plan/' + id));
    expect(two.text).toContain('July 2026 is not recorded yet; September 2026 is.');
    expect(two.text).toContain('Record July');
    // the mark means true alone: any other value is no mark
    b.decisionTool.history.find((h) => h.date === '2026-09').paidAhead = 'yes';
    expect(draw(stateWith(entriesAt(TODAY, raws), '#/plan/' + id)).text).toContain('July 2026 is not recorded yet; September 2026 is.');
  });
  it('the review\'s case: July to September recorded (03), an entry made in October after the payment and dated November: "November recorded" on 3 November, never "October is not recorded yet"', () => {
    const raws = Object.values(C).map((p) => JSON.parse(JSON.stringify(p)));
    const id = C['03-gilt-ladder-runup'].id;
    const b = raws.find((p) => p.id === id);
    const sep = b.decisionTool.history.find((h) => h.date === '2026-09');
    b.decisionTool.history.push({ ...sep, date: '2026-11', paidAhead: true });
    const today = '2026-11-03';
    const marked = draw(stateWith(entriesAt(today, raws), '#/plan/' + id + '/month', { today }));
    expect(marked.text).toContain('November 2026 recorded');
    expect(marked.text).toContain('November 2026 is recorded. Nothing to do until December.');
    expect(marked.text).not.toContain('October 2026 is not recorded');
    expect(marked.root.querySelector('[data-line="month.gapLater"]')).toBe(null);
    expect(checkPlanPage(marked.root, marked.text, scopesOf('bridge')).filter((p) => p !== 'a box is drawn')).toEqual([]);
    // the same plan, the record unmarked (made before the mark existed): October reads as missed, as a plan recorded before the mark does
    delete b.decisionTool.history.find((h) => h.date === '2026-11').paidAhead;
    const plain = draw(stateWith(entriesAt(today, raws), '#/plan/' + id + '/month', { today }));
    expect(plain.text).toContain('October 2026 is not recorded yet; November 2026 is.');
    expect(plain.text).toContain('November 2026 was recorded without it and stays as it is.');
    expect(plain.text).toContain('Next: record October 2026.');
  });
  it('a month skipped with no later record (03: July to September recorded, November come): October first, and no "stays as it is" line, since nothing was recorded after it', () => {
    const today = '2026-11-15';
    const id = C['03-gilt-ladder-runup'].id;
    const { root, text } = draw(stateWith(entriesAt(today), '#/plan/' + id + '/month', { today }));
    expect(text).toContain('October 2026 is not recorded yet; September 2026 is.');
    expect(text).toContain('Next: record October 2026.');
    expect(root.querySelector('[data-testid="rail.next.button"]').textContent).toBe('Record October');
    expect(root.querySelector('[data-line="month.gapLater"]')).toBe(null);
    expect(checkPlanPage(root, text, scopesOf('bridge')).filter((p) => p !== 'a box is drawn')).toEqual([]);
  });
});
