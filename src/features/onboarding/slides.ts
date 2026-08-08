/**
 * Copy for the four explanatory slides, one per product pillar.
 *
 * Placeholder text pending final copy from the department. Strings live here
 * rather than inline so the localization audit in Phase 10 has one file to
 * externalize.
 */
export type OnboardingSlide = {
  title: string;
  body: string;
};

export const ONBOARDING_SLIDES: readonly OnboardingSlide[] = [
  {
    title: 'Learn',
    body: 'Browse Dallas parks and the historic figures behind them — photos, amenities, hours, and the stories that go with them.',
  },
  {
    title: 'Collect',
    body: 'Visit a park in person and collect its stamp. Your phone confirms you are actually there, so bring it along.',
  },
  {
    title: 'Listen',
    body: 'Play a guided audio tour while you walk. Download one before you go if the signal is thin where you are headed.',
  },
  {
    title: 'Connect',
    body: 'See what the department is sharing, find the shop, and browse photos from around the city.',
  },
] as const;
