"""Build src/data/onsCohort2024.json: cohort death rates q(x) by sex and year of birth, from an ONS "past and projected
mortality rates (qx)" workbook. Standard library only (zipfile + xml), so it runs anywhere Python 3 does.

usage:
  python3 -I scripts/ons-cohort.py build <ewppp24qx.xlsx> <out.json>        write the file (prints its size)
  python3 -I scripts/ons-cohort.py check <ewppp24qx.xlsx> <ewppp24ex.xlsx>  the checks in research/v7/ons-life-tables.md

What each stored value is (research/v7/ons-life-tables.md says why):
  - years of birth 1981-2008, ages up to 100: the ONS cohort qx sheet as published;
  - years of birth 1935-1980, ages up to 100: the ONS period qx for calendar year (birth year + age), which is how ONS
    builds its cohort rates (the two sheets agree on every cell where both have a value); where that calendar year is
    after the period sheet's last year (born 1975-1980, the oldest ages only), a geometric interpolation at that age
    between the last period year and the 1981 cohort (calendar year 1981 + age);
  - ages 101-110: ONS does not publish them, so each cohort and sex is extended by a straight line in logit(q) fitted
    to its own ages 91-100.
Ages are kept from max(18, 2025 - year of birth): everything read forwards from today, nothing before calendar 2025.
Each list is [fromAge, q(fromAge) x 1e7, ..., q(110) x 1e7] in whole numbers: ONS publishes q per 100,000 to two
decimal places, so x 1e7 is exact for every published cell.
"""
import sys, re, json, math, zipfile, hashlib
import xml.etree.ElementTree as ET

B0, B1 = 1935, 2008            # years of birth kept
AGE_MIN, FIRST_YEAR = 18, 2025 # youngest age kept; the first calendar year read forwards from
AGE_TOP, PUBLISHED_TOP = 110, 100
SCALE = 10_000_000             # q x 1e7, whole numbers
FIT = range(91, 101)           # the ages the extension past 100 is fitted to

NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}


# ---- reading the workbook (xlsx is a zip of XML) --------------------------------------------------------------------

def col_idx(ref):
    s = re.match(r'[A-Z]+', ref).group(0)
    n = 0
    for ch in s:
        n = n * 26 + ord(ch) - 64
    return n - 1


def read_book(path):
    z = zipfile.ZipFile(path)
    ss = []
    if 'xl/sharedStrings.xml' in z.namelist():
        root = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for si in root.findall('m:si', NS):
            ss.append(''.join(t.text or '' for t in si.iter('{%s}t' % NS['m'])))
    wb = ET.fromstring(z.read('xl/workbook.xml'))
    rels = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
    rmap = {r.get('Id'): r.get('Target') for r in rels}
    sheets = {}
    for sh in wb.find('m:sheets', NS):
        tgt = rmap[sh.get('{%s}id' % NS['r'])].lstrip('/')
        sheets[sh.get('name')] = tgt if tgt.startswith('xl/') else 'xl/' + tgt

    def rows(name):
        root = ET.fromstring(z.read(sheets[name]))
        out = []
        for row in root.iter('{%s}row' % NS['m']):
            vals = {}
            for c in row.findall('m:c', NS):
                t = c.get('t')
                v = c.find('m:v', NS)
                if t == 'inlineStr':
                    val = ''.join(x.text or '' for x in c.iter('{%s}t' % NS['m']))
                elif v is None:
                    continue
                elif t == 's':
                    val = ss[int(v.text)]
                elif t in ('str', 'b', 'e'):
                    val = v.text
                else:
                    try:
                        val = float(v.text)
                    except ValueError:
                        val = v.text
                vals[col_idx(c.get('r'))] = val
            if vals:
                mx = max(vals)
                out.append([vals.get(i) for i in range(mx + 1)])
        return out
    return sheets, rows


def table(rows, name):
    """One sheet -> (years, { age: { year: value per 100,000 or None } }). The header row starts 'Exact age'."""
    r = rows(name)
    h = next(i for i, row in enumerate(r) if row and isinstance(row[0], str) and row[0].startswith('Exact age'))
    years = [int(str(v).replace('Year of birth', '').replace('Year', '').strip()) for v in r[h][1:]]
    tab = {}
    for row in r[h + 1:]:
        if row and isinstance(row[0], float):
            tab[int(row[0])] = {y: (row[j + 1] if j + 1 < len(row) and isinstance(row[j + 1], float) else None) for j, y in enumerate(years)}
    return years, tab


