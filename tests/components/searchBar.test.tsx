import { fireEvent, render, screen } from '@testing-library/react-native';
import { SearchBar } from '@/components/SearchBar';

describe('SearchBar', () => {
  it('renders with the default "Search" placeholder', async () => {
    await render(<SearchBar value="" onChangeText={jest.fn()} />);

    expect(screen.getByPlaceholderText('Search')).toBeOnTheScreen();
  });

  it('renders a custom placeholder', async () => {
    await render(<SearchBar value="" onChangeText={jest.fn()} placeholder="Find a park" />);

    expect(screen.getByPlaceholderText('Find a park')).toBeOnTheScreen();
  });

  it('fires onChangeText as the user types', async () => {
    const onChangeText = jest.fn();
    await render(<SearchBar value="" onChangeText={onChangeText} />);

    fireEvent.changeText(screen.getByPlaceholderText('Search'), 'Klyde Warren');

    expect(onChangeText).toHaveBeenCalledWith('Klyde Warren');
  });

  it('meets the minimum touch target height', async () => {
    await render(<SearchBar value="" onChangeText={jest.fn()} />);

    expect(screen.getByTestId('search-bar')).toHaveStyle({ minHeight: 44 });
  });

  it('falls back to accessibilityLabel over the placeholder', async () => {
    await render(
      <SearchBar value="" onChangeText={jest.fn()} accessibilityLabel="Search parks" />,
    );

    expect(screen.getByLabelText('Search parks')).toBeOnTheScreen();
  });
});
