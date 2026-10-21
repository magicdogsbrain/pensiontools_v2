/**
 * "What you hold" (research/v7/holdings-and-move.md §1, §2; road-to-7.md step 10): the ONE record of what the person
 * actually holds — scenario.holdings, line by line by type of account — read for the screen and changed one write at a
 * time. The funds a plan is tested on are never what the person holds (the owner's ruling, 16 Sep 2026): nothing here reads
 * stressTool.settings.taggedFunds, and nothing is copied either way. Pure: the plans already brought up to date in memory,
 * today's date and what was typed in; out come the lines grouped by account, the headline, the mix as held and where new
 * money goes, the add box with its matches, the paste read line by line, the lock's snapshot line, and the exact patch
 * each change carries. Nothing here writes, runs anything, or reads a clock.
 *
 *   savedHold(plan, { today })               the record normalised, its summary and proportions, the lock snapshot, the stage
 *   boxesOf(plan)                            the boxes' starting text (empty)
 *   checkHold(plan, typed, { today })        text as typed → the add box checked, the lines' boxes, the paste read, the remove asked
 *   holdOf(entries, id, { today, typed })    everything the screen draws
 *   holdPatch(plan, change, { today })       → { ok, patch: { holdings }, previous, line, record }: ONE change of the record
 *     change = { kind: 'add', line } | { kind: 'edit', index, field, value } | { kind: 'remove', index }
 *            | { kind: 'paste', text, wrapper, answers }
 *   holdRecordOf(plan)                       the record as the planner reads it (HoldingsRecord.normaliseHoldings)
 *
 * Every path written is in schema.js HOLD_WRITES (tested); the record after a change is HoldingsRecord.holdingsWith's and
 * HoldingsPaste.applyPaste's — the same functions the planner's handlers call.
 */
import { normaliseHoldings, holdingsSummary, holdingsWith, normaliseLine, numOrNull, WRAPPERS, LINE_FIELDS, LINE_NUMBER_FIELDS } from '../../services/HoldingsRecord.js';
import { applyPaste, needsCategory, CATEGORY_CHOICES, isGiltCode, parsePaste, giltFromName } from '../../services/HoldingsPaste.js';
import { proportions } from '../../services/Holdings.js';
import { SUB_ASSET_PROFILES, FUND_TAG_MAP, catalogueEntry } from '../../services/SubAssetModel.js';
import { searchFunds } from '../../services/FundCatalogue.js';
import { planStage } from '../../services/PlanReading.js';
import { readPasteText, PASTE_WHATS } from './paste.js';
import { pounds } from './income.js';
import { HOLD_FIELDS, HOLD_WRITES, HOLD_WRAPPERS, HOLD_WHATS } from './schema.js';
import { SAVER_STAGES } from './steps.js';
import { dateOf, dayWords } from './dates.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const blank = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
const up = (s) => String(s || '').toUpperCase().trim();
const copy = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const r0 = (v) => Math.round(+v || 0);
const isLocked = (plan) => !!(plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked);
const lockedAtOf = (plan) => (plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.lockedAt) || (plan && plan.planDocument && plan.planDocument.lockedAt) || null;
const nameOf = (plan) => (plan && plan.planDetails && typeof plan.planDetails.name === 'string' && plan.planDetails.name) || (plan && typeof plan.name === 'string' && plan.name) || '';
const safeStage = (plan, now) => { try { return planStage(plan, { now }); } catch { return { key: 'unknown' }; } };
/** The plan document's order sheet, for matching a gilt typed or pasted by its code, SEDOL or year (matchRows). */
const ordersOf = (plan) => { const o = plan && plan.planDocument && plan.planDocument.strategy && plan.planDocument.strategy.r && plan.planDocument.strategy.r.plan && plan.planDocument.strategy.r.plan.orders; return Array.isArray(o) ? o : []; };
const BUCKET_WORDS = { shares: 'shares', bonds: 'bonds', cash: 'cash', diversifiers: 'diversifiers' };

