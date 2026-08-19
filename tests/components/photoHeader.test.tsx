import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { PhotoHeader } from '@/components/PhotoHeader';

describe('PhotoHeader', () => {
  it('renders back and share buttons', async () => {
    await render(<PhotoHeader onBack={jest.fn()} onShare={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Back' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Share' })).toBeOnTheScreen();
  });

  it('fires onBack when the back button is tapped', async () => {
    const onBack = jest.fn();
    await render(<PhotoHeader onBack={onBack} onShare={jest.fn()} />);

    fireEvent.press(screen.getByRole('button', { name: 'Back' }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('fires onShare when the share button is tapped', async () => {
    const onShare = jest.fn();
    await render(<PhotoHeader onBack={jest.fn()} onShare={onShare} />);

    fireEvent.press(screen.getByRole('button', { name: 'Share' }));

    expect(onShare).toHaveBeenCalledTimes(1);
  });

  it('sizes the banner from the height prop', async () => {
    await render(<PhotoHeader onBack={jest.fn()} onShare={jest.fn()} height={200} />);

    expect(screen.getByTestId('photo-header')).toHaveStyle({ height: 200 });
  });

  it('omits the share button when onShare is not provided', async () => {
    await render(<PhotoHeader onBack={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Back' })).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Share' })).not.toBeOnTheScreen();
  });

  it('renders overlay content passed as children', async () => {
    await render(
      <PhotoHeader onBack={jest.fn()}>
        <Text>Overlay</Text>
      </PhotoHeader>,
    );

    expect(screen.getByText('Overlay')).toBeOnTheScreen();
  });
});
