/** Fixture content for schema and catalog-validation tests. Not real park data. */

export const validPhoto = {
  source: '/parks/test-park/1.jpg',
  alt: 'A wide lawn with a fountain at the center of Test Park',
  credit: 'Test Photographer',
};

export const validPark = {
  id: 'test-park',
  name: 'Test Park',
  neighborhood: 'Test Neighborhood',
  description: { en: 'A park used for tests.' },
  phone: '(555) 555-0100',
  website: 'https://example.com/test-park',
  streetAddress: '123 Test Street, Dallas, TX 75001',
  photos: [validPhoto],
  location: { latitude: 32.78, longitude: -96.8 },
  stampRadiusMeters: 100,
  stamp: { image: '/stamps/test-park.png', label: 'Test Stamp' },
};

export const validGuide = {
  id: 'test-guide',
  parkId: 'test-park',
  title: 'Test Guide',
  narrator: 'Test Narrator',
  durationSeconds: 300,
  audioPath: { en: '/guides/test-guide/en.m4a' },
  transcript: { en: 'This is a test transcript.' },
};

export const validFigure = {
  id: 'test-figure',
  name: 'Test Figure',
  lifespan: '1900-1980',
  summary: { en: 'A figure used for tests.' },
  portrait: validPhoto,
  biography: [
    {
      heading: { en: 'Early Life' },
      body: { en: 'A figure used for tests.' },
    },
  ],
  relatedParkIds: ['test-park'],
};

/** `location` is missing entirely — schema validation must fail. */
export const parkMissingCoords = {
  ...validPark,
  location: undefined,
};

/** `stampRadiusMeters` is negative — schema validation must fail. */
export const parkNegativeRadius = {
  ...validPark,
  stampRadiusMeters: -50,
};

/** Points at a park that doesn't exist in the catalog — `validateCatalog` must flag it. */
export const guideWithBadParkId = {
  ...validGuide,
  id: 'guide-with-bad-park',
  parkId: 'nonexistent-park',
};

/** Missing the required accessibility `alt` text — schema validation must fail. */
export const photoMissingAlt = {
  source: '/parks/test-park/2.jpg',
  credit: 'Test Photographer',
};