/** The record as the planner reads it: normalised, every field present, null not undefined. */
export const holdRecordOf = (plan) => normaliseHoldings(plan && plan.holdings);

/** What a line is counted as (TransitionView.whatItIsHtml, as data): a bucket, a gilt, bank cash, cash, a fund, or 'ask' for a line the page cannot place. */
export function countedAs(line) {
  const L = line || {};
  if (needsCategory(L)) return { kind: 'ask', bucket: null };
  if (up(L.wrapper) === 'CASH') return { kind: 'bankCash', bucket: 'cash' };
  if (L.kind === 'gilt' || (!L.subClass && isGiltCode(L.ticker))) return { kind: 'gilt', bucket: 'bonds', code: up(L.ticker) || null };
  if (L.kind === 'cash' && !L.subClass) return { kind: 'cash', bucket: 'cash' };
  const key = L.subClass || FUND_TAG_MAP[up(L.ticker)];
  const prof = key ? SUB_ASSET_PROFILES[key] : null;
  return prof ? { kind: 'bucket', bucket: prof.bucket, subClass: key, label: prof.label } : { kind: 'fund', bucket: null };
}

/** The lines grouped by type of account, in the order Pension, ISA, Other account, Cash, each with its index in the record. */
export function linesByWrapper(rec) {
  const lines = (rec && Array.isArray(rec.lines) ? rec.lines : []).map((l, index) => ({ ...l, index, counted: countedAs(l) }));
  return WRAPPERS.map((wrapper) => ({ wrapper, lines: lines.filter((l) => up(l.wrapper) === wrapper) })).filter((g) => g.lines.length);
}

/** The saved facts: the record, its totals by account, the mix as held, where new money goes, the lock's snapshot, the stage. */
export function savedHold(plan, { today }) {
  const now = dateOf(today);
  const rec = holdRecordOf(plan);
  const sum = holdingsSummary(rec);
  const p = proportions(rec);
  const stage = safeStage(plan, now);
  const snap = isLocked(plan) && plan.planDocument && isObj(plan.planDocument.holdingsAtLock) ? plan.planDocument.holdingsAtLock : null;
  const atLock = snap ? { summary: holdingsSummary(normaliseHoldings({ lines: snap.lines })), updatedAt: snap.updatedAt || null, lockedOn: dayWords(lockedAtOf(plan)) } : null;
  return {
    locked: isLocked(plan), lockedOn: isLocked(plan) ? dayWords(lockedAtOf(plan)) : null, name: nameOf(plan),
    record: rec, summary: sum, groups: linesByWrapper(rec), proportions: p, atLock,
    stage, saver: SAVER_STAGES.includes(stage.key), orders: ordersOf(plan), now
  };
}

/** The boxes' starting text: nothing typed. */
export function boxesOf() {
  const out = {};
  for (const f of HOLD_FIELDS) out[f.path] = f.type === 'choice' ? f.default : '';
  return out;
}

function parseMoney(t, f) {
  if (blank(t)) return { error: f.required ? 'required' : null, value: null };
  const s = String(t).replace(/[£,\s]/g, '');
  if (!/^\d{1,9}(\.\d{1,2})?$/.test(s)) return { error: 'notANumber', value: null };
  const n = Math.round(+s * 100) / 100;
  if (n < f.min) return { error: 'tooLow', value: n };
  if (n > f.max) return { error: 'tooHigh', value: n };
  return { error: null, value: n };
}
function parseCount(t, f) {
  if (blank(t)) return { error: f.required ? 'required' : null, value: null };
  const s = String(t).replace(/[,\s]/g, '');
  if (!/^\d{1,9}(\.\d{1,4})?$/.test(s)) return { error: 'notANumber', value: null };
  const n = +s;
  if (n < f.min) return { error: 'tooLow', value: n };
  if (n > f.max) return { error: 'tooHigh', value: n };
  return { error: null, value: n };
}
function parsePercent(t) {
  if (blank(t)) return { error: null, value: null };
  const s = String(t).replace(/[%\s]/g, '');
  if (!/^\d{1,2}(\.\d{1,3})?$/.test(s)) return { error: 'notANumber', value: null };
  return { error: null, value: +s };
}
function parseField(raw, f) {
  if (f.type === 'money') return parseMoney(raw, f);
  if (f.type === 'count') return parseCount(raw, f);
  if (f.type === 'text') return { error: null, value: blank(raw) ? '' : String(raw).trim().slice(0, f.max || 80) };
  const v = blank(raw) ? f.default : String(raw);
  return f.options.includes(v) ? { error: null, value: v } : { error: 'notAnOption', value: null };
}

