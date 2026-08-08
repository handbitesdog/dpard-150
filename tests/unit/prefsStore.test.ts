import { PREFS_SCHEMA_VERSION, migratePrefs, usePrefsStore } from '@/stores/prefsStore';
import { storage } from '@/stores/storage';

describe('prefsStore', () => {
  beforeEach(() => {
    storage.clearAll();
    usePrefsStore.setState({ onboardingCompletedAt: null });
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
});

describe('migratePrefs', () => {
  it('carries a v0 payload forward without losing completion', () => {
    expect(migratePrefs({ onboardingCompletedAt: 1234 }, 0)).toEqual({
      onboardingCompletedAt: 1234,
    });
  });

  it('defaults a missing field to null rather than undefined', () => {
    expect(migratePrefs({}, 0)).toEqual({ onboardingCompletedAt: null });
  });

  it('tolerates a corrupt payload', () => {
    expect(migratePrefs(null, 0)).toEqual({ onboardingCompletedAt: null });
    expect(migratePrefs(undefined, PREFS_SCHEMA_VERSION)).toEqual({
      onboardingCompletedAt: null,
    });
  });
});
