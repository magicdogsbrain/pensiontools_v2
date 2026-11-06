/**
 * "The mix" (research/v7/way-and-mix.md 3; road-to-7.md step 8b): the sixth editing step of a saved plan in V7 — how the
 * pension is held (a risk level, your own split, the funds to test), the diversifiers sleeve, the bond tent, and "Which mix
 * lasts best?". Pure: a plan already brought up to date in memory, today's date, what was typed in, and what page memory
 * holds of the mix's runs (state.mix: the sleeve's and the tent's try, the eight-cell comparison, the cell picked) and of
 * the plan's own test (state.lasts); out come the boxes with their saved values and problems, the derived lines, the funds
 * as cards with the search and the paste, the example list, the comparison's cells in words, and the exact field paths and
 * values "Save the mix" and "Use this mix" write. Nothing here runs the test (mixRun.js, loaded lazily by the worker),
 * writes, or reads a clock.
 *
 *   savedMix(plan, { today })               the saved facts, from the effective settings (the document's allocation when locked)
 *   boxesOf(plan, { today })                the same as text by path (what the draft starts from)
 *   checkMix(plan, typed, { today })        text as typed → { ok, values, lists, errors, applies, want, funds, paste, saved }
 *   mixPatch(plan, typed, { today })        → { ok, errors, patch, previous }: the dotted paths "Save the mix" changes (3.3)
 *   useMixPatch(plan, cell, { today })      → the same for "Use this mix" on a cell of the comparison (3.2e)
 *   sleeveOtherOf(ss) / tentOtherOf(ss)     the settings with the sleeve, or the tent, the other way (the tries of 3.2b, d)
 *   mixOf(entries, id, { today, typed, M, base })   everything the screen draws
 *   runKeyOf(plan)                          the key the runs are filed under (lasts.js's)
 *
 * Every path written is in schema.js MIX_WRITES (tested); a key is sent only when its value changes, and a key the plan
 * lacks only on a value that differs from what the engines read for the absent key.
 */
import { RISK_PRESETS, DIVERSIFIER_PRESETS, mixFromLevel, levelOfMix, mixCells } from '../../services/GlidepathService.js';
import { mixFromFunds } from '../../services/PortfolioTagger.js';
import { SUB_ASSET_PROFILES, catalogueEntry, subClassOptionsByBucket } from '../../services/SubAssetModel.js';
import { searchFunds } from '../../services/FundCatalogue.js';
import { CATEGORY_CHOICES } from '../../services/HoldingsPaste.js';
import { readPasteText } from './paste.js';
import { modelPortfolio } from '../../services/ModelPortfolios.js';
import { stashStrategy } from '../../services/StrategyState.js';
import { futuresOutOfTen, pctText, CHANCE_BARS, tenthsOutOfTen } from '../../services/OneAnswer.js';
import { get, applyPatch, safeSettings, safeTiming } from './about.js';
import { pounds } from './income.js';
import { isBought } from './pots.js';
import { FAMILY, runKeyOf } from './lasts.js';
import { MIX_FIELDS, MIX_LISTS, MIX_LEVELS, MIX_SPLIT, MIX_WRAPPERS, MIX_WHATS, MIX_WRITES, isCardId } from './schema.js';
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
const up = (s) => String(s || '').toUpperCase().trim();
const TICKER = /^[A-Z0-9.-]{0,12}$/;

/** The sub-class keys a line may be tagged with (SubAssetModel), by bucket. */
export const CATEGORIES = Object.freeze(Object.keys(SUB_ASSET_PROFILES));
export const CATEGORY_GROUPS = subClassOptionsByBucket();
const bucketOf = (key) => (key && SUB_ASSET_PROFILES[key] ? SUB_ASSET_PROFILES[key].bucket : null);

/** What the engines read for a key the plan lacks: a value equal to this is never written onto an absent key. */
const ABSENT_READS = Object.freeze({
  'stressTool.settings.diversifierStart': 0,
  'stressTool.settings.subAsset': null,
  'stressTool.settings.allocMode': 'risk',
  'stressTool.settings.taggedFunds': [],
  'stressTool.settings.isaBalance': 0,
  'stressTool.settings.equityGlideEnabled': false,
  'stressTool.settings.glideEndgame': null
});

/** The four pots as whole percents of their sum that add to 100 (the largest remainders rounded up); balanced for an empty pot. */
export function splitPcts(amounts) {
  const a = [r0(amounts.equity), r0(amounts.bond), r0(amounts.div), r0(amounts.cash)];
  const pot = a.reduce((t, v) => t + v, 0);
  if (!(pot > 0)) return { shares: 50, bonds: 40, diversifiers: 0, cash: 10 };
  const raw = a.map((v) => (v / pot) * 100);
  const whole = raw.map(Math.floor);
  let left = 100 - whole.reduce((t, v) => t + v, 0);
  const order = raw.map((v, i) => [v - whole[i], i]).sort((x, y) => y[0] - x[0] || x[1] - y[1]);
  for (const [, i] of order) { if (left <= 0) break; whole[i] += 1; left -= 1; }
  return { shares: whole[0], bonds: whole[1], diversifiers: whole[2], cash: whole[3] };
}

