import { useCallback, useEffect, useState } from 'react';
import { feedUrl } from '@/lib/cdn';
import { fetchFeed, type FeedResult } from '@/services/feedService';
import { useFeedStore, type FeedPost } from '@/stores/feedStore';

export type FeedState =
  /** No CDN is configured, so there is no feed to fetch. Render the tab without one. */
  | { status: 'unconfigured' }
  | { status: 'loading' }
  | { status: 'ready'; posts: FeedPost[]; fromCache: boolean }
  | { status: 'error' };

/**
 * Loads the curated Connect feed from the CDN.
 *
 * Cached posts render immediately while the refresh runs, so a slow or failing
 * network shows yesterday's feed rather than a spinner. `unconfigured` is not a
 * failure — it is the expected state until a host exists, and the screen treats
 * it as "no feed yet" rather than an error.
 */
export function useFeed(): FeedState & { retry: () => void } {
  const url = feedUrl();
  const cachedPosts = useFeedStore((state) => state.posts);
  const setPosts = useFeedStore((state) => state.setPosts);
  const [result, setResult] = useState<FeedResult | null>(null);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setResult(null);
    setAttempt((previous) => previous + 1);
  }, []);

  useEffect(() => {
    if (url === null) return;

    let active = true;
    void fetchFeed(url, {
      getCachedPosts: () => useFeedStore.getState().posts,
      setPosts,
    }).then((fetched) => {
      if (active) setResult(fetched);
    });

    return () => {
      active = false;
    };
  }, [url, setPosts, attempt]);

  if (url === null) {
    return { status: 'unconfigured', retry };
  }

  if (result === null) {
    return cachedPosts
      ? { status: 'ready', posts: cachedPosts, fromCache: true, retry }
      : { status: 'loading', retry };
  }

  if (result.status === 'error') {
    return { status: 'error', retry };
  }

  return {
    status: 'ready',
    posts: result.posts,
    fromCache: result.status === 'cached',
    retry,
  };
}
