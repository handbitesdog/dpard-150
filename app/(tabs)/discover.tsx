import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Button } from '@/components/Button';
import { Carousel } from '@/components/Carousel';
import { FigureCard, FIGURE_CARD_WIDTH } from '@/components/FigureCard';
import { LogoBlock } from '@/components/LogoBlock';
import { MiniPlayer } from '@/components/MiniPlayer';
import { ParkCard, PARK_CARD_WIDTH } from '@/components/ParkCard';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { ShopItem, SHOP_ITEM_WIDTH } from '@/components/ShopItem';
import { Text } from '@/components/Text';
import { figures, guides, merch, parks } from '@/data';
import { figurePortrait, merchPhoto, parkPhoto, parkPhotoById } from '@/data/assets';
import { spacing } from '@/design/spacing';
import { formatDuration } from '@/lib/formatDuration';

const AUDIO_TOUR_PREVIEW_COUNT = 5;
const SHOP_URL = 'https://dallasparks.org/store';

export default function DiscoverScreen() {
  const router = useRouter();

  const audioTours = [...guides]
    .sort((a, b) => a.title.localeCompare(b.title))
    .slice(0, AUDIO_TOUR_PREVIEW_COUNT);

  return (
    <Screen scroll testID="screen-discover">
      <LogoBlock variant="anniversary-compact" leftLogo="dark" />

      <Text variant="title1" accessibilityRole="header" style={styles.title}>
        Discover
      </Text>

      <Section title="Historic Parks">
        <Carousel
          data={parks}
          keyExtractor={(park) => park.id}
          itemWidth={PARK_CARD_WIDTH}
          renderItem={(park) => (
            <ParkCard
              name={park.name}
              neighborhood={park.neighborhood}
              photo={parkPhoto(park)}
              onPress={() => router.push(`/park/${park.id}`)}
            />
          )}
        />
      </Section>

      <Section title="Historic Figures">
        <Carousel
          data={figures}
          keyExtractor={(figure) => figure.id}
          itemWidth={FIGURE_CARD_WIDTH}
          renderItem={(figure) => (
            <FigureCard
              name={figure.name}
              era={figure.lifespan ?? ''}
              portrait={figurePortrait(figure)}
              onPress={() => router.push(`/figure/${figure.id}`)}
            />
          )}
        />
      </Section>

      <Section title="Audio Tours">
        {audioTours.map((guide) => (
          <MiniPlayer
            key={guide.id}
            variant="row"
            title={guide.title}
            coverImage={parkPhotoById(guide.parkId)}
            elapsedLabel={formatDuration(guide.durationSeconds)}
            progress={0}
            isPlaying={false}
            isDownloaded={false}
            isDownloading={false}
            onPress={() => {}}
          />
        ))}
        <Button label="See more" onPress={() => router.push('/listen')} />
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

      <LogoBlock leftLogo="inline" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: spacing.sm,
    marginBottom: spacing.base,
  },
});
