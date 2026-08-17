/**
 * Stands in for expo-audio's native layer under Jest.
 *
 * Merely importing 'expo-audio' throws under jest-expo — its module graph
 * reaches into a native prototype that doesn't exist without a device/simulator
 * runtime. playbackService.ts never imports expo-audio directly (it depends on
 * a minimal injected player interface instead, so it's fully testable against a
 * fake), but playbackStore.ts does, to construct the real singleton player. This
 * mock lets that import succeed; the fake player is inert beyond tracking state,
 * since no test exercises real playback through it.
 */
function createFakePlayer() {
  return {
    playing: false,
    currentTime: 0,
    duration: 0,
    play() {
      this.playing = true;
    },
    pause() {
      this.playing = false;
    },
    replace() {},
    async seekTo(seconds: number) {
      this.currentTime = seconds;
    },
    setPlaybackRate() {},
    addListener() {
      return { remove() {} };
    },
  };
}

export function createAudioPlayer() {
  return createFakePlayer();
}
