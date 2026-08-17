import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';
import { palette } from '@/design/colors';
import { sizes } from '@/design/sizes';
import { spacing } from '@/design/spacing';
import { fontFamily, typography } from '@/design/typography';

type IconName = keyof typeof Ionicons.glyphMap;

type LinkRowProps = {
  icon: IconName;
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
};

export function LinkRow({ icon, label, onPress, accessibilityLabel }: LinkRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [styles.row, { opacity: pressed ? 0.6 : 1 }]}
    >
      <Ionicons
        name={icon}
        size={typography.headline.size}
        color={palette.navy}
        style={styles.icon}
      />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: sizes.touchTarget,
  },
  icon: {
    width: typography.headline.size,
    marginRight: spacing.base,
  },
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: typography.headline.size,
    lineHeight: typography.headline.lineHeight,
    color: palette.navy,
  },
});
