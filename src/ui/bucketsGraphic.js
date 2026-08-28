/**
 * "The machine" for Buckets in order — data-driven SVG in four frames.
 *  1. Three pots and the equity path: the pots you start with; the dashed line is the equity
 *     pot's plan trajectory in £ (never a % share).
 *  2. A normal month: equities are on or above their path, so they pay; excess above the band
 *     is swept into cash, up to the cash target.
 *  3. A slump: equities are below their path — untouched; cash pays.
 *  4. A long slump: cash is gone — the defensive sleeve pays; only when that is empty are
 *     equities sold below their path. The cone on the right is what is left, all pots.
 */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const gbpK = (v) => '£' + Math.round(v / 1000) + 'k';

export const BK_FRAMES = [
  { title: 'Three buckets, one path', text: 'Cash, bonds (the defensive sleeve) and equities — the amounts you hold today. The dashed line on the equity bar is its plan trajectory in pounds; the bond bar has a target. Only pound figures are ever compared, never a percentage of the total.' },
  { title: 'A normal month: cash pays, the surplus waterfalls down', text: 'Income always comes from the lowest-risk bucket that has money — cash. When equities sit above their path by more than the band, the excess spills down into bonds up to their target; bonds above their target spill into cash. Refills only ever come from surplus.' },
  { title: 'A slump: cash, then bonds — equities untouched', text: 'Equities have fallen below their path, so nothing spills down. Cash keeps paying; when it is gone, bonds pay. Not one share is sold while a buffer remains, and the buffers are sized in years of spending.' },
  { title: 'A long slump: the buffers are empty, equities last', text: 'Cash and bonds are gone and equities are still below the path: only now are shares sold, at the bottom — the honest failure mode of every bucket strategy. The band on the right is what is left across 1,000 futures.' }
];

/**
 * @param {object} d { pots: {equity, bond, cash, diversifier}, eqPath, band, cashYears, wealthCone: {p10[],p50[],p90[]},
 *   startAge, planIncome, ruinMc, failAgeP10 }
 */
