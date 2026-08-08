import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingWelcome() {
  return (
    <SafeAreaView style={styles.screen} testID="onboarding-welcome">
      <View style={styles.body}>
        <Text style={styles.title} accessibilityRole="header">
          Dallas Parks & Rec
        </Text>
        <Text style={styles.subtitle}>
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
          <Text style={styles.buttonLabel}>Get started</Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ffffff', padding: 24 },
  body: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 34, lineHeight: 40, fontWeight: '700', marginBottom: 16 },
  subtitle: { fontSize: 17, lineHeight: 24 },
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
