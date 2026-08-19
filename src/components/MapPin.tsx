import { StyleSheet, View } from 'react-native';
import MapPinIconSvg from '@/components/icons/map-pin-icon.svg';
import { sizes } from '@/design/sizes';

const PIN_WIDTH = 38;
const PIN_HEIGHT = 48;

type MapPinProps = {
  accessibilityLabel?: string;
};

/** Presentational marker — the caller renders this as a react-native-maps `Marker` child. */
export function MapPin({ accessibilityLabel }: MapPinProps) {
  return (
    <View
      accessible={!!accessibilityLabel}
      accessibilityRole={accessibilityLabel ? 'image' : undefined}
      accessibilityLabel={accessibilityLabel}
      style={styles.container}
    >
      <MapPinIconSvg width={PIN_WIDTH} height={PIN_HEIGHT} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Math.max(sizes.touchTarget, PIN_WIDTH),
    height: Math.max(sizes.touchTarget, PIN_HEIGHT),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