/** A split's £ amounts from a pot and whole percents: cash takes the rounding remainder (the planner's splitTotal rule). */
export function amountsOfSplit(pot, pcts) {
  const t = r0(pot);
  const equity = Math.round((t * (pcts.shares || 0)) / 100), bond = Math.round((t * (pcts.bonds || 0)) / 100), div = Math.round((t * (pcts.diversifiers || 0)) / 100);
  return { equity, bond, div, cash: t - equity - bond - div };
}

/** The settings with the diversifiers sleeve the other way (3.2b): off → its money back into shares, bonds and cash in their proportions; on → the nearest level's 4-way table. */
export function sleeveOtherOf(ss) {
  const s = ss || {};
  const eq = r0(s.equityMin), bd = r0(s.bondMin), ca = r0(s.cashTarget), dv = r0(s.diversifierStart);
  const pot = eq + bd + ca + dv;
  if (dv > 0) {
    const three = eq + bd + ca;
    const equityMin = three > 0 ? Math.round((eq * pot) / three) : Math.round(pot * 0.5);
    const bondMin = three > 0 ? Math.round((bd * pot) / three) : Math.round(pot * 0.4);
    return { ...s, equityMin, bondMin, cashTarget: pot - equityMin - bondMin, diversifierStart: 0, subAsset: null };
  }
  return { ...s, ...mixFromLevel(pot, levelOfMix(s).key, { diversifiers: true }) };
}
/** The settings with the bond tent the other way (3.2d). */
export const tentOtherOf = (ss) => ({ ...(ss || {}), equityGlideEnabled: !(ss && ss.equityGlideEnabled) });

const rowsOf = (list) => (Array.isArray(list) ? list : []).map((r, i) => ({ ...(isObj(r) ? r : {}), row: i })).filter((r) => r.ticker || r.name || r.subClass || num(r.value) != null);
const wrapperOf = (r) => (up(r.wrapper) === 'ISA' ? 'ISA' : up(r.wrapper) === 'GIA' ? 'GIA' : 'SIPP');
/** The sub-class a line is read with: its own, else the bundled catalogue's for its ticker (the planner's effectiveSubClass). */
export const categoryOf = (r) => (r && r.subClass) || (r && r.ticker && catalogueEntry(r.ticker) ? catalogueEntry(r.ticker).subClass : '') || '';

/**
 * The saved facts (3.2): from the effective settings — or, locked, the plan document's allocation where it has one and the
 * settings the lock froze for the rest.
 */
export function savedMix(plan, { today }) {
  const now = dateOf(today);
  const locked = isLocked(plan);
  const doc = locked && isObj(plan.planDocument) ? plan.planDocument : null;
  const ss = safeSettings(plan, now);
  const stored = (plan && plan.stressTool && isObj(plan.stressTool.settings)) ? plan.stressTool.settings : {};
  const timing = safeTiming(ss, now);
  const strategyId = (doc && doc.strategy && doc.strategy.id) || ss.strategyId || 'pots-and-valves';
  const docAlloc = doc && isObj(doc.pots) && isObj(doc.pots.allocation) ? doc.pots.allocation : null;
  const alloc = docAlloc ? { ...ss, ...docAlloc } : ss;
  const amounts = { equity: r0(alloc.equityMin), bond: r0(alloc.bondMin), cash: r0(alloc.cashTarget), div: r0(alloc.diversifierStart) };
  const pot = amounts.equity + amounts.bond + amounts.cash + amounts.div;
  const m = levelOfMix(alloc);
  const funds = rowsOf(ss.taggedFunds);
  const allocMode = alloc.allocMode || (funds.length ? 'funds' : 'risk');   // the planner's allocModeOf: funds if any are tagged, else risk
  const held = allocMode === 'funds' ? 'funds' : m.custom ? 'split' : 'level';
  const duration = num(ss.duration) || 35;
  const docR = doc && doc.strategy && isObj(doc.strategy.r) && doc.strategy.r.affordable && doc.strategy.r.terminal ? doc.strategy.r : null;
  const source = locked ? { kind: 'locked', at: dayWords(lockedAtOf(plan)) } : { kind: 'saved', at: plan && plan.lastModified ? dayWords(plan.lastModified) : null };
  const values = {
    held, level: m.key, pcts: splitPcts(amounts), sleeve: amounts.div > 0 ? 'yes' : 'no',
    tent: alloc.equityGlideEnabled ? 'yes' : 'no',
    endgame: ss.glideEndgame && MIX_LEVELS.includes(ss.glideEndgame.key) ? ss.glideEndgame.key : 'balanced',
    funds
  };
  return {
    locked, lockedOn: locked ? dayWords(lockedAtOf(plan)) : null, ss, stored, timing, strategyId, bought: isBought(strategyId), family: FAMILY.includes(strategyId), buckets: strategyId === 'buckets-in-order',
    amounts, pot, isa: r0(ss.isaBalance), level: m, duration, tentYears: Math.max(5, duration - 20),
    document: docR ? { badCaseLeft: r0(docR.terminal.p10), typicalLeft: r0(docR.terminal.p50), share: Math.max(0, Math.min(1, (100 - (+docR.ruin.mc || 0)) / 100)), lockedOn: dayWords(doc.lockedAt || lockedAtOf(plan)) } : null,
    source, values, now
  };
}

