/**
 * "The machine" for the four remaining strategies — pure, data-driven SVG in four stepped frames.
 * Each takes the strategy's stressTest result fields and returns an SVG string.
 */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const gbpK = (v) => '£' + Math.round(v / 1000) + 'k';
const frameTitle = (frames, frame, W, padL, padR) => { const f = frames[Math.max(0, Math.min(frames.length - 1, frame - 1))]; return `<text x="${padL}" y="18" font-size="13" font-weight="600" fill="var(--text,#eee)">${esc(f.title)}</text>`; };
const legend = (items, H, padL) => { let s = '', lx = padL; for (const [c, t] of items) { s += `<rect x="${lx}" y="${H - 14}" width="10" height="10" fill="${c}"/><text x="${lx + 14}" y="${H - 5}" font-size="10" fill="var(--text-muted,#999)">${esc(t)}</text>`; lx += 14 + t.length * 5.6 + 18; } return s; };
const grid = (yOf, maxV, W, padL, padR) => [0, 0.25, 0.5, 0.75, 1].map((f) => f * maxV).map((t) => `<line x1="${padL}" y1="${yOf(t).toFixed(1)}" x2="${W - padR}" y2="${yOf(t).toFixed(1)}" stroke="var(--border,#8883)" opacity=".5"/><text x="${padL - 6}" y="${(yOf(t) + 3).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text-muted,#999)">${gbpK(t)}</text>`).join('');
const band = (cone, xs, yOf, color, from = 0, to = cone.length - 1) => { const top = [], bot = []; for (let i = from; i <= to; i++) { top.push(xs(i).toFixed(1) + ',' + yOf(cone[i].p90).toFixed(1)); bot.push(xs(i).toFixed(1) + ',' + yOf(cone[i].p10).toFixed(1)); } return `<polygon points="${top.concat(bot.reverse()).join(' ')}" fill="${color}" opacity=".2"/><polyline points="${cone.slice(from, to + 1).map((c, i) => xs(from + i).toFixed(1) + ',' + yOf(c.p50).toFixed(1)).join(' ')}" fill="none" stroke="${color}" stroke-width="2.5"/>`; };
const ageAxis = (years, xs, H, padB) => years.map((y, i) => (i % 5 === 0 || i === years.length - 1) ? `<text x="${xs(i).toFixed(1)}" y="${H - padB + 14}" text-anchor="middle" font-size="10" fill="var(--text-muted,#999)">age ${y.age}</text>` : '').join('');

