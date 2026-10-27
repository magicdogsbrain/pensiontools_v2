/**
 * L3 (research/v7/editing-in-v7.md 10.6): the "Does it last?" page drawn from states. Every corpus plan at three dates
 * with a made-up result held for its run key: the band with its word and bar and every figure on it, the rows, the
 * history, a box with a real label for every dial that applies with the saved value and its source beside each, the
 * "not used" note on a bought strategy, the derived lines, Save and Cancel, no banned word (the retired rules on retired
 * stages, the saver rules on saving ones), no countdown. Working, slow, failed and unaffordable states. A locked plan: no
 * box, "Fixed when…" once, the document's figure, the earlier-test line. A plan shown as saved: not run. The toast with
 * Undo. The plan page's links.
 */
import { describe, it, expect } from 'vitest';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText, bannedHits } from '../render/checkScreen.js';
import { RETIRED_STAGES, SAVER_STAGES } from '../../../src/answers/plan/steps.js';
import { LASTS_FIELDS } from '../../../src/answers/plan/schema.js';
import { planPage } from '../../../src/answers/plan/read.js';
import { lastsOf, runKeyOf, FAMILY } from '../../../src/answers/plan/lasts.js';
import { oneAnswer } from '../../../src/services/OneAnswer.js';
import { viewFor } from '../../../src/v7/effects/planSource.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
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
function wordsOf(root) {
  const copy = root.cloneNode(true);
  for (const el of copy.querySelectorAll('.plan-name')) el.remove();
  return visibleText(copy);
}
const COUNTDOWN = /\b\d+ (more )?(years?|months?|weeks?|days?) (to go|to wait|until|till|away|from now|before (your|the) (plan|ladder))\b|\bcount[\s-]?down\b|\bto go\b/i;
const scopesOf = (stageKey) => ['all', 'record', ...(RETIRED_STAGES.includes(stageKey) ? ['retired'] : []), ...(SAVER_STAGES.includes(stageKey) ? ['saver'] : [])];

