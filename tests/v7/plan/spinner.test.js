/**
 * The working spinner (7.3.0; research/v7/mockups/README.md, "The working spinner"): a ring of small bars filling as a run
 * goes, the count said only in the unit the run really counts, and a least time before the verdict shows.
 *
 *   - the words: "3 of 9 ways tried", "2 of 8 mixes tried", "1 of 4 tests run" — and, for a run whose steps are not something
 *     a person counts ("Does it last?" reports its two stages), only "Running futures…": never a number of futures the page
 *     does not have;
 *   - the least time: a run that ends at once still shows the ring for AT_LEAST_MS, and the verdict waits — on "Does it
 *     last?" (AtLeast), "How the money is taken" (its cards' figures) and "Which mix lasts best?" (the compare's cells);
 *   - a page opened on a verdict already there shows it at once.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { h, render } from 'preact';
import { act } from 'preact/test-utils';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { RunRing, AtLeast, AT_LEAST_MS } from '../../../src/v7/components/Spinner.jsx';
import { WORKING } from '../../../src/v7/copy/home.js';
import { App } from '../../../src/v7/App.jsx';
import { reduce } from '../../../src/v7/state/reduce.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { A } from '../../../src/v7/state/actions.js';

const DIR = join(process.cwd(), 'tests/v7/states/plan');
const load = (name) => JSON.parse(readFileSync(join(DIR, `${name}.json`), 'utf8'));
const stateOf = (stored) => reduce(initialState({ today: stored.env.today, build: 'test' }), { type: A.STATE_REPLACE, state: stored });
const words = (vnode) => { const root = document.createElement('div'); render(vnode, root); return root.querySelector('.run-ring-words').textContent; };

afterEach(() => { vi.useRealTimers(); });

describe('the ring\'s words: a count only in the run\'s own unit', () => {
  it('ways, mixes and tests are counted; a run with no unit says only that futures are being run', () => {
    expect(words(h(RunRing, { progress: { done: 3, total: 9 }, unit: 'ways', label: 'x' }))).toBe('3 of 9 ways tried');
    expect(words(h(RunRing, { progress: { done: 2, total: 8 }, unit: 'mixes', label: 'x' }))).toBe('2 of 8 mixes tried');
    expect(words(h(RunRing, { progress: { done: 1, total: 4 }, unit: 'tests', label: 'x' }))).toBe('1 of 4 tests run');
    // "Does it last?" reports its two stages, not its futures: never "Running 2 futures… 0"
    expect(words(h(RunRing, { progress: { done: 0, total: 2 }, label: 'x' }))).toBe(WORKING.running);
    expect(words(h(RunRing, { progress: null, unit: 'ways', label: 'x' }))).toBe(WORKING.running);
    for (const s of [WORKING.running, ...Object.values(WORKING.count)]) expect(s).not.toMatch(/\{\w+\}\s*futures|futures…\s*\{/);
  });
  it('the bar under it is a real <progress> with the run\'s value, for a screen reader', () => {
    const root = document.createElement('div');
    render(h(RunRing, { progress: { done: 1, total: 2 }, label: 'How far' }), root);
    expect(root.querySelector('progress').getAttribute('value')).toBe('1');
    expect(root.querySelectorAll('.run-ring-bar.is-on')).toHaveLength(12);
  });
});

describe('the least time before a verdict', () => {
  it('AtLeast: a run that ends at once keeps the ring for AT_LEAST_MS, then the verdict; a page opened on a verdict shows it at once', () => {
    vi.useFakeTimers();
    const root = document.createElement('div');
    const at = (busy) => h(AtLeast, { busy, working: h('p', { id: 'ring' }, 'ring') }, h('p', { id: 'verdict' }, 'verdict'));
    act(() => { render(at(true), root); });
    expect(root.querySelector('#ring')).not.toBe(null);
    act(() => { render(at(false), root); });
    expect(root.querySelector('#verdict')).toBe(null);
    act(() => { vi.advanceTimersByTime(AT_LEAST_MS - 50); });
    expect(root.querySelector('#verdict')).toBe(null);
    act(() => { vi.advanceTimersByTime(60); });
    expect(root.querySelector('#verdict')).not.toBe(null);
    expect(root.querySelector('#ring')).toBe(null);
    const fresh = document.createElement('div');
    act(() => { render(at(false), fresh); });
    expect(fresh.querySelector('#verdict')).not.toBe(null);
  });
  it('"How the money is taken": the cards\' figures wait for the ring after a quick run', () => {
    vi.useFakeTimers();
    const root = document.createElement('div');
    const draw = (stored) => act(() => { render(h(App, { state: stateOf(stored), dispatch: () => {} }), root); });
    draw(load('way-working'));
    expect(root.querySelector('[data-testid="plan.way.working"] .run-ring-words').textContent).toBe('3 of 9 ways tried');
    draw(load('way-first'));
    // the run is done, but the ring is still shown and no card has its figures yet
    expect(root.querySelector('[data-testid="plan.way.working"]')).not.toBe(null);
    expect(root.querySelector('[data-testid="plan.way.ran"]')).toBe(null);
    expect(root.querySelector('[data-region="plan-way-answer"]').getAttribute('data-has')).toBe('0');
    act(() => { vi.advanceTimersByTime(AT_LEAST_MS + 10); });
    expect(root.querySelector('[data-testid="plan.way.working"]')).toBe(null);
    expect(root.querySelector('[data-region="plan-way-answer"]').getAttribute('data-has')).toBe('1');
    // opened on the verdict: at once
    const fresh = document.createElement('div');
    act(() => { render(h(App, { state: stateOf(load('way-first')), dispatch: () => {} }), fresh); });
    expect(fresh.querySelector('[data-testid="plan.way.working"]')).toBe(null);
  });
  it('"Which mix lasts best?": the compare\'s cells wait for the ring after a quick run', () => {
    vi.useFakeTimers();
    const root = document.createElement('div');
    const draw = (stored) => act(() => { render(h(App, { state: stateOf(stored), dispatch: () => {} }), root); });
    draw(load('mix-compare-working'));
    expect(root.querySelector('[data-testid="plan.mix.compare.working"] .run-ring-words').textContent).toMatch(/^\d+ of \d+ mixes tried$/);
    draw(load('mix-compared'));
    expect(root.querySelector('[data-testid="plan.mix.compare.working"]')).not.toBe(null);
    expect(root.querySelector('[data-testid="plan.mix.compare.table"]')).toBe(null);
    expect(root.querySelector('[data-testid="plan.mix.compare.run"]')).toBe(null);
    act(() => { vi.advanceTimersByTime(AT_LEAST_MS + 10); });
    expect(root.querySelector('[data-testid="plan.mix.compare.working"]')).toBe(null);
    expect(root.querySelector('[data-testid="plan.mix.compare.table"]')).not.toBe(null);
  });
});
