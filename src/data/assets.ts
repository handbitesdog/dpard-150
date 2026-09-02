import type { ImageSourcePropType, ImageURISource } from 'react-native';
import { resolveCdnUrl } from '@/lib/cdn';
import { parks } from './index';
import { FIGURE_PHOTOS } from './figurePhotos';
import { MERCH_PHOTOS } from './merchPhotos';
import { PARK_PHOTOS } from './parkPhotos';
import type { HistoricFigure, MerchItem, Park } from './schemas';
import { STAMP_PHOTO_PLACEHOLDER } from './stampPhotos';

/**
 * A catalog image resolved for display: either the bundled placeholder on its
 * own (no CDN configured) or the CDN URI carrying that placeholder as
 * `fallback`, which `RemoteImage` swaps in if the remote load fails.
 *
 * Both forms are valid `ImageSourcePropType` values, so a plain `<Image>` still
 * renders one correctly — it just loses the fallback.
 */
export type ImageAsset =
  ImageSourcePropType | (ImageURISource & { fallback?: ImageSourcePropType });

/**
 * Pairs a CDN-relative catalog path with the bundled art standing in for it.
 * Returns the bundled art alone when there's no CDN to resolve against.
 */
function remoteImage<T extends ImageSourcePropType | undefined>(
  path: string | undefined,
  fallback: T,
): ImageAsset | T {
  const uri = resolveCdnUrl(path);
  return uri === null ? fallback : { uri, fallback };
}

/** Lead photograph for a park — the first entry in its catalog `photos` array. */
export function parkPhoto(park: Park): ImageAsset | undefined {
  return remoteImage(park.photos[0]?.source, PARK_PHOTOS[park.id]);
}

/** Same as `parkPhoto` for callers that only hold a park id, such as a guide's cover art. */
export function parkPhotoById(parkId: string): ImageAsset | undefined {
  const park = parks.find((candidate) => candidate.id === parkId);
  return park ? parkPhoto(park) : undefined;
}

/** Portrait for a historic figure, or `undefined` when no photograph is known. */
export function figurePortrait(figure: HistoricFigure): ImageAsset | undefined {
  return remoteImage(figure.portrait?.source, FIGURE_PHOTOS[figure.id]);
}

/**
 * A park's stamp artwork. Every park falls back to the same placeholder seal,
 * since Fair Park's is the only stamp drawn so far.
 */
export function stampImage(park: Park): ImageAsset {
  return remoteImage(park.stamp.image, STAMP_PHOTO_PLACEHOLDER);
}

/** Product photograph for a Shop carousel item. */
export function merchPhoto(item: MerchItem): ImageAsset | undefined {
  return remoteImage(item.photo.source, MERCH_PHOTOS[item.id]);
}

/**
 * Image for a Connect feed post. Feed posts are curator-authored and may carry
 * absolute URLs, so this resolves without a CDN base as long as the URL is
 * absolute. There's no bundled stand-in for post imagery — a post that won't
 * load renders as an empty tile.
 */
export function feedPhoto(imageUrl: string): ImageAsset | undefined {
  return remoteImage(imageUrl, undefined);
}
