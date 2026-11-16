/**
 * The register: every fact a person reads in more than one place, and where each place states it, in each view.
 *
 * A place is a page and a way to find the fact on it:
 *   - `[data-fact="<id>"]` when the markup has one (read first, always: its visible text, never an attribute);
 *   - otherwise a region (a data-testid, a CSS selector, or the whole page) and a pattern whose first group is the value.
 * A box a person typed into counts as visible text: `input` names it, and its value is what the person sees.
 *
 * Wording belongs to the area that owns the screen, so a pattern holds only the nouns and the figure; a reword that keeps
 * the nouns keeps the place. The value is parsed by the fact's `kind` (read.js).
 *
 * A view that does not state a fact says so: `none: 'why'` instead of a list of places.
 *
 * The first twelve facts (brief 2.4) come from the walkers' readings of 7.11.1 (W10's question 1 and the pages named in
 * the scenarios). Owners: FACTS, SAVER, MONTH, MEASURE (the areas of the brief).
 */

/** The pages of each view, and how routes.js opens them. Simple: a plan's step (#/plan/<id>/<step>). Full: a tab and its sub-tab. */
export const PAGES = Object.freeze({
  simple: {
    home: { step: '' },
    about: { step: 'about' },
    income: { step: 'income' },
    spend: { step: 'spend' },
    pots: { step: 'pots' },
    lasts: { step: 'lasts' },
    way: { step: 'way' },
    plan: { step: 'plan' },
    saving: { step: 'saving' },
    checkin: { step: 'checkin' },
    review: { step: 'review' },
    month: { step: 'month' },
    hold: { step: 'hold' },
    move: { step: 'move' },
    mix: { step: 'mix' },
    household: { step: 'household' }
  },
  full: {
    top: { tab: null },
    'stress settings': { tab: 'stress', sub: 'stresssettings' },
    'will it last': { tab: 'stress', sub: 'montecarlo' },
    strategies: { tab: 'strategies' },
    'monthly entry': { tab: 'decision', sub: 'entry' },
    history: { tab: 'decision', sub: 'history' },
    'plan document': { tab: 'decision', sub: 'plandoc' },
    'tax years': { tab: 'decision', sub: 'taxyears' },
    accumulation: { tab: 'accumulation' },
    transition: { tab: 'transition' },
    household: { tab: 'household' }
  }
});

/** The words each view uses for the three stages, mapped to one value. */
export const STAGE_WORDS = Object.freeze([
  [/^saving\b|still saving|committed/i, 'saving'],
  [/^moving\b|transition/i, 'moving'],
  [/^living on it\b|running the plan|drawing/i, 'living']
]);

const M = '£([\\d,]+(?:\\.\\d{2})?)';           // a sum of money, its figure the group
const MONTH = '((?:January|February|March|April|May|June|July|August|September|October|November|December) \\d{4})';

/**
 * The register. Each place: { page, region?, input?, find? }. `find` is a RegExp source whose first group is the value;
 * a place with `input` reads the box's value. The `kind` says how the value is read: money, age, month, years, stage,
 * chance (N in 20), text.
 */
