/**
 * Reduces a figure's lifespan to its years, for places too narrow to carry the
 * department's full dates — "January 13, 1856 – June 6, 1938" becomes
 * "1856 – 1938". A lifespan with no four-digit year is returned unchanged.
 */
export function lifespanYears(lifespan: string): string {
  const years = lifespan.match(/\d{4}/g);
  return years === null ? lifespan : years.join(' – ');
}
