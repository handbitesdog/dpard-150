import { PREFS_SCHEMA_VERSION, migratePrefs, usePrefsStore } from '@/stores/prefsStore';
import { storage } from '@/stores/storage';

describe('prefsStore', () => {
  beforeEach(() => {
    storage.clearAll();
    usePrefsStore.setState({
      onboardingCompletedAt: null,
      locale: 'en',
      locationPermissionAskedAt: null,
    });
  });

  it('starts with onboarding incomplete', () => {
    expect(usePrefsStore.getState().onboardingCompletedAt).toBeNull();
  });

  it('records a timestamp when onboarding completes', () => {
    const before = Date.now();
    usePrefsStore.getState().completeOnboarding();
    const completedAt = usePrefsStore.getState().onboardingCompletedAt;

    expect(completedAt).not.toBeNull();
    expect(completedAt).toBeGreaterThanOrEqual(before);
  });

  it('persists onboarding completion to storage', () => {
    usePrefsStore.getState().completeOnboarding();

    const raw = storage.getString('prefs');
    expect(raw).toBeDefined();
    expect(JSON.parse(raw as string)).toMatchObject({
      version: PREFS_SCHEMA_VERSION,
      state: { onboardingCompletedAt: expect.any(Number) },
    });
  });

  it('clears the timestamp on reset', () => {
    usePrefsStore.getState().completeOnboarding();
    usePrefsStore.getState().resetOnboarding();

    expect(usePrefsStore.getState().onboardingCompletedAt).toBeNull();
  });

  it('starts with English as the locale', () => {
    expect(usePrefsStore.getState().locale).toBe('en');
  });

  it('sets the locale', () => {
    usePrefsStore.getState().setLocale('es');
    expect(usePrefsStore.getState().locale).toBe('es');
  });

  it('records a timestamp when the location permission is asked', () => {
    const before = Date.now();
    usePrefsStore.getState().recordLocationPermissionAsked();
    const askedAt = usePrefsStore.getState().locationPermissionAskedAt;

    expect(askedAt).not.toBeNull();
    expect(askedAt).toBeGreaterThanOrEqual(before);
  });
});

describe('migratePrefs', () => {
  it('carries a v0 payload forward without losing completion', () => {
    expect(migratePrefs({ onboardingCompletedAt: 1234 }, 0)).toEqual({
      onboardingCompletedAt: 1234,
      locale: 'en',
      locationPermissionAskedAt: null,
    });
  });

  it('defaults missing fields to their safe defaults', () => {
    expect(migratePrefs({}, 0)).toEqual({
      onboardingCompletedAt: null,
      locale: 'en',
      locationPermissionAskedAt: null,
    });
  });

  it('tolerates a corrupt payload', () => {
    expect(migratePrefs(null, 0)).toEqual({
      onboardingCompletedAt: null,
      locale: 'en',
      locationPermissionAskedAt: null,
    });
    expect(migratePrefs(undefined, PREFS_SCHEMA_VERSION)).toEqual({
      onboardingCompletedAt: null,
      locale: 'en',
      locationPermissionAskedAt: null,
    });
  });

  it('carries a v1 payload forward, adding locale and permission-history defaults', () => {
    expect(migratePrefs({ onboardingCompletedAt: 1234 }, 1)).toEqual({
      onboardingCompletedAt: 1234,
      locale: 'en',
      locationPermissionAskedAt: null,
    });
  });

  it('preserves an already-migrated v2 payload', () => {
    expect(
      migratePrefs(
        { onboardingCompletedAt: 1234, locale: 'es', locationPermissionAskedAt: 5678 },
        2,
      ),
    ).toEqual({
      onboardingCompletedAt: 1234,
      locale: 'es',
      locationPermissionAskedAt: 5678,
    });
  });
});
