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

// ---------------------------------------------------------------- one question at a time
const gk = (v) => '£' + Math.round(v / 1000) + 'k';
/** Q1: "What would I get each year?" — one small panel per strategy, same axes, income band + median. */
export function incomeSmallMultiplesSvg({ strategies, startAge, planIncome }, o = {}) {
  const cols = Math.min(3, strategies.length), rows = Math.ceil(strategies.length / cols);
  const W = o.width || 960, cw = W / cols, ch = 170, H = rows * ch + 8;
  const n = Math.max(...strategies.map((s) => s.cone.p50.length));
  const maxV = Math.max(planIncome || 0, ...strategies.flatMap((s) => s.cone.p90)) * 1.05 || 1;
  let s = '';
  strategies.forEach((st, k) => {
    const ox = (k % cols) * cw, oy = Math.floor(k / cols) * ch; const padL = 44, padR = 10, padT = 22, padB = 22;
    const x = (i) => ox + padL + (i / Math.max(1, n - 1)) * (cw - padL - padR);
    const y = (v) => oy + ch - padB - (Math.max(0, v) / maxV) * (ch - padT - padB);
    s += `<text x="${ox + padL}" y="${oy + 14}" font-size="12" font-weight="600" fill="${st.color}">${esc(st.name)}</text>`;
    for (const t of [0, 0.5, 1].map((f) => f * maxV)) s += `<line x1="${ox + padL}" y1="${y(t).toFixed(1)}" x2="${ox + cw - padR}" y2="${y(t).toFixed(1)}" stroke="var(--border,#8883)" opacity=".4"/><text x="${ox + padL - 4}" y="${(y(t) + 3).toFixed(1)}" text-anchor="end" font-size="9" fill="var(--text-muted,#999)">${gk(t)}</text>`;
    if (planIncome) s += `<line x1="${ox + padL}" y1="${y(planIncome).toFixed(1)}" x2="${ox + cw - padR}" y2="${y(planIncome).toFixed(1)}" stroke="var(--text,#eee)" stroke-dasharray="3 3" opacity=".6"/>`;
    const top = st.cone.p90.map((v, i) => x(i).toFixed(1) + ',' + y(v).toFixed(1)); const bot = st.cone.p10.map((v, i) => x(i).toFixed(1) + ',' + y(v).toFixed(1)).reverse();
    s += `<polygon points="${top.concat(bot).join(' ')}" fill="${st.color}" opacity=".18"/><polyline points="${st.cone.p50.map((v, i) => x(i).toFixed(1) + ',' + y(v).toFixed(1)).join(' ')}" fill="none" stroke="${st.color}" stroke-width="2"/>`;
    for (let i = 0; i < n; i += 10) s += `<text x="${x(i).toFixed(1)}" y="${oy + ch - 6}" text-anchor="middle" font-size="9" fill="var(--text-muted,#999)">${startAge + i}</text>`;
    const flat = Math.abs(st.cone.p90[Math.min(n - 1, 20)] - st.cone.p10[Math.min(n - 1, 20)]) < 1;
    s += `<text x="${ox + cw - padR}" y="${oy + 14}" text-anchor="end" font-size="9" fill="var(--text-muted,#999)">${flat ? 'by contract — no spread' : 'band = 1-in-10 bad to 1-in-10 good'}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Income each year, one panel per strategy">${s}</svg>`;
}
/** Q2: "How likely is it to go wrong?" — one bar per strategy (Monte Carlo), history as a tick, the failure shape as the label. */
export function riskBarsSvg({ rows }, o = {}) {
  const W = o.width || 960, rh = 34, padL = 190, padR = 60, H = rows.length * rh + 30;
  const maxP = Math.max(20, ...rows.map((r) => Math.max(r.mc, r.hist))) ;
  const x = (p) => padL + (p / maxP) * (W - padL - padR);
  let s = '';
  for (const t of [0, 10, 20, 30, 40, 50].filter((t) => t <= maxP)) s += `<line x1="${x(t).toFixed(1)}" y1="18" x2="${x(t).toFixed(1)}" y2="${H - 10}" stroke="var(--border,#8883)" opacity=".4"/><text x="${x(t).toFixed(1)}" y="12" text-anchor="middle" font-size="9" fill="var(--text-muted,#999)">${t}%</text>`;
  rows.forEach((r, i) => { const yy = 22 + i * rh; s += `<text x="${padL - 8}" y="${yy + 13}" text-anchor="end" font-size="12" fill="${r.color}">${esc(r.name)}</text>`;
    s += `<rect x="${padL}" y="${yy}" width="${Math.max(2, x(r.mc) - padL).toFixed(1)}" height="20" fill="${r.color}" opacity=".75"><title>${esc(r.name)}: ${r.mc.toFixed(1)}% of futures (${r.hist.toFixed(1)}% of real histories)</title></rect>`;
    s += `<line x1="${x(r.hist).toFixed(1)}" y1="${yy - 2}" x2="${x(r.hist).toFixed(1)}" y2="${yy + 22}" stroke="var(--text,#eee)" stroke-width="2"/>`;
    s += `<text x="${(x(r.mc) + 6).toFixed(1)}" y="${yy + 14}" font-size="11" fill="var(--text,#eee)">${r.mc.toFixed(0)}%</text>`;
    s += `<text x="${padL}" y="${yy + 31}" font-size="9" fill="var(--text-muted,#999)">${esc(r.label)}</text>`; });
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Chance it goes wrong">${s}</svg>`;
}
/** Q3: "What's left?" — for each strategy a 1-in-10-bad / middle / 1-in-10-good triple at one age. */
export function leftBarsSvg({ rows, age }, o = {}) {
  const W = o.width || 960, gw = W / rows.length, H = 200, padT = 24, padB = 28;
  const maxV = Math.max(1, ...rows.flatMap((r) => [r.p90])) * 1.05;
  const y = (v) => H - padB - (Math.max(0, v) / maxV) * (H - padT - padB);
  let s = `<text x="8" y="14" font-size="12" font-weight="600" fill="var(--text,#eee)">What is left at age ${age} — 1-in-10 bad · middle · 1-in-10 good (today's money)</text>`;
  rows.forEach((r, k) => { const ox = k * gw + 10, bw = (gw - 20) / 3.6;
    [['p10', .45], ['p50', .8], ['p90', .45]].forEach(([key, op], j) => { const v = r[key]; const bx = ox + j * bw * 1.15; s += `<rect x="${bx.toFixed(1)}" y="${y(v).toFixed(1)}" width="${bw.toFixed(1)}" height="${(H - padB - y(v)).toFixed(1)}" fill="${r.color}" opacity="${op}"><title>${esc(r.name)} ${key}: ${gk(v)}</title></rect><text x="${(bx + bw / 2).toFixed(1)}" y="${(y(v) - 3).toFixed(1)}" text-anchor="middle" font-size="9" fill="var(--text-muted,#999)">${gk(v)}</text>`; });
    s += `<text x="${(ox + (gw - 20) / 2).toFixed(1)}" y="${H - 8}" text-anchor="middle" font-size="11" fill="${r.color}">${esc(r.name)}</text>`; });
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="What is left">${s}</svg>`;
}
