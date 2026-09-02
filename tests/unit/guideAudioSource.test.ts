import { guides } from '@/data';
import { localize } from '@/lib/localize';
import { useDownloadStore } from '@/stores/downloadStore';
import { resolveGuideSource } from '@/stores/playbackStore';
import { usePrefsStore } from '@/stores/prefsStore';
import { storage } from '@/stores/storage';

const BASE = 'https://cdn.example.com';

const guide = guides[0]!;
const audioFixture = require('../../assets/audio/test-tone.wav');
const localPath = 'file:///data/guides/guide-1.m4a';

function setDownload(status: 'downloaded' | 'downloading' | 'failed') {
  useDownloadStore.getState().setDownload(guide.id, { status, localPath, bytes: 1024 });
}

describe('resolveGuideSource', () => {
  beforeEach(() => {
    storage.clearAll();
    useDownloadStore.setState({ downloads: {} });
    usePrefsStore.setState({ locale: 'en' });
  });

  afterEach(() => {
    delete process.env.EXPO_PUBLIC_CDN_BASE_URL;
  });

  it('plays the bundled fixture when there is no download and no CDN', () => {
    expect(resolveGuideSource(guide.id)).toBe(audioFixture);
  });

  it('streams from the CDN when configured', () => {
    process.env.EXPO_PUBLIC_CDN_BASE_URL = BASE;

    expect(resolveGuideSource(guide.id)).toEqual({
      uri: `${BASE}${localize(guide.audioPath, 'en')}`,
    });
  });

  it('prefers a completed download over the stream', () => {
    process.env.EXPO_PUBLIC_CDN_BASE_URL = BASE;
    setDownload('downloaded');

    expect(resolveGuideSource(guide.id)).toEqual({ uri: localPath });
  });

  it.each(['downloading', 'failed'] as const)(
    'ignores a %s download and streams instead',
    (status) => {
      process.env.EXPO_PUBLIC_CDN_BASE_URL = BASE;
      setDownload(status);

      expect(resolveGuideSource(guide.id)).toEqual({
        uri: `${BASE}${localize(guide.audioPath, 'en')}`,
      });
    },
  );

  it('falls back to the fixture for a guide that is not in the catalog', () => {
    process.env.EXPO_PUBLIC_CDN_BASE_URL = BASE;

    expect(resolveGuideSource('no-such-guide')).toBe(audioFixture);
  });
});
