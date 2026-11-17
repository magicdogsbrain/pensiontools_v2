/**
 * One chance per plan while it is still saving (7.12.0, lead decision 3): the chance its money lasts as long as you do is
 * the one "What you pay in", the home and the full view's Accumulation tab work out (question B on the plan's own figures:
 * each future saves its own pot, then draws from it). The plan's own test — "Does it last?" and the full view's "Will it
 * last?" — starts from the middling pot when work stops, so its own chance is a different measure (higher: it leaves out
 * the saving years' ups and downs). Both screens put the saving chance in the headline and its verdict, and say that every
 * figure under it starts from the middling pot.
 *
 *   withSavingChance(a, chance)   a weighted oneAnswer → the same with `chance` (0 to 1) as its weighted figure, its
 *                                 headline words and its verdict at its own level; `chanceFrom: 'saving'`. The count to one
 *                                 age and what is left stay the run's. Null `chance`, or a run that did not weigh: `a`.
 *
 * Pure.
 */
import { chanceWords } from './format.js';
import { LEVEL_FAILS20 } from './rules.js';

export function withSavingChance(a, chance) {
  if (!a || typeof chance !== 'number' || !Number.isFinite(chance) || typeof a.weighted !== 'number') return a;
  const was = chanceWords(a.weighted, { sumW: a.sumW, n: a.n });
  const now = chanceWords(chance);
  const words = a.words && typeof a.words.headline === 'string' ? { ...a.words, headline: a.words.headline.replace(was, now) } : a.words;
  // the verdict at the run's level on this chance, as a weighted share is judged (lasts.js atLevel)
  const t = LEVEL_FAILS20[a.level];
  const verdict = typeof t !== 'number' ? a.verdict : chance >= 1 - t / 20 - 1e-12 ? 'yes' : chance >= 1 - (t + 1) / 20 - 1e-12 ? 'close' : 'no';
  return { ...a, weighted: chance, sumW: null, n: null, words, verdict, lasts: verdict === 'yes', chanceFrom: 'saving' };
}
