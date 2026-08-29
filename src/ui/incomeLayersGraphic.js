/**
 * Layered income chart — "what pays you, year by year". Pure SVG, no DOM.
 * Stacked bands (today's money): State Pension, other/DB income, income by contract (gilts),
 * income from the market (median future); a dashed line for the need (target + extra
 * withdrawals) and a thin line for the 1-in-10 bad future's total.
 *
 * rows: [{ age, sp, other, contract, market, need, p10 }]
 */
const gbpK = (v) => '£' + Math.round(v / 1000) + 'k';
export const LAYER_COLORS = { sp: '#94a3b8', other: '#2dd4bf', contract: '#f59e0b', market: '#60a5fa' };
export const LAYER_LABELS = { sp: 'State Pension', other: 'Other / DB income', contract: 'By contract (gilts)', market: 'From the market (median)' };

export function incomeLayersSvg({ rows }, o = {}) {
  const W = o.width || 960, H = o.height || 300, padL = 60, padR = 16, padT = 30, padB = 34;
  const n = rows.length;
  if (n < 2) return '';
  const keys = ['sp', 'other', 'contract', 'market'];
  const tot = rows.map((r) => keys.reduce((a, k) => a + (r[k] || 0), 0));
  const maxV = Math.max(1, ...tot, ...rows.map((r) => r.need || 0), ...rows.map((r) => r.p10 || 0)) * 1.08;
  const x = (i) => padL + (i / (n - 1)) * (W - padL - padR);
  const y = (v) => (H - padB) - (Math.max(0, v) / maxV) * (H - padT - padB);
  let out = '';
  // gridlines
  for (let g = 0; g <= 4; g++) { const v = maxV * g / 4; out += `<line x1="${padL}" y1="${y(v).toFixed(1)}" x2="${W - padR}" y2="${y(v).toFixed(1)}" stroke="#8883" stroke-width="1"/><text x="${padL - 6}" y="${(y(v) + 3).toFixed(1)}" text-anchor="end" font-size="10" fill="#999">${gbpK(v)}</text>`; }
  // stacked bands
  const base = new Array(n).fill(0);
  for (const k of keys) {
    const top = rows.map((r, i) => base[i] + (r[k] || 0));
    if (top.every((v, i) => v === base[i])) continue;   // empty layer: skip (keeps legend honest)
    const up = top.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`);
    const down = base.map((v, i) => `${x(n - 1 - i).toFixed(1)},${y(base[n - 1 - i]).toFixed(1)}`);
    out += `<polygon points="${up.concat(down).join(' ')}" fill="${LAYER_COLORS[k]}" opacity="0.75"><title>${LAYER_LABELS[k]}</title></polygon>`;
    for (let i = 0; i < n; i++) base[i] = top[i];
  }
  // need (dashed) and 1-in-10 total (thin)
  if (rows.some((r) => r.need > 0)) out += `<polyline points="${rows.map((r, i) => `${x(i).toFixed(1)},${y(r.need || 0).toFixed(1)}`).join(' ')}" fill="none" stroke="#fff" stroke-width="1.5" stroke-dasharray="5 4" opacity="0.9"/>`;
  if (rows.some((r) => r.p10 > 0)) out += `<polyline points="${rows.map((r, i) => `${x(i).toFixed(1)},${y(r.p10 || 0).toFixed(1)}`).join(' ')}" fill="none" stroke="#ef4444" stroke-width="1.2" opacity="0.9"/>`;
  // x axis: ages
  const ticks = [0, Math.floor((n - 1) / 3), Math.floor(2 * (n - 1) / 3), n - 1];
  for (const i of ticks) out += `<text x="${x(i).toFixed(1)}" y="${H - 10}" text-anchor="middle" font-size="10" fill="#999">age ${rows[i].age}</text>`;
  // legend
  let lx = padL;
  const present = keys.filter((k) => rows.some((r) => (r[k] || 0) > 0));
  for (const k of present) { out += `<rect x="${lx}" y="${padT - 20}" width="10" height="10" fill="${LAYER_COLORS[k]}"/><text x="${lx + 14}" y="${padT - 11}" font-size="10" fill="#bbb">${LAYER_LABELS[k]}</text>`; lx += 20 + LAYER_LABELS[k].length * 5.6; }
  out += `<line x1="${lx}" y1="${padT - 15}" x2="${lx + 14}" y2="${padT - 15}" stroke="#fff" stroke-dasharray="4 3"/><text x="${lx + 18}" y="${padT - 11}" font-size="10" fill="#bbb">need</text>`; lx += 50;
  if (rows.some((r) => r.p10 > 0)) out += `<line x1="${lx}" y1="${padT - 15}" x2="${lx + 14}" y2="${padT - 15}" stroke="#ef4444"/><text x="${lx + 18}" y="${padT - 11}" font-size="10" fill="#bbb">1-in-10 bad future</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" height="auto" style="display:block;max-width:100%;" role="img" aria-label="What pays you, year by year">${out}</svg>`;
}

/**
 * Build the rows from a strategy stress result + plan. Contract share by strategy; market = the
 * median future's total less what SP and contract explain. p10 = 1-in-10 bad future's total.
 */
export function incomeLayersRows(r, p) {
  const N = p.durationYears;
  const sp = (y) => (y >= (p.spStartYear ?? 99)) ? p.spAnnual * (y === p.spStartYear ? (p.spFirstYearRatio ?? 1) : 1) : 0;
  const other = (y) => (p.otherIncomeByYear && p.otherIncomeByYear[y]) || 0;
  const needAt = (y) => (p.needByYear && p.needByYear[y] != null) ? p.needByYear[y] : (Array.isArray(p.targetSchedule) && p.targetSchedule[y] != null ? p.targetSchedule[y] : p.targetAnnual);
  const p50 = r.cones?.income?.p50 || [], p10 = r.cones?.income?.p10 || [];
  const sig = r.signature || {};
  const rows = [];
  for (let y = 0; y < N; y++) {
    const s = sp(y), o = other(y), need = needAt(y);
    const netNeed = Math.max(0, need - s - o);
    let contract = 0;
    switch (r.strategyId) {
      case 'full-il-gilt': contract = r.plan?.years?.[y] ? r.plan.years[y].need : (r.affordable ? netNeed : 0); break;   // .need = what the rung pays (gross − SP)
      case 'floor-the-schedule': contract = netNeed; break;
      case 'gilt-rotation': contract = y <= ((sig.rotateCutAge || 75) - p.startAge) ? netNeed : 0; break;   // above the cut it depends on whether the path rotated
      case 'floor-to-age': contract = y < ((sig.floorToAge || 80) - p.startAge) ? netNeed : 0; break;
      case 'bridge-and-engine': contract = y < (sig.B ?? ((sig.bridgeAge || 67) - p.startAge)) ? netNeed : 0; break;
      case 'floor-and-flex': contract = Math.max(0, (p.essentialsAnnual || 0) - s - o); break;
      case 'ladder-and-ratchet': contract = y < (sig.ladderYears || 0) ? Math.min(netNeed, sig.minDraw || p.params?.drawAnnual || netNeed) : 0; break;
      default: contract = 0;
    }
    const total50 = p50[y] ?? 0;   // the engines' income series now includes SP + other income
    const market = Math.max(0, total50 - s - o - contract);
    rows.push({ age: p.startAge + y, sp: s, other: o, contract, market, need, p10: p10[y] ?? 0 });
  }
  return rows;
}
