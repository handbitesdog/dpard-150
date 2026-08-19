import { Image, StyleSheet, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { Text } from '@/components/Text';
import { borderWidths } from '@/design/borderWidths';
import { navyMuted, palette } from '@/design/colors';
import { spacing } from '@/design/spacing';

const STAMP_SIZE = 180;
const PEEK_SIZE = 160;

type StampAddedCardProps = {
  name: string;
  image: ImageSourcePropType;
};

/** Full-bleed celebration card shown when a stamp is added to the user's passport. */
export function StampAddedCard({ name, image }: StampAddedCardProps) {
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${name} added to passport`}
      style={styles.container}
    >
      <View style={styles.stampArea}>
        <View style={[styles.peek, styles.peekLeft]} />
        <Image source={image} style={styles.stamp} resizeMode="contain" />
        <View style={[styles.peek, styles.peekRight]} />
      </View>
      <Text variant="title2" style={styles.title}>
        {name}
      </Text>
      <Text variant="subhead" style={styles.subtitle}>
        added to passport
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
  },
  stampArea: {
    alignSelf: 'stretch',
    marginHorizontal: -spacing.base,
    height: STAMP_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  peek: {
    position: 'absolute',
    top: (STAMP_SIZE - PEEK_SIZE) / 2,
    width: PEEK_SIZE,
    height: PEEK_SIZE,
    borderRadius: PEEK_SIZE / 2,
    backgroundColor: palette.grey,
    borderWidth: borderWidths.strong,
    borderStyle: 'dashed',
    borderColor: palette.navy,
  },
  peekLeft: {
    left: -PEEK_SIZE / 2,
  },
  peekRight: {
    right: -PEEK_SIZE / 2,
  },
  stamp: {
    width: STAMP_SIZE,
    height: STAMP_SIZE,
  },
  title: {
    marginTop: spacing.xl,
  },
  subtitle: {
    marginTop: spacing.xs,
    color: navyMuted,
  },
});
