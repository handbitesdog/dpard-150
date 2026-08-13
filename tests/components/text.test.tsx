import { render, screen } from '@testing-library/react-native';
import { Text } from '@/components/Text';
import { palette } from '@/design/colors';
import { fontFamily, typography } from '@/design/typography';

describe('Text', () => {
  it('renders its children', async () => {
    await render(<Text>Kiest Park</Text>);

    expect(screen.getByText('Kiest Park')).toBeOnTheScreen();
  });

  it('defaults to the body variant in navy', async () => {
    await render(<Text>Kiest Park</Text>);

    expect(screen.getByText('Kiest Park')).toHaveStyle({
      fontSize: typography.body.size,
      lineHeight: typography.body.lineHeight,
      fontFamily: fontFamily.regular,
      color: palette.navy,
    });
  });

  it('applies the requested variant', async () => {
    await render(<Text variant="title1">Discover</Text>);

    expect(screen.getByText('Discover')).toHaveStyle({
      fontSize: typography.title1.size,
      lineHeight: typography.title1.lineHeight,
      fontFamily: fontFamily.bold,
    });
  });

  it('allows white for text on a navy background', async () => {
    await render(<Text color="white">Get started</Text>);

    expect(screen.getByText('Get started')).toHaveStyle({ color: palette.white });
  });

  it('forwards accessibilityRole', async () => {
    await render(<Text accessibilityRole="header">Discover</Text>);

    expect(screen.getByRole('header', { name: 'Discover' })).toBeOnTheScreen();
  });

  it('merges a custom style on top of the variant styles', async () => {
    await render(<Text style={{ textAlign: 'center' }}>Kiest Park</Text>);

    expect(screen.getByText('Kiest Park')).toHaveStyle({ textAlign: 'center' });
  });
});
