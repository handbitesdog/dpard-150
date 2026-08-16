import { BottomTabBar, Tabs } from 'expo-router/js-tabs';
import type { ComponentType } from 'react';
import type { SvgProps } from 'react-native-svg';
import { Icon } from '@/components/Icon';
import CompassIcon from '@/components/icons/compass-icon.svg';
import FlagIcon from '@/components/icons/flag-icon.svg';
import FlowerIcon from '@/components/icons/flower-icon.svg';
import PinIcon from '@/components/icons/pin-icon.svg';
import SoundIcon from '@/components/icons/sound-icon.svg';
import { MiniPlayerSlot } from '@/components/MiniPlayerSlot';
import { navyMuted, palette } from '@/design/colors';
import { spacing } from '@/design/spacing';
import { typography } from '@/design/typography';

/** Builds a tab bar icon renderer for the given SVG icon. */
function tabIcon(SvgIcon: ComponentType<SvgProps>) {
  return function TabBarIcon({ size }: { size: number }) {
    return <Icon icon={SvgIcon} size={size} />;
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
        tabBarLabelStyle: {
          fontSize: typography.footnote.size,
          lineHeight: typography.footnote.lineHeight,
          marginTop: spacing.xs,
        },
      }}
      tabBar={(props) => (
        <>
          <MiniPlayerSlot />
          <BottomTabBar {...props} />
        </>
      )}
    >
      <Tabs.Screen name="discover" options={{ title: 'Discover', tabBarIcon: tabIcon(PinIcon) }} />
      <Tabs.Screen name="listen" options={{ title: 'Listen', tabBarIcon: tabIcon(SoundIcon) }} />
      <Tabs.Screen
        name="explore"
        options={{ title: 'Explore', tabBarIcon: tabIcon(CompassIcon) }}
      />
      <Tabs.Screen name="passport" options={{ title: 'Passport', tabBarIcon: tabIcon(FlagIcon) }} />
      <Tabs.Screen name="connect" options={{ title: 'Connect', tabBarIcon: tabIcon(FlowerIcon) }} />
    </Tabs>
  );
}
