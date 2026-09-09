/**
 * index.html structure guards. A stray </div> once nested every later tab panel inside the Decision
 * settings grid, so only the Decision tool showed a sub-tab ribbon (v6.2.1 → hotfix 6.2.2).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';

const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
const doc = new JSDOM(html).window.document;

describe('tab panels are siblings, each with its own ribbon', () => {
  it('every .tab-content shares one parent', () => {
    const panels = [...doc.querySelectorAll('.tab-content')];
    expect(panels.length).toBeGreaterThanOrEqual(6);
    const parents = new Set(panels.map((p) => p.parentElement));
    expect(parents.size).toBe(1);
  });
  it('the Stress and Decision panels carry their sub-tab ribbons directly', () => {
    expect(doc.querySelectorAll('#stress-content .sub-tab[data-stresstab]').length).toBe(6);
    expect(doc.querySelectorAll('#decision-content .sub-tab[data-decisiontab]').length).toBe(5);   // + Plan document (6.5.0)
    expect(doc.querySelector('#decision-plandoc')).not.toBeNull();
    expect(doc.querySelector('#ssLockBtn')).not.toBeNull();
    expect(doc.querySelector('#ssLockBanner')).not.toBeNull();
    expect(doc.querySelector('#decision-content #stress-content')).toBeNull();
    expect(doc.querySelector('#strategies-content #stratNav')).not.toBeNull();
  });
});
