import { validPark } from '../fixtures/content';
import type { Park } from '@/data/schemas';
import { distanceMeters, type Coordinates } from '@/lib/geo';
import type { LocationResult } from '@/services/locationService';
import {
  claimStamp,
  STAMP_ACCURACY_THRESHOLD_METERS,
  type StampServiceDeps,
} from '@/services/stampService';

const parkLocation: Coordinates = validPark.location;
const nearbyPoint: Coordinates = { latitude: 32.781, longitude: -96.8 };
const readingDistance = distanceMeters(parkLocation, nearbyPoint);

function makePark(stampRadiusMeters: number): Park {
  return { ...validPark, stampRadiusMeters };
}

function makeLocation(accuracyMeters: number): LocationResult {
  return { status: 'success', coordinates: nearbyPoint, accuracyMeters };
}

function makeDeps(overrides: Partial<StampServiceDeps> = {}): StampServiceDeps {
  return {
    hasStamp: jest.fn().mockReturnValue(false),
    collectStamp: jest.fn(),
    getCurrentLocation: jest.fn().mockResolvedValue(makeLocation(1)),
    ...overrides,
  };
}

describe('claimStamp', () => {
  it('reports already_collected without reading location, when a stamp already exists', async () => {
    const deps = makeDeps({ hasStamp: jest.fn().mockReturnValue(true) });

    const outcome = await claimStamp(makePark(readingDistance), deps);

    expect(outcome).toEqual({ status: 'already_collected' });
    expect(deps.getCurrentLocation).not.toHaveBeenCalled();
    expect(deps.collectStamp).not.toHaveBeenCalled();
  });

  it('reports denied when location access is denied', async () => {
    const deps = makeDeps({
      getCurrentLocation: jest.fn().mockResolvedValue({ status: 'denied' }),
    });

    const outcome = await claimStamp(makePark(readingDistance), deps);

    expect(outcome).toEqual({ status: 'denied' });
    expect(deps.collectStamp).not.toHaveBeenCalled();
  });

  it('reports low_accuracy when the reading is worse than the threshold', async () => {
    const deps = makeDeps({
      getCurrentLocation: jest
        .fn()
        .mockResolvedValue(makeLocation(STAMP_ACCURACY_THRESHOLD_METERS + 1)),
    });

    const outcome = await claimStamp(makePark(readingDistance), deps);

    expect(outcome).toEqual({ status: 'low_accuracy' });
    expect(deps.collectStamp).not.toHaveBeenCalled();
  });

  it('succeeds when the reading is exactly at the accuracy threshold', async () => {
    const deps = makeDeps({
      getCurrentLocation: jest
        .fn()
        .mockResolvedValue(makeLocation(STAMP_ACCURACY_THRESHOLD_METERS)),
    });

    const outcome = await claimStamp(makePark(readingDistance), deps);

    expect(outcome).toEqual({ status: 'success' });
  });

  it('succeeds when exactly at the radius boundary', async () => {
    const deps = makeDeps();

    const outcome = await claimStamp(makePark(readingDistance), deps);

    expect(outcome).toEqual({ status: 'success' });
    expect(deps.collectStamp).toHaveBeenCalledWith(validPark.id, nearbyPoint);
  });

  it('succeeds when 1m inside the radius', async () => {
    const deps = makeDeps();

    const outcome = await claimStamp(makePark(readingDistance + 1), deps);

    expect(outcome).toEqual({ status: 'success' });
  });

  it('reports too_far with the distance, when 1m outside the radius', async () => {
    const deps = makeDeps();

    const outcome = await claimStamp(makePark(readingDistance - 1), deps);

    expect(outcome).toEqual({ status: 'too_far', distanceMeters: readingDistance });
    expect(deps.collectStamp).not.toHaveBeenCalled();
  });

  it('does not write a duplicate stamp when already collected', async () => {
    const deps = makeDeps({ hasStamp: jest.fn().mockReturnValue(true) });

    await claimStamp(makePark(readingDistance), deps);

    expect(deps.collectStamp).not.toHaveBeenCalled();
  });
});