/**
 * The plan's own figure a bad-case try is set beside when "Does it last?" is not held for it: on a locked plan with a plan
 * document, the document's (3.3: "the document's figure beside"); else null, and the try runs the plan as saved too.
 */
export function mixBaseOf(plan, { today }) {
  const d = savedMix(plan, { today }).document;
  return d ? { share: d.share, chancePct: Math.round(d.share * 1000) / 10, typicalLeft: d.typicalLeft, badCaseLeft: d.badCaseLeft } : null;
}
const isDocumentBase = (saved, base) => !!(saved.document && base && r0(base.badCaseLeft) === saved.document.badCaseLeft && r0(base.typicalLeft) === saved.document.typicalLeft);

/** The boxes' starting text: the saved facts as a person would type them, by path (the funds as cards "0", "1", …). */
export function boxesOf(plan, { today }) {
  const s = savedMix(plan, { today });
  const v = s.values;
  const out = { held: v.held, level: v.level, shares: String(v.pcts.shares), bonds: String(v.pcts.bonds), diversifiers: String(v.pcts.diversifiers), cash: String(v.pcts.cash), sleeve: v.sleeve, tent: v.tent, endgame: v.endgame, search: '', 'paste.text': '', 'paste.wrapper': 'SIPP' };
  out['funds.ids'] = v.funds.map((_, i) => String(i)).join(',');
  v.funds.forEach((r, i) => {
    out[`funds.${i}.ticker`] = up(r.ticker);
    out[`funds.${i}.name`] = typeof r.name === 'string' ? r.name : '';
    out[`funds.${i}.value`] = num(r.value) != null ? String(r0(r.value)) : '';
    out[`funds.${i}.wrapper`] = wrapperOf(r);
    out[`funds.${i}.category`] = categoryOf(r);
  });
  return out;
}

function parseMoney(t, f) {
  if (blank(t)) return { error: f.required ? 'required' : null, value: f.default != null ? f.default : null };
  const s = String(t).replace(/[£,\s]/g, '');
  if (!/^\d{1,9}(\.\d{1,2})?$/.test(s)) return { error: 'notANumber', value: null };
  const n = Math.round(+s);
  if (n < f.min) return { error: 'tooLow', value: n };
  if (n > f.max) return { error: 'tooHigh', value: n };
  return { error: null, value: n };
}
function parsePercent(t, f) {
  if (blank(t)) return { error: f.required ? 'required' : null, value: null };
  const s = String(t).replace(/[%\s]/g, '');
  if (!/^\d{1,3}$/.test(s)) return { error: 'notANumber', value: null };
  const n = +s;
  if (n < f.min) return { error: 'tooLow', value: n };
  if (n > f.max) return { error: 'tooHigh', value: n };
  return { error: null, value: n };
}
function parseField(raw, f) {
  if (f.type === 'money') return parseMoney(raw, f);
  if (f.type === 'percent') return parsePercent(raw, f);
  if (f.type === 'text') { const v = blank(raw) ? '' : String(raw).trim().slice(0, f.max || 80); return { error: null, value: v }; }
  if (blank(raw) && f.required && f.default == null) return { error: 'required', value: null };
  const v = blank(raw) ? f.default : String(raw);
  return f.options.includes(v) ? { error: null, value: v } : { error: 'notAnOption', value: null };
}
const field = (path) => MIX_FIELDS.find((f) => f.path === path);
const ids = (t) => String(t || '').split(',').map((x) => x.trim()).filter((x) => isCardId(x));

