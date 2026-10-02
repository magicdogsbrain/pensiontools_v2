/**
 * Question A's ages, side by side (step 4 brief 4.13; screens-A-B.md 3.2, 3.3; test plan R13).
 *
 *   <AgesChart result dispatch />               the small chart of the answer step: [data-chart="ages"]
 *   <AgesChart result dispatch table />         step 3's table of every age: [data-table="ages"]
 *
 * One row per entry of result.ages, in order — the ages the input list's rule (agesToShow) fixed; the screen chooses
 * none. Each row: the age (and the partner's, for two), the careful amount, a bar of how many futures out of 10 the
 * spending lasted (OutOfTenBar), the count, and the verdict word. The shown age carries aria-current="true". Every
 * figure is drawn by Money / OutOfTenBar from ages.<k>.*, so each row's keys point into its own entry.
 *
 * A table, so a screen reader announces each row with its age. At 390 wide it keeps three columns (age, amount,
 * lasted); the verdict and step 3's two extra columns join from 700 up (components.css), so nothing scrolls sideways.
 * With "show me ages", and on step 3, each age is a link that asks for that age in full.
 *
 * Couples who stop work in different years (research/v7/couples-different-years.md 5.2): when the answer is about your
 * partner ("I've already stopped") each row is their stop, and the axis says so ("Your partner's stop age"); when their
 * stop is their own, each row is yours alone ("Your stop age"). Either way the partner's age in brackets — which says how
 * old they are when you stop together — is not drawn.
 */
import { Money } from './Money.jsx';
import { OutOfTenBar, countText } from './OutOfTenBar.jsx';
import { VerdictWord } from './Verdict.jsx';
import { withFixedCounts } from './MadeOf.jsx';
import { LinkButton } from './Button.jsx';
import { href } from '../router/routes.js';
import { A } from '../copy/a.js';

const set = (path, value) => ({ type: 'draft/set', q: 'a', path, value });

export function AgesChart({ result, dispatch, table = false }) {
  const rows = (result && result.ages) || [];
  if (!rows.length) return null;
  const t = A.answer;
  const shownAge = result.shown && result.shown.age;
  const couple = !!(result.inputs && result.inputs.household === 'couple');
  const aboutPartner = result.askedAbout === 'partner';
  const theirs = result.inputs && result.inputs.partner && result.inputs.partner.stop;
  const ownStop = couple && !aboutPartner && !!theirs && ['already', 'age', 'ages'].includes(theirs.kind);
  const together = couple && !aboutPartner && !ownStop;
  // whose stop each row is: yours, or your partner's when the answer is about them
  const asked = aboutPartner ? 'partner' : 'you';
  const stop = (aboutPartner ? theirs : result.inputs && result.inputs.stop) || {};
  const byAges = stop.kind === 'ages';
  const today = result.inputs && result.inputs[asked] && result.inputs[asked].age;
  const endAge = result.basis && result.basis.endAge;
  const pickable = table || byAges;
  // The figure first, then the choice it belongs to: no step in between is a draft that does not parse (which would
  // swap the answer for the short form for a moment). About your partner, it is their stop that is picked.
  const prefix = aboutPartner ? 'partner.' : '';
  const pick = (age) => { dispatch(set(`${prefix}stop.age`, String(age))); dispatch(set(`${prefix}stop.kind`, 'age')); };
  const attr = table ? { 'data-table': 'ages' } : { 'data-chart': 'ages' };

  return (
    <table class={`ages${table ? ' ages-table' : ' ages-chart'}`} {...attr}>
      <thead>
        <tr>
          <th scope="col">{aboutPartner ? t.chartAgePartner : ownStop ? t.chartAgeOwn : together ? t.chartAgeCouple : t.chartAge}</th>
          <th scope="col">{t.chartSpend}</th>
          <th scope="col">{t.chartLasted} <Money source={result} k="basis.endAge" kind="age" /></th>
          {table && <th scope="col" class="col-wide">{withFixedCounts(t.tableRunOut)}</th>}
          {table && <th scope="col" class="col-wide">{t.tablePot}</th>}
          <th scope="col" class="col-verdict">{t.chartVerdict}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, k) => {
          const age = (
            <>
              <Money source={result} k={`ages.${k}.age`} kind="age" />
              {together && row.ages && typeof row.ages.partner === 'number' && <small class="partner-age"> (<Money source={result} k={`ages.${k}.ages.partner`} kind="age" />)</small>}
              {byAges && row.age === today && <small class="age-now"> {t.chartNow}</small>}
            </>
          );
          return (
            <tr key={row.age} data-age={row.age} aria-current={row.age === shownAge ? 'true' : undefined} class={row.age === shownAge ? 'is-shown' : undefined}>
              <th scope="row">
                {pickable
                  ? <LinkButton kind="quiet" class="age-pick" testid={`a.ages.pick.${row.age}`} href={href.step('a', 'answer')} onClick={() => pick(row.age)}>{age}</LinkButton>
                  : age}
              </th>
              <td><Money source={result} k={`ages.${k}.monthly.careful`} /></td>
              <td class="lasted">
                <OutOfTenBar source={result} k={`ages.${k}.lasted`} />
                <span class="count" aria-hidden="true">{countText(row.lasted, t)}</span>
              </td>
              {table && (
                <td class="col-wide">
                  {typeof endAge === 'number' && row.runOutAge >= endAge ? t.tableLasts : <Money source={result} k={`ages.${k}.runOutAge`} kind="age" />}
                </td>
              )}
              {table && <td class="col-wide"><Money source={result} k={`ages.${k}.potAtStop.middling`} kind="pot" /></td>}
              <td class="col-verdict"><VerdictWord verdict={row.verdict} words={t.verdictWord} /></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
