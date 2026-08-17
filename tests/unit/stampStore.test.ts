import { STAMP_SCHEMA_VERSION, migrateStamps, useStampStore } from '@/stores/stampStore';
import { storage } from '@/stores/storage';
import { corruptPayloads } from '../fixtures/stores';

describe('stampStore', () => {
  beforeEach(() => {
    storage.clearAll();
    useStampStore.setState({ stamps: [] });
  });

  it('starts with no stamps', () => {
    expect(useStampStore.getState().stamps).toEqual([]);
  });

  it('reports no stamp for an uncollected park', () => {
    expect(useStampStore.getState().hasStamp('bishop-arts')).toBe(false);
  });

  it('collects a stamp', () => {
    const before = Date.now();
    useStampStore
      .getState()
      .collectStamp('bishop-arts', { latitude: 32.75, longitude: -96.83 });
    const [stamp] = useStampStore.getState().stamps;

    expect(stamp).toBeDefined();
    expect(stamp?.parkId).toBe('bishop-arts');
    expect(stamp?.coordinates).toEqual({ latitude: 32.75, longitude: -96.83 });
    expect(stamp?.collectedAt).toBeGreaterThanOrEqual(before);
  });

  it('reports a stamp after collecting it', () => {
    useStampStore
      .getState()
      .collectStamp('bishop-arts', { latitude: 32.75, longitude: -96.83 });
    expect(useStampStore.getState().hasStamp('bishop-arts')).toBe(true);
  });

  it('supports collecting stamps for multiple parks', () => {
    useStampStore
      .getState()
      .collectStamp('bishop-arts', { latitude: 32.75, longitude: -96.83 });
    useStampStore
      .getState()
      .collectStamp('white-rock-lake', { latitude: 32.83, longitude: -96.72 });

    expect(useStampStore.getState().stamps).toHaveLength(2);
  });

  it('persists stamps to storage', () => {
    useStampStore
      .getState()
      .collectStamp('bishop-arts', { latitude: 32.75, longitude: -96.83 });

    const raw = storage.getString('stamps');
    expect(raw).toBeDefined();
    expect(JSON.parse(raw as string)).toMatchObject({
      version: STAMP_SCHEMA_VERSION,
      state: { stamps: [expect.objectContaining({ parkId: 'bishop-arts' })] },
    });
  });
});

describe('migrateStamps', () => {
  it('carries a valid payload forward', () => {
    const stamps = [
      {
        parkId: 'bishop-arts',
        collectedAt: 1234,
        coordinates: { latitude: 1, longitude: 2 },
      },
    ];
    expect(migrateStamps({ stamps }, STAMP_SCHEMA_VERSION)).toEqual({ stamps });
  });

  it.each(corruptPayloads)('tolerates a corrupt payload: %p', (payload) => {
    expect(migrateStamps(payload, 0)).toEqual({ stamps: [] });
  });
});
