/**
 * "Try a change" — four things to try without leaving the answer: the pot, the age the money starts, an amount
 * to take (which turns the question round), and the risk level; then "Before / Now".
 *
 * Every control edits what is typed (draft/set), and the shell works the answer out again. The only sums here
 * are on the figures typed — a step of £25,000 or a year — never on an answer: every figure from an answer comes
 * through Money. The pot and start-age rows show the figure TYPED (what the next answer will be for), so a press
 * shows at once; their buttons rest while an answer is being worked out, so a double tap cannot step twice.
 *
 * Under the "take" button the sentence for the amount named is drawn where the button is (it is in the answer
 * card too). "Before / Now" speaks about what was tried: the careful amount, or — once an amount has been named
 * — that amount and how long it lasted, on each side.
 */
import { SCHEMA_C, earliestStart } from '../../answers/c/schema.js';
import { money, ageText } from '../../answers/shared/format.js';
import { readyMark } from '../state/select.js';
import { Money } from './Money.jsx';
import { Sentence } from './Sentence.jsx';
import { Field, blank } from './Field.jsx';
import { Button } from './Button.jsx';
import { C } from '../copy/c.js';

const set = (path, value) => ({ type: 'draft/set', q: 'c', path, value });
const pounds = (n) => money(n).slice(1);             // "275,000" — as a person would type it
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

/**
 * A − / + button resting while an answer is worked out: marked aria-disabled (and its press ignored), never greyed out
 * with `disabled` — a greyed-out button drops the keyboard's place to the page, and the person would have to Tab back
 * from the top after every press. `disabled` stays for a step that cannot be taken at all (the pot at £0, the stop at 75).
 */
export const resting = (busy) => (busy ? { 'aria-disabled': 'true' } : {});

/**
 * One side of "Before / Now". `at` holds the figures (the answer, or the kept `before`); `source` and `prefix` say
 * where Money finds them (the answer at 'monthly.*', the kept one at 'before.monthly.*'). With an amount named
 * under "take", it is that amount and how long it lasted; else the careful amount.
 */
function Tried({ at, source, prefix = '', t }) {
  const take = at && at.take;
  if (take && isNum(take.perMonth) && isNum(take.runOutAge)) {
    return (
      <>
        <Money source={source} k={`${prefix}take.perMonth`} /> {t.aMonth}: {take.covered
          ? <>{t.takeLastsTo} <Money source={source} k={`${prefix}take.runOutAge`} kind="age" /> {t.takeEvenBad}</>
          : <>{t.takeRunsOut} <Money source={source} k={`${prefix}take.runOutAge`} kind="age" /></>}.
      </>
    );
  }
  return <>{t.about} <Money source={source} k={`${prefix}monthly.careful`} /> {t.aMonth}.</>;
}

