import * as Linking from 'expo-linking';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { palette } from '@/design/colors';
import { opacity } from '@/design/opacity';

type PostTileProps = {
  photo?: ImageSourcePropType;
  permalink: string;
  size: number;
  accessibilityLabel: string;
};

/** Single tile in the Connect post grid; opens the original post externally. */
export function PostTile({ photo, permalink, size, accessibilityLabel }: PostTileProps) {
  return (
    <Pressable
      onPress={() => Linking.openURL(permalink)}
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [{ width: size, height: size, opacity: pressed ? opacity.pressed : 1 }]}
    >
      {photo ? (
        <Image source={photo} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.placeholder]} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    backgroundColor: palette.grey,
  },
});
