import { fireEvent, render, screen } from '@testing-library/react-native';
import * as Linking from 'expo-linking';
import { View } from 'react-native';
import type { SvgProps } from 'react-native-svg';
import { SocialLinks } from '@/components/SocialLinks';

jest.mock('expo-linking', () => ({
  openURL: jest.fn(),
}));

function MockSvg(props: SvgProps) {
  return <View testID="mock-svg" {...props} />;
}

const links = [
  { icon: MockSvg, url: 'https://www.facebook.com/dallasparks', label: 'Facebook' },
  { icon: MockSvg, url: 'https://www.instagram.com/dallasparks', label: 'Instagram' },
];

describe('SocialLinks', () => {
  it('renders each link as an accessible link', async () => {
    await render(<SocialLinks links={links} />);

    expect(screen.getByRole('link', { name: 'Facebook' })).toBeOnTheScreen();
    expect(screen.getByRole('link', { name: 'Instagram' })).toBeOnTheScreen();
  });

  it('opens the matching url when tapped', async () => {
    await render(<SocialLinks links={links} />);

    fireEvent.press(screen.getByRole('link', { name: 'Instagram' }));

    expect(Linking.openURL).toHaveBeenCalledWith('https://www.instagram.com/dallasparks');
  });

  it('renders icons at the given size', async () => {
    await render(<SocialLinks links={links} size={32} />);

    expect(screen.getAllByTestId('mock-svg').at(0)?.props).toMatchObject({
      width: 32,
      height: 32,
    });
  });
});