export function TryAChange({ state, form, result, dispatch }) {
  const v = form.parsed.values;
  const answer = state.answers.c;
  const busy = readyMark(state).ready === '0';
  const pot = isNum(v['you.pot']) ? v['you.pot'] : (result.inputs && result.inputs.you && result.inputs.you.pot) || 0;
  const step = pot >= 100000 ? 25000 : 5000;
  const age = v['you.age'];
  const canStep = isNum(age);
  // "now" for someone still paying in and under the age their pension opens is answered from the day it opens (the
  // answer says which age: its first phase): the start shown and stepped from is that age, not today's
  const fromAnswer = v['start.kind'] !== 'age' && result.saving && Array.isArray(result.phases) && result.phases[0] && result.phases[0].ages && result.phases[0].ages.you
    ? result.phases[0].ages.you.from : null;
  const moved = canStep && isNum(fromAnswer) && fromAnswer > age;
  const start = v['start.kind'] === 'age' && isNum(v['start.age']) ? v['start.age'] : moved ? fromAnswer : age;
  // the earliest start the form takes: when the first of the household's pensions opens (the input list's own rule,
  // person by person) — never the age the form puts in for someone still paying in (their State Pension age)
  const hasPension = pot > 0 || v['you.payIn.has'] === 'yes' || (form.couple && ((isNum(v['partner.pot']) && v['partner.pot'] > 0) || v['partner.payIn.has'] === 'yes'));
  const earliest = canStep ? (hasPension ? Math.max(age, earliestStart(v, state.env)) : age) : null;
  const endAge = isNum(v.endAge) ? v.endAge : 105;
  const t = C.answer;
  const s = result.sentences || {};
  const moves = result.status === 'ok' && result.monthly && isNum(result.monthly.middling) && isNum(result.monthly.good) && result.runOutAge && isNum(result.runOutAge.middling);
  const hasNow = result.monthly && isNum(result.monthly.careful);
  const before = answer.before && answer.before.monthly && isNum(answer.before.monthly.careful) ? answer.before : null;

  const startTo = (n) => (n <= age ? [set('start.kind', 'now'), set('start.age', '')] : [set('start.kind', 'age'), set('start.age', String(n))]);
  // Still paying in: what goes in, £50 at a time — your part when it is split (your employer's stays as typed), else the
  // one figure. Only when the money starts later than now (paying in stops when it starts).
  const payingIn = v['you.payIn.has'] === 'yes' && (v['start.kind'] === 'age' || moved);
  const payPath = v['you.payIn.kind'] === 'total' ? 'you.payIn.total' : 'you.payIn.own';
  const paid = isNum(v[payPath]) ? v[payPath] : 0;
  const payField = SCHEMA_C.fields.find((f) => f.path === payPath);
  const payMax = payField && isNum(payField.max) ? payField.max : 10000;
  const send = (actions) => actions.forEach((a) => dispatch(a));

  return (
    <section class="block try" data-region="form" aria-labelledby="try-title">
      <h2 id="try-title">{t.tryTitle}</h2>

      <div class="try-row" role="group" aria-labelledby="try-pot">
        <span class="try-label" id="try-pot">{form.couple ? t.tryPotCouple : t.tryPot}</span>
        <Button testid="c.try.pot.down" aria-label={t.tryPotDown.replace('{amount}', money(step))} disabled={pot <= 0} {...resting(busy)} onClick={() => { if (!busy) dispatch(set('you.pot', pounds(Math.max(0, pot - step)))); }}>
          <span aria-hidden="true">− {money(step)}</span>
        </Button>
        {/* the answer's pot while it is the one typed; the pot as typed the moment a button moves it, until the answer catches up */}
        <span class="try-value">
          {result.inputs && result.inputs.you && result.inputs.you.pot === pot ? <Money source={result} k="inputs.you.pot" /> : <span data-typed="you.pot">{money(pot)}</span>}
        </span>
        <Button testid="c.try.pot.up" aria-label={t.tryPotUp.replace('{amount}', money(step))} {...resting(busy)} onClick={() => { if (!busy) dispatch(set('you.pot', pounds(pot + step))); }}>
          <span aria-hidden="true">+ {money(step)}</span>
        </Button>
      </div>

      <div class="try-row" role="group" aria-labelledby="try-start">
        <span class="try-label" id="try-start">{t.tryStart}</span>
        <Button testid="c.try.start.down" aria-label={t.tryStartDown} disabled={!canStep || start <= earliest} {...resting(busy)} onClick={() => { if (!busy) send(startTo(start - 1)); }}>
          <span aria-hidden="true">− 1</span>
        </Button>
        {/* your own start age as typed ("now" with your age, or the age chosen) */}
        <span class="try-value" data-typed="start.age">
          {canStep ? (v['start.kind'] === 'age' && isNum(v['start.age']) ? ageText(v['start.age']) : moved ? ageText(fromAnswer) : <>{t.tryStartNow} ({ageText(age)})</>) : t.tryStartNow}
        </span>
        <Button testid="c.try.start.up" aria-label={t.tryStartUp} disabled={!canStep || start >= 100 || start + 1 >= endAge} {...resting(busy)} onClick={() => { if (!busy) send(startTo(start + 1)); }}>
          <span aria-hidden="true">+ 1</span>
        </Button>
      </div>

      {payingIn && (
        <div class="try-row" role="group" aria-labelledby="try-pay-in">
          <span class="try-label" id="try-pay-in">{payPath === 'you.payIn.own' ? t.tryPayInOwn : t.tryPayInTotal}</span>
          <Button testid="c.try.payIn.down" aria-label={t.tryPayInDown.replace('{amount}', money(50))} disabled={paid <= 0} {...resting(busy)}
            onClick={() => { if (!busy) dispatch(set(payPath, pounds(Math.max(0, paid - 50)))); }}>
            <span aria-hidden="true">− {money(50)}</span>
          </Button>
          <span class="try-value" data-typed={payPath}>{money(paid)}</span>
          <Button testid="c.try.payIn.up" aria-label={t.tryPayInUp.replace('{amount}', money(50))} disabled={paid + 50 > payMax} {...resting(busy)}
            onClick={() => { if (!busy) dispatch(set(payPath, pounds(paid + 50))); }}>
            <span aria-hidden="true">+ {money(50)}</span>
          </Button>
        </div>
      )}

      <div class="try-row try-take">
        <Field form={form} path="take" dispatch={dispatch} />
        <Button testid="c.try.take" onClick={() => dispatch({ type: 'draft/ask', q: 'c' })}>{C.buttons.takeShow}</Button>
        {s.take && <Sentence s={s.take} source={result} class="take-line try-take-result" data-testid="c.try.take.result" />}
      </div>

      <div class="try-row try-risk" role="group" aria-labelledby="try-risk">
        <span class="try-label" id="try-risk">{t.tryRisk}</span>
        {SCHEMA_C.fields.find((f) => f.path === 'risk').options.map((level) => (
          <Button key={level} testid={`c.try.risk.${level}`} kind="choice" aria-pressed={form.shown.risk === level ? 'true' : 'false'} onClick={() => dispatch(set('risk', level))}>
            {C.fields.risk.options[level]}
          </Button>
        ))}
        {moves && (
          <p class="note risk-moves" data-testid="c.try.risk.moves">
            {t.riskMovesAt} {t.riskMiddling} <Money source={result} k="monthly.middling" />, {t.riskGood} <Money source={result} k="monthly.good" /> {t.aMonth}.
            {' '}{t.riskRunOut} <Money source={result} k="runOutAge.middling" kind="age" />.
          </p>
        )}
      </div>

      {hasNow && (
        <p class="before-now">
          <span class="before">{t.before} {before ? <Tried at={before} source={answer} prefix="before." t={t} /> : <>{t.noBefore}.</>}</span>
          {' '}
          <span class="now">{t.now} <Tried at={result} source={result} t={t} /></span>
        </p>
      )}
    </section>
  );
}

