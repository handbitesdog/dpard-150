import { useEffect, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { palette } from '@/design/colors';
import { durations } from '@/design/durations';
import { radii } from '@/design/radii';

type SkeletonProps = {
  width: number | `${number}%`;
  height: number;
  radius?: number;
};

/** Pulsing placeholder for content that hasn't loaded yet. */
export function Skeleton({ width, height, radius = radii.xs }: SkeletonProps) {
  const [opacity] = useState(() => new Animated.Value(0.4));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: durations.pulse, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: durations.pulse, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.base, { width, height, borderRadius: radius, opacity }]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: palette.grey,
  },
});
