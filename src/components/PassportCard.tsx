import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import { Text } from '@/components/Text';
import { STAMP_PHOTO_PLACEHOLDER } from '@/data/stampPhotos';
import { palette } from '@/design/colors';
import { radii } from '@/design/radii';
import { shadows } from '@/design/shadows';
import { spacing } from '@/design/spacing';
import { typography } from '@/design/typography';

type PassportCardProps = {
  collected: number;
  total: number;
};

/**
 * Passport cover — stamp count and a link to the full collection.
 * Stands in for the real cover art: the gold seal is `STAMP_PHOTO_PLACEHOLDER`
 * and the background is flat navy until the textured artwork lands.
 */
export function PassportCard({ collected, total }: PassportCardProps) {
  const [sealSize, setSealSize] = useState(0);

  const handleSealWrapperLayout = (event: LayoutChangeEvent) => {
    setSealSize(event.nativeEvent.layout.width);
  };

  return (
    <View style={styles.card}>
      <View style={styles.sealWrapper} onLayout={handleSealWrapperLayout}>
        <Image
          source={STAMP_PHOTO_PLACEHOLDER}
          style={{ width: sealSize, height: sealSize }}
          resizeMode="contain"
        />
      </View>

      <View style={styles.spacer} />

      <View
        accessible
        accessibilityRole="text"
        accessibilityLabel={`${collected} of ${total} stamps collected`}
      >
        <Text variant="display" color="white">
          {collected}
        </Text>
        <Text variant="body" color="white">
          {collected === 1 ? 'Stamp' : 'Stamps'}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.linkRow}>
        <Text variant="headline" color="white">
          View Collection
        </Text>
        <Ionicons name="chevron-forward" size={typography.headline.size} color={palette.white} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: '80%',
    backgroundColor: palette.navy,
    borderRadius: radii.lg,
    padding: spacing.xl,
    ...shadows.elevated,
  },
  sealWrapper: {
    alignItems: 'center',
    marginTop: spacing['2xl'],
    marginHorizontal: spacing.lg,
  },
  spacer: {
    flex: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