/** The funds cards as typed over the saved rows: each card's fields, values, errors, and the row it writes. */
function readCards(saved, boxes, typed) {
  const list = MIX_LISTS.funds;
  const idsTyped = typed && Object.prototype.hasOwnProperty.call(typed, 'funds.ids') ? ids(typed['funds.ids']) : ids(boxes['funds.ids']);
  const cards = idsTyped.map((id) => {
    const savedRow = /^\d+$/.test(id) ? saved.values.funds[+id] || null : null;
    const fields = [], values = {}, errors = {};
    for (const f of list.fields) {
      const path = `funds.${id}.${f.path}`;
      const raw = typed && Object.prototype.hasOwnProperty.call(typed, path) ? typed[path] : boxes[path];
      let r = parseField(raw, f);
      if (f.path === 'ticker' && !r.error) { r.value = up(r.value); if (!TICKER.test(r.value)) r = { error: 'notATicker', value: null }; }
      if (f.path === 'category' && !r.error && r.value && !CATEGORIES.includes(r.value)) r = { error: 'notACategory', value: null };
      if (r.error) errors[f.path] = r.error; else values[f.path] = r.value;
      fields.push({ path, type: f.type, options: f.type === 'choice' ? f.options : null, applies: true, shown: blank(raw) ? (f.type === 'choice' && f.default != null ? f.default : '') : String(raw), saved: savedRow && path in boxes ? boxes[path] : null, error: null });
    }
    // the sub-class the line is read with: its category, else the bundled catalogue's for its ticker
    const category = values.category || (values.ticker && catalogueEntry(values.ticker) ? catalogueEntry(values.ticker).subClass : '') || '';
    if (!values.ticker && !values.category && !errors.ticker) errors.ticker = 'required';
    if (!category && !errors.category && !errors.ticker) errors.category = 'whatIsThis';
    for (const f of fields) f.error = errors[f.path.split('.').pop()] || null;
    const row = Object.keys(errors).length ? null : { ...(savedRow ? Object.fromEntries(Object.entries(savedRow).filter(([k]) => k !== 'row')) : {}), ticker: values.ticker || '', value: values.value, wrapper: values.wrapper, ...(values.name ? { name: values.name } : {}), ...(category ? { subClass: category } : {}) };
    return { id, saved: savedRow, fields, values, errors, category, bucket: bucketOf(category), recognised: !!(values.ticker && catalogueEntry(values.ticker)), row };
  });
  return { ids: idsTyped, cards };
}

/**
 * Text as typed → the checked values, the errors by path, which boxes apply, and the settings the save would write (`want`,
 * the planner's flat keys). `typed` holds text (or a choice) by path; a path not typed takes the saved value (boxesOf).
 */
export function checkMix(plan, typed, { today }) {
  const saved = savedMix(plan, { today });
  const boxes = { ...boxesOf(plan, { today }), ...(typed || {}) };
  const values = {}, errors = {}, applies = {};
  const take = (path) => { const f = field(path); const r = parseField(boxes[path], f); if (r.error) errors[path] = r.error; else values[path] = r.value; return r; };
  for (const f of MIX_FIELDS) applies[f.path] = true;
  take('held');
  const held = values.held || saved.values.held;
  applies.level = held === 'level';
  for (const p of MIX_SPLIT) applies[p] = held === 'split';
  if (held === 'level') take('level');
  if (held === 'split') {
    for (const p of MIX_SPLIT) take(p);
    const sum = MIX_SPLIT.reduce((t, p) => t + (values[p] || 0), 0);
    if (MIX_SPLIT.every((p) => values[p] != null) && sum !== 100) { errors.cash = 'notHundred'; delete values.cash; }
  }
  applies.sleeve = held === 'level';
  if (applies.sleeve) take('sleeve');
  take('tent');
  const tentOn = (values.tent || saved.values.tent) === 'yes';
  applies.endgame = tentOn && held === 'funds';
  if (applies.endgame) take('endgame');
  // the funds as cards (kept as they are while a level or a split is chosen; checked line by line when they are the mix)
  const lists = { funds: readCards(saved, boxes, typed) };
  const rows = lists.funds.cards.map((c) => c.row).filter(Boolean);
  const funds = mixFromFunds(rows);
  if (held === 'funds') {
    for (const c of lists.funds.cards) for (const [k, e] of Object.entries(c.errors)) errors[`funds.${c.id}.${k}`] = e;
    if (!funds) errors['funds.ids'] = 'noFunds';
  }
  // the settings the save writes (3.2a–d). A split or a list left exactly as saved keeps the saved amounts byte for byte (the
  // boxes show whole percents; the pots step keeps the saved proportions the same way), so a plan saved as it is writes nothing.
  const S = {};
  const sleeveOn = held === 'level' ? (values.sleeve || saved.values.sleeve) === 'yes' : held === 'split' ? (values.diversifiers || 0) > 0 : !!(funds && funds.diversifiers);
  const sv = saved.values;
  const asSaved = { equityMin: saved.amounts.equity, bondMin: saved.amounts.bond, cashTarget: saved.amounts.cash, diversifierStart: saved.amounts.div, subAsset: saved.ss.subAsset === undefined ? null : saved.ss.subAsset };
  const rowsSame = lists.funds.cards.length === sv.funds.length && lists.funds.cards.every((card, i) => card.saved && card.saved === sv.funds[i] && card.row && JSON.stringify(card.row) === JSON.stringify(Object.fromEntries(Object.entries(sv.funds[i]).filter(([k]) => k !== 'row'))));
  if (held === 'level' && values.level) {
    if (sv.held === 'level' && values.level === sv.level && sleeveOn === (sv.sleeve === 'yes')) Object.assign(S, asSaved, { allocMode: 'risk' });
    else Object.assign(S, { diversifierStart: 0, subAsset: null }, mixFromLevel(saved.pot, values.level, { diversifiers: sleeveOn }), { allocMode: 'risk' });
  } else if (held === 'split' && MIX_SPLIT.every((p) => values[p] != null)) {
    if (sv.held === 'split' && MIX_SPLIT.every((p) => values[p] === sv.pcts[p])) Object.assign(S, asSaved, { allocMode: 'risk' });
    else { const a = amountsOfSplit(saved.pot, { shares: values.shares, bonds: values.bonds, diversifiers: values.diversifiers, cash: values.cash }); Object.assign(S, { equityMin: a.equity, bondMin: a.bond, cashTarget: a.cash, diversifierStart: a.div, subAsset: a.div > 0 ? {} : null, allocMode: 'risk' }); }
  } else if (held === 'funds' && funds) {
    if (sv.held === 'funds' && rowsSame) Object.assign(S, asSaved, { allocMode: 'funds', isaBalance: saved.isa });
    else Object.assign(S, { equityMin: funds.custom.equityMin, bondMin: funds.custom.bondMin, cashTarget: funds.custom.cashTarget, diversifierStart: funds.custom.diversifierStart, subAsset: funds.custom.subAsset, allocMode: 'funds', isaBalance: funds.isaBalance });
  }
  if (!rowsSame && lists.funds.cards.every((card) => !!card.row)) S.taggedFunds = rows;
  S.equityGlideEnabled = tentOn;
  if (applies.endgame && values.endgame) { const table = sleeveOn ? DIVERSIFIER_PRESETS : RISK_PRESETS; const preset = table[values.endgame]; S.glideEndgame = { equityPct: preset.equity, bondPct: preset.bond, key: preset.key, label: preset.label }; }
  // the paste (3.2c): parsed, matched, each unrecognised line answered under "What is this?", the summary, and the cards it would make
  const paste = readPaste(boxes, typed, lists.funds, saved);
  return { ok: Object.keys(errors).length === 0, values, lists, errors, applies, held, sleeveOn, tentOn, want: S, funds, paste, saved };
}

