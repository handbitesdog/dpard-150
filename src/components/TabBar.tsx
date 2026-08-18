import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Defs, LinearGradient, Rect, Stop, Svg } from 'react-native-svg';
import { navyMuted, palette } from '@/design/colors';
import { spacing } from '@/design/spacing';
import { fontFamily, typography } from '@/design/typography';

const ICON_SIZE = 25;
const SHADOW_HEIGHT = 5;

export function TabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  return (
    <View style={[styles.container, { paddingBottom: spacing.sm + insets.bottom }]}>
      {/* Android clips a native elevation shadow at this edge (react-native-screens
          renders each tab's content in a Fragment that clips sibling overdraw), so the
          shadow is faked with a gradient instead of shadow/elevation style props. */}
      <Svg style={styles.shadow}>
        <Defs>
          <LinearGradient id="tabBarShadow" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#000" stopOpacity={0} />
            <Stop offset="1" stopColor="#000" stopOpacity={0.05} />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width="100%" height="100%" fill="url(#tabBarShadow)" />
      </Svg>
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
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  shadow: {
    position: 'absolute',
    top: -SHADOW_HEIGHT,
    left: 0,
    right: 0,
    height: SHADOW_HEIGHT,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: spacing.xs,
  },
  label: {
    fontFamily: fontFamily.bold,
    fontSize: typography.footnote.size,
    lineHeight: typography.footnote.lineHeight,
    marginTop: spacing.sm,
  },
});
