import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { Pressable, StyleSheet, View } from 'react-native';
import { RemoteImage } from '@/components/RemoteImage';
import type { ImageAsset } from '@/data/assets';
import { navyMuted, palette } from '@/design/colors';
import { opacity } from '@/design/opacity';
import { radii } from '@/design/radii';
import { sizes } from '@/design/sizes';

export const VIDEO_CARD_WIDTH = 240;
const PLAY_ICON_GLYPH_SIZE = 20;
const PLAY_ICON_NUDGE = 2;

type VideoCardProps = {
  title: string;
  thumbnail?: ImageAsset;
  permalink: string;
};

/** Video card for the Connect carousel; opens the original video externally. */
export function VideoCard({ title, thumbnail, permalink }: VideoCardProps) {
  return (
    <Pressable
      onPress={() => Linking.openURL(permalink)}
      accessibilityRole="link"
      accessibilityLabel={`${title}, opens on Instagram`}
      style={({ pressed }) => [{ width: VIDEO_CARD_WIDTH, opacity: pressed ? opacity.pressed : 1 }]}
    >
      <View>
        {thumbnail ? (
          <RemoteImage source={thumbnail} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]} />
        )}
        <View style={styles.playButton}>
          <Ionicons name="play" size={PLAY_ICON_GLYPH_SIZE} color={palette.white} style={styles.playIcon} />
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
    width: sizes.touchTarget,
    height: sizes.touchTarget,
    borderRadius: radii.lg,
    backgroundColor: navyMuted,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginLeft: PLAY_ICON_NUDGE,
  },
});
