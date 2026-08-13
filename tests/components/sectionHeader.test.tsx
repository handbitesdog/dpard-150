import { fireEvent, render, screen } from '@testing-library/react-native';
import { SectionHeader } from '@/components/SectionHeader';

describe('SectionHeader', () => {
  it('renders the title as a header', async () => {
    await render(<SectionHeader title="Nearby parks" />);

    expect(screen.getByRole('header', { name: 'Nearby parks' })).toBeOnTheScreen();
  });

  it('omits "See all" when no handler is given', async () => {
    await render(<SectionHeader title="Nearby parks" />);

    expect(screen.queryByRole('link')).not.toBeOnTheScreen();
  });

  it('renders "See all" and fires its handler when a handler is given', async () => {
    const onSeeAllPress = jest.fn();
    await render(<SectionHeader title="Nearby parks" onSeeAllPress={onSeeAllPress} />);

    const link = screen.getByRole('link', { name: 'See all Nearby parks' });
    fireEvent.press(link);

    expect(onSeeAllPress).toHaveBeenCalledTimes(1);
  });

  it('supports a custom "See all" label and accessibility label', async () => {
    const onSeeAllPress = jest.fn();
    await render(
      <SectionHeader
        title="Guides"
        onSeeAllPress={onSeeAllPress}
        seeAllLabel="View all"
        accessibilityLabel="View all audio guides"
      />,
    );

    expect(screen.getByText('View all')).toBeOnTheScreen();
    expect(screen.getByRole('link', { name: 'View all audio guides' })).toBeOnTheScreen();
  });
});
