/**
 * "Moving to your plan's mix" (research/v7/holdings-and-move.md §3; road-to-7.md step 10): the move rail step made real. Only
 * for a locked plan (the target is the plan document): on its face "Optional…" and the status; what skipping it costs (one
 * optional run on the held mix, or the uncovered tax years of a ladder); the saver's rule (no lists until about five years
 * out: where new money goes instead); the cash to hold now; Buy and Sell with a Done tick each (one write of the whole
 * transition object, with Undo); Already held and Left alone; the totals; When; "How to read this"; for a ladder plan the
 * order sheet (the document's rungs, the units and cost held back while the plan was sized on an assumed State Pension) and
 * "Gilt ladders explained" with the plan's own first rung; for the ladder + rotation the watch and the sell ticket, and the
 * switch handed to the planner. Draws only: everything is the reading's (state/select.js planMoveView: answers/plan/move.js
 * through the plan source); the run's status is the state's (effects/move.js). The last line is always the same.
 * By phase (7.11.1): Living on it, or Moving once what is held was accepted (the reading's `mode` 'held'), the page is what is
 * held, and never a move: no "Optional…", status in moves, cost, Buy, Sell, tick, totals, When or "How to read this". On a
 * ladder (7.12.0) it is "Your plan's mix" (HeldLadder.jsx: the one reading, answers/plan/held.js) and nothing else of the move:
 * no lists, no "What is covered", no keep test and no order sheet (the sheet as locked is in the plan document). A pot plan's
 * mix as held, the lists' notes and the watch stay as before.
 */
import { PlanRail, changeAction, UndoToast, fill, Button, LinkButton, stepNameOf } from '../../components/index.js';
import { planView, planMoveView, planKeepTestView } from '../../state/select.js';
import { KeepTestLine } from './KeepTest.jsx';
import { href } from '../../router/routes.js';
import { PLAN } from '../../copy/plan.js';
import { MOVE as W } from '../../copy/move.js';
import { GAPS } from '../../copy/gaps.js';
import { GapsSection } from './Gaps.jsx';
import { HeldLadder } from './HeldLadder.jsx';

const w = PLAN.page;
const keepFocus = { onMouseDown: (e) => e.preventDefault() };
const seconds = (ms) => (Math.round((ms || 0) / 100) / 10).toFixed(1);
const T = 'plan.move';

function Head({ view }) {
  return (
    <div class="plan-head">
      <p class="plan-kicker">{w.title} <span class="plan-name">‘{view.name}’</span></p>
      <p class="plan-stage-line" data-testid="plan.stageLine">{view.line ? fill(PLAN.stageLines[view.line.id], view.line.slots) : ''}{view.lockedOn ? ' ' + fill(w.lockedOn, { date: view.lockedOn }) : ''}</p>
      {view.readonly && <p class="notice" role="status" data-testid="plan.readonly">{w.shownAsSaved}</p>}
      {view.source === 'window' && <p class="note" data-testid="plan.windowWarning">{w.windowWarning}</p>}
    </div>
  );
}

const whyText = (why) => (why ? fill(W.why[why.id] || W.why.other, { ...why.slots, bucket: W.buckets[why.slots && why.slots.bucket] || (why.slots && why.slots.bucket) || '' }) : '');
const unitsText = (u) => (u ? fill(W.schedule.units, { units: u }) : '');
const amountText = (a) => (a ? fill(W.schedule.amount, { amount: a }) : '');

/** The status on the face of the step (§3.2; 7.12.0: the one wording, moveWords.moveStatusOf), the pace and when to buy. */
function Status({ V }) {
  const S = W.status;
  const s = V.status;
  return (
    <section class="plan-section" data-section="status" data-testid={`${T}.status`} data-status={s.id}>
      <p class="figure" data-testid={`${T}.status.line`}>{fill(S[s.id], s.slots)}</p>
      {V.pace && <p class="note" data-testid={`${T}.pace`}>{fill(V.pace.months === '1' ? S.paceOne : S.pace, V.pace)}</p>}
      {V.ladder && !V.complete && <p class="note" data-testid={`${T}.timing`}>{S.timing}</p>}
      <p class="note" data-testid={`${T}.target`}>{V.ladder ? W.target.ladder + ' ' + W.isa[V.isa || 'none'] : W.target.buckets}</p>
    </section>
  );
}