const R = {
  strategyId: 'pots-and-valves', name: 'Pots & Valves', affordable: true,
  ruin: { hist: 2.1, mc: 7.3 }, n: { hist: 657, mc: 1000 }, coverage: 99.6,
  worst12: { min: 31000, median: 40000 }, terminal: { p10: 135978, p50: 1806699, p90: 4200000, histMedian: 1500000 },
  cones: { wealth: { p10: [1], p50: [1], p90: [1] }, income: { p10: [1], p50: [1], p90: [1] } },
  cuts: { futures: 1000, cutN: 190, cutPct: 19, ranOutN: 41, typicalCutPerYear: 4000, typicalCutYears: 3, typicalCutTotal: 12000, worstCutTotal: 31000 },
  guaranteedToAge: 'State Pension only (from age 67)'
};
const P = { durationYears: 39, startAge: 56 };
/** A made-up result for a plan, in the shape lastsRun.js returns. */
function fakeResult(strategyId, { stored = null, affordable = true } = {}) {
  const family = FAMILY.includes(strategyId);
  return {
    strategyId, ran: { family, cutsOn: family, cutPct: 20, months: 3 }, priced: family ? null : 'bundled',
    a: affordable ? oneAnswer({ ...R, strategyId, cuts: family ? R.cuts : null }, P) : null, reason: affordable ? null : 'the base ladder costs more than the pot',
    history: affordable ? {
      worst: [{ year: 1929, month: 9, s: 704, failed: true, failAge: 84, terminal: 0, worst12: 31000, unfair: true }, { year: 1966, month: 1, s: 1140, failed: false, terminal: 20000, worst12: 33000, cutYears: 4, cutReal: 16000, unfair: true }],
      named: [{ year: 1929, label: 'the Great Depression', kind: family ? 'pnv' : 'none', available: family, failed: false, terminal: 240000, worst12: 31000, cutYears: 4, cutReal: 16000 }, { year: 2008, label: 'the 2008 crisis', kind: family ? 'pnv' : 'none', tooShort: family, lastStart: 1986, available: false }]
    } : { worst: [], named: [] },
    // the year-by-year tables and the named stresses (road-to-7.md step 11b), in lastsRun.js extrasOf's shape
    extras: affordable ? {
      prices: 0.025, startAge: 56, duration: 39,
      schedule: strategyId === 'pots-and-valves' ? [{ year: 0, age: 56, pension: 30000, state: 0, tax: 3486, net: 26514, isa: 8000, spendable: 34514, isaLeft: 120000 }, { year: 1, age: 57, pension: 30750, state: 0, tax: 3600, net: 27150, isa: 8200, spendable: 35350, isaLeft: 114000 }] : null,
      glidepath: strategyId === 'pots-and-valves' ? { tent: false, diversifiers: false, reserve: false, rows: [{ year: 0, age: 56, shares: 300000, bonds: 200000, cash: 80000, diversifiers: 0, reserve: 0, sharesPct: 52, isa: 120000, total: 580000 }] } : null,
      own: strategyId === 'pots-and-valves' ? null : [{ year: 1, age: 56, incomeMid: 40000, incomeBad: 36000, leftMid: 900000 }],
      scenarios: [{ year: 1929, label: 'Great Depression', key: 'GREAT_DEPRESSION', kind: family ? 'pnv' : 'none', available: family, failed: false, terminal: 240000, worst12: 31000, cutYears: 4, cutReal: 16000, decade: { first: -0.64, decade: -0.39, prices: -0.21 } }],
      synthetic: { name: 'Synthetic Worst', decade: { first: -0.27, decade: -0.49, prices: 0.75 }, hardest: { year: 1929, month: 9 } }
    } : null,
    stored, basis: { today: TODAY, engine: 'one-test' }
  };
}
/** A state on the lasts step, with a run held for the plan's key (or working / failed), what was typed, and the reading refreshed. */
function lastsState(entries, id, { today = TODAY, typed = {}, touched = [], asked = false, source = 'account', session = 'in', ui = {}, run = 'done', result = null, slow = false, progress = null } = {}) {
  let s = stateWith(entries, '#/plan/' + id + '/lasts', { today, source, session });
  for (const [path, value] of Object.entries(typed)) s = reduce(s, { type: A.PLAN_EDIT, planId: id, path, value });
  for (const path of touched) s = reduce(s, { type: A.PLAN_TOUCH, planId: id, path });
  if (asked) s = reduce(s, { type: A.PLAN_SAVE, planId: id });
  const entry = entries.find((e) => e.plan.id === id);
  const key = entry ? runKeyOf(entry.plan) : null;
  if (key && run !== 'idle') {
    s = reduce(s, { type: A.LASTS_WORKING, key });
    if (progress) s = reduce(s, { type: A.LASTS_PROGRESS, key, ...progress });
    if (slow) s = reduce(s, { type: A.LASTS_SLOW, key });
    if (run === 'done') s = reduce(s, { type: A.LASTS_DONE, key, result: result || fakeResult(lastsOf(entries, id, { today }).strategyId) });
    if (run === 'failed') s = reduce(s, { type: A.LASTS_FAILED, key });
  }
  s = reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) });
  if (asked) s = { ...s, ui: { ...s.ui, saving: null } };
  return { ...s, ui: { ...s.ui, ...ui } };
}
const LUMPY = C['12-lumpy-db-gia'];
const ROTATION = C['07-pre-6.13-flat-params'];
const LADDER = C['03-gilt-ladder-runup'];
const BUCKETS = C['04-buckets-running'];

