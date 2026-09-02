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
    expect(screen.getByText('1862 – 1923')).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Directions' })).not.toBeOnTheScreen();
    expect(screen.queryByRole('link', { name: /directions/i })).not.toBeOnTheScreen();
  });

  it('renders each headed passage of the biography as its own section', async () => {
    await render(<FigureDetailScreen />);

    expect(screen.getByText('Shaping the Future of Dallas')).toBeOnTheScreen();
    expect(screen.getByText('The Enduring Legacy of the Kessler Plan')).toBeOnTheScreen();
  });

  it('shows related parks and routes to their detail pages on press', async () => {
    await render(<FigureDetailScreen />);

    expect(screen.getByText('Fair Park')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Fair Park, South Dallas' }));

    expect(mockPush).toHaveBeenCalledWith('/park/fair-park');
  });
});
