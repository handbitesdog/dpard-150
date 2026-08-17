import {
  PROGRESS_SCHEMA_VERSION,
  migrateProgress,
  useProgressStore,
} from '@/stores/progressStore';
import { storage } from '@/stores/storage';
import { corruptPayloads } from '../fixtures/stores';

describe('progressStore', () => {
  beforeEach(() => {
    storage.clearAll();
    useProgressStore.setState({ progress: {} });
  });

  it('starts with no progress recorded', () => {
    expect(useProgressStore.getState().progress).toEqual({});
  });

  it('records a playback position for a guide', () => {
    useProgressStore.getState().setPosition('test-guide', 42);
    expect(useProgressStore.getState().progress['test-guide']).toEqual({
      positionSeconds: 42,
      completedAt: null,
    });
  });

  it('overwrites the position on repeated updates', () => {
    useProgressStore.getState().setPosition('test-guide', 42);
    useProgressStore.getState().setPosition('test-guide', 99);
    expect(useProgressStore.getState().progress['test-guide']?.positionSeconds).toBe(99);
  });

  it('marks a guide completed without losing its position', () => {
    useProgressStore.getState().setPosition('test-guide', 280);
    useProgressStore.getState().markCompleted('test-guide');

    const progress = useProgressStore.getState().progress['test-guide'];
    expect(progress?.positionSeconds).toBe(280);
    expect(progress?.completedAt).not.toBeNull();
  });

  it('setting position after completion preserves the completedAt', () => {
    useProgressStore.getState().markCompleted('test-guide');
    const completedAt = useProgressStore.getState().progress['test-guide']?.completedAt;

    useProgressStore.getState().setPosition('test-guide', 10);

    expect(useProgressStore.getState().progress['test-guide']?.completedAt).toBe(
      completedAt,
    );
  });

  it('tracks progress for multiple guides independently', () => {
    useProgressStore.getState().setPosition('guide-a', 10);
    useProgressStore.getState().setPosition('guide-b', 20);

    expect(useProgressStore.getState().progress['guide-a']?.positionSeconds).toBe(10);
    expect(useProgressStore.getState().progress['guide-b']?.positionSeconds).toBe(20);
  });

  it('persists progress to storage', () => {
    useProgressStore.getState().setPosition('test-guide', 42);

    const raw = storage.getString('progress');
    expect(raw).toBeDefined();
    expect(JSON.parse(raw as string)).toMatchObject({
      version: PROGRESS_SCHEMA_VERSION,
      state: { progress: { 'test-guide': { positionSeconds: 42 } } },
    });
  });
});

describe('migrateProgress', () => {
  it('carries a valid payload forward', () => {
    const progress = { 'test-guide': { positionSeconds: 42, completedAt: null } };
    expect(migrateProgress({ progress }, PROGRESS_SCHEMA_VERSION)).toEqual({ progress });
  });

  it.each(corruptPayloads)('tolerates a corrupt payload: %p', (payload) => {
    expect(migrateProgress(payload, 0)).toEqual({ progress: {} });
  });
});
