import type { ImageSourcePropType } from 'react-native';

/**
 * The catalog's `figure.portrait.source` values are CDN-relative paths with
 * no resolver yet — same gap as `PARK_PHOTOS` for park photography. These
 * stand in until that lands.
 */
export const FIGURE_PHOTOS: Record<string, ImageSourcePropType> = {
  'george-kessler': require('../../assets/city-1.jpg'),
  'robert-cullum': require('../../assets/park-4.jpg'),
};
