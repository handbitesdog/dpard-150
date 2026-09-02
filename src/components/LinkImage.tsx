import * as Linking from 'expo-linking';
import { Pressable, StyleSheet } from 'react-native';
import { RemoteImage } from '@/components/RemoteImage';
import type { ImageAsset } from '@/data/assets';
import { opacity } from '@/design/opacity';
import { radii } from '@/design/radii';
import { shadows } from '@/design/shadows';

type LinkImageProps = {
  source: ImageAsset;
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
      style={({ pressed }) => [styles.shadow, { opacity: pressed ? opacity.pressed : 1 }]}
    >
      <RemoteImage
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
