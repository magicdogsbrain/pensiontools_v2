/**
 * All-pairs over DIMENSIONS (test plan 1.4). Greedy, no randomness: the same list every time.
 *
 * A dimension is a short list of named values that know which fields they set. Pairing dimensions rather than
 * raw fields keeps impossible cases out: the partner's dimensions take "not applicable" exactly when the
 * household is single, and that link is fixed, not a pair to cover.
 */

/** Deep-set a dotted path on a plain object. */
export function setPath(obj, path, value) {
  const keys = path.split('.');
  let o = obj;
  for (let i = 0; i < keys.length - 1; i++) o = o[keys[i]] ??= {};
  o[keys[keys.length - 1]] = value;
  return obj;
}

const NA = 'n/a';
const v = (id, set) => ({ id, set });
const partnerDim = (name, values) => ({ name, partner: true, values: [v(NA, () => {}), ...values] });

/** The dimensions of question C, in the order the generator fills them. */
export const DIMENSIONS = [
  { name: 'household', values: [v('single', (c) => setPath(c, 'household', 'single')), v('couple', (c) => setPath(c, 'household', 'couple'))] },
  { name: 'age', values: [40, 54, 55, 56, 57, 66, 67, 68, 75, 90].map((a) => v(`age${a}`, (c) => setPath(c, 'you.age', a))) },
  { name: 'pot', values: [0, 1, 10_000, 250_000, 1_073_100, 3_000_000].map((p) => v(`pot${p}`, (c) => setPath(c, 'you.pot', p))) },
  { name: 'risk', values: ['cautious', 'balanced', 'adventurous'].map((r) => v(r, (c) => setPath(c, 'risk', r))) },
  { name: 'statePension', values: [
    v('spNone', (c) => setPath(c, 'you.statePension.kind', 'none')),
    v('spFull', (c) => {}),
    v('spPart', (c) => { setPath(c, 'you.statePension.kind', 'forecast'); setPath(c, 'you.statePension.yearly', 6000); })
  ] },
  { name: 'finalSalary', values: [
    v('fsNone', (c) => {}),
    v('fs9kFrom60', (c) => setPath(c, 'you.finalSalary', { has: true, yearly: 9000, fromAge: 60 })),
    v('fs9kFrom65', (c) => setPath(c, 'you.finalSalary', { has: true, yearly: 9000, fromAge: 65 })),
    v('fs60kFrom60', (c) => setPath(c, 'you.finalSalary', { has: true, yearly: 60000, fromAge: 60 }))
  ] },
  { name: 'take', values: [v('takeNotGiven', (c) => {}), v('take0', (c) => setPath(c, 'take', 0)), v('take1000', (c) => setPath(c, 'take', 1000)), v('take50000', (c) => setPath(c, 'take', 50000))] },
  { name: 'endAge', values: [v('to95', (c) => {}), v('to100', (c) => setPath(c, 'endAge', 100))] },
  { name: 'savings', values: [v('savings0', (c) => {}), v('savings150k', (c) => setPath(c, 'savings', 150_000))] },
  // "later" starts at 60, or now for anyone already past 60 (the rules refuse a start before today's age).
  { name: 'start', values: [v('startDefault', (c) => {}), v('startLater', (c) => { setPath(c, 'start.kind', 'age'); setPath(c, 'start.age', Math.max(60, c.you.age)); })] },
  partnerDim('partnerAge', [54, 62, 70].map((a) => v(`partnerAge${a}`, (c) => setPath(c, 'partner.age', a)))),
  partnerDim('partnerPot', [0, 150_000, 1_073_100].map((p) => v(`partnerPot${p}`, (c) => setPath(c, 'partner.pot', p)))),
  partnerDim('partnerStatePension', [v('partnerSpNone', (c) => setPath(c, 'partner.statePension.kind', 'none')), v('partnerSpFull', (c) => {})]),
  partnerDim('partnerFinalSalary', [v('partnerFsNone', (c) => {}), v('partnerFs9kFrom60', (c) => setPath(c, 'partner.finalSalary', { has: true, yearly: 9000, fromAge: 60 }))])
];

