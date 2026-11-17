/**
 * Month by month is a record page (banned.js SCOPES.record): its figures are the record's own, never an estimate, so no
 * sentence of its copy says "about £". 7.12.0's part-year sentence under the tax-year set-up said "about {full}" and "about
 * {month}" of two figures worked out to the pound; the browser's banned check on the page caught it.
 */
import { describe, it, expect } from 'vitest';
import { MONTH } from '../../../src/v7/copy/month.js';
import { BANNED } from '../../../src/v7/copy/banned.js';

function strings(obj, path = '', out = []) {
  if (typeof obj === 'string') out.push([path, obj]);
  else if (obj && typeof obj === 'object') for (const [k, v] of Object.entries(obj)) strings(v, path ? `${path}.${k}` : k, out);
  return out;
}

describe('Month by month says the record\'s figures as they are', () => {
  it('no string of month.js, its money slots filled with pounds (a percentage with a number), says "about £" (the record scope)', () => {
    const rule = BANNED.find((b) => b.id === 'about-record');
    expect(rule && rule.scope).toBe('record');
    const hits = strings(MONTH).map(([where, s]) => [where, s.replace(/\{(pct|cpi)\}/g, '2').replace(/\{[a-zA-Z]+\}/g, '£2,400')]).filter(([, s]) => rule.re.test(s)).map(([where]) => where);
    expect(hits).toEqual([]);
  });
});
