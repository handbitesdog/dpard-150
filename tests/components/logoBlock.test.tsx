import { render, screen } from '@testing-library/react-native';
import { LogoBlock } from '@/components/LogoBlock';

describe('LogoBlock', () => {
  it('exposes both logos as a single accessible label by default', async () => {
    await render(<LogoBlock />);

    expect(
      screen.getByLabelText(
        'Dallas Park and Recreation 150th anniversary logo, Dallas Park and Recreation logo',
      ),
    ).toBeOnTheScreen();
  });

  it('exposes only the anniversary logo in the anniversary variant', async () => {
    await render(<LogoBlock variant="anniversary" />);

    expect(
      screen.getByLabelText('Dallas Park and Recreation 150th anniversary logo'),
    ).toBeOnTheScreen();
    expect(
      screen.queryByLabelText(
        'Dallas Park and Recreation 150th anniversary logo, Dallas Park and Recreation logo',
      ),
    ).not.toBeOnTheScreen();
  });
});
