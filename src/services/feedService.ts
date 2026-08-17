import { z } from 'zod';
import type { FeedPost } from '@/stores/feedStore';

const feedPostSchema = z.object({
  id: z.string().min(1),
  imageUrl: z.string().min(1),
  caption: z.string().min(1),
  permalink: z.string().min(1),
  publishedAt: z.number(),
});

export type FeedResult =
  { status: 'success' | 'cached'; posts: FeedPost[] } | { status: 'error' };

export type FeedServiceDeps = {
  getCachedPosts: () => FeedPost[] | null;
  setPosts: (posts: FeedPost[]) => void;
};

function fallbackToCache(deps: FeedServiceDeps): FeedResult {
  const cached = deps.getCachedPosts();
  return cached ? { status: 'cached', posts: cached } : { status: 'error' };
}

/**
 * Fetches the Instagram feed, validating each post and skipping (rather than
 * failing on) any that don't match `feedPostSchema`. Falls back to the last
 * cached posts on any failure — network error, non-2xx response, or
 * unparseable JSON — and only reports `error` when there's no cache either.
 */
export async function fetchFeed(url: string, deps: FeedServiceDeps): Promise<FeedResult> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    return fallbackToCache(deps);
  }

  if (!response.ok) {
    return fallbackToCache(deps);
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    return fallbackToCache(deps);
  }

  if (!Array.isArray(json)) {
    return fallbackToCache(deps);
  }

  const posts = json.reduce<FeedPost[]>((valid, entry) => {
    const parsed = feedPostSchema.safeParse(entry);
    if (parsed.success) {
      valid.push(parsed.data);
    }
    return valid;
  }, []);

  deps.setPosts(posts);
  return { status: 'success', posts };
}
