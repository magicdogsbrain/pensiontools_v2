/**
 * "Keep this as a plan" (research/v7/save-as-plan.md "What the person sees"; road-to-7.md step 7: the preview makes the
 * plan itself): at the foot of every answer of C, A, B and D, and on each question's own step. Draws; works nothing out —
 * whether the answer can be kept, the suggested name, the check of what was typed and whether a locked plan is in the
 * account (D's "separate plan") are the shell's (state/select.js keepView).
 *
 *   <KeepPanel state q dispatch heading />
 *
 * Trying figures changes a plan only when the person says so, and a new plan is made only when asked for (6.59.0):
 *   - "Am I saving enough?" opened from a saver's plan (or answered after a plan was kept from it) leads with "Use these in
 *     ‘{plan}’": the answer's saving figures written onto THAT plan (answers/plan/useAnswer.js, one write with Undo; the answer
 *     page then says what changed). A plan whose pay-ins cannot change says so in words and offers the one thing to do next.
 *   - "Keep as a new plan" stays, plainly second, with its own name box (the suggestion, made different from every plan's).
 *   - Once a plan has been kept from this answer in this window, the panel leads with opening that plan, and another keep is
 *     "Keep as another new plan".
 * The name box is filled with the suggestion (never "My plan") and can be changed. A keep dispatches keep/save; the one write
 * file (effects/planWrite.js) makes a NEW plan in the account, or in this window without one, and says so: "Kept as ‘…’ in
 * your account." with the plan to open and "Lock this plan?". D with a locked plan in the account keeps a separate plan and
 * offers no lock. Nothing is deleted; there is no Undo for a plan made. A plan kept from "Am I saving enough?" opens on its
 * own "What you pay in" first, its first check-in second (release step R3), with the lock a quiet link (4.3) — the plan of
 * whoever is still saving: yours, or your partner's when you have already stopped.
 *
 * "Am I saving enough?" not on course (research/saving-enough-and-check-in.md 3.6, decision 7) asks which pay-in the plan
 * takes, with two buttons of one kind and neither chosen — "Keep: paying in as now (10%)" and "Keep: paying in 31% (on
 * course)", and the same for "Use: …" — each sending its action with its choice (Enter in the name box keeps nothing then).
 * The figures are the answer's.
 */
import { keepView } from '../state/select.js';
import { href } from '../router/routes.js';
import { Button, LinkButton } from './Button.jsx';
import { Money } from './Money.jsx';
import { UndoToast } from './UndoToast.jsx';
import { KEEP } from '../copy/keep.js';

const fill = (text, values) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in values ? values[k] : m));
const BOX_PROBLEMS = ['empty', 'tooLong'];

/** Words with figures in their {slots}: the slots are drawn (Money), the rest is text. */
function slotted(text, slots) {
  return String(text).split(/(\{\w+\})/).filter((t) => t !== '').map((t, i) => {
    const m = /^\{(\w+)\}$/.exec(t);
    return m && m[1] in slots ? <span key={i} class="slot">{slots[m[1]]}</span> : t;
  });
}

/**
 * B not on course: the two buttons, as now and on course, neither chosen (saving-enough-and-check-in.md 3.6, decision 7).
 * Each figure is the answer's own, drawn by Money: today's share of pay or pounds, and what would be on course. The same
 * choice for a keep (`words` KEEP.payIn) and for "Use these in ‘…’" (KEEP.use), each with its own action and test ids.
 */
