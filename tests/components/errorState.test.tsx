import { fireEvent, render, screen } from '@testing-library/react-native';
import { ErrorState } from '@/components/ErrorState';
import CompassIcon from '@/components/icons/compass-icon.svg';

describe('ErrorState', () => {
  it('renders the title and message', async () => {
    await render(
      <ErrorState
        icon={CompassIcon}
        title="Couldn't load parks"
        message="Check your connection and try again."
      />,
    );

    expect(screen.getByText("Couldn't load parks")).toBeOnTheScreen();
    expect(screen.getByText('Check your connection and try again.')).toBeOnTheScreen();
  });

  it('exposes an accessible summary as a single label', async () => {
    await render(
      <ErrorState
        icon={CompassIcon}
        title="Couldn't load parks"
        message="Check your connection and try again."
      />,
    );

    expect(
      screen.getByLabelText("Couldn't load parks. Check your connection and try again."),
    ).toBeOnTheScreen();
  });

  it('falls back to accessibilityLabel over the composed title/message', async () => {
    await render(
      <ErrorState
        icon={CompassIcon}
        title="Couldn't load parks"
        message="Check your connection and try again."
        accessibilityLabel="Failed to load parks"
      />,
    );

    expect(screen.getByLabelText('Failed to load parks')).toBeOnTheScreen();
  });

  it('does not render an action when none is given', async () => {
    await render(
      <ErrorState
        icon={CompassIcon}
        title="Couldn't load parks"
        message="Check your connection and try again."
      />,
    );

    expect(screen.queryByRole('button')).not.toBeOnTheScreen();
  });

  it('renders the action and fires onAction when tapped', async () => {
    const onAction = jest.fn();
    await render(
      <ErrorState
        icon={CompassIcon}
        title="Couldn't load parks"
        message="Check your connection and try again."
        actionLabel="Retry"
        onAction={onAction}
      />,
    );

    fireEvent.press(screen.getByRole('button', { name: 'Retry' }));

    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
