import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/Text';
import { palette } from '@/design/colors';
import { opacity } from '@/design/opacity';
import { radii } from '@/design/radii';
import { shadows } from '@/design/shadows';
import { spacing } from '@/design/spacing';
import { typography } from '@/design/typography';

type ToastVariant = 'success' | 'error' | 'info';

const variantIcon: Record<ToastVariant, keyof typeof Ionicons.glyphMap> = {
  success: 'checkmark-circle',
  error: 'alert-circle',
  info: 'information-circle',
};

const DEFAULT_DURATION = 4000;

type ToastProps = {
  message: string;
  variant?: ToastVariant;
  onDismiss?: () => void;
  duration?: number;
};

export function Toast({ message, variant = 'info', onDismiss, duration = DEFAULT_DURATION }: ToastProps) {
  useEffect(() => {
    if (!onDismiss) return;
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLiveRegion="polite"
      accessibilityLabel={message}
      style={styles.container}
    >
      <Ionicons name={variantIcon[variant]} size={typography.headline.size} color={palette.white} />
      <Text variant="body" color="white" style={styles.message}>
        {message}
      </Text>
      {onDismiss && (
        <Pressable
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          hitSlop={spacing.sm}
          style={({ pressed }) => [{ opacity: pressed ? opacity.pressedHeavy : 1 }]}
        >
          <Ionicons name="close" size={typography.body.size} color={palette.white} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: palette.navy,
    borderRadius: radii.md,
    padding: spacing.base,
    ...shadows.elevated,
  },
  message: {
    flex: 1,
  },
});
