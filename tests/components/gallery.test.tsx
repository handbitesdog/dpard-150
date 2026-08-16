import { render, screen } from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ComponentGallery from '../../app/dev/gallery';
import { typography } from '@/design/typography';
import type { TypographyVariant } from '@/design/typography';

jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
}));

const typographyVariants = Object.keys(typography) as TypographyVariant[];

describe('component gallery — Dynamic Type', () => {
  it.each(typographyVariants)('%s scales with the system font and is not clipped', async (variant) => {
    await render(
      <GestureHandlerRootView>
        <ComponentGallery />
      </GestureHandlerRootView>,
    );

    const node = screen.getByText(variant);

    // Font scaling is applied natively based on `allowFontScaling` (RN's
    // default); disabling it — or forcing a line cap — is how text ends up
    // clipped once the OS text size is turned up.
    expect(node.props.allowFontScaling).not.toBe(false);
    expect(node.props.numberOfLines).toBeUndefined();

    const { size, lineHeight } = typography[variant];
    expect(node).toHaveStyle({ fontSize: size, lineHeight });
  });
});
