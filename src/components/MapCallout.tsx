import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { RemoteImage } from '@/components/RemoteImage';
import { Text } from '@/components/Text';
import type { ImageAsset } from '@/data/assets';
import { palette } from '@/design/colors';
import { opacity } from '@/design/opacity';
import { radii } from '@/design/radii';
import { shadows } from '@/design/shadows';
import { spacing } from '@/design/spacing';
import { typography } from '@/design/typography';

const PHOTO_SIZE = 96;
const CLOSE_BUTTON_SIZE = 32;

type MapCalloutProps = {
  title: string;
  subtitle: string;
  photo?: ImageAsset;
  onLearnMore: () => void;
  onClose: () => void;
};

/** Floats over the map when a pin is tapped — the caller positions it. */
export function MapCallout({ title, subtitle, photo, onLearnMore, onClose }: MapCalloutProps) {
  return (
    <View style={styles.card}>
      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close"
        hitSlop={spacing.sm}
        style={({ pressed }) => [styles.closeButton, { opacity: pressed ? opacity.pressedHeavy : 1 }]}
      >
        <Ionicons name="close" size={typography.headline.size} color={palette.slate} />
      </Pressable>

      <View style={styles.row}>
        {photo ? (
          <RemoteImage source={photo} style={styles.photo} />
        ) : (
          <View style={[styles.photo, styles.photoPlaceholder]} />
        )}
        <View style={styles.textBlock}>
          <Text variant="title2" numberOfLines={1}>
            {title}
          </Text>
          <Text variant="subhead" numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
      </View>

      <Button label="Learn more" onPress={onLearnMore} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.white,
    borderRadius: radii.lg,
    padding: spacing.base,
    gap: spacing.base,
    ...shadows.elevated,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: CLOSE_BUTTON_SIZE,
    height: CLOSE_BUTTON_SIZE,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: palette.grey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.base,
    paddingRight: spacing['2xl'],
  },
  photo: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: radii.md,
  },
  photoPlaceholder: {
    backgroundColor: palette.grey,
  },
  textBlock: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.xs,
  },
});
