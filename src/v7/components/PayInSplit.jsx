/**
 * "Going in each month" (step 4 brief conflict 11; screens-A-B.md 3.1, 4.1): one figure — what lands in the pension,
 * the employer's part and the tax the government adds back inside it — or, split up, your part and your employer's — or,
 * from 6.46.0, a share of your pay: your pay a year, your part and your employer's part as percentages of it. Drawn from
 * the input list: the choice `<who>.payIn.kind` as three options (test ids "<q>.<who>.payIn.kind.total" / ".split" /
 * ".share"), with the one box, the two boxes or the three boxes inside the option chosen. Nothing is added up here: when
 * split, the answer takes the two parts as the total; a share's pounds are said under its boxes by PersonBlock's
 * ShareLands, read through select.js.
 */
import { FieldGroup } from './PersonBlock.jsx';

export function PayInSplit({ who = 'you', form, dispatch }) {
  return (
    <div class={`pay-in pay-in-${who}`} data-pay-in={who}>
      <FieldGroup form={form} path={`${who}.payIn.kind`} dispatch={dispatch} />
    </div>
  );
}
