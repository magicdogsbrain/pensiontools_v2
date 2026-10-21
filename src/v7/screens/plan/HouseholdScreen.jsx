/**
 * "Your household" (research/v7/road-to-7.md step 9; your-plan.md 6; v6-usability-audit.md 2.10): the household rail step made
 * real. The partner's plan linked either way (link, unlink, open); the pooled verdict first — both plans through the one
 * test, each as it is and drawing together, the household lasting when one pot pays for the other — then each plan alone;
 * "Who draws what" with its limit, "Use this split" (copies when a plan is locked) and "Keep things as they are"; the survivor
 * and care questions in ages, try-only; one budget for the household with "Keeping money separate?"; and the budget's
 * who-pays. Draws only: everything is the reading's (state/select.js planHouseholdView: answers/plan/household.js through the
 * plan source) and the runs' status is the state's (effects/household.js). No figure is worked out here. The writes are the one
 * write file's (effects/planWrite.js: link, split, dismiss, budgetShare, and the step's save for who pays).
 */
import { PlanRail, EditField, UndoToast, fill, Button, LinkButton } from '../../components/index.js';
import { planView, planHouseholdView } from '../../state/select.js';
import { href } from '../../router/routes.js';
import { PLAN } from '../../copy/plan.js';
import { HOUSEHOLD as W } from '../../copy/household.js';
import { WAY } from '../../copy/way.js';

const w = PLAN.page;
const keepFocus = { onMouseDown: (e) => e.preventDefault() };
const seconds = (ms) => (Math.round((ms || 0) / 100) / 10).toFixed(1);
const T = 'plan.household';

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

/** A confirm step on the page (never a browser dialog). */
function Confirm({ id, title, body, lines = null, yes, no, onYes, onNo }) {
  return (
    <div class="notice lock-confirm" role="region" aria-label={title} data-testid={id}>
      <h3>{title}</h3>
      <p>{body}</p>
      {lines && <ul class="plan-lines">{lines.map((l, i) => <li key={i} class="plan-line">{l}</li>)}</ul>}
      <div class="actions-row">
        <Button testid={`${id}.yes`} kind="primary" onClick={onYes} {...keepFocus}>{yes}</Button>
        <Button testid={`${id}.no`} kind="quiet" onClick={onNo} {...keepFocus}>{no}</Button>
      </div>
    </div>
  );
}

