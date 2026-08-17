import { BottomTabBar, Tabs } from 'expo-router/js-tabs';
import type { ComponentType } from 'react';
import type { SvgProps } from 'react-native-svg';
import { Icon } from '@/components/Icon';
import CompassIcon from '@/components/icons/compass-icon.svg';
import FlagIcon from '@/components/icons/flag-icon.svg';
import FlowerIcon from '@/components/icons/flower-icon.svg';
import PinIcon from '@/components/icons/pin-icon.svg';
import SoundIcon from '@/components/icons/sound-icon.svg';
import { MiniPlayerSlot } from '@/components/MiniPlayerSlot';
import type { MiniPlayerSlotTrack } from '@/components/MiniPlayerSlot';
import { guides } from '@/data';
import { PARK_PHOTOS } from '@/data/parkPhotos';
import { navyMuted, palette } from '@/design/colors';
import { spacing } from '@/design/spacing';
import { typography } from '@/design/typography';
import { formatDuration } from '@/lib/formatDuration';
import { useDownloadStore } from '@/stores/downloadStore';
import { usePlaybackStore } from '@/stores/playbackStore';

/** Builds a tab bar icon renderer for the given SVG icon. */
function tabIcon(SvgIcon: ComponentType<SvgProps>) {
  return function TabBarIcon({ size }: { size: number }) {
    return <Icon icon={SvgIcon} size={size} />;
  };
}

function useMiniPlayerTrack(): MiniPlayerSlotTrack | null {
  const currentGuideId = usePlaybackStore((s) => s.currentGuideId);
  const isPlaying = usePlaybackStore((s) => s.isPlaying);
  const positionSeconds = usePlaybackStore((s) => s.positionSeconds);
  const play = usePlaybackStore((s) => s.play);
  const pause = usePlaybackStore((s) => s.pause);
  const seek = usePlaybackStore((s) => s.seek);
  const downloads = useDownloadStore((s) => s.downloads);

  const guide = guides.find((g) => g.id === currentGuideId);
  if (!guide) return null;

  const downloadStatus = downloads[guide.id]?.status ?? 'not_downloaded';

  return {
    title: guide.title,
    coverImage: PARK_PHOTOS[guide.parkId],
    elapsedLabel: formatDuration(positionSeconds),
    progress: guide.durationSeconds > 0 ? positionSeconds / guide.durationSeconds : 0,
    isPlaying,
    isDownloaded: downloadStatus === 'downloaded',
    isDownloading: downloadStatus === 'downloading',
    onTogglePlay: () => (isPlaying ? pause() : play(guide.id)),
    onSeek: (progress) => seek(progress * guide.durationSeconds),
  };
}

export default function TabsLayout() {
  const miniPlayerTrack = useMiniPlayerTrack();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.navy,
        tabBarInactiveTintColor: navyMuted,
        tabBarStyle: {
          backgroundColor: palette.beige,
          paddingTop: spacing.xs,
          paddingBottom: spacing['2xl'],
          paddingHorizontal: spacing.sm,
        },
        tabBarLabelStyle: {
          fontSize: typography.footnote.size,
          lineHeight: typography.footnote.lineHeight,
          marginTop: spacing.xs,
        },
      }}
      tabBar={(props) => (
        <>
          <MiniPlayerSlot track={miniPlayerTrack} />
          <BottomTabBar {...props} />
        </>
      )}
    >
      <Tabs.Screen name="discover" options={{ title: 'Discover', tabBarIcon: tabIcon(PinIcon) }} />
      <Tabs.Screen name="listen" options={{ title: 'Listen', tabBarIcon: tabIcon(SoundIcon) }} />
      <Tabs.Screen
        name="explore"
        options={{ title: 'Explore', tabBarIcon: tabIcon(CompassIcon) }}
      />
      <Tabs.Screen name="passport" options={{ title: 'Passport', tabBarIcon: tabIcon(FlagIcon) }} />
      <Tabs.Screen name="connect" options={{ title: 'Connect', tabBarIcon: tabIcon(FlowerIcon) }} />
    </Tabs>
  );
}
