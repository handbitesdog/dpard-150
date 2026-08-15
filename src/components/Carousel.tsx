import { FlatList, View } from 'react-native';
import type { ReactElement } from 'react';
import { spacing } from '@/design/spacing';

type CarouselProps<T> = {
  data: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => ReactElement;
  itemWidth: number;
};

/** Horizontal, snap-scrolling row of cards. */
export function Carousel<T>({ data, keyExtractor, renderItem, itemWidth }: CarouselProps<T>) {
  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={keyExtractor}
      renderItem={({ item }) => renderItem(item)}
      showsHorizontalScrollIndicator={false}
      snapToInterval={itemWidth + spacing.base}
      decelerationRate="fast"
      ItemSeparatorComponent={() => <View style={{ width: spacing.base }} />}
    />
  );
}
