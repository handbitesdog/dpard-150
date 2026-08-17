import type { ComponentProps } from 'react';
import { act } from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { GestureHandlerRootView, State } from 'react-native-gesture-handler';
import {
  createGestureController,
  fireGestureHandler,
  getByGestureTestId,
} from 'react-native-gesture-handler/jest-utils';
import { MiniPlayer } from '@/components/MiniPlayer';

const coverImage = { uri: 'https://example.com/kiest-park.jpg' };

function renderMiniPlayer(overrides: Partial<ComponentProps<typeof MiniPlayer>> = {}) {
  return render(
    <GestureHandlerRootView>
      <MiniPlayer
        title="Kiest Park History"
        coverImage={coverImage}
        elapsedLabel="10:20"
        progress={0.5}
        isPlaying={false}
        onTogglePlay={jest.fn()}
        isDownloaded={false}
        isDownloading={false}
        onToggleDownload={jest.fn()}
        onPress={jest.fn()}
        onSeek={jest.fn()}
        {...overrides}
      />
    </GestureHandlerRootView>,
  );
}

describe('MiniPlayer', () => {
  it('renders the title, category, and elapsed time', async () => {
    await renderMiniPlayer();

    expect(screen.getByText('Kiest Park History')).toBeOnTheScreen();
    expect(screen.getByText('Audio Tour')).toBeOnTheScreen();
    expect(screen.getByText('10:20')).toBeOnTheScreen();
  });

  it('takes a custom category', async () => {
    await renderMiniPlayer({ category: 'Narrated Walk' });

    expect(screen.getByText('Narrated Walk')).toBeOnTheScreen();
  });

  it('fires onPress when the card is tapped', async () => {
    const onPress = jest.fn();
    await renderMiniPlayer({ onPress });

    fireEvent.press(screen.getByRole('button', { name: /Now playing/ }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('fires onTogglePlay when the play button is tapped, not onPress', async () => {
    const onTogglePlay = jest.fn();
    const onPress = jest.fn();
    await renderMiniPlayer({ onTogglePlay, onPress });

    fireEvent.press(screen.getByRole('button', { name: 'Play' }));

    expect(onTogglePlay).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows a pause control and label while playing', async () => {
    await renderMiniPlayer({ isPlaying: true });

    expect(screen.getByRole('button', { name: 'Pause' })).toBeOnTheScreen();
  });

  it('fires onToggleDownload when the download control is tapped, not onPress', async () => {
    const onToggleDownload = jest.fn();
    const onPress = jest.fn();
    await renderMiniPlayer({ onToggleDownload, onPress });

    fireEvent.press(screen.getByRole('button', { name: 'Download' }));

    expect(onToggleDownload).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows a remove-download label once the track is downloaded', async () => {
    await renderMiniPlayer({ isDownloaded: true });

    expect(screen.getByRole('button', { name: 'Remove download' })).toBeOnTheScreen();
  });

  it('shows a downloading label and ignores taps while downloading', async () => {
    const onToggleDownload = jest.fn();
    await renderMiniPlayer({ isDownloading: true, onToggleDownload });

    const downloadButton = screen.getByRole('button', { name: 'Downloading' });
    expect(downloadButton).toBeOnTheScreen();

    fireEvent.press(downloadButton);
    expect(onToggleDownload).not.toHaveBeenCalled();
  });

  it('meets the minimum touch target size for the play button', async () => {
    await renderMiniPlayer();

    expect(screen.getByRole('button', { name: 'Play' })).toHaveStyle({
      width: 44,
      height: 44,
    });
  });

  it('reflects progress in the fill width', async () => {
    await renderMiniPlayer({ progress: 0.35 });

    expect(screen.getByTestId('mini-player-fill')).toHaveStyle({ width: '35%' });
  });

  it('clamps progress to the 0-1 range', async () => {
    await renderMiniPlayer({ progress: 1.5 });

    expect(screen.getByTestId('mini-player-fill')).toHaveStyle({ width: '100%' });
  });

  it('calls onSeek with the scrubbed position when the drag ends', async () => {
    const onSeek = jest.fn();
    await renderMiniPlayer({ progress: 0.2, onSeek });

    await fireEvent(screen.getByTestId('mini-player-track-hit-area'), 'layout', {
      nativeEvent: { layout: { x: 0, y: 0, width: 200, height: 20 } },
    });

    await act(() => {
      fireGestureHandler(getByGestureTestId('mini-player-scrub'), [
        { x: 20, state: State.BEGAN },
        { x: 100, state: State.ACTIVE },
        { x: 100, state: State.END },
      ]);
    });

    expect(onSeek).toHaveBeenCalledWith(0.5);
  });

  it('updates the fill live while dragging, without calling onSeek until release', async () => {
    const onSeek = jest.fn();
    await renderMiniPlayer({ progress: 0.2, onSeek });

    await fireEvent(screen.getByTestId('mini-player-track-hit-area'), 'layout', {
      nativeEvent: { layout: { x: 0, y: 0, width: 200, height: 20 } },
    });

    const scrubGesture = getByGestureTestId('mini-player-scrub');
    const controller = createGestureController(scrubGesture);

    await act(() => {
      controller.begin({ x: 0 });
      controller.activate({ x: 0 });
      controller.update({ x: 150 });
    });

    expect(screen.getByTestId('mini-player-fill')).toHaveStyle({ width: '75%' });
    expect(onSeek).not.toHaveBeenCalled();
  });

  it('adjusts the seek position via accessibility increment/decrement actions', async () => {
    const onSeek = jest.fn();
    await renderMiniPlayer({ progress: 0.5, onSeek });

    const trackHitArea = screen.getByTestId('mini-player-track-hit-area');

    await fireEvent(trackHitArea, 'accessibilityAction', { nativeEvent: { actionName: 'increment' } });
    expect(onSeek).toHaveBeenCalledWith(0.55);

    await fireEvent(trackHitArea, 'accessibilityAction', { nativeEvent: { actionName: 'decrement' } });
    expect(onSeek).toHaveBeenCalledWith(0.45);
  });

  describe('row variant', () => {
    type RowOverrides = Partial<
      Omit<Extract<ComponentProps<typeof MiniPlayer>, { variant: 'row' }>, 'variant'>
    >;

    function renderRow(overrides: RowOverrides = {}) {
      return render(
        <GestureHandlerRootView>
          <MiniPlayer
            variant="row"
            title="Kiest Park History"
            coverImage={coverImage}
            elapsedLabel="10:20"
            progress={0}
            isPlaying={false}
            onTogglePlay={jest.fn()}
            isDownloaded={false}
            isDownloading={false}
            onToggleDownload={jest.fn()}
            onPress={jest.fn()}
            {...overrides}
          />
        </GestureHandlerRootView>,
      );
    }

    it('renders without a scrubber', async () => {
      await renderRow();

      expect(screen.queryByTestId('mini-player-track-hit-area')).not.toBeOnTheScreen();
    });

    it('fires onPress when the row is tapped', async () => {
      const onPress = jest.fn();
      await renderRow({ onPress });

      fireEvent.press(screen.getByRole('button', { name: 'Kiest Park History' }));

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('fires onTogglePlay when the play button is tapped, not onPress', async () => {
      const onTogglePlay = jest.fn();
      const onPress = jest.fn();
      await renderRow({ onTogglePlay, onPress });

      fireEvent.press(screen.getByRole('button', { name: 'Play' }));

      expect(onTogglePlay).toHaveBeenCalledTimes(1);
      expect(onPress).not.toHaveBeenCalled();
    });

    it('shows a pause control while playing', async () => {
      await renderRow({ isPlaying: true });

      expect(screen.getByRole('button', { name: 'Pause' })).toBeOnTheScreen();
    });

    it('renders a placeholder when no coverImage is given', async () => {
      await renderRow({ coverImage: undefined });

      expect(screen.getByTestId('mini-player-cover-placeholder')).toBeOnTheScreen();
    });

    it('renders without interactive controls when handlers are omitted', async () => {
      await renderRow({ onPress: undefined, onTogglePlay: undefined, onToggleDownload: undefined });

      expect(screen.queryByRole('button')).not.toBeOnTheScreen();
      expect(
        screen.getByLabelText('Kiest Park History, Audio Tour, 10:20, Not downloaded'),
      ).toBeOnTheScreen();
    });
  });
});
