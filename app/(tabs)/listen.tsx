import { StyleSheet, View } from 'react-native';
import { MiniPlayer } from '@/components/MiniPlayer';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { guides, parks } from '@/data';
import { PARK_PHOTOS } from '@/data/parkPhotos';
import { spacing } from '@/design/spacing';
import { formatDuration } from '@/lib/formatDuration';
import { useDownloadStore } from '@/stores/downloadStore';
import { usePlaybackStore } from '@/stores/playbackStore';
import { useProgressStore } from '@/stores/progressStore';

export default function ListenScreen() {
  const downloads = useDownloadStore((s) => s.downloads);
  const progress = useProgressStore((s) => s.progress);
  const currentGuideId = usePlaybackStore((s) => s.currentGuideId);
  const isPlaying = usePlaybackStore((s) => s.isPlaying);
  const positionSeconds = usePlaybackStore((s) => s.positionSeconds);
  const play = usePlaybackStore((s) => s.play);
  const pause = usePlaybackStore((s) => s.pause);

  return (
    <Screen scroll>
      <Text variant="title1" accessibilityRole="header" style={styles.title}>
        Listen
      </Text>

      <View style={styles.list}>
        {guides.map((guide) => {
          const park = parks.find((p) => p.id === guide.parkId);
          if (!park) return null;

          // Most parks have a single guide — its row just carries the park's identity.
          const parkGuideCount = guides.filter((g) => g.parkId === park.id).length;
          const coverImage = PARK_PHOTOS[park.id];

          const isActive = currentGuideId === guide.id;
          const guideProgress = progress[guide.id];
          const fraction = isActive
            ? guide.durationSeconds > 0
              ? positionSeconds / guide.durationSeconds
              : 0
            : guideProgress?.completedAt
              ? 1
              : guide.durationSeconds > 0
                ? (guideProgress?.positionSeconds ?? 0) / guide.durationSeconds
                : 0;

          const downloadStatus = downloads[guide.id]?.status ?? 'not_downloaded';

          return (
            <MiniPlayer
              key={guide.id}
              variant="row"
              padded={false}
              title={parkGuideCount === 1 ? park.name : guide.title}
              coverImage={coverImage}
              elapsedLabel={formatDuration(isActive ? positionSeconds : guide.durationSeconds)}
              progress={fraction}
              isPlaying={isActive && isPlaying}
              onTogglePlay={() => (isActive && isPlaying ? pause() : play(guide.id))}
              isDownloaded={downloadStatus === 'downloaded'}
              isDownloading={downloadStatus === 'downloading'}
            />
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  list: {
    gap: spacing.base,
  },
});
