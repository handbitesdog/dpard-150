import { Ionicons } from '@expo/vector-icons';
import { BottomTabBar, Tabs } from 'expo-router/js-tabs';
import type { ColorValue } from 'react-native';
import { MiniPlayerSlot } from '@/components/MiniPlayerSlot';
import { navyMuted, palette } from '@/design/colors';
import { spacing } from '@/design/spacing';
import { fontSize } from '@/design/typography';

type IconName = keyof typeof Ionicons.glyphMap;

/** Builds a tab bar icon renderer for the given Ionicons glyph. */
function tabIcon(name: IconName) {
  return function TabBarIcon({ color, size }: { color: ColorValue; size: number }) {
    return <Ionicons name={name} color={color} size={size} />;
  };
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.navy,
        tabBarInactiveTintColor: navyMuted,
        tabBarStyle: {
          backgroundColor: palette.beige,
          paddingTop: spacing.md,
          paddingBottom: spacing.lg,
          paddingHorizontal: spacing.sm,
        },
        tabBarLabelStyle: { fontSize: fontSize.sm.size, lineHeight: fontSize.sm.lineHeight },
      }}
      tabBar={(props) => (
        <>
          <MiniPlayerSlot />
          <BottomTabBar {...props} />
        </>
      )}
    >
      <Tabs.Screen
        name="discover"
        options={{ title: 'Discover', tabBarIcon: tabIcon('compass-outline') }}
      />
      <Tabs.Screen
        name="listen"
        options={{ title: 'Listen', tabBarIcon: tabIcon('headset-outline') }}
      />
      <Tabs.Screen
        name="explore"
        options={{ title: 'Explore', tabBarIcon: tabIcon('map-outline') }}
      />
      <Tabs.Screen
        name="passport"
        options={{ title: 'Passport', tabBarIcon: tabIcon('ribbon-outline') }}
      />
      <Tabs.Screen
        name="connect"
        options={{ title: 'Connect', tabBarIcon: tabIcon('chatbubbles-outline') }}
      />
    </Tabs>
  );
}
