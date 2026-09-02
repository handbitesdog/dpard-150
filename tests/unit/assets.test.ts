import { parks, figures } from '@/data';
import {
  feedPhoto,
  figurePortrait,
  parkPhoto,
  parkPhotoById,
  stampImage,
} from '@/data/assets';
import { FIGURE_PHOTOS } from '@/data/figurePhotos';
import { PARK_PHOTOS } from '@/data/parkPhotos';
import { STAMP_PHOTO_PLACEHOLDER } from '@/data/stampPhotos';

const BASE = 'https://cdn.example.com';

const park = parks[0]!;
const figure = figures[0]!;

describe('catalog image assets', () => {
  afterEach(() => {
    delete process.env.EXPO_PUBLIC_CDN_BASE_URL;
  });

  describe('with no CDN configured', () => {
    it('resolves a park photo to its bundled stand-in', () => {
      expect(parkPhoto(park)).toBe(PARK_PHOTOS[park.id]);
      expect(parkPhotoById(park.id)).toBe(PARK_PHOTOS[park.id]);
    });

    it('resolves a figure portrait to its bundled stand-in', () => {
      expect(figurePortrait(figure)).toBe(FIGURE_PHOTOS[figure.id]);
    });

    it('resolves every park stamp to the placeholder seal', () => {
      expect(stampImage(park)).toBe(STAMP_PHOTO_PLACEHOLDER);
    });

    it('has nothing to show for a feed post with a relative image path', () => {
      expect(feedPhoto('/posts/post-1.jpg')).toBeUndefined();
    });

    it('still resolves a feed post whose image URL is absolute', () => {
      expect(feedPhoto('https://images.example.org/post-1.jpg')).toEqual({
        uri: 'https://images.example.org/post-1.jpg',
        fallback: undefined,
      });
    });
  });

  describe('with a CDN configured', () => {
    beforeEach(() => {
      process.env.EXPO_PUBLIC_CDN_BASE_URL = BASE;
    });

    it('resolves a park photo to the CDN, carrying the bundled art as fallback', () => {
      expect(parkPhoto(park)).toEqual({
        uri: `${BASE}${park.photos[0]!.source}`,
        fallback: PARK_PHOTOS[park.id],
      });
    });

    it('resolves a figure portrait to the CDN', () => {
      expect(figurePortrait(figure)).toEqual({
        uri: `${BASE}${figure.portrait.source}`,
        fallback: FIGURE_PHOTOS[figure.id],
      });
    });

    it('resolves a park stamp to the CDN', () => {
      expect(stampImage(park)).toEqual({
        uri: `${BASE}${park.stamp.image}`,
        fallback: STAMP_PHOTO_PLACEHOLDER,
      });
    });
  });

  it('has nothing to show for a park id that is not in the catalog', () => {
    expect(parkPhotoById('no-such-park')).toBeUndefined();
  });
});
