import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import { Text } from '@/components/Text';
import { palette } from '@/design/colors';
import { opacity } from '@/design/opacity';
import { radii } from '@/design/radii';
import { shadows } from '@/design/shadows';
import { spacing } from '@/design/spacing';
import { typography } from '@/design/typography';

type PassportCardProps = {
  collected: number;
  total: number;
  onViewCollection: () => void;
};

/** completion-stamp.png is 2251x1811. */
const COMPLETION_BADGE_ASPECT_RATIO = 2251 / 1811;

/** Fraction of the card's width the completion badge spans. */
const COMPLETION_BADGE_WIDTH_RATIO = 0.58;

/**
 * passport-cover.jpg ships pre-cropped: the supplied artwork has rounded
 * corners baked into its alpha, so the transparent arcs are trimmed off and
 * the card's own `radii.lg` does the rounding.
 */
const COVER_ART = require('../../assets/passport-cover.jpg');
const SEAL_ART = require('../../assets/passport-seal.png');

/** Passport cover — stamp count and a link to the full collection. */
export function PassportCard({ collected, total, onViewCollection }: PassportCardProps) {
  const [sealSize, setSealSize] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const isComplete = total > 0 && collected >= total;

  const handleSealWrapperLayout = (event: LayoutChangeEvent) => {
    setSealSize(event.nativeEvent.layout.width);
  };

  const handleCardLayout = (event: LayoutChangeEvent) => {
    setCardWidth(event.nativeEvent.layout.width);
  };

  const badgeWidth = cardWidth * COMPLETION_BADGE_WIDTH_RATIO;

  return (
    <View style={styles.card} onLayout={handleCardLayout}>
      <Image source={COVER_ART} style={styles.cover} resizeMode="cover" />

      <View style={styles.content}>
        <View style={styles.sealWrapper} onLayout={handleSealWrapperLayout}>
          <Image
            source={SEAL_ART}
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

        <Pressable
          onPress={onViewCollection}
          accessibilityRole="button"
          accessibilityLabel="View Collection"
          style={({ pressed }) => [styles.linkRow, { opacity: pressed ? opacity.pressed : 1 }]}
        >
          <Text variant="headline" color="white">
            View Collection
          </Text>
          <Ionicons name="chevron-forward" size={typography.headline.size} color={palette.white} />
        </Pressable>
      </View>

      {isComplete && (
        <Image
          source={require('../../assets/completion-stamp.png')}
          accessible
          accessibilityLabel="Passport completed"
          resizeMode="contain"
          style={[
            styles.completionBadge,
            { width: badgeWidth, height: badgeWidth / COMPLETION_BADGE_ASPECT_RATIO },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: '80%',
    backgroundColor: palette.navy,
    borderRadius: radii.lg,
    overflow: 'hidden',
    ...shadows.elevated,
  },
  // The cover art overhangs the card and is clipped to its radius by the card's
  // `overflow: hidden`, so the padding that insets the content lives on the
  // layer above it rather than on the same box as the image.
  cover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radii.lg,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  sealWrapper: {
    alignItems: 'center',
    marginTop: spacing['2xl'],
    marginHorizontal: spacing.lg,
  },
  // Sized and placed against the card rather than the seal: the badge is meant
  // to land across the seal's lower edge and the stamp count.
  completionBadge: {
    position: 'absolute',
    right: '7%',
    bottom: '16%',
    transform: [{ rotate: '-10deg' }],
  },
  spacer: {
    flex: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: spacing.base,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
