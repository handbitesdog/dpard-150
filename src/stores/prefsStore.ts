import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Locale } from '@/lib/localize';
import { mmkvStorage } from './storage';

/**
 * Current on-disk schema version for this store.
 *
 * Bump this whenever `PrefsState`'s persisted shape changes, and add a
 * corresponding branch to `migratePrefs`. All user state in this app is
 * local-only and unrecoverable, so a missing migration loses real data.
 */
export const PREFS_SCHEMA_VERSION = 2;

type PrefsState = {
  /** Epoch milliseconds when onboarding was completed, or null if it hasn't been. */
  onboardingCompletedAt: number | null;
  /** The user's preferred content locale. Defaults to English. */
  locale: Locale;
  /** Epoch milliseconds of the last location-permission prompt, or null if never asked. */
  locationPermissionAskedAt: number | null;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setLocale: (locale: Locale) => void;
  recordLocationPermissionAsked: () => void;
};

/** The persisted slice of `PrefsState` — actions are not written to disk. */
type PersistedPrefs = Pick<
  PrefsState,
  'onboardingCompletedAt' | 'locale' | 'locationPermissionAskedAt'
>;

/**
 * Migrates a persisted payload forward to `PREFS_SCHEMA_VERSION`.
 */
export function migratePrefs(persisted: unknown, version: number): PersistedPrefs {
  const state = (persisted ?? {}) as Partial<PersistedPrefs>;

  if (version < 2) {
    return {
      onboardingCompletedAt: state.onboardingCompletedAt ?? null,
      locale: 'en',
      locationPermissionAskedAt: null,
    };
  }

  return {
    onboardingCompletedAt: state.onboardingCompletedAt ?? null,
    locale: state.locale ?? 'en',
    locationPermissionAskedAt: state.locationPermissionAskedAt ?? null,
  };
}

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set) => ({
      onboardingCompletedAt: null,
      locale: 'en',
      locationPermissionAskedAt: null,
      completeOnboarding: () => set({ onboardingCompletedAt: Date.now() }),
      resetOnboarding: () => set({ onboardingCompletedAt: null }),
      setLocale: (locale) => set({ locale }),
      recordLocationPermissionAsked: () => set({ locationPermissionAskedAt: Date.now() }),
    }),
    {
      name: 'prefs',
      version: PREFS_SCHEMA_VERSION,
      storage: createJSONStorage(() => mmkvStorage),
      migrate: migratePrefs,
      partialize: (state): PersistedPrefs => ({
        onboardingCompletedAt: state.onboardingCompletedAt,
        locale: state.locale,
        locationPermissionAskedAt: state.locationPermissionAskedAt,
      }),
    },
  ),
);
