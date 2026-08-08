import { Stack, Unmatched } from 'expo-router';

/**
 * Gates the whole `dev/` route group behind `__DEV__`.
 *
 * In a production bundle these routes resolve to the not-found screen, so the
 * state-reset and onboarding-replay controls cannot be reached by a real user.
 */
export default function DevLayout() {
  if (!__DEV__) return <Unmatched />;
  return <Stack screenOptions={{ headerShown: true, title: 'Dev tools' }} />;
}
