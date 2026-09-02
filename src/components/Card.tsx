import { Pressable, StyleSheet, View } from 'react-native';
import { RemoteImage } from '@/components/RemoteImage';
import { Text } from '@/components/Text';
import type { ImageAsset } from '@/data/assets';
import { palette } from '@/design/colors';
import { opacity } from '@/design/opacity';
import { radii } from '@/design/radii';
import { spacing } from '@/design/spacing';

type CardProps = {
  image?: ImageAsset;
  imageSize: number;
  width: number;
  title: string;
  subtitle: string;
  onPress: () => void;
};

/** Shared layout for `ParkCard` and `FigureCard` — a square image over a title and subtitle. */
export function Card({ image, imageSize, width, title, subtitle, onPress }: CardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${subtitle}`}
      style={({ pressed }) => [{ width, opacity: pressed ? opacity.pressed : 1 }]}
    >
      {image ? (
        <RemoteImage source={image} style={[styles.image, { width: imageSize, height: imageSize }]} />
      ) : (
        <View style={[styles.image, styles.placeholder, { width: imageSize, height: imageSize }]} />
      )}
      <Text variant="headline" style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text variant="subhead" numberOfLines={1}>
        {subtitle}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: radii.md,
  },
  placeholder: {
    backgroundColor: palette.grey,
  },
  title: {
    marginTop: spacing.sm,
  },
});
