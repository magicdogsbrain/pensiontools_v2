/**
 * "The machine" for Floor to an age, then decide — data-driven SVG in four frames.
 *  1. Your income plan, year by year.
 *  2. Bought by contract up to the chosen age; the rest of the pot is a reserve.
 *  3. The reserve rides world equities until that age — a band, not a line.
 *  4. At that age the reserve buys the remaining years: the schedule if it can, a smaller income if not.
 */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const gbpK = (v) => '£' + Math.round(v / 1000) + 'k';

export const FTA_FRAMES = [
  { title: 'Your income plan, year by year', text: 'The steps you chose, in today\'s money. The State Pension slice is shown in yellow.' },
  { title: 'Bought by contract up to the age you choose', text: 'Every year up to that age is bought today as index-linked gilts. What is left of the pot becomes the reserve — untouched, in world equities.' },
  { title: 'The reserve rides the market until then', text: 'Nobody knows what it will be worth: the band is the 10th to 90th percentile across 1,000 futures, the line the median. Nothing is drawn from it.' },
  { title: 'At that age: a known price, a known pot, one decision', text: 'You price the remaining years on that day\'s real yields (or take an annuity quote). If the reserve covers the schedule, buy it. If not, buy the level income it does cover — a cut, never a cliff.' }
];

/**
 * @param {object} d { years: [{age, gross, sp}], startAge, A (years to the decision), floorToAge,
 *   reserveCone: {p10,p50,p90}[] (index 0..A), restCostFull, canBuy: [{amount, mc}], levelIfCut: {p10,p50}, pot, floorCost, sleeveE0 }
 */
