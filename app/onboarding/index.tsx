import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import { palette } from '@/design/colors';

export default function OnboardingWelcome() {
  return (
    <SafeAreaView style={styles.screen} testID="onboarding-welcome">
      <View style={styles.body}>
        <Text variant="display" accessibilityRole="header" style={styles.title}>
          Dallas Parks & Rec
        </Text>
        <Text variant="body">
          Explore the city&apos;s parks, collect a stamp at each one, and listen to the
          stories behind them.
        </Text>
      </View>
      <Link href="/onboarding/1" asChild>
        <Pressable
          style={styles.button}
          accessibilityRole="button"
          accessibilityLabel="Get started"
          testID="onboarding-get-started"
        >
          <Text variant="headline" color="white">
            Get started
          </Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.beige, padding: 24 },
  body: { flex: 1, justifyContent: 'center' },
  title: { marginBottom: 16 },
  button: {
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: palette.navy,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