// ---------------------------------------------------------------- Ladder & Ratchet
export const LR_FRAMES = [
  { title: 'Your income, year by year', text: 'The income you asked for, in today\'s money, net of the State Pension where it applies.' },
  { title: 'The base ladder: the first years bought up front', text: 'The first N years are bought today as index-linked rungs. They pay regardless of what markets do.' },
  { title: 'The sleeve rides above a line', text: 'The rest of the pot is the equity sleeve. It is watched against a glide line rising 5% a year; when it climbs a fifth above the line, the excess is skimmed into more rungs.' },
  { title: 'Booms buy more years; a long slump does not', text: 'In the median future the ratchet locks several more years. Where it never fires, the sleeve pays the income itself — and can run out late: a cliff, not a cut.' }
];
export function ladderRatchetSvg(d, frame = 4, o = {}) {
  const W = o.width || 960, H = o.height || 360, padL = 56, padR = 16, padT = 34, padB = 44;
  const years = d.years; const n = years.length; if (!n) return '';
  const colW = (W - padL - padR) / n, xs = (i) => padL + i * colW + colW / 2;
  const maxInc = Math.max(...years.map((y) => y.draw), 1);
  const incTop = H - padB - (H - padT - padB) * 0.42, y0 = H - padB;
  const yInc = (v) => y0 - (v / maxInc) * (y0 - incTop);
  const maxRes = Math.max(...d.sleeveCone.map((c) => c.p90), d.glide.E0 * Math.pow(1 + d.glide.gp, n), 1);
  const yRes = (v) => incTop - 10 - (Math.max(0, v) / maxRes) * (incTop - 10 - padT);
  const L = d.ladderYears, secured = frame >= 4 ? (d.securedByYear[n] || 0) : 0;
  let s = '';
  years.forEach((y, i) => { const x = padL + i * colW + 1, w = Math.max(1, colW - 2); const base = frame >= 2 && i < L, ratch = frame >= 4 && i >= L && i < L + secured; const sleevePays = frame >= 4 && i >= L + secured;
    s += `<rect x="${x.toFixed(1)}" y="${yInc(y.draw).toFixed(1)}" width="${w.toFixed(1)}" height="${(y0 - yInc(y.draw)).toFixed(1)}" fill="${base ? '#60a5fa' : ratch ? '#a78bfa' : sleevePays ? '#f97316' : 'var(--border,#8883)'}" opacity="${base || ratch ? 0.9 : sleevePays ? 0.6 : 0.45}"><title>Age ${y.age}: ${gbpK(y.draw)} net of SP — ${base ? 'base ladder rung' : ratch ? 'rung bought by the ratchet (median future)' : sleevePays ? 'paid by the sleeve — where it can' : 'to be funded'}</title></rect>`; });
  if (frame >= 3) {
    s += band(d.sleeveCone, xs, yRes, '#f97316');
    const G = years.map((_, i) => d.glide.E0 * Math.pow(1 + d.glide.gp, i));
    s += `<polyline points="${G.map((v, i) => xs(i).toFixed(1) + ',' + yRes(v).toFixed(1)).join(' ')}" fill="none" stroke="var(--text,#eee)" stroke-width="1.5" stroke-dasharray="5 3"/>`;
    s += `<polyline points="${G.map((v, i) => xs(i).toFixed(1) + ',' + yRes(v * d.glide.b).toFixed(1)).join(' ')}" fill="none" stroke="#a78bfa" stroke-width="1.5" stroke-dasharray="2 3"/>`;
    s += `<text x="${padL}" y="${(yRes(d.glide.E0) - 6).toFixed(1)}" font-size="10" fill="#f97316">sleeve ${gbpK(d.glide.E0)}</text><text x="${(W - padR)}" y="${(yRes(G[n - 1]) - 4).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text-muted,#999)">the line (+5%/yr) · dotted: ${d.glide.b}× the line = trigger</text>`;
  }
  if (frame >= 4 && d.failAgeP10) { const i = Math.max(0, Math.min(n - 1, Math.round(d.failAgeP10 - years[0].age))); s += `<line x1="${xs(i).toFixed(1)}" y1="${padT}" x2="${xs(i).toFixed(1)}" y2="${y0}" stroke="#ef4444" stroke-dasharray="4 3"/><text x="${(xs(i) + 4).toFixed(1)}" y="${padT + 8}" font-size="10" fill="#ef4444">where the failing futures typically run dry (age ${Math.round(d.failAgeP10)})</text>`; }
  s += ageAxis(years, xs, H, padB);
  const leg = [['#60a5fa', 'Base ladder rungs']]; if (frame >= 3) leg.push(['rgba(249,115,22,.5)', 'Sleeve, 10th–90th pct']); if (frame >= 4) { leg.push(['#a78bfa', 'Rungs the ratchet bought (median)']); leg.push(['#f97316', 'Paid by the sleeve']); }
  s += legend(leg, H, padL) + frameTitle(LR_FRAMES, frame, W, padL, padR);
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet" role="img">${s}</svg>`;
}

