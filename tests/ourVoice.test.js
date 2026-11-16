/**
 * Our voice on public pages (reported 16 Nov 2026): the full view's landing page said the site was built by one retired
 * engineer and asked people to "tell me". The site is run by Usefulish Ltd, and its words are ours ("we"), describing no one
 * person. The person's own voice stays where it is theirs: a question asked ("Am I saving enough?"), a button pressed
 * ("Use these in my plan"), a choice ("Just me").
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

/** Words that speak as one person who built or runs the site, or describe them. */
const ONE_PERSON = [
  /retired engineer/i, /\bone (retired )?(engineer|developer|man|woman)\b/i, /personal project/i, /side project/i, /hobby project/i,
  /\btell me\b/i, /\b(email|contact|write to|message) me\b/i, /\bI (built|made|wrote|run|maintain)\b/i, /\bbuilt by (me|one)\b/i, /\bmy (project|site|tool|app)\b/i
];

const PAGES = [
  'src/ui/components/LandingPage.js',
  'index.html',
  'public/privacy.html',
  ...readdirSync(join(ROOT, 'src/v7/copy')).filter((f) => f.endsWith('.js') && f !== 'banned.js').map((f) => `src/v7/copy/${f}`)
];

describe('our voice, no one person described', () => {
  it.each(PAGES)('%s', (file) => {
    const text = read(file);
    for (const re of ONE_PERSON) expect(re.test(text), `${file} matches ${re}`).toBe(false);
  });
  it('the landing page says who runs the site, in our voice', () => {
    const text = read('src/ui/components/LandingPage.js');
    expect(text).toContain('Built and run by Usefulish Ltd');
    expect(text).toContain('We built it to help people make better pension decisions.');
  });
});
