import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import type { AccessibilityActionEvent, LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Icon } from '@/components/Icon';
import CircleCheckIcon from '@/components/icons/circle-check.svg';
import CloudDownloadIcon from '@/components/icons/cloud-download.svg';
import LoaderCircleIcon from '@/components/icons/loader-circle.svg';
import { RemoteImage } from '@/components/RemoteImage';
import { Text } from '@/components/Text';
import type { ImageAsset } from '@/data/assets';
import { palette } from '@/design/colors';
import { durations } from '@/design/durations';
import { opacity } from '@/design/opacity';
import { radii } from '@/design/radii';
import { sizes } from '@/design/sizes';
import { spacing } from '@/design/spacing';
import { fontFamily, typography } from '@/design/typography';

// Accessibility increment/decrement step for VoiceOver/TalkBack seek actions.
const SEEK_STEP = 0.05;
const COVER_SIZE = 56;
const PLAY_PAUSE_ICON_SIZE = 28;

type MiniPlayerBaseProps = {
  title: string;
  category?: string;
  /** Falls back to a placeholder box when not given (no artwork available yet). */
  coverImage?: ImageAsset;
  elapsedLabel: string;
  progress: number;
  isPlaying: boolean;
  /** Omit while no player exists yet — the play control renders inert instead of tappable. */
  onTogglePlay?: () => void;
  /** Whether this track's audio is saved on-device rather than streamed. */
  isDownloaded: boolean;
  /** Whether a download is currently in progress. */
  isDownloading: boolean;
  /** Fired when the download/remove control is tapped. Omit to render the control inert. */
  onToggleDownload?: () => void;
  /** Fired when the cover/title area is tapped — expands the full player in `bar`, selects the track in `row`. Omit to render the row non-interactive. */
  onPress?: () => void;
  /** Whether the row has its own internal padding. Set to false when the caller supplies its own spacing. Defaults to true. */
  padded?: boolean;
};

type MiniPlayerProps =
  | (MiniPlayerBaseProps & { variant?: 'bar'; onSeek: (progress: number) => void })
  | (MiniPlayerBaseProps & { variant: 'row' });

