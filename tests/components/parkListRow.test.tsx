import { fireEvent, render, screen } from '@testing-library/react-native';
import { ParkListRow } from '@/components/ParkListRow';

describe('ParkListRow', () => {
  it('exposes name and neighborhood as a single accessible label', async () => {
    await render(
      <ParkListRow name="Klyde Warren Park" neighborhood="Uptown / Arts District" onPress={jest.fn()} />,
    );

    expect(
      screen.getByRole('button', { name: 'Klyde Warren Park, Uptown / Arts District' }),
    ).toBeOnTheScreen();
  });

  it('fires onPress when tapped', async () => {
    const onPress = jest.fn();
    await render(<ParkListRow name="Fair Park" neighborhood="South Dallas" onPress={onPress} />);

    fireEvent.press(screen.getByRole('button', { name: 'Fair Park, South Dallas' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
