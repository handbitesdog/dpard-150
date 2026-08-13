import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import { palette } from '@/design/colors';

/**
 * Stand-in for a tab's real content until its page-building phase lands.
 *
 * Phase 2 replaces this with the `Screen` layout primitive.
 */
export function PlaceholderScreen({ title }: { title: string }) {
  return (
    <SafeAreaView style={styles.screen} testID={`screen-${title.toLowerCase()}`}>
      <Text variant="title1" accessibilityRole="header">
        {title}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.beige,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
