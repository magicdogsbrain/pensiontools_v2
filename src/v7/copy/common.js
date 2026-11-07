/**
 * The words every V7 screen shares: header, footer, the two advice lines, the line to the previous version, the front
 * door, and the screens for what is not built yet. Data only — this file imports nothing but where each app lives.
 *
 * Source: research/v7/rail-screens-language.md (2.1, 2.6 "other states", 3.7), with the changes of the build
 * brief (a question not answered here yet opens a page that says so) and of 7.0 (research/v7/switch-readiness.md
 * gate 3: question E opens "Your plans"; "Answer in full detail" opens E's page, which points there).
 * Placeholders are written {likeThis} and filled by the component that shows the string.
 * The one import is where each app lives (src/appLayout.js, data that imports nothing): the links that leave V7.
 */
import { LAYOUT } from '../../appLayout.js';

/** Directly under the bad-case line of every headline, and in the footer. Checked letter for letter. */
export const ADVICE_SHORT = 'An illustration from your figures, not financial advice.';

/** The closing paragraph of every answer step. Checked letter for letter. */
export const ADVICE_FULL =
  'This is an illustration worked out from the figures you entered. It is not financial advice and it does ' +
  'not tell you what to do. Pension Wise, from MoneyHelper, gives free guidance to anyone aged 50 or over.';

export const COMMON = {
  /**
   * The site's name (7.1.0, research/v7/after-7.md §1): the site is pensiontools.uk and serves saving, stopping and living
   * on a pension, so its name on every page is PensionTools, with one plain line saying what it does. "Drawdown" is a word
   * for the pages about drawing money, not the name (it was "Drawdown Planner" from 6.44.0 to 7.0.0).
   */
  product: 'PensionTools',
  tagline: 'Plan your pension, from saving to living on it.',
  skip: 'Skip to the main part of the page',
  allQuestions: 'All questions',
  /** The header's link to the account page (road-to-7.md step 11). */
  account: 'Your account',
  /**
   * Under the header from 7.0, for at least two releases (road-to-7.md step 12): the classic planner, the version before
   * this one, is still there. The link is the only way to it that is on every page.
   */
  previous: { text: 'This is the new version.', link: 'Use the previous version.',
              /** The same line where there is room for one line only (a phone). */
              shortText: 'New version.', shortLink: 'Use the previous one' },
  offline: 'You are offline. You can still work things out. Keeping a plan needs a connection.',
  footer: {
    worksOut: 'PensionTools works things out from the figures you give it.',
    runBy: 'PensionTools is run by Usefulish Ltd.',
    privacy: 'Privacy',
    /** The link to every release's notes (road-to-7.md step 11). {version} is the version you are on. */
    whatsNew: 'What’s new (version {version})',
    /** The link to where every figure comes from (road-to-7.md step 11b). */
    assumptions: 'Assumptions and data'
  },
  /** Where the links that leave V7 go: the classic planner (the previous version) and the privacy policy, relative to V7's page (src/appLayout.js). */
  links: { classic: LAYOUT.v7.classic, privacy: LAYOUT.v7.privacy }
};

