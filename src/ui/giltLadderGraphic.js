/**
 * "The machine" for the Full index-linked gilt ladder — a data-driven SVG in four frames.
 * Pure: (plan from GiltLadderPlan, frame 1-4) → SVG string. No DOM, no libraries.
 *
 *  1. Your income plan, year by year (the staircase).
 *  2. The first years sit in cash.
 *  3. Every later year has a gilt maturing just before its April.
 *  4. Gap years: the year before buys twice. Nothing rides the market.
 */

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const gbpK = (v) => '£' + Math.round(v / 1000) + 'k';

export const GILT_FRAMES = [
  { title: 'Your income plan, year by year', text: 'Each bar is one tax year of income in today\'s money — the steps you chose. Everything below is about buying these bars today.' },
  { title: 'The first years sit in cash', text: 'The bridge and the first years are held in a money-market fund: no market, no gilt, just cash waiting for its April.' },
  { title: 'Every later year has its own gilt', text: 'One index-linked gilt per year, chosen so it matures just BEFORE that year\'s April. When it matures the money is sitting in cash; you draw it monthly.' },
  { title: 'Gap years, and nothing left to chance', text: 'Where no gilt matures in a year\'s window, the year before is bought twice and half is held for a year. Nothing rides the market. There is no cone on this page because there is nothing uncertain to draw.' }
];

/**
 * @param {object} plan  buildGiltLadder() output
 * @param {number} frame 1..4
 * @param {object} [o]   { width, height }
 */
export function giltLadderSvg(plan, frame = 4, o = {}) {
  const W = o.width || 960, H = o.height || 330;
  const padL = 56, padR = 16, padT = 34, padB = 58;
  const years = plan.years;
  if (!years.length) return '';
  const n = years.length;
  const colW = (W - padL - padR) / n;
  const maxV = Math.max(...years.map((y) => y.gross), 1);
  const y0 = H - padB;
  const yOf = (v) => y0 - (v / maxV) * (H - padT - padB);
  const firstCol = {}; years.forEach((y, i) => { if (y.from !== 'cash' && y.from !== 'none' && firstCol[y.from] == null) firstCol[y.from] = i; });
  let s = '';
  // axis + gridlines
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * maxV);
  for (const t of ticks) s += `<line x1="${padL}" y1="${yOf(t).toFixed(1)}" x2="${W - padR}" y2="${yOf(t).toFixed(1)}" stroke="var(--border,#8883)" opacity=".5"/><text x="${padL - 6}" y="${(yOf(t) + 3).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text-muted,#999)">${gbpK(t)}</text>`;
  // bars
  years.forEach((y, i) => {
    const x = padL + i * colW + 1, w = Math.max(1, colW - 2);
    const isCash = y.from === 'cash', isGilt = !isCash && y.from !== 'none';
    let fill = 'var(--border,#8883)', op = 0.45;
    if (frame >= 2 && isCash) { fill = '#a3a3a3'; op = 0.85; }
    if (frame >= 3 && isGilt) { fill = y.held && frame >= 4 ? '#93c5fd' : '#60a5fa'; op = 0.9; }
    if (frame >= 3 && y.from === 'none') { fill = '#ef4444'; op = 0.8; }
    const sp = y.gross - y.need;
    s += `<rect x="${x.toFixed(1)}" y="${yOf(y.gross).toFixed(1)}" width="${w.toFixed(1)}" height="${(y0 - yOf(y.gross)).toFixed(1)}" fill="${fill}" opacity="${op}"><title>${esc(y.Y)}/${String(y.Y + 1).slice(2)} age ${y.age}: ${gbpK(y.gross)} gross${sp > 1 ? ' (State Pension ' + gbpK(sp) + ')' : ''}${isCash ? ' — cash' : isGilt ? ' — ' + esc(y.from) + (y.held ? ' (held from the year before)' : '') : ''}</title></rect>`;
    if (sp > 1 && frame >= 1) s += `<rect x="${x.toFixed(1)}" y="${yOf(sp).toFixed(1)}" width="${w.toFixed(1)}" height="${(y0 - yOf(sp)).toFixed(1)}" fill="#facc15" opacity=".55"><title>State Pension ${gbpK(sp)}</title></rect>`;
    // gilt marker: a diamond just left of the column's April (frame 3+)
    if (frame >= 3 && isGilt && firstCol[y.from] === i) {
      const gx = x - 1, gy = yOf(y.gross) - 9;
      s += `<path d="M${gx} ${gy - 6} l5 6 l-5 6 l-5 -6 z" fill="#1d4ed8"><title>${esc(y.from)} matures ${esc(y.matures || '')} — before April ${y.Y}</title></path>`;
    }
    // double-drop arrows (frame 4): from the source column to the held column
    if (frame >= 4 && y.held) {
      const src = firstCol[y.from];
      if (src != null && src !== i) { const sx = padL + src * colW + colW / 2, tx = x + w / 2, ay = yOf(y.gross) - 22; s += `<path d="M${sx.toFixed(1)} ${ay} Q ${((sx + tx) / 2).toFixed(1)} ${ay - 18} ${tx.toFixed(1)} ${ay}" fill="none" stroke="#1d4ed8" stroke-width="1.5" stroke-dasharray="3 2"/><circle cx="${tx.toFixed(1)}" cy="${ay}" r="2.5" fill="#1d4ed8"/>`; }
    }
  });
  // x labels: every 5th year + age
  years.forEach((y, i) => { if (i % 5 === 0 || i === n - 1) { const x = padL + i * colW + colW / 2; s += `<text x="${x.toFixed(1)}" y="${H - padB + 14}" text-anchor="middle" font-size="10" fill="var(--text-muted,#999)">${y.Y}</text><text x="${x.toFixed(1)}" y="${H - padB + 27}" text-anchor="middle" font-size="9" fill="var(--text-muted,#999)">age ${y.age}</text>`; } });
  // legend
  const leg = [];
  leg.push(['#facc15', 'State Pension']);
  if (frame >= 2) leg.push(['#a3a3a3', 'Cash (money-market)']);
  if (frame >= 3) leg.push(['#60a5fa', 'Index-linked gilt, matures before that April']);
  if (frame >= 4) leg.push(['#93c5fd', 'Held from the year before (gap year)']);
  let lx = padL;
  for (const [c, t] of leg) { s += `<rect x="${lx}" y="${H - 14}" width="10" height="10" fill="${c}"/><text x="${lx + 14}" y="${H - 5}" font-size="10" fill="var(--text-muted,#999)">${esc(t)}</text>`; lx += 14 + t.length * 5.6 + 18; }
  // title / frame caption
  const f = GILT_FRAMES[Math.max(0, Math.min(3, frame - 1))];
  s += `<text x="${padL}" y="18" font-size="13" font-weight="600" fill="var(--text,#eee)">${esc(f.title)}</text>`;
  if (frame >= 4) s += `<text x="${W - padR}" y="18" text-anchor="end" font-size="11" fill="#60a5fa">Total ${gbpK(plan.total)} · ${plan.orders.length} gilts · ${plan.orders.filter((x) => x.taxYears.length > 1).length} double-drops</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(f.title)}">${s}</svg>`;
}

