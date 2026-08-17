import { act } from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Toast } from '@/components/Toast';

describe('Toast', () => {
  it('renders the message', async () => {
    await render(<Toast message="Stamp added to your passport" />);

    expect(screen.getByText('Stamp added to your passport')).toBeOnTheScreen();
  });

  it('announces itself to screen readers as a live region', async () => {
    await render(<Toast message="Stamp added to your passport" />);

    expect(screen.getByLabelText('Stamp added to your passport')).toBeOnTheScreen();
  });

  it('does not render a dismiss button when onDismiss is omitted', async () => {
    await render(<Toast message="Stamp added to your passport" />);

    expect(screen.queryByRole('button')).not.toBeOnTheScreen();
  });

  it('fires onDismiss when the dismiss button is tapped', async () => {
    const onDismiss = jest.fn();
    await render(<Toast message="Stamp added to your passport" onDismiss={onDismiss} />);

    fireEvent.press(screen.getByRole('button', { name: 'Dismiss' }));

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('auto-dismisses after the given duration', async () => {
    jest.useFakeTimers();
    const onDismiss = jest.fn();
    await render(<Toast message="Stamp added to your passport" onDismiss={onDismiss} duration={1000} />);

    expect(onDismiss).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onDismiss).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });
});
