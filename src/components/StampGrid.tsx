import type { ReactElement } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { spacing } from '@/design/spacing';

const COLUMNS = 2;

type StampGridProps<T> = {
  data: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T, size: number) => ReactElement;
};

/** Lays out stamps two per row, sized to fill the screen width. */
export function StampGrid<T>({ data, keyExtractor, renderItem }: StampGridProps<T>) {
  const { width } = useWindowDimensions();
  const itemSize = (width - spacing.base * 2 - spacing.base * (COLUMNS - 1)) / COLUMNS;

  return (
    <View style={styles.grid}>
      {data.map((item) => (
        <View key={keyExtractor(item)}>{renderItem(item, itemSize)}</View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.base,
  },
});
