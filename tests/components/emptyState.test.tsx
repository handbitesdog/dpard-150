import { fireEvent, render, screen } from '@testing-library/react-native';
import { EmptyState } from '@/components/EmptyState';
import CompassIcon from '@/components/icons/compass-icon.svg';

describe('EmptyState', () => {
  it('renders the title and message', async () => {
    await render(
      <EmptyState icon={CompassIcon} title="No results" message="Try a different search term." />,
    );

    expect(screen.getByText('No results')).toBeOnTheScreen();
    expect(screen.getByText('Try a different search term.')).toBeOnTheScreen();
  });

  it('exposes an accessible summary as a single label', async () => {
    await render(
      <EmptyState icon={CompassIcon} title="No results" message="Try a different search term." />,
    );

    expect(screen.getByLabelText('No results. Try a different search term.')).toBeOnTheScreen();
  });

  it('falls back to accessibilityLabel over the composed title/message', async () => {
    await render(
      <EmptyState
        icon={CompassIcon}
        title="No results"
        message="Try a different search term."
        accessibilityLabel="No guides matched your search"
      />,
    );

    expect(screen.getByLabelText('No guides matched your search')).toBeOnTheScreen();
  });

  it('does not render an action when none is given', async () => {
    await render(
      <EmptyState icon={CompassIcon} title="No results" message="Try a different search term." />,
    );

    expect(screen.queryByRole('button')).not.toBeOnTheScreen();
  });

  it('renders the action and fires onAction when tapped', async () => {
    const onAction = jest.fn();
    await render(
      <EmptyState
        icon={CompassIcon}
        title="No results"
        message="Try a different search term."
        actionLabel="Clear search"
        onAction={onAction}
      />,
    );

    fireEvent.press(screen.getByRole('button', { name: 'Clear search' }));

    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
