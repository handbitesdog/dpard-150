import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from './storage';

/**
 * Current on-disk schema version for this store.
 *
 * Bump this whenever `FeedPost`'s persisted shape changes, and add a
 * corresponding branch to `migrateFeed`. All user state in this app is
 * local-only and unrecoverable, so a missing migration loses real data.
 */
export const FEED_SCHEMA_VERSION = 1;

/**
 * A single Instagram-sourced feed post. Minimal shape for now — Phase 8 owns
 * the real `feed.json` schema and can extend this without a breaking
 * migration as long as it only adds fields.
 */
export type FeedPost = {
  id: string;
  imageUrl: string;
  caption: string;
  permalink: string;
  publishedAt: number;
};

type FeedState = {
  posts: FeedPost[] | null;
  /** Epoch milliseconds of the last successful fetch, or null if never fetched. */
  fetchedAt: number | null;
  /** Replaces the cached posts and stamps the current time as the fetch time. */
  setPosts: (posts: FeedPost[]) => void;
};

/** The persisted slice of `FeedState` — actions are not written to disk. */
type PersistedFeed = Pick<FeedState, 'posts' | 'fetchedAt'>;

/**
 * Migrates a persisted payload forward to `FEED_SCHEMA_VERSION`.
 */
export function migrateFeed(persisted: unknown, _version: number): PersistedFeed {
  const state = (persisted ?? {}) as Partial<PersistedFeed>;

  return {
    posts: Array.isArray(state.posts) ? state.posts : null,
    fetchedAt: typeof state.fetchedAt === 'number' ? state.fetchedAt : null,
  };
}

export const useFeedStore = create<FeedState>()(
  persist(
    (set) => ({
      posts: null,
      fetchedAt: null,
      setPosts: (posts) => set({ posts, fetchedAt: Date.now() }),
    }),
    {
      name: 'feed',
      version: FEED_SCHEMA_VERSION,
      storage: createJSONStorage(() => mmkvStorage),
      migrate: migrateFeed,
      partialize: (state): PersistedFeed => ({
        posts: state.posts,
        fetchedAt: state.fetchedAt,
      }),
    },
  ),
);
