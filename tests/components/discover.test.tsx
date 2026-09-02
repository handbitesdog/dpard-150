import { fireEvent, render, screen } from '@testing-library/react-native';
import { parks } from '@/data';
import DiscoverScreen from '../../app/(tabs)/discover';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('DiscoverScreen carousels', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  // The carousel is virtualized, so only the leading parks are mounted —
  // asserting against the whole catalog would depend on the render window.
  it('renders parks from the catalog and routes to a detail page on press', async () => {
    const [first, second] = parks;

    await render(<DiscoverScreen />);

    expect(screen.getByText(first!.name)).toBeOnTheScreen();
    expect(screen.getByText(second!.name)).toBeOnTheScreen();

    await fireEvent.press(
      screen.getByRole('button', { name: `${first!.name}, ${first!.neighborhood}` }),
    );

    expect(mockPush).toHaveBeenCalledWith(`/park/${first!.id}`);
  });

  it('renders every historic figure from the catalog and routes to its detail page on press', async () => {
    await render(<DiscoverScreen />);

    expect(screen.getByText('George Kessler')).toBeOnTheScreen();
    expect(screen.getByText('Robert B. Cullum')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'George Kessler, 1862-1923' }));

    expect(mockPush).toHaveBeenCalledWith('/figure/george-kessler');
  });
});