export const FACTS = Object.freeze({
  stage: {
    owner: 'FACTS', kind: 'stage',
    simple: [
      { page: 'home', region: 'plan.home.headline', find: '^(Saving|Moving|Living on it)\\b' }
    ],
    full: [
      { page: 'top', region: '#scenarioSelector', find: '(?:locked|not locked|unlocked)?\\s*·\\s*([^·\\n]+?)(?:\\s*·|\\n|$)' }
    ]
  },
  'stop.month': {
    owner: 'FACTS', kind: 'month',
    simple: [
      { page: 'home', region: 'plan.home.headline', find: `stop work in ${MONTH}` },
      { page: 'about', find: `(?:stop|stopped) work(?:ing)?(?: in| on)? ${MONTH}` }
    ],
    full: [
      { page: 'stress settings', find: `(?:retire|stop work|stopped work) in ${MONTH}` },
      { page: 'top', region: '#nextStepBanner', find: `stop work in ${MONTH}` }
    ]
  },
  yearsToGo: {
    owner: 'FACTS', kind: 'years',
    simple: [
      { page: 'saving', find: '(\\d+ years?(?: \\d+ months?)?) of saving' },
      { page: 'home', find: '(\\d+ years?(?: \\d+ months?)?) (?:to go|from now|away)' }
    ],
    full: [
      { page: 'top', region: '#scenarioSelector', find: '(\\d+ years?(?: \\d+ months?)?) to go' },
      { page: 'stress settings', find: 'at \\d+, (\\d+ years?(?: \\d+ months?)?) away' },
      { page: 'accumulation', find: '(\\d+ years?(?: \\d+ months?)?) to go' }
    ]
  },
  'plan.endAge': {
    owner: 'FACTS', kind: 'age',
    simple: [
      { page: 'about', find: 'Plan to age:?\\s*(\\d+)' },
      { page: 'lasts', find: 'We tested to (\\d+), the age your plan runs to' },
      { page: 'way', find: '(?:runs|lasts|tested) to (?:age )?(\\d+)' }
    ],
    full: [
      { page: 'stress settings', find: 'Plan runs to age (\\d+)' },
      { page: 'plan document', find: 'Plan runs to age (\\d+)' }
    ]
  },
  'pot.today': {
    owner: 'FACTS', kind: 'money',
    simple: [
      { page: 'home', find: `Your pot:\\s*${M}` },
      { page: 'pots', find: `Pension ${M}[^\\n]*today` },
      { page: 'hold', find: `(?:In all|Altogether|Total)[^\\n£]*${M}` },
      { page: 'review', find: `What your pots hold, ${M}` }
    ],
    full: [
      { page: 'accumulation', find: `Pension pot ${M} \\(recorded` },
      { page: 'plan document', find: `Pension pot ${M} \\(recorded` }
    ]
  },
  'pot.atStop': {
    owner: 'SAVER', kind: 'money',
    simple: [
      { page: 'plan', find: `Pots when you stop:[^£\\n]*${M}` },
      { page: 'saving', find: `(?:pension|pot) at \\d+[^£\\n]*${M}` },
      { page: 'lasts', find: `(?:Pots when you stop|pot when you stop|pot at \\d+)[^£\\n]*${M}` }
    ],
    full: [
      { page: 'stress settings', find: `Pots at retirement in today's money, middle band[^:]*: SIPP ${M}` }
    ]
  },
  'payIn.fromTakeHome': {
    owner: 'SAVER', kind: 'money',
    simple: [
      { page: 'home', find: `${M} a month from (?:you|your (?:take-home )?pay)\\b` },
      { page: 'saving', find: `${M} a month from (?:you|your (?:take-home )?pay)\\b` }
    ],
    full: [
      { page: 'accumulation', input: '#acNetMonthly' }
    ]
  },
  'payIn.employer': {
    owner: 'SAVER', kind: 'money',
    simple: [
      { page: 'home', find: `${M}(?: a month)? from your employer` },
      { page: 'saving', find: `${M}(?: a month)? from your employer` }
    ],
    full: [
      { page: 'accumulation', input: '#acEmployerMonthly' }
    ]
  },
  'payIn.total': {
    owner: 'SAVER', kind: 'money',
    simple: [
      { page: 'saving', find: `Paying in ${M} a month` },
      { page: 'home', find: `${M} a month (?:in all|going in)` }
    ],
    full: [
      { page: 'accumulation', find: `= ${M}/mo` }
    ]
  },
  'income.thisYear.beforeTax': {
    owner: 'MONTH', kind: 'money',
    simple: [
      { page: 'month', find: `set up from [A-Za-z]+ \\d{4}, ${M} a year before tax` },
      { page: 'income', find: `${M} a year before tax` },
      { page: 'home', find: `the plan says ${M} for the year` }
    ],
    full: [
      { page: 'stress settings', find: `First step ${M}/yr gross` },
      { page: 'plan document', find: `Income step 1 of \\d+: ${M}/yr gross` },
      { page: 'tax years', find: `${M}[^\\n]*(?:a year|/yr)` }
    ]
  },
  'income.perMonth.afterTax': {
    owner: 'MONTH', kind: 'money',
    simple: [
      { page: 'month', find: `${M} a month after tax` },
      { page: 'income', find: `${M} a month after tax` },
      { page: 'saving', find: `is ${M} a month after tax` }
    ],
    full: [
      { page: 'stress settings', find: `≈ ${M}/mo take-home` }
    ]
  },
  'taken.againstPlan': {
    owner: 'MONTH', kind: 'money',
    simple: [
      { page: 'home', find: `${M} taken; the plan said ${M}` },
      { page: 'month', find: `${M} taken; the plan said ${M}` }
    ],
    full: [
      { page: 'plan document', find: `${M} taken before tax, against ${M}` }
    ]
  },
  'statePension.amount': {
    owner: 'FACTS', kind: 'money',
    simple: [
      { page: 'income', find: `State Pension: ${M} a year` }
    ],
    full: [
      { page: 'stress settings', input: '#ssSpAnnualAmount' }
    ]
  },
  'statePension.age': {
    owner: 'FACTS', kind: 'age',
    simple: [
      { page: 'income', find: 'State Pension: £[\\d,]+ a year before tax from age (\\d+)' }
    ],
    full: [
      { page: 'plan document', find: 'State Pension[^\\n]*?from age (\\d+)' }
    ]
  },
  'lasts.chance': {
    owner: 'MEASURE', kind: 'chance',
    simple: [
      { page: 'lasts', find: '(?:lasts|last) as long as you do ((?:more than |less than |about )?\\d+ times in 20)' },
      { page: 'saving', find: '(?:lasts|last) as long as you do ((?:more than |less than |about )?\\d+ times in 20)' }
    ],
    full: [
      { page: 'will it last', find: '((?:more than |less than |about )?\\d+ times in 20)' }
    ]
  },
  'left.typically': {
    owner: 'MEASURE', kind: 'money',
    simple: [
      { page: 'lasts', find: `Left at the end, at today’s prices: typically ${M}` },
      { page: 'way', find: `typically ${M}` }
    ],
    full: [
      { page: 'strategies', find: `typically ${M}` }
    ]
  },
  'due.next': {
    owner: 'FACTS', kind: 'text',
    simple: [
      { page: 'home', region: 'plan.home.todo', find: '((?:Record|Check in for|Review)[^\\n.]*?\\d{4})' },
      { page: 'home', region: 'plan.home.quiet', find: `(next review is ${MONTH})` }
    ],
    full: [
      { page: 'top', region: '#nextStepText', find: '((?:record|check in for|review)[^\\n.]*?\\d{4})' }
    ]
  }
});

/** Every fact the brief gates (2.4): the first twelve, some in parts. */
export const GATED = Object.freeze(Object.keys(FACTS));
