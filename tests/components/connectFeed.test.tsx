import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as Linking from 'expo-linking';
import ConnectScreen from '../../app/(tabs)/connect';
import type { FeedPost } from '@/stores/feedStore';
import { useFeedStore } from '@/stores/feedStore';
import { storage } from '@/stores/storage';

jest.mock('expo-linking', () => ({ openURL: jest.fn() }));

const BASE = 'https://cdn.example.com';

const post: FeedPost = {
  id: 'post-1',
  imageUrl: '/posts/post-1.jpg',
  caption: 'A day at the park',
  permalink: 'https://instagram.com/p/post-1',
  publishedAt: 1700000000000,
};

const cachedPost: FeedPost = {
  ...post,
  id: 'cached-post',
  permalink: 'https://instagram.com/p/cached',
};

function mockFetch(implementation: jest.Mock) {
  global.fetch = implementation as unknown as typeof fetch;
  return implementation;
}

/** The photo grid renders one link per post; the placeholder grid renders nine. */
function postLinks() {
  return screen.queryAllByLabelText('View post on Instagram');
}

describe('Connect feed', () => {
  beforeEach(() => {
    storage.clearAll();
    useFeedStore.setState({ posts: null, fetchedAt: null });
  });

  afterEach(() => {
    delete process.env.EXPO_PUBLIC_CDN_BASE_URL;
    jest.restoreAllMocks();
  });

  it('shows the placeholder grid and fetches nothing when no CDN is configured', async () => {
    const fetchMock = mockFetch(jest.fn());

    await render(<ConnectScreen />);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(postLinks()).toHaveLength(9);
    expect(screen.queryByText("Couldn't load photos")).toBeNull();
  });

  it('renders the fetched posts', async () => {
    process.env.EXPO_PUBLIC_CDN_BASE_URL = BASE;
    const fetchMock = mockFetch(
      jest.fn().mockResolvedValue({ ok: true, json: async () => [post] }),
    );

    await render(<ConnectScreen />);

    expect(fetchMock).toHaveBeenCalledWith(`${BASE}/feed.json`);
    await waitFor(() => expect(postLinks()).toHaveLength(1));

    fireEvent.press(postLinks()[0]!);
    expect(Linking.openURL).toHaveBeenCalledWith(post.permalink);
  });

  it('falls back to the cached posts when the fetch fails', async () => {
    process.env.EXPO_PUBLIC_CDN_BASE_URL = BASE;
    useFeedStore.setState({ posts: [cachedPost], fetchedAt: 1700000000000 });
    mockFetch(jest.fn().mockRejectedValue(new Error('offline')));

    await render(<ConnectScreen />);

    await waitFor(() => expect(postLinks()).toHaveLength(1));
    expect(screen.queryByText("Couldn't load photos")).toBeNull();
  });

  it('shows an error with a retry when the fetch fails and nothing is cached', async () => {
    process.env.EXPO_PUBLIC_CDN_BASE_URL = BASE;
    mockFetch(jest.fn().mockRejectedValue(new Error('offline')));

    await render(<ConnectScreen />);

    await waitFor(() =>
      expect(screen.getByText("Couldn't load photos")).toBeOnTheScreen(),
    );
    expect(screen.getByLabelText('Retry')).toBeOnTheScreen();
    expect(postLinks()).toHaveLength(0);
  });
});
