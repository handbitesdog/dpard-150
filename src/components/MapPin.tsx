import { StyleSheet, View } from 'react-native';
import PinIconSvg from '@/components/icons/pin-icon.svg';
import { palette } from '@/design/colors';
import { radii } from '@/design/radii';
import { shadows } from '@/design/shadows';
import { sizes } from '@/design/sizes';

const PIN_WIDTH = 17;
const PIN_HEIGHT = 24;

type MapPinProps = {
  selected?: boolean;
  accessibilityLabel?: string;
};

/** Presentational marker — the caller renders this as a react-native-maps `Marker` child. */
export function MapPin({ selected = false, accessibilityLabel }: MapPinProps) {
  return (
    <View
      accessible={!!accessibilityLabel}
      accessibilityRole={accessibilityLabel ? 'image' : undefined}
      accessibilityLabel={accessibilityLabel}
      style={[styles.container, selected && styles.containerSelected]}
    >
      <PinIconSvg width={PIN_WIDTH} height={PIN_HEIGHT} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: sizes.touchTarget,
    height: sizes.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerSelected: {
    backgroundColor: palette.white,
    borderRadius: radii.lg,
    ...shadows.elevated,
  },
});
