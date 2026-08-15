import { render, screen } from '@testing-library/react-native';
import { PassportSummary } from '@/components/PassportSummary';

describe('PassportSummary', () => {
  it('renders the collected/total count', async () => {
    await render(<PassportSummary collected={1} total={25} />);

    expect(screen.getByText('1/25')).toBeOnTheScreen();
  });

  it('exposes an accessible summary as a single label', async () => {
    await render(<PassportSummary collected={1} total={25} />);

    expect(screen.getByLabelText('1 of 25 stamps collected')).toBeOnTheScreen();
  });

  it('sizes the ring from the size prop', async () => {
    await render(<PassportSummary collected={1} total={25} size={200} />);

    expect(screen.getByLabelText('1 of 25 stamps collected')).toHaveStyle({
      width: 200,
      height: 200,
      borderRadius: 100,
    });
  });
});
