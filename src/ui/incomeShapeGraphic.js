/**
 * The income staircase — the reader's own steps (go-go / go-slow / no-go) drawn as bars by age,
 * with the budget's essentials as a faint reference line and today's budget figure as a marker.
 * Pure SVG. steps: [{fromAge, amount}], ageNow, horizonAge, essentials (£/yr gross or 0),
 * budgetGross (£/yr, the "today" figure, or 0).
 */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const gbpK = (v) => '£' + Math.round(v / 1000) + 'k';

export function amountAtAge(steps, age, fallback = 0) {
  const st = (steps || []).filter((s) => Number.isFinite(+s.fromAge) && +s.fromAge <= age && Number.isFinite(+s.amount) && +s.amount > 0)
    .sort((a, b) => +a.fromAge - +b.fromAge).pop();
  return st ? +st.amount : fallback;
}

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
export function incomeStaircaseSvg({ steps, ageNow, horizonAge, essentials = 0, budgetGross = 0, sp = null, other = [] }, o = {}) {
  const W = o.width || 960, H = o.height || 240, padL = 56, padR = 16, padT = 26, padB = 34;
  const n = Math.max(1, horizonAge - ageNow + 1);
  const vals = Array.from({ length: n }, (_, i) => amountAtAge(steps, ageNow + i, 0));
  const maxV = Math.max(1, ...vals, essentials, budgetGross) * 1.08;
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
    s += `<rect x="${x.toFixed(1)}" y="${y(v).toFixed(1)}" width="${w.toFixed(1)}" height="${Math.max(0, yTop - y(v)).toFixed(1)}" fill="${fill}" opacity=".85"><title>${esc(title)}</title></rect>`;
  });
  if (essentials > 0) s += `<line x1="${padL}" y1="${y(essentials).toFixed(1)}" x2="${W - padR}" y2="${y(essentials).toFixed(1)}" stroke="var(--text,#eee)" stroke-dasharray="5 3" opacity=".8"/><text x="${W - padR}" y="${(y(essentials) - 4).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text,#eee)">your essentials ${gbpK(essentials)} (from the budget)</text>`;
  if (budgetGross > 0) s += `<line x1="${padL}" y1="${y(budgetGross).toFixed(1)}" x2="${padL + colW * 3}" y2="${y(budgetGross).toFixed(1)}" stroke="#facc15" stroke-width="2"/><text x="${(padL + colW * 3 + 4).toFixed(1)}" y="${(y(budgetGross) + 3).toFixed(1)}" font-size="10" fill="#facc15">today's budget ${gbpK(budgetGross)}</text>`;
  for (let i = 0; i < n; i += 5) s += `<text x="${(padL + i * colW + colW / 2).toFixed(1)}" y="${H - padB + 14}" text-anchor="middle" font-size="10" fill="var(--text-muted,#999)">age ${ageNow + i}</text>`;
  const legend = [['#60a5fa', 'from the pot: go-go'], ['#818cf8', 'go-slow'], ['#a78bfa', 'no-go'], ['#f97316', 'below essentials']]; if (anySp) legend.unshift(['#facc15', 'State Pension']); if (anyOther) legend.splice(anySp ? 1 : 0, 0, ['#9ca3af', 'other income']);
  let lx = padL; for (const [c, t] of legend) { s += `<rect x="${lx}" y="${H - 12}" width="10" height="10" fill="${c}"/><text x="${lx + 14}" y="${H - 3}" font-size="10" fill="var(--text-muted,#999)">${esc(t)}</text>`; lx += 14 + t.length * 5.6 + 18; }
  s += `<text x="${padL}" y="16" font-size="13" font-weight="600" fill="var(--text,#eee)">Your income shape — gross £ a year, today's money</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Income shape">${s}</svg>`;
}
