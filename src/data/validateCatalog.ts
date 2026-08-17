import type { AudioGuide, HistoricFigure, Park } from './schemas';

/**
 * Cross-reference checks that a single-entity schema can't express: every
 * guide and figure has to point at a park that actually exists in the
 * catalog. Returns an empty array when the catalog is internally consistent.
 */
export function validateCatalog(
  parks: Park[],
  guides: AudioGuide[],
  figures: HistoricFigure[],
): string[] {
  const parkIds = new Set(parks.map((park) => park.id));
  const errors: string[] = [];

  for (const guide of guides) {
    if (!parkIds.has(guide.parkId)) {
      errors.push(
        `AudioGuide "${guide.id}" references nonexistent park "${guide.parkId}"`,
      );
    }
  }

  for (const figure of figures) {
    for (const parkId of figure.relatedParkIds) {
      if (!parkIds.has(parkId)) {
        errors.push(
          `HistoricFigure "${figure.id}" references nonexistent park "${parkId}"`,
        );
      }
    }
  }

  return errors;
}
