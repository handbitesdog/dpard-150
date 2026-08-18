import type { ImageSourcePropType } from 'react-native';

/**
 * The merch catalog has no product photography yet — these stand in until
 * real product images land, same placeholder approach as `PARK_PHOTOS`.
 */
export const MERCH_PHOTOS: Record<string, ImageSourcePropType> = {
  'park150-tee': require('../../assets/park-1.jpg'),
  'park150-cap': require('../../assets/park-2.jpg'),
  'park150-tote': require('../../assets/park-3.jpg'),
  'park150-water-bottle': require('../../assets/park-4.jpg'),
  'park150-enamel-pin': require('../../assets/city-1.jpg'),
};
