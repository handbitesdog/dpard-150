import { Redirect } from 'expo-router';
import { readSkipOnboardingFlag, shouldShowOnboarding } from '@/lib/onboarding';
import { usePrefsStore } from '@/stores/prefsStore';

/**
 * Entry route. Decides between the intro and the app.
 *
 * MMKV is synchronous, so the persisted store has already rehydrated by the
 * time this renders — there is no loading state to hold here.
 */
export default function Index() {
  const completedAt = usePrefsStore((s) => s.onboardingCompletedAt);

  const showOnboarding = shouldShowOnboarding({
    completedAt,
    skipFlag: readSkipOnboardingFlag(),
    isDev: __DEV__,
  });

  return <Redirect href={showOnboarding ? '/onboarding' : '/discover'} />;
}