/* ---- questions A and B ---------------------------------------------------------------------------------------- */

const LEVELS = ['cautious', 'balanced', 'adventurous'];
const setQ = (q, path, value) => ({ type: 'draft/set', q, path, value });

/** One row of "−  value  +". The value is what is TYPED (what the next answer will be for), so a press shows at once. */
function Stepper({ q, id, label, value, typed, down, up, downLabel, upLabel, downText, upText, busy }) {
  const press = (fn) => () => { if (fn && !busy) fn(); };
  return (
    <div class="try-row" role="group" aria-labelledby={`try-${id}`}>
      <span class="try-label" id={`try-${id}`}>{label}</span>
      <Button testid={`${q}.try.${id}.down`} aria-label={downLabel} disabled={!down} {...resting(busy && !!down)} onClick={press(down)}>
        <span aria-hidden="true">{downText}</span>
      </Button>
      <span class="try-value" data-typed={typed}>{value}</span>
      <Button testid={`${q}.try.${id}.up`} aria-label={upLabel} disabled={!up} {...resting(busy && !!up)} onClick={press(up)}>
        <span aria-hidden="true">{upText}</span>
      </Button>
    </div>
  );
}

/** A row of choice buttons, the chosen one marked (risk levels, how often it should get there). */
function Choices({ q, id, label, options, words, chosen, onPick }) {
  return (
    <div class="try-row try-risk" role="group" aria-labelledby={`try-${id}`}>
      <span class="try-label" id={`try-${id}`}>{label}</span>
      {options.map((o) => (
        <Button key={o} testid={`${q}.try.${id}.${o}`} kind="choice" aria-pressed={chosen === o ? 'true' : 'false'} onClick={() => onPick(o)}>{words[o]}</Button>
      ))}
    </div>
  );
}

