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
    title: 'Lorem ipsum dolor sit amet consectetur',
    body: 'Lorem ipsum dolor sit amet consectetur adipiscing, elit fringilla ligula.',
  },
  {
    title: 'Lorem ipsum dolor sit amet consectetur',
    body: 'Lorem ipsum dolor sit amet consectetur adipiscing, elit fringilla ligula.',
  },
  {
    title: 'Lorem ipsum dolor sit amet consectetur',
    body: 'Lorem ipsum dolor sit amet consectetur adipiscing, elit fringilla ligula.',
  },
  {
    title: 'Lorem ipsum dolor sit amet consectetur',
    body: 'Lorem ipsum dolor sit amet consectetur adipiscing, elit fringilla ligula.',
  },
] as const;
