/**
 * The parity gate's source scanner (scan.js): it must find a key added to today's app the way today's app adds keys, and
 * must not be fooled by braces in strings, templates, comments or regular expressions.
 */
import { describe, it, expect } from 'vitest';
import { literalKeys, callLiteralKeys, returnLiteralKeys, literalKeysAfter, assignedProps, functionBody } from './scan.js';

const SRC = `
  // saveStressSettings({ notAKey: 1 }) in a comment is not a call
  const html = '<div>{ notAKeyEither: 1 }</div>';
  const re = /\\{[a-z]+\\}/g;
  async function save() {
    await saveStressSettings({
      configured: true,
      dbAmount: +document.getElementById('ssDbAmount').value || 0,
      label: \`{\${name}}\`,               // a template with braces
      ...timingFieldsForSave(),          // a spread of a call: nothing to read
      ...(t > 0 ? { firstTaxYear: t } : {}),   // a spread of a literal: its keys count
      extraIncomes: rows.filter((r) => r.annual > 0),
      nested: { inner: 1 },
      shorthand,
      'quoted-key': 1,
      [computed]: 2,
      method() { return { notTop: 1 }; }
    });
    await saveStressSettings(patch);
    await saveDecisionSettings({ cadence: v });
  }
  function readThing() {
    if (x) return { a: 1, b: 2 };
    return cond ? { c: 3 } : { d: 4 };
  }
  window.timingThing = function (p) { return { e: 5 }; };
  const stressSettings = { duration, f: 6 };
  b.partnerAge = 1; b.partnerRetired == 2; b.x.y = 3; notb.z = 4;
`;

describe('the parity scanner', () => {
  it('finds the keys of a call\'s object literal, spreads of literals included, and nothing in comments or strings', () => {
    const { keys, calls } = callLiteralKeys(SRC, 'saveStressSettings');
    expect(calls).toBe(2);
    expect(keys).toEqual(['configured', 'dbAmount', 'label', 'firstTaxYear', 'extraIncomes', 'nested', 'shorthand', 'quoted-key', 'method']);
    expect(keys).not.toContain('notAKey');
    expect(keys).not.toContain('notAKeyEither');
    expect(keys).not.toContain('inner');
    expect(callLiteralKeys(SRC, 'saveDecisionSettings').keys).toEqual(['cadence']);
  });

  it('reads every literal a function returns, and a function assigned to a name', () => {
    expect(returnLiteralKeys(SRC, 'readThing').sort()).toEqual(['a', 'b', 'c', 'd']);
    expect(returnLiteralKeys(SRC, 'timingThing')).toEqual(['e']);
    expect(() => functionBody(SRC, 'noSuchFunction')).toThrow(/not found/);
  });

  it('reads the literal after an anchor, and fails loudly when the anchor is gone', () => {
    expect(literalKeysAfter(SRC, /const stressSettings\s*=\s*(?=\{)/)).toEqual(['duration', 'f']);
    expect(() => literalKeysAfter(SRC, /const gone\s*=\s*/)).toThrow(/not found/);
    expect(() => literalKeys('x', 0)).toThrow();
  });

  it('finds properties assigned on a name (not compared, not on another name)', () => {
    expect(assignedProps(SRC, 'b').sort()).toEqual(['partnerAge', 'x']);
  });
});