/**
 * "Try a change" for A and B (screens-A-B.md 3.2, 4.2; step 4 brief 4.13). Every control edits what is typed
 * (draft/set) and the shell works the answer out again; the only sums are on the figures typed (a year, £100, £50,
 * £25,000), never on an answer. A: stop age, pot, spending, part-time years at a yearly amount, the two risk levels.
 * B: pay in (£50 steps), stop age, spending, risk while saving, and how often the pay-in should get there. Then
 * "Before / Now": the verdict (A) or the number (B) before the last change, and now (the answer's own a.change /
 * b.change sentence).
 */
export function SaverTryAChange({ q, state, form, result, dispatch }) {
  const v = form.parsed.values;
  const draft = form.draft;
  const words = form.copy;
  const t = words.answer;
  const answer = state.answers[q] || {};
  const busy = readyMark(state).ready === '0';
  const s = result.sentences || {};
  const send = (actions) => actions.forEach((a) => dispatch(a));
  const set = (path, value) => setQ(q, path, value);
  const age = v['you.age'];

  // The stop age: as typed, else the one the answer is for. A stops no earlier than today; B at least a year on.
  const stop = isNum(v['stop.age']) && v['stop.kind'] !== 'ages' ? v['stop.age'] : (result.stop && isNum(result.stop.age) ? result.stop.age : null);
  const lowest = isNum(age) ? (q === 'b' ? age + 1 : age) : null;
  // Each press sends the figure first and then the choice it belongs to, so no step in between is a draft that does not
  // parse — that would swap the answer for the short form for a moment and take the keyboard's place with it.
  const stopTo = (n) => (q === 'a' ? [set('stop.age', String(n)), set('stop.kind', 'age')] : [set('stop.age', String(n))]);
  const byAges = q === 'a' && v['stop.kind'] === 'ages';
  const oldest = form.byPath.get('stop.age').max;

  // Spending: as typed, else (a level) the monthly figure the answer tested.
  const spend = v['spend.kind'] !== 'level' && isNum(v['spend.amount']) ? v['spend.amount'] : (result.spend && isNum(result.spend.perMonth) ? result.spend.perMonth : null);
  const spendTo = (n) => [set('spend.amount', pounds(n)), set('spend.kind', 'amount')];

  // "Before": the answer kept from before the last change (the shell keeps its a.change / b.change sentence, and the
  // inputs it was for — from which the line names what was changed).
  const before = answer.before && answer.before.change && typeof answer.before.change.text === 'string' ? answer.before.change.text.replace(/^Now:\s*/, '') : null;
  const changed = before ? changedLine(q, words, answer.before.inputs, result.inputs) : null;

  const rows = [];
  rows.push(
    <Stepper key="stop" q={q} id="stop" label={t.tryStop} typed="stop.age" busy={busy}
      value={byAges ? t.tryStopAges : stop === null ? '' : ageText(stop)}
      down={stop !== null && lowest !== null && stop > lowest ? () => send(stopTo(stop - 1)) : null}
      up={stop !== null && stop < oldest ? () => send(stopTo(stop + 1)) : null}
      downLabel={t.tryStopDown} upLabel={t.tryStopUp} downText="− 1" upText="+ 1" />
  );

  if (q === 'a') {
    const pot = isNum(v['you.pot']) ? v['you.pot'] : (result.inputs && result.inputs.you && result.inputs.you.pot) || 0;
    const step = pot >= 100000 ? 25000 : 5000;
    rows.push(
      <Stepper key="pot" q={q} id="pot" label={form.couple ? t.tryPotCouple : t.tryPot} typed="you.pot" busy={busy}
        value={money(pot)}
        down={pot > 0 ? () => dispatch(set('you.pot', pounds(Math.max(0, pot - step)))) : null}
        up={() => dispatch(set('you.pot', pounds(pot + step)))}
        downLabel={t.tryPotDown.replace('{amount}', money(step))} upLabel={t.tryPotUp.replace('{amount}', money(step))}
        downText={`− ${money(step)}`} upText={`+ ${money(step)}`} />
    );
    if (form.couple) {
      // For two: the partner's pot too, by the same steps.
      const ppot = isNum(v['partner.pot']) ? v['partner.pot'] : 0;
      const pstep = ppot >= 100000 ? 25000 : 5000;
      rows.push(
        <Stepper key="partnerPot" q={q} id="partnerPot" label={t.tryPartnerPot} typed="partner.pot" busy={busy}
          value={money(ppot)}
          down={ppot > 0 ? () => dispatch(set('partner.pot', pounds(Math.max(0, ppot - pstep)))) : null}
          up={() => dispatch(set('partner.pot', pounds(ppot + pstep)))}
          downLabel={t.tryPartnerPotDown.replace('{amount}', money(pstep))} upLabel={t.tryPartnerPotUp.replace('{amount}', money(pstep))}
          downText={`− ${money(pstep)}`} upText={`+ ${money(pstep)}`} />
      );
    }
  } else {
    // B: what goes in, £50 at a time — your own figure (the total, or your two parts added up as typed).
    const split = v['you.payIn.kind'] === 'split';
    const payIn = split ? (isNum(v['you.payIn.own']) ? v['you.payIn.own'] : 0) + (isNum(v['you.payIn.employer']) ? v['you.payIn.employer'] : 0)
      : (isNum(v['you.payIn.total']) ? v['you.payIn.total'] : null);
    const payTo = (n) => send([set('you.payIn.total', pounds(n)), set('you.payIn.kind', 'total')]);
    rows.push(
      <Stepper key="payIn" q={q} id="payIn" label={form.couple ? t.tryPayInCouple : t.tryPayIn} typed="you.payIn.total" busy={busy}
        value={payIn === null ? '' : money(payIn)}
        down={payIn !== null && payIn > 0 ? () => payTo(Math.max(0, payIn - 50)) : null}
        up={payIn !== null && payIn + 50 <= form.byPath.get('you.payIn.total').max ? () => payTo(payIn + 50) : null}
        downLabel={t.tryPayInDown.replace('{amount}', money(50))} upLabel={t.tryPayInUp.replace('{amount}', money(50))}
        downText={`− ${money(50)}`} upText={`+ ${money(50)}`} />
    );
    if (form.couple) {
      // For two: what goes into the partner's pension too, £50 at a time.
      const psplit = v['partner.payIn.kind'] === 'split';
      const ppay = psplit ? (isNum(v['partner.payIn.own']) ? v['partner.payIn.own'] : 0) + (isNum(v['partner.payIn.employer']) ? v['partner.payIn.employer'] : 0)
        : (isNum(v['partner.payIn.total']) ? v['partner.payIn.total'] : 0);
      const ppayTo = (n) => send([set('partner.payIn.total', pounds(n)), set('partner.payIn.kind', 'total')]);
      const pmax = form.byPath.get('partner.payIn.total') ? form.byPath.get('partner.payIn.total').max : 10000;
      rows.push(
        <Stepper key="partnerPayIn" q={q} id="partnerPayIn" label={t.tryPartnerPayIn} typed="partner.payIn.total" busy={busy}
          value={money(ppay)}
          down={ppay > 0 ? () => ppayTo(Math.max(0, ppay - 50)) : null}
          up={ppay + 50 <= pmax ? () => ppayTo(ppay + 50) : null}
          downLabel={t.tryPartnerPayInDown.replace('{amount}', money(50))} upLabel={t.tryPartnerPayInUp.replace('{amount}', money(50))}
          downText={`− ${money(50)}`} upText={`+ ${money(50)}`} />
      );
    }
  }

  rows.push(
    <Stepper key="spend" q={q} id="spend" label={t.trySpend} typed="spend.amount" busy={busy}
      value={spend === null ? '' : money(spend)}
      down={spend !== null && spend > 100 ? () => send(spendTo(spend - 100)) : null}
      up={spend !== null ? () => send(spendTo(spend + 100)) : null}
      downLabel={t.trySpendDown.replace('{amount}', money(100))} upLabel={t.trySpendUp.replace('{amount}', money(100))}
      downText={`− ${money(100)}`} upText={`+ ${money(100)}`} />
  );

  if (q === 'a') {
    const years = v['partTime.has'] === true && isNum(v['partTime.years']) ? v['partTime.years'] : 0;
    const up = () => send([...(blank(draft['partTime.yearly']) ? [set('partTime.yearly', '12,000')] : []), set('partTime.years', String(years + 1)),
      set('partTime.has', true)]);
    const down = () => send(years <= 1 ? [set('partTime.has', false)] : [set('partTime.years', String(years - 1))]);
    rows.push(
      <div key="partTime" class="try-part-time">
        <Stepper q={q} id="partTime" label={t.tryPartTime} typed="partTime.years" busy={busy}
          value={years === 0 ? t.tryPartTimeNone : years === 1 ? t.tryPartTimeYear : t.tryPartTimeYears.replace('{n}', String(years))}
          down={years > 0 ? down : null} up={years < 15 ? up : null}
          downLabel={t.tryPartTimeDown} upLabel={t.tryPartTimeUp} downText="− 1" upText="+ 1" />
        <Field form={form} path="partTime.yearly" dispatch={dispatch} testid="a.try.partTime.yearly" label={t.tryPartTimeYearly} help="" placeholder="12,000" showError={false} />
      </div>
    );
  }

  // Risk while saving is offered only when there are saving years: not when the stop typed is today's age.
  const savingYears = !(q === 'a' && !byAges && stop !== null && isNum(age) && stop <= age);
  if (savingYears) {
    rows.push(
      <Choices key="savingRisk" q={q} id="savingRisk" label={t.trySavingRisk} options={LEVELS} words={words.fields.savingRisk.options}
        chosen={form.shown.savingRisk} onPick={(o) => dispatch(set('savingRisk', o))} />
    );
  }
  if (q === 'a') {
    rows.push(
      <Choices key="risk" q={q} id="risk" label={t.tryRisk} options={LEVELS} words={words.fields.risk.options}
        chosen={form.shown.risk} onPick={(o) => dispatch(set('risk', o))} />
    );
  } else if (form.byPath.get('confidence')) {
    const options = form.byPath.get('confidence').options;
    rows.push(
      <Choices key="confidence" q={q} id="confidence" label={t.tryConfidence} options={options} words={words.fields.confidence.options}
        chosen={form.shown.confidence} onPick={(o) => dispatch(set('confidence', o))} />
    );
  }

  return (
    <section class="block try" data-region="form" aria-labelledby="try-title">
      <h2 id="try-title">{t.tryTitle}</h2>
      {rows}
      {s.change && (
        <p class="before-now">
          {changed && <><span class="changed" data-testid={`${q}.try.changed`}>{changed}</span>{' '}</>}
          <span class="before">{t.before} {before || `${t.noBefore}.`}</span>
          {' '}
          <Sentence as="span" class="now" s={s.change} source={result} />
        </p>
      )}
    </section>
  );
}

