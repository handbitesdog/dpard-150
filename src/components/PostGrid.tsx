import { StyleSheet, useWindowDimensions, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { PostTile } from '@/components/PostTile';
import { spacing } from '@/design/spacing';

const COLUMNS = 3;

export type Post = {
  id: string;
  photo?: ImageSourcePropType;
  permalink: string;
};

type PostGridProps = {
  posts: Post[];
};

/** 3-column grid of curated Instagram posts, sized to fill the screen width within Screen's gutter. */
export function PostGrid({ posts }: PostGridProps) {
  const { width } = useWindowDimensions();
  const tileSize = Math.floor(
    (width - spacing.base * 2 - spacing.xs * (COLUMNS - 1)) / COLUMNS,
  );

  return (
    <View style={styles.grid}>
      {posts.map((post) => (
        <PostTile
          key={post.id}
          photo={post.photo}
          permalink={post.permalink}
          size={tileSize}
          accessibilityLabel="View post on Instagram"
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
});
