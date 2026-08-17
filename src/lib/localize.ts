export type Locale = 'en' | 'es';

/**
 * A value carried in every supported locale. `en` is required so content is
 * always renderable; `es` is optional because v1 doesn't require translated
 * content to be authored yet, only the shape to support it later.
 */
export type Localized<T = string> = { en: T; es?: T };

/** The single place that picks a locale out of a `Localized` value, so components never branch on it. */
export function localize<T>(value: Localized<T>, locale: Locale): T {
  if (locale === 'es' && value.es !== undefined) {
    return value.es;
  }
  return value.en;
}