// ---------------------------------------------------------------- Floor & Flex
export const FF_FRAMES = [
  { title: 'The bills, year by year', text: 'Your essentials in today\'s money, net of the State Pension where it applies. Everything above this is a treat.' },
  { title: 'The bills are bought up front, to the age you chose', text: 'Index-linked rungs pay the essentials every year by contract. They cannot fail.' },
  { title: 'The rest is the flex sleeve', text: 'It rides world equities. Each year you take a fixed share of whatever it is worth — so it can never run out, and never has a fixed value.' },
  { title: 'Treats flex; the bills never do', text: 'The treats band sits on top of the floor. Good decades widen it, bad ones shrink it. The honest risk is lean years, shown in orange.' }
];
export function floorFlexSvg(d, frame = 4, o = {}) {
  const W = o.width || 960, H = o.height || 360, padL = 56, padR = 16, padT = 34, padB = 44;
  const years = d.amountsByAge; const n = years.length; if (!n) return '';
  const colW = (W - padL - padR) / n, xs = (i) => padL + i * colW + colW / 2;
  const maxInc = Math.max(...years.map((y, i) => y.gross + (d.treatsCone[i]?.p90 || 0)), 1);
  const incTop = H - padB - (H - padT - padB) * 0.55, y0 = H - padB;
  const yInc = (v) => y0 - (v / maxInc) * (y0 - incTop);
  const maxRes = Math.max(...d.sleeveCone.map((c) => c.p90), 1);
  const yRes = (v) => incTop - 10 - (Math.max(0, v) / maxRes) * (incTop - 10 - padT);
  let s = '';
  years.forEach((y, i) => { const x = padL + i * colW + 1, w = Math.max(1, colW - 2); const bought = frame >= 2 && y.age < d.horizonAge;
    s += `<rect x="${x.toFixed(1)}" y="${yInc(y.gross).toFixed(1)}" width="${w.toFixed(1)}" height="${(y0 - yInc(y.gross)).toFixed(1)}" fill="${bought ? '#60a5fa' : 'var(--border,#8883)'}" opacity="${bought ? 0.9 : 0.45}"><title>Age ${y.age}: essentials ${gbpK(y.gross)}${bought ? ' — bought by contract' : ''}</title></rect>`;
    if (y.sp > 1) s += `<rect x="${x.toFixed(1)}" y="${yInc(y.sp).toFixed(1)}" width="${w.toFixed(1)}" height="${(y0 - yInc(y.sp)).toFixed(1)}" fill="#facc15" opacity=".55"/>`;
    if (frame >= 4 && d.treatsCone[i]) { const t = d.treatsCone[i]; const lean = t.p10 < 10000; s += `<rect x="${x.toFixed(1)}" y="${yInc(y.gross + t.p90).toFixed(1)}" width="${w.toFixed(1)}" height="${(yInc(y.gross + t.p10) - yInc(y.gross + t.p90)).toFixed(1)}" fill="${lean ? '#f97316' : '#22c55e'}" opacity=".35"><title>Age ${y.age}: treats ${gbpK(t.p10)} – ${gbpK(t.p50)} – ${gbpK(t.p90)}${lean ? ' (lean in a bad decade)' : ''}</title></rect><line x1="${x.toFixed(1)}" y1="${yInc(y.gross + t.p50).toFixed(1)}" x2="${(x + w).toFixed(1)}" y2="${yInc(y.gross + t.p50).toFixed(1)}" stroke="#22c55e" stroke-width="2"/>`; } });
  if (frame >= 3) { s += band(d.sleeveCone, xs, yRes, '#22c55e'); s += `<text x="${padL}" y="${(yRes(d.sleeveE0) - 6).toFixed(1)}" font-size="10" fill="#22c55e">flex sleeve ${gbpK(d.sleeveE0)} · ${(d.rate * 100).toFixed(1)}% a year as treats</text>`; }
  s += ageAxis(years, xs, H, padB);
  const leg = [['#facc15', 'State Pension'], ['#60a5fa', 'Essentials, bought']]; if (frame >= 3) leg.push(['rgba(34,197,94,.5)', 'Flex sleeve, 10th–90th pct']); if (frame >= 4) { leg.push(['#22c55e', 'Treats (median line, band = 10th–90th)']); leg.push(['#f97316', 'Lean years (1-in-10 treats under £10k)']); }
  s += legend(leg, H, padL) + frameTitle(FF_FRAMES, frame, W, padL, padR);
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet" role="img">${s}</svg>`;
}

