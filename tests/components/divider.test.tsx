import { render, screen } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { Divider } from '@/components/Divider';
import { palette } from '@/design/colors';

describe('Divider', () => {
  it('renders a hairline rule', async () => {
    const { toJSON } = await render(<Divider />);

    expect(toJSON()).toMatchObject({
      props: { style: { backgroundColor: palette.grey } },
    });
  });

  it('is hidden from screen readers as a decorative element', async () => {
    const { toJSON } = await render(<Divider />);

    expect(toJSON()).toMatchObject({
      props: {
        accessibilityElementsHidden: true,
        importantForAccessibility: 'no-hide-descendants',
      },
    });
  });

  it('does not swallow sibling content', async () => {
    await render(
      <View>
        <Divider />
        <Text>Park hours</Text>
      </View>,
    );

    expect(screen.getByText('Park hours')).toBeOnTheScreen();
  });
});
