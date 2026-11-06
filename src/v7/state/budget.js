/**
 * The budget sheet in the state (research/v7/budget-step.md; save-as-plan.md Contract C.5). Pure: (sheet, action) →
 * sheet. The sheet is the household's ONE budget, shared by questions A and B. Its amounts are held as typed (text),
 * like the drafts; src/answers/keep/budgetSheet.js checks it.
 *
 * Nothing here touches a draft: editing the budget never moves the figure an answer uses. The one way from the budget
 * to that figure is "Use £X a month" (budget/use), which the reducer handles itself.
 *
 *   cleanSheet(kept)               a sheet kept in the tab (or handed in by the test hook), cleaned; null for none
 *   budgetReduce(sheet, action)    the sheet after one budget/* action (the same sheet when nothing changes); null
 *                                  when the action is not one this file knows
 */
import { A } from './actions.js';
import { HEADINGS, SHEET_LIMITS, starterSheet, nextLineId, nextOneOffId } from '../../answers/keep/budgetSheet.js';

/** The longest text a box keeps: a little over what the check accepts, so a person sees their own over-long text. */
const TEXT_MAX = 200;
const LINE_ID = /^l\d{1,6}$/;
const ONE_OFF_ID = /^o\d{1,6}$/;
const LINE_FIELDS = ['amount', 'period', 'essential', 'label'];
const ONE_OFF_FIELDS = ['label', 'amount', 'year', 'everyYears'];

const text = (v) => (typeof v === 'string' ? v.slice(0, TEXT_MAX) : '');

function cleanLine(l) {
  if (!l || typeof l !== 'object' || !LINE_ID.test(l.id)) return null;
  return {
    id: l.id,
    heading: HEADINGS.includes(l.heading) ? l.heading : 'other',
    label: text(l.label),
    amount: text(l.amount),
    period: l.period === 'yr' ? 'yr' : 'mo',
    essential: l.essential === true,
    starter: l.starter === true
  };
}

function cleanOneOff(o) {
  if (!o || typeof o !== 'object' || !ONE_OFF_ID.test(o.id)) return null;
  return { id: o.id, label: text(o.label), amount: text(o.amount), year: text(o.year), everyYears: text(o.everyYears) };
}

/** Only what a sheet can hold, with no id twice: whatever else is there is dropped. */
export function cleanSheet(kept) {
  if (!kept || typeof kept !== 'object' || Array.isArray(kept)) return null;
  const unique = (list, clean, max) => {
    const seen = new Set();
    const out = [];
    for (const x of Array.isArray(list) ? list : []) {
      const c = clean(x);
      if (!c || seen.has(c.id) || out.length >= max) continue;
      seen.add(c.id);
      out.push(c);
    }
    return out;
  };
  return {
    version: 1,
    lines: unique(kept.lines, cleanLine, SHEET_LIMITS.lines),
    oneOffs: unique(kept.oneOffs, cleanOneOff, SHEET_LIMITS.oneOffs),
    touched: Array.isArray(kept.touched) ? [...new Set(kept.touched.filter((t) => typeof t === 'string' && t.length <= 40))] : []
  };
}

/** The value a field of a line or one-off cost takes from an action, or undefined when it may not take it. */
function valueFor(field, value, starter) {
  if (field === 'essential') return typeof value === 'boolean' ? value : undefined;
  if (field === 'period') return value === 'mo' || value === 'yr' ? value : undefined;
  if (field === 'label' && starter) return undefined;            // a starter line keeps the catalogue's label, letter for letter
  return typeof value === 'string' ? value.slice(0, TEXT_MAX) : undefined;
}

const touch = (sheet, key) => (sheet.touched.includes(key) ? sheet.touched : [...sheet.touched, key]);

/**
 * @returns {object|null|undefined}  the new sheet; the same sheet when the action changes nothing (an id that is not
 *   there, a field it may not set); undefined when the action is not a budget action.
 */
export function budgetReduce(sheet, action) {
  const s = sheet || null;
  switch (action.type) {
    case A.BUDGET_LINE: {
      if (!s || !LINE_FIELDS.includes(action.field)) return s;
      const at = s.lines.findIndex((l) => l.id === action.id);
      if (at === -1) return s;
      const v = valueFor(action.field, action.value, s.lines[at].starter);
      if (v === undefined || s.lines[at][action.field] === v) return s;
      const lines = s.lines.slice();
      lines[at] = { ...lines[at], [action.field]: v };
      return { ...s, lines };
    }
    case A.BUDGET_ADD: {
      const base = s || starterSheet();
      if (!HEADINGS.includes(action.heading) || base.lines.length >= SHEET_LIMITS.lines) return s;
      const line = { id: nextLineId(base), heading: action.heading, label: '', amount: '', period: 'mo', essential: false, starter: false };
      // after the last line of its heading, so the sheet stays in heading order
      let at = -1;
      base.lines.forEach((l, i) => { if (HEADINGS.indexOf(l.heading) <= HEADINGS.indexOf(action.heading)) at = i; });
      const lines = base.lines.slice();
      lines.splice(at + 1, 0, line);
      return { ...base, lines };
    }
    case A.BUDGET_REMOVE: {
      if (!s || !s.lines.some((l) => l.id === action.id)) return s;
      return { ...s, lines: s.lines.filter((l) => l.id !== action.id), touched: s.touched.filter((t) => !t.startsWith(`${action.id}.`)) };
    }
    case A.BUDGET_ONE_OFF: {
      if (!s || !ONE_OFF_FIELDS.includes(action.field)) return s;
      const at = s.oneOffs.findIndex((o) => o.id === action.id);
      if (at === -1) return s;
      const v = valueFor(action.field, action.value, false);
      if (v === undefined || s.oneOffs[at][action.field] === v) return s;
      const oneOffs = s.oneOffs.slice();
      oneOffs[at] = { ...oneOffs[at], [action.field]: v };
      return { ...s, oneOffs };
    }
    case A.BUDGET_ADD_ONE_OFF: {
      const base = s || starterSheet();
      if (base.oneOffs.length >= SHEET_LIMITS.oneOffs) return s;
      return { ...base, oneOffs: [...base.oneOffs, { id: nextOneOffId(base), label: '', amount: '', year: '', everyYears: '' }] };
    }
    case A.BUDGET_REMOVE_ONE_OFF: {
      if (!s || !s.oneOffs.some((o) => o.id === action.id)) return s;
      return { ...s, oneOffs: s.oneOffs.filter((o) => o.id !== action.id), touched: s.touched.filter((t) => !t.startsWith(`${action.id}.`)) };
    }
    case A.BUDGET_TOUCH: {
      if (!s || typeof action.id !== 'string' || typeof action.field !== 'string') return s;
      const known = s.lines.some((l) => l.id === action.id) || s.oneOffs.some((o) => o.id === action.id);
      const key = `${action.id}.${action.field}`;
      if (!known || s.touched.includes(key)) return s;
      return { ...s, touched: touch(s, key) };
    }
    default:
      return undefined;
  }
}

/** A new sheet for the household: the catalogue's lines and one-off costs, every amount blank. */
export const newSheet = () => starterSheet();
