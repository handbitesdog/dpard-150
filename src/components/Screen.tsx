import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette } from '@/design/colors';
import { spacing } from '@/design/spacing';

type ScreenProps = PropsWithChildren<{
  /** Renders content in a ScrollView instead of a static View. */
  scroll?: boolean;
}>;

/**
 * Horizontal-gutter wrapper for most screen content (Appendix B: screen
 * gutter = `base`). Full-bleed content — hero images, header photos —
 * renders outside `Screen` rather than as a child, so it isn't clipped by
 * the padding.
 *
 * With `scroll`, the gutter is applied via the ScrollView's
 * `contentContainerStyle` rather than a wrapping View — a ScrollView clips
 * to its own frame, so wrapping it in a padded View would clip anything
 * that bleeds into the gutter, like a drop shadow.
 */
export function Screen({ children, scroll }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {scroll ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={styles.content}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.beige },
  content: { flex: 1, paddingHorizontal: spacing.base },
  scroll: { flex: 1 },
});
