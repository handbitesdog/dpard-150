import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Sheet } from '@/components/Sheet';

describe('Sheet', () => {
  it('renders its content', async () => {
    await render(
      <Sheet visible onDismiss={jest.fn()}>
        <Text>Park hours: 6am - 10pm</Text>
      </Sheet>,
    );

    expect(screen.getByText('Park hours: 6am - 10pm')).toBeOnTheScreen();
  });
});
