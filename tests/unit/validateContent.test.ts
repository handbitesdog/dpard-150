import { validateContent } from '../../scripts/validateContent';
import {
  guideWithBadParkId,
  parkMissingCoords,
  parkNegativeRadius,
  photoMissingAlt,
  validFigure,
  validGuide,
  validPark,
} from '../fixtures/content';

describe('validateContent', () => {
  it('passes a consistent, fully valid catalog', () => {
    expect(validateContent([validPark], [validGuide], [validFigure])).toEqual([]);
  });

  it('fails on a park missing coordinates', () => {
    const errors = validateContent([parkMissingCoords], [], []);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('fails on a park with a negative stamp radius', () => {
    const errors = validateContent([parkNegativeRadius], [], []);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('fails on a guide pointing at a nonexistent park', () => {
    const errors = validateContent([validPark], [guideWithBadParkId], []);
    expect(errors.some((error) => error.includes('nonexistent-park'))).toBe(true);
  });

  it('fails on a photo missing required alt text', () => {
    const parkWithBadPhoto = { ...validPark, photos: [photoMissingAlt] };
    const errors = validateContent([parkWithBadPhoto], [], []);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('collects errors from every invalid entry, not just the first', () => {
    const errors = validateContent(
      [parkMissingCoords, parkNegativeRadius],
      [guideWithBadParkId],
      [],
    );
    expect(errors.length).toBeGreaterThanOrEqual(3);
  });
});
