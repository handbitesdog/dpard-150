import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { Text } from '@/components/Text';
import { palette } from '@/design/colors';
import { opacity } from '@/design/opacity';
import { radii } from '@/design/radii';
import { sizes } from '@/design/sizes';
import { spacing } from '@/design/spacing';
import { typography } from '@/design/typography';

const PHOTO_SIZE = 56;

type ParkListRowProps = {
  name: string;
  neighborhood: string;
  photo?: ImageSourcePropType;
  onPress: () => void;
};

export function ParkListRow({ name, neighborhood, photo, onPress }: ParkListRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${neighborhood}`}
      style={({ pressed }) => [styles.row, { opacity: pressed ? opacity.pressed : 1 }]}
    >
      {photo ? (
        <Image source={photo} style={styles.photo} />
      ) : (
        <View style={[styles.photo, styles.photoPlaceholder]} />
      )}
      <View style={styles.textBlock}>
        <Text variant="headline" numberOfLines={1}>
          {name}
        </Text>
        <Text variant="subhead" numberOfLines={1}>
          {neighborhood}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={typography.body.size} color={palette.slate} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: sizes.touchTarget,
    gap: spacing.base,
    paddingVertical: spacing.sm,
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
    gap: spacing.xs,
  },
});