export function bucketsSvg(d, frame = 4, o = {}) {
  const W = o.width || 960, H = o.height || 360, padL = 40, padT = 34, padB = 40;
  const leftW = 420, gap = 40;
  const pots = [
    { key: 'equity', label: 'Equities', v: d.pots.equity || 0, color: '#f43f5e' },
    { key: 'bond', label: 'Defensive', v: (d.pots.bond || 0) + (d.pots.diversifier || 0), color: '#a78bfa' },
    { key: 'cash', label: 'Cash', v: d.pots.cash || 0, color: '#9ca3af' }
  ];
  const maxV = Math.max(...pots.map((p) => p.v), d.eqPath || 0, 1);
  const y0 = H - padB, top = padT + 30;
  const yV = (v) => y0 - (v / maxV) * (y0 - top);
  const barW = 90, slot = (leftW - padL) / 3;
  // frame-dependent illustrative levels
  const level = (p) => {
    if (frame === 3) return p.key === 'equity' ? p.v * 0.72 : p.key === 'cash' ? 0 : p.v * 0.85;
    if (frame === 4) return p.key === 'equity' ? p.v * 0.62 : 0;
    if (frame === 2) return p.key === 'equity' ? p.v * 1.18 : p.key === 'cash' ? p.v * 0.9 : p.v;
    return p.v;
  };
  let s = '';
  pots.forEach((p, i) => {
    const x = padL + i * slot + (slot - barW) / 2;
    const v = level(p);
    s += `<rect x="${x.toFixed(1)}" y="${yV(p.v).toFixed(1)}" width="${barW}" height="${(y0 - yV(p.v)).toFixed(1)}" fill="none" stroke="${p.color}" stroke-dasharray="3 3" opacity=".5"/>`;
    s += `<rect x="${x.toFixed(1)}" y="${yV(v).toFixed(1)}" width="${barW}" height="${(y0 - yV(v)).toFixed(1)}" fill="${p.color}" opacity=".8"><title>${p.label}: ${gbpK(v)}</title></rect>`;
    s += `<text x="${(x + barW / 2).toFixed(1)}" y="${y0 + 14}" text-anchor="middle" font-size="11" fill="var(--text,#eee)">${p.label}</text>`;
    s += `<text x="${(x + barW / 2).toFixed(1)}" y="${(yV(v) - 5).toFixed(1)}" text-anchor="middle" font-size="10" fill="${p.color}">${gbpK(v)}</text>`;
    if (p.key === 'equity' && d.eqPath) {
      s += `<line x1="${(x - 12).toFixed(1)}" y1="${yV(d.eqPath).toFixed(1)}" x2="${(x + barW + 12).toFixed(1)}" y2="${yV(d.eqPath).toFixed(1)}" stroke="var(--text,#eee)" stroke-width="1.5" stroke-dasharray="5 3"/>`;
      s += `<text x="${(x + barW + 14).toFixed(1)}" y="${(yV(d.eqPath) + 3).toFixed(1)}" font-size="10" fill="var(--text,#eee)">its path ${gbpK(d.eqPath)}</text>`;
      if (frame >= 2 && d.band) {
        const up = d.eqPath * (1 + d.band);
        s += `<line x1="${(x - 12).toFixed(1)}" y1="${yV(up).toFixed(1)}" x2="${(x + barW + 12).toFixed(1)}" y2="${yV(up).toFixed(1)}" stroke="#9ca3af" stroke-width="1" stroke-dasharray="2 3"/>`;
        s += `<text x="${(x + barW + 14).toFixed(1)}" y="${(yV(up) + 3).toFixed(1)}" font-size="10" fill="#9ca3af">+${Math.round(d.band * 100)}% band</text>`;
      }
    }
    if (p.key === 'cash' && d.cashYears) s += `<text x="${(x + barW / 2).toFixed(1)}" y="${y0 + 27}" text-anchor="middle" font-size="9" fill="var(--text-muted,#999)">≈ ${d.cashYears.toFixed(1)} years of spending</text>`;
  });
  // the arrow: which pot pays this month
  const payer = frame === 1 ? null : frame === 2 ? 2 : frame === 3 ? 1 : 0;   // 2: cash, 3: bonds, 4: equities
  if (payer != null) {
    const p = pots[payer]; const x = padL + payer * slot + slot / 2;
    s += `<path d="M ${x.toFixed(1)} ${(top - 22).toFixed(1)} L ${x.toFixed(1)} ${(yV(level(p)) - 14).toFixed(1)}" stroke="${p.color}" stroke-width="3" marker-end="url(#bkArrow)"/>`;
    s += `<text x="${x.toFixed(1)}" y="${(top - 26).toFixed(1)}" text-anchor="middle" font-size="11" fill="${p.color}">${frame === 2 ? 'pays the month (lowest-risk bucket first)' : frame === 3 ? 'pays — cash is gone, equities untouched' : 'pays — every buffer is empty'}</text>`;
    if (frame === 2 && d.band) {
      const xe = padL + slot / 2 + barW / 2, xb = padL + slot + slot / 2, xc = padL + 2 * slot + slot / 2 - barW / 2;
      s += `<path d="M ${xe.toFixed(1)} ${(top + 10).toFixed(1)} C ${(xe + 40).toFixed(1)} ${(top - 10).toFixed(1)}, ${(xb - 40).toFixed(1)} ${(top - 10).toFixed(1)}, ${(xb - barW / 2).toFixed(1)} ${(top + 10).toFixed(1)}" fill="none" stroke="#9ca3af" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#bkArrowG)"/>`;
      s += `<path d="M ${(xb + barW / 2).toFixed(1)} ${(top + 10).toFixed(1)} C ${(xb + 40).toFixed(1)} ${(top - 10).toFixed(1)}, ${(xc - 40).toFixed(1)} ${(top - 10).toFixed(1)}, ${xc.toFixed(1)} ${(top + 10).toFixed(1)}" fill="none" stroke="#9ca3af" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#bkArrowG)"/>`;
      s += `<text x="${((xe + xc) / 2).toFixed(1)}" y="${(top - 4).toFixed(1)}" text-anchor="middle" font-size="10" fill="#9ca3af">surplus waterfalls: equities above path → bonds → cash (up to targets)</text>`;
    }
  }
  // right: the wealth cone
  const wc = d.wealthCone; const rx0 = leftW + gap, rW = W - rx0 - 16;
  if (wc && wc.p50 && wc.p50.length) {
    const n = wc.p50.length; const mx = Math.max(...wc.p90, 1);
    const xs = (i) => rx0 + (i / Math.max(1, n - 1)) * rW; const ys = (v) => y0 - (Math.max(0, v) / mx) * (y0 - top);
    const idx = Array.from({ length: n }, (_, i) => i);
    s += `<polygon points="${idx.map((i) => xs(i).toFixed(1) + ',' + ys(wc.p90[i]).toFixed(1)).concat(idx.map((i) => xs(i).toFixed(1) + ',' + ys(wc.p10[i]).toFixed(1)).reverse()).join(' ')}" fill="rgba(244,63,94,.15)"/>`;
    s += `<polyline points="${idx.map((i) => xs(i).toFixed(1) + ',' + ys(wc.p50[i]).toFixed(1)).join(' ')}" fill="none" stroke="#f43f5e" stroke-width="2.5"/>`;
    s += `<line x1="${rx0}" y1="${y0}" x2="${(rx0 + rW).toFixed(1)}" y2="${y0}" stroke="var(--border,#8883)"/>`;
    for (let i = 0; i < n; i += 10) s += `<text x="${xs(i).toFixed(1)}" y="${y0 + 14}" text-anchor="middle" font-size="10" fill="var(--text-muted,#999)">age ${d.startAge + i}</text>`;
    s += `<text x="${rx0}" y="${top - 8}" font-size="11" fill="var(--text,#eee)">What is left, all pots — 1,000 futures</text>`;
    if (d.ruinMc != null) s += `<text x="${(rx0 + rW).toFixed(1)}" y="${top - 8}" text-anchor="end" font-size="10" fill="${d.ruinMc > 15 ? '#ef4444' : 'var(--text-muted,#999)'}">runs out in ${Math.round(d.ruinMc)}% of futures${d.failAgeP10 ? ', by ' + Math.round(d.failAgeP10) + ' in the worst tenth' : ''}</text>`;
  }
  s = `<defs><marker id="bkArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="currentColor"/></marker><marker id="bkArrowG" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#9ca3af"/></marker></defs>` + s;
  const f = BK_FRAMES[Math.max(0, Math.min(3, frame - 1))];
  s += `<text x="${padL}" y="18" font-size="13" font-weight="600" fill="var(--text,#eee)">${esc(f.title)}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(f.title)}">${s}</svg>`;
}