def load(path):
    """{ (sex, 'period'|'cohort'): (years, table) } with values per 100,000 as published."""
    _, rows = read_book(path)
    out = {}
    for sex, nm in (('m', 'males'), ('f', 'females')):
        for basis in ('period', 'cohort'):
            out[(sex, basis)] = table(rows, f'{nm} {basis} qx')
    return out


# ---- the cohort lines -----------------------------------------------------------------------------------------------

def logit(q): return math.log(q / (1 - q))
def expit(z): return 1 / (1 + math.exp(-z))


def from_age(B):
    return max(AGE_MIN, FIRST_YEAR - B)


def build(path):
    """{ (sex, B): { age: (q, how) } } for ages from_age(B)..AGE_TOP; how = 'cohort' | 'period' | 'between' | 'fit'."""
    d = load(path)
    res = {}
    for sex in 'mf':
        py, pt = d[(sex, 'period')]
        cy, ct = d[(sex, 'cohort')]
        P1, C0 = py[-1], cy[0]
        for B in range(B0, B1 + 1):
            line = {}
            for x in range(min(from_age(B), FIT[0]), PUBLISHED_TOP + 1):
                y = B + x
                if B >= C0:
                    v = ct[x][B]
                    if v is None: raise SystemExit(f'no cohort cell: {sex} born {B} at {x}')
                    line[x] = (v / 1e5, 'cohort', v)
                elif y <= P1:
                    v = pt[x][y]
                    if v is None: raise SystemExit(f'no period cell: {sex} {y} at {x}')
                    line[x] = (v / 1e5, 'period', v)
                else:
                    qa, qb = pt[x][P1] / 1e5, ct[x][C0] / 1e5      # period P1 at x; cohort C0 at x (calendar C0 + x)
                    line[x] = (qa * (qb / qa) ** ((y - P1) / (C0 + x - P1)), 'between', None)
            xs = list(FIT)
            zs = [logit(line[x][0]) for x in xs]
            mx = sum(xs) / len(xs)
            mz = sum(zs) / len(zs)
            b = sum((a - mx) * (z - mz) for a, z in zip(xs, zs)) / sum((a - mx) ** 2 for a in xs)
            a0 = mz - b * mx
            for x in range(PUBLISHED_TOP + 1, AGE_TOP + 1):
                line[x] = (expit(a0 + b * x), 'fit', None)
            res[(sex, B)] = line
    return d, res


def stored(entry):
    """A cell as stored: q x 1e7, whole. A published cell (per 100,000, two places) is exact: value x 100."""
    q, how, per100k = entry
    return int(round(per100k * 100)) if per100k is not None else int(round(q * SCALE))


def document(path):
    d, res = build(path)
    py = d[('m', 'period')][0]
    cy = d[('m', 'cohort')][0]
    P1, C0 = py[-1], cy[0]
    late = [B for B in range(B0, C0) if B + PUBLISHED_TOP > P1]
    lines = {s: {str(B): [from_age(B)] + [stored(res[(s, B)][x]) for x in range(from_age(B), AGE_TOP + 1)] for B in range(B0, B1 + 1)} for s in 'mf'}
    return {
        'source': 'Office for National Statistics, Past and projected period and cohort life tables, 2024-based, England and Wales, '
                  'principal projection: mortality rates (qx). Open Government Licence v3.0.',
        'url': 'https://www.ons.gov.uk/peoplepopulationandcommunity/birthsdeathsandmarriages/lifeexpectancies/datasets/mortalityratesqxprincipalprojectionenglandandwales',
        'edition': '2024-based', 'region': 'England and Wales', 'published': '2026-05-15', 'retrieved': '2026-11-11',
        'tablesVersion': 'ons-ew-2024-cohort/1', 'scale': SCALE, 'firstBirthYear': B0, 'lastBirthYear': B1, 'ageTo': AGE_TOP,
        'notes': [
            f'Each list is [fromAge, q(fromAge), ..., q({AGE_TOP})], q times {SCALE:,} in whole numbers: q(x) is the probability that '
            f'someone born in that year, alive at exact age x, dies before x + 1 (ONS qx per 100,000, times 100).',
            f'Years of birth {C0}-{B1}, ages to {PUBLISHED_TOP}: the ONS cohort qx sheet as published.',
            f'Years of birth {B0}-{C0 - 1}, ages to {PUBLISHED_TOP}: the ONS period qx for calendar year (birth year + age), which is how '
            f'ONS builds its cohort rates; after {P1} (born {late[0]}-{late[-1]}, the oldest ages only) a geometric interpolation at '
            f'that age between period qx {P1} and the {C0} cohort.',
            f'Ages {PUBLISHED_TOP + 1}-{AGE_TOP}: not published by ONS (available on request); extended per cohort and sex by a '
            f'straight line in logit(q) fitted to ages {FIT[0]}-{FIT[-1]}.',
            f'Ages from max({AGE_MIN}, {FIRST_YEAR} - birth year). Readers clamp: born after {B1} reads {B1}, before {B0} reads {B0}; '
            f'an age below fromAge reads q(fromAge); above {AGE_TOP}, q = 1.',
        ],
        'm': lines['m'], 'f': lines['f'],
    }