export function floorToAgeSvg(d, frame = 4, o = {}) {
  const W = o.width || 960, H = o.height || 360, padL = 56, padR = 16, padT = 34, padB = 44;
  const n = d.years.length; if (!n) return '';
  const colW = (W - padL - padR) / n;
  const maxIncome = Math.max(...d.years.map((y) => y.gross), 1);
  // two vertical scales: income bars use the lower 45%; the reserve band uses the whole height on its own scale
  const incTop = H - padB - (H - padT - padB) * 0.45;
  const y0 = H - padB;
  const yInc = (v) => y0 - (v / maxIncome) * (y0 - incTop);
  const maxRes = Math.max(d.restCostFull || 0, ...(d.reserveCone || []).map((c) => c.p90), 1);
  const yRes = (v) => incTop - 10 - (v / maxRes) * (incTop - 10 - padT);
  const xA = padL + d.A * colW;
  let s = '';
  // income bars
  d.years.forEach((y, i) => {
    const x = padL + i * colW + 1, w = Math.max(1, colW - 2);
    const bought = frame >= 2 && i < d.A;
    const fill = bought ? '#60a5fa' : (frame >= 4 && i >= d.A ? '#93c5fd' : 'var(--border,#8883)');
    const op = bought ? 0.9 : (frame >= 4 && i >= d.A ? 0.5 : 0.45);
    s += `<rect x="${x.toFixed(1)}" y="${yInc(y.gross).toFixed(1)}" width="${w.toFixed(1)}" height="${(y0 - yInc(y.gross)).toFixed(1)}" fill="${fill}" opacity="${op}"><title>Age ${y.age}: ${gbpK(y.gross)}${bought ? ' — bought by contract' : i >= d.A ? ' — decided at ' + d.floorToAge : ''}</title></rect>`;
    if (y.sp > 1) s += `<rect x="${x.toFixed(1)}" y="${yInc(y.sp).toFixed(1)}" width="${w.toFixed(1)}" height="${(y0 - yInc(y.sp)).toFixed(1)}" fill="#facc15" opacity=".55"/>`;
    if (frame >= 4 && i >= d.A && d.levelIfCut && d.levelIfCut.p10) { // the cut case: hatched lower level
      s += `<line x1="${x.toFixed(1)}" y1="${yInc(d.levelIfCut.p10).toFixed(1)}" x2="${(x + w).toFixed(1)}" y2="${yInc(d.levelIfCut.p10).toFixed(1)}" stroke="#f97316" stroke-width="2"><title>If the reserve falls short: a 1-in-10 bad case buys about ${gbpK(d.levelIfCut.p10)}/yr</title></line>`;
    }
  });
  // decision line
  if (frame >= 2) {
    s += `<line x1="${xA.toFixed(1)}" y1="${padT - 6}" x2="${xA.toFixed(1)}" y2="${y0}" stroke="#f97316" stroke-width="1.5" stroke-dasharray="4 3"/>`;
    s += `<text x="${(xA + 4).toFixed(1)}" y="${padT + 6}" font-size="11" fill="#f97316">age ${d.floorToAge}${frame >= 4 ? ' — decide here' : ''}</text>`;
  }
  // reserve band (frame 3+) on its own scale above the bars
  if (frame >= 3 && d.reserveCone && d.reserveCone.length) {
    const xs = (i) => padL + i * colW + colW / 2;
    const top = d.reserveCone.map((c, i) => xs(i).toFixed(1) + ',' + yRes(c.p90).toFixed(1));
    const bot = d.reserveCone.map((c, i) => xs(i).toFixed(1) + ',' + yRes(c.p10).toFixed(1)).reverse();
    s += `<polygon points="${top.concat(bot).join(' ')}" fill="rgba(96,165,250,.18)"/>`;
    s += `<polyline points="${d.reserveCone.map((c, i) => xs(i).toFixed(1) + ',' + yRes(c.p50).toFixed(1)).join(' ')}" fill="none" stroke="#60a5fa" stroke-width="2.5"/>`;
    s += `<text x="${padL}" y="${(yRes(d.reserveCone[0].p50) - 6).toFixed(1)}" font-size="10" fill="#60a5fa">reserve ${gbpK(d.sleeveE0)}</text>`;
    const last = d.reserveCone[d.reserveCone.length - 1];
    s += `<text x="${(xA - 4).toFixed(1)}" y="${(yRes(last.p50) - 6).toFixed(1)}" text-anchor="end" font-size="10" fill="#60a5fa">median ${gbpK(last.p50)}</text>`;
    s += `<text x="${(xA - 4).toFixed(1)}" y="${(yRes(last.p10) + 12).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text-muted,#999)">1-in-10 bad ${gbpK(last.p10)}</text>`;
  }
  // the price at A (frame 4)
  if (frame >= 4 && d.restCostFull) {
    s += `<line x1="${(xA - colW * 3).toFixed(1)}" y1="${yRes(d.restCostFull).toFixed(1)}" x2="${(xA + colW * 3).toFixed(1)}" y2="${yRes(d.restCostFull).toFixed(1)}" stroke="#f97316" stroke-width="2"/>`;
    const lbl = `the rest of the schedule costs ${gbpK(d.restCostFull)} at ${d.floorToAge}`; const lbl2 = d.canBuy && d.canBuy[0] ? `reserve covers it in ${Math.round(d.canBuy[0].mc)}% of futures` : '';
    const right = xA + colW * 3 + 4 + Math.max(lbl.length, lbl2.length) * 5.4 < W - padR;
    const tx = right ? xA + colW * 3 + 4 : xA - colW * 3 - 4, anchor = right ? 'start' : 'end';
    s += `<text x="${tx.toFixed(1)}" y="${(yRes(d.restCostFull) - 4).toFixed(1)}" text-anchor="${anchor}" font-size="10" fill="#f97316">${lbl}</text>`;
    if (lbl2) s += `<text x="${tx.toFixed(1)}" y="${(yRes(d.restCostFull) + 10).toFixed(1)}" text-anchor="${anchor}" font-size="10" fill="#f97316">${lbl2}</text>`;
  }
  // x labels
  d.years.forEach((y, i) => { if (i % 5 === 0 || i === n - 1) s += `<text x="${(padL + i * colW + colW / 2).toFixed(1)}" y="${H - padB + 14}" text-anchor="middle" font-size="10" fill="var(--text-muted,#999)">age ${y.age}</text>`; });
  // legend
  const leg = [['#facc15', 'State Pension']]; if (frame >= 2) leg.push(['#60a5fa', 'Bought by contract']); if (frame >= 3) leg.push(['rgba(96,165,250,.4)', 'Reserve, 10th–90th percentile']); if (frame >= 4) leg.push(['#f97316', 'The decision at ' + d.floorToAge]);
  let lx = padL; for (const [c, t] of leg) { s += `<rect x="${lx}" y="${H - 14}" width="10" height="10" fill="${c}"/><text x="${lx + 14}" y="${H - 5}" font-size="10" fill="var(--text-muted,#999)">${esc(t)}</text>`; lx += 14 + t.length * 5.6 + 18; }
  const f = FTA_FRAMES[Math.max(0, Math.min(3, frame - 1))];
  s += `<text x="${padL}" y="18" font-size="13" font-weight="600" fill="var(--text,#eee)">${esc(f.title)}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(f.title)}">${s}</svg>`;
}

