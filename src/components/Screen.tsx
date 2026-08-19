import { useContext } from 'react';
import type { PropsWithChildren } from 'react';
import { BottomTabBarHeightContext } from 'expo-router/js-tabs';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette } from '@/design/colors';
import { spacing } from '@/design/spacing';

type ScreenProps = PropsWithChildren<{
  /** Renders content in a ScrollView instead of a static View. */
  scroll?: boolean;
  /** Excludes the top safe-area inset, for screens whose full-bleed header (e.g. PhotoHeader) already accounts for it. */
  noTopInset?: boolean;
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
export function Screen({ children, scroll, noTopInset }: ScreenProps) {
  // Undefined outside the tab navigator (no Provider) vs. a number inside it.
  // The tab bar renders in normal flow, not as an overlay, so React
  // Navigation already excludes its height from this screen's space — only
  // its own paddingBottom (which includes insets.bottom) must not be
  // reserved a second time here.
  const insideTabNavigator = useContext(BottomTabBarHeightContext) != null;
  const edges = insideTabNavigator
    ? (['top', 'left', 'right'] as const)
    : (['top', 'bottom', 'left', 'right'] as const);
  const safeAreaEdges = noTopInset ? edges.filter((edge) => edge !== 'top') : edges;

  return (
    <SafeAreaView style={styles.safeArea} edges={safeAreaEdges}>
      {scroll ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
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
  scrollContent: { flexGrow: 1, paddingHorizontal: spacing.base },
});
