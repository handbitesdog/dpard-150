import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { Text } from '@/components/Text';
import { palette } from '@/design/colors';
import { spacing } from '@/design/spacing';
import { typography } from '@/design/typography';

type MiniPlayerProps = {
  title: string;
  category?: string;
  coverImage: ImageSourcePropType;
  elapsedLabel: string;
  progress: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onExpand: () => void;
};

export function MiniPlayer({
  title,
  category = 'Audio Tour',
  coverImage,
  elapsedLabel,
  progress,
  isPlaying,
  onTogglePlay,
  onExpand,
}: MiniPlayerProps) {
  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={onExpand}
        accessibilityRole="button"
        accessibilityLabel={`Now playing: ${title}. Expand player.`}
        style={({ pressed }) => [styles.card, { opacity: pressed ? 0.9 : 1 }]}
      >
        <Image source={coverImage} style={styles.cover} />

        <View style={styles.info}>
          <Text variant="headline" color="white" numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.metaRow}>
            <Text variant="body" color="white">
              {category}
            </Text>
            <Ionicons name="volume-medium-outline" size={typography.body.size} color={palette.white} />
            <Ionicons name="link-outline" size={typography.body.size} color={palette.white} />
          </View>
        </View>

        <Text variant="body" color="white">
          {elapsedLabel}
        </Text>

        <Pressable
          onPress={onTogglePlay}
          hitSlop={spacing.sm}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
          style={styles.playButton}
        >
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color={palette.white} />
        </Pressable>
      </Pressable>

      <View style={styles.track}>
        <View
          testID="mini-player-fill"
          style={[styles.fill, { width: `${Math.round(clamp(progress) * 100)}%` }]}
        />
      </View>
    </View>
  );
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.navy,
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.md,
  },
  cover: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  playButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.grey,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: palette.pear,
  },
});
