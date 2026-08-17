import { render } from '@testing-library/react-native';
import { Skeleton } from '@/components/Skeleton';
import { palette } from '@/design/colors';

describe('Skeleton', () => {
  it('renders at the given dimensions', async () => {
    const { toJSON } = await render(<Skeleton width={120} height={20} />);

    expect(toJSON()).toMatchObject({
      props: { style: expect.objectContaining({ width: 120, height: 20, backgroundColor: palette.grey }) },
    });
  });

  it('is hidden from screen readers as a decorative loading placeholder', async () => {
    const { toJSON } = await render(<Skeleton width={120} height={20} />);

    expect(toJSON()).toMatchObject({
      props: {
        accessibilityElementsHidden: true,
        importantForAccessibility: 'no-hide-descendants',
      },
    });
  });
});
