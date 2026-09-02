/**
 * Resolves CDN-hosted content: catalog photography, stamp art, guide audio,
 * and the Connect feed.
 *
 * No host is provisioned yet and the first release may ship without one, so
 * every resolver here returns `null` when `EXPO_PUBLIC_CDN_BASE_URL` is unset
 * or isn't an http(s) origin. `null` means "there is no remote copy of this" —
 * callers fall back to bundled art (`@/data/assets`), the bundled audio fixture
 * (`playbackStore`), or skip the fetch entirely (`useFeed`). Nothing in the app
 * treats a missing CDN as an error state.
 */

/** Where the curated Connect feed lives, relative to the CDN root. */
export const FEED_PATH = '/feed.json';

/**
 * The configured CDN origin with any trailing slash removed, or `null` when
 * unconfigured.
 *
 * Read through `process.env` on every call rather than captured at module load:
 * Metro inlines the literal `process.env.EXPO_PUBLIC_CDN_BASE_URL` expression at
 * build time, so this stays a constant in a release bundle while remaining
 * settable per-test.
 */
export function cdnBaseUrl(): string | null {
  const raw = process.env.EXPO_PUBLIC_CDN_BASE_URL?.trim();
  if (!raw || !/^https?:\/\//.test(raw)) {
    return null;
  }
  return raw.replace(/\/+$/, '');
}

export function isCdnConfigured(): boolean {
  return cdnBaseUrl() !== null;
}

/**
 * Turns a catalog path (`/parks/fair-park/esplanade.jpg`) into an absolute CDN
 * URL, or `null` if no CDN is configured. Paths that are already absolute URLs
 * pass through untouched — the Connect feed is curator-authored and may point
 * at images hosted elsewhere.
 */
export function resolveCdnUrl(path: string | null | undefined): string | null {
  if (!path) {
    return null;
  }
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const base = cdnBaseUrl();
  if (base === null) {
    return null;
  }
  return `${base}/${path.replace(/^\/+/, '')}`;
}

/** Absolute URL of the Connect feed document, or `null` if no CDN is configured. */
export function feedUrl(): string | null {
  return resolveCdnUrl(FEED_PATH);
}

/**
 * Picks the audio source for a guide, preferring a completed download over the
 * stream so offline playback keeps working and a downloaded guide never spends
 * cellular data. Returns `null` when the guide has neither — no download and no
 * CDN — which is the state the app ships in today.
 */
export function resolveAudioUrl(
  audioPath: string,
  localPath?: string | null,
): string | null {
  return localPath ?? resolveCdnUrl(audioPath);
}
