import type { ComponentType } from 'react';
import * as Linking from 'expo-linking';
import { Pressable, StyleSheet, View } from 'react-native';
import type { SvgProps } from 'react-native-svg';
import { spacing } from '@/design/spacing';

type SocialLink = {
  icon: ComponentType<SvgProps>;
  url: string;
  label: string;
};

type SocialLinksProps = {
  links: SocialLink[];
  size?: number;
};

export function SocialLinks({ links, size = 44 }: SocialLinksProps) {
  return (
    <View style={styles.row}>
      {links.map(({ icon: SvgIcon, url, label }) => (
        <Pressable
          key={label}
          onPress={() => Linking.openURL(url)}
          accessibilityRole="link"
          accessibilityLabel={label}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <SvgIcon width={size} height={size} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
});
