import { figures, guides, parks } from '@/data';

describe('bundled content catalog', () => {
  it('parses and cross-validates without throwing', () => {
    expect(parks.length).toBeGreaterThan(0);
    expect(guides.length).toBeGreaterThan(0);
    expect(figures.length).toBeGreaterThan(0);
  });

  it('every guide belongs to a park in the catalog', () => {
    const parkIds = new Set(parks.map((park) => park.id));
    for (const guide of guides) {
      expect(parkIds.has(guide.parkId)).toBe(true);
    }
  });
});
