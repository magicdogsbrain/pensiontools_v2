/**
 * What a gilt line's own words say it is (7.6.0 review): its coupon, its maturity date, and the bundled gilt they name.
 *
 * A pasted or typed gilt often comes with a code that is only a guess (HoldingsPaste gives a name-only gilt "T" + its year,
 * and T27, T28, T29 are index-linked gilts' codes), so a conventional gilt read by that code alone would be priced and
 * matched as index-linked. The name's coupon and date are the line's own evidence: read them first.
 *
 *   ilWords(name)          does the name say index-linked (Index-linked, I/L, I-L, IL, Idx, Lkd, linker)?
 *   couponOfName(name)     the coupon a name gives ("4 1/8%", "4¼%", "4.125%") as a number, or null
 *   maturityOfName(name)   the full maturity date a name gives ("07/12/2027", "7 Dec 2027", "2027-12-07"), or null
 *   giltOfName(name)       the bundled gilt the name's date (and coupon) name — only when exactly one fits — or null
 *
 * Pure: the bundled list only.
 */
import giltsSnapshot from '../data/giltsSnapshot.js';

const GILTS = (Array.isArray(giltsSnapshot?.gilts) ? giltsSnapshot.gilts : []).filter(Boolean);
const pad = (n) => String(n).padStart(2, '0');
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const FRACTIONS = { '¼': 0.25, '½': 0.5, '¾': 0.75, '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875 };

/** How platforms write "index-linked" in a gilt's name: Index-linked, I/L, I-L, IL, Idx, Lkd, linker. */
export const IL_WORDS = /index|\bI\/L\b|\bI-L\b|\bIL\b|\bidx\b|\blkd\b|link/i;
export const ilWords = (name) => IL_WORDS.test(String(name || ''));

/** The coupon a name gives, as a number (4 1/8% → 4.125, 4¼% → 4.25, 0 1/8% → 0.125, 4.125% → 4.125); null when none. */
export function couponOfName(name) {
  const s = String(name || '');
  let m = /(\d{1,2})\s*([¼½¾⅛⅜⅝⅞])\s*%/.exec(s);
  if (m) return +m[1] + FRACTIONS[m[2]];
  m = /(?:^|[^\d/])(\d{1,2})\s+(\d)\/(\d{1,2})\s*%/.exec(s);
  if (m && +m[3] > 0) return +m[1] + +m[2] / +m[3];
  m = /(?:^|[^\d/])(\d)\/(\d{1,2})\s*%/.exec(s);
  if (m && +m[2] > 0) return +m[1] / +m[2];
  m = /(\d{1,2}(?:\.\d{1,4})?)\s*%/.exec(s);
  return m ? +m[1] : null;
}

/** The full maturity date a name gives, 'YYYY-MM-DD' (07/12/2027, 7 Dec 2027, 07-Dec-27 is not read, 2027-12-07); null when none. */
export function maturityOfName(name) {
  const s = String(name || '').toUpperCase();
  const ok = (y, m, d) => (y >= 2000 && y <= 2100 && m >= 1 && m <= 12 && d >= 1 && d <= 31 ? y + '-' + pad(m) + '-' + pad(d) : null);
  let m = /\b(\d{1,2})[/.-](\d{1,2})[/.-](20\d{2})\b/.exec(s);
  if (m) return ok(+m[3], +m[2], +m[1]);
  m = /\b(20\d{2})-(\d{2})-(\d{2})\b/.exec(s);
  if (m) return ok(+m[1], +m[2], +m[3]);
  m = /\b(\d{1,2})(?:ST|ND|RD|TH)?[\s-]+([A-Z]{3})[A-Z]*[\s-]+(20\d{2})\b/.exec(s);
  if (m && MONTHS.includes(m[2])) return ok(+m[3], MONTHS.indexOf(m[2]) + 1, +m[1]);
  return null;
}

const isIl = (g) => !!g && g.type !== 'conventional';
const sameCoupon = (g, c) => c != null && Number.isFinite(+g.coupon) && Math.abs(+g.coupon - c) < 0.0005;

/**
 * The bundled gilt a name's own words name: by its full maturity date (and its coupon, and whether it says index-linked,
 * when more than one matures that day), else by its year and coupon. Only when exactly one fits; null otherwise.
 */
export function giltOfName(name) {
  const s = String(name || '');
  if (!s.trim()) return null;
  const date = maturityOfName(s);
  const coupon = couponOfName(s);
  const il = ilWords(s);
  const narrow = (xs) => {
    let c = xs;
    if (c.length > 1 && il) c = c.filter(isIl);
    if (c.length > 1 && coupon != null) c = c.filter((g) => sameCoupon(g, coupon));
    return c.length === 1 ? c[0] : null;
  };
  if (date) return narrow(GILTS.filter((g) => String(g.maturity || '').slice(0, 10) === date));
  const y = /\b(20\d{2})\b/.exec(s);
  if (!y || coupon == null) return null;
  const byYear = GILTS.filter((g) => String(g.maturity || '').slice(0, 4) === y[1] && sameCoupon(g, coupon) && (il ? isIl(g) : true));
  return byYear.length === 1 ? byYear[0] : null;
}
