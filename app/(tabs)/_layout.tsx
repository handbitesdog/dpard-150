import { Tabs } from 'expo-router/js-tabs';
import type { ComponentType } from 'react';
import type { ColorValue } from 'react-native';
import type { SvgProps } from 'react-native-svg';
import { Icon } from '@/components/Icon';
import CompassIcon from '@/components/icons/compass-icon.svg';
import FlagIcon from '@/components/icons/flag-icon.svg';
import FlowerIcon from '@/components/icons/flower-icon.svg';
import PinIcon from '@/components/icons/pin-icon.svg';
import SoundIcon from '@/components/icons/sound-icon.svg';
import type { MiniPlayerSlotTrack } from '@/components/MiniPlayerSlot';
import { TabBar } from '@/components/TabBar';
import { guides } from '@/data';
import { parkPhotoById } from '@/data/assets';
import { formatDuration } from '@/lib/formatDuration';
import { useDownloadStore } from '@/stores/downloadStore';
import { usePlaybackStore } from '@/stores/playbackStore';

/** Builds a tab bar icon renderer for the given SVG icon. */
function tabIcon(SvgIcon: ComponentType<SvgProps>) {
  return function TabBarIcon({ size, color }: { size: number; color: ColorValue }) {
    return <Icon icon={SvgIcon} size={size} color={color as string} />;
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
    coverImage: parkPhotoById(guide.parkId),
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
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} miniPlayerTrack={miniPlayerTrack} />}
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
