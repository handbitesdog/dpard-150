import { StyleSheet, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { MiniPlayer } from '@/components/MiniPlayer';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { guides, parks } from '@/data';
import { spacing } from '@/design/spacing';
import { formatDuration } from '@/lib/formatDuration';
import { useDownloadStore } from '@/stores/downloadStore';
import { useProgressStore } from '@/stores/progressStore';

/**
 * The catalog's `park.photos[].source` values are CDN-relative paths with no
 * resolver yet (no CDN base URL, no local asset behind them) — Discover's
 * photo pipeline hasn't been built. These stand in until that lands.
 */
const PARK_PHOTOS: Record<string, ImageSourcePropType> = {
  'klyde-warren-park': require('../../assets/park-1.jpg'),
  'fair-park': require('../../assets/park-2.jpg'),
  'white-rock-lake-park': require('../../assets/park-3.jpg'),
};

export default function ListenScreen() {
  const downloads = useDownloadStore((s) => s.downloads);
  const progress = useProgressStore((s) => s.progress);

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

          const guideProgress = progress[guide.id];
          const fraction = guideProgress?.completedAt
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
              elapsedLabel={formatDuration(guide.durationSeconds)}
              progress={fraction}
              isPlaying={false}
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
