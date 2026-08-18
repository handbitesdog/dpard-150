import { StyleSheet } from 'react-native';
import { Carousel } from '@/components/Carousel';
import { FigureCard, FIGURE_CARD_WIDTH } from '@/components/FigureCard';
import { LogoBlock } from '@/components/LogoBlock';
import { ParkCard, PARK_CARD_WIDTH } from '@/components/ParkCard';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { Text } from '@/components/Text';
import { figures, parks } from '@/data';
import { PARK_PHOTOS } from '@/data/parkPhotos';
import { spacing } from '@/design/spacing';

export default function DiscoverScreen() {
  return (
    <Screen scroll>
      <LogoBlock variant="anniversary" leftLogo="dark" />

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
