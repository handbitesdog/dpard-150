import { Platform } from 'react-native';

/**
 * Avenir Next on iOS (preinstalled system font); Nunito Sans on Android,
 * loaded via `@expo-google-fonts/nunito-sans` since Avenir Next isn't
 * available there and isn't ours to redistribute.
 */
export const fontFamily = {
  regular: Platform.select({ ios: 'AvenirNext-Regular', default: 'NunitoSans_400Regular' }),
  semibold: Platform.select({ ios: 'AvenirNext-DemiBold', default: 'NunitoSans_600SemiBold' }),
  bold: Platform.select({ ios: 'AvenirNext-Bold', default: 'NunitoSans_700Bold' }),
} as const;

// Line heights derived at a ~1.3-1.4x ratio of their size, rounded to the nearest pixel.
export const fontSize = {
  xs: { size: 12, lineHeight: 16 },
  sm: { size: 14, lineHeight: 19 },
  base: { size: 16, lineHeight: 22 },
  lg: { size: 18, lineHeight: 24 },
  xl: { size: 20, lineHeight: 27 },
  xxl: { size: 32, lineHeight: 43 },
} as const;
