/**
 * FROZEN (7.8.0): index.html's verdictBlockHtml as it was before 7.8.0 (main e5e2fd71), with the page's own helpers it read
 * (pctText, CHANCE_BARS, futuresOutOfTen from services/OneAnswer.js, which 7.8.0 does not change, and the page's gbp). The
 * classic block an old document opens with must stay this, byte for byte (tests/v7/plan/verdictBlock.test.js). Never edit.
 */
import { pctText, CHANCE_BARS, futuresOutOfTen } from '../../../../src/services/OneAnswer.js';

const gbp = (n) => '£' + Math.round(+n || 0).toLocaleString();

export function verdictBlockHtml(r, p) {
  if (!r || !r.affordable) return '';
  const sr = 100 - (r.ruin.mc || 0);
  const cov = r.coverage != null ? r.coverage : (r.failAges && r.failAges.length === 0 ? 100 : sr);
  const cut = !!r.ruinLabel;
  const flex = r.strategyId === 'floor-and-flex';
  const v = sr >= 90 ? { t: flex ? 'Bills always paid; treats rarely fall short' : cut ? 'Very likely to pay the plan in full' : 'Very likely to last', c: 'success' }
    : sr >= 75 ? { t: flex ? 'Bills always paid; some lean years for the treats' : cut ? 'Likely to pay the plan in full — with some risk of a cut' : 'Likely to last — with some risk', c: 'success' }
    : sr >= 50 ? { t: flex ? 'Bills always paid; lean years are a real possibility' : cut ? 'A real chance of a cut' : 'At real risk of running out', c: 'warning' }
    : { t: flex ? 'Bills always paid; expect lean years for the treats' : cut ? 'A cut is more likely than not' : 'Unlikely to last as planned', c: flex ? 'warning' : 'danger' };
  const basis = r.n.mc.toLocaleString() + ' simulated futures and ' + r.n.hist + ' real ' + p.durationYears + '-year histories since 1871';
  return '<div class="verdict verdict-' + v.c + '"><div class="verdict-title">' + (cut ? 'Will you get what you planned? — ' : 'Will your money last? — ') + v.t + '</div>'
    + '<div class="verdict-heroes"><div><span class="hero">' + pctText(sr, 0, CHANCE_BARS) + '</span><span class="hero-sub">' + (flex ? 'chance of no lean year (never more than 10% under the plan; the bills can\'t fail)' : cut ? 'chance the plan is paid in full, with no year cut' : 'chance your money lasts the whole plan') + ' — ' + (flex ? 'no lean year ' : cut ? 'paid in full ' : 'lasts ') + futuresOutOfTen(sr / 100).words + '</span></div>'
    + '<div><span class="hero" style="font-size:30px;">' + pctText(cov) + '</span><span class="hero-sub">of the plan\'s years covered — the share of your planned income the money actually paid, averaged over every future</span></div>'
    + '<div><span class="hero" style="font-size:30px;">' + gbp(Math.round(r.worst12.min)) + '</span><span class="hero-sub">worst 12 months lived, today\'s money</span></div></div>'
    + '<div class="verdict-basis">Based on ' + basis + ' (' + pctText((r.ruin.hist || 0)) + ' of the histories ' + (cut ? 'were cut' : 'ran out') + '). Today\'s money. The one test: the same figure on every screen of this plan.</div></div>';
}
