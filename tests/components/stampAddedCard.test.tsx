import { render, screen } from '@testing-library/react-native';
import { StampAddedCard } from '@/components/StampAddedCard';

const image = { uri: 'https://example.com/fair-park-stamp.png' };

describe('StampAddedCard', () => {
  it('renders the stamp name and confirmation text', async () => {
    await render(<StampAddedCard name="Fair Park" image={image} />);

    expect(screen.getByText('Fair Park')).toBeOnTheScreen();
    expect(screen.getByText('added to passport')).toBeOnTheScreen();
  });

  it('exposes an accessible summary as a single label', async () => {
    await render(<StampAddedCard name="Fair Park" image={image} />);

    expect(screen.getByLabelText('Fair Park added to passport')).toBeOnTheScreen();
  });
});
