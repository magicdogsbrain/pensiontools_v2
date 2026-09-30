/**
 * The only read of the real date in V7. Called once, at start-up, by main.jsx; everything else uses state.env.today.
 * @param {Date} [now]
 * @returns {string} the local date as 'YYYY-MM-DD'
 */
export function today(now = new Date()) {
  const two = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${two(now.getMonth() + 1)}-${two(now.getDate())}`;
}
