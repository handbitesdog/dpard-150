import { createAudioPlayer } from 'expo-audio';
import { create } from 'zustand';
import { guides } from '@/data';
import { resolveAudioUrl } from '@/lib/cdn';
import { localize } from '@/lib/localize';
import {
  createPlaybackService,
  type PlaybackPlayer,
  type PlaybackService,
  type PlaybackStatus,
} from '@/services/playbackService';
import { useDownloadStore } from './downloadStore';
import { usePrefsStore } from './prefsStore';
import { useProgressStore } from './progressStore';

/**
 * Played when a guide resolves to no audio at all — no completed download and
 * no CDN configured, which is how the app ships until a host is provisioned.
 * Every guide sounds identical in that state, deliberately: silence would look
 * like a broken player.
 */
const AUDIO_FIXTURE = require('../../assets/audio/test-tone.wav');

/**
 * Picks what a guide should play: its downloaded file if one completed,
 * otherwise the CDN stream, otherwise the bundled fixture.
 */
export function resolveGuideSource(guideId: string): unknown {
  const guide = guides.find((candidate) => candidate.id === guideId);
  if (!guide) {
    return AUDIO_FIXTURE;
  }

  const download = useDownloadStore.getState().downloads[guideId];
  const localPath = download?.status === 'downloaded' ? download.localPath : null;
  const audioPath = localize(guide.audioPath, usePrefsStore.getState().locale);

  const url = resolveAudioUrl(audioPath, localPath);
  return url === null ? AUDIO_FIXTURE : { uri: url };
}

type PlaybackState = {
  currentGuideId: string | null;
  isPlaying: boolean;
  positionSeconds: number;
  play: (guideId: string) => void;
  pause: () => void;
  seek: (positionSeconds: number) => void;
};

let service: PlaybackService | null = null;

/**
 * Builds the real player and service on first use rather than at module load,
 * so importing this store (e.g. by rendering the Listen screen) never touches
 * expo-audio's native layer unless playback is actually requested.
 */
function getService(
  set: (partial: Partial<PlaybackState>) => void,
  get: () => PlaybackState,
): PlaybackService {
  if (service) return service;

  const player = createAudioPlayer(null) as unknown as PlaybackPlayer;

  service = createPlaybackService({
    player,
    resolveSource: resolveGuideSource,
    getResumePosition: (guideId) => {
      const progress = useProgressStore.getState().progress[guideId];
      return progress && !progress.completedAt ? progress.positionSeconds : undefined;
    },
    onStatusChange: (status: PlaybackStatus) => {
      const previous = get();
      const stoppedOrSwitched =
        previous.currentGuideId !== null &&
        (previous.currentGuideId !== status.guideId || (previous.isPlaying && !status.isPlaying));
      if (stoppedOrSwitched) {
        useProgressStore.getState().setPosition(previous.currentGuideId!, previous.positionSeconds);
      }

      set({
        currentGuideId: status.guideId,
        isPlaying: status.isPlaying,
        positionSeconds: status.positionSeconds,
      });
    },
  });

  return service;
}

export const usePlaybackStore = create<PlaybackState>((set, get) => ({
  currentGuideId: null,
  isPlaying: false,
  positionSeconds: 0,
  play: (guideId) => {
    void getService(set, get).play(guideId);
  },
  pause: () => {
    void getService(set, get).pause();
  },
  seek: (positionSeconds) => {
    void getService(set, get).seek(positionSeconds);
  },
}));