/** The lines the add box would make of what is typed: gilts on the order sheet first, a gilt by its code, funds from the bundled list, cash. */
export function addMatches(text, { wrapper = 'SIPP', orders = [], value = null, units = null } = {}) {
  const t = String(text || '').trim();
  if (!t) return { matches: [], asTyped: null };
  const T = up(t);
  const base = { wrapper, sedol: null, units: units == null ? null : units, value: value == null ? null : value, ocf: null, contribution: null, subClass: null, kind: null, asOf: null };
  const out = [];
  const g = giltFromName(T);
  for (const o of orders) {
    const hit = (o.tidm && up(o.tidm) === T) || (o.sedol && up(o.sedol) === T) || (/^(20)?\d{2}$/.test(T) && String(o.matures || '').slice(0, 4).endsWith(T.slice(-2)) && T.length >= 2 && (T.length === 4 ? String(o.matures || '').slice(0, 4) === T : true)) || (g && g.year && String(o.matures || '').slice(0, 4) === String(g.year));
    if (hit) out.push({ id: 'gilt:' + up(o.tidm || o.sedol), kind: 'gilt', ticker: up(o.tidm), name: String(o.name || ''), line: { ...base, ticker: up(o.tidm) || null, name: String(o.name || ''), sedol: o.sedol || null, kind: 'gilt', subClass: 'indexLinked' } });
  }
  if (!out.length && isGiltCode(T)) out.push({ id: 'gilt:' + T, kind: 'gilt', ticker: T, name: '', line: { ...base, ticker: T, name: 'Gilt ' + T, kind: 'gilt' } });
  if (/^CASH$/i.test(t) || wrapper === 'CASH') out.push({ id: 'cash', kind: 'cash', ticker: '', name: 'Cash', line: { ...base, ticker: null, name: /^CASH$/i.test(t) ? 'Cash' : t, kind: 'cash' } });
  if (!/^CASH$/i.test(t)) for (const f of searchFunds(t, 6)) if (!out.some((m) => m.ticker === up(f.ticker))) out.push({ id: 'fund:' + up(f.ticker), kind: 'fund', ticker: up(f.ticker), name: f.name, line: { ...base, ticker: up(f.ticker), name: f.name, kind: 'fund', ocf: Number.isFinite(+f.ocf) ? +f.ocf : null } });
  const asTyped = out.some((m) => m.ticker === T) ? null : { id: 'typed', kind: 'typed', ticker: /^[A-Z][A-Z0-9.-]{1,9}$/.test(T) ? T : '', name: t, line: { ...base, ticker: /^[A-Z][A-Z0-9.-]{1,9}$/.test(T) ? T : null, name: t } };
  return { matches: out, asTyped };
}

/** The index in the record of a line mergeLedger reports as not seen (a copy): the first line of that account with the same identity. */
function indexOfUnseen(rec, u) {
  return rec.lines.findIndex((l) => up(l.wrapper) === up(u.wrapper) && up(l.ticker) === up(u.ticker) && String(l.name || '') === String(u.name || '') && (u.sedol ? up(l.sedol) === up(u.sedol) : true));
}

