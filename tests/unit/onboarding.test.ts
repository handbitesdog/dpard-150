import { shouldShowOnboarding } from '@/lib/onboarding';

describe('shouldShowOnboarding', () => {
  // All eight combinations of the three boolean-ish inputs, enumerated rather
  // than generated so a wrong expectation is visible on the line it lives on.
  const cases: {
    completedAt: number | null;
    skipFlag: boolean;
    isDev: boolean;
    expected: boolean;
  }[] = [
    { completedAt: null, skipFlag: false, isDev: false, expected: true },
    { completedAt: null, skipFlag: false, isDev: true, expected: true },
    { completedAt: null, skipFlag: true, isDev: false, expected: true },
    { completedAt: null, skipFlag: true, isDev: true, expected: false },
    { completedAt: 1, skipFlag: false, isDev: false, expected: false },
    { completedAt: 1, skipFlag: false, isDev: true, expected: false },
    { completedAt: 1, skipFlag: true, isDev: false, expected: false },
    { completedAt: 1, skipFlag: true, isDev: true, expected: false },
  ];

  it.each(cases)(
    'completedAt=$completedAt skipFlag=$skipFlag isDev=$isDev -> $expected',
    ({ completedAt, skipFlag, isDev, expected }) => {
      expect(shouldShowOnboarding({ completedAt, skipFlag, isDev })).toBe(expected);
    },
  );

  it('ignores the skip flag in a production build', () => {
    // The case the flag exists to be safe about: a production bundle that
    // somehow carries EXPO_PUBLIC_SKIP_ONBOARDING=1 must still show the intro.
    expect(
      shouldShowOnboarding({ completedAt: null, skipFlag: true, isDev: false }),
    ).toBe(true);
  });

  it('treats a completed timestamp of 0 as completed', () => {
    // Guards against a truthiness check replacing the explicit null comparison.
    expect(shouldShowOnboarding({ completedAt: 0, skipFlag: false, isDev: false })).toBe(
      false,
    );
  });
});
