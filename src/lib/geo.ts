const EARTH_RADIUS_METERS = 6371000;

export type Coordinates = {
  latitude: number;
  longitude: number;
};

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

const MIN_DELTA = 0.02;
const REGION_PADDING_FACTOR = 1.4;

/** Smallest region (in the shape `MapView`'s `region`/`initialRegion` expect) that frames every coordinate, with padding. */
export function regionForCoordinates(coordinates: Coordinates[]): Region {
  const [first, ...rest] = coordinates;
  if (!first) {
    throw new Error('regionForCoordinates requires at least one coordinate');
  }

  let minLat = first.latitude;
  let maxLat = first.latitude;
  let minLon = first.longitude;
  let maxLon = first.longitude;

  for (const { latitude, longitude } of rest) {
    minLat = Math.min(minLat, latitude);
    maxLat = Math.max(maxLat, latitude);
    minLon = Math.min(minLon, longitude);
    maxLon = Math.max(maxLon, longitude);
  }

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLon + maxLon) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * REGION_PADDING_FACTOR, MIN_DELTA),
    longitudeDelta: Math.max((maxLon - minLon) * REGION_PADDING_FACTOR, MIN_DELTA),
  };
}

/** Great-circle distance between two coordinates, via the haversine formula. */
export function distanceMeters(a: Coordinates, b: Coordinates): number {
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);
  const deltaLat = toRadians(b.latitude - a.latitude);
  const deltaLon = toRadians(b.longitude - a.longitude);

  const h =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;

  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(h));
}
