import { View } from 'react-native';

/**
 * Reserved mount point directly above the tab bar for the mini-player.
 *
 * Phase 4 renders the real `MiniPlayer` here and wires it to `playbackService`.
 * Until then this renders nothing and occupies no height — it exists so the tab
 * layout does not have to change shape when playback arrives.
 */
export function MiniPlayerSlot() {
  return <View testID="mini-player-slot" />;
}