/** "This is how I want to hold it" (7.12.0): one press and a confirm, Moving, while the move is not done. */
function SayHeld({ V, dispatch }) {
  const S = W.sayHeld;
  if (!V.sayHeld || !V.editable) return null;
  return (
    <section class="plan-section" data-section="sayHeld" data-testid={`${T}.sayHeld`}>
      <p class="line"><strong>{S.title}</strong> {S.lead}</p>
      {!V.sayHeldOpen && <div class="actions-row"><Button testid={`${T}.sayHeld.button`} kind="plain" disabled={!!V.saving} onClick={() => dispatch({ type: 'ui/toggle', id: 'sayHeldConfirm' })} {...keepFocus}>{S.button}</Button></div>}
      {V.sayHeldOpen && (
        <div class="confirm" role="group" data-testid={`${T}.sayHeld.confirm`}>
          <p>{S.confirm}</p>
          <div class="actions-row">
            <Button testid={`${T}.sayHeld.yes`} kind="primary" disabled={!!V.saving} onClick={() => dispatch({ type: 'plan/agree', planId: V.id, simple: true })} {...keepFocus}>{S.yes}</Button>
            <Button testid={`${T}.sayHeld.no`} kind="quiet" onClick={() => dispatch({ type: 'ui/toggle', id: 'sayHeldConfirm' })} {...keepFocus}>{S.no}</Button>
          </div>
        </div>
      )}
    </section>
  );
}

/** Once said (7.12.0, Moving by agreement): the day it was said, "Take this back", and on a ladder the gilts not bought in full. */
function SaidHeld({ V, dispatch }) {
  const H = W.held, x = V.saidHeld;
  if (!x) return null;
  return (
    <section class="plan-section" data-section="saidHeld" data-testid={`${T}.saidHeld`}>
      <p class="figure" data-testid={`${T}.saidHeld.on`}>{fill(H.agreed, x)}</p>
      {x.notFull && <p class="line" data-testid={`${T}.saidHeld.notFull`}>{fill(x.notFull.n === '1' ? H.notFullOne : H.notFull, x.notFull)}</p>}
      {x.withdrawable && <div class="actions-row"><Button testid={`${T}.saidHeld.takeBack`} kind="quiet" disabled={!!V.saving} onClick={() => dispatch({ type: 'plan/agreeWithdraw', planId: V.id })} {...keepFocus}>{H.takeBack}</Button></div>}
    </section>
  );
}

