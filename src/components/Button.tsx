import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { palette } from '@/design/colors';
import { radii } from '@/design/radii';
import { sizes } from '@/design/sizes';
import { spacing } from '@/design/spacing';
import { fontFamily, typography } from '@/design/typography';

type IconName = keyof typeof Ionicons.glyphMap;

// Secondary fill colors. White label text on any of these fails WCAG AA
// (measured in IMPLEMENTATION.md Appendix A — navy is the only palette color
// that passes with white text). Ships as designed anyway, per the plan's
// carve-out: left undeclared as a "safe pair" and recorded here as blocked
// on a designer contrast decision, rather than silently omitted.
type SecondaryColor = 'pear' | 'lime' | 'sky' | 'teal' | 'slate';

type ButtonSize = 'default' | 'small';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'icon';
  /** Fill color for the secondary variant. Ignored for primary and icon. */
  color?: SecondaryColor;
  size?: ButtonSize;
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
  fullWidth?: boolean;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  color = 'sky',
  size = 'default',
  icon,
  disabled = false,
  loading = false,
  accessibilityLabel,
  fullWidth = true,
}: ButtonProps) {
  const isIcon = variant === 'icon';
  const backgroundColor =
    variant === 'primary' ? palette.navy : variant === 'icon' ? palette.white : palette[color];
  const iconColor = isIcon ? palette.navy : palette.white;
  const iconSize = size === 'small' ? typography.subhead.size : typography.headline.size;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        isIcon
          ? size === 'small'
            ? styles.iconButtonSmall
            : styles.iconButtonDefault
          : size === 'small'
            ? styles.buttonSmall
            : styles.buttonDefault,
        !isIcon && (fullWidth ? styles.fullWidth : styles.inline),
        { backgroundColor, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
      ]}
    >
      {loading && (
        <ActivityIndicator color={iconColor} size="small" style={!isIcon && styles.icon} />
      )}
      {!loading && icon && (
        <Ionicons name={icon} size={iconSize} color={iconColor} style={!isIcon && styles.icon} />
      )}
      {!isIcon && (
        <Text
          style={[styles.label, size === 'small' ? styles.labelSmall : styles.labelDefault]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  fullWidth: {
    width: '100%',
  },
  inline: {
    alignSelf: 'flex-start',
  },
  buttonDefault: {
    minHeight: sizes.touchTarget,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  buttonSmall: {
    minHeight: sizes.touchTargetSmall,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  iconButtonDefault: {
    width: sizes.touchTarget,
    height: sizes.touchTarget,
    borderRadius: radii.lg,
    alignSelf: 'flex-start',
  },
  iconButtonSmall: {
    width: sizes.touchTargetSmall,
    height: sizes.touchTargetSmall,
    borderRadius: radii.md,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: spacing.sm,
  },
  label: {
    fontFamily: fontFamily.bold,
    color: palette.white,
    textTransform: 'uppercase',
  },
  labelDefault: {
    fontSize: typography.headline.size,
    lineHeight: typography.headline.lineHeight,
  },
  labelSmall: {
    fontSize: typography.subhead.size,
    lineHeight: typography.subhead.lineHeight,
  },
});
