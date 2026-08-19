/**
 * Stands in for react-native-maps' native layer under Jest.
 *
 * MapView and Marker are backed by a native module (`RNMapsAirModule`) that
 * doesn't exist without a device/simulator runtime, so importing the real
 * package throws at load time under jest-expo. This mock renders plain Views
 * so screens that embed a map can still be tested.
 */
import { forwardRef } from 'react';
import { View } from 'react-native';
import type { ViewProps } from 'react-native';

export const MapView = forwardRef<View, ViewProps>(function MapView(props, ref) {
  return <View ref={ref} {...props} />;
});

export function Marker(props: ViewProps) {
  return <View {...props} />;
}

export default MapView;
