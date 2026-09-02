import { Linking, Platform, Share, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { ClaimStampButton } from '@/components/ClaimStampButton';
import { Divider } from '@/components/Divider';
import { LinkRow } from '@/components/LinkRow';
import { MiniPlayer } from '@/components/MiniPlayer';
import { PhotoHeader } from '@/components/PhotoHeader';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { Text } from '@/components/Text';
import { guides, parks } from '@/data';
import { parkPhoto, parkPhotoById } from '@/data/assets';
import { spacing } from '@/design/spacing';
import { formatDuration } from '@/lib/formatDuration';
import { getCurrentLocation } from '@/services/locationService';
import { claimStamp } from '@/services/stampService';
import { useStampStore } from '@/stores/stampStore';
import type { Park } from '@/data/schemas';

function mapsUrl(park: Park): string {
  const { latitude, longitude } = park.location;
  if (Platform.OS === 'ios') {
    return `https://maps.apple.com/?daddr=${latitude},${longitude}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
}

export default function ParkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const park = parks.find((candidate) => candidate.id === id);
  const stamps = useStampStore((state) => state.stamps);
  const collectStamp = useStampStore((state) => state.collectStamp);

  if (!park) return null;

  const parkGuides = guides.filter((guide) => guide.parkId === park.id);
  const alreadyCollected = stamps.some((stamp) => stamp.parkId === park.id);

  return (
    <Screen scroll noTopInset>
      <View style={styles.fullBleed}>
        <PhotoHeader
          photo={parkPhoto(park)}
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
        <ClaimStampButton
          alreadyCollected={alreadyCollected}
          onClaim={() =>
            claimStamp(park, {
              hasStamp: (parkId) => stamps.some((stamp) => stamp.parkId === parkId),
              collectStamp,
              getCurrentLocation,
            })
          }
          onSuccess={() =>
            router.push({ pathname: '/stamp-collected', params: { parkId: park.id } })
          }
        />
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

      {parkGuides.length > 0 && (
        <Section title="Audio Guides">
          {parkGuides.map((guide) => (
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
