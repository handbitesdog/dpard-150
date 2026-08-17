import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from './storage';

/**
 * Current on-disk schema version for this store.
 *
 * Bump this whenever `DownloadEntry`'s persisted shape changes, and add a
 * corresponding branch to `migrateDownloads`. All user state in this app is
 * local-only and unrecoverable, so a missing migration loses real data.
 */
export const DOWNLOAD_SCHEMA_VERSION = 1;

export type DownloadStatus = 'not_downloaded' | 'downloading' | 'downloaded' | 'failed';

/** On-disk download state for a single audio guide. `downloadService` (Phase 9) writes this. */
export type DownloadEntry = {
  status: DownloadStatus;
  localPath: string | null;
  bytes: number;
};

type DownloadState = {
  downloads: Record<string, DownloadEntry>;
  /** Overwrites the download entry for a guide. */
  setDownload: (guideId: string, entry: DownloadEntry) => void;
  /** Removes a guide's download entry entirely. */
  removeDownload: (guideId: string) => void;
};

/** The persisted slice of `DownloadState` — actions are not written to disk. */
type PersistedDownloads = Pick<DownloadState, 'downloads'>;

/**
 * Migrates a persisted payload forward to `DOWNLOAD_SCHEMA_VERSION`.
 */
export function migrateDownloads(
  persisted: unknown,
  _version: number,
): PersistedDownloads {
  const state = (persisted ?? {}) as Partial<PersistedDownloads>;

  return {
    downloads:
      state.downloads &&
      typeof state.downloads === 'object' &&
      !Array.isArray(state.downloads)
        ? state.downloads
        : {},
  };
}

export const useDownloadStore = create<DownloadState>()(
  persist(
    (set) => ({
      downloads: {},
      setDownload: (guideId, entry) =>
        set((state) => ({
          downloads: { ...state.downloads, [guideId]: entry },
        })),
      removeDownload: (guideId) =>
        set((state) => {
          const downloads = { ...state.downloads };
          delete downloads[guideId];
          return { downloads };
        }),
    }),
    {
      name: 'downloads',
      version: DOWNLOAD_SCHEMA_VERSION,
      storage: createJSONStorage(() => mmkvStorage),
      migrate: migrateDownloads,
      partialize: (state): PersistedDownloads => ({ downloads: state.downloads }),
    },
  ),
);
