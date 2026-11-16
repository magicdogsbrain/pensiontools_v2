/**
 * A change the pinned answer corpora allow (answers.sameYear.test.js, answers.flat.test.js), as the 2028 note is: C's answer
 * read at the amount being tried (reported 16 Nov 2026: the slider "What if you took this a month?" moved and only one line
 * under it changed). An answer with a `take` now carries, beside everything it said before, the reading at that amount:
 * what it is made of there (`take.phases`, and `take.shapeAt` when what you spend changes with age) and the sentences the
 * page draws for it (answers/c/sentences.js takeReading). Nothing it said before changes, so the test takes the reading out
 * and the rest must hash as pinned, on every Node; the reading itself is held by the worked fixtures (F2, F3, F5), the named
 * states and tests/v7/c/takeView.test.js (D's reading of what you take, figure for figure and word for word).
 */
export const TAKE_SENTENCES = ['takeChance', 'takeHead', 'takeLine', 'takeFixed', 'takeBold', 'takeBad', 'takeHowLong', 'takeHowMuch', 'takeFloor', 'takeLeft', 'takeMadeOf', 'takeShape'];

/** Whether a result carries the reading at its amount tried. */
export const readsTake = (r) => Boolean(r && r.take && Array.isArray(r.take.phases) && r.sentences && r.sentences.takeHead);

/** The result with the reading at the amount tried taken out (keys in their order otherwise). */
export function withoutTakeReading(r) {
  if (!readsTake(r)) return r;
  const { phases, shapeAt, ...take } = r.take;
  void phases; void shapeAt;
  const sentences = Object.fromEntries(Object.entries(r.sentences).filter(([k]) => !TAKE_SENTENCES.includes(k)));
  return { ...r, take, sentences };
}
