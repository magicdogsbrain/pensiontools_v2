/**
 * The income staircase — the reader's own steps (go-go / go-slow / no-go) drawn as bars by age,
 * with the budget's essentials as a faint reference line and today's budget figure as a marker.
 * Pure SVG. steps: [{fromAge, amount}], ageNow, horizonAge, essentials (£/yr gross or 0),
 * budgetGross (£/yr, the "today" figure, or 0).
 */
import { amountAtAge as shapeAmount } from '../services/IncomeSchedule.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const gbpK = (v) => '£' + Math.round(v / 1000) + 'k';

/**
 * ONE definition of "£ at an age" for the whole app: the engines' compiler (IncomeSchedule), which
 * honours each step's decline / glide. This module used to carry a flat-step copy, so the picture
 * (and the Budget hand-off that borrowed it) ignored the slopes the engines were running.
 */
export const amountAtAge = shapeAmount;

/** Suggested go-slow / no-go steps from a first step: spending typically falls ~1-2%/yr real from
 *  the mid-70s (Blanchett's "retirement spending smile"; ONS/ILC-UK household data). We suggest
 *  −15% at 75 and −30% at 85, never below essentials. Suggestions, not a rule — the user edits. */
export function suggestSteps(step1Amount, ageNow, essentials = 0) {
  const a = +step1Amount || 0;
  const floor = (v) => Math.max(v, essentials || 0);
  const out = [{ fromAge: ageNow, amount: a }];
  if (ageNow < 75) out.push({ fromAge: 75, amount: Math.round(floor(a * 0.85) / 500) * 500 });
  if (ageNow < 85) out.push({ fromAge: 85, amount: Math.round(floor(a * 0.70) / 500) * 500 });
  return out;
}

/**
 * Layers inside each step (optional): `sp` = { annual, fromAge } — the State Pension once in payment;
 * `other` = [{ annual, fromAge, toAge, label }] — DB pensions / other taxable income. The bar is drawn
 * bottom-up: State Pension (yellow), other income (grey), and what the pension pot must supply on top.
 */
