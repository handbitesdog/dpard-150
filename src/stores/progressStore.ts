import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from './storage';

/**
 * Current on-disk schema version for this store.
 *
 * Bump this whenever `GuideProgress`'s persisted shape changes, and add a
 * corresponding branch to `migrateProgress`. All user state in this app is
 * local-only and unrecoverable, so a missing migration loses real data.
 */
export const PROGRESS_SCHEMA_VERSION = 1;

/** Playback progress for a single audio guide. */
export type GuideProgress = {
  positionSeconds: number;
  completedAt: number | null;
};

type ProgressState = {
  progress: Record<string, GuideProgress>;
  /** Records the current playback position, preserving any existing completion. */
  setPosition: (guideId: string, positionSeconds: number) => void;
  /** Marks a guide as completed, preserving its last known playback position. */
  markCompleted: (guideId: string) => void;
};

/** The persisted slice of `ProgressState` — actions are not written to disk. */
type PersistedProgress = Pick<ProgressState, 'progress'>;

/**
 * Migrates a persisted payload forward to `PROGRESS_SCHEMA_VERSION`.
 */
export function migrateProgress(persisted: unknown, _version: number): PersistedProgress {
  const state = (persisted ?? {}) as Partial<PersistedProgress>;

  return {
    progress:
      state.progress &&
      typeof state.progress === 'object' &&
      !Array.isArray(state.progress)
        ? state.progress
        : {},
  };
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: {},
      setPosition: (guideId, positionSeconds) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [guideId]: {
              positionSeconds,
              completedAt: get().progress[guideId]?.completedAt ?? null,
            },
          },
        })),
      markCompleted: (guideId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [guideId]: {
              positionSeconds: get().progress[guideId]?.positionSeconds ?? 0,
              completedAt: Date.now(),
            },
          },
        })),
    }),
    {
      name: 'progress',
      version: PROGRESS_SCHEMA_VERSION,
      storage: createJSONStorage(() => mmkvStorage),
      migrate: migrateProgress,
      partialize: (state): PersistedProgress => ({ progress: state.progress }),
    },
  ),
);