/**
 * The paste's reading (shared with "What you hold" through paste.js readPasteText): every line read, the ones recognised,
 * "What is this?" for the rest, what was left out and why, and the edits that add them to the funds cards.
 */
function readPaste(boxes, typed, fundsList, saved) {
  const textTyped = boxes['paste.text'];
  const wrapper = MIX_WRAPPERS.includes(boxes['paste.wrapper']) ? boxes['paste.wrapper'] : 'SIPP';
  if (blank(textTyped)) return { text: '', wrapper, rows: [], summary: null, leftOut: [], warnings: [], canAdd: false, edits: [] };
  const answers = {};
  for (const [k, v] of Object.entries(boxes)) { const m = /^paste\.(\d+)\.what$/.exec(k); if (m && MIX_WHATS.includes(v)) answers[+m[1]] = v; }
  // the cards after the merge (HoldingsPaste.mergeLedger, the planner's own): a pasted line updates a line it matches, else is added
  const current = fundsList.cards.map((c) => c.row || { ticker: c.values.ticker || '', value: c.values.value || 0, wrapper: c.values.wrapper || 'SIPP', ...(c.values.name ? { name: c.values.name } : {}), ...(c.category ? { subClass: c.category } : {}) });
  const read = readPasteText(textTyped, { wrapper, answers, current });
  const { rows, matched, merged } = read;
  const edits = [];
  if (merged) {
    const used = fundsList.ids.filter((x) => /^n\d+$/.test(x)).map((x) => +x.slice(1));
    let n = used.length ? Math.max(...used) : 0;
    const newIds = [];
    merged.ledger.forEach((line, i) => {
      const id = i < fundsList.cards.length ? fundsList.cards[i].id : 'n' + (++n);
      newIds.push(id);
      const before = i < fundsList.cards.length ? current[i] : null;
      if (before && JSON.stringify(before) === JSON.stringify(line)) return;
      edits.push({ path: `funds.${id}.ticker`, value: up(line.ticker) }, { path: `funds.${id}.name`, value: line.name || '' }, { path: `funds.${id}.value`, value: num(line.value) != null ? String(r0(line.value)) : '' }, { path: `funds.${id}.wrapper`, value: MIX_WRAPPERS.includes(up(line.wrapper)) ? up(line.wrapper) : 'SIPP' }, { path: `funds.${id}.category`, value: line.subClass && CATEGORIES.includes(line.subClass) ? line.subClass : '' });
    });
    edits.unshift({ path: 'funds.ids', value: newIds.join(',') });
    edits.push({ path: 'paste.text', value: '' });
    for (const r of rows) edits.push({ path: `paste.${r.line}.what`, value: '' });
  }
  void typed; void saved;
  return { text: textTyped, wrapper, rows, counts: read.counts, leftOut: read.leftOut, warnings: read.warnings, canAdd: !!merged && matched.length > 0, edits };
}

