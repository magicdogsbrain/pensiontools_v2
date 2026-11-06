/**
 * The motion rule's two pieces that need the page (research/v7/mockups/README.md; motion.js does the moving):
 *
 *   <Counted as="div" …>…</Counted>      its money figures count up to their value once, when it is first drawn
 *   notNowPress(event, done)             the to-do pressed slides away, then `done` runs (at once with less motion)
 *
 * The figures are drawn complete first (a reader, a test, a screenshot taken before the count sees the real page); the
 * count starts after the first paint and ends on the same text.
 */
import { useEffect, useRef } from 'preact/hooks';
import { countUp, slideAway } from './motion.js';

export function Counted({ as: Tag = 'div', children, ...rest }) {
  const ref = useRef(null);
  useEffect(() => { countUp(ref.current); }, []);
  return <Tag ref={ref} {...rest}>{children}</Tag>;
}

export function notNowPress(e, done) {
  const li = e && e.currentTarget && typeof e.currentTarget.closest === 'function' ? e.currentTarget.closest('li') : null;
  slideAway(li, done);
}
