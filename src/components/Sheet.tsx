import type { PropsWithChildren } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { palette } from '@/design/colors';
import { radii } from '@/design/radii';
import { spacing } from '@/design/spacing';

type SheetProps = PropsWithChildren<{
  visible: boolean;
  onDismiss: () => void;
}>;

export function Sheet({ visible, onDismiss, children }: SheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onDismiss}>
      <Pressable
        style={styles.backdrop}
        onPress={onDismiss}
        accessibilityRole="button"
        accessibilityLabel="Dismiss"
      />
      <View style={styles.sheet}>
        <View style={styles.handleIndicator} />
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: palette.beige,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    padding: spacing.base,
    paddingBottom: spacing['2xl'],
  },
  handleIndicator: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: radii.xs,
    backgroundColor: palette.grey,
    marginBottom: spacing.base,
  },
});
