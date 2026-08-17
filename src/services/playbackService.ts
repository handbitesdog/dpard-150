/** Status of a single event fired by the underlying audio player. */
export type PlayerStatus = {
  currentTime: number;
  duration: number;
  playing: boolean;
};

/**
 * The subset of expo-audio's `AudioPlayer` this service depends on. Kept as a
 * hand-rolled interface (rather than importing expo-audio's own type) so this
 * file never imports expo-audio and stays testable against a fake player.
 */
export type PlaybackPlayer = {
  currentTime: number;
  play: () => void;
  pause: () => void;
  replace: (source: unknown) => void;
  seekTo: (seconds: number) => Promise<void>;
  setPlaybackRate: (rate: number) => void;
  addListener: (
    event: 'playbackStatusUpdate',
    listener: (status: PlayerStatus) => void,
  ) => { remove: () => void };
};

/** Playback state for whichever guide is currently loaded, or none. */
export type PlaybackStatus = {
  guideId: string | null;
  isPlaying: boolean;
  positionSeconds: number;
  durationSeconds: number;
};

export type PlaybackServiceDeps = {
  player: PlaybackPlayer;
  /** Resolves a guide to its playable audio source. */
  resolveSource: (guideId: string) => unknown;
  /** Fired on every underlying player status event. */
  onStatusChange: (status: PlaybackStatus) => void;
};

/**
 * A single global player instance. Play, pause, seek, skip ±N seconds,
 * playback speed.
 */
export type PlaybackService = {
  play: (guideId: string) => Promise<void>;
  pause: () => Promise<void>;
  seek: (positionSeconds: number) => Promise<void>;
  skip: (deltaSeconds: number) => Promise<void>;
  setPlaybackSpeed: (speed: number) => Promise<void>;
};

export function createPlaybackService(deps: PlaybackServiceDeps): PlaybackService {
  let currentGuideId: string | null = null;

  deps.player.addListener('playbackStatusUpdate', (status) => {
    deps.onStatusChange({
      guideId: currentGuideId,
      isPlaying: status.playing,
      positionSeconds: status.currentTime,
      durationSeconds: status.duration,
    });
  });

  return {
    async play(guideId) {
      if (guideId !== currentGuideId) {
        currentGuideId = guideId;
        deps.player.replace(deps.resolveSource(guideId));
      }
      deps.player.play();
    },
    async pause() {
      deps.player.pause();
    },
    async seek(positionSeconds) {
      await deps.player.seekTo(positionSeconds);
    },
    async skip(deltaSeconds) {
      await deps.player.seekTo(deps.player.currentTime + deltaSeconds);
    },
    async setPlaybackSpeed(speed) {
      deps.player.setPlaybackRate(speed);
    },
  };
}
