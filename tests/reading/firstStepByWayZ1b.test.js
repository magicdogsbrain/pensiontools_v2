/**
 * Ruling Z1b: the full view's Decision report header and the Strategies page's dashed "your first step" line read the one
 * income reader, per way: what a way that draws takes before tax, the figure held for a way that buys its income.
 *
 * Made up by hand (bands £12,570 / £50,270, 20%): Jo holds 23,858 a year (£1,800 a month after tax), a quarter of each
 * payment tax-free, nothing else coming in. A way that draws takes 0.85G + 2,514 = 21,600.40, G = £22,455; a ladder buys
 * and pays £23,858.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { incomeStepsOf, stepBeforeTaxFor } from '../../src/reading/income.js';
import { contextFor } from '../../src/reading/context.js';
import { decisionPlanHeaderHtml } from '../../src/ui/decisionReportHeader.js';
import { incomeSmallMultiplesSvg } from '../../src/ui/comparisonGraphic.js';
import { FIXTURES, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';

const step = { fromAge: 60, stored: 23858, drawn: 22455, beforeTax: 22455, monthAfterTax: 1800 };

describe('a step said per way', () => {
  it('a way that draws: £22,455; a way that buys: £23,858', () => {
    expect(stepBeforeTaxFor(step, 'pots-and-valves')).toBe(22455);
    expect(stepBeforeTaxFor(step, 'buckets-in-order')).toBe(22455);
    expect(stepBeforeTaxFor(step, 'full-il-gilt')).toBe(23858);
    expect(stepBeforeTaxFor(null, 'full-il-gilt')).toBe(null);
  });
  it('on a plan, the plan\'s own way gives the reader\'s own figure', () => {
    const plans = FIXTURES.find((f) => f.key === 'saver-ladder-draft').plans();
    const plan = plans[0];
    plan.stressTool.settings.accessMethod = 'ufpls';
    const st = incomeStepsOf(plan, contextFor(plan, { today: PARITY_DAY, plans })).steps[0];
    expect(stepBeforeTaxFor(st, 'full-il-gilt')).toBe(st.beforeTax);
    expect(stepBeforeTaxFor(st, 'full-il-gilt')).toBe(st.stored);
    expect(stepBeforeTaxFor(st, 'pots-and-valves')).toBeLessThan(st.stored);
  });
});

describe('the Decision report header says the first step before tax as taken', () => {
  it('the reader\'s figure, never the stored target', () => {
    const h = decisionPlanHeaderHtml({ equityMin: 100000, bondMin: 60000, cashTarget: 40000, baseSalary: 23858, duration: 30 }, 'Annual report', { ...step, beforeTax: 22455 });
    expect(h).toContain('£22,455 a year before tax');
    expect(h).not.toContain('23,858');
    expect(h).not.toContain('Target income');
  });
  it('no step read: the line is not drawn with a held figure', () => {
    const h = decisionPlanHeaderHtml({ equityMin: 1, bondMin: 0, cashTarget: 0, baseSalary: 23858 }, 'x', null);
    expect(h).not.toContain('23,858');
  });
  it('the full view passes the reader\'s first step', () => {
    const src = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
    expect(src).not.toMatch(/function decisionPlanHeaderHtml/);
    expect(src).toMatch(/decisionPlanHeaderHtml\(s, '[^']*' \+ [a-zA-Z]+, await firstStepNow\(\), todayOf\(\)\)/);
  });
});

describe('the Strategies small multiples draw each way\'s own first step', () => {
  const cone = { p10: [20000, 20000], p50: [22000, 22000], p90: [24000, 24000] };
  it('a per-way line: two ways, two heights', () => {
    const svg = incomeSmallMultiplesSvg({ strategies: [{ name: 'Pots', color: '#123', cone, planIncome: 22455 }, { name: 'Ladder', color: '#456', cone, planIncome: 23858 }], startAge: 60, planIncome: 23858 }, { width: 760 });
    const ys = [...svg.matchAll(/<line [^>]*y1="([\d.]+)"[^>]*stroke-dasharray="3 3"/g)].map((m) => m[1]);
    expect(ys.length).toBe(2);
    expect(ys[0]).not.toBe(ys[1]);
  });
  it('the full view gives each panel the reader\'s figure for its way', () => {
    const src = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
    expect(src).toMatch(/planIncome: stepBeforeTaxFor\(c\.first, st\.id\)/);
    expect(src).not.toMatch(/planIncome: c\.p\.targetAnnual/);
  });
});
