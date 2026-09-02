/**
 * Copy for the four explanatory slides, one per product pillar.
 *
 * Final copy as delivered by the department ("DPARD 150 App Copy",
 * Demo_Slide1-4). Strings live here rather than inline so the localization
 * audit in Phase 10 has one file to externalize.
 */
export type OnboardingSlide = {
  title: string;
  body: string;
};

export const ONBOARDING_SLIDES: readonly OnboardingSlide[] = [
  {
    title: 'Navigate Featured Parks With Our Interactive Map',
    body: 'Find nearby featured parks, plan your route, and tap each location to uncover history and begin exploring.',
  },
  {
    title: 'Bring Every Park Story to Life With Audio',
    body: 'Listen to guided stories as you walk or explore anytime to discover the people, places, and history behind each stop.',
  },
  {
    title: 'Collect Passport Stamps as You Explore Featured Parks',
    body: "Visit featured locations, scan each QR code, and collect digital passport stamps as you experience DPARD's 150-year history.",
  },
  {
    title: 'Complete Your Passport and Unlock an Exclusive Reward',
    body: 'Visit X featured locations and scan each QR code to receive X% off commemorative merchandise with a special promo code.',
  },
] as const;
