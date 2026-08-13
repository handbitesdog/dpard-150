import { fireEvent, render, screen } from '@testing-library/react-native';
import { Button } from '@/components/Button';
import { palette } from '@/design/colors';

describe('Button', () => {
  it('renders as an accessible button with the label', async () => {
    await render(<Button label="Directions" onPress={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Directions' })).toBeOnTheScreen();
  });

  it('fires onPress when tapped', async () => {
    const onPress = jest.fn();
    await render(<Button label="Directions" onPress={onPress} />);

    fireEvent.press(screen.getByRole('button', { name: 'Directions' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('honors disabled and does not fire onPress', async () => {
    const onPress = jest.fn();
    await render(<Button label="Directions" onPress={onPress} disabled />);

    const button = screen.getByRole('button', { name: 'Directions' });
    fireEvent.press(button);

    expect(button).toBeDisabled();
    expect(onPress).not.toHaveBeenCalled();
  });

  it('uses navy for the primary variant regardless of color', async () => {
    await render(<Button label="Directions" onPress={jest.fn()} color="sky" />);

    expect(screen.getByRole('button', { name: 'Directions' })).toHaveStyle({
      backgroundColor: palette.navy,
    });
  });

  it('fills its container width', async () => {
    await render(<Button label="Directions" onPress={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Directions' })).toHaveStyle({
      width: '100%',
    });
  });

  it('takes a secondary color', async () => {
    await render(
      <Button label="Learn more" onPress={jest.fn()} variant="secondary" color="sky" />,
    );

    expect(screen.getByRole('button', { name: 'Learn more' })).toHaveStyle({
      backgroundColor: palette.sky,
    });
  });

  it('shrinks text for the small size', async () => {
    await render(<Button label="Directions" onPress={jest.fn()} size="small" />);

    expect(screen.getByText('Directions')).toHaveStyle({ fontSize: 16 });
  });

  it('hugs its content when fullWidth is false', async () => {
    await render(<Button label="Directions" onPress={jest.fn()} fullWidth={false} />);

    expect(screen.getByRole('button', { name: 'Directions' })).toHaveStyle({
      alignSelf: 'flex-start',
    });
  });

  it('keeps the label visible alongside the spinner when loading', async () => {
    await render(<Button label="Check in" onPress={jest.fn()} loading />);

    const button = screen.getByRole('button', { name: 'Check in' });
    expect(button).toBeDisabled();
    expect(button.props.accessibilityState).toMatchObject({ busy: true });
    expect(screen.getByText('Check in')).toBeOnTheScreen();
  });

  it('does not change height when loading', async () => {
    await render(<Button label="Check in" onPress={jest.fn()} loading />);

    expect(screen.getByRole('button', { name: 'Check in' })).toHaveStyle({
      minHeight: 44,
    });
  });

  it('does not fire onPress while loading', async () => {
    const onPress = jest.fn();
    await render(<Button label="Check in" onPress={onPress} loading />);

    fireEvent.press(screen.getByRole('button', { name: 'Check in' }));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders an icon when given one', async () => {
    await render(
      <Button label="Directions" onPress={jest.fn()} icon="navigate-outline" />,
    );

    expect(screen.getByRole('button', { name: 'Directions' })).toBeOnTheScreen();
  });

  it('falls back to accessibilityLabel over the visible label', async () => {
    await render(
      <Button
        label="Learn more"
        onPress={jest.fn()}
        accessibilityLabel="Learn more about Kiest Park"
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Learn more about Kiest Park' }),
    ).toBeOnTheScreen();
  });
});
