/**
 * The words of "What's new" (research/v7/road-to-7.md step 11): the once-only pop-up and the page of every release
 * (src/releases.js, src/releases-history.js, rendered from the data). Data only — this file imports nothing.
 * Placeholders are written {likeThis} and filled by the screen. The release notes themselves are quoted as written.
 */
export const NEWS = {
  title: 'What’s new',
  /** The pop-up's heading: one release, or several since the last visit. */
  popupOne: 'What’s new in version {version}',
  popupMany: 'What’s new since you were last here (versions {from} to {to})',
  gotIt: 'Got it',
  seeAll: 'See every version',
  /** The page. */
  youAreOn: 'You are on version {version}.',
  intro: 'Every release is listed here with what changed, what was corrected, how it affects the plans you had already kept, and what you may need to do. The first two numbers of a version change when something you can see changed (those releases pop up once, the next time you open the page); the third changes for small fixes. The engine version, pinned on your plan when it locks, changes only when a way of drawing’s arithmetic changes.',
  opening: 'Opening the release notes…',
  /** One release's sections, in the planner's order (src/ui/components/ReleaseNotesView.js). */
  sections: {
    changes: 'What changed',
    corrections: 'Corrections',
    effects: 'How this affects your plans',
    actions: 'What you may need to do',
    notes: 'Notes'
  },
  noEffect: 'No effect on kept plans in: {tools}.',
  fix: 'fix release',
  engine: 'engine {version}',
  /** The parts of the planner each note speaks of (src/releases.js TOOL_IDS), in V7's names. */
  tools: {
    budget: 'What you spend',
    stress: 'The plan’s test (Does it last?)',
    strategies: 'How the money is taken',
    decision: 'Month by month',
    accumulation: 'What you pay in',
    household: 'Your household'
  },
  /** The reconstructed history under the curated notes. */
  historyTitle: 'Before release notes',
  historyLead: 'Reconstructed from the history of changes — grouped by theme and dated by the last change in each group, so the dates are near enough and the lists are not complete.',
  show: 'Show',
  hide: 'Hide'
};
