import { fireEvent, render, screen } from '@testing-library/react-native';
import ExploreScreen from '../../app/(tabs)/explore';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('ExploreScreen list view', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('starts in map view with the list hidden', async () => {
    await render(<ExploreScreen />);

    expect(screen.queryByTestId('explore-list')).not.toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Show list view' })).toBeOnTheScreen();
  });

  it('shows one row per park and routes to its detail page on press', async () => {
    await render(<ExploreScreen />);

    await fireEvent.press(screen.getByRole('button', { name: 'Show list view' }));

    expect(screen.getByTestId('explore-list')).toBeOnTheScreen();
    expect(
      screen.getByRole('button', { name: 'Klyde Warren Park, Uptown / Arts District' }),
    ).toBeOnTheScreen();

    await fireEvent.press(
      screen.getByRole('button', { name: 'Klyde Warren Park, Uptown / Arts District' }),
    );

    expect(mockPush).toHaveBeenCalledWith('/park/klyde-warren-park');
  });

  it('filters the list to match the search query', async () => {
    await render(<ExploreScreen />);

    await fireEvent.press(screen.getByRole('button', { name: 'Show list view' }));
    await fireEvent.changeText(screen.getByPlaceholderText('Search parks'), 'Klyde');

    expect(
      screen.getByRole('button', { name: 'Klyde Warren Park, Uptown / Arts District' }),
    ).toBeOnTheScreen();
    expect(screen.queryByText('Fair Park')).not.toBeOnTheScreen();
  });

  it('toggles back to the map view', async () => {
    await render(<ExploreScreen />);

    await fireEvent.press(screen.getByRole('button', { name: 'Show list view' }));
    expect(screen.getByTestId('explore-list')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Show map view' }));
    expect(screen.queryByTestId('explore-list')).not.toBeOnTheScreen();
  });
});