/**
 * The write (3.3): every declared path whose value would change, with the new value and the one it had. Nothing for a
 * locked plan or typed text with a problem. The active way's stash goes with the write as the planner's switch stashes it
 * (StrategyState.stashStrategy on the settings as they will be), only when something else changes.
 */
export function mixPatch(plan, typed, { today }) {
  const c = checkMix(plan, typed, { today });
  if (!c.ok) return { ok: false, errors: c.errors, patch: {}, previous: {} };
  if (c.saved.locked) return { ok: false, errors: { plan: 'locked' }, patch: {}, previous: {} };
  return diffWant(plan, c.saved, c.want, { today });
}

/** "Use this mix" (3.2e): the amounts a cell of the comparison ran with (GlidepathService.mixCells), `allocMode: 'risk'` and the tent. */
export function useMixPatch(plan, cell, { today }) {
  const saved = savedMix(plan, { today });
  if (saved.locked) return { ok: false, errors: { plan: 'locked' }, patch: {}, previous: {} };
  const found = cellOf(saved.ss, cell);
  if (!found) return { ok: false, errors: { cell: 'unknown' }, patch: {}, previous: {} };
  const s = found.settings;
  return diffWant(plan, saved, { equityMin: s.equityMin, bondMin: s.bondMin, cashTarget: s.cashTarget, allocMode: 'risk', equityGlideEnabled: s.equityGlideEnabled }, { today });
}

/** One cell of the comparison on these settings, or null. */
export function cellOf(ss, cell) {
  if (!cell || typeof cell !== 'object') return null;
  return mixCells(ss, { own: true }).find((x) => x.key === cell.key && x.tent === !!cell.tent) || null;
}

function diffWant(plan, saved, S, { today }) {
  const want = {};
  for (const [k, v] of Object.entries(S)) want['stressTool.settings.' + k] = v;
  const patch = {}, previous = {};
  for (const path of MIX_WRITES) {
    if (!(path in want)) continue;
    const cur = get(plan, path);
    const val = want[path] === undefined ? null : want[path];
    if (text(cur) === text(val)) continue;
    if (cur === undefined && path in ABSENT_READS && text(ABSENT_READS[path]) === text(val)) continue;
    patch[path] = copy(val);
    previous[path] = copy(cur);
  }
  if (Object.keys(patch).length) {
    // the active way's stash, as the planner's switch stashes it: the mode and the list as they will be, dated today
    const next = { ...saved.ss, ...S };
    const st = stashStrategy(next, saved.strategyId, { savedAt: today }).strategyState;
    const cur = get(plan, 'stressTool.settings.strategyState');
    if (text(cur) !== text(st)) { patch['stressTool.settings.strategyState'] = copy(st); previous['stressTool.settings.strategyState'] = copy(cur); }
  }
  return { ok: true, errors: {}, patch, previous };
}

// ---- the reading ---------------------------------------------------------------------------------------------------------------

const levelLabel = (key) => (RISK_PRESETS[key] ? RISK_PRESETS[key].key : key);
const amountsOfLevel = (pot, key, sleeve) => { const a = mixFromLevel(pot, key, { diversifiers: sleeve }); return { shares: a.equityMin, bonds: a.bondMin, diversifiers: a.diversifierStart || 0, cash: a.cashTarget }; };

/** The derived lines (3.2) from the settings as they would be saved (or as saved). */
export function derivedLines(S, saved, held) {
  const lines = [];
  const eq = r0(S.equityMin ?? saved.amounts.equity), bd = r0(S.bondMin ?? saved.amounts.bond), ca = r0(S.cashTarget ?? saved.amounts.cash), dv = r0(S.diversifierStart ?? saved.amounts.div);
  const pot = eq + bd + ca + dv;
  if (held === 'funds') lines.push({ id: 'held.funds', slots: { pot: pounds(pot), isa: pounds(S.isaBalance ?? saved.isa) } });
  else if (held === 'split') lines.push({ id: 'held.split', slots: { pot: pounds(pot) } });
  else lines.push({ id: 'held.level', slots: { level: levelLabel(levelOfMix({ equityMin: eq, bondMin: bd, cashTarget: ca, diversifierStart: dv }).key), pot: pounds(pot) } });
  lines.push({ id: 'amounts', slots: { shares: pounds(eq), bonds: pounds(bd), cash: pounds(ca), div: dv > 0 ? ', ' + pounds(dv) + ' in gold and trend funds' : '' } });
  lines.push(dv > 0 ? { id: 'sleeve.on', slots: { amount: pounds(dv) } } : { id: 'sleeve.off', slots: {} });
  if (saved.buckets) lines.push({ id: 'tent.buckets', slots: {} });
  else if (S.equityGlideEnabled ?? saved.values.tent === 'yes') lines.push({ id: 'tent.on', slots: { years: String(saved.tentYears) } });
  else lines.push({ id: 'tent.off', slots: {} });
  return lines;
}

const chance = (a) => pctText(a.chancePct, 1, CHANCE_BARS).replace(/%$/, '');

