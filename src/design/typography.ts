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

// Semantic type scale (IMPLEMENTATION.md Appendix C). The `Text` component
// is the only thing that should read this — everything else takes a variant.
export const typography = {
  display: { size: 34, lineHeight: 40, weight: 'bold' },
  title1: { size: 28, lineHeight: 34, weight: 'bold' },
  title2: { size: 22, lineHeight: 28, weight: 'semibold' },
  headline: { size: 17, lineHeight: 22, weight: 'semibold' },
  body: { size: 17, lineHeight: 24, weight: 'regular' },
  subhead: { size: 15, lineHeight: 20, weight: 'regular' },
  footnote: { size: 13, lineHeight: 18, weight: 'regular' },
  caption: { size: 12, lineHeight: 16, weight: 'regular' },
} as const;

export type TypographyVariant = keyof typeof typography;
