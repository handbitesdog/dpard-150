import {
  cdnBaseUrl,
  feedUrl,
  isCdnConfigured,
  resolveAudioUrl,
  resolveCdnUrl,
} from '@/lib/cdn';

const BASE = 'https://cdn.example.com';

function setBase(value: string | undefined) {
  if (value === undefined) {
    delete process.env.EXPO_PUBLIC_CDN_BASE_URL;
  } else {
    process.env.EXPO_PUBLIC_CDN_BASE_URL = value;
  }
}

describe('cdnBaseUrl', () => {
  afterEach(() => setBase(undefined));

  it('is null when unset', () => {
    expect(cdnBaseUrl()).toBeNull();
    expect(isCdnConfigured()).toBe(false);
  });

  it.each(['', '   ', 'cdn.example.com', 'ftp://cdn.example.com'])(
    'is null for %p, which is not an http(s) origin',
    (value) => {
      setBase(value);
      expect(cdnBaseUrl()).toBeNull();
    },
  );

  it('strips trailing slashes so joins never double up', () => {
    setBase(`${BASE}//`);
    expect(cdnBaseUrl()).toBe(BASE);
  });

  it('accepts an http origin with a path prefix', () => {
    setBase('http://localhost:8080/dpard');
    expect(cdnBaseUrl()).toBe('http://localhost:8080/dpard');
    expect(isCdnConfigured()).toBe(true);
  });
});

describe('resolveCdnUrl', () => {
  afterEach(() => setBase(undefined));

  it('is null for every catalog path while no CDN is configured', () => {
    expect(resolveCdnUrl('/parks/fair-park/esplanade.jpg')).toBeNull();
  });

  it('joins a catalog path onto the base', () => {
    setBase(BASE);
    expect(resolveCdnUrl('/parks/fair-park/esplanade.jpg')).toBe(
      `${BASE}/parks/fair-park/esplanade.jpg`,
    );
  });

  it('joins a path that has no leading slash', () => {
    setBase(BASE);
    expect(resolveCdnUrl('guides/kwp-history/en.m4a')).toBe(
      `${BASE}/guides/kwp-history/en.m4a`,
    );
  });

  it('passes absolute URLs through, configured or not', () => {
    const absolute = 'https://images.example.org/post-1.jpg';
    expect(resolveCdnUrl(absolute)).toBe(absolute);
    setBase(BASE);
    expect(resolveCdnUrl(absolute)).toBe(absolute);
  });

  it.each([null, undefined, ''])('is null for %p', (path) => {
    setBase(BASE);
    expect(resolveCdnUrl(path)).toBeNull();
  });
});

describe('feedUrl', () => {
  afterEach(() => setBase(undefined));

  it('is null with no CDN, so the Connect tab skips the fetch', () => {
    expect(feedUrl()).toBeNull();
  });

  it('resolves to feed.json at the CDN root', () => {
    setBase(BASE);
    expect(feedUrl()).toBe(`${BASE}/feed.json`);
  });
});

describe('resolveAudioUrl', () => {
  const audioPath = '/guides/kwp-history/en.m4a';
  const localPath = 'file:///data/guides/kwp-history.m4a';

  afterEach(() => setBase(undefined));

  it('prefers a downloaded file over the stream', () => {
    setBase(BASE);
    expect(resolveAudioUrl(audioPath, localPath)).toBe(localPath);
  });

  it('streams from the CDN when there is no download', () => {
    setBase(BASE);
    expect(resolveAudioUrl(audioPath, null)).toBe(`${BASE}${audioPath}`);
  });

  it('still resolves the download when no CDN is configured', () => {
    expect(resolveAudioUrl(audioPath, localPath)).toBe(localPath);
  });

  it('is null with neither a download nor a CDN', () => {
    expect(resolveAudioUrl(audioPath)).toBeNull();
  });
});
