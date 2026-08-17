import type { Park } from '@/data/schemas';
import type { Coordinates } from '@/lib/geo';
import { distanceMeters } from '@/lib/geo';
import type { LocationResult } from './locationService';

/** Below this accuracy (in meters), a reading is trusted enough to decide a claim. */
export const STAMP_ACCURACY_THRESHOLD_METERS = 50;

export type StampOutcome =
  | { status: 'success' }
  | { status: 'too_far'; distanceMeters: number }
  | { status: 'low_accuracy' }
  | { status: 'denied' }
  | { status: 'already_collected' };

export type StampServiceDeps = {
  hasStamp: (parkId: string) => boolean;
  collectStamp: (parkId: string, coordinates: Coordinates) => void;
  getCurrentLocation: () => Promise<LocationResult>;
};

/**
 * Runs the collect-stamp flow for a park: idle → checking → locating →
 * a single terminal `StampOutcome`. Idempotent — collecting an already-owned
 * stamp is a no-op that reports `already_collected` rather than duplicating it.
 */
export async function claimStamp(
  park: Park,
  deps: StampServiceDeps,
): Promise<StampOutcome> {
  if (deps.hasStamp(park.id)) {
    return { status: 'already_collected' };
  }

  const location = await deps.getCurrentLocation();
  if (location.status === 'denied') {
    return { status: 'denied' };
  }

  if (location.accuracyMeters > STAMP_ACCURACY_THRESHOLD_METERS) {
    return { status: 'low_accuracy' };
  }

  const distance = distanceMeters(location.coordinates, park.location);
  if (distance > park.stampRadiusMeters) {
    return { status: 'too_far', distanceMeters: distance };
  }

  deps.collectStamp(park.id, location.coordinates);
  return { status: 'success' };
}
