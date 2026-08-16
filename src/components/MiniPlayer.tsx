import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import type { AccessibilityActionEvent, ImageSourcePropType, LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Text } from '@/components/Text';
import { palette } from '@/design/colors';
import { spacing } from '@/design/spacing';
import { typography } from '@/design/typography';

// Accessibility increment/decrement step for VoiceOver/TalkBack seek actions.
const SEEK_STEP = 0.05;

type MiniPlayerProps = {
  title: string;
  category?: string;
  coverImage: ImageSourcePropType;
  elapsedLabel: string;
  progress: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onExpand: () => void;
  onSeek: (progress: number) => void;
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
  onSeek,
}: MiniPlayerProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const [dragProgress, setDragProgress] = useState<number | null>(null);

  const handleTrackLayout = useCallback((event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  }, []);

  const scrubGesture = Gesture.Pan()
    .withTestId('mini-player-scrub')
    .runOnJS(true)
    .minDistance(0)
    .onUpdate((event) => {
      if (trackWidth <= 0) return;
      setDragProgress(clamp(event.x / trackWidth));
    })
    .onEnd((event) => {
      if (trackWidth <= 0) return;
      onSeek(clamp(event.x / trackWidth));
    })
    .onFinalize(() => {
      setDragProgress(null);
    });

  const handleSeekAccessibilityAction = useCallback(
    (event: AccessibilityActionEvent) => {
      if (event.nativeEvent.actionName === 'increment') {
        onSeek(clamp(progress + SEEK_STEP));
      } else if (event.nativeEvent.actionName === 'decrement') {
        onSeek(clamp(progress - SEEK_STEP));
      }
    },
    [onSeek, progress],
  );

  const displayedProgress = dragProgress ?? clamp(progress);

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

      <GestureDetector gesture={scrubGesture}>
        <View
          testID="mini-player-track-hit-area"
          onLayout={handleTrackLayout}
          style={styles.trackHitArea}
          accessibilityRole="adjustable"
          accessibilityLabel="Seek"
          accessibilityValue={{ min: 0, max: 100, now: Math.round(displayedProgress * 100) }}
          accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
          onAccessibilityAction={handleSeekAccessibilityAction}
        >
          <View style={styles.track}>
            <View
              testID="mini-player-fill"
              style={[styles.fill, { width: `${Math.round(displayedProgress * 100)}%` }]}
            />
          </View>
          <View
            testID="mini-player-thumb"
            pointerEvents="none"
            style={[styles.thumb, { left: `${Math.round(displayedProgress * 100)}%` }]}
          />
        </View>
      </GestureDetector>
    </View>
  );
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

const TRACK_HEIGHT = 4;
const THUMB_SIZE = 12;
const TRACK_HIT_AREA_PADDING_VERTICAL = spacing.sm;

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
  trackHitArea: {
    justifyContent: 'center',
    paddingVertical: TRACK_HIT_AREA_PADDING_VERTICAL,
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: 2,
    backgroundColor: palette.grey,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: palette.pear,
  },
  thumb: {
    position: 'absolute',
    top: TRACK_HIT_AREA_PADDING_VERTICAL + TRACK_HEIGHT / 2 - THUMB_SIZE / 2,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: palette.white,
    transform: [{ translateX: -THUMB_SIZE / 2 }],
  },
});
