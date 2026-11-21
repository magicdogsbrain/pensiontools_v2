/**
 * The plan document, read (lead4.md D18, R4, R8; step F5): ONE reader of what a locked document says about lasting, for
 * both views — the simple view's "Your plan as locked" (answers/plan/read.js says.bad) and the full view's plan document
 * (ui/oneAnswerView.js, the document's verdict block). The figures are the document's own, as it was locked: a record,
 * said as one ("When the plan was locked, …"), never today's run.
 *
 *   lockedLastsOf(doc, { weighted })  → null | {
 *     tested:   'weighted' | 'fixed' | 'legacy'   how the document was tested: the weighted definition with its chance, the
 *                                                 weighted definition with the fixed-age count only, or a document before
 *                                                 7.8.0 (its own "in N futures out of 10")
 *     chance:   number | null      the weighted chance as locked (0–1)
 *     chanceWords: string          that chance in words ("about 17 times in 20"), '' without one
 *     headline: string             "When the plan was locked, counting how long people your age live, the money lasts as long
 *                                  as you do about 17 times in 20." (the way's own words for a plan that cuts or goes lean)
 *     fixed:    string             the fixed-age count with its age ("If you live to 95, the money lasts that long in 18 of 20
 *                                  futures we tried."), '' for an old document
 *     words:    string             the two said together as one sentence, without its last full stop (the simple view's line
 *                                  goes on); an old document's own words, and — once the figures are weighted — how it was
 *                                  counted, so it is never read against the weighted figures beside it
 *   }
 *   DOC_LASTS_FINDS   the finds both views mark the document's chance and fixed-age count by (doc.lasts.chance,
 *                     doc.lasts.fixedChance)
 *
 * Pure: nothing is written.
 */
import { planToAgeOfDefinition, LEGACY_DEFINITION } from '../services/PlanDocument.js';
import { chanceWords, fixedAgeWords } from '../answers/shared/format.js';
import { SUCCESS, planToAgeOf } from '../answers/shared/rules.js';
import { oneAnswer, futuresOutOfTen } from '../services/OneAnswer.js';

/** How a way says "lasts as long as you do" (OneAnswer's words): run out, cut, or go lean. */
const LASTS_AS_LONG = { 'ran-out': 'the money lasts as long as you do', cut: 'your income is paid in full as long as you live', lean: 'you have no lean year while you are alive' };
const kindOf = (r) => (!r || !r.ruinLabel ? 'ran-out' : r.strategyId === 'floor-and-flex' ? 'lean' : 'cut');
const isObj = (v) => !!v && typeof v === 'object';

export function lockedLastsOf(doc, { weighted = SUCCESS.weighted } = {}) {
  const r = doc && doc.strategy && doc.strategy.r;
  const p = (doc && doc.strategy && doc.strategy.p) || {};
  if (!isObj(r)) return null;
  const def = doc.assumptions && isObj(doc.assumptions.success) && doc.assumptions.success !== LEGACY_DEFINITION ? doc.assumptions.success : null;
  const w = def && isObj(def.weighted) ? def.weighted : null;
  const age = planToAgeOfDefinition(def) ?? planToAgeOf(+p.startAge || 0, +p.durationYears || 0);
  const kind = kindOf(r);
  if (w) {
    const share = typeof w.fixedAge === 'number' ? w.fixedAge : Math.max(0, Math.min(1, 1 - (+(r.ruin && r.ruin.mc) || 0) / 100));
    const fixed = fixedAgeWords(share, age, { kind });
    if (typeof w.chance === 'number') {
      const cw = chanceWords(w.chance);
      const headline = 'When the plan was locked, counting how long people your age live, ' + LASTS_AS_LONG[kind] + ' ' + cw + '.';
      return { tested: 'weighted', chance: w.chance, chanceWords: cw, headline, fixed, words: headline + ' ' + fixed.replace(/\.$/, '') };
    }
    return { tested: 'fixed', chance: null, chanceWords: '', headline: 'When the plan was locked.', fixed, words: 'When the plan was locked: ' + fixed.replace(/\.$/, '') };
  }
  // a document before 7.8.0: its own words, and how it was counted once the figures beside it are weighted
  let share = null; try { share = oneAnswer(r, p).share; } catch { share = null; }
  const own = 'Your plan lasts ' + futuresOutOfTen(share).words;
  const words = !weighted || def ? own : own + '; when it was locked, counted to ' + age + '; not by how long you might live';
  return { tested: 'legacy', chance: null, chanceWords: '', headline: own, fixed: '', words };
}

/** The finds both views mark the document's figures by: src/reading/sentenceMarks.js DOC_LASTS_FINDS. */
export { DOC_LASTS_FINDS } from './sentenceMarks.js';
