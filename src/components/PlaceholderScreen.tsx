import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Stand-in for a tab's real content until its page-building phase lands.
 *
 * Phase 2 replaces this with the `Screen` layout primitive.
 */
export function PlaceholderScreen({ title }: { title: string }) {
  return (
    <SafeAreaView style={styles.screen} testID={`screen-${title.toLowerCase()}`}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '700' },
});
