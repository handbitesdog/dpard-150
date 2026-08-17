import { View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { MiniPlayer } from '@/components/MiniPlayer';

export type MiniPlayerSlotTrack = {
  title: string;
  coverImage?: ImageSourcePropType;
  elapsedLabel: string;
  progress: number;
  isPlaying: boolean;
  isDownloaded: boolean;
  isDownloading: boolean;
  onTogglePlay: () => void;
  onSeek: (progress: number) => void;
};

/**
 * Reserved mount point directly above the tab bar for the mini-player.
 *
 * Renders nothing and occupies no height while no guide is loaded, so the tab
 * layout doesn't change shape until playback starts.
 */
export function MiniPlayerSlot({ track }: { track: MiniPlayerSlotTrack | null }) {
  if (!track) {
    return <View testID="mini-player-slot" />;
  }

  return (
    <View testID="mini-player-slot">
      <MiniPlayer variant="bar" {...track} />
    </View>
  );
}
