import { localize } from '@/lib/localize';

describe('localize', () => {
  it('returns the Spanish value when present and locale is es', () => {
    expect(localize({ en: 'Park', es: 'Parque' }, 'es')).toBe('Parque');
  });

  it('falls back to English when locale is es but es is absent', () => {
    expect(localize({ en: 'Park' }, 'es')).toBe('Park');
  });

  it('returns the English value when locale is en, even if es is present', () => {
    expect(localize({ en: 'Park', es: 'Parque' }, 'en')).toBe('Park');
  });
});
