/** Manages local audio files for offline playback. Implemented in Phase 9. */
export type DownloadService = {
  start: (guideId: string) => Promise<void>;
  cancel: (guideId: string) => Promise<void>;
  delete: (guideId: string) => Promise<void>;
};
