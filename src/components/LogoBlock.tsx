import { useState } from 'react';
import { Image, LayoutChangeEvent, StyleSheet, View, ViewStyle } from 'react-native';
import { palette } from '@/design/colors';
import { spacing } from '@/design/spacing';

const ANNIVERSARY_LOGOS = {
  default: require('../../assets/DPARD-150-logo.png'),
  dark: require('../../assets/DPARD-150-logo-dark.png'),
  inline: require('../../assets/DPARD-150-logo-inline.png'),
};

const WORDMARK_LOGO = require('../../assets/DPARD-logo.png');

function aspectRatioOf(source: number) {
  const { width, height } = Image.resolveAssetSource(source);
  return width / height;
}

function FitWidthLogo({ source, style }: { source: number; style: ViewStyle }) {
  const [width, setWidth] = useState(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={style} onLayout={handleLayout}>
      {width > 0 && (
        <Image source={source} style={{ width, height: width / aspectRatioOf(source) }} />
      )}
    </View>
  );
}

type LogoBlockProps = {
  variant?: 'both' | 'anniversary' | 'anniversary-compact';
  leftLogo?: keyof typeof ANNIVERSARY_LOGOS;
};

export function LogoBlock({ variant = 'both', leftLogo = 'default' }: LogoBlockProps) {
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
      <FitWidthLogo
        source={ANNIVERSARY_LOGOS[leftLogo]}
        style={variant === 'anniversary-compact' ? styles.leftCompact : styles.left}
      />
      {variant === 'both' && <FitWidthLogo source={WORDMARK_LOGO} style={styles.right} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
    paddingVertical: spacing.xl,
    backgroundColor: palette.beige,
  },
  left: {
    width: '40%',
  },
  leftCompact: {
    width: '30%',
  },
  right: {
    flex: 1,
  },
});