/** One try (the sleeve's or the tent's) in words: the line of 3.2b/d with the plan's own figure beside the tried one. */
function tryView(kind, t, base, saved) {
  if (!t) return { status: 'off', lines: [], runs: 0, ms: null, reason: null };
  if (t.status !== 'done' || !t.result) return { status: t.status, lines: [], runs: 0, ms: null, reason: t.reason || null };
  const r = t.result;
  const own = r.base || base || (saved.document ? { badCaseLeft: saved.document.badCaseLeft, typicalLeft: saved.document.typicalLeft } : null);
  const lines = [];
  if (!r.affordable || !r.a) lines.push({ id: 'unaffordable', slots: {} });
  else if (!own) lines.push({ id: kind + '.alone', slots: { on: r.on ? 'on' : 'off', bad: pounds(r.a.badCaseLeft), words: futuresOutOfTen(r.a.share).words } });
  else lines.push({ id: kind + (r.on ? '.withTried' : '.withOwn'), slots: { withBad: pounds(r.on ? r.a.badCaseLeft : own.badCaseLeft), withoutBad: pounds(r.on ? own.badCaseLeft : r.a.badCaseLeft), triedWords: futuresOutOfTen(r.a.share).words, ownWords: own.share != null ? futuresOutOfTen(own.share).words : '' } });
  if (isDocumentBase(saved, own)) lines.push({ id: 'document', slots: { date: saved.document.lockedOn } });
  return { status: 'done', lines, runs: r.basis && r.basis.runs ? r.basis.runs : 1, ms: t.ms == null ? null : t.ms, reason: null };
}

/** The comparison (3.2e) in words: each cell as the planner's grid says it, the best marked. */
function compareView(cmp, saved) {
  const base = { status: cmp ? cmp.status : 'idle', cells: [], best: null, ms: cmp && cmp.ms != null ? cmp.ms : null, runs: 8, progress: cmp ? cmp.progress || null : null, reason: cmp ? cmp.reason || null : null };
  if (!cmp || cmp.status !== 'done' || !cmp.result || !Array.isArray(cmp.result.cells)) return base;
  let best = null;
  for (const c of cmp.result.cells) if (c.affordable && (best == null || c.share > best.share)) best = c;
  const cells = cmp.result.cells.map((c) => ({
    key: c.key, tent: !!c.tent, affordable: !!c.affordable,
    words: c.affordable ? tenthsOutOfTen(c.share) : null, pct: c.affordable ? pctText(c.share * 100, 0, CHANCE_BARS).replace(/%$/, '') : null,
    typical: c.affordable ? pounds(c.typicalLeft) : null, bad: c.affordable ? pounds(c.badCaseLeft) : null,
    amounts: { shares: pounds(c.amounts.equity), bonds: pounds(c.amounts.bond), cash: pounds(c.amounts.cash), div: c.amounts.div > 0 ? pounds(c.amounts.div) : null },
    best: !!best && best.key === c.key && !!best.tent === !!c.tent,
    own: c.key === 'own', current: c.key === 'own' && !!c.tent === (saved.values.tent === 'yes')
  }));
  return { ...base, cells, best: best ? { key: best.key, tent: !!best.tent, words: futuresOutOfTen(best.share).words, pct: pctText(best.share * 100, 0, CHANCE_BARS).replace(/%$/, '') } : null };
}

/**
 * Everything the screen draws (3.2, 3.3). `typed` is the draft's values for this plan (text by path), or null; `M` is
 * state.mix (the tries, the comparison, the cell picked) and `base` the plan's own test figures (state.lasts, when held for
 * this plan) — both matched by `runKey` here, never trusted blind.
 */
