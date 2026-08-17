import { validateCatalog } from '@/data/validateCatalog';
import {
  guideWithBadParkId,
  validFigure,
  validGuide,
  validPark,
} from '../fixtures/content';

describe('validateCatalog', () => {
  it('passes a consistent catalog', () => {
    expect(validateCatalog([validPark], [validGuide], [validFigure])).toEqual([]);
  });

  it('flags a guide pointing at a nonexistent park', () => {
    const errors = validateCatalog([validPark], [guideWithBadParkId], []);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('nonexistent-park');
  });

  it('flags a figure pointing at a nonexistent park', () => {
    const figureWithBadPark = { ...validFigure, relatedParkIds: ['nonexistent-park'] };
    const errors = validateCatalog([validPark], [], [figureWithBadPark]);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('nonexistent-park');
  });

  it('returns one error per unresolved reference, not just the first', () => {
    const figureWithTwoBadParks = {
      ...validFigure,
      relatedParkIds: ['missing-a', 'missing-b'],
    };
    const errors = validateCatalog(
      [validPark],
      [guideWithBadParkId],
      [figureWithTwoBadParks],
    );
    expect(errors).toHaveLength(3);
  });
});
