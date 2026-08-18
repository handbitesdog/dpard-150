import { createAudioPlayer } from 'expo-audio';
import { create } from 'zustand';
import {
  createPlaybackService,
  type PlaybackPlayer,
  type PlaybackService,
  type PlaybackStatus,
} from '@/services/playbackService';
import { useProgressStore } from './progressStore';

/**
 * Stand-in audio source for every guide, until a CDN resolver exists for
 * `AudioGuide.audioPath` — same gap `listen.tsx`'s `PARK_PHOTOS` map stands
 * in for on the image side.
 */
const AUDIO_FIXTURE = require('../../assets/audio/test-tone.wav');

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
    resolveSource: () => AUDIO_FIXTURE,
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
