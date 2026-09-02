import { render, screen } from '@testing-library/react-native';
import ConnectScreen from '../../app/(tabs)/connect';
import DiscoverScreen from '../../app/(tabs)/discover';
import ExploreScreen from '../../app/(tabs)/explore';
import ListenScreen from '../../app/(tabs)/listen';
import PassportScreen from '../../app/(tabs)/passport';

jest.mock('expo-router', () => ({
  useFocusEffect: () => {},
  useRouter: () => ({ push: jest.fn() }),
}));

describe('tab screens', () => {
  const screens = [
    ['Discover', DiscoverScreen],
    ['Audio Tour Guides', ListenScreen],
    ['Explore', ExploreScreen],
    ['Passport', PassportScreen],
    ['Community Hub', ConnectScreen],
  ] as const;

  it.each(screens)('%s renders with a heading', async (title, Screen) => {
    await render(<Screen />);

    expect(screen.getByRole('header', { name: title })).toBeOnTheScreen();
  });
});
