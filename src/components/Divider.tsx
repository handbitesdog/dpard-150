import { StyleSheet, View } from 'react-native';
import { palette } from '@/design/colors';

export function Divider() {
  return (
    <View
      style={styles.divider}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: palette.grey,
  },
});
