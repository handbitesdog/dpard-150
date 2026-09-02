import { parks, figures, merch } from '@/data';
import {
  feedPhoto,
  figurePortrait,
  merchPhoto,
  parkPhoto,
  parkPhotoById,
  stampImage,
} from '@/data/assets';
import { FIGURE_PHOTOS } from '@/data/figurePhotos';
import { MERCH_PHOTOS } from '@/data/merchPhotos';
import { PARK_PHOTOS } from '@/data/parkPhotos';
import { STAMP_PHOTO_PLACEHOLDER } from '@/data/stampPhotos';

const BASE = 'https://cdn.example.com';

const park = parks[0]!;
// Not every figure has a known portrait, and the CDN-resolution assertions
// below need one that does.
const figure = figures.find((candidate) => candidate.portrait !== undefined)!;
const merchItem = merch[0]!;

// No catalog park carries photography yet, so the CDN-resolution branch of
// `parkPhoto` needs a park with a `photos` entry built for it.
const photographedPark = {
  ...park,
  photos: [{ source: '/parks/fair-park/esplanade.jpg', alt: 'The Fair Park esplanade' }],
};

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

    it('resolves a merch photo to its bundled stand-in', () => {
      expect(merchPhoto(merchItem)).toBe(MERCH_PHOTOS[merchItem.id]);
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
      expect(parkPhoto(photographedPark)).toEqual({
        uri: `${BASE}${photographedPark.photos[0]!.source}`,
        fallback: PARK_PHOTOS[photographedPark.id],
      });
    });

    it('resolves a figure portrait to the CDN', () => {
      expect(figurePortrait(figure)).toEqual({
        uri: `${BASE}${figure.portrait!.source}`,
        fallback: FIGURE_PHOTOS[figure.id],
      });
    });

    it('resolves a merch photo to the CDN', () => {
      expect(merchPhoto(merchItem)).toEqual({
        uri: `${BASE}${merchItem.photo.source}`,
        fallback: MERCH_PHOTOS[merchItem.id],
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