// ---------------------------------------------------------------- Floor the schedule
export const FS_FRAMES = [
  { title: 'Your income plan, year by year', text: 'The steps you chose, in today\'s money, with the State Pension in yellow.' },
  { title: 'Every year is bought today', text: 'Index-linked rungs sized to each year, to the horizon. There is no treats decision because the rungs are the income.' },
  { title: 'What is left is a reserve you never draw', text: 'It rides world equities. Nothing comes out of it for income; it is upside, and insurance against your own inflation running above the index.' },
  { title: 'Once a year: if the reserve has run far ahead, buy more years', text: 'The rule: if the reserve is more than double its line (start × 1.05 a year), spend the excess on rungs beyond the horizon or on lifting the later years. Otherwise leave it.' }
];
export function floorScheduleSvg(d, frame = 4, o = {}) {
  const W = o.width || 960, H = o.height || 360, padL = 56, padR = 16, padT = 34, padB = 44;
  const years = d.amountsByAge; const n = years.length; if (!n) return '';
  const colW = (W - padL - padR) / n, xs = (i) => padL + i * colW + colW / 2;
  const maxInc = Math.max(...years.map((y) => y.gross), 1);
  const incTop = H - padB - (H - padT - padB) * 0.5, y0 = H - padB;
  const yInc = (v) => y0 - (v / maxInc) * (y0 - incTop);
  const G = years.map((_, i) => d.sleeveE0 * Math.pow(1.05, i));
  const maxRes = Math.max(...d.reserveCone.map((c) => c.p90), G[n - 1] * 2, 1);
  const yRes = (v) => incTop - 10 - (Math.max(0, v) / maxRes) * (incTop - 10 - padT);
  let s = '';
  years.forEach((y, i) => { const x = padL + i * colW + 1, w = Math.max(1, colW - 2); s += `<rect x="${x.toFixed(1)}" y="${yInc(y.gross).toFixed(1)}" width="${w.toFixed(1)}" height="${(y0 - yInc(y.gross)).toFixed(1)}" fill="${frame >= 2 ? '#60a5fa' : 'var(--border,#8883)'}" opacity="${frame >= 2 ? 0.9 : 0.45}"><title>Age ${y.age}: ${gbpK(y.gross)}${frame >= 2 ? ' — bought by contract' : ''}</title></rect>`; if (y.sp > 1) s += `<rect x="${x.toFixed(1)}" y="${yInc(y.sp).toFixed(1)}" width="${w.toFixed(1)}" height="${(y0 - yInc(y.sp)).toFixed(1)}" fill="#facc15" opacity=".55"/>`; });
  if (frame >= 3) { s += band(d.reserveCone, xs, yRes, '#60a5fa'); s += `<text x="${padL}" y="${(yRes(d.sleeveE0) - 6).toFixed(1)}" font-size="10" fill="#60a5fa">reserve ${gbpK(d.sleeveE0)}, never drawn</text>`; }
  if (frame >= 4) { s += `<polyline points="${G.map((v, i) => xs(i).toFixed(1) + ',' + yRes(v * 2).toFixed(1)).join(' ')}" fill="none" stroke="#a78bfa" stroke-width="1.5" stroke-dasharray="2 3"/><text x="${W - padR}" y="${(yRes(G[n - 1] * 2) - 4).toFixed(1)}" text-anchor="end" font-size="10" fill="#a78bfa">2× the line: above this, buy more years</text>`; s += `<path d="M${(W - padR - 60).toFixed(1)} ${(yRes(G[n - 1] * 2) + 8).toFixed(1)} L${(W - padR - 30).toFixed(1)} ${(yInc(years[n - 1].gross) - 10).toFixed(1)}" fill="none" stroke="#a78bfa" stroke-width="1.5" marker-end="url(#fsArrow)"/><defs><marker id="fsArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#a78bfa"/></marker></defs>`; }
  s += ageAxis(years, xs, H, padB);
  const leg = [['#facc15', 'State Pension'], ['#60a5fa', 'Bought by contract']]; if (frame >= 3) leg.push(['rgba(96,165,250,.5)', 'Reserve, 10th–90th pct']); if (frame >= 4) leg.push(['#a78bfa', 'The once-a-year rule']);
  s += legend(leg, H, padL) + frameTitle(FS_FRAMES, frame, W, padL, padR);
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet" role="img">${s}</svg>`;
}

