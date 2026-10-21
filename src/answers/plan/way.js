/**
 * "How the money is taken" (research/v7/way-and-mix.md 2; road-to-7.md step 8a): the way of drawing of a saved plan in V7.
 * Pure: a plan already brought up to date in memory, today's date, the nine-way run held in page memory (waysRun.js) and
 * what was typed into a card's dials; out come the cards in V7's words, the dials with their values and problems, the
 * exact field paths and values "Use this way of drawing" writes, and the key a run is filed under. Nothing here runs the
 * test — that is waysRun.js, loaded lazily by the worker — and nothing here writes or reads a clock.
 *
 *   wayOf(entries, id, { today })             the reading: the plan's way, every way's restored dials, the cut dials, the lock
 *   runKeyOf(plan)                            the key the nine-way result is filed under (lasts.js's: the plan, its stamp, its settings)
 *   checkDials(id, typed, base)               text as typed → { ok, values, errors, shown }
 *   cardsOf(reading, W)                       the page's view of the cards from the reading and state.ways: current first, open,
 *                                             the other eight ranked (OneAnswer.rankWays), each card's lines, dials, verdict, table row
 *   wayPatch(plan, id, typed, { today, at })  → { ok, errors, patch, previous, line }: the dotted paths the switch changes (2.4)
 *   dialUnitsOf(dial, stored), stratDialsOf(id, values)   a stored param ↔ a dial's units; a card's values as a strategy page's bag
 *
 * Every path written is in schema.js WAY_WRITES (tested); only the dials typed on the card go into the switch (as the
 * planner's strategy page sends only the dials turned), so a key the plan lacks stays absent unless it was set.
 */
import { futuresOutOfTen, pctText, CHANCE_BARS, rankWays } from '../../services/OneAnswer.js';
import { restoredParamsFor, switchPatch } from '../../services/PlanCommit.js';
import { get, applyPatch, safeSettings, safeTiming } from './about.js';
import { pounds } from './income.js';
import { isBought } from './pots.js';
import { verdictWord, CONTRACT, FAMILY, runKeyOf } from './lasts.js';
import { WAY_IDS, WAY_DIALS, WAY_WRITES, RANK_BYS } from './schema.js';
import { dateOf, dayWords } from './dates.js';

