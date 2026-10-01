/**
 * One number from an answer — the only way (with Sentence and OutOfTenBar) a figure reaches the screen.
 *
 *   <Money source={result} k="monthly.careful" />                    £1,380
 *   <Money source={result} k="phases.1.fromAge" kind="age" />         67
 *   <Money source={result} k="number.careful" kind="pot" />           £470,000   (a pot: the nearest £1,000)
 *
 * `data-key` is the dotted path, `data-value` the raw value at it, `data-kind` how it is written; the text is
 * format.js's. Nothing is worked out here: if the key does not hold a number, nothing is drawn.
 */
import { money, ageText, pot, get } from '../../answers/shared/format.js';

const TEXT = { age: ageText, pot, money };

export function Money({ source, k, kind = 'money', class: cls }) {
  const v = get(source, k);
  if (typeof v !== 'number' || !Number.isFinite(v)) return null;
  return <span class={cls} data-key={k} data-value={v} data-kind={kind}>{(TEXT[kind] || money)(v)}</span>;
}
