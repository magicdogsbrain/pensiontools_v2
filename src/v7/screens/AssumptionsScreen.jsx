/**
 * "Assumptions and data" (research/v7/road-to-7.md step 11b, the ledger's strat.assumptions): the planner's Strategies →
 * Assumptions & data page in the preview — where every figure comes from, section by section, from the facts the effect
 * loads (effects/assumptions.js → services/AssumptionsFacts.js, the same tables the engines use). Draws only: no figure is
 * worked out here. Linked from the foot of every page.
 */
import { fill } from '../components/index.js';
import { assumptionsView } from '../state/select.js';
import { ASSUMPTIONS as W } from '../copy/assumptions.js';

const pc = (v, d = 1) => (Number.isFinite(+v) ? (+v * 100).toFixed(d) : '—');
const whole = (n) => String(Math.round(+n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const day = (s) => (typeof s === 'string' && s ? s.slice(0, 10) : '—');

/** One row of a section: the name, the figure, the note. */
function Row({ id, row, slots }) {
  return (
    <div class="assump-row" data-row={id}>
      <div class="assump-name">{row.name}</div>
      <div class="assump-value">{fill(row.value, slots)}</div>
      {row.note && <div class="note assump-note">{fill(row.note, slots)}</div>}
    </div>
  );
}

function Section({ id, title, children, open = false }) {
  return (
    <details class="assump-section" data-section={id} data-testid={`assumptions.${id}`} open={open}>
      <summary><h2>{title}</h2></summary>
      <div class="assump-rows">{children}</div>
    </details>
  );
}

export function AssumptionsScreen(state) {
  const V = assumptionsView(state);
  const F = V.facts;
  const S = W.sections;
  let body = null;
  if (F) {
    const sh = F.shares, pr = F.prices, fu = F.futures, cu = F.cuts, g = F.gilts, t = F.tax, l = F.ladder, ix = F.index;
    const shares = { from: sh.from, to: sh.to, years: sh.years, adjustment: String(sh.adjustment), nominal: pc(sh.nominal, 2), real: pc(sh.real, 2), worstYear: sh.worstYear, worst: pc(sh.worst), bestYear: sh.bestYear, best: pc(sh.best), charges: String(F.charges) };
    const prices = { from: sh.from, to: sh.to, mean: pc(pr.mean, 2), monthByMonth: pc(pr.monthByMonth, 0) };
    const futures = { runs: whole(fu.runs), blockYears: String(fu.blockYears), from: sh.from, to: sh.to };
    const cuts = { mult: String(cu.mult), months: String(cu.months), buffer: '£' + whole(cu.buffer) };
    const curveWords = F.curve.map((c) => c.years + 'y ' + (c.real == null ? '—' : pc(c.real, 2) + '%')).join(' · ');
    const nominalWords = F.curve.filter((c) => c.nominal != null).map((c) => c.years + 'y ' + pc(c.nominal, 2) + '%').join(' · ');
    const gilts = g ? { generated: day(g.generated), asOf: (g.asOf || '—') + (g.stale ? S.gilts.pricesStale : ''), source: g.source || '', curveAsOf: g.curveAsOf || '—', curvePoints: String(g.curvePoints) } : {};
    const ladder = { curve: curveWords, nominalCurve: nominalWords || '—', spreadShort: pc(l.spreadShort, 2), spreadMid: pc(l.spreadMid, 2), spreadLong: pc(l.spreadLong, 2), dealFee: String(l.dealFee) };
    const tax = { pa: whole(t.pa), brl: whole(t.brl), hrl: whole(t.hrl), taper: whole(t.taper) };
    body = (
      <div class="assump" data-testid="assumptions.page">
        <p class="note" data-testid="assumptions.versions">{fill(W.versions, { app: F.app, engine: F.engine })}</p>
        <Section id="shares" title={S.shares.title} open>
          {['series', 'adjustment', 'result', 'ladders', 'notModelled', 'charges'].map((k) => <Row key={k} id={'shares.' + k} row={S.shares[k]} slots={shares} />)}
        </Section>
        <Section id="prices" title={S.prices.title}>
          {['series', 'futures', 'monthByMonth', 'gilts'].map((k) => <Row key={k} id={'prices.' + k} row={S.prices[k]} slots={prices} />)}
        </Section>
        <Section id="futures" title={S.futures.title}>
          {['oneTest', 'history', 'calibration', 'named'].map((k) => <Row key={k} id={'futures.' + k} row={S.futures[k]} slots={futures} />)}
        </Section>
        <Section id="pots" title={S.pots.title}>
          {['bonds', 'cash', 'isa', 'cuts'].map((k) => <Row key={k} id={'pots.' + k} row={S.pots[k]} slots={cuts} />)}
        </Section>
        <Section id="gilts" title={S.gilts.title}>
          <Row id="gilts.inIssue" row={g && g.generated ? S.gilts.inIssue : S.gilts.inIssueNone} slots={gilts} />
          {g && <Row id="gilts.prices" row={S.gilts.pricesRow} slots={gilts} />}
          <Row id="gilts.curve" row={g && g.hasCurve ? S.gilts.curve : S.gilts.curveNone} slots={gilts} />
          <Row id="gilts.today" row={S.gilts.today} slots={ladder} />
          <Row id="gilts.costs" row={S.gilts.costs} slots={ladder} />
          <Row id="gilts.notAdvice" row={S.gilts.notAdvice} slots={{}} />
          {ix && ix.symbol && <Row id="gilts.index" row={S.gilts.indexRow} slots={{ symbol: ix.symbol, level: ix.level == null ? '—' : whole(ix.level), date: day(ix.date), source: ix.source || '' }} />}
        </Section>
        <Section id="tax" title={S.tax.title}>
          {['bands', 'access', 'taxable', 'notModelled'].map((k) => <Row key={k} id={'tax.' + k} row={S.tax[k]} slots={tax} />)}
        </Section>
        <Section id="limits" title={S.limits.title}>
          <ul class="plan-lines">{S.limits.items.map((s, i) => <li key={i} class="plan-line">{s}</li>)}</ul>
        </Section>
        <p class="note" data-testid="assumptions.source">{fill(W.source, { repo: W.repo })}</p>
      </div>
    );
  }
  return {
    question: null,
    rail: false,
    full: false,
    content: (
      <>
        <h1 tabIndex={-1} data-testid="assumptions.title">{W.title}</h1>
        <p class="lead">{W.lead}</p>
        <p class="note" data-testid="assumptions.words">{W.words}</p>
        {!F && !V.failed && <p class="lead" role="status" data-testid="assumptions.opening">{W.opening}</p>}
        {!F && V.failed && <p class="notice" role="alert" data-testid="assumptions.failed">{W.failed}</p>}
        {body}
      </>
    )
  };
}
