import * as Location from 'expo-location';
import { getCurrentLocation } from '@/services/locationService';

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  Accuracy: { High: 4 },
}));

const mockedLocation = jest.mocked(Location);

describe('getCurrentLocation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockedLocation.requestForegroundPermissionsAsync.mockResolvedValue({
      status: 'granted',
    } as Location.LocationPermissionResponse);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('resolves to denied instead of hanging forever when no GPS fix ever arrives', async () => {
    mockedLocation.getCurrentPositionAsync.mockReturnValue(new Promise(() => {}));

    const result = getCurrentLocation();
    await jest.advanceTimersByTimeAsync(30_000);

    await expect(result).resolves.toEqual({ status: 'denied' });
  });

  it('resolves to success once a fix arrives before the timeout', async () => {
    mockedLocation.getCurrentPositionAsync.mockResolvedValue({
      coords: { latitude: 32.789, longitude: -96.8016, accuracy: 5 },
    } as Location.LocationObject);

    await expect(getCurrentLocation()).resolves.toEqual({
      status: 'success',
      coordinates: { latitude: 32.789, longitude: -96.8016 },
      accuracyMeters: 5,
    });
  });

  it('resolves to denied when permission is not granted', async () => {
    mockedLocation.requestForegroundPermissionsAsync.mockResolvedValue({
      status: 'denied',
    } as Location.LocationPermissionResponse);

    await expect(getCurrentLocation()).resolves.toEqual({ status: 'denied' });
  });
});
