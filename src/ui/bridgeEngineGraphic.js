/**
 * "The machine" for Bridge & engine — data-driven SVG in four frames.
 *  1. Your income plan, year by year (State Pension slice in yellow).
 *  2. The bridge bought today: cash years (grey) then one index-linked rung per year (blue) to the bridge age.
 *  3. The engine rides world equities untouched until then — a band, not a line.
 *  4. After the bridge the engine pays the rest by ordinary withdrawals; the band keeps going —
 *     and where it reaches £0 the plan has run out (the 1-in-10 bad marker shows how late).
 */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const gbpK = (v) => '£' + Math.round(v / 1000) + 'k';

export const BE_FRAMES = [
  { title: 'Your income plan, year by year', text: 'The steps you chose, in today\'s money. The State Pension slice is shown in yellow — it arrives at the bridge age.' },
  { title: 'The bridge is bought today', text: 'The first years sit in cash (grey); every later year to the bridge age is one index-linked gilt maturing before the April it pays for (blue). Nothing on the bridge rides the market.' },
  { title: 'The engine rides untouched until the bridge age', text: 'What is left of the pot is the engine, in world equities, and nothing is drawn from it. The band is the 10th to 90th percentile of 1,000 futures; the line is the median.' },
  { title: 'After the bridge: the engine pays', text: 'From the bridge age the State Pension arrives and the engine pays the rest by a standing withdrawal. No rungs are re-bought and nothing triggers. If the band touches £0 the money has run out — that is the honest risk, and it is late.' }
];

/**
 * @param {object} d { years: [{age, gross, sp, bridge}], startAge, B, bridgeAge, cashYears,
 *   engineCone: {p10,p50,p90}[] (0..B), wealthCone: {p10[],p50[],p90[]} (whole plan, engine after B),
 *   restCostFull, failAgeP10, ruinMc, engineE0, bridgeCost, pot }
 */