export function incomeStaircaseSvg({ steps, ageNow, horizonAge, essentials = 0, budgetGross = 0, sp = null, other = [], prevVals = null, floorVals = null }, o = {}) {
  const W = o.width || 960, H = o.height || 240, padL = 56, padR = 16, padT = 26, padB = 34;
  const n = Math.max(1, horizonAge - ageNow + 1);
  // Floored at the guaranteed income of the year (State Pension + other income): a target below
  // what arrives anyway would only hide it — the same floor the compiled schedule applies.
  const vals = Array.from({ length: n }, (_, i) => Math.max(amountAtAge(steps, ageNow + i, 0), (Array.isArray(floorVals) && floorVals[i]) || 0));
  // Animation: the bars and the glide line are DRAWN at the previous shape (when given) and carry
  // their targets in data attributes; animateIncomeShape() then eases them to the new values.
  const start = Array.isArray(prevVals) && prevVals.length === n ? prevVals : vals;
  const maxV = Math.max(1, ...vals, ...start, essentials, budgetGross) * 1.08;
  const colW = (W - padL - padR) / n, y0 = H - padB;
  const y = (v) => y0 - (v / maxV) * (y0 - padT);
  let s = '';
  for (const t of [0, 0.25, 0.5, 0.75, 1].map((f) => f * maxV)) s += `<line x1="${padL}" y1="${y(t).toFixed(1)}" x2="${W - padR}" y2="${y(t).toFixed(1)}" stroke="var(--border,#8883)" opacity=".5"/><text x="${padL - 6}" y="${(y(t) + 3).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text-muted,#999)">${gbpK(t)}</text>`;
  const phase = (age) => age < 75 ? 'go-go' : age < 85 ? 'go-slow' : 'no-go';
  const spAt = (age) => (sp && sp.annual > 0 && age >= sp.fromAge) ? sp.annual : 0;
  const otherAt = (age) => (other || []).reduce((t, o2) => t + ((o2.annual > 0 && age >= (o2.fromAge ?? 0) && age <= (o2.toAge ?? 999)) ? o2.annual : 0), 0);
  let anySp = false, anyOther = false;
  vals.forEach((v, i) => {
    const age = ageNow + i; const x = padL + i * colW + 1, w = Math.max(1, colW - 2);
    const below = essentials > 0 && v < essentials;
    const fill = below ? '#f97316' : (phase(age) === 'go-go' ? '#60a5fa' : phase(age) === 'go-slow' ? '#818cf8' : '#a78bfa');
    const spV = Math.min(v, spAt(age)), otV = Math.min(Math.max(0, v - spV), otherAt(age)), potV = Math.max(0, v - spV - otV);
    if (spV > 0) anySp = true; if (otV > 0) anyOther = true;
    const title = `Age ${age}: ${gbpK(v)} a year — pension pot ${gbpK(potV)}` + (spV ? `, State Pension ${gbpK(spV)}` : '') + (otV ? `, other income ${gbpK(otV)}` : '') + (below ? ' — below your essentials' : '') + ` (${phase(age)})`;
    let yTop = y0;
    if (spV > 0) { s += `<rect x="${x.toFixed(1)}" y="${y(spV).toFixed(1)}" width="${w.toFixed(1)}" height="${(y0 - y(spV)).toFixed(1)}" fill="#facc15" opacity=".8"><title>${esc(title)}</title></rect>`; yTop = y(spV); }
    if (otV > 0) { const yb = y(spV + otV); s += `<rect x="${x.toFixed(1)}" y="${yb.toFixed(1)}" width="${w.toFixed(1)}" height="${(yTop - yb).toFixed(1)}" fill="#9ca3af" opacity=".8"><title>${esc(title)}</title></rect>`; yTop = yb; }
    const v0 = start[i];   // drawn at the previous shape, target in data-v
    s += `<rect x="${x.toFixed(1)}" y="${Math.min(yTop, y(v0)).toFixed(1)}" width="${w.toFixed(1)}" height="${Math.max(0, yTop - y(v0)).toFixed(1)}" fill="${fill}" opacity=".85" data-pot="1" data-i="${i}" data-v="${Math.round(v)}" data-base="${yTop.toFixed(1)}"><title>${esc(title)}</title></rect>`;
  });
  // The glide line: the shape's own path over the bar tops (steps look like steps, slopes like slopes).
  const pts = (arr) => arr.map((v, i) => `${(padL + i * colW + colW / 2).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  s += `<polyline data-line="1" data-target="${esc(pts(vals))}" points="${pts(start)}" fill="none" stroke="var(--text,#eee)" stroke-width="2" stroke-linejoin="round" opacity=".9"/>`;
  if (essentials > 0) s += `<line x1="${padL}" y1="${y(essentials).toFixed(1)}" x2="${W - padR}" y2="${y(essentials).toFixed(1)}" stroke="var(--text,#eee)" stroke-dasharray="5 3" opacity=".8"/><text x="${W - padR}" y="${(y(essentials) - 4).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text,#eee)">your essentials ${gbpK(essentials)} (from the budget)</text>`;
  if (budgetGross > 0) s += `<line x1="${padL}" y1="${y(budgetGross).toFixed(1)}" x2="${padL + colW * 3}" y2="${y(budgetGross).toFixed(1)}" stroke="#facc15" stroke-width="2"/><text x="${(padL + colW * 3 + 4).toFixed(1)}" y="${(y(budgetGross) + 3).toFixed(1)}" font-size="10" fill="#facc15">today's budget ${gbpK(budgetGross)}</text>`;
  for (let i = 0; i < n; i += 5) s += `<text x="${(padL + i * colW + colW / 2).toFixed(1)}" y="${H - padB + 14}" text-anchor="middle" font-size="10" fill="var(--text-muted,#999)">age ${ageNow + i}</text>`;
  const legend = [['#60a5fa', 'from the pot: go-go'], ['#818cf8', 'go-slow'], ['#a78bfa', 'no-go'], ['#f97316', 'below essentials']]; if (anySp) legend.unshift(['#facc15', 'State Pension']); if (anyOther) legend.splice(anySp ? 1 : 0, 0, ['#9ca3af', 'other income']);
  let lx = padL; for (const [c, t] of legend) { s += `<rect x="${lx}" y="${H - 12}" width="10" height="10" fill="${c}"/><text x="${lx + 14}" y="${H - 3}" font-size="10" fill="var(--text-muted,#999)">${esc(t)}</text>`; lx += 14 + t.length * 5.6 + 18; }
  s += `<text x="${padL}" y="16" font-size="13" font-weight="600" fill="var(--text,#eee)">Your income shape — gross £ a year, today's money</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Income shape" data-maxv="${maxV}" data-y0="${y0}" data-padt="${padT}" data-padl="${padL}" data-colw="${colW}" data-vals="${esc(vals.map(Math.round).join(','))}">${s}</svg>`;
}

/**
 * Ease the bars and the glide line from the shape they were drawn at to their data-v / data-target
 * values. Pure DOM on the given <svg>; returns the final values so the caller can remember them.
 */
export function animateIncomeShape(svg, ms = 450) {
  if (!svg || typeof requestAnimationFrame !== 'function') return null;
  const maxV = +svg.dataset.maxv, y0 = +svg.dataset.y0, padT = +svg.dataset.padt;
  const y = (v) => y0 - (v / maxV) * (y0 - padT);
  const bars = [...svg.querySelectorAll('rect[data-pot]')].map((r) => ({ r, from: y0 - (+r.getAttribute('height') || 0) - (y0 - (+r.dataset.base)), to: +r.dataset.v, base: +r.dataset.base, v0: null }));
  for (const b of bars) { const hy = +b.r.getAttribute('y'); b.v0 = ((y0 - hy) / (y0 - padT)) * maxV; if (b.base < y0 - 0.01) { /* stacked: drawn from its base */ b.v0 = ((y0 - hy) / (y0 - padT)) * maxV; } }
  const line = svg.querySelector('polyline[data-line]');
  const from = line ? line.getAttribute('points').split(' ').map((p) => p.split(',').map(Number)) : [];
  const to = line ? line.dataset.target.split(' ').map((p) => p.split(',').map(Number)) : [];
  const t0 = performance.now();
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const step = (now) => {
    const k = ease(Math.min(1, (now - t0) / ms));
    for (const b of bars) { const v = b.v0 + (b.to - b.v0) * k; const top = Math.min(b.base, y(v)); b.r.setAttribute('y', top.toFixed(1)); b.r.setAttribute('height', Math.max(0, b.base - top).toFixed(1)); }
    if (line && from.length === to.length) line.setAttribute('points', to.map((p, i) => `${p[0].toFixed(1)},${(from[i][1] + (p[1] - from[i][1]) * k).toFixed(1)}`).join(' '));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
  return svg.dataset.vals.split(',').map(Number);
}
