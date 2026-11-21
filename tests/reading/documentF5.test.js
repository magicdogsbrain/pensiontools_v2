/**
 * Step F5 (lead4.md D18, R4, R8): the simple view's "Your plan as locked" and the full view's plan document read what the
 * document says about lasting through ONE reader (src/reading/document.js lockedLastsOf), in the same words, its figures
 * marked as the record they are (doc.lasts.chance, doc.lasts.fixedChance) in both views. Every plan here is made up.
 */
import { describe, it, expect } from 'vitest';
import { FIXTURES, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';
import { upgradeScenario } from '../../src/firebase/scenarioMigration.js';
import { lockedLastsOf } from '../../src/reading/document.js';
import { definitionOf } from '../../src/services/PlanDocument.js';
import { verdictBlockView } from '../../src/ui/oneAnswerView.js';
import { planPage } from '../../src/answers/plan/read.js';
import { groupParts } from '../../src/reading/sentenceMarks.js';
import { sentenceFindsOf } from '../../src/v7/components/facts.js';
import { FACT } from '../../src/reading/facts.js';
import { LABELS } from '../../src/reading/labels.js';

const NOW = new Date(2026, 10, 16, 12);
const up = (p) => upgradeScenario(JSON.parse(JSON.stringify(p)), { now: NOW }).scenario;
const plain = (h) => String(h).replace(/<[^>]+>/g, '').replace(/&#39;/g, "'").replace(/\s+/g, ' ');
const marks = (h) => [...String(h).matchAll(/data-fact="([^"]+)"[^>]*>([^<]*)</g)].map((m) => m[1] + '=' + m[2]);

describe('the document\'s lasting words: one reader, both views', () => {
  const tried = [];
  for (const f of FIXTURES) {
    it(f.key, () => {
      const plans = f.plans().map(up);
      const plan = plans.find((p) => p.id === f.subject);
      const doc = plan.planDocument;
      if (!doc || !doc.strategy || !doc.strategy.r || doc.strategy.contract) return;
      const L = lockedLastsOf(doc);
      expect(L).toBeTruthy();
      const pg = planPage(plans.map((p) => ({ plan: p })), plan.id, 'plan', { today: PARITY_DAY });
      const step = (pg.steps || []).find((s) => s.id === 'plan');
      const bad = step && (step.lines || []).find((l) => l.id === 'says.bad');
      if (!bad) return;
      tried.push(f.key);
      expect(bad.sentence.text.startsWith(L.words + '. Left at the end'), 'the simple view says the reader\'s words').toBe(true);
      const def = definitionOf(doc);
      if (L.tested !== 'weighted') return;
      const full = verdictBlockView(doc.strategy.r, doc.strategy.p, { definition: def });
      expect(plain(full)).toContain(L.headline);
      expect(plain(full)).toContain(L.fixed);
      expect(marks(full)).toContain(FACT.DOC_CHANCE + '=' + L.chanceWords);
      const groups = groupParts(bad.sentence.parts, {}, { keys: {}, finds: sentenceFindsOf('says.bad') });
      expect(groups.filter((g) => g.fact === FACT.DOC_CHANCE).map((g) => g.items.map((x) => x.text).join(''))).toEqual([L.chanceWords]);
      expect(groups.some((g) => g.fact === FACT.DOC_FIXED_CHANCE)).toBe(true);
    });
  }
  it('the locked plans with a document are tried; one label each', () => {
    expect(tried.length).toBeGreaterThan(0);
    expect(LABELS[FACT.DOC_CHANCE].label).toBe('When the plan was locked');
  });
});

// Step F5, pass 3 (R8): a document of a way bought by contract says its fixed-age count in both views, marked the same
describe('a bought way\'s document: its fixed-age count in both views', () => {
  const tried = [];
  for (const f of FIXTURES) {
    it(f.key, () => {
      const plans = f.plans().map(up);
      const plan = plans.find((p) => p.id === f.subject);
      const doc = plan.planDocument;
      if (!doc || !doc.strategy || !doc.strategy.r || !doc.strategy.contract) return;
      const L = lockedLastsOf(doc);
      if (!L || !L.fixed) return;
      const pg = planPage(plans.map((p) => ({ plan: p })), plan.id, 'plan', { today: PARITY_DAY });
      const step = (pg.steps || []).find((s) => s.id === 'plan');
      const bad = step && (step.lines || []).find((l) => l.id === 'says.badContract');
      if (!bad) return;
      tried.push(f.key);
      expect(bad.sentence.text).toContain('run it out. ' + L.fixed + ' Left at the end');
      const groups = groupParts(bad.sentence.parts, {}, { keys: {}, finds: sentenceFindsOf('says.badContract') });
      const simple = groups.filter((g) => g.fact === FACT.DOC_FIXED_CHANCE).map((g) => g.items.map((x) => x.text).join(''));
      expect(simple.length).toBe(1);
      // the age it is counted to, the document's own (doc.lasts.toAge), marked too
      expect(groups.filter((g) => g.fact === FACT.DOC_FIXED_AGE).length).toBe(1);
      const def = definitionOf(doc);
      if (!def || !def.weighted) return;
      const full = verdictBlockView(doc.strategy.r, doc.strategy.p, { definition: def });
      expect(marks(full)).toContain(FACT.DOC_FIXED_CHANCE + '=' + simple[0]);
    });
  }
  it('was tried on a locked ladder', () => { expect(tried.length).toBeGreaterThan(0); });
});
