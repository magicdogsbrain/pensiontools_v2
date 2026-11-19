/**
 * Step F1, fix round 2 (lead4.md D5, R7): the stage is said in the three words (Saving / Moving / Living on it) wherever the
 * full view says it — the chip AND the card that says what "draft" and "locked" mean (opened from the plan list). The card
 * printed the placing's own label ("Committed, still saving", "Approaching retirement", "Running the plan", "Retired,
 * designing the plan") beside a chip that says the reading's word, so the two contradicted. Both now draw the stage through
 * ONE helper (src/ui/stageWords.js) from the reading's word and time to go (src/reading/timing.js).
 * Fictional people only (the parity fixtures; Alex in the hand-made case).
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

vi.mock('../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { FIXTURES, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';
import { upgradeScenario } from '../../src/firebase/scenarioMigration.js';
import { deriveStage, STAGES } from '../../src/services/LifeStage.js';
import { stage, yearsToGo } from '../../src/reading/timing.js';
import { settingsOf } from '../../src/reading/money.js';
import { contextFor } from '../../src/reading/context.js';
import { formatFact } from '../../src/reading/format.js';
import { STAGE_WORDS } from '../../src/reading/labels.js';
import { stageWordsHtml, whereYouAreHtml } from '../../src/ui/stageWords.js';

const noon = (day) => { const [y, m, d] = day.split('-').map(Number); return new Date(y, m - 1, d, 12); };
const NOW = noon(PARITY_DAY);
const plain = (html) => String(html).replace(/<[^>]+>/g, '');
const marked = (html, fact) => [...String(html).matchAll(new RegExp('data-fact="' + fact.replace(/\./g, '\\.') + '">([^<]*)<', 'g'))].map((m) => m[1]);
const plansOf = (f) => f.plans().map((p) => upgradeScenario(JSON.parse(JSON.stringify(p)), { now: NOW }).scenario);
// the placing labels that are not one of the three words (or Closed): none may be printed as the stage
const PLACING_ONLY = Object.values(STAGES).map((d) => d.label).filter((l) => !STAGE_WORDS.includes(l) && l !== 'Closed');

/** What the full view's refreshLifeStage hands the chip and the card, for one plan. */
function readingOf(plan) {
  const ctx = contextFor(plan, { now: NOW });
  const ss = settingsOf(plan, ctx);
  const placing = deriveStage({ ...plan, stressTool: { ...(plan.stressTool || {}), settings: ss || plan.stressTool?.settings || {} } }, NOW);
  return { placing, word: stage(plan, ctx), yearsToGo: yearsToGo(plan, ctx) };
}

describe('the card says the stage the chip says, for every parity fixture', () => {
  it.each(FIXTURES.map((f) => [f.key, f]))('%s', (key, f) => {
    for (const plan of plansOf(f)) {
      const r = readingOf(plan);
      const card = whereYouAreHtml(r), chip = stageWordsHtml(r);
      // one stage word, the chip's and the card's
      expect(marked(card, 'stage')).toEqual(marked(chip, 'stage'));
      expect(marked(card, 'yearsToGo')).toEqual(marked(chip, 'yearsToGo'));
      if (r.word && r.placing.key !== 'unknown') {
        expect(marked(chip, 'stage')).toEqual([r.word]);
        expect(plain(card)).toContain('Where you are: ' + r.word);
      } else {
        expect(chip).toBe('');
        expect(card).toBe('');
      }
      for (const l of PLACING_ONLY) expect(plain(card), key + ': ' + l).not.toContain(l);
      for (const ytg of marked(card, 'yearsToGo')) expect(ytg).toBe(formatFact('yearsToGo', r.yearsToGo));
    }
  });
});

describe('a locked saver inside the move window (Alex, 57, stops work in November 2029)', () => {
  const now = new Date(2026, 10, 16, 12);
  const alex = {
    id: 'p1', stressTool: { settings: { currentAge: 57, currentAgeAsOf: '2026-11-16', retired: false, retireAge: 60, firstTaxYear: 2029 } },
    decisionTool: { settings: { locked: true }, history: [] }, planDocument: { lockedAt: '2026-11-16' }
  };
  it('the card says Moving, as the chip and the home, never "Committed, still saving"', () => {
    const placing = deriveStage(alex, now);
    expect(placing.label).toBe('Committed, still saving');
    const r = { placing, word: stage(alex, { now }), yearsToGo: yearsToGo(alex, { now }) };
    expect(r.word).toBe('Moving');
    const card = plain(whereYouAreHtml(r));
    expect(card).toContain('Where you are: Moving');
    expect(card).not.toContain('Committed, still saving');
    expect(card).toContain(formatFact('yearsToGo', r.yearsToGo) + ' to go');
    expect(stageWordsHtml(r)).toContain('data-fact="stage">Moving<');
  });
});

describe('the full view draws both through the one helper', () => {
  const SRC = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
  it('never prints the placing label', () => {
    expect(SRC).not.toMatch(/_lifeStage\.label/);
    expect(SRC).not.toMatch(/\bst\.label\b/);
  });
  it('the chip and the card read the same word', () => {
    expect(SRC).toMatch(/stageWordsHtml\(\{ placing: st, word: window\._stageWord, yearsToGo: window\._yearsToGo \}\)/);
    expect(SRC).toMatch(/whereYouAreHtml\(\{ placing: window\._lifeStage, word: window\._stageWord, yearsToGo: window\._yearsToGo \}\)/);
  });
});
