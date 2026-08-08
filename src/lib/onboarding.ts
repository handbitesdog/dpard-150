/** Number of explanatory slides following the welcome screen. */
export const ONBOARDING_SLIDE_COUNT = 4;

/**
 * The whole onboarding gate, so it can be tested without a renderer.
 *
 * `skipFlag` is honored only in development. A production build ignores it
 * entirely, so no env var can suppress the intro for a real user.
 */
export function shouldShowOnboarding(s: {
  completedAt: number | null;
  skipFlag: boolean;
  isDev: boolean;
}): boolean {
  if (s.isDev && s.skipFlag) return false;
  return s.completedAt === null;
}

/**
 * Reads the skip flag from the environment.
 *
 * Inlined by the Expo bundler at build time because of the `EXPO_PUBLIC_`
 * prefix. This is the only place the variable is read; `shouldShowOnboarding`
 * is what decides whether it means anything.
 */
export function readSkipOnboardingFlag(): boolean {
  return process.env.EXPO_PUBLIC_SKIP_ONBOARDING === '1';
}
