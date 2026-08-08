import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from './storage';

/**
 * Current on-disk schema version for this store.
 *
 * Bump this whenever `PrefsState`'s persisted shape changes, and add a
 * corresponding branch to `migratePrefs`. All user state in this app is
 * local-only and unrecoverable, so a missing migration loses real data.
 */
export const PREFS_SCHEMA_VERSION = 1;

type PrefsState = {
  /** Epoch milliseconds when onboarding was completed, or null if it hasn't been. */
  onboardingCompletedAt: number | null;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
};

/** The persisted slice of `PrefsState` — actions are not written to disk. */
type PersistedPrefs = Pick<PrefsState, 'onboardingCompletedAt'>;

/**
 * Migrates a persisted payload forward to `PREFS_SCHEMA_VERSION`.
 *
 * Phase 3 extends this store with permission history and locale; those
 * versions get their own branch here rather than replacing this one.
 */
export function migratePrefs(persisted: unknown, version: number): PersistedPrefs {
  const state = (persisted ?? {}) as Partial<PersistedPrefs>;

  if (version < 1) {
    return { onboardingCompletedAt: state.onboardingCompletedAt ?? null };
  }

  return { onboardingCompletedAt: state.onboardingCompletedAt ?? null };
}

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set) => ({
      onboardingCompletedAt: null,
      completeOnboarding: () => set({ onboardingCompletedAt: Date.now() }),
      resetOnboarding: () => set({ onboardingCompletedAt: null }),
    }),
    {
      name: 'prefs',
      version: PREFS_SCHEMA_VERSION,
      storage: createJSONStorage(() => mmkvStorage),
      migrate: migratePrefs,
      partialize: (state): PersistedPrefs => ({
        onboardingCompletedAt: state.onboardingCompletedAt,
      }),
    },
  ),
);
