import { useMemo, useRef, useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapCallout } from '@/components/MapCallout';
import { MapPin } from '@/components/MapPin';
import { SearchBar } from '@/components/SearchBar';
import { Text } from '@/components/Text';
import { parks } from '@/data';
import { PARK_PHOTOS } from '@/data/parkPhotos';
import { palette } from '@/design/colors';
import { spacing } from '@/design/spacing';
import { regionForCoordinates } from '@/lib/geo';

const INITIAL_REGION = regionForCoordinates(parks.map((park) => park.location));
const SEARCH_RESULT_DELTA = 0.02;

export default function ExploreScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [query, setQuery] = useState('');
  const [selectedParkId, setSelectedParkId] = useState<string | null>(null);

  const selectedPark = parks.find((park) => park.id === selectedParkId) ?? null;

  const matchingParks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return parks;
    return parks.filter(
      (park) =>
        park.name.toLowerCase().includes(normalized) ||
        park.neighborhood.toLowerCase().includes(normalized),
    );
  }, [query]);

  function handleSearchSubmit() {
    const [match] = matchingParks;
    if (!match) return;

    setSelectedParkId(match.id);
    mapRef.current?.animateToRegion(
      {
        latitude: match.location.latitude,
        longitude: match.location.longitude,
        latitudeDelta: SEARCH_RESULT_DELTA,
        longitudeDelta: SEARCH_RESULT_DELTA,
      },
      400,
    );
    Keyboard.dismiss();
  }

  return (
    <View style={styles.container} testID="screen-explore">
      {/* The map is the whole screen, so the title is announced to screen readers without taking visible space. */}
      <Text variant="title1" accessibilityRole="header" style={styles.hiddenHeading}>
        Explore
      </Text>

      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton={false}
        onPress={() => setSelectedParkId(null)}
      >
        {matchingParks.map((park) => (
          <Marker
            key={park.id}
            coordinate={park.location}
            onPress={() => setSelectedParkId(park.id)}
            stopPropagation
            tracksViewChanges={false}
          >
            <MapPin accessibilityLabel={park.name} />
          </Marker>
        ))}
      </MapView>

      <SafeAreaView style={styles.overlay} edges={['top', 'left', 'right']} pointerEvents="box-none">
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearchSubmit}
          placeholder="Search parks"
        />

        {selectedPark && (
          <MapCallout
            title={selectedPark.name}
            subtitle={selectedPark.streetAddress}
            photo={PARK_PHOTOS[selectedPark.id]}
            onLearnMore={() => router.push(`/park/${selectedPark.id}`)}
            onClose={() => setSelectedParkId(null)}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.grey },
  hiddenHeading: {
    position: 'absolute',
    width: 1,
    height: 1,
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.base,
    justifyContent: 'space-between',
  },
});
