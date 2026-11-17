/**
 * A locked gilt ladder's own way is its plan document's result in the ranking too (7.12.0, the living-ladder brief step 7).
 * "Does it last?" reads the document and never runs a locked ladder again; the ranking on "How the money is taken" ran the
 * plan's own ladder again on today's bundled prices, so the two pages gave two "typically left" figures for one plan.
 *
 * Corpus plan 03 (fictional, a locked full gilt ladder). By hand, from the fixture's own document JSON: "typically left" is
 * the median of what is left at the end, `planDocument.strategy.r.terminal.p50`.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { runWays } from '../../../src/answers/plan/waysRun.js';
import { runLasts } from '../../../src/answers/plan/lastsRun.js';
import { wayOf, cardsOf } from '../../../src/answers/plan/way.js';
import { WAY } from '../../../src/v7/copy/way.js';
import { entryOf, corpus } from './_plans.js';

const TODAY = '2026-11-16';
const raw = JSON.parse(readFileSync(join(process.cwd(), 'tests', 'fixtures', 'plans', '03-gilt-ladder-locked.json'), 'utf8'));
const BY_HAND = Math.round(raw.planDocument.strategy.r.terminal.p50);

describe('a locked ladder\'s own way, in the ranking, is its document\'s', () => {
  const plan = entryOf(corpus()['03-gilt-ladder-locked'], TODAY).plan;
  const ways = runWays(plan, { today: TODAY });
  const own = ways.ways.find((w) => w.id === raw.planDocument.strategy.id);

  it('the ranking and "Does it last?" give one "typically left", the document\'s', () => {
    expect(BY_HAND).toBeGreaterThan(0);
    expect(Math.round(own.a.typicalLeft)).toBe(BY_HAND);
    expect(Math.round(runLasts(plan, { today: TODAY }).a.typicalLeft)).toBe(BY_HAND);
  });

  it('the own way says it is as worked out at the lock; the other ways run today', () => {
    expect(own.asLocked).toBe('1 July 2026');
    for (const w of ways.ways.filter((x) => x.id !== own.id)) expect(w.asLocked, w.id).toBeUndefined();
  });

  it('a plan not locked runs its own way today, as before', () => {
    const unlocked = JSON.parse(JSON.stringify(plan));
    unlocked.decisionTool.settings.locked = false;
    delete unlocked.planDocument;
    const w = runWays(unlocked, { today: TODAY }).ways.find((x) => x.id === raw.planDocument.strategy.id);
    expect(w.asLocked).toBeUndefined();
  });
});

describe('the own card says once that it is as worked out at the lock', () => {
  it('its card carries the day, in the card\'s words', () => {
    const plan = entryOf(corpus()['03-gilt-ladder-locked'], TODAY).plan;
    const reading = wayOf([{ plan }], plan.id, { today: TODAY });
    const result = runWays(plan, { today: TODAY });
    const cards = cardsOf(reading, { key: reading.runKey, status: 'done', result });
    expect(cards.cards[0]).toMatchObject({ id: raw.planDocument.strategy.id, asLocked: '1 July 2026' });
    for (const c of cards.cards.slice(1)) expect(c.asLocked, c.id).toBe(null);
    expect(WAY.card.asLocked.replace('{date}', '1 July 2026')).toBe('As worked out when your plan was locked on 1 July 2026.');
  });
});
