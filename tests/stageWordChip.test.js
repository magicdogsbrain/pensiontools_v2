/**
 * One stage word in both views (7.12.0): the full view's chip says the stage the plan's home says. Fictional Alex, 57, a
 * plan locked on 16 November 2026 that stops work in November 2029: inside the move window (3 years), so the home says
 * "Moving" and the chip must too (it said "Committed, still saving"). Before the window, both say "Saving"; once drawing
 * with months recorded, both say "Living on it".
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { deriveStage, stageOf } from '../src/services/LifeStage.js';
import { stageWordOf } from '../src/ui/stageWord.js';
import { HOME } from '../src/v7/copy/home.js';

const now = new Date(2026, 10, 16, 12);
const saver = (retireAge, locked = true) => ({
  id: 'p1', stressTool: { settings: { currentAge: 57, currentAgeAsOf: '2026-11-16', retired: false, retireAge, firstTaxYear: 2026 + (retireAge - 57) } },
  decisionTool: { settings: { locked }, history: [] }, planDocument: locked ? { lockedAt: '2026-11-16' } : null
});

describe('the chip says the home\'s stage word', () => {
  it('locked, inside the move window: Moving, as the home', () => {
    const sc = saver(60), placing = deriveStage(sc, now);
    expect(placing.label).toBe('Committed, still saving');
    expect(stageOf(sc, now, { placing }).key).toBe('moving');
    expect(stageWordOf(sc, placing, now)).toBe(HOME.stages.moving);
    expect(HOME.stages.moving).toBe('Moving');
  });
  it('far from the stop: Saving', () => {
    const sc = saver(67), placing = deriveStage(sc, now);
    expect(stageWordOf(sc, placing, now)).toBe('Saving');
  });
  it('the chip uses it', () => {
    const html = readFileSync('index.html', 'utf8');
    expect(html).toMatch(/stageWordOf\(/);
    expect(html).toMatch(/' · ' \+ markFact\('stage', esc\(window\._stageWord \|\| st\.label\)\)/);   // marked for the parity sweep (lead4.md G1)
  });
});
