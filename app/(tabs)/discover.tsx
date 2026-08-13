import { StyleSheet } from 'react-native';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { spacing } from '@/design/spacing';

export default function DiscoverScreen() {
  return (
    <Screen>
      <Text variant="title1" accessibilityRole="header" style={styles.title}>
        Discover
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});
