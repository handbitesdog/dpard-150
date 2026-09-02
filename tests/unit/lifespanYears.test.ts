import { lifespanYears } from '@/lib/lifespanYears';

describe('lifespanYears', () => {
  it('reduces full dates to their years', () => {
    expect(lifespanYears('January 13, 1856 – June 6, 1938')).toBe('1856 – 1938');
  });

  it('leaves a lifespan that is already years alone', () => {
    expect(lifespanYears('1862 – 1923')).toBe('1862 – 1923');
  });

  it('normalizes a lifespan written without spaced dashes', () => {
    expect(lifespanYears('1900-1980')).toBe('1900 – 1980');
  });

  it('returns a lifespan with no four-digit year unchanged', () => {
    expect(lifespanYears('Dates unknown')).toBe('Dates unknown');
  });
});
