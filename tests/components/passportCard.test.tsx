import { render, screen } from '@testing-library/react-native';
import { PassportCard } from '@/components/PassportCard';

describe('PassportCard', () => {
  it('renders the stamp count and singular label', async () => {
    await render(<PassportCard collected={1} total={25} />);

    expect(screen.getByText('1')).toBeOnTheScreen();
    expect(screen.getByText('Stamp')).toBeOnTheScreen();
  });

  it('pluralizes the label when collected is not 1', async () => {
    await render(<PassportCard collected={3} total={25} />);

    expect(screen.getByText('Stamps')).toBeOnTheScreen();
  });

  it('exposes an accessible summary as a single label', async () => {
    await render(<PassportCard collected={1} total={25} />);

    expect(screen.getByLabelText('1 of 25 stamps collected')).toBeOnTheScreen();
  });

  it('renders the view collection link', async () => {
    await render(<PassportCard collected={1} total={25} />);

    expect(screen.getByText('View Collection')).toBeOnTheScreen();
  });
});
