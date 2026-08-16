import { Image, StyleSheet, View } from 'react-native';
import { palette } from '@/design/colors';
import { spacing } from '@/design/spacing';

const LOGO_HEIGHT = 48;
const ANNIVERSARY_ASPECT_RATIO = 70 / 62;
const WORDMARK_ASPECT_RATIO = 190 / 42;

type LogoBlockProps = {
  variant?: 'both' | 'anniversary';
};

export function LogoBlock({ variant = 'both' }: LogoBlockProps) {
  const label =
    variant === 'both'
      ? 'Dallas Park and Recreation 150th anniversary logo, Dallas Park and Recreation logo'
      : 'Dallas Park and Recreation 150th anniversary logo';

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={label}
      style={styles.container}
    >
      <Image
        source={require('../../assets/DPARD-150-logo.png')}
        style={[styles.logo, { aspectRatio: ANNIVERSARY_ASPECT_RATIO }]}
        resizeMode="contain"
      />
      {variant === 'both' && (
        <Image
          source={require('../../assets/DPARD-logo.png')}
          style={[styles.logo, { aspectRatio: WORDMARK_ASPECT_RATIO }]}
          resizeMode="contain"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    backgroundColor: palette.beige,
  },
  logo: {
    height: LOGO_HEIGHT,
  },
});