/* ---- naming the change ----------------------------------------------------------------------------------------- */

const yearsText = (t, n) => (!n ? t.tryPartTimeNone : n === 1 ? t.tryPartTimeYear : t.tryPartTimeYears.replace('{n}', String(n)));
/** What goes into one person's pension, as typed: the total, or the two parts typed added up. */
const payInOf = (p) => (!p || !p.payIn ? 0 : p.payIn.kind === 'split' ? (Number(p.payIn.own) || 0) + (Number(p.payIn.employer) || 0) : Number(p.payIn.total) || 0);

/**
 * The things "Try a change" (and B's levers and grid) can move, each read from a set of checked inputs and written as a
 * person would say it. Only typed figures are read here — never an answer's.
 */
function changeItems(words) {
  const t = words.answer;
  const f = words.fields;
  const level = (path) => (v) => (f[path] && f[path].options && f[path].options[v] ? f[path].options[v].toLowerCase() : String(v));
  return [
    { id: 'stop', read: (i) => (i.stop && i.stop.kind === 'ages' ? 'ages' : i.stop && i.stop.age), text: (v) => (v === 'ages' ? t.tryStopAges : ageText(v)) },
    { id: 'pot', read: (i) => i.you && i.you.pot, text: (v) => money(v) },
    { id: 'payIn', read: (i) => payInOf(i.you), text: (v) => money(v) },
    { id: 'partnerPot', read: (i) => i.partner && i.partner.pot, text: (v) => money(v) },
    { id: 'partnerPayIn', read: (i) => (i.partner ? payInOf(i.partner) : undefined), text: (v) => money(v) },
    { id: 'spend', read: (i) => (i.spend && i.spend.kind === 'level' ? `level:${i.spend.level}` : i.spend && i.spend.amount),
      text: (v) => (typeof v === 'string' && v.startsWith('level:') ? level('spend.level')(v.slice(6)) : money(v)) },
    { id: 'partTimeYears', read: (i) => (i.partTime && i.partTime.has ? i.partTime.years : 0), text: (v) => yearsText(t, v) },
    { id: 'partTimeYearly', read: (i) => (i.partTime && i.partTime.has ? i.partTime.yearly : null), text: (v) => money(v), skipWhen: (a, b) => a === null || b === null },
    { id: 'savingRisk', read: (i) => i.savingRisk, text: level('savingRisk') },
    { id: 'risk', read: (i) => i.risk, text: level('risk') },
    { id: 'confidence', read: (i) => i.confidence, text: (v) => level('confidence')(v).replace(/^in /, '') }
  ];
}

