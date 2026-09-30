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
import { SCHEMA_C } from '../../answers/c/schema.js';
import { money, ageText } from '../../answers/shared/format.js';
import { readyMark } from '../state/select.js';
import { Money } from './Money.jsx';
import { Sentence } from './Sentence.jsx';
import { Field } from './Field.jsx';
import { Button } from './Button.jsx';
import { C } from '../copy/c.js';

const set = (path, value) => ({ type: 'draft/set', q: 'c', path, value });
const pounds = (n) => money(n).slice(1);             // "275,000" — as a person would type it
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

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
  const start = v['start.kind'] === 'age' && isNum(v['start.age']) ? v['start.age'] : age;
  const earliest = canStep ? (pot > 0 ? Math.max(age, SCHEMA_C.defaultRules.startAge(v, state.env)) : age) : null;
  const endAge = isNum(v.endAge) ? v.endAge : 105;
  const t = C.answer;
  const s = result.sentences || {};
  const moves = result.status === 'ok' && result.monthly && isNum(result.monthly.middling) && isNum(result.monthly.good) && result.runOutAge && isNum(result.runOutAge.middling);
  const hasNow = result.monthly && isNum(result.monthly.careful);
  const before = answer.before && answer.before.monthly && isNum(answer.before.monthly.careful) ? answer.before : null;

  const startTo = (n) => (n <= age ? [set('start.kind', 'now'), set('start.age', '')] : [set('start.kind', 'age'), set('start.age', String(n))]);
  const send = (actions) => actions.forEach((a) => dispatch(a));

  return (
    <section class="block try" data-region="form" aria-labelledby="try-title">
      <h2 id="try-title">{t.tryTitle}</h2>

      <div class="try-row" role="group" aria-labelledby="try-pot">
        <span class="try-label" id="try-pot">{form.couple ? t.tryPotCouple : t.tryPot}</span>
        <Button testid="c.try.pot.down" aria-label={t.tryPotDown.replace('{amount}', money(step))} disabled={busy || pot <= 0} onClick={() => dispatch(set('you.pot', pounds(Math.max(0, pot - step))))}>
          <span aria-hidden="true">− {money(step)}</span>
        </Button>
        {/* the answer's pot while it is the one typed; the pot as typed the moment a button moves it, until the answer catches up */}
        <span class="try-value">
          {result.inputs && result.inputs.you && result.inputs.you.pot === pot ? <Money source={result} k="inputs.you.pot" /> : <span data-typed="you.pot">{money(pot)}</span>}
        </span>
        <Button testid="c.try.pot.up" aria-label={t.tryPotUp.replace('{amount}', money(step))} disabled={busy} onClick={() => dispatch(set('you.pot', pounds(pot + step)))}>
          <span aria-hidden="true">+ {money(step)}</span>
        </Button>
      </div>

      <div class="try-row" role="group" aria-labelledby="try-start">
        <span class="try-label" id="try-start">{t.tryStart}</span>
        <Button testid="c.try.start.down" aria-label={t.tryStartDown} disabled={busy || !canStep || start <= earliest} onClick={() => send(startTo(start - 1))}>
          <span aria-hidden="true">− 1</span>
        </Button>
        {/* your own start age as typed ("now" with your age, or the age chosen) */}
        <span class="try-value" data-typed="start.age">
          {canStep ? (v['start.kind'] === 'age' && isNum(v['start.age']) ? ageText(v['start.age']) : <>{t.tryStartNow} ({ageText(age)})</>) : t.tryStartNow}
        </span>
        <Button testid="c.try.start.up" aria-label={t.tryStartUp} disabled={busy || !canStep || start >= 100 || start + 1 >= endAge} onClick={() => send(startTo(start + 1))}>
          <span aria-hidden="true">+ 1</span>
        </Button>
      </div>

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
