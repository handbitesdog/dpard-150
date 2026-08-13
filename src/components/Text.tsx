import { Text as RNText } from 'react-native';
import type { TextProps as RNTextProps } from 'react-native';
import { palette } from '@/design/colors';
import { fontFamily, typography } from '@/design/typography';
import type { TypographyVariant } from '@/design/typography';

// Appendix A: navy is the only foreground that reliably passes WCAG across
// the palette, and white only passes on navy. Text stays within that set.
type TextColor = 'navy' | 'white';

type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  color?: TextColor;
};

export function Text({ variant = 'body', color = 'navy', style, ...rest }: TextProps) {
  const { size, lineHeight, weight } = typography[variant];

  return (
    <RNText
      style={[
        { fontFamily: fontFamily[weight], fontSize: size, lineHeight, color: palette[color] },
        style,
      ]}
      {...rest}
    />
  );
}