/** Text as typed → the add box checked, every line's boxes as shown, the paste read, the remove asked. */
export function checkHold(plan, typed, { today }) {
  const s = savedHold(plan, { today });
  const boxes = boxesOf(plan);
  const t = typed || {};
  const shown = { ...boxes, ...t };
  const values = {}, errors = {};
  for (const f of HOLD_FIELDS) {
    const p = parseField(shown[f.path], f);
    if (p.error) errors[f.path] = p.error; else values[f.path] = p.value;
  }
  // the add box: what the text would add
  const add = addMatches(values['add.text'], { wrapper: values['add.wrapper'] || 'SIPP', orders: s.orders, value: values['add.value'] == null ? null : values['add.value'], units: values['add.units'] == null ? null : values['add.units'] });
  const addOk = !errors['add.value'] && !errors['add.units'] && !errors['add.wrapper'];
  // every line's boxes: a number typed over the saved value, checked
  const lines = s.record.lines.map((l, index) => {
    const fields = {};
    for (const field of ['units', 'value', 'contribution', 'ocf']) {
      const path = `line.${index}.${field}`;
      const raw = Object.prototype.hasOwnProperty.call(t, path) ? t[path] : null;
      const saved = l[field] == null ? '' : String(l[field]);
      const p = raw == null ? { error: null, value: l[field] } : field === 'ocf' ? parsePercent(raw) : field === 'units' ? parseCount(raw, { min: 0, max: 100000000, required: false }) : parseMoney(raw, { min: 0, max: 50000000, required: false });
      if (p.error) errors[path] = p.error;
      const changed = raw != null && !p.error && String(p.value == null ? '' : p.value) !== saved;
      fields[field] = { path, shown: raw == null ? saved : String(raw), saved, error: p.error || null, changed, change: changed ? { kind: 'edit', index, field, value: p.value == null ? '' : p.value } : null };
    }
    const sc = t[`line.${index}.subClass`];
    const whatChoice = HOLD_WHATS.includes(sc) ? CATEGORY_CHOICES.find((c) => c.key === sc) : null;
    fields.subClass = { path: `line.${index}.subClass`, shown: HOLD_WHATS.includes(sc) ? sc : '', change: whatChoice ? { kind: 'edit', index, field: 'subClass', value: whatChoice.subClass || '' } : null };
    return { index, fields };
  });
  // the paste: read against the record's lines (the merge is the planner's)
  const pasteWrapper = HOLD_WRAPPERS.includes(values['paste.wrapper']) ? values['paste.wrapper'] : 'SIPP';
  const answers = {};
  for (const [k, v] of Object.entries(t)) { const m = /^paste\.(\d+)\.what$/.exec(k); if (m && PASTE_WHATS.includes(v)) answers[+m[1]] = v; }
  const paste = readPasteText(values['paste.text'] || '', { wrapper: pasteWrapper, answers, orders: s.orders, current: s.record.lines });
  const unseen = paste.merged ? paste.merged.unseen.map((u) => ({ index: indexOfUnseen(s.record, u), ticker: up(u.ticker), name: u.name || '', value: u.value == null ? null : +u.value })).filter((u) => u.index >= 0) : [];
  const removeIndex = Number.isInteger(values['remove.index']) && values['remove.index'] >= 0 && values['remove.index'] < s.record.lines.length ? values['remove.index'] : null;
  return { ok: Object.keys(errors).length === 0, values, errors, shown, boxes, add: { ...add, ok: addOk, text: values['add.text'] || '', wrapper: values['add.wrapper'] || 'SIPP' }, lines, paste: { ...paste, answers, unseen }, removeIndex, saved: s };
}

// ---- the writes -------------------------------------------------------------------------------------------------------------

const declared = (patch) => { for (const k of Object.keys(patch)) if (!HOLD_WRITES.includes(k)) throw new Error('hold: "' + k + '" is not a declared field path'); return patch; };
const lineName = (l) => (l && (l.name || l.ticker || l.sedol)) || '';

/**
 * ONE change of the record (§2.2): the record after it is HoldingsRecord.holdingsWith's (add, edit, remove) or
 * HoldingsPaste.applyPaste's (a paste), stamped with `today` — the planner's own functions; the write is the whole record
 * as one field. A locked plan is allowed (decision 1): the record is what is true today, not the plan.
 */