/**
 * "You changed the stop age from 60 to 61." — the change between the inputs of the answer kept as "Before" and the
 * answer shown now, so Before / Now never reads as if nothing happened. null when nothing is kept, or nothing differs.
 */
export function changedLine(q, words, beforeInputs, nowInputs) {
  if (!beforeInputs || !nowInputs || typeof beforeInputs !== 'object' || typeof nowInputs !== 'object') return null;
  if (JSON.stringify(beforeInputs) === JSON.stringify(nowInputs)) return null;
  const c = words.answer.changed;
  if (!c) return null;
  const items = [];
  for (const item of changeItems(words)) {
    if (!c[item.id]) continue;
    const a = item.read(beforeInputs);
    const b = item.read(nowInputs);
    if (a === undefined && b === undefined) continue;
    if (a === b || (item.skipWhen && item.skipWhen(a, b))) continue;
    const [lead, mid, end] = c[item.id];
    items.push([lead, a === undefined ? '' : item.text(a), mid, b === undefined ? '' : item.text(b), end].filter(Boolean).join(' '));
  }
  if (!items.length) items.push(c.other);
  const list = items.length === 1 ? items[0] : `${items.slice(0, -1).join(', ')} ${c.and} ${items[items.length - 1]}`;
  return `${c.lead} ${list}.`;
}
