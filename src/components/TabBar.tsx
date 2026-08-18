import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { navyMuted, palette } from '@/design/colors';
import { spacing } from '@/design/spacing';
import { fontFamily, typography } from '@/design/typography';

const ICON_SIZE = 25;

export function TabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  return (
    <View style={[styles.container, { paddingBottom: spacing['2xl'] + insets.bottom }]}>
      {state.routes.map((route, index) => {
        const descriptor = descriptors[route.key];
        if (!descriptor) return null;
        const { options } = descriptor;
        const focused = index === state.index;
        const color = focused ? palette.navy : navyMuted;
        const label = typeof options.title === 'string' ? options.title : route.name;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.tab}
            role="tab"
            aria-selected={focused}
            accessibilityLabel={typeof label === 'string' ? label : undefined}
          >
            {options.tabBarIcon?.({ focused, color, size: ICON_SIZE })}
            <Text style={[styles.label, { color }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: palette.beige,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.grey,
    paddingTop: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: spacing.xs,
  },
  label: {
    fontFamily: fontFamily.regular,
    fontSize: typography.footnote.size,
    lineHeight: typography.footnote.lineHeight,
    marginTop: spacing.xs,
  },
});
