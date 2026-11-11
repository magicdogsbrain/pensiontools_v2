/**
 * TEST ONLY — an answer as it was read before 7.8.0, for the frozen copies (tests/v7/keep/seed.v1): the figure at the
 * level is handed to them under the keys they read (C, D `monthly`/`lasted`/`runOutAge`; A the shown row's `monthly`; B
 * `number`, `chance`, `payIn.at`, `enough.nineInTen`, `basis.failuresAllowed`) — the same figure the level keys hold.
 * Only the seed's `answer` row differs by design (seed version 4: the level's row), so it is compared on its own.
 */
export function asBefore(q, r) {
  if (!r || !r.levels) return r;
  const out = JSON.parse(JSON.stringify(r));
  const level = r.level || 'balanced';
  const three = (v) => ({ careful: v, middling: v, good: v });
  if (q === 'c' || q === 'd') {
    const L = r.levels[level];
    out.monthly = three(L.monthly);
    if (q === 'c') { out.lasted = three(L.fixedAge); out.runOutAge = three(r.basis.endAge); }
    if (r.shapeAt) out.shapeAt = { careful: r.shapeAt[level] };
  }
  if (q === 'a') out.shown = { ...out.shown, monthly: three(r.shown.levels[level].monthly) };
  if (q === 'b') {
    const L = r.levels[level];
    out.number = L.pot === null ? null : { ...three(L.pot), byPerson: L.byPerson };
    out.chance = { lasted: r.chance.fixedAge, outOfTen: r.wholeLife.outOfTen, fails: r.chance.fails };
    out.payIn = { ...out.payIn, at: { nineInTen: L.payIn ?? null, threeInFour: null } };
    if (out.enough) out.enough = { ...out.enough, nineInTen: out.enough.atLevel };
    out.basis = { ...out.basis, failuresAllowed: Math.floor(r.basis.futures / 10) };
  }
  return out;
}

/** A seed (or a plan's fromAnswer record) without its answer row. */
export const noAnswer = (seed) => { const { answer, ...rest } = seed; void answer; return rest; };
