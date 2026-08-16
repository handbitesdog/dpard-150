import { fireEvent, render, screen } from '@testing-library/react-native';
import * as Linking from 'expo-linking';
import { LinkImage } from '@/components/LinkImage';

jest.mock('expo-linking', () => ({
  openURL: jest.fn(),
}));

describe('LinkImage', () => {
  it('renders as an accessible link', async () => {
    await render(
      <LinkImage
        source={{ uri: 'https://example.com/item.png' }}
        url="https://dallasparks.org/store"
        width={100}
        height={100}
        accessibilityLabel="Shop the Dallas Park store"
      />,
    );

    expect(
      screen.getByRole('link', { name: 'Shop the Dallas Park store' }),
    ).toBeOnTheScreen();
  });

  it('opens the url when tapped', async () => {
    await render(
      <LinkImage
        source={{ uri: 'https://example.com/item.png' }}
        url="https://dallasparks.org/store"
        width={100}
        height={100}
        accessibilityLabel="Shop the Dallas Park store"
      />,
    );

    fireEvent.press(screen.getByRole('link', { name: 'Shop the Dallas Park store' }));

    expect(Linking.openURL).toHaveBeenCalledWith('https://dallasparks.org/store');
  });
});
