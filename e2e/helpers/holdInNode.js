/**
 * "What you hold" and "Moving to your plan's mix" worked out in Node, for "screen equals engine" (research/v7/road-to-7.md
 * step 10; holdings-and-move.md §7): the same pure readers and writers the page and the one write file use (hold.js holdOf,
 * checkHold, holdPatch; move.js moveOf, tickPatch) and the same lazily-loaded run the V7 worker makes (moveRun.js runHeld),
 * on a plan brought up to date in memory exactly as the plan source does it, in a child process of plain Node.
 *
 *   holdInNode(rawPlan, today, { add, remove, paste, tick, held })  → { hold, add, remove, paste, move, tick, held }
 *     hold      holdOf's headline, count and mix (plain data)
 *     add       for add = { text, wrapper, value, units, pick }: the add box's matches and the holdPatch for the line picked
 *               (pick: a match id such as 'fund:VWRP', or 'typed') — { ok, patch, previous, line }
 *     remove    for remove = { index }: holdPatch's { ok, patch, previous }
 *     paste     for paste = { text, wrapper, answers }: the paste's reading (rows, unseen, leftOut) and holdPatch's { ok, patch, previous }
 *     move      moveOf's status words, the keys of Buy and Sell, the first rung of the order sheet, whether it waits
 *     tick      for tick = { key, done }: tickPatch's { ok, patch, previous }
 *     held      runHeld's result when `held` is true (one run of the one test)
 */
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const src = (p) => pathToFileURL(join(REPO, p)).href;

const CHILD = `
import { readFileSync } from 'node:fs';
const { upgradeScenario } = await import(${JSON.stringify(src('src/firebase/scenarioMigration.js'))});
const { holdOf, checkHold, holdPatch } = await import(${JSON.stringify(src('src/answers/plan/hold.js'))});
const { moveOf, tickPatch } = await import(${JSON.stringify(src('src/answers/plan/move.js'))});
const { plan, today, add, remove, paste, tick, held } = JSON.parse(readFileSync(0, 'utf8'));
const [y, m, d] = today.split('-').map(Number);
const up = upgradeScenario(plan, { now: new Date(y, m - 1, d, 12) }).scenario;
const h = holdOf([{ plan: up }], up.id, { today });
const out = { hold: { headline: h.headline, count: h.count, mix: h.mix, newMoney: h.newMoney, locked: h.locked }, add: null, remove: null, paste: null, move: null, tick: null, held: null };
if (add) {
  const c = checkHold(up, { 'add.text': add.text, 'add.wrapper': add.wrapper || 'SIPP', 'add.value': add.value || '', 'add.units': add.units || '' }, { today });
  const m2 = add.pick === 'typed' ? c.add.asTyped : c.add.matches.find((x) => x.id === add.pick);
  const p = m2 ? holdPatch(up, { kind: 'add', line: m2.line }, { today }) : { ok: false };
  out.add = { matches: c.add.matches.map((x) => x.id), asTyped: c.add.asTyped ? c.add.asTyped.id : null, line: m2 ? m2.line : null, ok: p.ok, patch: p.patch, previous: p.previous };
}
if (remove) { const p = holdPatch(up, { kind: 'remove', index: remove.index }, { today }); out.remove = { ok: p.ok, patch: p.patch, previous: p.previous, line: p.line }; }
if (paste) {
  const typed = { 'paste.text': paste.text, 'paste.wrapper': paste.wrapper || 'SIPP' };
  for (const [line, what] of Object.entries(paste.answers || {})) typed['paste.' + line + '.what'] = what;
  const c = checkHold(up, typed, { today });
  const p = holdPatch(up, { kind: 'paste', text: paste.text, wrapper: paste.wrapper || 'SIPP', answers: paste.answers || {} }, { today });
  out.paste = { rows: c.paste.rows.length, unrecognised: c.paste.rows.filter((r) => r.unrecognised).length, leftOut: c.paste.leftOut.length, unseen: c.paste.unseen.map((u) => u.index), merged: c.paste.merged ? { added: c.paste.merged.added.length, updated: c.paste.merged.updated.length } : null, ok: p.ok, patch: p.patch, previous: p.previous, line: p.line };
}
const mv = moveOf([{ plan: up }], up.id, { today });
out.move = { kind: mv.kind, locked: mv.locked, waiting: mv.waiting, status: mv.status, progressPct: mv.progressPct, rungs: mv.rungs, moves: mv.moves, movesDone: mv.movesDone, buy: (mv.buy || []).map((b) => b.key), sell: (mv.sell || []).map((b) => b.key), sheetFirst: mv.sheet && mv.sheet.length ? mv.sheet[0] : null, sheet: mv.sheet ? mv.sheet.length : 0, own: mv.own, held: mv.held, uncovered: mv.cost ? mv.cost.uncovered.length : 0, totals: mv.totals };
if (tick) { const p = tickPatch(up, tick.key, { today, done: tick.done !== false }); out.tick = { ok: p.ok, patch: p.patch, previous: p.previous, line: p.line }; }
if (held) { const { runHeld } = await import(${JSON.stringify(src('src/answers/plan/moveRun.js'))}); const { futuresOutOfTen } = await import(${JSON.stringify(src('src/services/OneAnswer.js'))}); const r = runHeld(up, { today }); out.held = { ...r, words: r.a ? futuresOutOfTen(r.a.share).words : null }; }
process.stdout.write(JSON.stringify(out));
`;

export function holdInNode(plan, today, { add = null, remove = null, paste = null, tick = null, held = false } = {}) {
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', CHILD], {
    cwd: REPO, input: JSON.stringify({ plan, today, add, remove, paste, tick, held }), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, TZ: 'Europe/London', NODE_OPTIONS: '' }
  });
  if (r.status !== 0) throw new Error('holdInNode failed: ' + r.stderr);
  return JSON.parse(r.stdout);
}