export function mixOf(entries, id, { today, typed = null, M = null, base = null } = {}) {
  const list = (entries || []).filter((e) => e && e.plan && typeof e.plan === 'object' && e.plan.id != null);
  const entry = list.find((e) => String(e.plan.id) === String(id)) || null;
  if (!entry) return { found: false, id: String(id || '') };
  const plan = entry.plan;
  const readonly = !!(entry.newer || entry.failed);
  const saved = savedMix(plan, { today });
  const editable = !saved.locked && !readonly;
  const runKey = readonly ? null : runKeyOf(plan);
  const boxes = boxesOf(plan, { today });
  const c = checkMix(plan, typed || {}, { today });
  const shown = { ...boxes, ...(typed || {}) };
  const fields = MIX_FIELDS.map((f) => ({
    path: f.path, type: f.type, options: f.type === 'choice' ? f.options : null, applies: c.applies[f.path] !== false,
    shown: blank(shown[f.path]) ? (f.type === 'choice' && f.default != null ? f.default : '') : String(shown[f.path]),
    saved: f.path in boxes ? boxes[f.path] : null, error: c.errors[f.path] || null
  }));
  const held = c.held;
  const S = c.ok ? c.want : {};
  const derived = derivedLines(S, saved, held);
  const mine = M && runKey && M.key === runKey ? M : null;
  const baseMine = base && base.a ? { badCaseLeft: r0(base.a.badCaseLeft), typicalLeft: r0(base.a.typicalLeft), share: base.a.share } : null;
  const sleeve = { on: c.sleeveOn, amount: pounds(S.diversifierStart ?? saved.amounts.div), applies: held !== 'funds', try: tryView('sleeve', mine && mine.tries ? mine.tries.sleeve : null, baseMine, saved) };
  const tent = { on: c.tentOn, years: String(saved.tentYears), endgameApplies: c.applies.endgame, ignored: saved.buckets, try: tryView('tent', mine && mine.tries ? mine.tries.tent : null, baseMine, saved) };
  const search = { text: typeof shown.search === 'string' ? shown.search : '', matches: typeof shown.search === 'string' && shown.search.trim() ? searchFunds(shown.search, 8).map((f) => ({ ticker: f.ticker, name: f.name, category: f.subClass })) : [] };
  // the example list (ModelPortfolios): a fund's name spelt with a pound sign ("iShares £ Corporate Bond") is said as "sterling", so no pound sign stands without a figure
  const example = modelPortfolio(c.values.level || saved.values.level, { diversifiers: c.sleeveOn });
  example.rows = example.rows.map((r) => ({ ...r, name: String(r.name).replace(/£/g, 'sterling') }));
  const funds = c.funds;
  const summary = funds ? { pot: pounds(funds.pot), isa: pounds(funds.isaBalance), buckets: { shares: pounds(funds.tagged.buckets.shares), bonds: pounds(funds.tagged.buckets.bonds), diversifiers: pounds(funds.tagged.buckets.diversifiers), cash: pounds(funds.tagged.buckets.cash) }, untagged: funds.tagged.untagged.map((u) => u.ticker || u.name || '') } : null;
  const cmp = compareView(mine ? mine.compare : null, saved);
  const pick = mine && mine.pick ? cellOf(saved.ss, mine.pick) : null;
  const pickWords = pick ? { key: pick.key, tent: pick.tent, level: pick.key === 'own' ? null : levelLabel(pick.key), shares: pounds(pick.settings.equityMin), bonds: pounds(pick.settings.bondMin), cash: pounds(pick.settings.cashTarget), hasFunds: saved.values.funds.length > 0 } : null;
  const p = editable && c.ok ? mixPatch(plan, typed || {}, { today }) : { ok: false, patch: {}, previous: {} };
  const partners = [];
  return {
    found: true, id: String(plan.id), name: nameOf(plan), locked: saved.locked, lockedOn: saved.lockedOn, readonly, editable,
    source: saved.source, strategyId: saved.strategyId, bought: saved.bought, family: saved.family, buckets: saved.buckets, runKey,
    pot: pounds(saved.pot), isa: pounds(saved.isa), held,
    levels: MIX_LEVELS.map((key) => ({ key, amounts: Object.fromEntries(Object.entries(amountsOfLevel(saved.pot, key, c.sleeveOn)).map(([k, v]) => [k, pounds(v)])), current: held === 'level' && (c.values.level || saved.values.level) === key })),
    split: held === 'split' && c.ok ? (() => { const a = amountsOfSplit(saved.pot, { shares: c.values.shares, bonds: c.values.bonds, diversifiers: c.values.diversifiers, cash: c.values.cash }); return { shares: pounds(a.equity), bonds: pounds(a.bond), diversifiers: pounds(a.div), cash: pounds(a.cash) }; })() : null,
    fields, lists: { funds: { ids: c.lists.funds.ids, cards: c.lists.funds.cards.map((card) => ({ id: card.id, saved: !!card.saved, fields: card.fields, bucket: card.bucket, recognised: card.recognised, category: card.category })) } },
    categories: CATEGORY_GROUPS, errors: c.errors, ok: c.ok, derived, sleeve, tent, search, example: { rows: example.rows, level: c.values.level || saved.values.level },
    summary, paste: c.paste, compare: cmp, pick: pickWords,
    document: saved.document ? { badCaseLeft: pounds(saved.document.badCaseLeft), words: futuresOutOfTen(saved.document.share).words, lockedOn: saved.document.lockedOn } : null,
    documentBase: mixBaseOf(plan, { today }),
    base: baseMine ? { badCaseLeft: pounds(baseMine.badCaseLeft), words: futuresOutOfTen(baseMine.share).words, chance: chance({ chancePct: baseMine.share * 100 }) } : null,
    partners,
    changed: Object.keys(p.patch).length > 0, patch: p.patch, previous: p.previous,
    savedLine: c.ok ? { id: 'mix', slots: { held: held, shares: pounds(S.equityMin ?? saved.amounts.equity), bonds: pounds(S.bondMin ?? saved.amounts.bond), cash: pounds(S.cashTarget ?? saved.amounts.cash) } } : null,
    whats: CATEGORY_CHOICES.map((x) => x.key)
  };
}
