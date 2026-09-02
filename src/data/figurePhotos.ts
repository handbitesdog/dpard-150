import type { ImageSourcePropType } from 'react-native';

/**
 * Bundled portrait for each historic figure, keyed by figure id.
 *
 * These are what `figurePortrait` renders while no CDN base URL is configured;
 * once the catalog resolves against a CDN, each entry stays on as that
 * figure's offline fallback. Figures with no known portrait — Mildred Louise
 * Dunn — are absent here and render as a placeholder.
 */
export const FIGURE_PHOTOS: Record<string, ImageSourcePropType> = {
  'adella-k-turner': require('../../assets/people/adella-k-turner.jpeg'),
  'anderson-bonner': require('../../assets/people/anderson-bonner.jpg'),
  'anita-martinez': require('../../assets/people/anita-martinez.jpeg'),
  'edwin-j-kiest': require('../../assets/people/edwin-j-kiest.jpg'),
  'george-kessler': require('../../assets/people/george-kessler.jpeg'),
  'juanita-j-craft': require('../../assets/people/juanita-j-craft.jpeg'),
  'julien-reverchon': require('../../assets/people/julien-reverchon.png'),
  'w-w-samuell': require('../../assets/people/w-w-samuell.jpg'),
  'william-r-tietze': require('../../assets/people/william-r-tietze.jpg'),
};