# ---- checks ---------------------------------------------------------------------------------------------------------

def life_from(J, s, B, x0):
    """l from exact age x0 (= 1) to AGE_TOP + 2 (= 0), from the file as stored."""
    line = J[s][str(B)]
    fa = line[0]
    q = lambda x: 1.0 if x > AGE_TOP else line[1 + max(x, fa) - fa] / J['scale']
    l = {x0: 1.0}
    for x in range(x0, AGE_TOP + 2):
        l[x + 1] = l[x] * (1 - q(x))
    return l


def e_and_age(J, s, B, x0):
    l = life_from(J, s, B, x0)
    T = sum((l[x] + l[x + 1]) / 2 for x in range(x0, AGE_TOP + 2))

    def age_at(p):                                 # deaths spread evenly within a year of age
        for x in range(x0, AGE_TOP + 2):
            if l[x + 1] < p <= l[x]:
                return x + (l[x] - p) / (l[x] - l[x + 1])
    return T, age_at


def check(qx, ex):
    for p in (qx, ex):
        print(p.split('/')[-1], 'sha256', hashlib.sha256(open(p, 'rb').read()).hexdigest())
    J = document(qx)
    s = json.dumps(J, separators=(',', ':'))
    print('bytes', len(s))
    d = load(qx)
    for sex in 'mf':                                # the cohort sheet against the period diagonal
        cy, ct = d[(sex, 'cohort')]
        py, pt = d[(sex, 'period')]
        n = diff = 0
        for B in cy:
            for x in ct:
                y = B + x
                if y in pt[x] and pt[x][y] is not None and ct[x][B] is not None:
                    n += 1
                    diff = max(diff, abs(ct[x][B] - pt[x][y]))
        print(f'{sex}: cohort sheet vs period diagonal, {n} cells, largest difference {diff} per 100,000')
    _, rows = read_book(ex)
    exs = {}
    for sex, nm in (('m', 'males'), ('f', 'females')):
        years, tab = table(rows, f'{nm} cohort ex')
        for x, by in tab.items():
            for y, v in by.items():
                if v is not None:
                    exs[(sex, x, y)] = v
    worst = 0
    for sex in 'mf':
        for B in range(1945, B1 + 1):
            for x0 in (50, 65, 75, 85, 95, 100):
                if x0 < from_age(B) or (sex, x0, B + x0) not in exs:
                    continue
                e, _ = e_and_age(J, sex, B, x0)
                worst = max(worst, abs(e - exs[(sex, x0, B + x0)]))
    print('e(x) from the file against the ONS cohort ex table, born 1945-2008 at 50/65/75/85/95/100: largest gap', round(worst, 3))
    for B in (1960, 1961, 1966):
        for sex in 'mf':
            e, at = e_and_age(J, sex, B, 65)
            print(f'  {sex} born {B}: e65 {e:.3f} (ONS {exs.get((sex, 65, B + 65))})  1 in 10 alive at {at(.10):.2f}  1 in 50 at {at(.02):.2f}')


if __name__ == '__main__':
    mode = sys.argv[1] if len(sys.argv) > 1 else ''
    if mode == 'build' and len(sys.argv) == 4:
        s = json.dumps(document(sys.argv[2]), separators=(',', ':'))
        with open(sys.argv[3], 'w') as f:
            f.write(s)
        print('bytes', len(s))
    elif mode == 'check' and len(sys.argv) == 4:
        check(sys.argv[2], sys.argv[3])
    else:
        print(__doc__)
        sys.exit(2)
