import { distanceMeters, regionForCoordinates } from '@/lib/geo';

const EARTH_RADIUS_METERS = 6371000;

describe('distanceMeters', () => {
  it('is zero for identical points', () => {
    const point = { latitude: 32.7767, longitude: -96.797 };
    expect(distanceMeters(point, point)).toBeCloseTo(0, 6);
  });

  it('matches a quarter of the meridian from the equator to the pole', () => {
    const equator = { latitude: 0, longitude: 0 };
    const pole = { latitude: 90, longitude: 0 };
    expect(distanceMeters(equator, pole)).toBeCloseTo(
      (Math.PI / 2) * EARTH_RADIUS_METERS,
      3,
    );
  });

  it('matches half the meridian from pole to pole', () => {
    const northPole = { latitude: 90, longitude: 0 };
    const southPole = { latitude: -90, longitude: 0 };
    expect(distanceMeters(northPole, southPole)).toBeCloseTo(
      Math.PI * EARTH_RADIUS_METERS,
      3,
    );
  });

  it('matches the published great-circle distance between JFK and LAX', () => {
    const jfk = { latitude: 40.6413, longitude: -73.7781 };
    const lax = { latitude: 33.9416, longitude: -118.4085 };
    // Published great-circle distance is ~3983 km; a spherical approximation
    // is expected to differ from the real (ellipsoid) figure by up to ~1%.
    const km = distanceMeters(jfk, lax) / 1000;
    expect(km).toBeGreaterThan(3900);
    expect(km).toBeLessThan(4050);
  });

  it('handles the antimeridian without treating it as the long way around', () => {
    const justWest = { latitude: 0, longitude: 179.9 };
    const justEast = { latitude: 0, longitude: -179.9 };
    // 0.2 degrees of longitude at the equator, not ~half the Earth's circumference.
    expect(distanceMeters(justWest, justEast)).toBeLessThan(25000);
  });

  it('is symmetric', () => {
    const a = { latitude: 32.7767, longitude: -96.797 };
    const b = { latitude: 32.79, longitude: -96.81 };
    expect(distanceMeters(a, b)).toBeCloseTo(distanceMeters(b, a), 9);
  });
});

describe('regionForCoordinates', () => {
  it('centers on a single coordinate with a non-zero delta', () => {
    const point = { latitude: 32.7767, longitude: -96.797 };
    const region = regionForCoordinates([point]);
    expect(region.latitude).toBeCloseTo(point.latitude, 9);
    expect(region.longitude).toBeCloseTo(point.longitude, 9);
    expect(region.latitudeDelta).toBeGreaterThan(0);
    expect(region.longitudeDelta).toBeGreaterThan(0);
  });

  it('centers between two coordinates and covers both with padding', () => {
    const a = { latitude: 32.789, longitude: -96.8016 };
    const b = { latitude: 32.8209, longitude: -96.7502 };
    const region = regionForCoordinates([a, b]);

    expect(region.latitude).toBeCloseTo((a.latitude + b.latitude) / 2, 9);
    expect(region.longitude).toBeCloseTo((a.longitude + b.longitude) / 2, 9);

    const latSpan = Math.abs(a.latitude - b.latitude);
    const lonSpan = Math.abs(a.longitude - b.longitude);
    expect(region.latitudeDelta).toBeGreaterThan(latSpan);
    expect(region.longitudeDelta).toBeGreaterThan(lonSpan);
  });

  it('covers every coordinate in a larger set, not just the extremes', () => {
    const coordinates = [
      { latitude: 32.789, longitude: -96.8016 },
      { latitude: 32.8209, longitude: -96.7502 },
      { latitude: 32.8354, longitude: -96.7147 },
    ];
    const region = regionForCoordinates(coordinates);

    for (const { latitude, longitude } of coordinates) {
      expect(latitude).toBeGreaterThanOrEqual(region.latitude - region.latitudeDelta / 2);
      expect(latitude).toBeLessThanOrEqual(region.latitude + region.latitudeDelta / 2);
      expect(longitude).toBeGreaterThanOrEqual(region.longitude - region.longitudeDelta / 2);
      expect(longitude).toBeLessThanOrEqual(region.longitude + region.longitudeDelta / 2);
    }
  });

  it('throws for an empty list', () => {
    expect(() => regionForCoordinates([])).toThrow();
  });
});