export function bridgeEngineSvg(d, frame = 4, o = {}) {
  const W = o.width || 960, H = o.height || 360, padL = 56, padR = 16, padT = 34, padB = 44;
  const n = d.years.length; if (!n) return '';
  const colW = (W - padL - padR) / n;
  const maxIncome = Math.max(...d.years.map((y) => y.gross), 1);
  const incTop = H - padB - (H - padT - padB) * 0.42;
  const y0 = H - padB;
  const yInc = (v) => y0 - (v / maxIncome) * (y0 - incTop);
  const wc = d.wealthCone || { p10: [], p50: [], p90: [] };
  const maxRes = Math.max(d.restCostFull || 0, ...(d.engineCone || []).map((c) => c.p90), ...(wc.p90 || []), 1);
  const yRes = (v) => incTop - 10 - (Math.max(0, v) / maxRes) * (incTop - 10 - padT);
  const xB = padL + d.B * colW;
  const xs = (i) => padL + i * colW + colW / 2;
  let s = '';
  d.years.forEach((y, i) => {
    const x = padL + i * colW + 1, w = Math.max(1, colW - 2);
    const onBridge = i < d.B, cashYear = i < d.cashYears;
    const bought = frame >= 2 && onBridge;
    const fill = bought ? (cashYear ? '#9ca3af' : '#60a5fa') : (frame >= 4 && !onBridge ? '#2dd4bf' : 'var(--border,#8883)');
    const op = bought ? 0.9 : (frame >= 4 && !onBridge ? 0.55 : 0.45);
    s += `<rect x="${x.toFixed(1)}" y="${yInc(y.gross).toFixed(1)}" width="${w.toFixed(1)}" height="${(y0 - yInc(y.gross)).toFixed(1)}" fill="${fill}" opacity="${op}"><title>Age ${y.age}: ${gbpK(y.gross)}${bought ? (cashYear ? ' — cash year' : ' — index-linked rung') : (!onBridge && frame >= 4 ? ' — paid by the engine + State Pension' : '')}</title></rect>`;
    if (y.sp > 1) s += `<rect x="${x.toFixed(1)}" y="${yInc(y.sp).toFixed(1)}" width="${w.toFixed(1)}" height="${(y0 - yInc(y.sp)).toFixed(1)}" fill="#facc15" opacity=".55"/>`;
  });
  if (frame >= 2) {
    s += `<line x1="${xB.toFixed(1)}" y1="${padT - 6}" x2="${xB.toFixed(1)}" y2="${y0}" stroke="#2dd4bf" stroke-width="1.5" stroke-dasharray="4 3"/>`;
    s += `<text x="${(xB + 4).toFixed(1)}" y="${padT + 6}" font-size="11" fill="#2dd4bf">age ${d.bridgeAge} — State Pension starts, the engine takes over</text>`;
  }
  if (frame >= 3 && d.engineCone && d.engineCone.length) {
    const top = d.engineCone.map((c, i) => xs(i).toFixed(1) + ',' + yRes(c.p90).toFixed(1));
    const bot = d.engineCone.map((c, i) => xs(i).toFixed(1) + ',' + yRes(c.p10).toFixed(1)).reverse();
    s += `<polygon points="${top.concat(bot).join(' ')}" fill="rgba(45,212,191,.18)"/>`;
    s += `<polyline points="${d.engineCone.map((c, i) => xs(i).toFixed(1) + ',' + yRes(c.p50).toFixed(1)).join(' ')}" fill="none" stroke="#2dd4bf" stroke-width="2.5"/>`;
    s += `<text x="${padL}" y="${(yRes(d.engineCone[0].p50) - 6).toFixed(1)}" font-size="10" fill="#2dd4bf">engine ${gbpK(d.engineE0)}</text>`;
    const last = d.engineCone[d.engineCone.length - 1];
    s += `<text x="${(xB - 4).toFixed(1)}" y="${(yRes(last.p50) - 6).toFixed(1)}" text-anchor="end" font-size="10" fill="#2dd4bf">median ${gbpK(last.p50)}</text>`;
    s += `<text x="${(xB - 4).toFixed(1)}" y="${(yRes(last.p10) + 12).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text-muted,#999)">1-in-10 bad ${gbpK(last.p10)}</text>`;
  }
  if (frame >= 4 && wc.p50 && wc.p50.length > d.B + 1) {
    const idx = []; for (let i = d.B; i < Math.min(n, wc.p50.length); i++) idx.push(i);
    const top = idx.map((i) => xs(i).toFixed(1) + ',' + yRes(wc.p90[i]).toFixed(1));
    const bot = idx.map((i) => xs(i).toFixed(1) + ',' + yRes(wc.p10[i]).toFixed(1)).reverse();
    s += `<polygon points="${top.concat(bot).join(' ')}" fill="rgba(45,212,191,.12)"/>`;
    s += `<polyline points="${idx.map((i) => xs(i).toFixed(1) + ',' + yRes(wc.p50[i]).toFixed(1)).join(' ')}" fill="none" stroke="#2dd4bf" stroke-width="2" stroke-dasharray="6 3"/>`;
    if (d.restCostFull) {
      s += `<line x1="${(xB - colW * 3).toFixed(1)}" y1="${yRes(d.restCostFull).toFixed(1)}" x2="${(xB + colW * 3).toFixed(1)}" y2="${yRes(d.restCostFull).toFixed(1)}" stroke="#f97316" stroke-width="2"/>`;
      s += `<text x="${(xB + colW * 3 + 4).toFixed(1)}" y="${(yRes(d.restCostFull) - 4).toFixed(1)}" font-size="10" fill="#f97316">buying the rest by contract would cost ${gbpK(d.restCostFull)} at ${d.bridgeAge}</text>`;
    }
    if (d.failAgeP10) {
      const xf = padL + (d.failAgeP10 - d.startAge) * colW;
      s += `<line x1="${xf.toFixed(1)}" y1="${incTop - 4}" x2="${xf.toFixed(1)}" y2="${y0}" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3 3"/>`;
      s += `<text x="${(xf - 4).toFixed(1)}" y="${(incTop + 8).toFixed(1)}" text-anchor="end" font-size="10" fill="#ef4444">ran out by ${Math.round(d.failAgeP10)} in the worst 1-in-10 of failing futures (${Math.round(d.ruinMc)}% fail)</text>`;
    }
  }
  d.years.forEach((y, i) => { if (i % 5 === 0 || i === n - 1) s += `<text x="${xs(i).toFixed(1)}" y="${H - padB + 14}" text-anchor="middle" font-size="10" fill="var(--text-muted,#999)">age ${y.age}</text>`; });
  const leg = [['#facc15', 'State Pension']]; if (frame >= 2) leg.push(['#9ca3af', 'Cash years'], ['#60a5fa', 'Index-linked rungs']); if (frame >= 3) leg.push(['rgba(45,212,191,.4)', 'Engine, 10th–90th percentile']); if (frame >= 4) leg.push(['#2dd4bf', 'Paid by the engine']);
  let lx = padL; for (const [c, t] of leg) { s += `<rect x="${lx}" y="${H - 14}" width="10" height="10" fill="${c}"/><text x="${lx + 14}" y="${H - 5}" font-size="10" fill="var(--text-muted,#999)">${esc(t)}</text>`; lx += 14 + t.length * 5.6 + 18; }
  const f = BE_FRAMES[Math.max(0, Math.min(3, frame - 1))];
  s += `<text x="${padL}" y="18" font-size="13" font-weight="600" fill="var(--text,#eee)">${esc(f.title)}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(f.title)}">${s}</svg>`;
}
