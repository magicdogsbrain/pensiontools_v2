/**
 * The comparison page's picture: all strategies' income (or wealth) medians on ONE axis, with the
 * reader's chosen year marked and each strategy's 10–90 band at that year drawn as a whisker.
 * Pure SVG; strategies as [{ id, name, color, cone: {p10,p50,p90} }].
 */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const gbpK = (v) => '£' + Math.round(v / 1000) + 'k';
export const STRATEGY_COLORS = { 'pots-and-valves': '#f97316', 'ladder-and-ratchet': '#a78bfa', 'floor-and-flex': '#22c55e', 'floor-the-schedule': '#60a5fa', 'floor-to-age': '#facc15', 'full-il-gilt': '#e5e7eb' };

export function stackedConesSvg({ strategies, year, startAge, title }, o = {}) {
  const W = o.width || 960, H = o.height || 300, padL = 60, padR = 16, padT = 30, padB = 34;
  const n = Math.max(...strategies.map((s) => s.cone.p50.length));
  const maxV = Math.max(1, ...strategies.flatMap((s) => s.cone.p90));
  const x = (i) => padL + (i / Math.max(1, n - 1)) * (W - padL - padR);
  const y = (v) => (H - padB) - (Math.max(0, v) / maxV) * (H - padT - padB);
  let s = '';
  for (const t of [0, 0.25, 0.5, 0.75, 1].map((f) => f * maxV)) s += `<line x1="${padL}" y1="${y(t).toFixed(1)}" x2="${W - padR}" y2="${y(t).toFixed(1)}" stroke="var(--border,#8883)" opacity=".5"/><text x="${padL - 6}" y="${(y(t) + 3).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text-muted,#999)">${gbpK(t)}</text>`;
  for (const st of strategies) s += `<polyline points="${st.cone.p50.map((v, i) => x(i).toFixed(1) + ',' + y(v).toFixed(1)).join(' ')}" fill="none" stroke="${st.color}" stroke-width="2.2" opacity=".95"><title>${esc(st.name)} — median</title></polyline>`;
  // the chosen year: whiskers p10–p90 per strategy, slightly offset so they don't overlap
  const yi = Math.max(0, Math.min(n - 1, year));
  const xy = x(yi);
  s += `<line x1="${xy.toFixed(1)}" y1="${padT}" x2="${xy.toFixed(1)}" y2="${H - padB}" stroke="var(--text-muted,#999)" stroke-dasharray="3 3"/>`;
  strategies.forEach((st, k) => { const dx = (k - (strategies.length - 1) / 2) * 6; const p10 = st.cone.p10[yi] ?? 0, p90 = st.cone.p90[yi] ?? 0, p50 = st.cone.p50[yi] ?? 0; s += `<line x1="${(xy + dx).toFixed(1)}" y1="${y(p10).toFixed(1)}" x2="${(xy + dx).toFixed(1)}" y2="${y(p90).toFixed(1)}" stroke="${st.color}" stroke-width="3" opacity=".8"><title>${esc(st.name)} at year ${yi}: ${gbpK(p10)} – ${gbpK(p50)} – ${gbpK(p90)}</title></line><circle cx="${(xy + dx).toFixed(1)}" cy="${y(p50).toFixed(1)}" r="3" fill="${st.color}"/>`; });
  for (let i = 0; i < n; i += 5) s += `<text x="${x(i).toFixed(1)}" y="${H - padB + 12}" text-anchor="middle" font-size="10" fill="var(--text-muted,#999)">age ${startAge + i}</text>`;
  let lx = padL; for (const st of strategies) { s += `<line x1="${lx}" y1="${H - 8}" x2="${lx + 14}" y2="${H - 8}" stroke="${st.color}" stroke-width="2.5"/><text x="${lx + 18}" y="${H - 4}" font-size="10" fill="var(--text-muted,#999)">${esc(st.name)}</text>`; lx += 24 + st.name.length * 5.6 + 12; }
  s += `<text x="${padL}" y="18" font-size="13" font-weight="600" fill="var(--text,#eee)">${esc(title)}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(title)}">${s}</svg>`;
}
