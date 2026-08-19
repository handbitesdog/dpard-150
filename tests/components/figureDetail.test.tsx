import { fireEvent, render, screen } from '@testing-library/react-native';
import FigureDetailScreen from '../../app/figure/[id]';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: 'george-kessler' }),
  useRouter: () => ({ push: mockPush, back: jest.fn() }),
}));

describe('FigureDetailScreen', () => {
  it('renders the biography without a location and without a directions row', async () => {
    await render(<FigureDetailScreen />);

    expect(screen.getByRole('header', { name: 'George Kessler' })).toBeOnTheScreen();
    expect(screen.getByText('1862-1923')).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Directions' })).not.toBeOnTheScreen();
    expect(screen.queryByRole('link', { name: /directions/i })).not.toBeOnTheScreen();
  });

  it('shows related parks and routes to their detail pages on press', async () => {
    await render(<FigureDetailScreen />);

    expect(screen.getByText('Klyde Warren Park')).toBeOnTheScreen();
    expect(screen.getByText('Fair Park')).toBeOnTheScreen();

    await fireEvent.press(
      screen.getByRole('button', { name: 'Klyde Warren Park, Uptown / Arts District' }),
    );

    expect(mockPush).toHaveBeenCalledWith('/park/klyde-warren-park');
  });
});
