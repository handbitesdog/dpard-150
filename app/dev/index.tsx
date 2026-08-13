import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { readSkipOnboardingFlag, shouldShowOnboarding } from '@/lib/onboarding';
import { usePrefsStore } from '@/stores/prefsStore';
import { clearAllPersistedState } from '@/stores/storage';
import { palette } from '@/design/colors';
import { fontFamily } from '@/design/typography';

function DevButton({
  label,
  onPress,
  testID,
}: {
  label: string;
  onPress: () => void;
  testID: string;
}) {
  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={testID}
    >
      <Text style={styles.buttonLabel}>{label}</Text>
    </Pressable>
  );
}

export default function DevTools() {
  const router = useRouter();
  const onboardingCompletedAt = usePrefsStore((s) => s.onboardingCompletedAt);
  const resetOnboarding = usePrefsStore((s) => s.resetOnboarding);

  const skipFlag = readSkipOnboardingFlag();

  const replayOnboarding = () => {
    resetOnboarding();
    router.replace('/onboarding');
  };

  const resetAllState = () => {
    clearAllPersistedState();
    resetOnboarding();
    router.replace('/onboarding');
  };

  return (
    <SafeAreaView style={styles.screen} testID="dev-tools">
      <View style={styles.status}>
        <Text style={styles.statusLine}>
          onboardingCompletedAt: {onboardingCompletedAt ?? 'null'}
        </Text>
        <Text style={styles.statusLine}>
          EXPO_PUBLIC_SKIP_ONBOARDING: {skipFlag ? '1' : 'unset'}
        </Text>
        <Text style={styles.statusLine}>
          shouldShowOnboarding:{' '}
          {String(
            shouldShowOnboarding({
              completedAt: onboardingCompletedAt,
              skipFlag,
              isDev: __DEV__,
            }),
          )}
        </Text>
      </View>

      <DevButton
        label="Component gallery"
        onPress={() => router.push('/dev/gallery')}
        testID="dev-open-gallery"
      />
      <DevButton
        label="Replay onboarding"
        onPress={replayOnboarding}
        testID="dev-replay-onboarding"
      />
      <DevButton
        label="Reset all local state"
        onPress={resetAllState}
        testID="dev-reset-state"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.beige, padding: 24, gap: 12 },
  status: { gap: 4, marginBottom: 12 },
  statusLine: { fontSize: 13, lineHeight: 18, fontFamily: 'Courier', color: palette.navy },
  button: {
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: palette.navy,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  buttonLabel: { color: palette.white, fontSize: 17, fontFamily: fontFamily.semibold },
});
