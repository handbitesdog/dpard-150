import { useMemo, useRef, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { EmptyState } from '@/components/EmptyState';
import PinIcon from '@/components/icons/pin-icon.svg';
import { MapCallout } from '@/components/MapCallout';
import { MapPin } from '@/components/MapPin';
import { ParkListRow } from '@/components/ParkListRow';
import { SearchBar } from '@/components/SearchBar';
import { Text } from '@/components/Text';
import { parks } from '@/data';
import { PARK_PHOTOS } from '@/data/parkPhotos';
import { palette } from '@/design/colors';
import { sizes } from '@/design/sizes';
import { spacing } from '@/design/spacing';
import { regionForCoordinates } from '@/lib/geo';

const INITIAL_REGION = regionForCoordinates(parks.map((park) => park.location));
const SEARCH_RESULT_DELTA = 0.02;

type ViewMode = 'map' | 'list';

export default function ExploreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const [query, setQuery] = useState('');
  const [selectedParkId, setSelectedParkId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('map');

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

  const listTopInset = insets.top + spacing.base + sizes.touchTarget + spacing.base;

  return (
    <View style={styles.container} testID="screen-explore">
      {/* The map is the whole screen, so the title is announced to screen readers without taking visible space. */}
      <Text variant="title1" accessibilityRole="header" style={styles.hiddenHeading}>
        Explore
      </Text>

      {viewMode === 'map' ? (
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
      ) : (
        <ScrollView
          style={StyleSheet.absoluteFill}
          contentContainerStyle={[
            styles.listContent,
            { paddingTop: listTopInset, paddingBottom: insets.bottom + spacing.xl },
          ]}
          testID="explore-list"
        >
          {matchingParks.length === 0 ? (
            <EmptyState
              icon={PinIcon}
              title="No parks found"
              message={`No parks match "${query}".`}
            />
          ) : (
            matchingParks.map((park, index) => (
              <View key={park.id}>
                {index > 0 && <Divider />}
                <ParkListRow
                  name={park.name}
                  neighborhood={park.neighborhood}
                  photo={PARK_PHOTOS[park.id]}
                  onPress={() => router.push(`/park/${park.id}`)}
                />
              </View>
            ))
          )}
        </ScrollView>
      )}

      <SafeAreaView style={styles.overlay} edges={['top', 'left', 'right']} pointerEvents="box-none">
        <View style={styles.searchRow}>
          <View style={styles.searchBarWrap}>
            <SearchBar
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearchSubmit}
              placeholder="Search parks"
            />
          </View>
          <Button
            variant="icon"
            icon={viewMode === 'map' ? 'list' : 'map'}
            label={viewMode === 'map' ? 'List view' : 'Map view'}
            accessibilityLabel={viewMode === 'map' ? 'Show list view' : 'Show map view'}
            onPress={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
          />
        </View>

        {viewMode === 'map' && selectedPark && (
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchBarWrap: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.base,
  },
});
