import * as Linking from 'expo-linking';
import { Image, Pressable, StyleSheet } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { radii } from '@/design/radii';
import { shadows } from '@/design/shadows';

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
      style={({ pressed }) => [styles.shadow, { opacity: pressed ? 0.85 : 1 }]}
    >
      <Image
        source={source}
        style={{ width, height, borderRadius: radii.lg }}
        resizeMode="cover"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadow: {
    alignSelf: 'flex-start',
    borderRadius: radii.lg,
    ...shadows.elevated,
  },
});
