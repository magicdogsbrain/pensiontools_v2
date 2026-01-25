/**
 * Charts Module
 * Canvas-based visualization for stress testing results
 * Supports dark mode and interactive hover tooltips
 * Mobile-first responsive design
 */

// Get colors from CSS variables (dark mode aware) - PWA-style colors
function getColors() {
  const style = getComputedStyle(document.documentElement);
  const isDark = style.getPropertyValue('--bg').trim() === '#0d1117' ||
                 document.documentElement.classList.contains('dark') ||
                 window.matchMedia('(prefers-color-scheme: dark)').matches;

  return {
    // PWA-style colors
    primary: '#f0c674',        // Gold/amber for median
    success: '#2ea043',        // Green for successful
    warning: '#e1b12c',        // Yellow/gold for warnings
    danger: '#f85149',         // Red for failed/danger
    muted: '#8b8b9b',
    grid: 'rgba(255,255,255,0.1)',
    bg: isDark ? 'rgba(15,15,26,1)' : '#ffffff',
    text: isDark ? '#c9d1d9' : '#1f2937',
    cardBg: isDark ? '#21262d' : '#ffffff',
    // Cone colors - warm amber tones like PWA
    cone: 'rgba(240,198,116,0.15)',
    coneMid: 'rgba(240,198,116,0.2)',
    coneInner: 'rgba(240,198,116,0.35)',
    coneBorder: 'rgba(240,198,116,0.4)',
    // Trajectory colors
    trajectory: 'rgba(46,160,67,0.25)',          // Green for successful, thin
    trajectoryFailed: 'rgba(248,81,73,0.8)',     // Red for failed, prominent
    trajectoryHover: '#5fdd7b',                   // Bright green on hover
    trajectoryFailedHover: '#ff6b6b',            // Bright red on hover
    // Glidepath
    glidepath: '#7eb8da',
    // Zero line
    zeroLine: '#f85149'
  };
}

// Store chart data for hover interactions
const chartDataStore = new Map();

// Track highlighted trajectory index
let trajHighlightIdx = -1;

/**
 * Distance from point to line segment (for trajectory hit detection)
 */
function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.sqrt((px - x1) * (px - x1) + (py - y1) * (py - y1));
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / len2));
  const projX = x1 + t * dx, projY = y1 + t * dy;
  return Math.sqrt((px - projX) * (px - projX) + (py - projY) * (py - projY));
}

/**
 * Draws a cone of uncertainty chart showing percentile bands - PWA style
 */
