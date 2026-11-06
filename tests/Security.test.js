import { describe, it, expect } from 'vitest';
import { evalAmountExpr, evalArithmetic, budgetToCsv } from '../src/services/BudgetModel.js';

describe('amount calculator is a parser, not code', () => {
  it('does arithmetic', () => {
    expect(evalAmountExpr('=12*9.5')).toBe(114);
    expect(evalAmountExpr('4×52/12')).toBeCloseTo(17.33, 2);
    expect(evalAmountExpr('(1+2)*3-4/2')).toBe(7);
    expect(evalAmountExpr('-5+10')).toBe(5);
  });
  it('rejects anything that is not plain arithmetic', () => {
    for (const bad of ['alert(1)', '1;2', 'this', '1)(', 'constructor', '2**3', '[]', '"a"', '1 2']) expect(evalAmountExpr(bad)).toBeNull();
    expect(() => evalArithmetic('1+')).toThrow();
    expect(evalAmountExpr('9'.repeat(300))).toBeNull();
  });
});

describe('CSV export neutralises spreadsheet formulas', () => {
  it('prefixes cells starting with = + - @', () => {
    const b = { currentAge: 60, retirementAge: 60, endAge: 95, lines: [{ label: '=HYPERLINK("http://x")', tier: 'essential', annual: 100 }, { label: '+SUM(A1)', tier: 'discretionary', annual: 50 }, { label: '-cmd', tier: 'essential', annual: 1 }, { label: '@x', tier: 'essential', annual: 1 }], oneOffs: [] };
    const csv = budgetToCsv(b);
    expect(csv).toContain("'=HYPERLINK");
    expect(csv).toContain("'+SUM");
    expect(csv).toContain("'-cmd");
    expect(csv).toContain("'@x");
    expect(csv).not.toMatch(/(^|,)=HYPERLINK/m);
  });
});
