import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Section } from '@/components/Section';

describe('Section', () => {
  it('renders its title and children', async () => {
    await render(
      <Section title="Nearby parks">
        <Text>Kiest Park</Text>
      </Section>,
    );

    expect(screen.getByRole('header', { name: 'Nearby parks' })).toBeOnTheScreen();
    expect(screen.getByText('Kiest Park')).toBeOnTheScreen();
  });

  it('forwards onSeeAllPress to its header', async () => {
    const onSeeAllPress = jest.fn();
    await render(
      <Section title="Nearby parks" onSeeAllPress={onSeeAllPress}>
        <Text>Kiest Park</Text>
      </Section>,
    );

    fireEvent.press(screen.getByRole('link', { name: 'See all Nearby parks' }));

    expect(onSeeAllPress).toHaveBeenCalledTimes(1);
  });
});