export function drawCone(canvas, results, options = {}) {
  const COLORS = getColors();
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  const padding = { top: 45, right: 40, bottom: 50, left: 80 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Dark background like PWA
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(0, 0, width, height);

  // Chart title
  const title = options.title || 'Fund Value Projections (Percentile Bands)';
  ctx.font = 'bold 14px system-ui, sans-serif';
  ctx.fillStyle = COLORS.text;
  ctx.textAlign = 'center';
  ctx.fillText(title, padding.left + chartWidth / 2, 22);

  const years = options.years || 35;
  const yearlyData = {};

  for (let y = 0; y <= years; y++) {
    yearlyData[y] = [];
  }

  results.forEach(r => {
    r.hist.forEach(h => {
      const yr = Math.floor(h.year);
      if (yearlyData[yr] !== undefined) {
        yearlyData[yr].push(h.total);
      }
    });
  });

  // Calculate percentiles for each year
  const percentiles = [];
  for (let y = 0; y <= years; y++) {
    const values = yearlyData[y].sort((a, b) => a - b);
    if (values.length === 0) continue;

    const p = (pct) => values[Math.floor(values.length * pct)] || 0;
    percentiles.push({
      year: y,
      p5: p(0.05),
      p10: p(0.10),
      p25: p(0.25),
      p50: p(0.50),
      p75: p(0.75),
      p90: p(0.90),
      p95: p(0.95)
    });
  }

  if (percentiles.length === 0) return;

  const maxValue = Math.max(...percentiles.map(p => p.p90)) * 1.15;
  const xScale = (year) => padding.left + (year / years) * chartWidth;
  const yScale = (value) => height - padding.bottom - (value / maxValue) * chartHeight;

  // Draw grid
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding.top + (i / 5) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }

  // 5-95 percentile band (lightest)
  ctx.fillStyle = COLORS.cone;
  ctx.beginPath();
  percentiles.forEach((p, i) => {
    const x = xScale(p.year);
    if (i === 0) ctx.moveTo(x, yScale(p.p95));
    else ctx.lineTo(x, yScale(p.p95));
  });
  for (let i = percentiles.length - 1; i >= 0; i--) {
    ctx.lineTo(xScale(percentiles[i].year), yScale(percentiles[i].p5));
  }
  ctx.closePath();
  ctx.fill();

  // 10-90 percentile band
  ctx.fillStyle = COLORS.coneMid;
  ctx.beginPath();
  percentiles.forEach((p, i) => {
    const x = xScale(p.year);
    if (i === 0) ctx.moveTo(x, yScale(p.p90));
    else ctx.lineTo(x, yScale(p.p90));
  });
  for (let i = percentiles.length - 1; i >= 0; i--) {
    ctx.lineTo(xScale(percentiles[i].year), yScale(percentiles[i].p10));
  }
  ctx.closePath();
  ctx.fill();

  // 25-75 percentile band (darkest)
  ctx.fillStyle = COLORS.coneInner;
  ctx.beginPath();
  percentiles.forEach((p, i) => {
    const x = xScale(p.year);
    if (i === 0) ctx.moveTo(x, yScale(p.p75));
    else ctx.lineTo(x, yScale(p.p75));
  });
  for (let i = percentiles.length - 1; i >= 0; i--) {
    ctx.lineTo(xScale(percentiles[i].year), yScale(percentiles[i].p25));
  }
  ctx.closePath();
  ctx.fill();

  // Glidepath minimum line (if available in options)
  if (options.glide && options.glide.length > 0) {
    ctx.strokeStyle = COLORS.glidepath;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 3]);
    ctx.beginPath();
    options.glide.forEach((g, i) => {
      const x = xScale(g.year);
      const y = yScale(g.min);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Median line
  ctx.strokeStyle = COLORS.primary;
  ctx.lineWidth = 3;
  ctx.beginPath();
  percentiles.forEach((p, i) => {
    const x = xScale(p.year);
    const y = yScale(p.p50);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // 10th percentile line (danger zone)
  ctx.strokeStyle = 'rgba(248,81,73,0.6)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 2]);
  ctx.beginPath();
  percentiles.forEach((p, i) => {
    const x = xScale(p.year);
    if (i === 0) ctx.moveTo(x, yScale(p.p10));
    else ctx.lineTo(x, yScale(p.p10));
  });
  ctx.stroke();
  ctx.setLineDash([]);

  // Zero line
  ctx.strokeStyle = COLORS.zeroLine;
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(padding.left, yScale(0));
  ctx.lineTo(width - padding.right, yScale(0));
  ctx.stroke();
  ctx.setLineDash([]);

  // Y-axis labels
  ctx.fillStyle = COLORS.muted;
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 5; i++) {
    const value = maxValue * (1 - i / 5);
    ctx.fillText(formatValue(value), padding.left - 10, padding.top + (i / 5) * chartHeight + 4);
  }

  // X-axis labels
  ctx.textAlign = 'center';
  for (let y = 0; y <= years; y += 5) {
    ctx.fillText(`Yr ${y}`, xScale(y), height - padding.bottom + 20);
  }

  // Store data for hover
  chartDataStore.set(canvas.id, { percentiles, xScale, yScale, padding, chartWidth, chartHeight, years, maxValue, type: 'cone' });

  // Add hover listener
  setupConeHover(canvas, COLORS);
}

/**
 * Draws sample trajectories chart with interactive hover - PWA style
 * Focuses on negative trajectories, positive ones can overflow
 */
export function drawTrajectories(canvas, results, options = {}) {
  const COLORS = getColors();
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  const padding = { top: 45, right: 40, bottom: 50, left: 80 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Dark background like PWA
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(0, 0, width, height);

  // Chart title
  const title = options.title || 'Sample Trajectories (Green=Success, Red=Failed)';
  ctx.font = 'bold 14px system-ui, sans-serif';
  ctx.fillStyle = COLORS.text;
  ctx.textAlign = 'center';
  ctx.fillText(title, padding.left + chartWidth / 2, 22);

  const years = options.years || 35;
  const startValue = options.startValue || 1000000;

  // Focus Y-axis on failed/struggling trajectories
  // Find the max value among failed runs, or use median if no failures
  const sampleResults = results.slice(0, 100);
  const failedRuns = sampleResults.filter(r => r.failed);
  const successRuns = sampleResults.filter(r => !r.failed);

  let maxValue;
  if (failedRuns.length > 0) {
    // Use the starting values of failed runs as reference - show full decline
    // Cap at 2x the starting value to show context but focus on the decline
    maxValue = startValue * 2;
  } else {
    // No failures - use median final value with some headroom
    const finals = successRuns.map(r => r.final).sort((a, b) => a - b);
    const medianFinal = finals[Math.floor(finals.length * 0.5)] || startValue;
    maxValue = Math.max(medianFinal * 1.3, startValue * 1.5);
  }

  const xScale = (year) => padding.left + (year / years) * chartWidth;
  // Values above max will be clamped to top of chart (overflow)
  const yScale = (value) => height - padding.bottom - (Math.min(value, maxValue) / maxValue) * chartHeight;

  // Draw grid
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding.top + (i / 5) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }

  // Y-axis labels
  ctx.fillStyle = COLORS.muted;
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 5; i++) {
    const value = maxValue * (1 - i / 5);
    ctx.fillText(formatValue(value), padding.left - 10, padding.top + (i / 5) * chartHeight + 4);
  }

  // X-axis labels
  ctx.textAlign = 'center';
  for (let y = 0; y <= years; y += 5) {
    ctx.fillText(`Yr ${y}`, xScale(y), height - padding.bottom + 20);
  }

  // Store paths for hit detection
  const paths = [];

  // Glidepath line (if available)
  if (options.glide && options.glide.length > 0) {
    ctx.strokeStyle = COLORS.glidepath;
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 4]);
    ctx.beginPath();
    options.glide.forEach((g, i) => {
      const x = xScale(g.year);
      const y = yScale(g.min);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Draw successful trajectories first (green, thin) - background
  successRuns.forEach((r, idx) => {
    const pts = r.hist.map(h => ({ x: xScale(h.year), y: yScale(h.total) }));
    paths.push({ run: r, pts, failed: false, idx });
    ctx.strokeStyle = COLORS.trajectory;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    pts.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
  });

  // Draw failed trajectories on top (red, thicker) - prominent
  failedRuns.forEach((r, idx) => {
    const pts = r.hist.map(h => ({ x: xScale(h.year), y: yScale(h.total) }));
    paths.push({ run: r, pts, failed: true, idx: successRuns.length + idx });
    ctx.strokeStyle = COLORS.trajectoryFailed;
    ctx.lineWidth = 2;
    ctx.beginPath();
    pts.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
  });

  // Zero line
  ctx.strokeStyle = COLORS.zeroLine;
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(padding.left, yScale(0));
  ctx.lineTo(width - padding.right, yScale(0));
  ctx.stroke();
  ctx.setLineDash([]);

  // Store data for hover
  chartDataStore.set(canvas.id, {
    results: sampleResults,
    paths,
    xScale,
    yScale,
    padding,
    chartWidth,
    chartHeight,
    years,
    maxValue,
    glide: options.glide,
    type: 'trajectory'
  });

  // Add hover listener
  setupTrajectoryHover(canvas, COLORS);
}

/**
 * Draws protection distribution histogram - PWA style with hover
 */
export function drawHistogram(canvas, results, options = {}) {
  const COLORS = getColors();
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  const padding = { top: 50, right: 20, bottom: 55, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Dark background like PWA
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(0, 0, width, height);

  // Chart title
  const title = options.title || 'Protection Months Distribution';
  ctx.font = 'bold 14px system-ui, sans-serif';
  ctx.fillStyle = COLORS.text;
  ctx.textAlign = 'center';
  ctx.fillText(title, padding.left + chartWidth / 2, 22);

  const protMonths = results.map(r => r.protMonths);
  const totalRuns = protMonths.length;
  const maxProt = Math.max(...protMonths);
  const bucketSize = Math.max(1, Math.ceil(maxProt / 15));
  const buckets = {};

  protMonths.forEach(p => {
    const bucket = Math.floor(p / bucketSize) * bucketSize;
    buckets[bucket] = (buckets[bucket] || 0) + 1;
  });

  const bucketKeys = Object.keys(buckets).map(Number).sort((a, b) => a - b);
  const maxCount = Math.max(...Object.values(buckets));
  const barWidth = chartWidth / (bucketKeys.length || 1);

  // Store bar positions for hover
  const bars = [];

  // Y-axis grid and labels
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;
  ctx.fillStyle = COLORS.muted;
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (i / 4) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    const val = Math.round(maxCount * (1 - i / 4));
    ctx.fillText(`${val} runs`, padding.left - 5, y + 4);
  }

  // Draw bars
  bucketKeys.forEach((bucket, i) => {
    const count = buckets[bucket];
    const barH = (count / maxCount) * chartHeight;
    const x = padding.left + i * barWidth + 2;
    const y = height - padding.bottom - barH;
    const w = barWidth - 4;

    // Green for zero protection, yellow/gold for protection needed
    ctx.fillStyle = bucket === 0 ? COLORS.success : COLORS.warning;
    ctx.fillRect(x, y, w, barH);

    bars.push({
      x, y, w, h: barH,
      months: bucket,
      monthsEnd: bucket + bucketSize - 1,
      count,
      pct: (count / totalRuns * 100).toFixed(1)
    });
  });

  // X-axis labels
  ctx.fillStyle = COLORS.muted;
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'center';
  bucketKeys.forEach((bucket, i) => {
    if (i % 2 === 0 || bucketKeys.length < 12) {
      const label = bucketSize > 1 ? `${bucket}-${bucket + bucketSize - 1}` : bucket.toString();
      ctx.fillText(label, padding.left + i * barWidth + barWidth / 2, height - padding.bottom + 15);
    }
  });
  ctx.fillText('Protection Months', width / 2, height - 5);

  // Y-axis title
  ctx.save();
  ctx.translate(12, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText('Number of Runs', 0, 0);
  ctx.restore();

  // Store for hover handler
  chartDataStore.set(canvas.id, { bars, totalRuns, type: 'histogram' });

  // Setup hover
  setupHistogramHover(canvas, COLORS);
}

/**
 * Draws scenario comparison chart
 */
export function drawScenarioComparison(canvas, scenarios, options = {}) {
  const COLORS = getColors();
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  const padding = { top: 50, right: 180, bottom: 60, left: 80 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, width, height);

  const scenarioNames = Object.keys(scenarios);
  const years = options.years || 35;

  let maxValue = 0;
  scenarioNames.forEach(name => {
    const result = scenarios[name].result;
    if (result && result.hist) {
      result.hist.forEach(h => {
        if (h.total > maxValue) maxValue = h.total;
      });
    }
  });
  maxValue *= 1.1;

  const xScale = (year) => padding.left + (year / years) * chartWidth;
  const yScale = (value) => padding.top + chartHeight - (value / maxValue) * chartHeight;

  drawGrid(ctx, padding, chartWidth, chartHeight, years, maxValue, options.title || 'Scenario Comparison', COLORS);

  const scenarioColors = [
    '#6366f1', '#22c55e', '#f59e0b', '#ef4444',
    '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'
  ];

  scenarioNames.forEach((name, idx) => {
    const result = scenarios[name].result;
    if (!result || !result.hist) return;

    ctx.beginPath();
    ctx.strokeStyle = scenarioColors[idx % scenarioColors.length];
    ctx.lineWidth = 2.5;

    result.hist.forEach((h, i) => {
      const x = xScale(h.year);
      const y = yScale(h.total);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Legend
    const legendY = padding.top + 15 + idx * 24;
    ctx.fillStyle = scenarioColors[idx % scenarioColors.length];
    ctx.fillRect(width - padding.right + 15, legendY, 20, 4);
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillStyle = COLORS.text;
    ctx.textAlign = 'left';
    ctx.fillText(scenarios[name].name || name, width - padding.right + 40, legendY + 5);

    const finalVal = result.final / 1000;
    ctx.fillStyle = COLORS.muted;
    ctx.fillText(`${formatValue(result.final)}`, width - padding.right + 40, legendY + 18);
  });
}

/**
 * Draw grid helper
 */
function drawGrid(ctx, padding, chartWidth, chartHeight, years, maxValue, title, COLORS) {
  ctx.font = 'bold 14px system-ui, sans-serif';
  ctx.fillStyle = COLORS.text;
  ctx.textAlign = 'center';
  ctx.fillText(title, padding.left + chartWidth / 2, padding.top - 20);

  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;

  for (let i = 0; i <= 5; i++) {
    const y = padding.top + (chartHeight * i / 5);
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(padding.left + chartWidth, y);
    ctx.stroke();

    const value = maxValue * (5 - i) / 5;
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillStyle = COLORS.muted;
    ctx.textAlign = 'right';
    ctx.fillText(formatValue(value), padding.left - 10, y + 4);
  }

  for (let y = 0; y <= years; y += 5) {
    const x = padding.left + (y / years) * chartWidth;
    ctx.beginPath();
    ctx.moveTo(x, padding.top);
    ctx.lineTo(x, padding.top + chartHeight);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillText(`Y${y}`, x, padding.top + chartHeight + 20);
  }

  ctx.font = '12px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Years', padding.left + chartWidth / 2, padding.top + chartHeight + 45);

  ctx.save();
  ctx.translate(20, padding.top + chartHeight / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Fund Value', 0, 0);
  ctx.restore();
}

/**
 * Format large values
 */
function formatValue(value) {
  if (value >= 1000000) {
    return `£${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `£${(value / 1000).toFixed(0)}k`;
  }
  return `£${value.toFixed(0)}`;
}

/**
 * Setup cone chart hover with detailed percentile info
 */
function setupConeHover(canvas, COLORS) {
  const existingListener = canvas._coneHoverListener;
  if (existingListener) {
    canvas.removeEventListener('mousemove', existingListener);
  }

  const listener = (e) => {
    const data = chartDataStore.get(canvas.id);
    if (!data || data.type !== 'cone') return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;

    const { percentiles, padding, chartWidth, years } = data;

    // Find nearest year
    const yearFloat = ((mouseX - padding.left) / chartWidth) * years;
    const nearestYear = Math.round(yearFloat);

    if (nearestYear < 0 || nearestYear > years) {
      hideTooltip();
      return;
    }

    const pData = percentiles.find(p => p.year === nearestYear);
    if (!pData) {
      hideTooltip();
      return;
    }

    const html = `
      <div style="border-bottom:1px solid #555;padding-bottom:6px;margin-bottom:6px;">
        <strong style="color:#f0c674;">Year ${nearestYear}</strong>
      </div>
      <div style="display:grid;grid-template-columns:auto auto;gap:4px 16px;">
        <span style="color:#8b8b9b;">95th percentile:</span><span>${formatValue(pData.p95)}</span>
        <span style="color:#8b8b9b;">75th percentile:</span><span>${formatValue(pData.p75)}</span>
        <span style="color:#8b8b9b;">Median (50th):</span><span style="color:#f0c674;font-weight:bold;">${formatValue(pData.p50)}</span>
        <span style="color:#8b8b9b;">25th percentile:</span><span>${formatValue(pData.p25)}</span>
        <span style="color:#8b8b9b;">10th percentile:</span><span style="color:#f85149;">${formatValue(pData.p10)}</span>
        <span style="color:#8b8b9b;">5th percentile:</span><span>${formatValue(pData.p5)}</span>
      </div>
    `;

    showTooltip(e.clientX, e.clientY, html);
  };

  canvas._coneHoverListener = listener;
  canvas.addEventListener('mousemove', listener);
  canvas.addEventListener('mouseleave', hideTooltip);
}

/**
 * Setup trajectory chart hover with detailed stats - PWA style
 */
function setupTrajectoryHover(canvas, COLORS) {
  const existingListener = canvas._trajHoverListener;
  if (existingListener) {
    canvas.removeEventListener('mousemove', existingListener);
  }
  const existingLeaveListener = canvas._trajLeaveListener;
  if (existingLeaveListener) {
    canvas.removeEventListener('mouseleave', existingLeaveListener);
  }

  const listener = (e) => {
    const data = chartDataStore.get(canvas.id);
    if (!data || data.type !== 'trajectory') return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const { paths, padding, chartWidth, chartHeight } = data;

    // Check if mouse is in chart area
    if (mouseX < padding.left || mouseX > padding.left + chartWidth ||
        mouseY < padding.top || mouseY > padding.top + chartHeight) {
      hideTooltip();
      if (trajHighlightIdx !== -1) {
        trajHighlightIdx = -1;
        redrawTrajectories(canvas, data, COLORS, null);
      }
      return;
    }

    // Find closest trajectory - prioritize failed runs
    let closest = null;
    let minDist = 12 * scaleX;

    // Check failed runs first
    paths.filter(p => p.failed).forEach(p => {
      for (let i = 0; i < p.pts.length - 1; i++) {
        const d = distToSegment(mouseX, mouseY, p.pts[i].x, p.pts[i].y, p.pts[i + 1].x, p.pts[i + 1].y);
        if (d < minDist) {
          minDist = d;
          closest = p;
        }
      }
    });

    // Then check successful runs if no failed run found
    if (!closest) {
      paths.filter(p => !p.failed).forEach(p => {
        for (let i = 0; i < p.pts.length - 1; i++) {
          const d = distToSegment(mouseX, mouseY, p.pts[i].x, p.pts[i].y, p.pts[i + 1].x, p.pts[i + 1].y);
          if (d < minDist) {
            minDist = d;
            closest = p;
          }
        }
      });
    }

    // Redraw if highlight changed
    const newHighlightIdx = closest ? closest.idx : -1;
    if (newHighlightIdx !== trajHighlightIdx) {
      trajHighlightIdx = newHighlightIdx;
      redrawTrajectories(canvas, data, COLORS, closest);
    }

    if (closest) {
      const r = closest.run;
      const statusColor = closest.failed ? '#f85149' : '#2ea043';
      const statusIcon = closest.failed ? '❌' : '✅';
      const statusText = closest.failed ? 'FAILED' : 'SUCCESS';

      let html = `
        <div style="border-bottom:1px solid #555;padding-bottom:6px;margin-bottom:6px;">
          <strong style="color:${statusColor};">${statusIcon} ${statusText}</strong>
          <span style="float:right;color:#8b8b9b;font-size:11px;">Run #${closest.idx + 1}</span>
        </div>
        <div style="display:grid;grid-template-columns:auto auto;gap:4px 16px;">
      `;

      if (r.startYear) {
        html += `<span style="color:#8b8b9b;">Start year:</span><span>${r.startYear}</span>`;
      }
      html += `<span style="color:#8b8b9b;">Duration:</span><span>${r.years.toFixed(1)} years</span>`;
      html += `<span style="color:#8b8b9b;">Final balance:</span><span>${formatValue(r.final)}</span>`;
      html += `<span style="color:#8b8b9b;">Protection months:</span><span>${r.protMonths}</span>`;
      html += `<span style="color:#8b8b9b;">Longest streak:</span><span>${r.maxConsec} months</span>`;
      if (r.hodlUsed > 0) {
        html += `<span style="color:#8b8b9b;">HODL used:</span><span>${formatValue(r.hodlUsed)}</span>`;
      }
      html += '</div>';

      if (closest.failed && r.failMonth) {
        html += `<div style="margin-top:8px;padding-top:8px;border-top:1px solid #555;color:#f0c674;">💀 Depleted at year ${(r.failMonth / 12).toFixed(1)}</div>`;
      }

      showTooltip(e.clientX, e.clientY, html);
    } else {
      hideTooltip();
    }
  };

  const leaveListener = () => {
    hideTooltip();
    if (trajHighlightIdx !== -1) {
      trajHighlightIdx = -1;
      const data = chartDataStore.get(canvas.id);
      if (data) redrawTrajectories(canvas, data, COLORS, null);
    }
  };

  canvas._trajHoverListener = listener;
  canvas._trajLeaveListener = leaveListener;
  canvas.addEventListener('mousemove', listener);
  canvas.addEventListener('mouseleave', leaveListener);
}

/**
 * Setup histogram hover - PWA style
 */
function setupHistogramHover(canvas, COLORS) {
  const existingListener = canvas._histHoverListener;
  if (existingListener) {
    canvas.removeEventListener('mousemove', existingListener);
  }

  const listener = (e) => {
    const data = chartDataStore.get(canvas.id);
    if (!data || data.type !== 'histogram') return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const { bars, totalRuns } = data;
    let hit = null;

    bars.forEach(bar => {
      if (mouseX >= bar.x && mouseX <= bar.x + bar.w && mouseY >= bar.y && mouseY <= bar.y + bar.h) {
        hit = bar;
      }
    });

    if (hit) {
      const isZero = hit.months === 0;
      const color = isZero ? '#2ea043' : '#e1b12c';
      const icon = isZero ? '🟢' : '🟡';
      const label = isZero ? 'No Protection' : `${hit.months}${hit.monthsEnd > hit.months ? `-${hit.monthsEnd}` : ''} months`;

      const html = `
        <div style="border-bottom:1px solid #555;padding-bottom:6px;margin-bottom:6px;">
          <strong style="color:${color};">${icon} ${label}</strong>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;">
          <span style="color:#8b8b9b;">Runs:</span><span>${hit.count} of ${totalRuns}</span>
          <span style="color:#8b8b9b;">Percentage:</span><span>${hit.pct}%</span>
        </div>
      `;
      showTooltip(e.clientX, e.clientY, html);
    } else {
      hideTooltip();
    }
  };

  canvas._histHoverListener = listener;
  canvas.addEventListener('mousemove', listener);
  canvas.addEventListener('mouseleave', hideTooltip);
}

/**
 * Redraw trajectories with highlight - PWA style
 */
function redrawTrajectories(canvas, data, COLORS, highlight) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  const { paths, xScale, yScale, padding, chartWidth, chartHeight, years, maxValue, glide } = data;

  // Clear chart area only (preserve any surrounding content)
  ctx.fillStyle = 'rgba(15,15,26,1)';
  ctx.fillRect(padding.left, padding.top, chartWidth, chartHeight);

  // Redraw grid
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding.top + (i / 5) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }

  // Redraw glidepath
  if (glide && glide.length > 0) {
    ctx.strokeStyle = COLORS.glidepath;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 2]);
    ctx.beginPath();
    glide.forEach((g, i) => {
      const gx = xScale(g.year);
      const gy = yScale(g.min);
      if (i === 0) ctx.moveTo(gx, gy);
      else ctx.lineTo(gx, gy);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Draw non-highlighted trajectories (dimmer when something is highlighted)
  paths.forEach(p => {
    if (highlight && p.idx === highlight.idx) return;
    const alpha = highlight ? 0.15 : (p.failed ? 0.8 : 0.25);
    ctx.strokeStyle = p.failed ? `rgba(248,81,73,${alpha})` : `rgba(46,160,67,${alpha})`;
    ctx.lineWidth = p.failed ? 2 : 0.5;
    ctx.beginPath();
    p.pts.forEach((pt, i) => {
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();
  });

  // Draw highlighted trajectory on top (bright and thick with glow)
  if (highlight) {
    ctx.strokeStyle = highlight.failed ? COLORS.trajectoryFailedHover : COLORS.trajectoryHover;
    ctx.lineWidth = 4;
    ctx.shadowColor = highlight.failed ? COLORS.trajectoryFailedHover : COLORS.trajectoryHover;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    highlight.pts.forEach((pt, i) => {
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Redraw zero line
  ctx.strokeStyle = COLORS.zeroLine;
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(padding.left, yScale(0));
  ctx.lineTo(width - padding.right, yScale(0));
  ctx.stroke();
  ctx.setLineDash([]);
}

/**
 * Show tooltip - PWA style
 */
function showTooltip(x, y, html) {
  let tooltip = document.getElementById('chartTooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'chartTooltip';
    document.body.appendChild(tooltip);
  }

  tooltip.innerHTML = html;
  tooltip.style.display = 'block';
  tooltip.style.left = (x + 15) + 'px';
  tooltip.style.top = (y - 10) + 'px';
}

/**
 * Hide tooltip
 */
function hideTooltip() {
  const tooltip = document.getElementById('chartTooltip');
  if (tooltip) {
    tooltip.style.display = 'none';
  }
}

/**
 * Get chart container styles - mobile-first responsive
 */
export function getChartStyles() {
  return `
    /* Chart tooltip - PWA style */
    #chartTooltip {
      position: fixed;
      background: rgba(22,27,34,0.95);
      border: 1px solid #30363d;
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 13px;
      line-height: 1.5;
      color: #c9d1d9;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      pointer-events: none;
      z-index: 10000;
      display: none;
      max-width: 280px;
    }

    #chartTooltip strong {
      display: block;
      font-size: 14px;
    }

    /* Mobile-first chart containers */
    .chart-container {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 16px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .chart-container canvas {
      display: block;
      min-width: 600px;
      height: auto;
    }

    /* Scrollable wrapper for charts on mobile */
    .chart-scroll-wrapper {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      margin: 0 -12px;
      padding: 0 12px;
    }

    /* Chart grid for side-by-side layout */
    .chart-grid {
      display: grid;
      gap: 16px;
    }

    @media (min-width: 1024px) {
      .chart-grid {
        grid-template-columns: 1fr 1fr;
      }
      .chart-container canvas {
        min-width: unset;
        width: 100%;
      }
    }

    @media (max-width: 600px) {
      .chart-container {
        padding: 8px;
        margin: 8px 0;
        border-radius: 6px;
      }

      .chart-container canvas {
        min-width: 500px;
      }

      #chartTooltip {
        font-size: 12px;
        padding: 10px 12px;
        max-width: 220px;
      }
    }

    /* Mobile scroll indicator */
    .chart-scroll-hint {
      display: none;
      text-align: center;
      color: var(--text-muted);
      font-size: 12px;
      padding: 4px;
    }

    @media (max-width: 768px) {
      .chart-scroll-hint {
        display: block;
      }
    }
  `;
}
