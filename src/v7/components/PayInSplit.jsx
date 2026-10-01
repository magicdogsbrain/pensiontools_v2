/**
 * "Going in each month" (step 4 brief conflict 11; screens-A-B.md 3.1, 4.1): one figure — what lands in the pension,
 * the employer's part and the tax the government adds back inside it — or, split up, your part and your employer's.
 * Drawn from the input list: the choice `<who>.payIn.kind` as two options (test ids "<q>.<who>.payIn.kind.total" /
 * ".split"), with the one box or the two boxes inside the option chosen. Nothing is added up here: when split, the
 * answer takes the two parts as the total.
 */
import { FieldGroup } from './PersonBlock.jsx';

export function PayInSplit({ who = 'you', form, dispatch }) {
  return (
    <div class={`pay-in pay-in-${who}`} data-pay-in={who}>
      <FieldGroup form={form} path={`${who}.payIn.kind`} dispatch={dispatch} />
    </div>
  );
}
