/**
 * The line under the Stress tester's cone of what you would have left. A cone drawn from many futures says how many; a plan
 * with no market risk (a ladder held to the end) is one fixed path, and says so — never "the median of 1 bootstrapped futures".
 */
export function coneCaption(futures, label = '') {
  const n = Math.round(+futures || 0);
  const tail = label ? ' ' + label + '.' : '';
  if (n <= 1) return 'One fixed path (no market risk): the line is what you would have left each year.' + tail;
  return 'Middle line = median of ' + n.toLocaleString('en-GB') + ' bootstrapped futures; dark band = the middle half; light band = 10th to 90th percentile.' + tail;
}