/** The partner's plan (6): linked either way, with Open and Unlink; or the other plans here to link. */
function Partner({ V, dispatch, planId }) {
  const P = W.partner;
  const names = V.names;
  const pick = (what) => dispatch({ type: 'household/pick', what });
  if (V.partner) {
    const p = V.partner;
    const line = p.line ? fill(PLAN.theirLines[p.line.id] || '', p.line.slots) : '';
    const by = p.linkedBy === 'both' ? P.linkedBoth : p.linkedBy === 'mine' ? fill(P.linkedMine, { name: p.name }) : fill(P.linkedTheirs, { name: p.name });
    return (
      <section class="plan-section" data-section="partner">
        <h2>{W.sections.partner}</h2>
        <p class="line" data-testid={`${T}.with`}>{fill(P.with, { name: p.name, line })}</p>
        <p class="note" data-testid={`${T}.linkedBy`}>{by}{p.locked ? ' ' + fill(W.locked.partner, { name: p.name }) : ''}</p>
        {!p.configured && <p class="notice" role="status" data-testid={`${T}.partnerNotSet`}>{fill(P.notSet, { name: p.name })}</p>}
        <div class="actions-row">
          <LinkButton testid={`${T}.openPartner`} kind="plain" href={href.plan(p.id)}>{fill(P.open, { name: p.name })}</LinkButton>
          {V.editable && p.linkedBy !== 'theirs' && V.pick !== 'unlink' && <Button testid={`${T}.unlink`} kind="quiet" onClick={() => pick('unlink')} {...keepFocus}>{P.unlink}</Button>}
        </div>
        {V.pick === 'unlink' && <Confirm id={`${T}.unlinkConfirm`} title={P.unlink} body={fill(P.unlinkConfirm, { name: p.name })} yes={P.unlink} no={W.split.confirm.notNow}
          onYes={() => dispatch({ type: 'plan/linkPartner', planId, partnerId: null })} onNo={() => pick(null)} />}
      </section>
    );
  }
  const choice = V.fields.find((f) => f.path === 'link.choice');
  const chosen = choice && choice.shown ? V.candidates.find((c) => c.id === choice.shown) : null;
  return (
    <section class="plan-section" data-section="partner">
      <h2>{W.sections.partner}</h2>
      <p class="line" data-testid={`${T}.none`}>{V.missing ? fill(P.missing, { store: P.store[V.source] || 'account' }) : P.none}</p>
      {V.editable && V.candidates.length === 0 && <p class="note" data-testid={`${T}.noOthers`}>{P.noOthers}</p>}
      {V.editable && V.candidates.length > 0 && (
        <div class="field field-choice" data-field="link.choice">
          <label for={`${T}.link.choice`}>{P.chooseLabel}</label>
          <div class="box">
            <select id={`${T}.link.choice`} data-testid={`${T}.link.choice`} name={`${T}.link.choice`} value={choice ? choice.shown : ''} onChange={(e) => dispatch({ type: 'plan/edit', planId, path: 'link.choice', value: e.currentTarget.value })}>
              <option value="">{P.chooseNone}</option>
              {V.candidates.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div class="actions-row">
            <Button testid={`${T}.link`} kind="primary" disabled={!chosen} onClick={() => { if (chosen) dispatch({ type: 'plan/linkPartner', planId, partnerId: chosen.id }); }} {...keepFocus}>{chosen ? fill(P.link, { name: chosen.name }) : P.choose}</Button>
          </div>
        </div>
      )}
      {!V.editable && <p class="note">{W.readonly}</p>}
      {V.missing && V.editable && <p class="note">{fill(P.linkConfirm, { name: names.b })}</p>}
    </section>
  );
}

/** The year-by-year tables (the planner's two), behind one button. */
function Detail({ V, dispatch }) {
  const D = W.detail;
  if (!V.verdict) return null;
  const toggle = () => dispatch({ type: 'ui/toggle', id: 'hhDetail' });
  const bridge = V.timeline.filter((r) => r.bridge).pop();
  return (
    <section class="plan-section" data-section="detail">
      <div class="actions-row"><Button testid={`${T}.detail`} kind="quiet" onClick={toggle} {...keepFocus} aria-expanded={V.detailOpen ? 'true' : 'false'}>{V.detailOpen ? D.close : D.open}</Button></div>
      {V.detailOpen && (
        <>
          <h3>{D.timeline.title}</h3>
          {bridge && <p class="note" data-testid={`${T}.bridgeNote`}>{fill(D.timeline.bridge, { year: String(Number(bridge.year) + 1) })}</p>}
          <div class="table-wrap">
            <table class="way-table" data-testid={`${T}.timeline`}>
              <thead><tr><th>{D.timeline.columns.year}</th><th>{fill(D.timeline.columns.a, { name: V.names.a })}</th><th>{fill(D.timeline.columns.b, { name: V.names.b })}</th><th>{D.timeline.columns.sp}</th><th>{D.timeline.columns.other}</th><th>{D.timeline.columns.draw}</th></tr></thead>
              <tbody>{V.timeline.filter((r, i, all) => i % 5 === 0 || (i > 0 && (r.workingA !== all[i - 1].workingA || r.workingB !== all[i - 1].workingB || r.sp !== all[i - 1].sp || r.other !== all[i - 1].other))).map((r) => (
                <tr key={r.year}><td>{r.year}</td><td>{r.workingA ? D.timeline.working : r.needA}</td><td>{r.workingB ? D.timeline.working : r.needB}</td><td>{r.sp}</td><td>{r.other}</td><td>{r.draw}</td></tr>
              ))}</tbody>
            </table>
          </div>
          <p class="note">{D.timeline.note}</p>
          <h3>{D.left.title}</h3>
          <p class="note">{D.left.lead}</p>
          <div class="table-wrap">
            <table class="way-table" data-testid={`${T}.left`}>
              <thead><tr><th>{D.left.columns.year}</th><th>{D.left.columns.p10}</th><th>{D.left.columns.p50}</th><th>{D.left.columns.p90}</th></tr></thead>
              <tbody>{V.left.map((f) => <tr key={f.year}><td>{f.year}</td><td>{f.p10}</td><td>{f.p50}</td><td>{f.p90}</td></tr>)}</tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

/** The pooled verdict first (2.10), each plan alone second. */
function Verdict({ V, dispatch }) {
  const C = W.verdict;
  const run = () => dispatch({ type: 'household/run', key: V.runKey, limit: V.run.limit });
  if (!V.partner || !V.runKey) return null;
  const v = V.verdict;
  return (
    <section class="plan-section" data-section="verdict" data-status={V.status} data-testid={`${T}.verdict`}>
      <h2>{W.sections.verdict}</h2>
      {!V.partner.configured && <p class="note">{fill(W.partner.notSet, { name: V.partner.name })}</p>}
      {(V.status === 'idle' || V.status === 'done' || V.status === 'failed') && V.partner.configured && (
        <div class="actions-row"><Button testid={`${T}.check`} kind={V.status === 'idle' ? 'primary' : 'quiet'} onClick={run} {...keepFocus}>{V.status === 'idle' ? C.button : V.stale ? C.rerun : C.again}</Button></div>
      )}
      {V.status === 'working' && (
        <div class="working" role="status" data-testid={`${T}.working`}>
          <p class="working-title">{C.working}</p>
          {V.progress && V.progress.total > 0 ? <progress value={V.progress.done} max={V.progress.total} aria-label={C.progress} /> : <progress aria-label={C.progress} />}
        </div>
      )}
      {V.status === 'failed' && <div class="notice" role="alert" data-testid={`${T}.failed`}><p>{V.reason === 'noWorker' ? C.noWorker : C.failed}</p></div>}
      {V.status === 'done' && V.unaffordable && <div class="notice" role="alert" data-testid={`${T}.unaffordable`}><p>{V.unaffordable.kind === 'partnerNotSet' ? fill(W.partner.notSet, { name: V.names.b }) : fill(C.unaffordable, { name: V.unaffordable.which, reason: V.unaffordable.reason ? fill(C.reasonWas, { reason: V.unaffordable.reason }) : '' })}</p></div>}
      {V.status === 'done' && v && (
        <div class="lever-result" data-testid={`${T}.result`} data-head={v.head}>
          <p class="figure" data-testid={`${T}.headline`}>{C.head[v.head]}: {fill(C.headline, { words: v.words })}</p>
          {v.pooled && <p class="note" data-testid={`${T}.pooled`}>{C.pooled}</p>}
          {v.covered && <p class="note" data-testid={`${T}.covered`}>{fill(v.covered.earliest ? C.coveredEarliest : C.covered, v.covered)}</p>}
          <div class="table-wrap">
            <table class="way-table" data-testid={`${T}.rows`}>
              <tbody>{v.rows.map((r) => (
                <tr key={r.id} data-row={r.id} data-pct={r.pct}><th scope="row">{fill(C.rows[r.id], { name: r.name || '' })}</th><td>{r.id === 'household' ? fill(C.cellHousehold, { words: r.words }) : fill(C.cell, { words: r.words, pct: r.pct })}</td></tr>
              ))}</tbody>
            </table>
          </div>
          <p class="note">{fill(C.ways, { wayA: WAY.names[V.sids.a] || V.sids.a, wayB: WAY.names[V.sids.b] || V.sids.b, a: V.names.a, b: V.names.b })}{v.shifted ? ' ' + C.shifted : ''}</p>
          <p class="note">{C.same}</p>
          {v.weak && <p class="note" data-testid={`${T}.whatToDo`}>{fill(C.whatToDo, v.weak)}</p>}
          {V.stale && <p class="working-note" data-testid={`${T}.stale`}>{C.stale}</p>}
          <p class="plan-source" data-testid={`${T}.ran`}>{V.ms != null ? fill(C.ran, { runs: V.runs, s: V.runs === '1' ? '' : 's', ms: seconds(V.ms) }) : fill(C.ranUntimed, { runs: V.runs, s: V.runs === '1' ? '' : 's' })}</p>
        </div>
      )}
    </section>
  );
}

/** Who draws what (household-draw-split.md 4): the headline, the table, the limit, the choices. */
function Split({ V, dispatch, planId, F }) {
  const S = W.split;
  const s = V.split;
  if (!V.verdict || !s) return null;
  const pick = (what) => dispatch({ type: 'household/pick', what });
  const kept = V.kept;
  const limitBoxes = (
    <div class="plan-section" data-section="limit">
      <h3>{fill(S.limit.title, { small: s.smallerName })}</h3>
      <p class="note">{fill(S.limit.lead, { small: s.smallerName })}</p>
      {F('limit.kind', { nested: { untilAge: F('limit.age'), keepAtLeast: F('limit.amount') } })}
      {V.stale && <div class="actions-row"><Button testid={`${T}.rerun`} kind="primary" onClick={() => dispatch({ type: 'household/run', key: V.runKey, limit: V.run.limit })} {...keepFocus}>{W.verdict.rerun}</Button></div>}
    </div>
  );
  if (kept) {
    return (
      <section class="plan-section" data-section="split" data-testid={`${T}.split`}>
        <h2>{W.sections.split}</h2>
        <div class="notice" role="status" data-testid={`${T}.kept`}>
          <p>{fill(S.kept, { a: kept.names.a, b: kept.names.b, where: S.keptWhere[kept.where] || kept.where })}</p>
          <div class="actions-row"><LinkButton testid={`${T}.openCopy.a`} href={href.plan(kept.ids.a)}>{fill(S.openCopy, { name: kept.names.a })}</LinkButton><LinkButton testid={`${T}.openCopy.b`} href={href.plan(kept.ids.b)}>{fill(S.openCopy, { name: kept.names.b })}</LinkButton></div>
        </div>
      </section>
    );
  }
  if (!s.applies) {
    return (
      <section class="plan-section" data-section="split" data-testid={`${T}.split`} data-applies="0">
        <h2>{W.sections.split}</h2>
        <p class="note" data-testid={`${T}.split.none`}>{s.unchanged ? S.unchanged : S.none}</p>
        {V.editable && limitBoxes}
      </section>
    );
  }
  if (s.dismissed) {
    return (
      <section class="plan-section" data-section="split" data-testid={`${T}.split`} data-applies="1" data-dismissed="1">
        <h2>{W.sections.split}</h2>
        <p class="note" data-testid={`${T}.split.dismissed`}>{S.dismissed}</p>
        {V.editable && <div class="actions-row"><Button testid={`${T}.showAgain`} kind="quiet" onClick={() => dispatch({ type: 'plan/keepAsIs', planId, dismiss: false })} {...keepFocus}>{S.showAgain}</Button></div>}
      </section>
    );
  }
  const stepWords = (k) => s.steps[k].map((x) => fill(S.steps.step, x)).join(', ');
  const copies = s.mode === 'copies';
  return (
    <section class="plan-section" data-section="split" data-testid={`${T}.split`} data-applies="1" data-mode={s.mode}>
      <h2>{W.sections.split}</h2>
      <p class="figure" data-testid={`${T}.split.headline`}>{fill(S.headline, { year: s.saving.year, until: s.saving.until, small: s.smallerName, untilAge: s.untilAge })}</p>
      <p class="note" data-testid={`${T}.split.why`}>{fill(S.why, { a: s.pots.a, b: s.pots.b, big: s.biggerName, small: s.smallerName, over: s.unused.over, allowance: s.unused.allowance, band: s.unused.band === 'most' ? S.bandMost : s.unused.band })}</p>
      <p class="note" data-testid={`${T}.split.cost`}>{s.cost ? fill(S.cost, { small: s.smallerName, together: s.cost.together, own: s.cost.own, untilAge: s.untilAge }) : fill(S.costShort, { small: s.smallerName })}</p>
      <div class="table-wrap">
        <table class="way-table" data-testid={`${T}.split.table`}>
          <thead><tr><th>{S.columns.what}</th><th>{S.columns.own}</th><th>{S.columns.together}</th></tr></thead>
          <tbody>
            <tr data-row="taxYear"><th scope="row">{S.rows.taxYear}</th><td>{s.tax.firstYear ? s.tax.firstYear.own : '—'}</td><td>{s.tax.firstYear ? s.tax.firstYear.together : '—'}</td></tr>
            <tr data-row="taxUntil"><th scope="row">{fill(S.rows.taxUntil, { small: s.smallerName, untilAge: s.untilAge })}</th><td>{fill(S.both, { own: s.tax.until.own, together: s.tax.whole.own })}</td><td>{fill(S.both, { own: s.tax.until.together, together: s.tax.whole.together })}</td></tr>
            <tr data-row="potA"><th scope="row">{fill(S.rows.potA, { name: V.names.a, ages: s.ages })}</th><td>{s.own ? s.own.a : '…'}</td><td>{s.together ? s.together.a : '…'}</td></tr>
            <tr data-row="potB"><th scope="row">{fill(S.rows.potB, { name: V.names.b, ages: s.ages })}</th><td>{s.own ? s.own.b : '…'}</td><td>{s.together ? s.together.b : '…'}</td></tr>
            <tr data-row="lasts"><th scope="row">{S.rows.lasts}</th><td>{s.own ? s.own.lasts : '…'}</td><td>{s.together ? s.together.lasts : '…'}</td></tr>
            <tr data-row="left"><th scope="row">{fill(S.rows.left, { name: V.names.a })}</th><td>{s.own ? s.own.left : '…'}</td><td>{s.together ? s.together.left : '…'}</td></tr>
          </tbody>
        </table>
      </div>
      <p class="note" data-testid={`${T}.split.closing`}>{s.betterOff ? fill(S.closing, { small: s.smallerName, amount: s.betterOff.amount, better: s.betterOff.better ? S.better.yes : S.better.no }) : fill(S.closingShort, { small: s.smallerName })} <strong>{S.choice}</strong></p>
      {s.note2028 && <p class="notice" data-testid={`${T}.split.note2028`}>{s.note2028}</p>}
      {s.ladderNote && <p class="note" data-testid={`${T}.split.ladderNote`}>{s.ladderNote}</p>}
      <h3>{S.steps.title}</h3>
      <ul class="plan-lines" data-testid={`${T}.split.steps`}>
        <li class="plan-line" data-line="split.a">{fill(S.steps.one, { name: V.names.a, steps: stepWords('a') })}</li>
        <li class="plan-line" data-line="split.b">{fill(S.steps.one, { name: V.names.b, steps: stepWords('b') })}</li>
      </ul>
      <p class="plan-source">{S.figures}</p>
      {V.editable && limitBoxes}
      {V.editable && V.pick !== 'split' && (
        <div class="actions-row">
          {(!copies || V.copyRoom) && <Button testid={`${T}.use`} kind="primary" onClick={() => pick('split')} {...keepFocus}>{copies ? S.useCopies : S.use}</Button>}
          <Button testid={`${T}.keepAsIs`} kind="quiet" onClick={() => dispatch({ type: 'plan/keepAsIs', planId, dismiss: true })} {...keepFocus}>{S.keep}</Button>
        </div>
      )}
      {copies && <p class="note" data-testid={`${T}.split.lockedNote`}>{fill(S.lockedNote, { names: s.lockedNames.join(' and '), is: s.lockedNames.length > 1 ? S.areTwo : S.isOne })}{V.copyRoom ? '' : ' ' + W.problems.full}</p>}
      {V.editable && V.pick === 'split' && (
        <Confirm id={`${T}.useConfirm`} title={S.confirm.title} body={copies ? S.confirm.copies : S.confirm.write}
          lines={V.changes.map((c) => fill(c.changed ? S.confirm.change : S.confirm.unchanged, c))}
          yes={copies ? S.confirm.yesCopies : S.confirm.yes} no={S.confirm.notNow}
          onYes={() => dispatch({ type: 'plan/useSplit', planId })} onNo={() => pick(null)} />
      )}
    </section>
  );
}

/** The survivor and care questions in ages (2.10): the boxes, "Try it", the result. */
function Question({ what, V, dispatch, F }) {
  const Q = W[what];
  const q = V[what];
  const boxes = what === 'survivor' ? V.run.survivor : V.run.care;
  const base = `${T}.${what}`;
  const ask = () => { if (boxes) dispatch({ type: 'household/' + what, key: V.runKey, boxes }); };
  const close = () => dispatch({ type: 'household/close', what });
  const paths = what === 'survivor' ? ['survivor.who', 'survivor.atAge', 'survivor.spendPct', 'survivor.dbPct'] : ['care.who', 'care.fromAge', 'care.years', 'care.cost'];
  if (!V.partner || !V.runKey) return null;
  const r = q.result;
  const stale = q.status === 'done' && JSON.stringify(q.boxes) !== JSON.stringify(boxes);
  return (
    <section class="plan-section" data-section={what} data-status={q.status} data-testid={base}>
      <h2>{W.sections[what]}</h2>
      <p class="note">{Q.lead}</p>
      {paths.map((p) => F(p, { slots: { a: V.names.a, b: V.names.b } }))}
      {(q.status === 'off' || q.status === 'done' || q.status === 'failed') && V.partner.configured && <div class="actions-row"><Button testid={`${base}.button`} kind={q.status === 'off' ? 'primary' : 'quiet'} disabled={!boxes} onClick={ask} {...keepFocus}>{q.status === 'off' ? Q.button : Q.again}</Button></div>}
      {q.status === 'working' && <p class="working-note" role="status" data-testid={`${base}.working`}>{Q.working}</p>}
      {q.status === 'failed' && <div class="notice" role="alert" data-testid={`${base}.failed`}><p>{q.reason === 'noWorker' ? Q.noWorker : Q.failed}</p><div class="actions-row"><Button testid={`${base}.close`} kind="quiet" onClick={close}>{Q.close}</Button></div></div>}
      {q.status === 'done' && r && (
        <div class="lever-result" data-testid={`${base}.result`} data-head={r.affordable ? r.head : ''}>
          {what === 'survivor' && !r.affordable && <p class="figure">{fill(Q.unaffordable, { deceased: r.deceased, reason: r.reason ? fill(W.verdict.reasonWas, { reason: r.reason }) : '' })}</p>}
          {what === 'survivor' && r.affordable && (
            <>
              <p class="figure" data-testid={`${base}.headline`}>{r.middling ? fill(r.bad ? Q.headline : Q.headlineOne, { deceased: r.deceased, atAge: r.atAge, survivor: r.survivor, middling: r.middling, bad: r.bad || '', badReason: r.badReason || '' }) : fill(Q.cannot, { deceased: r.deceased, atAge: r.atAge, survivor: r.survivor, reason: r.middlingReason || '' })}</p>
              <ul class="plan-lines">
                <li class="plan-line" data-line="survivor.inherit">{fill(Q.rows.inherit, { survivor: r.survivor, middling: r.inherit.middling, bad: r.inherit.bad, deceased: r.deceased, way: WAY.names[r.ways.deceased] || r.ways.deceased, held: r.inherit.held ? fill(Q.rows.held, { deceased: r.deceased, heldIsa: r.inherit.held }) : '' })}</li>
                <li class="plan-line" data-line="survivor.spend">{fill(Q.rows.spend, { survivor: r.survivor, gross: r.spending.gross, net: r.spending.net, pct: r.spending.pct })}</li>
                <li class="plan-line" data-line="survivor.way">{fill(Q.rows.way, { survivor: r.survivor, way: WAY.names[r.ways.survivor] || r.ways.survivor })}</li>
              </ul>
              <p class="note">{fill(Q.note, { deceased: r.deceased, survivor: r.survivor })}</p>
            </>
          )}
          {what === 'care' && !r.affordable && <p class="figure">{fill(Q.cannot, { reason: r.reason })}</p>}
          {what === 'care' && r.affordable && (
            <>
              <p class="figure" data-testid={`${base}.headline`}>{fill(Q.headline, { name: r.name, fromAge: r.fromAge, years: r.years, s: r.years === '1' ? '' : 's', cost: r.cost, total: r.total, withWords: r.withWords, withoutWords: r.withoutWords })}</p>
              <p class="note" data-line="care.both">{(r.pooled ? Q.pooled + ' ' : '') + fill(Q.both, { bothWith: r.bothWith, bothWithout: r.bothWithout })}</p>
              <p class="note">{fill(Q.note, { totalGross: r.totalGross })}</p>
            </>
          )}
          {stale && <p class="working-note" data-testid={`${base}.stale`}>{Q.stale}</p>}
          <p class="plan-source" data-testid={`${base}.ran`}>{q.ms != null ? fill(Q.ran, { runs: r.runs || '3', ms: seconds(q.ms) }) : fill(Q.ranUntimed, { runs: r.runs || '3' })}</p>
          <div class="actions-row"><Button testid={`${base}.close`} kind="quiet" onClick={close}>{Q.close}</Button></div>
        </div>
      )}
    </section>
  );
}

/** One budget for the household (decision 5): which plan's budget it is, and the choice. */
function Budget({ V, dispatch, planId }) {
  const B = W.budget;
  if (!V.partner) return null;
  const pick = (what) => dispatch({ type: 'household/pick', what });
  const name = V.partner.name;
  const line = V.budget.from === V.partner.id ? fill(B.theirs, { name }) : V.budget.to ? fill(B.mine, { name }) : B.none;
  const separate = V.budget.from === V.partner.id || V.budget.to;
  return (
    <section class="plan-section" data-section="budget" data-testid={`${T}.budget`} data-shared={separate ? '1' : '0'}>
      <h2>{W.sections.budget}</h2>
      <h3 data-testid={`${T}.budget.question`}>{B.separateQuestion}</h3>
      <p class="note">{fill(B.lead, { name })}</p>
      <p class="line" data-testid={`${T}.budget.line`}>{line}</p>
      {V.editable && V.pick !== 'share' && V.pick !== 'separate' && (
        <div class="actions-row">
          {!separate && <Button testid={`${T}.budget.share`} kind="plain" onClick={() => pick('share')} {...keepFocus}>{fill(B.share, { name })}</Button>}
          {separate && <Button testid={`${T}.budget.separate`} kind="plain" onClick={() => pick('separate')} {...keepFocus}>{V.budget.from === V.partner.id ? B.separateMine : fill(B.separateTheirs, { name })}</Button>}
        </div>
      )}
      {V.editable && (V.pick === 'share' || V.pick === 'separate') && (
        <Confirm id={`${T}.budgetConfirm`} title={B.separateQuestion} body={fill(V.pick === 'share' ? B.confirm.share : B.confirm.separate, { name })} yes={B.confirm.yes} no={B.confirm.notNow}
          onYes={() => dispatch({ type: 'plan/shareBudget', planId, share: V.pick === 'share' })} onNo={() => pick(null)} />
      )}
    </section>
  );
}

/** The budget's who-pays (ledger budget.who-pays): me, partner or shared, and my share — each line's own too. */
function WhoPays({ V, dispatch, planId, F }) {
  const P = W.whoPays;
  const toggle = () => dispatch({ type: 'ui/toggle', id: 'hhWhoPays' });
  const card = (c) => {
    const idPb = `${T}.budget.${c.kind}.${c.id}.paidBy`, idSh = `${T}.budget.${c.kind}.${c.id}.mySharePct`;
    const pathPb = `budget.${c.kind}.${c.id}.paidBy`, pathSh = `budget.${c.kind}.${c.id}.mySharePct`;
    const err = c.shareError ? (P.errors.lineShare[c.shareError] || c.shareError) : null;
    return (
      <fieldset class="income-card" key={c.kind + c.id} data-card={`${c.kind}.${c.id}`}>
        <legend>{c.label || c.id}</legend>
        <div class="field field-choice" data-field={pathPb}>
          <label for={idPb}>{P.fields.paidBy.label}</label>
          <div class="box">
            <select id={idPb} data-testid={idPb} name={idPb} value={c.shown.paidBy} onChange={(e) => dispatch({ type: 'plan/edit', planId, path: pathPb, value: e.currentTarget.value })}>
              {['me', 'partner', 'shared'].map((o) => <option key={o} value={o}>{P.fields.paidBy.options[o]}</option>)}
            </select>
          </div>
        </div>
        {c.shown.paidBy === 'shared' && (
          <div class={`field field-count${err ? ' has-error' : ''}`} data-field={pathSh}>
            <label for={idSh}>{P.fields.lineShare.label}</label>
            <div class="box"><input type="text" inputmode="numeric" autocomplete="off" id={idSh} data-testid={idSh} name={idSh} value={c.shown.mySharePct} aria-invalid={err ? 'true' : undefined} onInput={(e) => dispatch({ type: 'plan/edit', planId, path: pathSh, value: e.currentTarget.value })} onBlur={() => dispatch({ type: 'plan/touch', planId, path: pathSh })} /></div>
            {err && <p class="error" data-error-for={idSh}>{err}</p>}
          </div>
        )}
      </fieldset>
    );
  };
  const shared = V.whoPays.shared;
  return (
    <section class="plan-section" data-section="whoPays" data-testid={`${T}.whoPays`}>
      <h2>{W.sections.whoPays}</h2>
      <div class="actions-row"><Button testid={`${T}.whoPays.open`} kind="quiet" onClick={toggle} {...keepFocus} aria-expanded={V.whoPaysOpen ? 'true' : 'false'}>{V.whoPaysOpen ? P.close : P.open}</Button></div>
      {V.whoPaysOpen && (
        <>
          <p class="note">{P.lead}</p>
          {V.whoPays.readsShared && <p class="note" data-testid={`${T}.whoPays.readsShared`}>{fill(P.readsShared, { name: V.whoPays.holderName })}</p>}
          {F('budget.shared', { words: P.fields.shared, errors: P.errors.shared, nested: { yes: F('budget.mySharePct', { words: P.fields.mySharePct, errors: P.errors.mySharePct }) } })}
          {shared && (
            <>
              <h3>{P.lines}</h3>
              {V.whoPays.lines.length ? V.whoPays.lines.map(card) : <p class="note">{P.noLines}</p>}
              {V.whoPays.oneOffs.length > 0 && <><h3>{P.oneOffs}</h3>{V.whoPays.oneOffs.map(card)}</>}
            </>
          )}
          <div class="actions-row about-actions">
            <Button testid={`${T}.whoPays.save`} kind="primary" type="submit" disabled={!!V.saving} {...keepFocus}>{V.saving && V.saving.kind === 'save' ? W.saving : P.save}</Button>
            <Button testid={`${T}.whoPays.cancel`} kind="quiet" onClick={() => dispatch({ type: 'plan/cancel', planId })} {...keepFocus}>{P.cancel}</Button>
          </div>
        </>
      )}
    </section>
  );
}

const toastText = (toast, names) => {
  if (toast.kind === 'undone') return W.toast.undone;
  if (toast.kind === 'unchanged') return W.toast.unchanged;
  const line = toast.line;
  if (line && W.toast[line.id]) return fill(W.toast[line.id], { ...names, ...(line.slots || {}) });
  return W.toast.savedShort;
};

export function HouseholdScreen(state, dispatch) {
  const view = planView(state);
  const V = planHouseholdView(state);
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
  const onChange = (place, id = view.id) => dispatch({ type: 'plan/change', planId: id, place, back: href.plan(view.id, 'household') });
  const rail = <PlanRail view={view} state={state} dispatch={dispatch} onChange={onChange} />;
  const back = href.plan(view.id, 'plan');
  const field = (path) => V.fields.find((f) => f.path === path);
  const F = (path, more = {}) => <EditField step="household" f={field(path)} words={more.words || W.fields[path]} errors={more.errors || W.errors[path]} source={null} planId={planId} dispatch={dispatch} {...more} />;
  const problem = V.problem ? fill(W.problems[V.problem] || W.problems.failed, { store: W.partner.store[V.source] || 'account' }) : null;
  const onSubmit = (e) => { e.preventDefault(); dispatch({ type: 'plan/save', planId }); };
  return {
    question: null, rail, full: false,
    content: (
      <>
        <Head view={view} />
        <h1 tabIndex={-1} data-testid="plan.step.household">{W.title}</h1>
        <p class="lead">{W.lead}</p>
        {V.locked && <p class="note" data-testid={`${T}.locked`}>{W.locked.lead}</p>}
        {V.readonly && <p class="notice" role="status" data-testid={`${T}.readonly`}>{W.readonly}</p>}
        {V.partner && !V.runKey && !V.readonly && <p class="notice" role="status" data-testid={`${T}.notRun`}>{W.notRun}</p>}
        <form class="ask about-form income-form" noValidate onSubmit={onSubmit} data-region="plan-household" data-editable={V.editable ? '1' : '0'}>
          <Partner V={V} dispatch={dispatch} planId={planId} />
          <Verdict V={V} dispatch={dispatch} />
          <Detail V={V} dispatch={dispatch} />
          <Split V={V} dispatch={dispatch} planId={planId} F={F} />
          <Question what="survivor" V={V} dispatch={dispatch} F={F} />
          <Question what="care" V={V} dispatch={dispatch} F={F} />
          <Budget V={V} dispatch={dispatch} planId={planId} />
          {V.editable && <WhoPays V={V} dispatch={dispatch} planId={planId} F={F} />}
          {problem && <p class="notice" role="alert" data-testid={`${T}.problem`} data-problem={V.problem}>{problem}</p>}
        </form>
        <div class="actions-row"><LinkButton testid={`${T}.back`} kind="quiet" href={back}>{W.buttons.back}</LinkButton></div>
        <UndoToast prefix={T} toast={V.toast} text={V.toast ? toastText(V.toast, V.names) : ''} words={W.buttons}
          onUndo={() => dispatch({ type: 'plan/undo', planId })} onClose={() => dispatch({ type: 'plan/toastClose' })} />
      </>
    )
  };
}