export { applyPatch, runKeyOf };

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const num = (v) => (v == null || v === '' || !Number.isFinite(+v) ? null : +v);
const blank = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
const isLocked = (plan) => !!(plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked);
const lockedAtOf = (plan) => (plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.lockedAt) || (plan && plan.planDocument && plan.planDocument.lockedAt) || null;
const nameOf = (plan) => (plan && plan.planDetails && typeof plan.planDetails.name === 'string' && plan.planDetails.name) || (plan && typeof plan.name === 'string' && plan.name) || '';
const copy = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const text = (v) => (v === undefined ? '<absent>' : JSON.stringify(v));
const r0 = (v) => Math.round(+v || 0);
const n0 = (v) => String(Math.round(+v || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const dialOf = (id, key) => (WAY_DIALS[id] || []).find((d) => d.key === key) || null;

// ---- a stored param ↔ a dial's units ----------------------------------------------------------------------------------------

/** A stored param read as the dial shows it; null when absent or not a value the dial can show. */
export function dialUnitsOf(d, stored) {
  if (!d) return null;
  if (d.key === 'sleeveRatePct') return num(stored) == null ? null : Math.round(+stored * 100 * 100) / 100;
  if (d.key === 'spareGrowth') return stored === true ? 'invested' : stored === false ? 'kept' : null;
  if (d.key === 'ratchet') return stored === 'extend' || stored === 'raise' ? stored : stored == null ? null : 'off';
  if (d.type === 'choice') return d.options.includes(stored) ? stored : null;
  // a pound figure the engine treats as "not set" when it is 0 (drawAnnual: the plan's target; essentialsAnnual: its share)
  if (d.type === 'money' && d.min >= 1 && !(num(stored) > 0)) return null;
  return num(stored);
}

/** A card's values (dial units) as a strategy page's dial bag (index.html _stratDials: what PlanCommit.dialParams reads). */
export function stratDialsOf(id, values) {
  const out = {};
  for (const d of WAY_DIALS[id] || []) {
    const v = values && values[d.key];
    if (v === undefined || v === null) continue;
    if (d.key === 'protectionOn') out.protectionOn = v === 'yes';
    else if (d.key === 'spareGrowth') out.spareGrowth = v === 'invested';
    else out[d.key] = v;
  }
  return out;
}

/** The way's restored params (PlanCommit.restoredParamsFor: the active bag when it is this way's, else its stash) in dial units. */
export function stashOf(ss, id) {
  const bag = restoredParamsFor(ss || {}, id);
  const out = {};
  for (const d of WAY_DIALS[id] || []) {
    if (d.cut) continue;
    const v = dialUnitsOf(d, d.key === 'sleeveRatePct' ? bag.sleeveRate : bag[d.key]);
    if (v !== null) out[d.key] = v;
  }
  return out;
}

/** The plan's cut dials in dial units (the Pots & Valves family's, "Does it last?"'s own keys). */
export function cutsOfSettings(ss) {
  const s = ss || {};
  return { protectionOn: s.disableProtection ? 'no' : 'yes', cutPct: Math.round((1 - (num(s.protectionMult) ?? 0.8)) * 100), consecutiveLimit: num(s.consecutiveLimit) ?? 3 };
}

// ---- the reading --------------------------------------------------------------------------------------------------------------

/**
 * Everything the screen draws but the run (2.2): the plan's way, each way's restored dials, the cut dials, the lock and the
 * document's figure. The cards themselves are cardsOf(reading, state.ways).
 */
export function wayOf(entries, id, { today } = {}) {
  const list = (entries || []).filter((e) => e && e.plan && typeof e.plan === 'object' && e.plan.id != null);
  const entry = list.find((e) => String(e.plan.id) === String(id)) || null;
  if (!entry) return { found: false, id: String(id || '') };
  const plan = entry.plan;
  const now = dateOf(today);
  const readonly = !!(entry.newer || entry.failed);
  const locked = isLocked(plan);
  const doc = locked && isObj(plan.planDocument) ? plan.planDocument : null;
  const ss = safeSettings(plan, now);
  const timing = safeTiming(ss, now);
  const strategyId = WAY_IDS.includes(ss.strategyId) ? ss.strategyId : 'pots-and-valves';
  const docStrategyId = doc && doc.strategy && WAY_IDS.includes(doc.strategy.id) ? doc.strategy.id : strategyId;
  const stash = {};
  for (const w of WAY_IDS) stash[w] = stashOf(ss, w);
  // the document's figure (6.24.0): the share the plan was locked with, never run again here
  const docR = doc && doc.strategy && isObj(doc.strategy.r) && doc.strategy.r.affordable && doc.strategy.r.ruin ? doc.strategy.r : null;
  const docShare = docR ? Math.max(0, Math.min(1, (100 - (+docR.ruin.mc || 0)) / 100)) : null;
  return {
    found: true, id: String(plan.id), name: nameOf(plan), locked, lockedOn: locked ? dayWords(lockedAtOf(plan)) : null, readonly, editable: !locked && !readonly,
    source: locked ? { kind: 'locked', at: dayWords(lockedAtOf(plan)) } : { kind: 'saved', at: plan.lastModified ? dayWords(plan.lastModified) : null },
    strategyId, docStrategyId, bought: isBought(strategyId), family: FAMILY.includes(strategyId),
    endAge: (num(timing.shapeAgeNow) || 57) + (num(ss.duration) || 35) - 1,
    runKey: readonly ? null : runKeyOf(plan),
    stash, cuts: cutsOfSettings(ss),
    document: docShare == null ? null : { share: docShare, words: futuresOutOfTen(docShare).words, chance: pctText(docShare * 100, 1, CHANCE_BARS).replace(/%$/, ''), lockedOn: dayWords(doc.lockedAt || lockedAtOf(plan)) }
  };
}

// ---- the dials as typed ---------------------------------------------------------------------------------------------------------

function parseDial(raw, d) {
  if (blank(raw)) return { error: 'required', value: null };
  if (d.type === 'choice') { const v = String(raw); return d.options.includes(v) ? { error: null, value: v } : { error: 'notAnOption', value: null }; }
  const s = String(raw).replace(/[£,%\s]/g, '');
  const whole = d.type === 'count' || d.type === 'age' || d.type === 'money';
  if (!(whole ? /^\d{1,9}$/ : /^\d{1,9}(\.\d{1,2})?$/).test(s)) return { error: 'notANumber', value: null };
  const n = whole ? +s : Math.round(+s * 100) / 100;
  if (n < d.min) return { error: 'tooLow', value: n };
  if (n > d.max) return { error: 'tooHigh', value: n };
  return { error: null, value: n };
}

/**
 * The dials of a way as typed over the values a card starts from: `typed` is text by key (only the dials touched); `base`
 * the starting values (the stash over the run's defaults; the plan's cut dials). → the values of every dial (typed or base),
 * the errors by key, and what each box shows.
 */
export function checkDials(id, typed, base = {}) {
  const values = {}, errors = {}, shown = {};
  for (const d of WAY_DIALS[id] || []) {
    const t = typed && Object.prototype.hasOwnProperty.call(typed, d.key) ? typed[d.key] : undefined;
    if (t === undefined) { values[d.key] = base[d.key] === undefined ? null : base[d.key]; shown[d.key] = base[d.key] == null ? '' : String(base[d.key]); continue; }
    shown[d.key] = String(t == null ? '' : t);
    const r = parseDial(t, d);
    if (r.error) errors[d.key] = r.error; else values[d.key] = r.value;
  }
  return { ok: Object.keys(errors).length === 0, values, errors, shown };
}

// ---- the cards ----------------------------------------------------------------------------------------------------------------

const chanceOf = (a) => pctText(a.chancePct, 1, CHANCE_BARS).replace(/%$/, '');

/** The lines of one way's figures (a wayResult), as ids into copy/way.js card with slots. */
export function cardLines(w, { endAge = null, current = false } = {}) {
  const lines = [];
  if (!w) return lines;
  if (!w.affordable) {
    const rs = w.reason || {};
    if (rs.why === 'cost' && rs.cost != null) lines.push({ id: 'cannot', slots: { cost: pounds(rs.cost), short: pounds(rs.short) } });
    else lines.push({ id: 'cannotGilt', slots: {} });
    return lines;
  }
  const a = w.a;
  const years = Math.round(a.years || 0);
  lines.push({ id: current ? 'lastsYours' : 'lasts', slots: { words: futuresOutOfTen(a.share).words } });
  if (CONTRACT.includes(w.id)) lines.push({ id: 'subContract', slots: { years: String(years), toAge: endAge == null ? '' : String(endAge) } });
  else lines.push({ id: 'sub', slots: { pct: chanceOf(a), futures: n0(a.futures), histories: n0(a.histories) } });
  lines.push({ id: 'left', slots: { typical: pounds(a.typicalLeft), bad: pounds(a.badCaseLeft) } });
  if (w.bought) lines.push({ id: w.left != null && w.left > 0 ? 'cost' : 'costAll', slots: { cost: pounds(w.cost), left: pounds(w.left || 0) } });
  return lines;
}

/** The "More columns" row of one way: the planner's extra columns in V7's names. */
function tableRow(w) {
  if (!w || !w.affordable) return null;
  return {
    worst12: w.worst12 == null ? null : pounds(w.worst12),
    covered: w.coverage == null ? null : pctText(w.coverage),
    coverage: w.coverageRatio == null ? null : w.coverageRatio.toFixed(2),
    spent: w.spentMedian == null ? null : pounds(w.spentMedian),
    bumpiness: w.vol == null ? null : String(Math.round(w.vol * 100)),
    score: w.vac == null ? null : w.vac.toFixed(1)
  };
}

/** The ranking of the affordable ways (OneAnswer.rankWays on the results' figures), then the unaffordable in the planner's order. */
export function rankedIds(ways, by = 'lasts') {
  const rows = (ways || []).filter((w) => w && w.affordable).map((w) => ({ id: w.id, r: { ruin: w.ruin, terminal: w.terminal, coverage: w.coverage }, sc: w.vac == null ? null : { vac: w.vac, coverageRatio: w.coverageRatio } }));
  const ranked = rankWays(rows, RANK_BYS.includes(by) ? by : 'lasts').map((x) => x.id);
  return [...ranked, ...WAY_IDS.filter((id) => (ways || []).some((w) => w && w.id === id && !w.affordable))];
}

/**
 * The page's view of the cards (2.2) from the reading (wayOf) and state.ways (W: key, status, result, open, dials, tried,
 * rankBy). The plan's own way first and open unless another is; the other eight ranked and closed. A card's figures are
 * its tried result when one is held, else the nine-way run's; its dials start from the way's stash over the run's defaults
 * (the plan's cut dials for the family's) and show what was typed. `needsRun`: the card is open and the values its dials
 * show are not the ones the comparison ran it with (a stash, or a dial typed), and no try for them is held.
 */
export function cardsOf(reading, W) {
  if (!reading || !reading.found) return { found: false, cards: [], current: null, open: null, rankBy: 'lasts', ran: null };
  const w = W || {};
  const mine = reading.runKey && w.key === reading.runKey;
  const result = mine && w.status === 'done' && w.result ? w.result : null;
  const byId = new Map((result ? result.ways : []).map((x) => [x.id, x]));
  const rankBy = RANK_BYS.includes(w.rankBy) ? w.rankBy : 'lasts';
  const current = reading.strategyId;
  const open = w.open && WAY_IDS.includes(w.open) ? w.open : current;
  const order = result ? rankedIds(result.ways, rankBy) : [];
  const others = result ? order.filter((id) => id !== current) : WAY_IDS.filter((id) => id !== current);
  const tried = mine && w.tried ? w.tried : {};
  const typedAll = mine && w.dials ? w.dials : {};
  const cards = [current, ...others].map((id) => {
    const ran = byId.get(id) || null;
    const t = tried[id] || null;
    const shownResult = t && t.status === 'done' && t.result ? t.result : ran;
    const defaults = ran ? ran.dials.defaults : {};
    const base = { ...defaults, ...(reading.stash[id] || {}), ...(id && FAMILY.includes(id) ? reading.cuts : {}) };
    const typed = typedAll[id] || {};
    const c = checkDials(id, typed, base);
    const dials = (WAY_DIALS[id] || []).map((d) => ({ key: d.key, type: d.type, options: d.type === 'choice' ? d.options : null, min: d.min == null ? null : d.min, max: d.max == null ? null : d.max, step: d.step || null, shown: c.shown[d.key], error: c.errors[d.key] || null, cut: !!d.cut }));
    // the values the comparison ran this way with: the card's starting values differ when the way has a stash of its own
    const ranWith = ran ? ran.dials.ranWith : null;
    const differs = ran && c.ok ? dials.some((d) => text(c.values[d.key]) !== text(ranWith[d.key])) : false;
    const triedFor = t && t.values ? t.values : null;
    const sameTry = triedFor && c.ok ? dials.every((d) => text(c.values[d.key]) === text(triedFor[d.key])) : false;
    const isOpen = id === open;
    const needsRun = isOpen && !!ran && c.ok && differs && !(t && (t.status === 'working' || sameTry));
    const figures = shownResult && shownResult.affordable ? shownResult.a : null;
    const verdict = figures ? { word: verdictWord(figures.share), share: figures.share, chancePct: figures.chancePct, words: futuresOutOfTen(figures.share).words, typicalLeft: r0(figures.typicalLeft), badCaseLeft: r0(figures.badCaseLeft) } : null;
    const stale = !!(t && t.status === 'working') || (isOpen && differs && !(t && t.status === 'done' && sameTry));
    const compare = reading.locked && reading.document && figures && id !== reading.docStrategyId
      ? { id: 'compare', slots: { docWords: reading.document.words, docWay: reading.docStrategyId, way: id, words: futuresOutOfTen(figures.share).words } } : null;
    return {
      id, current: id === current, open: isOpen, rank: result ? order.indexOf(id) : null,
      has: !!shownResult, affordable: shownResult ? !!shownResult.affordable : null, bought: isBought(id), family: FAMILY.includes(id),
      lines: shownResult ? cardLines(shownResult, { endAge: reading.endAge, current: id === current }) : [],
      verdict, stale,
      dials, values: c.ok ? c.values : null, ok: c.ok, errors: c.errors, typed: Object.keys(typed).length > 0,
      needsRun, tried: t ? { status: t.status, reason: t.reason || null, runs: t.result && t.result.basis ? t.result.basis.runs : 1, ms: t.ms == null ? null : t.ms } : null,
      table: tableRow(shownResult), compare
    };
  });
  return { found: true, cards, current, open, rankBy, ran: mine && w.ran ? w.ran : null, has: !!result };
}

// ---- the write (2.4) -----------------------------------------------------------------------------------------------------------

/**
 * "Use this way of drawing": the dotted paths the planner's switch changes (PlanCommit.switchPatch on the effective settings,
 * the dials typed on the card as the strategy page's bag, the stash dated `today`, the root block dated `at`), each with the
 * value it had. Nothing for a locked plan, a plan shown as saved, an unknown way, or a dial with a problem.
 * @param {object} plan
 * @param {string} id
 * @param {object} typed   text by dial key, the dials touched on the card
 * @param {{ today: string, at: string|null, defaults?: object }} o   `defaults` the run's defaults for the way (the base the typed text is checked over)
 */
export function wayPatch(plan, id, typed, { today, at = null, defaults = {} } = {}) {
  const now = dateOf(today);
  if (!WAY_IDS.includes(id)) return { ok: false, errors: { way: 'unknown' }, patch: {}, previous: {}, line: null };
  if (isLocked(plan)) return { ok: false, errors: { plan: 'locked' }, patch: {}, previous: {}, line: null };
  const ss = safeSettings(plan, now);
  const base = { ...(defaults || {}), ...stashOf(ss, id), ...(FAMILY.includes(id) ? cutsOfSettings(ss) : {}) };
  const c = checkDials(id, typed || {}, base);
  if (!c.ok) return { ok: false, errors: c.errors, patch: {}, previous: {}, line: null };
  // only the dials touched go into the switch, as the planner's strategy page sends only the dials turned
  const sent = {};
  for (const k of Object.keys(typed || {})) if (dialOf(id, k) && c.values[k] !== undefined) sent[k] = c.values[k];
  const sp = switchPatch(ss, id, stratDialsOf(id, sent), { savedAt: today, at });
  const want = {};
  for (const [k, v] of Object.entries(sp.settings)) want['stressTool.settings.' + k] = v;
  want.strategy = sp.strategy;
  const patch = {}, previous = {};
  for (const path of WAY_WRITES) {
    if (!(path in want)) continue;
    const cur = get(plan, path);
    const val = want[path] === undefined ? null : want[path];
    if (text(cur) === text(val)) continue;
    patch[path] = copy(val);
    previous[path] = copy(cur);
  }
  return { ok: true, errors: {}, patch, previous, line: { id: 'way', slots: { way: id } }, strategyParams: sp.strategyParams };
}
