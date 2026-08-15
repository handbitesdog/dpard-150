import { render, screen } from '@testing-library/react-native';
import { View } from 'react-native';
import type { SvgProps } from 'react-native-svg';
import { Icon } from '@/components/Icon';
import { palette } from '@/design/colors';
import { typography } from '@/design/typography';

function MockSvg(props: SvgProps) {
  return <View testID="mock-svg" {...props} />;
}

describe('Icon', () => {
  it('defaults to the headline size and navy color', async () => {
    await render(<Icon icon={MockSvg} />);

    expect(screen.getByTestId('mock-svg').props).toMatchObject({
      width: typography.headline.size,
      height: typography.headline.size,
      color: palette.navy,
    });
  });

  it('applies a custom size and color', async () => {
    await render(<Icon icon={MockSvg} size={32} color={palette.pear} />);

    expect(screen.getByTestId('mock-svg').props).toMatchObject({
      width: 32,
      height: 32,
      color: palette.pear,
    });
  });
});
