/**
 * Monthly entry, the platform view (decision 10, research/v7/v6-usability-audit.md §2.7 and §5).
 *
 * A platform shows a pension total, a cash figure and what the bond funds or gilts are worth — never "shares,
 * bonds, cash, diversifiers" by type. So the monthly entry asks for what the platform shows and derives the
 * per-type figures the engine has always received:
 *   shares = total − cash − bonds (− gold and trend, when the plan has that sleeve);
 *   a gilt-ladder plan: gilts = total − cash (nobody adds up 22 rungs), no shares.
 * The record keeps exactly what was typed plus the derived split (`entered`). Pure: no DOM, no storage.
 */

const num = (v) => { if (v === '' || v == null) return null; const n = typeof v === 'number' ? v : +String(v).replace(/[£,\s]/g, ''); return Number.isFinite(n) ? n : null; };
const whole = (v) => Math.round(num(v) || 0);

/** The boxes the platform view asks for, in order, with their words. */
export function platformBoxes({ contract = false, hasDiversifiers = false } = {}) {
  const boxes = [
    { key: 'total', id: 'entryPlatTotal', label: 'Pension total', hint: contract ? 'What your platform shows for the whole pension — the gilts and the cash together.' : 'What your platform shows for the whole pension.' },
    { key: 'cash', id: 'entryPlatCash', label: 'of which cash', hint: 'Cash and money-market funds inside the pension.' }
  ];
  if (!contract) boxes.push({ key: 'bonds', id: 'entryPlatBonds', label: 'of which bond funds or gilts', hint: 'Bond funds and any gilts held directly. Shares are the rest.' });
  if (!contract && hasDiversifiers) boxes.push({ key: 'diversifiers', id: 'entryPlatDiversifiers', label: 'of which gold and trend', hint: 'The gold / trend sleeve your plan holds.' });
  return boxes;
}

/**
 * The platform figures → the engine's per-type figures.
 * @returns {{ equity, bond, cash, diversifier, problem: string|null }}
 */
export function splitFromPlatform(typed, { contract = false, hasDiversifiers = false } = {}) {
  const t = typed || {};
  const total = num(t.total);
  if (total == null) return { equity: 0, bond: 0, cash: 0, diversifier: 0, problem: 'Enter the pension total — the one figure your platform shows for the whole pension.' };
  const cash = whole(t.cash);
  if (contract) {
    const bond = Math.round(total) - cash;
    if (bond < 0) return { equity: 0, bond: 0, cash, diversifier: 0, problem: 'The cash figure is more than the pension total — check the two figures.' };
    return { equity: 0, bond, cash, diversifier: 0, problem: null };
  }
  const bond = whole(t.bonds);
  const diversifier = hasDiversifiers ? whole(t.diversifiers) : 0;
  const equity = Math.round(total) - cash - bond - diversifier;
  if (equity < 0) return { equity: 0, bond, cash, diversifier, problem: 'The parts add up to more than the pension total — check the figures.' };
  return { equity, bond, cash, diversifier, problem: null };
}

/**
 * Last month's figures to pre-fill from: the latest record's typed figures when it has them (6.23 on), else
 * rebuilt from its per-type figures. Records are read, never changed. Null when nothing is recorded.
 * @returns {{ from: 'YYYY-MM', total, cash, bonds, diversifiers }|null}
 */
export function prefillFromHistory(history, { contract = false } = {}) {
  const list = (Array.isArray(history) ? history : []).filter((h) => h && h.date);
  if (!list.length) return null;
  const last = list.reduce((a, b) => (String(b.date) > String(a.date) ? b : a));
  const e = last.entered;
  if (e && e.mode === 'platform' && e.typed) {
    return { from: last.date, total: whole(e.typed.total), cash: whole(e.typed.cash), bonds: whole(e.typed.bonds), diversifiers: whole(e.typed.diversifiers) };
  }
  const equity = whole(last.equity), bond = whole(last.bond), cash = whole(last.cash);
  const diversifiers = e && e.split ? whole(e.split.diversifier) : 0;
  return { from: last.date, total: equity + bond + cash + diversifiers, cash, bonds: bond, diversifiers };   // a gilt-ladder record's bond figure is its gilts
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** "Last month's figures (September 2026) are filled in — change them to this month's." */
export function prefillNote(prefill) {
  if (!prefill || !prefill.from) return '';
  const [y, m] = String(prefill.from).split('-').map(Number);
  const when = MONTHS[m - 1] ? MONTHS[m - 1] + ' ' + y : prefill.from;
  return 'Last month\'s figures (' + when + ') are filled in — change them to this month\'s.';
}

/** What goes on the record: the mode, exactly what was typed, and the split the engine ran on. No undefined. */
export function enteredBlock(mode, typed, split) {
  const clean = (o, keys) => { const out = {}; for (const k of keys) out[k] = whole(o && o[k]); return out; };
  const typedKeys = mode === 'platform' ? ['total', 'cash', 'bonds', 'diversifiers'] : ['equity', 'bond', 'cash', 'diversifier'];
  return { mode: mode === 'platform' ? 'platform' : 'type', typed: clean(typed, typedKeys), split: clean(split, ['equity', 'bond', 'cash', 'diversifier']) };
}
