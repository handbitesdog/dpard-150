import { fireEvent, render, screen } from '@testing-library/react-native';
import { figures, parks } from '@/data';
import { lifespanYears } from '@/lib/lifespanYears';
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

  it('renders historic figures from the catalog and routes to a detail page on press', async () => {
    const [first, second] = figures;

    await render(<DiscoverScreen />);

    expect(screen.getByText(first!.name)).toBeOnTheScreen();
    expect(screen.getByText(second!.name)).toBeOnTheScreen();

    await fireEvent.press(
      screen.getByRole('button', { name: `${first!.name}, ${lifespanYears(first!.lifespan!)}` }),
    );

    expect(mockPush).toHaveBeenCalledWith(`/figure/${first!.id}`);
  });

  // Cards are too narrow for the department's full dates, which truncate.
  it('labels a figure card with years alone', async () => {
    const dated = figures.find((figure) => figure.lifespan?.includes(','))!;

    await render(<DiscoverScreen />);

    expect(screen.getByText(lifespanYears(dated.lifespan!))).toBeOnTheScreen();
    expect(screen.queryByText(dated.lifespan!)).not.toBeOnTheScreen();
  });
});