export function holdPatch(plan, change, { today }) {
  const c = change && typeof change === 'object' ? change : {};
  const rec = holdRecordOf(plan);
  const previous = { holdings: plan && Object.prototype.hasOwnProperty.call(plan, 'holdings') ? copy(plan.holdings) : undefined };
  const fail = (why) => ({ ok: false, errors: { change: why }, patch: {}, previous: {}, line: null, record: rec });
  let next, line;
  try {
    if (c.kind === 'add') {
      const l = normaliseLine(c.line);
      if (!l) return fail('noIdentity');
      if (!HOLD_WRAPPERS.includes(l.wrapper)) return fail('wrapper');
      next = holdingsWith(rec, { kind: 'add', line: l }, { today });
      line = { id: 'added', slots: { name: lineName(l), wrapper: l.wrapper } };
    } else if (c.kind === 'edit') {
      const i = +c.index;
      if (!(i >= 0 && i < rec.lines.length)) return fail('index');
      if (!LINE_FIELDS.includes(c.field)) return fail('field');
      if (LINE_NUMBER_FIELDS.includes(c.field) && c.value !== '' && c.value != null && numOrNull(c.value) == null) return fail('notANumber');
      if (c.field === 'wrapper' && !HOLD_WRAPPERS.includes(up(c.value))) return fail('wrapper');
      next = holdingsWith(rec, { kind: 'edit', index: i, field: c.field, value: c.field === 'wrapper' ? up(c.value) : c.value }, { today });
      line = { id: 'edited', slots: { name: lineName(rec.lines[i]) } };
    } else if (c.kind === 'remove') {
      const i = +c.index;
      if (!(i >= 0 && i < rec.lines.length)) return fail('index');
      next = holdingsWith(rec, { kind: 'remove', index: i }, { today });
      line = { id: 'removed', slots: { name: lineName(rec.lines[i]), wrapper: rec.lines[i].wrapper } };
    } else if (c.kind === 'paste') {
      const wrapper = HOLD_WRAPPERS.includes(c.wrapper) ? c.wrapper : 'SIPP';
      const parsed = parsePaste(String(c.text || ''));
      if (!parsed.rows.length) return fail('nothingRead');
      const done = applyPaste(rec, parsed.rows, c.answers && typeof c.answers === 'object' ? c.answers : {}, wrapper, { today, orders: ordersOf(plan) });
      next = done.record;
      line = { id: 'pasted', slots: { updated: String(done.updated.length), added: String(done.added.length), wrapper } };
    } else return fail('unknown');
  } catch (e) { return fail(e && e.message ? e.message : 'failed'); }
  return { ok: true, errors: {}, patch: declared({ holdings: next }), previous, line, record: next };
}

// ---- the words ---------------------------------------------------------------------------------------------------------------

const pct = (f) => String(Math.round((+f || 0) * 100));
/** The mix as held, in words' slots (Holdings.describeMix, as data): the four shares, the total, the yearly charge, the lines not counted. */
export function mixWords(p) {
  if (!p || !(p.total > 0)) return null;
  return { shares: pct(p.buckets.shares), bonds: pct(p.buckets.bonds), diversifiers: pct(p.buckets.diversifiers), cash: pct(p.buckets.cash), total: pounds(p.total), charge: (p.weightedOcf * 100).toFixed(2), untagged: p.untagged.map((u) => u.ticker || u.name || '').filter(Boolean) };
}
/** Where new money goes (§2.1): the monthly figure and the pounds a month to each bucket, or null when nothing is paid in. */
export function newMoneyWords(p) {
  if (!p || !(p.contributions && p.contributions.monthly > 0)) return null;
  const m = p.contributions.monthly;
  const parts = ['shares', 'bonds', 'diversifiers', 'cash'].filter((b) => p.contributions.byBucket[b] > 0.004).map((b) => ({ bucket: b, word: BUCKET_WORDS[b], amount: pounds(m * p.contributions.byBucket[b]) }));
  return { monthly: pounds(m), parts };
}

