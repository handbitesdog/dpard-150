import * as Location from 'expo-location';
import type { Coordinates } from '@/lib/geo';

export type LocationResult =
  | { status: 'success'; coordinates: Coordinates; accuracyMeters: number }
  | { status: 'denied' };

async function readLocation(): Promise<Location.LocationObject | null> {
  try {
    return await Location.getCurrentPositionAsync();
  } catch {
    return null;
  }
}

/**
 * Reads the device's current foreground location.
 *
 * `denied` covers both a rejected permission prompt and a reading that
 * couldn't be trusted (failed after one retry, or flagged as a mocked
 * Android location) — the finer-grained terminal states like "too far" or
 * "low accuracy" belong to `stampService`, one layer up.
 */
export async function getCurrentLocation(): Promise<LocationResult> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    return { status: 'denied' };
  }

  const reading = (await readLocation()) ?? (await readLocation());
  if (!reading || reading.mocked) {
    return { status: 'denied' };
  }

  return {
    status: 'success',
    coordinates: {
      latitude: reading.coords.latitude,
      longitude: reading.coords.longitude,
    },
    accuracyMeters: reading.coords.accuracy ?? Number.POSITIVE_INFINITY,
  };
}
