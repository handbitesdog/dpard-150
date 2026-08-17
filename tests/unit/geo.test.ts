import { distanceMeters } from '@/lib/geo';

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
