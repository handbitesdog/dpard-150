import { act } from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import ListenScreen from '../../app/(tabs)/listen';

jest.mock('expo-router', () => ({
  useFocusEffect: () => {},
}));

async function search(query: string) {
  await fireEvent.changeText(screen.getByPlaceholderText('Search guides'), query);
  act(() => {
    jest.advanceTimersByTime(250);
  });
}

describe('ListenScreen search', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows every guide with an empty query', async () => {
    await render(<ListenScreen />);

    expect(screen.getByText('Klyde Warren Park')).toBeOnTheScreen();
    expect(screen.getByText("Fair Park's Art Deco Architecture")).toBeOnTheScreen();
    expect(screen.getByText('The Texas Star and the Midway')).toBeOnTheScreen();
    expect(screen.getByText('White Rock Lake Park')).toBeOnTheScreen();
  });

  it('filters by narrator after debouncing', async () => {
    await render(<ListenScreen />);

    await search('Dana');

    expect(screen.getByText('Klyde Warren Park')).toBeOnTheScreen();
    expect(screen.queryByText("Fair Park's Art Deco Architecture")).not.toBeOnTheScreen();
    expect(screen.queryByText('White Rock Lake Park')).not.toBeOnTheScreen();
  });

  it('filters by park name, matching every guide at that park', async () => {
    await render(<ListenScreen />);

    await search('Fair Park');

    expect(screen.getByText("Fair Park's Art Deco Architecture")).toBeOnTheScreen();
    expect(screen.getByText('The Texas Star and the Midway')).toBeOnTheScreen();
    expect(screen.queryByText('Klyde Warren Park')).not.toBeOnTheScreen();
  });

  it('does not filter before the debounce elapses', async () => {
    await render(<ListenScreen />);

    await fireEvent.changeText(screen.getByPlaceholderText('Search guides'), 'Dana');

    expect(screen.queryByText('White Rock Lake Park')).toBeOnTheScreen();
  });

  it('shows an empty state with no matches', async () => {
    await render(<ListenScreen />);

    await search('zzzzz');

    expect(screen.getByText('No results')).toBeOnTheScreen();
    expect(screen.queryByText('Klyde Warren Park')).not.toBeOnTheScreen();
  });

  it('restores the full list when "Clear search" is pressed', async () => {
    await render(<ListenScreen />);

    await search('zzzzz');
    await fireEvent.press(screen.getByRole('button', { name: 'Clear search' }));
    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(screen.getByText('Klyde Warren Park')).toBeOnTheScreen();
  });
});
