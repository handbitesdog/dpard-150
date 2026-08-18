import { Linking, Share, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { LinkRow } from '@/components/LinkRow';
import { PhotoHeader } from '@/components/PhotoHeader';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { Text } from '@/components/Text';
import { parks } from '@/data';
import { PARK_PHOTOS } from '@/data/parkPhotos';
import { spacing } from '@/design/spacing';
import type { Park } from '@/data/schemas';

function mapsUrl(park: Park): string {
  const { latitude, longitude } = park.location;
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
}

export default function ParkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const park = parks.find((candidate) => candidate.id === id);

  if (!park) return null;

  return (
    <Screen scroll>
      <View style={styles.fullBleed}>
        <PhotoHeader
          photo={PARK_PHOTOS[park.id]}
          onBack={() => router.back()}
          onShare={() => Share.share({ message: park.name })}
        />
      </View>

      <Text variant="title1" accessibilityRole="header" style={styles.title}>
        {park.name}
      </Text>
      <Text variant="subhead" style={styles.neighborhood}>
        {park.neighborhood}
      </Text>

      <View style={styles.collectStamp}>
        <Button label="Collect Stamp" onPress={() => {}} variant="secondary" color="pear" />
      </View>

      <View style={styles.divider}>
        <Divider />
      </View>

      <Section title="Overview">
        <Text variant="body">{park.description.en}</Text>

        <LinkRow
          icon="call-outline"
          label={park.phone}
          onPress={() => Linking.openURL(`tel:${park.phone}`)}
        />
        <LinkRow
          icon="globe-outline"
          label={park.website.replace(/^https?:\/\//, '')}
          onPress={() => Linking.openURL(park.website)}
        />
        <LinkRow
          icon="location-outline"
          label={park.streetAddress}
          onPress={() => Linking.openURL(mapsUrl(park))}
        />
      </Section>

      <Button label="Directions" onPress={() => Linking.openURL(mapsUrl(park))} icon="navigate-outline" />
      <View style={styles.learnMore}>
        <Button
          label="Learn More"
          onPress={() => Linking.openURL(park.website)}
          variant="secondary"
          color="teal"
        />
      </View>
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
  neighborhood: {
    marginTop: spacing.xs,
  },
  collectStamp: {
    marginTop: spacing.xl,
  },
  divider: {
    marginTop: spacing.xl,
  },
  learnMore: {
    marginTop: spacing.base,
  },
});
