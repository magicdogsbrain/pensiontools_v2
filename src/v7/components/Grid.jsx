/**
 * B's step 3, stop age against pay-in (step 4 brief 4.13, conflict 37; screens-A-B.md 4.3): [data-grid], one row per
 * stop age and one column per pay-in the input list's rule (gridToShow) fixed, built around the answer (the stop-later
 * age, the pay-in that gets there). Each cell is the one test: the count out of 10 of futures in which the money
 * lasted, stopping at that age and paying in that much — [data-cell="62:800"], data-key="grid.ages.k.cells.j.lasted".
 * The column paid in now and the one it needs are named under their figures.
 *
 * The count is written two ways: "6 in 10" (and "every one", "none"), and on a phone just the number ("6", "10" for
 * every one) with the key saying so; components.css shows one. A cell at 9 in 10 or better is marked as on the
 * careful line — by the words format.js gives the share, never by a sum here.
 *
 * Pressing a cell puts that stop age and that pay-in in the numbers (two draft/set) and goes back to the answer. For
 * two people the pay-in is the household's, which one box cannot hold, so the cells are words only.
 */
import { Money } from './Money.jsx';
import { LinkButton } from './Button.jsx';
import { countPlain } from './OutOfTenBar.jsx';
import { href } from '../router/routes.js';
import { money, ageText, outOfTen } from '../../answers/shared/format.js';
import { B } from '../copy/b.js';

const set = (path, value) => ({ type: 'draft/set', q: 'b', path, value });

/**
 * The short count shown on a phone: the number, "10" for every one, "0" for none; "<1" for fewer than 1 (never a 1 it
 * did not reach) and "<9" for just under 9 (never a 9 beside the careful line it missed).
 */
function shortCount(share) {
  const o = outOfTen(share);
  if (o.count === null) return o.only ? '0' : '10';
  if (o.words.startsWith('in fewer than')) return '<1';
  if (o.words.startsWith('in more than')) return '>9';
  if (o.count === 9 && share < 0.9) return '<9';
  return String(o.count);
}

/**
 * Whether a cell is on the careful line: 9 futures out of 10 or better, read from format.js's words for the answer's
 * share — the same reading the count shows ("just under 9 in 10" is not on it). A cell the answer gave a verdict
 * says so itself.
 */
export function onCarefulLine(cell) {
  if (cell && typeof cell.verdict === 'string') return cell.verdict === 'yes';
  const share = cell && cell.lasted;
  const o = outOfTen(share);
  return !o.only && !(o.count === 9 && share < 0.9);
}

/** True when some cell of the grid is on the careful line (else the step says that none of them is): the answer's own
 * grid.reaches where it gives it, else read cell by cell as above. */
export function gridReaches(result) {
  const grid = result && result.grid;
  if (grid && typeof grid.reaches === 'boolean') return grid.reaches;
  return !!grid && Array.isArray(grid.ages) && grid.ages.some((row) => (row.cells || []).some(onCarefulLine));
}

export function Grid({ result, dispatch }) {
  const grid = result && result.grid;
  if (!grid || !Array.isArray(grid.ages) || !grid.ages.length) return null;
  const t = B.choices;
  const couple = !!(result.inputs && result.inputs.household === 'couple');
  const stopAge = result.stop && result.stop.age;
  const payIn = result.payIn || {};
  // The column paid in now, and the one that is what it needs (when the grid holds it), are marked in words.
  return (
    <table class="grid" data-grid>
      <thead>
        <tr>
          <th scope="col">{t.stopAt}</th>
          <th scope="col" class="col-wide">{t.needs}</th>
          {grid.payIns.map((p, j) => {
            const now = p === payIn.now;
            const needed = p === payIn.needed;
            return (
              <th scope="col" key={p} data-pay-in={p} data-col-now={now ? '' : undefined} data-col-needed={needed ? '' : undefined}>
                <Money source={result} k={`grid.payIns.${j}`} />
                {now && <small class="col-mark"> {t.now}</small>}
                {needed && !now && <small class="col-mark"> {t.neededMark}</small>}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {grid.ages.map((row, k) => (
          <tr key={row.age} data-age={row.age} aria-current={row.age === stopAge ? 'true' : undefined} class={row.age === stopAge ? 'is-shown' : undefined}>
            <th scope="row"><Money source={result} k={`grid.ages.${k}.age`} kind="age" /></th>
            <td class="col-wide"><Money source={result} k={`grid.ages.${k}.number`} kind="pot" /></td>
            {row.cells.map((cell, j) => {
              const o = outOfTen(cell.lasted);
              const count = (
                <>
                  <span class="count-long">{countPlain(cell.lasted, t).split(/(\d+)/).map((piece, i) => (i % 2 ? <span key={i} data-fixed>{piece}</span> : piece))}</span>
                  <span class="count-short" aria-hidden="true"><span data-fixed>{shortCount(cell.lasted)}</span></span>
                </>
              );
              const label = t.cell.replace('{age}', ageText(row.age)).replace('{amount}', money(cell.payIn)).replace('{words}', o.words);
              return (
                <td key={cell.payIn} data-cell={`${row.age}:${cell.payIn}`} data-key={`grid.ages.${k}.cells.${j}.lasted`} data-value={cell.lasted} data-kind="count"
                  class={onCarefulLine(cell) ? 'is-careful' : undefined}>
                  {couple
                    ? count
                    : (
                      <LinkButton kind="cell" testid={`b.grid.${row.age}.${cell.payIn}`} href={href.step('b', 'answer')} aria-label={label}
                        onClick={() => { dispatch(set('stop.age', String(row.age))); dispatch(set('you.payIn.total', money(cell.payIn).slice(1))); dispatch(set('you.payIn.kind', 'total')); }}>
                        {count}
                      </LinkButton>
                    )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
