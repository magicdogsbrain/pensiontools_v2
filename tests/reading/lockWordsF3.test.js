/**
 * The lock, said the same in both views (lead4.md R7; step F3): its two words ("Locked", "Not locked") from one place
 * (src/reading/labels.js LOCK_WORDS), the full view's chip marking the same word the simple view's Lock line marks; and the
 * day it was locked in one form ("12 November 2024": answers/plan/dates.js dayWords), the full view's lock banner and plan
 * document included.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { LOCK_WORDS } from '../../src/reading/labels.js';
import { dayWords } from '../../src/answers/plan/dates.js';
import { planDocumentHeaderHtml } from '../../src/ui/components/PlanDocumentView.js';

const read = (p) => readFileSync(resolve(process.cwd(), p), 'utf8');

describe('the lock\'s words and day, one each', () => {
  it('two words', () => expect(LOCK_WORDS).toEqual({ locked: 'Locked', notLocked: 'Not locked' }));
  it('the full view\'s chip marks the word, its sign outside the mark', () => {
    const html = read('index.html');
    expect(html).toMatch(/markFact\('lock\.state', locked \? LOCK_WORDS\.locked : LOCK_WORDS\.notLocked\)/);
    expect(html).not.toMatch(/markFact\('lock\.state', locked \? '🔒 locked' : '✏️ draft'\)/);
  });
  it('the simple view\'s Lock line says the same words', () => {
    const src = read('src/answers/plan/read.js');
    expect(src).toMatch(/sentence\('lock\.locked', \[LOCK_WORDS\.locked \+ ' ' \+ lockedOn\]/);
    expect(src).toMatch(/sentence\('lock\.notLocked', \[LOCK_WORDS\.notLocked\]/);
  });
  it('the day: the banner and the document in the simple view\'s form', () => {
    expect(dayWords('2024-11-12T10:00:00.000Z')).toBe('12 November 2024');
    expect(read('index.html')).toMatch(/const when = ds\.lockedAt \? dayWords\(ds\.lockedAt\) : ''/);
    const h = planDocumentHeaderHtml({ lockedAt: '2024-11-12T23:30:00.000Z', planName: 'Alex', strategy: { id: 'pots-and-valves' } });
    expect(h).toMatch(/data-fact="lock\.date">12 November 2024</);
  });
  it('a gilt\'s maturity on the order sheet: its day, as the simple view\'s Move page says it', () => {
    expect(read('index.html')).toMatch(/cellAttr\(o\.tidm, 'matures'\) \+ '>' \+ budEsc\(dayWords\(o\.matures\)/);
  });
});
