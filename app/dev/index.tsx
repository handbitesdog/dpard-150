import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { readSkipOnboardingFlag, shouldShowOnboarding } from '@/lib/onboarding';
import { usePrefsStore } from '@/stores/prefsStore';
import { clearAllPersistedState } from '@/stores/storage';

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
  screen: { flex: 1, backgroundColor: '#ffffff', padding: 24, gap: 12 },
  status: { gap: 4, marginBottom: 12 },
  statusLine: { fontSize: 13, lineHeight: 18, fontFamily: 'Courier' },
  button: {
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: '#0f3357',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  buttonLabel: { color: '#ffffff', fontSize: 17, fontWeight: '600' },
});
