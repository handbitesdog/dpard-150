import { fireEvent, render, screen } from '@testing-library/react-native';
import PassportCollectionScreen from '../../app/passport-collection';
import { parks } from '@/data';
import { useStampStore } from '@/stores/stampStore';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
}));

describe('PassportCollectionScreen', () => {
  beforeEach(() => {
    useStampStore.setState({ stamps: [] });
    mockBack.mockClear();
  });

  it('shows the collected count against every park in the catalog', async () => {
    useStampStore.setState({
      stamps: [{ parkId: 'fair-park', collectedAt: Date.now(), coordinates: { latitude: 0, longitude: 0 } }],
    });

    await render(<PassportCollectionScreen />);

    expect(screen.getByLabelText(`1 of ${parks.length} stamps collected`)).toBeOnTheScreen();
  });

  it('renders a stamp for every park, marking collected state', async () => {
    useStampStore.setState({
      stamps: [{ parkId: 'fair-park', collectedAt: Date.now(), coordinates: { latitude: 0, longitude: 0 } }],
    });

    await render(<PassportCollectionScreen />);

    const fairPark = parks.find((park) => park.id === 'fair-park')!;
    expect(
      screen.getByLabelText(`${fairPark.name} stamp, collected`),
    ).toBeOnTheScreen();

    const otherPark = parks.find((park) => park.id !== 'fair-park')!;
    expect(
      screen.getByLabelText(`${otherPark.name} stamp, not yet collected`),
    ).toBeOnTheScreen();
  });

  it('goes back on the header back button', async () => {
    await render(<PassportCollectionScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Back' }));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('shows the title and collected count as a subtitle', async () => {
    useStampStore.setState({
      stamps: [{ parkId: 'fair-park', collectedAt: Date.now(), coordinates: { latitude: 0, longitude: 0 } }],
    });

    await render(<PassportCollectionScreen />);

    expect(screen.getByRole('header', { name: 'Park Stamps' })).toBeOnTheScreen();
    expect(screen.getByText(`1/${parks.length} collected`)).toBeOnTheScreen();
  });
});
