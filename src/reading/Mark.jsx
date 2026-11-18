/**
 * The simple view's mark (lead4.md section 2, G1): a figure drawn inside <Fact id="pot.today">…</Fact> carries
 * data-fact on a span that holds exactly the figure as shown. Markup only. The full view's string helper is
 * src/reading/mark.js; both write the same attribute from the same register (src/reading/facts.js).
 */
import { factProps } from './mark.js';

export function Fact({ id, as: Tag = 'span', children, ...rest }) {
  if (children == null || children === false || children === '') return null;
  return <Tag {...rest} {...factProps(id)}>{children}</Tag>;
}
