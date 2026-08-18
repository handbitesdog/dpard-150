import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Carousel } from '@/components/Carousel';
import { FigureCard, FIGURE_CARD_WIDTH } from '@/components/FigureCard';
import { LogoBlock } from '@/components/LogoBlock';
import { MiniPlayer } from '@/components/MiniPlayer';
import { ParkCard, PARK_CARD_WIDTH } from '@/components/ParkCard';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { Text } from '@/components/Text';
import { figures, guides, parks } from '@/data';
import { PARK_PHOTOS } from '@/data/parkPhotos';
import { spacing } from '@/design/spacing';
import { formatDuration } from '@/lib/formatDuration';

const AUDIO_TOUR_PREVIEW_COUNT = 5;

export default function DiscoverScreen() {
  const router = useRouter();

  const audioTours = [...guides]
    .sort((a, b) => a.title.localeCompare(b.title))
    .slice(0, AUDIO_TOUR_PREVIEW_COUNT);

  return (
    <Screen scroll>
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
              photo={PARK_PHOTOS[park.id]}
              onPress={() => {}}
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
            <FigureCard name={figure.name} era={figure.lifespan ?? ''} onPress={() => {}} />
          )}
        />
      </Section>

      <Section title="Audio Tours">
        {audioTours.map((guide) => (
          <MiniPlayer
            key={guide.id}
            variant="row"
            title={guide.title}
            coverImage={PARK_PHOTOS[guide.parkId]}
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

      <LogoBlock leftLogo="inline" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});
