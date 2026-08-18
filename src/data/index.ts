import type { z } from 'zod';
import figuresData from './figures.json';
import guidesData from './guides.json';
import merchData from './merch.json';
import parksData from './parks.json';
import { audioGuideSchema, historicFigureSchema, merchItemSchema, parkSchema } from './schemas';
import type { AudioGuide, HistoricFigure, MerchItem, Park } from './schemas';
import { validateCatalog } from './validateCatalog';

function parseAll<T>(schema: z.ZodType<T>, raw: unknown[], label: string): T[] {
  return raw.map((entry, index) => {
    const result = schema.safeParse(entry);
    if (!result.success) {
      throw new Error(`Invalid ${label} at index ${index}: ${result.error.message}`);
    }
    return result.data;
  });
}

/**
 * Parsed and cross-reference-validated at import time, so a malformed
 * bundled catalog fails loudly the moment anything imports this module
 * rather than surfacing as a runtime crash deep in a screen.
 */
export const parks: Park[] = parseAll(parkSchema, parksData, 'park');
export const guides: AudioGuide[] = parseAll(audioGuideSchema, guidesData, 'guide');
export const figures: HistoricFigure[] = parseAll(
  historicFigureSchema,
  figuresData,
  'historic figure',
);
export const merch: MerchItem[] = parseAll(merchItemSchema, merchData, 'merch item');

const catalogErrors = validateCatalog(parks, guides, figures);
if (catalogErrors.length > 0) {
  throw new Error(`Content catalog failed validation:\n${catalogErrors.join('\n')}`);
}
