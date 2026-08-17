import type { ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';
import type { SvgProps } from 'react-native-svg';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { navyMuted } from '@/design/colors';
import { spacing } from '@/design/spacing';

const ICON_SIZE = 48;

type EmptyStateProps = {
  icon: ComponentType<SvgProps>;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  accessibilityLabel?: string;
};

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  accessibilityLabel,
}: EmptyStateProps) {
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? `${title}. ${message}`}
      style={styles.container}
    >
      <Icon icon={icon} size={ICON_SIZE} />
      <Text variant="title2" style={styles.title}>
        {title}
      </Text>
      <Text variant="body" style={styles.message}>
        {message}
      </Text>
      {actionLabel && onAction && (
        <View style={styles.action}>
          <Button label={actionLabel} onPress={onAction} fullWidth={false} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    paddingHorizontal: spacing.xl,
  },
  title: {
    marginTop: spacing.base,
    textAlign: 'center',
  },
  message: {
    marginTop: spacing.xs,
    textAlign: 'center',
    color: navyMuted,
  },
  action: {
    marginTop: spacing.xl,
  },
});
