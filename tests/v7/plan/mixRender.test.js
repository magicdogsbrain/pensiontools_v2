/**
 * "The mix" drawn from its named states (research/v7/way-and-mix.md 3, 7): tests/v7/states/plan/mix-*.json, written by
 * `node tests/v7/states/build-states.mjs --question plan` with the real runs. Every state is held to the words' rules (the
 * banned list in every scope a plan page is shown in — a record screen: no "About £"; never "allocation", "strategy",
 * "sleeve", "equities", "p10") and to the screen's contract: how the pension is held with the £ each level gives on this pot,
 * the four split boxes kept to 100 with their £, the funds as cards with "Counted as" and "What is this?" on a line the page
 * cannot recognise, the search over the bundled list, a paste with every line kept or listed under "Left out, and why", the
 * example list, the slice's and the tent's try with the cost said, the eight cells with the best marked and "Use this mix"
 * with its confirm, Save and Cancel, the toast with Undo; a locked plan read-only with the tries and the comparison still
 * run and never "Use this mix"; a bought way's one paragraph with the link; a plan shown as saved. The states carry the
 * version they were made with, read from src/constants.js, never a literal.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText, bannedHits } from '../render/checkScreen.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { A } from '../../../src/v7/state/actions.js';
import { VERSION } from '../../../src/constants.js';
import { MIX } from '../../../src/v7/copy/mix.js';
import { MIX_LEVELS, MIX_SPLIT, MIX_WRITES } from '../../../src/answers/plan/schema.js';
import { mixCells } from '../../../src/services/GlidepathService.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { noon } from './_plans.js';

const DIR = join(process.cwd(), 'tests/v7/states/plan');
const NAMES = readdirSync(DIR).filter((f) => f.startsWith('mix-') && f.endsWith('.json')).map((f) => f.slice(0, -5)).sort();
const MADE = JSON.parse(readFileSync(join(DIR, '_made-with.json'), 'utf8'));
const load = (name) => JSON.parse(readFileSync(join(DIR, `${name}.json`), 'utf8'));
const SCOPES = ['all', 'record', 'retired', 'saver', 'planner', 'result'];

function draw(stored) {
  const state = reduce(initialState({ today: stored.env.today, build: 'test' }), { type: A.STATE_REPLACE, state: stored });
  const root = document.createElement('div');
  root.id = 'app';
  const actions = [];
  render(h(App, { state, dispatch: (a) => actions.push(a) }), root);
  return { state, root, actions, text: visibleText(root) };
}
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const all = (root, sel) => [...root.querySelectorAll(sel)];
const planOf = (s) => s.plans.list[0].plan;

describe('the named states of "The mix"', () => {
  it('are the set the builder writes, made with this version at the engine\'s 1,000 futures, nothing hand-made; each holds one plan', () => {
    expect(NAMES.length).toBeGreaterThanOrEqual(17);
    expect(MADE.version).toBe(VERSION);
    expect(MADE.futures).toBe(1000);
    expect(MADE.patched).toEqual([]);
    expect(MADE.runs).toContain('src/answers/plan/mixRun.js');
    for (const name of NAMES) expect(load(name).plans.list, name).toHaveLength(1);
  });
  it.each(NAMES)('%s survives JSON, carries this version and is drawn on #/plan/<id>/mix', (name) => {
    const s = load(name);
    expect(s.env.appVersion).toBe(VERSION);
    expect(s.route).toMatchObject({ screen: 'plan', step: 'mix' });
    expect(JSON.parse(JSON.stringify(s))).toEqual(s);
    const { root, state } = draw(s);
    expect(JSON.parse(JSON.stringify(state.mix))).toEqual(s.mix);
    expect(root.querySelector('main').getAttribute('data-screen')).toBe('plan.mix');
    expect(root.querySelector('[data-testid="plan.step.mix"]').textContent).toBe(MIX.title);
  });
  it.each(NAMES)('%s: no banned word in any scope a plan page is shown in, no exact-figure hedge, no rubbish, never the planner\'s words', (name) => {
    const { root, text } = draw(load(name));
    const copy = root.cloneNode(true);
    for (const el of copy.querySelectorAll('.plan-name')) el.remove();
    const words = visibleText(copy);
    expect(bannedHits(words, SCOPES)).toEqual([]);
    expect(text).not.toMatch(/about £|around £/i);
    expect(text).not.toMatch(/undefined|NaN|\[object|\{\w+\}/);
    expect(words).not.toMatch(/\bstrategy\b|\ballocation\b|\bportfolio\b|Monte Carlo|\bMC\b|\bp10\b|\bequit(y|ies)\b|\bsleeves?\b/i);
  });
});

describe('how the pension is held (3.2a)', () => {
  it('mix-first: a split plan — "as your own split" chosen, the four boxes at the saved whole percents with their £, the derived lines, Save and Cancel; nothing to try before a try is asked', () => {
    const { root, text } = draw(load('mix-first'));
    expect(one(root, 'plan.mix.held.split').checked).toBe(true);
    for (const p of MIX_SPLIT) expect(one(root, `plan.mix.${p}`), p).not.toBe(null);
    expect(one(root, 'plan.mix.shares').value).toBe('60');
    expect(one(root, 'plan.mix.cash').value).toBe('10');
    expect(one(root, 'plan.mix.split.amounts').textContent).toMatch(/^On this pot: £[\d,]+ shares, £[\d,]+ bonds, £0 gold and trend, £[\d,]+ cash\.$/);
    expect(one(root, 'plan.mix.level.balanced'), 'no level boxes while a split is chosen').toBe(null);
    for (const id of ['mix.held.split', 'mix.amounts', 'mix.sleeve.off', 'mix.tent.off']) expect(root.querySelector(`[data-line="${id}"]`), id).not.toBe(null);
    expect(one(root, 'plan.mix.save').textContent).toBe(MIX.buttons.save);
    expect(one(root, 'plan.mix.cancel')).not.toBe(null);
    expect(one(root, 'plan.mix.try.sleeve.button')).not.toBe(null);
    expect(one(root, 'plan.mix.try.tent.button')).not.toBe(null);
    expect(one(root, 'plan.mix.compare.run').textContent).toBe(MIX.compare.button);
    expect(text).toContain(MIX.sections.held);
    expect(text).toContain('bad case (the worst 1 in 10)');
    expect(root.querySelector('.error')).toBe(null);
  });
  it('mix-level: a level chosen with the slice on — the three levels each with the £ they give on this pot (the 4-way table), the derived lines follow, the example button names the level', () => {
    const s = load('mix-level');
    const { root, actions } = draw(s);
    expect(one(root, 'plan.mix.held.level').checked).toBe(true);
    for (const key of MIX_LEVELS) {
      expect(one(root, `plan.mix.level.${key}`), key).not.toBe(null);
      expect(one(root, `plan.mix.level.${key}.amounts`).textContent).toMatch(/^£[\d,]+ shares, £[\d,]+ bonds, £[\d,]+ gold and trend, £[\d,]+ cash$/);
    }
    expect(one(root, 'plan.mix.level.balanced').checked).toBe(true);
    expect(one(root, 'plan.mix.sleeve.yes').checked).toBe(true);
    expect(one(root, 'plan.mix.shares'), 'no split boxes while a level is chosen').toBe(null);
    expect(root.querySelector('[data-line="mix.held.level"]').textContent).toMatch(/^Held at the balanced level, on a pension of £[\d,]+\.$/);
    expect(root.querySelector('[data-line="mix.sleeve.on"]')).not.toBe(null);
    // the levels' £ are the lifted function's on the plan's pot (GlidepathService.mixFromLevel), to the pound
    const ss = effectiveStressSettings(planOf(s), { now: noon(s.env.today) });
    const pot = Math.round(ss.equityMin) + Math.round(ss.bondMin) + Math.round(ss.cashTarget) + Math.round(ss.diversifierStart || 0);
    expect(one(root, 'plan.mix.level.balanced.amounts').textContent).toContain('£' + Math.round(pot * 0.5).toLocaleString('en-GB') + ' shares');
    one(root, 'plan.mix.level.cautious').click();
    expect(actions.pop()).toEqual({ type: 'plan/edit', planId: 'AlexWay01', path: 'level', value: 'cautious' });
    one(root, 'plan.mix.save').click();
  });
  it('mix-split-problem: the four do not add to 100 — the sentence beside the cash box once Save was pressed, no Save sent to the write', () => {
    const { root } = draw(load('mix-split-problem'));
    expect(root.querySelector('[data-error-for="plan.mix.cash"]').textContent).toBe(MIX.errors.cash.notHundred);
    expect(one(root, 'plan.mix.cash').getAttribute('aria-invalid')).toBe('true');
  });
});

describe('the funds to test (3.2c)', () => {
  it('mix-funds: two cards; the one not in our list asks "What is this?" under "Counted as" once Save was pressed; the list rolls up; the search box and the paste button are there', () => {
    const { root, text } = draw(load('mix-funds'));
    expect(one(root, 'plan.mix.held.funds').checked).toBe(true);
    expect(all(root, '[data-card^="funds."]')).toHaveLength(2);
    expect(one(root, 'plan.mix.funds.n1.ticker').value).toBe('VWRP');
    expect(one(root, 'plan.mix.funds.n1.category').value).toBe('worldGrowth');
    expect(root.querySelector('[data-card="funds.n1"]').getAttribute('data-bucket')).toBe('shares');
    expect(one(root, 'plan.mix.funds.n2.category').value).toBe('');
    expect(root.querySelector('[data-error-for="plan.mix.funds.n2.category"]').textContent).toBe(MIX.funds.errors.category.whatIsThis);
    expect(one(root, 'plan.mix.funds.n2.wrapper.ISA').checked).toBe(true);
    expect(one(root, 'plan.mix.search')).not.toBe(null);
    expect(one(root, 'plan.mix.paste.open')).not.toBe(null);
    expect(text).toContain(MIX.notes.funds);
    expect(one(root, 'plan.mix.funds.summary').textContent).toMatch(/^The list comes to £300,000 in the pension/);
  });
  it('mix-funds-ok: the unrecognised line answered "gold" counts as gold and trend; the search shows the bundled list\'s matches with "Add"; the ISA line fills the ISA; Remove sends the ids without it', () => {
    const { root, actions } = draw(load('mix-funds-ok'));
    expect(root.querySelector('.error')).toBe(null);
    expect(root.querySelector('[data-card="funds.n2"]').getAttribute('data-bucket')).toBe('diversifiers');
    expect(one(root, 'plan.mix.funds.summary').textContent).toContain('£50,000 in an ISA');
    expect(one(root, 'plan.mix.search').value).toBe('vang');
    const matches = one(root, 'plan.mix.search.matches');
    expect(matches).not.toBe(null);
    expect(all(matches, 'li').length).toBeGreaterThan(0);
    const add = all(root, '[data-testid^="plan.mix.search.add."]')[0];
    add.click();
    const sent = actions.splice(0);
    expect(sent[0]).toMatchObject({ type: 'plan/edit', path: 'funds.ids', value: 'n1,n2,n3' });
    expect(sent.find((a) => a.path === 'funds.n3.ticker').value).toMatch(/^[A-Z0-9.-]+$/);
    expect(sent.find((a) => a.path === 'search').value).toBe('');
    one(root, 'plan.mix.funds.remove.n2').click();
    expect(actions.pop()).toEqual({ type: 'plan/edit', planId: 'AlexWay01', path: 'funds.ids', value: 'n1' });
    expect(root.querySelector('[data-line="mix.held.funds"]').textContent).toMatch(/^Held as the funds to test: £300,000 in the pension and £50,000 in an ISA\.$/);
  });
  it('mix-paste: the pasted lines read — one recognised from its name, one answered "bonds" under "What is this?", the total line listed under "Left out, and why" — and "Add these lines" sends the cards', () => {
    const { root, actions, text } = draw(load('mix-paste'));
    const rows = all(root, '[data-testid="plan.mix.paste.rows"] tbody tr');
    expect(rows).toHaveLength(2);
    expect(rows[0].textContent).toContain('Read as Vanguard FTSE All-World');
    expect(one(root, 'plan.mix.paste.2.what').value).toBe('bonds');
    expect(one(root, 'plan.mix.paste.leftOut').textContent).toContain('Line 3 “Total”: a total line, not a fund.');
    expect(one(root, 'plan.mix.paste.summary').textContent).toMatch(/^2 lines read, £53,600 in all\./);
    expect(text).toContain(MIX.funds.paste.leftOutTitle);
    one(root, 'plan.mix.paste.add').click();
    const sent = actions.splice(0);
    expect(sent[0]).toEqual({ type: 'plan/edit', planId: 'AlexWay01', path: 'funds.ids', value: 'n1,n2' });
    expect(sent.find((a) => a.path === 'funds.n1.ticker').value).toBe('VWRP');
    expect(sent.find((a) => a.path === 'funds.n2.category').value).toBe('globalAggHedged');
    expect(sent.find((a) => a.path === 'funds.n2.value').value).toBe('1000');
    expect(sent.find((a) => a.path === 'paste.text').value).toBe('');
  });
  it('mix-example: the example list for this level says "not advice", one row per fund, the percents to 100; it fills nothing in', () => {
    const { root, text } = draw(load('mix-example'));
    const table = one(root, 'plan.mix.example.table');
    expect(table).not.toBe(null);
    expect(text).toContain('not advice');
    const pcts = all(table, 'tbody tr td:last-child').map((td) => Number(td.textContent.replace('%', '')));
    expect(pcts.reduce((t, v) => t + v, 0)).toBe(100);
    expect(one(root, 'plan.mix.example').textContent).toBe(MIX.funds.example.hide);
    expect(all(root, '[data-card^="funds."]')).toHaveLength(0);
  });
});

describe('what it does in a bad case (3.2b, 3.2d)', () => {
  it('mix-sleeve-tried: the line with the plan\'s own bad case beside the tried one, "Tried in 1 run", "Put it away"; the tent still offers its try', () => {
    const s = load('mix-sleeve-tried');
    const { root, actions } = draw(s);
    const r = one(root, 'plan.mix.try.sleeve.result');
    expect(r).not.toBe(null);
    const line = r.querySelector('[data-line="mixTry.sleeve.withTried"]');
    expect(line).not.toBe(null);
    expect(line.textContent).toMatch(/^With the slice of gold and trend funds, in a bad case \(the worst 1 in 10\) £[\d,]+ is left at the end; without, £[\d,]+\. With it the plan lasts in .*; without, in .*\.$/);
    // the figures are the try's and the plan's own, to the pound
    const t = s.mix.tries.sleeve.result;
    expect(line.textContent).toContain('£' + Math.round(t.a.badCaseLeft).toLocaleString('en-GB'));
    expect(line.textContent).toContain('£' + Math.round(s.lasts.result.a.badCaseLeft).toLocaleString('en-GB'));
    expect(one(root, 'plan.mix.try.sleeve.ran').textContent).toBe('Tried in 1 run (0.5 s).');
    one(root, 'plan.mix.try.sleeve.close').click();
    expect(actions.pop()).toEqual({ type: 'mix/tryClose', kind: 'sleeve' });
    one(root, 'plan.mix.try.tent.button').click();
    expect(actions.pop()).toEqual({ type: 'mix/try', key: s.mix.key, kind: 'tent' });
  });
  it('mix-tent-tried: without the plan\'s own test held the worker ran the plan as saved too — "Tried in 2 runs"', () => {
    const { root } = draw(load('mix-tent-tried'));
    expect(root.querySelector('[data-line="mixTry.tent.withTried"], [data-line="mixTry.tent.withOwn"]')).not.toBe(null);
    expect(one(root, 'plan.mix.try.tent.ran').textContent).toBe('Tried in 2 runs (1.0 s).');
  });
  it('mix-try-working and mix-try-failed: "Trying it…"; the failure said with "Try again" and "Put it away"', () => {
    expect(one(draw(load('mix-try-working')).root, 'plan.mix.try.tent.working')).not.toBe(null);
    const { root, actions } = draw(load('mix-try-failed'));
    expect(one(root, 'plan.mix.try.sleeve.failed').textContent).toContain(MIX.tries.failed);
    one(root, 'plan.mix.try.sleeve.again').click();
    expect(actions.pop()).toMatchObject({ type: 'mix/try', kind: 'sleeve' });
  });
});

describe('"Which mix lasts best?" (3.2e)', () => {
  it('mix-compared: eight cells — your mix first, then the three levels, tent off and on — each in futures out of 10 with typically left and the bad case, the best marked once, the cost said, "Use this mix" on every cell but the plan\'s own as saved', () => {
    const s = load('mix-compared');
    const { root, text } = draw(s);
    const table = one(root, 'plan.mix.compare.table');
    expect(table).not.toBe(null);
    expect(all(table, 'tbody tr').map((tr) => tr.getAttribute('data-row'))).toEqual(['own', 'cautious', 'balanced', 'adventurous']);
    const cells = all(table, 'td.mix-cell');
    expect(cells).toHaveLength(8);
    expect(cells.filter((c) => c.getAttribute('data-best') === '1')).toHaveLength(1);
    for (const c of cells) expect(c.querySelector('.mix-cell-words').textContent).toMatch(/^\d\.\d futures out of 10$/);
    expect(one(root, 'plan.mix.compare.ran').textContent).toBe('Tried in 8 runs (3.9 s).');
    expect(one(root, 'plan.mix.compare.best').textContent).toMatch(/lasts best: in .* \(\d+%\)\.$/);
    expect(text).toContain(MIX.notes.compare);
    // the cells' figures are the run's, to the pound; the amounts the lifted cells' (GlidepathService.mixCells)
    const ss = effectiveStressSettings(planOf(s), { now: noon(s.env.today) });
    const lifted = mixCells(ss, { own: true });
    for (const x of s.mix.compare.result.cells) {
      const el = one(root, `plan.mix.compare.${x.key}.${x.tent ? 'tent' : 'flat'}`);
      expect(el.getAttribute('data-typical')).toBe(String(Math.round(x.typicalLeft)));
      const cell = lifted.find((c) => c.key === x.key && c.tent === x.tent);
      expect(x.amounts.equity).toBe(Math.round(cell.settings.equityMin));
    }
    // "Use this mix": on every cell but the plan's own mix with its own tent setting
    expect(all(root, '[data-testid^="plan.mix.use."]')).toHaveLength(7);
    expect(one(root, 'plan.mix.use.own.flat')).toBe(null);
    expect(text).toContain(MIX.compare.thisIs);
  });
  it('mix-pick: the confirm names the row, the tent and the £; "Use it" sends plan/useMix with the cell; "Not now" clears the pick', () => {
    const { root, actions } = draw(load('mix-pick'));
    const box = one(root, 'plan.mix.useConfirm');
    expect(box).not.toBe(null);
    expect(box.textContent).toMatch(/Your plan’s mix becomes Balanced, tent on: £[\d,]+ shares, £[\d,]+ bonds, £[\d,]+ cash\./);
    one(root, 'plan.mix.useConfirm.yes').click();
    expect(actions.pop()).toEqual({ type: 'plan/useMix', planId: 'AlexWay01', cell: { key: 'balanced', tent: true } });
    one(root, 'plan.mix.useConfirm.no').click();
    expect(actions.pop()).toEqual({ type: 'mix/pick', cell: null });
  });
  it('mix-compare-working and mix-compare-failed: the working block with its progress; the failure said', () => {
    const working = draw(load('mix-compare-working'));
    expect(one(working.root, 'plan.mix.compare.working')).not.toBe(null);
    expect(working.root.querySelector('[data-testid="plan.mix.compare.working"] progress').getAttribute('value')).toBe('3');
    const failed = draw(load('mix-compare-failed'));
    expect(one(failed.root, 'plan.mix.compare.failed').textContent).toContain(MIX.compare.noWorker);
  });
  it('mix-saved: the toast after "Use this mix", with Undo (a stored state carries no toast, so the save is reduced here)', () => {
    const stored = load('mix-compared');
    const base = reduce(initialState({ today: stored.env.today, build: 'test' }), { type: A.STATE_REPLACE, state: stored });
    const state = reduce(base, { type: A.PLAN_SAVED, planId: 'AlexWay01', previous: { 'stressTool.settings.equityMin': 1 }, line: { id: 'use', slots: { key: 'balanced', tent: 'on' } }, op: 'mix' });
    const root = document.createElement('div');
    root.id = 'app';
    const actions = [];
    render(h(App, { state, dispatch: (a) => actions.push(a) }), root);
    expect(state.lasts.key, 'the one test\'s result goes with the mix').toBe(null);
    const toast = one(root, 'plan.mix.toast');
    expect(toast.textContent).toContain('Saved. The plan’s mix is now Balanced, tent on.');
    one(root, 'plan.mix.undo').click();
    expect(actions.pop()).toEqual({ type: 'plan/undo', planId: 'AlexWay01' });
  });
});

describe('a locked plan, a bought way, a plan shown as saved', () => {
  it('mix-locked (Buckets in order): no box, the lines from the document, "Fixed when…" once, the unlock sentence once; the tent ignored and said; the tries and the comparison still run; never "Use this mix"', () => {
    const { root, text } = draw(load('mix-locked'));
    expect(root.querySelector('input, select, textarea')).toBe(null);
    expect((text.match(/Fixed when you locked the plan on /g) || []).length).toBe(1);
    expect(all(root, '[data-testid="plan.unlock"]')).toHaveLength(1);
    expect(one(root, 'plan.mix.locked').textContent).toBe(MIX.locked.lead);
    expect(root.querySelector('[data-line="mix.tent.buckets"]')).not.toBe(null);
    expect(one(root, 'plan.mix.try.tent'), 'no tent try for Buckets').toBe(null);
    expect(one(root, 'plan.mix.try.sleeve.result')).not.toBe(null);
    expect(one(root, 'plan.mix.compare.table')).not.toBe(null);
    expect(all(root, '[data-testid^="plan.mix.use."]')).toHaveLength(0);
    expect(one(root, 'plan.mix.useConfirm')).toBe(null);
    expect(one(root, 'plan.mix.save')).toBe(null);
    expect(one(root, 'plan.mix.document')).not.toBe(null);
  });
  it('mix-bought (a rotation): one paragraph naming the way, the link to "How the money is taken", no box, no try, no comparison', () => {
    const { root } = draw(load('mix-bought'));
    expect(one(root, 'plan.mix.bought').textContent).toContain('Gilt ladder + rotation buys your income; the mix does not apply.');
    expect(one(root, 'plan.mix.toWay').getAttribute('href')).toBe('#/plan/AlexRotation05/way');
    expect(root.querySelector('input, select, textarea')).toBe(null);
    expect(one(root, 'plan.mix.compare')).toBe(null);
    expect(one(root, 'plan.mix.try.sleeve')).toBe(null);
  });
  it('mix-shown-as-saved: a plan newer than this code — not run, nothing to change', () => {
    const { root } = draw(load('mix-shown-as-saved'));
    expect(one(root, 'plan.mix.notRun').textContent).toBe(MIX.notRun);
    expect(one(root, 'plan.readonly')).not.toBe(null);
    expect(one(root, 'plan.mix.save')).toBe(null);
    expect(one(root, 'plan.mix.compare.run')).toBe(null);
  });
  it('the declared paths of the mix are exactly the design\'s (way-and-mix.md 3.3)', () => {
    expect(MIX_WRITES).toEqual(['equityMin', 'bondMin', 'cashTarget', 'diversifierStart', 'subAsset', 'allocMode', 'taggedFunds', 'isaBalance', 'equityGlideEnabled', 'glideEndgame', 'strategyState'].map((k) => 'stressTool.settings.' + k));
  });
});