/** True when value `b` of dimension `db` may sit beside value `a` of dimension `da` in one case. */
export function compatible(da, a, db, b) {
  const link = (d, x, other, y) => {
    if (d.name === 'household' && other.partner) return (x.id === 'single') === (y.id === NA);
    return true;
  };
  if (!link(da, a, db, b) || !link(db, b, da, a)) return false;
  if (da.partner && db.partner) return (a.id === NA) === (b.id === NA);
  return true;
}

/** Every pair that has to be covered: [dimIndexA, valueIndexA, dimIndexB, valueIndexB], A < B, only the possible ones. */
export function pairsToCover(dims = DIMENSIONS) {
  const out = [];
  for (let i = 0; i < dims.length; i++) {
    for (let j = i + 1; j < dims.length; j++) {
      for (let a = 0; a < dims[i].values.length; a++) {
        for (let b = 0; b < dims[j].values.length; b++) {
          if (!compatible(dims[i], dims[i].values[a], dims[j], dims[j].values[b])) continue;
          // the fixed link single ↔ n/a and couple ↔ real is not a pair to cover
          if ((dims[i].name === 'household' && dims[j].partner) || (dims[i].partner && dims[j].partner)) continue;
          out.push([i, a, j, b]);
        }
      }
    }
  }
  return out;
}

const key = (i, a, j, b) => `${i}:${a}|${j}:${b}`;

/**
 * The greedy all-pairs list: each case is an array of value indexes, one per dimension.
 * The first dimension is chosen to cover the most uncovered pairs; ties go to the earliest value.
 */
export function allPairs(dims = DIMENSIONS) {
  const uncovered = new Set(pairsToCover(dims).map(([i, a, j, b]) => key(i, a, j, b)));
  const cases = [];
  const uncoveredWith = (f, y) => { let n = 0; for (const k of uncovered) { const [l, r] = k.split('|'); if (l === `${f}:${y}` || r === `${f}:${y}`) n++; } return n; };
  while (uncovered.size) {
    const chosen = new Array(dims.length).fill(-1);
    for (let d = 0; d < dims.length; d++) {
      let best = -1;
      let bestCount = -1;
      for (let x = 0; x < dims[d].values.length; x++) {
        let ok = true;
        let count = 0;
        for (let e = 0; e < d; e++) {
          if (!compatible(dims[e], dims[e].values[chosen[e]], dims[d], dims[d].values[x])) { ok = false; break; }
          if (uncovered.has(key(e, chosen[e], d, x))) count++;
        }
        if (!ok) continue;
        // prefer a value that still has uncovered pairs with later dimensions, and never one that shuts out a later
        // value with pairs still to cover (single shuts out every partner value)
        for (let f = d + 1; f < dims.length; f++) {
          for (let y = 0; y < dims[f].values.length; y++) {
            if (uncovered.has(key(d, x, f, y))) count += 0.001;
            if (!compatible(dims[d], dims[d].values[x], dims[f], dims[f].values[y])) count -= 0.001 * uncoveredWith(f, y);
          }
        }
        if (count > bestCount) { bestCount = count; best = x; }
      }
      chosen[d] = best;
    }
    let newly = 0;
    for (let i = 0; i < dims.length; i++) for (let j = i + 1; j < dims.length; j++) if (uncovered.delete(key(i, chosen[i], j, chosen[j]))) newly++;
    if (!newly) throw new Error('the generator made a case that covers nothing: a value is unreachable');
    cases.push(chosen);
  }
  return cases;
}

/** A case (value indexes) → { name, inputs }. */
export function caseInputs(chosen, dims = DIMENSIONS) {
  const inputs = {};
  const names = [];
  dims.forEach((dim, d) => {
    const val = dim.values[chosen[d]];
    if (val.id !== NA) { val.set(inputs); names.push(val.id); }
  });
  return { name: names.join('·'), inputs };
}

/** The whole list as { name, inputs }. */
export function pairCases(dims = DIMENSIONS) {
  return allPairs(dims).map((c) => caseInputs(c, dims));
}
