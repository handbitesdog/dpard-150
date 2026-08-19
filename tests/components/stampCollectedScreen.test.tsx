import { fireEvent, render, screen } from '@testing-library/react-native';
import StampCollectedScreen from '../../app/stamp-collected';

const parkName = 'Klyde Warren Park';
const mockDismissTo = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ parkId: 'klyde-warren-park' }),
  useRouter: () => ({ dismissTo: mockDismissTo, back: mockBack }),
}));

describe('StampCollectedScreen', () => {
  it('shows the collected park and confirmation text', async () => {
    await render(<StampCollectedScreen />);

    expect(screen.getByText(parkName)).toBeOnTheScreen();
    expect(screen.getByText('added to passport')).toBeOnTheScreen();
  });

  it('navigates to the passport tab on View Passport', async () => {
    await render(<StampCollectedScreen />);

    await fireEvent.press(screen.getByRole('button', { name: 'View Passport' }));

    expect(mockDismissTo).toHaveBeenCalledWith('/passport');
  });

  it('goes back on Close', async () => {
    await render(<StampCollectedScreen />);

    await fireEvent.press(screen.getByRole('button', { name: 'Close' }));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
