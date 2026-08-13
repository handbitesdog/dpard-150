import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/Text';

type SectionHeaderProps = {
  title: string;
  onSeeAllPress?: () => void;
  seeAllLabel?: string;
  accessibilityLabel?: string;
};

export function SectionHeader({
  title,
  onSeeAllPress,
  seeAllLabel = 'See all',
  accessibilityLabel,
}: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text variant="title2" accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      {onSeeAllPress && (
        <Pressable
          onPress={onSeeAllPress}
          accessibilityRole="link"
          accessibilityLabel={accessibilityLabel ?? `${seeAllLabel} ${title}`}
          hitSlop={12}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Text variant="subhead">{seeAllLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flexShrink: 1,
  },
});
