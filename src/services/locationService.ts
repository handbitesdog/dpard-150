import * as Location from 'expo-location';
import type { Coordinates } from '@/lib/geo';

export type LocationResult =
  | { status: 'success'; coordinates: Coordinates; accuracyMeters: number }
  | { status: 'denied' };

/** GPS can hang indefinitely with no fix (weak signal, cold start) — `getCurrentPositionAsync` has no built-in timeout. */
const LOCATION_TIMEOUT_MS = 10_000;

async function readLocation(): Promise<Location.LocationObject | null> {
  try {
    return await Promise.race([
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), LOCATION_TIMEOUT_MS)),
    ]);
  } catch {
    return null;
  }
}

/**
 * Reads the device's current foreground location.
 *
 * `denied` covers a rejected permission prompt, a reading that failed after
 * one retry, and a reading that timed out waiting for a GPS fix — the
 * finer-grained terminal states like "too far" or "low accuracy" belong to
 * `stampService`, one layer up.
 */
export async function getCurrentLocation(): Promise<LocationResult> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    return { status: 'denied' };
  }

  const reading = (await readLocation()) ?? (await readLocation());
  if (!reading) {
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
