/**
 * The marks (lead4.md section 2, G1): the fact register, the full view's string helper, the simple view's component and
 * the busy mark. Markup only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { h, render } from 'preact';
import { FACT, factId, patternOf, isFactId, FACT_PATTERNS, TABLES } from '../../src/reading/facts.js';
import { markFact, factAttr, factProps, tableAttr, cellAttr, fieldAttr, setFact } from '../../src/reading/mark.js';
import { Fact } from '../../src/reading/Mark.jsx';
import { setBusy, trackBusy, clearBusy } from '../../src/reading/busy.js';

describe('the fact register', () => {
  it('holds sixty fact ids or more, each once', () => {
    expect(FACT_PATTERNS.length).toBeGreaterThanOrEqual(60);
    expect(new Set(FACT_PATTERNS).size).toBe(FACT_PATTERNS.length);
  });
  it('makes and reads an indexed id', () => {
    expect(factId(FACT.STEP_BEFORE_TAX, 0)).toBe('income.step.0.beforeTax');
    expect(patternOf('income.step.12.monthAfterTax')).toBe(FACT.STEP_MONTH_AFTER_TAX);
    expect(patternOf('mix.held.equity')).toBe(FACT.MIX_HELD);
    expect(isFactId('pot.today')).toBe(true);
    expect(isFactId('pot.tomorrow')).toBe(false);
    expect(isFactId('income.step..beforeTax')).toBe(false);
  });
});

describe('the full view\'s string helper', () => {
  it('wraps exactly the figure', () => {
    expect(markFact(FACT.POT_TODAY, '£120,000')).toBe('<span data-fact="pot.today">£120,000</span>');
    expect(markFact(FACT.STAGE, 'Saving', { tag: 'b', cls: 'x' })).toBe('<b data-fact="stage" class="x">Saving</b>');
    expect(factAttr(FACT.END_AGE)).toBe(' data-fact="plan.endAge"');
    expect(factProps(FACT.END_AGE)).toEqual({ 'data-fact': 'plan.endAge' });
    expect(tableAttr(TABLES.YEARS)).toBe(' data-fact-table="years"');
    expect(cellAttr(67, 'income')).toBe(' data-row="67" data-col="income"');
    expect(fieldAttr('about.stopMonth')).toBe(' data-field="about.stopMonth"');
  });
  it('refuses an id outside the register', () => {
    expect(() => markFact('pot.someday', '£1')).toThrow(/not a fact id/);
    expect(() => tableAttr('nope')).toThrow(/not a table id/);
  });
  it('marks an element made in code', () => {
    const el = document.createElement('span');
    setFact(el, FACT.LEFT);
    expect(el.getAttribute('data-fact')).toBe('left.typically');
  });
});

describe('the simple view\'s component', () => {
  it('draws the figure in a marked span, and nothing for no figure', () => {
    const root = document.createElement('div');
    render(h('p', null, 'Your pot: ', h(Fact, { id: FACT.POT_TODAY }, '£120,000'), '.'), root);
    expect(root.innerHTML).toBe('<p>Your pot: <span data-fact="pot.today">£120,000</span>.</p>');
    render(h(Fact, { id: FACT.POT_TODAY }, null), root);
    expect(root.innerHTML).toBe('');
  });
});

describe('the busy mark', () => {
  afterEach(() => clearBusy());
  it('is on the page while a source is busy or a run is in flight', async () => {
    const el = document.documentElement;
    setBusy('simple', true);
    expect(el.getAttribute('data-busy')).toBe('simple');
    let done;
    const p = trackBusy(new Promise((r) => { done = r; }), 'worker');
    expect(el.getAttribute('data-busy')).toBe('simple worker');
    setBusy('simple', false);
    expect(el.getAttribute('data-busy')).toBe('worker');
    done(1);
    await p;
    await Promise.resolve();
    expect(el.hasAttribute('data-busy')).toBe(false);
  });
  it('clears when a run fails', async () => {
    const p = trackBusy(Promise.reject(new Error('x')), 'worker').catch(() => {});
    await p;
    await Promise.resolve();
    expect(document.documentElement.hasAttribute('data-busy')).toBe(false);
  });
});
