import { render, screen } from '@testing-library/react-native';
import ParkDetailScreen from '../../app/park/[id]';
import { useStampStore } from '@/stores/stampStore';

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: 'fair-park' }),
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

describe('ParkDetailScreen', () => {
  beforeEach(() => {
    useStampStore.setState({ stamps: [] });
  });

  it("shows the park's own guides and not another park's", async () => {
    await render(<ParkDetailScreen />);

    expect(screen.getByRole('header', { name: 'Fair Park' })).toBeOnTheScreen();
    expect(screen.getByText("Fair Park's Art Deco Architecture")).toBeOnTheScreen();
    expect(screen.getByText('The Texas Star and the Midway')).toBeOnTheScreen();
    expect(screen.queryByText('Building a Park Over a Freeway')).not.toBeOnTheScreen();
    expect(screen.queryByText('The Lake Loop: A Nature Walk')).not.toBeOnTheScreen();
  });

  it('shows the collected state when a stamp already exists for this park', async () => {
    useStampStore.setState({
      stamps: [{ parkId: 'fair-park', collectedAt: Date.now(), coordinates: { latitude: 0, longitude: 0 } }],
    });

    await render(<ParkDetailScreen />);

    expect(screen.getByRole('button', { name: 'Stamp Collected' })).toBeOnTheScreen();
  });
});