describe('every corpus plan at three dates, with a result: the band, the rows, the history, the boxes, the sources, the words', () => {
  for (const today of DATES) {
    it(`at ${today}`, () => {
      const entries = entriesAt(today);
      const problems = [];
      for (const e of entries) {
        const state = lastsState(entries, e.plan.id, { today });
        const { root, text, words } = draw(state);
        const pg = planPage(entries, e.plan.id, 'lasts', { today });
        const v = lastsOf(entries, e.plan.id, { today });
        expect(root.querySelector('main').getAttribute('data-screen')).toBe('plan.lasts');
        expect(root.querySelector('h1').textContent).toBe('Does it last?');
        const locked = !!(e.plan.decisionTool && e.plan.decisionTool.settings && e.plan.decisionTool.settings.locked);
        const region = root.querySelector('[data-region="plan-lasts"]');
        const answer = root.querySelector('[data-region="plan-lasts-answer"]');
        if (!region || !answer) { problems.push(`${e.plan.id}: no region`); continue; }
        // the band: a verdict word, the bar, the figures as data, the rows
        const band = root.querySelector('[data-testid="plan.lasts.result"]');
        if (!band) problems.push(`${e.plan.id}: no band`);
        else {
          if (answer.getAttribute('data-status') !== 'done' || answer.getAttribute('data-fresh') !== '1') problems.push(`${e.plan.id}: the run is not shown as done and fresh`);
          if (!['yes', 'close', 'no'].includes(band.getAttribute('data-verdict'))) problems.push(`${e.plan.id}: no verdict word`);
          if (!band.querySelector('.verdict-word') || !band.querySelector('.bar[data-kind="outOfTen"]')) problems.push(`${e.plan.id}: no word or bar`);
          if (band.getAttribute('data-chance') !== '92.7') problems.push(`${e.plan.id}: the chance on the band is ${band.getAttribute('data-chance')}`);
          if (!band.querySelector('[data-line="lasts.left"]')) problems.push(`${e.plan.id}: no "left" row`);
          if (!root.querySelector('[data-testid="plan.lasts.ran"]')) problems.push(`${e.plan.id}: no "worked out" line`);
          if (!root.querySelector('[data-section="history"]')) problems.push(`${e.plan.id}: no history`);
          if (root.querySelector('[data-testid="plan.lasts.working"]')) problems.push(`${e.plan.id}: "working" shown beside a fresh result`);
        }
        if (locked) {
          if (root.querySelector('input, select, textarea')) problems.push(`${e.plan.id}: a box on a locked plan`);
          if ((text.match(/Fixed when you locked the plan on /g) || []).length !== 1) problems.push(`${e.plan.id}: "Fixed when" not once`);
          if (root.querySelectorAll('[data-testid="plan.unlock"]').length !== 1) problems.push(`${e.plan.id}: the unlock sentence not once`);
          if (root.querySelector('[data-testid="plan.lasts.save"]')) problems.push(`${e.plan.id}: Save on a locked plan`);
          if (v.document && !root.querySelector('[data-testid="plan.lasts.document"]')) problems.push(`${e.plan.id}: no document band`);
        } else {
          for (const f of LASTS_FIELDS) {
            const vf = v.fields.find((x) => x.path === f.path);
            const drawn = f.type === 'choice' ? root.querySelector(`[data-field="${f.path}"] legend`) : root.querySelector(`label[for="plan.lasts.${f.path}"]`);
            if (vf.applies && !drawn) problems.push(`${e.plan.id}: no label for ${f.path}`);
            if (!vf.applies && drawn) problems.push(`${e.plan.id}: ${f.path} drawn though it does not apply`);
            if (vf.applies && vf.saved !== null && !root.querySelector(`[data-saved-for="${f.path}"]`)) problems.push(`${e.plan.id}: no saved value beside ${f.path}`);
            const src = root.querySelector(`[data-saved-for="${f.path}"]`);
            if (src && !/From your plan|As saved in the plan/.test(src.textContent)) problems.push(`${e.plan.id}: no source beside ${f.path}`);
          }
          for (const path of v.notUsed) if (v.fields.find((x) => x.path === path).applies && !root.querySelector(`[data-not-used="${path}"]`)) problems.push(`${e.plan.id}: no "not used" under ${path}`);
          if (!root.querySelector('[data-testid="plan.lasts.save"]') || !root.querySelector('[data-testid="plan.lasts.cancel"]')) problems.push(`${e.plan.id}: Save or Cancel missing`);
          if (root.querySelector('.error')) problems.push(`${e.plan.id}: a problem shown before anything was touched`);
        }
        for (const d of v.derived) if (!root.querySelector(`[data-line="lasts.${d.id}"]`)) problems.push(`${e.plan.id}: derived line ${d.id} not drawn`);
        if (!text.includes(ADVICE_SHORT)) problems.push(`${e.plan.id}: no ADVICE_SHORT`);
        if (COUNTDOWN.test(words)) problems.push(`${e.plan.id}: a countdown: ${COUNTDOWN.exec(words)[0]}`);
        for (const hit of bannedHits(words, scopesOf(pg.stageKey))) problems.push(`${e.plan.id} [${pg.stageKey}]: ${hit}`);
        if (/undefined|NaN|\[object|\{\w+\}/.test(words)) problems.push(`${e.plan.id}: junk`);
        const rail = root.querySelector('[data-region="rail"]');
        if (!rail) problems.push(`${e.plan.id}: no rail`);
        else if (!rail.querySelector('[data-testid="rail.next"] [data-next]').textContent.trim()) problems.push(`${e.plan.id}: empty next sentence`);
        const widths = [...root.querySelectorAll('table')];
        if (widths.length) problems.push(`${e.plan.id}: a table on a phone-first page`);
      }
      expect(problems).toEqual([]);
    });
  }
});

describe('the lumpy plan (12): what the page says, and what typing does', () => {
  const entries = entriesAt(TODAY);
  const id = LUMPY.id;
  it('the band in words: the figure, the bar, what is left, the cuts, the run\'s setting; the history rows; the dials with their sources; the derived lines', () => {
    const { root, text } = draw(lastsState(entries, id));
    expect(root.querySelector('[data-testid="plan.lasts.result.headline"]').textContent).toBe('Your plan lasts in 9 futures out of 10.');
    expect(root.querySelector('[data-testid="plan.lasts.result"]').getAttribute('data-verdict')).toBe('yes');
    expect(root.querySelector('[data-testid="plan.lasts.result"] .verdict-word').textContent).toBe('On course');
    expect(root.querySelector('[data-testid="plan.lasts.result"] .bar').getAttribute('aria-label')).toBe('in 9 futures out of 10');
    expect(root.querySelectorAll('[data-testid="plan.lasts.result"] .bar-cell.is-on').length).toBe(9);
    expect(root.querySelector('[data-testid="plan.lasts.result.sub"]').textContent).toBe('92.7% of 1,000 futures; 657 real starts since 1871; 39 years, to 91.');
    expect(text).toContain('Left at the end, at today’s prices: typically £1,806,699; in a bad case (the worst 1 in 10) £135,978; in a good case (the best 1 in 10) £4,200,000.');
    expect(text).toContain('Income cuts: in 190 of 1,000 futures (41 of them later ran out), typically £4,000 a year less for about 3 years (£12,000 in all; the most in any future £31,000).');
    expect(text).toContain('Run with the spending cuts you set: up to 20% after 3 months in a row below the plan’s line.');
    expect(root.querySelector('[data-testid="plan.lasts.ran"]').textContent).toBe('Worked out just now, on the plan as saved 11 September 2026.');
    expect(text).toContain('What if you had retired into a bad year?');
    expect(text).toContain('September 1929: ran out at 84; Lowest 12 months £31,000; left £0');
    expect(text).toContain('1929 — the Great Depression: lasted; income cut in 4 years (£16,000 in all)');
    expect(text).toContain('2008 — the 2008 crisis: real history since 2008 is not long enough yet');
    expect(root.querySelector('[data-testid="plan.lasts.scenarios"]')).not.toBe(null);
    // the named stresses as whole decades (road-to-7.md step 11b): what the decade did, then the plan's own replay; the made-up decade apart; no hand-over
    expect(root.querySelector('[data-testid="plan.lasts.scenarios"] li').textContent).toBe('1929 — Great Depression: shares down 64% in the first three years and down 39% over the decade; prices down 21% over the decade. lasted; income cut in 4 years (£16,000 in all); Lowest 12 months £31,000; left £240,000');
    expect(root.querySelector('[data-testid="plan.lasts.synthetic"]').textContent).toBe('Synthetic Worst: shares down 27% in the first three years and down 49% over the decade; prices up 75% over the decade. A made-up decade: no real start is this bad, so it is not in the test. The hardest real start in the record is September 1929, above.');
    expect(text).not.toContain('in the planner');
    // the years one by one and the pots' floors: closed until opened, each press a toggle on the screen
    const years = root.querySelector('[data-testid="plan.lasts.years"]');
    expect(years.getAttribute('data-kind')).toBe('schedule');
    expect(years.getAttribute('data-years')).toBe('2');
    expect(root.querySelector('[data-testid="plan.lasts.schedule.table"]')).toBe(null);
    expect(root.querySelector('[data-testid="plan.lasts.glidepath.table"]')).toBe(null);
    const drawn = draw(lastsState(entries, id));
    drawn.root.querySelector('[data-testid="plan.lasts.schedule"]').click();
    expect(drawn.actions.pop()).toEqual({ type: 'ui/toggle', id: 'lastsSchedule' });
    drawn.root.querySelector('[data-testid="plan.lasts.glidepath"]').click();
    expect(drawn.actions.pop()).toEqual({ type: 'ui/toggle', id: 'lastsGlidepath' });
    const opened = draw(lastsState(entries, id, { ui: { open: ['lastsSchedule', 'lastsGlidepath'] } }));
    const sched = opened.root.querySelectorAll('[data-testid="plan.lasts.schedule.table"] tbody tr');
    expect(sched.length).toBe(2);
    expect(sched[0].getAttribute('data-age')).toBe('56');
    expect(sched[0].textContent).toBe('056£30,000£0£3,486£8,000£34,514£120,000');
    const floors = opened.root.querySelectorAll('[data-testid="plan.lasts.glidepath.table"] tbody tr');
    expect(floors.length).toBe(1);
    expect(floors[0].textContent).toBe('056£300,000£200,000£80,00052%£120,000£580,000');
    expect(opened.root.querySelector('[data-testid="plan.lasts.schedule"]').textContent).toBe('Hide the years');
    expect(root.querySelector('[data-testid="plan.lasts.cutsOn.yes"]').checked).toBe(true);
    expect(root.querySelector('[data-testid="plan.lasts.cutAfterMonths"]').value).toBe('3');
    expect(root.querySelector('[data-saved-for="cutAfterMonths"]').textContent).toBe('From your plan, saved 11 September 2026 (3)');
    expect(root.querySelector('[data-testid="plan.lasts.cutPct"]').value).toBe('20');
    expect(root.querySelector('[data-testid="plan.lasts.deeperAfterMonths"]').value).toBe('12');
    expect(root.querySelector('[data-testid="plan.lasts.buffer"]').value).toBe('15000');
    expect(root.querySelector('[data-testid="plan.lasts.reserveOn.no"]').checked).toBe(true);
    expect(root.querySelector('[data-testid="plan.lasts.reserveAmount"]')).toBe(null);
    expect(text).toContain('In a slump, after 3 months in a row below the plan’s line, income is cut by 10% for 12 months and by 20% if it lasts');
    expect(text).toContain('No emergency reserve.');
    expect(root.querySelector('[data-not-used]')).toBe(null);
  });
  it('typing dispatches plan/edit with the text as typed; a choice too; Save dispatches plan/save; Cancel plan/cancel; the reserve opens its box; the derived lines follow; problems once a box is left or Save is pressed', () => {
    const { root, actions } = draw(lastsState(entries, id));
    const box = root.querySelector('[data-testid="plan.lasts.cutPct"]');
    box.value = '30';
    box.dispatchEvent(new Event('input', { bubbles: true }));
    expect(actions.pop()).toEqual({ type: 'plan/edit', planId: id, path: 'cutPct', value: '30' });
    box.dispatchEvent(new Event('blur'));
    expect(actions.pop()).toEqual({ type: 'plan/touch', planId: id, path: 'cutPct' });
    root.querySelector('[data-testid="plan.lasts.reserveOn.yes"]').click();
    expect(actions.pop()).toEqual({ type: 'plan/edit', planId: id, path: 'reserveOn', value: 'yes' });
    root.querySelector('form.lasts-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(actions.pop()).toEqual({ type: 'plan/save', planId: id });
    root.querySelector('[data-testid="plan.lasts.cancel"]').click();
    expect(actions.pop()).toEqual({ type: 'plan/cancel', planId: id });
    const typed = draw(lastsState(entries, id, { typed: { cutPct: '30', cutAfterMonths: '4', reserveOn: 'yes', reserveAmount: '30,000' } }));
    expect(typed.root.querySelector('[data-testid="plan.lasts.reserveAmount"]').value).toBe('30,000');
    expect(typed.text).toContain('In a slump, after 4 months in a row below the plan’s line, income is cut by 15% for 12 months and by 30% if it lasts');
    expect(typed.text).toContain('An emergency reserve of £30,000, touched only when the plan would otherwise run out.');
    const off = draw(lastsState(entries, id, { typed: { cutsOn: 'no' } }));
    expect(off.root.querySelector('[data-testid="plan.lasts.cutPct"]')).toBe(null);
    expect(off.text).toContain('No cuts: the plan is paid in full until the money runs out.');
    const left = draw(lastsState(entries, id, { typed: { cutPct: '', cutAfterMonths: '0' }, touched: ['cutAfterMonths'] }));
    expect(left.root.querySelector('[data-error-for="plan.lasts.cutAfterMonths"]').textContent).toBe('At least 1 month.');
    expect(left.root.querySelector('[data-error-for="plan.lasts.cutPct"]')).toBe(null);
    const asked = draw(lastsState(entries, id, { typed: { cutPct: '', reserveOn: 'yes', reserveAmount: '' }, asked: true }));
    expect(asked.root.querySelector('[data-error-for="plan.lasts.cutPct"]').textContent).toBe('The cut as a percent, for example 20.');
    expect(asked.root.querySelector('[data-error-for="plan.lasts.reserveAmount"]').textContent).toBe('Type the reserve, for example 25,000.');
  });
  it('working: the block with the progress bar, the slow sentence; failed: "Try again" dispatches lasts/retry; an older result stays greyed while a new run is under way', () => {
    const w = draw(lastsState(entries, id, { run: 'working', progress: { done: 1, total: 2 } }));
    expect(w.root.querySelector('[data-region="plan-lasts-answer"]').getAttribute('data-status')).toBe('working');
    expect(w.root.querySelector('[data-testid="plan.lasts.working"]').textContent).toContain('Working out your answer…');
    expect(w.root.querySelector('[data-testid="plan.lasts.working"] progress').getAttribute('value')).toBe('1');
    expect(w.root.querySelector('[data-testid="plan.lasts.result"]')).toBe(null);
    expect(w.text).not.toContain('Still working');
    const slow = draw(lastsState(entries, id, { run: 'working', slow: true }));
    expect(slow.text).toContain('Still working. This can take a little longer on a phone.');
    const f = draw(lastsState(entries, id, { run: 'failed' }));
    expect(f.root.querySelector('[data-testid="plan.lasts.failed"]').textContent).toContain('Sorry, we could not work that out.');
    f.root.querySelector('[data-testid="plan.lasts.retry"]').click();
    expect(f.actions.pop()).toEqual({ type: 'lasts/retry' });
    // a result held for another key (an older run): greyed, with "working" above it
    let s = lastsState(entries, id);
    s = reduce(s, { type: A.LASTS_WORKING, key: 'another-key' });
    s = reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) });
    const stale = draw(s);
    expect(stale.root.querySelector('[data-testid="plan.lasts.result"]').getAttribute('data-stale')).toBe('1');
    expect(stale.root.querySelector('[data-testid="plan.lasts.working"]')).not.toBe(null);
    expect(stale.root.querySelector('[data-testid="plan.lasts.ran"]')).toBe(null);
    // idle (no run yet for this plan): working is shown, nothing else
    const idle = draw(lastsState(entries, id, { run: 'idle' }));
    expect(idle.root.querySelector('[data-testid="plan.lasts.working"]')).not.toBe(null);
  });
  it('a way of drawing that cannot be bought: one sentence, no figures, no history', () => {
    const { root, text } = draw(lastsState(entries, ROTATION.id, { result: fakeResult('gilt-rotation', { affordable: false }) }));
    expect(root.querySelector('[data-testid="plan.lasts.result"]').getAttribute('data-ok')).toBe('0');
    expect(text).toContain('This way of drawing cannot be bought with this plan’s pots, so there is no figure.');
    expect(root.querySelector('[data-section="history"]')).toBe(null);
    expect(text).not.toContain('bridge');
  });
  it('a bought strategy (07): "not used" under every dial, the bundled-curve line, no cuts row of its own', () => {
    const { root, text } = draw(lastsState(entries, ROTATION.id));
    expect(root.querySelectorAll('[data-not-used]').length).toBe(LASTS_FIELDS.filter((f) => !f.when || f.when.cutsOn === 'yes').length);
    expect(text).toContain('Income cuts: none — this way of drawing pays the plan in full until it cannot.');
    expect(text).toContain('Gilts priced on the bundled yield curve here');
    expect(text).toContain('Not used by this way of drawing: it pays the plan in full until it cannot.');
  });
  it('the toast after a save, with Undo; "Saving…" while a write is under way; a problem from the write in plain words', () => {
    const line = { id: 'lasts', slots: { pct: '30', months: '4', reserve: 'no reserve' } };
    const saved = draw(lastsState(entries, id, { ui: { toast: { planId: id, kind: 'saved', previous: { 'stressTool.settings.protectionMult': 0.8 }, line } } }));
    const toast = saved.root.querySelector('[data-testid="plan.lasts.toast"]');
    expect(toast.textContent).toContain('Saved. Cuts of up to 30% after 4 months; no reserve. The test is running again on the saved plan.');
    expect(toast.getAttribute('role')).toBe('status');
    toast.querySelector('[data-testid="plan.lasts.undo"]').click();
    expect(saved.actions.pop()).toEqual({ type: 'plan/undo', planId: id });
    const undone = draw(lastsState(entries, id, { ui: { toast: { planId: id, kind: 'undone', previous: null, line: null } } }));
    expect(undone.root.querySelector('[data-testid="plan.lasts.toast"]').textContent).toContain('Put back as it was.');
    const saving = draw(lastsState(entries, id, { ui: { saving: { planId: id, kind: 'save' } } }));
    expect(saving.root.querySelector('[data-testid="plan.lasts.save"]').textContent).toBe('Saving…');
    for (const [problem, words] of [['locked', 'This plan is locked, so nothing was changed.'], ['usedUp', 'Your free time without an account is used up.'], ['problems', 'Have a look at the boxes marked above.']]) {
      const p = draw(lastsState(entries, id, { ui: { saveProblem: { planId: id, problem } } }));
      expect(p.root.querySelector('[data-testid="plan.lasts.problem"]').textContent).toContain(words);
    }
  });
  it('the plan page: "Does it last?" links here, the stale line\'s button too, with no hand-over to the planner\'s run', () => {
    const { root, text } = draw(stateWith(entries, '#/plan/' + id + '/plan'));
    const link = root.querySelector('[data-testid="plan.plan.lasts"]');
    expect(link.getAttribute('href')).toBe('#/plan/' + id + '/lasts');
    expect(link.textContent).toBe('Does it last?');
    expect(root.querySelector('[data-testid="plan.plan.testPlan"]')).toBe(null);
    expect(text).not.toMatch(/undefined|NaN/);
    const draft = draw(stateWith(entries, '#/plan/' + C['02-pnv-draft'].id + '/plan'));
    expect(draft.root.querySelector('[data-testid="rail.next"]').textContent).toContain('Next: check it lasts, then lock it when it is right.');
    expect(draft.root.querySelector('[data-testid="rail.next.button"]').getAttribute('href')).toBe('#/plan/' + C['02-pnv-draft'].id + '/lasts');
    expect(draft.root.querySelector('[data-testid="rail.next.button"]').textContent).toBe('Does it last?');
  });
});

