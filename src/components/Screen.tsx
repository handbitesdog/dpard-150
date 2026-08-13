import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette } from '@/design/colors';
import { spacing } from '@/design/spacing';

/**
 * Horizontal-gutter wrapper for most screen content (Appendix B: screen
 * gutter = `base`). Full-bleed content — hero images, header photos —
 * renders outside `Screen` rather than as a child, so it isn't clipped by
 * the padding.
 */
export function Screen({ children }: PropsWithChildren) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.beige },
  content: { flex: 1, paddingHorizontal: spacing.base },
});
