import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from 'expo-router';
import CompassIcon from '@/components/icons/compass-icon.svg';
import SoundIconWhite from '@/components/icons/sound-icon-white.svg';
import { EmptyState } from '@/components/EmptyState';
import { MiniPlayer } from '@/components/MiniPlayer';
import { SearchBar } from '@/components/SearchBar';
import { Text } from '@/components/Text';
import { guides, parks } from '@/data';
import { parkPhoto } from '@/data/assets';
import { palette } from '@/design/colors';
import { shadows } from '@/design/shadows';
import { spacing } from '@/design/spacing';
import { formatDuration } from '@/lib/formatDuration';
import { useDownloadStore } from '@/stores/downloadStore';
import { usePlaybackStore } from '@/stores/playbackStore';
import { useProgressStore } from '@/stores/progressStore';

const SEARCH_DEBOUNCE_MS = 250;

function matchesQuery(query: string, guide: (typeof guides)[number], park: (typeof parks)[number]) {
  const haystack = `${guide.title} ${park.name} ${guide.narrator ?? ''}`.toLowerCase();
  return haystack.includes(query);
}

export default function ListenScreen() {
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      StatusBar.setStyle('light');
      return () => StatusBar.setStyle('dark');
    }, []),
  );

  const downloads = useDownloadStore((s) => s.downloads);
  const progress = useProgressStore((s) => s.progress);
  const currentGuideId = usePlaybackStore((s) => s.currentGuideId);
  const isPlaying = usePlaybackStore((s) => s.isPlaying);
  const positionSeconds = usePlaybackStore((s) => s.positionSeconds);
  const play = usePlaybackStore((s) => s.play);
  const pause = usePlaybackStore((s) => s.pause);

  const [searchText, setSearchText] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(searchText.trim().toLowerCase());
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [searchText]);

  const visibleGuides = guides.filter((guide) => {
    const park = parks.find((p) => p.id === guide.parkId);
    if (!park) return false;
    return debouncedQuery === '' || matchesQuery(debouncedQuery, guide, park);
  });

  return (
    <View style={styles.root}>
      <View style={[styles.hero, { paddingTop: insets.top + spacing.lg }]}>
        <View style={styles.heroHeader}>
          <SoundIconWhite width={26} height={21} />
          <Text variant="title1" color="white" accessibilityRole="header" style={styles.heroTitle}>
            Audio Tour Guides
          </Text>
        </View>
        <Text variant="body" color="beige" style={styles.heroSubtitle}>
          Explore Dallas parks through guided audio tours narrated by local voices.
        </Text>

        <View style={styles.searchWrap}>
          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search guides"
            accessibilityLabel="Search audio guides"
          />
        </View>
      </View>

      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.safeArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {visibleGuides.length === 0 ? (
            <EmptyState
              icon={CompassIcon}
              title="No results"
              message="Try a different search term."
              actionLabel="Clear search"
              onAction={() => setSearchText('')}
            />
          ) : (
            <View style={styles.list}>
              {visibleGuides.map((guide) => {
                const park = parks.find((p) => p.id === guide.parkId);
                if (!park) return null;

                // Most parks have a single guide — its row just carries the park's identity.
                const parkGuideCount = guides.filter((g) => g.parkId === park.id).length;
                const coverImage = parkPhoto(park);

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
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.beige,
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl,
  },
  hero: {
    backgroundColor: palette.navy,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xl,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  heroTitle: {
    flexShrink: 1,
  },
  heroSubtitle: {
    marginTop: spacing.sm,
    opacity: 0.85,
  },
  searchWrap: {
    marginTop: spacing.base,
    ...shadows.elevated,
  },
  list: {
    gap: spacing.base,
  },
});
