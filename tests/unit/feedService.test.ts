import type { FeedPost } from '@/stores/feedStore';
import { fetchFeed, type FeedServiceDeps } from '@/services/feedService';

const FEED_URL = 'https://example.com/feed.json';

const testPost: FeedPost = {
  id: 'post-1',
  imageUrl: 'https://example.com/post-1.jpg',
  caption: 'A day at the park',
  permalink: 'https://instagram.com/p/post-1',
  publishedAt: 1700000000000,
};

const cachedPost: FeedPost = { ...testPost, id: 'cached-post' };

function makeDeps(overrides: Partial<FeedServiceDeps> = {}): FeedServiceDeps {
  return {
    getCachedPosts: jest.fn().mockReturnValue(null),
    setPosts: jest.fn(),
    ...overrides,
  };
}

function mockFetch(implementation: jest.Mock) {
  global.fetch = implementation as unknown as typeof fetch;
}

describe('fetchFeed', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns and caches the parsed posts on success', async () => {
    mockFetch(jest.fn().mockResolvedValue({ ok: true, json: async () => [testPost] }));
    const deps = makeDeps();

    const result = await fetchFeed(FEED_URL, deps);

    expect(result).toEqual({ status: 'success', posts: [testPost] });
    expect(deps.setPosts).toHaveBeenCalledWith([testPost]);
  });

  it('skips invalid posts while keeping valid ones', async () => {
    mockFetch(
      jest.fn().mockResolvedValue({
        ok: true,
        json: async () => [testPost, { id: 'missing-fields' }],
      }),
    );
    const deps = makeDeps();

    const result = await fetchFeed(FEED_URL, deps);

    expect(result).toEqual({ status: 'success', posts: [testPost] });
  });

  it('falls back to the cache on a network error', async () => {
    mockFetch(jest.fn().mockRejectedValue(new Error('network down')));
    const deps = makeDeps({ getCachedPosts: jest.fn().mockReturnValue([cachedPost]) });

    const result = await fetchFeed(FEED_URL, deps);

    expect(result).toEqual({ status: 'cached', posts: [cachedPost] });
  });

  it('reports an error on a network failure with no cache', async () => {
    mockFetch(jest.fn().mockRejectedValue(new Error('network down')));
    const deps = makeDeps();

    const result = await fetchFeed(FEED_URL, deps);

    expect(result).toEqual({ status: 'error' });
  });

  it('falls back to the cache on a non-2xx response', async () => {
    mockFetch(jest.fn().mockResolvedValue({ ok: false, json: async () => [] }));
    const deps = makeDeps({ getCachedPosts: jest.fn().mockReturnValue([cachedPost]) });

    const result = await fetchFeed(FEED_URL, deps);

    expect(result).toEqual({ status: 'cached', posts: [cachedPost] });
  });

  it('falls back to the cache on malformed JSON', async () => {
    mockFetch(
      jest.fn().mockResolvedValue({
        ok: true,
        json: async () => {
          throw new SyntaxError('unexpected token');
        },
      }),
    );
    const deps = makeDeps({ getCachedPosts: jest.fn().mockReturnValue([cachedPost]) });

    const result = await fetchFeed(FEED_URL, deps);

    expect(result).toEqual({ status: 'cached', posts: [cachedPost] });
  });
});
