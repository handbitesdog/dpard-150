import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { SectionHeader } from '@/components/SectionHeader';
import { spacing } from '@/design/spacing';

type SectionProps = PropsWithChildren<{
  title: string;
  onSeeAllPress?: () => void;
  seeAllLabel?: string;
}>;

/** Groups related content under a header (Appendix B: section gap = `2xl`). */
export function Section({ title, onSeeAllPress, seeAllLabel, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <SectionHeader title={title} onSeeAllPress={onSeeAllPress} seeAllLabel={seeAllLabel} />
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing['2xl'],
  },
  body: {
    marginTop: spacing.md,
    gap: spacing.base,
  },
});