export const FRONT = {
  title: 'What would you like to know?',
  intro: 'Pick the question closest to yours. You do not need an account. A first answer takes about two minutes and a handful of numbers.',
  notFound: 'We could not find that page. Here are the questions.',
  notYet: 'Not answered here yet',
  /** Under the questions (road-to-7.md step 11): the read-only example plan, for a visitor who wants to look around first. */
  example: 'Or look around an example plan first:',
  exampleButton: 'Look around an example',
  /** The six questions, in the visitor's words. `ask` is what the visitor is quoted as saying. The page draws them in FRONT.groups' order. */
  questions: [
    { id: 'a', ask: 'When can I afford to stop work?', more: 'See different ages side by side.' },
    { id: 'b', ask: 'Am I saving enough? How much do I need, and what should I pay in?', more: 'The pot to aim for, what you pay in now and what it comes to, and the share of your pay that would be enough.' },
    { id: 'c', ask: "I've got about", then: 'What is that a month?', button: 'Show me', potHint: 'for example 250,000' },
    { id: 'd', ask: "I'm retired. Will it last? Could I spend more? Would some work help?", more: 'Tested against the bad times, with a plan you can keep.' },
    { id: 'e', ask: 'Open your plans', more: 'Try a plan against the bad times, compare ways to take the money, and keep it up to date.' },
    { id: 'f', ask: 'I have one decision to make.', more: 'Tax-free cash, the mortgage, a final-salary pension early or late, or buying a guaranteed income for life (an annuity).' }
  ],
  /**
   * The questions grouped by where the person is (7.1.0, research/v7/after-7.md J1): still working, stopping soon or
   * stopped, with a plan already; the one-decision question last, under no heading, as before.
   */
  groups: [
    { id: 'working', title: 'Still working', ids: ['b', 'a'] },
    { id: 'stopping', title: 'Stopping soon, or stopped', ids: ['c', 'd'] },
    { id: 'plan', title: 'I have a plan', ids: ['e'] },
    { id: 'other', title: null, ids: ['f'] }
  ],
  /** Under "I have a plan": the account's way in. */
  signIn: 'Your plans are kept in your account.',
  signInLink: 'Sign in',
  /**
   * The front door for someone who is not signed in (7.5.0; research/v7/mockups/first-visit.html screen 1): one headline,
   * the life as a picture, three doors — one for each stage, each opening its question's quickest form — and the other
   * questions as plain links. No account is mentioned until something is kept. The headline is drawn in three parts so that
   * its middle word can be pink (the one "you" on the page).
   */
  stranger: {
    title: ['Your pension, from ', 'saving', ' to living on it.'],
    intro: 'Type a few numbers and see your own picture in under a minute. No account. Nothing is kept unless you ask.',
    /** The picture's words: a stage, and what happens in it (no figure is drawn). */
    life: {
      label: 'A pension over a life: it grows while you are saving, becomes an income when you move, and is drawn on while you live on it.',
      saving: 'Saving', savingWhat: 'paying in, year by year',
      moving: 'Moving', movingWhat: 'the pot becomes an income',
      drawing: 'Drawing', drawingWhat: 'living on it, month by month'
    },
    /** The three doors, in the order of a life. `stage` is the coloured word, `ask` the question, `what` what you type and see. */
    doors: {
      b: { stage: 'Still saving', ask: 'Am I saving enough?', what: 'Your age, your pot, what goes in. See the pot you could reach, and what would be enough.', go: 'Start here' },
      c: { stage: 'Stopping soon', ask: 'What is my pot worth a month?', what: 'A pot and an age. See the income it could pay, tested against the bad years.', go: 'Show me', potLabel: 'I have about', potHint: 'for example 250,000' },
      d: { stage: 'Already retired', ask: 'Will it last?', what: 'What is left and what you take. See how long it lasts, and what spending less or some work would do.', go: 'Start here' }
    },
    doorsLabel: 'Where are you?',
    /** The other questions, one tap away. */
    others: { a: 'When can I afford to stop work?', f: 'I have one decision to make', e: 'I have a plan: open it' },
    othersLabel: 'Other questions'
  },
  /** While the front door waits to hear whether the person signed in here still is (a moment, usually). */
  waiting: { title: 'PensionTools', line: 'One moment: checking whether you are signed in.' }
};

/**
 * A question with no steps of its own (7.0, switch-readiness.md gate 3). E's answer is a plan of your own: its page (from
 * "Answer everything in full", and old links) points to "Your plans", as the front door's E does. F is not answered here
 * yet, nor anywhere else: its page says so and sends nobody away.
 */
export const SOON = {
  line: 'This question is not answered here yet.',
  e: {
    line: 'A plan of your own answers everything in full. Keep an answer as a plan, or open one you have: its steps try it against the bad times, compare the ways to take the money, and keep it up to date.',
    plans: 'Your plans',
    /** The way to "Keep this as a plan?" for an answer worked out on this page: one answer, or each of several by its question. */
    keep: 'Keep your answer as a plan',
    keepFrom: 'Keep your answer to ‘{ask}’'
  },
  back: 'All questions'
};

/** A rail step that is not built yet. No rail has one at 7.0 (gate 3); the screen stays so that a step added unbuilt is never a dead end. */
export const NOT_BUILT = {
  line: 'This step is not here yet.',
  back: 'Back to what it pays'
};
