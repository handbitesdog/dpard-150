import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Screen } from '@/components/Screen';
import { spacing } from '@/design/spacing';

describe('Screen', () => {
  it('renders its children', async () => {
    await render(
      <Screen>
        <Text>Park details</Text>
      </Screen>,
    );

    expect(screen.getByText('Park details')).toBeOnTheScreen();
  });

  it('pads its content horizontally by the screen gutter', async () => {
    await render(
      <Screen>
        <Text testID="content">Park details</Text>
      </Screen>,
    );

    expect(screen.getByTestId('content').parent).toHaveStyle({
      paddingHorizontal: spacing.base,
    });
  });
});