/** Two real decades: the reserve's path from two named starts, against the price of the rest at A. */
export function ftaDecadesSvg({ A, floorToAge, startAge, paths, restCostFull }, o = {}) {
  const W = o.width || 960, H = o.height || 260, padL = 64, padR = 16, padT = 30, padB = 30;
  const labels = Object.keys(paths); const n = A + 1;
  const maxV = Math.max(restCostFull || 0, ...labels.flatMap((k) => paths[k]), 1);
  const x = (i) => padL + (i / Math.max(1, n - 1)) * (W - padL - padR);
  const yOf = (v) => (H - padB) - (v / maxV) * (H - padT - padB);
  const colors = ['#ef4444', '#22c55e', '#a78bfa'];
  let s = '';
  for (const t of [0, 0.25, 0.5, 0.75, 1].map((f) => f * maxV)) s += `<line x1="${padL}" y1="${yOf(t).toFixed(1)}" x2="${W - padR}" y2="${yOf(t).toFixed(1)}" stroke="var(--border,#8883)" opacity=".5"/><text x="${padL - 6}" y="${(yOf(t) + 3).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text-muted,#999)">${gbpK(t)}</text>`;
  if (restCostFull) { s += `<line x1="${padL}" y1="${yOf(restCostFull).toFixed(1)}" x2="${W - padR}" y2="${yOf(restCostFull).toFixed(1)}" stroke="#f97316" stroke-width="2" stroke-dasharray="6 3"/><text x="${W - padR}" y="${(yOf(restCostFull) - 5).toFixed(1)}" text-anchor="end" font-size="10" fill="#f97316">what the rest of the schedule costs at ${floorToAge}: ${gbpK(restCostFull)}</text>`; }
  labels.forEach((k, j) => { const ser = paths[k]; s += `<polyline points="${ser.map((v, i) => x(i).toFixed(1) + ',' + yOf(v).toFixed(1)).join(' ')}" fill="none" stroke="${colors[j]}" stroke-width="2.5"/><text x="${x(ser.length - 1).toFixed(1)}" y="${(yOf(ser[ser.length - 1]) - 6).toFixed(1)}" text-anchor="end" font-size="10" fill="${colors[j]}">${esc(k)}: ${gbpK(ser[ser.length - 1])}</text>`; });
  for (let i = 0; i < n; i += 5) s += `<text x="${x(i).toFixed(1)}" y="${H - padB + 12}" text-anchor="middle" font-size="10" fill="var(--text-muted,#999)">age ${startAge + i}</text>`;
  s += `<text x="${padL}" y="18" font-size="13" font-weight="600" fill="var(--text,#eee)">The reserve's path from real starts, against the price of the remaining years at ${floorToAge}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet" role="img">${s}</svg>`;
}
