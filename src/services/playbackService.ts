/**
 * A single global audio player instance. Implemented in Phase 4 against
 * whichever library the audio spike at the top of that phase settles on.
 */
export type PlaybackService = {
  play: (guideId: string) => Promise<void>;
  pause: () => Promise<void>;
  seek: (positionSeconds: number) => Promise<void>;
  skip: (deltaSeconds: number) => Promise<void>;
  setPlaybackSpeed: (speed: number) => Promise<void>;
};
