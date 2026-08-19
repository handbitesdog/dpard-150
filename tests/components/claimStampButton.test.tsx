import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { ClaimStampButton } from '@/components/ClaimStampButton';
import type { StampOutcome } from '@/services/stampService';

function renderButton(outcome: StampOutcome) {
  const onClaim = jest.fn().mockResolvedValue(outcome);
  const onSuccess = jest.fn();
  return { onClaim, onSuccess };
}

describe('ClaimStampButton', () => {
  it('shows a disabled collected state when already collected, without calling onClaim', async () => {
    const onClaim = jest.fn();
    await render(<ClaimStampButton alreadyCollected onClaim={onClaim} onSuccess={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Stamp Collected' })).toBeOnTheScreen();
    expect(onClaim).not.toHaveBeenCalled();
  });

  it('calls onSuccess and shows no failure message on success', async () => {
    const { onClaim, onSuccess } = renderButton({ status: 'success' });
    await render(<ClaimStampButton alreadyCollected={false} onClaim={onClaim} onSuccess={onSuccess} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Collect Stamp' }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
  });

  it('shows the distance on a too-far outcome', async () => {
    const { onClaim, onSuccess } = renderButton({ status: 'too_far', distanceMeters: 342.9 });
    await render(<ClaimStampButton alreadyCollected={false} onClaim={onClaim} onSuccess={onSuccess} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Collect Stamp' }));

    expect(await screen.findByText("You're 343m away")).toBeOnTheScreen();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('shows a message on a low-accuracy outcome', async () => {
    const { onClaim, onSuccess } = renderButton({ status: 'low_accuracy' });
    await render(<ClaimStampButton alreadyCollected={false} onClaim={onClaim} onSuccess={onSuccess} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Collect Stamp' }));

    expect(
      await screen.findByText("Your location isn't accurate enough right now. Try again outdoors."),
    ).toBeOnTheScreen();
  });

  it('shows a message on a denied outcome', async () => {
    const { onClaim, onSuccess } = renderButton({ status: 'denied' });
    await render(<ClaimStampButton alreadyCollected={false} onClaim={onClaim} onSuccess={onSuccess} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Collect Stamp' }));

    expect(
      await screen.findByText('Location permission is needed to collect this stamp.'),
    ).toBeOnTheScreen();
  });

  it('clears a previous failure message on the next attempt', async () => {
    const onClaim = jest
      .fn()
      .mockResolvedValueOnce({ status: 'too_far', distanceMeters: 100 })
      .mockResolvedValueOnce({ status: 'success' });
    const onSuccess = jest.fn();
    await render(<ClaimStampButton alreadyCollected={false} onClaim={onClaim} onSuccess={onSuccess} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Collect Stamp' }));
    await screen.findByText("You're 100m away");

    await fireEvent.press(screen.getByRole('button', { name: 'Collect Stamp' }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    expect(screen.queryByText("You're 100m away")).not.toBeOnTheScreen();
  });
});
