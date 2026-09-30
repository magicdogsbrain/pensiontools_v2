/**
 * The words every V7 screen shares: header, footer, the two advice lines, the preview line, the front door,
 * and the screens for what is not built yet. Data only — this file imports nothing.
 *
 * Source: research/v7/rail-screens-language.md (2.1, 2.6 "other states", 3.7), with the changes of the build
 * brief (the other five questions and "Answer in full detail" open a "not in the preview yet" screen).
 * Placeholders are written {likeThis} and filled by the component that shows the string.
 */

/** Directly under the bad-case line of every headline, and in the footer. Checked letter for letter. */
export const ADVICE_SHORT = 'An illustration from your figures, not financial advice.';

/** The closing paragraph of every answer step. Checked letter for letter. */
export const ADVICE_FULL =
  'This is an illustration worked out from the figures you entered. It is not financial advice and it does ' +
  'not tell you what to do. Pension Wise, from MoneyHelper, gives free guidance to anyone aged 50 or over.';

export const COMMON = {
  product: 'PensionTools',
  skip: 'Skip to the main part of the page',
  allQuestions: 'All questions',
  preview: { text: 'Preview of the next version.', link: 'The current version is here.',
             /** The same line where there is room for one line only (a phone). */
             shortText: 'Preview of the next version.', shortLink: 'Current version' },
  offline: 'You are offline. You can still work things out. Keeping a plan needs a connection.',
  footer: {
    worksOut: 'PensionTools works things out from the figures you give it.',
    runBy: 'PensionTools is run by Usefulish Ltd.',
    privacy: 'Privacy'
  },
  /** Where the links that leave V7 go. Relative to /v7/. */
  links: { current: '../', privacy: '../privacy.html' }
};

export const FRONT = {
  title: 'What would you like to know?',
  intro: 'Pick the question closest to yours. You do not need an account. A first answer takes about two minutes and a handful of numbers.',
  notFound: 'We could not find that page. Here are the questions.',
  notYet: 'Not in the preview yet',
  /** The six questions, in the visitor's words, in order. `ask` is what the visitor is quoted as saying. */
  questions: [
    { id: 'a', ask: 'When can I afford to stop work?', more: 'See different ages side by side.' },
    { id: 'b', ask: 'Am I saving enough? And what should I pay in?', more: 'The amount to aim for, and the monthly saving that gets there.' },
    { id: 'c', ask: "I've got about", then: 'What is that a month?', button: 'Show me', potHint: 'for example 250,000' },
    { id: 'd', ask: "I'm retired. Will it last? Could I spend more? Would some work help?", more: '' },
    { id: 'e', ask: 'I have a plan. Test it.', more: 'Try it against the bad times and compare ways to take the money.' },
    { id: 'f', ask: 'I have one decision to make.', more: 'Tax-free cash, the mortgage, a final-salary pension early or late, or buying a guaranteed income for life (an annuity).' }
  ]
};

export const SOON = {
  line: 'This question is not in the preview yet.',
  current: 'Open the current version',
  back: 'All questions'
};

export const NOT_BUILT = {
  line: 'This step is not in the preview yet.',
  back: 'Back to what it pays'
};