export function MiniPlayer(props: MiniPlayerProps) {
  const {
    variant = 'bar',
    title,
    category = 'Audio Tour',
    coverImage,
    elapsedLabel,
    progress,
    isPlaying,
    onTogglePlay,
    isDownloaded,
    isDownloading,
    onToggleDownload,
    onPress,
    padded = true,
  } = props;
  const isRow = variant === 'row';
  const onSeek = props.variant === 'row' ? undefined : props.onSeek;
  // Row sits on the Listen screen (beige card, navy text); the bar hangs off
  // the navbar and inverts that so it reads against the tab bar's chrome.
  const textColor = isRow ? 'navy' : 'beige';
  const iconColor = isRow ? palette.navy : palette.beige;

  const [trackWidth, setTrackWidth] = useState(0);
  const [dragProgress, setDragProgress] = useState<number | null>(null);

  const [spinValue] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!isDownloading) {
      spinValue.setValue(0);
      return;
    }
    const animation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: durations.spin,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [isDownloading, spinValue]);

  const spin = spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const handleTrackLayout = useCallback((event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  }, []);

  const scrubGesture = Gesture.Pan()
    .withTestId('mini-player-scrub')
    .runOnJS(true)
    .minDistance(0)
    .hitSlop({ vertical: spacing.sm })
    .onUpdate((event) => {
      if (trackWidth <= 0) return;
      setDragProgress(clamp(event.x / trackWidth));
    })
    .onEnd((event) => {
      if (trackWidth <= 0 || !onSeek) return;
      onSeek(clamp(event.x / trackWidth));
    })
    .onFinalize(() => {
      setDragProgress(null);
    });

  const handleSeekAccessibilityAction = useCallback(
    (event: AccessibilityActionEvent) => {
      if (!onSeek) return;
      if (event.nativeEvent.actionName === 'increment') {
        onSeek(clamp(progress + SEEK_STEP));
      } else if (event.nativeEvent.actionName === 'decrement') {
        onSeek(clamp(progress - SEEK_STEP));
      }
    },
    [onSeek, progress],
  );

  const displayedProgress = dragProgress ?? clamp(progress);

  const downloadIcon = isDownloading ? (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <Icon icon={LoaderCircleIcon} size={typography.body.size} color={iconColor} />
    </Animated.View>
  ) : (
    <Icon
      icon={isDownloaded ? CircleCheckIcon : CloudDownloadIcon}
      size={typography.body.size}
      color={iconColor}
    />
  );

  const downloadControl = onToggleDownload ? (
    <Pressable
      onPress={onToggleDownload}
      disabled={isDownloading}
      hitSlop={spacing.sm}
      accessibilityRole="button"
      accessibilityLabel={isDownloading ? 'Downloading' : isDownloaded ? 'Remove download' : 'Download'}
      style={styles.downloadButton}
    >
      {downloadIcon}
    </Pressable>
  ) : (
    <View style={styles.downloadButton} importantForAccessibility="no">
      {downloadIcon}
    </View>
  );

  const playControl = onTogglePlay ? (
    <Pressable
      onPress={onTogglePlay}
      hitSlop={spacing.sm}
      accessibilityRole="button"
      accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
      style={styles.playButton}
    >
      <Ionicons name={isPlaying ? 'pause' : 'play'} size={PLAY_PAUSE_ICON_SIZE} color={iconColor} />
    </Pressable>
  ) : (
    <View style={styles.playButton} importantForAccessibility="no">
      <Ionicons name={isPlaying ? 'pause' : 'play'} size={PLAY_PAUSE_ICON_SIZE} color={iconColor} />
    </View>
  );

  const content = (
    <>
      {coverImage ? (
        <RemoteImage source={coverImage} style={styles.cover} />
      ) : (
        <View testID="mini-player-cover-placeholder" style={[styles.cover, styles.coverPlaceholder]} />
      )}

      <View style={styles.info}>
        <Text variant="headline" color={textColor} numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <View style={styles.metaRow}>
          <Text variant="body" color={textColor}>
            {category}
          </Text>
          {downloadControl}
        </View>
      </View>

      <Text variant="body" color={textColor}>
        {elapsedLabel}
      </Text>

      {playControl}
    </>
  );

  const downloadStatusLabel = isDownloading ? 'Downloading' : isDownloaded ? 'Downloaded' : 'Not downloaded';
  const staticAccessibilityLabel = `${title}, ${category}, ${elapsedLabel}, ${downloadStatusLabel}`;

  return (
    <View style={[styles.container, isRow ? styles.containerRow : styles.containerBar]}>
      {onPress ? (
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={isRow ? title : `Now playing: ${title}. Expand player.`}
          style={({ pressed }) => [
            styles.content,
            !padded && styles.contentUnpadded,
            { opacity: pressed ? opacity.pressedLight : 1 },
          ]}
        >
          {content}
        </Pressable>
      ) : (
        <View
          accessible
          accessibilityLabel={staticAccessibilityLabel}
          style={[styles.content, !padded && styles.contentUnpadded]}
        >
          {content}
        </View>
      )}

      {!isRow && (
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
          </View>
        </GestureDetector>
      )}
    </View>
  );
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

const TRACK_HEIGHT = 6;

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    overflow: 'hidden',
  },
  containerBar: {
    backgroundColor: palette.navy,
  },
  containerRow: {
    backgroundColor: palette.beige,
    borderBottomLeftRadius: radii.lg,
    borderBottomRightRadius: radii.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    gap: spacing.md,
  },
  contentUnpadded: {
    padding: 0,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: typography.headline.size + 1,
  },
  cover: {
    width: COVER_SIZE,
    height: COVER_SIZE,
    borderRadius: radii.sm,
  },
  coverPlaceholder: {
    backgroundColor: palette.grey,
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
  downloadButton: {
    marginLeft: spacing.sm,
  },
  playButton: {
    width: sizes.touchTarget,
    height: sizes.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackHitArea: {
    justifyContent: 'center',
  },
  track: {
    height: TRACK_HEIGHT,
    backgroundColor: palette.grey,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: palette.pear,
  },
});
