import { FEED_SCHEMA_VERSION, migrateFeed, useFeedStore } from '@/stores/feedStore';
import { storage } from '@/stores/storage';
import { corruptPayloads } from '../fixtures/stores';

const testPost = {
  id: 'post-1',
  imageUrl: 'https://example.com/post-1.jpg',
  caption: 'A day at the park',
  permalink: 'https://instagram.com/p/post-1',
  publishedAt: 1700000000000,
};

describe('feedStore', () => {
  beforeEach(() => {
    storage.clearAll();
    useFeedStore.setState({ posts: null, fetchedAt: null });
  });

  it('starts with no cached posts', () => {
    expect(useFeedStore.getState().posts).toBeNull();
    expect(useFeedStore.getState().fetchedAt).toBeNull();
  });

  it('sets posts and stamps the fetch time', () => {
    const before = Date.now();
    useFeedStore.getState().setPosts([testPost]);

    expect(useFeedStore.getState().posts).toEqual([testPost]);
    expect(useFeedStore.getState().fetchedAt).toBeGreaterThanOrEqual(before);
  });

  it('replaces previously cached posts', () => {
    useFeedStore.getState().setPosts([testPost]);
    useFeedStore.getState().setPosts([]);

    expect(useFeedStore.getState().posts).toEqual([]);
  });

  it('persists posts to storage', () => {
    useFeedStore.getState().setPosts([testPost]);

    const raw = storage.getString('feed');
    expect(raw).toBeDefined();
    expect(JSON.parse(raw as string)).toMatchObject({
      version: FEED_SCHEMA_VERSION,
      state: { posts: [testPost] },
    });
  });
});

describe('migrateFeed', () => {
  it('carries a valid payload forward', () => {
    expect(
      migrateFeed({ posts: [testPost], fetchedAt: 1700000000000 }, FEED_SCHEMA_VERSION),
    ).toEqual({
      posts: [testPost],
      fetchedAt: 1700000000000,
    });
  });

  it.each(corruptPayloads)('tolerates a corrupt payload: %p', (payload) => {
    expect(migrateFeed(payload, 0)).toEqual({ posts: null, fetchedAt: null });
  });
});
