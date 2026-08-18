import {
  createPlaybackService,
  type PlaybackPlayer,
  type PlaybackServiceDeps,
  type PlayerStatus,
} from '@/services/playbackService';

function makeFakePlayer() {
  let statusListener: ((status: PlayerStatus) => void) | null = null;

  const player: PlaybackPlayer & { emit: (status: PlayerStatus) => void } = {
    currentTime: 0,
    play: jest.fn(),
    pause: jest.fn(),
    replace: jest.fn(),
    seekTo: jest.fn(async (seconds: number) => {
      player.currentTime = seconds;
    }),
    setPlaybackRate: jest.fn(),
    addListener: jest.fn((_event, listener) => {
      statusListener = listener;
      return { remove: jest.fn() };
    }),
    emit: (status) => statusListener?.(status),
  };

  return player;
}

function makeDeps(overrides: Partial<PlaybackServiceDeps> = {}): {
  deps: PlaybackServiceDeps;
  player: ReturnType<typeof makeFakePlayer>;
  onStatusChange: jest.Mock;
} {
  const player = makeFakePlayer();
  const onStatusChange = jest.fn();

  const deps: PlaybackServiceDeps = {
    player,
    resolveSource: jest.fn((guideId: string) => ({ uri: `fixture://${guideId}` })),
    getResumePosition: jest.fn(() => undefined),
    onStatusChange,
    ...overrides,
  };

  return { deps, player, onStatusChange };
}

describe('createPlaybackService', () => {
  it('replaces the source and plays when switching to a new guide', async () => {
    const { deps, player } = makeDeps();
    const service = createPlaybackService(deps);

    await service.play('kwp-history');

    expect(player.replace).toHaveBeenCalledWith({ uri: 'fixture://kwp-history' });
    expect(player.play).toHaveBeenCalledTimes(1);
  });

  it('resumes without replacing the source when the same guide plays again', async () => {
    const { deps, player } = makeDeps();
    const service = createPlaybackService(deps);

    await service.play('kwp-history');
    await service.play('kwp-history');

    expect(player.replace).toHaveBeenCalledTimes(1);
    expect(player.play).toHaveBeenCalledTimes(2);
  });

  it('replaces the source again when switching to a different guide', async () => {
    const { deps, player } = makeDeps();
    const service = createPlaybackService(deps);

    await service.play('kwp-history');
    await service.play('fair-park-midway');

    expect(player.replace).toHaveBeenNthCalledWith(2, { uri: 'fixture://fair-park-midway' });
  });

  it('seeks to the saved position when resuming a guide after a restart', async () => {
    const { deps, player } = makeDeps({ getResumePosition: jest.fn(() => 23) });
    const service = createPlaybackService(deps);

    await service.play('kwp-history');

    expect(player.replace).toHaveBeenCalledWith({ uri: 'fixture://kwp-history' });
    expect(player.seekTo).toHaveBeenCalledWith(23);
    expect(player.play).toHaveBeenCalledTimes(1);
  });

  it('does not seek when there is no saved position for the guide', async () => {
    const { deps, player } = makeDeps({ getResumePosition: jest.fn(() => undefined) });
    const service = createPlaybackService(deps);

    await service.play('kwp-history');

    expect(player.seekTo).not.toHaveBeenCalled();
  });

  it('does not re-seek when resuming the same guide without switching', async () => {
    const { deps, player } = makeDeps({ getResumePosition: jest.fn(() => 23) });
    const service = createPlaybackService(deps);

    await service.play('kwp-history');
    (player.seekTo as jest.Mock).mockClear();
    await service.play('kwp-history');

    expect(player.seekTo).not.toHaveBeenCalled();
  });

  it('pauses without touching the source', async () => {
    const { deps, player } = makeDeps();
    const service = createPlaybackService(deps);

    await service.pause();

    expect(player.pause).toHaveBeenCalledTimes(1);
    expect(player.replace).not.toHaveBeenCalled();
  });

  it('seeks to an absolute position', async () => {
    const { deps, player } = makeDeps();
    const service = createPlaybackService(deps);

    await service.seek(42);

    expect(player.seekTo).toHaveBeenCalledWith(42);
  });

  it('skips relative to the current position', async () => {
    const { deps, player } = makeDeps();
    player.currentTime = 100;
    const service = createPlaybackService(deps);

    await service.skip(15);

    expect(player.seekTo).toHaveBeenCalledWith(115);
  });

  it('sets the playback rate', async () => {
    const { deps, player } = makeDeps();
    const service = createPlaybackService(deps);

    await service.setPlaybackSpeed(1.5);

    expect(player.setPlaybackRate).toHaveBeenCalledWith(1.5);
  });

  it('reports the currently loaded guide id on every status update', async () => {
    const { deps, player, onStatusChange } = makeDeps();
    const service = createPlaybackService(deps);

    await service.play('kwp-history');
    player.emit({ currentTime: 12, duration: 480, playing: true });

    expect(onStatusChange).toHaveBeenCalledWith({
      guideId: 'kwp-history',
      isPlaying: true,
      positionSeconds: 12,
      durationSeconds: 480,
    });
  });

  it('reports a null guide id for status updates before anything has played', () => {
    const { deps, player, onStatusChange } = makeDeps();
    createPlaybackService(deps);

    player.emit({ currentTime: 0, duration: 0, playing: false });

    expect(onStatusChange).toHaveBeenCalledWith({
      guideId: null,
      isPlaying: false,
      positionSeconds: 0,
      durationSeconds: 0,
    });
  });
});
