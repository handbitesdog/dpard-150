import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/Text';
import { spacing } from '@/design/spacing';

const DEFAULT_SIZE = 160;

type PassportSummaryProps = {
  collected: number;
  total: number;
  size?: number;
};

/** Circular stamp-progress badge, meant to float over a photo background. */
export function PassportSummary({ collected, total, size = DEFAULT_SIZE }: PassportSummaryProps) {
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${collected} of ${total} stamps collected`}
      style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }]}
    >
      <View style={[styles.fill, { borderRadius: size / 2 }]}>
        <Text variant="title1" color="white">
          {collected}/{total}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.8)',
    padding: spacing.xs,
  },
  fill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
});
