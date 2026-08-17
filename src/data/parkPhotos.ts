import type { ImageSourcePropType } from 'react-native';

/**
 * The catalog's `park.photos[].source` values are CDN-relative paths with no
 * resolver yet (no CDN base URL, no local asset behind them) — Discover's
 * photo pipeline hasn't been built. These stand in until that lands.
 */
export const PARK_PHOTOS: Record<string, ImageSourcePropType> = {
  'klyde-warren-park': require('../../assets/park-1.jpg'),
  'fair-park': require('../../assets/park-2.jpg'),
  'white-rock-lake-park': require('../../assets/park-3.jpg'),
};