/** Paying for it (7.12.0, a ladder): what pays for the buys, one reading, and what is held that the plan does not use. */
function Paying({ V, holdHref }) {
  const P = W.paying, O = W.outside;
  if (!V.paying && !(V.outside && V.outside.length)) return null;
  const slots = V.paying ? { ...V.paying.slots, from: P.from[V.paying.slots.from] || V.paying.slots.from } : {};
  const note = (n) => {
    if (!n) return '';
    if (n.id === 'gilt' || n.id === 'giltReal') return <>{fill(O.notes[n.id], n.slots)} {O.notes.sellOr} <a href={holdHref}>{O.notes.sayYears}</a>.{n.cashYear ? ' ' + fill(O.notes.cashYear, n.slots) : ''}</>;
    return fill(O.notes[n.id], n.slots);
  };
  return (
    <section class="plan-section" data-section="paying" data-testid={`${T}.paying`}>
      <h2>{P.title}</h2>
      {V.paying && <p class="line" data-testid={`${T}.paying.says`} data-ids={V.paying.ids.join(' ')}>{V.paying.ids.map((id) => fill(P[id], slots)).join(' ')}</p>}
      {V.outside && V.outside.length > 0 && (
        <>
          <h3>{O.title}</h3>
          <div class="table-wrap">
            <table class="way-table stack-table" data-testid={`${T}.outside`}>
              <thead><tr><th>{O.columns.what}</th><th>{O.columns.value}</th><th>{O.columns.note}</th></tr></thead>
              <tbody>{V.outside.map((r) => <tr key={r.key} data-key={r.key}><td data-label={O.columns.what}>{r.label}{r.ticker ? <> <span class="note">{r.ticker}</span></> : null}</td><td data-label={O.columns.value}>{r.value}</td><td data-label={O.columns.note}>{note(r.note)}</td></tr>)}</tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

/** What skipping it costs (§3.3): the uncovered years of a ladder, or the one optional run on the held mix. */
function Cost({ V, dispatch }) {
  const C = W.cost;
  const run = () => dispatch({ type: 'move/run', key: V.runKey });
  const h = V.heldRun;
  return (
    <section class="plan-section" data-section="cost" data-testid={`${T}.cost`}>
      <h2>{V.ladder ? C.titleLadder : C.title}</h2>
      {V.ladder && (V.cost.parts || []).map((x, i) => <p class="line" key={'part' + i} data-testid={`${T}.cost.part`}>{fill(C.part, x)}</p>)}
      {V.ladder && (V.cost.uncovered.length ? <p class="line" data-testid={`${T}.cost.ladder`}>{fill(C.ladder, { n: String(V.cost.uncovered.length), s: V.cost.uncovered.length === 1 ? '' : 's', have: V.cost.uncovered.length === 1 ? 'has' : 'have', years: V.cost.uncovered.length > 4 ? V.cost.uncovered[0] + ' to ' + V.cost.uncovered[V.cost.uncovered.length - 1] : V.cost.uncovered.join(', ') })}</p> : <p class="line" data-testid={`${T}.cost.ladderNone`}>{C.ladderNone}</p>)}
      {!V.ladder && !V.recorded && <p class="note" data-testid={`${T}.cost.nothing`}>{C.nothing} <a href={href.plan(V.id, 'hold')}>{W.buttons.hold}</a></p>}
      {!V.ladder && V.recorded && V.cost.canRun && (
        <>
          <p class="note">{C.lead}</p>
          {(h.status === 'idle' || h.status === 'done' || h.status === 'failed') && <div class="actions-row"><Button testid={`${T}.cost.button`} kind={h.status === 'idle' ? 'primary' : 'quiet'} onClick={run} {...keepFocus}>{h.status === 'idle' ? C.button : C.again}</Button></div>}
          {h.status === 'working' && <p class="working-note" role="status" data-testid={`${T}.cost.working`}>{C.working}</p>}
          {h.status === 'failed' && <div class="notice" role="alert" data-testid={`${T}.cost.failed`}><p>{h.reason === 'noWorker' ? C.noWorker : C.failed}</p></div>}
          {h.status === 'done' && h.result && (
            <div class="lever-result" data-testid={`${T}.cost.result`}>
              {h.result.unaffordable
                ? <p class="figure">{fill(C.unaffordable, { reason: h.result.reason ? fill(C.reasonWas, { reason: h.result.reason }) : '' })}</p>
                : <>
                  <p class="figure" data-testid={`${T}.cost.headline`}>{fill(C.result, { ...(h.result.pcts || V.held.pcts), words: h.result.words, ownWords: V.own ? V.own.words : '' })}</p>
                  <p class="note">{fill(C.left, { bad: h.result.badCaseLeft, typical: h.result.typicalLeft })}</p>
                </>}
              <p class="plan-source" data-testid={`${T}.cost.ran`}>{h.ms != null ? fill(C.ran, { ms: seconds(h.ms) }) : C.ranUntimed}</p>
            </div>
          )}
        </>
      )}
    </section>
  );
}

/** The saver's rule (§3.4): where new money goes, the two mixes side by side, when the move itself starts. */
function Waiting({ V }) {
  const S = W.waiting;
  return (
    <section class="plan-section" data-section="waiting" data-testid={`${T}.waiting`}>
      <p class="figure" data-testid={`${T}.waiting.line`}>{V.opens ? fill(S.line, { years: V.yearsToStart, opens: V.opens }) : fill(S.lineSoon, { years: V.yearsToStart })}</p>
      {V.newMoney ? <p class="line" data-testid={`${T}.waiting.newMoney`}>{fill(S.newMoney, { parts: V.newMoney.parts.map((p) => fill(S.newMoneyPart, p)).join(', '), monthly: V.newMoney.monthly })}</p> : <p class="note" data-testid={`${T}.waiting.noNewMoney`}>{S.newMoneyNone} <a href={href.plan(V.id, 'hold')}>{W.buttons.hold}</a></p>}
      {V.planMix && <p class="line" data-testid={`${T}.waiting.planMix`}>{fill(S.planMix, V.planMix)}</p>}
      {V.held && <p class="line" data-testid={`${T}.waiting.heldMix`}>{fill(S.heldMix, V.held.pcts)}</p>}
      {V.startsAround && <p class="note" data-testid={`${T}.waiting.starts`}>{fill(S.starts, { when: V.startsAround })}</p>}
    </section>
  );
}

/** The cash to hold now (§3.5): the document's cash, row by row. */
function Cash({ V }) {
  const C = W.cash;
  if (V.cashInfo) return <p class="note" data-testid={`${T}.cashInfo`}>{V.cashInfo.years.length ? fill(C.spending, { held: V.cashInfo.held, target: V.cashInfo.target, years: V.cashInfo.years.join(', ') }) : fill(C.spendingNone, { held: V.cashInfo.held })}</p>;
  if (!V.cash || !V.cash.rows.length) return null;
  return (
    <section class="plan-section" data-section="cash" data-testid={`${T}.cash`}>
      <h2>{C.title}</h2>
      <p class="note">{C.lead}</p>
      <div class="table-wrap">
        <table class="way-table stack-table" data-testid={`${T}.cash.table`}>
          <thead><tr><th>{C.columns.what}</th><th>{C.columns.need}</th><th>{C.columns.amount}</th></tr></thead>
          <tbody>
            {V.cash.rows.map((r, i) => <tr key={i} data-row={r.id}><td data-label={C.columns.what}>{fill(C.rows[r.id], r)}</td><td data-label={C.columns.need}>{r.gap ? fill(C.besideNeed, r) : r.need || '—'}</td><td data-label={C.columns.amount}>{r.amount || '—'}</td></tr>)}
            <tr data-row="total"><th scope="row">{C.total}</th><td></td><td data-label={C.columns.amount}>{V.cash.target}</td></tr>
            <tr data-row="held"><td data-label={C.columns.what}>{C.held}</td><td></td><td data-label={C.columns.amount}>{V.cash.held}</td></tr>
            <tr data-row={V.cash.spare != null ? 'spare' : 'short'}><td data-label={C.columns.what}>{V.cash.spare != null ? C.spare : C.short}</td><td></td><td data-label={C.columns.amount}>{V.cash.spare != null ? V.cash.spare : V.cash.short}</td></tr>
          </tbody>
        </table>
      </div>
      {V.cash.over && <p class="note" data-testid={`${T}.cash.over`}>{C.over}</p>}
    </section>
  );
}

/**
 * A pot plan's mix as held, as information (7.11.1): Living on it, or Moving once what is held was accepted — the mix held
 * against the plan's and where it can be tested. Never a Buy or Sell, a tick, a schedule or totals. (A ladder's is HeldLadder.)
 */
function Held({ V }) {
  const H = W.held;
  const I = V.heldInfo;
  return (
    <section class="plan-section" data-section="heldInfo" data-testid={`${T}.heldInfo`} data-kind={I.kind}>
      {I.agreed && !V.saidHeld && <p class="figure" data-testid={`${T}.heldInfo.agreed`}>{fill(H.agreed, I.agreed)}</p>}
      {I.noRecord && <p class="note" data-testid={`${T}.heldInfo.noRecord`}>{H.noRecord} <a href={href.plan(V.id, 'hold')}>{W.buttons.hold}</a></p>}
      {I.buckets && <><h2>{H.mixTitle}</h2><ul class="plan-lines" data-testid={`${T}.heldInfo.buckets`}>{I.buckets.map((b) => <li key={b.bucket} class="plan-line" data-bucket={b.bucket}>{fill(H.bucket[b.bucket], b)}</li>)}</ul></>}
      {I.unknown.map((name) => <p class="note" key={name} data-testid={`${T}.heldInfo.unknown`}>{fill(H.unknown, { name })}</p>)}
      {I.review && <p class="note" data-testid={`${T}.heldInfo.review`}>{H.review} <a href={I.review}>{H.reviewLink}</a>.</p>}
    </section>
  );
}

/** Buy and Sell (§3.5): the planner's two tables with a Done tick each; Already held; Left alone; the totals. */
function Lists({ V, dispatch, planId, KT }) {
  const L = W.lists;
  // what is held as information (7.11.1): the notes, what is kept and left alone stay; the moves are not drawn
  const held = V.mode === 'held';
  const tick = (item, action) => (
    <input type="checkbox" id={`${T}.tick.${item.key}`} data-testid={`${T}.tick.${item.key}`} checked={!!item.done} disabled={!V.editable || !!V.saving} aria-label={L.tick} title={item.done ? fill(L.ticked, { date: item.done }) : L.tick}
      onChange={(e) => dispatch({ type: 'plan/tick', planId, key: item.key, done: e.currentTarget.checked })} data-action={action} />
  );
  const table = (id, rows, action) => (
    <div class="table-wrap">
      <table class="way-table stack-table" data-testid={`${T}.${id}`}>
        <thead><tr><th>{L.columns.done}</th><th>{L.columns.what}</th><th>{L.columns.units}</th><th>{L.columns.amount}</th><th>{L.columns.why}</th></tr></thead>
        <tbody>{rows.map((r) => (
          <tr key={r.key} data-key={r.key} data-done={r.done ? '1' : '0'}>
            <td data-label={L.columns.done}>{tick(r, action)}{r.done ? <><br /><span class="note">{fill(L.ticked, { date: r.done })}</span></> : null}</td>
            <td data-label={L.columns.what}>{r.label}{r.ticker ? <> <span class="note">{r.ticker}{r.sedol ? ' · ' + r.sedol : ''}</span></> : null}</td>
            <td data-label={L.columns.units}>{r.units || '—'}</td><td data-label={L.columns.amount}>{r.amount || '—'}</td><td data-label={L.columns.why}>{whyText(r.why)}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
  return (
    <section class="plan-section" data-section="lists" data-testid={`${T}.lists`}>
      {V.paid.length > 0 && <p class="note" data-testid={`${T}.paid`}>{fill(L.paid, { list: V.paid.map((p) => p.label + (p.ticker ? ' (' + p.ticker + ')' : '')).join(', ') })}</p>}
      {V.matured.length > 0 && <p class="note" data-testid={`${T}.matured`}>{fill(L.matured, { list: V.matured.map((m) => m.label + ' — ' + whyText(m.why)).join('; ') })}</p>}
      {V.sold.length > 0 && <p class="note" data-testid={`${T}.soldStale`}>{fill(L.stale, { list: V.sold.map((m) => m.label + ' — ' + whyText(m.why)).join('; ') })}</p>}
      {!held && V.buy.length > 0 && <><h2>{L.buy}</h2>{table('buy', V.buy, 'buy')}</>}
      {!held && !V.ladderTotals && V.sell.length > 0 && <><h2>{L.sell}</h2>{table('sell', V.sell, 'sell')}</>}
      {!held && <Paying V={V} holdHref={href.plan(V.id, 'hold')} />}
      {!held && V.hold.length > 0 && (
        <>
          <h2>{L.held}</h2>
          <div class="table-wrap">
            <table class="way-table stack-table" data-testid={`${T}.held`}>
              <thead><tr><th>{L.columns.what}</th><th>{L.columns.held}</th><th>{L.columns.target}</th></tr></thead>
              <tbody>{V.hold.map((x) => <tr key={x.key} data-key={x.key}><td data-label={L.columns.what}>{x.label}{x.ticker ? <> <span class="note">{x.ticker}</span></> : null}</td><td data-label={L.columns.held}>{x.held.units ? fill(L.heldUnits, { units: x.held.units }) : x.held.value}{x.spare ? ' ' + fill(L.spare, { spare: x.spare }) : ''}</td><td data-label={L.columns.target}>{x.target.units ? fill(L.heldUnits, { units: x.target.units }) : x.target.value}</td></tr>)}</tbody>
            </table>
          </div>
        </>
      )}
      {/* 7.6.0: what the person keeps instead — held another way (and the rungs it covers), and kept by choice; never a sell */}
      {/* 7.7.0: what the person chose to keep, tested against the plan and agreed — or not yet (tested on What you hold) */}
      <KeepTestLine K={KT} prefix={T} />
      {V.standIn && V.standIn.length > 0 && <><h2>{GAPS.move.standIn}</h2><ul class="plan-lines" data-testid={`${T}.standIn`}>{V.standIn.map((x) => <li key={x.key} class="plan-line" data-key={x.key}>{fill(GAPS.move.standInOne, { label: x.label, years: x.years.join(', '), pays: x.pays })}</li>)}{V.covered.map((x) => <li key={x.key} class="plan-line note" data-key={x.key}>{fill(GAPS.move.covered, { label: x.label, years: x.years.join(', ') })}</li>)}</ul></>}
      {V.kept && V.kept.length > 0 && <><h2>{GAPS.move.kept}</h2><ul class="plan-lines" data-testid={`${T}.kept`}>{V.kept.map((x) => <li key={x.key} class="plan-line" data-key={x.key}>{fill(GAPS.move.keptOne, { label: x.label, wrapper: W.wrappers[x.wrapper] || x.wrapper, value: x.value, gaps: x.fundsGaps ? (V.ladder ? GAPS.move.keptGaps : GAPS.move.keptPlan) : '' })}</li>)}</ul></>}
      {V.recorded && <p class="note">{L.fix}</p>}
      {/* living on the plan (7.11.1): an ISA, taxable-account or bank line is outside the pension, never "left alone" by a move */}
      {V.keep.length > 0 && <><h2>{held ? W.held.outsideTitle : L.keep}</h2><ul class="plan-lines" data-testid={`${T}.keep`}>{V.keep.map((k, i) => <li key={i} class="plan-line">{held ? fill(W.held.outsideOne, { label: k.label, wrapper: W.wrappers[k.wrapper] || k.wrapper, value: k.value }) : fill(L.keepOne, { label: k.label, wrapper: W.wrappers[k.wrapper] || k.wrapper, value: k.value, why: whyText(k.why) })}</li>)}</ul></>}
      {!held && !V.complete && <p class="note" data-testid={`${T}.totals`}>{V.ladderTotals ? fill(L[V.ladderTotals.id], V.ladderTotals.slots) : fill(L.totals, V.totals) + (V.totals.short ? fill(L.short, { short: V.totals.short }) : '')}</p>}
    </section>
  );
}

/** When (§3.5): the schedule as "By {month year}: {action}" lines. */
function Schedule({ V }) {
  const S = W.schedule;
  const s = V.schedule;
  if (!s || !s.steps.length) return null;
  return (
    <section class="plan-section" data-section="schedule" data-testid={`${T}.schedule`}>
      <h2>{S.title}</h2>
      {/* a ladder (7.12.0): what pays for the buys is said once, under Paying for it; the schedule raises one amount a date */}
      <p class="note">{s.startPassed ? fill(S.passed, { months: s.months, s: s.months === '1' ? '' : 's' }) + ' ' : ''}{V.ladder ? fill(S.leadLadder, { tranches: s.tranches }) : fill(S.lead, { tranches: s.tranches, s: s.tranches === '1' ? '' : 's' }) + (s.funded ? ' ' + fill(S.funded, { newMoney: s.newMoney ? S.fundedNewMoney : '' }) : '')}</p>
      <ul class="plan-lines" data-testid={`${T}.schedule.steps`}>{s.steps.map((st, i) => <li key={i} class="plan-line" data-action={st.action}>{st.action === 'raise' ? fill(S.raise, { when: st.when, amount: st.amount }) : fill(S.step, { when: st.when, action: st.action === 'buy' ? S.buy : S.sell, label: st.label, units: unitsText(st.units), amount: amountText(st.amount) })}</li>)}</ul>
    </section>
  );
}

/** The order sheet (§3.6): the document's rungs; the units and the cost held back behind "Show the sheet anyway" while sized on an assumed State Pension. */
function Sheet({ V, dispatch }) {
  const S = W.sheet;
  if (!V.ladder || !V.sheet.length) return null;
  const gated = !!V.spGate && !V.sheetOpen;
  const held = V.mode === 'held';
  const bought = (r) => (r.bought ? S.bought[r.bought] || r.bought : '—');
  return (
    <section class="plan-section" data-section="sheet" data-testid={`${T}.sheet`} data-gated={V.spGate ? (V.sheetOpen ? 'open' : '1') : '0'}>
      <h2>{S.title}</h2>
      {V.spGate && (
        <div class="notice" role="status" data-testid={`${T}.sheet.gate`}>
          <p>{fill(S.gate, V.spGate)} <a href={href.plan(V.id, 'about')}>{W.buttons.about}</a></p>
          <p>{S.gateHeld}</p>
          <div class="actions-row"><Button testid={`${T}.sheet.anyway`} kind="quiet" onClick={() => dispatch({ type: 'ui/toggle', id: 'moveSheet' })} aria-expanded={V.sheetOpen ? 'true' : 'false'} {...keepFocus}>{V.sheetOpen ? S.hideAnyway : S.showAnyway}</Button></div>
        </div>
      )}
      {/* living on the plan (7.11.1): the same sheet, read as what the plan holds — "Bought" beside each gilt, so a phone sees it
          without scrolling; how to give an order only while a rung is still not fully bought */}
      <p class="note">{fill(held ? S.leadHeld : S.lead, { date: V.pricedOn || '' })}</p>
      {(!held || V.sheet.some((r) => r.bought === 'part' || r.bought === 'not yet')) && <p class="note">{S.order}</p>}
      <div class="table-wrap">
        <table class="way-table" data-testid={`${T}.sheet.table`}>
          <thead><tr><th>{S.columns.n}</th><th>{held ? S.gilt : S.columns.buy}</th>{held && <th>{S.columns.bought}</th>}<th>{S.columns.code}</th><th>{S.columns.sedol}</th><th>{S.columns.matures}</th><th>{S.columns.pays}</th><th>{S.columns.years}</th><th>{held ? S.units : S.columns.units}</th><th>{S.columns.price}</th><th>{S.columns.cost}</th>{!held && <th>{S.columns.bought}</th>}</tr></thead>
          <tbody>{V.sheet.map((r) => (
            <tr key={r.n} data-rung={r.n} data-bought={r.bought || ''}>
              <td>{r.n}</td><td>{r.name}</td>{held && <td>{bought(r)}</td>}<td>{r.tidm}</td><td>{r.sedol}</td><td>{r.matures}</td><td>{r.pays}</td><td>{r.taxYears.join(', ')}{r.taxYears.length > 1 ? ' ' + S.surplus : ''}</td>
              <td>{gated ? S.withheld : r.nominal ? <><strong>{String(r.nominal).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</strong><br /><span class="note">{fill(S.lots, { lots: String(Math.round(+r.nominal / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ',') })}</span></> : '—'}</td>
              <td>{gated ? S.withheld : r.cleanPrice || '—'}</td><td>{gated ? S.withheld : r.cost}</td>{!held && <td>{bought(r)}</td>}
            </tr>
          ))}</tbody>
        </table>
      </div>
    </section>
  );
}

/** "Gilt ladders explained" (§3.6), closed, with the worked example from this plan's own first rung. */
function Explained({ V, dispatch }) {
  const E = W.explained;
  if (!V.ladder) return null;
  return (
    <section class="plan-section" data-section="explained" data-testid={`${T}.explained`}>
      <div class="actions-row"><Button testid={`${T}.explained.open`} kind="quiet" onClick={() => dispatch({ type: 'ui/toggle', id: 'moveExplained' })} aria-expanded={V.explainedOpen ? 'true' : 'false'} {...keepFocus}>{V.explainedOpen ? E.close : E.open}</Button></div>
      {V.explainedOpen && (
        <div data-testid={`${T}.explained.body`}>
          <ol class="plan-lines">{E.lines.map((l, i) => <li key={i} class="plan-line">{l}</li>)}</ol>
          {V.example && <p class="line" data-testid={`${T}.explained.example`}>{fill(E.example, { ...V.example, nominal: String(V.example.nominal).replace(/\B(?=(\d{3})+(?!\d))/g, ',') })}</p>}
          <p class="note">{E.not}</p>
        </div>
      )}
    </section>
  );
}

/** The rotation watch and the sell ticket (§3.7); the switch itself hands over to the planner. */
function Watch({ V, onChange }) {
  const R = W.watch;
  const x = V.watch;
  if (!x) return null;
  const m = x.market;
  return (
    <section class="plan-section" data-section="watch" data-testid={`${T}.watch`} data-state={x.state} data-live={m && m.live ? '1' : '0'}>
      <h2>{R.title}</h2>
      <p class="figure" data-testid={`${T}.watch.state`}>{x.state === 'fired' ? fill(R.fired, { on: x.firedOn ? fill(R.firedOn, { date: x.firedOn }) : '', cutAge: x.cutAge }) : x.state === 'disarmed' ? fill(R.disarmed, x) : fill(R.armed, { trigger: x.triggerPct, disarmAge: x.disarmAge, cutAge: x.cutAge })}</p>
      {x.block && <p class="line" data-testid={`${T}.watch.block`}>{fill(R.block, { ...x.block, years: x.block.years.length > 2 ? x.block.years[0] + ' to ' + x.block.years[x.block.years.length - 1] : x.block.years.join(' and ') })}</p>}
      <p class="note">{fill(R.rule, { trigger: x.triggerPct })}</p>
      {m ? <p class="line" data-testid={`${T}.watch.market`}>{fill(m.symbol ? R.market : R.marketNoSymbol, { ...m, asOf: m.asOf || '', athOn: m.athOn ? fill(R.athOn, { athOn: m.athOn }) : '' })}</p> : <p class="note" data-testid={`${T}.watch.noIndex`}>{R.noIndex}</p>}
      {m && m.asOf && <p class="plan-source" data-testid={`${T}.watch.asOf`}>{fill(R.indexAsOf, { asOf: m.asOf })}</p>}
      {m && x.state === 'armed' && (m.live ? <div class="notice" role="alert" data-testid={`${T}.watch.live`}><p>{fill(R.live, { below: m.below })}</p></div> : <p class="note" data-testid={`${T}.watch.quiet`}>{fill(R.quiet, { below: m.below })}</p>)}
      {x.ticket && x.state === 'armed' && (
        <div data-testid={`${T}.watch.ticket`}>
          <h3>{R.ticket.title}</h3>
          <p class="note">{R.ticket.lead}</p>
          <div class="table-wrap">
            <table class="way-table" data-testid={`${T}.watch.ticket.table`}>
              <thead><tr><th>{R.ticket.columns.n}</th><th>{R.ticket.columns.sell}</th><th>{R.ticket.columns.sedol}</th><th>{R.ticket.columns.code}</th><th>{R.ticket.columns.matures}</th><th>{R.ticket.columns.units}</th><th>{R.ticket.columns.proceeds}</th><th>{R.ticket.columns.pays}</th><th>{R.ticket.columns.years}</th></tr></thead>
              <tbody>
                {x.ticket.rows.map((r) => <tr key={r.n}><td>{r.n}</td><td>{r.name}</td><td>{r.sedol}</td><td>{r.tidm}</td><td>{r.matures}</td><td><strong>{String(r.nominal).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</strong></td><td>{r.proceeds}</td><td>{r.pays}</td><td>{r.taxYears.join(', ')}</td></tr>)}
                <tr data-row="total"><th scope="row" colSpan={6}>{fill(R.ticket.total, { n: String(x.ticket.rows.length) })}</th><td>{x.ticket.proceeds}</td><td>{x.ticket.income}</td><td></td></tr>
              </tbody>
            </table>
          </div>
          <p class="note">{R.ticket.note}</p>
          {V.editable && <p class="note">{fill(R.switchLead, { cutAge: x.cutAge })}</p>}
          {V.editable && <div class="actions-row"><Button testid={`${T}.watch.switch`} kind="plain" onClick={() => onChange('rotation')} {...keepFocus}>{R.switchButton}</Button></div>}
        </div>
      )}
    </section>
  );
}

const toastText = (toast) => {
  if (toast.kind === 'undone') return W.toast.undone;
  if (toast.kind === 'unchanged') return W.toast.unchanged;
  const line = toast.line;
  if (line && W.toast[line.id]) return fill(W.toast[line.id], line.slots || {});
  return W.toast.savedShort;
};

export function MoveScreen(state, dispatch) {
  const view = planView(state);
  const V = planMoveView(state);
  const list = view.found ? null : (state.plans ? state.plans.status : 'none');
  if (!view.found || !V.found) {
    const waiting = list === 'none' || list === 'checking' || list === 'reading' || (view.found && !V.found);
    return {
      question: null, rail: false, full: false,
      content: (
        <>
          <h1 tabIndex={-1}>{W.title}</h1>
          {waiting ? <p class="lead" role="status" data-testid="plan.opening">{PLAN.list.opening}</p>
            : state.session.kind === 'nobody' && (!state.plans || !state.plans.list.length) ? <p class="lead" data-testid="plan.signIn">{PLAN.list.signIn} <a href={href.plans()}>{PLAN.list.toPlans}</a></p>
              : <p class="lead" data-testid="plan.unknown">{PLAN.list.unknown} <a href={href.plans()}>{PLAN.list.toPlans}</a></p>}
        </>
      )
    };
  }
  const planId = V.id;
  const onChange = (place, id = view.id, month = null) => dispatch(changeAction(id, place, href.plan(view.id, 'move'), month));
  const rail = <PlanRail view={view} state={state} dispatch={dispatch} onChange={onChange} />;
  const back = href.plan(view.id, 'plan');
  // 7.12.0: living on a ladder, the page is "Your plan's mix" alone (HeldLadder.jsx)
  const heldLadder = V.mode === 'held' && !!V.heldView;
  const problem = V.problem ? fill(W.problems[V.problem] || W.problems.failed, { store: W.problems.store[V.source] || 'account' }) : null;
  const headAndTitle = (
    <>
      <Head view={view} />
      {/* by the name the rail and the home give it: on a Drawing plan, the mix it keeps to (7.3.1) */}
      <h1 tabIndex={-1} data-testid="plan.step.move">{stepNameOf('move', view)}</h1>
      {/* 7.11.1: Living on it (or Moving once what is held was accepted) the page is what is held, never a move; on a ladder
          (7.12.0) "Your plan's mix" says its own lead */}
      {!heldLadder && <p class="lead" data-testid={`${T}.lead`}>{V.mode === 'held' ? W.held.lead : W.lead}</p>}
    </>
  );
  // not locked (§3.1), or a document that cannot be read: what the lock makes, and nothing else drawn
  if (!V.locked || V.kind === 'none') {
    return {
      question: null, rail, full: false,
      content: (
        <>
          {headAndTitle}
          <p class="notice" role="status" data-testid={`${T}.notLocked`}>{V.locked ? (V.unread ? W.unread : W.notRun) : W.notLocked}{!V.locked ? <> <a href={href.plan(view.id, 'lock')}>{W.buttons.lock}</a></> : null}</p>
          <p class="plan-source" data-testid={`${T}.footer`}>{W.footer}</p>
          <div class="actions-row"><LinkButton testid={`${T}.back`} kind="quiet" href={back}>{W.buttons.back}</LinkButton></div>
        </>
      )
    };
  }
  return {
    question: null, rail, full: false,
    content: (
      <>
        {headAndTitle}
        {V.readonly && <p class="notice" role="status" data-testid={`${T}.readonly`}>{W.readonly}</p>}
        {/* a closed plan (6.56.0): its record and its tick-offs moved to the plan that carries it on */}
        {V.closed && <p class="notice" role="status" data-testid={`${T}.closed`}>{V.closed.next ? fill(w.closedStep, { name: V.closed.next.name }) : w.closedStepAlone}{V.closed.next && <> <LinkButton testid={`${T}.closed.open`} kind="quiet" href={href.plan(V.closed.next.id)}>{fill(PLAN.buttons.openNext, { name: V.closed.next.name })}</LinkButton></>}</p>}
        <div class="plan-panel" data-region="plan-move" data-editable={V.editable ? '1' : '0'} data-kind={V.kind} data-waiting={V.waiting ? '1' : '0'} data-mode={V.mode || 'move'}>
          {heldLadder ? <><SaidHeld V={V} dispatch={dispatch} /><HeldLadder v={V.heldView} prefix={T} holdHref={href.plan(view.id, 'hold')} /></> : V.mode === 'held' ? (
            <>
              <SaidHeld V={V} dispatch={dispatch} />
              <Held V={V} />
              <Lists V={V} dispatch={dispatch} planId={planId} KT={planKeepTestView(state)} />
              <GapsSection gaps={V.gaps} prefix={T} />
            </>
          ) : <>
          <Status V={V} />
          <SayHeld V={V} dispatch={dispatch} />
          <Cost V={V} dispatch={dispatch} />
          {V.waiting ? <Waiting V={V} /> : (
            <>
              <Cash V={V} />
              <Lists V={V} dispatch={dispatch} planId={planId} KT={planKeepTestView(state)} />
              <GapsSection gaps={V.gaps} prefix={T} />
              <Schedule V={V} />
              <section class="plan-section" data-section="how" data-testid={`${T}.how`}>
                <div class="actions-row"><Button testid={`${T}.how.open`} kind="quiet" onClick={() => dispatch({ type: 'ui/toggle', id: 'moveHow' })} aria-expanded={V.howOpen ? 'true' : 'false'} {...keepFocus}>{V.howOpen ? W.how.close : W.how.open}</Button></div>
                {V.howOpen && <ul class="plan-lines" data-testid={`${T}.how.items`}>{W.how.items.map((l, i) => <li key={i} class="plan-line">{i === 0 && V.ladder ? fill(W.how.accountsLadder, { isa: W.isa[V.isa || 'none'] }) : l}</li>)}</ul>}
              </section>
            </>
          )}
          </>}
          {!heldLadder && <Sheet V={V} dispatch={dispatch} />}
          <Explained V={V} dispatch={dispatch} />
          <Watch V={V} onChange={onChange} />
          {problem && <p class="notice" role="alert" data-testid={`${T}.problem`} data-problem={V.problem}>{problem}</p>}
          {!heldLadder && <p class="plan-source" data-testid={`${T}.footer`}>{W.footer}</p>}
        </div>
        <div class="actions-row">
          <LinkButton testid={`${T}.hold`} kind="plain" href={href.plan(view.id, 'hold')}>{W.buttons.hold}</LinkButton>
          <LinkButton testid={`${T}.back`} kind="quiet" href={back}>{W.buttons.back}</LinkButton>
        </div>
        <UndoToast prefix={T} toast={V.toast} text={V.toast ? toastText(V.toast) : ''} words={W.buttons}
          onUndo={() => dispatch({ type: 'plan/undo', planId })} onClose={() => dispatch({ type: 'plan/toastClose' })} />
      </>
    )
  };
}
