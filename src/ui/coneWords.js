/**
 * Words on the Stress tester's result, kept out of the page's script so they can be read and tested.
 *
 * The line under the Stress tester's cone of what you would have left. A cone drawn from many futures says how many; a plan
 * with no market risk (a ladder held to the end) is one fixed path, and says so — never "the median of 1 bootstrapped futures".
 */
export function coneCaption(futures, label = '') {
  const n = Math.round(+futures || 0);
  const tail = label ? ' ' + label + '.' : '';
  if (n <= 1) return 'One fixed path (no market risk): the line is what you would have left each year.' + tail;
  return 'Middle line = median of ' + n.toLocaleString('en-GB') + ' bootstrapped futures; dark band = the middle half; light band = 10th to 90th percentile.' + tail;
}

const ty = (Y) => Y + '/' + String(Y + 1).slice(2);

/**
 * The cash years of a ladder by their tax years ("for 2026/27 to 2027/28"), from the ladder's first tax year and how many
 * years cash pays: never "the first 2 years", which reads against an order sheet that names tax years. Without a first tax
 * year, the count as before.
 */
export function cashYearsWords(firstTaxYear, n) {
  const k = Math.round(+n || 0), Y = Math.round(+firstTaxYear || 0);
  if (!(Y > 0)) return 'for the first ' + k + ' year' + (k === 1 ? '' : 's');
  return k <= 1 ? 'for ' + ty(Y) : 'for ' + ty(Y) + ' to ' + ty(Y + k - 1);
}
