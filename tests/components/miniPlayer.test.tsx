import { fireEvent, render, screen } from '@testing-library/react-native';
import { MiniPlayer } from '@/components/MiniPlayer';

const coverImage = { uri: 'https://example.com/kiest-park.jpg' };

describe('MiniPlayer', () => {
  it('renders the title, category, and elapsed time', async () => {
    await render(
      <MiniPlayer
        title="Kiest Park History"
        coverImage={coverImage}
        elapsedLabel="10:20"
        progress={0.5}
        isPlaying={false}
        onTogglePlay={jest.fn()}
        onExpand={jest.fn()}
      />,
    );

    expect(screen.getByText('Kiest Park History')).toBeOnTheScreen();
    expect(screen.getByText('Audio Tour')).toBeOnTheScreen();
    expect(screen.getByText('10:20')).toBeOnTheScreen();
  });

  it('takes a custom category', async () => {
    await render(
      <MiniPlayer
        title="Kiest Park History"
        category="Narrated Walk"
        coverImage={coverImage}
        elapsedLabel="10:20"
        progress={0.5}
        isPlaying={false}
        onTogglePlay={jest.fn()}
        onExpand={jest.fn()}
      />,
    );

    expect(screen.getByText('Narrated Walk')).toBeOnTheScreen();
  });

  it('fires onExpand when the card is tapped', async () => {
    const onExpand = jest.fn();
    await render(
      <MiniPlayer
        title="Kiest Park History"
        coverImage={coverImage}
        elapsedLabel="10:20"
        progress={0.5}
        isPlaying={false}
        onTogglePlay={jest.fn()}
        onExpand={onExpand}
      />,
    );

    fireEvent.press(screen.getByRole('button', { name: /Now playing/ }));

    expect(onExpand).toHaveBeenCalledTimes(1);
  });

  it('fires onTogglePlay when the play button is tapped, not onExpand', async () => {
    const onTogglePlay = jest.fn();
    const onExpand = jest.fn();
    await render(
      <MiniPlayer
        title="Kiest Park History"
        coverImage={coverImage}
        elapsedLabel="10:20"
        progress={0.5}
        isPlaying={false}
        onTogglePlay={onTogglePlay}
        onExpand={onExpand}
      />,
    );

    fireEvent.press(screen.getByRole('button', { name: 'Play' }));

    expect(onTogglePlay).toHaveBeenCalledTimes(1);
    expect(onExpand).not.toHaveBeenCalled();
  });

  it('shows a pause control and label while playing', async () => {
    await render(
      <MiniPlayer
        title="Kiest Park History"
        coverImage={coverImage}
        elapsedLabel="10:20"
        progress={0.5}
        isPlaying
        onTogglePlay={jest.fn()}
        onExpand={jest.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Pause' })).toBeOnTheScreen();
  });

  it('meets the minimum touch target size for the play button', async () => {
    await render(
      <MiniPlayer
        title="Kiest Park History"
        coverImage={coverImage}
        elapsedLabel="10:20"
        progress={0.5}
        isPlaying={false}
        onTogglePlay={jest.fn()}
        onExpand={jest.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Play' })).toHaveStyle({
      width: 44,
      height: 44,
    });
  });

  it('reflects progress in the fill width', async () => {
    await render(
      <MiniPlayer
        title="Kiest Park History"
        coverImage={coverImage}
        elapsedLabel="10:20"
        progress={0.35}
        isPlaying={false}
        onTogglePlay={jest.fn()}
        onExpand={jest.fn()}
      />,
    );

    expect(screen.getByTestId('mini-player-fill')).toHaveStyle({ width: '35%' });
  });

  it('clamps progress to the 0-1 range', async () => {
    await render(
      <MiniPlayer
        title="Kiest Park History"
        coverImage={coverImage}
        elapsedLabel="10:20"
        progress={1.5}
        isPlaying={false}
        onTogglePlay={jest.fn()}
        onExpand={jest.fn()}
      />,
    );

    expect(screen.getByTestId('mini-player-fill')).toHaveStyle({ width: '100%' });
  });
});