function PayInChoice({ result, choice, saving, onPress, words, ask, note, ids, kind = 'primary' }) {
  const t = { ...KEEP.payIn, ...words };
  const share = choice.how === 'share';
  const amount = (k) => slotted(choice.how === 'couple' ? t.between : t.aMonth, { amount: <Money source={result} k={k} /> });
  const nowNothing = !(result.payIn && result.payIn.now > 0);
  const now = nowNothing ? t.nowNothing : slotted(t.now, { now: share ? <Money source={result} k="enough.now.totalPct" kind="pct" /> : amount('payIn.now') });
  const savings = <Money source={result} k="enough.nineInTen.savingsIn" />;
  const pension = share ? <Money source={result} k="enough.nineInTen.totalPct" kind="pct" /> : amount('enough.nineInTen.payIn');
  const enough = choice.savingsOnly ? slotted(t.savingsOnly, { savings })
    : slotted(t.enough, { enough: typeof choice.savingsIn === 'number' ? slotted(t.withSavings, { pension, savings }) : pension });
  // each label is one run of text inside its button: the button lays its children out side by side with a gap, so the
  // words and the figures are held in one span and wrap as a sentence does
  return (
    <fieldset class="keep-pay-in" data-testid={ids.box}>
      <legend>{ask}</legend>
      <div class="actions-row">
        <Button testid={ids.now} kind={kind} aria-busy={saving ? 'true' : undefined} onClick={() => onPress('now')}><span class="btn-words">{now}</span></Button>
        <Button testid={ids.enough} kind={kind} aria-busy={saving ? 'true' : undefined} onClick={() => onPress('enough')}><span class="btn-words">{enough}</span></Button>
      </div>
      {note && <p class="note">{note}</p>}
    </fieldset>
  );
}

/**
 * "Use these in ‘{plan}’" (6.59.0): the plan this answer's saving figures can go into, why they cannot, the press, what
 * changed (with Undo while the toast is up) and a problem. Every fact is keepView's (`useIn`, `used`) or the shell's
 * (ui.saving, ui.saveProblem, ui.toast for this plan).
 */
function UseIn({ q, v, state, dispatch }) {
  const W = KEEP.use;
  const u = v.useIn;
  const name = u.name || '';
  const at = (text) => fill(text, { name });
  const saving = !!state.ui.saving && state.ui.saving.kind === 'useAnswer' && state.ui.saving.planId === u.id;
  const sp = state.ui.saveProblem;
  const problem = !saving && sp && sp.planId === u.id ? sp.problem : null;
  const used = v.used && v.used.planId === u.id ? v.used : null;
  const t = state.ui.toast;
  const toast = t && t.planId === u.id && t.op === 'saving' && (used || t.kind !== 'saved') ? t : null;
  const doneText = used && used.line ? fill(used.line.id === 'usedAnswer' && used.line.slots.savings ? W.done.usedAnswerSavings : W.done[used.line.id] || W.done.usedAnswer, used.line.slots) : '';
  const press = (payIn) => dispatch({ type: 'keep/use', q, ...(payIn ? { payIn } : {}) });
  // a plan whose pay-ins cannot change: the one thing to do next is to open it
  const openNext = ['example', 'readonly', 'closed', 'notSaving'].includes(u.why);
  return (
    <div class="keep-use" data-testid={`${q}.use`} data-use={u.can ? 'open' : u.why || 'reading'} data-plan-id={u.id}>
      {/* the plan kept from here is named by the note above ("Kept as …"), which says the same: said once */}
      {u.name && u.from === 'opened' && <p>{at(W.lead)}</p>}
      {!u.ready && !u.why && <p class="note" role="status" data-testid={`${q}.use.reading`}>{W.reading}</p>}
      {u.why && <p class="note" data-testid={`${q}.use.why`} data-why={u.why}>{at(W.why[u.why] || W.why.noAnswer)}</p>}
      {openNext && <p class="actions-row"><LinkButton testid={`${q}.use.open`} kind="plain" href={href.plan(u.id)}>{at(KEEP.open)}</LinkButton></p>}
      {u.can && (v.payIn && !saving
        ? <PayInChoice result={state.answers[q].result} choice={v.payIn} saving={saving} onPress={press} words={{ now: W.now, nowNothing: W.nowNothing, enough: W.enough, savingsOnly: W.savingsOnly }} ask={at(W.ask)} note={null}
          ids={{ box: `${q}.use.payIn`, now: `${q}.action.use.now`, enough: `${q}.action.use.enough` }} />
        : (
          <div class="actions-row">
            <Button testid={`${q}.action.use`} kind="primary" aria-busy={saving ? 'true' : undefined} onClick={() => { if (!saving) press(null); }}>{saving ? at(W.working) : at(W.button)}</Button>
          </div>
        ))}
      {u.can && <p class="note">{at(W.what)}</p>}
      {problem && <p class="notice keep-problem" role="alert" data-testid={`${q}.use.problem`} data-problem={problem}>{at(W.problems[problem] || W.problems.failed)}</p>}
      {used && (
        <div class="notice saved" role="status" data-testid={`${q}.use.done`} data-line={used.line ? used.line.id : undefined}>
          <p>{doneText}</p>
          <p class="actions-row"><LinkButton testid={`${q}.use.see`} kind="plain" href={href.plan(u.id, 'saving')}>{at(W.see)}</LinkButton></p>
        </div>
      )}
      <UndoToast prefix={`${q}.use`} toast={toast} text={toast ? at(W.toast[toast.kind] || '') : ''} words={{ undo: W.undo, close: W.close }}
        onUndo={() => dispatch({ type: 'plan/undo', planId: u.id })} onClose={() => dispatch({ type: 'plan/toastClose' })} />
    </div>
  );
}

