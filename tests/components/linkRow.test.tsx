import { fireEvent, render, screen } from '@testing-library/react-native';
import { LinkRow } from '@/components/LinkRow';

describe('LinkRow', () => {
  it('renders as an accessible link with the label', async () => {
    await render(<LinkRow icon="call-outline" label="123-456-7890" onPress={jest.fn()} />);

    expect(screen.getByRole('link', { name: '123-456-7890' })).toBeOnTheScreen();
  });

  it('fires onPress when tapped', async () => {
    const onPress = jest.fn();
    await render(<LinkRow icon="call-outline" label="123-456-7890" onPress={onPress} />);

    fireEvent.press(screen.getByRole('link', { name: '123-456-7890' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('meets the minimum touch target height', async () => {
    await render(<LinkRow icon="globe-outline" label="dallasparks.org/" onPress={jest.fn()} />);

    expect(screen.getByRole('link', { name: 'dallasparks.org/' })).toHaveStyle({
      minHeight: 44,
    });
  });

  it('falls back to accessibilityLabel over the visible label', async () => {
    await render(
      <LinkRow
        icon="location-outline"
        label="123 Sesame Street, Dallas TX 12345"
        onPress={jest.fn()}
        accessibilityLabel="Get directions to 123 Sesame Street"
      />,
    );

    expect(
      screen.getByRole('link', { name: 'Get directions to 123 Sesame Street' }),
    ).toBeOnTheScreen();
  });
});
