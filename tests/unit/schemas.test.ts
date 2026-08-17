import { audioGuideSchema, historicFigureSchema, parkSchema } from '@/data/schemas';
import {
  guideWithBadParkId,
  parkMissingCoords,
  parkNegativeRadius,
  photoMissingAlt,
  validFigure,
  validGuide,
  validPark,
} from '../fixtures/content';

describe('parkSchema', () => {
  it.each([
    ['a valid park', validPark, true],
    ['a park missing coordinates', parkMissingCoords, false],
    ['a park with a negative stamp radius', parkNegativeRadius, false],
    [
      'a park with a photo missing alt text',
      { ...validPark, photos: [photoMissingAlt] },
      false,
    ],
  ])('%s -> valid=%s', (_label, input, expectedValid) => {
    expect(parkSchema.safeParse(input).success).toBe(expectedValid);
  });
});

describe('audioGuideSchema', () => {
  it.each([
    ['a valid guide', validGuide, true],
    // parkId is just a string at the schema level — cross-reference checking
    // against the real catalog is validateCatalog's job, not the schema's.
    ['a guide whose parkId does not resolve', guideWithBadParkId, true],
    [
      'a guide with a non-positive duration',
      { ...validGuide, durationSeconds: 0 },
      false,
    ],
  ])('%s -> valid=%s', (_label, input, expectedValid) => {
    expect(audioGuideSchema.safeParse(input).success).toBe(expectedValid);
  });
});

describe('historicFigureSchema', () => {
  it.each([
    ['a valid figure', validFigure, true],
    [
      'a figure whose portrait is missing alt text',
      { ...validFigure, portrait: photoMissingAlt },
      false,
    ],
  ])('%s -> valid=%s', (_label, input, expectedValid) => {
    expect(historicFigureSchema.safeParse(input).success).toBe(expectedValid);
  });
});
