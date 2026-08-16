import { render, screen } from '@testing-library/react-native';
import { StampGrid } from '@/components/StampGrid';
import { Stamp } from '@/components/Stamp';

const image = { uri: 'https://example.com/fair-park-stamp.png' };
const grayImage = { uri: 'https://example.com/fair-park-stamp-gray.png' };

const stamps = [
  { id: 's1', name: 'Fair Park', collected: true },
  { id: 's2', name: 'Reverchon Park', collected: false },
];

describe('StampGrid', () => {
  it('renders a stamp for every item, sized to fit two per row', async () => {
    await render(
      <StampGrid
        data={stamps}
        keyExtractor={(stamp) => stamp.id}
        renderItem={(stamp, size) => (
          <Stamp
            name={stamp.name}
            image={image}
            grayImage={grayImage}
            collected={stamp.collected}
            size={size}
          />
        )}
      />,
    );

    const collected = screen.getByLabelText('Fair Park stamp, collected');
    const uncollected = screen.getByLabelText('Reverchon Park stamp, not yet collected');
    expect(collected).toBeOnTheScreen();
    expect(uncollected).toBeOnTheScreen();
    expect(collected.props.style.width).toBe(uncollected.props.style.width);
  });
});
