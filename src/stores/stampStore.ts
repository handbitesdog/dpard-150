import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Coordinates } from '@/lib/geo';
import { mmkvStorage } from './storage';

/**
 * Current on-disk schema version for this store.
 *
 * Bump this whenever `Stamp`'s persisted shape changes, and add a
 * corresponding branch to `migrateStamps`. All user state in this app is
 * local-only and unrecoverable, so a missing migration loses real data.
 */
export const STAMP_SCHEMA_VERSION = 1;

/** A single collected stamp: which park, when, and where the collection happened. */
export type Stamp = {
  parkId: string;
  collectedAt: number;
  coordinates: Coordinates;
};

type StampState = {
  stamps: Stamp[];
  /** Whether a stamp has already been collected for the given park. */
  hasStamp: (parkId: string) => boolean;
  /** Records a stamp collection. Does not check for duplicates — that's `stampService`'s job. */
  collectStamp: (parkId: string, coordinates: Coordinates) => void;
};

/** The persisted slice of `StampState` — actions are not written to disk. */
type PersistedStamps = Pick<StampState, 'stamps'>;

/**
 * Migrates a persisted payload forward to `STAMP_SCHEMA_VERSION`.
 */
export function migrateStamps(persisted: unknown, _version: number): PersistedStamps {
  const state = (persisted ?? {}) as Partial<PersistedStamps>;

  return {
    stamps: Array.isArray(state.stamps) ? state.stamps : [],
  };
}

export const useStampStore = create<StampState>()(
  persist(
    (set, get) => ({
      stamps: [],
      hasStamp: (parkId) => get().stamps.some((stamp) => stamp.parkId === parkId),
      collectStamp: (parkId, coordinates) =>
        set((state) => ({
          stamps: [...state.stamps, { parkId, collectedAt: Date.now(), coordinates }],
        })),
    }),
    {
      name: 'stamps',
      version: STAMP_SCHEMA_VERSION,
      storage: createJSONStorage(() => mmkvStorage),
      migrate: migrateStamps,
      partialize: (state): PersistedStamps => ({ stamps: state.stamps }),
    },
  ),
);
