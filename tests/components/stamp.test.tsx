import { render, screen } from '@testing-library/react-native';
import { Stamp } from '@/components/Stamp';

const image = { uri: 'https://example.com/fair-park-stamp.png' };
const grayImage = { uri: 'https://example.com/fair-park-stamp-gray.png' };

describe('Stamp', () => {
  it('shows the full-color image and a collected label when collected', async () => {
    await render(
      <Stamp name="Fair Park" image={image} grayImage={grayImage} collected size={120} />,
    );

    const stamp = screen.getByLabelText('Fair Park stamp, collected');
    expect(stamp).toBeOnTheScreen();
    expect(stamp.props.source).toEqual(image);
  });

  it('shows the gray image and an uncollected label when not collected', async () => {
    await render(
      <Stamp
        name="Reverchon Park"
        image={image}
        grayImage={grayImage}
        collected={false}
        size={120}
      />,
    );

    const stamp = screen.getByLabelText('Reverchon Park stamp, not yet collected');
    expect(stamp).toBeOnTheScreen();
    expect(stamp.props.source).toEqual(grayImage);
  });

  it('sizes the image from the size prop', async () => {
    await render(
      <Stamp name="Fair Park" image={image} grayImage={grayImage} collected size={120} />,
    );

    expect(screen.getByLabelText('Fair Park stamp, collected')).toHaveStyle({
      width: 120,
      height: 120,
    });
  });
});