/**
 * Two real decades: the cash the ladder actually pays out, year by year, under two historical
 * inflation paths — because the rungs are index-linked, the REAL amount is identical in both.
 * @param {object} p { years: plan.years, cpiPaths: { label: [factor per year...] } }
 */
export function inflationDecadesSvg({ years, cpiPaths }, o = {}) {
  const W = o.width || 960, H = o.height || 260, padL = 64, padR = 16, padT = 30, padB = 30;
  const labels = Object.keys(cpiPaths);
  const n = years.length;
  const series = labels.map((k) => years.map((y, i) => y.gross * (cpiPaths[k][i] ?? 1)));
  const maxV = Math.max(...series.flat(), 1);
  const x = (i) => padL + (i / (n - 1)) * (W - padL - padR);
  const yOf = (v) => (H - padB) - (v / maxV) * (H - padT - padB);
  const colors = ['#f97316', '#60a5fa', '#a78bfa'];
  let s = '';
  for (const t of [0, 0.25, 0.5, 0.75, 1].map((f) => f * maxV)) s += `<line x1="${padL}" y1="${yOf(t).toFixed(1)}" x2="${W - padR}" y2="${yOf(t).toFixed(1)}" stroke="var(--border,#8883)" opacity=".5"/><text x="${padL - 6}" y="${(yOf(t) + 3).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text-muted,#999)">${gbpK(t)}</text>`;
  s += `<polyline points="${years.map((y, i) => x(i).toFixed(1) + ',' + yOf(y.gross).toFixed(1)).join(' ')}" fill="none" stroke="var(--text,#eee)" stroke-width="2" stroke-dasharray="4 3"/>`;
  series.forEach((ser, k) => { s += `<polyline points="${ser.map((v, i) => x(i).toFixed(1) + ',' + yOf(v).toFixed(1)).join(' ')}" fill="none" stroke="${colors[k]}" stroke-width="2.5"/>`; });
  let lx = padL;
  for (const [c, t] of [['var(--text,#eee)', 'in today\'s money (both decades)'], ...labels.map((l, k) => [colors[k], l])]) { s += `<line x1="${lx}" y1="${H - 8}" x2="${lx + 14}" y2="${H - 8}" stroke="${c}" stroke-width="2.5"/><text x="${lx + 18}" y="${H - 4}" font-size="10" fill="var(--text-muted,#999)">${esc(t)}</text>`; lx += 24 + t.length * 5.6 + 14; }
  years.forEach((y, i) => { if (i % 5 === 0 || i === n - 1) s += `<text x="${x(i).toFixed(1)}" y="${H - padB + 12}" text-anchor="middle" font-size="10" fill="var(--text-muted,#999)">${y.Y}</text>`; });
  s += `<text x="${padL}" y="18" font-size="13" font-weight="600" fill="var(--text,#eee)">What the ladder pays in cash under two real inflation decades — same purchasing power in both</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet" role="img">${s}</svg>`;
}
