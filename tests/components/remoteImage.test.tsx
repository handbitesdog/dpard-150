import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { RemoteImage } from '@/components/RemoteImage';

const bundled = require('../../assets/park-1.jpg');
const remote = { uri: 'https://cdn.example.com/parks/fair-park.jpg', fallback: bundled };

const TEST_ID = 'remote-image';

function sourceOf() {
  return screen.getByTestId(TEST_ID).props.source;
}

describe('RemoteImage', () => {
  it('renders the CDN image while it loads successfully', async () => {
    await render(<RemoteImage testID={TEST_ID} source={remote} />);

    expect(sourceOf()).toEqual(remote);
  });

  it('swaps to the bundled fallback when the CDN image fails to load', async () => {
    await render(<RemoteImage testID={TEST_ID} source={remote} />);

    fireEvent(screen.getByTestId(TEST_ID), 'error');

    await waitFor(() => expect(sourceOf()).toBe(bundled));
  });

  it('keeps the failed source when there is no fallback to swap in', async () => {
    const withoutFallback = { uri: remote.uri };
    await render(<RemoteImage testID={TEST_ID} source={withoutFallback} />);

    fireEvent(screen.getByTestId(TEST_ID), 'error');

    await waitFor(() => expect(sourceOf()).toEqual(withoutFallback));
  });

  it('retries a different image rather than inheriting the last one’s failure', async () => {
    const { rerender } = await render(<RemoteImage testID={TEST_ID} source={remote} />);
    fireEvent(screen.getByTestId(TEST_ID), 'error');
    await waitFor(() => expect(sourceOf()).toBe(bundled));

    const other = {
      uri: 'https://cdn.example.com/parks/klyde-warren.jpg',
      fallback: bundled,
    };
    await rerender(<RemoteImage testID={TEST_ID} source={other} />);

    await waitFor(() => expect(sourceOf()).toEqual(other));
  });

  it('renders a bundled source directly, with no failure handling to do', async () => {
    await render(<RemoteImage testID={TEST_ID} source={bundled} />);

    await waitFor(() => expect(sourceOf()).toBe(bundled));
    expect(screen.getByTestId(TEST_ID).props.onError).toBeUndefined();
  });
});
