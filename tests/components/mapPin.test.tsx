import { render, screen } from '@testing-library/react-native';
import { MapPin } from '@/components/MapPin';

describe('MapPin', () => {
  it('renders without an accessible label by default', async () => {
    const { toJSON } = await render(<MapPin />);

    expect(toJSON()).toMatchObject({ props: { accessible: false } });
  });

  it('exposes the accessibility label when given', async () => {
    await render(<MapPin accessibilityLabel="Kiest Park" />);

    expect(screen.getByLabelText('Kiest Park')).toBeOnTheScreen();
  });

  it('applies a distinct style when selected', async () => {
    const unselected = await render(<MapPin accessibilityLabel="Kiest Park" />);
    const selected = await render(<MapPin selected accessibilityLabel="Kiest Park" />);

    expect(unselected.toJSON()?.props.style).not.toEqual(selected.toJSON()?.props.style);
  });
});
