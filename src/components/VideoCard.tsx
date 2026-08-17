import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { navyMuted, palette } from '@/design/colors';
import { radii } from '@/design/radii';

export const VIDEO_CARD_WIDTH = 240;

type VideoCardProps = {
  title: string;
  thumbnail?: ImageSourcePropType;
  permalink: string;
};

/** Video card for the Connect carousel; opens the original video externally. */
export function VideoCard({ title, thumbnail, permalink }: VideoCardProps) {
  return (
    <Pressable
      onPress={() => Linking.openURL(permalink)}
      accessibilityRole="link"
      accessibilityLabel={`${title}, opens on Instagram`}
      style={({ pressed }) => [{ width: VIDEO_CARD_WIDTH, opacity: pressed ? 0.85 : 1 }]}
    >
      <View>
        {thumbnail ? (
          <Image source={thumbnail} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]} />
        )}
        <View style={styles.playButton}>
          <Ionicons name="play" size={20} color={palette.white} style={styles.playIcon} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  image: {
    width: VIDEO_CARD_WIDTH,
    height: VIDEO_CARD_WIDTH,
    borderRadius: radii.md,
  },
  placeholder: {
    backgroundColor: palette.grey,
  },
  playButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.lg,
    backgroundColor: navyMuted,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginLeft: 2,
  },
});
