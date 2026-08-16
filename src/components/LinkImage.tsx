import * as Linking from 'expo-linking';
import { Image, Pressable, StyleSheet } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { palette } from '@/design/colors';
import { radii } from '@/design/radii';
import { spacing } from '@/design/spacing';

type LinkImageProps = {
  source: ImageSourcePropType;
  url: string;
  width: number;
  height: number;
  accessibilityLabel: string;
};

export function LinkImage({
  source,
  url,
  width,
  height,
  accessibilityLabel,
}: LinkImageProps) {
  return (
    <Pressable
      onPress={() => Linking.openURL(url)}
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.85 : 1 }]}
    >
      <Image source={source} style={{ width, height }} resizeMode="contain" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.white,
    borderRadius: radii.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
});
