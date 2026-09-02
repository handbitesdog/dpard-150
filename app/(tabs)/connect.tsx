import * as Linking from 'expo-linking';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { Carousel } from '@/components/Carousel';
import { ErrorState } from '@/components/ErrorState';
import FacebookIcon from '@/components/icons/facebook-logo-icon.svg';
import InstagramIcon from '@/components/icons/instagram-logo-icon.svg';
import XIcon from '@/components/icons/x-logo-icon.svg';
import YoutubeIcon from '@/components/icons/youtube-logo-icon.svg';
import { LogoBlock } from '@/components/LogoBlock';
import { PostGrid } from '@/components/PostGrid';
import type { Post } from '@/components/PostGrid';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { ShopItem, SHOP_ITEM_WIDTH } from '@/components/ShopItem';
import { SocialLinks } from '@/components/SocialLinks';
import { Text } from '@/components/Text';
import { VideoCard, VIDEO_CARD_WIDTH } from '@/components/VideoCard';
import { merch } from '@/data';
import { feedPhoto, merchPhoto } from '@/data/assets';
import { spacing } from '@/design/spacing';
import { useFeed } from '@/features/connect/useFeed';

const SHOP_URL = 'https://dallasparks.org/store';
const INSTAGRAM_URL = 'https://www.instagram.com/';

const socialLinks = [
  { icon: FacebookIcon, url: 'https://www.facebook.com/dallasparks', label: 'Facebook' },
  { icon: InstagramIcon, url: 'https://www.instagram.com/dallasparks', label: 'Instagram' },
  { icon: XIcon, url: 'https://www.x.com/dallasparks', label: 'X' },
  { icon: YoutubeIcon, url: 'https://www.youtube.com/dallasparks', label: 'YouTube' },
];

const videos = Array.from({ length: 3 }, (_, i) => ({
  id: `video-${i}`,
  title: 'Community memory',
  permalink: INSTAGRAM_URL,
}));

/**
 * Stands in for the photo grid while the feed loads, and for as long as no CDN
 * is configured to load one from — an empty grid reads as a broken tab, and
 * there is nothing the user could do about a feed that doesn't exist yet.
 */
const placeholderPosts: Post[] = Array.from({ length: 9 }, (_, i) => ({
  id: `placeholder-${i}`,
  permalink: INSTAGRAM_URL,
}));

export default function ConnectScreen() {
  const feed = useFeed();

  const posts: Post[] =
    feed.status === 'ready'
      ? feed.posts.map((post) => ({
          id: post.id,
          photo: feedPhoto(post.imageUrl),
          permalink: post.permalink,
        }))
      : placeholderPosts;

  return (
    <Screen scroll testID="screen-connect">
      <LogoBlock variant="anniversary-compact" leftLogo="dark" />

      <Text variant="title1" accessibilityRole="header" style={styles.title}>
        Community Hub
      </Text>

      <View style={styles.intro}>
        <View style={styles.socialRow}>
          <SocialLinks links={socialLinks} />
        </View>

        <Button label="Submit memories" onPress={() => {}} />

        <Text variant="title2">#MyDallasParksMemories</Text>
      </View>

      <Section title="Videos">
        <Carousel
          data={videos}
          keyExtractor={(video) => video.id}
          itemWidth={VIDEO_CARD_WIDTH}
          renderItem={(video) => <VideoCard title={video.title} permalink={video.permalink} />}
        />
      </Section>

      <Section title="Photos">
        {feed.status === 'error' ? (
          <ErrorState
            icon={InstagramIcon}
            title="Couldn't load photos"
            message="Check your connection and try again."
            actionLabel="Retry"
            onAction={feed.retry}
          />
        ) : (
          <PostGrid posts={posts} />
        )}
      </Section>

      <Section title="Shop">
        <Carousel
          data={merch}
          keyExtractor={(item) => item.id}
          itemWidth={SHOP_ITEM_WIDTH}
          renderItem={(item) => (
            <ShopItem name={item.name} productUrl={item.productUrl} photo={merchPhoto(item)} />
          )}
        />
        <Button label="Shop Park150 Merch" onPress={() => Linking.openURL(SHOP_URL)} />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: spacing.sm,
    marginBottom: spacing.base,
  },
  intro: {
    gap: spacing.base,
    marginBottom: spacing['2xl'],
  },
  socialRow: {
    alignItems: 'center',
  },
});