describe('the locked plans, a plan shown as saved, the household pair, a plan not found', () => {
  const entries = entriesAt(TODAY);
  it('03 locked (a gilt ladder): the document\'s figure, today\'s beside it, no earlier-test line when they agree; "Fixed when…" once; no box; the plan page links "as locked"', () => {
    const result = fakeResult('full-il-gilt', { stored: { a: oneAnswer({ ...R, strategyId: 'full-il-gilt', cuts: null, ruin: { hist: 0, mc: 0 }, n: { hist: 1, mc: 1 } }, P), note: '' } });
    // a contract plan's named stresses carry the planner's inflation figures (lastsRun.js contractCash): drawn as one more line, under the planner's lead
    result.extras.scenarios[0] = { ...result.extras.scenarios[0], kind: 'contract', available: true, cash: { prices10: -0.21, cashFirst: 52000, cashTenth: 34760, realTenth: 44000, ageFirst: 58, ageTenth: 67 } };
    result.extras.synthetic.cash = { prices10: 0.75, cashFirst: 52000, cashTenth: 73000, realTenth: 44000, ageFirst: 58, ageTenth: 67 };
    const { root, text } = draw(lastsState(entries, LADDER.id, { result }));
    expect(root.querySelector('[data-testid="plan.lasts.scenarios"] li').textContent).toBe('1929 — Great Depression: shares down 64% in the first three years and down 39% over the decade; prices down 21% over the decade. every year is bought by contract — the start year changes nothing but the pounds that arrive. prices down 21% after ten years: the rungs would pay £52,000 at 58 and £34,760 at 67, which still buys £44,000 at today’s prices — paid in full by contract');
    expect(root.querySelector('[data-testid="plan.lasts.synthetic"]').textContent).toContain('the rungs would pay £52,000 at 58 and £73,000 at 67');
    expect(text).toContain('So the test here is prices');
    expect(root.querySelector('input, select, textarea')).toBe(null);
    expect((text.match(/Fixed when you locked the plan on 1 July 2026\./g) || []).length).toBe(1);
    expect(root.querySelectorAll('[data-testid="plan.unlock"]').length).toBe(1);
    expect(root.querySelector('[data-testid="plan.lasts.documentLine"]').textContent).toBe('Worked out when the plan was locked on 1 July 2026.');
    expect(root.querySelector('[data-testid="plan.lasts.document"]').getAttribute('data-chance')).toBe('100');
    expect(root.querySelector('[data-testid="plan.lasts.document"]').textContent).toContain('Every year is bought by contract');
    expect(root.querySelector('[data-testid="plan.lasts.result"]')).not.toBe(null);
    expect(root.querySelector('[data-testid="plan.lasts.earlierTest"]')).toBe(null);
    expect(text).toContain('Not used by this way of drawing: it pays the plan in full until it cannot.');
    expect(root.querySelector('[data-testid="plan.lasts.back"]').getAttribute('href')).toBe('#/plan/' + LADDER.id + '/plan');
    const page = draw(stateWith(entries, '#/plan/' + LADDER.id + '/plan'));
    expect(page.root.querySelector('[data-testid="plan.plan.lastsLocked"]').getAttribute('href')).toBe('#/plan/' + LADDER.id + '/lasts');
    expect(page.root.querySelector('[data-testid="plan.plan.testLocked"]')).not.toBe(null);
  });
  it('04 locked (Buckets in order): today\'s test differs from the document\'s, so the one line of 6.24.0 is said', () => {
    const note = 'This figure was worked out under the earlier test, when the plan was locked: 98% (in more than 9 futures out of 10); today\'s test gives 93% (in 9 futures out of 10). The document keeps the figure it was locked with; the market data and the test have moved since.';
    const result = fakeResult('buckets-in-order', { stored: { a: oneAnswer({ ...R, strategyId: 'buckets-in-order', ruin: { hist: 0, mc: 1.7 } }, P), note } });
    const { root } = draw(lastsState(entries, BUCKETS.id, { result }));
    expect(root.querySelector('[data-testid="plan.lasts.document"]')).not.toBe(null);
    expect(root.querySelector('[data-testid="plan.lasts.earlierTest"]').textContent).toBe(note);
  });
  it('a plan shown as saved: not run, no box, the sentence', () => {
    const newer = entries.map((e) => (e.plan.id === LUMPY.id ? { ...e, newer: true } : e));
    const { root, text } = draw(lastsState(newer, LUMPY.id, { run: 'idle' }));
    expect(root.querySelector('input')).toBe(null);
    expect(root.querySelector('[data-testid="plan.lasts.notRun"]')).not.toBe(null);
    expect(root.querySelector('[data-testid="plan.lasts.working"]')).toBe(null);
    expect(text).toContain('This plan is shown as it was saved and cannot be changed here. Nothing has been lost.');
  });
  it('the household pair: each page names the other\'s plan, links to its own "Does it last?", and offers the two together on "Your household" inside V7 (6.42.0)', () => {
    const { ladder, saver } = household();
    const es = [entryOf(ladder), entryOf(saver)];
    const { root } = draw(lastsState(es, saver.id));
    const partner = root.querySelector('[data-testid="plan.lasts.partner"]');
    expect(partner.textContent).toContain('Ladder plan’s plan is tested on Ladder plan’s plan.');
    expect(partner.querySelector('a').getAttribute('href')).toBe('#/plan/HouseLadder01/lasts');
    expect(root.querySelector('[data-testid="plan.lasts.together"]').getAttribute('href')).toBe('#/plan/' + saver.id + '/household');
    expect(draw(lastsState(es, ladder.id)).root.querySelector('[data-testid="plan.lasts.partner"] a').getAttribute('href')).toBe('#/plan/HouseSaver02/lasts');
  });
  it('a plan not in the account, and the window warning without an account', () => {
    const unknown = draw(lastsState(entries, 'NoSuchPlan'));
    expect(unknown.text).toContain('That plan is not in this account.');
    expect(draw(stateWith(null, '#/plan/abc/lasts', { session: 'checking' })).root.querySelector('[data-testid="plan.opening"]')).not.toBe(null);
    const win = draw(lastsState(entries.slice(11, 12), entries[11].plan.id, { source: 'window', session: 'nobody' }));
    expect(win.root.querySelector('[data-testid="plan.windowWarning"]')).not.toBe(null);
    expect(win.root.querySelector('[data-testid="plan.lasts.save"]')).not.toBe(null);
    expect(win.root.querySelector('[data-testid="plan.lasts.result"]')).not.toBe(null);
  });
});