/** The headline's slots: the totals by account and the date, or null when nothing is recorded. */
export function headlineOf(sum, updatedAt) {
  if (!sum || !(sum.count > 0)) return null;
  return { pension: pounds(sum.byWrapper.SIPP), isa: pounds(sum.byWrapper.ISA), gia: sum.byWrapper.GIA > 0 ? pounds(sum.byWrapper.GIA) : null, cash: sum.byWrapper.CASH > 0 ? pounds(sum.byWrapper.CASH) : null, total: pounds(sum.total), lines: String(sum.count), date: updatedAt ? dayWords(updatedAt) : null };
}

/** Everything the screen draws. */
export function holdOf(entries, id, { today, typed = null, source = 'account' } = {}) {
  const list = (entries || []).filter((e) => e && e.plan && typeof e.plan === 'object' && e.plan.id != null);
  const entry = list.find((e) => String(e.plan.id) === String(id)) || null;
  if (!entry) return { found: false, id: String(id || '') };
  const plan = entry.plan;
  const readonly = !!(entry.newer || entry.failed);
  const c = checkHold(plan, typed || {}, { today });
  const s = c.saved;
  const fields = HOLD_FIELDS.map((f) => ({
    path: f.path, type: f.type, options: f.type === 'choice' ? f.options : null, applies: true,
    shown: blank(c.shown[f.path]) ? (f.type === 'choice' && f.default != null ? f.default : '') : String(c.shown[f.path]),
    saved: null, error: c.errors[f.path] || null
  }));
  const groups = s.groups.map((g) => ({ wrapper: g.wrapper, total: pounds(g.lines.reduce((t, l) => t + (+l.value || 0), 0)), lines: g.lines.map((l) => ({
    index: l.index, ticker: l.ticker || '', name: l.name || '', sedol: l.sedol || '', asOf: l.asOf ? dayWords(l.asOf) : null, counted: l.counted, kind: l.kind, value: l.value == null ? null : pounds(l.value), units: l.units == null ? null : String(r0(l.units)),
    fields: c.lines[l.index].fields
  })) }));
  const removeLine = c.removeIndex != null ? (() => { const l = s.record.lines[c.removeIndex]; return { index: c.removeIndex, name: lineName(l), wrapper: l.wrapper }; })() : null;
  const pasteChange = c.paste.merged && c.paste.rows.length ? { kind: 'paste', text: c.paste.text, wrapper: c.paste.wrapper, answers: c.paste.answers } : null;
  return {
    found: true, id: String(plan.id), name: s.name, locked: s.locked, lockedOn: s.lockedOn, readonly, editable: !readonly, source,
    saver: s.saver, stageKey: s.stage.key,
    headline: headlineOf(s.summary, s.record.updatedAt), recordSource: s.record.source, updatedAt: s.record.updatedAt ? dayWords(s.record.updatedAt) : null,
    groups, count: s.record.lines.length,
    mix: mixWords(s.proportions), newMoney: newMoneyWords(s.proportions),
    atLock: s.atLock ? { ...headlineOf(s.atLock.summary, s.atLock.updatedAt), lockedOn: s.atLock.lockedOn } : null,
    fields, errors: c.errors, ok: c.ok,
    add: c.add, paste: { text: c.paste.text, wrapper: c.paste.wrapper, empty: c.paste.empty, rows: c.paste.rows, counts: c.paste.counts, leftOut: c.paste.leftOut, warnings: c.paste.warnings, unseen: c.paste.unseen, canAdd: !!pasteChange, change: pasteChange, merged: c.paste.merged ? { added: c.paste.merged.added.length, updated: c.paste.merged.updated.length } : null },
    remove: removeLine, whats: HOLD_WHATS.slice(), wrappers: HOLD_WRAPPERS.slice()
  };
}
