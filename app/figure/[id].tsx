import { Share, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Carousel } from '@/components/Carousel';
import { Divider } from '@/components/Divider';
import { ParkCard, PARK_CARD_WIDTH } from '@/components/ParkCard';
import { PhotoHeader } from '@/components/PhotoHeader';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { Text } from '@/components/Text';
import { figures, parks } from '@/data';
import { figurePortrait, parkPhoto } from '@/data/assets';
import { spacing } from '@/design/spacing';

export default function FigureDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const figure = figures.find((candidate) => candidate.id === id);

  if (!figure) return null;

  const relatedParks = parks.filter((park) => figure.relatedParkIds.includes(park.id));

  return (
    <Screen scroll noTopInset>
      <View style={styles.fullBleed}>
        <PhotoHeader
          photo={figurePortrait(figure)}
          onBack={() => router.back()}
          onShare={() => Share.share({ message: figure.name })}
        />
      </View>

      <Text variant="title1" accessibilityRole="header" style={styles.title}>
        {figure.name}
      </Text>
      {figure.lifespan && (
        <Text variant="subhead" style={styles.lifespan}>
          {figure.lifespan}
        </Text>
      )}

      <Text variant="body" style={styles.summary}>
        {figure.summary.en}
      </Text>

      <View style={styles.divider}>
        <Divider />
      </View>

      {figure.biography.map((section) => (
        <Section key={section.heading.en} title={section.heading.en}>
          <Text variant="body">{section.body.en}</Text>
        </Section>
      ))}

      {relatedParks.length > 0 && (
        <Section title="Related Parks">
          <Carousel
            data={relatedParks}
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
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  fullBleed: {
    marginHorizontal: -spacing.base,
  },
  title: {
    marginTop: spacing.xl,
  },
  lifespan: {
    marginTop: spacing.xs,
  },
  summary: {
    marginTop: spacing.md,
  },
  divider: {
    marginTop: spacing.xl,
  },
});
