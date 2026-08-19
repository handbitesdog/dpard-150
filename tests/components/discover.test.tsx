import { fireEvent, render, screen } from '@testing-library/react-native';
import DiscoverScreen from '../../app/(tabs)/discover';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('DiscoverScreen carousels', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders every park from the catalog and routes to its detail page on press', async () => {
    await render(<DiscoverScreen />);

    expect(screen.getByText('Klyde Warren Park')).toBeOnTheScreen();
    expect(screen.getByText('Fair Park')).toBeOnTheScreen();
    expect(screen.getByText('White Rock Lake Park')).toBeOnTheScreen();

    await fireEvent.press(
      screen.getByRole('button', { name: 'Klyde Warren Park, Uptown / Arts District' }),
    );

    expect(mockPush).toHaveBeenCalledWith('/park/klyde-warren-park');
  });

  it('renders every historic figure from the catalog and routes to its detail page on press', async () => {
    await render(<DiscoverScreen />);

    expect(screen.getByText('George Kessler')).toBeOnTheScreen();
    expect(screen.getByText('Robert B. Cullum')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'George Kessler, 1862-1923' }));

    expect(mockPush).toHaveBeenCalledWith('/figure/george-kessler');
  });
});
