import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, View } from 'react-native';
import { navyMuted, palette } from '@/design/colors';
import { spacing } from '@/design/spacing';
import { fontFamily, typography } from '@/design/typography';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  accessibilityLabel?: string;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search',
  accessibilityLabel,
}: SearchBarProps) {
  return (
    <View testID="search-bar" style={styles.container}>
      <Ionicons name="search" size={typography.headline.size} color={navyMuted} style={styles.icon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={navyMuted}
        returnKeyType="search"
        accessibilityLabel={accessibilityLabel ?? placeholder}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    backgroundColor: palette.white,
    borderRadius: 999,
    paddingHorizontal: spacing.base,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: typography.body.size,
    lineHeight: typography.body.lineHeight,
    color: palette.navy,
  },
});