// ---------------------------------------------------------------- Pots & Valves
export const PV_FRAMES = [
  { title: 'Your money sits in pots', text: 'Shares, bonds, cash, diversifiers, ISA — each a tank. Every month one tap pays your income.' },
  { title: 'Each pot has a floor', text: 'The tap draws from whichever pot can best afford it. A pot at its floor is left alone; floors decline over the plan so the money is spent by the end.' },
  { title: 'The pots ride the markets', text: 'What is left, over the years, is a band not a line: the 10th to 90th percentile across 1,000 futures. Good decades refill the pots; bad ones drain them.' },
  { title: 'In a bad run the tap is throttled', text: 'When the growth pots are below their floors and the cash pot has been paying for three months, the draw is cut — this is the only strategy that pays you less to survive. Below: income in the worst futures against your plan.' }
];
export function potsValvesSvg(d, frame = 4, o = {}) {
  const W = o.width || 960, H = o.height || 360, padL = 56, padR = 16, padT = 34, padB = 44;
  const pots = [['Shares', d.pots.equity, d.floors.equity, '#f97316'], ['Bonds', d.pots.bond, d.floors.bond, '#a78bfa'], ['Cash', d.pots.cash, d.floors.cash, '#a3a3a3'], ['Diversifiers', d.pots.diversifier, 0, '#22c55e'], ['ISA', d.pots.isa, 0, '#facc15']].filter((p) => p[1] > 0);
  const total = pots.reduce((a, p) => a + p[1], 0) || 1;
  const leftW = (W - padL - padR) * 0.36, tankH = H - padT - padB - 40, tankY = padT + 10;
  let s = '';
  // tanks
  const gap = 10, tw = (leftW - gap * (pots.length - 1)) / pots.length;
  pots.forEach((p, i) => { const x = padL + i * (tw + gap); const h = tankH * (p[1] / Math.max(...pots.map((q) => q[1]))); s += `<rect x="${x.toFixed(1)}" y="${tankY}" width="${tw.toFixed(1)}" height="${tankH}" fill="none" stroke="var(--border,#8883)"/><rect x="${x.toFixed(1)}" y="${(tankY + tankH - h).toFixed(1)}" width="${tw.toFixed(1)}" height="${h.toFixed(1)}" fill="${p[3]}" opacity=".7"><title>${p[0]} ${gbpK(p[1])}</title></rect><text x="${(x + tw / 2).toFixed(1)}" y="${tankY + tankH + 14}" text-anchor="middle" font-size="10" fill="var(--text-muted,#999)">${p[0]} ${gbpK(p[1])}</text>`;
    if (frame >= 2 && p[2] > 0) { const fy = tankY + tankH - tankH * (p[2] / Math.max(...pots.map((q) => q[1]))); s += `<line x1="${x.toFixed(1)}" y1="${fy.toFixed(1)}" x2="${(x + tw).toFixed(1)}" y2="${fy.toFixed(1)}" stroke="var(--text,#eee)" stroke-dasharray="3 2"/><text x="${(x + 2).toFixed(1)}" y="${(fy - 3).toFixed(1)}" font-size="9" fill="var(--text,#eee)">floor</text>`; }
    // pipe to the tap
    s += `<line x1="${(x + tw / 2).toFixed(1)}" y1="${tankY + tankH}" x2="${(padL + leftW / 2).toFixed(1)}" y2="${H - padB - 6}" stroke="${p[3]}" stroke-width="1.2" opacity=".6"/>`; });
  s += `<circle cx="${(padL + leftW / 2).toFixed(1)}" cy="${H - padB - 6}" r="7" fill="${frame >= 4 && d.protection.enabled ? '#ef4444' : '#60a5fa'}"/><text x="${(padL + leftW / 2 + 12).toFixed(1)}" y="${H - padB - 2}" font-size="11" fill="var(--text,#eee)">the tap: ${gbpK(d.planIncome)}/yr${frame >= 4 && d.protection.enabled ? ' — cut ' + d.protection.cutPct + '% after ' + d.protection.limit + ' cash months' : ''}</text>`;
  // right: wealth band (frame 3) and income p10 vs plan (frame 4)
  const rx0 = padL + leftW + 40, rw = W - padR - rx0; const n = d.wealthCone.p50.length; const xs = (i) => rx0 + (i / Math.max(1, n - 1)) * rw;
  if (frame >= 3) { const maxV = Math.max(...d.wealthCone.p90, 1); const yW = (v) => (tankY + tankH * 0.55) - (Math.max(0, v) / maxV) * (tankH * 0.55 - 6); const cone = d.wealthCone.p50.map((_, i) => ({ p10: d.wealthCone.p10[i], p50: d.wealthCone.p50[i], p90: d.wealthCone.p90[i] })); s += band(cone, xs, yW, '#f97316'); s += `<text x="${rx0}" y="${tankY - 2}" font-size="10" fill="#f97316">what is left, 10th–90th pct (median line)</text>`; for (let i = 0; i < n; i += 10) s += `<text x="${xs(i).toFixed(1)}" y="${(tankY + tankH * 0.55 + 12).toFixed(1)}" text-anchor="middle" font-size="9" fill="var(--text-muted,#999)">age ${d.startAge + i}</text>`; }
  if (frame >= 4) { const top = tankY + tankH * 0.65, bh = tankH * 0.35; const maxI = Math.max(...d.incomeCone.p90, d.planIncome, 1); const yI = (v) => (top + bh) - (Math.max(0, v) / maxI) * bh; s += `<line x1="${rx0}" y1="${yI(d.planIncome).toFixed(1)}" x2="${W - padR}" y2="${yI(d.planIncome).toFixed(1)}" stroke="var(--text,#eee)" stroke-dasharray="4 3"/><polyline points="${d.incomeCone.p10.map((v, i) => xs(i).toFixed(1) + ',' + yI(v).toFixed(1)).join(' ')}" fill="none" stroke="#ef4444" stroke-width="2"/><polyline points="${d.incomeCone.p50.map((v, i) => xs(i).toFixed(1) + ',' + yI(v).toFixed(1)).join(' ')}" fill="none" stroke="#60a5fa" stroke-width="1.5"/><text x="${rx0}" y="${top - 2}" font-size="10" fill="#ef4444">income: plan (dashed), median (blue), 1-in-10 bad future (red)</text>`; }
  s += frameTitle(PV_FRAMES, frame, W, padL, padR);
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet" role="img">${s}</svg>`;
}