export function KeepPanel({ state, q, dispatch, heading = true }) {
  const v = keepView(state, q);
  const id = `${q}.keep.name`;
  const boxProblem = BOX_PROBLEMS.includes(v.problem) ? v.problem : null;
  const otherProblem = v.problem && !boxProblem ? v.problem : null;
  const described = boxProblem ? `${id}.error` : `${id}.help`;
  const titleId = `${q}-keep-title`;
  const made = v.made;
  // "Use these in ‘…’" leads when there is a plan to use them in (B); a new plan is then the second choice, as it is once one
  // has been kept from this answer
  const use = v.useIn;
  const second = !!use || !!made;
  // only "Am I saving enough?" opens a plan's "What you pay in" first, and only when someone it made is still saving
  const saverId = q === 'b' && made && made.saverId ? made.saverId : null;
  // the press that leads: "Use these in ‘…’" when it can be pressed, else opening the plan kept
  const lead = use && use.can ? 'plain' : 'primary';
  const saveLabel = v.saving ? KEEP.saving : made ? KEEP.saveAnother : use ? KEEP.saveNew : v.separate ? KEEP.saveSeparate : KEEP.save;
  return (
    <section class="block keep" data-region="keep" data-keep={v.can ? 'open' : v.why} data-use={use ? 'yes' : undefined} aria-labelledby={heading ? titleId : undefined}>
      {heading && <h2 id={titleId}>{use ? KEEP.use.title : v.separate ? KEEP.titleSeparate : KEEP.title}</h2>}
      {made && (
        <div class="notice saved" role="status" data-testid={`${q}.keep.made`} data-plan-id={made.id}>
          <p>
            {fill(made.where === 'window' ? KEEP.made.inWindow : KEEP.made.inAccount, { name: made.name })}
            {made.partnerName ? ' ' + fill(KEEP.madePartner, { name: made.partnerName }) : ''}
            {made.separate ? ' ' + KEEP.madeSeparate : ''}
            {made.earlier ? ' ' + KEEP.madeEarlier : ''}
            {' '}{use && use.from === 'kept' ? KEEP.triedUse : KEEP.tried}
          </p>
          {made.where === 'window' && (
            // kept without an account (7.1.0): the account page with a way back to this plan — after signing in it is brought
            // into the account and opened at the step it was kept for (effects/place.js)
            <p class="note" data-testid={`${q}.keep.toAccount.line`}>{KEEP.account.kept}{' '}
              <Button testid={`${q}.keep.toAccount`} kind="quiet" onClick={() => dispatch({ type: 'account/return', back: { planId: saverId || made.id, step: saverId ? 'saving' : null, kept: true } })}>{KEEP.account.keptButton}</Button>
            </p>
          )}
          {saverId
            // a saver's plan (research/saving-enough-and-check-in.md 4.3): the plan's own "What you pay in" first — whether
            // what goes in is enough, and what would be — and the lock a quiet link, never the next thing a saver does. When
            // you have already stopped and your partner saves, it is their plan's; yours is a drawing plan, and keeps its lock.
            ? (
              <p class="actions-row">
                <LinkButton testid={`${q}.keep.saving`} kind={lead} href={href.plan(saverId, 'saving')}>{saverId === made.id ? KEEP.seeSaving : KEEP.seeSavingPartner}</LinkButton>
                {/* the second: the plan's first check-in (release step R3), which draws its saving path from today's figures */}
                <LinkButton testid={`${q}.keep.checkIn`} kind="plain" href={href.plan(saverId, 'checkin')}>{saverId === made.id ? KEEP.firstCheckIn : KEEP.firstCheckInPartner}</LinkButton>
                <LinkButton testid={`${q}.keep.plans`} kind="quiet" href={href.plans()}>{KEEP.toPlans}</LinkButton>
                {!made.separate && <LinkButton testid={`${q}.keep.lock`} kind="quiet" href={href.plan(made.id, 'lock')}>{KEEP.lockThis}</LinkButton>}
              </p>
            )
            // the plan made, opened first; its lock beside it
            : (
              <p class="actions-row">
                <LinkButton testid={`${q}.keep.open`} kind={lead} href={href.plan(made.id)}>{fill(KEEP.open, { name: made.name })}</LinkButton>
                {!made.separate && <LinkButton testid={`${q}.keep.lock`} kind="plain" href={href.plan(made.id, 'lock')}>{KEEP.lockThis}</LinkButton>}
                <LinkButton testid={`${q}.keep.plans`} kind="quiet" href={href.plans()}>{KEEP.toPlans}</LinkButton>
              </p>
            )}
        </div>
      )}
      {use && <UseIn q={q} v={v} state={state} dispatch={dispatch} />}
      {v.can
        ? (
          // with a choice of pay-in to make (B not on course), Enter in the name box keeps nothing: one of the two buttons does
          <form class={`keep-form${second ? ' keep-second' : ''}`} noValidate onSubmit={(e) => { e.preventDefault(); if (!v.payIn) dispatch({ type: 'keep/save', q }); }}>
            {second && <h3 class="keep-second-title" data-testid={`${q}.keep.secondTitle`}>{made ? KEEP.anotherTitle : KEEP.newTitle}</h3>}
            <div class={`field field-name${boxProblem ? ' has-error' : ''}`}>
              <label for={id}>{KEEP.nameLabel}</label>
              <div class="box">
                <input type="text" inputmode="text" autocomplete="off" spellcheck={false} id={id} data-testid={id} name={id} value={v.name}
                  aria-invalid={boxProblem ? 'true' : undefined} aria-describedby={described}
                  onInput={(e) => dispatch({ type: 'keep/name', q, value: e.currentTarget.value })} />
              </div>
              {!boxProblem && <p class="help" id={`${id}.help`}>{KEEP.nameHelp}</p>}
              {boxProblem && <p class="error" id={`${id}.error`} data-error-for={id}>{KEEP.problems[boxProblem]}</p>}
            </div>
            {otherProblem && <p class="notice keep-problem" role="alert" data-testid={`${q}.keep.problem`} data-problem={otherProblem}>{fill(KEEP.problems[otherProblem] || KEEP.problems.failed, { name: v.partnerKept || '' })}</p>}
            {v.payIn && !v.saving
              ? <PayInChoice result={state.answers[q].result} choice={v.payIn} saving={v.saving} onPress={(payIn) => dispatch({ type: 'keep/save', q, payIn })} words={{}}
                ask={KEEP.payIn.ask} note={KEEP.payIn.note} kind={second ? 'plain' : 'primary'} ids={{ box: `${q}.keep.payIn`, now: `${q}.action.save.now`, enough: `${q}.action.save.enough` }} />
              : (
                <div class="actions-row">
                  <Button testid={`${q}.action.save`} kind={second ? 'plain' : 'primary'} type="submit" aria-busy={v.saving ? 'true' : undefined}>{saveLabel}</Button>
                </div>
              )}
            {v.separate && <p class="note" data-testid={`${q}.keep.separate`}>{KEEP.separate}</p>}
            {/* nobody signed in, nothing kept yet (7.1.0): sign in first, and come back to this answer to keep it in the account */}
            {!made && !use && state.session && state.session.kind === 'nobody' && state.route.screen === 'step' && state.route.q === q && (
              <p class="note" data-testid={`${q}.keep.signInFirst.line`}>{KEEP.account.first}{' '}
                <Button testid={`${q}.keep.signInFirst`} kind="quiet" onClick={() => dispatch({ type: 'account/return', back: { q, step: state.route.step } })}>{KEEP.account.firstButton}</Button>
              </p>
            )}
          </form>
        )
        : <p class="note" data-testid={`${q}.keep.why`}>{KEEP.why[v.why] || KEEP.why.noAnswer}</p>}
      <p class="note">{KEEP.note}</p>
      <p class="note">{KEEP.privacy}</p>
    </section>
  );
}
