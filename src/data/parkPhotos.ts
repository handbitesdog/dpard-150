import type { ImageSourcePropType } from 'react-native';

/**
 * Bundled lead photograph for every park in the catalog, keyed by park id.
 *
 * These are what `parkPhoto` renders while `park.photos` is still empty and no
 * CDN base URL is configured; once the catalog carries CDN paths, each entry
 * stays on as that park's offline fallback.
 */
export const PARK_PHOTOS: Record<string, ImageSourcePropType> = {
  'bachman-lake-park': require('../../assets/parks/bachman-lake-park.jpeg'),
  'campbell-green-park': require('../../assets/parks/campbell-green-park.jpeg'),
  'cedar-crest-golf-course': require('../../assets/parks/cedar-crest-golf-course.jpg'),
  'city-park': require('../../assets/parks/city-park.jpeg'),
  'crawford-park': require('../../assets/parks/crawford-park.jpeg'),
  'dallas-zoo': require('../../assets/parks/dallas-zoo.jpg'),
  'eloise-lundy-park': require('../../assets/parks/eloise-lundy-park.jpeg'),
  'fair-park': require('../../assets/parks/fair-park.webp'),
  'freedmans-cemetery': require('../../assets/parks/freedmans-cemetery.jpg'),
  'fretz-park': require('../../assets/parks/fretz-park.jpeg'),
  'hamilton-park': require('../../assets/parks/hamilton-park.jpeg'),
  'hattie-r-moore-park': require('../../assets/parks/hattie-r-moore-park.jpeg'),
  'juanita-j-craft-park': require('../../assets/parks/juanita-j-craft-park.jpeg'),
  'kleberg-park': require('../../assets/parks/kleberg-park.jpeg'),
  'klyde-warren-park': require('../../assets/parks/klyde-warren-park.webp'),
  'lake-cliff-park': require('../../assets/parks/lake-cliff-park.jpg'),
  'marcus-park': require('../../assets/parks/marcus-park.jpeg'),
  'miller-family-park': require('../../assets/parks/miller-family-park.jpeg'),
  'pike-park': require('../../assets/parks/pike-park.jpg'),
  'reverchon-park': require('../../assets/parks/reverchon-park.jpeg'),
  'samuell-grand-park': require('../../assets/parks/samuell-grand-park.jpeg'),
  'singing-hills-park': require('../../assets/parks/singing-hills-park.webp'),
  'thurgood-marshall-park': require('../../assets/parks/thurgood-marshall-park.jpeg'),
  'tietze-park': require('../../assets/parks/tietze-park.jpeg'),
  'white-rock-lake-park': require('../../assets/parks/white-rock-lake-park.jpeg'),
};
