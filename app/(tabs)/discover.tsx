import { StyleSheet, Text } from 'react-native';
import { Screen } from '@/components/Screen';
import { palette } from '@/design/colors';
import { fontFamily } from '@/design/typography';
import { spacing } from '@/design/spacing';

export default function DiscoverScreen() {
  return (
    <Screen>
      <Text style={styles.title} accessibilityRole="header">
        Discover
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontFamily: fontFamily.bold,
    color: palette.navy,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});
